import React from 'react'
export default function Stack ({ board, onCellClick }) {
  return (
    <div className="board--stack">
      {board.stack.map((piece, i) => (
        <button
          onClick={() => { onCellClick?.(piece, board) }}
          className="stack__piece"
          key={i}
        >
          {JSON.stringify(piece)}
        </button>
      ))}
    </div>
  )
}
