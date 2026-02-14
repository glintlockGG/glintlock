import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { rollDice } from "./tools/dice.js";
import { rollOracle, oracleYesNo } from "./tools/oracle.js";
import { ttsNarrate } from "./tools/tts.js";
import { generateSfx } from "./tools/sfx.js";
import { playMusic } from "./tools/music.js";
import { listVoices } from "./tools/voices.js";
import { getSessionMetadata, updateSessionMetadata } from "./tools/metadata.js";
import { renderAudiobook } from "./tools/audiobook.js";
import { mixAudiobook } from "./tools/audiobook-mixer.js";
import { trackTime } from "./tools/timer.js";
const server = new McpServer({
    name: "glintlock-engine",
    version: "2.0.0",
});
// --- roll_dice ---
server.tool("roll_dice", "Roll dice using standard notation. Returns individual die results and total. Use for ALL mechanical resolution — attacks, damage, checks, initiative, random encounters, death timers. NEVER simulate dice results.", {
    expression: z.string().describe("Dice expression. Examples: '1d20', '2d6+3', '1d8-1', '3d6', '1d100', '1d20+4'. Supports NdS+M format."),
    purpose: z.string().optional().describe("What this roll is for. Logged for session history."),
    advantage: z.boolean().optional().describe("If true, roll twice and take the higher result"),
    disadvantage: z.boolean().optional().describe("If true, roll twice and take the lower result"),
}, async (params) => {
    try {
        const result = rollDice(params);
        return { content: [{ type: "text", text: JSON.stringify(result) }] };
    }
    catch (err) {
        return { content: [{ type: "text", text: err.message }], isError: true };
    }
});
// --- roll_oracle ---
server.tool("roll_oracle", "Roll on a random oracle table from the game rules. Returns a real random result from curated content. Use instead of inventing NPCs, encounters, treasure, etc.", {
    table: z.enum([
        "npc_name", "something_happens", "rumors",
        "treasure_0_3", "creature_activity", "creature_reaction", "starting_distance",
        "trap", "hazard_movement", "hazard_damage", "hazard_weaken",
        "adventure_name", "magic_item_name",
        "background", "random_gear",
        "encounter_thornwood", "encounter_wolds", "encounter_ashfall",
        "encounter_fenway", "encounter_greenmere", "encounter_bleach",
    ]).describe("Which oracle table to roll on"),
    subtype: z.string().optional().describe("Subtype filter. For npc_name: ancestry ('human','eldren','dwerrow','goblin','beastkin'). For creature_reaction: PRE modifier as string (e.g. '+2', '-1')."),
}, async (params) => {
    try {
        const result = rollOracle(params);
        return { content: [{ type: "text", text: JSON.stringify(result) }] };
    }
    catch (err) {
        return { content: [{ type: "text", text: err.message }], isError: true };
    }
});
// --- oracle_yes_no ---
server.tool("oracle_yes_no", "Roll a yes/no oracle with set odds (Ironsworn-style). Use for ambiguous world-state questions, NPC decisions, doom advancement checks, and any uncertain outcome that needs a fair random answer.", {
    odds: z.enum(["almost_certain", "likely", "even", "unlikely", "nearly_impossible"]).describe("How likely is a 'yes' result? almost_certain=90%, likely=75%, even=50%, unlikely=25%, nearly_impossible=10%."),
    question: z.string().describe("The yes/no question being resolved (e.g. 'Does the faction discover the PC's sabotage?')."),
}, async (params) => {
    try {
        const result = oracleYesNo(params);
        return { content: [{ type: "text", text: JSON.stringify(result) }] };
    }
    catch (err) {
        return { content: [{ type: "text", text: err.message }], isError: true };
    }
});
// --- tts_narrate ---
server.tool("tts_narrate", "Speak text aloud using text-to-speech. Use for dramatic narration, NPC dialogue, and atmospheric moments. Audio plays in background — does not block. Skip for mechanical results, status updates, or routine responses.", {
    text: z.string().describe("The text to speak aloud. Keep under ~500 chars for best latency."),
    voice_id: z.string().optional().describe("ElevenLabs voice ID. Omit for default narrator voice. Use different voices for distinct NPCs."),
    language_code: z.string().optional().describe("ISO 639-3 language code (e.g. 'eng', 'fra', 'jpn'). Optional — auto-detected from text if omitted."),
    speed: z.number().optional().describe("Speech speed multiplier. Default 1.0. Range 0.5-2.0."),
    stability: z.number().optional().describe("Voice consistency (0=variable, 1=stable). Default 0.5."),
    similarity_boost: z.number().optional().describe("Voice clarity vs expressiveness (0–1). Default 0.75."),
    style: z.number().optional().describe("Style exaggeration (0=none, 1=max). Useful for dramatic NPC moments. Default 0."),
    output_path: z.string().optional().describe("If set, save MP3 to this path instead of playing. Returns duration_ms. Used by audiobook pipeline."),
}, async (params) => {
    try {
        const result = await ttsNarrate(params);
        const isErr = !result.spoken && !result.rendered && !!result.error;
        return { content: [{ type: "text", text: JSON.stringify(result) }], isError: isErr };
    }
    catch (err) {
        return { content: [{ type: "text", text: err.message }], isError: true };
    }
});
// --- generate_sfx ---
server.tool("generate_sfx", "Generate and play a sound effect. Use for environmental sounds (door creaks, dripping water), combat impacts (sword clashes, spell effects), monster roars, treasure clinking, and atmospheric ambience. Audio plays in background — does not block.", {
    text: z.string().describe("Description of the sound effect (e.g. 'heavy wooden door creaking open', 'sword clashing against shield', 'distant thunder rumbling')."),
    duration_seconds: z.number().optional().describe("Duration in seconds (0.5–30). Auto-determined if omitted."),
    prompt_influence: z.number().optional().describe("How closely to follow the prompt (0–1). Default 0.3."),
    output_path: z.string().optional().describe("If set, save MP3 to this path instead of playing. Returns duration_ms. Used by audiobook pipeline."),
}, async (params) => {
    try {
        const result = await generateSfx(params);
        const isErr = !result.played && !result.rendered && !!result.error;
        return { content: [{ type: "text", text: JSON.stringify(result) }], isError: isErr };
    }
    catch (err) {
        return { content: [{ type: "text", text: err.message }], isError: true };
    }
});
// --- play_music ---
server.tool("play_music", "Control background music. Use to set mood when entering new areas or shifting tone. Music loops automatically and layers with TTS/SFX through Core Audio. Only one music track plays at a time — playing new music stops the previous track.", {
    action: z.enum(["play", "stop", "change"]).describe("'play' to start music, 'stop' to silence, 'change' to crossfade to new mood."),
    prompt: z.string().optional().describe("Music description (e.g. 'dark ambient dungeon music with distant dripping and low drones', 'intense orchestral battle music'). Required for play/change."),
    duration_seconds: z.number().optional().describe("Generated track length in seconds (5–120). Default 30. Loops regardless of length."),
    volume: z.number().optional().describe("Playback volume (0.0–1.0). Default 0.25. Keep low so it doesn't overwhelm narration."),
    loop: z.boolean().optional().describe("Whether to loop the track. Default true."),
    force_instrumental: z.boolean().optional().describe("Force instrumental only (no vocals). Default true."),
    output_path: z.string().optional().describe("If set, save MP3 to this path instead of playing. Returns duration_ms. Used by audiobook pipeline."),
}, async (params) => {
    try {
        const result = await playMusic(params);
        const isErr = !result.playing && !result.rendered && !!result.error;
        return { content: [{ type: "text", text: JSON.stringify(result) }], isError: isErr };
    }
    catch (err) {
        return { content: [{ type: "text", text: err.message }], isError: true };
    }
});
// --- list_voices ---
server.tool("list_voices", "Browse available ElevenLabs voices. Use when creating important NPCs to find a fitting voice. Store the chosen voice_id in the NPC's frontmatter for consistent dialogue.", {
    search: z.string().optional().describe("Filter by name/description/labels (e.g. 'old man', 'young woman', 'deep male', 'narrator')."),
    category: z.enum(["premade", "cloned", "generated", "professional"]).optional().describe("Voice category filter."),
    page_size: z.number().optional().describe("Results per page (1–100). Default 20."),
}, async (params) => {
    try {
        const result = await listVoices(params);
        return { content: [{ type: "text", text: JSON.stringify(result) }], isError: !!result.error };
    }
    catch (err) {
        return { content: [{ type: "text", text: err.message }], isError: true };
    }
});
// --- get_session_metadata ---
server.tool("get_session_metadata", "Read or update lightweight session metadata (session count, last played date, campaign creation date). Use at session start/end to track campaign lifecycle.", {
    action: z.enum(["read", "update"]).describe("'read' to get current metadata, 'update' to merge new values"),
    updates: z.object({
        sessions_played: z.number().optional(),
        last_played: z.string().optional(),
        campaign_created: z.string().optional(),
    }).optional().describe("Fields to update (only used when action is 'update')"),
}, async (params) => {
    try {
        if (params.action === "update" && params.updates) {
            const result = updateSessionMetadata(params.updates);
            return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }
        const result = getSessionMetadata();
        return { content: [{ type: "text", text: JSON.stringify(result) }] };
    }
    catch (err) {
        return { content: [{ type: "text", text: err.message }], isError: true };
    }
});
// --- render_audiobook ---
server.tool("render_audiobook", "Parse a chronicle chapter markdown into a structured audio manifest (segments, chunks, voice assignments, estimated durations). Pure text processing — no API calls. Use before generating TTS/SFX/music for an audiobook.", {
    chapter_markdown: z.string().describe("The full markdown text of the chronicle chapter."),
    chapter_number: z.number().describe("Chapter number (e.g. 1, 2, 3)."),
    chapter_title: z.string().describe("Chapter title (e.g. 'The Living Marble')."),
    language_code: z.string().optional().describe("ISO 639-3 language code for the chapter audio (e.g. 'eng', 'fra', 'jpn')."),
    narrator_voice_id: z.string().optional().describe("Voice ID for narrator. Defaults to Glintlock narrator voice."),
    voices: z.record(z.string(), z.string()).optional().describe("Map of speaker name to ElevenLabs voice ID (e.g. {\"Silvio\": \"abc123\", \"Viola\": \"def456\"})."),
    annotated_scenes: z.array(z.object({
        segments: z.array(z.object({
            type: z.enum(["narration", "dialogue", "epigraph"]).describe("Segment type."),
            text: z.string().describe("The text content of this segment."),
            speaker: z.string().optional().describe("Speaker name for dialogue segments. Agent assigns this using narrative context."),
        })).describe("Ordered segments within this scene."),
    })).optional().describe("Agent-annotated scenes. If provided, bypasses regex-based markdown parsing for more accurate dialogue detection and speaker assignment."),
}, async (params) => {
    try {
        const result = renderAudiobook(params);
        return { content: [{ type: "text", text: JSON.stringify(result) }] };
    }
    catch (err) {
        return { content: [{ type: "text", text: err.message }], isError: true };
    }
});
// --- mix_audiobook ---
server.tool("mix_audiobook", "Mix rendered audiobook segments into a final MP3 using ffmpeg. Concatenates speech with gaps, layers music bed and SFX, applies fade-in/fade-out. Requires ffmpeg installed.", {
    manifest: z.string().describe("JSON string of the AudioManifest with actual file_path and actual_duration_ms populated on chunks, plus sfx_file_path/music_file_path on segments/scenes."),
    build_dir: z.string().describe("Directory for intermediate build files (e.g. 'world/audiobooks/.build/chapter-01')."),
    output_path: z.string().describe("Output path for the final MP3 (e.g. 'world/audiobooks/chapter-01-the-living-marble.mp3')."),
}, async (params) => {
    try {
        const manifest = JSON.parse(params.manifest);
        const result = await mixAudiobook({ manifest, build_dir: params.build_dir, output_path: params.output_path });
        return { content: [{ type: "text", text: JSON.stringify(result) }], isError: !result.success };
    }
    catch (err) {
        return { content: [{ type: "text", text: err.message }], isError: true };
    }
});
// --- track_time ---
server.tool("track_time", "Manage countdown dice for resource pressure. Countdown dice step down (cd12→cd10→cd8→cd6→cd4→exhausted) when rolled and showing a 1. Use to track torches, rations, ammunition, spell components, morale, and custom resources.", {
    action: z.enum(["status", "add", "tick", "remove", "reset"]).describe("'status' to list all countdown dice. 'add' to create a new die. 'tick' to roll a die (on 1, it steps down). 'remove' to delete a die. 'reset' to clear all dice."),
    name: z.string().optional().describe("Name of the countdown die (e.g. 'torches', 'rations', 'arrows'). Required for add/tick/remove."),
    starting_die: z.number().optional().describe("Starting die size for 'add' action: 4, 6, 8, 10, or 12. Default 8. Use quantity table: 1→cd4, 2→cd6, 3→cd8, 4-5→cd10, 6+→cd12."),
    category: z.string().optional().describe("Category for 'add' action: 'light', 'supply', 'ammo', 'spell', 'morale', 'custom'. Default 'custom'."),
    note: z.string().optional().describe("Optional note to log."),
}, async (params) => {
    try {
        const result = trackTime(params);
        return { content: [{ type: "text", text: JSON.stringify(result) }] };
    }
    catch (err) {
        return { content: [{ type: "text", text: err.message }], isError: true };
    }
});
// --- Start server ---
console.error("[glintlock-engine] registering tools...");
const transport = new StdioServerTransport();
await server.connect(transport);
console.error("[glintlock-engine] connected — all tools available");
//# sourceMappingURL=index.js.map