// js/editor.js
/**
 * editor.js — Multi-Tab Architecture with Live Custom Renaming Engine
 */

// Define the initial document content that was missing!
const initialDocContent = `<div style="font-family: 'Times New Roman', Times, serif; font-size: 16px; line-height: 1.6;">
  <p>Across history, civilizations around the world have independently developed religious traditions, suggesting that these beliefs address something fundamental about human nature, our need for belonging, our search for meaning, and our desire for ethical guidance.</p>
</div>`;

const EditorEngine = (() => {
  const documentTabs = [
    {
      id: "tab_1",
      title: "The Utility of Gods",
      htmlContent: initialDocContent
    }
  ];
  let activeTabId = "tab_1";

  function createNewTab() {
    const id = `tab_${Date.now()}`;
    const newTab = {
      id: id,
      title: `Untitled Tab`,
      htmlContent: `<div style="font-family: 'Times New Roman', Times, serif; font-size: 16px; line-height: 1.6;"><p>Start writing here...</p></div>`
    };
    documentTabs.push(newTab);
    activeTabId = id;
    renderTabsSidebar();
    loadActiveTabContent();
    if (typeof HistoryEngine !== 'undefined') {
      HistoryEngine.captureSnapshot('Created a new tab');
    }
  }

  function deleteTab(id, event) {
    if (event) event.stopPropagation();
    if (documentTabs.length <= 1) return;

    const idx = documentTabs.findIndex(t => t.id === id);
    if (idx === -1) return;

    documentTabs.splice(idx, 1);
    if (activeTabId === id) {
      activeTabId = documentTabs[Math.max(0, idx - 1)].id;
    }

    renderTabsSidebar();
    loadActiveTabContent();
    if (typeof HistoryEngine !== 'undefined') {
      HistoryEngine.captureSnapshot('Deleted a tab');
    }
  }

  function renderTabsSidebar() {
    const container = document.getElementById('tabs-container');
    if (!container) return;
    container.innerHTML = '';

    documentTabs.forEach(tab => {
      const isActive = tab.id === activeTabId;
      const row = document.createElement('div');
      row.className = `tab-item-row ${isActive ? 'active' : ''}`;
      row.dataset.tabId = tab.id;

      row.innerHTML = `
        <input type="text" class="tab-name-input" value="${tab.title}" 
               ${isActive ? '' : 'readonly'} 
               title="Double-click to rename" />
        ${documentTabs.length > 1 ? '<button class="tab-close-btn" title="Delete tab">×</button>' : ''}
      `;

      row.addEventListener('click', () => {
        if (activeTabId === tab.id) return;
        activeTabId = tab.id;
        renderTabsSidebar();
        loadActiveTabContent();
      });

      const input = row.querySelector('.tab-name-input');
      input.addEventListener('change', () => {
        tab.title = input.value;
        const docTitleInput = document.querySelector('.doc-title');
        if (docTitleInput && isActive) {
          docTitleInput.value = tab.title;
        }
        if (typeof HistoryEngine !== 'undefined') {
          HistoryEngine.captureSnapshot(`Renamed tab to "${tab.title}"`);
        }
      });

      if (documentTabs.length > 1) {
        const closeBtn = row.querySelector('.tab-close-btn');
        if (closeBtn) {
          closeBtn.addEventListener('click', (e) => deleteTab(tab.id, e));
        }
      }

      container.appendChild(row);
    });
  }

  function loadActiveTabContent() {
    const target = document.getElementById('pages-container');
    if (!target) return;
    target.innerHTML = '';

    const tab = documentTabs.find(t => t.id === activeTabId);
    if (!tab) return;

    const docTitleInput = document.querySelector('.doc-title');
    if (docTitleInput) {
      docTitleInput.value = tab.title;
    }

    const page = document.createElement('div');
    page.className = 'doc-page';
    page.contentEditable = 'true';
    page.setAttribute('spellcheck', 'true');
    page.innerHTML = tab.htmlContent;

    page.addEventListener('input', () => {
      tab.htmlContent = page.innerHTML;
      if (typeof HistoryEngine !== 'undefined') {
        HistoryEngine.scheduleSnapshot('Auto-saved layout edit');
      }
    });

    target.appendChild(page);

    const pageNum = document.createElement('div');
    pageNum.className = 'page-number';
    pageNum.textContent = '1';
    target.appendChild(pageNum);

    // Re-render comments for this tab
    if (typeof CommentsEngine !== 'undefined') {
      CommentsEngine.renderCommentCards();
    }
  }

  // Expose the tabs array for other modules
  function getTabs() { return documentTabs; }
  function getActiveTabId() { return activeTabId; }
  function setActiveTabId(id) { activeTabId = id; }

  return {
    getTabs,
    getActiveTabId,
    setActiveTabId,
    createNewTab,
    renderTabsSidebar,
    loadActiveTabContent
  };
})();
