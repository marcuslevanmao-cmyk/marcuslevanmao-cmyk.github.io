// js/app.js
document.addEventListener('DOMContentLoaded', () => {
  if (typeof EditorEngine !== 'undefined') {
    EditorEngine.renderTabsSidebar();
    EditorEngine.loadActiveTabContent();
  }
  
  if (typeof CommentsEngine !== 'undefined') {
    CommentsEngine.bindSelectionListener();
  }

  document.getElementById('add-tab-btn')?.addEventListener('click', () => {
    if (typeof EditorEngine !== 'undefined') {
      EditorEngine.createNewTab();
    }
  });

  document.querySelectorAll('.toolbar-btn[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      if (['bold', 'italic', 'underline'].includes(action)) {
        document.execCommand(action, false, null);
        if (typeof HistoryEngine !== 'undefined') {
          HistoryEngine.captureSnapshot(`Format: ${action}`);
        }
      } else if (action === 'undo' || action === 'redo') {
        document.execCommand(action, false, null);
      } else if (action.startsWith('justify')) {
        document.execCommand(action, false, null);
        if (typeof HistoryEngine !== 'undefined') {
          HistoryEngine.captureSnapshot('Alignment changed');
        }
      } else if (action === 'forecolor') {
        document.execCommand('foreColor', false, '#ea4335');
        if (typeof HistoryEngine !== 'undefined') {
          HistoryEngine.captureSnapshot('Text color changed');
        }
      } else if (action === 'hilitecolor') {
        document.execCommand('hiliteColor', false, '#fff475');
        if (typeof HistoryEngine !== 'undefined') {
          HistoryEngine.captureSnapshot('Highlight applied');
        }
      }
    });
  });

  document.querySelector('select[title="Font"]')?.addEventListener('change', (e) => {
    document.execCommand('fontName', false, e.target.value);
    if (typeof HistoryEngine !== 'undefined') {
      HistoryEngine.captureSnapshot(`Font: ${e.target.value}`);
    }
  });

  // ===== VERSION HISTORY TRIGGERS =====
  const vhTrigger = document.getElementById('history-trigger-btn');
  const vhOverlay = document.getElementById('version-history-view');
  const vhBack = document.getElementById('vh-back-btn');

  if (vhTrigger && vhOverlay) {
    vhTrigger.addEventListener('click', () => {
      vhOverlay.hidden = false;
      if (typeof renderHistorySidebar === 'function') {
        renderHistorySidebar();
      }
      if (typeof HistoryEngine !== 'undefined') {
        HistoryEngine.previewSnapshot(0);
      }
    });
  }

  if (vhBack && vhOverlay) {
    vhBack.addEventListener('click', () => {
      vhOverlay.hidden = true;
    });
  }

  // ===== SAFE CONFIRMATION MODAL LISTENERS =====
  const confirmModal = document.getElementById('confirm-modal');
  const restoreBtn = document.getElementById('vh-restore-trigger-btn');
  const cancelBtn = document.getElementById('modal-cancel-btn');
  const confirmBtn = document.getElementById('modal-confirm-btn');

  if (restoreBtn && confirmModal) {
    restoreBtn.addEventListener('click', () => {
      confirmModal.hidden = false;
    });
  }

  if (cancelBtn && confirmModal) {
    cancelBtn.addEventListener('click', () => {
      confirmModal.hidden = true;
    });
  }

  if (confirmBtn && vhOverlay && confirmModal) {
    confirmBtn.addEventListener('click', () => {
      if (typeof HistoryEngine !== 'undefined') {
        const idx = HistoryEngine.getSelectedPreviewIndex();
        if (idx !== -1) {
          HistoryEngine.rollbackTo(idx);
        }
      }
      confirmModal.hidden = true;
      vhOverlay.hidden = true;
    });
  }

  // Fallback initial tab load
  if (!document.querySelector('.doc-page') && typeof EditorEngine !== 'undefined') {
    EditorEngine.loadActiveTabContent();
  }
});
