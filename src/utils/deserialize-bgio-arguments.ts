import { deserialize } from "wackson";
import { registry } from "../registry.js";
import type { BgioResolveState } from "./bgio-resolve-types.js";

export default function deserializeBgioArguments (bgioArguments: BgioResolveState): BgioResolveState {
  return {
    ...bgioArguments,
    G: deserialize(JSON.stringify(bgioArguments.G), registry) as Record<string, unknown>,
  };
}
