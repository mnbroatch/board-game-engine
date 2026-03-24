declare module "wackson" {
  export function serialize (value: unknown, options?: { deduplicateInstances?: boolean }): string;
  export function deserialize (json: string, registry?: unknown): unknown;
}
