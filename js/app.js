/**
 * app.js — App Orchestrator
 */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize core engines safely
  if (typeof EditorEngine !== 'undefined') {
    EditorEngine.renderTabsSidebar();
    EditorEngine.loadActiveTabContent();
  } else {
    console.error("EditorEngine is missing! Check script order in index.html");
  }

  if (typeof CommentsEngine !== 'undefined') {
    CommentsEngine.bindSelectionListener();
    setTimeout(() => { CommentsEngine.renderCommentCards(); }, 100);
  }

  // ----- Tab creation -----
  document.getElementById('add-tab-btn')?.addEventListener('click', () => {
    if (typeof EditorEngine !== 'undefined') EditorEngine.createNewTab();
    if (typeof CommentsEngine !== 'undefined') CommentsEngine.renderCommentCards();
  });

  // ----- Toolbar formatting engines -----
  document.querySelectorAll('.toolbar-btn[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      if (['bold', 'italic', 'underline'].includes(action)) {
        document.execCommand(action, false, null);
        if (typeof HistoryEngine !== 'undefined') HistoryEngine.captureSnapshot(`Format: ${action}`);
      } else if (action === 'undo' || action === 'redo') {
        document.execCommand(action, false, null);
      } else if (action.startsWith('justify')) {
        document.execCommand(action, false, null);
        if (typeof HistoryEngine !== 'undefined') HistoryEngine.captureSnapshot('Alignment changed');
      } else if (action === 'forecolor') {
        document.execCommand('foreColor', false, '#ea4335');
        if (typeof HistoryEngine !== 'undefined') HistoryEngine.captureSnapshot('Text color changed');
      } else if (action === 'hilitecolor') {
        document.execCommand('hiliteColor', false, '#fff475');
        if (typeof HistoryEngine !== 'undefined') HistoryEngine.captureSnapshot('Highlight added');
      }
    });
  });

  // ----- Version History Workspace Overlays -----
  const historyBtn = document.getElementById('history-btn');
  const vhOverlay = document.getElementById('version-history-view');
  const vhBack = document.getElementById('vh-back-btn');
  
  if (historyBtn && vhOverlay) {
    historyBtn.addEventListener('click', () => {
      vhOverlay.hidden = false;
      if (typeof HistoryEngine !== 'undefined') {
        // FIXED: Added HistoryEngine prefix to prevent the ReferenceError
        HistoryEngine.renderHistorySidebar(); 
        HistoryEngine.previewSnapshot(0);
      }
    });
  }
  if (vhBack && vhOverlay) {
    vhBack.addEventListener('click', () => { vhOverlay.hidden = true; });
  }

  // ----- Restore dialogs -----
  const confirmModal = document.getElementById('confirm-modal');
  const restoreBtn = document.getElementById('vh-restore-trigger-btn');
  const cancelBtn = document.getElementById('modal-cancel-btn');
  const confirmBtn = document.getElementById('modal-confirm-btn');
  
  if (restoreBtn && confirmModal) {
    restoreBtn.addEventListener('click', () => { confirmModal.hidden = false; });
  }
  if (cancelBtn && confirmModal) {
    cancelBtn.addEventListener('click', () => { confirmModal.hidden = true; });
  }
  if (confirmBtn && vhOverlay && confirmModal) {
    confirmBtn.addEventListener('click', () => {
      if (typeof HistoryEngine !== 'undefined') {
        const idx = HistoryEngine.getSelectedPreviewIndex();
        if (idx !== -1) HistoryEngine.rollbackTo(idx);
      }
      confirmModal.hidden = true;
      vhOverlay.hidden = true;
      
      // Clear margin comments on restore to prevent them floating over wrong text
      localStorage.removeItem('docs_margin_comments');
      if (typeof CommentsEngine !== 'undefined') CommentsEngine.renderCommentCards();
    });
  }
});
