import Move from "./move.js";
import doMoves from '../../utils/do-moves.js'

export default class SetActivePlayers extends Move {
  do(bgioArguments, rule, _, context) {
    bgioArguments.events.setActivePlayers(rule.options)

    // this is going to need to be expanded to handle more complex things
    // than "move current player to new stage"
    const phaseName = bgioArguments.ctx.phase
    const stageName = rule.options.currentPlayer?.stage
    const phaseOrRoot = context.game.phases?.[phaseName] ?? context.game
    const stage = phaseOrRoot?.turn?.stages?.[stageName]
    doMoves(
      bgioArguments,
      stage?.initialMoves,
      {
        ...context,
        stageName,
      }
    )
  }
}
