import type { MoveFn } from "@mnbroatch/boardgame.io";
import type { MoveArgumentsMap } from "../../types/move-arguments.js";
import type { BoardgameEngineG, BoardgameIoGame } from "../game-factory.js";
import type { MoveDefinition } from "../../types/expanded-game-types.js";
import type Move from "./move.js";
/** boardgame.io move function plus engine metadata for staged moves / UI. */
export type BoardgameEngineMove = MoveFn<BoardgameEngineG> & {
    moveInstance: Move<MoveArgumentsMap>;
};
export default function moveFactory(moveRule: MoveDefinition, game: BoardgameIoGame): BoardgameEngineMove;
export declare function getMoveInstance(moveRule: MoveDefinition): Move<MoveArgumentsMap>;
//# sourceMappingURL=move-factory.d.ts.map