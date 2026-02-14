import { readFileSync, existsSync } from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
import { parseAndRoll } from "./dice.js";
let cachedTables = null;
let cachedError = null;
function loadOracleTables() {
    if (cachedTables)
        return cachedTables;
    if (cachedError)
        throw new Error(cachedError);
    const oraclePath = path.resolve(process.env.GLINTLOCK_ORACLE_PATH || "./data/oracle-tables.json");
    if (!existsSync(oraclePath)) {
        cachedError = `Oracle tables not found at ${oraclePath}. Set GLINTLOCK_ORACLE_PATH or ensure the file exists. Other tools (dice, TTS, SFX, music) still work.`;
        console.error(`[glintlock-engine] ${cachedError}`);
        throw new Error(cachedError);
    }
    try {
        cachedTables = JSON.parse(readFileSync(oraclePath, "utf-8"));
        console.error(`[glintlock-engine] oracle tables loaded from ${oraclePath}`);
        return cachedTables;
    }
    catch (err) {
        cachedError = `Failed to parse oracle tables at ${oraclePath}: ${err.message}`;
        console.error(`[glintlock-engine] ${cachedError}`);
        throw new Error(cachedError);
    }
}
function parseRangeValue(s) {
    const n = parseInt(s, 10);
    // "00" on a d100 table means 100
    return n === 0 ? 100 : n;
}
function matchesRange(key, roll) {
    if (key.endsWith("+")) {
        return roll >= parseRangeValue(key);
    }
    if (key.includes("-")) {
        const [lo, hi] = key.split("-").map(parseRangeValue);
        return roll >= lo && roll <= hi;
    }
    return roll === parseRangeValue(key);
}
const yesNoThresholds = {
    almost_certain: 90,
    likely: 75,
    even: 50,
    unlikely: 25,
    nearly_impossible: 10,
};
export function oracleYesNo(params) {
    const { odds, question } = params;
    const threshold = yesNoThresholds[odds];
    const roll = crypto.randomInt(1, 101); // 1-100
    const result = roll <= threshold ? "yes" : "no";
    return { question, odds, threshold, roll, result };
}
export function rollOracle(params) {
    const { table: tableName, subtype } = params;
    const tables = loadOracleTables();
    const table = tables[tableName];
    if (!table) {
        throw new Error(`Unknown oracle table: "${tableName}". Available: ${Object.keys(tables).join(", ")}`);
    }
    if (!table.dice) {
        throw new Error(`Table "${tableName}" is not rollable (no dice expression).`);
    }
    // Handle _TODO tables with empty entries
    if (table._TODO) {
        const entries = table.entries;
        const isEmpty = (typeof entries === "object" && entries !== null && !Array.isArray(entries) && Object.keys(entries).length === 0) ||
            (Array.isArray(entries) && entries.length === 0);
        if (isEmpty) {
            throw new Error(`Table "${tableName}" data not yet populated. ${table._TODO}`);
        }
    }
    // --- Subtypes (e.g. npc_name) ---
    if (table.subtypes) {
        if (!subtype) {
            throw new Error(`Table "${tableName}" requires a subtype. Available: ${Object.keys(table.subtypes).join(", ")}`);
        }
        const list = table.subtypes[subtype];
        if (!list) {
            throw new Error(`Unknown subtype "${subtype}" for table "${tableName}". Available: ${Object.keys(table.subtypes).join(", ")}`);
        }
        const roll = parseAndRoll(table.dice);
        const index = Math.min(roll.total - 1, list.length - 1);
        return {
            table: tableName,
            roll: roll.total,
            result: list[Math.max(0, index)],
            subtype,
        };
    }
    // --- Multi-column (e.g. adventure_name) ---
    if (table.columns) {
        const result = {};
        const rolls = {};
        for (const [colName, colEntries] of Object.entries(table.columns)) {
            const roll = parseAndRoll(table.dice);
            const index = Math.min(roll.total - 1, colEntries.length - 1);
            result[colName] = colEntries[Math.max(0, index)];
            rolls[colName] = roll.total;
        }
        return {
            table: tableName,
            roll: rolls,
            result,
        };
    }
    // --- Flat array (e.g. background, trap, hazard_*) ---
    if (Array.isArray(table.entries)) {
        const roll = parseAndRoll(table.dice);
        const index = Math.min(roll.total - 1, table.entries.length - 1);
        return {
            table: tableName,
            roll: roll.total,
            result: table.entries[Math.max(0, index)],
        };
    }
    // --- Range object (e.g. creature_activity, creature_reaction) ---
    if (typeof table.entries === "object" && table.entries !== null) {
        const entries = table.entries;
        let roll = parseAndRoll(table.dice);
        let total = roll.total;
        // creature_reaction special case: add CHA modifier
        if (tableName === "creature_reaction" && subtype) {
            const chaMod = parseInt(subtype, 10);
            if (!isNaN(chaMod)) {
                total += chaMod;
            }
        }
        for (const [rangeKey, value] of Object.entries(entries)) {
            if (matchesRange(rangeKey, total)) {
                return {
                    table: tableName,
                    roll: total,
                    result: value,
                    ...(subtype ? { subtype } : {}),
                };
            }
        }
        // If no range matched (shouldn't happen with well-formed tables), return last entry
        const keys = Object.keys(entries);
        return {
            table: tableName,
            roll: total,
            result: entries[keys[keys.length - 1]],
            ...(subtype ? { subtype } : {}),
        };
    }
    throw new Error(`Table "${tableName}" has an unrecognized format.`);
}
//# sourceMappingURL=oracle.js.map