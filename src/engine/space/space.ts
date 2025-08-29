import type Piece from "../piece/piece";
import Serializable from "../serializable.js";

type Coordinates = [number, number];

export default class Space extends Serializable {
  coordinates: Coordinates;
  pieces: Piece[];

  constructor(coordinates: Coordinates, startingPieces: Piece[] = []) {
    super(coordinates, startingPieces);
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
