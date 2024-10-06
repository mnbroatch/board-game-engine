import merge from 'lodash/merge'
import get from 'lodash/get'
import boardFactory from '../board/board-factory'
import Player from '../player/player'
import roundFactory from '../round/round-factory'
import conditionFactory from '../condition/condition-factory'

const defaultOptions = {
  playerCount: 2
}

export default class Game {
  constructor (rules, options) {
    this.rules = expandRules(rules, options)
    this.options = expandOptions(rules, options)
    this.initialize()
    this.generator = this.createRoundGenerator(this.rules.round)
    this.advance()
  }

  initialize () {
    this.sharedBoard = Object.entries(this.rules.sharedBoard).reduce((acc, [id, board]) => {
      const location = ['sharedBoard', id]
      return {
        ...acc,
        [id]: boardFactory({ ...board, location }, this.options),
        location
      }
    }, {})
    this.players = Array.from(Array(this.options.playerCount)).map((_, i) => new Player(this.rules.player, i))
  }

  doAction (actionPayload) {
    if (this.gameOver) {
      throw new Error('game is over!')
    }
    this.currentRound.doAction(actionPayload)
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
        ...player.rules.winCondition,
        piece: {
          ...player.rules.winCondition.piece,
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

  getLocation (path) {
    console.log('-----------')
    console.log('this', this)
    console.log('path', path)
    return get(this, path)
  }
}

function expandRules (rules, options) {
  // attach board locations (paths) to board rule objects
  return rules
}

function expandOptions (rules, options) {
  return merge({}, defaultOptions, options)
}
