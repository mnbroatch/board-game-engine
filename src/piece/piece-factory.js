import Piece from "./piece.ts";

export default function pieceFactory(pieceRule, options) {
  return new Piece(pieceRule, options);
}
