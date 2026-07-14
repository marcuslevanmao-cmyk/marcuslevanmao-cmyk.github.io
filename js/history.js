// history.js — Complete Version History Engine with Full Workspace Snapshots

// ---- Full Essay ----
const fullEssayContent = `<div style="font-family: 'Times New Roman', Times, serif; font-size: 16px; line-height: 1.6;">
  <p>Across history, civilizations around the world have independently developed religious traditions, suggesting that these beliefs address something fundamental about human nature, our need for belonging, our search for meaning, and our desire for ethical guidance. Religion has been one of humanity's most effective systems for organizing communities and transmitting values, not because of the certainty of its supernatural claims, but because of its unparalleled ability to unite people and inspire moral action. However, religion's greatest strength, its ability to create cohesive communities, can become its greatest weakness when it discourages curiosity, critical thought, and the continual betterment of human life. The measure of a religion should not be the certainty of its supernatural claims but the quality of the human beings it helps create.</p>
</div>`;

// ---- Full Brainstorm ----
const fullBrainstormContent = `<div style="font-family: Arial, sans-serif; line-height: 1.5; font-size: 14px; color: #202124;">
  <h3 style="margin-top: 0;">The Wasted Potential of Religion</h3>
  <p><strong>Brainstorm Document</strong></p>
  <h4>Main Question</h4>
  <p>What is religion supposed to accomplish?</p>
  <ul>
    <li>Help people become better human beings.</li>
    <li>Unite communities.</li>
    <li>Give people purpose.</li>
  </ul>
</div>`;

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
            { id: 'tab_1', title: 'The Utility of Gods', content: fullEssayContent },
            { id: 'tab_2', title: 'Brainstorm', content: fullBrainstormContent }
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
            { id: 'tab_1', title: 'The Utility of Gods', content: fullEssayContent },
            { id: 'tab_2', title: 'Brainstorm', content: fullBrainstormContent }
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
            { id: 'tab_1', title: 'The Utility of Gods', content: fullEssayContent },
            { id: 'tab_2', title: 'Brainstorm', content: fullBrainstormContent }
        ]
    }
];

const STORAGE_KEY = 'doc_history_v5';

function loadHistoryFromStorage() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
                parsed.forEach(v => { v.dateObj = new Date(v.dateObj); });
                return parsed;
            }
        } catch (e) {
            console.warn('Failed to parse stored history.');
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

let currentHistory = loadHistoryFromStorage() || documentHistory.slice();
saveHistoryToStorage(currentHistory);

let currentlyPreviewingVersionId = currentHistory[0]?.id || 8;
let currentlyPreviewingTabId = 'tab_1';
let selectedPreviewIndex = 0;

// ============================================================
// HISTORY ENGINE NAMESPACE
// ============================================================
const HistoryEngine = (() => {
    let _history = currentHistory;
    let _snapshotTimeout = null;

    function _getCurrentTabsState() {
        // Safe check: If EditorEngine or getTabs doesn't exist yet, return our default history state
        if (typeof EditorEngine === 'undefined' || typeof EditorEngine.getTabs !== 'function') {
            return _history[0]?.tabsState || [];
        }
        const tabs = EditorEngine.getTabs();
        if (!tabs || !Array.isArray(tabs)) {
            return _history[0]?.tabsState || [];
        }
        return tabs.map(tab => ({
            id: tab.id,
            title: tab.title,
            content: tab.htmlContent || ""
        }));
    }

    function _saveSnapshot(description) {
        const now = new Date();
        const displayDate = `${now.toLocaleString('en', { month: 'short' })} ${now.getDate()}, ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        const snapshot = {
            id: Date.now(),
            dateObj: now,
            displayDate: displayDate,
            dayGroup: now.toLocaleString('en', { weekday: 'long' }),
            author: "Marcus Le Van Mao",
            authorColor: "#0f9d58",
            description: description || "Edited",
            tabsState: _getCurrentTabsState()
        };

        _history.unshift(snapshot);
        saveHistoryToStorage(_history);
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
                _saveSnapshot(description);
            }, 1500);
        },
        previewSnapshot(index) {
            selectedPreviewIndex = index;
            const version = _history[index];
            if (version) {
                previewVersion(version.id);
            }
        },
        getSelectedPreviewIndex() {
            return selectedPreviewIndex;
        },
        rollbackTo(index) {
            const version = _history[index];
            if (version && version.tabsState) {
                window.restoreFullDocumentState(version.tabsState);
                _saveSnapshot(`Restored to version from ${version.displayDate}`);
            }
        }
    };
})();

// ============================================================
// RENDER SIDEBAR AND PREVIEWS
// ============================================================
function previewVersion(versionId) {
    const version = currentHistory.find(v => v.id === versionId);
    if (!version) return;

    currentlyPreviewingVersionId = version.id;
    const dateTitle = document.getElementById('vh-top-date-title');
    if (dateTitle) dateTitle.textContent = version.displayDate;

    const tabsContainer = document.getElementById('vh-tabs-container');
    if (tabsContainer) {
        tabsContainer.innerHTML = '';
        version.tabsState.forEach(tab => {
            const isActive = tab.id === currentlyPreviewingTabId;
            const row = document.createElement('div');
            row.style.padding = '8px 12px';
            row.style.margin = '2px 0';
            row.style.borderRadius = '4px';
            row.style.background = isActive ? '#e8f0fe' : 'transparent';
            row.style.color = isActive ? '#1a73e8' : '#202124';
            row.style.fontWeight = isActive ? '500' : 'normal';
            row.style.cursor = 'pointer';
            row.textContent = tab.title;
            
            row.addEventListener('click', () => {
                currentlyPreviewingTabId = tab.id;
                previewVersion(versionId);
            });
            tabsContainer.appendChild(row);
        });
    }

    const activeTab = version.tabsState.find(t => t.id === currentlyPreviewingTabId) || version.tabsState[0];
    const canvas = document.getElementById('vh-canvas');
    if (canvas && activeTab) {
        canvas.innerHTML = activeTab.content;
    }
}

function renderHistorySidebar() {
    const sidebar = document.getElementById('version-list');
    if (!sidebar) return;

    sidebar.innerHTML = '';
    currentHistory.forEach((version, index) => {
        const item = document.createElement('div');
        item.style.padding = '12px';
        item.style.borderBottom = '1px solid #e0e0e0';
        item.style.cursor = 'pointer';
        item.style.background = (selectedPreviewIndex === index) ? '#f1f3f4' : 'transparent';
        
        item.innerHTML = `
            <div style="font-weight: 500; font-size: 13px; color: #202124;">${version.displayDate}</div>
            <div style="font-size: 12px; color: #5f6368; margin-top: 4px; display: flex; align-items: center; gap: 6px;">
                <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:${version.authorColor};"></span>
                ${version.author}
            </div>
            <div style="font-size: 11px; color: #80868b; margin-top: 2px;">${version.description}</div>
        `;

        item.addEventListener('click', () => {
            selectedPreviewIndex = index;
            previewVersion(version.id);
            renderHistorySidebar();
        });

        sidebar.appendChild(item);
    });
}

window.restoreFullDocumentState = function(tabsState) {
    if (typeof EditorEngine !== 'undefined') {
        tabsState.forEach(savedTab => {
            const liveTab = EditorEngine.getTabs().find(t => t.id === savedTab.id);
            if (liveTab) {
                liveTab.htmlContent = savedTab.content;
                liveTab.title = savedTab.title;
            }
        });
        EditorEngine.loadActiveTabContent();
    }
};

function initHistory() {
    renderHistorySidebar();
    if (currentHistory.length > 0) {
        previewVersion(currentHistory[0].id);
    }
}

// Wait for entire window (including editor.js) to load fully before running setup
window.addEventListener('load', initHistory);
