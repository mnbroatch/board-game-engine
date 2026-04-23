import { Client as BoardgameIOClient } from "@mnbroatch/boardgame.io/client";
import type { ClientOptions } from "../client.js";
import type { BoardgameIoGame } from "../../game-factory/game-factory.js";
type ExternalClientState = {
    G: unknown;
    ctx: unknown;
};
type ExternalClientMoves = ReturnType<typeof BoardgameIOClient>["moves"];
export type ExternalGetStateResult = {
    status: "empty";
} | {
    status: "external";
    state: ExternalClientState;
    gameover: unknown;
    moves: ExternalClientMoves;
    currentMoves: Record<string, unknown> | unknown[];
};
export declare class ExternalClientImpl {
    private readonly options;
    private readonly game;
    private readonly onUpdate;
    client?: ReturnType<typeof BoardgameIOClient>;
    optimisticWinner?: unknown | null;
    constructor(options: ClientOptions, game: BoardgameIoGame, onUpdate: () => void);
    connect(): this | undefined;
    getState(): ExternalGetStateResult;
    doStep(): void;
    reset(): void;
    undoStep(): void;
}
export {};
//# sourceMappingURL=external-client.d.ts.map