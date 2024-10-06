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
    if (!selectedPiece) {
      doAction({
        playerId: game.currentRound.currentPlayer.id,
        pieceId: game.currentRound.currentPlayer.pieces[0].id,
        from: 'player',
        type: 'movePiece',
        location: board.location,
        target: cell.coordinates
      })
    } else {
      doAction({
        playerId: game.currentRound.currentPlayer.id,
        pieceId: selectedPiece.id,
        type: 'movePiece',
        location: board.location,
        target: cell.coordinates
      })
    }
  }

  return (
    <Layout game={game} onCellClick={onCellClick} onPieceClick={onPieceClick} />
  )
}
