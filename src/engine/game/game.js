import matches from 'lodash/matches'
import merge from 'lodash/merge'
import get from 'lodash/get'
import boardFactory from '../board/board-factory'
import Player from '../player/player'
import roundFactory from '../round/round-factory'
import conditionFactory from '../condition/condition-factory'
import actionFactory from '../action/action-factory'
import PieceGroup from '../piece/piece-group'
import findValuePath from '../../util/find-value-path'


export default class Game {
  constructor (rules, options) {
    this.rules = expandRules(rules, options)
    this.options = expandOptions(rules, options)
    this.initialize()
    this.generator = this.createRoundGenerator(this.rules.round)
    this.advance()
    this.context = {}
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
    const player = this.players.find(player => player.id === actionPayload.playerId)
    this.currentRound.doAction(this.expandActionPayload(actionPayload, player))
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
    return get(this, this.normalizePath(path, options))
  }

  expandActionPayload (actionPayload, player) {
    const pieceName = actionPayload.piece?.name || 'playerMarker'
    const pieceRule = this.rules.pieces.find(piece => piece.name === pieceName)

    let piece
    if (actionPayload.piece?.id) {
      piece = { id: actionPayload.piece.id }
    } else if (actionPayload.piece?.name) {
      piece = actionPayload.piece
    } else {
      piece = { name: 'playerMarker' }
    }

    const defaultActionPayload = {
      type: 'movePiece',
      player
    }

    actionPayload.piece = piece

    if (pieceRule.perPlayer && !actionPayload.player) {
      actionPayload.piece.player = { id: player.id }
    }

    if (!actionPayload.board) {
      actionPayload.board = this.getBoardPathContaining(actionPayload.piece)
    }

    const merged = merge({}, defaultActionPayload, actionPayload)
    
    merged.board = this.normalizePath(actionPayload.board, { player })

    return merged
  }

  getPiecePaths (matcher, options) {
    const placesPiecesCanBe = {
      personalBoards: this.personalBoards,
      sharedBoard: this.sharedBoard,
      pieces: this.pieces,
    }
    return Array.from(findValuePath(placesPiecesCanBe, matches(matcher)))
      .filter((a, b) => a[a.length - 1] !== 'rule')
      .sort((a, b) => a[0] === 'pieces' ? 1 : -1)
      .map(path => this.normalizePath(path, options))
  }

  getPieces (pieceMatcher, options) {
    return this.getPiecePaths(pieceMatcher, options)
      .map(path => this.get(path))
  }

  getPiece (pieceMatcher) {
    const match = this.getPieces(pieceMatcher)[0]
    return match instanceof PieceGroup ? match.getOne() : match
  }

  getBoardPathContaining (piece, options) {
    return this.getPiecePaths(piece, options)[0]
  }

  getBoardContaining (piece) {
    const path = this.getBoardPathContaining(piece)
    return path ? this.get(path.slice(0, path.length - 1)) : null
  }

  normalizePath (path, options = {}) {
    return path[0] === 'personalBoard'
      ? [
        'personalBoards',
        options.player.id,
        ...path.slice(1)
      ]
      : path
  }
}

// todo. will allow smaller rulesets
function expandRules (rules, options) {
  return rules
}

function expandOptions (rules, options) {
  const defaultOptions = {
    playerCount: 2
  }
  return merge({}, defaultOptions, options)
}
