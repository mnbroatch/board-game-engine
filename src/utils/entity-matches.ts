import matches from "lodash/matches.js";
import resolveProperties from "./resolve-properties.js";
import type { BgioResolveState } from "./bgio-resolve-types.js";

function resolveMatcher (
  bgioArguments: BgioResolveState,
  matcher: Record<string, unknown>,
  context: Record<string, unknown>
) {
  const resolvedMatcher = { ...matcher };
  delete resolvedMatcher.state;
  delete resolvedMatcher.stateGroups;
  return resolveProperties(bgioArguments, resolvedMatcher, context);
}

function getEntityMatcher (entity: { rule: Record<string, unknown>; state?: Record<string, unknown> }) {
  return {
    ...entity.rule,
    ...entity.state,
  };
}

export default function entityMatches (
  bgioArguments: BgioResolveState,
  matcher: Record<string, unknown>,
  entity: { rule: Record<string, unknown>; state?: Record<string, unknown> },
  context: Record<string, unknown>
): boolean {
  return matches(resolveMatcher(bgioArguments, matcher, context))(getEntityMatcher(entity));
}
