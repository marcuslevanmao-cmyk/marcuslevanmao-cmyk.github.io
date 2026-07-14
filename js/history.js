// js/history.js
// history.js — Complete Version History Engine with localStorage persistence

const STORAGE_KEY = 'doc_history_v5';

// Real content blocks for Marcus's revisions
const marcusInitialContent = `<div style="font-family: 'Times New Roman', Times, serif; font-size: 16px; line-height: 1.6;">
  <p>Across history, civilizations around the world have independently developed religious traditions, suggesting that these beliefs address something fundamental about human nature, our need for belonging, our search for meaning, and our desire for ethical guidance.</p>
</div>`;

const marcusSecondContent = `<div style="font-family: 'Times New Roman', Times, serif; font-size: 16px; line-height: 1.6;">
  <p>Across history, civilizations around the world have independently developed religious traditions, suggesting that these beliefs address something fundamental about human nature, our need for belonging, our search for meaning, and our desire for ethical guidance. Religion has been one of humanity's most effective systems for organizing communities and transmitting values.</p>
  <p>Religion has long served as one of humanity's most influential systems for moral education. Christianity, for example, spread complex ethical teachings through parables.</p>
</div>`;

const marcusFinalContent = `<div style="font-family: 'Times New Roman', Times, serif; font-size: 16px; line-height: 1.6;">
  <p>Across history, civilizations around the world have independently developed religious traditions, suggesting that these beliefs address something fundamental about human nature, our need for belonging, our search for meaning, and our desire for ethical guidance. Religion has been one of humanity's most effective systems for organizing communities and transmitting values, not because of the certainty of its supernatural claims, but because of its unparalleled ability to unite people and inspire moral action.</p>
  <p>Religion has long served as one of humanity's most influential systems for moral education. Christianity, for example, spread complex ethical teachings through parables. These simple stories could be understood and remembered by children, farmers, and kings alike. Values like charity, forgiveness, and sacrifice were taught as absolute truths.</p>
</div>`;

let selectedPreviewIndex = 0;

function getInitialHistory() {
  return [
    {
      id: 3,
      dateObj: new Date(Date.now() - 1000 * 60 * 5),
      displayDate: "Today, 4:58 p.m.",
      dayGroup: "Today",
      author: "Marcus Le Van Mao",
      authorColor: "#1a73e8",
      description: "Refined body paragraph arguments",
      tabsState: [
        { id: "tab_1", title: "The Utility of Gods", content: marcusFinalContent }
      ]
    },
    {
      id: 2,
      dateObj: new Date(Date.now() - 1000 * 60 * 30),
      displayDate: "Today, 4:33 p.m.",
      dayGroup: "Today",
      author: "Marcus Le Van Mao",
      authorColor: "#1a73e8",
      description: "Structured paragraphs",
      tabsState: [
        { id: "tab_1", title: "The Utility of Gods", content: marcusSecondContent }
      ]
    },
    {
      id: 1,
      dateObj: new Date(Date.now() - 1000 * 60 * 120),
      displayDate: "Today, 3:03 p.m.",
      dayGroup: "Today",
      author: "Marcus Le Van Mao",
      authorColor: "#1a73e8",
      description: "Initial Draft",
      tabsState: [
        { id: "tab_1", title: "The Utility of Gods", content: marcusInitialContent }
      ]
    }
  ];
}

function loadHistoryFromStorage() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      parsed.forEach(v => { v.dateObj = new Date(v.dateObj); });
      return parsed;
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

let documentHistory = loadHistoryFromStorage() || getInitialHistory();
saveHistoryToStorage(documentHistory);

const HistoryEngine = (() => {
  let _history = documentHistory;
  let _snapshotTimeout = null;
  let _nextId = _history.length > 0 ? Math.max(..._history.map(v => v.id)) + 1 : 1;

  function _getCurrentTabsState() {
    // EditorEngine is now loaded before history.js
    if (typeof EditorEngine === 'undefined') {
      console.warn('EditorEngine not available yet');
      return [];
    }
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
      author: "Marcus Le Van Mao",
      authorColor: "#1a73e8",
      description: description || "Edited",
      tabsState: _getCurrentTabsState()
    };
  }

  function _saveSnapshot(description) {
    const snapshot = _createSnapshot(description);
    _history.unshift(snapshot);
    if (_history.length > 50) _history.pop();
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
        _saveSnapshot(description || "Auto-saved");
      }, 1500);
    },
    previewSnapshot(index) {
      selectedPreviewIndex = index;
      const version = _history[index];
      if (!version) return;
      previewVersion(version.id);
    },
    getSelectedPreviewIndex() {
      return selectedPreviewIndex;
    },
    rollbackTo(index) {
      const version = _history[index];
      if (!version) return;
      const tabsState = version.tabsState;
      if (!tabsState || tabsState.length === 0) return;

      window.restoreFullDocumentState(tabsState);
      const vhOverlay = document.getElementById('version-history-view');
      if (vhOverlay) vhOverlay.hidden = true;
      _saveSnapshot(`Restored to version from ${version.displayDate}`);
    },
    getHistory() {
      return _history;
    }
  };
})();

let currentlyPreviewingVersionId = null;
let currentlyPreviewingTabId = 'tab_1';

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

    const isCurrent = index === selectedPreviewIndex;
    const itemHtml = `
      <div class="vh-item ${isCurrent ? 'active' : ''}" data-id="${version.id}">
        <div class="vh-item-arrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg></div>
        <div class="vh-item-content">
          <div class="vh-item-time">${version.displayDate}</div>
          <div class="vh-item-subtitle">${version.description}</div>
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
      selectedPreviewIndex = index;
      previewVersion(version.id);
    });
    listContainer.appendChild(itemEl);
  });

  // Update total count
  const totalSpan = document.getElementById('vh-total-edits');
  if (totalSpan) totalSpan.textContent = `Total: ${documentHistory.length} edits`;
}

function previewVersion(versionId) {
  const version = documentHistory.find(v => v.id === versionId);
  if (!version) return;

  currentlyPreviewingVersionId = version.id;
  const dateTitle = document.getElementById('vh-top-date-title');
  if (dateTitle) dateTitle.textContent = version.displayDate;

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
    if (version.author === 'Marcus Le Van Mao') {
      html = `<div style="border-left: 2px solid ${version.authorColor}; padding-left: 10px;">${html}</div>`;
    }
    canvas.innerHTML = html;
  }

  const totalSpan = document.getElementById('vh-total-edits');
  if (totalSpan) totalSpan.textContent = `Total: ${documentHistory.length} edits`;
}

function saveVersionToHistory(description) {
  return HistoryEngine.captureSnapshot(description);
}

window.restoreFullDocumentState = function(savedTabsState) {
  if (typeof EditorEngine === 'undefined') {
    console.warn('EditorEngine not available for restore');
    return;
  }
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

// Auto-init when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHistory);
} else {
  initHistory();
}
