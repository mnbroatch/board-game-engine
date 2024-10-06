import React from 'react'
import GridComponent from './grid.js'
import Grid from '../../engine/board/grid.js'
import StackComponent from './stack.js'
import Stack from '../../engine/board/stack.js'

export default function Board ({ board, game, onCellClick }) {
  if (board instanceof Grid) {
    return <GridComponent board={board} game={game} onCellClick={onCellClick} />
  } else if (board instanceof Stack) {
    return <StackComponent board={board} game={game} onCellClick={onCellClick} />
  } else {
    console.log('board3333', board)
    return null
  }
}
