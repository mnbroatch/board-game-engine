import { INVALID_MOVE } from 'boardgame.io/dist/cjs/core.js';
import checkConditions from "../utils/check-conditions.js";
import resolveProperties from "../utils/resolve-properties.js";

export default class Move {
  constructor (rule) {
    this.rule = this.transformRule(rule)
  }

  checkValidity (bgioArguments, payload, context) {
    const argRuleEntries = Object.entries(this.rule.arguments ?? {})

    if (
      !argRuleEntries.every(([argName]) => {
        const arg = payload.arguments[argName]
        return arg !== undefined && (!Array.isArray(arg) || arg.length)
      })
    ) {
      // not the best return value but we don't want to do expensive checks
      // when we know the operation is doomed. At least for now.
      return false
    }

    const argumentResults = {}

    for (let i = 0, len = argRuleEntries.length; i < len; i++) {
      const [argName, argRule] = argRuleEntries[i]
      const payloadArg = payload.arguments[argName]
      const args = Array.isArray(payloadArg)
        ? payloadArg
        : [payloadArg]

      const argResults = []
      for (let j = 0, len = args.length; j < len; j++) {
        const arg = args[j]
        const result = checkConditions(
          bgioArguments,
          argRule,
          { target: arg },
          { ...context, moveArguments: payload.arguments }
        )
        argResults.push(result)
        if (!result.conditionsAreMet) {
          break
        }
      }

      const argConditionsAreMet = argResults.at(-1).conditionsAreMet
      argumentResults[argName] = {
        results: argResults,
        conditionsAreMet: argConditionsAreMet
      }
      if (!argConditionsAreMet) {
        break
      }
    }

    const moveResults = checkConditions(
      bgioArguments,
      { conditions: this.rule.conditions },
      undefined,
      { ...context, moveArguments: payload.arguments }
    )

    return {
      argumentResults,
      moveResults,
      conditionsAreMet: moveResults.conditionsAreMet
        && Object.values(argumentResults).every(a => a.conditionsAreMet)
    }
  }

  isValid (bgioArguments, payload, context) {
    const conditionResults = this.checkValidity(
      bgioArguments,
      payload,
      context
    )
    return conditionResults.conditionsAreMet
  }

  doMove (bgioArguments, payload, context, { skipCheck = false } = {}) {
    const rule = resolveProperties(
      bgioArguments,
      this.rule,
      context
    )
    const resolvedPayload = {
      ...payload,
      arguments: Object.entries(rule.arguments ?? {})
        .reduce((acc, [argName, arg]) => {
          return {
            ...acc,
            [argName]: payload?.arguments?.[argName] ?? arg
          };
        }, {})
    };

    // does not store automatic moves, do we need that?
    if (rule.name) {
      bgioArguments.G._meta.previousPayloads[rule.name] = resolvedPayload
    }

    let conditionResults
    if (!skipCheck) {
      conditionResults = this.checkValidity(bgioArguments, resolvedPayload, context)
    }

    if (!skipCheck && !conditionResults.conditionsAreMet) {
      return INVALID_MOVE
    } else {
      this.do(bgioArguments, rule, resolvedPayload, context)
      if (context) {
        context.previousArguments = resolvedPayload.arguments
      }
    }

    return { conditionResults }
  }

  transformRule (rule) {
    const args = rule.arguments
    for (let key in args) {
      const arg = args[key]
      if (!arg.playerChoice) {
        arg.resolveAsEntity = true
      }
    }
    return rule
  }
}
