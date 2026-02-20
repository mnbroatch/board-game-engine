export default function get (obj, pathArray) {
  let current = obj;
  
  for (const step of pathArray) {
    if (current === undefined) {
      return current
    }
    
    if (step?.flatten) {
      if (!Array.isArray(current)) {
        return undefined;
      }
      
      current = current.flat();
      
      if (step.map) {
        current = current.map(item => get(item, step.map));
      }
    } else {
      current = current[step];
    }
  }
  
  return current;
}
