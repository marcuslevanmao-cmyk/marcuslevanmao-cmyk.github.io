/**
 * history.js — Multi-Tab Document Timeline State Engine
 */
const HistoryEngine = (() => {
  const snapshots = [];
  let debounceTimer = null;
  let selectedPreviewIndex = -1;

  function scheduleSnapshot(label) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      captureSnapshot(label);
    }, 2000);
  }

  function captureSnapshot(label) {
    // Save current active page state back to its tab object before snapshotted
    const activePage = document.querySelector('.doc-page');
    if (activePage) {
      const activeTabId = EditorEngine.getActiveTabId();
      const currentTab = EditorEngine.getTabs().find(t => t.id === activeTabId);
      if (currentTab) {
        currentTab.htmlContent = activePage.innerHTML;
      }
    }

    // Deep copy the entire tabs array structure
    const tabsBackup = EditorEngine.getTabs().map(tab => ({
      id: tab.id,
      title: tab.title,
      htmlContent: tab.htmlContent
    }));

    const lastSnap = snapshots[snapshots.length - 1];
    if (lastSnap && JSON.stringify(lastSnap.tabsState) === JSON.stringify(tabsBackup)) return;

    snapshots.push({
      timestamp: new Date(),
      label: label || `Edit Revision Log #${snapshots.length + 1}`,
      tabsState: tabsBackup,
      activeTabIdAtSnapshot: EditorEngine.getActiveTabId()
    });
    renderTimelineItems();
  }

  function renderTimelineItems() {
    const list = document.getElementById('version-list');
    if (!list) return;
    list.innerHTML = '';

    snapshots.forEach((snap, idx) => {
      const item = document.createElement('div');
      item.className = `version-item ${idx === snapshots.length - 1 ? 'current' : ''}`;
      item.innerHTML = `
        <div class="version-time">${snap.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}</div>
        <div class="version-meta">${snap.label}</div>
      `;
      item.addEventListener('click', () => previewSnapshot(idx));
      list.appendChild(item);
    });
  }

  function previewSnapshot(idx) {
    selectedPreviewIndex = idx;
    const snap = snapshots[idx];
    if (!snap) return;

    const vhCanvas = document.getElementById('vh-canvas');
    if (!vhCanvas) return;
    
    vhCanvas.innerHTML = '';

    // Render static, non-editable previews of all tabs in this snapshot
    snap.tabsState.forEach(tab => {
      const tabHeader = document.createElement('div');
      tabHeader.style.cssText = "width: var(--page-width); font-size: 14px; font-weight: bold; color: var(--text-secondary); margin: 24px 0 8px 0; border-bottom: 1px solid var(--border-subtle); padding-bottom: 4px;";
      tabHeader.textContent = `Tab: ${tab.title}`;
      vhCanvas.appendChild(tabHeader);

      const previewPage = document.createElement('div');
      previewPage.className = 'doc-page';
      previewPage.contentEditable = 'false';
      previewPage.innerHTML = tab.htmlContent;
      vhCanvas.appendChild(previewPage);
    });

    document.querySelectorAll('.version-item').forEach((el, i) => {
      el.classList.toggle('current', i === idx);
    });
  }

  function getSelectedPreviewIndex() {
    return selectedPreviewIndex;
  }

  function rollbackTo(idx) {
    const snap = snapshots[idx];
    if (!snap) return;

    // Restore the entire workspace tabs array at once
    EditorEngine.setTabs(snap.tabsState, snap.activeTabIdAtSnapshot);
    
    // Append a baseline history entry tracking the whole restoration
    captureSnapshot(`Restored workspace state to snapshot from ${snap.timestamp.toLocaleTimeString()}`);
  }

  return { captureSnapshot, scheduleSnapshot, rollbackTo, previewSnapshot, getSelectedPreviewIndex };
})();
