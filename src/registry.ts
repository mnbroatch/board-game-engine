import Cls0 from "./engine/board/board";
import Cls1 from "./engine/action/action";
import Cls2 from "./engine/space/space";
import Cls3 from "./engine/piece/piece";
import { Player as Cls4 } from "./engine/player/player";
import { Pile as Cls5 } from "./engine/piece/pile";
import Cls6 from "./engine/condition/condition";

export const registry: Record<string, any> = {
  "Board": Cls0,
  "Action": Cls1,
  "Space": Cls2,
  "Piece": Cls3,
  "Player": Cls4,
  "Pile": Cls5,
  "Condition": Cls6
};
