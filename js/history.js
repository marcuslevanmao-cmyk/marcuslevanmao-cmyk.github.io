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

  function formatTime(date) {
    return date.toLocaleString(undefined, { hour: 'numeric', minute: '2-digit' });
  }

  function isSameDay(a, b) {
    return a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate();
  }

  function dayLabel(date) {
    const now = new Date();
    if (isSameDay(date, now)) return 'Today';
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (isSameDay(date, yesterday)) return 'Yesterday';
    return date.toLocaleDateString(undefined, { month: 'long', day: 'numeric' });
  }

  function formatFullTimestamp(date) {
    return date.toLocaleString(undefined, {
      month: 'short', day: 'numeric',
      hour: 'numeric', minute: '2-digit',
    });
  }

  /** Render the day-grouped card list used in the version-history side panel. */
  function renderVersionList() {
    const list = document.getElementById('version-list');
    if (!list) return;
    list.innerHTML = '';

    if (versionHistory.length === 0) {
      list.innerHTML = '<p class="side-panel-empty">Edits will appear here as you type.</p>';
      return;
    }

    // Most recent first, grouped by day.
    const ordered = versionHistory.map((v, i) => ({ ...v, index: i })).reverse();
    let lastDay = null;

    ordered.forEach((v) => {
      const label = dayLabel(v.timestamp);
      if (label !== lastDay) {
        const dayHeading = document.createElement('div');
        dayHeading.className = 'version-day-label';
        dayHeading.textContent = label;
        list.appendChild(dayHeading);
        lastDay = label;
      }

      const isCurrent = v.index === currentVersionIndex;
      const item = document.createElement('div');
      item.className = 'version-item' + (isCurrent ? ' current' : '');
      item.innerHTML = `
        <div class="version-item-row">
          <span class="version-time">${formatFullTimestamp(v.timestamp)}</span>
          <button class="version-item-menu" title="More options" aria-label="More options">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="5" r="1.6" fill="currentColor"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/><circle cx="12" cy="19" r="1.6" fill="currentColor"/></svg>
          </button>
        </div>
        ${isCurrent ? '<div class="version-meta">Current version</div>' : ''}
        <div class="version-author"><span class="version-author-dot"></span>You</div>
      `;
      item.addEventListener('click', (e) => {
        if (e.target.closest('.version-item-menu')) return;
        rollbackToVersion(v.index);
      });
      list.appendChild(item);
    });
  }

  /** Render a read-only copy of a version's pages into a target container (used by the version-history canvas). */
  function renderReadOnlyPages(container, content) {
    container.innerHTML = '';
    content.forEach((html, i) => {
      const page = document.createElement('div');
      page.className = 'doc-page';
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
    scheduleSnapshot,
    rollbackToVersion,
    renderVersionList,
    renderReadOnlyPages,
    formatTime,
    getCurrentIndex: () => currentVersionIndex,
    getHistory: () => versionHistory,
  };
})();
