import React from 'react'
import Board from './board/board'

export default function Layout ({ game, onCellClick, onPieceClick }) {
  const halfCount = Math.ceil(game.players.length / 2)

  return (
    <div className="layout">
      {!!game.personalBoards && (
        <div>
          {game.players.slice(0, halfCount).map(player => (
            <div key={player.id} className="layout__personal-board">
              {Object.entries(game.personalBoards[player.id]).map(([key, board]) => (
                <Board
                  key={key}
                  board={board}
                  location={['personalBoard', key]}
                  game={game}
                  onCellClick={onCellClick}
                  onPieceClick={onPieceClick}
                />
              ))}
            </div>
          ))}
        </div>
      )}
      <div className="layout__shared-board">
        {Object.entries(game.sharedBoard).map(([key, board]) => (
          <Board key={key}
            board={board}
            location={['sharedBoard', key]}
            game={game}
            onCellClick={onCellClick}
          />
        ))}
      </div>
      {!!game.personalBoards && (
        <div>
          {game.players.slice(halfCount).map(player => (
            <div key={player.id} className="layout__personal-board">
              {Object.entries(game.personalBoards[player.id]).map(([key, board]) => (
                <Board
                  key={key}
                  board={board}
                  location={['personalBoard', key]}
                  game={game}
                  onCellClick={onCellClick}
                  onPieceClick={onPieceClick}
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
