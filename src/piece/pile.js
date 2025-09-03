import pieceFactory from './piece-factory.js'

// all this extra complication is to support arbitrary (infinite) piles of pieces
class Pile {
  constructor (pieceRule, options = {}) {
    this.pieceRule = pieceRule
    this.name = pieceRule.name
    this.id = `${Math.random()}`
    if (options.player) {
      this.player = options.player
    }
    this.options = options
    this.pool = (
      pieceRule.variants ? Object.entries(pieceRule.variants) : []
    ).reduce((acc, [variantId, variant]) => {
      const count = variant.count || 1
      return [
        ...acc,
        ...Array.from(Array(count)).map((_) =>
          pieceFactory(
            { ...{ ...pieceRule, variantId }, ...variant },
            this.options
          )
        )
      ]
    }, [])

    if (pieceRule.shuffled) {
      this.pool = this.pool
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)
    }

    this.count = this.pool.length || pieceRule.count
  }

  getOne () {
    return this.getMultiple(1)[0]
  }

  getMultiple (count) {
    const toReturn = []
    if (this.count === undefined || this.count >= count) {
      if (this.count) {
        this.count -= count
      }
      const remainder = count - this.pool.length
      toReturn.push(...this.pool.splice(0, count))

      if (remainder > 0) {
        toReturn.push(
          ...Array.from(new Array(remainder)).map(() =>
            pieceFactory(this.pieceRule, this.options)
          )
        )
      }
    }
    return toReturn
  }

  put (piece) {
    if (this.count !== undefined) {
      this.count += 1
    }
    this.pool.push(piece)
  }
}

export default Pile
