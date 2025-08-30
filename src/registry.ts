import Cls0 from "./engine/board/grid";
import Cls1 from "./engine/board/stack";
import Cls2 from "./engine/board/board";
import Cls3 from "./engine/action/action";
import Cls4 from "./engine/space/space";
import Cls5 from "./engine/piece/piece";
import { Player as Cls6 } from "./engine/player/player";
import Cls7 from "./engine/serializable";
import { Pile as Cls8 } from "./engine/piece/pile";
import Cls9 from "./engine/condition/bingo-condition";
import Cls10 from "./engine/condition/does-not-contain-condition";
import Cls11 from "./engine/condition/blackout-condition";
import Cls12 from "./engine/condition/some-condition";
import Cls13 from "./engine/condition/relative-move-condition";
import Cls14 from "./engine/condition/contains-condition";
import Cls15 from "./engine/condition/action-type-matches-condition";
import Cls16 from "./engine/condition/piece-matches-condition";
import Cls17 from "./engine/condition/is-valid-player-condition";
import Cls18 from "./engine/action/move-piece-action";
import Cls19 from "./engine/action/swap-action";
import Cls20 from "./engine/action/select-piece-action";
import Cls21 from "./engine/round/round";
import Cls22 from "./engine/round/sequential-player-turn";
import Cls23 from "./engine/condition/condition";

export const registry: Record<string, any> = {
  "Grid": Cls0,
  "Stack": Cls1,
  "Board": Cls2,
  "Action": Cls3,
  "Space": Cls4,
  "Piece": Cls5,
  "Player": Cls6,
  "Serializable": Cls7,
  "Pile": Cls8,
  "BingoCondition": Cls9,
  "DoesNotContainCondition": Cls10,
  "BlackoutCondition": Cls11,
  "SomeCondition": Cls12,
  "RelativeMoveCondition": Cls13,
  "ContainsCondition": Cls14,
  "ActionTypeMatchesCondition": Cls15,
  "PieceMatchesCondition": Cls16,
  "IsValidPlayerCondition": Cls17,
  "MovePieceAction": Cls18,
  "SwapAction": Cls19,
  "SelectPieceAction": Cls20,
  "Round": Cls21,
  "SequentialPlayerTurn": Cls22,
  "Condition": Cls23
};
