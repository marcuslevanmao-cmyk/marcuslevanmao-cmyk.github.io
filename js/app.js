/**
 * app.js — Global State Orchestrator
 */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Application Content Components
  EditorEngine.renderTabsSidebar();
  EditorEngine.loadActiveTabContent();
  CommentsEngine.bindSelectionListener();

  // Bind Sidebar + Add Tab functionality
  const addTabBtn = document.getElementById('add-tab-btn');
  if (addTabBtn) {
    addTabBtn.addEventListener('click', () => EditorEngine.createNewTab());
  }

  // Connect rich formatting toolbar items
  document.querySelectorAll('.toolbar-btn[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      if (action === 'bold' || action === 'italic' || action === 'underline') {
        document.execCommand(action, false, null);
        HistoryEngine.captureSnapshot(`Format modifier applied: ${action}`);
      } else if (action === 'undo' || action === 'redo') {
        document.execCommand(action, false, null);
      }
    });
  });

  // Connect Comment Panel Icon launcher
  const commentBtn = document.getElementById('toolbar-comment-btn');
  if (commentBtn) {
    commentBtn.addEventListener('click', () => CommentsEngine.promptForCommentOnSelection());
  }

  // Hook Version History View overlays
  const historyBtn = document.getElementById('history-btn');
  const vhOverlay = document.getElementById('version-history-view');
  const vhBackBtn = document.getElementById('vh-back-btn');
  
  // Custom Modal Confirmation selectors
  const confirmModal = document.getElementById('confirm-modal');
  const restoreTriggerBtn = document.getElementById('vh-restore-trigger-btn');
  const modalCancelBtn = document.getElementById('modal-cancel-btn');
  const modalConfirmBtn = document.getElementById('modal-confirm-btn');

  if (historyBtn && vhOverlay) {
    historyBtn.addEventListener('click', () => {
      // Establish initial track log selection layout defaults upon opening panel
      HistoryEngine.previewSnapshot(0);
      vhOverlay.hidden = false;
    });
  }

  if (vhBackBtn && vhOverlay) {
    vhBackBtn.addEventListener('click', () => {
      vhOverlay.hidden = true;
    });
  }

  // Wire custom inline dialog logic (Fully replaces standard window.confirm blocks)
  if (restoreTriggerBtn && confirmModal) {
    restoreTriggerBtn.addEventListener('click', () => {
      confirmModal.hidden = false;
    });
  }

  if (modalCancelBtn) {
    modalCancelBtn.addEventListener('click', () => {
      confirmModal.hidden = true;
    });
  }

  if (modalConfirmBtn && vhOverlay && confirmModal) {
    modalConfirmBtn.addEventListener('click', () => {
      const targetIdx = HistoryEngine.getSelectedPreviewIndex();
      if (targetIdx !== -1) {
        HistoryEngine.rollbackTo(targetIdx);
      }
      confirmModal.hidden = true;
      vhOverlay.hidden = true; // Return to workspace view
    });
  }

  // Capture baseline startup document footprint 
  HistoryEngine.captureSnapshot('Document session opened');
});
