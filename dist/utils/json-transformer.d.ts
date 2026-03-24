type TransformRule = {
    test: (val: unknown) => boolean;
    replace: (val: unknown) => unknown;
};
/** Recurse and replace. Circular references not allowed. */
export default function transformJSON(data: unknown, rules: TransformRule[]): unknown;
export {};
//# sourceMappingURL=json-transformer.d.ts.map