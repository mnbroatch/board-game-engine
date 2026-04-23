import matches from "lodash/matches.js";
import resolveProperties from "./resolve-properties.js";
import type { BgioReadonlyState, BgioResolveState } from "./bgio-resolve-types.js";
import type { EngineEntity } from "../types/runtime-entity.js";
import type { MoveArgumentsState, ResolutionContext } from "../types/resolution-context.js";

function resolveMatcher (
  bgioArguments: BgioReadonlyState | BgioResolveState,
  matcher: MoveArgumentsState,
  context: ResolutionContext
) {
  const resolvedMatcher = { ...matcher };
  delete resolvedMatcher.state;
  delete resolvedMatcher.stateGroups;
  return resolveProperties(bgioArguments, resolvedMatcher, context);
}

function getEntityMatcher (entity: EngineEntity) {
  return {
    ...entity.rule,
    ...entity.state,
  };
}

export default function entityMatches (
  bgioArguments: BgioReadonlyState | BgioResolveState,
  matcher: MoveArgumentsState,
  entity: EngineEntity,
  context: ResolutionContext
): boolean {
  return matches(resolveMatcher(bgioArguments, matcher, context))(getEntityMatcher(entity));
}
