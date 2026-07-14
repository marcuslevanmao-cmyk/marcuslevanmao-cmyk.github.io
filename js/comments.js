// js/comments.js
/**
 * comments.js — Contextual Annotation Engine with Floating Margin Cards
 */
const CommentsEngine = (() => {
  const comments = new Map();
  let pendingRange = null;
  let idCounter = 0;
  let activePopup = null;

  // ------------------------------
  // 1. Selection Listener (now attached to the editable page)
  // ------------------------------
  function bindSelectionListener() {
    // Use event delegation on the pages-container, because the .doc-page is recreated on tab switches
    const pagesContainer = document.getElementById('pages-container');
    if (!pagesContainer) return;

    pagesContainer.addEventListener('mouseup', (e) => {
      // Check if the click is inside a .doc-page
      const page = e.target.closest('.doc-page');
      if (!page) {
        pendingRange = null;
        reflectAddCommentButtonState();
        return;
      }

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

      // Ensure the selection is entirely inside the page
      const container = range.commonAncestorContainer;
      const insidePage = container.nodeType === Node.ELEMENT_NODE
        ? container.closest('.doc-page')
        : container.parentElement?.closest('.doc-page');

      if (insidePage) {
        pendingRange = range.cloneRange();
      } else {
        pendingRange = null;
      }
      reflectAddCommentButtonState();
    });

    // Clear selection when clicking outside the page
    document.addEventListener('mousedown', (e) => {
      if (!e.target.closest('.doc-page') && !e.target.closest('.comment-floating-composer')) {
        pendingRange = null;
        reflectAddCommentButtonState();
      }
    });
  }

  function reflectAddCommentButtonState() {
    const btn = document.getElementById('toolbar-comment-btn');
    if (btn) btn.disabled = !pendingRange;
  }

  // ------------------------------
  // 2. Floating Composer
  // ------------------------------
  function showFloatingComposer(cid, quote, rangeRect) {
    if (activePopup) {
      activePopup.remove();
      activePopup = null;
    }

    const popup = document.createElement('div');
    popup.className = 'comment-floating-composer';
    // Position near the selection, but keep it in view
    let left = rangeRect.left + window.scrollX;
    let top = rangeRect.bottom + window.scrollY + 10;
    // Ensure it doesn't go off-screen
    if (left + 340 > window.innerWidth) left = window.innerWidth - 350;
    if (top + 200 > window.innerHeight) top = rangeRect.top + window.scrollY - 200;

    popup.style.position = 'fixed';
    popup.style.left = left + 'px';
    popup.style.top = top + 'px';
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

    const cleanUp = () => {
      removeAnchor(cid);
      closePopup();
      pendingRange = null;
      reflectAddCommentButtonState();
    };

    popup.querySelector('.cancel-btn').addEventListener('click', cleanUp);
    popup.querySelector('.close-popup-btn').addEventListener('click', cleanUp);

    popup.querySelector('.save-btn').addEventListener('click', () => {
      const body = textarea.value.trim();
      if (!body) return;

      const activeTabId = EditorEngine.getActiveTabId();
      const canvasEl = document.getElementById('doc-canvas');
      const canvasRect = canvasEl.getBoundingClientRect();
      // Use the range's bounding rect relative to the canvas (with scroll)
      const relativeTop = rangeRect.top - canvasRect.top + window.scrollY;

      comments.set(cid, {
        id: cid,
        tabId: activeTabId,
        quote,
        body,
        resolved: false,
        topOffset: relativeTop
      });

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

  function removeAnchor(cid) {
    document.querySelectorAll(`span[data-comment-id="${cid}"]`).forEach(el => {
      el.replaceWith(...el.childNodes);
    });
  }

  function promptForCommentOnSelection() {
    if (!pendingRange) return;

    const textQuote = pendingRange.toString().trim();
    if (!textQuote) return;

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

    const rect = span.getBoundingClientRect();
    window.getSelection().removeAllRanges();
    showFloatingComposer(cid, textQuote, rect);
  }

  // ------------------------------
  // 3. Hanging Margin Cards Render
  // ------------------------------
  function renderCommentCards() {
    const activeTabId = EditorEngine.getActiveTabId();

    // Remove existing container if present
    let floatingContainer = document.getElementById('margin-comments-container');
    if (floatingContainer) {
      floatingContainer.remove();
    }

    floatingContainer = document.createElement('div');
    floatingContainer.id = 'margin-comments-container';
    floatingContainer.style.position = 'absolute';
    floatingContainer.style.right = '-310px';
    floatingContainer.style.top = '0';
    floatingContainer.style.width = '280px';
    floatingContainer.style.pointerEvents = 'auto';
    document.getElementById('doc-canvas').appendChild(floatingContainer);

    const sidebarList = document.getElementById('comments-list');
    if (sidebarList) sidebarList.innerHTML = '';

    const activeComments = [];
    comments.forEach((c, key) => {
      if (!c.resolved && c.tabId === activeTabId) {
        const anchorExists = document.querySelector(`span[data-comment-id="${c.id}"]`);
        if (anchorExists) {
          activeComments.push([key, c]);
        }
      }
    });

    if (activeComments.length === 0) {
      if (sidebarList) {
        sidebarList.innerHTML = `
          <div style="padding: 24px; text-align: center; color: var(--text-secondary); font-size: 14px;">
            No comments on this tab
          </div>
        `;
      }
      return;
    }

    activeComments.forEach(([key, c]) => {
      // Margin card
      const card = document.createElement('div');
      card.className = 'comment-card';
      card.style.position = 'absolute';
      card.style.top = `${c.topOffset}px`;
      card.style.width = '260px';
      card.style.background = '#fff';
      card.style.borderRadius = '8px';
      card.style.padding = '12px';
      card.style.border = '1px solid #dadce0';
      card.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
      card.style.zIndex = '10';

      card.innerHTML = `
        <div class="comment-card-header">
          <div class="comment-avatar">M</div>
          <span class="comment-author">Marcus Le Van Mao</span>
        </div>
        <p class="comment-quote">“${c.quote}”</p>
        <p class="comment-body">${c.body}</p>
        <div class="comment-actions">
          <button data-act="resolve">Resolve</button>
          <button data-act="delete" class="delete-btn">Delete</button>
        </div>
      `;

      card.addEventListener('mouseenter', () => {
        document.querySelectorAll(`span[data-comment-id="${c.id}"]`).forEach(el => el.classList.add('active'));
      });
      card.addEventListener('mouseleave', () => {
        document.querySelectorAll(`span[data-comment-id="${c.id}"]`).forEach(el => el.classList.remove('active'));
      });

      card.querySelector('[data-act="resolve"]').addEventListener('click', () => {
        c.resolved = true;
        renderCommentCards();
      });

      card.querySelector('[data-act="delete"]').addEventListener('click', () => {
        comments.delete(key);
        removeAnchor(c.id);
        renderCommentCards();
      });

      floatingContainer.appendChild(card);

      // Sidebar list item
      if (sidebarList) {
        const listItem = document.createElement('div');
        listItem.className = 'comment-card';
        listItem.style.marginBottom = '10px';
        listItem.innerHTML = `
          <div class="comment-card-header">
            <div class="comment-avatar">M</div>
            <span class="comment-author">Marcus Le Van Mao</span>
          </div>
          <p class="comment-quote">“${c.quote}”</p>
          <p class="comment-body">${c.body}</p>
          <div class="comment-actions">
            <button data-act="resolve-sidebar">Resolve</button>
            <button data-act="delete-sidebar" class="delete-btn">Delete</button>
          </div>
        `;
        listItem.querySelector('[data-act="resolve-sidebar"]').addEventListener('click', () => {
          c.resolved = true;
          renderCommentCards();
        });
        listItem.querySelector('[data-act="delete-sidebar"]').addEventListener('click', () => {
          comments.delete(key);
          removeAnchor(c.id);
          renderCommentCards();
        });
        sidebarList.appendChild(listItem);
      }
    });
  }

  // ------------------------------
  // 4. Public API
  // ------------------------------
  return {
    bindSelectionListener,
    promptForCommentOnSelection,
    renderCommentCards,
    closePopup
  };
})();
