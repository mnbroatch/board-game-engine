import Move from "./move.js";

export default class Pass extends Move {
  do (bgioArguments: unknown) {
    (bgioArguments as { events: { endTurn: () => void } }).events.endTurn();
  }
}
