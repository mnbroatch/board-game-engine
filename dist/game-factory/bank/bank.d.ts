import type { RuleWithConditions } from "../../types/rule-with-conditions.js";
import BankSlot from "./bank-slot.js";
import type { BgioResolveState } from "../../utils/bgio-resolve-types.js";
declare class Bank {
    currentEntityId: number;
    tracker: Record<number, unknown>;
    slots: InstanceType<typeof BankSlot>[];
    constructor(entityRules: Record<string, unknown>[]);
    createEntity(definition?: Record<string, unknown>, options?: Record<string, unknown>): unknown;
    track(entity: {
        entityId: number;
    }): void;
    locate(entityId: unknown): unknown;
    findAll(bgioArguments: BgioResolveState, rule: RuleWithConditions, context: Record<string, unknown>): unknown[];
    findOne(bgioArguments: BgioResolveState, rule: RuleWithConditions, context: Record<string, unknown>): unknown;
    find(bgioArguments: BgioResolveState, rule: RuleWithConditions & {
        matchMultiple?: boolean;
    }, context: Record<string, unknown>): unknown;
    findParent(entity: unknown): unknown;
    getOne(bgioArguments: BgioResolveState, rule: RuleWithConditions & {
        state?: unknown;
    }, context: Record<string, unknown>): unknown;
    getMultiple(bgioArguments: BgioResolveState, rule: RuleWithConditions & {
        state?: unknown;
    }, count: number, context: Record<string, unknown>): unknown[];
    getSlot(bgioArguments: BgioResolveState, rule: RuleWithConditions, context: Record<string, unknown>): BankSlot | undefined;
    getSlots(bgioArguments: BgioResolveState, rule: RuleWithConditions, context: Record<string, unknown>): BankSlot[];
    returnToBank(bgioArguments: BgioResolveState, entity: {
        entityId: number;
        rule: Record<string, unknown>;
    }): void;
}
export default Bank;
//# sourceMappingURL=bank.d.ts.map