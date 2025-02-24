import React from "react";
import type { FC } from "react";
import Piece from "../piece/piece";
import type { Grid } from "../../engine/index";
import type { OnPieceClick, OnSpaceClick } from "../../types";

interface GridProps {
  board: Grid;
  onPieceClick: OnPieceClick;
  onSpaceClick: OnSpaceClick;
}

const GridComponent: FC<GridProps> = ({
  board,
  onPieceClick,
  onSpaceClick,
}) => {
  return (
    <div className="board--grid">
      {board.grid.map((row, i) => (
        <div className="grid__row" key={i}>
          {row.map((space, i) => (
            <div
              className="grid__space"
              key={i}
              onClick={() => {
                onSpaceClick(space, board);
              }}
            >
              {space.pieces.map((piece, j) => (
                <div className="grid__space-contents" key={j}>
                  <Piece
                    piece={piece}
                    onClick={() => {
                      onPieceClick(piece, space, board);
                    }}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default GridComponent;
