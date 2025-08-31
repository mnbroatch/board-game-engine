import { useState, useMemo, useRef } from "react";
import { makeMove } from "../engine/index";
import type { GameRules, ActionPayload } from "../types";

type DoAction = (action: ActionPayload) => void;

export default function useGame(gameRules: GameRules): [any, DoAction] {
  const baseGame = useMemo(() => makeGame(gameRules), [gameRules]);
  
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
    setGame(currentGame => makeMove(gameRules, JSON.parse(JSON.stringify(currentGame)), action))
  };

  return [game, doAction];
}

function makeGame (gameRules) {
  let baseGame = useMemo(() => makeMove(gameRules), [gameRules])
  baseGame = makeMove(gameRules, baseGame, { playerId: 1, type: 'join' })
  baseGame = makeMove(gameRules, baseGame, { playerId: 2, type: 'join' })
  return baseGame
}
