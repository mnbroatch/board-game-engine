/* eslint-env jest */

import { makeMove } from './src/index'
import gameRules from './tic-tac-toe-verbose.json'

describe('functional test', () => {
  test('should load a game', () => {
    const gameState = makeMove(gameRules)
    expect(gameState.status).toBe('waiting')
  })
  test('should add players', () => {
    let gameState = makeMove(gameRules)
    gameState = makeMove(gameRules, gameState, { playerId: 1, type: 'join' })
    gameState = makeMove(gameRules, gameState, { playerId: 2, type: 'join' })
    expect(gameState.players.length).toBe(2)
  })
  test('should start game', () => {
    let gameState = makeMove(gameRules)
    gameState = makeMove(gameRules, gameState, { playerId: 1, type: 'join' })
    gameState = makeMove(gameRules, gameState, { playerId: 2, type: 'join' })
    gameState = makeMove(gameRules, gameState, { type: 'start' })
    expect(gameState.status).toBe('active')
  })
  test('should apply move', () => {
    let gameState = makeMove(gameRules)
    gameState = makeMove(gameRules, gameState, { playerId: 1, type: 'join' })
    gameState = makeMove(gameRules, gameState, { playerId: 2, type: 'join' })
    gameState = makeMove(gameRules, gameState, { type: 'start' })
    gameState = makeMove(
      gameRules,
      gameState,
      {
        playerId: 1,
        type: 'movePiece',
        board: {
          id: gameState.sharedBoard.grid.id
        },
        target: [
          0,
          2
        ]
      }
    )
    expect(gameState.sharedBoard.grid.grid[0][2].pieces.length).toBe(1)
  })
})
