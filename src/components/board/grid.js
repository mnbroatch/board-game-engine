import React from 'react'
import Piece from '../piece/piece'

export default function Grid ({ board, onCellClick }) {
  return (
    <div className="board--grid">
      { board.grid.map((row, i) => (
        <div className="grid__row" key={i}>
          {row.map((cell, i) => (
            <button
              onClick={() => { onCellClick?.(cell, board) }}
              className="grid__cell"
              key={i}
            >
              {cell.pieces.map((piece, j) => (
                <Piece
                  piece={piece}
                  key={j}
                />
              ))}
            </button>
          ))}
        </div>
      )) }
    </div>
  )
}
