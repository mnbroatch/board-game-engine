import Move from "./move.js";

export default class PlaceNew extends Move {
  do(bgioArguments, rule, { arguments: { destination } }, context) {
    const entities = rule.matchMultiple
      ? bgioArguments.G.bank.getMultiple(
          bgioArguments,
          {
            ...rule.entity,
            conditions: [
              ...(rule.entity?.conditions || []),
              ...(rule.conditions || []),
            ]
          },
          rule.count,
          context
        )
      : [bgioArguments.G.bank.getOne(
          bgioArguments,
          {
            ...rule.entity,
            conditions: [
              ...(rule.entity?.conditions || []),
              ...(rule.conditions || []),
            ]
          },
          context
        )]
    entities.forEach((entity) => {
      destination.placeEntity(entity, rule.position)
    })
  }
}
