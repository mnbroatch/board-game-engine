import pieceFactory from './piece-factory'

class Pile {
  constructor (pieceRule, options = {}) {
    this.pieceRule = pieceRule
    this.id = pieceRule.id
    this.count = +pieceRule.count
    this.player = options.player
    this.options = options
    this.pool = []

    if (typeof this.count === 'undefined') {
      throw new Error('Piece has no count: ', pieceRule.id)
    }
  }

  getOne () {
    return this.getMultiple(1)[0]
  }

  getMultiple (count) {
    const toReturn = []
    if (this.count >= count) {
      this.count -= count
      const remainder = count - this.pool.length
      toReturn.push(...this.pool.splice(0, count))

      if (remainder > 0) {
        toReturn.push(...Array.from(new Array(remainder)).map(() => pieceFactory(this.pieceRule, this.options)))
      }
    }
    return toReturn
  }

  put (piece) {
    this.count += 1
    this.pool.push(piece)
  }
}

export default Pile
