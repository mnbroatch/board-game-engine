import React from 'react'
import Board from './board/board'

export default function Layout ({ game, onCellClick, onPieceClick }) {
  if (game.players.length === 2) {
    return (
      <div className="layout">
        {Object.entries(game.rules.player.personalBoard).map(([id, board]) => (
          <Board key={id}
            board={board}
            location={['personalBoard', id]}
            game={game}
            onCellClick={onCellClick}
            onPieceClick={onPieceClick}
          />
        ))}
        <div className="layout__boards">
          {Object.entries(game.sharedBoard).map(([id, board]) => (
            <Board key={id}
              board={board}
              location={['sharedBoard', id]}
              game={game}
              onCellClick={onCellClick}
            />
          ))}
        </div>
      </div>
    )
  }
}
