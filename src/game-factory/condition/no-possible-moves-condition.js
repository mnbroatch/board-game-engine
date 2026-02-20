import Condition from "./condition.js";
import areThereValidMoves from "../../utils/any-valid-moves.js";
import getCurrentMoves from "../../utils/get-current-moves.js";

export default class NoPossibleMoves extends Condition {
  checkCondition(bgioArguments, _, __, context) {
    return {
      conditionIsMet: !areThereValidMoves(
        bgioArguments,
        getCurrentMoves(bgioArguments, context),
      )
    }
  }
}
