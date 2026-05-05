/**
 * Central boundary for wackson / JSON round-trips involving `BoardgameEngineG`.
 * Call sites should prefer these helpers over scattering `as BoardgameEngineG`.
 */
import { deserialize, serialize } from "wackson";
import { registry } from "../registry.js";
import type { BoardgameEngineG } from "./bgio-resolve-types.js";

/** Revive `G` from boardgame.io (plain object) into engine graph via wackson + registry. */
export function reviveBoardgameEngineGFromUnknownRawG (rawG: unknown): BoardgameEngineG {
  // `G` can be either:
  // - a plain JSON object (no cycles) when coming over the wire, OR
  // - a live engine object graph (with circular refs like entity -> bank -> tracker -> entity)
  //   depending on the runtime / transport.
  //
  // `JSON.stringify` will throw on circular structures, so we route through wackson `serialize`,
  // which is designed to handle graphs and preserve class identity using the registry.
  if (typeof rawG === "string") {
    return deserialize(rawG, registry) as BoardgameEngineG;
  }
  return deserialize(serialize(rawG, { deduplicateInstances: true }) as string, registry) as BoardgameEngineG;
}

/** Deep clone `G` through wackson serialize + JSON.parse (boardgame.io move return shape). */
export function cloneBoardgameEngineGJsonRoundtrip (G: BoardgameEngineG): BoardgameEngineG {
  return JSON.parse(serialize(G)) as BoardgameEngineG;
}

/** Clone `G` through wackson serialize → deserialize (simulation / alternate clone path). */
export function cloneBoardgameEngineGWacksonRoundtrip (G: BoardgameEngineG): BoardgameEngineG {
  return deserialize(serialize(G) as string, registry) as BoardgameEngineG;
}

/** Deserialize an arbitrary serializable value with the entity registry (e.g. move payload). */
export function deserializeWithRegistry<T> (serializable: unknown): T {
  if (typeof serializable === "string") return deserialize(serializable, registry) as T;
  return deserialize(serialize(serializable, { deduplicateInstances: true }) as string, registry) as T;
}

/** Deep clone arbitrary serializable data through wackson serialize + JSON.parse (transport clone). */
export function wacksonJsonClone<T> (
  value: T,
  serializeOptions: { deduplicateInstances?: boolean } = { deduplicateInstances: false }
): T {
  return JSON.parse(serialize(value, serializeOptions)) as T;
}
