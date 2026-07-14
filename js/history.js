/**
 * history.js — Timeline State Engine
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
    const activePage = document.querySelector('.doc-page');
    if (!activePage) return;
    
    const pageHtml = activePage.innerHTML;
    const lastSnap = snapshots[snapshots.length - 1];
    
    if (lastSnap && lastSnap.content[0] === pageHtml) return;

    snapshots.push({
      timestamp: new Date(),
      label: label || `Edit Revision Log #${snapshots.length + 1}`,
      content: [pageHtml]
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

    // Render static, un-editable preview sheets matching chosen log index
    const previewPage = document.createElement('div');
    previewPage.className = 'doc-page';
    previewPage.contentEditable = 'false';
    previewPage.innerHTML = snap.content[0];

    vhCanvas.appendChild(previewPage);

    const pageNum = document.createElement('div');
    pageNum.className = 'page-number';
    pageNum.textContent = '1 (Version Preview)';
    vhCanvas.appendChild(pageNum);

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

    // Hydrate workspace core layout structures with restored contents
    EditorEngine.forceHydrateAllContent(snap.content);
    
    // Append fresh baseline history entry tracking the restoration action
    captureSnapshot(`Restored version state track from ${snap.timestamp.toLocaleTimeString()}`);
  }

  return { captureSnapshot, scheduleSnapshot, rollbackTo, previewSnapshot, getSelectedPreviewIndex };
})();
