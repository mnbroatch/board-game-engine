import isPlainObject from "lodash/isPlainObject.js";
import type { ValueRef } from "../bagel-types.js";

const valueRefTypes = new Set<string>([
  "ctxPath",
  "contextPath",
  "gamePath",
  "expression",
  "relativeCoordinates",
  "coordinates",
  "Coordinates",
  "relativePath",
  "RelativePath",
  "parent",
  "Parent",
  "map",
  "mapMax",
  "pick",
  "Pick",
  "count",
]);

export function isValueRefObject (value: unknown): value is ValueRef<unknown> {
  if (!isPlainObject(value)) return false;
  const t = (value as { type?: unknown }).type;
  return typeof t === "string" && valueRefTypes.has(t);
}

