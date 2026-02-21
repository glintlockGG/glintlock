---
name: dashboard-generation
description: "Generate a visual HTML campaign dashboard from world state files. This skill should be used when the player requests a dashboard, runs /glintlock:dashboard, or asks for a visual overview of their campaign."
---

# Dashboard Generation

Generate a campaign dashboard from the world state files. The dashboard is a single self-contained HTML file written to `world/dashboard.html`.

## Overview

The dashboard uses a Discord-style layout with four persistent zones and five switchable views:

### Layout Zones

- **Left Rail (64px)** — Logo, 5 navigation icons with tooltips, drawer toggle, character minicard (HP bar, Armor badge)
- **Center Workspace (fluid)** — Scrollable content area, switches between 5 views
- **Right Drawer (320px, collapsible)** — Three tabs: Quests (active/developing/completed), NPCs (name/location/disposition), Log (recent entries with tag badges)
- **Bottom Bar (52px)** — Persistent strip: countdown dice, progress clocks (cap 3), doom portent pips (cap 3, only if >0), calendar date, danger level badge

### Views

1. **Player (Character Sheet)** — Hero banner with 3-state HP bar (green/amber/red), 6-stat grid with color-coded top borders, training pills + countdown dice, inventory with slot counter, class/ancestry features, location card, death clock (if >0)
2. **GM Screen** — Strong start, secrets (structured: label/info/discovery paths), NPC moves, scenes, encounters, treasure, NPC combat grid (filtered to those with stats), doom portent tracks, progress clocks, difficulty reference
3. **Campaign Overview** — Campaign banner, calendar card (date/season/weather), world state, doom portent pip tracks, factions, quest tracker, session timeline
4. **Story & Audio** — Chapter list with status badges (Read/Writing/Audio), prose reader (Crimson Pro), native audio player
5. **Analytics** — Summary stats (days active, sessions, NPCs met), doom overview, activity distribution bar chart, character summary

## Instructions

1. Read the following world files:
   - PC file from `world/characters/` (glob for `*.md`)
   - Current location file from `world/locations/`
   - `world/quests.md`
   - All of `world/session-log.md`
   - NPC files from `world/npcs/` (glob for `*.md`)
   - Faction files from `world/factions/` (glob for `*.md`)
   - Item files from `world/items/` (glob for `*.md`)
   - `world/dooms.md` (if exists)
   - `world/clocks.md` (if exists)
   - `world/countdown.json` (if exists)
   - `world/campaign-context.md` (if exists)
   - `world/CLAUDE.md` — campaign memory (if exists)
   - `world/gm-notes.md` (if exists)
   - `world/calendar.md` (if exists) — extract date, season, weather
   - Chronicle chapters from `world/chronicles/chapter-*.md` (read each file's content)
   - Check for audiobook files: glob `world/audiobooks/chapter-*.mp3`
   - Read session metadata if available

2. Extract data from the YAML frontmatter and markdown body of each file.

3. Assemble the data into a JSON object with this shape:
   ```json
   {
     "dashboard_type": "player",
     "character": {
       "name", "ancestry", "class", "level", "hp", "armor", "stats",
       "training", "inventory", "gold", "location", "background",
       "spells", "talents", "class_features", "ancestry_traits", "worn",
       "hp_die", "languages", "max_gear_slots", "used_gear_slots",
       "death_clock"
     },
     "location": { "name", "danger_level", "light", "description" },
     "quests": { "active": [...], "developing": [...], "completed": [...] },
     "journal": ["ALL session log entries..."],
     "npcs": [{ "name", "status", "location", "disposition", "description", "hp", "armor", "attack_die", "attack_description", "zone", "priority", "weakness", "morale" }, ...],
     "factions": [{ "name", "disposition", "goals", "members" }, ...],
     "items": [{ "name", "owner", "properties" }, ...],
     "dooms": [{ "name", "portent_level", "location", "current_portent" }, ...],
     "clocks": [{ "name", "segments_filled", "total_segments", "trigger" }, ...],
     "countdown_dice": [{ "name", "current_die", "category" }, ...],
     "campaign_context": { "name", "setting", "tone", "premise" },
     "campaign_memory": { "world_state", "active_threads", "play_style" },
     "gm_notes": { "strong_start", "secrets", "npcs_to_use", "scenes", "encounters", "treasure" },
     "world_advances": ["filtered [world-advance] log entries..."],
     "open_threads": ["filtered [thread] log entries..."],
     "chapters": [
       { "number": 1, "title": "The Living Marble", "file": "chapter-01-the-living-marble.md", "content": "..." }
     ],
     "audiobooks": [
       { "chapter": 1, "title": "The Living Marble", "file": "chapter-01-the-living-marble.mp3" }
     ],
     "calendar": { "date": "Day 14, Harvest Moon", "season": "Late autumn", "weather": "First frosts" },
     "session_metadata": { "sessions_played": 3, "last_played": "2026-02-11", "first_played": "2026-02-09" }
   }
   ```

   ### Extracting character fields

   - **`stats`**: Object with keys `vigor`, `reflex`, `wits`, `resolve`, `presence`, `lore` (values 1-10).
   - **`armor`**: Number from frontmatter — damage reduction value (not AC).
   - **`training`**: Array of strings from frontmatter `training` field (e.g. `["Athletics", "Endurance", "Survival"]`).
   - **`spells`**: Array of spell name strings. Parse from the `## Spells` section — extract just the bold spell name from each bullet.
   - **`talents`**: Array of strings from frontmatter `talents` field.
   - **`class_features`**: Array of strings from frontmatter `class_features` field.
   - **`ancestry_traits`**: Array of strings from frontmatter `ancestry_traits` field.
   - **`worn`**: Array of strings. Parse from the `**Worn (no slot):**` line in inventory section. If no worn line, empty array.
   - **`hp_die`**: String from frontmatter (e.g. `"d6"`, `"d10"`).
   - **`languages`**: Array of strings from frontmatter.
   - **`max_gear_slots`**: Number from frontmatter (Vigor + 5).
   - **`used_gear_slots`**: Count of inventory items.
   - **`death_clock`**: Integer 0-4 from frontmatter (segments filled on Death Clock). Default 0. Only displayed on the dashboard when > 0.

   ### Extracting NPC fields

   - **`description`**: First paragraph from the NPC markdown body (below frontmatter). Truncate to ~120 chars if needed.
   - **`hp`**, **`armor`**, **`attack_die`**, **`attack_description`**, **`zone`**, **`priority`**, **`weakness`**, **`morale`**: From frontmatter, if present. These enable combat stat blocks on the GM dashboard.

   ### Extracting doom, clock, and countdown dice data

   - **`dooms`**: From `world/dooms.md` — extract each doom's `name`, `portent_level` (0-6), `location`, and `current_portent` description.
   - **`clocks`**: From `world/clocks.md` — extract each clock's `name`, `segments_filled`, `total_segments`, and `trigger`.
   - **`countdown_dice`**: From `world/countdown.json` — extract each die's `name`, `current_die` (0/4/6/8/10/12), and `category`.

   ### Extracting faction fields

   - **`name`**, **`disposition`**, **`goals`**: From frontmatter.
   - **`members`**: Count or description from frontmatter, if present.

   ### Extracting campaign context & memory

   - **`campaign_context`**: From `world/campaign-context.md` frontmatter — `name`, `setting`, `tone`, `premise`.
   - **`campaign_memory`**: From `world/CLAUDE.md` — extract `world_state` (text paragraph), `active_threads` (array of strings), `play_style` (text) from the markdown tables/sections.

   ### Extracting GM notes

   - **`gm_notes`**: From `world/gm-notes.md` — extract `strong_start`, `secrets`, `npcs_to_use` (or `npc_moves`), `scenes`, `encounters`, `treasure`. These appear in the GM Screen view.

     Each sub-field supports two formats for backward compatibility:
     - **String array**: `["A secret", "Another secret"]` — rendered as plain text items
     - **Object array**: `[{ "label": "The Vault", "info": "Contains the relic", "discovery": "Search the archives" }]` — rendered with structured label/info/discovery layout

     The template checks `typeof item === 'object'` and renders accordingly. Similarly, `npcs_to_use` / `npc_moves` supports both `["NPC Name"]` strings and `{ "name": "NPC", "action": "What they're doing" }` objects.

   ### Extracting filtered log entries

   - **`world_advances`**: All entries from `world/session-log.md` that contain the `[world-advance]` tag.
   - **`open_threads`**: All entries from `world/session-log.md` that contain the `[thread]` tag.

   ### Chapters and audiobooks

   For chapters: embed the full markdown content of each chapter in the `content` field.
   For audiobooks: include the relative path to the MP3 file.
   For journal: include ALL entries (not just recent ones) — the timeline and log views need the full history.

   ### Dashboard type

   Set `dashboard_type` to control which view opens by default: `"player"`, `"gm"`, `"campaign"`, `"media"`, or `"analytics"`.

   ### Extracting calendar data

   - **`calendar`**: From `world/calendar.md` — extract `date` (in-game date string), `season`, and `weather`. Falls back gracefully if calendar file doesn't exist (bottom bar and campaign view show "—" for missing data).

4. Inject the JSON into the HTML template below and Write it to `world/dashboard.html`.

## HTML Template

The full HTML/CSS/JS template is in `references/dashboard-template.html`. Write it to `world/dashboard.html`, replacing the `DASHBOARD_DATA` placeholder with the actual JSON object.

The template uses:
- CSS Grid layout: left rail (64px) + center workspace (fluid) + right drawer (320px, collapsible) + bottom bar (52px)
- Left rail: logo, 5 navigation icons with tooltips, drawer toggle, character minicard
- Right drawer: 3 tabs (Quests, NPCs, Log) — toggled via `toggleDrawer()`
- Bottom bar: countdown dice, clocks, doom portent pips, calendar date, danger badge
- 5 views: Player, GM Screen, Campaign Overview, Story & Audio, Analytics
- `switchView(name)` for navigation between views
- `toggleDrawer()` for collapsing/expanding the right drawer
- `switchDrawerTab(btn, tabName)` for drawer tab switching
- `switchSubTab(groupId, tabName)` for tabbed panels within cards
- `selectChapter(idx)` for chapter selection in media view
- `md2html(text)` for rendering chapter prose
- Google Fonts: Cinzel (display), DM Sans (body), Crimson Pro (narrative), JetBrains Mono (code)
- Dark theme with deep navy surfaces (`#0f1117`) and amber accent (`#e8a44a`)
- 3-state HP bar: green (>50%), amber (25-50%), red (<25%)
- Responsive: drawer collapses at 1200px, rail becomes horizontal strip at 900px, single-column at 600px

Replace `DASHBOARD_DATA` with the actual JSON object (no quotes around it — it should be a JavaScript object literal). For example: `const DATA = {"character":{"name":"Elindos",...},...};`

## Related Skills
- **state-management** — Entity file formats and frontmatter conventions
