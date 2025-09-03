import Cls0 from "./action/action.js";
import Cls1 from "./action/move-piece-action.js";
import Cls2 from "./action/select-piece-action.js";
import Cls3 from "./action/swap-action.js";
import Cls4 from "./board/board-group.js";
import Cls5 from "./board/board.js";
import Cls6 from "./board/grid.js";
import Cls7 from "./board/stack.js";
import Cls8 from "./condition/action-type-matches-condition.js";
import Cls9 from "./condition/bingo-condition.js";
import Cls10 from "./condition/blackout-condition.js";
import Cls11 from "./condition/condition.js";
import Cls12 from "./condition/contains-condition.js";
import Cls13 from "./condition/does-not-contain-condition.js";
import Cls14 from "./condition/is-valid-player-condition.js";
import Cls15 from "./condition/piece-matches-condition.js";
import Cls16 from "./condition/relative-move-condition.js";
import Cls17 from "./condition/some-condition.js";
import Cls18 from "./piece/piece.ts";
import Cls19 from "./piece/pile.js";
import Cls20 from "./player/player.ts";
import Cls21 from "./round/round.js";
import Cls22 from "./round/sequential-player-turn.js";
import Cls24 from "./space/space.ts";

export const registry = {
  "Action": Cls0,
  "MovePieceAction": Cls1,
  "SelectPieceAction": Cls2,
  "SwapAction": Cls3,
  "BoardGroup": Cls4,
  "Board": Cls5,
  "Grid": Cls6,
  "Stack": Cls7,
  "ActionTypeMatchesCondition": Cls8,
  "BingoCondition": Cls9,
  "BlackoutCondition": Cls10,
  "Condition": Cls11,
  "ContainsCondition": Cls12,
  "DoesNotContainCondition": Cls13,
  "IsValidPlayerCondition": Cls14,
  "PieceMatchesCondition": Cls15,
  "RelativeMoveCondition": Cls16,
  "SomeCondition": Cls17,
  "Piece": Cls18,
  "Pile": Cls19,
  "Player": Cls20,
  "Round": Cls21,
  "SequentialPlayerTurn": Cls22,
  "Space": Cls24
};
