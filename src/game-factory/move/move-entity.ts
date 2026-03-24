import Move from "./move.js";

export default class MoveEntity extends Move {
  do (bgioArguments: unknown, rule: { position?: unknown }, resolvedPayload: unknown) {
    const { entity, destination } = (resolvedPayload as { arguments: { entity: unknown; destination: unknown } }).arguments;
    // todo: move all such things to always be multiple
    const g = bgioArguments as { G: { bank: { findParent: (e: unknown) => { remove: (x: unknown) => void } | undefined } } };
    if (Array.isArray(entity)) {
      entity.forEach((e: unknown) => {
        g.G.bank.findParent(e)?.remove(e);
        (destination as { placeEntity: (e: unknown, p?: unknown) => void }).placeEntity(e, rule.position);
      });
    } else {
      g.G.bank.findParent(entity)?.remove(entity);
      (destination as { placeEntity: (e: unknown, p?: unknown) => void }).placeEntity(entity, rule.position);
    }
  }
}
