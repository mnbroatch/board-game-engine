import Piece from './piece'

export default function pieceFactory (pieceRule, options) {
  return new Piece(pieceRule, options)
}
