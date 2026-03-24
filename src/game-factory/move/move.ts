import { INVALID_MOVE } from "@mnbroatch/boardgame.io/dist/cjs/core.js";
import type { Condition, MoveDefinition } from "../../types/bagel-types.js";
import checkConditions from "../../utils/check-conditions.js";
import resolveProperties from "../../utils/resolve-properties.js";
import type { BgioResolveState } from "../../utils/bgio-resolve-types.js";

export default class Move {
  rule: MoveDefinition;

  constructor (rule: MoveDefinition) {
    this.rule = this.transformRule(rule as Parameters<Move["transformRule"]>[0]) as MoveDefinition;
  }

  checkValidity (bgioArguments: unknown, payload: { arguments: Record<string, unknown> }, context: Record<string, unknown>) {
    const moveArguments =
      "arguments" in this.rule && this.rule.arguments
        ? this.rule.arguments
        : {};
    const argRuleEntries = Object.entries(moveArguments) as [string, { conditions?: Condition[] }][];

    if (
      !argRuleEntries.every(([argName]) => {
        const arg = payload.arguments[argName];
        return arg !== undefined && (!Array.isArray(arg) || arg.length);
      })
    ) {
      return false;
    }

    const argumentResults: Record<string, { results: unknown[]; conditionsAreMet: boolean }> = {};

    for (let i = 0, len = argRuleEntries.length; i < len; i++) {
      const [argName, argRule] = argRuleEntries[i];
      const payloadArg = payload.arguments[argName];
      const args = Array.isArray(payloadArg)
        ? payloadArg
        : [payloadArg];

      const argResults: unknown[] = [];
      for (let j = 0, lenj = args.length; j < lenj; j++) {
        const arg = args[j];
        const result = checkConditions(
          bgioArguments as BgioResolveState,
          argRule.conditions,
          { target: arg },
          { ...context, moveArguments: payload.arguments }
        );
        argResults.push(result);
        if (!result.conditionsAreMet) {
          break;
        }
      }

      const last = argResults[argResults.length - 1] as { conditionsAreMet: boolean } | undefined;
      const argConditionsAreMet = last?.conditionsAreMet ?? false;
      argumentResults[argName] = {
        results: argResults,
        conditionsAreMet: argConditionsAreMet,
      };
      if (!argConditionsAreMet) {
        break;
      }
    }

    const moveResults = checkConditions(
      bgioArguments as BgioResolveState,
      (this.rule as { conditions?: Condition[] }).conditions,
      {},
      { ...context, moveArguments: payload.arguments }
    );

    return {
      argumentResults,
      moveResults,
      conditionsAreMet: moveResults.conditionsAreMet
        && Object.values(argumentResults).every((a) => a.conditionsAreMet),
    };
  }

  isValid (bgioArguments: unknown, payload: { arguments: Record<string, unknown> }, context: Record<string, unknown>) {
    const conditionResults = this.checkValidity(
      bgioArguments,
      payload,
      context
    );
    if (conditionResults === false) return false;
    return conditionResults.conditionsAreMet;
  }

  doMove (
    bgioArguments: unknown,
    payload: { arguments?: Record<string, unknown> } | undefined,
    context: Record<string, unknown>,
    { skipCheck = false } = {}
  ) {
    const rule = resolveProperties(
      bgioArguments as BgioResolveState,
      this.rule,
      context
    ) as { name?: string; arguments?: Record<string, unknown> };
    const resolvedPayload = {
      ...payload,
      arguments: Object.entries(rule.arguments ?? {})
        .reduce<Record<string, unknown>>((acc, [argName, arg]) => ({
          ...acc,
          [argName]: payload?.arguments?.[argName] ?? arg,
        }), {}),
    };

    if (rule.name) {
      (bgioArguments as { G: { _meta: { previousPayloads: Record<string, unknown> } } }).G._meta.previousPayloads[rule.name] = resolvedPayload;
    }

    let conditionResults: ReturnType<Move["checkValidity"]> | undefined;
    if (!skipCheck) {
      conditionResults = this.checkValidity(bgioArguments, resolvedPayload as { arguments: Record<string, unknown> }, context);
    }

    if (!skipCheck && conditionResults !== false && !conditionResults!.conditionsAreMet) {
      return INVALID_MOVE;
    } else {
      this.do(bgioArguments, rule, resolvedPayload, context);
      if (context) {
        context.previousArguments = resolvedPayload.arguments;
      }
    }

    return { conditionResults };
  }

  do (_bgioArguments: unknown, _rule: unknown, _resolvedPayload: unknown, _context: unknown) {
    throw new Error("Move#do must be implemented by subclass");
  }

  transformRule (rule: { arguments?: Record<string, { playerChoice?: boolean; resolveAsEntity?: boolean }> }) {
    const args = rule.arguments;
    if (args) {
      for (const key in args) {
        const arg = args[key];
        if (arg && !arg.playerChoice) {
          arg.resolveAsEntity = true;
        }
      }
    }
    return rule;
  }
}
