/**
 * comments.js — Contextual Annotation Engine
 */
const CommentsEngine = (() => {
  const comments = new Map();
  let pendingRange = null;
  let idCounter = 0;

  function bindSelectionListener() {
    document.getElementById('doc-canvas').addEventListener('mouseup', () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
        pendingRange = null;
        reflectAddCommentButtonState();
        return;
      }

      const range = sel.getRangeAt(0);
      if (!range.toString().trim()) {
        pendingRange = null;
        reflectAddCommentButtonState();
        return;
      }

      const node = range.commonAncestorContainer;
      const insidePage = node.nodeType === Node.ELEMENT_NODE ? node.closest('.doc-page') : node.parentElement?.closest('.doc-page');
      
      if (insidePage) {
        pendingRange = range.cloneRange();
      } else {
        pendingRange = null;
      }
      reflectAddCommentButtonState();
    });
  }

  function reflectAddCommentButtonState() {
    const btn = document.querySelector('.cs-add-comment-btn');
    if (btn) btn.disabled = !pendingRange;
  }

  function promptForCommentOnSelection() {
    // SILENT FAILURE OPERATION: If no active text selection ranges exist, exit execution loop with no popup alert
    if (!pendingRange) return;

    const textQuote = pendingRange.toString();
    idCounter++;
    const cid = `comm_${idCounter}_${Date.now().toString().slice(-3)}`;

    const span = document.createElement('span');
    span.className = 'comment-anchor active';
    span.dataset.commentId = cid;

    try {
      pendingRange.surroundContents(span);
    } catch (e) {
      const frag = pendingRange.extractContents();
      span.appendChild(frag);
      pendingRange.insertNode(span);
    }

    window.getSelection().removeAllRanges();
    renderComposerCard(cid, textQuote);
  }

  function renderComposerCard(cid, quote) {
    const list = document.getElementById('comments-list');
    if (!list) return;

    const existingComposer = list.querySelector('.comment-composer-card');
    if (existingComposer) existingComposer.remove();

    const compCard = document.createElement('div');
    compCard.className = 'comment-composer-card';
    compCard.innerHTML = `
      <textarea placeholder="Add a comment..."></textarea>
      <div class="composer-actions">
        <button class="btn-secondary" data-action="cancel">Cancel</button>
        <button class="btn-primary" data-action="save">Comment</button>
      </div>
    `;

    compCard.querySelector('[data-action="cancel"]').addEventListener('click', () => {
      document.querySelectorAll(`span[data-comment-id="${cid}"]`).forEach(el => {
        el.replaceWith(...el.childNodes);
      });
      compCard.remove();
      pendingRange = null;
    });

    compCard.querySelector('[data-action="save"]').addEventListener('click', () => {
      const bodyText = compCard.querySelector('textarea').value.trim();
      if (!bodyText) return;

      comments.set(cid, { id: cid, quote: quote, body: bodyText, resolved: false });
      compCard.remove();
      pendingRange = null;
      renderCommentCards();
    });

    list.prepend(compCard);
    compCard.querySelector('textarea').focus();
  }

  function renderCommentCards() {
    const list = document.getElementById('comments-list');
    if (!list) return;

    const activeComposer = list.querySelector('.comment-composer-card');
    const activeEntries = [];
    comments.forEach((c, key) => {
      if (!c.resolved && document.querySelector(`span[data-comment-id="${c.id}"]`)) {
        activeEntries.push([key, c]);
      }
    });

    list.innerHTML = '';
    if (activeComposer) list.appendChild(activeComposer);

    if (activeEntries.length === 0 && !activeComposer) {
      list.innerHTML = `
        <div class="cs-empty-state">
          <p>Start a discussion</p>
          <button class="btn-primary cs-add-comment-btn" style="width:100%;" disabled>Add comment</button>
        </div>
      `;
      list.querySelector('.cs-add-comment-btn').addEventListener('click', promptForCommentOnSelection);
      reflectAddCommentButtonState();
      return;
    }

    activeEntries.forEach(([key, c]) => {
      const card = document.createElement('div');
      card.className = 'comment-card';
      card.innerHTML = `
        <div class="comment-card-header">
          <div class="comment-avatar">U</div>
          <span class="comment-author">You</span>
        </div>
        <p class="comment-quote">"${c.quote}"</p>
        <p class="comment-body">${c.body}</p>
        <div class="comment-actions">
          <button data-act="resolve">Resolve</button>
          <button data-act="delete" style="color: #ea4335; margin-left: 10px; background: none; border: none; cursor: pointer; font-size: 12px;">Delete</button>
        </div>
      `;
      
      // Resolve action
      card.querySelector('[data-act="resolve"]').addEventListener('click', () => {
        c.resolved = true;
        document.querySelectorAll(`span[data-comment-id="${c.id}"]`).forEach(el => el.className = 'comment-anchor resolved');
        renderCommentCards();
      });

      // Delete action (Removes span wrapper entirely)
      card.querySelector('[data-act="delete"]').addEventListener('click', () => {
        document.querySelectorAll(`span[data-comment-id="${c.id}"]`).forEach(el => {
            el.replaceWith(...el.childNodes); // Strips the span, leaves the text
        });
        comments.delete(key);
        renderCommentCards();
      });

      list.appendChild(card);
    });
  }

  return { bindSelectionListener, promptForCommentOnSelection, renderCommentCards };
})();
