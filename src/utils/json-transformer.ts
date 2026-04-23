type TransformRule = {
  test: (val: unknown) => boolean;
  replace: (val: unknown) => unknown;
};

/** Recurse and replace. Circular references not allowed. */
export default function transformJSON<T> (data: T, rules: TransformRule[]): T {
  return JSON.parse(JSON.stringify(data), (_key, value: unknown) => {
    let result = value;
    for (const rule of rules) {
      if (rule.test(result)) {
        result = rule.replace(result);
      }
    }
    return result;
  }) as T;
}
