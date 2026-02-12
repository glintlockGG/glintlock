---
name: dashboard-generation
description: "Generate a visual HTML campaign dashboard from world state files. This skill should be used when the player requests a dashboard, runs /glintlock:dashboard, or asks for a visual overview of their campaign."
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

The full HTML/CSS/JS template is in `references/dashboard-template.html`. Write it to `world/dashboard.html`, replacing the `DASHBOARD_DATA` placeholder with the actual JSON object.

The template uses:
- Pure CSS tabs (no JavaScript framework)
- Google Fonts: Cinzel (display), DM Sans (body), Crimson Pro (narrative), JetBrains Mono (code)
- 6 panels: Character, Quests, NPCs, Story, Audio, Log
- Dark theme with deep navy surfaces and warm parchment text
- `switchPanel(name)` for tab navigation
- `md2html(text)` for rendering chapter prose
- Journal entries grouped by session header

Replace `DASHBOARD_DATA` with the actual JSON object (no quotes around it — it should be a JavaScript object literal). For example: `const DATA = {"character":{"name":"Elindos",...},...};`
