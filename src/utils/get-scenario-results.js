import checkConditions from "./check-conditions.js";
import resolveProperties from './resolve-properties.js'

export default function getScenarioResults(bgioArguments, scenarios, context) {
  let match
  for (const scenario of scenarios) {
    const conditionResults = checkConditions(bgioArguments, scenario)
    if (conditionResults.conditionsAreMet) {
      match = { scenario, conditionResults }
      break
    }
  }

  if (match?.scenario?.result) {
    return resolveProperties(
      bgioArguments,
      match.scenario.result,
      { results: match.conditionResults.results }
    )
  } else {
    return match
  }
}
