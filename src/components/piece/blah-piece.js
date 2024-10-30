import React from 'react'
import { useContext } from 'react'
import GameContext from '../../context/game-context'

export default function Blah ({ piece, onClick }) {
  const game = useContext(GameContext)
  return (
    <button
      onClick={onClick}
      className={[
        'piece',
        'piece--blah',
        game.context.selectedPiece === piece && 'piece--blah--selected',
      ].filter(Boolean).join(' ')}
    >
      <div>
        {piece.rule.id}
      </div>
      {piece.player && (
        <div>
          P{piece.player.index}
        </div>
      )}
      {piece.rule.variantId && (
        <div>
          {piece.rule.variantId}
        </div>
      )}
    </button>
  )
}
