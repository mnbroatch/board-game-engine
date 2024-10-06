import React from 'react'
export default function Stack ({ board, onCellClick }) {
  return (
    <div>
      { board.stack.map((cell, i) => (
        <button
          onClick={() => { onCellClick?.(cell, board) }}
          className="grid__cell"
          key={i}
        >
          {cell.pieces[0]?.player.index}
        </button>
      )) }
    </div>
  )
}
