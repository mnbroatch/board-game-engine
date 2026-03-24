import Move from "./move.js";

export default class Shuffle extends Move {
  do (bgioArguments: unknown, _rule: unknown, resolvedPayload: unknown) {
    const { target } = (resolvedPayload as { arguments: { target: { entities: unknown[] } } }).arguments;
    const b = bgioArguments as { random: { Shuffle: <T>(xs: T[]) => T[] } };
    target.entities = b.random.Shuffle(target.entities);
  }
}
