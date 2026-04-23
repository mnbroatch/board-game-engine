import Entity from "../entity.js";
import type { RuntimeEntityRule } from "../../types/runtime-entity.js";
import type { EngineEntity } from "../../types/runtime-entity.js";

export default class Space extends Entity {
  entities: EngineEntity[];

  constructor (
    options: ConstructorParameters<typeof Entity>[0],
    rule: RuntimeEntityRule,
    id: number
  ) {
    super(options, rule, id);
    this.entities = [];
  }

  placeEntity (entity: EngineEntity, position: "Last" | "First" = "Last") {
    if (position === "Last") {
      this.entities.push(entity);
    } else if (position === "First") {
      this.entities.unshift(entity);
    }
  }

  remove (entity: EngineEntity) {
    this.entities.splice(this.entities.indexOf(entity), 1);
  }

  takeOne (position: "First" = "First"): EngineEntity | undefined {
    if (position === "First") {
      return this.entities.splice(0, 1)[0];
    }
  }

  isEmpty () {
    return this.entities.length === 0;
  }
}
