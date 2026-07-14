/**
 * app.js — Core initialization bus.
 * Anchors operations and maps shared action events across modules smoothly.
 */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Viewports
  EditorEngine.initFirstPage();
  CommentsEngine.bindSelectionListener();

  // Toolbar Operations Map
  document.querySelectorAll('.toolbar-btn[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      if (action === 'bold' || action === 'italic' || action === 'underline') {
        document.execCommand(action, false, null);
        HistoryEngine.captureSnapshot(`Applied Format: ${action}`);
      } else if (action === 'undo' || action === 'redo') {
        document.execCommand(action, false, null);
      }
    });
  });

  // Structural Sidebars Events Mapping
  const commentBtn = document.getElementById('toolbar-comment-btn');
  if (commentBtn) {
    commentBtn.addEventListener('click', () => CommentsEngine.promptForCommentOnSelection());
  }

  const outlineBackBtn = document.getElementById('tabs-back-btn');
  const outlineSidebar = document.getElementById('tabs-sidebar');
  if (outlineBackBtn && outlineSidebar) {
    outlineBackBtn.addEventListener('click', () => outlineSidebar.style.display = 'none');
  }

  // Version History Screen Toggle Controls
  const historyBtn = document.getElementById('history-btn');
  const vhOverlay = document.getElementById('version-history-view');
  const vhBackBtn = document.getElementById('vh-back-btn');
  const vhCanvas = document.getElementById('vh-canvas');

  if (historyBtn && vhOverlay) {
    historyBtn.addEventListener('click', () => {
      const livePages = document.querySelectorAll('.doc-page');
      vhCanvas.innerHTML = '';
      livePages.forEach(p => {
        const copy = p.cloneNode(true);
        copy.contentEditable = 'false';
        vhCanvas.appendChild(copy);
      });
      vhOverlay.hidden = false;
    });
  }

  if (vhBackBtn && vhOverlay) {
    vhBackBtn.addEventListener('click', () => vhOverlay.hidden = true);
  }

  // Initial State Snapshot Lifecycle capture
  HistoryEngine.captureSnapshot('Document launched');
});
