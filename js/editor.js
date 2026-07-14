/**
 * editor.js — Multi-Tab Architecture with Live Custom Renaming Engine
 */
const EditorEngine = (() => {
  const documentTabs = [
    {
      id: "tab_1",
      title: "Philosophy Overview",
      htmlContent: `<div>Stoicism was founded in Athens by Zeno of Citium around 300 BC. It teaches that virtue is happiness. Select text and click the Comment button to see the contextual composer card!</div>`
    },
    {
      id: "tab_2",
      title: "Seneca Quotes",
      htmlContent: `<div>"We suffer more often in imagination than in reality." — Seneca. This is an entirely distinct document content tab module.</div>`
    }
  ];
  
  let activeTabId = "tab_1";

  function getTabs() { return documentTabs; }
  function getActiveTabId() { return activeTabId; }

  function switchTab(id) {
    const currentTab = documentTabs.find(t => t.id === activeTabId);
    const activePage = document.querySelector('.doc-page');
    if (currentTab && activePage) {
      currentTab.htmlContent = activePage.innerHTML;
    }

    activeTabId = id;
    renderTabsSidebar();
    loadActiveTabContent();
  }

  function createNewTab() {
    const activePage = document.querySelector('.doc-page');
    if (activePage) {
      const currentTab = documentTabs.find(t => t.id === activeTabId);
      if (currentTab) currentTab.htmlContent = activePage.innerHTML;
    }

    const newId = `tab_${Date.now()}`;
    const newTab = {
      id: newId,
      title: `Untitled Tab ${documentTabs.length + 1}`,
      htmlContent: `<div>Empty tab view entry. Begin writing context text layout parameters directly here...</div>`
    };
    
    documentTabs.push(newTab);
    activeTabId = newId;
    renderTabsSidebar();
    loadActiveTabContent();
    HistoryEngine.captureSnapshot(`Added ${newTab.title}`);
  }

  function deleteTab(id, event) {
    event.stopPropagation();
    if (documentTabs.length <= 1) return;
    
    const index = documentTabs.findIndex(t => t.id === id);
    if (index === -1) return;

    documentTabs.splice(index, 1);
    if (activeTabId === id) {
      activeTabId = documentTabs[Math.max(0, index - 1)].id;
    }
    renderTabsSidebar();
    loadActiveTabContent();
    HistoryEngine.captureSnapshot(`Deleted workspace tab`);
  }

  function renderTabsSidebar() {
    const container = document.getElementById('tabs-container');
    if (!container) return;
    container.innerHTML = '';

    documentTabs.forEach(tab => {
      const row = document.createElement('div');
      row.className = `tab-item-row ${tab.id === activeTabId ? 'active' : ''}`;
      
      row.innerHTML = `
        <input type="text" class="tab-name-input" value="${tab.title}" aria-label="Tab name">
        ${documentTabs.length > 1 ? `
          <button class="tab-close-btn" title="Delete tab">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        ` : ''}
      `;

      // Prevent switching tabs when interacting with the editable text input field
      const input = row.querySelector('.tab-name-input');
      
      row.addEventListener('click', (e) => {
        if (e.target !== input) {
          switchTab(tab.id);
        }
      });

      input.addEventListener('click', (e) => {
        if (tab.id !== activeTabId) {
          switchTab(tab.id);
        }
      });

      // Synchronize input text changes back to memory state model immediately
      input.addEventListener('input', () => {
        tab.title = input.value.trim() || "Untitled Tab";
      });

      input.addEventListener('blur', () => {
        if (!input.value.trim()) {
          input.value = "Untitled Tab";
          tab.title = "Untitled Tab";
        }
        HistoryEngine.captureSnapshot(`Renamed tab to "${tab.title}"`);
      });

      if (documentTabs.length > 1) {
        row.querySelector('.tab-close-btn').addEventListener('click', (e) => deleteTab(tab.id, e));
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

    const page = document.createElement('div');
    page.className = 'doc-page';
    page.contentEditable = 'true';
    page.setAttribute('spellcheck', 'true');
    page.innerHTML = tab.htmlContent;

    page.addEventListener('input', () => {
      tab.htmlContent = page.innerHTML;
      HistoryEngine.scheduleSnapshot('Auto-saved layout edit');
    });

    target.appendChild(page);
    
    const pageNum = document.createElement('div');
    pageNum.className = 'page-number';
    pageNum.textContent = '1';
    target.appendChild(pageNum);

    CommentsEngine.renderCommentCards();
  }

  function forceHydrateAllContent(contentArray) {
    if (!contentArray || !contentArray[0]) return;
    const currentTab = documentTabs.find(t => t.id === activeTabId);
    if (currentTab) {
      currentTab.htmlContent = contentArray[0];
      loadActiveTabContent();
    }
  }

  return { getTabs, getActiveTabId, renderTabsSidebar, loadActiveTabContent, createNewTab, forceHydrateAllContent };
})();
