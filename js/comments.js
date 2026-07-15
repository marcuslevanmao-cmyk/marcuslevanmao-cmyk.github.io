// js/comments.js
const CommentsEngine = (() => {
  const comments = new Map();
  let pendingRange = null;
  let idCounter = 0;
  let activePopup = null;

  // Immediately initialize on load
  try {
    const storedComm = localStorage.getItem('docs_margin_comments');
    if (storedComm) {
      const parsed = JSON.parse(storedComm);
      parsed.forEach(([k, v]) => comments.set(k, v));
    }
  } catch(e) { console.warn(e); }

  // ... (keep bindSelectionListener, reflectAddCommentButtonState, showFloatingComposer identical) ...

  function renderCommentCards() {
    const container = document.getElementById('pages-container');
    if (!container) return;

    let track = document.getElementById('margin-comments-track');
    if (track) track.remove();

    track = document.createElement('div');
    track.id = 'margin-comments-track';
    track.style = 'position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:100;';
    container.appendChild(track);

    const activeTabId = EditorEngine.getActiveTabId();

    comments.forEach((c, key) => {
      if (c.resolved || c.tabId !== activeTabId) return;

      const anchor = document.querySelector(`span[data-comment-id="${c.id}"]`);
      if (!anchor) return;

      const page = anchor.closest('.doc-page');
      if (!page) return;

      const containerRect = container.getBoundingClientRect();
      const anchorRect = anchor.getBoundingClientRect();

      // Exact Google Docs spacing: Placed precisely to the right of the page gutter
      const cardLeft = page.offsetLeft + page.offsetWidth + 24; 
      const cardTop = (anchorRect.top - containerRect.top) + container.scrollTop;

      const card = document.createElement('div');
      card.className = 'comment-margin-card';
      card.style = `position:absolute; left:${cardLeft}px; top:${cardTop}px; width:280px; background:#fff; border:1px solid #dadce0; border-radius:8px; padding:12px; box-shadow:0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15); pointer-events:auto; font-family: Roboto, RobotoDraft, Helvetica, Arial, sans-serif; transition: transform 0.2s ease;`;

      card.innerHTML = `
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
          <div style="width:24px; height:24px; border-radius:50%; background:#1a73e8; color:#fff; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:500;">U</div>
          <div style="display:flex; flex-direction:column;">
            <span style="font-size:13px; font-weight:500; color:#202124;">You</span>
            <span style="font-size:11px; color:#5f6368;">Just now</span>
          </div>
        </div>
        <div style="font-size:13px; color:#3c4043; line-height:1.4; margin-bottom:12px; word-break:break-word;">${c.body}</div>
        <div style="display:flex; justify-content:flex-end; gap:8px; border-top:1px solid #f1f3f4; padding-top:8px;">
          <button data-act="resolve" style="background:none; border:1px solid #dadce0; border-radius:4px; color:#1a73e8; font-size:12px; font-weight:500; cursor:pointer; padding:4px 12px; height:28px;">Resolve</button>
          <button data-act="delete" style="background:none; border:none; color:#d93025; font-size:12px; font-weight:500; cursor:pointer; padding:4px 8px;">Delete</button>
        </div>
      `;

      // Highlight target anchor when hovering over its card
      card.addEventListener('mouseenter', () => anchor.classList.add('active'));
      card.addEventListener('mouseleave', () => anchor.classList.remove('active'));

      card.querySelector('[data-act="resolve"]').addEventListener('click', () => {
        c.resolved = true;
        anchor.className = 'comment-anchor resolved';
        saveCommentsToStorage();
        renderCommentCards();
      });

      card.querySelector('[data-act="delete"]').addEventListener('click', () => {
        anchor.replaceWith(...anchor.childNodes);
        comments.delete(key);
        saveCommentsToStorage();
        renderCommentCards();
      });

      track.appendChild(card);
    });
  }

  function saveCommentsToStorage() {
    localStorage.setItem('docs_margin_comments', JSON.stringify(Array.from(comments.entries())));
    if (typeof EditorEngine !== 'undefined') {
      EditorEngine.saveCurrentTabContent();
    }
  }

  return {
    bindSelectionListener,
    promptForCommentOnSelection,
    renderCommentCards,
    closePopup,
    saveCommentsToStorage
  };
})();
