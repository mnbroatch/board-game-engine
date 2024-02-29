const isEqual = require('lodash/isEqual')
const omit = require('lodash/omit')
const ticTacToe = require('./tic-tac-toe.json')
const onitama = require('./onitama.json')

function getEmptyGridSpaces(grid) {
  const emptySpaces = []
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === null) {
        emptySpaces.push([j, i])
      }
    }
  }
  return emptySpaces
}

const winConditions = {
  bingo(game, lastAction) {
    const [x, y] = lastAction.space
    const lastPlayer = game.sharedBoard.spaces[y][x]?.player
    if (game.sharedBoard.spaces.every((row) => row[x]?.player === lastPlayer)) {
      return lastPlayer
    }
    if (game.sharedBoard.spaces[y].every((piece) => piece?.player === lastPlayer)) {
      return lastPlayer
    }
    if (game.sharedBoard.spaces.every((row, i) => row[i]?.player === lastPlayer)) {
      return lastPlayer
    }
    if (game.sharedBoard.spaces.every((row, i) => row[row.length - i]?.player === lastPlayer)) {
      return lastPlayer
    }

    return false
  }
}

const drawConditions = {
  blackout(game) {
    return game.sharedBoard.spaces.every((row) => row.every(piece => piece !== null))
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

class Board {
  constructor (id, rules) {
    this.id = id
    this.rules = rules
    this.spaces = {
      'grid': () => makeGrid(rules.width, rules.height)
    }[rules.type]?.()
  }

  getEmptySpaces () {
    return {
      'grid': () => getEmptyGridSpaces(this.spaces)
    }[this.rules.type]?.()
  }

  placePiece (action, piece) {
    ({
      grid: () => {
        this.spaces[action.space[1]][action.space[0]] = piece
      }
    })[this.rules.type]()
  }
}

const STEP_TYPES = {
  takeTurns: 'takeTurns'
}

const ACTION_TYPES = {
  placePiece: 'placePiece'
}

function expandStepRules (rules = 'placePiece') {
  if (typeof rules === 'string') {
    rules = { type: rules }
  }

  if (rules.type in ACTION_TYPES) {
    const defaultActionRules = {
      [ACTION_TYPES.placePiece]: {
        type: ACTION_TYPES.placePiece,
        piece: 'playerMarker',
        restrictions: [
          {
            type: 'unoccupied'
          }
        ]
      }
    }[rules.type]

    const actionRules = Object.assign({}, defaultActionRules, rules)

    return {
      type: STEP_TYPES.takeTurns,
      actions: [actionRules]
    }
  } else {
    return rules
  }
}

function expandGameplayRules (rules) {
  return {
    steps: rules?.steps
      ? rules.steps.map(expandStepRules)
      : [expandStepRules(rules)]
  }
}

function expandRules (rules) {
  const gameplay = expandGameplayRules(rules.gameplay)

  return {
    ...rules,
    playersCount: rules.playersCount || 1,
    gameplay: expandGameplayRules(rules.gameplay),
  }
}

function getNextStep (rules, currentStep) {
  let nextStep = currentStep
  if (!nextStep) {
    nextStep = rules
    // Start on left side of tree
    // Will probably have to accumulate some rules/restrictions from parents
    while (nextStep.steps?.length) {
      nextStep.steps[0].parent = nextStep
      nextStep = nextStep.steps[0]
    }

    return nextStep
  } else {
    while (nextStep.parent && !nextStep.parent.steps[nextStep.parent.steps.indexOf(nextStep) + 1]) {
      // currentStep is the last sibling step, move up and over a layer
      nextStep = nextStep.parent
    }
    if (nextStep.parent) {
      return nextStep.parent.steps[nextStep.parent.steps.findIndex(nextStep) + 1]
    } else {
      return getNextStep(rules)
    }
  }
}

class Game {
  constructor(rules) {
    this.rules = expandRules(rules)
    this.sharedBoard = new Board('main', this.rules.sharedBoard)

//     this.players = []
//     for (let i = 0; i < this.rules.playersCount; i++) {
//       this.players.push(this.makePlayer(i))
//     }

//     // // Bad shuffle algo, good enough for now
//     // this.players.sort(() => Math.random() - 0.5)

//     this.currentStep = getNextStep(this.rules.gameplay)
//     this.currentPlayer = this.players[0]
  }

  performAction (action) {
    const piece = new Piece(action)
    ;({
      [ACTION_TYPES.placePiece]: () => {
        this.getBoardById(action.board)?.placePiece(action, piece)
      },
    })[action.type]()
  }

  getBoardById (id) {
    if (id === 'main') {
      return this.sharedBoard
    }
  }

  expandAction (action) {
    return {
      ...action,
      player: action.player || this.currentPlayer.id,
      board: action.board || 'main',
      piece: action.piece || 'playerMarker',
      type: action.type || 'placePiece',
    }
  }

  choose (chosenAction) {
    const action = this.expandAction(chosenAction)

    const possibleActions = this.currentStep.actions
      .map(this.expandAction.bind(this))
      .map((a) => this.getPossibleActions({ ...a, player: this.currentPlayer.id }))
      .flat()

    if (!possibleActions?.some(a => isEqual(a, action))) {
      throw new Error('Action not possible!')
    }

    this.performAction(action)
    const emptySpaces = this.sharedBoard.getEmptySpaces()
    this.status = this.getStatus(action)
    this.advance()
  }

  advance () {
    if (this.currentStep.type === 'takeTurns') {
      const nextIndex = (this.players.indexOf(this.currentPlayer) + 1) % this.rules.playersCount
      this.currentPlayer = this.players[nextIndex]

      if (nextIndex === 0) {
        this.currentStep = getNextStep(this.rules.gameplay, this.currentStep)
      }
    }
  }

  getPossibleActions (action) {
    if (
      action.type === 'placePiece' &&
      action.piece === 'playerMarker' &&
      action.board === 'main'
    ) {
      let possibleActions = this.sharedBoard.getEmptySpaces()
        .map(space => omit({
          ...action,
          space
        }, ['restrictions']))

      if (action.restrictions?.some(r => r.type === 'unoccupied')) {
        const emptySpaces = this.sharedBoard.getEmptySpaces()
        possibleActions = possibleActions.filter(action => {
          return emptySpaces.some(space => isEqual(action.space, space))
        })
      }

      return possibleActions
    }
  }

  getStatus(action) {
    const winner = winConditions[this.rules.winCondition](this, action)
    const isDraw = drawConditions[this.rules.drawCondition](this, action)

    return {
      winner,
      isDraw
    }
  }

  makePlayer(id) {
    return { id }
  }
}

class Piece {
  constructor ({ player }) {
    this.player = player
  }
}

const game = new Game(onitama)








// const game = new Game(ticTacToe)

// game.choose({ space: [1, 1] })
// game.choose({ space: [0, 0] })
// game.choose({ space: [2, 2] })
// game.choose({ space: [2, 0] })
// game.choose({ space: [1, 2] })
// game.choose({ space: [1, 0] })

// draw 
// game.choose({ space: [0, 0] })
// game.choose({ space: [0, 1] })
// game.choose({ space: [0, 2] })
// game.choose({ space: [1, 0] })
// game.choose({ space: [1, 1] })
// game.choose({ space: [1, 2] })
// game.choose({ space: [2, 0] })
// game.choose({ space: [2, 1] })
// game.choose({ space: [2, 2] })
