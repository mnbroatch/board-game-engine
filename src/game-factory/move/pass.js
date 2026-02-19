import Move from "./move.js";

export default class Pass extends Move {
  do(bgioArguments) {
    bgioArguments.events.endTurn()
  }
}
