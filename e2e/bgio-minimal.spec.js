/**
 * Minimal boardgame.io client test (no BoardGameEngine).
 * Loads a trivial game via boardgame.io only to narrow down why the client
 * doesn't hydrate in headless Firefox.
 */
import { test, expect } from './coverage.js'

const BGIO_MINIMAL_URL = '/e2e/fixtures/bgio-minimal.html'
const BGIO_MINIMAL_DEBUG_URL = '/e2e/fixtures/bgio-minimal-debug.html'

test.describe('boardgame.io minimal (no BoardGameEngine)', () => {
  test('bgio client loads and getState() returns state in headless Firefox', async ({ page }) => {
    test.setTimeout(20000)
    await page.goto(BGIO_MINIMAL_URL, { waitUntil: 'load' })
    await expect(page.getByRole('heading', { name: /boardgame\.io client only/i })).toBeVisible()

    const result = await page.evaluate(async () => {
      const client = window.__bgioMinimalClient
      if (!client || !client.getState) return { error: 'no client', hasBoardgameIO: !!window.BoardgameIO }
      let state = client.getState()
      for (let i = 0; i < 50; i++) {
        if (state && state.G !== undefined) {
          return { gotState: true, G: state.G, currentPlayer: state.ctx?.currentPlayer }
        }
        await new Promise((r) => setTimeout(r, 100))
        state = client.getState()
      }
      return { gotState: false, lastGetState: state, hasBoardgameIO: !!window.BoardgameIO }
    })

    if (result.error) {
      expect(result.hasBoardgameIO, 'BoardgameIO should be on window').toBe(true)
      expect(result.error).toBeUndefined()
    }
    expect(result.gotState, result.gotState ? '' : `getState() never returned .G. lastGetState: ${JSON.stringify(result.lastGetState)}`).toBe(true)
    if (result.gotState) {
      expect(result.G).toEqual({ count: 0 })
      expect(result.currentPlayer).toBeDefined()
    }
  })

  test('bgio client with Debug panel loads and getState() returns state', async ({ page }) => {
    test.setTimeout(25000)
    await page.goto(BGIO_MINIMAL_DEBUG_URL, { waitUntil: 'load' })
    await expect(page.getByRole('heading', { name: /boardgame\.io client only \(debug on\)/i })).toBeVisible()

    const result = await page.evaluate(async () => {
      const client = window.__bgioMinimalClient
      if (!client || !client.getState) return { error: 'no client', hasBoardgameIO: !!window.BoardgameIO }
      let state = client.getState()
      for (let i = 0; i < 80; i++) {
        if (state && state.G !== undefined) {
          return { gotState: true, G: state.G, currentPlayer: state.ctx?.currentPlayer }
        }
        await new Promise((r) => setTimeout(r, 100))
        state = client.getState()
      }
      return { gotState: false, lastGetState: state, hasBoardgameIO: !!window.BoardgameIO }
    })

    if (result.error) {
      expect(result.hasBoardgameIO, 'BoardgameIO should be on window').toBe(true)
      expect(result.error).toBeUndefined()
    }
    expect(result.gotState, result.gotState ? '' : `With Debug: getState() never returned .G. lastGetState: ${JSON.stringify(result.lastGetState)}`).toBe(true)
    if (result.gotState) {
      expect(result.G).toEqual({ count: 0 })
    }
  })
})
