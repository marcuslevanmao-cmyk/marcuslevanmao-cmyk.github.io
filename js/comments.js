// js/comments.js
/**
 * comments.js — Google Docs Persistent Margin Track & Storage Engine
 */
const CommentsEngine = (() => {
  const comments = new Map();
  let pendingRange = null;
  let idCounter = 0;
  let activePopup = null;

  // Sync internal map container from local persistence layer immediately
  (() => {
    try {
      const storedComm = localStorage.getItem('docs_margin_comments');
      if (storedComm) {
        const parsed = JSON.parse(storedComm);
        parsed.forEach(([k, v]) => comments.set(k, v));
        
        // Find highest counter prefix index to prevent unique key ID collisions
        parsed.forEach(([k]) => {
          const parts = k.split('_');
          if (parts[1]) {
            const val = parseInt(parts[1], 10);
            if (val > idCounter) idCounter = val;
          }
        });
      }
    } catch (e) {
      console.warn("Storage sync recovery fallback active", e);
    }
  })();

  function bindSelectionListener() {
    const pagesContainer = document.getElementById('pages-container');
    if (!pagesContainer) return;

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

  function showFloatingComposer(cid, quote, rangeRect) {
    closePopup();

    const popup = document.createElement('div');
    popup.className = 'comment-floating-composer';
    
    let left = rangeRect.left + window.scrollX;
    let top = rangeRect.bottom + window.scrollY + 10;
    if (left + 340 > window.innerWidth) left = window.innerWidth - 350;

    popup.style = `position:fixed; left:${left}px; top:${top}px; width:340px; z-index:2000; pointer-events:auto;`;

    popup.innerHTML = `
      <div style="background:#fff; border:1px solid #dadce0; border-radius:12px; padding:16px; box-shadow:0 4px 16px rgba(0,0,0,0.15); font-family: Roboto, Arial, sans-serif;">
        <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
          <div style="width:32px; height:32px; border-radius:50%; background-color:#1a73e8; display:flex; align-items:center; justify-content:center; color:white; font-size:14px; font-weight:500;">
            Y
          </div>
          <span style="font-size:14px; font-weight:500; color:#1f1f1f;">You</span>
        </div>
        <div style="margin-bottom:12px;">
          <input type="text" class="docs-pill-input" placeholder="Comment or add others with @" style="width:100%; box-sizing:border-box; border:1px solid #0b57d0; border-radius:24px; padding:10px 16px; font-size:14px; outline:none;">
        </div>
        <div style="display:flex; justify-content:flex-end; gap:8px;">
          <button class="btn-text-cancel" style="background:none; border:none; color:#5f6368; padding:8px 16px; cursor:pointer; font-size:14px; font-weight:500;">Cancel</button>
          <button class="btn-filled-comment" disabled style="background:#c2e7ff; color:#041e49; border:none; border-radius:24px; padding:8px 20px; cursor:default; font-size:14px; font-weight:500; transition: background 0.1s;">Comment</button>
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

  function renderCommentCards() {
    const container = document.getElementById('pages-container');
    if (!container) return;

    let track = document.getElementById('margin-comments-track');
    if (track) track.remove();

    track = document.createElement('div');
    track.id = 'margin-comments-track';
    track.style = 'position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:100;';
    container.appendChild(track);

    const activeTabId = EditorEngine.getActiveTabId();

    comments.forEach((c, key) => {
      if (c.resolved || c.tabId !== activeTabId) return;

      const anchor = document.querySelector(`span[data-comment-id="${c.id}"]`);
      if (!anchor) return;

      const page = anchor.closest('.doc-page');
      if (!page) return;

      const containerRect = container.getBoundingClientRect();
      const anchorRect = anchor.getBoundingClientRect();

      // Placed perfectly inside the right margins clear of the paper shadow
      const cardLeft = page.offsetLeft + page.offsetWidth + 24; 
      const cardTop = (anchorRect.top - containerRect.top) + container.scrollTop;

      const card = document.createElement('div');
      card.className = 'comment-margin-card';
      card.style = `position:absolute; left:${cardLeft}px; top:${cardTop}px; width:280px; background:#ffffff; border:1px solid #dadce0; border-radius:8px; padding:12px; box-shadow:0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15); pointer-events:auto; font-family: Roboto, Helvetica, Arial, sans-serif; transition: transform 0.15s ease, box-shadow 0.15s ease;`;

      card.innerHTML = `
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
          <div style="width:24px; height:24px; border-radius:50%; background:#1a73e8; color:#ffffff; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:500;">U</div>
          <div style="display:flex; flex-direction:column;">
            <span style="font-size:13px; font-weight:500; color:#202124;">You</span>
            <span style="font-size:11px; color:#5f6368;">Just now</span>
          </div>
        </div>
        <div style="font-size:13px; color:#3c4043; line-height:1.4; margin-bottom:12px; word-break:break-word;">${c.body}</div>
        <div style="display:flex; justify-content:flex-end; gap:8px; border-top:1px solid #f1f3f4; padding-top:8px;">
          <button data-act="resolve" style="background:none; border:1px solid #dadce0; border-radius:4px; color:#1a73e8; font-size:12px; font-weight:500; cursor:pointer; padding:4px 12px; height:28px;">Resolve</button>
          <button data-act="delete" style="background:none; border:none; color:#d93025; font-size:12px; font-weight:500; cursor:pointer; padding:4px 8px;">Delete</button>
        </div>
      `;

      // Highlight target visual selections interactively on hover
      card.addEventListener('mouseenter', () => anchor.classList.add('active'));
      card.addEventListener('mouseleave', () => anchor.classList.remove('active'));

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

  function saveCommentsToStorage() {
    localStorage.setItem('docs_margin_comments', JSON.stringify(Array.from(comments.entries())));
    if (typeof EditorEngine !== 'undefined') {
      EditorEngine.saveCurrentTabContent();
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
