import Move from "./move.js";

export default class Shuffle extends Move {
  do(bgioArguments, _, { arguments: { target } }) {
    target.entities = bgioArguments.random.Shuffle(target.entities)
  }
}
