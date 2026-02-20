import moveFactory from "../game-factory/move/move-factory.js";

export default function doMoves (bgioArguments, moves = [], context) {
  if (!moves?.length) {
    return bgioArguments.G
  }

  moves.forEach((moveRule) => {
    moveFactory(moveRule, context.game).moveInstance.doMove(
      bgioArguments,
      undefined,
      context
    );
  })

  return bgioArguments.G
}

