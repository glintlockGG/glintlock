---
description: "Generate a visual HTML dashboard from world state files"
---

# Dashboard Generation

Generate a campaign dashboard from the world state files. The dashboard is a single self-contained HTML file written to `world/dashboard.html`.

## Instructions

1. Read the following world files:
   - PC file from `world/characters/` (glob for `*.md`)
   - Current location file from `world/locations/`
   - `world/quests.md`
   - All of `world/session-log.md`
   - Any NPC files from `world/npcs/` (glob for `*.md`)
   - Chronicle chapters from `world/chronicles/chapter-*.md` (read each file's content)
   - Check for audiobook files: glob `world/audiobooks/chapter-*.mp3`
   - Read session metadata if available

2. Extract data from the YAML frontmatter and markdown body of each file.

3. Assemble the data into a JSON object with this shape:
   ```json
   {
     "character": {
       "name", "ancestry", "class", "level", "hp", "ac", "stats",
       "inventory", "gold", "xp", "location",
       "spells", "talents", "class_features", "ancestry_traits", "worn"
     },
     "location": { "name", "danger_level", "light", "description" },
     "quests": { "active": [...], "developing": [...], "completed": [...] },
     "journal": ["ALL session log entries..."],
     "npcs": [{ "name", "status", "location", "disposition", "description" }, ...],
     "chapters": [
       { "number": 1, "title": "The Living Marble", "file": "chapter-01-the-living-marble.md", "content": "..." }
     ],
     "audiobooks": [
       { "chapter": 1, "title": "The Living Marble", "file": "chapter-01-the-living-marble.mp3" }
     ],
     "session_metadata": { "sessions_played": 3, "last_played": "2026-02-11" }
   }
   ```

   ### Extracting new character fields

   - **`spells`**: Array of spell name strings. Parse from the `## Spells` section — extract just the bold spell name from each bullet (e.g. `- **Mage Armor** — ...` → `"Mage Armor"`).
   - **`talents`**: Array of strings from frontmatter `talents` field.
   - **`class_features`**: Array of strings from frontmatter `class_features` field.
   - **`ancestry_traits`**: Array of strings from frontmatter `ancestry_traits` field.
   - **`worn`**: Array of strings. Parse from the `**Worn (no slot):**` line in inventory section (e.g. `"Orsino's Circlet (+1 WIS, summon healing sylph 1/day)"`). If no worn line, empty array.
   - **`description`** (NPC): First paragraph from the NPC markdown body (below frontmatter). Truncate to ~120 chars if needed.

   For chapters: embed the full markdown content of each chapter in the `content` field.
   For audiobooks: include the relative path to the MP3 file.
   For journal: include ALL entries (not just recent ones) — the Log panel groups them by session.

4. Inject the JSON into the HTML template below and Write it to `world/dashboard.html`.

## HTML Template

Write the following HTML to `world/dashboard.html`, replacing the `DASHBOARD_DATA` placeholder with the actual JSON:

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Glintlock — Campaign Dashboard</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=DM+Sans:wght@400;500;600&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400&family=JetBrains+Mono:wght@400;500&display=swap');

  :root {
    /* Surfaces — deep navy */
    --background:  #080a0f;
    --surface-1:   #0d1017;
    --surface-2:   #12151e;
    --surface-3:   #161a24;
    --surface-4:   #1a1f2a;

    /* Text — warm parchment */
    --text:           #e2ddd5;
    --text-secondary: #b0aaa2;
    --text-muted:     #7a7680;
    --text-dim:       #4e4b55;

    /* Brand & status */
    --primary:        #d4622a;
    --primary-bright: #e8773a;
    --primary-soft:   rgba(212, 98, 42, 0.1);
    --success:        #3ddc84;
    --success-soft:   rgba(61, 220, 132, 0.1);
    --warning:        #eab308;
    --warning-soft:   rgba(234, 179, 8, 0.1);
    --danger:         #ef4444;
    --danger-soft:    rgba(239, 68, 68, 0.1);
    --discord:        #5865F2;
    --discord-soft:   rgba(88, 101, 242, 0.1);
    --violet:         #a78bfa;
    --violet-soft:    rgba(167, 139, 250, 0.1);

    /* Borders */
    --border:        #1c2030;
    --border-light:  #252a3a;
    --border-accent: rgba(212, 98, 42, 0.25);

    /* Typography */
    --font-display:   'Cinzel', serif;
    --font-body:      'DM Sans', system-ui, sans-serif;
    --font-narrative: 'Crimson Pro', serif;
    --font-mono:      'JetBrains Mono', monospace;

    /* Radius */
    --radius:    8px;
    --radius-sm: 6px;
    --radius-lg: 12px;
    --radius-pill: 20px;

    /* Shadows */
    --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.4);
    --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.5);

    /* Layout */
    --header-height: 52px;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    background: var(--background);
    color: var(--text);
    font-family: var(--font-body);
    font-size: 14px;
    line-height: 1.5;
    height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  /* Noise texture overlay */
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    opacity: 0.018;
    pointer-events: none;
    z-index: 9999;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-repeat: repeat;
    background-size: 256px 256px;
  }

  /* ================= HEADER ================= */
  .header {
    height: var(--header-height);
    min-height: var(--header-height);
    display: flex;
    align-items: center;
    gap: 0;
    padding: 0 1.25rem;
    background: var(--surface-2);
    border-bottom: 1px solid var(--border);
    z-index: 10;
  }

  .header-brand {
    font-family: var(--font-display);
    font-size: 0.9rem;
    font-weight: 700;
    color: var(--primary);
    letter-spacing: 0.18em;
    text-transform: uppercase;
    white-space: nowrap;
    margin-right: 1.5rem;
  }

  /* Tab navigation */
  .tab-nav {
    display: flex;
    align-items: stretch;
    height: 100%;
    gap: 0;
  }

  .tab-btn {
    display: flex;
    align-items: center;
    padding: 0 0.85rem;
    font-family: var(--font-body);
    font-size: 0.78rem;
    font-weight: 500;
    color: var(--text-muted);
    text-decoration: none;
    cursor: pointer;
    border: none;
    background: none;
    position: relative;
    transition: color 0.15s;
    white-space: nowrap;
    letter-spacing: 0.01em;
  }

  .tab-btn:hover { color: var(--text); }

  .tab-btn.active { color: var(--primary); }

  .tab-btn.active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0.85rem;
    right: 0.85rem;
    height: 2px;
    background: var(--primary);
    border-radius: 2px 2px 0 0;
  }

  .header-meta {
    margin-left: auto;
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: var(--text-dim);
    white-space: nowrap;
  }

  /* ================= MAIN ================= */
  .main {
    flex: 1;
    overflow: hidden;
    position: relative;
  }

  .panel {
    display: none;
    position: absolute;
    inset: 0;
    overflow-y: auto;
    padding: 1.5rem;
  }
  .panel.active { display: block; }

  /* ================= SCROLLBAR ================= */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--background); }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--text-dim); }

  /* ================= SECTION HEADING ================= */
  .section-heading {
    font-family: var(--font-display);
    font-size: 0.72rem;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 0.6rem;
  }

  .section-heading .chevron {
    color: var(--primary);
    margin-right: 0.3rem;
  }

  /* ================= CHARACTER PANEL ================= */

  /* Hero banner */
  .hero-banner {
    background: var(--surface-2);
    border-bottom: 1px solid var(--border);
    padding: 1.25rem 1.5rem;
    margin: -1.5rem -1.5rem 1.5rem -1.5rem;
  }

  .hero-name {
    font-family: var(--font-display);
    font-size: 1.6rem;
    font-weight: 700;
    color: var(--text);
    letter-spacing: 0.03em;
    margin-bottom: 0.15rem;
  }

  .hero-subtitle {
    font-family: var(--font-body);
    font-size: 0.85rem;
    color: var(--text-secondary);
    margin-bottom: 0.6rem;
  }

  .hero-quick-stats {
    display: flex;
    align-items: center;
    gap: 1.25rem;
    margin-bottom: 0.75rem;
  }

  .quick-stat {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--text-muted);
  }

  .quick-stat .qval {
    color: var(--text);
    font-weight: 500;
  }

  .quick-stat.gold .qval { color: var(--warning); }

  /* HP bar */
  .hp-track {
    width: 100%;
    height: 22px;
    background: var(--surface-1);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    position: relative;
    overflow: hidden;
  }

  .hp-fill {
    height: 100%;
    border-radius: var(--radius-sm);
    background: linear-gradient(90deg, #b84520, var(--primary), var(--primary-bright));
    transition: width 0.4s ease;
  }

  .hp-fill.low { background: linear-gradient(90deg, #8b1a1a, var(--danger)); }

  .hp-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-family: var(--font-mono);
    font-size: 0.7rem;
    font-weight: 500;
    color: var(--text);
    text-shadow: 0 1px 3px rgba(0,0,0,0.9);
  }

  /* Three-column body */
  .char-columns {
    display: grid;
    grid-template-columns: 140px 1fr 1fr;
    gap: 1.25rem;
    align-items: start;
  }

  /* Ability scores */
  .ability-stack {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .ability-box {
    background: var(--surface-1);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 0.5rem 0.25rem 0.4rem;
    text-align: center;
  }

  .ability-label {
    font-family: var(--font-mono);
    font-size: 0.55rem;
    font-weight: 500;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 0.15rem;
  }

  .ability-score {
    font-family: var(--font-display);
    font-size: 1.3rem;
    font-weight: 600;
    color: var(--text);
    line-height: 1;
    margin-bottom: 0.2rem;
  }

  .ability-mod {
    display: inline-block;
    font-family: var(--font-mono);
    font-size: 0.65rem;
    font-weight: 500;
    color: var(--text-muted);
    background: var(--surface-3);
    padding: 0.05rem 0.35rem;
    border-radius: var(--radius-sm);
  }

  /* Talents section below abilities */
  .talents-section {
    margin-top: 0.75rem;
    padding-top: 0.6rem;
    border-top: 1px solid var(--border);
  }

  .talents-label {
    font-family: var(--font-display);
    font-size: 0.6rem;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 0.3rem;
  }

  .talent-item {
    font-size: 0.75rem;
    color: var(--text-secondary);
    padding: 0.1rem 0;
  }

  /* Card used in middle and right columns */
  .char-card {
    background: var(--surface-3);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 0.85rem 1rem;
    margin-bottom: 0.75rem;
  }

  .char-card-title {
    font-family: var(--font-display);
    font-size: 0.68rem;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 0.5rem;
  }

  .char-card-title .chevron {
    color: var(--primary);
    margin-right: 0.25rem;
  }

  /* Inventory list */
  .inv-list {
    list-style: none;
  }

  .inv-list li {
    font-size: 0.82rem;
    color: var(--text-secondary);
    padding: 0.2rem 0;
    border-bottom: 1px solid var(--border);
  }

  .inv-list li:last-child { border-bottom: none; }

  .inv-slot-count {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: var(--text-dim);
    margin-top: 0.4rem;
  }

  .inv-worn-label {
    font-family: var(--font-mono);
    font-size: 0.6rem;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-top: 0.6rem;
    margin-bottom: 0.25rem;
    padding-top: 0.4rem;
    border-top: 1px solid var(--border);
  }

  /* Spell list */
  .spell-item {
    font-size: 0.82rem;
    color: var(--text-secondary);
    padding: 0.2rem 0;
  }

  .spell-item::before {
    content: '\2022';
    color: var(--primary);
    margin-right: 0.4rem;
  }

  /* Feature list */
  .feature-item {
    font-size: 0.82rem;
    color: var(--text-secondary);
    padding: 0.2rem 0;
  }

  .feature-item::before {
    content: '\2022';
    color: var(--text-dim);
    margin-right: 0.4rem;
  }

  /* Location card in right column */
  .loc-name {
    font-family: var(--font-display);
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 0.2rem;
  }

  .loc-meta {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: var(--text-muted);
    margin-bottom: 0.5rem;
  }

  .loc-desc {
    font-family: var(--font-narrative);
    font-size: 0.88rem;
    font-style: italic;
    color: var(--text-secondary);
    line-height: 1.6;
  }

  /* ================= QUESTS PANEL ================= */
  .quests-container {
    max-width: 700px;
    margin: 0 auto;
  }

  .quest-section-label {
    font-family: var(--font-display);
    font-size: 0.72rem;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-top: 1.25rem;
    margin-bottom: 0.5rem;
  }

  .quest-section-label:first-child { margin-top: 0; }

  .quest-card {
    background: var(--surface-3);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 0.75rem 1rem;
    margin-bottom: 0.5rem;
    border-left: 3px solid var(--primary);
  }

  .quest-card.developing { border-left-color: var(--discord); }
  .quest-card.completed { border-left-color: var(--text-dim); }

  .quest-name {
    font-family: var(--font-body);
    font-weight: 600;
    font-size: 0.88rem;
    color: var(--text);
  }

  .quest-desc {
    font-size: 0.8rem;
    color: var(--text-secondary);
    font-style: italic;
    margin-top: 0.15rem;
  }

  .quest-progress {
    font-size: 0.75rem;
    color: var(--text-muted);
    margin-top: 0.15rem;
  }

  /* ================= NPCs PANEL ================= */
  .npc-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 0.75rem;
  }

  .npc-card {
    background: var(--surface-3);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 0.75rem 1rem;
  }

  .npc-name {
    font-family: var(--font-display);
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 0.25rem;
  }

  .npc-name.deceased {
    text-decoration: line-through;
    color: var(--danger);
  }

  .npc-badges {
    display: flex;
    gap: 0.35rem;
    flex-wrap: wrap;
    margin-bottom: 0.35rem;
  }

  .pill {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.1rem 0.45rem;
    border-radius: var(--radius-pill);
    font-family: var(--font-mono);
    font-size: 0.6rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  .pill-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
  }

  .pill-alive { background: var(--success-soft); color: var(--success); }
  .pill-alive .pill-dot { background: var(--success); }
  .pill-deceased { background: var(--danger-soft); color: var(--danger); }
  .pill-deceased .pill-dot { background: var(--danger); }

  .pill-friendly { background: var(--success-soft); color: var(--success); }
  .pill-wary { background: var(--warning-soft); color: var(--warning); }
  .pill-hostile { background: var(--danger-soft); color: var(--danger); }
  .pill-neutral { background: rgba(122, 118, 128, 0.1); color: var(--text-muted); }

  .npc-location {
    font-family: var(--font-mono);
    font-size: 0.68rem;
    color: var(--text-muted);
    margin-bottom: 0.3rem;
  }

  .npc-desc {
    font-size: 0.78rem;
    color: var(--text-secondary);
    line-height: 1.45;
  }

  /* ================= STORY PANEL ================= */
  .story-reader {
    max-width: 680px;
    margin: 0 auto;
  }

  .chapter-select {
    margin-bottom: 1.5rem;
  }

  .chapter-select select {
    background: var(--surface-1);
    border: 1px solid var(--border);
    color: var(--text);
    font-family: var(--font-narrative);
    font-size: 0.95rem;
    padding: 0.4rem 0.75rem;
    border-radius: var(--radius);
    cursor: pointer;
  }

  .chapter-select select:focus {
    outline: none;
    border-color: var(--primary);
  }

  .chapter-prose {
    font-family: var(--font-narrative);
    font-size: 1.06rem;
    font-weight: 300;
    line-height: 1.75;
    color: var(--text-secondary);
  }

  .chapter-prose h1 {
    font-family: var(--font-display);
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--primary);
    margin-bottom: 0.5rem;
    letter-spacing: 0.04em;
  }

  .chapter-prose hr {
    border: none;
    border-top: 1px solid var(--border);
    margin: 1.8rem auto;
    width: 40%;
  }

  .chapter-prose p {
    margin-bottom: 1rem;
    text-indent: 1.5em;
  }

  .chapter-prose p:first-of-type,
  .chapter-prose hr + p { text-indent: 0; }

  .chapter-prose em { color: var(--text-muted); }

  .chapter-prose .epigraph {
    text-align: center;
    font-style: italic;
    color: var(--text-muted);
    margin: 1.5rem 0;
    text-indent: 0;
  }

  /* ================= AUDIO PANEL ================= */
  .audio-wrap {
    max-width: 680px;
    margin: 0 auto;
  }

  .audio-card {
    background: var(--surface-3);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 1rem 1.25rem;
    margin-bottom: 0.75rem;
  }

  .audio-card h3 {
    font-family: var(--font-display);
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--primary);
    margin-bottom: 0.6rem;
    letter-spacing: 0.04em;
  }

  .audio-card audio {
    width: 100%;
    height: 36px;
    border-radius: var(--radius-sm);
    outline: none;
  }

  audio::-webkit-media-controls-panel { background: var(--surface-1); }
  audio::-webkit-media-controls-current-time-display,
  audio::-webkit-media-controls-time-remaining-display {
    color: var(--text-muted);
    font-size: 0.7rem;
  }

  /* ================= LOG PANEL ================= */
  .log-container {
    max-width: 700px;
    margin: 0 auto;
  }

  .session-group {
    margin-bottom: 1.25rem;
  }

  .session-group-label {
    font-family: var(--font-display);
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--text);
    letter-spacing: 0.06em;
    padding-bottom: 0.35rem;
    border-bottom: 1px solid var(--border);
    margin-bottom: 0.4rem;
  }

  .log-list {
    list-style: none;
  }

  .log-list li {
    font-size: 0.82rem;
    color: var(--text-secondary);
    padding: 0.25rem 0;
    border-bottom: 1px solid var(--border);
    line-height: 1.5;
  }

  .log-list li:last-child { border-bottom: none; }

  /* Journal tag pills */
  .tag {
    display: inline-block;
    font-family: var(--font-mono);
    font-size: 0.55rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    padding: 0.08rem 0.35rem;
    border-radius: var(--radius-sm);
    margin-right: 0.3rem;
    vertical-align: middle;
  }

  .tag-event       { background: var(--primary-soft); color: var(--primary); }
  .tag-discovery   { background: var(--success-soft); color: var(--success); }
  .tag-thread      { background: var(--discord-soft); color: var(--discord); }
  .tag-ruling      { background: var(--violet-soft); color: var(--violet); }
  .tag-world-advance { background: var(--warning-soft); color: var(--warning); }

  /* ================= SHARED ================= */
  .no-content {
    text-align: center;
    color: var(--text-dim);
    font-style: italic;
    font-family: var(--font-narrative);
    font-size: 1rem;
    padding: 4rem 0;
  }

  .danger-badge {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    font-weight: 500;
  }

  .danger-safe    { color: var(--success); }
  .danger-unsafe  { color: var(--warning); }
  .danger-risky   { color: var(--primary); }
  .danger-deadly  { color: var(--danger); }

  /* ================= RESPONSIVE ================= */
  @media (max-width: 900px) {
    .char-columns {
      grid-template-columns: 1fr 1fr;
    }
    .ability-stack {
      flex-direction: row;
      flex-wrap: wrap;
      gap: 0.4rem;
    }
    .ability-box { flex: 1; min-width: 60px; }
    .col-left { grid-column: 1 / -1; }
  }

  @media (max-width: 600px) {
    .char-columns {
      grid-template-columns: 1fr;
    }
    .hero-quick-stats { flex-wrap: wrap; gap: 0.75rem; }
    .tab-btn { padding: 0 0.5rem; font-size: 0.7rem; }
    .header-brand { font-size: 0.75rem; margin-right: 0.75rem; }
    .header-meta { display: none; }
    .panel { padding: 1rem; }
    .hero-banner { margin: -1rem -1rem 1rem -1rem; padding: 1rem; }
  }
</style>
</head>
<body>

<div class="header">
  <span class="header-brand">Glintlock</span>
  <nav class="tab-nav">
    <button class="tab-btn active" data-panel="character" onclick="switchPanel('character')">Character</button>
    <button class="tab-btn" data-panel="quests" onclick="switchPanel('quests')">Quests</button>
    <button class="tab-btn" data-panel="npcs" onclick="switchPanel('npcs')">NPCs</button>
    <button class="tab-btn" data-panel="story" onclick="switchPanel('story')">Story</button>
    <button class="tab-btn" data-panel="audio" onclick="switchPanel('audio')">Audio</button>
    <button class="tab-btn" data-panel="log" onclick="switchPanel('log')">Log</button>
  </nav>
  <span class="header-meta" id="header-meta"></span>
</div>

<div class="main">
  <div class="panel active" id="panel-character"></div>
  <div class="panel" id="panel-quests"></div>
  <div class="panel" id="panel-npcs"></div>
  <div class="panel" id="panel-story"></div>
  <div class="panel" id="panel-audio"></div>
  <div class="panel" id="panel-log"></div>
</div>

<script>
const DATA = DASHBOARD_DATA;

/* --- Utility --- */
function mod(score) {
  const m = Math.floor((score - 10) / 2);
  return m >= 0 ? '+' + m : '' + m;
}

function esc(s) {
  if (s == null) return '';
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

/* --- Panel switching --- */
function switchPanel(name) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('panel-' + name);
  if (target) target.classList.add('active');
  document.querySelectorAll('.tab-btn').forEach(n => n.classList.remove('active'));
  const btn = document.querySelector('.tab-btn[data-panel="' + name + '"]');
  if (btn) btn.classList.add('active');
}

/* --- Markdown to HTML (for story prose) --- */
function md2html(text) {
  if (!text) return '';
  let html = text.replace(/\n---\n/g, '<hr>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
  html = html.replace(/^\*([^*]+)\*$/gm, '<p class="epigraph"><em>$1</em></p>');
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  const parts = html.split(/\n\n+/);
  return parts.map(p => {
    p = p.trim();
    if (!p) return '';
    if (p.startsWith('<h1>') || p.startsWith('<hr') || p.startsWith('<p class="epigraph">')) return p;
    return '<p>' + p + '</p>';
  }).join('\n');
}

/* --- Render: Header meta --- */
function renderHeader() {
  const meta = DATA.session_metadata || {};
  const parts = [];
  if (meta.sessions_played) parts.push(meta.sessions_played + ' sessions');
  if (meta.last_played) parts.push(meta.last_played);
  document.getElementById('header-meta').textContent = parts.join(' \u00b7 ');
}

/* --- Render: Character panel --- */
function renderCharacter() {
  const c = DATA.character;
  const el = document.getElementById('panel-character');
  if (!c) { el.innerHTML = '<div class="no-content">No character data.</div>'; return; }

  const hpCur = c.hp ? c.hp.current : 0;
  const hpMax = c.hp ? c.hp.max : 1;
  const hpPct = Math.max(0, Math.min(100, (hpCur / hpMax) * 100));
  const hpLow = hpPct <= 35;
  const stats = c.stats || {};
  const statNames = ['str','dex','con','int','wis','cha'];
  const statLabels = {str:'STR',dex:'DEX',con:'CON',int:'INT',wis:'WIS',cha:'CHA'};

  let html = '';

  /* Hero banner */
  html += '<div class="hero-banner">';
  html += '<div class="hero-name">' + esc(c.name) + '</div>';
  html += '<div class="hero-subtitle">' + esc((c.ancestry||'') + ' ' + (c.class||'') + ' ' + (c.level||1)) + (c.background ? ' \u00b7 ' + esc(c.background) : '') + '</div>';
  html += '<div class="hero-quick-stats">';
  html += '<span class="quick-stat">AC <span class="qval">' + (c.ac||'?') + '</span></span>';
  html += '<span class="quick-stat">XP <span class="qval">' + (c.xp||0) + '</span></span>';
  html += '<span class="quick-stat gold">Gold <span class="qval">' + (c.gold||0) + ' gp</span></span>';
  html += '</div>';
  html += '<div class="hp-track"><div class="hp-fill' + (hpLow ? ' low' : '') + '" style="width:' + hpPct + '%"></div>';
  html += '<div class="hp-text">HP ' + hpCur + ' / ' + hpMax + '</div></div>';
  html += '</div>';

  /* Three-column body */
  html += '<div class="char-columns">';

  /* Left column — abilities + talents */
  html += '<div class="col-left"><div class="ability-stack">';
  statNames.forEach(s => {
    const val = stats[s] || 10;
    html += '<div class="ability-box">';
    html += '<div class="ability-label">' + statLabels[s] + '</div>';
    html += '<div class="ability-score">' + val + '</div>';
    html += '<span class="ability-mod">' + mod(val) + '</span>';
    html += '</div>';
  });
  html += '</div>';

  /* Talents */
  const talents = c.talents || [];
  if (talents.length) {
    html += '<div class="talents-section"><div class="talents-label">Talents</div>';
    talents.forEach(t => { html += '<div class="talent-item">' + esc(t) + '</div>'; });
    html += '</div>';
  }
  html += '</div>';

  /* Middle column — inventory */
  html += '<div class="col-mid">';
  html += '<div class="char-card"><div class="char-card-title"><span class="chevron">&rsaquo;</span> Inventory</div>';
  if (c.inventory && c.inventory.length) {
    html += '<ul class="inv-list">';
    c.inventory.forEach(i => { html += '<li>' + esc(i) + '</li>'; });
    html += '</ul>';
    html += '<div class="inv-slot-count">' + c.inventory.length + '/10 slots</div>';
  } else {
    html += '<div style="color:var(--text-dim);font-style:italic;font-size:0.82rem">Empty</div>';
  }

  /* Worn items */
  const worn = c.worn || [];
  if (worn.length) {
    html += '<div class="inv-worn-label">Worn (no slot)</div>';
    worn.forEach(w => { html += '<div class="spell-item" style="font-size:0.8rem">' + esc(w) + '</div>'; });
  }
  html += '</div></div>';

  /* Right column — location, spells, features */
  html += '<div class="col-right">';

  /* Location */
  const loc = DATA.location;
  if (loc) {
    html += '<div class="char-card"><div class="char-card-title"><span class="chevron">&rsaquo;</span> Location</div>';
    html += '<div class="loc-name">' + esc(loc.name) + '</div>';
    const dangerClass = 'danger-' + (loc.danger_level || 'safe');
    html += '<div class="loc-meta"><span class="danger-badge ' + dangerClass + '">' + esc(loc.danger_level || 'safe') + '</span>';
    if (loc.light) html += ' \u00b7 ' + esc(loc.light);
    html += '</div>';
    if (loc.description) html += '<div class="loc-desc">' + esc(loc.description) + '</div>';
    html += '</div>';
  }

  /* Spells */
  const spells = c.spells || [];
  if (spells.length) {
    html += '<div class="char-card"><div class="char-card-title"><span class="chevron">&rsaquo;</span> Spells (Tier 1)</div>';
    spells.forEach(s => { html += '<div class="spell-item">' + esc(s) + '</div>'; });
    html += '</div>';
  }

  /* Features */
  const features = [].concat(c.class_features || [], c.ancestry_traits || []);
  if (features.length) {
    html += '<div class="char-card"><div class="char-card-title"><span class="chevron">&rsaquo;</span> Features</div>';
    features.forEach(f => { html += '<div class="feature-item">' + esc(f) + '</div>'; });
    html += '</div>';
  }

  html += '</div>'; /* end col-right */
  html += '</div>'; /* end char-columns */

  el.innerHTML = html;
}

/* --- Render: Quests panel --- */
function renderQuests() {
  const q = DATA.quests;
  const el = document.getElementById('panel-quests');
  if (!q) { el.innerHTML = '<div class="no-content">No quest data.</div>'; return; }

  function questCards(arr, cls) {
    if (!arr || !arr.length) return '<div style="color:var(--text-dim);font-style:italic;font-size:0.82rem;padding:0.25rem 0">None</div>';
    return arr.map(i => {
      const name = typeof i === 'string' ? i : (i.name || i);
      const desc = typeof i === 'object' ? i.desc : null;
      const progress = typeof i === 'object' ? i.progress : null;
      let h = '<div class="quest-card ' + cls + '">';
      h += '<div class="quest-name">' + esc(name) + '</div>';
      if (desc) h += '<div class="quest-desc">' + esc(desc) + '</div>';
      if (progress) h += '<div class="quest-progress">' + esc(progress) + '</div>';
      h += '</div>';
      return h;
    }).join('');
  }

  let html = '<div class="quests-container">';
  html += '<div class="quest-section-label"><span class="chevron" style="color:var(--primary)">&rsaquo;</span> Active</div>';
  html += questCards(q.active, '');
  if (q.developing && q.developing.length) {
    html += '<div class="quest-section-label"><span class="chevron" style="color:var(--discord)">&rsaquo;</span> Developing</div>';
    html += questCards(q.developing, 'developing');
  }
  if (q.completed && q.completed.length) {
    html += '<div class="quest-section-label"><span class="chevron" style="color:var(--text-dim)">&rsaquo;</span> Completed</div>';
    html += questCards(q.completed, 'completed');
  }
  html += '</div>';
  el.innerHTML = html;
}

/* --- Render: NPCs panel --- */
function renderNpcs() {
  const npcs = DATA.npcs || [];
  const el = document.getElementById('panel-npcs');
  if (!npcs.length) { el.innerHTML = '<div class="no-content">No known NPCs.</div>'; return; }

  let html = '<div class="npc-grid">';
  npcs.forEach(n => {
    const dead = (n.status||'alive') === 'deceased';
    html += '<div class="npc-card">';
    html += '<div class="npc-name' + (dead ? ' deceased' : '') + '">' + esc(n.name) + '</div>';
    html += '<div class="npc-badges">';
    /* Status pill */
    const sCls = dead ? 'pill-deceased' : 'pill-alive';
    html += '<span class="pill ' + sCls + '"><span class="pill-dot"></span>' + (dead ? 'deceased' : 'alive') + '</span>';
    /* Disposition pill */
    if (n.disposition) {
      const dMap = {friendly:'pill-friendly',wary:'pill-wary',hostile:'pill-hostile',neutral:'pill-neutral'};
      html += '<span class="pill ' + (dMap[n.disposition]||'pill-neutral') + '">' + esc(n.disposition) + '</span>';
    }
    html += '</div>';
    if (n.location) html += '<div class="npc-location">' + esc(n.location) + '</div>';
    if (n.description) html += '<div class="npc-desc">' + esc(n.description) + '</div>';
    html += '</div>';
  });
  html += '</div>';
  el.innerHTML = html;
}

/* --- Render: Story panel --- */
function renderStory() {
  const el = document.getElementById('panel-story');
  const chapters = DATA.chapters || [];
  if (!chapters.length) {
    el.innerHTML = '<div class="story-reader"><div class="no-content">No chronicles written yet. Use /glintlock:chronicle to generate a chapter.</div></div>';
    return;
  }
  let html = '<div class="story-reader"><div class="chapter-select"><select id="chapter-select" onchange="showChapter(this.value)">';
  chapters.forEach((ch, i) => {
    html += '<option value="' + i + '">Chapter ' + ch.number + ': ' + esc(ch.title) + '</option>';
  });
  html += '</select></div><div id="chapter-content"></div></div>';
  el.innerHTML = html;
  showChapter(0);
}

function showChapter(idx) {
  const ch = DATA.chapters[idx];
  if (!ch) return;
  document.getElementById('chapter-content').innerHTML = '<div class="chapter-prose">' + md2html(ch.content) + '</div>';
}

/* --- Render: Audio panel --- */
function renderAudio() {
  const el = document.getElementById('panel-audio');
  const audiobooks = DATA.audiobooks || [];
  if (!audiobooks.length) {
    el.innerHTML = '<div class="audio-wrap"><div class="no-content">No audiobooks generated yet. Use /glintlock:audiobook to generate one.</div></div>';
    return;
  }
  el.innerHTML = '<div class="audio-wrap">' + audiobooks.map(ab =>
    '<div class="audio-card"><h3>Chapter ' + ab.chapter + ': ' + esc(ab.title) + '</h3>' +
    '<audio controls preload="metadata"><source src="' + esc(ab.file) + '" type="audio/mpeg">Your browser does not support the audio element.</audio></div>'
  ).join('') + '</div>';
}

/* --- Render: Log panel --- */
function renderLog() {
  const journal = DATA.journal || [];
  const el = document.getElementById('panel-log');
  if (!journal.length) { el.innerHTML = '<div class="no-content">No journal entries.</div>'; return; }

  const tc = { event:'tag-event', discovery:'tag-discovery', ruling:'tag-ruling', thread:'tag-thread', 'world-advance':'tag-world-advance' };

  /* Group by session headers */
  const groups = [];
  let current = { label: 'Journal', entries: [] };
  journal.forEach(e => {
    const str = typeof e === 'string' ? e : '';
    const sessionMatch = str.match(/^##?\s*Session\s+(\d+)/);
    if (sessionMatch) {
      if (current.entries.length) groups.push(current);
      current = { label: 'Session ' + sessionMatch[1], entries: [] };
      return;
    }
    if (str.trim() && !str.match(/^#/)) current.entries.push(str);
  });
  if (current.entries.length) groups.push(current);

  let html = '<div class="log-container">';
  /* Reverse — newest session first */
  groups.reverse().forEach(g => {
    html += '<div class="session-group"><div class="session-group-label">' + esc(g.label) + '</div>';
    html += '<ul class="log-list">';
    g.entries.forEach(e => {
      const m = e.match(/\[(\w[\w-]*)\]/);
      const tag = m ? m[1] : null;
      const text = e.replace(/\[[\w-]+\]\s*/, '').replace(/^-\s*/, '');
      html += '<li>' + (tag ? '<span class="tag ' + (tc[tag]||'tag-event') + '">' + tag + '</span>' : '') + esc(text) + '</li>';
    });
    html += '</ul></div>';
  });
  html += '</div>';
  el.innerHTML = html;
}

/* --- Init --- */
renderHeader();
renderCharacter();
renderQuests();
renderNpcs();
renderStory();
renderAudio();
renderLog();
</script>
</body>
</html>
```

Replace `DASHBOARD_DATA` with the actual JSON object (no quotes around it — it should be a JavaScript object literal). For example:

```
const DATA = {"character":{"name":"Elindos","spells":["Mage Armor","Magic Missile","Sleep","Read Magic"],...},...};
```
