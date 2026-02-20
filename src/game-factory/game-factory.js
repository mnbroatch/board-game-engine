import { serialize } from "wackson";
import moveFactory from "./move/move-factory.js";
import Bank from "./bank/bank.js";
import expandGameRules from "./expand-game-rules.js";
import getScenarioResults from '../utils/get-scenario-results.js'
import doMoves from '../utils/do-moves.js'
import deserializeBgioArguments from '../utils/deserialize-bgio-arguments.js'

export default function gameFactory (gameRules, gameName) {
  const game = { name: gameName }
  const rules = expandGameRules(gameRules)

  game.setup = (bgioArguments) => {
    const { ctx } = bgioArguments
    const initialState = {
      _meta: {
        passedPlayers: [],
        previousPayloads: {},
      }
    };

    const entityDefinitions = expandEntityDefinitions(rules.entities, ctx)
    initialState.bank = new Bank(entityDefinitions)
    initialState.sharedBoard = initialState.bank.getOne(
      bgioArguments,
      {
        conditions: [{
          conditionType: 'Is',
          matcher: { name: "sharedBoard" }
        }]
      }
    )

    if (rules.personalBoard) {
      initialState.personalBoards = bgioArguments.ctx.playOrder.map((playerID) => 
        initialState.bank.getOne(
          bgioArguments,
          {
            conditions: [{
              conditionType: 'Is',
              matcher: {
                name: "personalBoard",
                player: playerID,
              }
            }]
          }
        )
      )
    }

    rules.initialMoves?.forEach((moveRule) => {
      moveFactory(moveRule, game).moveInstance.doMove(
        { ...bgioArguments, G: initialState }
      );
    })
    return JSON.parse(serialize(initialState));
  }

  if (rules.moves) {
    game.moves = createMoves(rules.moves, game)
  }

  if (rules.turn) {
    game.turn = createTurn(rules.turn, game)
  }

  if (rules.phases) {
    game.phases = Object.entries(rules.phases).reduce((acc, [name, phaseRule]) => ({
      ...acc,
      [name]: createPhase(phaseRule, game)
    }), {})
  }

  if (rules.endIf) {
    game.endIf = (bgioArguments) => {
      const newBgioArguments = deserializeBgioArguments(bgioArguments)
      return getScenarioResults(newBgioArguments, rules.endIf)
    }
  }

  if (!gameRules.DEBUG_DISABLE_SECRET_STATE) {
    game.playerView = (bgioArguments) => {
      const { G, playerID } = deserializeBgioArguments(bgioArguments)
      Object.values(G.bank.tracker).forEach(((entity) => {
        if (
          entity.rule.contentsHiddenFrom === 'All' 
           || (
              entity.rule.contentsHiddenFrom === 'Others'
                && (
                  playerID !== entity.rule.player
                  || playerID == undefined
                )
            )
        ) {
          // may want to hide entities inside spaces instead?
          if (entity.spaces) {
            entity.spaces = entity.rule.hideLength
              ? []
              : entity.spaces.map(() => G.bank.createEntity())
          }
          if (entity.entities) {
            entity.entities = entity.rule.hideLength
              ? []
              : entity.entities.map(() => G.bank.createEntity())
          }
        }
      }))
      return JSON.parse(serialize(G))
    }
  }

  return game
}

// create a new entity for each variant
function expandEntityDefinitions (entities, ctx) {
  return entities.reduce((acc, entity) => {
    const entityCopy = { ...entity }

    // perPlayer flag multiplies number of variants
    if (entityCopy.perPlayer) {
      delete entityCopy.perPlayer
      if (entityCopy.variants) {
        entityCopy.variants =
          (new Array(ctx.numPlayers)).fill().reduce((accu, _, i) => [
            ...accu,
            ...entityCopy.variants.map(variant => ({ ...variant, player: `${i}` }))
          ], [])
      } else {
        entityCopy.variants =
          (new Array(ctx.numPlayers)).fill().map((_, i) => ({ player: `${i}` }))
      }
    }

    // variants becomes new entitites
    if (entityCopy.variants) {
      const variants = entityCopy.variants
      delete entityCopy.variants

      return [
        ...acc,
        ...variants.map(variant => ({
          ...entityCopy,
          ...variant,
        }))
      ]
    } else {
      return [
        ...acc,
        entityCopy
      ]
    }
  }, [])
}

function createTurn (turnRule, game) {
  const turn = { ...turnRule }

  turn.onBegin = (bgioArguments) => {
    const newBgioArguments = deserializeBgioArguments(bgioArguments)
    const stageRule = turnRule.stages?.[
      newBgioArguments.ctx.activePlayers?.[newBgioArguments.ctx.currentPlayer]
    ]

    // not 100% sure about this logic / timing, but it seems to work so far in terms
    // of letting a player pass and still take a turn later if a move becomes available
    newBgioArguments.G._meta.passedPlayers = newBgioArguments.G._meta.passedPlayers
      .filter(p => p !== newBgioArguments.ctx.currentPlayer)

    doMoves(newBgioArguments, turnRule.initialMoves, { game })
    doMoves(newBgioArguments, stageRule?.initialMoves, { game })

    return JSON.parse(serialize(newBgioArguments.G));
  }

  if (turnRule.stages) {
    Object.entries(turnRule.stages).forEach(([stageName, stageRule]) => {
      if (stageRule.moves) {
        turn.stages[stageName].moves = createMoves(stageRule.moves, game)
      }
    })
  }

  if (turnRule.order?.playOrder === 'RotateFirst') {
    turnRule.order.first = () => 0
    turnRule.order.next = ({ ctx }) => (ctx.playOrderPos + 1) % ctx.numPlayers
    turn.order.playOrder = ({ ctx, G }) => {
      return G._meta.isAfterFirstPhase
        ? [...ctx.playOrder.slice(1), ctx.playOrder[0]]
        : ctx.playOrder
    }
  }

  return turn
}

function createPhase (phaseRule, game) {
  const phase = {...phaseRule}
  if (phaseRule.turn) {
    phase.turn = createTurn(phaseRule.turn, game)
  }
  if (phaseRule.moves) {
    phase.moves = createMoves(phaseRule.moves, game)
  }

  phase.onBegin = (bgioArguments) => {
    const newBgioArguments = deserializeBgioArguments(bgioArguments)
    doMoves(newBgioArguments, phaseRule.initialMoves, { game })
    newBgioArguments.G._meta.currentPhaseHasBeenSetUp = true
    newBgioArguments.G._meta.nextPhase = phaseRule.next
    return JSON.parse(serialize(newBgioArguments.G));
  }

  if (phaseRule.endIf) {
    phase.endIf = (bgioArguments) => {
      const newBgioArguments = deserializeBgioArguments(bgioArguments)
      if (newBgioArguments.G._meta.currentPhaseHasBeenSetUp) {
        const result = getScenarioResults(newBgioArguments, phaseRule.endIf)
        if (result) {
          return result
        }
      }
    }
  }

  phase.onEnd = ({ G }) => {
    G._meta.currentPhaseHasBeenSetUp = false
    G._meta.isAfterFirstPhase = true
  }

  return phase
}

function createMoves (moves, game) {
  return Object.entries(moves).reduce((acc, [name, moveDefinition]) => ({
    ...acc,
    [name]: moveFactory({ ...moveDefinition, name }, game)
  }), {})
}
