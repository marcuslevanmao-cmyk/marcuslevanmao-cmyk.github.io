// history.js — Complete Version History Engine with Full Workspace Snapshots

// ============================================================
// 1. CONTENT DEFINITIONS (used by the history data)
// ============================================================

const outlineContent = `<h2>Persuasive Essay Outline</h2><ul><li>Intro</li><li>Body 1</li><li>Conclusion</li></ul>`;
const introContent = `<h2>The Wasted Potential of Religion</h2><p>Across history, civilisations around the world have independantly developed religious traditions, suggesting that these beliefs address something fundamental about human nature.</p>`;
const bodyContent = `<h2>The Wasted Potential of Religion</h2><p>Across history, civilisations around the world have independantly developed religious traditions...</p><p>Religion has long served as one of humanity's most influential systems for moral education.</p>`;
const finalContent = `<h2>The Wasted Potential of Religion</h2><p>Across history, civilizations around the world have independently developed religious traditions, suggesting that these beliefs address something fundamental about human nature, our need for belonging, our search for meaning, and our desire for ethical guidance. Religion has been one of humanity's most effective systems for organizing communities and transmitting values, not because of the certainty of its supernatural claims, but because of its unparalleled ability to unite people and inspire moral action. However, religion's greatest strength, its ability to create cohesive communities, can become its greatest weakness when it discourages curiosity, critical thought, and the continual betterment of human life. The measure of a religion should not be the certainty of its supernatural claims but the quality of the human beings it helps create.</p><br><p>Religion has long served as one of humanity's most influential systems for moral education. Christianity, for example, spread complex ethical teachings through parables...</p>`;
const brainstormContent = `<h2>Brainstorming Notes</h2><ul><li><b>Theme:</b> Utility vs Truth</li><li><b>Key thinkers:</b> Durkheim, Haidt</li></ul>`;

// ============================================================
// 2. FULL HISTORY — all Marcus's edits (no "You")
// ============================================================

const documentHistory = [
    {
        id: 8,
        dateObj: new Date('2026-05-15T16:00:00'),
        displayDate: "May 15, 4:00 p.m.",
        dayGroup: "Friday",
        author: "Marcus Le Van Mao",
        authorColor: "#0f9d58",
        description: "Edited: Format modifier applied",
        tabsState: [
            { id: 'tab1', title: 'PERSUASIVE ESSAY', content: finalContent },
            { id: 'tab2', title: 'Brainstorm', content: brainstormContent }
        ]
    },
    {
        id: 7,
        dateObj: new Date('2026-05-02T15:30:00'),
        displayDate: "May 2, 3:30 p.m.",
        dayGroup: "Saturday",
        author: "Marcus Le Van Mao",
        authorColor: "#0f9d58",
        description: "Edited: Grammar and spelling fixes",
        tabsState: [
            { id: 'tab1', title: 'PERSUASIVE ESSAY', content: finalContent.replace("civilizations", "civilisations") },
            { id: 'tab2', title: 'Brainstorm', content: brainstormContent }
        ]
    },
    {
        id: 6,
        dateObj: new Date('2026-05-01T14:30:00'),
        displayDate: "May 1, 2:30 p.m.",
        dayGroup: "Friday",
        author: "Marcus Le Van Mao",
        authorColor: "#0f9d58",
        description: "Edited: Expanded body with examples",
        tabsState: [
            { id: 'tab1', title: 'PERSUASIVE ESSAY', content: bodyContent + "<p>Studies show religious communities report stronger social support...</p>" },
            { id: 'tab2', title: 'Brainstorm', content: brainstormContent }
        ]
    },
    {
        id: 5,
        dateObj: new Date('2026-05-01T11:45:00'),
        displayDate: "May 1, 11:45 a.m.",
        dayGroup: "Friday",
        author: "Marcus Le Van Mao",
        authorColor: "#0f9d58",
        description: "Edited: Drafted final paragraphs",
        tabsState: [
            { id: 'tab1', title: 'PERSUASIVE ESSAY', content: bodyContent + "<p>...and thus religion remains vital.</p>" },
            { id: 'tab2', title: 'Brainstorm', content: brainstormContent }
        ]
    },
    {
        id: 4,
        dateObj: new Date('2026-05-01T10:30:00'),
        displayDate: "May 1, 10:30 a.m.",
        dayGroup: "Friday",
        author: "Marcus Le Van Mao",
        authorColor: "#0f9d58",
        description: "Edited: Drafted body paragraphs",
        tabsState: [
            { id: 'tab1', title: 'PERSUASIVE ESSAY', content: bodyContent },
            { id: 'tab2', title: 'Brainstorm', content: brainstormContent }
        ]
    },
    {
        id: 3,
        dateObj: new Date('2026-05-01T09:15:00'),
        displayDate: "May 1, 9:15 a.m.",
        dayGroup: "Friday",
        author: "Marcus Le Van Mao",
        authorColor: "#0f9d58",
        description: "Edited: Drafted Introduction",
        tabsState: [
            { id: 'tab1', title: 'PERSUASIVE ESSAY', content: introContent },
            { id: 'tab2', title: 'Brainstorm', content: brainstormContent }
        ]
    },
    {
        id: 2,
        dateObj: new Date('2026-04-13T14:05:00'),
        displayDate: "Apr 13, 2:05 p.m.",
        dayGroup: "Monday",
        author: "Marcus Le Van Mao",
        authorColor: "#0f9d58",
        description: "Edited: Added Brainstorm tab",
        tabsState: [
            { id: 'tab1', title: 'PERSUASIVE ESSAY', content: outlineContent },
            { id: 'tab2', title: 'Brainstorm', content: brainstormContent }
        ]
    },
    {
        id: 1,
        dateObj: new Date('2026-04-05T10:45:00'),
        displayDate: "Apr 5, 10:45 a.m.",
        dayGroup: "Sunday",
        author: "Marcus Le Van Mao",
        authorColor: "#0f9d58",
        description: "Edited: Drafted essay outline",
        tabsState: [
            { id: 'tab1', title: 'PERSUASIVE ESSAY', content: outlineContent }
        ]
    }
];

// ============================================================
// 3. HISTORY ENGINE (unchanged, same as before)
// ============================================================

const HistoryEngine = (() => {
    // ... (keep your existing HistoryEngine implementation, it works fine)
    // I’m omitting it here for brevity, but you already have it in your file.
})();

// ============================================================
// 4. RENDER FUNCTIONS (unchanged)
// ============================================================
// ... (keep renderHistorySidebar, previewVersion, etc.)
