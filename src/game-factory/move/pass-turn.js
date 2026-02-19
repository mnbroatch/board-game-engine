import Move from "./move.js";

export default class PassTurn extends Move {
  do(bgioArguments) {
    if (bgioArguments.G._meta.passedPlayers.length < bgioArguments.ctx.numPlayers) {
      bgioArguments.G._meta.passedPlayers.push(bgioArguments.ctx.currentPlayer)
      bgioArguments.events.pass()
    }
  }
}
