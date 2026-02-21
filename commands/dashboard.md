---
description: "Generate a visual campaign dashboard"
args: "[type]"
allowed-tools:
  - "Read"
  - "Write"
  - "Glob"
  - "Skill"
  - "mcp:glintlock-engine:get_session_metadata"
---

Generate the campaign dashboard. Load the `dashboard-generation` skill for the HTML template and instructions.

If the user provided a `[type]` argument (`player`, `gm`, `campaign`, `media`, or `analytics`), use it as the `dashboard_type` field. Otherwise default to `"player"`.

## Data Extraction Steps

1. Read the PC file from `world/characters/` (glob for `*.md` files)
2. Read the PC's current location file from `world/locations/`
3. Read `world/quests.md`
4. Read ALL of `world/session-log.md` (not just recent — the Log panel groups by session)
5. Glob `world/npcs/*.md` and read each NPC file
6. Glob `world/factions/*.md` and read each faction file
7. Glob `world/items/*.md` and read each item file
8. Read `world/dooms.md` if it exists — extract doom name, portent_level, location, current portent description
9. Read `world/clocks.md` if it exists — extract clock name, segments_filled, total_segments, trigger
10. Read `world/countdown.json` if it exists — extract countdown dice name, current_die, category
11. Read `world/campaign-context.md` if it exists
12. Read `world/CLAUDE.md` (campaign memory) if it exists — extract `world_state`, `active_threads`, `play_style` from the markdown tables
13. Read `world/gm-notes.md` if it exists — extract `strong_start`, `secrets`, `npcs_to_use`, `scenes`, `encounters`, `treasure`
14. Read `world/calendar.md` if it exists — extract `date`, `season`, `weather` for the calendar object
15. Glob `world/chronicles/chapter-*.md` — read each chapter file's full content
16. Glob `world/audiobooks/chapter-*.mp3` — collect audiobook file paths
17. Call `get_session_metadata` with action "read" for session count and dates
18. Extract structured data from YAML frontmatter and markdown content
19. Assemble the dashboard JSON (see schema below)
20. Inject into the HTML template from the dashboard-generation skill
21. Write to `world/dashboard.html`

## Character Extraction

From the PC file, extract these fields:
- **name**, **ancestry**, **class**, **level**, **hp** (object: current/max), **armor** (DR number), **stats** (object: vigor/reflex/wits/resolve/presence/lore), **gold**, **location**
- **training**: From the frontmatter `training` array (e.g. `["Athletics", "Endurance"]`)
- **background**: From the frontmatter `background` field
- **inventory**: Array of item strings from the Inventory section
- **spells**: Parse the `## Spells` section — extract bold spell names from each bullet (e.g. `- **Mage Armor** — ...` becomes `"Mage Armor"`)
- **talents**: From the frontmatter `talents` array
- **class_features**: From the frontmatter `class_features` array
- **ancestry_traits**: From the frontmatter `ancestry_traits` array
- **worn**: Parse from the `**Worn (no slot):**` line in the Inventory section. Split by comma if multiple. Empty array if not present.
- **hp_die**: From the frontmatter `hp_die` field (e.g. `"d6"`, `"d10"`)
- **languages**: From the frontmatter `languages` array
- **max_gear_slots**: From the frontmatter `max_gear_slots` field (Vigor + 5)
- **used_gear_slots**: Count of items in the inventory array

## NPC Extraction

For each NPC file, extract:
- **name**, **status**, **location**, **disposition** from frontmatter
- **description**: First paragraph from the NPC markdown body (below frontmatter heading). Truncate to ~120 chars if needed.
- **hp**: From frontmatter (number or {current, max} object), if present
- **armor**: From frontmatter (DR number), if present
- **attack_die**: From frontmatter, if present
- **attack_description**: From frontmatter, if present
- **zone**: From frontmatter, if present
- **priority**: From frontmatter, if present
- **weakness**: From frontmatter, if present
- **morale**: From frontmatter, if present

## Faction Extraction

For each faction file, extract:
- **name**, **disposition**, **goals** from frontmatter
- **members**: Count or description from frontmatter, if present

## Campaign Context & Memory

- **campaign_context**: From `world/campaign-context.md` — extract `name`, `setting`, `tone`, `premise` from frontmatter
- **campaign_memory**: From `world/CLAUDE.md` — extract `world_state` (text), `active_threads` (array of strings), `play_style` (text) from the markdown content

## Session Prep

- **gm_notes**: From `world/gm-notes.md` — extract `strong_start` (text), `secrets` (array), `npcs_to_use` (array of names), `scenes` (array), `encounters` (array), `treasure` (array)

## Filtered Log Entries

- **world_advances**: Filter `world/session-log.md` entries containing `[world-advance]` tag
- **open_threads**: Filter `world/session-log.md` entries containing `[thread]` tag

## Chapter & Audiobook Extraction

For each chapter file:
- Extract chapter number from filename (e.g. `chapter-01-...` becomes 1)
- Extract title from the `# Chapter N: Title` heading
- Include the full markdown content in the `content` field

For each audiobook file:
- Extract chapter number from filename
- Match to the corresponding chapter title
- Include the relative file path (e.g. `audiobooks/chapter-01-the-living-marble.mp3`)

## Dashboard Type

Set `dashboard_type` to the user's `[type]` argument if provided, otherwise `"player"`. Valid values: `"player"`, `"gm"`, `"campaign"`, `"media"`, `"analytics"`.

Tell the player the dashboard has been generated and they can open `world/dashboard.html` in their browser.
