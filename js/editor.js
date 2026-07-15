/**
 * editor.js — Multi-Tab Architecture with Pagination & Persistence
 */
const EditorEngine = (() => {
  let documentTabs = [];

  // 1. Core initialization from localStorage or defaults
  try {
    const savedTabs = localStorage.getItem('docs_tab_contents');
    if (savedTabs) {
      documentTabs = JSON.parse(savedTabs);
    }
  } catch (e) {
    console.error("Failed to parse saved tabs from storage:", e);
  }

  // Fallback default tabs if storage is unpopulated
  if (!documentTabs || documentTabs.length === 0) {
    documentTabs = [
      {
        id: "tab_1",
        title: "The Utility of Gods",
        htmlContent: `<div style="font-family: 'Times New Roman', Times, serif; font-size: 16px; line-height: 1.6;">
  <p>Across history, civilizations around the world have independently developed religious traditions, suggesting that these beliefs address something fundamental about human nature, our need for belonging, our search for meaning, and our desire for ethical guidance. Religion has been one of humanity's most effective systems for organizing communities and transmitting values, not because of the certainty of its supernatural claims, but because of its unparalleled ability to unite people and inspire moral action. However, religion's greatest strength, its ability to create cohesive communities, can become its greatest weakness when it discourages curiosity, critical thought, and the continual betterment of human life. The measure of a religion should not be the certainty of its supernatural claims but the quality of the human beings it helps create.</p>
  <p>Religion has long served as one of humanity's most influential systems for moral education. Christianity, for example, spread complex ethical teachings through parables. These simple stories could be understood and remembered by children, farmers, and kings alike. Values like charity, forgiveness, sacrifice, and humility have survived for millennia largely because they were embedded within these sacred narratives.</p>
</div>`
      }
    ];
  }

  let activeTabId = documentTabs[0]?.id || "tab_1";
  const maxPageChars = 3200;

  function getTabs() { return documentTabs; }
  function getActiveTabId() { return activeTabId; }

  function saveCurrentTabContent() {
    const tab = documentTabs.find(t => t.id === activeTabId);
    if (tab) {
      tab.htmlContent = getCombinedHtml();
    }
    localStorage.setItem('docs_tab_contents', JSON.stringify(documentTabs));
  }

  function getCombinedHtml() {
    const pages = document.querySelectorAll('.doc-page');
    let html = '';
    pages.forEach(p => { html += p.innerHTML; });
    return html;
  }

  function loadActiveTabContent() {
    const tab = documentTabs.find(t => t.id === activeTabId);
    if (!tab) return;

    const docTitleInput = document.querySelector('.doc-title');
    if (docTitleInput) {
      docTitleInput.value = tab.title;
    }

    renderPages(tab.htmlContent);

    if (typeof CommentsEngine !== 'undefined') {
      CommentsEngine.renderCommentCards();
    }
  }

  function renderPages(htmlContent) {
    const container = document.getElementById('pages-container');
    if (!container) return;

    container.querySelectorAll('.doc-page, .page-break-indicator, .page-number-label').forEach(el => el.remove());

    const wrapper = document.createElement('div');
    wrapper.innerHTML = htmlContent || '<div><br></div>';

    let currentChunk = '';
    let pageIndex = 1;

    Array.from(wrapper.childNodes).forEach(node => {
      const temp = document.createElement('div');
      temp.appendChild(node.cloneNode(true));
      
      if ((currentChunk + temp.innerHTML).length > maxPageChars && currentChunk.trim()) {
        createNewPageElement(container, currentChunk, pageIndex++);
        currentChunk = temp.innerHTML;
      } else {
        currentChunk += temp.innerHTML;
      }
    });

    if (currentChunk.trim() || pageIndex === 1) {
      createNewPageElement(container, currentChunk, pageIndex);
    }
  }

  function createNewPageElement(container, html, index) {
    if (index > 1) {
      const indicator = document.createElement('div');
      indicator.className = 'page-break-indicator';
      container.appendChild(indicator);
    }

    const page = document.createElement('div');
    page.className = 'doc-page';
    page.contentEditable = 'true';
    page.innerHTML = html;
    container.appendChild(page);

    const label = document.createElement('div');
    label.className = 'page-number-label';
    label.textContent = index;
    container.appendChild(label);

    page.addEventListener('input', () => {
      checkAndPaginate(page);
      if (typeof HistoryEngine !== 'undefined') {
        HistoryEngine.scheduleSnapshot('Auto-saved layout edit');
      }
    });
  }

  function checkAndPaginate(page) {
    if (page.innerHTML.length > maxPageChars) {
      saveCurrentTabContent();
      loadActiveTabContent();
      
      // Reset cursor position to the end of text
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(page);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }

  function renderTabsSidebar() {
    const list = document.getElementById('tabs-list');
    if (!list) return;
    list.innerHTML = '';

    documentTabs.forEach(tab => {
      const row = document.createElement('div');
      row.className = `tab-item-row ${tab.id === activeTabId ? 'active' : ''}`;
      
      row.innerHTML = `
        <input type="text" class="tab-name-input" value="${tab.title}" readonly />
        ${documentTabs.length > 1 ? '<button class="tab-close-btn">&times;</button>' : ''}
      `;

      const input = row.querySelector('.tab-name-input');
      
      row.addEventListener('click', (e) => {
        if (e.target.closest('.tab-close-btn')) return;
        switchTab(tab.id);
      });

      row.addEventListener('dblclick', () => {
        input.readOnly = false;
        input.focus();
        input.select();
      });

      input.addEventListener('blur', () => {
        input.readOnly = true;
        tab.title = input.value.trim() || "Untitled Tab";
        saveCurrentTabContent();
        renderTabsSidebar();
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') input.blur();
      });

      const closeBtn = row.querySelector('.tab-close-btn');
      if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          deleteTab(tab.id);
        });
      }

      list.appendChild(row);
    });
  }

  function createNewTab() {
    saveCurrentTabContent();
    const id = `tab_${Date.now()}`;
    const newTab = {
      id,
      title: `Untitled Document`,
      htmlContent: `<div><br></div>`
    };
    documentTabs.push(newTab);
    activeTabId = id;
    saveCurrentTabContent();
    renderTabsSidebar();
    loadActiveTabContent();
  }

  function switchTab(id) {
    saveCurrentTabContent();
    activeTabId = id;
    renderTabsSidebar();
    loadActiveTabContent();
  }

  function deleteTab(id) {
    if (documentTabs.length <= 1) return;
    const index = documentTabs.findIndex(t => t.id === id);
    if (index === -1) return;

    documentTabs.splice(index, 1);
    if (activeTabId === id) {
      activeTabId = documentTabs[Math.max(0, index - 1)].id;
    }
    saveCurrentTabContent();
    renderTabsSidebar();
    loadActiveTabContent();
  }

  return {
    getTabs,
    getActiveTabId,
    saveCurrentTabContent,
    loadActiveTabContent,
    renderTabsSidebar,
    createNewTab,
    switchTab,
    deleteTab
  };
})();
