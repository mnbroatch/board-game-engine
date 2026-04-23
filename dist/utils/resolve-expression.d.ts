import type { BgioReadonlyState } from "./bgio-resolve-types.js";
import type { MoveArgumentsState, ResolutionContext } from "../types/resolution-context.js";
export default function resolveExpression(bgioArguments: BgioReadonlyState, rule: {
    expression: string;
    arguments?: MoveArgumentsState;
}, context: ResolutionContext): unknown;
//# sourceMappingURL=resolve-expression.d.ts.map