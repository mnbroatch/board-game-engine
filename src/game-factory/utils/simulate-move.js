import { serialize, deserialize } from 'wackson'
import { registry } from '../registry.js'

export default function simulateMove (bgioArguments, payload, context) {
  const simulatedG = deserialize(serialize(bgioArguments.G), registry)
  const newBgioArguments = {
    ...bgioArguments,
    G: simulatedG,
  }
  const simulatedPayload = { ...payload, arguments: {} }
  Object.entries(payload.arguments).forEach(([argName, arg]) => {
    simulatedPayload.arguments[argName] = arg.abstract
      ? arg
      : simulatedG.bank.locate(typeof arg === 'number' ? arg : arg.entityId)
  })

  context.moveInstance.doMove(
    newBgioArguments,
    simulatedPayload,
    context,
    { skipCheck: true }
  )

  return simulatedG
}
