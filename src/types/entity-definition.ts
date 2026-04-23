import type { Entity } from "./bagel-types.js";

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

/**
 * Entity rules as consumed by the Bank after setup-time expansion:
 * - `perPlayer` and `variants` have been expanded and removed
 * - the discriminated union from `Entity` is preserved
 */
export type EntityDefinition =
  DistributiveOmit<Entity, "variants" | "perPlayer"> & { variants?: never; perPlayer?: never };

