/**
 * app.js — Document Core App State Management Thread
 */

const ActiveDocumentData = {
  currentTab: 'essay', 
  essay: {
    title: "The Utility of Gods",
    content: [
      `<strong>The Wasted Potential of Religion</strong><br><br>Across history, civilizations around the world have independently developed religious traditions, suggesting that these beliefs address something fundamental about human nature, our need for belonging, our search for meaning, and our desire for ethical guidance. Religion has been one of humanity's most effective systems for organizing communities and transmitting values, not because of the certainty of its supernatural claims, but because of its unparalleled ability to unite people and inspire moral action. However, religion's greatest strength, its ability to create cohesive communities, can become its greatest weakness when it discourages curiosity, critical thought, and the continual betterment of human life. The measure of a religion should not be the certainty of its supernatural claims but the quality of the human beings it helps create.<br><br>Religion has long served as one of humanity's most influential systems for moral education. Christianity, for example, spread complex ethical teachings through parables. These simple stories could be understood and remembered by children, farmers, and kings alike. Values like charity, forgiveness, sacrifice, and humility have survived for millennia because religion packaged them within compelling narratives and shared rituals. The sociologist Émile Durkheim argued that religion reinforces social solidarity and collective identity by binding communities through shared practices and beliefs. Similarly, psychologist Jonathan Haidt argues in <em>The Righteous Mind</em> that religious communities foster cooperation and trust by creating "moral communities." Studies support this idea. According to the Pew Research Center, actively religious Americans report having larger social networks and stronger feelings of social support than their non-religious counterparts. Stories and rituals are effective because they connect abstract moral ideas to emotion, memory, and identity. As a result, religion builds communities capable of sustaining moral values across generations. Yet this very success creates a dangerous temptation. People can mistake the tool for its purpose and treat the stories as literal truth rather than as vehicles for human growth. Religion's greatest strength, then, is not in proving the supernatural but in cultivating communities of character.<br><br>Of course, religion has also inspired remarkable scientific, philosophical, and humanitarian contributions throughout history. Many believers already embrace scientific inquiry, charity, and critical reflection. Traditions like Christianity, Judaism, and Islam have produced profound thinkers who engaged in rigorous questioning. The question, however, is not whether religion has done good, but whether it reaches its fullest potential when it encourages continued inquiry. Progress in science, ethics, and civil rights has repeatedly depended on people willing to question accepted ideas, whether religious, political, or cultural, rather than accept them uncritically. Many reformers, from abolitionists to civil rights leaders, drew on their faith while challenging the status quo. Nietzsche observed that modern society had outgrown religion's explanatory role but had yet to replace the moral structure it provided. Many of the natural phenomena once attributed to divine intervention are now explained through scientific inquiry, reducing one of religion's historical roles as an explanation for the natural world. Camus argued that genuine courage lies in continuing to search despite uncertainty rather than escaping into comforting certainty. I believe this willingness to continue searching is religion's greatest unrealized strength. The incredible power of religion to inspire, unite, and teach could be more fully realized by cultivating wiser, more compassionate, and more intellectually honest communities. Humanity does not need fewer cathedrals. It needs cathedrals dedicated to truth rather than certainty, where the greatest virtue is not unquestioning belief but the courage to continue searching. The truest measure of any religion is the kind of people it helps create.`
    ]
  },
  brainstorm: {
    title: "Brainstorm",
    content: [
      `<strong>The Wasted Potential of Religion — Brainstorm Document</strong><br><br>
       <strong>Main Question:</strong> What is religion supposed to accomplish?<br>
       <em>Not:</em> Prove God exists, Win debates, Explain every mystery.<br>
       <em>But:</em> Help people become better human beings, Unite communities, Give people purpose, Teach morality.<br><br>
       <strong>Possible Thesis:</strong> Religion's value should not be measured by whether its supernatural claims are true, but by whether it creates wiser, kinder, more thoughtful people.<br><br>
       <strong>Core Theme:</strong> Religion is humanity's greatest social technology. It evolved because it solved universal human problems (Death anxiety, Tribal conflict, Loneliness, Meaninglessness, Social cooperation, Charity).<br><br>
       <strong>Interesting Analogy Ideas:</strong> Training wheels, A map instead of the destination, Scaffolding around a building, Humanity's operating system, A tool that sometimes mistakes itself for the craftsman.<br><br>
       <strong>Why Religion Works So Well:</strong> Stories are easier than rules. People remember characters (Noah, Moses, Jesus, Buddha, Muhammad) but forget lists. Emotion creates memory, memory creates identity, identity shapes behaviour.<br><br>
       <strong>Psychology & Sociology Foundations:</strong> Terror Management Theory, Social Identity Theory, Moral Foundations Theory. Durkheim (Shared rituals create trust), Jonathan Haidt (Religion binds people together), Pew Research (Stronger social support reports).<br><br>
       <strong>Philosophy Notes:</strong> Camus (Searching matters more than certainty), Nietzsche (Losing morality framework after losing myths), Kierkegaard (Faith contains uncertainty), William James (Judge by practical fruits), Karl Popper (Ideas must remain open to challenge).<br><br>
       <strong>The Turning Point:</strong> Where does it fail? When questions become dangerous, tradition becomes untouchable, doctrine replaces compassion, and defending the dogma becomes more important than improving humanity. <em>"The story becomes more sacred than the lesson it was meant to teach."</em><br><br>
       <strong>The Biggest Waste:</strong> Imagine if that structural power focused on scientific curiosity, education, mental health, and environmental stewardship instead of preserving old answers.<br><br>
       <strong>Possible Essay Structure:</strong><br>
       - Introduction: Why religion exists.<br>
       - Paragraph 1: Why it became humanity's greatest social technology.<br>
       - Paragraph 2: How narratives/rituals shape moral behaviour.<br>
       - Paragraph 3: When certainty replaces curiosity.<br>
       - Paragraph 4: Counterargument: inspired progress.<br>
       - Paragraph 5: Unrealized potential.<br>
       - Conclusion: The true measure is the kind of people it helps create.`
    ]
  }
};

function loadTabWorkspace(tabId) {
  ActiveDocumentData.currentTab = tabId;
  const docData = ActiveDocumentData[tabId];
  
  const titleInput = document.querySelector('.doc-title');
  if (titleInput) {
    titleInput.value = docData.title;
    document.title = docData.title;
  }
  
  const canvas = document.getElementById('doc-canvas');
  canvas.innerHTML = '';
  
  docData.content.forEach((pageHtml, index) => {
    const pageNode = document.createElement('div');
    pageNode.className = 'doc-page';
    pageNode.contentEditable = 'true';
    pageNode.setAttribute('spellcheck', 'true');
    pageNode.innerHTML = pageHtml;
    
    if (tabId === 'brainstorm') {
      pageNode.classList.add('handwritten-draft');
    }
    
    if (typeof EditorEngine !== 'undefined') {
      EditorEngine.attachPageListeners(pageNode);
    }
    canvas.appendChild(pageNode);
    
    const pageNumNode = document.createElement('div');
    pageNumNode.className = 'page-number';
    pageNumNode.textContent = `${index + 1}`;
    canvas.appendChild(pageNumNode);
  });
}

function initTabsLayoutController() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const activeTab = ActiveDocumentData.currentTab;
      const pages = document.querySelectorAll('#doc-canvas .doc-page');
      ActiveDocumentData[activeTab].content = Array.from(pages).map(p => p.innerHTML);
      
      loadTabWorkspace(btn.dataset.tab);
    });
  });
}

function seedSimulatedHistoryTimeline() {
  const historyList = HistoryEngine.getHistory();
  historyList.length = 0;

  // Snapshot 1: Early structural baseline layout
  HistoryEngine.forcePushCustomSnapshot({
    timestamp: new Date('May 12, 2026 09:14:00'),
    label: 'Initial Structural Outline Draft',
    isHandwritten: true,
    content: [
      `<div class="handwritten-draft">
        <strong>The Wasted Potential of Religion</strong><br><br>
        <del>Religion is an old historical phenomenon because prehistoric people were afraid of thunder and death.</del> Across history, civilizations around the world have independently developed religious traditions, suggesting that these beliefs address something fundamental about human nature. Religion has been one of humanity's most effective systems for organizing communities. <ins>However, religion's greatest strength can become its greatest weakness when it discourages curiosity.</ins> The measure of a religion should not be its supernatural claims but the quality of the human beings it helps create.
      </div>`
    ]
  });

  // Snapshot 2: Mid-day structural text additions
  HistoryEngine.forcePushCustomSnapshot({
    timestamp: new Date('May 12, 2026 11:30:00'),
    label: 'Expanded Arguments & Sociological Foundations',
    isHandwritten: true,
    content: [
      `<div class="handwritten-draft">
        <strong>The Wasted Potential of Religion</strong><br><br>Across history, civilizations around the world have independently developed religious traditions, suggesting that these beliefs address something fundamental about human nature... <br><br>Religion has long served as one of humanity's most influential systems for moral education. <del>Churches use simple ghost stories to get people to behave in groups.</del> Christianity, for example, spread complex ethical teachings through parables. <ins>The sociologist Émile Durkheim argued that religion reinforces social solidarity by binding communities through shared practices.</ins> Stories and rituals are effective because they connect abstract moral ideas to emotion, memory, and identity.
      </div>`
    ]
  });

  // Snapshot 3: Final structural cleanup passes
  HistoryEngine.forcePushCustomSnapshot({
    timestamp: new Date('May 12, 2026 14:45:00'),
    label: 'Philosophical Polish & Revision Cleanup Pass',
    isHandwritten: true,
    content: [
      `<div class="handwritten-draft">
        <strong>The Wasted Potential of Religion</strong><br><br>...The measure of a religion should not be the certainty of its supernatural claims but the quality of the human beings it helps create.<br><br>Of course, religion has also inspired remarkable scientific, philosophical, and humanitarian contributions throughout history. <del>Nietzsche said God is dead and that means our entire morality framework is broken.</del> <ins>Nietzsche observed that modern society had outgrown religion's explanatory role but had yet to replace the moral structure it provided.</ins> Camus argued that genuine courage lies in continuing to search despite uncertainty rather than escaping into comforting certainty. <ins>Humanity does not need fewer cathedrals. It needs cathedrals dedicated to truth rather than certainty.</ins>
      </div>`
    ]
  });

  // Snapshot 4: Clean present state baseline
  HistoryEngine.captureSnapshot('Production Active Workspace');
}

function initHeaderInteractionFields() {
  const titleInput = document.querySelector('.doc-title');
  if (titleInput) {
    titleInput.addEventListener('change', () => {
      const activeTab = ActiveDocumentData.currentTab;
      ActiveDocumentData[activeTab].title = titleInput.value || 'Untitled document';
      document.title = titleInput.value || 'Untitled document';
    });
  }
}

function initHistoryOverlayBindings() {
  const overlay = document.getElementById('version-history-view');
  const vhCanvas = document.getElementById('vh-canvas');
  
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'h') {
      e.preventDefault();
      if (overlay.hidden) {
        HistoryEngine.renderVersionList();
        const history = HistoryEngine.getHistory();
        const currentIdx = HistoryEngine.getCurrentIndex();
        if (history[currentIdx]) {
          document.getElementById('vh-title-date').textContent = `${history[currentIdx].timestamp.toLocaleDateString()}, ${history[currentIdx].timestamp.toLocaleTimeString()}`;
          HistoryEngine.renderReadOnlyPages(vhCanvas, history[currentIdx].content, history[currentIdx].isHandwritten);
        }
        overlay.hidden = false;
      } else {
        overlay.hidden = true;
      }
    }
  });

  const backBtn = document.getElementById('vh-back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      overlay.hidden = true;
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadTabWorkspace('essay');
  initTabsLayoutController();
  initHeaderInteractionFields();
  initHistoryOverlayBindings();
  seedSimulatedHistoryTimeline();
});
