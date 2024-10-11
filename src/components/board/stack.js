import React from 'react'
export default function Stack ({ board, onCellClick }) {
  return (
    <div className="board--stack">
      {board.stack.map((cell, i) => (
        <button
          onClick={() => { onCellClick?.(cell, board) }}
          className="stack__cell"
          key={i}
        >
          {cell.pieces[0]?.player.index}
        </button>
      ))}
    </div>
  )
}
