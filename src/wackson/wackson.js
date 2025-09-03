export function serialize (state) {
  // First pass: count object references
  const refCounts = new WeakMap();

  (function countRefs (obj) {
    if (typeof obj !== 'object' || obj === null) return

    if (!refCounts.has(obj)) refCounts.set(obj, 1)
    else {
      refCounts.set(obj, refCounts.get(obj) + 1)
      return
    }

    for (const key of Object.keys(obj)) {
      countRefs(obj[key])
    }
  })(state)

  // Second pass: replace repeated instances with placeholders, add constructorName
  const idMap = new WeakMap()
  let idCounter = 1

  return JSON.stringify(state, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (idMap.has(value)) {
        return { _instanceReference: idMap.get(value) }
      }

      const copy = Array.isArray(value) ? [...value] : { ...value }

      if (refCounts.get(value) > 1) {
        const currentId = idCounter++
        idMap.set(value, currentId)
        copy._instanceReferenceId = currentId
      }

      if (value.constructor !== Object && value.constructor !== Array) {
        copy.constructorName = value.constructor.name
      }

      return copy
    }

    return value
  })
}

export function deserialize (serialized, registry) {
  const parsed = JSON.parse(serialized)
  const idMap = new Map();

  // First pass: collect all reference placeholders and restore prototypes
  (function gatherIdsAndRestorePrototypes (obj) {
    if (typeof obj !== 'object' || obj === null) return

    if (obj._instanceReferenceId != null) {
      const id = obj._instanceReferenceId
      delete obj._instanceReferenceId
      idMap.set(id, obj)
    }

    if (registry && obj.constructorName) {
      const constructor = registry[obj.constructorName]
      if (!constructor) {
        throw new Error(`Constructor ${obj.constructorName} is not in registry`)
      }
      Object.setPrototypeOf(obj, constructor.prototype)
      delete obj.constructorName
    }

    for (const key of Object.keys(obj)) {
      gatherIdsAndRestorePrototypes(obj[key])
    }
  })(parsed);

  // Second pass: restore repeated instance references
  (function replaceReferences (obj) {
    if (typeof obj !== 'object' || obj === null) return

    for (const key of Object.keys(obj)) {
      const value = obj[key]
      if (value?._instanceReference != null) {
        const ref = idMap.get(value._instanceReference)
        if (!ref) {
          throw new Error(`Unknown _instanceReference: ${value._instanceReference}`)
        }
        obj[key] = ref
      } else if (typeof value === 'object' && value !== null) {
        replaceReferences(value)
      }
    }
  })(parsed)

  return parsed
}
