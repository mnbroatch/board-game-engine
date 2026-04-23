import { z } from "zod";

// Note: BAGEL refs are polymorphic and heavily recursive. These schemas are intended to
// validate authored JSON at the boundaries (helpful errors), not to fully replace the
// compile-time type system.

const PathSegmentSchema = z.union([
  z.string(),
  z.number(),
  z.object({
    flatten: z.boolean(),
    map: z.array(z.string()).optional(),
  }).strict(),
]);

export const CtxPathRefSchema = z.object({
  type: z.literal("ctxPath"),
  path: z.array(z.union([z.string(), z.number()])),
}).strict();

export const ContextPathRefSchema = z.object({
  type: z.literal("contextPath"),
  path: z.array(PathSegmentSchema),
}).strict();

export const GamePathRefSchema = z.object({
  type: z.literal("gamePath"),
  path: z.array(z.union([z.string(), z.number()])),
}).strict();

export const ExpressionRefSchema = z.object({
  type: z.literal("expression"),
  expression: z.string(),
  arguments: z.record(z.string(), z.unknown()),
}).strict();

export const RelativeCoordinatesRefSchema = z.object({
  type: z.literal("relativeCoordinates"),
  target: z.unknown().optional(),
  location: z.union([
    z.tuple([z.number(), z.number()]),
    z.unknown(),
  ]),
}).strict();

export const CoordinatesRefSchema = z.object({
  type: z.enum(["coordinates", "Coordinates"]),
  target: z.unknown().optional(),
}).strict();

export const RelativePathRefSchema = z.object({
  type: z.enum(["relativePath", "RelativePath"]),
  target: z.unknown(),
  path: z.array(z.union([z.string(), z.number()])),
}).strict();

export const ParentRefSchema = z.object({
  type: z.enum(["parent", "Parent"]),
  target: z.unknown().optional(),
}).strict();

export const MapRefSchema = z.object({
  type: z.literal("map"),
  targets: z.unknown(),
  mapping: z.unknown(),
}).strict();

export const MapMaxRefSchema = z.object({
  type: z.literal("mapMax"),
  targets: z.unknown(),
  mapping: z.unknown(),
}).strict();

export const PickRefSchema = z.object({
  type: z.enum(["pick", "Pick"]),
  target: z.unknown(),
  properties: z.array(z.string()),
}).strict();

export const CountRefSchema = z.object({
  type: z.literal("count"),
  conditions: z.array(z.unknown()),
}).strict();

export type SchemaValueRef =
  | z.infer<typeof CtxPathRefSchema>
  | z.infer<typeof ContextPathRefSchema>
  | z.infer<typeof GamePathRefSchema>
  | z.infer<typeof ExpressionRefSchema>
  | z.infer<typeof RelativeCoordinatesRefSchema>
  | z.infer<typeof CoordinatesRefSchema>
  | z.infer<typeof RelativePathRefSchema>
  | z.infer<typeof ParentRefSchema>
  | z.infer<typeof MapRefSchema>
  | z.infer<typeof MapMaxRefSchema>
  | z.infer<typeof PickRefSchema>
  | z.infer<typeof CountRefSchema>;

export const ValueRefSchema = z.union([
  CtxPathRefSchema,
  ContextPathRefSchema,
  GamePathRefSchema,
  ExpressionRefSchema,
  RelativeCoordinatesRefSchema,
  CoordinatesRefSchema,
  RelativePathRefSchema,
  ParentRefSchema,
  MapRefSchema,
  MapMaxRefSchema,
  PickRefSchema,
  CountRefSchema,
]);

