import type { RuleWithConditions } from "../types/rule-with-conditions.js";

/** boardgame.io match args + engine `G` after setup (deserialized, many fields). */
export type BgioResolveState = {
  ctx: Record<string, unknown>;
  G: Record<string, unknown>;
  playerID?: string;
} & Record<string, unknown>;

/** Bank API on `G` used by resolution and moves (subset of {@link Bank} methods). */
export type BankApi = {
  find: (a: unknown, t: unknown, c: unknown) => unknown;
  findAll: (a: unknown, t: unknown, c: unknown) => unknown[];
  findParent: (t: unknown) => unknown;
  getOne: (a: BgioResolveState, rule: RuleWithConditions & { state?: unknown }, c: Record<string, unknown>) => unknown;
  getMultiple: (
    a: BgioResolveState,
    rule: RuleWithConditions & { state?: unknown },
    count: number,
    c: Record<string, unknown>
  ) => unknown[];
  returnToBank: (a: BgioResolveState, entity: { entityId: number; rule: Record<string, unknown> }) => void;
};

export function bankOf (bg: BgioResolveState): BankApi {
  return (bg.G as { bank: BankApi }).bank;
}
