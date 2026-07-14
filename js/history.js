// history.js — Complete Version History Engine with Full Workspace Snapshots

// ============================================================
// 1. HISTORY DATA STORE
// ============================================================

const documentHistory = [
    {
        id: 9,
        dateObj: new Date(),
        displayDate: "July 14, 3:00 p.m.",
        dayGroup: "Tuesday",
        author: "You",
        authorColor: "#4285f4",
        description: "Edited: Final review and minor polishes",
        tabsState: [
            { id: 'tab1', title: 'PERSUASIVE ESSAY', content: finalContent },
            { id: 'tab2', title: 'Brainstorm', content: brainstormContent }
        ]
    },
    {
        id: 8,
        dateObj: new Date('2026-05-15T16:00:00'),
        displayDate: "May 15, 4:00 p.m.",
        dayGroup: "Friday",
        author: "Marcus Le Van Mao élève",
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
        author: "Marcus Le Van Mao élève",
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
        author: "Marcus Le Van Mao élève",
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
        author: "Marcus Le Van Mao élève",
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
        author: "Marcus Le Van Mao élève",
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
        author: "Marcus Le Van Mao élève",
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
        author: "Marcus Le Van Mao élève",
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
        author: "Marcus Le Van Mao élève",
        authorColor: "#0f9d58",
        description: "Edited: Drafted essay outline",
        tabsState: [
            { id: 'tab1', title: 'PERSUASIVE ESSAY', content: outlineContent }
        ]
    }
];

// ============================================================
// 2. CONTENT DEFINITIONS (used by the history data)
// ============================================================

const outlineContent = `<h2>Persuasive Essay Outline</h2><ul><li>Intro</li><li>Body 1</li><li>Conclusion</li></ul>`;
const introContent = `<h2>The Wasted Potential of Religion</h2><p>Across history, civilisations around the world have independantly developed religious traditions, suggesting that these beliefs address something fundamental about human nature.</p>`;
const bodyContent = `<h2>The Wasted Potential of Religion</h2><p>Across history, civilisations around the world have independantly developed religious traditions...</p><p>Religion has long served as one of humanity's most influential systems for moral education.</p>`;
const finalContent = `<h2>The Wasted Potential of Religion</h2><p>Across history, civilizations around the world have independently developed religious traditions, suggesting that these beliefs address something fundamental about human nature, our need for belonging, our search for meaning, and our desire for ethical guidance. Religion has been one of humanity's most effective systems for organizing communities and transmitting values, not because of the certainty of its supernatural claims, but because of its unparalleled ability to unite people and inspire moral action. However, religion's greatest strength, its ability to create cohesive communities, can become its greatest weakness when it discourages curiosity, critical thought, and the continual betterment of human life. The measure of a religion should not be the certainty of its supernatural claims but the quality of the human beings it helps create.</p><br><p>Religion has long served as one of humanity's most influential systems for moral education. Christianity, for example, spread complex ethical teachings through parables...</p>`;
const brainstormContent = `<h2>Brainstorming Notes</h2><ul><li><b>Theme:</b> Utility vs Truth</li><li><b>Key thinkers:</b> Durkheim, Haidt</li></ul>`;

// ============================================================
// 3. HISTORY ENGINE — THE MAIN API
// ============================================================

const HistoryEngine = (() => {
    // --- Private state ---
    let _selectedPreviewIndex = 0;          // Which version is currently previewed
    let _snapshotTimeout = null;            // Debounce timer for auto-save
    let _history = documentHistory;         // The full history array
    let _currentIdCounter = 10;             // Next ID to assign

    // --- Private helpers ---

    /** Get the current editor tabs state (from EditorEngine) */
    function _getCurrentTabsState() {
        const tabs = EditorEngine.getTabs();
        return tabs.map(tab => ({
            id: tab.id,
            title: tab.title,
            content: tab.htmlContent
        }));
    }

    /** Create a new history entry from current editor state */
    function _createSnapshot(description) {
        const now = new Date();
        const hours = now.getHours();
        const mins = now.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'p.m.' : 'a.m.';
        const displayHour = hours % 12 || 12;
        const displayDate = `${now.toLocaleString('en', { month: 'short' })} ${now.getDate()}, ${displayHour}:${mins} ${ampm}`;
        const dayGroup = now.toLocaleString('en', { weekday: 'long' });

        return {
            id: _currentIdCounter++,
            dateObj: now,
            displayDate: displayDate,
            dayGroup: dayGroup,
            author: "You",
            authorColor: "#4285f4",
            description: description || "Edited: Auto-saved snapshot",
            tabsState: _getCurrentTabsState()
        };
    }

    /** Save a snapshot to history (public API) */
    function _saveSnapshot(description) {
        const snapshot = _createSnapshot(description || "Edited: Manual save");
        _history.unshift(snapshot);
        // Keep history manageable (max 50 entries)
        if (_history.length > 50) _history.pop();
        renderHistorySidebar();
        return snapshot;
    }

    // --- Public API ---

    return {
        /** Capture a snapshot immediately with a description */
        captureSnapshot(description) {
            return _saveSnapshot(description);
        },

        /** Schedule a debounced snapshot (for auto-save) */
        scheduleSnapshot(description) {
            clearTimeout(_snapshotTimeout);
            _snapshotTimeout = setTimeout(() => {
                _saveSnapshot(description || "Auto-saved");
            }, 1500);
        },

        /** Preview a specific version by index (0 = most recent) */
        previewSnapshot(index) {
            _selectedPreviewIndex = index;
            const version = _history[index];
            if (!version) return;
            previewVersion(version.id);
        },

        /** Get the currently previewed version index */
        getSelectedPreviewIndex() {
            return _selectedPreviewIndex;
        },

        /** Restore (rollback) to a specific version by index */
        rollbackTo(index) {
            const version = _history[index];
            if (!version) return;

            // 1. Get the tabs state from the version
            const tabsState = version.tabsState;
            if (!tabsState || tabsState.length === 0) return;

            // 2. Update the EditorEngine's tabs
            const liveTabs = EditorEngine.getTabs();
            
            // Clear existing tabs and rebuild from history state
            liveTabs.length = 0;
            tabsState.forEach((tabState, idx) => {
                const newTab = {
                    id: tabState.id || `tab_${Date.now()}_${idx}`,
                    title: tabState.title || `Tab ${idx + 1}`,
                    htmlContent: tabState.content || '<div></div>'
                };
                liveTabs.push(newTab);
            });

            // 3. Set the active tab to the first one
            if (liveTabs.length > 0) {
                // We need to use the EditorEngine's internal activeTabId
                // Since we can't directly set it, we'll use the switchTab method
                // But we need to make sure the tab exists first
                const firstTabId = liveTabs[0].id;
                // Switch to the first tab (this will also re-render)
                // We'll use the public API if available, or directly set it
                if (typeof EditorEngine.switchTab === 'function') {
                    EditorEngine.switchTab(firstTabId);
                } else {
                    // Fallback: manually set activeTabId and re-render
                    // This is a bit hacky but works with the current implementation
                    const activeTabId = firstTabId;
                    EditorEngine.renderTabsSidebar();
                    EditorEngine.loadActiveTabContent();
                }
            }

            // 4. Re-render the UI
            EditorEngine.renderTabsSidebar();
            EditorEngine.loadActiveTabContent();

            // 5. Close the history view
            const vhOverlay = document.getElementById('version-history-view');
            if (vhOverlay) vhOverlay.hidden = true;

            // 6. Capture a new snapshot marking the rollback
            _saveSnapshot(`Restored to version from ${version.displayDate}`);
        },

        /** Get the full history array (read-only) */
        getHistory() {
            return _history;
        }
    };
})();

// ============================================================
// 4. RENDER FUNCTIONS (UI)
// ============================================================

/** Global state for preview */
let currentlyPreviewingVersionId = null;
let currentlyPreviewingTabId = 'tab1';

/** Render the version history sidebar */
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

/** Preview a specific version by ID */
function previewVersion(versionId) {
    const version = documentHistory.find(v => v.id === versionId);
    if (!version) return;

    currentlyPreviewingVersionId = version.id;
    
    const dateTitle = document.getElementById('vh-top-date-title');
    if (dateTitle) dateTitle.textContent = version.displayDate;

    const tabsContainer = document.getElementById('vh-tabs-container');
    if (!tabsContainer) return;
    tabsContainer.innerHTML = '';
    
    if (version.tabsState && version.tabsState.length > 0) {
        // Set default tab if current is not in the list
        const tabIds = version.tabsState.map(t => t.id);
        if (!tabIds.includes(currentlyPreviewingTabId)) {
            currentlyPreviewingTabId = version.tabsState[0].id;
        }

        version.tabsState.forEach(tab => {
            const tabEl = document.createElement('div');
            tabEl.className = `tab-item-row ${tab.id === currentlyPreviewingTabId ? 'active' : ''}`;
            tabEl.style.cursor = 'pointer';
            
            const isActive = tab.id === currentlyPreviewingTabId;
            tabEl.innerHTML = `
                <input type="text" class="tab-name-input" value="${tab.title}" 
                       style="background: ${isActive ? '#ffffff' : 'transparent'}; 
                              border-color: ${isActive ? 'var(--border-strong)' : 'transparent'};
                              font-weight: ${isActive ? '500' : 'normal'};
                              color: ${isActive ? 'var(--accent-blue)' : 'var(--text-primary)'};
                              width: 80%; outline: none; border-radius: 3px; padding: 2px 4px; font-size: inherit; font-family: inherit;"
                       readonly>
            `;
            
            tabEl.addEventListener('click', () => {
                currentlyPreviewingTabId = tab.id;
                previewVersion(versionId);
            });
            tabsContainer.appendChild(tabEl);
        });

        const activeTab = version.tabsState.find(t => t.id === currentlyPreviewingTabId) || version.tabsState[0];
        const canvas = document.getElementById('vh-canvas');
        if (canvas) {
            canvas.innerHTML = `
                <div class="vh-edit-block" style="background-color: ${version.authorColor}15; color: ${version.authorColor}; padding: 2px 0; position: relative; border-radius: 2px;">
                    <span class="vh-edit-author" style="position: absolute; top: -16px; left: 0; font-size: 10px; color: ${version.authorColor}; white-space: nowrap;">${version.author}</span>
                    <div style="color: black;">${activeTab.content}</div>
                </div>
            `;
        }
    }
}

/** Save the current workspace state to history (called from EditorEngine) */
function saveVersionToHistory(description) {
    return HistoryEngine.captureSnapshot(description);
}

/** Restore the full document state (used by app.js) */
window.restoreFullDocumentState = function(savedTabsState) {
    // Get the live tabs array from EditorEngine
    const liveTabs = EditorEngine.getTabs();
    
    // Clear and rebuild
    liveTabs.length = 0;
    savedTabsState.forEach((tabState, idx) => {
        const newTab = {
            id: tabState.id || `tab_${Date.now()}_${idx}`,
            title: tabState.title || `Tab ${idx + 1}`,
            htmlContent: tabState.content || '<div></div>'
        };
        liveTabs.push(newTab);
    });

    // Re-render the UI
    EditorEngine.renderTabsSidebar();
    
    // Load the first tab's content
    if (liveTabs.length > 0) {
        // Use the EditorEngine's internal activeTabId if possible
        // Otherwise, we need to set it
        const firstTabId = liveTabs[0].id;
        if (typeof EditorEngine.switchTab === 'function') {
            EditorEngine.switchTab(firstTabId);
        } else {
            // Fallback: we need to access the private activeTabId
            // Since we can't, we'll just load the content directly
            EditorEngine.loadActiveTabContent();
        }
    }
};

// ============================================================
// 5. INITIALIZATION
// ============================================================

// Render the history sidebar when the DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        renderHistorySidebar();
        // Preview the most recent version by default
        if (documentHistory.length > 0) {
            previewVersion(documentHistory[0].id);
        }
    });
} else {
    renderHistorySidebar();
    if (documentHistory.length > 0) {
        previewVersion(documentHistory[0].id);
    }
}
