import { deserialize } from "wackson";
import { registry } from "../registry.js";
export default function deserializeBgioArguments (bgioArguments) {
  return {
    ...bgioArguments,
    G: deserialize(JSON.stringify(bgioArguments.G), registry)
  }
}
