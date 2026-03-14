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
| `gameRules` | string | JSON string of the B.A.G.E.L. game definition. Ignored if `boardgameIOGame` is set. |
| `gameName` | string | Game name when using `gameRules`. |
| `server` | string | Server URL for multiplayer. |
| `numPlayers` | number | Number of players. |
| `gameId` | string | Match ID for multiplayer. |
| `boardgamePlayerID` | string | Player ID (e.g. `'0'`, `'1'`). |
| `clientToken` | string | Credentials for multiplayer. |
| `singlePlayer` | boolean | If `true` (default when no `clientToken`), run in single-player mode. |
| `debug` | object | boardgame.io debug panel config; e.g. `{ collapseOnLoad: true, impl: Debug }`. |
| `onClientUpdate` | function | Callback after state updates (e.g. to re-render UI). |
| `boardgameIOGame` | object | Pre-built boardgame.io game object. If set, `gameRules` / `gameName` are not used. |


**Methods**

- **`connect()`** — Connects to the game (local or server), starts the client, subscribes to updates. Returns `this`.
- **`getState()`** — Returns current state. With a B.A.G.E.L. game this includes `state`, `gameover`, `moves`, `allClickable`, `possibleMoveMeta`; with `boardgameIOGame` it returns `{ state, gameover, moves }`.
- **`doStep(target)`** — Applies one step of a multi-step move (e.g. “from” then “to”). For B.A.G.E.L. games only; no-op when using `boardgameIOGame`.
- **`undoStep()`** — Undoes the last step of the current move. B.A.G.E.L. games only.
- **`reset()`** — Clears the current move builder (targets/steps). B.A.G.E.L. games only.
- **`update()`** — Triggers `onClientUpdate` if set.

**Example**

```js
import { Client } from 'board-game-engine'

const client = new Client({
  gameRules: JSON.stringify(myGameRules),
  gameName: 'MyGame',
  numPlayers: 2,
  onClientUpdate: () => render(client.getState())
})

client.connect()
// Later, when user picks a target (e.g. a cell or piece):
client.doStep(target)
```

---

### `gameFactory(gameRules, gameName?)`

Builds a boardgame.io-compatible game from a B.A.G.E.L. game definition.

- **`gameRules`** (object) — Your B.A.G.E.L. game definition (entities, boards, moves, turn, phases, endIf).
- **`gameName`** (string, optional) — Name of the game (used by boardgame.io).

**Returns:** A game object with `setup`, `moves`, `turn`, `phases`, and `endIf` as needed — the same shape boardgame.io expects for its `game` option.

**Example**

```js
import { gameFactory } from 'board-game-engine'

const gameRules = {
  entities: [/* ... */],
  moves: [/* ... */],
  turn: { /* ... */ },
  endIf: [/* ... */]
}

const game = gameFactory(gameRules, 'MyGame')
// Use with boardgame.io server or client
```

---

## How it fits

1. You write a B.A.G.E.L. game definition (JSON).
2. **board-game-engine** turns it into a boardgame.io game via `gameFactory`, or you run it in the browser with `Client`.
3. The game runs with boardgame.io (local or server).

For the full language reference, examples, and getting started, see **[https://boardgameengine.com/docs/index.html](https://boardgameengine.com/docs/index.html)**.
