import Entity from "../entity.js";

export default class Space extends Entity {
  entities: unknown[];

  constructor (
    options: ConstructorParameters<typeof Entity>[0],
    rule: Record<string, unknown>,
    id: number
  ) {
    super(options, rule, id);
    this.entities = [];
  }

  placeEntity (entity: unknown, position: "Last" | "First" = "Last") {
    if (position === "Last") {
      this.entities.push(entity);
    } else if (position === "First") {
      this.entities.unshift(entity);
    }
  }

  remove (entity: unknown) {
    this.entities.splice(this.entities.indexOf(entity), 1);
  }

  takeOne (position: "First" = "First") {
    if (position === "First") {
      return this.entities.splice(0, 1)[0];
    }
  }

  isEmpty () {
    return this.entities.length === 0;
  }
}
