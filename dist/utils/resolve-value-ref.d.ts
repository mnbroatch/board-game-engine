import { type BgioReadonlyState } from "./bgio-resolve-types.js";
import type { ResolutionContext } from "../types/resolution-context.js";
/** Returned when `value` is not a recognized BAGEL {@link ValueRef} node at this step. */
export declare const notValueRefNode: unique symbol;
export type ResolvePropertiesFn = (bgioArguments: BgioReadonlyState, obj: unknown, context: ResolutionContext, key?: string) => unknown;
/**
 * If `value` is a discriminated BAGEL value-ref object, resolve it and return the result.
 * Otherwise return {@link notValueRefNode} so the caller can fall back to generic resolution.
 */
export declare function resolveDiscriminatedValueRef(bgioArguments: BgioReadonlyState, value: unknown, context: ResolutionContext, resolveProperties: ResolvePropertiesFn): unknown | typeof notValueRefNode;
//# sourceMappingURL=resolve-value-ref.d.ts.map