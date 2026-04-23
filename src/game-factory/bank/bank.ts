import find from "lodash/find.js";
import filter from "lodash/filter.js";
import checkConditions from "../../utils/check-conditions.js";
import resolveProperties from "../../utils/resolve-properties.js";
import type { RuleWithConditions } from "../../types/rule-with-conditions.js";
import type { EntityDefinition } from "../../types/entity-definition.js";
import type { EngineEntity, RuntimeEntityRule } from "../../types/runtime-entity.js";
import { registry } from "../../registry.js";
import BankSlot from "./bank-slot.js";
import type { BgioReadonlyState, BgioResolveState } from "../../utils/bgio-resolve-types.js";
import type { MoveArgumentsState, ResolutionContext } from "../../types/resolution-context.js";

type EngineEntityWithChildren = EngineEntity & {
  entities?: EngineEntity[];
  spaces?: EngineEntity[];
};

type RemovableParent = EngineEntity & { remove: (e: EngineEntity) => void };

function isRemovableParent (value: EngineEntity | undefined): value is RemovableParent {
  return Boolean(value && typeof (value as { remove?: unknown }).remove === "function");
}

class Bank {
  currentEntityId: number;
  tracker: Record<number, EngineEntity>;
  slots: InstanceType<typeof BankSlot>[];

  constructor (entityRules: EntityDefinition[]) {
    this.currentEntityId = 0;
    this.tracker = {};
    this.slots = entityRules.map((rule) => new BankSlot(rule, this));
  }

  createEntity (definition: Partial<RuntimeEntityRule> = {}, options?: MoveArgumentsState): EngineEntity {
    const Ctor = registry[(definition.entityType || "Entity") as keyof typeof registry] as new (
      a: unknown,
      b: Partial<RuntimeEntityRule>,
      c: number
    ) => EngineEntity;
    const entity = new Ctor(
      {
        bank: this,
        fromBank: true,
        ...options,
      },
      definition,
      this.currentEntityId++
    );
    this.track(entity);
    return entity;
  }

  /**
   * Create a real entity instance without tracking it in this bank.
   * Used for evaluating slot-matching conditions against an example entity.
   */
  createUntrackedEntity (
    definition: Partial<RuntimeEntityRule>,
    options: MoveArgumentsState,
    id: number
  ): EngineEntity {
    const Ctor = registry[(definition.entityType || "Entity") as keyof typeof registry] as new (
      a: unknown,
      b: Partial<RuntimeEntityRule>,
      c: number
    ) => EngineEntity;
    return new Ctor(
      {
        bank: this,
        fromBank: true,
        ...options,
      },
      definition,
      id
    );
  }

  createSlotExampleEntity (
    bgioArguments: BgioReadonlyState,
    slot: InstanceType<typeof BankSlot>,
    context: ResolutionContext
  ): EngineEntity {
    // Use a throwaway bank for any nested entities created by constructors (e.g. Grid -> Spaces).
    let nextTempId = -1;
    const ephemeralBank = {
      createEntity: (def: Partial<RuntimeEntityRule>) =>
        this.createUntrackedEntity(def, { bank: ephemeralBank }, nextTempId--),
    };

    const resolvedState = slot.rule.state !== undefined
      ? resolveProperties(bgioArguments, slot.rule.state, context) as NonNullable<EngineEntity["state"]>
      : undefined;

    const resolvedRule: Partial<RuntimeEntityRule> = {
      ...slot.rule,
      ...(resolvedState === undefined ? {} : { state: resolvedState }),
    };

    return this.createUntrackedEntity(
      resolvedRule,
      { bank: ephemeralBank },
      nextTempId--
    );
  }

  track (entity: EngineEntity) {
    this.tracker[entity.entityId] = entity;
  }

  locate (entityId: number): EngineEntity {
    const entity = this.tracker[entityId];
    if (!entity) {
      throw new Error(`Bank.locate: entity ${entityId} not found`);
    }
    return entity;
  }

  findAll (bgioArguments: BgioReadonlyState, rule: RuleWithConditions, context: ResolutionContext) {
    if (!rule.conditions) {
      throw new Error(`Cannot find entity with no conditions. Rule: ${JSON.stringify(rule)}`);
    }
    return filter(
      Object.values(this.tracker),
      (entity) => checkConditions(
        bgioArguments as BgioResolveState,
        rule.conditions,
        { target: entity },
        context
      ).conditionsAreMet
    );
  }

  findOne (bgioArguments: BgioReadonlyState, rule: RuleWithConditions, context: ResolutionContext) {
    return this.findAll(bgioArguments, rule, context)[0];
  }

  find (
    bgioArguments: BgioReadonlyState,
    rule: RuleWithConditions & { matchMultiple?: boolean },
    context: ResolutionContext
  ): EngineEntity | EngineEntity[] | undefined {
    return rule.matchMultiple
      ? this.findAll(bgioArguments, rule, context)
      : this.findOne(bgioArguments, rule, context);
  }

  findParent (entity: unknown): EngineEntity | undefined {
    if (!entity || typeof entity !== "object") return undefined;
    const child = entity as EngineEntity;
    return find(this.tracker, (ent) => {
      const ewc = ent as EngineEntityWithChildren;
      return Boolean(
        ewc.entities?.includes(child)
          || ewc.spaces?.includes(child)
      );
    });
  }

  getOne (bgioArguments: BgioReadonlyState, rule: RuleWithConditions & { state?: unknown }, context: ResolutionContext) {
    const slot = this.getSlot(bgioArguments, rule, context);
    if (!slot) {
      console.error(`No matching slot for ${JSON.stringify(rule)}`);
      throw new Error("Bank.getOne: no matching slot");
    }
    return slot.getOne(bgioArguments, { state: rule.state }, context);
  }

  getMultiple (bgioArguments: BgioReadonlyState, rule: RuleWithConditions & { state?: unknown }, count: number, context: ResolutionContext) {
    const slots = this.getSlots(bgioArguments, rule, context);
    if (!slots.length) {
      console.error(`No matching slots for ${JSON.stringify(rule)}`);
    }
    return slots.reduce<EngineEntity[]>((acc, slot) => [
      ...acc,
      ...slot.getMultiple(bgioArguments, count, { state: rule.state }, context),
    ], []);
  }

  getSlot (bgioArguments: BgioReadonlyState, rule: RuleWithConditions, context: ResolutionContext) {
    return this.slots.find((slot) => {
      const example = this.createSlotExampleEntity(bgioArguments, slot, context);
      return checkConditions(
        bgioArguments as BgioResolveState,
        rule.conditions,
        { target: example },
        context
      ).conditionsAreMet;
    });
  }

  getSlots (bgioArguments: BgioReadonlyState, rule: RuleWithConditions, context: ResolutionContext) {
    return this.slots.filter((slot) => {
      const example = this.createSlotExampleEntity(bgioArguments, slot, context);
      return checkConditions(
        bgioArguments as BgioResolveState,
        rule.conditions,
        { target: example },
        context
      ).conditionsAreMet;
    });
  }

  returnToBank (bgioArguments: BgioReadonlyState, entity: EngineEntity) {
    const parent = this.findParent(entity);
    if (!isRemovableParent(parent)) {
      throw new Error("Bank.returnToBank: could not find removable parent for entity");
    }
    parent.remove(entity);

    const slot = this.getSlot(bgioArguments, entity.rule, {});
    if (!slot) {
      throw new Error("Bank.returnToBank: no matching slot for entity rule");
    }
    slot.returnToBank(entity);

    delete this.tracker[entity.entityId];
  }
}

export default Bank;
