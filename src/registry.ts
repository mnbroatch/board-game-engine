import Cls0 from "./engine/board/board";
import Cls1 from "./engine/action/action";
import Cls2 from "./engine/piece/piece";
import { Player as Cls3 } from "./engine/player/player";
import Cls4 from "./engine/space/space";
import { Pile as Cls5 } from "./engine/piece/pile";
import Cls6 from "./engine/condition/condition";

export const registry: Record<string, any> = {
  "Board": Cls0,
  "Action": Cls1,
  "Piece": Cls2,
  "Player": Cls3,
  "Space": Cls4,
  "Pile": Cls5,
  "Condition": Cls6
};
