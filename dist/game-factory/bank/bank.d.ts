import type { RuleWithConditions } from "../../types/rule-with-conditions.js";
import type { EntityDefinition } from "../../types/entity-definition.js";
import type { EngineEntity, RuntimeEntityRule } from "../../types/runtime-entity.js";
import BankSlot from "./bank-slot.js";
import type { BgioReadonlyState } from "../../utils/bgio-resolve-types.js";
import type { MoveArgumentsState, ResolutionContext } from "../../types/resolution-context.js";
declare class Bank {
    currentEntityId: number;
    tracker: Record<number, EngineEntity>;
    slots: InstanceType<typeof BankSlot>[];
    constructor(entityRules: EntityDefinition[]);
    createEntity(definition?: Partial<RuntimeEntityRule>, options?: MoveArgumentsState): EngineEntity;
    /**
     * Create a real entity instance without tracking it in this bank.
     * Used for evaluating slot-matching conditions against an example entity.
     */
    createUntrackedEntity(definition: Partial<RuntimeEntityRule>, options: MoveArgumentsState, id: number): EngineEntity;
    createSlotExampleEntity(bgioArguments: BgioReadonlyState, slot: InstanceType<typeof BankSlot>, context: ResolutionContext): EngineEntity;
    track(entity: EngineEntity): void;
    locate(entityId: number): EngineEntity;
    findAll(bgioArguments: BgioReadonlyState, rule: RuleWithConditions, context: ResolutionContext): EngineEntity[];
    findOne(bgioArguments: BgioReadonlyState, rule: RuleWithConditions, context: ResolutionContext): EngineEntity;
    find(bgioArguments: BgioReadonlyState, rule: RuleWithConditions & {
        matchMultiple?: boolean;
    }, context: ResolutionContext): EngineEntity | EngineEntity[] | undefined;
    findParent(entity: unknown): EngineEntity | undefined;
    getOne(bgioArguments: BgioReadonlyState, rule: RuleWithConditions & {
        state?: unknown;
    }, context: ResolutionContext): EngineEntity;
    getMultiple(bgioArguments: BgioReadonlyState, rule: RuleWithConditions & {
        state?: unknown;
    }, count: number, context: ResolutionContext): EngineEntity[];
    getSlot(bgioArguments: BgioReadonlyState, rule: RuleWithConditions, context: ResolutionContext): BankSlot | undefined;
    getSlots(bgioArguments: BgioReadonlyState, rule: RuleWithConditions, context: ResolutionContext): BankSlot[];
    returnToBank(bgioArguments: BgioReadonlyState, entity: EngineEntity): void;
}
export default Bank;
//# sourceMappingURL=bank.d.ts.map