import { Debug } from "@mnbroatch/boardgame.io/debug";
import { SocketIO } from "@mnbroatch/boardgame.io/multiplayer";
import type { BoardgameIoGame } from "../game-factory/game-factory.js";
import type { BagelGame } from "../types/bagel-types.js";
import { type EngineGetStateResult } from "./internal/engine-client.js";
import { type ExternalGetStateResult } from "./internal/external-client.js";
export interface ClientOptions {
    boardgameIOGame?: BoardgameIoGame;
    gameRules?: BagelGame;
    gameName?: string;
    server?: string;
    numPlayers?: number;
    debug?: {
        collapseOnLoad?: boolean;
        impl?: typeof Debug;
    };
    matchID?: string;
    playerID?: string | null;
    credentials?: string;
    multiplayer?: ReturnType<typeof SocketIO>;
    onClientUpdate?: () => void;
}
export type ClientGetStateResult = {
    status: "empty";
} | ExternalGetStateResult | EngineGetStateResult;
export declare class Client {
    private readonly options;
    private readonly game;
    private readonly impl;
    constructor(options: ClientOptions);
    connect(): this;
    update(): void;
    getState(): ClientGetStateResult;
    doStep(_target: unknown): void;
    reset(): void;
    undoStep(): void;
}
//# sourceMappingURL=client.d.ts.map