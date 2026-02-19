import { Client as BoardgameIOClient } from 'boardgame.io/client'
import { Debug } from 'boardgame.io/debug';
import { SocketIO } from 'boardgame.io/multiplayer'

import { serialize, deserialize } from "wackson";
import { registry } from "../../server/game-factory/registry.js";
import simulateMove from "../../server/game-factory/utils/simulate-move.js";
import preparePayload from "../utils/prepare-payload.js";
import getCurrentMoves from "../../server/game-factory/utils/get-current-moves.js";
import getSteps from '../utils/get-steps.js';
import createPayload from '../utils/create-payload.js';
import resolveProperties from "../../server/game-factory/utils/resolve-properties.js";
import checkConditions from '../../server/game-factory/utils/check-conditions.js';
import gameFactory from '../../server/game-factory/game-factory.js'

export default class Client {
  constructor (options) {
    this.options = options
    this.moveBuilder = {
      targets: [],
      stepIndex: 0,
      eliminatedMoves: []
    }
    this.optimisticWinner = null
    this.allClickable = new Set()
    this.game = gameFactory(JSON.parse(gameRules), rulesHash)
  }

  connect () {
    const {
      server,
      numPlayers,
      onClientUpdate,
      debug = {
        collapseOnLoad: true,
        impl: Debug,
      },
      gameId,
      gameRules,
      boardgamePlayerID,
      clientToken,
      singlePlayer = !clientToken,
    } = this.options

    try {
      const clientOptions = singlePlayer
        ? { game: this.game, numPlayers, debug }
        : {
            game: this.game,
            multiplayer: singlePlayer ? undefined : SocketIO({
              server,
              socketOpts: {
                transports: ['websocket', 'polling']
              }
            }),
            matchID: gameId,
            playerID: boardgamePlayerID,
            credentials: clientToken,
            debug,
          }

      this.client = BoardgameIOClient(clientOptions)

      if (onClientUpdate) {
        this.client.subscribe(onClientUpdate)
      }

      this.client.start()

      return this
    } catch (error) {
      console.error('Failed to join game:', error)
    }
  }

  getState () {
    let state
    let moves
    let gameover
    const clientState = this.client?.getState()
    if (clientState) {
      state = {
        ...clientState,
        G: deserialize(JSON.stringify(clientState.G), registry),
        originalG: clientState.G,
      }

      gameover = state?.ctx?.gameover

      // Fix: use arrow function so `this` refers to the Client instance
      moves = !gameover
        ? Object.entries(getCurrentMoves(state, this.client)).reduce((acc, [moveName, rawMove]) => {
            const move = (payload) => {
              this.client.moves[moveName](preparePayload(payload))
            }
            move.moveInstance = rawMove.moveInstance
            return {
              ...acc,
              [moveName]: move
            }
          }, {})
        : []
    }

    return {
      state,
      gameover,
      moves
    }
  }

  doStep (target, isSpectator) {
    const { state, moves } = this.getState()
    const { possibleMoveMeta, allClickable } = getPossibleMoves(
      state,
      moves,
      this.moveBuilder,
      isSpectator
    )
    this.allClickable = allClickable

    // Filter out moves that don't accept this target
    const newEliminated = Object.entries(possibleMoveMeta)
      .filter(([_, meta]) => !meta.finishedOnLastStep && !meta.clickableForMove.has(target))
      .map(([name]) => name)
      .concat(this.moveBuilder.eliminatedMoves);

    if (newEliminated.length === Object.keys(moves).length) {
      console.error('invalid move with target:', target?.rule);
      return;
    }

    this.moveBuilder = {
      eliminatedMoves: newEliminated,
      stepIndex: this.moveBuilder.stepIndex + 1,
      targets: [...this.moveBuilder.targets, target]
    }

    // Fix: filter possibleMoveMeta to only include moves not in newEliminated,
    // so findCompletedMove sees the post-elimination state rather than the stale pre-elimination state
    const filteredMoveMeta = Object.fromEntries(
      Object.entries(possibleMoveMeta).filter(([name]) => !newEliminated.includes(name))
    );

    const completed = findCompletedMove(state, filteredMoveMeta, this.moveBuilder, moves);
    
    if (completed) {
      // without this, an extra post-game turn would flash
      this.optimisticWinner = getWinnerAfterMove(
        state,
        this.game,
        completed.move.moveInstance,
        completed.payload
      );
      
      completed.move(completed.payload);
      
      this.moveBuilder = ({ targets: [], stepIndex: 0, eliminatedMoves: [] });
    }

    this.options.onClientUpdate?.()
  }

  reset () {
    this.moveBuilder = ({ targets: [], stepIndex: 0, eliminatedMoves: [] });
    this.optimisticWinner = null
    this.options.onClientUpdate?.()
  }

  undoStep () {
    if (this.moveBuilder.targets.length) {
      this.moveBuilder = {
        targets: this.moveBuilder.targets.slice(0, -1),
        stepIndex: Math.max(0, this.moveBuilder.stepIndex - 1),
        eliminatedMoves: []
      }
    }
    this.options.onClientUpdate?.()
  }
}

function getPossibleMoves(bgioState, moves, moveBuilder, isSpectator) {
  if (isSpectator) {
    return { possibleMoveMeta: {}, allClickable: new Set() };
  }

  const { eliminatedMoves, stepIndex } = moveBuilder;
  
  const possibleMoveMeta = {};
  const allClickable = new Set();

  const availableMoves = Object.entries(moves)
    .filter(([moveName]) => !eliminatedMoves.includes(moveName));

  availableMoves.forEach(([moveName, move]) => {
    const moveRule = resolveProperties(
      bgioState,
      { ...move.moveInstance.rule, moveName }
    )

    const context = {
      moveInstance: move.moveInstance,
      moveArguments: moveRule.arguments
    }
    
    const payload = createPayload(
      bgioState,
      moveRule,
      moveBuilder.targets,
      context
    );
    
    context.moveArguments = {
      ...context.moveArguments,
      ...payload.arguments,
    }

    const moveIsAllowed = checkConditions(
      bgioState,
      moveRule,
      {},
      context
    ).conditionsAreMet;

    const moveSteps = getSteps(
      bgioState,
      moveRule
    );

    const lastStep = moveSteps?.[stepIndex - 1];
    const currentStep = moveSteps?.[stepIndex];
    const finishedOnLastStep = moveSteps && !!lastStep && !currentStep;
    
    const clickableForMove = new Set(
      (moveIsAllowed && currentStep?.getClickable(context)) || []
    );

    possibleMoveMeta[moveName] = { finishedOnLastStep, clickableForMove };
    
    clickableForMove.forEach((entity) => {
      allClickable.add(entity);
    });
  });

  return { possibleMoveMeta, allClickable };
}

// Fix: renamed first parameter from `bgioArguments` to `bgioState` to match its actual usage
function findCompletedMove(bgioState, possibleMoveMeta, moveBuilder, moves) {
  const possibleMoveNames = Object.keys(possibleMoveMeta);
  
  // Only one possible move left
  if (possibleMoveNames.length !== 1) return null;
  
  const moveName = possibleMoveNames[0];
  const meta = possibleMoveMeta[moveName];
  
  // And it's finished
  if (!meta.finishedOnLastStep) return null;
  
  const move = moves[moveName];
  const moveRule = move.moveInstance.rule;
  
  const payload = createPayload(
    bgioState,
    moveRule,
    moveBuilder.targets,
    { moveInstance: move.moveInstance }
  );

  return { moveName, move, payload };
}

function getWinnerAfterMove (state, game, moveInstance, movePayload) {
  const simulatedG = simulateMove(
    state,
    preparePayload(movePayload),
    { moveInstance }
  )

  return game.endIf?.({
    ...state,
    G: JSON.parse(serialize(simulatedG))
  })
}
