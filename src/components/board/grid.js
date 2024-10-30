import React from 'react'
import Piece from '../piece/piece'

export default function Grid ({ board, onPieceClick, onSpaceClick }) {
  return (
    <div className="board--grid">
      { board.grid.map((row, i) => (
        <div className="grid__row" key={i}>
          {row.map((cell, i) => (
            <div className="grid__cell" key={i} onClick={() => {
              onSpaceClick?.(cell, board)
            }}>
              {cell.pieces.map((piece, j) => (
                <Piece
                  piece={piece}
                  onClick={() => {
                    onPieceClick?.(cell, board)
                  }}
                  key={j}
                />
              ))}
            </div>
          ))}
        </div>
      )) }
    </div>
  )
}
