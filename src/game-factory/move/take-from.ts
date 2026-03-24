import Move from "./move.js";

export default class TakeFrom extends Move {
  do (_bgioArguments: unknown, rule: { arguments: { source: { position?: unknown } } }, resolvedPayload: unknown) {
    const { source, destination } = (resolvedPayload as { arguments: { source: unknown; destination: unknown } }).arguments;
    (destination as { placeEntity: (e: unknown) => void }).placeEntity(
      (source as { takeOne: (p: unknown) => unknown }).takeOne(
        (rule as { arguments: { source: { position?: unknown } } }).arguments.source.position
      )
    );
  }
}
