import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import { rollDice } from "./tools/dice.js";
import { rollOracle } from "./tools/oracle.js";
import { ttsNarrate } from "./tools/tts.js";
import { getSessionMetadata, updateSessionMetadata } from "./tools/metadata.js";

const server = new McpServer({
  name: "glintlock-engine",
  version: "0.2.0",
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

// --- get_session_metadata ---
server.tool(
  "get_session_metadata",
  "Read or update lightweight session metadata (session count, last played date, campaign creation date). Use at session start/end to track campaign lifecycle.",
  {
    action: z.enum(["read", "update"]).describe("'read' to get current metadata, 'update' to merge new values"),
    updates: z.object({
      sessions_played: z.number().optional(),
      last_played: z.string().optional(),
      campaign_created: z.string().optional(),
    }).optional().describe("Fields to update (only used when action is 'update')"),
  },
  async (params) => {
    try {
      if (params.action === "update" && params.updates) {
        const result = updateSessionMetadata(params.updates);
        return { content: [{ type: "text", text: JSON.stringify(result) }] };
      }
      const result = getSessionMetadata();
      return { content: [{ type: "text", text: JSON.stringify(result) }] };
    } catch (err) {
      return { content: [{ type: "text", text: (err as Error).message }], isError: true };
    }
  }
);

// --- Start server ---
const transport = new StdioServerTransport();
await server.connect(transport);
