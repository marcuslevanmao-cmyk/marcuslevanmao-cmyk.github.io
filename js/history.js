/**
 * history.js — The State Timeline
 * Manages atomic snapshot state arrays of the underlying content structures.
 */
const HistoryEngine = (() => {
  const snapshots = [];

  function captureSnapshot(label) {
    const pages = Array.from(document.querySelectorAll('.doc-page')).map(p => p.innerHTML);
    snapshots.push({
      timestamp: new Date(),
      label: label || `Edit State v${snapshots.length + 1}`,
      content: pages
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
        <div class="version-time">${snap.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
        <div class="version-meta">${snap.label}</div>
      `;
      item.addEventListener('click', () => rollbackTo(idx));
      list.appendChild(item);
    });
  }

  function rollbackTo(idx) {
    const snap = snapshots[idx];
    if (!snap) return;
    const canvas = document.getElementById('doc-canvas');
    if (!canvas) return;

    // Filter structural layout markers like rules out during standard replacements
    const pages = canvas.querySelectorAll('.doc-page');
    pages.forEach((p, i) => {
      if (snap.content[i] !== undefined) p.innerHTML = snap.content[i];
    });
    
    document.querySelectorAll('.version-item').forEach((el, i) => {
      el.classList.toggle('current', i === idx);
    });
  }

  return { captureSnapshot, rollbackTo };
})();
