import find from "lodash/find.js";
import filter from "lodash/filter.js";
import checkConditions from "../../utils/check-conditions.js";
import resolveProperties from "../../utils/resolve-properties.js";
import entityMatches from "../../utils/entity-matches.js";
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

function slotHasInventory (slot: InstanceType<typeof BankSlot>) {
  // `remaining` is always a number today, but keep this tolerant if internals change.
  const remaining = (slot as { remaining?: unknown }).remaining;
  return remaining === Infinity || (typeof remaining === "number" && remaining > 0);
}

function isBankDebugEnabled () {
  // Node tests / CI
  if (typeof process !== "undefined" && process.env && process.env.BGE_DEBUG_BANK === "1") return true;
  // Browser/manual debugging
  try {
    return Boolean((globalThis as { __BGE_DEBUG_BANK__?: unknown }).__BGE_DEBUG_BANK__);
  } catch {
    return false;
  }
}

function bankDebug (...args: unknown[]) {
  if (!isBankDebugEnabled()) return;
  console.debug("[BGE][bank]", ...args);
}

function buildSlotSelectionMatcher (
  slot: InstanceType<typeof BankSlot>,
  rule: RuleWithConditions
): MoveArgumentsState | undefined {
  const request = rule as Record<string, unknown>;
  const slotRule = slot.rule as unknown as Record<string, unknown>;

  // Start from the request "shape" but drop fields that are never entity identity fields.
  const base: Record<string, unknown> = { ...request };
  delete base.conditions;
  delete base.state;
  delete base.stateGroups;

  // Only compare keys that actually exist on the slot's authored entity rule.
  // This avoids false negatives when callers include extra metadata (e.g. `count`) that is not
  // part of the runtime entity attribute bag used by `entityMatches`.
  const intersection: Record<string, unknown> = {};
  for (const key of Object.keys(base)) {
    if (Object.prototype.hasOwnProperty.call(slotRule, key)) {
      intersection[key] = base[key];
    }
  }

  if (!Object.keys(intersection).length) return undefined;
  return intersection as unknown as MoveArgumentsState;
}

function slotSelectionIntersectionKeyCount (
  slot: InstanceType<typeof BankSlot>,
  rule: RuleWithConditions
) {
  const matcher = buildSlotSelectionMatcher(slot, rule);
  return matcher ? Object.keys(matcher).length : 0;
}

function tryEvaluateSlot (
  bank: Bank,
  bgioArguments: BgioReadonlyState,
  slot: InstanceType<typeof BankSlot>,
  rule: RuleWithConditions,
  context: ResolutionContext
) {
  if (!slotHasInventory(slot)) return { ok: false as const, reason: "no_inventory" as const };
  const example = bank.createSlotExampleEntity(bgioArguments, slot, context);
  const matcher = buildSlotSelectionMatcher(slot, rule);
  if (matcher && !entityMatches(bgioArguments as BgioResolveState, matcher, example, context)) {
    return { ok: false as const, reason: "matcher" as const, example };
  }
  const conditionsOk = checkConditions(
    bgioArguments as BgioResolveState,
    rule.conditions,
    { target: example },
    context
  ).conditionsAreMet;
  if (!conditionsOk) return { ok: false as const, reason: "conditions" as const, example };
  return { ok: true as const, example };
}

class Bank {
  currentEntityId: number;
  tracker: Record<number, EngineEntity>;
  slots: InstanceType<typeof BankSlot>[];

  constructor (entityRules: EntityDefinition[]) {
    this.currentEntityId = 0;
    this.tracker = {};
    this.slots = entityRules.map((rule) => new BankSlot(rule, this));
    if (isBankDebugEnabled()) {
      bankDebug(
        "new Bank slots",
        this.slots.map((s) => ({
          name: (s.rule as { name?: unknown }).name,
          entityType: (s.rule as { entityType?: unknown }).entityType,
          count: (s.rule as { count?: unknown }).count,
          remaining: (s as { remaining?: unknown }).remaining,
        }))
      );
    }
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
    const childId = (entity as { entityId?: unknown }).entityId;
    return find(this.tracker, (ent) => {
      const ewc = ent as EngineEntityWithChildren;
      const byId = childId !== undefined
        ? Boolean(
            ewc.entities?.some((e) => (e as { entityId?: unknown }).entityId === childId) ||
            ewc.spaces?.some((e) => (e as { entityId?: unknown }).entityId === childId)
          )
        : false;
      return Boolean(
        byId
        || ewc.entities?.includes(child)
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
    const ranked = this.slots
      .map((slot) => ({
        slot,
        intersectionKeys: slotSelectionIntersectionKeyCount(slot, rule),
        evald: tryEvaluateSlot(this, bgioArguments, slot, rule, context),
      }))
      .filter((x) => x.evald.ok);

    if (!ranked.length) {
      const candidates = this.slots.map((s) => ({
        name: (s.rule as { name?: unknown }).name,
        entityType: (s.rule as { entityType?: unknown }).entityType,
        count: (s.rule as { count?: unknown }).count,
        remaining: (s as { remaining?: unknown }).remaining,
        intersectionKeys: slotSelectionIntersectionKeyCount(s, rule),
        eval: tryEvaluateSlot(this, bgioArguments, s, rule, context),
      }));
      console.error("[BGE][bank] getSlot: no match", { rule, candidates });
      bankDebug("getSlot: no match (verbose)", {
        rule,
        candidates: candidates.map((c, idx) => ({
          ...c,
          slotRuleKeys: Object.keys(this.slots[idx].rule as unknown as Record<string, unknown>),
        })),
      });
      return undefined;
    }

    const bestKeys = Math.max(...ranked.map((r) => r.intersectionKeys));
    const best = ranked.filter((r) => r.intersectionKeys === bestKeys);
    // Deterministic tie-break: prefer more specific slot names, then stable slot order.
    best.sort((a, b) => {
      const an = String((a.slot.rule as { name?: unknown }).name ?? "");
      const bn = String((b.slot.rule as { name?: unknown }).name ?? "");
      if (an !== bn) return bn.length - an.length;
      return this.slots.indexOf(a.slot) - this.slots.indexOf(b.slot);
    });
    return best[0].slot;
  }

  getSlots (bgioArguments: BgioReadonlyState, rule: RuleWithConditions, context: ResolutionContext) {
    const ranked = this.slots
      .map((slot) => ({
        slot,
        intersectionKeys: slotSelectionIntersectionKeyCount(slot, rule),
        evald: tryEvaluateSlot(this, bgioArguments, slot, rule, context),
      }))
      .filter((x) => x.evald.ok);

    if (!ranked.length) return [];

    const bestKeys = Math.max(...ranked.map((r) => r.intersectionKeys));
    return ranked
      .filter((r) => r.intersectionKeys === bestKeys)
      .sort((a, b) => this.slots.indexOf(a.slot) - this.slots.indexOf(b.slot))
      .map((r) => r.slot);
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
