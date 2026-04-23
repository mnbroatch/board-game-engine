import Entity from "../entity.js";
import type { RuntimeEntityRule } from "../../types/runtime-entity.js";
import type { EngineEntity, EngineSpaceMethods } from "../../types/runtime-entity.js";
type BankLike = {
    createEntity: (def: Partial<RuntimeEntityRule>) => EngineEntity;
};
type EngineSpace = EngineEntity & EngineSpaceMethods;
export default class SpaceGroup extends Entity {
    spaces: EngineSpace[];
    constructor(options: ConstructorParameters<typeof Entity>[0] & {
        bank: BankLike;
    }, rule: RuntimeEntityRule, id: number);
    makeSpaces(bank: BankLike): EngineSpace[];
    getEmptySpaces(): EngineSpace[];
    getSpace(arg: number | [number, number]): EngineSpace;
    getEntities(index: number): EngineEntity<import("../../index.js").DefaultEngineEntityAttributes, import("../../index.js").DefaultEngineEntityState>[];
    placeEntity(index: number, entity: EngineEntity): void;
    getSpacesCount(): number;
}
export {};
//# sourceMappingURL=space-group.d.ts.map