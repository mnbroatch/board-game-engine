import Grid from './grid'
import Stack from './stack'

export default function boardFactory (boardRule) {
  if (boardRule.type === 'grid') {
    return new Grid(boardRule)
  } else if (boardRule.type === 'stack') {
    return new Stack(boardRule)
  }
}
