import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname } from "path";
const WORLD_DIR = process.env.GLINTLOCK_WORLD_DIR || "./world";
const TIMER_PATH = `${WORLD_DIR}/timer.json`;
// Encounter check cadence (in crawling rounds)
const ENCOUNTER_CADENCE = {
    safe: 36, // every 3 hours (18 rounds) — rarely relevant
    unsafe: 3,
    risky: 2,
    deadly: 1,
};
// Default durations for light sources (in crawling rounds, 1 round = 10 min)
const LIGHT_DURATIONS = {
    torch: 6, // 1 hour
    lantern: 6, // 1 hour (1 flask of oil)
    light_spell: 6, // 1 hour
    glowstone: 48, // 8 hours
};
function loadState() {
    try {
        const data = readFileSync(TIMER_PATH, "utf-8");
        return JSON.parse(data);
    }
    catch {
        return {
            active: false,
            rounds_elapsed: 0,
            danger_level: "unsafe",
            light_sources: [],
            rounds_since_encounter_check: 0,
            notes: [],
        };
    }
}
function saveState(state) {
    mkdirSync(dirname(TIMER_PATH), { recursive: true });
    writeFileSync(TIMER_PATH, JSON.stringify(state, null, 2));
}
function formatTime(rounds) {
    const totalMinutes = rounds * 10;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours === 0)
        return `${minutes}min`;
    if (minutes === 0)
        return `${hours}h`;
    return `${hours}h ${minutes}min`;
}
export function trackTime(params) {
    let state = loadState();
    const warnings = [];
    const expiredLights = [];
    let encounterChecks = [];
    switch (params.action) {
        case "reset":
            state = {
                active: true,
                rounds_elapsed: 0,
                danger_level: params.danger_level || "unsafe",
                light_sources: [],
                rounds_since_encounter_check: 0,
                notes: [],
            };
            break;
        case "set_danger":
            state.active = true;
            state.danger_level = params.danger_level || state.danger_level;
            state.rounds_since_encounter_check = 0; // reset cadence on zone change
            break;
        case "light":
            state.active = true;
            const lightType = params.light_type || "torch";
            const duration = params.light_rounds || LIGHT_DURATIONS[lightType] || 6;
            state.light_sources.push({ type: lightType, rounds_remaining: duration });
            break;
        case "advance": {
            state.active = true;
            const rounds = params.rounds || 1;
            const cadence = ENCOUNTER_CADENCE[state.danger_level] || 3;
            for (let i = 0; i < rounds; i++) {
                state.rounds_elapsed++;
                state.rounds_since_encounter_check++;
                // Tick down light sources
                for (const light of state.light_sources) {
                    light.rounds_remaining--;
                }
                // Check for expired lights
                const expired = state.light_sources.filter(l => l.rounds_remaining <= 0);
                for (const e of expired) {
                    expiredLights.push(e.type);
                }
                state.light_sources = state.light_sources.filter(l => l.rounds_remaining > 0);
                // Check encounter cadence
                if (state.rounds_since_encounter_check >= cadence) {
                    encounterChecks.push({ round: state.rounds_elapsed, due: true });
                    state.rounds_since_encounter_check = 0;
                }
            }
            // Warnings
            if (state.light_sources.length === 0) {
                warnings.push("DARKNESS — No active light sources! Disadvantage on most tasks. Random encounter check every round.");
            }
            for (const light of state.light_sources) {
                if (light.rounds_remaining === 1) {
                    warnings.push(`${light.type.toUpperCase()} GUTTERING — 1 round (~10 min) remaining!`);
                }
                else if (light.rounds_remaining === 2) {
                    warnings.push(`${light.type} low — 2 rounds (~20 min) remaining.`);
                }
            }
            break;
        }
        case "status":
        default:
            state.active = true;
            // Just report — no state changes
            for (const light of state.light_sources) {
                if (light.rounds_remaining <= 2) {
                    warnings.push(`${light.type} low — ${light.rounds_remaining} round(s) remaining.`);
                }
            }
            if (state.light_sources.length === 0) {
                warnings.push("No active light sources.");
            }
            break;
    }
    if (params.note) {
        state.notes.push(`[Round ${state.rounds_elapsed}] ${params.note}`);
    }
    saveState(state);
    return {
        action: params.action,
        rounds_elapsed: state.rounds_elapsed,
        time_elapsed: formatTime(state.rounds_elapsed),
        danger_level: state.danger_level,
        light_sources: state.light_sources,
        has_light: state.light_sources.length > 0,
        encounter_checks: encounterChecks.length > 0 ? encounterChecks : undefined,
        expired_lights: expiredLights.length > 0 ? expiredLights : undefined,
        warnings,
    };
}
//# sourceMappingURL=timer.js.map