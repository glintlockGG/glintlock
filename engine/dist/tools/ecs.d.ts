export declare function loadComponents(entityId: string): Record<string, Record<string, unknown>>;
export interface GetEntityParams {
    entity_id?: string;
    name?: string;
    entity_type?: string;
}
export declare function getEntity(params: GetEntityParams): {
    entity: {
        id: unknown;
        type: unknown;
        name: unknown;
        created_at: unknown;
        updated_at: unknown;
    };
    components: Record<string, Record<string, unknown>>;
};
export interface UpdateEntityParams {
    entity_id: string;
    component: string;
    operation: "set" | "delta" | "push" | "remove";
    field: string;
    value: unknown;
}
export declare function updateEntity(params: UpdateEntityParams): {
    success: boolean;
    entity_id: string;
    component: "stats" | "health" | "character_info" | "spells" | "position" | "inventory" | "description" | "location_data" | "combat_data";
    field: string;
    old_value: unknown;
    new_value: unknown;
};
export interface CreateEntityParams {
    entity_type: string;
    name: string;
    components?: Record<string, Record<string, unknown>>;
}
export declare function createEntity(params: CreateEntityParams): {
    success: boolean;
    entity_id: string;
    entity: {
        id: string;
        type: string;
        name: string;
    };
    components: Record<string, Record<string, unknown>>;
};
export interface QueryEntitiesParams {
    entity_type?: string;
    location_id?: string;
    filters?: Record<string, unknown>;
    limit?: number;
}
export declare function queryEntities(params: QueryEntitiesParams): {
    count: number;
    entities: {
        entity: {
            id: unknown;
            type: unknown;
            name: unknown;
            created_at: unknown;
            updated_at: unknown;
        };
        components: Record<string, Record<string, unknown>>;
    }[];
};
export interface DeleteEntityParams {
    entity_id: string;
    confirm: boolean;
}
export declare function deleteEntity(params: DeleteEntityParams): {
    success: boolean;
    entity_id: string;
    entity_name: string;
    entity_type: string;
};
//# sourceMappingURL=ecs.d.ts.map