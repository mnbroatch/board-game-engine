import type { BgioReadonlyState } from "../../utils/bgio-resolve-types.js";
import type { EntityDefinition } from "../../types/entity-definition.js";
import type { EngineEntity, RuntimeEntityRule } from "../../types/runtime-entity.js";
import type { ResolutionContext } from "../../types/resolution-context.js";
declare class BankSlot {
    bank: {
        createEntity: (rule: Partial<RuntimeEntityRule>) => EngineEntity;
    };
    rule: EntityDefinition & {
        count?: number | string;
        name?: string;
    };
    pool: EngineEntity[];
    remaining: number;
    constructor(rule: EntityDefinition & {
        count?: number | string;
        name?: string;
    }, bank: BankSlot["bank"]);
    getOne(bgioArguments: BgioReadonlyState, options: {
        state?: unknown;
    }, context: ResolutionContext): EngineEntity;
    getMultiple(bgioArguments: BgioReadonlyState, count?: number, options?: {
        state?: unknown;
    }, context?: ResolutionContext): EngineEntity[];
    returnToBank(entity: EngineEntity): void;
}
export default BankSlot;
//# sourceMappingURL=bank-slot.d.ts.map