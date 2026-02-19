import Move from "./move.js";
import { getMoveInstance } from "./move-factory.js";

export default class ForEach extends Move {
  do(bgioArguments, rule, { arguments: { targets } }, context) {
    targets.forEach((target) => {
      const loopContext = {
        ...context,
        loopTarget: target
      }
      getMoveInstance(rule.move).doMove(
        bgioArguments,
        undefined,
        loopContext
      )
    })
  }
}
