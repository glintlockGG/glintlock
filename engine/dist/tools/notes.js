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
export function queryNotes(params) {
    const { entity_id, tag, text_search, limit = 20, since } = params;
    const conditions = [];
    const values = [];
    if (entity_id) {
        conditions.push("entity_id = ?");
        values.push(entity_id);
    }
    if (tag) {
        conditions.push("tag = ?");
        values.push(tag);
    }
    if (text_search) {
        conditions.push("text LIKE ?");
        values.push(`%${text_search}%`);
    }
    if (since) {
        conditions.push("created_at > ?");
        values.push(since);
    }
    let sql = "SELECT * FROM notes";
    if (conditions.length > 0)
        sql += ` WHERE ${conditions.join(" AND ")}`;
    sql += " ORDER BY created_at DESC LIMIT ?";
    values.push(limit);
    const notes = db.prepare(sql).all(...values);
    return { count: notes.length, notes };
}
//# sourceMappingURL=notes.js.map