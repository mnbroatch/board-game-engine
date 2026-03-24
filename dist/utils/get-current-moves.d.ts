/**
 * Minimal shape of the boardgame.io client (or stand-in) used to resolve the active move set.
 */
export interface GetCurrentMovesClient {
    game: {
        phases?: Record<string, unknown>;
        moves?: Record<string, unknown>;
        turn?: {
            stages?: Record<string, unknown>;
        };
    };
    playerID?: string;
    stageName?: string;
}
/** `state` shape expected by {@link getCurrentMoves} (boardgame.io match state). */
export interface GetCurrentMovesState {
    ctx: {
        phase?: string;
        activePlayers?: Record<string, string>;
        currentPlayer?: string;
    };
}
export default function getCurrentMoves(state: GetCurrentMovesState, client: GetCurrentMovesClient): Record<string, unknown>;
//# sourceMappingURL=get-current-moves.d.ts.map