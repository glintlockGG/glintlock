import db from "../db.js";
// --- Static whitelists for SQL injection prevention ---
const COMPONENT_TABLES = [
    "stats", "health", "character_info", "spells", "position",
    "inventory", "description", "location_data", "combat_data",
];
const COMPONENT_FIELDS = {
    stats: ["str", "dex", "con", "int", "wis", "cha"],
    health: ["current", "max"],
    character_info: ["ancestry", "class", "level", "xp", "alignment", "title", "background", "ac", "languages"],
    spells: ["known", "lost", "penance"],
    position: ["location_id", "sub_location"],
    inventory: ["items", "gold", "silver", "copper", "gear_slots_used", "gear_slots_max"],
    description: ["text", "discovered"],
    location_data: ["danger_level", "light", "connections"],
    combat_data: ["ac", "attacks", "movement", "special", "morale_broken", "is_undead"],
};
const JSON_COLUMNS = {
    character_info: new Set(["languages"]),
    spells: new Set(["known", "lost", "penance"]),
    inventory: new Set(["items"]),
    location_data: new Set(["connections"]),
    combat_data: new Set(["attacks", "special"]),
};
function isValidComponent(name) {
    return COMPONENT_TABLES.includes(name);
}
function isValidField(component, field) {
    return COMPONENT_FIELDS[component].includes(field);
}
function isJsonColumn(component, field) {
    return JSON_COLUMNS[component]?.has(field) ?? false;
}
function parseJsonField(value) {
    if (typeof value === "string") {
        try {
            return JSON.parse(value);
        }
        catch {
            return value;
        }
    }
    return value;
}
// --- Load all components for an entity ---
export function loadComponents(entityId) {
    const components = {};
    for (const table of COMPONENT_TABLES) {
        const row = db.prepare(`SELECT * FROM ${table} WHERE entity_id = ?`).get(entityId);
        if (!row)
            continue;
        const comp = {};
        for (const [key, val] of Object.entries(row)) {
            if (key === "entity_id")
                continue;
            comp[key] = isJsonColumn(table, key) ? parseJsonField(val) : val;
        }
        components[table] = comp;
    }
    return components;
}
export function getEntity(params) {
    const { entity_id, name, entity_type } = params;
    if (!entity_id && !name && !entity_type) {
        throw new Error("At least one of entity_id, name, or entity_type is required.");
    }
    const conditions = [];
    const values = [];
    if (entity_id) {
        conditions.push("id = ?");
        values.push(entity_id);
    }
    if (name) {
        conditions.push("name LIKE ?");
        values.push(`%${name}%`);
    }
    if (entity_type) {
        conditions.push("type = ?");
        values.push(entity_type);
    }
    const sql = `SELECT * FROM entities WHERE ${conditions.join(" AND ")} LIMIT 1`;
    const entity = db.prepare(sql).get(...values);
    if (!entity) {
        throw new Error(`No entity found matching: ${JSON.stringify(params)}`);
    }
    return {
        entity: {
            id: entity.id,
            type: entity.type,
            name: entity.name,
            created_at: entity.created_at,
            updated_at: entity.updated_at,
        },
        components: loadComponents(entity.id),
    };
}
export function updateEntity(params) {
    const { entity_id, component, operation, field, value } = params;
    if (!isValidComponent(component)) {
        throw new Error(`Invalid component: "${component}". Valid: ${COMPONENT_TABLES.join(", ")}`);
    }
    if (!isValidField(component, field)) {
        throw new Error(`Invalid field "${field}" for component "${component}". Valid: ${COMPONENT_FIELDS[component].join(", ")}`);
    }
    // Verify entity exists
    const entity = db.prepare("SELECT id FROM entities WHERE id = ?").get(entity_id);
    if (!entity) {
        throw new Error(`Entity "${entity_id}" does not exist.`);
    }
    const isJson = isJsonColumn(component, field);
    // Read current value
    const currentRow = db.prepare(`SELECT ${field} FROM ${component} WHERE entity_id = ?`).get(entity_id);
    if (!currentRow) {
        throw new Error(`Entity "${entity_id}" has no ${component} component. Create it first with create_entity or add the component row.`);
    }
    const oldRaw = currentRow[field];
    const oldValue = isJson ? parseJsonField(oldRaw) : oldRaw;
    let newValue;
    switch (operation) {
        case "set": {
            newValue = value;
            const writeVal = isJson ? JSON.stringify(value) : value;
            const info = db.prepare(`UPDATE ${component} SET ${field} = ? WHERE entity_id = ?`).run(writeVal, entity_id);
            if (info.changes === 0)
                throw new Error("Update failed — no rows changed.");
            break;
        }
        case "delta": {
            if (typeof oldValue !== "number" || typeof value !== "number") {
                throw new Error(`Delta requires numeric values. Current: ${typeof oldValue}, provided: ${typeof value}`);
            }
            newValue = oldValue + value;
            db.prepare(`UPDATE ${component} SET ${field} = ? WHERE entity_id = ?`).run(newValue, entity_id);
            break;
        }
        case "push": {
            if (!isJson)
                throw new Error(`Push only works on JSON array fields. "${field}" is not a JSON column.`);
            const arr = Array.isArray(oldValue) ? [...oldValue] : [];
            arr.push(value);
            newValue = arr;
            db.prepare(`UPDATE ${component} SET ${field} = ? WHERE entity_id = ?`).run(JSON.stringify(arr), entity_id);
            break;
        }
        case "remove": {
            if (!isJson)
                throw new Error(`Remove only works on JSON array fields. "${field}" is not a JSON column.`);
            const arr2 = Array.isArray(oldValue) ? [...oldValue] : [];
            const serialized = JSON.stringify(value);
            newValue = arr2.filter(item => JSON.stringify(item) !== serialized);
            db.prepare(`UPDATE ${component} SET ${field} = ? WHERE entity_id = ?`).run(JSON.stringify(newValue), entity_id);
            break;
        }
    }
    // Update entity timestamp
    db.prepare("UPDATE entities SET updated_at = datetime('now') WHERE id = ?").run(entity_id);
    return {
        success: true,
        entity_id,
        component,
        field,
        old_value: oldValue,
        new_value: newValue,
    };
}
export function createEntity(params) {
    const { entity_type, name, components } = params;
    // Generate ID
    const base = `${entity_type}_${name.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "")}`;
    let entityId = base;
    let suffix = 1;
    while (db.prepare("SELECT id FROM entities WHERE id = ?").get(entityId)) {
        suffix++;
        entityId = `${base}_${suffix}`;
    }
    const insertEntity = db.prepare("INSERT INTO entities (id, type, name) VALUES (?, ?, ?)");
    const createTx = db.transaction(() => {
        insertEntity.run(entityId, entity_type, name);
        if (components) {
            for (const [compName, fields] of Object.entries(components)) {
                if (!isValidComponent(compName)) {
                    throw new Error(`Invalid component: "${compName}". Valid: ${COMPONENT_TABLES.join(", ")}`);
                }
                // Validate all field names
                for (const fieldName of Object.keys(fields)) {
                    if (!isValidField(compName, fieldName)) {
                        throw new Error(`Invalid field "${fieldName}" for component "${compName}". Valid: ${COMPONENT_FIELDS[compName].join(", ")}`);
                    }
                }
                const columns = ["entity_id", ...Object.keys(fields)];
                const placeholders = columns.map(() => "?").join(", ");
                const values = [
                    entityId,
                    ...Object.entries(fields).map(([f, v]) => isJsonColumn(compName, f) ? JSON.stringify(v) : v),
                ];
                db.prepare(`INSERT INTO ${compName} (${columns.join(", ")}) VALUES (${placeholders})`).run(...values);
            }
        }
    });
    createTx();
    return {
        success: true,
        entity_id: entityId,
        entity: {
            id: entityId,
            type: entity_type,
            name,
        },
        components: loadComponents(entityId),
    };
}
export function queryEntities(params) {
    const { entity_type, location_id, filters, limit = 20 } = params;
    const conditions = [];
    const values = [];
    const joins = new Set();
    if (entity_type) {
        conditions.push("e.type = ?");
        values.push(entity_type);
    }
    if (location_id) {
        joins.add("position");
        conditions.push("position.location_id = ?");
        values.push(location_id);
    }
    if (filters) {
        for (const [dotKey, filterVal] of Object.entries(filters)) {
            const [comp, field] = dotKey.split(".");
            if (!comp || !field) {
                throw new Error(`Invalid filter key "${dotKey}". Use "component.field" format.`);
            }
            if (!isValidComponent(comp)) {
                throw new Error(`Invalid component in filter: "${comp}".`);
            }
            if (!isValidField(comp, field)) {
                throw new Error(`Invalid field "${field}" for component "${comp}".`);
            }
            joins.add(comp);
            conditions.push(`${comp}.${field} = ?`);
            const writeVal = isJsonColumn(comp, field) ? JSON.stringify(filterVal) : filterVal;
            values.push(writeVal);
        }
    }
    let sql = "SELECT e.* FROM entities e";
    for (const table of joins) {
        sql += ` JOIN ${table} ON ${table}.entity_id = e.id`;
    }
    if (conditions.length > 0) {
        sql += ` WHERE ${conditions.join(" AND ")}`;
    }
    sql += ` LIMIT ?`;
    values.push(limit);
    const rows = db.prepare(sql).all(...values);
    const entities = rows.map(row => ({
        entity: {
            id: row.id,
            type: row.type,
            name: row.name,
            created_at: row.created_at,
            updated_at: row.updated_at,
        },
        components: loadComponents(row.id),
    }));
    return { count: entities.length, entities };
}
//# sourceMappingURL=ecs.js.map