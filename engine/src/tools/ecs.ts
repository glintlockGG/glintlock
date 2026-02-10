import db from "../db.js";

type SqlValue = null | number | bigint | string;

// --- Static whitelists for SQL injection prevention ---

const COMPONENT_TABLES = [
  "stats", "health", "character_info", "spells", "position",
  "inventory", "description", "location_data", "combat_data",
] as const;

type ComponentTable = (typeof COMPONENT_TABLES)[number];

const COMPONENT_FIELDS: Record<ComponentTable, readonly string[]> = {
  stats: ["str", "dex", "con", "int", "wis", "cha"],
  health: ["current", "max"],
  character_info: ["ancestry", "class", "level", "xp", "alignment", "title", "background", "ac", "languages", "talents", "hit_die", "weapon_proficiencies", "armor_proficiencies", "class_features", "ancestry_traits"],
  spells: ["known", "lost", "penance"],
  position: ["location_id", "sub_location"],
  inventory: ["items", "gold", "silver", "copper", "gear_slots_used", "gear_slots_max"],
  description: ["text", "discovered"],
  location_data: ["danger_level", "light", "connections"],
  combat_data: ["ac", "attacks", "movement", "special", "morale_broken", "is_undead"],
};

const JSON_COLUMNS: Record<string, Set<string>> = {
  character_info: new Set(["languages", "talents", "weapon_proficiencies", "armor_proficiencies", "class_features", "ancestry_traits"]),
  spells: new Set(["known", "lost", "penance"]),
  inventory: new Set(["items"]),
  location_data: new Set(["connections"]),
  combat_data: new Set(["attacks", "special"]),
};

function isValidComponent(name: string): name is ComponentTable {
  return (COMPONENT_TABLES as readonly string[]).includes(name);
}

function isValidField(component: ComponentTable, field: string): boolean {
  return COMPONENT_FIELDS[component].includes(field);
}

function isJsonColumn(component: string, field: string): boolean {
  return JSON_COLUMNS[component]?.has(field) ?? false;
}

function parseJsonField(value: unknown): unknown {
  if (typeof value === "string") {
    try { return JSON.parse(value); } catch { return value; }
  }
  return value;
}

// --- Defaults for NOT NULL columns without SQL defaults ---
// These tables need explicit values when inserting a bare row
const COMPONENT_NOT_NULL_DEFAULTS: Partial<Record<ComponentTable, Record<string, SqlValue>>> = {
  health: { current: 1, max: 1 },
  combat_data: { ac: 10 },
  description: { text: "" },
};

// --- Error message helpers ---

function buildFieldError(field: string, component: ComponentTable): string {
  const validFields = COMPONENT_FIELDS[component];
  let msg = `Invalid field "${field}" for component "${component}". Valid fields: ${validFields.join(", ")}`;

  // Fuzzy suggestion: check if field is a substring of any valid field or vice versa
  const lower = field.toLowerCase();
  const suggestions = validFields.filter(f =>
    f.includes(lower) || lower.includes(f) || levenshteinClose(lower, f)
  );
  if (suggestions.length > 0) {
    msg += `. Did you mean: ${suggestions.map(s => `"${s}"`).join(", ")}?`;
  }

  // Check if field exists in a different component
  for (const [otherComp, otherFields] of Object.entries(COMPONENT_FIELDS)) {
    if (otherComp === component) continue;
    if ((otherFields as readonly string[]).includes(lower)) {
      msg += ` Note: "${field}" exists in the "${otherComp}" component.`;
      break;
    }
  }

  return msg;
}

function levenshteinClose(a: string, b: string): boolean {
  // Simple check: same length ±1 and share >60% characters
  if (Math.abs(a.length - b.length) > 2) return false;
  const setA = new Set(a);
  const setB = new Set(b);
  let shared = 0;
  for (const c of setA) if (setB.has(c)) shared++;
  return shared / Math.max(setA.size, setB.size) > 0.6;
}

function upsertComponentRow(component: ComponentTable, entityId: string): void {
  const defaults = COMPONENT_NOT_NULL_DEFAULTS[component];
  if (defaults) {
    const cols = ["entity_id", ...Object.keys(defaults)];
    const placeholders = cols.map(() => "?").join(", ");
    const vals: SqlValue[] = [entityId, ...Object.values(defaults)];
    db.prepare(`INSERT INTO ${component} (${cols.join(", ")}) VALUES (${placeholders})`).run(...vals);
  } else {
    db.prepare(`INSERT INTO ${component} (entity_id) VALUES (?)`).run(entityId);
  }
}

// --- Load all components for an entity ---

export function loadComponents(entityId: string): Record<string, Record<string, unknown>> {
  const components: Record<string, Record<string, unknown>> = {};

  for (const table of COMPONENT_TABLES) {
    const row = db.prepare(`SELECT * FROM ${table} WHERE entity_id = ?`).get(entityId) as Record<string, unknown> | undefined;
    if (!row) continue;

    const comp: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(row)) {
      if (key === "entity_id") continue;
      comp[key] = isJsonColumn(table, key) ? parseJsonField(val) : val;
    }
    components[table] = comp;
  }

  return components;
}

// --- get_entity ---

export interface GetEntityParams {
  entity_id?: string;
  name?: string;
  entity_type?: string;
}

export function getEntity(params: GetEntityParams) {
  const { entity_id, name, entity_type } = params;

  if (!entity_id && !name && !entity_type) {
    throw new Error("At least one of entity_id, name, or entity_type is required.");
  }

  const conditions: string[] = [];
  const values: SqlValue[] = [];

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
  const entity = db.prepare(sql).get(...values) as Record<string, unknown> | undefined;

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
    components: loadComponents(entity.id as string),
  };
}

// --- update_entity ---

export interface UpdateEntityParams {
  entity_id: string;
  component: string;
  operation: "set" | "delta" | "push" | "remove";
  field: string;
  value: unknown;
}

export function updateEntity(params: UpdateEntityParams) {
  const { entity_id, component, operation, value } = params;
  // Normalize stat fields to lowercase (STR → str, DEX → dex, etc.)
  let { field } = params;
  if (component === "stats") {
    field = field.toLowerCase();
  }

  if (!isValidComponent(component)) {
    throw new Error(`Invalid component: "${component}". Valid components: ${COMPONENT_TABLES.join(", ")}`);
  }
  if (!isValidField(component, field)) {
    throw new Error(buildFieldError(field, component));
  }

  // Verify entity exists
  const entity = db.prepare("SELECT id FROM entities WHERE id = ?").get(entity_id);
  if (!entity) {
    throw new Error(`Entity "${entity_id}" does not exist.`);
  }

  const isJson = isJsonColumn(component, field);

  // Read current value — auto-create component row if missing (upsert)
  let currentRow = db.prepare(`SELECT ${field} FROM ${component} WHERE entity_id = ?`).get(entity_id) as Record<string, unknown> | undefined;
  if (!currentRow) {
    upsertComponentRow(component, entity_id);
    currentRow = db.prepare(`SELECT ${field} FROM ${component} WHERE entity_id = ?`).get(entity_id) as Record<string, unknown> | undefined;
    if (!currentRow) {
      throw new Error(`Failed to create ${component} component for entity "${entity_id}".`);
    }
  }

  const oldRaw = currentRow[field];
  const oldValue = isJson ? parseJsonField(oldRaw) : oldRaw;
  let newValue: unknown;

  switch (operation) {
    case "set": {
      newValue = value;
      const writeVal = (isJson ? JSON.stringify(value) : value) as SqlValue;
      const info = db.prepare(`UPDATE ${component} SET ${field} = ? WHERE entity_id = ?`).run(writeVal, entity_id);
      if (info.changes === 0) throw new Error("Update failed — no rows changed.");
      break;
    }
    case "delta": {
      if (typeof oldValue !== "number" || typeof value !== "number") {
        throw new Error(`Delta requires numeric values. Current: ${typeof oldValue}, provided: ${typeof value}`);
      }
      newValue = oldValue + value;
      db.prepare(`UPDATE ${component} SET ${field} = ? WHERE entity_id = ?`).run(newValue as SqlValue, entity_id);
      break;
    }
    case "push": {
      if (!isJson) throw new Error(`Push only works on JSON array fields. "${field}" is not a JSON column.`);
      const arr = Array.isArray(oldValue) ? [...oldValue] : [];
      arr.push(value);
      newValue = arr;
      db.prepare(`UPDATE ${component} SET ${field} = ? WHERE entity_id = ?`).run(JSON.stringify(arr), entity_id);
      break;
    }
    case "remove": {
      if (!isJson) throw new Error(`Remove only works on JSON array fields. "${field}" is not a JSON column.`);
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

// --- create_entity ---

export interface CreateEntityParams {
  entity_type: string;
  name: string;
  components?: Record<string, Record<string, unknown>>;
}

export function createEntity(params: CreateEntityParams) {
  const { entity_type, name, components } = params;

  // Generate ID
  const base = `${entity_type}_${name.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "")}`;
  let entityId = base;
  let suffix = 1;
  while (db.prepare("SELECT id FROM entities WHERE id = ?").get(entityId)) {
    suffix++;
    entityId = `${base}_${suffix}`;
  }

  const insertEntity = db.prepare(
    "INSERT INTO entities (id, type, name) VALUES (?, ?, ?)"
  );

  db.exec("BEGIN");
  try {
    insertEntity.run(entityId, entity_type, name);

    if (components) {
      for (const [compName, rawFields] of Object.entries(components)) {
        if (!isValidComponent(compName)) {
          throw new Error(`Invalid component: "${compName}". Valid components: ${COMPONENT_TABLES.join(", ")}`);
        }

        // Normalize stat fields to lowercase (STR → str, DEX → dex, etc.)
        const fields = compName === "stats"
          ? Object.fromEntries(Object.entries(rawFields).map(([k, v]) => [k.toLowerCase(), v]))
          : rawFields;

        // Validate all field names
        for (const fieldName of Object.keys(fields)) {
          if (!isValidField(compName, fieldName)) {
            throw new Error(buildFieldError(fieldName, compName));
          }
        }

        const columns = ["entity_id", ...Object.keys(fields)];
        const placeholders = columns.map(() => "?").join(", ");
        const values: SqlValue[] = [
          entityId,
          ...Object.entries(fields).map(([f, v]) =>
            (isJsonColumn(compName, f) ? JSON.stringify(v) : v) as SqlValue
          ),
        ];

        db.prepare(
          `INSERT INTO ${compName} (${columns.join(", ")}) VALUES (${placeholders})`
        ).run(...values);
      }
    }

    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }

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

// --- query_entities ---

export interface QueryEntitiesParams {
  entity_type?: string;
  location_id?: string;
  filters?: Record<string, unknown>;
  limit?: number;
}

export function queryEntities(params: QueryEntitiesParams) {
  const { entity_type, location_id, filters, limit = 20 } = params;

  const conditions: string[] = [];
  const values: SqlValue[] = [];
  const joins: Set<string> = new Set();

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
        throw new Error(`Invalid component in filter: "${comp}". Valid components: ${COMPONENT_TABLES.join(", ")}`);
      }
      if (!isValidField(comp, field)) {
        throw new Error(buildFieldError(field, comp));
      }

      joins.add(comp);
      conditions.push(`${comp}.${field} = ?`);
      const writeVal = (isJsonColumn(comp, field) ? JSON.stringify(filterVal) : filterVal) as SqlValue;
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

  const rows = db.prepare(sql).all(...values) as Array<Record<string, unknown>>;

  const entities = rows.map(row => ({
    entity: {
      id: row.id,
      type: row.type,
      name: row.name,
      created_at: row.created_at,
      updated_at: row.updated_at,
    },
    components: loadComponents(row.id as string),
  }));

  return { count: entities.length, entities };
}

// --- delete_entity ---

export interface DeleteEntityParams {
  entity_id: string;
  confirm: boolean;
}

export function deleteEntity(params: DeleteEntityParams) {
  const { entity_id, confirm } = params;

  if (!confirm) {
    throw new Error("Must set confirm: true to delete. This is permanent.");
  }

  const entity = db.prepare("SELECT id, type, name FROM entities WHERE id = ?")
    .get(entity_id) as { id: string; type: string; name: string } | undefined;

  if (!entity) {
    throw new Error(`Entity "${entity_id}" not found.`);
  }

  // CASCADE deletes all component rows and attached notes
  db.prepare("DELETE FROM entities WHERE id = ?").run(entity_id);

  return { success: true, entity_id, entity_name: entity.name, entity_type: entity.type };
}
