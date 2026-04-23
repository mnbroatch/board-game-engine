import type { z } from "zod";
import type { BagelGame as AuthoredGameRules, MoveDefinition as AuthoredMoveDefinition, TurnConfig as AuthoredTurnConfig, PhaseConfig as AuthoredPhaseConfig, EndRule as AuthoredEndRule, InitialPlacement, Entity as AuthoredEntity, GridValueRef as AuthoredGridValueRef, EntityLineTargetRef as AuthoredEntityLineTargetRef } from "./bagel-types.js";
import type { ConditionSchema } from "./schemas/condition.schema.js";
import type { ValueRefSchema } from "./schemas/value-ref.schema.js";
export type { AuthoredGameRules, AuthoredMoveDefinition, AuthoredTurnConfig, AuthoredPhaseConfig, AuthoredEndRule, InitialPlacement, AuthoredEntity, AuthoredGridValueRef, AuthoredEntityLineTargetRef, };
/** Authored condition tree validated at runtime by {@link ConditionSchema}. */
export type AuthoredCondition = z.infer<typeof ConditionSchema>;
/** Authored value ref validated at runtime by {@link ValueRefSchema}. */
export type ValueRef = z.infer<typeof ValueRefSchema>;
/** Re-exported for callers that build composite authored objects. */
export type ContextPathRef = Extract<ValueRef, {
    type: "contextPath";
}>;
export type CtxPathRef = Extract<ValueRef, {
    type: "ctxPath";
}>;
export type ExpressionRef = Extract<ValueRef, {
    type: "expression";
}>;
export type CoordinatesRef = Extract<ValueRef, {
    type: "coordinates" | "Coordinates";
}>;
export type RelativeCoordinatesRef = Extract<ValueRef, {
    type: "relativeCoordinates";
}>;
export type { AuthoredRuleWithConditions } from "./rule-with-conditions.js";
//# sourceMappingURL=authored.d.ts.map