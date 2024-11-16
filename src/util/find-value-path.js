// todo: return found object along w/ path
export default function findValuePath(
  obj,
  compare,
  currentPath = [],
  visited = new Set(),
  results = new Set(),
) {
  // Check for circular reference
  if (visited.has(obj)) {
    return results; // Circular reference detected, short-circuit
  }

  visited.add(obj); // Mark the current object as visited

  if (compare(obj)) {
    results.add(currentPath);
  }

  if (typeof obj === "object" && obj !== null) {
    for (const key in obj) {
      const newPath = [...currentPath, key];
      const result = findValuePath(
        obj[key],
        compare,
        newPath,
        visited,
        results,
      );
      if (result.length) {
        results.add(currentPath);
      }
    }
  }

  return results;
}
