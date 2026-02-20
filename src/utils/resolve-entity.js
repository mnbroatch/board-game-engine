import isPlainObject from "lodash/isPlainObject.js";

const abstractTargetNames = ['state']

export default function resolveEntity (bgioArguments, target, context, targetName) {
  return !abstractTargetNames.includes(targetName) && isPlainObject(target)
    ? bgioArguments.G.bank.find(bgioArguments, target, context)
    : target
}
