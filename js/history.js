/**
 * history.js — Automated Timeline Engine
 */
const HistoryEngine = (() => {
  const snapshots = [];
  let debounceTimer = null;

  function scheduleSnapshot(label) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      captureSnapshot(label);
    }, 2500); // Wait for 2.5s of typing inactivity before snapshotting
  }

  function captureSnapshot(label) {
    const pages = Array.from(document.querySelectorAll('.doc-page')).map(p => p.innerHTML);
    
    // Prevent duplicate logs if content didn't change
    const lastSnap = snapshots[snapshots.length - 1];
    if (lastSnap && JSON.stringify(lastSnap.content) === JSON.stringify(pages)) return;

    snapshots.push({
      timestamp: new Date(),
      label: label || `Revision Log #${snapshots.length + 1}`,
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
        <div class="version-time">${snap.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}</div>
        <div class="version-meta">${snap.label}</div>
      `;
      item.addEventListener('click', () => rollbackTo(idx));
      list.appendChild(item);
    });
  }

  function rollbackTo(idx) {
    const snap = snapshots[idx];
    if (!snap) return;
    
    const livePages = document.querySelectorAll('.doc-page');
    livePages.forEach((p, i) => {
      if (snap.content[i] !== undefined) p.innerHTML = snap.content[i];
    });
    
    document.querySelectorAll('.version-item').forEach((el, i) => {
      el.classList.toggle('current', i === idx);
    });
  }

  return { captureSnapshot, scheduleSnapshot, rollbackTo };
})();
