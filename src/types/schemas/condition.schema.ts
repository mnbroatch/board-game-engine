import { z } from "zod";
import { ValueRefSchema } from "./value-ref.schema.js";

export const IsConditionSchema = z.object({
  conditionType: z.literal("Is"),
  target: z.unknown().optional(),
}).passthrough();

export const ContainsConditionSchema = z.object({
  conditionType: z.literal("Contains"),
  target: z.unknown().optional(),
}).passthrough();

export const NotConditionSchema = z.object({
  conditionType: z.literal("Not"),
  conditions: z.array(z.unknown()),
}).passthrough();

export const OrConditionSchema = z.object({
  conditionType: z.literal("Or"),
  conditions: z.array(z.unknown()),
}).passthrough();

export const SomeConditionSchema = z.object({
  conditionType: z.literal("Some"),
  target: z.unknown(),
  conditions: z.array(z.unknown()),
}).passthrough();

export const EveryConditionSchema = z.object({
  conditionType: z.literal("Every"),
  target: z.unknown(),
  conditions: z.array(z.unknown()),
}).passthrough();

export const InLineConditionSchema = z.object({
  conditionType: z.literal("InLine"),
  target: ValueRefSchema.optional(),
  sequence: z.array(z.unknown()),
}).passthrough();

export const HasLineConditionSchema = z.object({
  conditionType: z.literal("HasLine"),
  target: z.unknown(),
  sequence: z.array(z.unknown()),
}).passthrough();

export const IsFullConditionSchema = z.object({
  conditionType: z.literal("IsFull"),
  target: z.unknown(),
}).passthrough();

export const NoPossibleMovesConditionSchema = z.object({
  conditionType: z.literal("NoPossibleMoves"),
}).passthrough();

export const PositionConditionSchema = z.object({
  conditionType: z.literal("Position"),
}).passthrough();

export const EvaluateConditionSchema = z.object({
  conditionType: z.literal("Evaluate"),
  expression: z.string(),
  arguments: z.record(z.string(), z.unknown()),
}).passthrough();

export const WouldConditionSchema = z.object({
  conditionType: z.literal("Would"),
  conditions: z.array(z.unknown()).optional(),
}).passthrough();

export type SchemaCondition =
  | string
  | z.infer<typeof IsConditionSchema>
  | z.infer<typeof ContainsConditionSchema>
  | z.infer<typeof NotConditionSchema>
  | z.infer<typeof OrConditionSchema>
  | z.infer<typeof SomeConditionSchema>
  | z.infer<typeof EveryConditionSchema>
  | z.infer<typeof InLineConditionSchema>
  | z.infer<typeof HasLineConditionSchema>
  | z.infer<typeof IsFullConditionSchema>
  | z.infer<typeof NoPossibleMovesConditionSchema>
  | z.infer<typeof PositionConditionSchema>
  | z.infer<typeof EvaluateConditionSchema>
  | z.infer<typeof WouldConditionSchema>;

export const ConditionSchema = z.union([
  z.string(),
  IsConditionSchema,
  ContainsConditionSchema,
  NotConditionSchema,
  OrConditionSchema,
  SomeConditionSchema,
  EveryConditionSchema,
  InLineConditionSchema,
  HasLineConditionSchema,
  IsFullConditionSchema,
  NoPossibleMovesConditionSchema,
  PositionConditionSchema,
  EvaluateConditionSchema,
  WouldConditionSchema,
]);

