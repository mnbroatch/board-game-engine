// todo: return found object along w/ path
export default function findValuePath (
  obj,
  compare,
  currentPath = [],
  visited = new Set()
) {
  // Check for circular reference
  if (visited.has(obj)) {
    return null; // Circular reference detected, short-circuit
  }

  visited.add(obj); // Mark the current object as visited

  if (compare(obj)) {
    return currentPath;
  }

  if (typeof obj === 'object' && obj !== null) {
    for (const key in obj) {
      const newPath = [...currentPath, key];
      const result = findValuePath(obj[key], compare, newPath, visited);
      if (result) {
        return result;
      }
    }
  }

  return null; // Return null if the value is not found
}
