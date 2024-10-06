import SequentialPlayerTurn from './sequential-player-turn'

export default function roundFactory (roundRule, game) {
  if (roundRule.type === 'sequentialPlayerTurn') {
    return new SequentialPlayerTurn(roundRule, game)
  }
}
