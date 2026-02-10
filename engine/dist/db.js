import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import { mkdirSync, writeFileSync, unlinkSync, accessSync, existsSync, constants } from "node:fs";
function resolveWritableDbPath() {
    const configured = path.resolve(process.env.GLINTLOCK_DB_PATH ?? "./world/state.db");
    const uid = process.getuid?.() ?? "default";
    const fallback = `/tmp/glintlock-${uid}/state.db`;
    for (const candidate of [configured, fallback]) {
        try {
            const dir = path.dirname(candidate);
            mkdirSync(dir, { recursive: true });
            // Test directory writability
            const probe = path.join(dir, ".glintlock-write-probe");
            writeFileSync(probe, "");
            unlinkSync(probe);
            // Test existing DB file writability
            if (existsSync(candidate)) {
                accessSync(candidate, constants.W_OK);
            }
            return candidate;
        }
        catch {
            console.error(`[glintlock] DB path not writable: ${candidate}`);
        }
    }
    throw new Error("[glintlock] FATAL: No writable database path found");
}
const dbPath = resolveWritableDbPath();
console.error(`[glintlock] Database: ${dbPath}`);
const db = new DatabaseSync(dbPath, { enableForeignKeyConstraints: true });
try {
    db.exec("PRAGMA journal_mode = WAL");
}
catch {
    console.error("[glintlock] WAL mode unavailable, using DELETE journal mode");
    db.exec("PRAGMA journal_mode = DELETE");
}
db.exec(`
CREATE TABLE IF NOT EXISTS entities (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL CHECK(type IN ('pc','npc','location','item','faction')),
    name TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS stats (
    entity_id TEXT PRIMARY KEY REFERENCES entities(id) ON DELETE CASCADE,
    str INTEGER NOT NULL DEFAULT 10,
    dex INTEGER NOT NULL DEFAULT 10,
    con INTEGER NOT NULL DEFAULT 10,
    int INTEGER NOT NULL DEFAULT 10,
    wis INTEGER NOT NULL DEFAULT 10,
    cha INTEGER NOT NULL DEFAULT 10
);

CREATE TABLE IF NOT EXISTS health (
    entity_id TEXT PRIMARY KEY REFERENCES entities(id) ON DELETE CASCADE,
    current INTEGER NOT NULL,
    max INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS character_info (
    entity_id TEXT PRIMARY KEY REFERENCES entities(id) ON DELETE CASCADE,
    ancestry TEXT,
    class TEXT,
    level INTEGER DEFAULT 1,
    xp INTEGER DEFAULT 0,
    alignment TEXT,
    title TEXT,
    background TEXT,
    ac INTEGER DEFAULT 10,
    languages TEXT DEFAULT '["Common"]'
);

CREATE TABLE IF NOT EXISTS spells (
    entity_id TEXT PRIMARY KEY REFERENCES entities(id) ON DELETE CASCADE,
    known TEXT DEFAULT '[]',
    lost TEXT DEFAULT '[]',
    penance TEXT DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS position (
    entity_id TEXT PRIMARY KEY REFERENCES entities(id) ON DELETE CASCADE,
    location_id TEXT REFERENCES entities(id),
    sub_location TEXT
);

CREATE TABLE IF NOT EXISTS inventory (
    entity_id TEXT PRIMARY KEY REFERENCES entities(id) ON DELETE CASCADE,
    items TEXT NOT NULL DEFAULT '[]',
    gold INTEGER DEFAULT 0,
    silver INTEGER DEFAULT 0,
    copper INTEGER DEFAULT 0,
    gear_slots_used INTEGER DEFAULT 0,
    gear_slots_max INTEGER DEFAULT 10
);

CREATE TABLE IF NOT EXISTS description (
    entity_id TEXT PRIMARY KEY REFERENCES entities(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    discovered INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS location_data (
    entity_id TEXT PRIMARY KEY REFERENCES entities(id) ON DELETE CASCADE,
    danger_level TEXT DEFAULT 'unsafe' CHECK(danger_level IN ('safe','unsafe','risky','deadly')),
    light TEXT DEFAULT 'dark' CHECK(light IN ('bright','dim','dark')),
    connections TEXT DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS combat_data (
    entity_id TEXT PRIMARY KEY REFERENCES entities(id) ON DELETE CASCADE,
    ac INTEGER NOT NULL,
    attacks TEXT NOT NULL DEFAULT '[]',
    movement TEXT DEFAULT 'near',
    special TEXT DEFAULT '[]',
    morale_broken INTEGER DEFAULT 0,
    is_undead INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    entity_id TEXT REFERENCES entities(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    tag TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS session_meta (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_entities_type ON entities(type);
CREATE INDEX IF NOT EXISTS idx_entities_name ON entities(name);
CREATE INDEX IF NOT EXISTS idx_position_location ON position(location_id);
CREATE INDEX IF NOT EXISTS idx_notes_entity ON notes(entity_id);
CREATE INDEX IF NOT EXISTS idx_notes_tag ON notes(tag);
`);
// Migrations — ALTER TABLE ADD COLUMN throws if column exists, so wrap in try/catch
const migrations = [
    "ALTER TABLE character_info ADD COLUMN talents TEXT DEFAULT '[]'",
    "ALTER TABLE character_info ADD COLUMN hit_die TEXT",
    "ALTER TABLE character_info ADD COLUMN weapon_proficiencies TEXT DEFAULT '[]'",
    "ALTER TABLE character_info ADD COLUMN armor_proficiencies TEXT DEFAULT '[]'",
    "ALTER TABLE character_info ADD COLUMN class_features TEXT DEFAULT '[]'",
    "ALTER TABLE character_info ADD COLUMN ancestry_traits TEXT DEFAULT '[]'",
];
for (const sql of migrations) {
    try {
        db.exec(sql);
    }
    catch { /* column already exists */ }
}
export default db;
//# sourceMappingURL=db.js.map