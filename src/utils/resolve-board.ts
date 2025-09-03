import get from 'lodash/get.js'

export default function resolveBoard (board, gameState) {
  // Case 1: if board is an array treat it as a path
  if (Array.isArray(board)) {
    return get(gameState, board)
  }

  const visited = new WeakSet()

  function search (node) {
    if (!node || typeof node !== 'object') return null

    // Prevent infinite loops by tracking visited objects
    if (visited.has(node)) return null
    visited.add(node)

    if (node.id === board.id) return node

    if (node.grid && Array.isArray(node.grid)) {
      for (const row of node.grid) {
        for (const cell of row) {
          const found = search(cell)
          if (found) return found
        }
      }
    }

    for (const value of Object.values(node)) {
      const found = search(value)
      if (found) return found
    }

    return null
  }

  return search(gameState)
}
