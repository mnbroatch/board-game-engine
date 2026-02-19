import Move from "./move.js";

export default class EndTurn extends Move {
  do(bgioArguments) {
    bgioArguments.events.endTurn()
  }
}
