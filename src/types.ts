import type { Space, Piece, Board, Player } from "./engine/index";
export interface GameRules {
  sharedBoard: Record<string, object>;
}
export type PlayerRule = Record<string, object>;
export interface PieceRule {
  name: string;
}
export type PieceRuleMatcher = Partial<PieceRule> & {
  player?: Player;
  id?: string;
};
export interface ActionPayload {
  type: "selectPiece" | "movePiece";
  playerId: Player["id"];
  piece: PieceRuleMatcher;
}
export type OnPieceClick = (piece: Piece, space: Space, board: Board) => void;
export type OnSpaceClick = (space: Space, board: Board) => void;
