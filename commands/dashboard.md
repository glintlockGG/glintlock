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

If the user provided a `[type]` argument (`player`, `gm`, `campaign`, or `media`), use it as the `dashboard_type` field. Otherwise default to `"player"`.

## Data Extraction Steps

1. Read the PC file from `world/characters/` (glob for `*.md` files)
2. Read the PC's current location file from `world/locations/`
3. Read `world/quests.md`
4. Read ALL of `world/session-log.md` (not just recent — the Log panel groups by session)
5. Glob `world/npcs/*.md` and read each NPC file
6. Glob `world/factions/*.md` and read each faction file
7. Glob `world/items/*.md` and read each item file
8. Read `world/campaign-context.md` if it exists
9. Read `world/CLAUDE.md` (campaign memory) if it exists — extract `world_state`, `active_threads`, `play_style` from the markdown tables
10. Read `world/session-prep.md` if it exists — extract `strong_start`, `secrets`, `npcs_to_use`, `scenes`, `encounters`, `treasure`
11. Glob `world/chronicles/chapter-*.md` — read each chapter file's full content
12. Glob `world/audiobooks/chapter-*.mp3` — collect audiobook file paths
13. Call `get_session_metadata` with action "read" for session count and dates
14. Extract structured data from YAML frontmatter and markdown content
15. Assemble the dashboard JSON (see schema below)
16. Inject into the HTML template from the dashboard-generation skill
17. Write to `world/dashboard.html`

## Character Extraction

From the PC file, extract these fields:
- **name**, **ancestry**, **class**, **level**, **hp** (object: current/max), **ac**, **stats** (object: str/dex/con/int/wis/cha), **xp**, **gold**, **location**
- **background**: From the frontmatter `background` field
- **inventory**: Array of item strings from the Inventory section
- **spells**: Parse the `## Spells` section — extract bold spell names from each bullet (e.g. `- **Mage Armor** — ...` becomes `"Mage Armor"`)
- **talents**: From the frontmatter `talents` array
- **class_features**: From the frontmatter `class_features` array
- **ancestry_traits**: From the frontmatter `ancestry_traits` array
- **worn**: Parse from the `**Worn (no slot):**` line in the Inventory section. Split by comma if multiple. Empty array if not present.
- **hit_die**: From the frontmatter `hit_die` field (e.g. `"d4"`)
- **languages**: From the frontmatter `languages` array
- **weapon_proficiencies**: From the frontmatter `weapon_proficiencies` array
- **armor_proficiencies**: From the frontmatter `armor_proficiencies` array
- **max_gear_slots**: From the frontmatter `max_gear_slots` field (default 10)
- **used_gear_slots**: Count of items in the inventory array

## NPC Extraction

For each NPC file, extract:
- **name**, **status**, **location**, **disposition** from frontmatter
- **description**: First paragraph from the NPC markdown body (below frontmatter heading). Truncate to ~120 chars if needed.
- **hp**: From frontmatter (number or {current, max} object), if present
- **ac**: From frontmatter, if present
- **attacks**: From frontmatter array, if present
- **morale**: From frontmatter, if present
- **movement**: From frontmatter, if present

## Faction Extraction

For each faction file, extract:
- **name**, **disposition**, **goals** from frontmatter
- **members**: Count or description from frontmatter, if present

## Campaign Context & Memory

- **campaign_context**: From `world/campaign-context.md` — extract `name`, `setting`, `tone`, `premise` from frontmatter
- **campaign_memory**: From `world/CLAUDE.md` — extract `world_state` (text), `active_threads` (array of strings), `play_style` (text) from the markdown content

## Session Prep

- **session_prep**: From `world/session-prep.md` — extract `strong_start` (text), `secrets` (array), `npcs_to_use` (array of names), `scenes` (array), `encounters` (array), `treasure` (array)

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

Set `dashboard_type` to the user's `[type]` argument if provided, otherwise `"player"`. Valid values: `"player"`, `"gm"`, `"campaign"`, `"media"`.

Tell the player the dashboard has been generated and they can open `world/dashboard.html` in their browser.
