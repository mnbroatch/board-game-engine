import React from "react";
import type { FC } from "react";
import useGame from "./src/hooks/use-game";
import Layout from "./src/components/layout.js";
import gameRules from "./src/tic-tac-toe-verbose.json";
// import gameRules from "./src/onitama-verbose.json";
import GameContext from "./src/context/game-context.js";
import type { OnPieceClick, OnSpaceClick } from "./src/types";

const App: FC<void> = () => {
  const [game, doAction] = useGame(gameRules);

  const onPieceClick: OnPieceClick = (piece) => {
    console.log("piece", piece);
    doAction({
      type: "selectPiece",
      playerId: game.currentRound.currentPlayer.id,
      piece: {
        name: piece.rule.name,
        id: piece.id,
      },
    });
  };

  const onSpaceClick: OnSpaceClick = (cell, board) => {
    const { currentPlayer } = game.currentRound;
    const actionPayload = {
      playerId: currentPlayer.id,
      type: "movePiece",
      board: board.rule.path,
      target: cell.coordinates,
    };
    if (game.context.selectedPiece) {
      actionPayload.piece = { name: game.context.selectedPiece.name };
    }
    doAction(actionPayload);
  };

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
