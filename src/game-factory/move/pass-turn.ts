import Move from "./move.js";

export default class PassTurn extends Move {
  do (bgioArguments: unknown) {
    const a = bgioArguments as {
      G: { _meta: { passedPlayers: unknown[] } };
      ctx: { numPlayers: number; currentPlayer: string };
      events: { pass: () => void };
    };
    if (a.G._meta.passedPlayers.length < a.ctx.numPlayers) {
      a.G._meta.passedPlayers.push(a.ctx.currentPlayer);
      a.events.pass();
    }
  }
}
