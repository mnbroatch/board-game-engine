import type { MoveDefinition } from "../types/bagel-types.js";
import moveFactory from "../game-factory/move/move-factory.js";

export default function doMoves (
  bgioArguments: { G: unknown; [k: string]: unknown },
  moves: MoveDefinition[] = [],
  context: { game: Record<string, unknown> } & Record<string, unknown>
) {
  if (!moves?.length) {
    return bgioArguments.G;
  }

  moves.forEach((moveRule) => {
    moveFactory(moveRule, context.game).moveInstance!.doMove(
      bgioArguments,
      undefined,
      context
    );
  });

  return bgioArguments.G;
}
