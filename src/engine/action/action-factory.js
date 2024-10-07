import MovePieceAction from './move-piece-action'
import SwapAction from './swap-action'

export default function actionFactory (actionPayload, game) {
  if (actionPayload.type === 'movePiece') {
    return new MovePieceAction(actionPayload, game)
  } else if (actionPayload.type === 'swap') {
    return new SwapAction(actionPayload, game)
  }
}
