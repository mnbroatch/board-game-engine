import { useState, useEffect } from "react";
import useForceUpdate from "./use-force-update.js";
import Game from "../engine/game/game.js";

export default function useGame(gameRules) {
  const forceUpdate = useForceUpdate();
  const [game, setGame] = useState(() => new Game(gameRules));

  const doAction = (action) => {
    game.doAction(action);
    forceUpdate();
  };

  useEffect(() => {
    setGame(new Game(gameRules));
  }, [gameRules]);

  return [game, doAction];
}
