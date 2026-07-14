// history.js

// 1. Initial Mock Data to populate the history view immediately
const sampleEssayContent = `
<h2>The Wasted Potential of Religion</h2>
<p>Across history, civilizations around the world have independently developed religious traditions, suggesting that these beliefs address something fundamental about human nature, our need for belonging, our search for meaning, and our desire for ethical guidance. Religion has been one of humanity's most effective systems for organizing communities and transmitting values, not because of the certainty of its supernatural claims, but because of its unparalleled ability to unite people and inspire moral action. However, religion's greatest strength, its ability to create cohesive communities, can become its greatest weakness when it discourages curiosity, critical thought, and the continual betterment of human life. The measure of a religion should not be the certainty of its supernatural claims but the quality of the human beings it helps create.</p>
<br>
<p>Religion has long served as one of humanity's most influential systems for moral education. Christianity, for example, spread complex ethical teachings through parables. These simple stories could be understood and remembered by children, farmers, and kings alike. Values like charity, forgiveness, sacrifice, and humility have survived for millennia because religion packaged them within compelling narratives and shared rituals. The sociologist Émile Durkheim argued that religion reinforces social solidarity and collective identity by binding communities through shared practices and beliefs. Similarly, psychologist Jonathan Haidt argues in The Righteous Mind that religious communities foster cooperation and trust by creating "moral communities." Studies support this idea. According to the Pew Research Center, actively religious Americans report having larger social networks and stronger feelings of social support than their non-religious counterparts. Stories and rituals are effective because they connect abstract moral ideas to emotion, memory, and identity. As a result, religion builds communities capable of sustaining moral values across generations. Yet this very success creates a dangerous temptation. People can mistake the tool for its purpose and treat the stories as literal truth rather than as vehicles for human growth. Religion's greatest strength, then, is not in proving the supernatural but in cultivating communities of character.</p>
`;

let documentHistory = [
    {
        id: 2,
        dateObj: new Date(),
        displayDate: "July 10, 4:01 p.m.",
        dayGroup: "Friday",
        author: "Marcus Le Van Mao élève",
        authorColor: "#0f9d58",
        tabsState: [
            { id: 'tab1', title: 'PERSUASIVE ESSAY', content: sampleEssayContent }
        ]
    },
    {
        id: 1,
        dateObj: new Date(Date.now() - 3600000), // 1 hour prior
        displayDate: "July 10, 3:28 p.m.",
        dayGroup: "Friday",
        author: "Marcus Le Van Mao élève",
        authorColor: "#0f9d58",
        tabsState: [
            { id: 'tab1', title: 'PERSUASIVE ESSAY', content: "<p>Across history, civilizations around the world have independently developed religious traditions...</p>" }
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
                    ${isCurrent ? `<div class="vh-item-subtitle">Current version</div>` : ''}
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
