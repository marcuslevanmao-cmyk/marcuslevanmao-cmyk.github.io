/**
 * app.js — App Orchestrator
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Init editor
    EditorEngine.renderTabsSidebar();
    EditorEngine.loadActiveTabContent();
    CommentsEngine.bindSelectionListener();

    // 2. Add tab button
    document.getElementById('add-tab-btn')?.addEventListener('click', () => EditorEngine.createNewTab());

    // 3. Formatting toolbar
    document.querySelectorAll('.toolbar-btn[data-action]').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            if (['bold','italic','underline'].includes(action)) {
                document.execCommand(action, false, null);
                HistoryEngine.captureSnapshot(`Format: ${action}`);
            } else if (action === 'undo' || action === 'redo') {
                document.execCommand(action, false, null);
            } else if (action.startsWith('justify')) {
                document.execCommand(action, false, null);
                HistoryEngine.captureSnapshot('Alignment changed');
            } else if (action === 'forecolor') {
                document.execCommand('foreColor', false, '#ea4335');
                HistoryEngine.captureSnapshot('Text color changed');
            } else if (action === 'hilitecolor') {
                document.execCommand('hiliteColor', false, '#fff475');
                HistoryEngine.captureSnapshot('Highlight applied');
            }
        });
    });

    // 4. Font & style dropdowns
    document.querySelector('select[title="Font"]')?.addEventListener('change', (e) => {
        document.execCommand('fontName', false, e.target.value);
        HistoryEngine.captureSnapshot(`Font: ${e.target.value}`);
    });
    document.querySelector('select[title="Styles"]')?.addEventListener('change', (e) => {
        const tags = { 'Heading 1':'H1', 'Heading 2':'H2', 'Heading 3':'H3' };
        document.execCommand('formatBlock', false, tags[e.target.value] || 'p');
        HistoryEngine.captureSnapshot(`Style: ${e.target.value}`);
    });

    // 5. Font size controls
    const dec = document.getElementById('decrease-size-btn');
    const inc = document.getElementById('increase-size-btn');
    const sizeIn = document.querySelector('.font-size-input');
    if (dec && inc && sizeIn) {
        const applySize = (newSize) => {
            sizeIn.value = newSize;
            const sel = window.getSelection();
            if (sel.rangeCount && !sel.isCollapsed) {
                try {
                    const range = sel.getRangeAt(0);
                    const span = document.createElement('span');
                    span.style.fontSize = newSize + 'px';
                    range.surroundContents(span);
                    HistoryEngine.captureSnapshot(`Size: ${newSize}px`);
                } catch {
                    document.execCommand('fontSize', false, '3');
                    document.querySelectorAll('font[size="3"]').forEach(el => {
                        el.removeAttribute('size');
                        el.style.fontSize = newSize + 'px';
                    });
                    HistoryEngine.captureSnapshot(`Size: ${newSize}px`);
                }
            }
        };
        dec.addEventListener('click', () => {
            let s = parseInt(sizeIn.value) || 11;
            if (s > 6) applySize(s - 1);
        });
        inc.addEventListener('click', () => {
            let s = parseInt(sizeIn.value) || 11;
            if (s < 72) applySize(s + 1);
        });
        sizeIn.addEventListener('change', () => {
            let s = parseInt(sizeIn.value) || 11;
            if (s >= 6 && s <= 72) applySize(s);
        });
    }

    // 6. Comment button (toolbar)
    document.getElementById('toolbar-comment-btn')?.addEventListener('click', () => CommentsEngine.promptForCommentOnSelection());

    // 7. Comments sidebar toggle
    const commentBtn = document.getElementById('comment-btn');
    const commentsSidebar = document.getElementById('comments-sidebar');
    const closeComments = document.getElementById('close-comments-btn');
    if (commentBtn && commentsSidebar) {
        commentBtn.addEventListener('click', () => {
            document.getElementById('version-history-view').hidden = true;
            commentsSidebar.hidden = !commentsSidebar.hidden;
            if (!commentsSidebar.hidden) CommentsEngine.renderCommentCards();
        });
    }
    if (closeComments && commentsSidebar) {
        closeComments.addEventListener('click', () => { commentsSidebar.hidden = true; });
    }

    // 8. History toggle
    const historyBtn = document.getElementById('history-btn');
    const vhOverlay = document.getElementById('version-history-view');
    const vhBack = document.getElementById('vh-back-btn');
    if (historyBtn && vhOverlay) {
        historyBtn.addEventListener('click', () => {
            if (commentsSidebar) commentsSidebar.hidden = true;
            vhOverlay.hidden = false;
            HistoryEngine.previewSnapshot(0);
            renderHistorySidebar();
        });
    }
    if (vhBack && vhOverlay) {
        vhBack.addEventListener('click', () => { vhOverlay.hidden = true; });
    }

    // 9. Restore modal
    const confirmModal = document.getElementById('confirm-modal');
    const restoreBtn = document.getElementById('vh-restore-trigger-btn');
    const cancelBtn = document.getElementById('modal-cancel-btn');
    const confirmBtn = document.getElementById('modal-confirm-btn');
    if (restoreBtn && confirmModal) {
        restoreBtn.addEventListener('click', () => { confirmModal.hidden = false; });
    }
    if (cancelBtn && confirmModal) {
        cancelBtn.addEventListener('click', () => { confirmModal.hidden = true; });
    }
    if (confirmBtn && vhOverlay && confirmModal) {
        confirmBtn.addEventListener('click', () => {
            const idx = HistoryEngine.getSelectedPreviewIndex();
            if (idx !== -1) HistoryEngine.rollbackTo(idx);
            confirmModal.hidden = true;
            vhOverlay.hidden = true;
        });
    }

    // 10. ❌ REMOVED: initial snapshot – no more "Document session opened"
    // HistoryEngine.captureSnapshot('Document session opened');
});
