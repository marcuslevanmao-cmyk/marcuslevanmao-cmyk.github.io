/**
 * history.js — Timeline State Engine
 */
const HistoryEngine = (() => {
  const snapshots = [
    {
      timestamp: new Date(2026, 3, 5, 10, 0, 0), // April 5, 2026, 10:00 AM
      label: "Document session opened",
      content: [`<div style="font-family: Arial, sans-serif;">The Utility of Gods</div>`]
    },
    {
      timestamp: new Date(2026, 3, 5, 10, 15, 30), // April 5, 2026, 10:15 AM
      label: "Renamed document to 'The Utility of Gods'",
      content: [`<div style="font-family: Arial, sans-serif;"><h2>The Utility of Gods</h2><p>An essay on the evolution and purpose of religion.</p></div>`]
    },
    {
      timestamp: new Date(2026, 3, 5, 10, 45, 0), // April 5, 2026, 10:45 AM
      label: "Drafted essay outline",
      content: [`<div style="font-family: Arial, sans-serif;"><h2>The Utility of Gods</h2><p><strong>Outline:</strong></p><ul><li>Introduction: Religion as humanity's greatest social technology.</li><li>Body 1: Moral education through stories & rituals (Durkheim & Haidt).</li><li>Body 2: Turning point - when certainty replaces curiosity.</li><li>Body 3: Historical contributions and progress.</li><li>Conclusion: Wasted potential & the true measure of religion.</li></ul></div>`]
    },
    {
      timestamp: new Date(2026, 3, 13, 14, 5, 0), // April 13, 2026, 2:05 PM
      label: "Added Brainstorm tab",
      content: [`<div style="font-family: Arial, sans-serif;"><h2>The Utility of Gods</h2><p><strong>Outline:</strong></p><ul><li>Introduction: Religion as humanity's greatest social technology.</li><li>Body 1: Moral education through stories & rituals (Durkheim & Haidt).</li><li>Body 2: Turning point - when certainty replaces curiosity.</li><li>Body 3: Historical contributions and progress.</li><li>Conclusion: Wasted potential & the true measure of religion.</li></ul></div>`]
    },
    {
      timestamp: new Date(2026, 4, 1, 9, 15, 0), // May 1, 2026, 9:15 AM
      label: "Drafted Introduction paragraph (with typos)",
      content: [`<div style="font-family: Arial, sans-serif; line-height: 1.5;"><p>Across history, civilisations around the world have independantly developed religious traditions, suggesting that these beliefs address something fundamental about human nature, our need for belonging, our search for meaning, and our desire for ethical guidance. Religion has been one of humanity's most effective systems for organizing communities and transmitting values, not because of the certainty of its supernatural claims, but because of its unparalelled ability to unite people and inspire moral action. However, religion's greatest strength, its ability to create cohesive communities, can become its greatest weakness when it discourages curiosity, critical thought, and the continual betterment of human life. The measure of a religion should not be the certainty of its supernatural claims but the quality of the human beings it helps create.</p></div>`]
    },
    {
      timestamp: new Date(2026, 4, 1, 10, 30, 0), // May 1, 2026, 10:30 AM
      label: "Drafted Paragraph on Moral Education (with typos)",
      content: [`<div style="font-family: Arial, sans-serif; line-height: 1.5;"><p>Across history, civilisations around the world have independantly developed religious traditions, suggesting that these beliefs address something fundamental about human nature, our need for belonging, our search for meaning, and our desire for ethical guidance. Religion has been one of humanity's most effective systems for organizing communities and transmitting values, not because of the certainty of its supernatural claims, but because of its unparalelled ability to unite people and inspire moral action. However, religion's greatest strength, its ability to create cohesive communities, can become its greatest weakness when it discourages curiosity, critical thought, and the continual betterment of human life. The measure of a religion should not be the certainty of its supernatural claims but the quality of the human beings it helps create.</p><p>Religion has long served as one of humanity's most influential systems for moral education. Christianity, for example, spread complex ethical teachings through parables. These simple stories could be understood and remembered by children, farmers, and kings alike. Values like charity, forgiveness, sacrifice, and humility have survived for millennia because religion package them within compelling narratives and shared rituals. The sociologist Emile Durkhiem argued that religion reinforces social soliderity and collective identity by binding communities through shared practices and beliefs. Similarly, psychologist Jonathan Haidt argues in The Righteous Mind that religious communities foster cooperation and trust by creating "moral communities." Studies support this idea. According to the Pew Research Center, actively religious Americans report having larger social networks and stronger feelings of social support than their non-religious counterparts. Stories and rituals are effective because they connect abstract moral ideas to emotion, memory, and identity. As a result, religion builds communities capable of sustaining moral values across generations. Yet this very success creates a dangerous temptation. People can mistake the tool for its purpose and treat the stories as literal truth rather than as vehicles for human growth. Religion's greatest strength, then, is not in proving the supernatural but in cultivating communities of character.</p></div>`]
    },
    {
      timestamp: new Date(2026, 4, 1, 11, 45, 0), // May 1, 2026, 11:45 AM
      label: "Drafted final paragraphs of the essay",
      content: [`<div style="font-family: Arial, sans-serif; line-height: 1.5;"><p>Across history, civilisations around the world have independantly developed religious traditions, suggesting that these beliefs address something fundamental about human nature, our need for belonging, our search for meaning, and our desire for ethical guidance. Religion has been one of humanity's most effective systems for organizing communities and transmitting values, not because of the certainty of its supernatural claims, but because of its unparalelled ability to unite people and inspire moral action. However, religion's greatest strength, its ability to create cohesive communities, can become its greatest weakness when it discourages curiosity, critical thought, and the continual betterment of human life. The measure of a religion should not be the certainty of its supernatural claims but the quality of the human beings it helps create.</p><p>Religion has long served as one of humanity's most influential systems for moral education. Christianity, for example, spread complex ethical teachings through parables. These simple stories could be understood and remembered by children, farmers, and kings alike. Values like charity, forgiveness, sacrifice, and humility have survived for millennia because religion package them within compelling narratives and shared rituals. The sociologist Emile Durkhiem argued that religion reinforces social soliderity and collective identity by binding communities through shared practices and beliefs. Similarly, psychologist Jonathan Haidt argues in The Righteous Mind that religious communities foster cooperation and trust by creating "moral communities." Studies support this idea. According to the Pew Research Center, actively religious Americans report having larger social networks and stronger feelings of social support than their non-religious counterparts. Stories and rituals are effective because they connect abstract moral ideas to emotion, memory, and identity. As a result, religion builds communities capable of sustaining moral values across generations. Yet this very success creates a dangerous temptation. People can mistake the tool for its purpose and treat the stories as literal truth rather than as vehicles for human growth. Religion's greatest strength, then, is not in proving the supernatural but in cultivating communities of character.</p><p>Of course, religion has also inspired remarkable scientific, philosophical, and humanitarian contributions throughout history. Many believers already embrace scientific inquiry, charity, and critical reflection. Traditions like Christianity, Judaism, and Islam have produced profound thinkers who engaged in rigorous questioning. The question, however, is not whether religion has done good, but whether it reaches its fullest potential when it encourages continued inquiry. Progress in science, ethics, and civil rights has repeatedly depended on people willing to question accepted ideas, whether religious, political, or cultural, rather than accept them uncritically. Many reformers, from abolitionists to civil rights leaders, drew on their faith while challenging the status quo. Nietzsche observed that modern society had outgrown religion's explanatory role but had yet to replace the moral structure it provided. Many of the natural phenomena once attributed to divine intervention are now explained through scientific inquiry, reducing one of religion's historical roles as an explanation for the natural world. Camus argued that genuine courage lies in continuing to search despite uncertainty rather than escaping into comforting certainty. I believe this willingness to continue searching is religion's greatest unrealized strength. The incredible power of religion to inspire, unite, and teach could be more fully realized by cultivating wiser, more compassionate, and more intellectually honest communities. Humanity does not need fewer cathedrals. It needs cathedrals dedicated to truth rather than certainty, where the greatest virtue is not unquestioning belief but the courage to continue searching. The truest measure of any religion is the kind of people it helps create.</p></div>`]
    },
    {
      timestamp: new Date(2026, 4, 2, 14, 10, 0), // May 2, 2026, 2:10 PM
      label: "Corrected spelling: civilisations -> civilizations, independantly -> independently, unparalelled -> unparalleled",
      content: [`<div style="font-family: Arial, sans-serif; line-height: 1.5;"><p>Across history, civilizations around the world have independently developed religious traditions, suggesting that these beliefs address something fundamental about human nature, our need for belonging, our search for meaning, and our desire for ethical guidance. Religion has been one of humanity's most effective systems for organizing communities and transmitting values, not because of the certainty of its supernatural claims, but because of its unparalleled ability to unite people and inspire moral action. However, religion's greatest strength, its ability to create cohesive communities, can become its greatest weakness when it discourages curiosity, critical thought, and the continual betterment of human life. The measure of a religion should not be the certainty of its supernatural claims but the quality of the human beings it helps create.</p><p>Religion has long served as one of humanity's most influential systems for moral education. Christianity, for example, spread complex ethical teachings through parables. These simple stories could be understood and remembered by children, farmers, and kings alike. Values like charity, forgiveness, sacrifice, and humility have survived for millennia because religion package them within compelling narratives and shared rituals. The sociologist Emile Durkhiem argued that religion reinforces social soliderity and collective identity by binding communities through shared practices and beliefs. Similarly, psychologist Jonathan Haidt argues in The Righteous Mind that religious communities foster cooperation and trust by creating "moral communities." Studies support this idea. According to the Pew Research Center, actively religious Americans report having larger social networks and stronger feelings of social support than their non-religious counterparts. Stories and rituals are effective because they connect abstract moral ideas to emotion, memory, and identity. As a result, religion builds communities capable of sustaining moral values across generations. Yet this very success creates a dangerous temptation. People can mistake the tool for its purpose and treat the stories as literal truth rather than as vehicles for human growth. Religion's greatest strength, then, is not in proving the supernatural but in cultivating communities of character.</p><p>Of course, religion has also inspired remarkable scientific, philosophical, and humanitarian contributions throughout history. Many believers already embrace scientific inquiry, charity, and critical reflection. Traditions like Christianity, Judaism, and Islam have produced profound thinkers who engaged in rigorous questioning. The question, however, is not whether religion has done good, but whether it reaches its fullest potential when it encourages continued inquiry. Progress in science, ethics, and civil rights has repeatedly depended on people willing to question accepted ideas, whether religious, political, or cultural, rather than accept them uncritically. Many reformers, from abolitionists to civil rights leaders, drew on their faith while challenging the status quo. Nietzsche observed that modern society had outgrown religion's explanatory role but had yet to replace the moral structure it provided. Many of the natural phenomena once attributed to divine intervention are now explained through scientific inquiry, reducing one of religion's historical roles as an explanation for the natural world. Camus argued that genuine courage lies in continuing to search despite uncertainty rather than escaping into comforting certainty. I believe this willingness to continue searching is religion's greatest unrealized strength. The incredible power of religion to inspire, unite, and teach could be more fully realized by cultivating wiser, more compassionate, and more intellectually honest communities. Humanity does not need fewer cathedrals. It needs cathedrals dedicated to truth rather than certainty, where the greatest virtue is not unquestioning belief but the courage to continue searching. The truest measure of any religion is the kind of people it helps create.</p></div>`]
    },
    {
      timestamp: new Date(2026, 4, 2, 15, 30, 0), // May 2, 2026, 3:30 PM
      label: "Corrected grammar: package -> packaged, Durkhiem -> Durkheim, soliderity -> solidarity",
      content: [`<div style="font-family: Arial, sans-serif; line-height: 1.5;"><p>Across history, civilizations around the world have independently developed religious traditions, suggesting that these beliefs address something fundamental about human nature, our need for belonging, our search for meaning, and our desire for ethical guidance. Religion has been one of humanity's most effective systems for organizing communities and transmitting values, not because of the certainty of its supernatural claims, but because of its unparalleled ability to unite people and inspire moral action. However, religion's greatest strength, its ability to create cohesive communities, can become its greatest weakness when it discourages curiosity, critical thought, and the continual betterment of human life. The measure of a religion should not be the certainty of its supernatural claims but the quality of the human beings it helps create.</p><p>Religion has long served as one of humanity's most influential systems for moral education. Christianity, for example, spread complex ethical teachings through parables. These simple stories could be understood and remembered by children, farmers, and kings alike. Values like charity, forgiveness, sacrifice, and humility have survived for millennia because religion packaged them within compelling narratives and shared rituals. The sociologist Émile Durkheim argued that religion reinforces social solidarity and collective identity by binding communities through shared practices and beliefs. Similarly, psychologist Jonathan Haidt argues in The Righteous Mind that religious communities foster cooperation and trust by creating "moral communities." Studies support this idea. According to the Pew Research Center, actively religious Americans report having larger social networks and stronger feelings of social support than their non-religious counterparts. Stories and rituals are effective because they connect abstract moral ideas to emotion, memory, and identity. As a result, religion builds communities capable of sustaining moral values across generations. Yet this very success creates a dangerous temptation. People can mistake the tool for its purpose and treat the stories as literal truth rather than as vehicles for human growth. Religion's greatest strength, then, is not in proving the supernatural but in cultivating communities of character.</p><p>Of course, religion has also inspired remarkable scientific, philosophical, and humanitarian contributions throughout history. Many believers already embrace scientific inquiry, charity, and critical reflection. Traditions like Christianity, Judaism, and Islam have produced profound thinkers who engaged in rigorous questioning. The question, however, is not whether religion has done good, but whether it reaches its fullest potential when it encourages continued inquiry. Progress in science, ethics, and civil rights has repeatedly depended on people willing to question accepted ideas, whether religious, political, or cultural, rather than accept them uncritically. Many reformers, from abolitionists to civil rights leaders, drew on their faith while challenging the status quo. Nietzsche observed that modern society had outgrown religion's explanatory role but had yet to replace the moral structure it provided. Many of the natural phenomena once attributed to divine intervention are now explained through scientific inquiry, reducing one of religion's historical roles as an explanation for the natural world. Camus argued that genuine courage lies in continuing to search despite uncertainty rather than escaping into comforting certainty. I believe this willingness to continue searching is religion's greatest unrealized strength. The incredible power of religion to inspire, unite, and teach could be more fully realized by cultivating wiser, more compassionate, and more intellectually honest communities. Humanity does not need fewer cathedrals. It needs cathedrals dedicated to truth rather than certainty, where the greatest virtue is not unquestioning belief but the courage to continue searching. The truest measure of any religion is the kind of people it helps create.</p></div>`]
    },
    {
      timestamp: new Date(2026, 4, 15, 16, 0, 0), // May 15, 2026, 4:00 PM
      label: "Format modifier applied: font-family to Times New Roman",
      content: [`<div style="font-family: 'Times New Roman', Times, serif; font-size: 16px; line-height: 1.6;"><p>Across history, civilizations around the world have independently developed religious traditions, suggesting that these beliefs address something fundamental about human nature, our need for belonging, our search for meaning, and our desire for ethical guidance. Religion has been one of humanity's most effective systems for organizing communities and transmitting values, not because of the certainty of its supernatural claims, but because of its unparalleled ability to unite people and inspire moral action. However, religion's greatest strength, its ability to create cohesive communities, can become its greatest weakness when it discourages curiosity, critical thought, and the continual betterment of human life. The measure of a religion should not be the certainty of its supernatural claims but the quality of the human beings it helps create.</p><p>Religion has long served as one of humanity's most influential systems for moral education. Christianity, for example, spread complex ethical teachings through parables. These simple stories could be understood and remembered by children, farmers, and kings alike. Values like charity, forgiveness, sacrifice, and humility have survived for millennia because religion packaged them within compelling narratives and shared rituals. The sociologist Émile Durkheim argued that religion reinforces social solidarity and collective identity by binding communities through shared practices and beliefs. Similarly, psychologist Jonathan Haidt argues in The Righteous Mind that religious communities foster cooperation and trust by creating "moral communities." Studies support this idea. According to the Pew Research Center, actively religious Americans report having larger social networks and stronger feelings of social support than their non-religious counterparts. Stories and rituals are effective because they connect abstract moral ideas to emotion, memory, and identity. As a result, religion builds communities capable of sustaining moral values across generations. Yet this very success creates a dangerous temptation. People can mistake the tool for its purpose and treat the stories as literal truth rather than as vehicles for human growth. Religion's greatest strength, then, is not in proving the supernatural but in cultivating communities of character.</p><p>Of course, religion has also inspired remarkable scientific, philosophical, and humanitarian contributions throughout history. Many believers already embrace scientific inquiry, charity, and critical reflection. Traditions like Christianity, Judaism, and Islam have produced profound thinkers who engaged in rigorous questioning. The question, however, is not whether religion has done good, but whether it reaches its fullest potential when it encourages continued inquiry. Progress in science, ethics, and civil rights has repeatedly depended on people willing to question accepted ideas, whether religious, political, or cultural, rather than accept them uncritically. Many reformers, from abolitionists to civil rights leaders, drew on their faith while challenging the status quo. Nietzsche observed that modern society had outgrown religion's explanatory role but had yet to replace the moral structure it provided. Many of the natural phenomena once attributed to divine intervention are now explained through scientific inquiry, reducing one of religion's historical roles as an explanation for the natural world. Camus argued that genuine courage lies in continuing to search despite uncertainty rather than escaping into comforting certainty. I believe this willingness to continue searching is religion's greatest unrealized strength. The incredible power of religion to inspire, unite, and teach could be more fully realized by cultivating wiser, more compassionate, and more intellectually honest communities. Humanity does not need fewer cathedrals. It needs cathedrals dedicated to truth rather than certainty, where the greatest virtue is not unquestioning belief but the courage to continue searching. The truest measure of any religion is the kind of people it helps create.</p></div>`]
    }
  ];

  let debounceTimer = null;
  let selectedPreviewIndex = -1;

  function scheduleSnapshot(label) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      captureSnapshot(label);
    }, 2000);
  }

  function captureSnapshot(label) {
    const activePage = document.querySelector('.doc-page');
    if (!activePage) return;
    
    const pageHtml = activePage.innerHTML;
    const lastSnap = snapshots[snapshots.length - 1];
    
    if (lastSnap && lastSnap.content[0] === pageHtml) return;

    snapshots.push({
      timestamp: new Date(),
      label: label || `Edit Revision Log #${snapshots.length + 1}`,
      content: [pageHtml]
    });
    renderTimelineItems();
  }

  function renderTimelineItems() {
    const list = document.getElementById('version-list');
    if (!list) return;
    list.innerHTML = '';

    snapshots.forEach((snap, idx) => {
      const item = document.createElement('div');
      item.className = `version-item ${idx === snapshots.length - 1 ? 'current' : ''}`;
      
      const dateStr = snap.timestamp.toLocaleDateString([], { month: 'short', day: 'numeric' });
      const timeStr = snap.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      item.innerHTML = `
        <div class="version-time">${dateStr}, ${timeStr}</div>
        <div class="version-meta">${snap.label}</div>
      `;
      item.addEventListener('click', () => previewSnapshot(idx));
      list.appendChild(item);
    });
  }

  function previewSnapshot(idx) {
    selectedPreviewIndex = idx;
    const snap = snapshots[idx];
    if (!snap) return;

    const vhCanvas = document.getElementById('vh-canvas');
    if (!vhCanvas) return;
    
    vhCanvas.innerHTML = '';

    const previewPage = document.createElement('div');
    previewPage.className = 'doc-page';
    previewPage.contentEditable = 'false';
    previewPage.innerHTML = snap.content[0];

    vhCanvas.appendChild(previewPage);

    const pageNum = document.createElement('div');
    pageNum.className = 'page-number';
    pageNum.textContent = '1 (Version Preview)';
    vhCanvas.appendChild(pageNum);

    document.querySelectorAll('.version-item').forEach((el, i) => {
      el.classList.toggle('current', i === idx);
    });
  }

  function getSelectedPreviewIndex() {
    return selectedPreviewIndex;
  }

  function rollbackTo(idx) {
    const snap = snapshots[idx];
    if (!snap) return;

    EditorEngine.forceHydrateAllContent(snap.content);
    captureSnapshot(`Restored version state track from ${snap.timestamp.toLocaleTimeString()}`);
  }

  return { captureSnapshot, scheduleSnapshot, rollbackTo, previewSnapshot, getSelectedPreviewIndex };
})();
