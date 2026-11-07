import { serialize } from "wackson";
import { registry } from "../registry.js"

// todo: remember why reducing to id was preferred?
export default function preparePayload (payload) {
  if (payload?.arguments) {
    const payloadCopy = { ...payload }
    payloadCopy.arguments =
      Object.entries(payloadCopy.arguments).reduce((acc, [key, argument]) => ({
        ...acc,
        [key]: argument.abstract ? argument : argument.entityId
      }), {})
    return JSON.parse(serialize(payloadCopy, { deduplicateInstances: false, registry }))
  } else {
    return payload
  }
}
