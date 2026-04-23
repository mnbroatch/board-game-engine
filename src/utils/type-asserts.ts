import isPlainObject from "lodash/isPlainObject.js";

export function isRecord (value: unknown): value is Record<string, unknown> {
  return isPlainObject(value);
}

export function assertRecord (value: unknown, message: string): asserts value is Record<string, unknown> {
  if (!isRecord(value)) {
    throw new Error(message);
  }
}

export function assertArray (value: unknown, message: string): asserts value is unknown[] {
  if (!Array.isArray(value)) {
    throw new Error(message);
  }
}

export function assertString (value: unknown, message: string): asserts value is string {
  if (typeof value !== "string") {
    throw new Error(message);
  }
}

export function assertNumber (value: unknown, message: string): asserts value is number {
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new Error(message);
  }
}

export function assertBoolean (value: unknown, message: string): asserts value is boolean {
  if (typeof value !== "boolean") {
    throw new Error(message);
  }
}

export function assertHasConditionIsMet (value: unknown, message: string): asserts value is { conditionIsMet: boolean } {
  if (!value || typeof value !== "object" || typeof (value as { conditionIsMet?: unknown }).conditionIsMet !== "boolean") {
    throw new Error(message);
  }
}

