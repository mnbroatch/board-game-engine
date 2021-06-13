const ticTacToe = require('tic-tac-toe.json')
const onitama = require('onitama.json')

// rename to decisions?
const choices = {
  placeOnGrid: {
    getPrompt(game) {
      return {
        type: 'placeOnGrid',
        options: getEmptyGridSpaces(game.board),
      }
    },
    choose(game, [ x, y ]) {
      game.board[y][x] = game.currentPlayer
    }
  }
}

function makeGrid(x, y) {
  if (!x || !y) {
    throw new Error ('No size provided for grid')
  }

  const grid = []
  for (let i = 0; i < y; i++) {
    const row = []
    for (let j = 0; j < x; j++) {
      row.push(null)
    }
    grid.push(row)
  }
  return grid
}

function getEmptyGridSpaces(grid) {
  const invertedGrid = []
  for (let i = 0; i < grid.length; i++) {
    const row = []
    for (let j = 0; j < grid[i].length; j++) {
      row.push(grid[i][j] === null)
    }
    invertedGrid.push(row)
  }
  return invertedGrid
}

const winConditions = {
  bingo(game, [ x, y ]) {
    const player = game.board[y][x]

    if (game.board.every((row) => row[x] === player)) {
      return player
    }
    if (game.board[y].every((piece) => piece === player)) {
      return player
    }
    if (game.board.every((row, i) => row[i] === player)) {
      return player
    }
    if (game.board.every((row, i) => row[row.length - i] === player)) {
      return player
    }

    return false
  }
}

class Game {
  constructor(rules, numPlayers = 2) {
    this.rules = rules
    this.numPlayers = numPlayers
    this.board = this.makeInitialBoard()

    this.players = []
    for (let i = 0; i < numPlayers; i++) {
      this.players.push(this.makeInitialPlayer(rules, numPlayers, i))
    }
    this.currentPlayer = 0

    this.currentPrompt = choices[rules.gameplay].getPrompt(this)
  }

  choose (choice) {
    choices[rules.gameplay].choose(this, choice)
    this.currentPlayer = (this.currentPlayer + 1) % this.numPlayers
    this.maybeEndGame(choice)
  }

  maybeEndGame(choice) {
    const winner = winConditions[this.rules.winCondition](this, choice)
    if (winner || winner === 0) {
      this.winner = winner
      delete this.currentPrompt
    }
  }

  makeInitialBoard() {
    let board = {}

    if (this.rules.board.type === 'grid') {
      return makeGrid(this.rules.board.x, this.rules.board.y)
    }
  }

  makeInitialPlayer() {
    const player = {}
    return player
  }
}

const game = new Game(ticTacToe)
game.choose([1, 1])
game.choose([0, 0])
game.choose([2, 0])
game.choose([0, 2])
game.choose([1, 2])
game.choose([0, 1])
