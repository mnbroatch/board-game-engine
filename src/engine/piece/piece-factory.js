import Piece from "./piece.js";

export default function pieceFactory(pieceRule, options) {
  return new Piece(pieceRule, options);
}
