type PathStep = string | number | { flatten: boolean; map?: (string | number)[] };

export default function get (obj: unknown, pathArray: PathStep[]): unknown {
  let current: unknown = obj;

  for (const step of pathArray) {
    if (current === undefined) {
      return current;
    }

    if (step && typeof step === "object" && "flatten" in step && step.flatten) {
      if (!Array.isArray(current)) {
        return undefined;
      }

      let flat = current.flat() as unknown[];

      if (step.map) {
        flat = flat.map((item) => get(item, step.map!));
      }
      current = flat;
    } else {
      current = (current as Record<string | number, unknown>)[step as string | number];
    }
  }

  return current;
}
