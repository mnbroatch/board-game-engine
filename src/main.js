import Game from './engine/game/game.js'
import ticTacToeVerbose from './tic-tac-toe-verbose.json'

export default function ({ createActions }) {
  const game = new Game(ticTacToeVerbose)

  try {
    createActions(game).forEach((action) => {  
      game.doAction(action)
    })
  } catch (e) {
    console.error(e)
  }

  return game
}
