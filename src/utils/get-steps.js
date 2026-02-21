// controls order of what players need to click first
const argNamesMap = {
  PlaceNew: ['destination'],
  RemoveEntity: ['entity'],
  MoveEntity: ['entity', 'destination'],
  TakeFrom: ['source', 'destination'],
  SetState: ['entity', 'state'],
}

// this might not be where special handling for setstate wants to live
export default function getSteps (bgioState, moveRule) {
  return argNamesMap[moveRule.type]
    .filter(argName => moveRule.arguments[argName].playerChoice)
    .map(argName => ({
      argName,
      getClickable: argName === 'state'
        ? () => moveRule.arguments[argName].possibleValues.map((value) => ({
            abstract: true,
            ...moveRule.arguments[argName],
            value
          }))
        : (context) => bgioState.G.bank.findAll(
            bgioState,
            moveRule.arguments[argName],
            context
          )

    }))
}
