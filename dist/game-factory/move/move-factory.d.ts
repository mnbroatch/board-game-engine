import MoveEntity from "./move-entity.js";
import RemoveEntity from "./remove-entity.js";
import PlaceNew from "./place-new.js";
import TakeFrom from "./take-from.js";
import SetState from "./set-state.js";
import SetActivePlayers from "./set-active-players.js";
import EndTurn from "./end-turn.js";
import PassTurn from "./pass-turn.js";
import ForEach from "./for-each.js";
import Pass from "./pass.js";
import Shuffle from "./shuffle.js";
import type { MoveDefinition } from "../../types/bagel-types.js";
export default function moveFactory(moveRule: MoveDefinition, game: unknown): {
    (bgioArguments: unknown, serializablePayload: unknown): any;
    moveInstance: MoveEntity | RemoveEntity | PlaceNew | TakeFrom | SetState | ForEach | Pass | Shuffle | SetActivePlayers | EndTurn | PassTurn;
};
export declare function getMoveInstance(moveRule: MoveDefinition): MoveEntity | RemoveEntity | PlaceNew | TakeFrom | SetState | ForEach | Pass | Shuffle | SetActivePlayers | EndTurn | PassTurn;
//# sourceMappingURL=move-factory.d.ts.map