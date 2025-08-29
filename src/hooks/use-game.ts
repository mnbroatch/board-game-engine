import { useState, useEffect } from "react";
import { makeMove } from "../engine/index";
import type { GameRules, ActionPayload } from "../types";

type DoAction = (action: ActionPayload) => void;

const options = { playerCount: 2 } //temp, refactor out once stable

export default function useGame(gameRules: GameRules): [any, DoAction] {
  const [game, setGame] = useState(() => makeMove(gameRules, options));

  const doAction: DoAction = (action) => {
    // weird parsing is temp to test serialization
    setGame(makeMove(gameRules, options, JSON.parse(JSON.stringify(game)), action))
  };

  useEffect(() => {
    makeMove(gameRules, options)
  }, [gameRules]);

  return [game, doAction];
}
