import { useState, useMemo, useRef } from "react";
import { makeMove } from "../engine/index";
import type { GameRules, ActionPayload } from "../types";

type DoAction = (action: ActionPayload) => void;

const options = { playerCount: 2 } //temp, refactor out once stable

export default function useGame(gameRules: GameRules): [any, DoAction] {
  const baseGame = useMemo(() => makeMove(gameRules, options), [gameRules]);
  
  const [game, setGame] = useState(() => baseGame);
  
  const prevGameRulesRef = useRef(gameRules);
  if (prevGameRulesRef.current !== gameRules) {
    prevGameRulesRef.current = gameRules;
    if (game !== baseGame) {
      setGame(baseGame);
    }
  }

  const doAction: DoAction = (action) => {
    // weird parsing is temp to test serialization
    setGame(currentGame => makeMove(gameRules, options, JSON.parse(JSON.stringify(currentGame)), action))
  };

  return [game, doAction];
}
