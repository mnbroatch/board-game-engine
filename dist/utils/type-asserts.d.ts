export declare function isRecord(value: unknown): value is Record<string, unknown>;
export declare function assertRecord(value: unknown, message: string): asserts value is Record<string, unknown>;
export declare function assertArray(value: unknown, message: string): asserts value is unknown[];
export declare function assertString(value: unknown, message: string): asserts value is string;
export declare function assertNumber(value: unknown, message: string): asserts value is number;
export declare function assertBoolean(value: unknown, message: string): asserts value is boolean;
export declare function assertHasConditionIsMet(value: unknown, message: string): asserts value is {
    conditionIsMet: boolean;
};
//# sourceMappingURL=type-asserts.d.ts.map