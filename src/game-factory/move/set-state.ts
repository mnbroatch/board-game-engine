import Move from "./move.js";

// todo: invariant conditions like "is one of the allowed values"
export default class SetState extends Move {
  do (_unused: unknown, _rule: unknown, resolvedPayload: unknown) {
    const { entity, state } = (resolvedPayload as {
      arguments: { entity: { state?: Record<string, unknown> }; state: { property: string; value: unknown } };
    }).arguments;
    entity.state = {
      ...entity.state,
      [state.property]: state.value,
    };
  }
}
