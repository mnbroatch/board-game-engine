import type { BgioResolveState } from "../../utils/bgio-resolve-types.js";
import { bankOf } from "../../utils/bgio-resolve-types.js";
import Move from "./move.js";

export default class RemoveEntity extends Move {
  do (bgioArguments: unknown, _rule: unknown, resolvedPayload: unknown) {
    const { entity } = (resolvedPayload as { arguments: { entity: unknown } }).arguments;
    const bgio = bgioArguments as BgioResolveState;
    bankOf(bgio).returnToBank(bgio, entity as { entityId: number; rule: Record<string, unknown> });
  }
}
