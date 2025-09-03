import get from "lodash/get.js";
import Board from "./board.js";
import Space from "../space/space.ts";

const INITIAL_ROTATION = 0;
const FLIPPED_ROTATION = 180;

export default class Grid extends Board {
  constructor(boardRule, options) {
    super(boardRule, options);
    this.grid = makeGrid(boardRule);
  }

  getEmptySpaces() {
    const emptySpaces = [];
    for (const row of this.grid) {
      for (const space of row) {
        if (space.isEmpty()) {
          emptySpaces.push(space);
        }
      }
    }
    return emptySpaces;
  }

  getSpace(target) {
    return get(this.grid, target);
  }

  getPieces(target) {
    return this.getSpace(target).pieces;
  }

  placePiece(target, piece) {
    this.getSpace(target).placePiece(piece);
  }
}

function makeGrid(boardRule) {
  const x = boardRule.width;
  const y = boardRule.height;
  if (!x || !y) {
    throw new Error("No size provided for grid");
  }

  const grid = [];
  for (let i = 0; i < y; i++) {
    const row = [];
    for (let j = 0; j < x; j++) {
      row.push(new Space([i, j]));
    }
    grid.push(row);
  }
  return grid;
}
