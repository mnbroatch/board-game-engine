/**
 * Minimal shape of the boardgame.io client (or stand-in) used to resolve the active move set.
 */
export interface GetCurrentMovesClient {
  game: {
    phases?: Record<string, unknown>;
    moves?: Record<string, unknown>;
    turn?: { stages?: Record<string, unknown> };
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

// get the most specific set of moves for current stage/phase
// this will probably all break for complex stages with multiple active players
export default function getCurrentMoves (
  state: GetCurrentMovesState,
  client: GetCurrentMovesClient
): Record<string, unknown> {
  const { game, playerID, stageName } = client;
  const phaseName = state.ctx.phase;

  const stageNameToUse = stageName ?? state.ctx.activePlayers?.[playerID ?? state.ctx.currentPlayer ?? ""];
  const phaseOrRoot =
    (game as { phases?: Record<string, unknown> }).phases?.[phaseName as string] ?? game;
  const stageOrPhaseOrRoot =
    (phaseOrRoot as { turn?: { stages?: Record<string, unknown> } }).turn?.stages?.[stageNameToUse as string] ?? phaseOrRoot;

  return (stageOrPhaseOrRoot as { moves?: Record<string, unknown> }).moves ?? {};
}
