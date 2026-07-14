/**
 * editor.js — Multi-Tab Architecture with Live Custom Renaming Engine
 */
const EditorEngine = (() => {
  let documentTabs = [
    {
      id: "tab_1",
      title: "Philosophy Overview",
      htmlContent: `<div>Stoicism was founded in Athens by Zeno of Citium around 300 BC. It teaches that virtue is happiness. <span class="author-marcus" title="Written by Marcus Le Van Mao" data-author="Marcus Le Van Mao">"The happiness of your life depends upon the quality of your thoughts," wrote Marcus Aurelius. Stoics seek tranquility by focusing only on what they can control.</span> Select text and click the Comment button to see the contextual composer card!</div>`
    },
    {
      id: "tab_2",
      title: "Seneca Quotes",
      htmlContent: `<div>"We suffer more often in imagination than in reality." — Seneca. <span class="author-marcus" title="Written by Marcus Le Van Mao" data-author="Marcus Le Van Mao">"Associate with people who are likely to improve you," Seneca advised Lucilius.</span> This is an entirely distinct document content tab module.</div>`
    }
  ];
  
  let activeTabId = "tab_1";

  function getTabs() { return documentTabs; }
  function getActiveTabId() { return activeTabId; }

  function setTabs(newTabs, activeId) {
    documentTabs = newTabs.map(t => ({...t}));
    activeTabId = activeId || newTabs[0]?.id || "tab_1";
    renderTabsSidebar();
    loadActiveTabContent();
  }

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
    documentTabs.push({
      id: newId,
      title: `Untitled Tab ${documentTabs.length + 1}`,
      htmlContent: `<div>Start typing here... <span class="author-marcus" title="Written by Marcus Le Van Mao" data-author="Marcus Le Van Mao">Marcus Le Van Mao left a placeholder footprint here.</span></div>`
    });

    activeTabId = newId;
    renderTabsSidebar();
    loadActiveTabContent();
    HistoryEngine.captureSnapshot("Created new tab");
  }

  function deleteTab(id, event) {
    event.stopPropagation();
    if (documentTabs.length <= 1) return;

    const index = documentTabs.findIndex(t => t.id === id);
    documentTabs = documentTabs.filter(t => t.id !== id);

    if (activeTabId === id) {
      activeTabId = documentTabs[Math.max(0, index - 1)].id;
    }

    renderTabsSidebar();
    loadActiveTabContent();
    HistoryEngine.captureSnapshot("Deleted a tab");
  }

  function renderTabsSidebar() {
    const container = document.getElementById('tabs-container');
    if (!container) return;
    container.innerHTML = '';

    documentTabs.forEach(tab => {
      const row = document.createElement('div');
      row.className = `tab-item-row ${tab.id === activeTabId ? 'active' : ''}`;
      row.addEventListener('click', () => switchTab(tab.id));

      row.innerHTML = `
        <input type="text" class="tab-name-input" value="${tab.title}" aria-label="Tab Name" />
        ${documentTabs.length > 1 ? `<button class="tab-close-btn" title="Delete tab">&times;</button>` : ''}
      `;

      const input = row.querySelector('.tab-name-input');
      input.addEventListener('change', (e) => {
        tab.title = e.target.value;
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

  return { 
    getTabs, 
    setTabs, 
    getActiveTabId, 
    switchTab, 
    createNewTab, 
    renderTabsSidebar, 
    loadActiveTabContent 
  };
})();
