// history.js

// 1. Initial Mock Data to populate the history view immediately
const sampleEssayContent = `
<h2>The Wasted Potential of Religion</h2>
<p>Across history, civilizations around the world have independently developed religious traditions, suggesting that these beliefs address something fundamental about human nature, our need for belonging, our search for meaning, and our desire for ethical guidance. Religion has been one of humanity's most effective systems for organizing communities and transmitting values, not because of the certainty of its supernatural claims, but because of its unparalleled ability to unite people and inspire moral action. However, religion's greatest strength, its ability to create cohesive communities, can become its greatest weakness when it discourages curiosity, critical thought, and the continual betterment of human life. The measure of a religion should not be the certainty of its supernatural claims but the quality of the human beings it helps create.</p>
<br>
<p>Religion has long served as one of humanity's most influential systems for moral education. Christianity, for example, spread complex ethical teachings through parables. These simple stories could be understood and remembered by children, farmers, and kings alike. Values like charity, forgiveness, sacrifice, and humility have survived for millennia because religion packaged them within compelling narratives and shared rituals. The sociologist Émile Durkheim argued that religion reinforces social solidarity and collective identity by binding communities through shared practices and beliefs. Similarly, psychologist Jonathan Haidt argues in The Righteous Mind that religious communities foster cooperation and trust by creating "moral communities." Studies support this idea. According to the Pew Research Center, actively religious Americans report having larger social networks and stronger feelings of social support than their non-religious counterparts. Stories and rituals are effective because they connect abstract moral ideas to emotion, memory, and identity. As a result, religion builds communities capable of sustaining moral values across generations. Yet this very success creates a dangerous temptation. People can mistake the tool for point purpose and treat the stories as literal truth rather than as vehicles for human growth. Religion's greatest strength, then, is not in proving the supernatural but in cultivating communities of character.</p>
`;

const brainstormContent = `
<h2>Brainstorming Notes</h2>
<ul>
    <li><b>Theme:</b> Utility vs Truth of Religion</li>
    <li><b>Key thinkers:</b> Emile Durkheim (social solidarity), Jonathan Haidt (moral communities)</li>
    <li><b>Keywords:</b> cohesive communities, moral action, stories, parables, literalism</li>
    <li><b>Core Argument:</b> Religion's value is in community building, but it fails when it discourages critical thought.</li>
</ul>
`;

// Comprehensive history mapping the exact timeline of your document's evolution
let documentHistory = [
    {
        id: 9,
        dateObj: new Date('2026-07-14T14:40:00'),
        displayDate: "July 14, 2:40 p.m.",
        dayGroup: "Tuesday",
        author: "Marcus Le Van Mao élève",
        authorColor: "#0f9d58",
        description: "Edited: Document session opened (Current)",
        tabsState: [
            { id: 'tab1', title: 'PERSUASIVE ESSAY', content: sampleEssayContent },
            { id: 'tab2', title: 'Brainstorm', content: brainstormContent }
        ]
    },
    {
        id: 8,
        dateObj: new Date('2026-05-15T16:00:00'),
        displayDate: "May 15, 4:00 p.m.",
        dayGroup: "Friday",
        author: "Marcus Le Van Mao élève",
        authorColor: "#0f9d58",
        description: "Edited: Format modifier applied: font-family to Times New Roman",
        tabsState: [
            { id: 'tab1', title: 'PERSUASIVE ESSAY', content: `<div style="font-family: 'Times New Roman', serif;">${sampleEssayContent}</div>` },
            { id: 'tab2', title: 'Brainstorm', content: `<div style="font-family: 'Times New Roman', serif;">${brainstormContent}</div>` }
        ]
    },
    {
        id: 7,
        dateObj: new Date('2026-05-02T15:30:00'),
        displayDate: "May 2, 3:30 p.m.",
        dayGroup: "Saturday",
        author: "Marcus Le Van Mao élève",
        authorColor: "#0f9d58",
        description: "Edited: Corrected grammar: package -> packaged, Durkhiem -> Durkheim, soliderity -> solidarity",
        tabsState: [
            { id: 'tab1', title: 'PERSUASIVE ESSAY', content: sampleEssayContent.replace('packaged', 'package').replace('Durkheim', 'Durkhiem').replace('solidarity', 'soliderity') },
            { id: 'tab2', title: 'Brainstorm', content: brainstormContent }
        ]
    },
    {
        id: 6,
        dateObj: new Date('2026-05-02T14:10:00'),
        displayDate: "May 2, 2:10 p.m.",
        dayGroup: "Saturday",
        author: "Marcus Le Van Mao élève",
        authorColor: "#0f9d58",
        description: "Edited: Corrected spelling: civilisations -> civilizations, independantly -> independently",
        tabsState: [
            { id: 'tab1', title: 'PERSUASIVE ESSAY', content: sampleEssayContent.replace('civilizations', 'civilisations').replace('independently', 'independantly') },
            { id: 'tab2', title: 'Brainstorm', content: brainstormContent }
        ]
    },
    {
        id: 5,
        dateObj: new Date('2026-05-01T11:45:00'),
        displayDate: "May 1, 11:45 a.m.",
        dayGroup: "Friday",
        author: "Marcus Le Van Mao élève",
        authorColor: "#0f9d58",
        description: "Edited: Drafted final paragraphs of the essay",
        tabsState: [
            { id: 'tab1', title: 'PERSUASIVE ESSAY', content: sampleEssayContent.replace('civilizations', 'civilisations').replace('independently', 'independantly') },
            { id: 'tab2', title: 'Brainstorm', content: brainstormContent }
        ]
    },
    {
        id: 4,
        dateObj: new Date('2026-05-01T10:30:00'),
        displayDate: "May 1, 10:30 a.m.",
        dayGroup: "Friday",
        author: "Marcus Le Van Mao élève",
        authorColor: "#0f9d58",
        description: "Edited: Drafted Paragraph on Moral Education (with typos)",
        tabsState: [
            { id: 'tab1', title: 'PERSUASIVE ESSAY', content: "<h2>The Wasted Potential of Religion</h2><p>Across history, civilisations around the world have independantly developed religious traditions...</p><p>Religion has long served as one of humanity's most influential systems for moral education...</p>" },
            { id: 'tab2', title: 'Brainstorm', content: brainstormContent }
        ]
    },
    {
        id: 3,
        dateObj: new Date('2026-05-01T09:15:00'),
        displayDate: "May 1, 9:15 a.m.",
        dayGroup: "Friday",
        author: "Marcus Le Van Mao élève",
        authorColor: "#0f9d58",
        description: "Edited: Drafted Introduction paragraph (with typos)",
        tabsState: [
            { id: 'tab1', title: 'PERSUASIVE ESSAY', content: "<h2>The Wasted Potential of Religion</h2><p>Across history, civilisations around the world have independantly developed religious traditions...</p>" },
            { id: 'tab2', title: 'Brainstorm', content: brainstormContent }
        ]
    },
    {
        id: 2,
        dateObj: new Date('2026-04-13T14:05:00'),
        displayDate: "Apr 13, 2:05 p.m.",
        dayGroup: "Monday",
        author: "Marcus Le Van Mao élève",
        authorColor: "#0f9d58",
        description: "Edited: Added Brainstorm tab",
        tabsState: [
            { id: 'tab1', title: 'PERSUASIVE ESSAY', content: "<h2>Persuasive Essay Outline</h2><ul><li>Intro</li><li>Body 1</li><li>Conclusion</li></ul>" },
            { id: 'tab2', title: 'Brainstorm', content: "<ul><li>Need to gather sources on sociology of religion</li></ul>" }
        ]
    },
    {
        id: 1,
        dateObj: new Date('2026-04-05T10:45:00'),
        displayDate: "Apr 5, 10:45 a.m.",
        dayGroup: "Sunday",
        author: "Marcus Le Van Mao élève",
        authorColor: "#0f9d58",
        description: "Edited: Drafted essay outline",
        tabsState: [
            { id: 'tab1', title: 'PERSUASIVE ESSAY', content: "<h2>Persuasive Essay Outline</h2><ul><li>Intro</li><li>Body 1</li><li>Conclusion</li></ul>" }
        ]
    }
];

let currentlyPreviewingVersionId = null;
let currentlyPreviewingTabId = null;

// Helper: Format date to match "July 10, 4:01 p.m."
function formatHistoryDate(date) {
    const month = date.toLocaleString('default', { month: 'long' });
    const day = date.getDate();
    let time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    time = time.replace(' AM', ' a.m.').replace(' PM', ' p.m.');
    return `${month} ${day}, ${time}`;
}

// Helper: Get weekday for grouping
function getDayName(date) {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
}

/**
 * Call this function from your main app.js whenever the document saves.
 */
function saveVersionToHistory(currentTabsState) {
    const now = new Date();
    
    const newVersion = {
        id: Date.now(),
        dateObj: now,
        displayDate: formatHistoryDate(now),
        dayGroup: getDayName(now),
        author: "Marcus Le Van Mao élève", 
        authorColor: "#0f9d58",
        description: "Edited: Auto-saved changes",
        tabsState: JSON.parse(JSON.stringify(currentTabsState)) 
    };

    documentHistory.unshift(newVersion);
    renderHistorySidebar();
}

// Render the right sidebar list
function renderHistorySidebar() {
    const listContainer = document.getElementById('version-list');
    listContainer.innerHTML = '';

    let currentDayGroup = '';

    documentHistory.forEach((version, index) => {
        if (version.dayGroup !== currentDayGroup) {
            currentDayGroup = version.dayGroup;
            const dayHeader = document.createElement('div');
            dayHeader.className = 'vh-day-group';
            dayHeader.textContent = currentDayGroup;
            listContainer.appendChild(dayHeader);
        }

        const isCurrent = index === 0;
        
        const itemHtml = `
            <div class="vh-item ${isCurrent ? 'active' : ''}" data-id="${version.id}">
                <div class="vh-item-arrow">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
                </div>
                <div class="vh-item-content">
                    <div class="vh-item-time">${version.displayDate}</div>
                    <div class="vh-item-subtitle" style="font-style: italic; margin-bottom: 4px;">${version.description}</div>
                    <div class="vh-item-author-row">
                        <div class="vh-author-dot" style="background-color: ${version.authorColor};"></div>
                        <span>${version.author}</span>
                    </div>
                </div>
                <div class="vh-item-menu">⋮</div>
            </div>
        `;
        
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = itemHtml;
        const itemEl = tempDiv.firstElementChild;

        itemEl.addEventListener('click', () => {
            document.querySelectorAll('.vh-item').forEach(i => i.classList.remove('active'));
            itemEl.classList.add('active');
            previewVersion(version.id);
        });

        listContainer.appendChild(itemEl);
    });
}

// Preview a version in the center canvas
function previewVersion(versionId) {
    const version = documentHistory.find(v => v.id === versionId);
    if (!version) return;

    currentlyPreviewingVersionId = version.id;
    document.getElementById('vh-top-date-title').textContent = version.displayDate;

    const tabsContainer = document.getElementById('vh-tabs-container');
    tabsContainer.innerHTML = '';
    
    if (version.tabsState && version.tabsState.length > 0) {
        if (!currentlyPreviewingTabId || !version.tabsState.find(t => t.id === currentlyPreviewingTabId)) {
            currentlyPreviewingTabId = version.tabsState[0].id;
        }

        version.tabsState.forEach(tab => {
            const tabEl = document.createElement('div');
            // Reusing your existing tab CSS classes
            tabEl.className = `tab-item ${tab.id === currentlyPreviewingTabId ? 'active' : ''}`;
            tabEl.style.padding = '8px 16px';
            tabEl.style.cursor = 'pointer';
            tabEl.style.borderBottom = tab.id === currentlyPreviewingTabId ? '2px solid #1a73e8' : 'none';
            tabEl.innerHTML = `<span class="tab-icon">📄</span> <span class="tab-title">${tab.title}</span>`;
            
            tabEl.addEventListener('click', () => {
                currentlyPreviewingTabId = tab.id;
                previewVersion(versionId); 
            });
            tabsContainer.appendChild(tabEl);
        });

        const activeTab = version.tabsState.find(t => t.id === currentlyPreviewingTabId);
        const canvas = document.getElementById('vh-canvas');
        
        // Render with Green Highlight Block
        canvas.innerHTML = `
            <div class="vh-edit-block">
                <span class="vh-edit-author">${version.author}</span>
                ${activeTab.content || activeTab.html || ''}
            </div>
        `;
    }
}

// Triggers
document.getElementById('history-btn').addEventListener('click', () => {
    document.getElementById('version-history-view').hidden = false;
    renderHistorySidebar();
    if (documentHistory.length > 0) {
        previewVersion(documentHistory[0].id);
    }
});

document.getElementById('vh-back-btn').addEventListener('click', () => {
    document.getElementById('version-history-view').hidden = true;
});

// Full Document Restore Button Trigger
document.getElementById('vh-restore-trigger-btn').addEventListener('click', () => {
    const versionToRestore = documentHistory.find(v => v.id === currentlyPreviewingVersionId);
    if (versionToRestore) {
        if (typeof window.restoreFullDocumentState === 'function') {
            window.restoreFullDocumentState(versionToRestore.tabsState);
            document.getElementById('version-history-view').hidden = true;
        } else {
            console.warn("Restored! (Note: connect window.restoreFullDocumentState in app.js to apply this to your live editor).");
            document.getElementById('version-history-view').hidden = true;
        }
    }
});
