import isPlainObject from "lodash/isPlainObject.js";
import type { BoardgameEngineMove } from "../game-factory/move/move-factory.js";
import type { MoveArgumentBinding } from "../types/expanded-game-types.js";
import type { MoveArgumentValue, MoveArgumentsState, ResolutionContext } from "../types/resolution-context.js";
import type { BgioReadonlyState, BgioResolveState } from "./bgio-resolve-types.js";
import resolveProperties from "./resolve-properties.js";
import resolveEntity from "./resolve-entity.js";
import { isRecord } from "./type-asserts.js";

// Recursively find all contextPath references to moveArguments
function findMoveArgumentReferences (obj: unknown, refs = new Set<string>()): Set<string> {
  if (!obj || typeof obj !== "object") {
    return refs;
  }

  const o = obj as { type?: string; path?: unknown[] };
  if (o.type === "contextPath" && Array.isArray(o.path)) {
    if (o.path[0] === "moveArguments" && o.path[1]) {
      refs.add(String(o.path[1]));
    }
  }

  if (isRecord(obj)) {
    for (const value of Object.values(obj)) {
      findMoveArgumentReferences(value, refs);
    }
  }

  return refs;
}

// Build a dependency graph and return topologically sorted argument names
type RuleArgumentsShape = { [argumentName: string]: MoveArgumentBinding | undefined };

function getArgumentOrder (ruleArguments: RuleArgumentsShape) {
  const argNames = Object.keys(ruleArguments);
  const graph: { [name: string]: string[] } = {};
  const inDegree: { [name: string]: number } = {};

  argNames.forEach((name) => {
    graph[name] = [];
    inDegree[name] = 0;
  });

  argNames.forEach((argName) => {
    const arg = ruleArguments[argName];
    const referencedArgs = findMoveArgumentReferences(arg);

    referencedArgs.forEach((refArg) => {
      if (argNames.includes(refArg) && refArg !== argName) {
        graph[refArg].push(argName);
        inDegree[argName]++;
      }
    });
  });

  const queue = argNames.filter((name) => inDegree[name] === 0);
  const sorted: string[] = [];

  while (queue.length > 0) {
    const current = queue.shift()!;
    sorted.push(current);

    graph[current].forEach((neighbor) => {
      inDegree[neighbor]--;
      if (inDegree[neighbor] === 0) {
        queue.push(neighbor);
      }
    });
  }

  return sorted.length === argNames.length ? sorted : argNames;
}

// Recursively try to build a valid argument combination
function findValidCombination (
  bgioArguments: BgioReadonlyState | BgioResolveState,
  moveInstance: BoardgameEngineMove["moveInstance"],
  ruleArguments: RuleArgumentsShape,
  orderedArgNames: string[],
  context: ResolutionContext,
  index = 0,
  currentArgs: MoveArgumentsState = {}
): boolean {
  // Base case: all arguments resolved
  if (index === orderedArgNames.length) {
    const resolvedPayload = { arguments: currentArgs };
    return moveInstance.isValid(bgioArguments, resolvedPayload, context);
  }
  
  const argName = orderedArgNames[index];
  const arg = ruleArguments[argName];
  
  // Update context with current arguments for dependency resolution
  const updatedContext: ResolutionContext = {
    ...context,
    moveArguments: currentArgs
  };
  
  // Get all possible values for this argument if not resolved
  // If it is unresolved, it means it was a playerChoice
  const matches = (isPlainObject(arg) && isRecord(arg))
    ? resolveEntity(
      bgioArguments,
      { ...arg, matchMultiple: true },
      updatedContext,
      argName 
    )
    : arg;
  
  const matchArray = Array.isArray(matches) ? matches : (matches !== undefined ? [matches] : []);
  
  // If no valid values for this argument, this branch fails
  if (matchArray.length === 0) {
    return false;
  }
  
  // Try each possible value (short-circuits on first success)
  return matchArray.some((value: unknown) => {
    return findValidCombination(
      bgioArguments,
      moveInstance,
      ruleArguments,
      orderedArgNames,
      context,
      index + 1,
      { ...currentArgs, [argName]: value as MoveArgumentValue }
    );
  });
}

export default function areThereValidMoves (
  bgioArguments: BgioReadonlyState | BgioResolveState,
  moves: { [moveName: string]: unknown }
) {
  return Object.values(moves).some((move) => {
    const moveInstance = (move as BoardgameEngineMove | undefined)?.moveInstance;
    if (!moveInstance) return false;
    const context: ResolutionContext = { moveInstance };
    const rule = resolveProperties(
      bgioArguments,
      moveInstance.rule,
      context
    ) as { arguments?: RuleArgumentsShape };

    const ruleArguments: RuleArgumentsShape = rule.arguments ?? {};
    
    // If no arguments required, just check if move is valid
    if (Object.keys(ruleArguments).length === 0) {
      return moveInstance.isValid(bgioArguments, { arguments: {} }, context);
    }
    
    // Get dependency-ordered argument names
    const orderedArgNames = getArgumentOrder(ruleArguments);
    
    // Recursively search for any valid combination (short-circuits on first valid)
    return findValidCombination(
      bgioArguments,
      moveInstance,
      ruleArguments,
      orderedArgNames,
      context
    );
  });
}
