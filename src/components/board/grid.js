import React from 'react'
import Piece from '../piece/piece'

export default function Grid ({ board, onCellClick }) {
  return (
    <div className="board--grid">
      { board.grid.map((row, i) => (
        <div className="grid__row" key={i}>
          {row.map((cell, i) => (
            <div className="grid__cell" key={i}>
              {cell.pieces.map((piece, j) => (
                <button
                >
                  <Piece
                    piece={piece}
                    onClick={() => { onCellClick?.(cell, board) }}
                    key={j}
                  />
                </button>
              ))}
            </div>
          ))}
        </div>
      )) }
    </div>
  )
}
