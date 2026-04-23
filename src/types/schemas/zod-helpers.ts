import { z } from "zod";

function formatZodIssuePath (path: (string | number)[]): string {
  if (!path.length) return "<root>";
  return path
    .map((seg) => (typeof seg === "number" ? `[${seg}]` : `${seg}`))
    .join(".")
    .replace(/\.?\[(\d+)\]/g, "[$1]");
}

export function formatZodError (error: z.ZodError): string {
  return error.issues
    .map((issue) => {
      const at = formatZodIssuePath(issue.path);
      return `${at}: ${issue.message}`;
    })
    .join("; ");
}

export function parseOrThrow<T> (schema: z.ZodType<T>, value: unknown, label: string): T {
  const parsed = schema.safeParse(value);
  if (!parsed.success) {
    throw new Error(`${label}: ${formatZodError(parsed.error)}`);
  }
  return parsed.data;
}

