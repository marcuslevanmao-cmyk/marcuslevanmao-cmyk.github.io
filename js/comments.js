/**
 * comments.js — The Annotation Engine
 * Binds dynamic textual ranges directly to UI components on the right margin.
 */

const CommentsEngine = (() => {
  const comments = new Map();
  let pendingRange = null;
  let idCounter = 0;

  function nextId() {
    idCounter += 1;
    return `comment_${idCounter}_${Date.now().toString().slice(-4)}`;
  }

  function bindSelectionListener() {
    const canvas = document.getElementById('doc-canvas');
    if (!canvas) return;

    canvas.addEventListener('mouseup', () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
        return;
      }

      const range = sel.getRangeAt(0);
      if (range.toString().trim() === '') return;

      const container = range.commonAncestorContainer;
      const page = container.nodeType === Node.ELEMENT_NODE
        ? container.closest('.doc-page')
        : container.parentElement?.closest('.doc-page');

      if (!page) {
        pendingRange = null;
        return;
      }

      pendingRange = range.cloneRange();
    });
  }

  function wrapSelectionWithAnchor(range, commentId) {
    if (!range) return false;

    const span = document.createElement('span');
    span.className = 'comment-anchor active';
    span.dataset.commentId = commentId;
    span.setAttribute('title', 'Click to view comment');

    try {
      // Safe non-destructive injection
      range.surroundContents(span);
      return true;
    } catch (e) {
      // Fallback for complex nodes spanning multiple blocks
      const fragment = range.extractContents();
      span.appendChild(fragment);
      range.insertNode(span);
      return true;
    }
  }

  function promptForCommentOnSelection() {
    if (!pendingRange) {
      alert('Highlight text inside your document first to leave a comment!');
      return;
    }

    const bodyText = window.prompt('Add comment text:');
    if (!bodyText || !bodyText.trim()) return;

    const commentId = nextId();
    const selectedText = pendingRange.toString();

    const success = wrapSelectionWithAnchor(pendingRange, commentId);
    if (success) {
      comments.set(commentId, {
        id: commentId,
        quote: selectedText,
        body: bodyText.trim(),
        resolved: false
      });

      pendingRange = null;
      window.getSelection().removeAllRanges();
      renderCommentCards();
    }
  }

  function renderCommentCards() {
    const container = document.getElementById('comments-container');
    if (!container) return;
    container.innerHTML = '';

    comments.forEach((c) => {
      if (c.resolved) return;

      const card = document.createElement('div');
      card.className = 'comment-card';
      card.dataset.commentId = c.id;
      card.innerHTML = `
        <div class="comment-card-header">
          <div class="comment-avatar">U</div>
          <span class="comment-author">User</span>
        </div>
        <p class="comment-quote">"${c.quote}"</p>
        <p class="comment-body">${c.body}</p>
        <div class="comment-actions">
          <button class="resolve-btn" data-action="resolve">Resolve</button>
        </div>
      `;

      card.querySelector('[data-action="resolve"]').addEventListener('click', () => {
        c.resolved = true;
        const anchor = document.querySelector(`span[data-comment-id="${c.id}"]`);
        if (anchor) anchor.className = 'comment-anchor resolved';
        card.remove();
      });

      container.appendChild(card);
    });
  }

  return {
    bindSelectionListener,
    promptForCommentOnSelection,
    renderCommentCards
  };
})();
