import type { MoveDefinition } from "../../types/bagel-types.js";
import Move from "./move.js";
import { getMoveInstance } from "./move-factory.js";

export default class ForEach extends Move {
  do (bgioArguments: unknown, rule: unknown, resolvedPayload: unknown, context: Record<string, unknown>) {
    const { targets } = (resolvedPayload as { arguments: { targets: unknown[] } }).arguments;
    targets.forEach((target: unknown) => {
      const loopContext = {
        ...context,
        loopTarget: target
      }
      getMoveInstance((rule as { move: MoveDefinition }).move)!.doMove(
        bgioArguments,
        undefined,
        loopContext
      )
    })
  }
}
