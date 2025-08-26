import type Piece from "../piece/piece";

type Coordinates = [number, number];

export default class Space {
  coordinates: Coordinates;
  pieces: Piece[];

  constructor(coordinates: Coordinates, startingPieces: Piece[] = []) {
    this.coordinates = coordinates;
    this.pieces = startingPieces;
  }

  placePiece(piece: Piece): void {
    this.pieces.push(piece);
  }

  isEmpty(): boolean {
    return this.pieces.length === 0;
  }
}
