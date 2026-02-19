import matches from 'lodash/matches.js'
import resolveProperties from '../utils/resolve-properties.js'

function resolveMatcher (bgioArguments, matcher, context) {
  const resolvedMatcher = { ...matcher }
  delete resolvedMatcher.state
  delete resolvedMatcher.stateGroups
  return resolveProperties(bgioArguments, resolvedMatcher, context)
}

function getEntityMatcher (entity) {
  return {
    ...entity.rule,
    ...entity.state
  }
}

export default function entityMatches (bgioArguments, matcher, entity, context) {
  return matches(resolveMatcher(bgioArguments, matcher, context))(getEntityMatcher(entity))
}
