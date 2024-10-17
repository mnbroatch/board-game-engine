import merge from 'lodash/merge'
import get from 'lodash/get'
import boardFactory from '../board/board-factory'
import Player from '../player/player'
import roundFactory from '../round/round-factory'
import conditionFactory from '../condition/condition-factory'
import actionFactory from '../action/action-factory'
import PieceGroup from '../piece/piece-group'


export default class Game {
  constructor (rules, options) {
    this.rules = expandRules(rules, options)
    this.options = expandOptions(rules, options)
    this.initialize()
    this.generator = this.createRoundGenerator(this.rules.round)
    this.advance()
  }

  // TODO: DRY this up 
  initialize () {
    this.sharedBoard = Object.entries(this.rules.sharedBoard).reduce((acc, [id, board]) => {
      const path = ['sharedBoard', id]
      return {
        ...acc,
        [id]: boardFactory({ ...board, path }, this.options)
      }
    }, {})

    this.players = Array.from(Array(this.options.playerCount)).map((_, i) => new Player(this.rules.player, i))

    this.personalBoards = this.players.reduce((acc, player) => ({
      ...acc,
      [player.id]: Object.entries(this.rules.personalBoard || []).reduce((acc, [id, board]) => {
        const path = ['sharedBoard', id]
        return {
          ...acc,
          [id]: boardFactory({ ...board, path }, { ...this.options, player })
        }
      }, {})
    }), {})

    this.pieces = this.rules.pieces.reduce((acc, pieceRule) => {
      if (pieceRule.perPlayer) {
        return [
          ...acc,
          ...this.players.map(player => new PieceGroup(pieceRule, { player }))
        ]
      } else {
        return [
          ...acc,
          new PieceGroup(pieceRule)
        ]
      }
    }, [])

    this.rules.initialPlacements?.forEach((placement) => {
      if (placement.perPlayer) {
      } else {
        const actionRule = {
          type: 'movePiece',
          piece: {
            id: placement.pieceId,
            board: placement.board
          }
        }

        if (placement.targets) {
          placement.targets.forEach(target => {
            actionFactory(actionRule, this).do({
              piece: {
                id: placement.pieceId,
              },
              type: 'movePiece',
              board: placement.board,
              target
            })
          })
        } else {
          actionFactory(actionRule, this).do({
            piece: {
              id: placement.pieceId,
            },
            type: 'movePiece',
            board: placement.board,
          })
        }
      }
    })
  }

  doAction (actionPayload) {
    if (this.gameOver) {
      throw new Error('game is over!')
    }
    this.currentRound.doAction(expandActionPayload(actionPayload))
    this.advance()
  }

  advance () {
    let next = this.generator.next()
    if (next.done) {
      this.generator = this.createRoundGenerator(this.rules.round)
      next = this.generator.next()
    }
    this.currentRound = next.value
    const winner = this.getWinner()
    const isDraw = this.isDraw()
    if (winner) {
      this.winner = winner
    }
    if (winner || isDraw) {
      this.gameOver = true
    }
  }

  getWinner () {
    // probably ought to do this expansion at game start, with separate 
    // runtime-only expansion and compile-time-possible expansions
    return this.players.find((player) => {
      const winCondition = {
        ...this.rules.winCondition,
        piece: {
          ...this.rules.winCondition.piece,
          player
        }
      }
      const condition = conditionFactory(winCondition, this)
      return condition.isMet()
    })
  }

  isDraw () {
    return !!(this.rules.drawCondition && conditionFactory(this.rules.drawCondition, this).isMet())
  }

  * createRoundGenerator (roundRule) {
    const round = roundFactory(roundRule, this)
    if (!roundRule.phases) {
      do {
        yield round
      } while (!round.isOver())
    } else {
      for (let phaseRule of roundRule.phases) {
        yield* this.createRoundGenerator(phaseRule)
      }
    }
  }

  getConfigPath (path) {
    return get(this, path)
  }
}

function expandRules (rules, options) {
  // attach board paths to board rule objects
  return rules
}

function expandOptions (rules, options) {
  const defaultOptions = {
    playerCount: 2
  }
  return merge({}, defaultOptions, options)
}

function expandActionPayload (actionPayload) {
  const defaultActionPayload = {
    piece: {
      id: 'playerMarker',
      playerId: actionPayload.playerId
    }
  }
  return merge({}, defaultActionPayload, actionPayload)
}
