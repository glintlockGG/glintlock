import { readFileSync } from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
import { parseAndRoll } from "./dice.js";

const oraclePath = path.resolve(
  process.env.GLINTLOCK_ORACLE_PATH ?? "./engine/data/oracle-tables.json"
);
const oracleTables: Record<string, OracleTable> = JSON.parse(
  readFileSync(oraclePath, "utf-8")
);

interface OracleTable {
  dice?: string;
  entries?: unknown;
  subtypes?: Record<string, string[]>;
  columns?: Record<string, string[]>;
  note?: string;
  _TODO?: string;
}

export interface RollOracleParams {
  table: string;
  subtype?: string;
}

function parseRangeValue(s: string): number {
  const n = parseInt(s, 10);
  // "00" on a d100 table means 100
  return n === 0 ? 100 : n;
}

function matchesRange(key: string, roll: number): boolean {
  if (key.endsWith("+")) {
    return roll >= parseRangeValue(key);
  }
  if (key.includes("-")) {
    const [lo, hi] = key.split("-").map(parseRangeValue);
    return roll >= lo && roll <= hi;
  }
  return roll === parseRangeValue(key);
}

export interface OracleYesNoParams {
  odds: "almost_certain" | "likely" | "even" | "unlikely" | "nearly_impossible";
  question: string;
}

const yesNoThresholds: Record<OracleYesNoParams["odds"], number> = {
  almost_certain: 90,
  likely: 75,
  even: 50,
  unlikely: 25,
  nearly_impossible: 10,
};

export function oracleYesNo(params: OracleYesNoParams) {
  const { odds, question } = params;
  const threshold = yesNoThresholds[odds];
  const roll = crypto.randomInt(1, 101); // 1-100
  const result = roll <= threshold ? "yes" : "no";
  return { question, odds, threshold, roll, result };
}

export function rollOracle(params: RollOracleParams) {
  const { table: tableName, subtype } = params;

  const table = oracleTables[tableName];
  if (!table) {
    throw new Error(`Unknown oracle table: "${tableName}". Available: ${Object.keys(oracleTables).join(", ")}`);
  }

  if (!table.dice) {
    throw new Error(`Table "${tableName}" is not rollable (no dice expression).`);
  }

  // Handle _TODO tables with empty entries
  if (table._TODO) {
    const entries = table.entries;
    const isEmpty =
      (typeof entries === "object" && entries !== null && !Array.isArray(entries) && Object.keys(entries).length === 0) ||
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
    const result: Record<string, string> = {};
    const rolls: Record<string, number> = {};

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
    const entries = table.entries as Record<string, unknown>;
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
