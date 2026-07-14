// history.js — Complete Version History Engine

// ============================================================
// 1. CONTENT DEFINITIONS (used by the history data)
// ============================================================

const outlineContent = `<h2>Persuasive Essay Outline</h2><ul><li>Intro</li><li>Body 1</li><li>Conclusion</li></ul>`;
const introContent = `<h2>The Wasted Potential of Religion</h2><p>Across history, civilisations around the world have independantly developed religious traditions, suggesting that these beliefs address something fundamental about human nature.</p>`;
const bodyContent = `<h2>The Wasted Potential of Religion</h2><p>Across history, civilisations around the world have independantly developed religious traditions...</p><p>Religion has long served as one of humanity's most influential systems for moral education.</p>`;
const finalContent = `<h2>The Wasted Potential of Religion</h2><p>Across history, civilizations around the world have independently developed religious traditions, suggesting that these beliefs address something fundamental about human nature, our need for belonging, our search for meaning, and our desire for ethical guidance. Religion has been one of humanity's most effective systems for organizing communities and transmitting values, not because of the certainty of its supernatural claims, but because of its unparalleled ability to unite people and inspire moral action. However, religion's greatest strength, its ability to create cohesive communities, can become its greatest weakness when it discourages curiosity, critical thought, and the continual betterment of human life. The measure of a religion should not be the certainty of its supernatural claims but the quality of the human beings it helps create.</p><br><p>Religion has long served as one of humanity's most influential systems for moral education. Christianity, for example, spread complex ethical teachings through parables...</p>`;
const brainstormContent = `<h2>Brainstorming Notes</h2><ul><li><b>Theme:</b> Utility vs Truth</li><li><b>Key thinkers:</b> Durkheim, Haidt</li></ul>`;

// ============================================================
// 2. FULL HISTORY — all Marcus's edits (no "You" yet)
// ============================================================

const documentHistory = [
    {
        id: 8,
        dateObj: new Date('2026-05-15T16:00:00'),
        displayDate: "May 15, 4:00 p.m.",
        dayGroup: "Friday",
        author: "Marcus Le Van Mao",
        authorColor: "#0f9d58",
        description: "Edited: Format modifier applied",
        tabsState: [
            { id: 'tab1', title: 'PERSUASIVE ESSAY', content: finalContent },
            { id: 'tab2', title: 'Brainstorm', content: brainstormContent }
        ]
    },
    {
        id: 7,
        dateObj: new Date('2026-05-02T15:30:00'),
        displayDate: "May 2, 3:30 p.m.",
        dayGroup: "Saturday",
        author: "Marcus Le Van Mao",
        authorColor: "#0f9d58",
        description: "Edited: Grammar and spelling fixes",
        tabsState: [
            { id: 'tab1', title: 'PERSUASIVE ESSAY', content: finalContent.replace("civilizations", "civilisations") },
            { id: 'tab2', title: 'Brainstorm', content: brainstormContent }
        ]
    },
    {
        id: 6,
        dateObj: new Date('2026-05-01T14:30:00'),
        displayDate: "May 1, 2:30 p.m.",
        dayGroup: "Friday",
        author: "Marcus Le Van Mao",
        authorColor: "#0f9d58",
        description: "Edited: Expanded body with examples",
        tabsState: [
            { id: 'tab1', title: 'PERSUASIVE ESSAY', content: bodyContent + "<p>Studies show religious communities report stronger social support...</p>" },
            { id: 'tab2', title: 'Brainstorm', content: brainstormContent }
        ]
    },
    {
        id: 5,
        dateObj: new Date('2026-05-01T11:45:00'),
        displayDate: "May 1, 11:45 a.m.",
        dayGroup: "Friday",
        author: "Marcus Le Van Mao",
        authorColor: "#0f9d58",
        description: "Edited: Drafted final paragraphs",
        tabsState: [
            { id: 'tab1', title: 'PERSUASIVE ESSAY', content: bodyContent + "<p>...and thus religion remains vital.</p>" },
            { id: 'tab2', title: 'Brainstorm', content: brainstormContent }
        ]
    },
    {
        id: 4,
        dateObj: new Date('2026-05-01T10:30:00'),
        displayDate: "May 1, 10:30 a.m.",
        dayGroup: "Friday",
        author: "Marcus Le Van Mao",
        authorColor: "#0f9d58",
        description: "Edited: Drafted body paragraphs",
        tabsState: [
            { id: 'tab1', title: 'PERSUASIVE ESSAY', content: bodyContent },
            { id: 'tab2', title: 'Brainstorm', content: brainstormContent }
        ]
    },
    {
        id: 3,
        dateObj: new Date('2026-05-01T09:15:00'),
        displayDate: "May 1, 9:15 a.m.",
        dayGroup: "Friday",
        author: "Marcus Le Van Mao",
        authorColor: "#0f9d58",
        description: "Edited: Drafted Introduction",
        tabsState: [
            { id: 'tab1', title: 'PERSUASIVE ESSAY', content: introContent },
            { id: 'tab2', title: 'Brainstorm', content: brainstormContent }
        ]
    },
    {
        id: 2,
        dateObj: new Date('2026-04-13T14:05:00'),
        displayDate: "Apr 13, 2:05 p.m.",
        dayGroup: "Monday",
        author: "Marcus Le Van Mao",
        authorColor: "#0f9d58",
        description: "Edited: Added Brainstorm tab",
        tabsState: [
            { id: 'tab1', title: 'PERSUASIVE ESSAY', content: outlineContent },
            { id: 'tab2', title: 'Brainstorm', content: brainstormContent }
        ]
    },
    {
        id: 1,
        dateObj: new Date('2026-04-05T10:45:00'),
        displayDate: "Apr 5, 10:45 a.m.",
        dayGroup: "Sunday",
        author: "Marcus Le Van Mao",
        authorColor: "#0f9d58",
        description: "Edited: Drafted essay outline",
        tabsState: [
            { id: 'tab1', title: 'PERSUASIVE ESSAY', content: outlineContent }
        ]
    }
];

// ============================================================
// 3. HISTORY ENGINE — full implementation
// ============================================================

const HistoryEngine = (() => {
    let _history = documentHistory;
    let _selectedPreviewIndex = 0;
    let _snapshotTimeout = null;
    let _nextId = 10;

    // Get current editor tabs as a plain object for snapshot
    function _getCurrentTabsState() {
        const tabs = EditorEngine.getTabs();
        return tabs.map(tab => ({
            id: tab.id,
            title: tab.title,
            content: tab.htmlContent
        }));
    }

    // Create a snapshot object from current state
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
            description: description || "Edited: Auto-saved snapshot",
            tabsState: _getCurrentTabsState()
        };
    }

    // Save a snapshot (add to history, update UI)
    function _saveSnapshot(description) {
        const snapshot = _createSnapshot(description);
        _history.unshift(snapshot);
        if (_history.length > 50) _history.pop();
        renderHistorySidebar();
        return snapshot;
    }

    // Public API
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
// 4. RENDER FUNCTIONS (UI)
// ============================================================

let currentlyPreviewingVersionId = null;
let currentlyPreviewingTabId = 'tab1';

// Render the version history sidebar (right panel)
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

// Preview a specific version by ID (show in the history preview canvas)
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

    // Ensure currentlyPreviewingTabId is valid
    const tabIds = version.tabsState.map(t => t.id);
    if (!tabIds.includes(currentlyPreviewingTabId)) {
        currentlyPreviewingTabId = version.tabsState[0].id;
    }

    // Render each tab in the history preview sidebar
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

    // Display the active tab's content in the preview canvas
    const activeTab = version.tabsState.find(t => t.id === currentlyPreviewingTabId) || version.tabsState[0];
    const canvas = document.getElementById('vh-canvas');
    if (canvas) {
        // If the author is "You", wrap content with highlight; otherwise plain
        let html = activeTab.content;
        if (version.author === 'You') {
            // Add a subtle highlight label (optional)
            html = `<div class="vh-edit-you"><span class="vh-edit-label">You</span>${html}</div>`;
        }
        canvas.innerHTML = html;
    }

    // Update total edits count
    const totalSpan = document.getElementById('vh-total-edits');
    if (totalSpan) totalSpan.textContent = `Total: ${documentHistory.length} edits`;
}

// Save a version (called from editor.js)
function saveVersionToHistory(description) {
    return HistoryEngine.captureSnapshot(description);
}

// Restore full document state (used by history restore)
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

// Initial render on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        renderHistorySidebar();
        if (documentHistory.length > 0) previewVersion(documentHistory[0].id);
    });
} else {
    renderHistorySidebar();
    if (documentHistory.length > 0) previewVersion(documentHistory[0].id);
}
