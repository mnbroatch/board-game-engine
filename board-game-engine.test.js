/* eslint-env jest */

import { makeMove } from './src/index'
import gameRules from './tic-tac-toe-verbose.json';

describe('functional test', () => {
  test('should load a game', () => {
    const gameState = makeMove(gameRules)
    expect(gameState.status).toBe('waiting')
  })
})
