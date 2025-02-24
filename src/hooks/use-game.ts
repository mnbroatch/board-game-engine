import { useState, useEffect } from "react";
import useForceUpdate from "./use-force-update.js";
import { Game } from "../engine/index";
import type { GameRules, ActionPayload } from "../types";

type DoAction = (action: ActionPayload) => void;

export default function useGame(gameRules: GameRules): [Game, DoAction] {
  const forceUpdate = useForceUpdate();
  const [game, setGame] = useState(() => new Game(gameRules));

  const doAction: DoAction = (action) => {
    game.doAction(action);
    forceUpdate();
  };

  useEffect(() => {
    setGame(new Game(gameRules));
  }, [gameRules]);

  return [game, doAction];
}
