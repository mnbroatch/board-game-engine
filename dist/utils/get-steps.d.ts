import { type BgioResolveState } from "./bgio-resolve-types.js";
export default function getSteps(bgioState: BgioResolveState, moveRule: {
    moveType: string;
    arguments: Record<string, {
        playerChoice?: boolean;
        possibleValues?: unknown[];
        [k: string]: unknown;
    }>;
}): {
    argName: string;
    getClickable: (context: Record<string, unknown>) => unknown[];
}[];
//# sourceMappingURL=get-steps.d.ts.map