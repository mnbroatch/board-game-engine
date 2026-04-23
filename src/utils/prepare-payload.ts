import type {
  AbstractPickArgument,
  ClientMovePayload,
  MoveType,
  PreparedMoveArgument,
  PreparedMoveArgumentsMap,
  PreparedMovePayload,
} from "../types/move-payload.js";
import { assertNumber, assertRecord } from "./type-asserts.js";
import { wacksonJsonClone } from "./engine-serde-boundary.js";

// todo: remember why reducing to id was preferred?
export default function preparePayload (
  payload: unknown
): PreparedMovePayload<PreparedMoveArgumentsMap> | unknown {
  const p = payload as ClientMovePayload<MoveType> | null | undefined;
  if (p?.arguments) {
    assertRecord(p.arguments, "preparePayload: payload.arguments must be an object");
    const payloadCopy: PreparedMovePayload<PreparedMoveArgumentsMap> = {
      ...p,
      arguments: Object.entries(p.arguments).reduce<PreparedMoveArgumentsMap>((acc, [key, argument]) => {
        if (argument === undefined) return acc;
        const a = argument as { abstract?: boolean; entityId?: unknown };
        const prepared: PreparedMoveArgument = a.abstract
          ? argument as AbstractPickArgument
          : (() => {
              assertNumber(a.entityId, "preparePayload: expected entityId number for non-abstract pick");
              return a.entityId;
            })();
        return { ...acc, [key]: prepared };
      }, {}),
    };
    return wacksonJsonClone(payloadCopy, { deduplicateInstances: false });
  } else {
    return payload;
  }
}
