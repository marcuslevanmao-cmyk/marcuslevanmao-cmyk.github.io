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
  
  let left = rangeRect.left + window.scrollX;
  let top = rangeRect.bottom + window.scrollY + 10;
  if (left + 340 > window.innerWidth) left = window.innerWidth - 350;
  if (top + 200 > window.innerHeight) top = rangeRect.top + window.scrollY - 200;

  popup.style.position = 'fixed';
  popup.style.left = left + 'px';
  popup.style.top = top + 'px';
  popup.style.width = '340px';
  popup.style.zIndex = '1000';

  // ─── NEW GOOGLE DOCS STYLE HOVER CARD ───
  popup.innerHTML = `
    <div class="docs-hover-card">
      <div class="card-header">
        <div class="avatar">M</div>
        <span class="user-name">Marcus Le Van Mao élève</span>
      </div>
      
      <div class="card-input-container">
        <input type="text" class="docs-pill-input" placeholder="Comment or add others with @">
      </div>
      
      <div class="card-actions">
        <button class="btn-text-cancel">Cancel</button>
        <button class="btn-filled-comment" disabled>Comment</button>
      </div>
    </div>
  `;

  document.body.appendChild(popup);
  activePopup = popup;

  const textarea = popup.querySelector('.docs-pill-input');
  const commentBtn = popup.querySelector('.btn-filled-comment');
  const cancelBtn = popup.querySelector('.btn-text-cancel');
  
  textarea.focus();

  // Enable comment button when text is typed
  textarea.addEventListener('input', () => {
    if (textarea.value.trim()) {
      commentBtn.disabled = false;
      commentBtn.classList.add('active');
    } else {
      commentBtn.disabled = true;
      commentBtn.classList.remove('active');
    }
  });

  const cleanUp = () => {
    removeAnchor(cid);
    closePopup();
    pendingRange = null;
    reflectAddCommentButtonState();
  };

  cancelBtn.addEventListener('click', cleanUp);
  popup.querySelector('.close-popup-btn')?.addEventListener('click', cleanUp);

  commentBtn.addEventListener('click', () => {
    const body = textarea.value.trim();
    if (!body) return;

    const activeTabId = EditorEngine.getActiveTabId();
    const canvasEl = document.getElementById('doc-canvas');
    const canvasRect = canvasEl.getBoundingClientRect();
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
  const sidebarList = document.getElementById('comments-list');
  if (!sidebarList) return;
  sidebarList.innerHTML = '';

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
    sidebarList.innerHTML = `
      <div class="empty-state">
        <p>Start a discussion</p>
        <button class="primary-add-btn" id="sidebar-add-comment-btn">Add comment</button>
      </div>
    `;
    const addBtn = sidebarList.querySelector('#sidebar-add-comment-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => promptForCommentOnSelection());
    }
    return;
  }

  activeComments.forEach(([key, c]) => {
    const card = document.createElement('div');
    card.className = 'comment-card';
    card.style.marginBottom = '12px';
    card.style.borderRadius = '8px';
    card.style.border = '1px solid #e0e0e0';
    card.style.padding = '14px';
    card.style.background = '#ffffff';
    
    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; margin-bottom:6px; font-size:13px;">
        <span style="font-weight:500; color:#1f1f1f;">You</span>
        <span style="color:#5f6368; font-size:12px;">${new Date().toLocaleDateString()}</span>
      </div>
      <div style="font-style:italic; color:#5f6368; font-size:13px; margin-bottom:6px; background:#f8f9fa; padding:6px 8px; border-left:2px solid #dadce0;">
        “${c.quote}”
      </div>
      <div style="font-size:14px; color:#1f1f1f; margin-bottom:10px;">${c.body}</div>
      <div style="display:flex; gap:12px;">
        <button data-act="resolve" style="background:none; border:none; color:#0b57d0; font-size:12px; font-weight:500; cursor:pointer;">Resolve</button>
        <button data-act="delete" style="background:none; border:none; color:#ea4335; font-size:12px; font-weight:500; cursor:pointer;">Delete</button>
      </div>
    `;

    card.querySelector('[data-act="resolve"]').addEventListener('click', () => {
      c.resolved = true;
      document.querySelectorAll(`span[data-comment-id="${c.id}"]`).forEach(el => {
        el.className = 'comment-anchor resolved';
      });
      renderCommentCards();
    });

    card.querySelector('[data-act="delete"]').addEventListener('click', () => {
      document.querySelectorAll(`span[data-comment-id="${c.id}"]`).forEach(el => {
        el.replaceWith(...el.childNodes);
      });
      comments.delete(key);
      renderCommentCards();
    });

    sidebarList.appendChild(card);
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
