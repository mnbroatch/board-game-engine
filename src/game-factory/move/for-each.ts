import type { MoveDefinition, MoveForEach } from "../../types/expanded-game-types.js";
import type { ForEachDoPayload } from "../../types/move-payload.js";
import type { BgioResolveState } from "../../utils/bgio-resolve-types.js";
import type { ResolutionContext } from "../../types/resolution-context.js";
import type { EngineEntity } from "../../types/runtime-entity.js";
import Move from "./move.js";
import { getMoveInstance } from "./move-factory.js";

export default class ForEach extends Move<NonNullable<ForEachDoPayload["arguments"]>> {
  do (
    bgioArguments: BgioResolveState,
    rule: MoveDefinition,
    resolvedPayload: ForEachDoPayload,
    context: ResolutionContext
  ) {
    const { move } = rule as MoveForEach;
    const { targets } = resolvedPayload.arguments;
    targets.forEach((target: EngineEntity) => {
      const loopContext = {
        ...context,
        loopTarget: target
      };
      getMoveInstance(move).doMove(
        bgioArguments,
        undefined,
        loopContext
      );
    });
  }
}
