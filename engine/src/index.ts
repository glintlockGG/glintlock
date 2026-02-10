import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Import db to trigger schema initialization
import "./db.js";

// Import tool handlers
import { rollDice } from "./tools/dice.js";
import { addNote, queryNotes } from "./tools/notes.js";
import { getEntity, updateEntity, createEntity, queryEntities, deleteEntity } from "./tools/ecs.js";
import { rollOracle } from "./tools/oracle.js";
import { getSessionSummary } from "./tools/session.js";
import { ttsNarrate } from "./tools/tts.js";

const server = new McpServer({
  name: "glintlock-engine",
  version: "0.1.0",
});

// --- roll_dice ---
server.tool(
  "roll_dice",
  "Roll dice using standard notation. Returns individual die results and total. Use for ALL mechanical resolution — attacks, damage, checks, initiative, random encounters, death timers. NEVER simulate dice results.",
  {
    expression: z.string().describe("Dice expression. Examples: '1d20', '2d6+3', '1d8-1', '3d6', '1d100', '1d20+4'. Supports NdS+M format."),
    purpose: z.string().optional().describe("What this roll is for. Logged for session history."),
    advantage: z.boolean().optional().describe("If true, roll twice and take the higher result"),
    disadvantage: z.boolean().optional().describe("If true, roll twice and take the lower result"),
  },
  async (params) => {
    try {
      const result = rollDice(params);
      return { content: [{ type: "text", text: JSON.stringify(result) }] };
    } catch (err) {
      return { content: [{ type: "text", text: (err as Error).message }], isError: true };
    }
  }
);

// --- get_entity ---
server.tool(
  "get_entity",
  "Read an entity and all its components from the world state. Query by ID, name, or type. Returns the entity with all attached component data.",
  {
    entity_id: z.string().optional().describe("Exact entity ID (e.g. 'pc_torbin', 'npc_grukk')"),
    name: z.string().optional().describe("Entity name to search for (case-insensitive partial match)"),
    entity_type: z.enum(["pc", "npc", "location", "item", "faction"]).optional().describe("Filter by entity type"),
  },
  async (params) => {
    try {
      const result = getEntity(params);
      return { content: [{ type: "text", text: JSON.stringify(result) }] };
    } catch (err) {
      return { content: [{ type: "text", text: (err as Error).message }], isError: true };
    }
  }
);

// --- update_entity ---
server.tool(
  "update_entity",
  "Modify a component on an existing entity. Supports set (replace value), delta (add/subtract number), push (add to array), and remove (delete from array) operations. If the component doesn't exist on the entity yet, it will be auto-created with defaults. Valid components: stats, health, character_info, spells, position, inventory, description, location_data, combat_data. Stat fields (str/dex/con/int/wis/cha) are case-insensitive.",
  {
    entity_id: z.string().describe("Entity ID to update"),
    component: z.string().describe("Component name (e.g. 'health', 'inventory', 'position', 'stats', 'description')"),
    operation: z.enum(["set", "delta", "push", "remove"]).describe("set: replace field value. delta: add number to field. push: append to JSON array field. remove: delete from JSON array field."),
    field: z.string().describe("Field within the component (e.g. 'current' in health, 'items' in inventory)"),
    value: z.any().describe("The value to set, delta, push, or remove. Type depends on operation."),
  },
  async (params) => {
    try {
      const result = updateEntity(params);
      return { content: [{ type: "text", text: JSON.stringify(result) }] };
    } catch (err) {
      return { content: [{ type: "text", text: (err as Error).message }], isError: true };
    }
  }
);

// --- create_entity ---
server.tool(
  "create_entity",
  `Create a new entity with initial components. The entity ID is auto-generated from type and name (e.g. 'npc_merchant_vela').

Component schema (all fields optional unless noted):
- stats: str, dex, con, int, wis, cha (integers, default 10)
- health: current (required int), max (required int)
- character_info: ancestry, class, level, xp, alignment, title, background, ac, languages (JSON array), talents (JSON array), hit_die, weapon_proficiencies (JSON array), armor_proficiencies (JSON array), class_features (JSON array), ancestry_traits (JSON array)
- spells: known (JSON array), lost (JSON array), penance (JSON array)
- position: location_id, sub_location
- inventory: items (JSON array), gold, silver, copper, gear_slots_used, gear_slots_max
- description: text (required string), discovered (0 or 1)
- location_data: danger_level (safe/unsafe/risky/deadly), light (bright/dim/dark), connections (JSON array)
- combat_data: ac (required int), attacks (JSON array), movement (close/near/far), special (JSON array), morale_broken (0/1), is_undead (0/1)`,
  {
    entity_type: z.enum(["pc", "npc", "location", "item", "faction"]).describe("Entity type"),
    name: z.string().describe("Display name for the entity"),
    components: z.record(z.string(), z.record(z.string(), z.any())).optional().describe("Initial component data. Keys are component names, values are objects with the component fields."),
  },
  async (params) => {
    try {
      const result = createEntity(params);
      return { content: [{ type: "text", text: JSON.stringify(result) }] };
    } catch (err) {
      return { content: [{ type: "text", text: (err as Error).message }], isError: true };
    }
  }
);

// --- query_entities ---
server.tool(
  "query_entities",
  "Query entities by type, location, or component values. Returns matching entities with all their components.",
  {
    entity_type: z.enum(["pc", "npc", "location", "item", "faction"]).optional().describe("Filter by entity type"),
    location_id: z.string().optional().describe("Filter to entities at this location"),
    filters: z.record(z.string(), z.any()).optional().describe("Component field filters. Keys use dot notation: 'component.field'. Values are the expected value."),
    limit: z.number().optional().describe("Max results (default 20)"),
  },
  async (params) => {
    try {
      const result = queryEntities(params);
      return { content: [{ type: "text", text: JSON.stringify(result) }] };
    } catch (err) {
      return { content: [{ type: "text", text: (err as Error).message }], isError: true };
    }
  }
);

// --- delete_entity ---
server.tool(
  "delete_entity",
  "Delete an entity and all its components permanently. CASCADE deletes component rows and attached notes. Use for: dead NPCs, consumed items, test cleanup. Requires confirm: true.",
  {
    entity_id: z.string().describe("Entity ID to delete"),
    confirm: z.boolean().describe("Must be true. Safety flag to prevent accidental deletion."),
  },
  async (params) => {
    try {
      const result = deleteEntity(params);
      return { content: [{ type: "text", text: JSON.stringify(result) }] };
    } catch (err) {
      return { content: [{ type: "text", text: (err as Error).message }], isError: true };
    }
  }
);

// --- roll_oracle ---
server.tool(
  "roll_oracle",
  "Roll on a random oracle table from the Shadowdark RPG system. Returns a real random result from curated content. Use instead of inventing NPCs, encounters, treasure, etc.",
  {
    table: z.enum([
      "npc_name", "random_encounter_ruins", "something_happens", "rumors",
      "treasure_0_3", "creature_activity", "creature_reaction", "starting_distance",
      "trap", "hazard_movement", "hazard_damage", "hazard_weaken",
      "adventure_name", "magic_item_name", "beastman_npc", "ettercap_npc",
      "background", "random_gear",
    ]).describe("Which oracle table to roll on"),
    subtype: z.string().optional().describe("Subtype filter. For npc_name: ancestry ('dwarf','elf','goblin','halfling','half_orc','human'). For creature_reaction: CHA modifier as string (e.g. '+2', '-1')."),
  },
  async (params) => {
    try {
      const result = rollOracle(params);
      return { content: [{ type: "text", text: JSON.stringify(result) }] };
    } catch (err) {
      return { content: [{ type: "text", text: (err as Error).message }], isError: true };
    }
  }
);

// --- add_note ---
server.tool(
  "add_note",
  "Record a freeform text note. Can be global (campaign-level) or attached to a specific entity. Use for: session events, NPC promises, unresolved plot threads, player decisions, rulings made. Notes survive context compaction.",
  {
    text: z.string().describe("The note content"),
    entity_id: z.string().optional().describe("Attach note to this entity (optional — omit for global notes)"),
    tag: z.string().optional().describe("Optional category tag: 'event', 'ruling', 'thread', 'promise', 'discovery'"),
  },
  async (params) => {
    try {
      const result = addNote(params);
      return { content: [{ type: "text", text: JSON.stringify(result) }] };
    } catch (err) {
      return { content: [{ type: "text", text: (err as Error).message }], isError: true };
    }
  }
);

// --- query_notes ---
server.tool(
  "query_notes",
  "Search and filter session notes. Query by entity, tag, text content, or time range. Returns notes in reverse chronological order.",
  {
    entity_id: z.string().optional().describe("Filter to notes attached to this entity"),
    tag: z.string().optional().describe("Filter by tag: 'event', 'ruling', 'thread', 'promise', 'discovery'"),
    text_search: z.string().optional().describe("Case-insensitive text search in note content"),
    limit: z.number().optional().describe("Max results (default 20)"),
    since: z.string().optional().describe("ISO timestamp — only notes after this time"),
  },
  async (params) => {
    try {
      const result = queryNotes(params);
      return { content: [{ type: "text", text: JSON.stringify(result) }] };
    } catch (err) {
      return { content: [{ type: "text", text: (err as Error).message }], isError: true };
    }
  }
);

// --- get_session_summary ---
server.tool(
  "get_session_summary",
  "Get a comprehensive summary of the current campaign state for cold starts and session recaps. Returns PC status, current location, recent events, active threads, and key NPCs.",
  {
    detail_level: z.enum(["brief", "full"]).optional().describe("brief: PC status + location + last 3 notes. full: everything including all NPCs, items, locations."),
  },
  async (params) => {
    try {
      const result = getSessionSummary(params);
      return { content: [{ type: "text", text: JSON.stringify(result) }] };
    } catch (err) {
      return { content: [{ type: "text", text: (err as Error).message }], isError: true };
    }
  }
);

// --- tts_narrate ---
server.tool(
  "tts_narrate",
  "Speak text aloud using text-to-speech. Use for dramatic narration, NPC dialogue, and atmospheric moments. Audio plays in background — does not block. Skip for mechanical results, status updates, or routine responses.",
  {
    text: z.string().describe("The text to speak aloud. Keep under ~500 chars for best latency."),
    voice_id: z.string().optional().describe("ElevenLabs voice ID. Omit for default narrator voice. Use different voices for distinct NPCs."),
    speed: z.number().optional().describe("Speech speed multiplier. Default 1.0. Range 0.5-2.0."),
  },
  async (params) => {
    try {
      const result = await ttsNarrate(params);
      return { content: [{ type: "text", text: JSON.stringify(result) }], isError: !result.spoken && !!result.error };
    } catch (err) {
      return { content: [{ type: "text", text: (err as Error).message }], isError: true };
    }
  }
);

// --- Start server ---
const transport = new StdioServerTransport();
await server.connect(transport);
