import get from 'lodash/get'
import Board from './board'
import Space from '../space/space'

export default class Grid extends Board {
  constructor (boardRule, options) {
    super(boardRule, options)
    this.grid = makeGrid(boardRule)
  }

  getEmptySpaces() {
    const emptySpaces = []
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[i].length; j++) {
        const space = this.grid[i][j]
        if (space.isEmpty()) {
          emptySpaces.push(space)
        }
      }
    }
    return emptySpaces
  }

  getSpace (target) {
    return get(this.grid, target)
  }

  getPieces (target) {
    return this.getSpace(target).pieces
  }

  placePiece (target, piece, rotation) {
    this.getSpace(target).placePiece(piece)
  }

  getTargetAfterRotation (target, rotation = 0) {
    if (rotation === 180) {
      const length = this.grid.length
      const width = this.grid[0].length
      return [
        length - target[0] - 1,
        width - target[1] - 1,
      ]
    } else {
      return target
    }
  }
}

function makeGrid(boardRule) {
  const x = boardRule.width
  const y = boardRule.height
  if (!x || !y) {
    throw new Error ('No size provided for grid')
  }

  const grid = []
  for (let i = 0; i < y; i++) {
    const row = []
    for (let j = 0; j < x; j++) {
      row.push(new Space([i, j]))
    }
    grid.push(row)
  }
  return grid
}
