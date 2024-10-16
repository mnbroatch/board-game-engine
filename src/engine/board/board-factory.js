import Grid from './grid'
import Stack from './stack'

export default function boardFactory (boardRule, options) {
  if (boardRule.type === 'grid') {
    return new Grid(boardRule, options)
  } else if (boardRule.type === 'stack') {
    return new Stack(boardRule, options)
  } else {
    console.log('boardRule', boardRule)
  }
}
