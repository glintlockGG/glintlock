import db from "../db.js";
const insertNote = db.prepare("INSERT INTO notes (text, entity_id, tag) VALUES (?, ?, ?)");
export function addNote(params) {
    const { text, entity_id, tag } = params;
    try {
        const info = insertNote.run(text, entity_id ?? null, tag ?? null);
        return {
            success: true,
            note_id: Number(info.lastInsertRowid),
            ...(entity_id ? { entity_id } : {}),
            ...(tag ? { tag } : {}),
        };
    }
    catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        if (message.includes("FOREIGN KEY constraint failed")) {
            throw new Error(`Entity "${entity_id}" does not exist.`);
        }
        throw err;
    }
}
//# sourceMappingURL=notes.js.map