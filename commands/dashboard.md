---
description: "Generate a visual campaign dashboard"
allowed-tools:
  - "Read"
  - "Write"
  - "Glob"
  - "Skill"
  - "mcp:glintlock-engine:get_session_metadata"
---

Generate the campaign dashboard. Load the `dashboard-generation` skill for the HTML template and instructions.

1. Read the PC file from `world/characters/` (glob for `*.md` files)
2. Read the PC's current location file from `world/locations/`
3. Read `world/quests.md`
4. Read ALL of `world/session-log.md` (not just recent — the Log panel groups by session)
5. Glob `world/npcs/*.md` and read each NPC file
6. Glob `world/chronicles/chapter-*.md` — read each chapter file's full content
7. Glob `world/audiobooks/chapter-*.mp3` — collect audiobook file paths
8. Call `get_session_metadata` with action "read" for session count and dates
9. Extract structured data from YAML frontmatter and markdown content
10. Assemble the dashboard JSON including `chapters`, `audiobooks`, and `session_metadata` arrays
11. Inject into the HTML template from the dashboard-generation skill
12. Write to `world/dashboard.html`

For the character JSON, extract these additional fields:
- **spells**: Parse the `## Spells` section — extract bold spell names from each bullet (e.g. `- **Mage Armor** — ...` becomes `"Mage Armor"`)
- **talents**: From the frontmatter `talents` array
- **class_features**: From the frontmatter `class_features` array
- **ancestry_traits**: From the frontmatter `ancestry_traits` array
- **worn**: Parse from the `**Worn (no slot):**` line in the Inventory section. Split by comma if multiple. Empty array if not present.
- **background**: From the frontmatter `background` field

For each NPC, also extract:
- **description**: First paragraph from the NPC markdown body (below frontmatter heading). Truncate to ~120 chars if needed.

For each chapter file:
- Extract chapter number from filename (e.g. `chapter-01-...` becomes 1)
- Extract title from the `# Chapter N: Title` heading
- Include the full markdown content in the `content` field

For each audiobook file:
- Extract chapter number from filename
- Match to the corresponding chapter title
- Include the relative file path (e.g. `audiobooks/chapter-01-the-living-marble.mp3`)

Tell the player the dashboard has been generated and they can open `world/dashboard.html` in their browser.
