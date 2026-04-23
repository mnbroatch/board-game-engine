import { Client as BoardgameIOClient } from "@mnbroatch/boardgame.io/client";
import type { BoardgameIoGame } from "../../game-factory/game-factory.js";
import type { AbstractPickArgument, ClientMovePayload, MoveType } from "../../types/move-payload.js";
import type { MoveArgumentsMap } from "../../types/move-arguments.js";
import type Move from "../../game-factory/move/move.js";
import type { BoardgameEngineG, BgioReadonlyState } from "../../utils/bgio-resolve-types.js";
import type { EngineEntity } from "../../types/runtime-entity.js";
import type { ClientOptions } from "../client.js";
type StepTarget = AbstractPickArgument | EngineEntity;
type ClientResolveStateLike = BgioReadonlyState & {
    G: BoardgameEngineG;
};
type WrappedMoveFor<M extends MoveType> = ((payload: ClientMovePayload<M>) => void) & {
    moveType: M;
    moveInstance: Move<MoveArgumentsMap>;
};
type WrappedMove = {
    [M in MoveType]: WrappedMoveFor<M>;
}[MoveType];
type PossibleMoveMeta = Record<string, {
    clickableForMove: Set<StepTarget>;
}>;
export type EngineGetStateResult = {
    status: "empty";
} | {
    status: "engine";
    state: ClientResolveStateLike;
    gameover: unknown;
    allClickable: Set<StepTarget>;
    _wrappedMoves: Record<string, WrappedMove>;
    _possibleMoveMeta: PossibleMoveMeta;
};
export declare class EngineClientImpl {
    private readonly options;
    private readonly game;
    private readonly onUpdate;
    client?: ReturnType<typeof BoardgameIOClient>;
    optimisticWinner: unknown | null;
    private moveBuilder;
    constructor(options: ClientOptions, game: BoardgameIoGame, onUpdate: () => void);
    connect(): this | undefined;
    getState(): EngineGetStateResult;
    doStep(_target: StepTarget): void;
    reset(): void;
    undoStep(): void;
}
export {};
//# sourceMappingURL=engine-client.d.ts.map