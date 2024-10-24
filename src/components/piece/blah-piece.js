import React from 'react'

export default function Blah ({ piece, onPieceClick }) {
  return (
    <div>
      <div>
        {piece.rule.id}
      </div>
      <div>
        P{piece.player.index}
      </div>
    </div>
  )
}
