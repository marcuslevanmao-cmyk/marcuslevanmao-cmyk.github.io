/**
 * comments.js — Contextual Annotation Engine with Floating Margin Cards
 */
const CommentsEngine = (() => {
  const comments = new Map();          // Map<commentId, { id, tabId, quote, body, resolved, topOffset }>
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

  function reflectAddCommentButtonState() {
    const btn = document.getElementById('toolbar-comment-btn');
    if (btn) btn.disabled = !pendingRange;
    const sidebarBtn = document.querySelector('.cs-empty-state .btn-primary');
    if (sidebarBtn) sidebarBtn.disabled = !pendingRange;
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
    popup.style.position = 'fixed';
    popup.style.left = Math.min(rangeRect.left, window.innerWidth - 360) + 'px';
    popup.style.top = (rangeRect.bottom + window.scrollY + 10) + 'px';
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
      const relativeTop = rangeRect.top - canvasRect.top;

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

    let floatingContainer = document.getElementById('margin-comments-container');
    if (!floatingContainer) {
      floatingContainer = document.createElement('div');
      floatingContainer.id = 'margin-comments-container';
      floatingContainer.style.position = 'absolute';
      floatingContainer.style.right = '-310px'; // Hang directly on the blank right side of the sheet page!
      floatingContainer.style.top = '0';
      floatingContainer.style.width = '280px';
      floatingContainer.style.pointerEvents = 'auto';
      document.getElementById('doc-canvas').appendChild(floatingContainer);
    }
    floatingContainer.innerHTML = '';

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
          <div class="cs-empty-state" style="padding: 24px; text-align: center;">
            <p style="color: var(--text-secondary); font-size: 14px;">No comments on this tab</p>
          </div>
        `;
      }
      return;
    }

    activeComments.forEach(([key, c]) => {
      const card = document.createElement('div');
      card.className = 'comment-card';
      card.style.position = 'absolute';
      card.style.top = `${c.topOffset}px`;
      card.style.width = '260px';
      card.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
      card.style.background = '#fff';
      card.style.borderRadius = '8px';
      card.style.padding = '12px';
      card.style.border = '1px solid #dadce0';
      card.style.zIndex = '10';

      card.innerHTML = `
        <div class="comment-card-header" style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
          <div class="comment-avatar" style="width:24px; height:24px; border-radius:50%; background:#1a73e8; color:white; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:bold;">M</div>
          <span class="comment-author" style="font-weight:600; font-size:13px; color:#202124;">Marcus Le Van Mao</span>
        </div>
        <p class="comment-quote" style="font-size:12px; color:var(--text-secondary); border-left:2px solid #1a73e8; padding-left:6px; margin:0 0 6px 0; font-style:italic;">“${c.quote}”</p>
        <p class="comment-body" style="font-size:13px; margin:0 0 10px 0; color:#202124;">${c.body}</p>
        <div class="comment-actions" style="display:flex; gap:12px; font-size:12px;">
          <button data-act="resolve" style="background:none; border:none; color:#1a73e8; cursor:pointer; font-weight:500; padding:0;">Resolve</button>
          <button data-act="delete" style="background:none; border:none; color:#ea4335; cursor:pointer; font-weight:500; padding:0;">Delete</button>
        </div>
      `;

      card.addEventListener('mouseenter', () => {
        document.querySelectorAll(`span[data-comment-id="${c.id}"]`).forEach(el => el.classList.add('active'));
      });
      card.addEventListener('mouseleave', () => {
        document.querySelectorAll(`span[data-comment-id="${c.id}"]`).forEach(el => el.classList.remove('active'));
      });

      const handleResolve = () => {
        c.resolved = true;
        document.querySelectorAll(`span
