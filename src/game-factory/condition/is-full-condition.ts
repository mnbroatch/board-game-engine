import Condition from "./condition.js";

export default class IsFull extends Condition {
  checkCondition (_bgioArguments: unknown, _rule: unknown, payload: Record<string, unknown>, _context: Record<string, unknown>) {
    const t = payload.target as { spaces: { entities?: unknown[] }[] };
    return {
      conditionIsMet: t.spaces.every((space: { entities?: unknown[] }) => space?.entities?.length)
    };
  }
}
