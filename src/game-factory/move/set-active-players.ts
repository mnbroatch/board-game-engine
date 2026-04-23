import type { MoveDefinition, MoveSetActivePlayers, StageConfig } from "../../types/expanded-game-types.js";
import type { MovePayload } from "../../types/move-payload.js";
import type { MoveArgumentsMap } from "../../types/move-arguments.js";
import type { BgioResolveState } from "../../utils/bgio-resolve-types.js";
import Move from "./move.js";
import doMoves, { type DoMovesContext } from "../../utils/do-moves.js";

type BgioWithSetActivePlayersEvents = BgioResolveState & {
  events: { setActivePlayers: (o: unknown) => void };
};

export default class SetActivePlayers extends Move<MoveArgumentsMap> {
  do (
    bgioArguments: BgioResolveState,
    rule: MoveDefinition,
    _resolvedPayload: MovePayload<MoveArgumentsMap>,
    context: DoMovesContext
  ) {
    const r = rule as MoveSetActivePlayers;
    const b = bgioArguments as BgioWithSetActivePlayersEvents;
    b.events.setActivePlayers(r.options);

    // this is going to need to be expanded to handle more complex things
    // than "move current player to new stage"
    const phaseName = b.ctx.phase;
    const stageName = r.options.currentPlayer?.stage;
    const phaseOrRoot = (context.game as { phases?: Record<string, unknown> }).phases?.[phaseName] ?? context.game;
    const stage = (phaseOrRoot as { turn?: { stages?: Record<string, unknown> } })?.turn?.stages?.[stageName as string];
    doMoves(
      bgioArguments,
      (stage as StageConfig | undefined)?.initialMoves,
      {
        ...context,
        stageName,
      }
    );
  }
}
