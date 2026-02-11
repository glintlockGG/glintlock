---
description: "Generate a visual campaign dashboard"
allowed-tools:
  - "Read"
  - "Write"
  - "Glob"
  - "Skill"
---

Generate the campaign dashboard. Load the `dashboard-generation` skill for the HTML template and instructions.

1. Read the PC file from `world/characters/` (glob for `*.md` files)
2. Read the PC's current location file from `world/locations/`
3. Read `world/quests.md`
4. Read the last ~30 lines of `world/session-log.md`
5. Glob `world/npcs/*.md` and read each NPC file
6. Extract structured data from YAML frontmatter and markdown content
7. Assemble the dashboard JSON
8. Inject into the HTML template from the dashboard-generation skill
9. Write to `world/dashboard.html`

Tell the player the dashboard has been generated and they can open `world/dashboard.html` in their browser.
