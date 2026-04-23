import { z } from "zod";
import { ConditionSchema } from "./condition.schema.js";
import { ValueRefSchema } from "./value-ref.schema.js";

const EntitySchema = z.object({
  entityType: z.string(),
}).passthrough();

const TurnConfigSchema = z.object({
  minMoves: z.number().optional(),
  maxMoves: z.number().optional(),
}).passthrough();

const MoveDefinitionSchema = z.object({
  moveType: z.string(),
}).passthrough();

const PhaseConfigSchema: z.ZodType<unknown> = z.object({
  turn: TurnConfigSchema.optional(),
  moves: z.record(z.string(), z.unknown()).optional(),
  endIf: z.unknown().optional(),
  onBegin: z.unknown().optional(),
  onEnd: z.unknown().optional(),
  // Common authored conveniences:
  initialPlacements: z.array(z.unknown()).optional(),
  initialMoves: z.array(MoveDefinitionSchema).optional(),
  conditions: z.union([ConditionSchema, z.array(ConditionSchema)]).optional(),
}).passthrough();

/**
 * Minimal authored game rules schema. Intentionally permissive (`passthrough`) so we can
 * provide useful runtime errors for obvious shape issues without needing to model every
 * authoring feature up front.
 */
export const AuthoredGameRulesSchema = z.object({
  numPlayers: z.number().int().positive().optional(),
  minPlayers: z.number().int().positive().optional(),
  maxPlayers: z.number().int().positive().optional(),
  entities: z.array(EntitySchema).optional(),
  sharedBoard: z.array(z.unknown()).optional(),
  personalBoard: z.array(z.unknown()).optional(),
  turn: TurnConfigSchema.optional(),
  endIf: z.unknown().optional(),
  phases: z.record(z.string(), PhaseConfigSchema).optional(),

  // Allow authored refs/expressions anywhere else; this isn't structural validation, but
  // gives early failures for the most common mistakes.
  // (We validate refs more precisely at the specific ref boundaries.)
  _valueRefs: z.array(ValueRefSchema).optional(),
}).passthrough();

