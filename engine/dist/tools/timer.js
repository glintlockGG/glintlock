import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname } from "path";
import { randomInt } from "crypto";
const WORLD_DIR = process.env.GLINTLOCK_WORLD_DIR || "./world";
const STATE_PATH = `${WORLD_DIR}/countdown.json`;
// Valid die sizes in step-down order
const DIE_CHAIN = [12, 10, 8, 6, 4, 0];
function stepDown(current) {
    const idx = DIE_CHAIN.indexOf(current);
    if (idx < 0 || idx >= DIE_CHAIN.length - 1)
        return 0;
    return DIE_CHAIN[idx + 1];
}
function loadState() {
    try {
        const data = readFileSync(STATE_PATH, "utf-8");
        return JSON.parse(data);
    }
    catch {
        return {
            countdown_dice: [],
            notes: [],
        };
    }
}
function saveState(state) {
    mkdirSync(dirname(STATE_PATH), { recursive: true });
    writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));
}
function dieName(size) {
    if (size === 0)
        return "exhausted";
    return `cd${size}`;
}
export function trackTime(params) {
    const state = loadState();
    const warnings = [];
    let tickResult;
    switch (params.action) {
        case "add": {
            if (!params.name)
                throw new Error("Name is required for 'add' action");
            const startingDie = params.starting_die || 8;
            if (!DIE_CHAIN.includes(startingDie) || startingDie === 0) {
                throw new Error(`Invalid starting die: ${startingDie}. Must be 4, 6, 8, 10, or 12.`);
            }
            // Check for duplicate
            const existing = state.countdown_dice.find(d => d.name === params.name);
            if (existing) {
                throw new Error(`Countdown die '${params.name}' already exists (currently ${dieName(existing.current_die)}). Remove it first or use a different name.`);
            }
            state.countdown_dice.push({
                name: params.name,
                current_die: startingDie,
                category: params.category || "custom",
            });
            break;
        }
        case "tick": {
            if (!params.name)
                throw new Error("Name is required for 'tick' action");
            const die = state.countdown_dice.find(d => d.name === params.name);
            if (!die)
                throw new Error(`No countdown die named '${params.name}' found.`);
            if (die.current_die === 0) {
                warnings.push(`'${params.name}' is already exhausted.`);
                tickResult = {
                    name: die.name,
                    rolled: 0,
                    die_size: 0,
                    stepped_down: false,
                    new_die: "exhausted",
                    exhausted: true,
                };
                break;
            }
            const rolled = randomInt(1, die.current_die + 1);
            const steppedDown = rolled === 1;
            if (steppedDown) {
                die.current_die = stepDown(die.current_die);
            }
            const exhausted = die.current_die === 0;
            tickResult = {
                name: die.name,
                rolled,
                die_size: steppedDown ? DIE_CHAIN[DIE_CHAIN.indexOf(die.current_die) - 1] || die.current_die : die.current_die,
                stepped_down: steppedDown,
                new_die: dieName(die.current_die),
                exhausted,
            };
            if (exhausted) {
                warnings.push(`'${die.name}' is EXHAUSTED! The resource is depleted.`);
            }
            else if (steppedDown) {
                warnings.push(`'${die.name}' stepped down to ${dieName(die.current_die)}. Pressure building.`);
            }
            break;
        }
        case "remove": {
            if (!params.name)
                throw new Error("Name is required for 'remove' action");
            const idx = state.countdown_dice.findIndex(d => d.name === params.name);
            if (idx < 0)
                throw new Error(`No countdown die named '${params.name}' found.`);
            state.countdown_dice.splice(idx, 1);
            break;
        }
        case "reset": {
            state.countdown_dice = [];
            state.notes = [];
            break;
        }
        case "status":
        default: {
            // Report current state
            for (const die of state.countdown_dice) {
                if (die.current_die === 0) {
                    warnings.push(`'${die.name}' is exhausted.`);
                }
                else if (die.current_die === 4) {
                    warnings.push(`'${die.name}' is at cd4 — one step from exhaustion!`);
                }
            }
            break;
        }
    }
    if (params.note) {
        state.notes.push(params.note);
    }
    saveState(state);
    return {
        action: params.action,
        countdown_dice: state.countdown_dice.map(d => ({
            name: d.name,
            current_die: dieName(d.current_die),
            category: d.category,
        })),
        tick_result: tickResult,
        warnings,
    };
}
//# sourceMappingURL=timer.js.map