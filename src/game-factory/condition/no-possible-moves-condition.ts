import Condition from "./condition.js";
import areThereValidMoves from "../../utils/any-valid-moves.js";
import getCurrentMoves from "../../utils/get-current-moves.js";
import type { GetCurrentMovesClient, GetCurrentMovesState } from "../../utils/get-current-moves.js";

export default class NoPossibleMoves extends Condition {
  checkCondition (bgioArguments: unknown, _unused: unknown, _payload: unknown, context: Record<string, unknown>) {
    return {
      conditionIsMet: !areThereValidMoves(
        bgioArguments,
        getCurrentMoves(bgioArguments as GetCurrentMovesState, context as unknown as GetCurrentMovesClient),
      )
    }
  }
}
