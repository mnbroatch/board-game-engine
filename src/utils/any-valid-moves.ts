import isPlainObject from "lodash/isPlainObject.js";
import type { BgioResolveState } from "./bgio-resolve-types.js";
import resolveProperties from "./resolve-properties.js";
import resolveEntity from "./resolve-entity.js";

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

  for (const value of Object.values(obj as object)) {
    findMoveArgumentReferences(value, refs);
  }

  return refs;
}

// Build a dependency graph and return topologically sorted argument names
function getArgumentOrder (ruleArguments: Record<string, unknown>) {
  const argNames = Object.keys(ruleArguments);
  const graph: Record<string, string[]> = {};
  const inDegree: Record<string, number> = {};

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

type MoveEntry = {
  moveInstance: { isValid: (a: unknown, p: unknown, c: unknown) => boolean; rule: unknown };
};

// Recursively try to build a valid argument combination
function findValidCombination (
  bgioArguments: BgioResolveState,
  moveInstance: MoveEntry["moveInstance"],
  ruleArguments: Record<string, unknown>,
  orderedArgNames: string[],
  context: Record<string, unknown>,
  index = 0,
  currentArgs: Record<string, unknown> = {}
): boolean {
  // Base case: all arguments resolved
  if (index === orderedArgNames.length) {
    const resolvedPayload = { arguments: currentArgs };
    return moveInstance.isValid(bgioArguments, resolvedPayload, context);
  }
  
  const argName = orderedArgNames[index];
  const arg = ruleArguments[argName];
  
  // Update context with current arguments for dependency resolution
  const updatedContext = {
    ...context,
    moveArguments: currentArgs
  };
  
  // Get all possible values for this argument if not resolved
  // If it is unresolved, it means it was a playerChoice
  const matches = isPlainObject(arg)
    ? resolveEntity(
      bgioArguments,
      { ...(arg as Record<string, unknown>), matchMultiple: true },
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
      { ...currentArgs, [argName]: value }
    );
  });
}

export default function areThereValidMoves (
  bgioArguments: unknown,
  moves: Record<string, unknown>
) {
  const bgio = bgioArguments as BgioResolveState;
  return Object.values(moves).some((move) => {
    const moveInstance = (move as MoveEntry | undefined)?.moveInstance;
    if (!moveInstance) return false;
    const context = { moveInstance };
    const rule = resolveProperties(
      bgio,
      moveInstance.rule,
      context
    ) as { arguments?: Record<string, unknown> };

    const ruleArguments = rule.arguments ?? {};
    
    // If no arguments required, just check if move is valid
    if (Object.keys(ruleArguments).length === 0) {
      return moveInstance.isValid(bgio, { arguments: {} }, context);
    }
    
    // Get dependency-ordered argument names
    const orderedArgNames = getArgumentOrder(ruleArguments);
    
    // Recursively search for any valid combination (short-circuits on first valid)
    return findValidCombination(
      bgio,
      moveInstance,
      ruleArguments,
      orderedArgNames,
      context
    );
  });
}
