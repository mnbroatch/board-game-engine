import Entity from "../entity.js";
import type { RuntimeEntityRule } from "../../types/runtime-entity.js";
import type { EngineEntity, EngineSpaceMethods } from "../../types/runtime-entity.js";

type BankLike = { createEntity: (def: Partial<RuntimeEntityRule>) => EngineEntity };
type EngineSpace = EngineEntity & EngineSpaceMethods;

export default class SpaceGroup extends Entity {
  spaces: EngineSpace[];

  constructor (
    options: ConstructorParameters<typeof Entity>[0] & { bank: BankLike },
    rule: RuntimeEntityRule,
    id: number
  ) {
    super(options, rule, id);
    this.spaces = this.makeSpaces(options.bank);
  }

  makeSpaces (bank: BankLike) {
    return Array(this.getSpacesCount()).fill(undefined)
      .map((_, i) => bank.createEntity({ entityType: "Space", index: i }) as EngineSpace);
  }

  getEmptySpaces () {
    return this.spaces.filter((space) => space.isEmpty());
  }

  getSpace (arg: number | [number, number]) {
    if (Array.isArray(arg)) {
      throw new Error("Numeric index only for SpaceGroup#getSpace");
    }
    return this.spaces[arg];
  }

  getEntities (index: number) {
    return this.getSpace(index).entities;
  }

  placeEntity (index: number, entity: EngineEntity) {
    this.getSpace(index).placeEntity(entity);
  }

  getSpacesCount (): number {
    throw new Error("SpaceGroup#getSpacesCount must be implemented by subclass");
  }
}
