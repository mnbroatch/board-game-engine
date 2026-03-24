import { Client as BoardgameIOClient } from "@mnbroatch/boardgame.io/client";
import { Debug } from "@mnbroatch/boardgame.io/debug";
import { SocketIO } from "@mnbroatch/boardgame.io/multiplayer";
import type { BoardGameEngineGame } from "../game-factory/game-factory.js";
export interface ClientOptions {
    boardgameIOGame?: BoardGameEngineGame;
    /** JSON string of a {@link GameFactoryInput} rule object */
    gameRules?: string;
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
interface MoveBuilder {
    targets: unknown[];
    stepIndex: number;
    eliminatedMoves: string[];
}
export declare class Client {
    options: ClientOptions;
    game: BoardGameEngineGame;
    client?: ReturnType<typeof BoardgameIOClient>;
    moveBuilder?: MoveBuilder;
    optimisticWinner?: unknown | null;
    constructor(options: ClientOptions);
    connect(): this | undefined;
    update(): void;
    getState(): {
        state?: undefined;
        gameover?: undefined;
        moves?: undefined;
        currentMoves?: undefined;
        allClickable?: undefined;
        _wrappedMoves?: undefined;
        _possibleMoveMeta?: undefined;
    } | {
        state: import("@mnbroatch/boardgame.io").State<unknown> & {
            isActive: boolean;
            isConnected: boolean;
            log: import("@mnbroatch/boardgame.io").LogEntry[];
        };
        gameover: any;
        moves: Record<string, (...args: any[]) => void>;
        currentMoves: Record<string, unknown> | never[];
        allClickable?: undefined;
        _wrappedMoves?: undefined;
        _possibleMoveMeta?: undefined;
    } | {
        state: import("@mnbroatch/boardgame.io").State<unknown> & {
            isActive: boolean;
            isConnected: boolean;
            log: import("@mnbroatch/boardgame.io").LogEntry[];
        };
        gameover: any;
        allClickable: Set<unknown>;
        _wrappedMoves: Record<string, unknown>;
        _possibleMoveMeta: Record<string, {
            clickableForMove: Set<unknown>;
        }>;
        moves?: undefined;
        currentMoves?: undefined;
    };
    doStep(_target: unknown): void;
    reset(): void;
    undoStep(): void;
}
export {};
//# sourceMappingURL=client.d.ts.map