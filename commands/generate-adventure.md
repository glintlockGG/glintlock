---
description: "Generate and seed a new adventure into the campaign"
allowed-tools:
  - "mcp:glintlock-engine:roll_dice"
  - "mcp:glintlock-engine:roll_oracle"
  - "Skill"
  - "Read"
  - "Write"
---

Generate a new adventure and seed it into the active campaign.

**Step 1: Load Context**

Load the `adventure-design` skill. Read the current campaign state:
- `world/campaign-context.md` — setting, tone, premise
- `world/dooms.md` — current portent levels
- `world/clocks.md` — active progress clocks
- `world/quests.md` — active and developing quest threads
- Faction files in `world/factions/`

**Step 2: Assess Campaign Needs**

Based on the campaign state, determine what kind of content would be most valuable:
- A doom nearing portent 4-6 needs a resolution site (location-based dungeon)
- A faction clock nearing completion needs a faction conflict scenario
- A supply crisis or exploration gap calls for an expedition
- A mystery thread in the quest board calls for an investigation
- The player asking "what's out there?" calls for a pointcrawl

**Step 3: Present Options**

Offer the player 2-3 adventure type options from the 7 types (location-based, pointcrawl, investigation, faction conflict, defense/siege, expedition, heist/infiltration). Briefly explain what each would look like given the current campaign state. Let the player choose or suggest something different.

**Step 4: Generate**

Follow the adventure-design skill's generation workflow:
1. Load the relevant type reference from `references/adventure-types.md`
2. Connect to existing campaign elements (at least one doom/clock, one NPC, one resource pressure)
3. Generate content following the structural template
4. Apply the quality checklist (meaningful choices, multiple approaches, connections, necessity, AI-adjudicable)
5. Format for play (overview, key info, map/structure, inhabitants, treasure, complications, outcomes)

Use `roll_dice` and `roll_oracle` throughout generation for randomness.

**Step 5: Write and Seed**

1. Write the generated adventure to `world/adventures/{name}.md`
2. Update `world/quests.md` with hooks pointing to the new adventure
3. Seed discovery paths: add rumors to relevant NPC files, environmental signs to location files, or entries to the session log that foreshadow the adventure

Create `world/adventures/` directory if it doesn't exist.
