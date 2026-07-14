/**
 * editor.js — Multi-Tab Architecture with Live Custom Renaming Engine
 */
const EditorEngine = (() => {
  const documentTabs = [
    {
      id: "tab_1",
      title: "The Wasted Potential of Religion",
      htmlContent: `<div style="font-family: 'Times New Roman', Times, serif; font-size: 16px; line-height: 1.6;">
  <p>Across history, civilizations around the world have independently developed religious traditions, suggesting that these beliefs address something fundamental about human nature, our need for belonging, our search for meaning, and our desire for ethical guidance. Religion has been one of humanity's most effective systems for organizing communities and transmitting values, not because of the certainty of its supernatural claims, but because of its unparalleled ability to unite people and inspire moral action. However, religion's greatest strength, its ability to create cohesive communities, can become its greatest weakness when it discourages curiosity, critical thought, and the continual betterment of human life. The measure of a religion should not be the certainty of its supernatural claims but the quality of the human beings it helps create.</p>
  <p>Religion has long served as one of humanity's most influential systems for moral education. Christianity, for example, spread complex ethical teachings through parables. These simple stories could be understood and remembered by children, farmers, and kings alike. Values like charity, forgiveness, sacrifice, and humility have survived for millennia because religion packaged them within compelling narratives and shared rituals. The sociologist Émile Durkheim argued that religion reinforces social solidarity and collective identity by binding communities through shared practices and beliefs. Similarly, psychologist Jonathan Haidt argues in The Righteous Mind that religious communities foster cooperation and trust by creating "moral communities." Studies support this idea. According to the Pew Research Center, actively religious Americans report having larger social networks and stronger feelings of social support than their non-religious counterparts. Stories and rituals are effective because they connect abstract moral ideas to emotion, memory, and identity. As a result, religion builds communities capable of sustaining moral values across generations. Yet this very success creates a dangerous temptation. People can mistake the tool for its purpose and treat the stories as literal truth rather than as vehicles for human growth. Religion's greatest strength, then, is not in proving the supernatural but in cultivating communities of character.</p>
  <p>Of course, religion has also inspired remarkable scientific, philosophical, and humanitarian contributions throughout history. Many believers already embrace scientific inquiry, charity, and critical reflection. Traditions like Christianity, Judaism, and Islam have produced profound thinkers who engaged in rigorous questioning. The question, however, is not whether religion has done good, but whether it reaches its fullest potential when it encourages continued inquiry. Progress in science, ethics, and civil rights has repeatedly depended on people willing to question accepted ideas, whether religious, political, or cultural, rather than accept them uncritically. Many reformers, from abolitionists to civil rights leaders, drew on their faith while challenging the status quo. Nietzsche observed that modern society had outgrown religion's explanatory role but had yet to replace the moral structure it provided. Many of the natural phenomena once attributed to divine intervention are now explained through scientific inquiry, reducing one of religion's historical roles as an explanation for the natural world. Camus argued that genuine courage lies in continuing to search despite uncertainty rather than escaping into comforting certainty. I believe this willingness to continue searching is religion's greatest unrealized strength. The incredible power of religion to inspire, unite, and teach could be more fully realized by cultivating wiser, more compassionate, and more intellectually honest communities. Humanity does not need fewer cathedrals. It needs cathedrals dedicated to truth rather than certainty, where the greatest virtue is not unquestioning belief but the courage to continue searching. The truest measure of any religion is the kind of people it helps create.</p>
</div>`
    },
    {
      id: "tab_2",
      title: "Brainstorm",
      htmlContent: `<div style="font-family: Arial, sans-serif; line-height: 1.5; font-size: 14px; color: #202124;">
  <h3 style="margin-top: 0;">The Wasted Potential of Religion</h3>
  <p><strong>Brainstorm Document</strong></p>
  
  <h4>Main Question</h4>
  <p>What is religion supposed to accomplish?</p>
  <p><em>Not:</em></p>
  <ul>
    <li>Prove God exists</li>
    <li>Win debates</li>
    <li>Explain every mystery</li>
  </ul>
  <p><em>But:</em></p>
  <ul>
    <li>Help people become better human beings.</li>
    <li>Unite communities.</li>
    <li>Give people purpose.</li>
    <li>Teach morality.</li>
    <li>Provide hope during suffering.</li>
    <li>Encourage self-sacrifice and compassion.</li>
    <li>Give people something larger than themselves.</li>
  </ul>
  <p><strong>Possible Thesis:</strong><br>Religion's value should not be measured by whether its supernatural claims are true, but by whether it creates wiser, kinder, more thoughtful people.</p>
  
  <h4>Core Theme</h4>
  <ul>
    <li>Religion is humanity's greatest social technology.</li>
    <li>It evolved because it solved problems.</li>
  </ul>
  <p>Problems it solved:</p>
  <ul>
    <li>Death anxiety | Tribal conflict | Loneliness | Moral disagreement | Meaninglessness | Social cooperation | Charity | Community | Tradition | Identity</li>
  </ul>
  <p>Religion wasn't successful because miracles happened. Religion was successful because humans needed it.</p>
  
  <h4>Interesting Analogy Ideas</h4>
  <p>Religion is...</p>
  <ul>
    <li>Training wheels.</li>
    <li>A map instead of the destination.</li>
    <li>Scaffolding around a building.</li>
    <li>A language for morality.</li>
    <li>Humanity's operating system.</li>
    <li>A campfire where communities gathered.</li>
    <li>A compass rather than a GPS.</li>
    <li>A garden that requires constant pruning.</li>
    <li>A tool that sometimes mistakes itself for the craftsman.</li>
  </ul>
  <p><em>Possible line:</em> Every tool eventually dulls if it is never sharpened.</p>
  
  <h4>Why Religion Works So Well</h4>
  <p>Stories are easier than rules. People remember characters (Noah, Moses, Jesus, Buddha, Muhammad, Saints, Myths) rather than rigid lists.</p>
  <p>Religion connects ideas to emotions. Emotion creates memory. Memory creates identity. Identity shapes behaviour.</p>
  <p>Religion teaches through: stories, rituals, music, architecture, repetition, holidays, symbols, family traditions.</p>
  
  <h4>Why Every Civilization Invented Religion</h4>
  <p>Possible reasons: Fear of death, Need for explanation, Need for belonging, Need for justice, Hope, Order, Shared identity. Humans naturally search for patterns; religion may simply be the most effective pattern we've ever created.</p>
  
  <h4>Psychology</h4>
  <p>Religion satisfies several human needs: belonging, purpose, certainty, hope, community, identity, moral direction, and anxiety reduction.</p>
  <p><em>Theories to explore:</em> Terror Management Theory, Social Identity Theory, Moral Foundations Theory, Narrative Psychology.</p>
  
  <h4>Sociology</h4>
  <ul>
    <li><strong>Durkheim:</strong> Religion creates collective identity. Communities become stronger. Shared rituals create trust and increase cooperation.</li>
    <li><strong>Jonathan Haidt:</strong> Religion binds people together.</li>
    <li><strong>Pew Research:</strong> Religious communities often report stronger social support.</li>
  </ul>
  
  <h4>Philosophy Notes</h4>
  <ul>
    <li><strong>Camus:</strong> Life has no guaranteed meaning. Meaning must be created. Searching matters more than certainty. Religion should inspire searching rather than replace it.</li>
    <li><strong>Nietzsche:</strong> Religion once explained reality. Science replaced many explanations. The problem isn't losing God; the problem is losing morality afterwards. Religion should evolve instead of disappearing.</li>
    <li><strong>Kierkegaard:</strong> Faith contains uncertainty. True belief isn't mathematical certainty. (Interesting contrast with dogma).</li>
    <li><strong>William James:</strong> Religion should be judged by its practical effects. What kind of people does it create?</li>
    <li><strong>Karl Popper:</strong> Knowledge improves through criticism. Ideas must remain open to challenge. Religion should welcome questions.</li>
  </ul>
  
  <h4>Historical Examples</h4>
  <p>Religion has done incredible good: Hospitals, Universities, Charities, Abolition movement, Civil Rights Movement, monasteries preserving knowledge, Islamic Golden Age, scientific discoveries by religious thinkers (e.g., Gregor Mendel, Georges Lemaître, Martin Luther King Jr., Thomas Aquinas, Desmond Tutu).</p>
  
  <h4>The Turning Point</h4>
  <p>Where does religion begin to fail? When questions become dangerous, tradition becomes untouchable, belief becomes identity, certainty replaces humility, doctrine becomes more important than compassion, and defending religion becomes more important than improving humanity.</p>
  <p><em>Possible line:</em> "The story becomes more sacred than the lesson it was meant to teach."</p>
  
  <h4>The Biggest Waste</h4>
  <p>Religion possesses unbelievable power. Imagine if that power focused on: Scientific curiosity, Critical thinking, Education, Community service, Mental health, Environmental stewardship, Compassion, Philosophy, Dialogue—instead of simply preserving old answers.</p>
  
  <h4>Possible Counterarguments</h4>
  <p>Religion already changes. Many churches embrace science. Many believers question their faith. Many scientists are religious. Faith and reason are not opposites. Don't attack religion; attack stagnation.</p>
  
  <h4>My Position</h4>
  <p>I'm not arguing religion should disappear. I'm arguing religion should evolve. Religion shouldn't lose its traditions; it should expand them. The search for truth should become sacred.</p>
  
  <h4>Modern Examples to Consider</h4>
  <p>Climate change, Artificial Intelligence, Gene editing, Loneliness epidemic, Political polarization, Social media. Religion rarely leads these conversations. Could it? Should it?</p>
  
  <h4>Questions Worth Asking</h4>
  <p>What makes someone good? Can morality exist without religion? Can religion exist without certainty? Why do humans crave belief? Can doubt be holy? Should churches teach philosophy? What if questioning became a religious virtue?</p>
  
  <h4>Possible Metaphors</h4>
  <p>A cathedral under construction, A lighthouse, A growing tree, A bridge, A library, A compass, A forge, A garden, A mirror.</p>
  
  <h4>Favourite Ideas</h4>
  <ul>
    <li>"The measure of religion is the people it creates."</li>
    <li>"Religion is a tool, not a destination."</li>
    <li>"The purpose of faith should be transformation, not certainty."</li>
    <li>"Every generation inherits religion, but every generation should also improve it."</li>
    <li>"Truth has nothing to fear from questions."</li>
    <li>"The strongest faith should survive the strongest questions."</li>
    <li>"Religion solved humanity's oldest problems but often hesitates before humanity's newest ones."</li>
    <li>"We do not need fewer cathedrals. We need cathedrals where curiosity is considered a form of worship."</li>
  </ul>
  
  <h4>Possible Essay Structure</h4>
  <ol>
    <li><strong>Introduction</strong> &rarr; Why religion exists.</li>
    <li><strong>Paragraph 1</strong> &rarr; Why religion became one of humanity's greatest inventions.</li>
    <li><strong>Paragraph 2</strong> &rarr; How stories, rituals and communities shape moral behaviour.</li>
    <li><strong>Paragraph 3</strong> &rarr; When certainty replaces curiosity.</li>
    <li><strong>Paragraph 4</strong> &rarr; Counterargument: religion has inspired enormous progress.</li>
    <li><strong>Paragraph 5</strong> &rarr; Religion's unrealized potential.</li>
    <li><strong>Conclusion</strong> &rarr; The true measure of religion is the kind of people it creates.</li>
  </ol>
</div>`
    }
  ];
  
  let activeTabId = "tab_1";

  function getTabs() { return documentTabs; }
  function getActiveTabId() { return activeTabId; }

  function switchTab(id) {
    const currentTab = documentTabs.find(t => t.id === activeTabId);
    const activePage = document.querySelector('.doc-page');
    if (currentTab && activePage) {
      currentTab.htmlContent = activePage.innerHTML;
    }

    activeTabId = id;
    renderTabsSidebar();
    loadActiveTabContent();
  }

  function createNewTab() {
    const activePage = document.querySelector('.doc-page');
    if (activePage) {
      const currentTab = documentTabs.find(t => t.id === activeTabId);
      if (currentTab) currentTab.htmlContent = activePage.innerHTML;
    }

    const newId = `tab_${Date.now()}`;
    const newTab = {
      id: newId,
      title: `Untitled Tab ${documentTabs.length + 1}`,
      htmlContent: `<div></div>` // "Empty tab view entry" has been removed here
    };
    
    documentTabs.push(newTab);
    activeTabId = newId;
    renderTabsSidebar();
    loadActiveTabContent();
    HistoryEngine.captureSnapshot(`Added ${newTab.title}`);
  }

  function deleteTab(id, event) {
    event.stopPropagation();
    if (documentTabs.length <= 1) return;
    
    const index = documentTabs.findIndex(t => t.id === id);
    if (index === -1) return;

    documentTabs.splice(index, 1);
    if (activeTabId === id) {
      activeTabId = documentTabs[Math.max(0, index - 1)].id;
    }
    renderTabsSidebar();
    loadActiveTabContent();
    HistoryEngine.captureSnapshot(`Deleted workspace tab`);
  }

  function renderTabsSidebar() {
    const container = document.getElementById('tabs-container');
    if (!container) return;
    container.innerHTML = '';

    documentTabs.forEach(tab => {
      const row = document.createElement('div');
      row.className = `tab-item-row ${tab.id === activeTabId ? 'active' : ''}`;
      
      row.innerHTML = `
        <input type="text" class="tab-name-input" value="${tab.title}" aria-label="Tab name">
        ${documentTabs.length > 1 ? `
          <button class="tab-close-btn" title="Delete tab">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        ` : ''}
      `;

      const input = row.querySelector('.tab-name-input');
      
      row.addEventListener('click', (e) => {
        if (e.target !== input) {
          switchTab(tab.id);
        }
      });

      input.addEventListener('click', (e) => {
        if (tab.id !== activeTabId) {
          switchTab(tab.id);
        }
      });

      input.addEventListener('input', () => {
        tab.title = input.value.trim() || "Untitled Tab";
      });

      input.addEventListener('blur', () => {
        if (!input.value.trim()) {
          input.value = "Untitled Tab";
          tab.title = "Untitled Tab";
        }
        HistoryEngine.captureSnapshot(`Renamed tab to "${tab.title}"`);
      });

      if (documentTabs.length > 1) {
        row.querySelector('.tab-close-btn').addEventListener('click', (e) => deleteTab(tab.id, e));
      }

      container.appendChild(row);
    });
  }

  function loadActiveTabContent() {
    const target = document.getElementById('pages-container');
    if (!target) return;
    target.innerHTML = '';

    const tab = documentTabs.find(t => t.id === activeTabId);
    if (!tab) return;

    const page = document.createElement('div');
    page.className = 'doc-page';
    page.contentEditable = 'true';
    page.setAttribute('spellcheck', 'true');
    page.innerHTML = tab.htmlContent;

    page.addEventListener('input', () => {
      tab.htmlContent = page.innerHTML;
      HistoryEngine.scheduleSnapshot('Auto-saved layout edit');
    });

    target.appendChild(page);
    
    const pageNum = document.createElement('div');
    pageNum.className = 'page-number';
    pageNum.textContent = '1';
    target.appendChild(pageNum);

    CommentsEngine.renderCommentCards();
  }

  function forceHydrateAllContent(contentArray) {
    if (!contentArray || !contentArray[0]) return;
    const currentTab = documentTabs.find(t => t.id === activeTabId);
    if (currentTab) {
      currentTab.htmlContent = contentArray[0];
      loadActiveTabContent();
    }
  }

  return { getTabs, getActiveTabId, renderTabsSidebar, loadActiveTabContent, createNewTab, forceHydrateAllContent };
})();
