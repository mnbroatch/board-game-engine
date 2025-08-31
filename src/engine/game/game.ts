import matches from "lodash/matches.js";
import merge from "lodash/merge.js";
import get from "lodash/get.js";
import boardFactory from "../board/board-factory.js";
import Player from "../player/player";
import roundFactory from "../round/round-factory.js";
import conditionFactory from "../condition/condition-factory.js";
import actionFactory from "../action/action-factory.js";
import Pile from "../piece/pile.js";
import findValuePath from "../../util/find-value-path.js";
import { registry } from "../../registry.ts";

export interface GameRules {
  round: any;
  player: any;
  pieces: any[];
  sharedBoard: Record<string, any>;
  personalBoard?: Record<string, any>;
  initialPlacements?: any[];
  winCondition: any;
  drawCondition?: any;
}

export interface GameOptions {
  playerCount: number;
  [key: string]: any;
}

export interface Move {
  playerId: number;
  type?: string;
  piece?: {
    id?: string;
    name?: string;
    player?: {
      id: number;
    };
  };
  board?: string[];
  [key: string]: any;
}

export interface GameState {
  currentPhaseIndex: number;
  currentRoundIndex: number;
  context: Record<string, any>;
  gameOver: boolean;
  winner: Player | null;
  sharedBoard: Record<string, any>;
  players: Player[];
  personalBoards: Record<string, any>;
  pieces: Pile[];
}

function initializeState(state: GameState, rules: GameRules, options: GameOptions): GameState {
  expandRules(rules)
  state.sharedBoard = Object.entries(rules.sharedBoard).reduce(
    (acc, [id, board]) => ({
      ...acc,
      [id]: boardFactory({ ...board, path: ["sharedBoard", id] }, options),
    }),
    {},
  );

  state.players = Array.from(Array(options.playerCount)).map(
    (_, i) => new Player(rules.player, i),
  );

  state.personalBoards = state.players.reduce(
    (acc, player) => ({
      ...acc,
      [player.id]: Object.entries(rules.personalBoard || []).reduce(
        (acc, [id, board]) => ({
          ...acc,
          [id]: boardFactory(
            { ...board, path: ["sharedBoard", id] },
            { ...options, player },
          ),
        }),
        {},
      ),
    }),
    {},
  );

  state.pieces = rules.pieces.reduce((acc, pieceRule) => {
    if (pieceRule.perPlayer) {
      return [
        ...acc,
        ...state.players.map((player) => new Pile(pieceRule, { player })),
      ];
    } else {
      return [...acc, new Pile(pieceRule)];
    }
  }, []);

  // Apply initial placements
  rules.initialPlacements?.forEach((placement) => {
    if (placement.perPlayer) {
      state.players.forEach((player) => {
        doInitialPlacement(placement, player, {
          sharedBoard: state.sharedBoard,
          personalBoards: state.personalBoards,
          pieces: state.pieces,
        });
      });
    } else {
      doInitialPlacement(placement, null, {
        sharedBoard: state.sharedBoard,
        personalBoards: state.personalBoards,
        pieces: state.pieces,
      });
    }
  });

  const currentRoundRule = rules.round.phases
    ? rules.round.phases[0]
    : rules.round;
  state.currentRound = roundFactory(currentRoundRule, state);

  return state;
}

function checkWinner(state: GameState, rules: GameRules): Player | null {
  return (
    state.players.find((player) => {
      const winCondition = {
        ...rules.winCondition,
        piece: {
          ...rules.winCondition.piece,
          player,
        },
      };
      const condition = conditionFactory(winCondition, state);
      return condition.isMet();
    }) || null
  );
}

function checkDraw(state: GameState, rules: GameRules): boolean {
  return !!(
    rules.drawCondition && conditionFactory(rules.drawCondition, state).isMet()
  );
}

function expandActionPayload(move: Move, state: GameState, rules: GameRules) {
  const player = state.players.find((p) => p.id === move.playerId);
  if (!player) {
    throw new Error("Invalid player ID");
  }

  const pieceName = move.piece?.name || "playerMarker";
  const pieceRule = rules.pieces.find((piece) => piece.name === pieceName);

  let piece = move.piece
  if (!piece) {
    piece = {
      name: 'playerMarker',
      player: { id: move.playerId }
    }
  }

  const defaultMove = {
    type: "movePiece",
    player,
  };

  const expandedMove = {
    ...defaultMove,
    ...move,
    piece,
  };

  if (pieceRule?.perPlayer && !expandedMove.player) {
    expandedMove.piece.player = { id: player.id };
  }

  if (!expandedMove.board) {
    expandedMove.board = getBoardPathContaining(expandedMove.piece, state);
  }

  expandedMove.board = normalizePath(expandedMove.board, { player });

  return expandedMove;
}

export function makeMove(
  rules: GameRules,
  options: GameOptions,
  _state?: GameState,
  move?: Move,
): GameState {
  if (!_state) {
    return {
      context: {},
      gameOver: false,
      winner: null,
      players: [],
    }
  }

  const state = deserialize(_state)

  if (state.gameOver) {
    throw new Error("Game is over!");
  }

  if (move === undefined) {
    return state;
  }

  // Expand the move payload with defaults and normalizations
  const expandedMove = expandActionPayload(move, state, rules);

  const round = state.currentRound

  round.doAction(expandedMove);
  // Check if round is over and advance if needed
  if (round.isOver(state)) {
    if (rules.round.phases) {
      // Get current phase rule
      const currentPhaseRule = rules.round.phases[state.currentRound.currentPhaseIndex];

      // Create round for current phase
      const phaseRound = roundFactory(currentPhaseRule, state);

      // If this phase is over, move to next phase
      if (phaseRound.isOver(state)) {
        state.currentRound.currentPhaseIndex++;

        // If we've completed all phases, start new round
        if (state.currentRound.currentPhaseIndex >= rules.round.phases.length) {
          state.currentRound.currentPhaseIndex = 0;
          state.currentRound.currentRoundIndex++;
        }
      }
    } else {
      // No phases, just increment round
      state.currentRound.currentRoundIndex++;
    }
  }

  // Check win/draw conditions
  const winner = checkWinner(state, rules);
  const isDraw = checkDraw(state, rules);

  if (winner || isDraw) {
    state.gameOver = true
    state.winner = winner
  }

  // weird parsing is temp to test serialization
  return makeSerializable(state)
}

function doInitialPlacement(
  placement: {
    action: any;
    payload?: any;
    count?: number;
    rules: GameRules;
  },
  player: Player | null,
  state: GameState,
) {
  const actionRule = placement.action;
  const actionPayload = placement.payload || {};

  if (player) {
    actionPayload.player = player;
  }

  Array.from(new Array(placement.count || 1)).forEach(() => {
    const action = actionFactory(actionRule, state);
    action.do(expandActionPayload(actionPayload, state, rules));
  });
}

function getBoardPathContaining(
  piece: any,
  state: GameState,
  options?: any,
): string[] {
  return getPiecePaths(piece, state, options)[0];
}

function normalizePath(
  path: string[],
  options: { player?: Player } = {},
): string[] {
  return path[0] === "personalBoard" && options.player
    ? ["personalBoards", options.player.id.toString(), ...path.slice(1)]
    : path;
}

function getPiecePaths(
  matcher: any,
  state: GameState,
  options?: any,
): string[][] {
  const placesPiecesCanBe = {
    personalBoards: state.personalBoards,
    sharedBoard: state.sharedBoard,
    pieces: state.pieces,
  };

  return Array.from(findValuePath(placesPiecesCanBe, matches(matcher)))
    .filter((a) => a[a.length - 1] !== "rule")
    .sort((a) => (a[0] === "pieces" ? 1 : -1))
    .map((path) => normalizePath(path, options));
}

function expandOptions(options) {
  const defaultOptions = {
    playerCount: 2,
  };
  return merge({}, defaultOptions, options);
}

// mutates rules
function expandRules (rules) {
  addPathToRules(rules)
}

// mutates rules
export function addPathToRules (rules): void {
  const CHILD_KEYS = ['phases', 'rounds'];

  function annotate(node, pathSegs) {
    if (!node || typeof node !== 'object') return;

    // lodash.get path string, e.g. "round.phases.0.rounds.2"
    node.path = pathSegs.join('.');

    // recurse into either "phases" or "rounds" arrays if present
    for (const key of CHILD_KEYS) {
      const kids = node[key];
      if (Array.isArray(kids)) {
        kids.forEach((child, idx) => {
          annotate(child, pathSegs.concat(key, idx));
        });
      }
    }
  }

  // Top-level: support either "round" (object) or "rounds" (array), or both.
  if (rules.round && typeof rules.round === 'object') {
    annotate(rules.round, ['round']);
  }
  if (Array.isArray(rules.rounds)) {
    rules.rounds.forEach((r, i) => annotate(r, ['rounds', i]));
  }
}

function makeSerializable (state) {
  // see Serializable toJSON for stringification behavior
  return JSON.parse(JSON.stringify(state, (key, value) => {
    return value
  }))
}

function deserialize (state) {
  const newState = {}
  const instanceMap = new Map()
  const deserialized = JSON.parse(JSON.stringify(state), function (key, value) {
    if (value?.constructorName) {
      // don't create multiple instances for objects with same ID, use canonical instance
      const existingInstance = instanceMap.get(value.id)
      if (existingInstance) {
        console.log('existingInstance', existingInstance)
        return existingInstance
      } else {
        // by convention, state is last arg to classes that need it
        // it is filtered out of serialization-safe args because it's circular
        const obj = new registry[value.constructorName](...value.args, newState)
        Object.assign(obj, value) // re-populate instance properties
        instanceMap.set(obj.id, obj)
        return obj
      }
    } else {
      return value
    }
  })
  // re-establish circular reference
  return Object.assign(newState, deserialized)
}
