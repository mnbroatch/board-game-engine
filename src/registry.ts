import Cls0 from "./engine/action/action.js";
import Cls1 from "./engine/action/move-piece-action.js";
import Cls2 from "./engine/action/select-piece-action.js";
import Cls3 from "./engine/action/swap-action.js";
import Cls4 from "./engine/board/board-group.js";
import Cls5 from "./engine/board/board.js";
import Cls6 from "./engine/board/grid.js";
import Cls7 from "./engine/board/stack.js";
import Cls8 from "./engine/condition/action-type-matches-condition.js";
import Cls9 from "./engine/condition/bingo-condition.js";
import Cls10 from "./engine/condition/blackout-condition.js";
import Cls11 from "./engine/condition/condition.js";
import Cls12 from "./engine/condition/contains-condition.js";
import Cls13 from "./engine/condition/does-not-contain-condition.js";
import Cls14 from "./engine/condition/is-valid-player-condition.js";
import Cls15 from "./engine/condition/piece-matches-condition.js";
import Cls16 from "./engine/condition/relative-move-condition.js";
import Cls17 from "./engine/condition/some-condition.js";
import Cls18 from "./engine/piece/piece.ts";
import Cls19 from "./engine/piece/pile.js";
import Cls20 from "./engine/player/player.ts";
import Cls21 from "./engine/round/round.js";
import Cls22 from "./engine/round/sequential-player-turn.js";
import Cls23 from "./engine/serializable.js";
import Cls24 from "./engine/space/space.ts";

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
  "Serializable": Cls23,
  "Space": Cls24
};
