import Entity from "../entity.js";
export default class Space extends Entity {
    entities: unknown[];
    constructor(options: ConstructorParameters<typeof Entity>[0], rule: Record<string, unknown>, id: number);
    placeEntity(entity: unknown, position?: "Last" | "First"): void;
    remove(entity: unknown): void;
    takeOne(position?: "First"): unknown;
    isEmpty(): boolean;
}
//# sourceMappingURL=space.d.ts.map