import PieceGroup from '../piece/piece-group'

class Player {
  constructor (rules, index) {
    this.rules = rules
    this.id = Math.random()
    this.pieces = rules.pieces?.map((pieceRule) => new PieceGroup(pieceRule, { player: this }))
    this.index = index
  }
}

export default Player
