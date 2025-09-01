import { useState, useMemo, useRef } from "react";
import { makeMove } from "../engine/index";
import type { GameRules, ActionPayload } from "../types";
import gameContext from "../context/game-context";

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
  let baseGame = makeMove(gameRules)
  baseGame = makeMove(gameRules, baseGame, { playerId: 1, type: 'join' })
  baseGame = makeMove(gameRules, baseGame, { playerId: 2, type: 'join' })
  baseGame = makeMove(gameRules, baseGame, { type: 'start' })
  console.log('baseGame', baseGame)
  return baseGame
}
