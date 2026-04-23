import { z } from "zod";
export declare const IsConditionSchema: z.ZodObject<{
    conditionType: z.ZodLiteral<"Is">;
    target: z.ZodOptional<z.ZodUnknown>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    conditionType: z.ZodLiteral<"Is">;
    target: z.ZodOptional<z.ZodUnknown>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    conditionType: z.ZodLiteral<"Is">;
    target: z.ZodOptional<z.ZodUnknown>;
}, z.ZodTypeAny, "passthrough">>;
export declare const ContainsConditionSchema: z.ZodObject<{
    conditionType: z.ZodLiteral<"Contains">;
    target: z.ZodOptional<z.ZodUnknown>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    conditionType: z.ZodLiteral<"Contains">;
    target: z.ZodOptional<z.ZodUnknown>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    conditionType: z.ZodLiteral<"Contains">;
    target: z.ZodOptional<z.ZodUnknown>;
}, z.ZodTypeAny, "passthrough">>;
export declare const NotConditionSchema: z.ZodObject<{
    conditionType: z.ZodLiteral<"Not">;
    conditions: z.ZodArray<z.ZodUnknown, "many">;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    conditionType: z.ZodLiteral<"Not">;
    conditions: z.ZodArray<z.ZodUnknown, "many">;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    conditionType: z.ZodLiteral<"Not">;
    conditions: z.ZodArray<z.ZodUnknown, "many">;
}, z.ZodTypeAny, "passthrough">>;
export declare const OrConditionSchema: z.ZodObject<{
    conditionType: z.ZodLiteral<"Or">;
    conditions: z.ZodArray<z.ZodUnknown, "many">;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    conditionType: z.ZodLiteral<"Or">;
    conditions: z.ZodArray<z.ZodUnknown, "many">;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    conditionType: z.ZodLiteral<"Or">;
    conditions: z.ZodArray<z.ZodUnknown, "many">;
}, z.ZodTypeAny, "passthrough">>;
export declare const SomeConditionSchema: z.ZodObject<{
    conditionType: z.ZodLiteral<"Some">;
    target: z.ZodUnknown;
    conditions: z.ZodArray<z.ZodUnknown, "many">;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    conditionType: z.ZodLiteral<"Some">;
    target: z.ZodUnknown;
    conditions: z.ZodArray<z.ZodUnknown, "many">;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    conditionType: z.ZodLiteral<"Some">;
    target: z.ZodUnknown;
    conditions: z.ZodArray<z.ZodUnknown, "many">;
}, z.ZodTypeAny, "passthrough">>;
export declare const EveryConditionSchema: z.ZodObject<{
    conditionType: z.ZodLiteral<"Every">;
    target: z.ZodUnknown;
    conditions: z.ZodArray<z.ZodUnknown, "many">;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    conditionType: z.ZodLiteral<"Every">;
    target: z.ZodUnknown;
    conditions: z.ZodArray<z.ZodUnknown, "many">;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    conditionType: z.ZodLiteral<"Every">;
    target: z.ZodUnknown;
    conditions: z.ZodArray<z.ZodUnknown, "many">;
}, z.ZodTypeAny, "passthrough">>;
export declare const InLineConditionSchema: z.ZodObject<{
    conditionType: z.ZodLiteral<"InLine">;
    target: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
        type: z.ZodLiteral<"ctxPath">;
        path: z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodNumber]>, "many">;
    }, "strict", z.ZodTypeAny, {
        type: "ctxPath";
        path: (string | number)[];
    }, {
        type: "ctxPath";
        path: (string | number)[];
    }>, z.ZodObject<{
        type: z.ZodLiteral<"contextPath">;
        path: z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodObject<{
            flatten: z.ZodBoolean;
            map: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strict", z.ZodTypeAny, {
            flatten: boolean;
            map?: string[] | undefined;
        }, {
            flatten: boolean;
            map?: string[] | undefined;
        }>]>, "many">;
    }, "strict", z.ZodTypeAny, {
        type: "contextPath";
        path: (string | number | {
            flatten: boolean;
            map?: string[] | undefined;
        })[];
    }, {
        type: "contextPath";
        path: (string | number | {
            flatten: boolean;
            map?: string[] | undefined;
        })[];
    }>, z.ZodObject<{
        type: z.ZodLiteral<"gamePath">;
        path: z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodNumber]>, "many">;
    }, "strict", z.ZodTypeAny, {
        type: "gamePath";
        path: (string | number)[];
    }, {
        type: "gamePath";
        path: (string | number)[];
    }>, z.ZodObject<{
        type: z.ZodLiteral<"expression">;
        expression: z.ZodString;
        arguments: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    }, "strict", z.ZodTypeAny, {
        arguments: Record<string, unknown>;
        type: "expression";
        expression: string;
    }, {
        arguments: Record<string, unknown>;
        type: "expression";
        expression: string;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"relativeCoordinates">;
        target: z.ZodOptional<z.ZodUnknown>;
        location: z.ZodUnion<[z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>, z.ZodUnknown]>;
    }, "strict", z.ZodTypeAny, {
        type: "relativeCoordinates";
        target?: unknown;
        location?: unknown;
    }, {
        type: "relativeCoordinates";
        target?: unknown;
        location?: unknown;
    }>, z.ZodObject<{
        type: z.ZodEnum<["coordinates", "Coordinates"]>;
        target: z.ZodOptional<z.ZodUnknown>;
    }, "strict", z.ZodTypeAny, {
        type: "coordinates" | "Coordinates";
        target?: unknown;
    }, {
        type: "coordinates" | "Coordinates";
        target?: unknown;
    }>, z.ZodObject<{
        type: z.ZodEnum<["relativePath", "RelativePath"]>;
        target: z.ZodUnknown;
        path: z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodNumber]>, "many">;
    }, "strict", z.ZodTypeAny, {
        type: "relativePath" | "RelativePath";
        path: (string | number)[];
        target?: unknown;
    }, {
        type: "relativePath" | "RelativePath";
        path: (string | number)[];
        target?: unknown;
    }>, z.ZodObject<{
        type: z.ZodEnum<["parent", "Parent"]>;
        target: z.ZodOptional<z.ZodUnknown>;
    }, "strict", z.ZodTypeAny, {
        type: "parent" | "Parent";
        target?: unknown;
    }, {
        type: "parent" | "Parent";
        target?: unknown;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"map">;
        targets: z.ZodUnknown;
        mapping: z.ZodUnknown;
    }, "strict", z.ZodTypeAny, {
        type: "map";
        targets?: unknown;
        mapping?: unknown;
    }, {
        type: "map";
        targets?: unknown;
        mapping?: unknown;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"mapMax">;
        targets: z.ZodUnknown;
        mapping: z.ZodUnknown;
    }, "strict", z.ZodTypeAny, {
        type: "mapMax";
        targets?: unknown;
        mapping?: unknown;
    }, {
        type: "mapMax";
        targets?: unknown;
        mapping?: unknown;
    }>, z.ZodObject<{
        type: z.ZodEnum<["pick", "Pick"]>;
        target: z.ZodUnknown;
        properties: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        type: "pick" | "Pick";
        properties: string[];
        target?: unknown;
    }, {
        type: "pick" | "Pick";
        properties: string[];
        target?: unknown;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"count">;
        conditions: z.ZodArray<z.ZodUnknown, "many">;
    }, "strict", z.ZodTypeAny, {
        conditions: unknown[];
        type: "count";
    }, {
        conditions: unknown[];
        type: "count";
    }>]>>;
    sequence: z.ZodArray<z.ZodUnknown, "many">;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    conditionType: z.ZodLiteral<"InLine">;
    target: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
        type: z.ZodLiteral<"ctxPath">;
        path: z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodNumber]>, "many">;
    }, "strict", z.ZodTypeAny, {
        type: "ctxPath";
        path: (string | number)[];
    }, {
        type: "ctxPath";
        path: (string | number)[];
    }>, z.ZodObject<{
        type: z.ZodLiteral<"contextPath">;
        path: z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodObject<{
            flatten: z.ZodBoolean;
            map: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strict", z.ZodTypeAny, {
            flatten: boolean;
            map?: string[] | undefined;
        }, {
            flatten: boolean;
            map?: string[] | undefined;
        }>]>, "many">;
    }, "strict", z.ZodTypeAny, {
        type: "contextPath";
        path: (string | number | {
            flatten: boolean;
            map?: string[] | undefined;
        })[];
    }, {
        type: "contextPath";
        path: (string | number | {
            flatten: boolean;
            map?: string[] | undefined;
        })[];
    }>, z.ZodObject<{
        type: z.ZodLiteral<"gamePath">;
        path: z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodNumber]>, "many">;
    }, "strict", z.ZodTypeAny, {
        type: "gamePath";
        path: (string | number)[];
    }, {
        type: "gamePath";
        path: (string | number)[];
    }>, z.ZodObject<{
        type: z.ZodLiteral<"expression">;
        expression: z.ZodString;
        arguments: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    }, "strict", z.ZodTypeAny, {
        arguments: Record<string, unknown>;
        type: "expression";
        expression: string;
    }, {
        arguments: Record<string, unknown>;
        type: "expression";
        expression: string;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"relativeCoordinates">;
        target: z.ZodOptional<z.ZodUnknown>;
        location: z.ZodUnion<[z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>, z.ZodUnknown]>;
    }, "strict", z.ZodTypeAny, {
        type: "relativeCoordinates";
        target?: unknown;
        location?: unknown;
    }, {
        type: "relativeCoordinates";
        target?: unknown;
        location?: unknown;
    }>, z.ZodObject<{
        type: z.ZodEnum<["coordinates", "Coordinates"]>;
        target: z.ZodOptional<z.ZodUnknown>;
    }, "strict", z.ZodTypeAny, {
        type: "coordinates" | "Coordinates";
        target?: unknown;
    }, {
        type: "coordinates" | "Coordinates";
        target?: unknown;
    }>, z.ZodObject<{
        type: z.ZodEnum<["relativePath", "RelativePath"]>;
        target: z.ZodUnknown;
        path: z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodNumber]>, "many">;
    }, "strict", z.ZodTypeAny, {
        type: "relativePath" | "RelativePath";
        path: (string | number)[];
        target?: unknown;
    }, {
        type: "relativePath" | "RelativePath";
        path: (string | number)[];
        target?: unknown;
    }>, z.ZodObject<{
        type: z.ZodEnum<["parent", "Parent"]>;
        target: z.ZodOptional<z.ZodUnknown>;
    }, "strict", z.ZodTypeAny, {
        type: "parent" | "Parent";
        target?: unknown;
    }, {
        type: "parent" | "Parent";
        target?: unknown;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"map">;
        targets: z.ZodUnknown;
        mapping: z.ZodUnknown;
    }, "strict", z.ZodTypeAny, {
        type: "map";
        targets?: unknown;
        mapping?: unknown;
    }, {
        type: "map";
        targets?: unknown;
        mapping?: unknown;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"mapMax">;
        targets: z.ZodUnknown;
        mapping: z.ZodUnknown;
    }, "strict", z.ZodTypeAny, {
        type: "mapMax";
        targets?: unknown;
        mapping?: unknown;
    }, {
        type: "mapMax";
        targets?: unknown;
        mapping?: unknown;
    }>, z.ZodObject<{
        type: z.ZodEnum<["pick", "Pick"]>;
        target: z.ZodUnknown;
        properties: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        type: "pick" | "Pick";
        properties: string[];
        target?: unknown;
    }, {
        type: "pick" | "Pick";
        properties: string[];
        target?: unknown;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"count">;
        conditions: z.ZodArray<z.ZodUnknown, "many">;
    }, "strict", z.ZodTypeAny, {
        conditions: unknown[];
        type: "count";
    }, {
        conditions: unknown[];
        type: "count";
    }>]>>;
    sequence: z.ZodArray<z.ZodUnknown, "many">;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    conditionType: z.ZodLiteral<"InLine">;
    target: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
        type: z.ZodLiteral<"ctxPath">;
        path: z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodNumber]>, "many">;
    }, "strict", z.ZodTypeAny, {
        type: "ctxPath";
        path: (string | number)[];
    }, {
        type: "ctxPath";
        path: (string | number)[];
    }>, z.ZodObject<{
        type: z.ZodLiteral<"contextPath">;
        path: z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodObject<{
            flatten: z.ZodBoolean;
            map: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strict", z.ZodTypeAny, {
            flatten: boolean;
            map?: string[] | undefined;
        }, {
            flatten: boolean;
            map?: string[] | undefined;
        }>]>, "many">;
    }, "strict", z.ZodTypeAny, {
        type: "contextPath";
        path: (string | number | {
            flatten: boolean;
            map?: string[] | undefined;
        })[];
    }, {
        type: "contextPath";
        path: (string | number | {
            flatten: boolean;
            map?: string[] | undefined;
        })[];
    }>, z.ZodObject<{
        type: z.ZodLiteral<"gamePath">;
        path: z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodNumber]>, "many">;
    }, "strict", z.ZodTypeAny, {
        type: "gamePath";
        path: (string | number)[];
    }, {
        type: "gamePath";
        path: (string | number)[];
    }>, z.ZodObject<{
        type: z.ZodLiteral<"expression">;
        expression: z.ZodString;
        arguments: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    }, "strict", z.ZodTypeAny, {
        arguments: Record<string, unknown>;
        type: "expression";
        expression: string;
    }, {
        arguments: Record<string, unknown>;
        type: "expression";
        expression: string;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"relativeCoordinates">;
        target: z.ZodOptional<z.ZodUnknown>;
        location: z.ZodUnion<[z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>, z.ZodUnknown]>;
    }, "strict", z.ZodTypeAny, {
        type: "relativeCoordinates";
        target?: unknown;
        location?: unknown;
    }, {
        type: "relativeCoordinates";
        target?: unknown;
        location?: unknown;
    }>, z.ZodObject<{
        type: z.ZodEnum<["coordinates", "Coordinates"]>;
        target: z.ZodOptional<z.ZodUnknown>;
    }, "strict", z.ZodTypeAny, {
        type: "coordinates" | "Coordinates";
        target?: unknown;
    }, {
        type: "coordinates" | "Coordinates";
        target?: unknown;
    }>, z.ZodObject<{
        type: z.ZodEnum<["relativePath", "RelativePath"]>;
        target: z.ZodUnknown;
        path: z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodNumber]>, "many">;
    }, "strict", z.ZodTypeAny, {
        type: "relativePath" | "RelativePath";
        path: (string | number)[];
        target?: unknown;
    }, {
        type: "relativePath" | "RelativePath";
        path: (string | number)[];
        target?: unknown;
    }>, z.ZodObject<{
        type: z.ZodEnum<["parent", "Parent"]>;
        target: z.ZodOptional<z.ZodUnknown>;
    }, "strict", z.ZodTypeAny, {
        type: "parent" | "Parent";
        target?: unknown;
    }, {
        type: "parent" | "Parent";
        target?: unknown;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"map">;
        targets: z.ZodUnknown;
        mapping: z.ZodUnknown;
    }, "strict", z.ZodTypeAny, {
        type: "map";
        targets?: unknown;
        mapping?: unknown;
    }, {
        type: "map";
        targets?: unknown;
        mapping?: unknown;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"mapMax">;
        targets: z.ZodUnknown;
        mapping: z.ZodUnknown;
    }, "strict", z.ZodTypeAny, {
        type: "mapMax";
        targets?: unknown;
        mapping?: unknown;
    }, {
        type: "mapMax";
        targets?: unknown;
        mapping?: unknown;
    }>, z.ZodObject<{
        type: z.ZodEnum<["pick", "Pick"]>;
        target: z.ZodUnknown;
        properties: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        type: "pick" | "Pick";
        properties: string[];
        target?: unknown;
    }, {
        type: "pick" | "Pick";
        properties: string[];
        target?: unknown;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"count">;
        conditions: z.ZodArray<z.ZodUnknown, "many">;
    }, "strict", z.ZodTypeAny, {
        conditions: unknown[];
        type: "count";
    }, {
        conditions: unknown[];
        type: "count";
    }>]>>;
    sequence: z.ZodArray<z.ZodUnknown, "many">;
}, z.ZodTypeAny, "passthrough">>;
export declare const HasLineConditionSchema: z.ZodObject<{
    conditionType: z.ZodLiteral<"HasLine">;
    target: z.ZodUnknown;
    sequence: z.ZodArray<z.ZodUnknown, "many">;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    conditionType: z.ZodLiteral<"HasLine">;
    target: z.ZodUnknown;
    sequence: z.ZodArray<z.ZodUnknown, "many">;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    conditionType: z.ZodLiteral<"HasLine">;
    target: z.ZodUnknown;
    sequence: z.ZodArray<z.ZodUnknown, "many">;
}, z.ZodTypeAny, "passthrough">>;
export declare const IsFullConditionSchema: z.ZodObject<{
    conditionType: z.ZodLiteral<"IsFull">;
    target: z.ZodUnknown;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    conditionType: z.ZodLiteral<"IsFull">;
    target: z.ZodUnknown;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    conditionType: z.ZodLiteral<"IsFull">;
    target: z.ZodUnknown;
}, z.ZodTypeAny, "passthrough">>;
export declare const NoPossibleMovesConditionSchema: z.ZodObject<{
    conditionType: z.ZodLiteral<"NoPossibleMoves">;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    conditionType: z.ZodLiteral<"NoPossibleMoves">;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    conditionType: z.ZodLiteral<"NoPossibleMoves">;
}, z.ZodTypeAny, "passthrough">>;
export declare const PositionConditionSchema: z.ZodObject<{
    conditionType: z.ZodLiteral<"Position">;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    conditionType: z.ZodLiteral<"Position">;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    conditionType: z.ZodLiteral<"Position">;
}, z.ZodTypeAny, "passthrough">>;
export declare const EvaluateConditionSchema: z.ZodObject<{
    conditionType: z.ZodLiteral<"Evaluate">;
    expression: z.ZodString;
    arguments: z.ZodRecord<z.ZodString, z.ZodUnknown>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    conditionType: z.ZodLiteral<"Evaluate">;
    expression: z.ZodString;
    arguments: z.ZodRecord<z.ZodString, z.ZodUnknown>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    conditionType: z.ZodLiteral<"Evaluate">;
    expression: z.ZodString;
    arguments: z.ZodRecord<z.ZodString, z.ZodUnknown>;
}, z.ZodTypeAny, "passthrough">>;
export declare const WouldConditionSchema: z.ZodObject<{
    conditionType: z.ZodLiteral<"Would">;
    conditions: z.ZodOptional<z.ZodArray<z.ZodUnknown, "many">>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    conditionType: z.ZodLiteral<"Would">;
    conditions: z.ZodOptional<z.ZodArray<z.ZodUnknown, "many">>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    conditionType: z.ZodLiteral<"Would">;
    conditions: z.ZodOptional<z.ZodArray<z.ZodUnknown, "many">>;
}, z.ZodTypeAny, "passthrough">>;
export type SchemaCondition = string | z.infer<typeof IsConditionSchema> | z.infer<typeof ContainsConditionSchema> | z.infer<typeof NotConditionSchema> | z.infer<typeof OrConditionSchema> | z.infer<typeof SomeConditionSchema> | z.infer<typeof EveryConditionSchema> | z.infer<typeof InLineConditionSchema> | z.infer<typeof HasLineConditionSchema> | z.infer<typeof IsFullConditionSchema> | z.infer<typeof NoPossibleMovesConditionSchema> | z.infer<typeof PositionConditionSchema> | z.infer<typeof EvaluateConditionSchema> | z.infer<typeof WouldConditionSchema>;
export declare const ConditionSchema: z.ZodUnion<[z.ZodString, z.ZodObject<{
    conditionType: z.ZodLiteral<"Is">;
    target: z.ZodOptional<z.ZodUnknown>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    conditionType: z.ZodLiteral<"Is">;
    target: z.ZodOptional<z.ZodUnknown>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    conditionType: z.ZodLiteral<"Is">;
    target: z.ZodOptional<z.ZodUnknown>;
}, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
    conditionType: z.ZodLiteral<"Contains">;
    target: z.ZodOptional<z.ZodUnknown>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    conditionType: z.ZodLiteral<"Contains">;
    target: z.ZodOptional<z.ZodUnknown>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    conditionType: z.ZodLiteral<"Contains">;
    target: z.ZodOptional<z.ZodUnknown>;
}, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
    conditionType: z.ZodLiteral<"Not">;
    conditions: z.ZodArray<z.ZodUnknown, "many">;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    conditionType: z.ZodLiteral<"Not">;
    conditions: z.ZodArray<z.ZodUnknown, "many">;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    conditionType: z.ZodLiteral<"Not">;
    conditions: z.ZodArray<z.ZodUnknown, "many">;
}, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
    conditionType: z.ZodLiteral<"Or">;
    conditions: z.ZodArray<z.ZodUnknown, "many">;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    conditionType: z.ZodLiteral<"Or">;
    conditions: z.ZodArray<z.ZodUnknown, "many">;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    conditionType: z.ZodLiteral<"Or">;
    conditions: z.ZodArray<z.ZodUnknown, "many">;
}, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
    conditionType: z.ZodLiteral<"Some">;
    target: z.ZodUnknown;
    conditions: z.ZodArray<z.ZodUnknown, "many">;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    conditionType: z.ZodLiteral<"Some">;
    target: z.ZodUnknown;
    conditions: z.ZodArray<z.ZodUnknown, "many">;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    conditionType: z.ZodLiteral<"Some">;
    target: z.ZodUnknown;
    conditions: z.ZodArray<z.ZodUnknown, "many">;
}, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
    conditionType: z.ZodLiteral<"Every">;
    target: z.ZodUnknown;
    conditions: z.ZodArray<z.ZodUnknown, "many">;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    conditionType: z.ZodLiteral<"Every">;
    target: z.ZodUnknown;
    conditions: z.ZodArray<z.ZodUnknown, "many">;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    conditionType: z.ZodLiteral<"Every">;
    target: z.ZodUnknown;
    conditions: z.ZodArray<z.ZodUnknown, "many">;
}, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
    conditionType: z.ZodLiteral<"InLine">;
    target: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
        type: z.ZodLiteral<"ctxPath">;
        path: z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodNumber]>, "many">;
    }, "strict", z.ZodTypeAny, {
        type: "ctxPath";
        path: (string | number)[];
    }, {
        type: "ctxPath";
        path: (string | number)[];
    }>, z.ZodObject<{
        type: z.ZodLiteral<"contextPath">;
        path: z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodObject<{
            flatten: z.ZodBoolean;
            map: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strict", z.ZodTypeAny, {
            flatten: boolean;
            map?: string[] | undefined;
        }, {
            flatten: boolean;
            map?: string[] | undefined;
        }>]>, "many">;
    }, "strict", z.ZodTypeAny, {
        type: "contextPath";
        path: (string | number | {
            flatten: boolean;
            map?: string[] | undefined;
        })[];
    }, {
        type: "contextPath";
        path: (string | number | {
            flatten: boolean;
            map?: string[] | undefined;
        })[];
    }>, z.ZodObject<{
        type: z.ZodLiteral<"gamePath">;
        path: z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodNumber]>, "many">;
    }, "strict", z.ZodTypeAny, {
        type: "gamePath";
        path: (string | number)[];
    }, {
        type: "gamePath";
        path: (string | number)[];
    }>, z.ZodObject<{
        type: z.ZodLiteral<"expression">;
        expression: z.ZodString;
        arguments: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    }, "strict", z.ZodTypeAny, {
        arguments: Record<string, unknown>;
        type: "expression";
        expression: string;
    }, {
        arguments: Record<string, unknown>;
        type: "expression";
        expression: string;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"relativeCoordinates">;
        target: z.ZodOptional<z.ZodUnknown>;
        location: z.ZodUnion<[z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>, z.ZodUnknown]>;
    }, "strict", z.ZodTypeAny, {
        type: "relativeCoordinates";
        target?: unknown;
        location?: unknown;
    }, {
        type: "relativeCoordinates";
        target?: unknown;
        location?: unknown;
    }>, z.ZodObject<{
        type: z.ZodEnum<["coordinates", "Coordinates"]>;
        target: z.ZodOptional<z.ZodUnknown>;
    }, "strict", z.ZodTypeAny, {
        type: "coordinates" | "Coordinates";
        target?: unknown;
    }, {
        type: "coordinates" | "Coordinates";
        target?: unknown;
    }>, z.ZodObject<{
        type: z.ZodEnum<["relativePath", "RelativePath"]>;
        target: z.ZodUnknown;
        path: z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodNumber]>, "many">;
    }, "strict", z.ZodTypeAny, {
        type: "relativePath" | "RelativePath";
        path: (string | number)[];
        target?: unknown;
    }, {
        type: "relativePath" | "RelativePath";
        path: (string | number)[];
        target?: unknown;
    }>, z.ZodObject<{
        type: z.ZodEnum<["parent", "Parent"]>;
        target: z.ZodOptional<z.ZodUnknown>;
    }, "strict", z.ZodTypeAny, {
        type: "parent" | "Parent";
        target?: unknown;
    }, {
        type: "parent" | "Parent";
        target?: unknown;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"map">;
        targets: z.ZodUnknown;
        mapping: z.ZodUnknown;
    }, "strict", z.ZodTypeAny, {
        type: "map";
        targets?: unknown;
        mapping?: unknown;
    }, {
        type: "map";
        targets?: unknown;
        mapping?: unknown;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"mapMax">;
        targets: z.ZodUnknown;
        mapping: z.ZodUnknown;
    }, "strict", z.ZodTypeAny, {
        type: "mapMax";
        targets?: unknown;
        mapping?: unknown;
    }, {
        type: "mapMax";
        targets?: unknown;
        mapping?: unknown;
    }>, z.ZodObject<{
        type: z.ZodEnum<["pick", "Pick"]>;
        target: z.ZodUnknown;
        properties: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        type: "pick" | "Pick";
        properties: string[];
        target?: unknown;
    }, {
        type: "pick" | "Pick";
        properties: string[];
        target?: unknown;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"count">;
        conditions: z.ZodArray<z.ZodUnknown, "many">;
    }, "strict", z.ZodTypeAny, {
        conditions: unknown[];
        type: "count";
    }, {
        conditions: unknown[];
        type: "count";
    }>]>>;
    sequence: z.ZodArray<z.ZodUnknown, "many">;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    conditionType: z.ZodLiteral<"InLine">;
    target: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
        type: z.ZodLiteral<"ctxPath">;
        path: z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodNumber]>, "many">;
    }, "strict", z.ZodTypeAny, {
        type: "ctxPath";
        path: (string | number)[];
    }, {
        type: "ctxPath";
        path: (string | number)[];
    }>, z.ZodObject<{
        type: z.ZodLiteral<"contextPath">;
        path: z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodObject<{
            flatten: z.ZodBoolean;
            map: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strict", z.ZodTypeAny, {
            flatten: boolean;
            map?: string[] | undefined;
        }, {
            flatten: boolean;
            map?: string[] | undefined;
        }>]>, "many">;
    }, "strict", z.ZodTypeAny, {
        type: "contextPath";
        path: (string | number | {
            flatten: boolean;
            map?: string[] | undefined;
        })[];
    }, {
        type: "contextPath";
        path: (string | number | {
            flatten: boolean;
            map?: string[] | undefined;
        })[];
    }>, z.ZodObject<{
        type: z.ZodLiteral<"gamePath">;
        path: z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodNumber]>, "many">;
    }, "strict", z.ZodTypeAny, {
        type: "gamePath";
        path: (string | number)[];
    }, {
        type: "gamePath";
        path: (string | number)[];
    }>, z.ZodObject<{
        type: z.ZodLiteral<"expression">;
        expression: z.ZodString;
        arguments: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    }, "strict", z.ZodTypeAny, {
        arguments: Record<string, unknown>;
        type: "expression";
        expression: string;
    }, {
        arguments: Record<string, unknown>;
        type: "expression";
        expression: string;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"relativeCoordinates">;
        target: z.ZodOptional<z.ZodUnknown>;
        location: z.ZodUnion<[z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>, z.ZodUnknown]>;
    }, "strict", z.ZodTypeAny, {
        type: "relativeCoordinates";
        target?: unknown;
        location?: unknown;
    }, {
        type: "relativeCoordinates";
        target?: unknown;
        location?: unknown;
    }>, z.ZodObject<{
        type: z.ZodEnum<["coordinates", "Coordinates"]>;
        target: z.ZodOptional<z.ZodUnknown>;
    }, "strict", z.ZodTypeAny, {
        type: "coordinates" | "Coordinates";
        target?: unknown;
    }, {
        type: "coordinates" | "Coordinates";
        target?: unknown;
    }>, z.ZodObject<{
        type: z.ZodEnum<["relativePath", "RelativePath"]>;
        target: z.ZodUnknown;
        path: z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodNumber]>, "many">;
    }, "strict", z.ZodTypeAny, {
        type: "relativePath" | "RelativePath";
        path: (string | number)[];
        target?: unknown;
    }, {
        type: "relativePath" | "RelativePath";
        path: (string | number)[];
        target?: unknown;
    }>, z.ZodObject<{
        type: z.ZodEnum<["parent", "Parent"]>;
        target: z.ZodOptional<z.ZodUnknown>;
    }, "strict", z.ZodTypeAny, {
        type: "parent" | "Parent";
        target?: unknown;
    }, {
        type: "parent" | "Parent";
        target?: unknown;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"map">;
        targets: z.ZodUnknown;
        mapping: z.ZodUnknown;
    }, "strict", z.ZodTypeAny, {
        type: "map";
        targets?: unknown;
        mapping?: unknown;
    }, {
        type: "map";
        targets?: unknown;
        mapping?: unknown;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"mapMax">;
        targets: z.ZodUnknown;
        mapping: z.ZodUnknown;
    }, "strict", z.ZodTypeAny, {
        type: "mapMax";
        targets?: unknown;
        mapping?: unknown;
    }, {
        type: "mapMax";
        targets?: unknown;
        mapping?: unknown;
    }>, z.ZodObject<{
        type: z.ZodEnum<["pick", "Pick"]>;
        target: z.ZodUnknown;
        properties: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        type: "pick" | "Pick";
        properties: string[];
        target?: unknown;
    }, {
        type: "pick" | "Pick";
        properties: string[];
        target?: unknown;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"count">;
        conditions: z.ZodArray<z.ZodUnknown, "many">;
    }, "strict", z.ZodTypeAny, {
        conditions: unknown[];
        type: "count";
    }, {
        conditions: unknown[];
        type: "count";
    }>]>>;
    sequence: z.ZodArray<z.ZodUnknown, "many">;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    conditionType: z.ZodLiteral<"InLine">;
    target: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
        type: z.ZodLiteral<"ctxPath">;
        path: z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodNumber]>, "many">;
    }, "strict", z.ZodTypeAny, {
        type: "ctxPath";
        path: (string | number)[];
    }, {
        type: "ctxPath";
        path: (string | number)[];
    }>, z.ZodObject<{
        type: z.ZodLiteral<"contextPath">;
        path: z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodObject<{
            flatten: z.ZodBoolean;
            map: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strict", z.ZodTypeAny, {
            flatten: boolean;
            map?: string[] | undefined;
        }, {
            flatten: boolean;
            map?: string[] | undefined;
        }>]>, "many">;
    }, "strict", z.ZodTypeAny, {
        type: "contextPath";
        path: (string | number | {
            flatten: boolean;
            map?: string[] | undefined;
        })[];
    }, {
        type: "contextPath";
        path: (string | number | {
            flatten: boolean;
            map?: string[] | undefined;
        })[];
    }>, z.ZodObject<{
        type: z.ZodLiteral<"gamePath">;
        path: z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodNumber]>, "many">;
    }, "strict", z.ZodTypeAny, {
        type: "gamePath";
        path: (string | number)[];
    }, {
        type: "gamePath";
        path: (string | number)[];
    }>, z.ZodObject<{
        type: z.ZodLiteral<"expression">;
        expression: z.ZodString;
        arguments: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    }, "strict", z.ZodTypeAny, {
        arguments: Record<string, unknown>;
        type: "expression";
        expression: string;
    }, {
        arguments: Record<string, unknown>;
        type: "expression";
        expression: string;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"relativeCoordinates">;
        target: z.ZodOptional<z.ZodUnknown>;
        location: z.ZodUnion<[z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>, z.ZodUnknown]>;
    }, "strict", z.ZodTypeAny, {
        type: "relativeCoordinates";
        target?: unknown;
        location?: unknown;
    }, {
        type: "relativeCoordinates";
        target?: unknown;
        location?: unknown;
    }>, z.ZodObject<{
        type: z.ZodEnum<["coordinates", "Coordinates"]>;
        target: z.ZodOptional<z.ZodUnknown>;
    }, "strict", z.ZodTypeAny, {
        type: "coordinates" | "Coordinates";
        target?: unknown;
    }, {
        type: "coordinates" | "Coordinates";
        target?: unknown;
    }>, z.ZodObject<{
        type: z.ZodEnum<["relativePath", "RelativePath"]>;
        target: z.ZodUnknown;
        path: z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodNumber]>, "many">;
    }, "strict", z.ZodTypeAny, {
        type: "relativePath" | "RelativePath";
        path: (string | number)[];
        target?: unknown;
    }, {
        type: "relativePath" | "RelativePath";
        path: (string | number)[];
        target?: unknown;
    }>, z.ZodObject<{
        type: z.ZodEnum<["parent", "Parent"]>;
        target: z.ZodOptional<z.ZodUnknown>;
    }, "strict", z.ZodTypeAny, {
        type: "parent" | "Parent";
        target?: unknown;
    }, {
        type: "parent" | "Parent";
        target?: unknown;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"map">;
        targets: z.ZodUnknown;
        mapping: z.ZodUnknown;
    }, "strict", z.ZodTypeAny, {
        type: "map";
        targets?: unknown;
        mapping?: unknown;
    }, {
        type: "map";
        targets?: unknown;
        mapping?: unknown;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"mapMax">;
        targets: z.ZodUnknown;
        mapping: z.ZodUnknown;
    }, "strict", z.ZodTypeAny, {
        type: "mapMax";
        targets?: unknown;
        mapping?: unknown;
    }, {
        type: "mapMax";
        targets?: unknown;
        mapping?: unknown;
    }>, z.ZodObject<{
        type: z.ZodEnum<["pick", "Pick"]>;
        target: z.ZodUnknown;
        properties: z.ZodArray<z.ZodString, "many">;
    }, "strict", z.ZodTypeAny, {
        type: "pick" | "Pick";
        properties: string[];
        target?: unknown;
    }, {
        type: "pick" | "Pick";
        properties: string[];
        target?: unknown;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"count">;
        conditions: z.ZodArray<z.ZodUnknown, "many">;
    }, "strict", z.ZodTypeAny, {
        conditions: unknown[];
        type: "count";
    }, {
        conditions: unknown[];
        type: "count";
    }>]>>;
    sequence: z.ZodArray<z.ZodUnknown, "many">;
}, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
    conditionType: z.ZodLiteral<"HasLine">;
    target: z.ZodUnknown;
    sequence: z.ZodArray<z.ZodUnknown, "many">;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    conditionType: z.ZodLiteral<"HasLine">;
    target: z.ZodUnknown;
    sequence: z.ZodArray<z.ZodUnknown, "many">;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    conditionType: z.ZodLiteral<"HasLine">;
    target: z.ZodUnknown;
    sequence: z.ZodArray<z.ZodUnknown, "many">;
}, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
    conditionType: z.ZodLiteral<"IsFull">;
    target: z.ZodUnknown;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    conditionType: z.ZodLiteral<"IsFull">;
    target: z.ZodUnknown;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    conditionType: z.ZodLiteral<"IsFull">;
    target: z.ZodUnknown;
}, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
    conditionType: z.ZodLiteral<"NoPossibleMoves">;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    conditionType: z.ZodLiteral<"NoPossibleMoves">;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    conditionType: z.ZodLiteral<"NoPossibleMoves">;
}, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
    conditionType: z.ZodLiteral<"Position">;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    conditionType: z.ZodLiteral<"Position">;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    conditionType: z.ZodLiteral<"Position">;
}, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
    conditionType: z.ZodLiteral<"Evaluate">;
    expression: z.ZodString;
    arguments: z.ZodRecord<z.ZodString, z.ZodUnknown>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    conditionType: z.ZodLiteral<"Evaluate">;
    expression: z.ZodString;
    arguments: z.ZodRecord<z.ZodString, z.ZodUnknown>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    conditionType: z.ZodLiteral<"Evaluate">;
    expression: z.ZodString;
    arguments: z.ZodRecord<z.ZodString, z.ZodUnknown>;
}, z.ZodTypeAny, "passthrough">>, z.ZodObject<{
    conditionType: z.ZodLiteral<"Would">;
    conditions: z.ZodOptional<z.ZodArray<z.ZodUnknown, "many">>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    conditionType: z.ZodLiteral<"Would">;
    conditions: z.ZodOptional<z.ZodArray<z.ZodUnknown, "many">>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    conditionType: z.ZodLiteral<"Would">;
    conditions: z.ZodOptional<z.ZodArray<z.ZodUnknown, "many">>;
}, z.ZodTypeAny, "passthrough">>]>;
//# sourceMappingURL=condition.schema.d.ts.map