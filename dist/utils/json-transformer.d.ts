type TransformRule = {
    test: (val: unknown) => boolean;
    replace: (val: unknown) => unknown;
};
/** Recurse and replace. Circular references not allowed. */
export default function transformJSON<T>(data: T, rules: TransformRule[]): T;
export {};
//# sourceMappingURL=json-transformer.d.ts.map