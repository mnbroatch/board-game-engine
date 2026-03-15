# board-game-engine

Runs games written with the early-in-development JSON-based B.A.G.E.L. (Board-based Automated Game Engine Language). Built upon [boardgame.io](https://boardgame.io/)

Currently supports enough rules flexibility to describe:
    - Tic Tac Toe
    - Checkers
    - Othello
    - 4-in-a-Row But There is Gravity
    - Crazy Eights

[**B.A.G.E.L. docs:**](https://boardgameengine.com/docs/index.html) — reference for moves, conditions, values, shorthand, and examples.
[**board-game-engine-react**](https://github.com/mnbroatch/board-game-engine-react) — react component wrapping this repo
[**boardgameengine.com**](https://boardgameengine.com) — Main page
    - Create custom games or edit 
    - Create multiplayer lobbies for playing custom B.A.G.E.L. games, also includes client-side editor sandbox. Maintained by author of board-game-engine

---

## Benefits

The B.A.G.E.L. Domain-Specific Langage:
    - declarative
    - safe because there is no custom code to run
        - this means it would be hard for, say, bad LLM output to embed anything too nasty inside "user"-defined games
    - complete enough to produce multiplayer web prototypes

Using B.A.G.E.L. in conjunction with this engine also enables UX features:
    - client-side staging for multi-step moves
        - You can for instance select a piece, then select a destination to put it at, all before committing the move
        - Undo steps before commit
    - Highlight currently-playable targets during a move

---

## Install

```bash
npm install board-game-engine
```

---

## Public API


### `Client`

A client that runs a B.A.G.E.L.-defined game

**Constructor: `new Client(options)`**

| Option | Type | Description |
|--------|------|-------------|
| `gameRules` | string | JSON string of the B.A.G.E.L. game definition |
| `numPlayers` | number | Number of players in client-side game. |
| `onClientUpdate` | function | Callback after state updates (e.g. to re-render UI). |
| `debug` | object | boardgame.io debug panel config; e.g. `false`. |

**Multiplayer** — For connecting to a remote game, see [Multiplayer](#multiplayer) below. Options such as `server` and `matchID` are passed through to the boardgame.io client; see the [boardgame.io Client API](https://boardgame.io/documentation/#/api/Client) for details.


**Methods**

- **`connect()`** — Connects to the game (local or server), starts the client, subscribes to updates. Returns `this`.
- **`getState()`** — Returns current state. See [getState() return value](#getstate-return-value) below.
- **`update()`** — Triggers `onClientUpdate` if set.
- **`doStep(target)`** — Applies one step of a multi-step move (e.g. “from” then “to”). For B.A.G.E.L. games only.
- **`undoStep()`** — Undoes the last step of the current move. B.A.G.E.L. games only.
- **`reset()`** — Clears the current move builder (targets/steps). B.A.G.E.L. games only.

**Properties**

- **`client`** — boardgame.io client instance
- **`moveBuilder`** — Mostly for internal use with multi-step moves but could inform UI

#### getState() return value

`Client` can run normal boardgame.io games, with limited features compared to B.A.G.E.L. games.

In non-B.A.G.E.L. games, `doStep(target)` is not used. instead, the boardgame.io client's moves object is returned from getState().

- `state` — current game state
- `gameover` — game-over result when the game has ended
- `allClickable` — B.A.G.E.L. games only. Clickable targets for the current step of the current move
- `moves` — non-B.A.G.E.L. games only. From boardgame.io client
- `currentMoves` — non-B.A.G.E.L. games only. `moves` object filtered to only contain current phase / stage moves. May break for complex turns.

**Example**

```js
import { Client } from 'board-game-engine'

const client = new Client({
  gameRules: JSON.stringify(myGameRules),
  numPlayers: 2,
  onClientUpdate: () => render(client.getState())
})

client.connect()
// Later, when user picks a target (e.g. a cell or piece):
client.doStep(target)
```

#### Multiplayer

To connect to a remote match instead of running client-only, pass `server`, `matchID`, `playerID`, and `credentials`. When `credentials` is absent, the client runs in client-only mode.

Note: boardgame.io does not allow adding games to the server instance after it is instantiated. boardgameengine.com hacks around that, but your server will need to have access to any games you intend to play when you boot it up.


| Option | Type | Description |
|--------|------|-------------|
| `server` | string | URL of gameserver running boardgame.io server instance |
| `matchID` | string | Match ID. |
| `gameName` | string | Game name |
| `playerID` | string | Player ID (first player is `'0'`, next is `'1'`, etc.) |
| `credentials` | string | Credentials for your server to interpret |
| `multiplayer` | object | boardgame.io multiplayer transport. Defaults to `SocketIO({ server, socketOpts: { transports: ['websocket', 'polling'] } })`, (SocketIO is exported from `boardgame.io/multiplayer` |

All options are required, (only one of `server` or `multiplayer`). For full details on the client options and multiplayer setup, see the [boardgame.io Client API](https://boardgame.io/documentation/#/api/Client).

---

### `gameFactory(gameRules, gameName)`

Builds a boardgame.io-compatible game from a B.A.G.E.L. game definition. Useful for preloading games in server code (server games must be preloaded in boardgame.io)

---

## How it fits

1. You write a B.A.G.E.L. game definition (JSON).
2. **board-game-engine** turns it into a boardgame.io game
3. The game runs with boardgame.io (local or server).
4. `Client` wrapper adds client-side functionality like valid move highlighting

For the full language reference, examples, and getting started, see **[https://boardgameengine.com/docs/index.html](https://boardgameengine.com/docs/index.html)**.
