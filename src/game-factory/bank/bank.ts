import find from "lodash/find.js";
import filter from "lodash/filter.js";
import checkConditions from "../../utils/check-conditions.js";
import type { RuleWithConditions } from "../../types/rule-with-conditions.js";
import { registry } from "../../registry.js";
import BankSlot from "./bank-slot.js";
import type { BgioResolveState } from "../../utils/bgio-resolve-types.js";

class Bank {
  currentEntityId: number;
  tracker: Record<number, unknown>;
  slots: InstanceType<typeof BankSlot>[];

  constructor (entityRules: Record<string, unknown>[]) {
    this.currentEntityId = 0;
    this.tracker = {};
    this.slots = entityRules.map((rule) => new BankSlot(rule, this));
  }

  createEntity (definition: Record<string, unknown> = {}, options?: Record<string, unknown>) {
    const Ctor = registry[(definition.entityType || "Entity") as keyof typeof registry] as new (
      a: unknown,
      b: Record<string, unknown>,
      c: number
    ) => unknown;
    const entity = new Ctor(
      {
        bank: this,
        fromBank: true,
        ...options,
      },
      definition,
      this.currentEntityId++
    );
    this.track(entity as { entityId: number });
    return entity;
  }

  track (entity: { entityId: number }) {
    this.tracker[entity.entityId] = entity;
  }

  locate (entityId: unknown) {
    return this.tracker[entityId as number];
  }

  findAll (bgioArguments: BgioResolveState, rule: RuleWithConditions, context: Record<string, unknown>) {
    if (!rule.conditions) {
      throw new Error(`Cannot find entity with no conditions. Rule: ${JSON.stringify(rule)}`);
    }
    return filter(
      Object.values(this.tracker),
      (entity) => checkConditions(
        bgioArguments,
        rule.conditions,
        { target: entity },
        context
      ).conditionsAreMet
    );
  }

  findOne (bgioArguments: BgioResolveState, rule: RuleWithConditions, context: Record<string, unknown>) {
    return this.findAll(bgioArguments, rule, context)[0];
  }

  find (bgioArguments: BgioResolveState, rule: RuleWithConditions & { matchMultiple?: boolean }, context: Record<string, unknown>) {
    return rule.matchMultiple
      ? this.findAll(bgioArguments, rule, context)
      : this.findOne(bgioArguments, rule, context);
  }

  findParent (entity: unknown) {
    return find(this.tracker, (ent) =>
      (ent as { entities?: unknown[] }).entities?.includes(entity)
        || (ent as { spaces?: unknown[] }).spaces?.includes(entity)
    );
  }

  getOne (bgioArguments: BgioResolveState, rule: RuleWithConditions & { state?: unknown }, context: Record<string, unknown>) {
    const slot = this.getSlot(bgioArguments, rule, context);
    if (!slot) {
      console.error(`No matching slot for ${JSON.stringify(rule)}`);
    }
    return slot!.getOne(bgioArguments, { state: rule.state }, context);
  }

  getMultiple (bgioArguments: BgioResolveState, rule: RuleWithConditions & { state?: unknown }, count: number, context: Record<string, unknown>) {
    const slots = this.getSlots(bgioArguments, rule, context);
    if (!slots.length) {
      console.error(`No matching slots for ${JSON.stringify(rule)}`);
    }
    return slots.reduce<unknown[]>((acc, slot) => [
      ...acc,
      ...slot.getMultiple(bgioArguments, count, { state: rule.state }),
    ], []);
  }

  getSlot (bgioArguments: BgioResolveState, rule: RuleWithConditions, context: Record<string, unknown>) {
    return this.slots.find((slot) => checkConditions(
      bgioArguments,
      rule.conditions,
      { target: slot },
      context
    ).conditionsAreMet
    );
  }

  getSlots (bgioArguments: BgioResolveState, rule: RuleWithConditions, context: Record<string, unknown>) {
    return this.slots.filter((slot) => checkConditions(
      bgioArguments,
      rule.conditions,
      { target: slot },
      context
    ).conditionsAreMet
    );
  }

  returnToBank (bgioArguments: BgioResolveState, entity: { entityId: number; rule: Record<string, unknown> }) {
    (this.findParent(entity) as { remove: (e: unknown) => void }).remove(entity);
    this.getSlot(bgioArguments, entity.rule as RuleWithConditions, {})!.returnToBank(entity);
    delete this.tracker[entity.entityId];
  }
}

export default Bank;
