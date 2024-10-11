import React from 'react'
export default function Grid ({ board, onCellClick }) {
  return (
    <div className="board--grid">
      { board.grid.map((row, i) => (
        <div className="grid__row" key={i}>
          { row.map((cell, j) => (
            <button
              onClick={() => { onCellClick?.(cell, board) }}
              className="grid__cell"
              key={j}
            >
              {cell.pieces[0]?.player.index}
            </button>
          ))}
        </div>
      )) }
    </div>
  )
}
