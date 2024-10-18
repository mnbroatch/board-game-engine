import React, { useState } from 'react'
import useGame from './src/hooks/use-game'
import Layout from './src/components/layout'
import ticTacToeVerbose from './src/tic-tac-toe-verbose.json'
import onitamaVerbose from './src/onitama-verbose.json'
import Game from './src/engine/game/game.js'

export default function App () {
  /* const [ game, doAction ] = useGame(ticTacToeVerbose) */
  const [ game, doAction ] = useGame(onitamaVerbose)
  const [ selectedPiece, setSelectedPiece ] = useState()

  const onPieceClick = (piece) => {
    selectPiece(piece)
  }

  const onCellClick = (cell, board) => {
    const currentPlayer = game.currentRound.currentPlayer
    const action = {
      playerId: currentPlayer.id,
      type: 'movePiece',
      board: board.path,
      target: cell.coordinates
    }
    if (selectedPiece) {
      action.piece = { id: selectedPiece.id }
    }
    doAction(action)
  }

  return (
    <Layout game={game} onCellClick={onCellClick} onPieceClick={onPieceClick} />
  )
}
