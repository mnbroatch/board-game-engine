import React, { useState } from 'react'
import useGame from './src/hooks/use-game'
import Layout from './src/components/layout'
import ticTacToeVerbose from './src/tic-tac-toe-verbose.json'
import onitamaVerbose from './src/onitama-verbose.json'
import Game from './src/engine/game/game.js'
import GameContext from './src/context/game-context'

export default function App () {
  /* const [ game, doAction ] = useGame(ticTacToeVerbose) */
  const [ game, doAction ] = useGame(onitamaVerbose)

  const onPieceClick = (piece) => {
    doAction({
      type: 'selectPiece',
      playerId: game.currentRound.currentPlayer.id,
      piece: {
        id: piece.rule.id
      }
    })
  }

  const onSpaceClick = (cell, board) => {
    const currentPlayer = game.currentRound.currentPlayer
    const actionPayload = {
      playerId: currentPlayer.id,
      type: 'movePiece',
      board: board.path,
      target: cell.coordinates
    }
    if (selectedPiece) {
      action.piece = { id: selectedPiece.id }
    }
    doAction(actionPayload)
  }

  return (
    <GameContext.Provider value={game}>
      <Layout game={game} onSpaceClick={onSpaceClick} onPieceClick={onPieceClick} />
    </GameContext.Provider>
  )
}
