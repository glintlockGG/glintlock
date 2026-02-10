# Glintlock ECS Playtest Report: Entity Creation Issues

**Date:** 2026-02-10
**Session:** New campaign start (Raiding the Obsidian Keep)
**Character:** Hesta, Level 1 Lawful Human Wizard
**MCP Log:** `.cache/claude-cli-nodejs/-sessions-gifted-intelligent-gates/mcp-logs-plugin-glintlock-glintlock-engine/2026-02-10T12-08-42-159Z.jsonl`

---

## Executive Summary

During character creation for a new Shadowdark campaign, `create_entity` for the PC required **7 attempts** before succeeding. Each failure revealed one new schema constraint, forcing a sequential trial-and-error discovery process. A follow-up `update_entity` call to set the PC's position also failed because the `position` component wasn't included at creation time and **cannot be added after the fact**. A `create_entity` for a location also failed once (1 retry).

Total `create_entity` calls: **8** (6 failures, 2 successes)
Total `update_entity` calls: **2** (2 failures, 0 successes)
Wasted tool calls: **8 out of 10** — an 80% failure rate on entity operations.

This is the single biggest friction point in the Glintlock plugin. Every wasted tool call costs latency, tokens, and — most importantly — breaks narrative flow for the player during what should be an immersive moment.

---

## Failure Log (Chronological)

### Attempt 1: `create_entity` for PC — FAILED
**Error:** `Invalid field "STR" for component "stats". Valid: str, dex, con, int, wis, cha`
**Cause:** Used uppercase field names (`STR`, `DEX`, etc.) instead of lowercase.
**Note:** The tool description and Shadowdark convention both use uppercase for stat names. The LLM naturally mirrors this.

### Attempt 2: `create_entity` for PC — FAILED
**Error:** `Invalid field "spells" for component "character_info". Valid: ancestry, class, level, xp, alignment, title, background, ac, languages`
**Cause:** Tried to put spell data into the `character_info` component. There's no obvious home for spells, talents, hit dice, or weapon proficiencies from the tool description alone.

### Attempt 3: `create_entity` for PC — FAILED
**Error:** `Invalid component: "spellbook". Valid: stats, health, character_info, spells, position, inventory, description, location_data, combat_data`
**Cause:** Attempted to create a custom `spellbook` component. The ECS only allows a fixed set of component types.
**Note:** This is the first time the LLM learns what the valid component names are.

### Attempt 4: `create_entity` for PC — FAILED
**Error:** `Invalid field "talents" for component "spells". Valid: known, lost, penance`
**Cause:** Found the `spells` component but tried to also store `talents` there. Still no home for talents, hit dice, or weapon proficiencies.

### Attempt 5: `create_entity` for PC — FAILED
**Error:** `Invalid field "slots_used" for component "inventory". Valid: items, gold, silver, copper, gear_slots_used, gear_slots_max`
**Cause:** Used `slots_used`/`slots_max` instead of `gear_slots_used`/`gear_slots_max`. Very close — the naming just wasn't guessable.

### Attempt 6: `create_entity` for PC — FAILED
**Error:** `Invalid field "hit_die" for component "combat_data". Valid: ac, attacks, movement, special, morale_broken, is_undead`
**Cause:** Tried to store `hit_die`, `weapons_proficient`, and `talents` in `combat_data`. These fields don't exist.
**Resolution:** Had to pack all this data into the `special` array field as freeform strings. This works but loses structure.

### Attempt 7: `create_entity` for PC — SUCCESS
**Payload that finally worked:**
```json
{
  "stats": { "str": 9, "dex": 12, "con": 16, "int": 13, "wis": 11, "cha": 17 },
  "health": { "current": 4, "max": 4 },
  "character_info": {
    "class": "Wizard", "level": 1, "ancestry": "Human",
    "alignment": "Lawful", "background": "Scholar", "xp": 0, "ac": 11,
    "languages": ["Common", "Dwarvish", "Elvish", "Goblin", "Celestial", "Primordial"]
  },
  "spells": { "known": ["Magic Missile", "Sleep", "Mage Armor"], "lost": [] },
  "inventory": {
    "items": ["Backpack", "Flint and steel", "Torch", "Torch", "Rations (3)", "Iron spikes (10)", "Grappling hook", "Rope (60')", "Dagger", "Staff"],
    "gold": 1, "silver": 5, "copper": 0,
    "gear_slots_used": 9, "gear_slots_max": 10
  },
  "combat_data": {
    "ac": 11,
    "attacks": ["Dagger (1d4, melee/thrown)", "Staff (1d4, two-handed)"],
    "special": ["Advantage on casting Magic Missile", "+2 INT (talent, applied)", "Hit die: d4", "Weapons: Dagger, Staff"]
  },
  "description": { "text": "A lawful human wizard..." }
}
```
**Missing:** The `position` component was NOT included because the LLM didn't know it needed to be set at creation time.

### Attempt 8: `update_entity` to set position — FAILED
**Error:** `Entity "pc_hesta" has no position component. Create it first with create_entity or add the component row.`
**Cause:** The `position` component wasn't included in the `create_entity` call. `update_entity` cannot add new components to existing entities.
**Repeated:** Tried once more with the same result.
**Resolution:** Gave up on structured position tracking. Used `add_note` as a workaround.

### Attempt 9: `create_entity` for location — FAILED
**Error:** `Invalid field "lighting" for component "location_data". Valid: danger_level, light, connections`
**Cause:** Used `lighting` instead of `light`. Also tried `notes` which doesn't exist.

### Attempt 10: `create_entity` for location — SUCCESS

---

## Root Cause Analysis

### 1. Schema is invisible to the LLM until it fails

The `create_entity` tool description says:
> "Provide any initial component data."

But there is no indication of:
- What components exist
- What fields each component accepts
- What field names or types are expected
- Which components are required vs optional

The LLM must guess, fail, read the error message, and try again. Each error only reveals the schema for ONE component/field, so deeply nested mistakes require many round-trips.

### 2. No way to add components after entity creation

This is a critical architectural gap. If you forget to include `position` (or any component) at creation time, there is **no way to add it later**. The error message says "Create it first with create_entity or add the component row" but `update_entity` doesn't support adding component rows, and you can't call `create_entity` again for the same entity.

### 3. PC data doesn't fit cleanly into the schema

Shadowdark PCs need to track: talents, hit die, weapon proficiencies, class features, ancestry traits, background abilities, and miscellaneous abilities. None of these have a dedicated field. The workaround is to dump everything into `combat_data.special` as freeform strings, which:
- Loses all structure (can't query or update individual talents)
- Mixes mechanical data with narrative descriptions
- Makes programmatic updates brittle

### 4. Field naming is inconsistent and not guessable

Some examples:
- `gear_slots_used` not `slots_used`
- `light` not `lighting`
- `known` not `spells` (within the spells component)
- Stats must be lowercase (`str`) despite Shadowdark convention using uppercase (`STR`)

---

## Impact on Gameplay

- **7 failed tool calls** during character creation alone
- Each failure breaks narrative immersion for the player
- The LLM had to work around missing features (position, talents) with freeform notes
- Future sessions will have the same issues unless the schema is documented in tool descriptions or the system is made more flexible
- In a previous playtest, similar issues were observed (per player report)

---

## Recommendations

### High Priority

1. **Document the full schema in tool descriptions.** The `create_entity` tool description should include the complete list of valid components and their fields, or link to a schema reference. This is the single most impactful change — it eliminates trial-and-error entirely.

   Example addition to tool description:
   ```
   Valid components and fields:
   - stats: str, dex, con, int, wis, cha
   - health: current, max
   - character_info: ancestry, class, level, xp, alignment, title, background, ac, languages
   - spells: known, lost, penance
   - position: location_id
   - inventory: items, gold, silver, copper, gear_slots_used, gear_slots_max
   - description: text
   - location_data: danger_level, light, connections
   - combat_data: ac, attacks, movement, special, morale_broken, is_undead
   ```

2. **Allow adding components to existing entities.** Either let `update_entity` create a component if it doesn't exist (upsert behavior), or provide an `add_component` tool/operation.

3. **Accept case-insensitive field names for stats.** `STR` and `str` should both work since Shadowdark uses uppercase everywhere.

### Medium Priority

4. **Add PC-specific fields** to `character_info` or a new `class_features` component:
   - `talents` (array of strings or objects)
   - `hit_die` (string like "d4", "d8")
   - `weapon_proficiencies` (array)
   - `armor_proficiencies` (array)
   - `class_features` (array of strings)
   - `ancestry_traits` (array of strings)

5. **Return the full schema on the first `create_entity` failure** instead of only the problematic field. Currently each error reveals one constraint, requiring serial discovery. One comprehensive error message would reduce failures dramatically.

6. **Add field name suggestions** to error messages (fuzzy matching). e.g., `Invalid field "slots_used". Did you mean "gear_slots_used"?`

### Low Priority

7. **Accept `notes` or `extra` as a freeform field** on any component for overflow data.
8. **Support flexible/custom components** for game-specific data that doesn't fit the built-in schema.
9. **Add a `get_schema` tool** that returns the complete ECS schema on demand.

---

## TTS Note

`tts_narrate` also failed during this session:
```
ElevenLabs request failed: fetch failed
```
This appears to be a network/API connectivity issue (running inside Cowork VM sandbox), not a plugin code issue. Worth investigating whether the ElevenLabs API is reachable from the runtime environment.

---

## Session Metrics

| Metric | Value |
|--------|-------|
| Total MCP tool calls | 30 |
| Successful calls | 22 |
| Failed calls | 8 |
| Entity creation attempts | 8 |
| Entity creation successes | 2 |
| Entity creation failures | 6 |
| Entity update attempts | 2 |
| Entity update failures | 2 |
| Time from first create_entity to success (PC) | ~44 seconds |
| Failure rate (entity operations) | 80% |
