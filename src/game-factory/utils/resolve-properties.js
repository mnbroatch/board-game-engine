import isPlainObject from "lodash/isPlainObject.js";
import pick from "lodash/pick.js";
import get from "./get.js";
import resolveExpression from "./resolve-expression.js";
import resolveEntity from "./resolve-entity.js";

// some keys only contain things that will be the root of a later resolution
const resolutionTerminators = [
  'conditions',
  'move',
  'then',
  'mapping',
]

export default function resolveProperties (bgioArguments, obj, context, key) {
  if (!isPlainObject(obj) && !Array.isArray(obj)) {
    return obj
  }

  let resolvedProperties = Array.isArray(obj)
    ? [...obj]
    : { ...obj }

  Object.entries(obj).forEach(([key, value]) => {
    if (!resolutionTerminators.includes(key)) {
      resolvedProperties[key] = resolveProperties(bgioArguments, value, context, key)
    }
  })

  const resolved = resolveProperty(bgioArguments, resolvedProperties, context)

  const resolveAsEntity = resolved?.resolveAsEntity
    || key === 'target'
    || key === 'targets'

  return resolveAsEntity
    ? resolveEntity(
        bgioArguments,
        resolved,
        context,
        key
      )
    : resolved
}

function resolveProperty (bgioArguments, value, context) {
  if (value?.type === 'expression') {
    return resolveExpression(
      bgioArguments,
      {
        ...value,
        arguments: resolveProperties(bgioArguments, value.arguments, context, 'arguments')
      },
      context
    )
  } else if (value?.type === 'count') {
    return bgioArguments.G.bank.findAll(
      bgioArguments,
      value,
      context
    ).length
  } else if (value?.type === 'contextPath') {
    return get(context, value.path)
  } else if (value?.type === 'ctxPath') {
    return get(bgioArguments.ctx, value.path)
  } else if (value?.type === 'gamePath') {
    return get(bgioArguments.G, value.path)
  } else if (value?.type === 'RelativePath') {
    const target = resolveProperties(bgioArguments, value.target, context, 'target')
    return get(target.attributes, value.path) ?? null
  } else if (value?.type === 'Parent') {
    const originalTarget = value.target
      ? resolveProperties(bgioArguments, value.target, context, 'target')
      : context.originalTarget
    return bgioArguments.G.bank.findParent(originalTarget) ?? null
  } else if (value?.type === 'map') {
    return getMappedTargets(
      bgioArguments,
      value.targets,
      value.mapping,
      context
    ).map(mappedTarget => mappedTarget.value)
  } else if (value?.type === 'mapMax') {
    const mappedTargets = getMappedTargets(
      bgioArguments,
      value.targets,
      value.mapping,
      context
    )
    let maxValue
    const maxTargets = []
    for (let i = 0, len = mappedTargets.length; i < len; i++) {
      const { target, value: val } = mappedTargets[i]
      if (maxValue === undefined || val > maxValue) {
        maxValue = val
        maxTargets.length = 0
        maxTargets.push(target)
      } else if (val === maxValue) {
        maxTargets.push(target)
      }
    }
    return maxTargets
  } else if (value?.type === 'Pick') {
    const target = resolveProperties(bgioArguments, value.target, context, 'target')
    if (target !== undefined) {
      console.log('target', target)
      console.log('target.attributes', target.attributes)
      const x = pick(
        resolveProperties(
          bgioArguments,
          target.attributes,
          context,
          'attributes'
        ),
        value.properties
      )
      console.log('x', x)
      return x
    } else {
      console.log('8888target', target)
    }
  } else if (value?.type === 'Coordinates') {
    const originalTarget = value.target
      ? resolveProperties(bgioArguments, value.target, context, 'target')
      : context.originalTarget
      const parent = bgioArguments.G.bank.findParent(originalTarget)
      return parent.getCoordinates(originalTarget.rule.index)
  } else if (value?.type === 'relativeCoordinates') {
    const originalTarget = value.target
      ? resolveProperties(bgioArguments, value.target, context, 'target')
      : context.originalTarget
    const parent = bgioArguments.G.bank.findParent(originalTarget)
    const oldCoordinates =
      parent.getCoordinates(originalTarget.rule.index)
    const newCoordinates =
      parent.getRelativeCoordinates(
      oldCoordinates,
      resolveProperties(bgioArguments, value.location, context, 'location')
    )
    return (newCoordinates && parent.spaces[parent.getIndex(newCoordinates)]) ?? null
  } else {
    return value
  }
}

function getMappedTargets (bgioArguments, targetsRule, mapping, context) {
  targetsRule.resolveAsEntity = true
  return resolveProperties(bgioArguments, targetsRule, context)?.map(target => ({
    target,
    value: resolveProperties(
      bgioArguments,
      mapping,
      { ...context, loopTarget: target },
    )
  })) ?? []
}

