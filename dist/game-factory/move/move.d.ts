import { INVALID_MOVE } from "@mnbroatch/boardgame.io/dist/cjs/core.js";
import type { MoveArgumentBinding, MoveDefinition } from "../../types/expanded-game-types.js";
import type { MovePayload } from "../../types/move-payload.js";
import type { MoveArgumentsMap } from "../../types/move-arguments.js";
import type { ResolutionContext } from "../../types/resolution-context.js";
import type { BgioReadonlyState, BgioResolveState } from "../../utils/bgio-resolve-types.js";
export default class Move<TArgs extends MoveArgumentsMap = MoveArgumentsMap> {
    rule: MoveDefinition;
    constructor(rule: MoveDefinition);
    checkValidity(bgioArguments: BgioReadonlyState | BgioResolveState, payload: MovePayload<TArgs>, context: ResolutionContext): false | {
        argumentResults: Record<string, {
            results: unknown[];
            conditionsAreMet: boolean;
        }>;
        moveResults: import("../../index.js").CheckConditionsResult;
        conditionsAreMet: boolean;
    };
    isValid(bgioArguments: BgioReadonlyState | BgioResolveState, payload: MovePayload<TArgs>, context: ResolutionContext): boolean;
    doMove(bgioArguments: BgioReadonlyState | BgioResolveState, payload: MovePayload<TArgs> | undefined, context: ResolutionContext, { skipCheck }?: {
        skipCheck?: boolean | undefined;
    }): typeof INVALID_MOVE | {
        conditionResults: boolean | {
            argumentResults: Record<string, {
                results: unknown[];
                conditionsAreMet: boolean;
            }>;
            moveResults: import("../../index.js").CheckConditionsResult;
            conditionsAreMet: boolean;
        } | undefined;
    };
    do(_bgioArguments: BgioReadonlyState | BgioResolveState, _rule: MoveDefinition, _resolvedPayload: MovePayload<TArgs>, _context: ResolutionContext): void;
    transformRule<R extends {
        arguments?: Record<string, MoveArgumentBinding>;
    }>(rule: R): R;
}
//# sourceMappingURL=move.d.ts.map