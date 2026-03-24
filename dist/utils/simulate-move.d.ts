import type { BgioResolveState } from "./bgio-resolve-types.js";
export default function simulateMove(bgioArguments: BgioResolveState, payload: {
    arguments: Record<string, {
        abstract?: boolean;
        entityId?: unknown;
    } | number>;
}, context: {
    moveInstance: {
        doMove: (...args: unknown[]) => unknown;
    };
}): {
    bank: {
        locate: (id: unknown) => unknown;
    };
};
//# sourceMappingURL=simulate-move.d.ts.map