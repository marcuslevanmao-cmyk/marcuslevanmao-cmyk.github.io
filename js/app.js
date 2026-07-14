// --- NEW: Dropdown Listeners ---
  const fontSelect = document.querySelector('select[title="Font"]');
  if (fontSelect) {
    fontSelect.addEventListener('change', (e) => {
      document.execCommand('fontName', false, e.target.value);
      HistoryEngine.captureSnapshot(`Changed font to ${e.target.value}`);
    });
  }

  const styleSelect = document.querySelector('select[title="Styles"]');
  if (styleSelect) {
    styleSelect.addEventListener('change', (e) => {
      let tag = 'p'; // Default to normal text
      if (e.target.value === 'Heading 1') tag = 'H1';
      if (e.target.value === 'Heading 2') tag = 'H2';
      if (e.target.value === 'Heading 3') tag = 'H3';
      
      document.execCommand('formatBlock', false, tag);
      HistoryEngine.captureSnapshot(`Applied style: ${e.target.value}`);
    });
  }
