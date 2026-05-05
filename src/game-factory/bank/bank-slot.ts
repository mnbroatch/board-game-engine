import resolveProperties from "../../utils/resolve-properties.js";
import type { BgioReadonlyState } from "../../utils/bgio-resolve-types.js";
import type { EntityDefinition } from "../../types/entity-definition.js";
import type { EngineEntity, RuntimeEntityRule } from "../../types/runtime-entity.js";
import type { ResolutionContext } from "../../types/resolution-context.js";

class BankSlot {
  bank: { createEntity: (rule: Partial<RuntimeEntityRule>) => EngineEntity };
  rule: EntityDefinition & { count?: number | string; name?: string };
  pool: EngineEntity[];
  remaining: number;

  constructor (rule: EntityDefinition & { count?: number | string; name?: string }, bank: BankSlot["bank"]) {
    this.bank = bank;
    this.rule = rule;
    this.pool = [];
    const rawCount = rule.count as unknown;
    // NOTE: `expandGameRules` runs `transformJSON`, which round-trips through `JSON.stringify`.
    // JSON cannot represent `Infinity`, so numeric `Infinity` becomes `null` on the rule object.
    // Treat that as infinite inventory for bank slots.
    if (rawCount === "Infinity" || rawCount === null) {
      this.remaining = Infinity;
    } else if (rawCount === undefined) {
      this.remaining = 1;
    } else {
      const n = typeof rawCount === "number" ? rawCount : Number(rawCount);
      // Guard against bad authoring input (e.g. "0" or non-numeric strings) creating a slot
      // that can never produce an entity (which breaks setup in surprising ways).
      this.remaining = Number.isFinite(n) && n > 0 ? n : 1;
    }
  }

  getOne (bgioArguments: BgioReadonlyState, options: { state?: unknown }, context: ResolutionContext) {
    return this.getMultiple(bgioArguments, 1, options, context)[0];
  }

  getMultiple (
    bgioArguments: BgioReadonlyState,
    count: number = Infinity,
    options: { state?: unknown } = {},
    context: ResolutionContext = {}
  ) {
    const toReturn: EngineEntity[] = [];

    if (this.remaining === Infinity && count === Infinity) {
      throw new Error(`Cannot get infinite pieces from slot with infinite remaining: ${this.rule.name}`);
    }

    if (count !== Infinity && count > this.remaining) {
      throw new Error(`Requested ${count} pieces but only ${this.remaining} available in slot: ${this.rule.name}`);
    }

    const actualCount = count === Infinity ? this.remaining : count;

    if (this.remaining !== Infinity) {
      this.remaining -= actualCount;
    }

    const fromPool = Math.min(actualCount, this.pool.length);
    toReturn.push(...this.pool.splice(0, fromPool));

    const remainder = actualCount - fromPool;
    if (remainder > 0) {
      toReturn.push(
        ...Array.from(new Array(remainder)).map(() =>
          this.bank.createEntity(this.rule)
        )
      );
    }

    if (options.state) {
      const newState = resolveProperties(bgioArguments, options.state, context);
      toReturn.forEach((entity) => {
        entity.state = {
          ...entity.state,
          ...(newState as NonNullable<EngineEntity["state"]>),
        };
      });
    }

    return toReturn;
  }

  returnToBank (entity: EngineEntity) {
    if (entity.rule.state) {
      entity.state = { ...entity.rule.state };
    } else {
      delete entity.state;
    }
    if (this.remaining !== undefined) {
      this.remaining += 1;
    }
    this.pool.push(entity);
  }
}

export default BankSlot;
