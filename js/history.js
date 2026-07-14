/**
 * history.js — The State Timeline
 * Handles chronological tracking using in-memory array snapshots of
 * every page's content. No external storage: everything lives in
 * versionHistory for the lifetime of the tab.
 */

const HistoryEngine = (() => {
  let currentVersionIndex = -1;
  const versionHistory = []; // [{ timestamp: Date, content: string[], label: string }]

  let snapshotTimer = null;
  const SNAPSHOT_DEBOUNCE_MS = 4000;

  /** Pull current innerHTML of every .doc-page into an array. */
  function readPagesContent() {
    const pages = document.querySelectorAll('.doc-page');
    return Array.from(pages).map((p) => p.innerHTML);
  }

  /** 1. Target all active page elements, 2. map to array, 3. append snapshot. */
  function captureSnapshot(label) {
    const content = readPagesContent();

    // Skip capturing an exact duplicate of the last snapshot.
    const last = versionHistory[versionHistory.length - 1];
    if (last && JSON.stringify(last.content) === JSON.stringify(content)) {
      return;
    }

    versionHistory.push({
      timestamp: new Date(),
      content,
      label: label || `${content.length} page${content.length === 1 ? '' : 's'}`,
    });
    currentVersionIndex = versionHistory.length - 1;
    renderVersionList();
  }

  /** Debounced capture so we don't snapshot on every keystroke. */
  function scheduleSnapshot(label) {
    clearTimeout(snapshotTimer);
    snapshotTimer = setTimeout(() => captureSnapshot(label), SNAPSHOT_DEBOUNCE_MS);
  }

  /**
   * 1. Wipe the current document workspace clean.
   * 2. Read the historical content array from versionHistory[index].
   * 3. Re-inject pages back into the DOM view.
   */
  function rollbackToVersion(index) {
    const version = versionHistory[index];
    if (!version) return;

    const canvas = document.getElementById('doc-canvas');
    canvas.innerHTML = '';

    version.content.forEach((html, i) => {
      const page = EditorEngine.createPageElement();
      page.innerHTML = html;
      canvas.appendChild(page);
      canvas.appendChild(EditorEngine.createPageNumberElement(i + 1, version.content.length));
    });

    currentVersionIndex = index;
    renderVersionList();
    EditorEngine.refreshPageNumbers();
  }

  function formatTimestamp(date) {
    return date.toLocaleString(undefined, {
      month: 'short', day: 'numeric',
      hour: 'numeric', minute: '2-digit',
    });
  }

  function renderVersionList() {
    const list = document.getElementById('version-list');
    if (!list) return;
    list.innerHTML = '';

    if (versionHistory.length === 0) {
      list.innerHTML = '<p class="side-panel-empty">Edits will appear here as you type.</p>';
      return;
    }

    // Most recent first.
    versionHistory.forEach((v, i) => {
      const item = document.createElement('div');
      item.className = 'version-item' + (i === currentVersionIndex ? ' current' : '');
      item.innerHTML = `
        <span class="version-time">${formatTimestamp(v.timestamp)}</span>
        <span class="version-meta">${v.label}</span>
      `;
      item.addEventListener('click', () => rollbackToVersion(i));
      list.prepend(item);
    });
  }

  return {
    captureSnapshot,
    scheduleSnapshot,
    rollbackToVersion,
    renderVersionList,
    getCurrentIndex: () => currentVersionIndex,
    getHistory: () => versionHistory,
  };
})();
