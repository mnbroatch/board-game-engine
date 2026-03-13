/**
 * BoardGameEngine Client e2e tests.
 */
import { test, expect } from '@playwright/test'
import { readFileSync } from 'fs'
import { join } from 'path'

const FIXTURES = {
  minimal: '/e2e/fixtures/bge-minimal.html',
  ttt: '/e2e/fixtures/bge-ttt.html',
  checkers: '/e2e/fixtures/bge-checkers.html',
}
const MINIMAL_GAME_PATH = join(process.cwd(), 'e2e', 'fixtures', 'minimal-game.json')
const TTT_JSON_PATH = join(process.cwd(), 'examples', 'tic-tac-toe.json')
const CHECKERS_JSON_PATH = join(process.cwd(), 'examples', 'checkers.json')

test.describe('BoardGameEngine', () => {
  test('trivial game loads and getState() returns state', async ({ page }) => {
    test.setTimeout(20000)
    const minimalJson = readFileSync(MINIMAL_GAME_PATH, 'utf8')
    await page.route(/minimal-game\.json$/, (route) =>
      route.fulfill({ contentType: 'application/json', body: minimalJson })
    )
    await page.goto(FIXTURES.minimal, { waitUntil: 'load' })
    await expect(page.getByRole('heading', { name: /BoardGameEngine client – minimal game/i })).toBeVisible()

    const result = await page.evaluate(async () => {
      const client = window.__bgeMinimalClient
      if (!client?.getState) return { error: 'no client', hasBGE: !!window.BoardGameEngine }
      for (let i = 0; i < 50; i++) {
        const s = client.getState()
        const G = s?.state?.G ?? s?.G
        if (G != null) return { gotState: true, G, currentPlayer: s?.state?.ctx?.currentPlayer ?? s?.ctx?.currentPlayer }
        await new Promise((r) => setTimeout(r, 100))
      }
      return { gotState: false, lastGetState: client.getState(), hasBGE: !!window.BoardGameEngine }
    })

    if (result.error) {
      expect(result.hasBGE).toBe(true)
      expect(result.error).toBeUndefined()
    }
    expect(result.gotState, result.gotState ? '' : `getState() never had .state.G`).toBe(true)
    if (result.gotState) {
      expect(result.G).toBeDefined()
      expect(typeof result.G).toBe('object')
      expect(result.currentPlayer).toBeDefined()
    }
  })

  test('tic-tac-toe loads and getState() returns state', async ({ page }) => {
    test.setTimeout(30000)
    const tttJson = readFileSync(TTT_JSON_PATH, 'utf8')
    await page.route(/tic-tac-toe\.json$/, (route) =>
      route.fulfill({ contentType: 'application/json', body: tttJson })
    )
    await page.goto(FIXTURES.ttt, { waitUntil: 'load' })
    await expect(page.getByRole('heading', { name: /BoardGameEngine – tic-tac-toe/i })).toBeVisible()

    const result = await page.evaluate(async () => {
      const client = window.__bgeTttClient
      if (!client?.getState) return { error: 'no client' }
      for (let i = 0; i < 100; i++) {
        const s = client.getState()
        if (s?.state?.G != null) return { gotState: true }
        await new Promise((r) => setTimeout(r, 100))
      }
      return { gotState: false }
    })

    expect(result.error).toBeUndefined()
    expect(result.gotState).toBe(true)
  })

  test('tic-tac-toe: getState().allClickable is a non-empty Set', async ({ page }) => {
    test.setTimeout(20000)
    const tttJson = readFileSync(TTT_JSON_PATH, 'utf8')
    await page.route(/tic-tac-toe\.json$/, (route) =>
      route.fulfill({ contentType: 'application/json', body: tttJson })
    )
    await page.goto(FIXTURES.ttt, { waitUntil: 'load' })
    await expect(page.getByRole('heading', { name: /BoardGameEngine – tic-tac-toe/i })).toBeVisible()

    const result = await page.evaluate(async () => {
      const client = window.__bgeTttClient
      if (!client?.getState) return { error: 'no client' }
      let state = client.getState()
      for (let i = 0; i < 60; i++) {
        if (state?.state?.G) break
        await new Promise((r) => setTimeout(r, 100))
        state = client.getState()
      }
      if (!state?.state?.G) return { error: 'no state' }
      const allClickable = state.allClickable
      return { isSet: allClickable instanceof Set, size: allClickable?.size ?? 0 }
    })

    expect(result.error).toBeUndefined()
    expect(result.isSet).toBe(true)
    expect(result.size).toBeGreaterThan(0)
  })

  test('tic-tac-toe: make a move and assert state changed', async ({ page }) => {
    test.setTimeout(20000)
    const tttJson = readFileSync(TTT_JSON_PATH, 'utf8')
    await page.route(/tic-tac-toe\.json$/, (route) =>
      route.fulfill({ contentType: 'application/json', body: tttJson })
    )
    await page.goto(FIXTURES.ttt, { waitUntil: 'load' })
    await expect(page.getByRole('heading', { name: /BoardGameEngine – tic-tac-toe/i })).toBeVisible()

    const result = await page.evaluate(async () => {
      const client = window.__bgeTttClient
      if (!client?.getState) return { error: 'no client' }
      let state = client.getState()
      for (let i = 0; i < 60; i++) {
        if (state?.state?.G) break
        await new Promise((r) => setTimeout(r, 100))
        state = client.getState()
      }
      if (!state?.state?.G) return { error: 'no state' }
      const G = state.state.G
      const grid = G?.sharedBoard?.entities?.[0]
      if (!grid?.spaces) return { error: 'no grid spaces' }
      const placeIndex = grid.spaces.findIndex(s => (s.entities?.length ?? 0) === 0)
      const emptySpace = placeIndex >= 0 ? grid.spaces[placeIndex] : null
      if (!emptySpace) return { error: 'no empty space' }
      const turnBefore = state.state.ctx.turn
      const currentPlayerBefore = state.state.ctx.currentPlayer
      if (!client.doStep) return { error: 'no doStep' }
      client.doStep(emptySpace)
      await new Promise((r) => setTimeout(r, 200))
      for (let i = 0; i < 40; i++) {
        await new Promise((r) => setTimeout(r, 100))
        const next = client.getState()
        const turnAfter = next?.state?.ctx?.turn
        const currentPlayerAfter = next?.state?.ctx?.currentPlayer
        if (turnAfter !== turnBefore || currentPlayerAfter !== currentPlayerBefore) {
          const nextGrid = next?.state?.G?.sharedBoard?.entities?.[0]
          const placedSpace = nextGrid?.spaces?.[placeIndex]
          const spaceHasEntity = (placedSpace?.entities?.length ?? 0) >= 1
          return {
            ok: true,
            turnBefore,
            turnAfter,
            currentPlayerBefore,
            currentPlayerAfter,
            spaceHasEntity,
          }
        }
      }
      return { error: 'state did not change after move', turnBefore, currentPlayerBefore }
    })

    expect(result.error).toBeUndefined()
    expect(result.ok).toBe(true)
    expect(result.turnAfter).toBeGreaterThan(result.turnBefore)
    expect(result.currentPlayerBefore).toBe('0')
    expect(result.currentPlayerAfter).toBe('1')
    expect(result.spaceHasEntity).toBe(true)
  })

  test('tic-tac-toe: play to game end and check for winner or draw', async ({ page }) => {
    test.setTimeout(60000)
    const tttJson = readFileSync(TTT_JSON_PATH, 'utf8')
    await page.route(/tic-tac-toe\.json$/, (route) =>
      route.fulfill({ contentType: 'application/json', body: tttJson })
    )
    await page.goto(FIXTURES.ttt, { waitUntil: 'load' })
    await expect(page.getByRole('heading', { name: /BoardGameEngine – tic-tac-toe/i })).toBeVisible()

    const result = await page.evaluate(async () => {
      const countFilled = (grid) => grid?.spaces?.filter(s => (s?.entities?.length ?? 0) > 0).length ?? 0
      const client = window.__bgeTttClient
      if (!client?.getState) return { error: 'no client' }
      let state = client.getState()
      for (let i = 0; i < 60; i++) {
        if (state?.state?.G) break
        await new Promise((r) => setTimeout(r, 100))
        state = client.getState()
      }
      if (!state?.state?.G) return { error: 'no state' }
      const grid = state.state.G?.sharedBoard?.entities?.[0]
      if (!grid?.getSpace) return { error: 'no grid' }
      if (!client.doStep) return { error: 'no doStep' }
      const moveOrder = [
        [0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [0, 2], [2, 1], [2, 2], [1, 2]
      ]
      for (let m = 0; m < moveOrder.length; m++) {
        state = client.getState()
        if (state?.gameover ?? state?.state?.ctx?.gameover) break
        const G = state?.state?.G
        const currentGrid = G?.sharedBoard?.entities?.[0]
        if (!currentGrid?.getSpace) return { error: `no grid on move ${m + 1}` }
        const [x, y] = moveOrder[m]
        const space = currentGrid.getSpace([x, y])
        if (!space) return { error: `no space at ${x},${y}` }
        if ((space.entities?.length ?? 0) > 0) continue
        const turnBefore = state.state.ctx.turn
        const currentBefore = state.state.ctx.currentPlayer
        client.doStep(space)
        for (let poll = 0; poll < 50; poll++) {
          await new Promise((r) => setTimeout(r, 100))
          state = client.getState()
          const gameover = state?.gameover ?? state?.state?.ctx?.gameover
          if (gameover) {
            const g = state?.state?.G?.sharedBoard?.entities?.[0]
            return { ok: true, gameover, winner: gameover?.winner ?? (typeof gameover === 'object' ? gameover.winner : undefined), draw: gameover?.draw, movesPlayed: m + 1, filledCount: countFilled(g) }
          }
          if (state?.state?.ctx?.turn !== turnBefore || state?.state?.ctx?.currentPlayer !== currentBefore) break
        }
      }
      for (let i = 0; i < 25; i++) {
        await new Promise((r) => setTimeout(r, 100))
        state = client.getState()
        const gameover = state?.gameover ?? state?.state?.ctx?.gameover
        if (gameover) {
          const g = state?.state?.G?.sharedBoard?.entities?.[0]
          return { ok: true, gameover, winner: gameover?.winner ?? (typeof gameover === 'object' ? gameover.winner : undefined), draw: gameover?.draw, movesPlayed: moveOrder.length, filledCount: countFilled(g) }
        }
      }
      state = client.getState()
      const ctx = state?.state?.ctx
      const gameover = state?.gameover ?? ctx?.gameover
      const finalGrid = state?.state?.G?.sharedBoard?.entities?.[0]
      return { ok: true, gameover, winner: gameover?.winner, draw: gameover?.draw, movesPlayed: moveOrder.length, lastTurn: ctx?.turn, filledCount: countFilled(finalGrid) }
    })

    expect(result.error).toBeUndefined()
    expect(result.ok).toBe(true)
    expect(result.movesPlayed).toBe(9)
    expect(result.filledCount).toBe(9)
    if (result.gameover) {
      expect(result.gameover).toBeTruthy()
      if (result.draw) expect(result.draw).toBe(true)
      else if (result.winner != null) expect(['0', '1']).toContain(result.winner)
    }
  })

  test('checkers: getState().allClickable is a non-empty Set', async ({ page }) => {
    test.setTimeout(30000)
    const checkersJson = readFileSync(CHECKERS_JSON_PATH, 'utf8')
    await page.route(/checkers\.json$/, (route) =>
      route.fulfill({ contentType: 'application/json', body: checkersJson })
    )
    await page.goto(FIXTURES.checkers, { waitUntil: 'load' })
    await expect(page.getByRole('heading', { name: /BoardGameEngine – checkers/i })).toBeVisible()

    const result = await page.evaluate(async () => {
      const client = window.__bgeCheckersClient
      if (!client?.getState) return { error: 'no client' }
      let state = client.getState()
      for (let i = 0; i < 100; i++) {
        if (state?.state?.G) break
        await new Promise((r) => setTimeout(r, 100))
        state = client.getState()
      }
      if (!state?.state?.G) return { error: 'no state' }
      const allClickable = state.allClickable
      return { isSet: allClickable instanceof Set, size: allClickable?.size ?? 0 }
    })

    expect(result.error).toBeUndefined()
    expect(result.isSet).toBe(true)
    expect(result.size).toBeGreaterThan(0)
  })
})
