import React from 'react'

export default function Blah ({ piece, onPieceClick }) {
  console.log('piece', piece)
  return (
    <button className="piece">
      <div>
        {piece.rule.id}
      </div>
      <div>
        P{piece.player.index}
      </div>
    </button>
  )
}
