import Move from "./move.js";

export default class EndTurn extends Move {
  do (bgioArguments: unknown) {
    (bgioArguments as { events: { endTurn: () => void } }).events.endTurn();
  }
}
