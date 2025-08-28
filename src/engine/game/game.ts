import matches from "lodash/matches.js";
import merge from "lodash/merge.js";
import get from "lodash/get.js";
import boardFactory from "../board/board-factory.js";
import Player from "../player/player";
import roundFactory from "../round/round-factory.js";
import conditionFactory from "../condition/condition-factory.js";
import actionFactory from "../action/action-factory.js";
import PieceGroup from "../piece/piece-group.js";
import findValuePath from "../../util/find-value-path.js";

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
  pieces: PieceGroup[];
}

function createInitialState(rules: GameRules, options: GameOptions): GameState {
  const sharedBoard = Object.entries(rules.sharedBoard).reduce(
    (acc, [id, board]) => ({
      ...acc,
      [id]: boardFactory({ ...board, path: ["sharedBoard", id] }, options),
    }),
    {},
  );

  const players = Array.from(Array(options.playerCount)).map(
    (_, i) => new Player(rules.player, i),
  );

  const personalBoards = players.reduce(
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

  const pieces = rules.pieces.reduce((acc, pieceRule) => {
    if (pieceRule.perPlayer) {
      return [
        ...acc,
        ...players.map((player) => new PieceGroup(pieceRule, { player })),
      ];
    } else {
      return [...acc, new PieceGroup(pieceRule)];
    }
  }, []);

  // Apply initial placements
  rules.initialPlacements?.forEach((placement) => {
    if (placement.perPlayer) {
      players.forEach((player) => {
        doInitialPlacement(placement, player, {
          sharedBoard,
          personalBoards,
          pieces,
        });
      });
    } else {
      doInitialPlacement(placement, null, {
        sharedBoard,
        personalBoards,
        pieces,
      });
    }
  });

  const currentRoundRule = rules.round.phases
    ? rules.round.phases[0]
    : rules.round;
  const currentRound = roundFactory(currentRoundRule);

  return {
    currentRound,
    context: {},
    gameOver: false,
    winner: null,
    sharedBoard,
    players,
    personalBoards,
    pieces,
  };
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

  const piece = move.piece?.id
    ? { id: move.piece.id }
    : move.piece?.name
      ? move.piece
      : { name: "playerMarker" };

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
  state?: GameState,
  move?: Move,
): GameState {
  if (!state) {
    return createInitialState(rules, options);
  }

  if (state.gameOver) {
    throw new Error("Game is over!");
  }

  if (move === undefined) {
    return state;
  }

  // Expand the move payload with defaults and normalizations
  const expandedMove = expandActionPayload(move, state, rules);

  // Get the appropriate round rule based on current phase
  console.log('rules.round', rules.round)
  console.log('state.currentRound', state.currentRound)
  const currentRoundRule = rules.round.phases
    ? rules.round.phases[state.currentRound.currentPhaseIndex]
    : rules.round;
  console.log('currentRoundRule', currentRoundRule)

  // Create round handler and apply move
  newState.currentRound = roundFactory(currentRoundRule, state);
  let newState = round.doAction(state, expandedMove);

  // Check if round is over and advance if needed
  if (round.isOver(newState)) {
    newState = { ...newState };

    if (rules.round.phases) {
      // Get current phase rule
      const currentPhaseRule = rules.round.phases[newState.currentRound.currentPhaseIndex];

      // Create round for current phase
      const phaseRound = roundFactory(currentPhaseRule, newState);

      // If this phase is over, move to next phase
      if (phaseRound.isOver(newState)) {
        newState.currentRound.currentPhaseIndex++;

        // If we've completed all phases, start new round
        if (newState.currentRound.currentPhaseIndex >= rules.round.phases.length) {
          newState.currentRound.currentPhaseIndex = 0;
          newState.currentRound.currentRoundIndex++;
        }
      }
    } else {
      // No phases, just increment round
      newState.currentRound.currentRoundIndex++;
    }
  }

  // Check win/draw conditions
  const winner = checkWinner(newState, rules);
  const isDraw = checkDraw(newState, rules);

  if (winner || isDraw) {
    newState = {
      ...newState,
      gameOver: true,
      winner,
    };
  }

  return newState;
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
