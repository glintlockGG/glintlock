# Glintlock Playtest Report: Obsidian Keep — Character Creation & Opening Scene

**Date:** 2026-02-10
**Adventure:** Raiding the Obsidian Keep (shadowdark-adventure-obsidian-keep)
**Skills Loaded:** shadowdark-core, shadowdark-adventure-obsidian-keep
**Player Request:** "roll up a random character for this playtest session"

---

## 1. Session Initialization

### Skill Loading
- Triggered via `/glintlock:new-session` with args `/glintlock:shadowdark-adventure-obsidian-keep`
- Loaded `glintlock:shadowdark-core` first (gear tables, stats, classes, ancestries needed for chargen)
- Loaded `glintlock:shadowdark-adventure-obsidian-keep` after character creation

### TTS Narration
- Attempted `tts_narrate` for opening flavor text
- **Result:** Failed with `"ElevenLabs request failed: fetch failed"`
- **Impact:** Non-blocking; session continued without voice narration
- **Note:** This was the only TTS attempt in the session. The error suggests a network/API connectivity issue.

---

## 2. Character Creation Flow

### Step 1: All Random Rolls (Batched)

Player requested full random generation. All core rolls were issued in a **single parallel batch** of 10 `roll_dice` calls:

| Roll | Expression | Purpose | Result | Interpretation |
|------|-----------|---------|--------|----------------|
| 1 | 1d12 | Ancestry | 8 | Dwarf (7-8 range) |
| 2 | 1d4 | Class | 1 | Fighter |
| 3 | 1d6 | Alignment | 4 | Neutral (4-5 range) |
| 4 | 3d6 | STR | 12 (4,3,5) | +1 modifier |
| 5 | 3d6 | DEX | 12 (5,1,6) | +1 modifier |
| 6 | 3d6 | CON | 10 (3,2,5) | +0 modifier |
| 7 | 3d6 | INT | 15 (6,6,3) | +2 modifier |
| 8 | 3d6 | WIS | 11 (6,1,4) | +0 modifier |
| 9 | 3d6 | CHA | 14 (4,6,4) | +1 modifier |
| 10 | 2d6 | Starting gold (×5) | 8 (5,3) → 40 gp | — |

**Reroll check:** INT 15 qualifies as 14+, so no reroll was offered per the chargen script rules.

### Step 2: Secondary Rolls (Batched)

Second batch of 4 calls — 2 `roll_oracle` + 2 `roll_dice`:

| Roll | Tool | Table/Expression | Purpose | Result |
|------|------|-----------------|---------|--------|
| 1 | roll_oracle | npc_name (subtype: dwarf) | Random name | "Torin" (roll 2) |
| 2 | roll_oracle | background | Background | "Soldier" (roll 14) |
| 3 | roll_dice | 1d8 (advantage: true) | HP (Dwarf rolls with advantage) | 8 (rolls: 8 and 3, took 8) |
| 4 | roll_dice | 2d6 | Fighter talent | 2 (snake eyes: 1,1) |

**HP calculation:** 8 (die) + 0 (CON mod) + 2 (Dwarf ancestry bonus) = **10 HP**

**Talent interpretation:** 2 on 2d6 = rarest Fighter result: "Gain Weapon Mastery with one additional weapon type." Torin gets TWO weapon masteries at level 1.

### Step 3: Gear Selection

GM selected gear to maximize the 40 gp budget for a level 1 Fighter:

| Item | Cost | Slots |
|------|------|-------|
| Crawling Kit | 7 gp | 7 |
| Leather Armor (AC 11+DEX) | 10 gp | 1 |
| Shield (+2 AC) | 10 gp | 1 |
| Longsword (1d8) | 9 gp | 1 |
| Dagger (1d4) | 1 gp | 1 |
| Extra Torch | 5 sp | 1 |
| **Total** | **37 gp 5 sp** | **12/12** |

Remaining: 2 gp, 5 sp. Gear slots maxed at 12 (STR 12).

**Design decisions:**
- Chose longsword + dagger as the two weapon masteries (melee primary + finesse/thrown backup)
- Chose STR for Grit (advantage on opposing force checks)
- AC 14 = Leather (11) + DEX mod (+1) + Shield (+2)

---

## 3. Entity Creation

### Issue: Foreign Key Constraint on Position

**First attempt** to create the PC entity included `"position": {"location_id": "loc_sakeen_harbor", ...}`. This **failed** with:

```
FOREIGN KEY constraint failed
```

**Cause:** The location entity didn't exist yet. The position component's `location_id` field has a foreign key constraint referencing the locations table.

**Resolution:** Created the location entity first, then the PC entity referencing the correct auto-generated ID (`location_sakeen_harbor`).

**Observation:** The first attempt used `loc_sakeen_harbor` as the location_id (a manually guessed ID). The system auto-generates IDs from type + name, so the correct ID was `location_sakeen_harbor`. This is a common pattern issue — the GM doesn't know the entity ID until after creation.

**Recommendation for plugin development:** Consider one of:
1. Allow `create_entity` to accept a custom `entity_id` parameter
2. Allow position to reference locations by name (fuzzy match)
3. Allow batch entity creation with forward references
4. Document the ID generation pattern clearly (type_name_with_underscores)

### Entities Created

**Location: Sakeen Harbor**
```json
{
  "entity_id": "location_sakeen_harbor",
  "type": "location",
  "components": {
    "description": {
      "text": "A crumbling stone harbor on the subterranean shore of the Sakeen Sea...",
      "discovered": 1
    },
    "location_data": {
      "danger_level": "unsafe",
      "light": "dim",
      "connections": []
    }
  }
}
```

**PC: Torin**
```json
{
  "entity_id": "pc_torin",
  "type": "pc",
  "components": {
    "stats": {"str": 12, "dex": 12, "con": 10, "int": 15, "wis": 11, "cha": 14},
    "health": {"current": 10, "max": 10},
    "character_info": {
      "ancestry": "Dwarf",
      "class": "Fighter",
      "level": 1,
      "xp": 0,
      "alignment": "Neutral",
      "background": "Soldier",
      "ac": 14,
      "languages": ["Common", "Dwarvish"],
      "talents": [
        "Weapon Mastery: Longsword (+1 atk/dmg)",
        "Weapon Mastery: Dagger (+1 atk/dmg)"
      ],
      "hit_die": "d8",
      "weapon_proficiencies": ["All weapons"],
      "armor_proficiencies": ["All armor", "Shields"],
      "class_features": [
        "Hauler (CON mod to gear slots)",
        "Grit: STR (advantage on STR checks vs opposing force)",
        "Weapon Mastery x2"
      ],
      "ancestry_traits": ["+2 starting HP", "Roll HP per level with advantage"]
    },
    "position": {"location_id": "location_sakeen_harbor", "sub_location": "docks"},
    "inventory": {
      "items": [
        "Longsword (1d8, mastery +1 atk/dmg)",
        "Dagger (1d4, mastery +1 atk/dmg, finesse, thrown)",
        "Leather Armor (AC 11+DEX)",
        "Shield (+2 AC)",
        "Backpack",
        "Flint and steel",
        "Torch x3",
        "Rations x3",
        "Iron spikes x10",
        "Grappling hook",
        "Rope 60ft"
      ],
      "gold": 2, "silver": 5, "copper": 0,
      "gear_slots_used": 12, "gear_slots_max": 12
    },
    "description": {
      "text": "A stocky dwarf with sharp eyes and an easy grin. Former soldier — knows how to hold a line and read a battlefield. Surprisingly quick-witted and personable for his kind. Carries a well-worn longsword and a battered shield.",
      "discovered": 1
    }
  }
}
```

### Session Note
```
add_note(tag="event"): "SESSION START — Raiding the Obsidian Keep. PC: Torin, Dwarf Fighter 1, Neutral, Soldier background. HP 10/10, AC 14. Dual weapon mastery (longsword, dagger). Arrived at Isla Requia by boat."
```

---

## 4. Opening Scene Narration

The opening scene placed Torin in a rowboat approaching the harbor with an NPC oarsman (Paolo, not yet created as entity). The narration:

- Described the destroyed holy fleet in the harbor
- Established the unnatural rainstorm and red lightning over the Obsidian Keep
- Referenced both adventure hooks (Archbishop's pay for intel, Master Argento's pay for treasure) without forcing either
- Left the player with an open-ended prompt at the harbor entrance

**Scene state at handoff:** Torin is alone in a rowboat on the Sakeen Sea. The harbor stretches before him with multiple explorable locations (capsized ships, rocky islands, broken lighthouse, beach camp). No torch lit yet (dim ambient light from harbor).

---

## 5. Tool Usage Summary

| Tool | Calls | Notes |
|------|-------|-------|
| roll_dice | 12 | All succeeded. Batched effectively (10 parallel, then 2 more). |
| roll_oracle | 2 | npc_name (dwarf) and background. Both succeeded. |
| create_entity | 3 | 1 failed (FK constraint), 2 succeeded (location then PC). |
| add_note | 1 | Session start event. |
| tts_narrate | 1 | Failed (ElevenLabs fetch error). |
| get_session_summary | 1 | Used to compile this report. Full detail level. |

---

## 6. Observations & Plugin Feedback

### What Worked Well
- **Parallel dice rolling**: Batching 10 `roll_dice` calls in one message is fast and effective for chargen
- **Oracle tables**: `npc_name` with ancestry subtype and `background` table both returned good results
- **Advantage on roll_dice**: The `advantage: true` parameter worked correctly for the Dwarf HP roll (rolled 8 and 3, took 8)
- **Entity creation**: Component schema is flexible enough to store all Shadowdark character data
- **Session summary**: `get_session_summary` with `detail_level: full` returned comprehensive state

### Issues Encountered
1. **Foreign key constraint on position**: Must create location before PC. No way to batch-create with forward references.
2. **TTS failure**: ElevenLabs connection failed. Non-blocking but reduces immersion.
3. **No Fighter talent table in core rules skill**: The GM had to interpret the 2d6 talent roll from memory/training data rather than from the loaded skill text. Consider adding class talent tables to the core rules skill.
4. **ID prediction**: The GM initially guessed `loc_sakeen_harbor` but the actual generated ID was `location_sakeen_harbor`. The naming convention (type_name) should be documented or the ID should be specifiable.

### Suggestions
1. Add class talent tables (Fighter, Priest, Thief, Wizard) to the `shadowdark-core` skill
2. Allow `create_entity` to accept an optional `entity_id` override
3. Consider a "batch create" tool for creating multiple entities with interdependencies
4. Add connection data to locations at creation time (or make it easier to update connections between locations)
5. Consider a `chargen` oracle table or tool that automates the full random character creation flow
