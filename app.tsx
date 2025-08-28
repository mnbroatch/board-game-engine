import React, { useState } from "react";
import type { FC } from "react";
import useGame from "./src/hooks/use-game";
import Layout from "./src/components/layout.js";
import gameRules from "./src/tic-tac-toe-verbose.json";
// import gameRules from "./src/onitama-verbose.json";
import GameContext from "./src/context/game-context.js";
import type { OnPieceClick, OnSpaceClick } from "./src/types";

const App: FC<void> = () => {
  const [game, doAction] = useGame(gameRules);
  const [selectedPiece, setSelectedPiece] = useState(null);

  const onPieceClick: OnPieceClick = (piece) => {
    // todo: multiselect
    if (!selectedPiece) {
      setSelectedPiece(piece)
    } else {
      setSelectedPiece(null)
    }
  };

  const onSpaceClick: OnSpaceClick = (cell, board) => {
    const { currentPlayerIndex } = game.currentRound;
    const currentPlayer = game.players[currentPlayerIndex]
    const actionPayload = {
      playerId: currentPlayer.id,
      type: 'movePiece',
      board: board.rule.path,
      target: cell.coordinates,
    };
    if (selectedPiece) {
      actionPayload.piece = { name: selectedPiece.name };
    }
    doAction(actionPayload);
  };
  console.log('game', game)

  return (
    <GameContext.Provider value={game}>
      <Layout
        game={game}
        onSpaceClick={onSpaceClick}
        onPieceClick={onPieceClick}
      />
    </GameContext.Provider>
  );
};

export default App;
