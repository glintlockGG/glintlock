---
name: dashboard-generation
description: "Generate a visual HTML campaign dashboard from world state files. This skill should be used when the player requests a dashboard, runs /glintlock:dashboard, or asks for a visual overview of their campaign."
---

# Dashboard Generation

Generate a campaign dashboard from the world state files. The dashboard is a single self-contained HTML file written to `world/dashboard.html`.

## Overview

The dashboard is a VTT-style, viewport-locked multi-view layout with a persistent sidebar and four switchable dashboard views:

1. **Player (Character Sheet)** — Ability scores, hero banner with HP/AC/XP, inventory, location, spells, features, proficiencies
2. **GM Screen** — Tabbed quests/threads, NPC quick reference grid (with combat stats), session tools panel (session prep, DC reference, recent events, world advances)
3. **Campaign Overview** — Campaign banner, quest progress tracker, session timeline, factions, world state summary, active threads
4. **Story & Audio** — Chapter list with audio indicators, prose reader, Spotify-style audio player

The sidebar shows a character mini-card (name, class, HP bar, AC, gold), navigation links, current location with danger badge, and XP progress bar — all persistent across views.

## Instructions

1. Read the following world files:
   - PC file from `world/characters/` (glob for `*.md`)
   - Current location file from `world/locations/`
   - `world/quests.md`
   - All of `world/session-log.md`
   - NPC files from `world/npcs/` (glob for `*.md`)
   - Faction files from `world/factions/` (glob for `*.md`)
   - Item files from `world/items/` (glob for `*.md`)
   - `world/campaign-context.md` (if exists)
   - `world/CLAUDE.md` — campaign memory (if exists)
   - `world/session-prep.md` (if exists)
   - Chronicle chapters from `world/chronicles/chapter-*.md` (read each file's content)
   - Check for audiobook files: glob `world/audiobooks/chapter-*.mp3`
   - Read session metadata if available

2. Extract data from the YAML frontmatter and markdown body of each file.

3. Assemble the data into a JSON object with this shape:
   ```json
   {
     "dashboard_type": "player",
     "character": {
       "name", "ancestry", "class", "level", "hp", "ac", "stats",
       "inventory", "gold", "xp", "location", "background",
       "spells", "talents", "class_features", "ancestry_traits", "worn",
       "hit_die", "languages", "weapon_proficiencies", "armor_proficiencies",
       "max_gear_slots", "used_gear_slots"
     },
     "location": { "name", "danger_level", "light", "description" },
     "quests": { "active": [...], "developing": [...], "completed": [...] },
     "journal": ["ALL session log entries..."],
     "npcs": [{ "name", "status", "location", "disposition", "description", "hp", "ac", "attacks", "morale", "movement" }, ...],
     "factions": [{ "name", "disposition", "goals", "members" }, ...],
     "items": [{ "name", "owner", "properties" }, ...],
     "campaign_context": { "name", "setting", "tone", "premise" },
     "campaign_memory": { "world_state", "active_threads", "play_style" },
     "session_prep": { "strong_start", "secrets", "npcs_to_use", "scenes", "encounters", "treasure" },
     "world_advances": ["filtered [world-advance] log entries..."],
     "open_threads": ["filtered [thread] log entries..."],
     "chapters": [
       { "number": 1, "title": "The Living Marble", "file": "chapter-01-the-living-marble.md", "content": "..." }
     ],
     "audiobooks": [
       { "chapter": 1, "title": "The Living Marble", "file": "chapter-01-the-living-marble.mp3" }
     ],
     "session_metadata": { "sessions_played": 3, "last_played": "2026-02-11", "first_played": "2026-02-09" }
   }
   ```

   ### Extracting character fields

   - **`spells`**: Array of spell name strings. Parse from the `## Spells` section — extract just the bold spell name from each bullet (e.g. `- **Mage Armor** — ...` → `"Mage Armor"`).
   - **`talents`**: Array of strings from frontmatter `talents` field.
   - **`class_features`**: Array of strings from frontmatter `class_features` field.
   - **`ancestry_traits`**: Array of strings from frontmatter `ancestry_traits` field.
   - **`worn`**: Array of strings. Parse from the `**Worn (no slot):**` line in inventory section. If no worn line, empty array.
   - **`hit_die`**: String from frontmatter (e.g. `"d4"`, `"d8"`).
   - **`languages`**: Array of strings from frontmatter.
   - **`weapon_proficiencies`**: Array of strings from frontmatter.
   - **`armor_proficiencies`**: Array of strings from frontmatter.
   - **`max_gear_slots`**: Number from frontmatter (default 10).
   - **`used_gear_slots`**: Count of inventory items.

   ### Extracting NPC fields

   - **`description`**: First paragraph from the NPC markdown body (below frontmatter). Truncate to ~120 chars if needed.
   - **`hp`**, **`ac`**, **`attacks`**, **`morale`**, **`movement`**: From frontmatter, if present. These enable combat stat blocks on the GM dashboard.

   ### Extracting faction fields

   - **`name`**, **`disposition`**, **`goals`**: From frontmatter.
   - **`members`**: Count or description from frontmatter, if present.

   ### Extracting campaign context & memory

   - **`campaign_context`**: From `world/campaign-context.md` frontmatter — `name`, `setting`, `tone`, `premise`.
   - **`campaign_memory`**: From `world/CLAUDE.md` — extract `world_state` (text paragraph), `active_threads` (array of strings), `play_style` (text) from the markdown tables/sections.

   ### Extracting session prep

   - **`session_prep`**: From `world/session-prep.md` — extract `strong_start`, `secrets` (array), `npcs_to_use` (array of names), `scenes` (array), `encounters` (array), `treasure` (array). These appear in the GM Screen's Session Tools panel.

   ### Extracting filtered log entries

   - **`world_advances`**: All entries from `world/session-log.md` that contain the `[world-advance]` tag.
   - **`open_threads`**: All entries from `world/session-log.md` that contain the `[thread]` tag.

   ### Chapters and audiobooks

   For chapters: embed the full markdown content of each chapter in the `content` field.
   For audiobooks: include the relative path to the MP3 file.
   For journal: include ALL entries (not just recent ones) — the timeline and log views need the full history.

   ### Dashboard type

   Set `dashboard_type` to control which view opens by default: `"player"`, `"gm"`, `"campaign"`, or `"media"`.

4. Inject the JSON into the HTML template below and Write it to `world/dashboard.html`.

## HTML Template

The full HTML/CSS/JS template is in `references/dashboard-template.html`. Write it to `world/dashboard.html`, replacing the `DASHBOARD_DATA` placeholder with the actual JSON object.

The template uses:
- CSS Grid layout: sidebar (220px) + header (48px) + content area
- Sidebar: character mini-card, Discord-style navigation, location + XP footer
- 4 views: Player, GM Screen, Campaign Overview, Story & Audio
- `switchView(name)` for navigation between views
- `switchSubTab(groupId, tabName)` for tabbed panels within cards
- `selectChapter(idx)` for chapter selection in media view
- `md2html(text)` for rendering chapter prose
- Google Fonts: Cinzel (display), DM Sans (body), Crimson Pro (narrative), JetBrains Mono (code)
- Dark theme with deep navy surfaces and warm parchment text
- Responsive: sidebar collapses to horizontal nav at 900px, single-column at 600px

Replace `DASHBOARD_DATA` with the actual JSON object (no quotes around it — it should be a JavaScript object literal). For example: `const DATA = {"character":{"name":"Elindos",...},...};`

## Related Skills
- **state-management** — Entity file formats and frontmatter conventions
