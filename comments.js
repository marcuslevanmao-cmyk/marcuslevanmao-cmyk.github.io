/**
 * comments.js — The Annotation Engine
 * Binds dynamic textual ranges directly to UI components on the right margin.
 */

const CommentsEngine = (() => {
  const comments = new Map(); // id -> { id, quote, body, top, resolved }
  let pendingRange = null;
  let idCounter = 0;

  function nextId() {
    idCounter += 1;
    return `xyz_${idCounter}${Date.now().toString().slice(-4)}`;
  }

  /** Selection Listener: catches mouseup to intercept highlighted ranges inside pages. */
  function bindSelectionListener() {
    document.getElementById('doc-canvas').addEventListener('mouseup', () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
        pendingRange = null;
        return;
      }
      const range = sel.getRangeAt(0);
      if (range.toString().trim() === '') {
        pendingRange = null;
        return;
      }
      // Only allow selections that live inside a single .doc-page.
      const container = range.commonAncestorContainer;
      const page = container.nodeType === Node.ELEMENT_NODE
        ? container.closest('.doc-page')
        : container.parentElement && container.parentElement.closest('.doc-page');
      if (!page) {
        pendingRange = null;
        return;
      }
      pendingRange = range.cloneRange();
    });
  }

  /** Coordinate Extraction: compute positional data from the selection's bounding rect. */
  function getSelectionTop(range) {
    const rect = range.getBoundingClientRect();
    const canvasRect = document.getElementById('doc-canvas').getBoundingClientRect();
    const scrollTop = document.getElementById('doc-canvas').scrollTop;
    return rect.top - canvasRect.top + scrollTop;
  }

  /** Node Injection: wraps the selection in a <span class="comment-anchor" data-id="..."> */
  function wrapSelectionWithAnchor(range, id) {
    const span = document.createElement('span');
    span.className = 'comment-anchor';
    span.dataset.id = id;
    try {
      range.surroundContents(span);
    } catch (err) {
      // Selection spans multiple elements; fall back to extracting + wrapping.
      const frag = range.extractContents();
      span.appendChild(frag);
      range.insertNode(span);
    }
    span.addEventListener('click', () => setActiveComment(id));
    return span;
  }

  function addComment(bodyText) {
    if (!pendingRange) return null;
    const id = nextId();
    const quote = pendingRange.toString();
    const top = getSelectionTop(pendingRange);

    wrapSelectionWithAnchor(pendingRange, id);

    comments.set(id, { id, quote, body: bodyText, top, resolved: false });
    pendingRange = null;
    renderCommentCards();
    HistoryEngine.scheduleSnapshot('added comment');
    return id;
  }

  function resolveComment(id) {
    const c = comments.get(id);
    if (!c) return;
    c.resolved = true;
    const anchor = document.querySelector(`.comment-anchor[data-id="${id}"]`);
    if (anchor) anchor.classList.add('resolved');
    renderCommentCards();
  }

  function deleteComment(id) {
    comments.delete(id);
    const anchor = document.querySelector(`.comment-anchor[data-id="${id}"]`);
    if (anchor) {
      const parent = anchor.parentNode;
      while (anchor.firstChild) parent.insertBefore(anchor.firstChild, anchor);
      anchor.remove();
    }
    renderCommentCards();
  }

  function setActiveComment(id) {
    document.querySelectorAll('.comment-anchor.active').forEach((el) => el.classList.remove('active'));
    document.querySelectorAll('.comment-card.active').forEach((el) => el.classList.remove('active'));
    const anchor = document.querySelector(`.comment-anchor[data-id="${id}"]`);
    const card = document.querySelector(`.comment-card[data-id="${id}"]`);
    if (anchor) anchor.classList.add('active');
    if (card) {
      card.classList.add('active');
      card.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }

  /** Layout Matching: position each card at the vertical height of its matching anchor span. */
  function renderCommentCards() {
    const list = document.getElementById('comment-list');
    list.innerHTML = '';

    const active = Array.from(comments.values()).filter((c) => !c.resolved);
    if (active.length === 0) {
      list.innerHTML = '<p class="side-panel-empty">Select text and click the comment icon to start a discussion.</p>';
      return;
    }

    // Re-measure top position from live DOM in case the layout shifted (pagination, edits).
    active
      .sort((a, b) => a.top - b.top)
      .forEach((c) => {
        const anchor = document.querySelector(`.comment-anchor[data-id="${c.id}"]`);
        if (anchor) c.top = getSelectionTop(rangeFromNode(anchor));

        const card = document.createElement('div');
        card.className = 'comment-card';
        card.dataset.id = c.id;
        card.style.top = `${c.top}px`;
        card.innerHTML = `
          <div class="comment-card-header">
            <div class="comment-avatar">U</div>
            <span class="comment-author">You</span>
          </div>
          <p class="comment-quote">"${escapeHtml(c.quote)}"</p>
          <p class="comment-body">${escapeHtml(c.body)}</p>
          <div class="comment-actions">
            <button class="resolve-btn" data-act="resolve">Resolve</button>
            <button data-act="delete">Delete</button>
          </div>
        `;
        card.querySelector('[data-act="resolve"]').addEventListener('click', () => resolveComment(c.id));
        card.querySelector('[data-act="delete"]').addEventListener('click', () => deleteComment(c.id));
        card.addEventListener('click', () => setActiveComment(c.id));
        list.appendChild(card);
      });
  }

  function rangeFromNode(node) {
    const r = document.createRange();
    r.selectNode(node);
    return r;
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function promptForCommentOnSelection() {
    if (!pendingRange) {
      alert('Select some text first, then click the comment button.');
      return;
    }
    const bodyText = window.prompt('Add a comment:');
    if (bodyText && bodyText.trim()) {
      addComment(bodyText.trim());
    }
  }

  return {
    bindSelectionListener,
    addComment,
    resolveComment,
    deleteComment,
    renderCommentCards,
    promptForCommentOnSelection,
  };
})();
