import { INVALID_MOVE } from "@mnbroatch/boardgame.io/dist/cjs/core.js";
import type {
  Condition,
  MoveArgumentBinding,
  MoveDefinition,
} from "../../types/expanded-game-types.js";
import type { MovePayload } from "../../types/move-payload.js";
import type { MoveArgumentsMap } from "../../types/move-arguments.js";
import type { MoveArgumentsState, ResolutionContext } from "../../types/resolution-context.js";
import checkConditions from "../../utils/check-conditions.js";
import resolveProperties from "../../utils/resolve-properties.js";
import type { BgioReadonlyState, BgioResolveState } from "../../utils/bgio-resolve-types.js";
import type { EngineEntity } from "../../types/runtime-entity.js";

export default class Move<TArgs extends MoveArgumentsMap = MoveArgumentsMap> {
  rule: MoveDefinition;

  constructor (rule: MoveDefinition) {
    this.rule = this.transformRule(rule as Parameters<Move["transformRule"]>[0]) as MoveDefinition;
  }

  checkValidity (bgioArguments: BgioReadonlyState | BgioResolveState, payload: MovePayload<TArgs>, context: ResolutionContext) {
    const moveArguments =
      "arguments" in this.rule && this.rule.arguments
        ? this.rule.arguments
        : {};
    const argRuleEntries = Object.entries(moveArguments) as [string, MoveArgumentBinding][];

    const payloadArgs: Partial<TArgs> & MoveArgumentsState = (payload.arguments ?? {}) as Partial<TArgs> & MoveArgumentsState;
    if (
      !argRuleEntries.every(([argName]) => {
        const arg = payloadArgs[argName];
        return arg !== undefined && (!Array.isArray(arg) || arg.length);
      })
    ) {
      return false;
    }

    const argumentResults: Record<string, { results: unknown[]; conditionsAreMet: boolean }> = {};

    for (let i = 0, len = argRuleEntries.length; i < len; i++) {
      const [argName, argRule] = argRuleEntries[i];
      const payloadArg = payloadArgs[argName];
      const args = Array.isArray(payloadArg)
        ? payloadArg
        : [payloadArg];

      const argResults: unknown[] = [];
      for (let j = 0, lenj = args.length; j < lenj; j++) {
        const arg = args[j];
        const result = checkConditions(
          bgioArguments,
          argRule.conditions,
          { target: arg as unknown as EngineEntity | EngineEntity[] | undefined },
          { ...context, moveArguments: payloadArgs }
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
      bgioArguments,
      (this.rule as { conditions?: Condition[] }).conditions,
      {},
      { ...context, moveArguments: payloadArgs }
    );

    return {
      argumentResults,
      moveResults,
      conditionsAreMet: moveResults.conditionsAreMet
        && Object.values(argumentResults).every((a) => a.conditionsAreMet),
    };
  }

  isValid (bgioArguments: BgioReadonlyState | BgioResolveState, payload: MovePayload<TArgs>, context: ResolutionContext) {
    const conditionResults = this.checkValidity(
      bgioArguments,
      payload,
      context
    );
    if (conditionResults === false) return false;
    return conditionResults.conditionsAreMet;
  }

  doMove (
    bgioArguments: BgioReadonlyState | BgioResolveState,
    payload: MovePayload<TArgs> | undefined,
    context: ResolutionContext,
    { skipCheck = false } = {}
  ) {
    const rule = resolveProperties(
      bgioArguments,
      this.rule,
      context
    ) as MoveDefinition;
    const ruleArguments =
      "arguments" in rule && rule.arguments
        ? rule.arguments
        : {};
    const resolvedArguments = Object.entries(ruleArguments as Record<string, MoveArgumentBinding>)
      .reduce<MoveArgumentsState>((acc, [argName, arg]) => ({
        ...acc,
        [argName]: (payload?.arguments as MoveArgumentsState | undefined)?.[argName] ?? arg,
      }), {});
    const resolvedPayload: MovePayload<TArgs> = {
      ...payload,
      arguments: resolvedArguments as Partial<TArgs>,
    };

    if (rule.name) {
      const { G } = bgioArguments;
      G._meta.previousPayloads[rule.name] = resolvedPayload;
    }

    let conditionResults: ReturnType<Move<TArgs>["checkValidity"]> | undefined;
    if (!skipCheck) {
      conditionResults = this.checkValidity(bgioArguments, resolvedPayload, context);
      if (conditionResults !== false && !conditionResults.conditionsAreMet) {
        return INVALID_MOVE;
      }
    }

    this.do(bgioArguments, rule, resolvedPayload, context);
    context.previousArguments = resolvedPayload.arguments as MoveArgumentsState | undefined;

    return { conditionResults };
  }

  do (
    _bgioArguments: BgioReadonlyState | BgioResolveState,
    _rule: MoveDefinition,
    _resolvedPayload: MovePayload<TArgs>,
    _context: ResolutionContext
  ) {
    throw new Error("Move#do must be implemented by subclass");
  }

  transformRule<R extends { arguments?: Record<string, MoveArgumentBinding> }> (rule: R): R {
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
