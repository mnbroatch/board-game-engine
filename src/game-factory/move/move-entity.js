import Move from "./move.js";

export default class MoveEntity extends Move {
  do(bgioArguments, rule, { arguments: { entity, destination } }) {
    // todo: move all such things to always be multiple
    if (Array.isArray(entity)) {
      entity.forEach((e) => {
        bgioArguments.G.bank.findParent(e)?.remove(e)
        destination.placeEntity(e, rule.position)
      })
    } else {
      bgioArguments.G.bank.findParent(entity)?.remove(entity)
      destination.placeEntity(entity, rule.position)
    }
  }
}
