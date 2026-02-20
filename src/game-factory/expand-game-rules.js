import cloneDeep from "lodash/cloneDeep.js";
import find from "lodash/find.js";
import transformJSON from "../utils/json-transformer.js";

// for later when we implement deep replacement
// { type: 'IsEmpty' } = { type: 'not', conditions: [{ type: 'Contains' }], 
// { matcher: {...blah} } => conditions.push({type: "Is", matcher: {...blah} })

    // put somewhere
    // const invariantConditionMappings = [
    //   {
    //     rule: {
    //       type: 'BankHasEnough',
    //       entity: rule.entity
    //     }
    //   },
    // ]


// Things we always want, don't need to configure, and
// want to treat as first-class citizens
const invariantEntities = [
  {
    type: "Space",
    count: "Infinity",
  },
  {
    type: "Board",
    name: 'sharedBoard'
  },
  {
    name: "playerMarker",
    perPlayer: true,
    count: "Infinity"
  }
]

function expandEntities (rules) {
  rules.entities = [
    ...invariantEntities,
    ...(rules.entities || [])
  ]
}

function expandInitialPlacements (rules, entities) {
  if (rules.sharedBoard) {
    const sharedBoardPlacements = rules.sharedBoard.map(matcher => ({ entity: matcher, destination: { name: 'sharedBoard' } }))
    if (!rules.initialPlacements) rules.initialPlacements = []
    rules.initialPlacements.unshift(...sharedBoardPlacements)
  }

  if (rules.personalBoard) {
    entities.push({
      type: "Board",
      name: 'personalBoard',
      perPlayer: true
    })
    const personalBoardPlacements = rules.personalBoard.map(matcher => ({
      entity: matcher,
      destination: {
        name: 'personalBoard'
      }
    }))
    if (!rules.initialPlacements) rules.initialPlacements = []
    rules.initialPlacements.unshift(...personalBoardPlacements)
  }

  if (rules.initialPlacements) {
    const initialPlacementMoves = rules.initialPlacements.map(placement =>  {

      // probably going to need to separate this even in the shorthand. maybe
      // combine, then search entity rule and extract state variables instead?
      const { state, ...matcher } = placement.entity
      const entityDefinition = find(entities, matcher)
      
      if (placement.destination.name === 'personalBoard') {
        return {
          type: 'ForEach',
          arguments: {
            targets: {
              type: 'ctxPath',
              path: ['playOrder']
            }
          },
          move: {
            type: 'PlaceNew',
            entity: {
              state,
              conditions: [{
                conditionType: 'Is',
                matcher: {
                  ...matcher,
                  ...(entityDefinition.perPlayer
                      ? {
                          player: {
                            type: 'contextPath',
                            path: ['loopTarget']
                          }
                        }
                      : {}
                  )
                },
              }]
            },
            arguments: {
              destination: {
                conditions: [{
                  conditionType: 'Is',
                  matcher: {
                    ...placement.destination,
                    player: {
                      type: 'contextPath',
                      path: ['loopTarget']
                    }
                  }
                }]
              },
            }
          }
        }
      } else {
        return {
          type: 'PlaceNew',
          entity: {
            state,
            conditions: [{
              conditionType: 'Is',
              matcher,
            }]
          },
          arguments: {
            destination: {
              conditions: [{
                conditionType: 'Is',
                matcher: placement.destination
              }]
            },
          }
        }
      }
    })
    if (!rules.initialMoves) rules.initialMoves = []
    rules.initialMoves.unshift(...initialPlacementMoves)
    delete rules.initialPlacements
  }
}

const keyMappings = [
  ['thatMatches', 'conditions'],
  ['entityType', 'type'],
  ['moveType', 'type'],
  ['endConditions', 'endIf'],
]

const simpleReplacements = [
  [
    'isCurrentPlayer', 
    {
      conditionType: 'Is',
      matcher: {
        player: {
          type: 'ctxPath',
          path: ['currentPlayer']
        }
      }
    }
  ],
  [
    'isEmpty',
    {
      conditionType: 'Not',
      conditions: [{conditionType: 'Contains'}]
    }
  ],
  [
    'ownerOfFirstResultEntity', // might have to more tightly couple this to HasLine condition
    {
      "type": "contextPath",
      "path": ["results", 0, "matches", 0, 0, "entities", 0, "attributes", "player"]
    }
  ]
]

const transformationRules = [
  {
    test: val => val && typeof val === 'object',
    replace: (val) => {
      keyMappings.forEach(([oldKey, newKey]) => {
        if (val.hasOwnProperty(oldKey)) {
          val[newKey] = val[oldKey]
          delete val[oldKey]
        }
      })
      return val
    }
  },
  {
    test: val => typeof val === 'string',
    replace: (val) => {
      for (let i = 0, len = simpleReplacements.length; i < len; i++) {
        if (val === simpleReplacements[i][0]) {
          return simpleReplacements[i][1]
        }
      }
      return val
    }
  },
  {
    test: val => val?.conditions,
    replace: (val) => {
      if (!Array.isArray(val.conditions)) {
        val.conditions = [val.conditions]
      }
      return val
    }
  },
  {
    test: val => val?.conditions,
    replace: (val) => {
      // make "Is" the default condition
      for (let i = 0, len = val.conditions.length; i < len; i++) {
        if (!val.conditions[i].conditionType) {
          val.conditions[i] = {
            conditionType: 'Is',
            matcher: val.conditions[i]
          }
        }
      }
      return val
    }
  },
  {
    test: val => typeof val?.target === 'string',
    replace: val => ({
      ...val,
      target: {
        conditions: [{
          conditionType: 'Is',
          matcher: {
            name: val.target
          }
        }]
      }
    })
  }
]

export default function expandGameRules (gameRules) {
  const rules = transformJSON(gameRules, transformationRules)

  if (!rules.sharedBoard) {
    rules.sharedBoard = rules.entities
  }

  if (!rules.turn) {
    rules.turn = {
      minMoves: 1,
      maxMoves: 1
    }
  }

  expandEntities(rules)
  expandInitialPlacements(rules, rules.entities)

  if (rules.phases) {
    Object.entries(rules.phases).forEach((phaseRule) => {
      expandInitialPlacements(phaseRule, rules.entities)
    })
  }

  if (gameRules.numPlayers) {
    gameRules.minPlayers = gameRules.maxPlayers = gameRules.numPlayers
  }

  return rules
}
