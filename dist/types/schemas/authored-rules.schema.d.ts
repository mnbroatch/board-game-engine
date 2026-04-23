import { z } from "zod";
/**
 * Minimal authored game rules schema. Intentionally permissive (`passthrough`) so we can
 * provide useful runtime errors for obvious shape issues without needing to model every
 * authoring feature up front.
 */
export declare const AuthoredGameRulesSchema: z.ZodObject<{
    numPlayers: z.ZodOptional<z.ZodNumber>;
    minPlayers: z.ZodOptional<z.ZodNumber>;
    maxPlayers: z.ZodOptional<z.ZodNumber>;
    entities: z.ZodOptional<z.ZodArray<z.ZodObject<{
        entityType: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        entityType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        entityType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, "many">>;
    sharedBoard: z.ZodOptional<z.ZodArray<z.ZodUnknown, "many">>;
    personalBoard: z.ZodOptional<z.ZodArray<z.ZodUnknown, "many">>;
    turn: z.ZodOptional<z.ZodObject<{
        minMoves: z.ZodOptional<z.ZodNumber>;
        maxMoves: z.ZodOptional<z.ZodNumber>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        minMoves: z.ZodOptional<z.ZodNumber>;
        maxMoves: z.ZodOptional<z.ZodNumber>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        minMoves: z.ZodOptional<z.ZodNumber>;
        maxMoves: z.ZodOptional<z.ZodNumber>;
    }, z.ZodTypeAny, "passthrough">>>;
    endIf: z.ZodOptional<z.ZodUnknown>;
    phases: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
    _valueRefs: z.ZodOptional<z.ZodArray<z.ZodUnion<[z.ZodObject<{
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
    }>]>, "many">>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    numPlayers: z.ZodOptional<z.ZodNumber>;
    minPlayers: z.ZodOptional<z.ZodNumber>;
    maxPlayers: z.ZodOptional<z.ZodNumber>;
    entities: z.ZodOptional<z.ZodArray<z.ZodObject<{
        entityType: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        entityType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        entityType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, "many">>;
    sharedBoard: z.ZodOptional<z.ZodArray<z.ZodUnknown, "many">>;
    personalBoard: z.ZodOptional<z.ZodArray<z.ZodUnknown, "many">>;
    turn: z.ZodOptional<z.ZodObject<{
        minMoves: z.ZodOptional<z.ZodNumber>;
        maxMoves: z.ZodOptional<z.ZodNumber>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        minMoves: z.ZodOptional<z.ZodNumber>;
        maxMoves: z.ZodOptional<z.ZodNumber>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        minMoves: z.ZodOptional<z.ZodNumber>;
        maxMoves: z.ZodOptional<z.ZodNumber>;
    }, z.ZodTypeAny, "passthrough">>>;
    endIf: z.ZodOptional<z.ZodUnknown>;
    phases: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
    _valueRefs: z.ZodOptional<z.ZodArray<z.ZodUnion<[z.ZodObject<{
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
    }>]>, "many">>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    numPlayers: z.ZodOptional<z.ZodNumber>;
    minPlayers: z.ZodOptional<z.ZodNumber>;
    maxPlayers: z.ZodOptional<z.ZodNumber>;
    entities: z.ZodOptional<z.ZodArray<z.ZodObject<{
        entityType: z.ZodString;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        entityType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        entityType: z.ZodString;
    }, z.ZodTypeAny, "passthrough">>, "many">>;
    sharedBoard: z.ZodOptional<z.ZodArray<z.ZodUnknown, "many">>;
    personalBoard: z.ZodOptional<z.ZodArray<z.ZodUnknown, "many">>;
    turn: z.ZodOptional<z.ZodObject<{
        minMoves: z.ZodOptional<z.ZodNumber>;
        maxMoves: z.ZodOptional<z.ZodNumber>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        minMoves: z.ZodOptional<z.ZodNumber>;
        maxMoves: z.ZodOptional<z.ZodNumber>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        minMoves: z.ZodOptional<z.ZodNumber>;
        maxMoves: z.ZodOptional<z.ZodNumber>;
    }, z.ZodTypeAny, "passthrough">>>;
    endIf: z.ZodOptional<z.ZodUnknown>;
    phases: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<unknown, z.ZodTypeDef, unknown>>>;
    _valueRefs: z.ZodOptional<z.ZodArray<z.ZodUnion<[z.ZodObject<{
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
    }>]>, "many">>;
}, z.ZodTypeAny, "passthrough">>;
//# sourceMappingURL=authored-rules.schema.d.ts.map