/**
 * app.js — Core app initialization and global state manager.
 * Wires the editor, comments, and history engines to the DOM chrome
 * (toolbar buttons, panel toggles, document title).
 */

const AppState = {
  activePanel: 'comments', // 'comments' | 'history'
};

function initToolbar() {
  document.querySelectorAll('.toolbar-btn[data-action]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;

      if (action === 'comment') {
        CommentsEngine.promptForCommentOnSelection();
        return;
      }
      if (action === 'undo' || action === 'redo') {
        document.execCommand(action);
        return;
      }
      if (action === 'forecolor') {
        document.execCommand('foreColor', false, '#d93025');
        return;
      }
      if (action === 'hilitecolor') {
        document.execCommand('hiliteColor', false, '#fff475');
        return;
      }
      if (action === 'link') {
        const url = window.prompt('Paste a link URL:');
        if (url) document.execCommand('createLink', false, url);
        return;
      }
      document.execCommand(action, false, null);
      btn.classList.toggle('active');
    });
  });
}

function initPanelToggles() {
  const commentsBtn = document.getElementById('comments-toggle-btn');
  const historyBtn = document.getElementById('history-toggle-btn');
  const commentsPanel = document.getElementById('comments-panel');
  const historyPanel = document.getElementById('history-panel');

  function showPanel(name) {
    AppState.activePanel = name;
    commentsPanel.hidden = name !== 'comments';
    historyPanel.hidden = name !== 'history';
    commentsBtn.classList.toggle('active', name === 'comments');
    historyBtn.classList.toggle('active', name === 'history');
  }

  commentsBtn.addEventListener('click', () => showPanel('comments'));
  historyBtn.addEventListener('click', () => {
    HistoryEngine.renderVersionList();
    showPanel('history');
  });

  showPanel('comments');
}

function initTitleField() {
  const titleInput = document.querySelector('.doc-title');
  titleInput.addEventListener('change', () => {
    document.title = titleInput.value || 'Untitled document';
  });
}

function initApp() {
  const firstPage = EditorEngine.initFirstPage();
  CommentsEngine.bindSelectionListener();
  initToolbar();
  initPanelToggles();
  initTitleField();

  // Baseline snapshot so the timeline has a starting point.
  HistoryEngine.captureSnapshot('Document created');

  // Re-flow comment card positions on window resize (page widths can reflow).
  window.addEventListener('resize', () => CommentsEngine.renderCommentCards());
}

document.addEventListener('DOMContentLoaded', initApp);
