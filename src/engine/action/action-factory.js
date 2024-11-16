import MovePieceAction from "./move-piece-action.js";
import SwapAction from "./swap-action.js";
import SelectPieceAction from "./select-piece-action.js";

export default function actionFactory(actionPayload, game) {
  if (actionPayload.type === "movePiece") {
    return new MovePieceAction(actionPayload, game);
  } else if (actionPayload.type === "swap") {
    return new SwapAction(actionPayload, game);
  } else if (actionPayload.type === "selectPiece") {
    return new SelectPieceAction(actionPayload, game);
  }
}
