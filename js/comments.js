/**
 * comments.js — Complete Contextual Annotation Engine
 */
const CommentsEngine = (() => {
  const comments = new Map();
  let pendingRange = null;
  let idCounter = 0;

  function bindSelectionListener() {
    document.addEventListener('mouseup', () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || sel.rangeCount === 0) return;

      const range = sel.getRangeAt(0);
      if (!range.toString().trim()) return;

      const node = range.commonAncestorContainer;
      const insidePage = node.nodeType === Node.ELEMENT_NODE ? node.closest('.doc-page') : node.parentElement?.closest('.doc-page');
      
      if (insidePage) {
        pendingRange = range.cloneRange();
      }
    });
  }

  function promptForCommentOnSelection() {
    if (!pendingRange) {
      alert('Highlight a text section inside your document layout first!');
      return;
    }

    const textQuote = pendingRange.toString();
    idCounter++;
    const cid = `comm_${idCounter}_${Date.now().toString().slice(-3)}`;

    // Wrap selection visually immediately
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

    // Clear document text selection lines
    window.getSelection().removeAllRanges();

    // Render Context-Relative Input card inside right sidebar
    renderComposerCard(cid, textQuote);
  }

  function renderComposerCard(cid, quote) {
    const list = document.getElementById('comments-list');
    if (!list) return;

    // Remove any unresolved composer cards to keep panel unified
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

    // Handle Cancel Action
    compCard.querySelector('[data-action="cancel"]').addEventListener('click', () => {
      document.querySelectorAll(`span[data-comment-id="${cid}"]`).forEach(el => {
        el.replaceWith(...el.childNodes);
      });
      compCard.remove();
      pendingRange = null;
    });

    // Handle Save Action
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

    // Clear workspace list except active writing fields
    const activeComposer = list.querySelector('.comment-composer-card');
    list.innerHTML = '';
    if (activeComposer) list.appendChild(activeComposer);

    comments.forEach(c => {
      if (c.resolved) return;
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
        </div>
      `;
      card.querySelector('[data-act="resolve"]').addEventListener('click', () => {
        c.resolved = true;
        document.querySelectorAll(`span[data-comment-id="${c.id}"]`).forEach(el => el.className = 'comment-anchor resolved');
        card.remove();
      });
      list.appendChild(card);
    });
  }

  return { bindSelectionListener, promptForCommentOnSelection, renderCommentCards };
})();
