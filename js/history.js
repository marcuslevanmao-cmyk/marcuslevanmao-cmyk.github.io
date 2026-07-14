/**
 * history.js — The State Timeline Engine
 */
const HistoryEngine = (() => {
  let currentVersionIndex = -1;
  const versionHistory = []; // [{ timestamp: Date, content: string[], label: string, isHandwritten: boolean }]

  let snapshotTimer = null;
  const SNAPSHOT_DEBOUNCE_MS = 4000;

  function readPagesContent() {
    const pages = document.querySelectorAll('.doc-page');
    return Array.from(pages).map((p) => p.innerHTML);
  }

  function captureSnapshot(label, customDate = null, isHandwritten = false) {
    const content = readPagesContent();
    const last = versionHistory[versionHistory.length - 1];
    if (last && JSON.stringify(last.content) === JSON.stringify(content)) {
      return;
    }

    versionHistory.push({
      timestamp: customDate || new Date(),
      content,
      label: label || `${content.length} page${content.length === 1 ? '' : 's'}`,
      isHandwritten: isHandwritten
    });
    currentVersionIndex = versionHistory.length - 1;
    renderVersionList();
  }

  function forcePushCustomSnapshot(snapshotObj) {
    versionHistory.push(snapshotObj);
    versionHistory.sort((a, b) => a.timestamp - b.timestamp);
    currentVersionIndex = versionHistory.length - 1;
    renderVersionList();
  }

  function scheduleSnapshot(label) {
    clearTimeout(snapshotTimer);
    snapshotTimer = setTimeout(() => {
      captureSnapshot(label);
    }, SNAPSHOT_DEBOUNCE_MS);
  }

  function rollbackToVersion(index) {
    const version = versionHistory[index];
    if (!version) return;
    currentVersionIndex = index;
    
    // Restore content cleanly to modern dynamic pages
    const canvas = document.getElementById('doc-canvas');
    canvas.innerHTML = '';
    
    version.content.forEach((html, i) => {
      const page = document.createElement('div');
      page.className = 'doc-page';
      page.contentEditable = 'true';
      page.setAttribute('spellcheck', 'true');
      page.innerHTML = html;
      
      // If the restored history element was a handwritten draft, match style constraints
      if (version.isHandwritten) {
        page.classList.add('handwritten-draft');
      }
      
      if (typeof EditorEngine !== 'undefined') {
        EditorEngine.attachPageListeners(page);
      }
      canvas.appendChild(page);
      
      const num = document.createElement('div');
      num.className = 'page-number';
      num.textContent = `${i + 1}`;
      canvas.appendChild(num);
    });
    
    renderVersionList();
  }

  function formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function formatDateLabel(date) {
    return date.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' });
  }

  function renderVersionList() {
    const list = document.getElementById('version-list');
    if (!list) return;
    list.innerHTML = '';

    if (versionHistory.length === 0) return;

    let lastGroupLabel = '';

    versionHistory.asReversed().forEach((v) => {
      const originalIndex = versionHistory.indexOf(v);
      const groupLabel = formatDateLabel(v.timestamp);

      if (groupLabel !== lastGroupLabel) {
        const labelDiv = document.createElement('div');
        labelDiv.className = 'version-day-label';
        labelDiv.textContent = groupLabel;
        list.appendChild(labelDiv);
        lastGroupLabel = groupLabel;
      }

      const isCurrent = (originalIndex === currentVersionIndex);
      const item = document.createElement('div');
      item.className = `version-item ${isCurrent ? 'current' : ''}`;
      
      item.innerHTML = `
        <div class="version-item-row">
          <div class="version-time">${formatTime(v.timestamp)}</div>
        </div>
        <div class="version-author" style="font-size:12px; color:var(--text-secondary); margin-top:2px;">
          ${v.label} ${v.isHandwritten ? '✍️ (Draft layout)' : ''}
        </div>
      `;

      item.addEventListener('click', () => {
        rollbackToVersion(originalIndex);
        document.getElementById('vh-title-date').textContent = `${formatDateLabel(v.timestamp)}, ${formatTime(v.timestamp)}`;
      });
      list.appendChild(item);
    });
  }

  function renderReadOnlyPages(container, content, isHandwritten = false) {
    container.innerHTML = '';
    content.forEach((html, i) => {
      const page = document.createElement('div');
      page.className = 'doc-page';
      if (isHandwritten) {
        page.classList.add('handwritten-draft');
      }
      page.innerHTML = html;
      container.appendChild(page);
      
      const numberEl = document.createElement('div');
      numberEl.className = 'page-number';
      numberEl.textContent = `${i + 1}`;
      container.appendChild(numberEl);
    });
  }

  return {
    captureSnapshot,
    forcePushCustomSnapshot,
    scheduleSnapshot,
    renderVersionList,
    renderReadOnlyPages,
    formatTime,
    getHistory: () => versionHistory,
    getCurrentIndex: () => currentVersionIndex
  };
})();
