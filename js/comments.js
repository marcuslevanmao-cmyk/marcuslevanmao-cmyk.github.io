// js/comments.js
/**
 * comments.js — Google Docs-Style Persistent Margin Track with LocalStorage
 */
const CommentsEngine = (() => {
  const comments = new Map();
  let pendingRange = null;
  let idCounter = 0;
  let activePopup = null;

  // Load saved comments and synchronized tab states on script boot
  loadCommentsFromStorage();

  // ------------------------------
  // 1. Selection & Gutter Init
  // ------------------------------
  function bindSelectionListener() {
    const pagesContainer = document.getElementById('pages-container');
    if (!pagesContainer) return;

    // Enforce container relative layout context for absolute margin positioning
    pagesContainer.style.position = 'relative';

    pagesContainer.addEventListener('mouseup', (e) => {
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

    // Dismiss composer popups when clicking out on empty canvas workspace
    document.addEventListener('mousedown', (e) => {
      if (!e.target.closest('.doc-page') && 
          !e.target.closest('.comment-floating-composer') &&
          !e.target.closest('#add-comment-btn') &&
          !e.target.closest('#comment-btn') &&
          !e.target.closest('#floating-comment-btn')) {
        closePopup();
      }
    });
  }

  function reflectAddCommentButtonState() {
    const btn = document.getElementById('add-comment-btn');
    if (btn) btn.disabled = !pendingRange;
  }

  // ------------------------------
  // 2. Context Input Floating Popup
  // ------------------------------
  function showFloatingComposer(cid, quote, rangeRect) {
    closePopup();

    const popup = document.createElement('div');
    popup.className = 'comment-floating-composer';
    
    let left = rangeRect.left + window.scrollX;
    let top = rangeRect.bottom + window.scrollY + 10;
    if (left + 340 > window.innerWidth) left = window.innerWidth - 350;

    popup.style.position = 'fixed';
    popup.style.left = left + 'px';
    popup.style.top = top + 'px';
    popup.style.width = '340px';
    popup.style.zIndex = '2000';

    popup.innerHTML = `
      <div class="docs-hover-card" style="background:#fff; border:1px solid #dadce0; border-radius:12px; padding:16px; box-shadow:0 4px 16px rgba(0,0,0,0.15);">
        <div class="card-header" style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
          <div class="avatar" style="width:32px; height:32px; border-radius:50%; background-color:#5f6368; display:flex; align-items:center; justify-content:center;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C9.24 2 7 4.24 7 7C7 9.76 9.24 12 12 12C14.76 12 17 9.76 17 7C17 4.24 14.76 2 12 2ZM12 14C8.66 14 2 15.67 2 19V22H22V19C22 15.67 15.34 14 12 14Z" fill="white"/>
            </svg>
          </div>
          <span class="user-name" style="font-size:14px; font-weight:500; color:#1f1f1f;">You</span>
        </div>
        <div class="card-input-container" style="margin-bottom:12px;">
          <input type="text" class="docs-pill-input" placeholder="Comment or add others with @" style="width:100%; border:1px solid #0b57d0; border-radius:24px; padding:10px 16px; font-size:14px; outline:none;">
        </div>
        <div class="card-actions" style="display:flex; justify-content:flex-end; gap:8px;">
          <button class="btn-text-cancel" style="background:none; border:none; color:#5f6368; padding:8px 16px; cursor:pointer; font-size:14px; font-weight:500;">Cancel</button>
          <button class="btn-filled-comment" disabled style="background:#c2e7ff; color:#041e49; border:none; border-radius:24px; padding:8px 20px; cursor:default; font-size:14px; font-weight:500;">Comment</button>
        </div>
      </div>
    `;

    document.body.appendChild(popup);
    activePopup = popup;

    const textarea = popup.querySelector('.docs-pill-input');
    const commentBtn = popup.querySelector('.btn-filled-comment');
    const cancelBtn = popup.querySelector('.btn-text-cancel');
    
    textarea.focus();

    textarea.addEventListener('input', () => {
      if (textarea.value.trim()) {
        commentBtn.disabled = false;
        commentBtn.style.background = '#0b57d0';
        commentBtn.style.color = '#ffffff';
        commentBtn.style.cursor = 'pointer';
      } else {
        commentBtn.disabled = true;
        commentBtn.style.background = '#c2e7ff';
        commentBtn.style.color = '#041e49';
        commentBtn.style.cursor = 'default';
      }
    });

    cancelBtn.addEventListener('click', () => {
      removeAnchor(cid);
      closePopup();
    });

    commentBtn.addEventListener('click', () => {
      const body = textarea.value.trim();
      if (!body) return;

      const activeTabId = EditorEngine.getActiveTabId();
      comments.set(cid, {
        id: cid,
        tabId: activeTabId,
        quote,
        body,
        resolved: false
      });

      saveCommentsToStorage();
      renderCommentCards();
      closePopup();
    });
  }

  function closePopup() {
    if (activePopup) {
      activePopup.remove();
      activePopup = null;
    }
    pendingRange = null;
    reflectAddCommentButtonState();
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
  // 3. Persistent Gutter Track Rendering
  // ------------------------------
  function renderCommentCards() {
    const container = document.getElementById('pages-container');
    if (!container) return;

    // Purge or rebuild dedicated absolute canvas overlay track
    let track = document.getElementById('margin-comments-track');
    if (track) track.remove();

    track = document.createElement('div');
    track.id = 'margin-comments-track';
    track.style.position = 'absolute';
    track.style.top = '0';
    track.style.left = '0';
    track.style.width = '100%';
    track.style.height = '100%';
    track.style.pointerEvents = 'none'; // allow scroll/clicks behind empty spaces
    container.appendChild(track);

    const activeTabId = EditorEngine.getActiveTabId();

    comments.forEach((c, key) => {
      if (c.resolved || c.tabId !== activeTabId) return;

      const anchor = document.querySelector(`span[data-comment-id="${c.id}"]`);
      if (!anchor) return;

      const page = anchor.closest('.doc-page');
      if (!page) return;

      // Lock positions precisely inline with text markers relative to viewport scrolling
      const containerRect = container.getBoundingClientRect();
      const anchorRect = anchor.getBoundingClientRect();

      const cardLeft = page.offsetLeft + page.offsetWidth + 32; 
      const cardTop = (anchorRect.top - containerRect.top) + container.scrollTop;

      const card = document.createElement('div');
      card.className = 'comment-margin-card';
      card.style.position = 'absolute';
      card.style.left = `${cardLeft}px`;
      card.style.top = `${cardTop}px`;
      card.style.width = '290px';
      card.style.backgroundColor = '#ffffff';
      card.style.border = '1px solid #dadce0';
      card.style.borderRadius = '8px';
      card.style.padding = '12px';
      card.style.boxShadow = '0 1px 3px rgba(60,64,67,0.15), 0 4px 8px rgba(60,64,67,0.1)';
      card.style.pointerEvents = 'auto'; // allow inner interaction
      card.style.zIndex = '100';

      card.innerHTML = `
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px; font-size:13px;">
          <div style="width:20px; height:20px; border-radius:50%; background-color:#5f6368; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C9.24 2 7 4.24 7 7C7 9.76 9.24 12 12 12C14.76 12 17 9.76 17 7C17 4.24 14.76 2 12 2ZM12 14C8.66 14 2 15.67 2 19V22H22V19C22 15.67 15.34 14 12 14Z" fill="white"/>
            </svg>
          </div>
          <span style="font-weight:500; color:#1f1f1f;">You</span>
          <span style="color:#5f6368; font-size:11px; margin-left:auto;">Saved</span>
        </div>
        <div style="font-style:italic; color:#5f6368; font-size:12px; margin-bottom:6px; background:#f8f9fa; padding:4px 6px; border-left:2px solid #dadce0; max-height:36px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
          “${c.quote}”
        </div>
        <div style="font-size:13px; color:#1f1f1f; margin-bottom:8px; word-break:break-word; line-height:1.4;">${c.body}</div>
        <div style="display:flex; gap:12px;">
          <button data-act="resolve" style="background:none; border:none; color:#0b57d0; font-size:12px; font-weight:500; cursor:pointer; padding:0;">Resolve</button>
          <button data-act="delete" style="background:none; border:none; color:#ea4335; font-size:12px; font-weight:500; cursor:pointer; padding:0;">Delete</button>
        </div>
      `;

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

  // ------------------------------
  // 4. LocalStorage Sync Layer
  // ------------------------------
  function saveCommentsToStorage() {
    localStorage.setItem('docs_margin_comments', JSON.stringify(Array.from(comments.entries())));
    // Back up the current HTML structure containing selection anchors
    if (typeof EditorEngine !== 'undefined') {
      EditorEngine.saveCurrentTabContent();
      localStorage.setItem('docs_tab_contents', JSON.stringify(EditorEngine.getTabs()));
    }
  }

  function loadCommentsFromStorage() {
    try {
      const storedComm = localStorage.getItem('docs_margin_comments');
      if (storedComm) {
        const parsed = JSON.parse(storedComm);
        comments.clear();
        parsed.forEach(([k, v]) => comments.set(k, v));
      }
      
      const storedTabs = localStorage.getItem('docs_tab_contents');
      if (storedTabs && typeof EditorEngine !== 'undefined') {
        const liveTabs = EditorEngine.getTabs();
        const loaded = JSON.parse(storedTabs);
        liveTabs.length = 0;
        loaded.forEach(t => liveTabs.push(t));
      }
    } catch (e) {
      console.warn("Storage sync recovery fallback active", e);
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
