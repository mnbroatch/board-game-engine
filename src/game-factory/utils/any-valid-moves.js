import isPlainObject from "lodash/isPlainObject.js";
import resolveProperties from "./resolve-properties.js";
import resolveEntity from "./resolve-entity.js";

// Recursively find all contextPath references to moveArguments
function findMoveArgumentReferences(obj, refs = new Set()) {
  if (!obj || typeof obj !== 'object') {
    return refs;
  }
  
  // Check if this is a contextPath reference to moveArguments
  if (obj.type === 'contextPath' && Array.isArray(obj.path)) {
    if (obj.path[0] === 'moveArguments' && obj.path[1]) {
      refs.add(obj.path[1]);
    }
  }
  
  // Recurse into object properties and array elements
  for (const value of Object.values(obj)) {
    findMoveArgumentReferences(value, refs);
  }
  
  return refs;
}

// Build a dependency graph and return topologically sorted argument names
function getArgumentOrder(ruleArguments) {
  const argNames = Object.keys(ruleArguments);
  const graph = {};
  const inDegree = {};
  
  // Initialize
  argNames.forEach(name => {
    graph[name] = [];
    inDegree[name] = 0;
  });
  
  // Build dependency edges (if arg B references arg A, A -> B)
  argNames.forEach(argName => {
    const arg = ruleArguments[argName];
    const referencedArgs = findMoveArgumentReferences(arg);
    
    referencedArgs.forEach(refArg => {
      if (argNames.includes(refArg) && refArg !== argName) {
        graph[refArg].push(argName);
        inDegree[argName]++;
      }
    });
  });
  
  // Topological sort (Kahn's algorithm)
  const queue = argNames.filter(name => inDegree[name] === 0);
  const sorted = [];
  
  while (queue.length > 0) {
    const current = queue.shift();
    sorted.push(current);
    
    graph[current].forEach(neighbor => {
      inDegree[neighbor]--;
      if (inDegree[neighbor] === 0) {
        queue.push(neighbor);
      }
    });
  }
  
  // If not all nodes processed, there's a cycle - fall back to original order
  return sorted.length === argNames.length ? sorted : argNames;
}

// Recursively try to build a valid argument combination
function findValidCombination(
  bgioArguments, 
  moveInstance,
  ruleArguments,
  orderedArgNames,
  context,
  index = 0,
  currentArgs = {}
) {
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
  return matchArray.some(value => {
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

export default function areThereValidMoves(bgioArguments, moves) {
  return Object.values(moves).some(move => {
    const { moveInstance } = move;
    const context = { moveInstance };
    const rule = resolveProperties(
      bgioArguments,
      moveInstance.rule,
      context
    );

    const ruleArguments = rule.arguments ?? {};
    
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
