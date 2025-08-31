import Pile from "../piece/pile.js";

export default function resolvePiece(piece, gameState) {
  // Case 1: existing piece with id - search boards
  if (piece?.id) {
    const queue = [gameState.sharedBoard, gameState.personalBoards];
    while (queue.length) {
      const node = queue.pop();
      if (!node) continue;

      if (Array.isArray(node)) {
        queue.push(...node);
      } else if (node.grid) {
        for (const row of node.grid) queue.push(...row);
      } else if (node.coordinates && node.pieces) {
        const found = node.pieces.find((p) => p.id === piece.id);
        if (found) return found;
      } else if (typeof node === "object") {
        queue.push(...Object.values(node));
      }
    }
    return null; // piece.id was given but not found
  }

  // Case 2: no id - pull fresh piece from the matching piece group (pile)
  const pieceGroup = gameState.pieces.find(
    (p) =>
      p.name === piece.name &&
      (!p.player || p.player.id === piece.player?.id)
  );
  if (!pieceGroup) {
    throw new Error(`No piece group found for ${piece.name}`);
  }
  return pieceGroup.getOne();
}
