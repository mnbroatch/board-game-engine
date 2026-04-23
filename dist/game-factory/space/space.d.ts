import Entity from "../entity.js";
import type { RuntimeEntityRule } from "../../types/runtime-entity.js";
import type { EngineEntity } from "../../types/runtime-entity.js";
export default class Space extends Entity {
    entities: EngineEntity[];
    constructor(options: ConstructorParameters<typeof Entity>[0], rule: RuntimeEntityRule, id: number);
    placeEntity(entity: EngineEntity, position?: "Last" | "First"): void;
    remove(entity: EngineEntity): void;
    takeOne(position?: "First"): EngineEntity | undefined;
    isEmpty(): boolean;
}
//# sourceMappingURL=space.d.ts.map