/**
 * Central boundary for wackson / JSON round-trips involving `BoardgameEngineG`.
 * Call sites should prefer these helpers over scattering `as BoardgameEngineG`.
 */
import { deserialize, serialize } from "wackson";
import { registry } from "../registry.js";
import type { BoardgameEngineG } from "./bgio-resolve-types.js";

/** Revive `G` from boardgame.io (plain object) into engine graph via wackson + registry. */
export function reviveBoardgameEngineGFromUnknownRawG (rawG: unknown): BoardgameEngineG {
  return deserialize(JSON.stringify(rawG), registry) as BoardgameEngineG;
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
  return deserialize(JSON.stringify(serializable), registry) as T;
}

/** Deep clone arbitrary serializable data through wackson serialize + JSON.parse (transport clone). */
export function wacksonJsonClone<T> (
  value: T,
  serializeOptions: { deduplicateInstances?: boolean } = { deduplicateInstances: false }
): T {
  return JSON.parse(serialize(value, serializeOptions)) as T;
}
