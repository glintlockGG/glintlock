---
description: "Generate a visual HTML dashboard from world state files"
---

# Dashboard Generation

Generate a dark-fantasy-themed HTML dashboard from the world state files. The dashboard is a single self-contained HTML file written to `world/dashboard.html`.

## Instructions

1. Read the following world files:
   - PC file from `world/characters/` (glob for `*.md`)
   - Current location file from `world/locations/`
   - `world/quests.md`
   - Last ~30 lines of `world/session-log.md`
   - Any NPC files from `world/npcs/` (glob for `*.md`)

2. Extract data from the YAML frontmatter and markdown body of each file.

3. Assemble the data into a JSON object with this shape:
   ```json
   {
     "character": { "name", "ancestry", "class", "level", "hp", "ac", "stats", "inventory", "gold", "xp", "location" },
     "location": { "name", "danger_level", "light", "description" },
     "quests": { "active": [...], "developing": [...], "completed": [...] },
     "journal": ["recent session log entries..."],
     "npcs": [{ "name", "status", "location", "disposition" }, ...]
   }
   ```

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
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    background: #0d0d0d;
    color: #d4c9a8;
    font-family: 'Crimson Text', Georgia, serif;
    font-size: 16px;
    line-height: 1.6;
    min-height: 100vh;
  }

  .header {
    text-align: center;
    padding: 2rem 1rem 1rem;
    border-bottom: 1px solid #2a2218;
  }

  .header h1 {
    font-family: 'Cinzel', serif;
    font-size: 2.2rem;
    color: #f0922a;
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }

  .header .subtitle {
    color: #7a6f5a;
    font-style: italic;
    margin-top: 0.25rem;
  }

  .dashboard {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    max-width: 1200px;
    margin: 1.5rem auto;
    padding: 0 1.5rem;
  }

  .panel {
    background: #1a1714;
    border: 1px solid #2a2218;
    border-radius: 4px;
    padding: 1.25rem;
  }

  .panel h2 {
    font-family: 'Cinzel', serif;
    font-size: 1.1rem;
    color: #f0922a;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    border-bottom: 1px solid #2a2218;
    padding-bottom: 0.5rem;
    margin-bottom: 0.75rem;
  }

  .stat-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 0.5rem;
    margin: 0.75rem 0;
  }

  .stat-box {
    text-align: center;
    background: #12100d;
    border: 1px solid #2a2218;
    border-radius: 3px;
    padding: 0.4rem;
  }

  .stat-box .label {
    font-family: 'Cinzel', serif;
    font-size: 0.65rem;
    color: #7a6f5a;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .stat-box .value {
    font-size: 1.3rem;
    font-weight: 600;
    color: #d4c9a8;
  }

  .stat-box .mod {
    font-size: 0.75rem;
    color: #7a6f5a;
  }

  .hp-bar {
    background: #12100d;
    border: 1px solid #2a2218;
    border-radius: 3px;
    height: 1.5rem;
    position: relative;
    overflow: hidden;
    margin: 0.5rem 0;
  }

  .hp-bar .fill {
    height: 100%;
    background: linear-gradient(90deg, #8b1a1a, #c0392b);
    transition: width 0.3s;
  }

  .hp-bar .text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-family: 'Cinzel', serif;
    font-size: 0.75rem;
    color: #d4c9a8;
    text-shadow: 0 1px 2px rgba(0,0,0,0.8);
  }

  .info-row {
    display: flex;
    justify-content: space-between;
    padding: 0.2rem 0;
    border-bottom: 1px solid #1f1b15;
  }

  .info-row .key {
    color: #7a6f5a;
    font-size: 0.85rem;
  }

  .info-row .val {
    color: #d4c9a8;
    font-weight: 600;
  }

  .inventory-list, .quest-list, .journal-list, .npc-list {
    list-style: none;
    padding: 0;
  }

  .inventory-list li, .npc-list li {
    padding: 0.25rem 0;
    border-bottom: 1px solid #1f1b15;
    font-size: 0.9rem;
  }

  .quest-list li {
    padding: 0.35rem 0;
    border-bottom: 1px solid #1f1b15;
  }

  .quest-list .quest-name {
    font-weight: 600;
    color: #d4c9a8;
  }

  .quest-list .quest-desc {
    font-size: 0.85rem;
    color: #7a6f5a;
    font-style: italic;
  }

  .quest-section-label {
    font-family: 'Cinzel', serif;
    font-size: 0.8rem;
    color: #f0922a;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-top: 0.75rem;
    margin-bottom: 0.25rem;
  }

  .quest-section-label:first-child { margin-top: 0; }

  .journal-list li {
    padding: 0.3rem 0;
    border-bottom: 1px solid #1f1b15;
    font-size: 0.85rem;
  }

  .journal-list .tag {
    display: inline-block;
    font-family: 'Cinzel', serif;
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 0.1rem 0.4rem;
    border-radius: 2px;
    margin-right: 0.4rem;
  }

  .tag-event { background: #2a1a0d; color: #f0922a; }
  .tag-discovery { background: #0d2a1a; color: #2ecc71; }
  .tag-ruling { background: #1a0d2a; color: #9b59b6; }
  .tag-thread { background: #0d1a2a; color: #3498db; }
  .tag-world-advance { background: #2a2a0d; color: #f1c40f; }

  .location-badge {
    display: inline-block;
    padding: 0.15rem 0.5rem;
    border-radius: 2px;
    font-size: 0.75rem;
    font-family: 'Cinzel', serif;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .danger-safe { background: #0d2a1a; color: #2ecc71; }
  .danger-unsafe { background: #2a2a0d; color: #f1c40f; }
  .danger-risky { background: #2a1a0d; color: #f0922a; }
  .danger-deadly { background: #2a0d0d; color: #e74c3c; }

  .npc-status {
    font-size: 0.75rem;
    padding: 0.1rem 0.3rem;
    border-radius: 2px;
  }

  .npc-alive { color: #2ecc71; }
  .npc-deceased { color: #e74c3c; text-decoration: line-through; }
  .npc-hostile { color: #e74c3c; }
  .npc-friendly { color: #2ecc71; }
  .npc-neutral { color: #f1c40f; }

  .gold-display {
    font-weight: 600;
    color: #f1c40f;
  }

  .footer {
    text-align: center;
    padding: 1.5rem;
    color: #3a3225;
    font-size: 0.75rem;
    font-style: italic;
  }

  @media (max-width: 768px) {
    .dashboard { grid-template-columns: 1fr; }
    .stat-grid { grid-template-columns: repeat(3, 1fr); }
  }
</style>
</head>
<body>

<div class="header">
  <h1>Glintlock</h1>
  <div class="subtitle">Campaign Dashboard</div>
</div>

<div class="dashboard" id="dashboard"></div>

<div class="footer">Generated by Glintlock — Shadowdark RPG</div>

<script>
const DATA = DASHBOARD_DATA;

function mod(score) {
  const m = Math.floor((score - 10) / 2);
  return m >= 0 ? `+${m}` : `${m}`;
}

function renderCharacter(c) {
  if (!c) return '';
  const hpPct = c.hp ? Math.max(0, Math.min(100, (c.hp.current / c.hp.max) * 100)) : 100;
  const stats = c.stats || {};
  const statNames = ['str','dex','con','int','wis','cha'];

  return `
    <div class="panel">
      <h2>${c.name || 'Unknown'}</h2>
      <div class="info-row"><span class="key">Ancestry / Class</span><span class="val">${c.ancestry || '?'} ${c.class || '?'} ${c.level || 1}</span></div>
      <div class="info-row"><span class="key">AC</span><span class="val">${c.ac || '?'}</span></div>
      <div class="info-row"><span class="key">XP</span><span class="val">${c.xp || 0}</span></div>
      <div class="info-row"><span class="key">Location</span><span class="val">${c.location || 'Unknown'}</span></div>
      <div class="hp-bar"><div class="fill" style="width:${hpPct}%"></div><div class="text">HP ${c.hp ? c.hp.current : '?'} / ${c.hp ? c.hp.max : '?'}</div></div>
      <div class="stat-grid">
        ${statNames.map(s => `<div class="stat-box"><div class="label">${s}</div><div class="value">${stats[s] || 10}</div><div class="mod">${mod(stats[s] || 10)}</div></div>`).join('')}
      </div>
      ${c.gold != null ? `<div class="info-row"><span class="key">Gold</span><span class="val gold-display">${c.gold} gp</span></div>` : ''}
      ${c.inventory && c.inventory.length ? `<h2>Inventory</h2><ul class="inventory-list">${c.inventory.map(i => `<li>${i}</li>`).join('')}</ul>` : ''}
    </div>`;
}

function renderLocation(loc) {
  if (!loc) return '';
  const dc = loc.danger_level || 'safe';
  return `
    <div class="panel">
      <h2>Current Location</h2>
      <div class="info-row"><span class="key">Name</span><span class="val">${loc.name || 'Unknown'}</span></div>
      <div class="info-row"><span class="key">Danger</span><span class="val"><span class="location-badge danger-${dc}">${dc}</span></span></div>
      <div class="info-row"><span class="key">Light</span><span class="val">${loc.light || '?'}</span></div>
      ${loc.description ? `<p style="margin-top:0.75rem;font-style:italic;color:#7a6f5a;font-size:0.9rem">${loc.description}</p>` : ''}
    </div>`;
}

function renderQuests(q) {
  if (!q) return '';
  function questItems(items) {
    if (!items || !items.length) return '<li style="color:#3a3225;font-style:italic">None</li>';
    return items.map(i => {
      if (typeof i === 'string') return `<li><span class="quest-name">${i}</span></li>`;
      return `<li><span class="quest-name">${i.name || i}</span>${i.desc ? `<div class="quest-desc">${i.desc}</div>` : ''}</li>`;
    }).join('');
  }
  return `
    <div class="panel">
      <h2>Quest Board</h2>
      <div class="quest-section-label">Active</div>
      <ul class="quest-list">${questItems(q.active)}</ul>
      ${q.developing && q.developing.length ? `<div class="quest-section-label">Developing</div><ul class="quest-list">${questItems(q.developing)}</ul>` : ''}
      ${q.completed && q.completed.length ? `<div class="quest-section-label">Completed</div><ul class="quest-list">${questItems(q.completed)}</ul>` : ''}
    </div>`;
}

function renderJournal(entries) {
  if (!entries || !entries.length) return '';
  const tagClass = { event:'tag-event', discovery:'tag-discovery', ruling:'tag-ruling', thread:'tag-thread', 'world-advance':'tag-world-advance' };
  return `
    <div class="panel">
      <h2>Session Journal</h2>
      <ul class="journal-list">
        ${entries.map(e => {
          const tagMatch = typeof e === 'string' ? e.match(/\[(\w[\w-]*)\]/) : null;
          const tag = tagMatch ? tagMatch[1] : null;
          const text = typeof e === 'string' ? e.replace(/\[[\w-]+\]\s*/, '') : e;
          return `<li>${tag ? `<span class="tag ${tagClass[tag] || 'tag-event'}">${tag}</span>` : ''}${text}</li>`;
        }).join('')}
      </ul>
    </div>`;
}

function renderNpcs(npcs) {
  if (!npcs || !npcs.length) return '';
  return `
    <div class="panel">
      <h2>Known NPCs</h2>
      <ul class="npc-list">
        ${npcs.map(n => `<li>
          <strong>${n.name}</strong>
          <span class="npc-status npc-${n.status || 'alive'}">${n.status || 'alive'}</span>
          <span class="npc-status npc-${n.disposition || 'neutral'}">${n.disposition || ''}</span>
          ${n.location ? `<span style="color:#7a6f5a;font-size:0.8rem"> — ${n.location}</span>` : ''}
        </li>`).join('')}
      </ul>
    </div>`;
}

const el = document.getElementById('dashboard');
el.innerHTML = [
  renderCharacter(DATA.character),
  renderLocation(DATA.location),
  renderQuests(DATA.quests),
  renderJournal(DATA.journal),
  renderNpcs(DATA.npcs),
].join('');
</script>
</body>
</html>
```

Replace `DASHBOARD_DATA` with the actual JSON object (no quotes around it — it should be a JavaScript object literal). For example:

```
const DATA = {"character":{"name":"Kael",...},"location":{...},...};
```
