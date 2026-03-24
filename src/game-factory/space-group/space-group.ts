import Entity from "../entity.js";

type BankLike = { createEntity: (def: Record<string, unknown>) => unknown };

export default class SpaceGroup extends Entity {
  spaces: unknown[];

  constructor (
    options: ConstructorParameters<typeof Entity>[0] & { bank: BankLike },
    rule: Record<string, unknown>,
    id: number
  ) {
    super(options, rule, id);
    this.spaces = this.makeSpaces(options.bank);
  }

  makeSpaces (bank: BankLike) {
    return Array(this.getSpacesCount()).fill(undefined)
      .map((_, i) => bank.createEntity({ entityType: "Space", index: i }));
  }

  getEmptySpaces () {
    return (this.spaces as { isEmpty: () => boolean }[]).filter((space) => space.isEmpty());
  }

  getSpace (arg: number | [number, number]) {
    if (Array.isArray(arg)) {
      throw new Error("Numeric index only for SpaceGroup#getSpace");
    }
    return this.spaces[arg];
  }

  getEntities (index: number) {
    return (this.getSpace(index) as { entities: unknown[] }).entities;
  }

  placeEntity (index: number, entity: unknown) {
    (this.getSpace(index) as { placeEntity: (e: unknown) => void }).placeEntity(entity);
  }

  getSpacesCount (): number {
    throw new Error("SpaceGroup#getSpacesCount must be implemented by subclass");
  }
}
