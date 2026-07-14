/**
 * editor.js — The Core Editor Engine
 * Manages structural document integrity during runtime data entry.
 *
 *   User Types Character
 *        -> Compute Current Page Height
 *        -> Height > 11in?
 *             Yes -> Extract Last Word/Line -> Generate New Page -> Inject Text & Move Cursor
 *             No  -> Keep Typing on Page
 */

const EditorEngine = (() => {
  const canvas = () => document.getElementById('doc-canvas');
  let overflowCheckQueued = false;

  function createPageElement() {
    const page = document.createElement('div');
    page.className = 'doc-page';
    page.contentEditable = 'true';
    page.setAttribute('spellcheck', 'true');
    attachPageListeners(page);
    return page;
  }

  function createPageNumberElement(current, total) {
    const el = document.createElement('div');
    el.className = 'page-number';
    el.textContent = `${current}`;
    el.dataset.pageNumber = 'true';
    return el;
  }

  function attachPageListeners(page) {
    page.addEventListener('input', () => queueOverflowCheck(page));
    page.addEventListener('keydown', (e) => handleBoundaryKeys(e, page));
    page.addEventListener('focus', () => (page.dataset.focused = 'true'));
  }

  /** Debounce overflow checks to the next animation frame so rapid typing stays smooth. */
  function queueOverflowCheck(page) {
    if (overflowCheckQueued) return;
    overflowCheckQueued = true;
    requestAnimationFrame(() => {
      overflowCheckQueued = false;
      checkOverflow(page);
      HistoryEngine.scheduleSnapshot();
    });
  }

  /** Height > 11in? Compare scrollHeight (content) against clientHeight (fixed 11in box). */
  function isOverflowing(page) {
    return page.scrollHeight > page.clientHeight + 1; // +1px rounding tolerance
  }

  function getOrCreateNextPage(page) {
    let next = page.nextElementSibling;
    // Skip the page-number div that follows each page.
    if (next && next.dataset.pageNumber) next = next.nextElementSibling;

    if (!next || !next.classList || !next.classList.contains('doc-page')) {
      next = createPageElement();
      const numberEl = createPageNumberElement();
      if (page.nextElementSibling) {
        canvas().insertBefore(next, page.nextElementSibling.nextElementSibling || null);
      } else {
        canvas().appendChild(next);
      }
      next.insertAdjacentElement('afterend', numberEl);
    }
    return next;
  }

  /** Extract the last block/line of content from `page` and move it to the next page. */
  function extractLastLine(page) {
    // Prefer moving whole block-level children (p, div) when present.
    const blockChildren = Array.from(page.childNodes).filter(
      (n) => n.nodeType === Node.ELEMENT_NODE
    );

    if (blockChildren.length > 1) {
      return blockChildren[blockChildren.length - 1];
    }

    // Fall back to extracting the last word from the trailing text node.
    let node = page;
    while (node.lastChild) node = node.lastChild;

    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent;
      const trimmed = text.replace(/\s+$/, '');
      const lastSpace = trimmed.lastIndexOf(' ');
      const splitPoint = lastSpace === -1 ? 0 : lastSpace + 1;
      const extracted = text.slice(splitPoint);
      node.textContent = text.slice(0, splitPoint);
      return document.createTextNode(extracted);
    }

    // No text to extract; move the node itself.
    return node.parentNode === page ? node : null;
  }

  /** Inject extracted content onto the next page and move the cursor after it. */
  function injectAndMoveCursor(nextPage, extracted) {
    if (!extracted) return;
    nextPage.insertBefore(extracted, nextPage.firstChild);

    const range = document.createRange();
    const sel = window.getSelection();
    range.setStartAfter(extracted);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
    nextPage.focus();
  }

  /** Core loop: while the page overflows 11in, extract the tail and push it forward. */
  function checkOverflow(page) {
    let guard = 0;
    while (isOverflowing(page) && guard < 500) {
      const extracted = extractLastLine(page);
      if (!extracted) break;
      const nextPage = getOrCreateNextPage(page);
      injectAndMoveCursor(nextPage, extracted);
      guard += 1;
      // Continue checking the page that received the overflow too.
      if (isOverflowing(nextPage)) {
        page = nextPage;
      }
    }
    pullBackIfRoom(page);
    refreshPageNumbers();
  }

  /** If a page has room and the next page starts with content, pull it back (backspace case). */
  function pullBackIfRoom(page) {
    let next = page.nextElementSibling;
    if (next && next.dataset.pageNumber) next = next.nextElementSibling;
    if (!next || !next.classList.contains('doc-page')) return;
    if (next.textContent.trim() === '' && next.children.length === 0) {
      // Remove trailing empty page + its number label.
      const numberEl = next.nextElementSibling;
      if (numberEl && numberEl.dataset.pageNumber) numberEl.remove();
      next.remove();
    }
  }

  function handleBoundaryKeys(e, page) {
    // Backspace at the very start of a (non-first) page merges content back up.
    if (e.key === 'Backspace') {
      const sel = window.getSelection();
      if (!sel.rangeCount) return;
      const range = sel.getRangeAt(0);
      const atStart = range.collapsed && range.startOffset === 0 &&
        (!range.startContainer.previousSibling);
      const isFirstPage = page === canvas().querySelector('.doc-page');

      if (atStart && !isFirstPage) {
        e.preventDefault();
        let prev = page.previousElementSibling;
        if (prev && prev.dataset.pageNumber) prev = prev.previousElementSibling;
        if (prev && prev.classList.contains('doc-page')) {
          const frag = document.createDocumentFragment();
          while (page.firstChild) frag.appendChild(page.firstChild);
          const cursorAnchor = document.createTextNode('');
          prev.appendChild(cursorAnchor);
          prev.appendChild(frag);

          const numberEl = page.nextElementSibling;
          if (numberEl && numberEl.dataset.pageNumber) numberEl.remove();
          page.remove();

          const range2 = document.createRange();
          range2.setStartBefore(cursorAnchor);
          range2.collapse(true);
          sel.removeAllRanges();
          sel.addRange(range2);
          prev.focus();
          queueOverflowCheck(prev);
        }
      }
    }
  }

  function refreshPageNumbers() {
    const pages = Array.from(canvas().querySelectorAll('.doc-page'));
    pages.forEach((p, i) => {
      let numberEl = p.nextElementSibling;
      if (!numberEl || !numberEl.dataset || !numberEl.dataset.pageNumber) {
        numberEl = createPageNumberElement();
        p.insertAdjacentElement('afterend', numberEl);
      }
      numberEl.textContent = `${i + 1}`;
    });
  }

  function initFirstPage() {
    const page = createPageElement();
    canvas().appendChild(page);
    canvas().appendChild(createPageNumberElement(1, 1));
    page.focus();
    return page;
  }

  return {
    createPageElement,
    createPageNumberElement,
    checkOverflow,
    refreshPageNumbers,
    initFirstPage,
  };
})();
