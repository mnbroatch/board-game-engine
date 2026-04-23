import { z } from "zod";
export declare const CtxPathRefSchema: z.ZodObject<{
    type: z.ZodLiteral<"ctxPath">;
    path: z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodNumber]>, "many">;
}, "strict", z.ZodTypeAny, {
    type: "ctxPath";
    path: (string | number)[];
}, {
    type: "ctxPath";
    path: (string | number)[];
}>;
export declare const ContextPathRefSchema: z.ZodObject<{
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
}>;
export declare const GamePathRefSchema: z.ZodObject<{
    type: z.ZodLiteral<"gamePath">;
    path: z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodNumber]>, "many">;
}, "strict", z.ZodTypeAny, {
    type: "gamePath";
    path: (string | number)[];
}, {
    type: "gamePath";
    path: (string | number)[];
}>;
export declare const ExpressionRefSchema: z.ZodObject<{
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
}>;
export declare const RelativeCoordinatesRefSchema: z.ZodObject<{
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
}>;
export declare const CoordinatesRefSchema: z.ZodObject<{
    type: z.ZodEnum<["coordinates", "Coordinates"]>;
    target: z.ZodOptional<z.ZodUnknown>;
}, "strict", z.ZodTypeAny, {
    type: "coordinates" | "Coordinates";
    target?: unknown;
}, {
    type: "coordinates" | "Coordinates";
    target?: unknown;
}>;
export declare const RelativePathRefSchema: z.ZodObject<{
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
}>;
export declare const ParentRefSchema: z.ZodObject<{
    type: z.ZodEnum<["parent", "Parent"]>;
    target: z.ZodOptional<z.ZodUnknown>;
}, "strict", z.ZodTypeAny, {
    type: "parent" | "Parent";
    target?: unknown;
}, {
    type: "parent" | "Parent";
    target?: unknown;
}>;
export declare const MapRefSchema: z.ZodObject<{
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
}>;
export declare const MapMaxRefSchema: z.ZodObject<{
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
}>;
export declare const PickRefSchema: z.ZodObject<{
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
}>;
export declare const CountRefSchema: z.ZodObject<{
    type: z.ZodLiteral<"count">;
    conditions: z.ZodArray<z.ZodUnknown, "many">;
}, "strict", z.ZodTypeAny, {
    conditions: unknown[];
    type: "count";
}, {
    conditions: unknown[];
    type: "count";
}>;
export type SchemaValueRef = z.infer<typeof CtxPathRefSchema> | z.infer<typeof ContextPathRefSchema> | z.infer<typeof GamePathRefSchema> | z.infer<typeof ExpressionRefSchema> | z.infer<typeof RelativeCoordinatesRefSchema> | z.infer<typeof CoordinatesRefSchema> | z.infer<typeof RelativePathRefSchema> | z.infer<typeof ParentRefSchema> | z.infer<typeof MapRefSchema> | z.infer<typeof MapMaxRefSchema> | z.infer<typeof PickRefSchema> | z.infer<typeof CountRefSchema>;
export declare const ValueRefSchema: z.ZodUnion<[z.ZodObject<{
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
}>]>;
//# sourceMappingURL=value-ref.schema.d.ts.map