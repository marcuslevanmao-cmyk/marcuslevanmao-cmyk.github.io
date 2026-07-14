// history.js — Complete Version History Engine with localStorage persistence

// ============================================================
// 1. LOCAL STORAGE HELPERS
// ============================================================

// Changed key to 'doc_history_v2' to force a clean slate and avoid white-page errors
const STORAGE_KEY = 'doc_history_v2';

function loadHistoryFromStorage() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            // Convert date strings back to Date objects
            parsed.forEach(v => {
                v.dateObj = new Date(v.dateObj);
            });
            return parsed;
        } catch (e) {
            console.warn('Failed to parse stored history, using default.');
        }
    }
    return null;
}

function saveHistoryToStorage(history) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
        console.warn('Failed to save history to localStorage');
    }
}

// Load history or use a clean slate array
let documentHistory = loadHistoryFromStorage() || [];
// Save the loaded/default history to storage so it's persisted
saveHistoryToStorage(documentHistory);

// ============================================================
// 2. HISTORY ENGINE
// ============================================================

const HistoryEngine = (() => {
    let _history = documentHistory;
    let _selectedPreviewIndex = 0;
    let _snapshotTimeout = null;
    let _nextId = _history.length > 0 ? Math.max(..._history.map(v => v.id)) + 1 : 1;

    function _getCurrentTabsState() {
        const tabs = EditorEngine.getTabs();
        return tabs.map(tab => ({
            id: tab.id,
            title: tab.title,
            content: tab.htmlContent
        }));
    }

    function _createSnapshot(description) {
        const now = new Date();
        const hours = now.getHours();
        const mins = now.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'p.m.' : 'a.m.';
        const displayHour = hours % 12 || 12;
        const displayDate = `${now.toLocaleString('en', { month: 'short' })} ${now.getDate()}, ${displayHour}:${mins} ${ampm}`;
        const dayGroup = now.toLocaleString('en', { weekday: 'long' });

        return {
            id: _nextId++,
            dateObj: now,
            displayDate: displayDate,
            dayGroup: dayGroup,
            author: "You",
            authorColor: "#4285f4",
            description: description || "Auto-saved snapshot", // Removed the "Edited: " prefix
            tabsState: _getCurrentTabsState()
        };
    }

    function _saveSnapshot(description) {
        const snapshot = _createSnapshot(description);
        _history.unshift(snapshot);
        if (_history.length > 50) _history.pop();
        saveHistoryToStorage(_history);   // persist
        renderHistorySidebar();
        return snapshot;
    }

    return {
        captureSnapshot(description) {
            return _saveSnapshot(description);
        },
        scheduleSnapshot(description) {
            clearTimeout(_snapshotTimeout);
            _snapshotTimeout = setTimeout(() => {
                _saveSnapshot(description || "Auto-saved");
            }, 1500);
        },
        previewSnapshot(index) {
            _selectedPreviewIndex = index;
            const version = _history[index];
            if (!version) return;
            previewVersion(version.id);
        },
        getSelectedPreviewIndex() {
            return _selectedPreviewIndex;
        },
        rollbackTo(index) {
            const version = _history[index];
            if (!version) return;
            const tabsState = version.tabsState;
            if (!tabsState || tabsState.length === 0) return;

            const liveTabs = EditorEngine.getTabs();
            liveTabs.length = 0;
            tabsState.forEach((tabState, idx) => {
                const newTab = {
                    id: tabState.id || `tab_${Date.now()}_${idx}`,
                    title: tabState.title || `Tab ${idx + 1}`,
                    htmlContent: tabState.content || '<div></div>'
                };
                liveTabs.push(newTab);
            });

            EditorEngine.renderTabsSidebar();
            EditorEngine.loadActiveTabContent();

            document.getElementById('version-history-view').hidden = true;
            _saveSnapshot(`Restored to version from ${version.displayDate}`);
        },
        getHistory() {
            return _history;
        }
    };
})();

// ============================================================
// 3. RENDER FUNCTIONS
// ============================================================

let currentlyPreviewingVersionId = null;
let currentlyPreviewingTabId = 'tab1';

function renderHistorySidebar() {
    const listContainer = document.getElementById('version-list');
    if (!listContainer) return;
    listContainer.innerHTML = '';

    let currentDayGroup = '';

    documentHistory.forEach((version, index) => {
        if (version.dayGroup !== currentDayGroup) {
            currentDayGroup = version.dayGroup;
            const dayHeader = document.createElement('div');
            dayHeader.className = 'vh-day-group';
            dayHeader.textContent = currentDayGroup;
            listContainer.appendChild(dayHeader);
        }

        const isCurrent = index === 0;
        const itemHtml = `
            <div class="vh-item ${isCurrent ? 'active' : ''}" data-id="${version.id}">
                <div class="vh-item-arrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg></div>
                <div class="vh-item-content">
                    <div class="vh-item-time">${version.displayDate}</div>
                    <div class="vh-item-subtitle" style="font-style: italic; margin-bottom: 4px;">${version.description}</div>
                    <div class="vh-item-author-row">
                        <div class="vh-author-dot" style="background-color: ${version.authorColor};"></div>
                        <span style="color: ${version.authorColor}; font-weight: 500;">${version.author}</span>
                    </div>
                </div>
            </div>
        `;

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = itemHtml;
        const itemEl = tempDiv.firstElementChild;
        itemEl.addEventListener('click', () => {
            document.querySelectorAll('.vh-item').forEach(i => i.classList.remove('active'));
            itemEl.classList.add('active');
            previewVersion(version.id);
        });
        listContainer.appendChild(itemEl);
    });
}

function previewVersion(versionId) {
    const version = documentHistory.find(v => v.id === versionId);
    if (!version) return;

    currentlyPreviewingVersionId = version.id;
    document.getElementById('vh-top-date-title').textContent = version.displayDate;

    const tabsContainer = document.getElementById('vh-tabs-container');
    if (!tabsContainer) return;
    tabsContainer.innerHTML = '';

    if (!version.tabsState || version.tabsState.length === 0) {
        tabsContainer.innerHTML = '<div style="padding:16px; color:#5f6368;">No tabs</div>';
        return;
    }

    const tabIds = version.tabsState.map(t => t.id);
    if (!tabIds.includes(currentlyPreviewingTabId)) {
        currentlyPreviewingTabId = version.tabsState[0].id;
    }

    version.tabsState.forEach(tab => {
        const isActive = tab.id === currentlyPreviewingTabId;
        const row = document.createElement('div');
        row.className = `tab-item-row ${isActive ? 'active' : ''}`;
        row.style.cursor = 'pointer';
        row.innerHTML = `
            <input type="text" class="tab-name-input" value="${tab.title}" readonly
                   style="background: ${isActive ? '#ffffff' : 'transparent'};
                          border-color: ${isActive ? 'var(--border-strong)' : 'transparent'};
                          font-weight: ${isActive ? '500' : 'normal'};
                          color: ${isActive ? 'var(--accent-blue)' : 'var(--text-primary)'};
                          width: 80%; outline: none; border-radius: 3px; padding: 2px 4px; font-size: inherit; font-family: inherit;">
        `;
        row.addEventListener('click', () => {
            currentlyPreviewingTabId = tab.id;
            previewVersion(versionId);
        });
        tabsContainer.appendChild(row);
    });

    const activeTab = version.tabsState.find(t => t.id === currentlyPreviewingTabId) || version.tabsState[0];
    const canvas = document.getElementById('vh-canvas');
    if (canvas) {
        let html = activeTab.content;
        if (version.author === 'You') {
            html = `<div class="vh-edit-you"><span class="vh-edit-label">You</span>${html}</div>`;
        }
        canvas.innerHTML = html;
    }

    const totalSpan = document.getElementById('vh-total-edits');
    if (totalSpan) totalSpan.textContent = `Total: ${documentHistory.length} edits`;
}

// Public save function (used by editor)
function saveVersionToHistory(description) {
    return HistoryEngine.captureSnapshot(description);
}

// Restore from saved tabs (used by history restore)
window.restoreFullDocumentState = function(savedTabsState) {
    const liveTabs = EditorEngine.getTabs();
    liveTabs.length = 0;
    savedTabsState.forEach((tabState, idx) => {
        const newTab = {
            id: tabState.id || `tab_${Date.now()}_${idx}`,
            title: tabState.title || `Tab ${idx + 1}`,
            htmlContent: tabState.content || '<div></div>'
        };
        liveTabs.push(newTab);
    });
    EditorEngine.renderTabsSidebar();
    EditorEngine.loadActiveTabContent();
};

// ============================================================
// 4. INITIALIZATION
// ============================================================

function initHistory() {
    renderHistorySidebar();
    if (documentHistory.length > 0) {
        previewVersion(documentHistory[0].id);
        const latest = documentHistory[0];
        if (latest && latest.tabsState) {
            window.restoreFullDocumentState(latest.tabsState);
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHistory);
} else {
    initHistory();
}
