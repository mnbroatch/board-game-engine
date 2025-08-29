// This file is generated, so don't change it./nimport Board from './engine/board/board.js';
import Action from './engine/action/action.js';
import Piece from './engine/piece/piece.ts';
import Space from './engine/space/space.ts';
import Player from './engine/player/player.ts';
import Serializable from './engine/serializable.js';
import Pile from './engine/piece/pile.js';
import MovePieceAction from './engine/action/move-piece-action.js';
import SwapAction from './engine/action/swap-action.js';
import SelectPieceAction from './engine/action/select-piece-action.js';
import Condition from './engine/condition/condition.js';
import Round from './engine/round/round.js';

export const registry = new Map([
  ['Board', Board],
  ['Action', Action],
  ['Piece', Piece],
  ['Space', Space],
  ['Player', Player],
  ['Serializable', Serializable],
  ['Pile', Pile],
  ['MovePieceAction', MovePieceAction],
  ['SwapAction', SwapAction],
  ['SelectPieceAction', SelectPieceAction],
  ['Condition', Condition],
  ['Round', Round],
]);
