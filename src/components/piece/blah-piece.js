import React, { useContext } from "react";
import GameContext from "../../context/game-context.js";

export default function Blah({ piece, onClick }) {
  const game = useContext(GameContext);
  return (
    <button
      onClick={onClick}
      className={[
        "piece",
        "piece--blah",
        game.context.selectedPiece === piece && "piece--blah--selected",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {piece.rule.name !== "playerMarker" && <div>{piece.rule.name}</div>}
      {piece.player && <div>P{piece.player.index}</div>}
      {piece.rule.variantId && <div>{piece.rule.variantId}</div>}
    </button>
  );
}
