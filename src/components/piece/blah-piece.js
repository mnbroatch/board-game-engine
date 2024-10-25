import React from 'react'
import { useContext } from 'react'
import GameContext from '../../context/game-context'

export default function Blah ({ piece, onPieceClick }) {
  const game = useContext(GameContext)
  console.log('game', game.currentRound.actions)
  return (
    <button className="piece piece--blah">
      <div>
        {piece.rule.id}
      </div>
      <div>
        P{piece.player.index}
      </div>
    </button>
  )
}
