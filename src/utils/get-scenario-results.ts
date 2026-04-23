import checkConditions from "./check-conditions.js";
import resolveProperties from "./resolve-properties.js";
import type { BgioResolveState } from "./bgio-resolve-types.js";
import type { Condition } from "../types/expanded-game-types.js";
import type { CheckConditionsResult } from "../types/condition-types.js";
export default function getScenarioResults (
  bgioArguments: BgioResolveState,
  scenarios: unknown[]
) {
  let match:
    | { scenario: { result?: unknown; [k: string]: unknown }; conditionResults: CheckConditionsResult }
    | undefined;
  for (const scenario of scenarios) {
    const conditionResults = checkConditions(
      bgioArguments,
      (scenario as { conditions?: Condition[] }).conditions
    );
    if (conditionResults.conditionsAreMet) {
      match = { scenario: scenario as { result?: unknown }, conditionResults };
      break;
    }
  }

  if (match?.scenario?.result) {
    return resolveProperties(
      bgioArguments,
      match.scenario.result,
      { results: match.conditionResults.results }
    );
  } else {
    return match;
  }
}
