import Condition from "./condition.js";
import areThereValidMoves from "../../utils/any-valid-moves.js";
import getCurrentMoves from "../../utils/get-current-moves.js";
import type { GetCurrentMovesClient, GetCurrentMovesState } from "../../utils/get-current-moves.js";
import type { BgioReadonlyState, BgioResolveState } from "../../utils/bgio-resolve-types.js";
import type { ConditionContext, ConditionPayload } from "../../types/condition-types.js";
import type { ResolvedConditionRule } from "../../types/resolved-condition-types.js";

export default class NoPossibleMoves extends Condition {
  checkCondition (bgioArguments: BgioReadonlyState | BgioResolveState, _unused: ResolvedConditionRule, _payload: ConditionPayload, context: ConditionContext) {
    return {
      conditionIsMet: !areThereValidMoves(
        bgioArguments,
        getCurrentMoves(bgioArguments as GetCurrentMovesState, context as GetCurrentMovesClient),
      )
    }
  }
}
