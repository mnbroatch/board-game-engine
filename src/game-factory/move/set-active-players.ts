import type { MoveDefinition } from "../../types/bagel-types.js";
import type { BgioResolveState } from "../../utils/bgio-resolve-types.js";
import Move from "./move.js";
import doMoves from '../../utils/do-moves.js'

export default class SetActivePlayers extends Move {
  do (bgioArguments: unknown, rule: Record<string, unknown>, _unused: unknown, context: Record<string, unknown>) {
    const b = bgioArguments as { events: { setActivePlayers: (o: unknown) => void }; ctx: { phase: string } };
    b.events.setActivePlayers((rule as { options: unknown }).options);

    // this is going to need to be expanded to handle more complex things
    // than "move current player to new stage"
    const phaseName = b.ctx.phase;
    const stageName = (rule.options as { currentPlayer?: { stage?: string } }).currentPlayer?.stage;
    const phaseOrRoot = (context.game as { phases?: Record<string, unknown> }).phases?.[phaseName] ?? context.game;
    const stage = (phaseOrRoot as { turn?: { stages?: Record<string, unknown> } })?.turn?.stages?.[stageName as string];
    doMoves(
      bgioArguments as BgioResolveState,
      (stage as { initialMoves?: MoveDefinition[] } | undefined)?.initialMoves,
      {
        ...context,
        stageName,
      } as unknown as Parameters<typeof doMoves>[2]
    )
  }
}
