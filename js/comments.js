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
    return `xyz_${idCounter}${Date.now().toString().slice(-4)}`;
  }

  function bindSelectionListener() {
    const cv = document.getElementById('doc-canvas');
    if (!cv) return;

    cv.addEventListener('mouseup', () => {
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

  function wrapSelectionWithHighlight(range, commentId) {
    const span = document.createElement('span');
    span.className = 'comment-anchor active';
    span.dataset.commentId = commentId;

    try {
      range.surroundContents(span);
      return true;
    } catch (e) {
      // Fallback injection logic for nodes spanning bold/italic items
      try {
        const fragment = range.extractContents();
        span.appendChild(fragment);
        range.insertNode(span);
        return true;
      } catch (err) {
        console.error("Text highlight injection failed completely:", err);
        return false;
      }
    }
  }

  function promptForCommentOnSelection() {
    if (!pendingRange) {
      alert('Select some text first, then click the comment button.');
      return;
    }
    const bodyText = window.prompt('Add a comment:');
    if (bodyText && bodyText.trim()) {
      const cid = nextId();
      const quoteText = pendingRange.toString();

      if (wrapSelectionWithHighlight(pendingRange, cid)) {
        comments.set(cid, {
          id: cid,
          quote: quoteText,
          body: bodyText.trim(),
          resolved: false
        });
        
        pendingRange = null;
        window.getSelection().removeAllRanges();
        renderCommentCards();
      }
    }
  }

  function renderCommentCards() {
    const list = document.getElementById('comments-list');
    if (!list) return;
    list.innerHTML = '';

    comments.forEach((c) => {
      if (c.resolved) return;

      const card = document.createElement('div');
      card.className = 'comment-card';
      card.dataset.commentId = c.id;
      card.innerHTML = `
        <div class="comment-card-header">
          <div class="comment-avatar">U</div>
          <span class="comment-author">You</span>
        </div>
        <p class="comment-quote">"${escapeHtml(c.quote)}"</p>
        <p class="comment-body">${escapeHtml(c.body)}</p>
        <div class="comment-actions">
          <button class="resolve-btn" data-act="resolve">Resolve</button>
        </div>
      `;

      card.querySelector('[data-act="resolve"]').addEventListener('click', () => {
        c.resolved = true;
        const anchor = document.querySelector(`span[data-comment-id="${c.id}"]`);
        if (anchor) {
          anchor.className = 'comment-anchor resolved';
        }
        card.remove();
      });

      list.appendChild(card);
    });
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  return {
    bindSelectionListener,
    promptForCommentOnSelection,
    renderCommentCards
  };
})();
