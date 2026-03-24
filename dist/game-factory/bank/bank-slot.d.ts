import type { BgioResolveState } from "../../utils/bgio-resolve-types.js";
declare class BankSlot {
    bank: {
        createEntity: (rule: Record<string, unknown>) => unknown;
    };
    rule: Record<string, unknown> & {
        count?: number | string;
        name?: string;
    };
    pool: unknown[];
    remaining: number;
    constructor(rule: Record<string, unknown> & {
        count?: number | string;
        name?: string;
    }, bank: BankSlot["bank"]);
    getOne(bgioArguments: BgioResolveState, options: {
        state?: unknown;
    }, context: Record<string, unknown>): unknown;
    getMultiple(bgioArguments: BgioResolveState, count?: number, options?: {
        state?: unknown;
    }, context?: Record<string, unknown>): unknown[];
    returnToBank(entity: {
        rule: {
            state?: unknown;
        };
        state?: unknown;
    }): void;
}
export default BankSlot;
//# sourceMappingURL=bank-slot.d.ts.map