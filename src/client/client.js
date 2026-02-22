import { Client as BoardgameIOClient } from '@mnbroatch/boardgame.io/client'
import { Debug } from '@mnbroatch/boardgame.io/debug';
import { SocketIO } from '@mnbroatch/boardgame.io/multiplayer'
import { serialize, deserialize } from 'wackson';
import gameFactory from '../game-factory/game-factory.js'
import { registry } from '../registry.js';
import simulateMove from '../utils/simulate-move.js';
import getCurrentMoves from '../utils/get-current-moves.js';
import resolveProperties from '../utils/resolve-properties.js';
import checkConditions from '../utils/check-conditions.js';
import preparePayload from '../utils/prepare-payload.js';
import getSteps from '../utils/get-steps.js';
import createPayload from '../utils/create-payload.js';

export class Client {
  constructor (options) {
    this.options = options
    this.game = options.boardgameIOGame
      || gameFactory(JSON.parse(options.gameRules), options.gameName)

    if (!options.boardgameIOGame) {
      this.moveBuilder = { targets: [], stepIndex: 0, eliminatedMoves: [] }
      this.optimisticWinner = null
    }
  }

  connect () {
    const {
      server,
      numPlayers,
      debug = {
        collapseOnLoad: true,
        impl: Debug,
      },
      gameId,
      boardgamePlayerID,
      clientToken,
      singlePlayer = !clientToken,
    } = this.options

    try {
      const clientOptions = singlePlayer
        ? { game: this.game, numPlayers, debug }
        : {
            game: this.game,
            multiplayer: SocketIO({ server, socketOpts: { transports: ['websocket', 'polling'] } }),
            matchID: gameId,
            playerID: boardgamePlayerID,
            credentials: clientToken,
            debug,
          }

      this.client = BoardgameIOClient(clientOptions)
      this.client.subscribe(() => this.update())
      this.client.start()
      return this
    } catch (error) {
      console.error('Failed to join game:', error)
    }
  }

  update () {
    this.options.onClientUpdate?.()
  }

  getState () {
    const clientState = this.client?.getState()
    if (!clientState) return {}

    if (this.options.boardgameIOGame) {
      return {
        state: clientState,
        gameover: clientState?.ctx?.gameover,
        moves: this.client.moves,
      }
    }

    const state = {
      ...clientState,
      G: deserialize(JSON.stringify(clientState.G), registry),
      originalG: clientState.G,
    }

    const gameover = state?.ctx?.gameover

    const moves = !gameover
      ? Object.entries(getCurrentMoves(state, this.client)).reduce((acc, [moveName, rawMove]) => {
          const move = (payload) => {
            this.client.moves[moveName](preparePayload(payload))
          }
          move.moveInstance = rawMove.moveInstance
          return { ...acc, [moveName]: move }
        }, {})
      : []

    const possibleMoves = getPossibleMoves(state, moves, this.moveBuilder)
    const allClickable = possibleMoves.allClickable
    const possibleMoveMeta = possibleMoves.possibleMoveMeta

    return { state, gameover, moves, allClickable, possibleMoveMeta }
  }

  doStep (_target) {
    if (this.options.boardgameIOGame) return

    const { state, moves, possibleMoveMeta } = this.getState()

    const target = _target.abstract
      ? _target
      : state.G.bank.locate(_target.entityId)

    const newEliminated = Object.entries(possibleMoveMeta)
      .filter(([_, meta]) => !hasTarget(meta.clickableForMove, target))
      .map(([name]) => name)
      .concat(this.moveBuilder.eliminatedMoves);

    if (newEliminated.length === Object.keys(moves).length) {
      console.error('invalid move with target:', target?.rule);
      return;
    }

    const remainingMoveEntries = Object.entries(possibleMoveMeta)
      .filter(([name]) => !newEliminated.includes(name))

    if (isMoveCompleted(state, moves, remainingMoveEntries, this.moveBuilder.stepIndex)) {
      const [moveName] = remainingMoveEntries[0]
      const move = moves[moveName]
      const payload = createPayload(
        state,
        move.moveInstance.rule,
        [...this.moveBuilder.targets, target],
        { moveInstance: move.moveInstance }
      );

      this.optimisticWinner = getWinnerAfterMove(state, this.game, move.moveInstance, payload);
      move(payload);
      this.moveBuilder = { targets: [], stepIndex: 0, eliminatedMoves: [] };
    } else {
      this.moveBuilder = {
        eliminatedMoves: newEliminated,
        stepIndex: this.moveBuilder.stepIndex + 1,
        targets: [...this.moveBuilder.targets, target]
      }
    }

    this.update()
  }

  reset () {
    if (this.options.boardgameIOGame) return
    this.moveBuilder = { targets: [], stepIndex: 0, eliminatedMoves: [] };
    this.optimisticWinner = null
    this.update()
  }

  undoStep () {
    if (this.options.boardgameIOGame) return
    if (this.moveBuilder.targets.length) {
      this.moveBuilder = {
        targets: this.moveBuilder.targets.slice(0, -1),
        stepIndex: Math.max(0, this.moveBuilder.stepIndex - 1),
        eliminatedMoves: []
      }
    }
    this.update()
  }
}

function hasTarget(clickableSet, target) {
  if (!target.abstract) return clickableSet.has(target);
  return [...clickableSet].some(item => item.abstract && item.value === target.value);
}

function getPossibleMoves(bgioState, moves, moveBuilder) {
  const { eliminatedMoves, stepIndex } = moveBuilder;
  const possibleMoveMeta = {};
  const allClickable = new Set();

  Object.entries(moves)
    .filter(([moveName]) => !eliminatedMoves.includes(moveName))
    .forEach(([moveName, move]) => {
      const moveRule = resolveProperties(bgioState, { ...move.moveInstance.rule, moveName })

      const context = {
        moveInstance: move.moveInstance,
        moveArguments: moveRule.arguments
      }

      const targets = moveBuilder.targets.map(t =>
        t.abstract ? t : bgioState.G.bank.locate(t.entityId)
      )

      const payload = createPayload(bgioState, moveRule, targets, context);

      context.moveArguments = { ...context.moveArguments, ...payload.arguments }

      const moveIsAllowed = checkConditions(bgioState, moveRule, {}, context).conditionsAreMet;
      const moveSteps = getSteps(bgioState, moveRule);

      const clickableForMove = new Set(
        (moveIsAllowed && moveSteps?.[stepIndex]?.getClickable(context)) || []
      );

      possibleMoveMeta[moveName] = { clickableForMove };
      clickableForMove.forEach(entity => allClickable.add(entity));
    });

  return { possibleMoveMeta, allClickable };
}

function isMoveCompleted(state, moves, remainingMoveEntries, stepIndex) {
  return remainingMoveEntries.length === 1 &&
    getSteps(state, moves[remainingMoveEntries[0][0]].moveInstance.rule).length === stepIndex + 1;
}

function getWinnerAfterMove (state, game, moveInstance, movePayload) {
  const simulatedG = simulateMove(state, preparePayload(movePayload), { moveInstance })
  return game.endIf?.({ ...state, G: JSON.parse(serialize(simulatedG)) })
}
