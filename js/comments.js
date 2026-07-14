/**
 * comments.js — Contextual Annotation Engine with Floating Composer
 */
const CommentsEngine = (() => {
  const comments = new Map();          // Map<commentId, { id, quote, body, resolved }>
  let pendingRange = null;             // Currently selected range for a new comment
  let idCounter = 0;
  let activePopup = null;              // Reference to the floating composer element

  // ------------------------------
  // 1. Selection Listener
  // ------------------------------
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
      const insidePage = node.nodeType === Node.ELEMENT_NODE
        ? node.closest('.doc-page')
        : node.parentElement?.closest('.doc-page');

      if (insidePage) {
        pendingRange = range.cloneRange();
      } else {
        pendingRange = null;
      }
      reflectAddCommentButtonState();
    });
  }

  // Enable/disable the toolbar comment button based on selection
  function reflectAddCommentButtonState() {
    const btn = document.getElementById('toolbar-comment-btn');
    if (btn) btn.disabled = !pendingRange;
    // Also update any "Add comment" button in the sidebar empty state
    const sidebarBtn = document.querySelector('.cs-empty-state .btn-primary');
    if (sidebarBtn) sidebarBtn.disabled = !pendingRange;
  }

  // ------------------------------
  // 2. Floating Composer
  // ------------------------------
  function showFloatingComposer(cid, quote, rangeRect) {
    // Remove any existing popup
    if (activePopup) {
      activePopup.remove();
      activePopup = null;
    }

    const popup = document.createElement('div');
    popup.className = 'comment-floating-composer';
    popup.style.position = 'fixed';
    // Position near the selection – slightly below and to the left
    popup.style.left = Math.min(rangeRect.left, window.innerWidth - 360) + 'px';
    popup.style.top = (rangeRect.bottom + 10) + 'px';
    popup.style.width = '340px';
    popup.style.zIndex = '1000';
    popup.innerHTML = `
      <div class="comment-floating-header">
        <span>Add comment</span>
        <button class="close-popup-btn" title="Close">×</button>
      </div>
      <div class="comment-floating-quote">“${quote}”</div>
      <textarea placeholder="Write your comment…"></textarea>
      <div class="comment-floating-actions">
        <button class="btn-secondary cancel-btn">Cancel</button>
        <button class="btn-primary save-btn">Comment</button>
      </div>
    `;

    document.body.appendChild(popup);
    activePopup = popup;

    const textarea = popup.querySelector('textarea');
    textarea.focus();

    // Cancel
    popup.querySelector('.cancel-btn').addEventListener('click', () => {
      removeAnchor(cid);
      closePopup();
      pendingRange = null;
      reflectAddCommentButtonState();
    });

    // Close button (×)
    popup.querySelector('.close-popup-btn').addEventListener('click', () => {
      removeAnchor(cid);
      closePopup();
      pendingRange = null;
      reflectAddCommentButtonState();
    });

    // Save
    popup.querySelector('.save-btn').addEventListener('click', () => {
      const body = textarea.value.trim();
      if (!body) return;

      // Store the comment
      comments.set(cid, { id: cid, quote, body, resolved: false });

      // Refresh the sidebar list
      renderCommentCards();

      closePopup();
      pendingRange = null;
      reflectAddCommentButtonState();
    });
  }

  function closePopup() {
    if (activePopup) {
      activePopup.remove();
      activePopup = null;
    }
  }

  // Remove the comment anchor span (if comment is cancelled)
  function removeAnchor(cid) {
    document.querySelectorAll(`span[data-comment-id="${cid}"]`).forEach(el => {
      el.replaceWith(...el.childNodes);
    });
  }

  // ------------------------------
  // 3. Public: Prompt for Comment
  // ------------------------------
  function promptForCommentOnSelection() {
    if (!pendingRange) return;

    const textQuote = pendingRange.toString().trim();
    if (!textQuote) return;

    // Create a unique ID for this comment
    idCounter++;
    const cid = `comm_${idCounter}_${Date.now().toString().slice(-3)}`;

    // Wrap the selected text with a comment anchor span
    const span = document.createElement('span');
    span.className = 'comment-anchor active';
    span.dataset.commentId = cid;

    try {
      pendingRange.surroundContents(span);
    } catch (e) {
      // Fallback if range spans multiple nodes
      const frag = pendingRange.extractContents();
      span.appendChild(frag);
      pendingRange.insertNode(span);
    }

    // Clear the selection
    window.getSelection().removeAllRanges();

    // Get the bounding rect of the range for positioning the popup
    const rect = pendingRange.getBoundingClientRect();
    // Reset pendingRange so we don't reuse it (but we need the rect)
    pendingRange = null;
    showFloatingComposer(cid, textQuote, rect);
    reflectAddCommentButtonState();
  }

  // ------------------------------
  // 4. Render Comments in Sidebar
  // ------------------------------
  function renderCommentCards() {
    const list = document.getElementById('comments-list');
    if (!list) return;

    // Remove any existing content
    list.innerHTML = '';

    // Collect active (non-resolved) comments that still have an anchor in the doc
    const activeComments = [];
    comments.forEach((c, key) => {
      if (!c.resolved) {
        const anchorExists = document.querySelector(`span[data-comment-id="${c.id}"]`);
        if (anchorExists) {
          activeComments.push([key, c]);
        }
      }
    });

    if (activeComments.length === 0) {
      // Show empty state with "Add comment" button
      list.innerHTML = `
        <div class="cs-empty-state">
          <p>Start a discussion</p>
          <button class="btn-primary" style="width:100%;" ${pendingRange ? '' : 'disabled'}>
            Add comment
          </button>
        </div>
      `;
      const addBtn = list.querySelector('.btn-primary');
      if (addBtn) {
        addBtn.addEventListener('click', () => {
          promptForCommentOnSelection();
        });
      }
      reflectAddCommentButtonState();
      return;
    }

    // Render each comment card
    activeComments.forEach(([key, c]) => {
      const card = document.createElement('div');
      card.className = 'comment-card';
      card.innerHTML = `
        <div class="comment-card-header">
          <div class="comment-avatar">U</div>
          <span class="comment-author">You</span>
        </div>
        <p class="comment-quote">“${c.quote}”</p>
        <p class="comment-body">${c.body}</p>
        <div class="comment-actions">
          <button data-act="resolve">Resolve</button>
          <button data-act="delete" style="color: #ea4335;">Delete</button>
        </div>
      `;

      // Resolve
      card.querySelector('[data-act="resolve"]').addEventListener('click', () => {
        c.resolved = true;
        document.querySelectorAll(`span[data-comment-id="${c.id}"]`).forEach(el => {
          el.className = 'comment-anchor resolved';
        });
        renderCommentCards(); // Re-render to remove it from list
      });

      // Delete
      card.querySelector('[data-act="delete"]').addEventListener('click', () => {
        document.querySelectorAll(`span[data-comment-id="${c.id}"]`).forEach(el => {
          el.replaceWith(...el.childNodes);
        });
        comments.delete(key);
        renderCommentCards();
      });

      list.appendChild(card);
    });

    // AUTOMATICALLY OPEN SIDEBAR: If there are active comments, show the sidebar
    const sidebar = document.getElementById('comments-sidebar');
    if (sidebar && activeComments.length > 0) {
        sidebar.hidden = false;
    }
  }

  // ------------------------------
  // 5. Public API
  // ------------------------------
  return {
    bindSelectionListener,
    promptForCommentOnSelection,
    renderCommentCards,
  };
})();
