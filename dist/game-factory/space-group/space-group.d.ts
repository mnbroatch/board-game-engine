import Entity from "../entity.js";
type BankLike = {
    createEntity: (def: Record<string, unknown>) => unknown;
};
export default class SpaceGroup extends Entity {
    spaces: unknown[];
    constructor(options: ConstructorParameters<typeof Entity>[0] & {
        bank: BankLike;
    }, rule: Record<string, unknown>, id: number);
    makeSpaces(bank: BankLike): unknown[];
    getEmptySpaces(): {
        isEmpty: () => boolean;
    }[];
    getSpace(arg: number | [number, number]): unknown;
    getEntities(index: number): unknown[];
    placeEntity(index: number, entity: unknown): void;
    getSpacesCount(): number;
}
export {};
//# sourceMappingURL=space-group.d.ts.map