import { serialize } from "wackson";

// todo: remember why reducing to id was preferred?
export default function preparePayload (payload: unknown): unknown {
  const p = payload as {
    arguments?: Record<string, { abstract?: boolean; entityId?: unknown }>;
  } | null | undefined;
  if (p?.arguments) {
    const payloadCopy = {
      ...p,
      arguments: Object.entries(p.arguments).reduce<Record<string, unknown>>((acc, [key, argument]) => ({
        ...acc,
        [key]: argument.abstract ? argument : argument.entityId,
      }), {}),
    };
    return JSON.parse(serialize(payloadCopy, { deduplicateInstances: false }));
  } else {
    return payload;
  }
}
