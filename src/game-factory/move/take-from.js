import Move from "./move.js";

export default class TakeFrom extends Move {
  do(bgioArguments, rule, { arguments: { source, destination } }) {
    destination.placeEntity(source.takeOne(rule.arguments.source.position))
  }
}
