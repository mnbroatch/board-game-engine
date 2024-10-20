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
        this.players.forEach((player) => {
          // player specifies both the piece owner (if relevant) and personalBoard
          this.doInitialPlacement(placement, player)
        })
      } else {
        this.doInitialPlacement(placement)
      }
    })
  }

  doInitialPlacement (placement, player) {
    const actionRule = { type: 'movePiece' }
    if (placement.playerPerspective) {
      actionRule.playerPerspective = placement.playerPerspective
    }
    const actionPayload = {
      piece: placement.piece,
      board: placement.board,
    }
    if (placement.targets) {
      placement.targets.forEach(target => {
        actionFactory(actionRule, this).do(this.expandActionPayload(
          { ...actionPayload, target },
          player
        ))
      })
    } else {
      Array.from(new Array(placement.count)).forEach(() => {
        actionFactory(actionRule, this).do(this.expandActionPayload(actionPayload, player))
      })
    }
  }

  doAction (actionPayload) {
    if (this.gameOver) {
      throw new Error('game is over!')
    }
    this.currentRound.doAction(this.expandActionPayload(actionPayload))
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

  get (path, options = {}, debug) {
    return get(this, normalizePath(path, options))
  }

  expandActionPayload (actionPayload, player) {
    const pieceId = actionPayload.piece?.id || 'playerMarker'
    const pieceRule = this.rules.pieces.find(piece => piece.id === pieceId)
    const defaultActionPayload = {
      type: 'movePiece',
      piece: {
        id: pieceId,
      },
      player
    }

    if (pieceRule.perPlayer && !actionPayload.player) {
      defaultActionPayload.piece.player = { id: player.id }
    }

    const merged = merge({}, defaultActionPayload, actionPayload)
    merged.board = normalizePath(actionPayload.board, { player })
    return merged
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

function normalizePath (path, options = {}) {
  return path[0] === 'personalBoard'
    ? [
      'personalBoards',
      options.player.id,
      ...path.slice(1)
    ]
    : path
}

