import React from "react";
import Piece from "../piece/piece.js";

export default function Stack({ board, onPieceClick }) {
  return (
    <div className="board--stack">
      {board.stack.map((piece, i) => (
        <Piece
          piece={piece}
          onClick={() => {
            onPieceClick?.(piece);
          }}
          key={i}
        />
      ))}
    </div>
  );
}
