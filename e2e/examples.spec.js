/** E2E tests for examples/index.html (Board Game Engine). */
import { test, expect } from '@playwright/test'
import { readFileSync } from 'fs'
import { join } from 'path'

const EXAMPLES_URL = '/examples/index.html'
const TTT_JSON_PATH = join(process.cwd(), 'examples', 'tic-tac-toe.json')

test.describe('Examples', () => {
  test('examples page loads with tic-tac-toe selected and Start button', async ({ page }) => {
    await page.goto(EXAMPLES_URL, { waitUntil: 'load' })
    await expect(page.getByRole('heading', { name: /Board Game Engine/i })).toBeVisible()
    await expect(page.locator('#game-select')).toHaveValue('tic-tac-toe')
    await expect(page.getByRole('button', { name: /Start \/ Reset Game/i })).toBeVisible()
  })

  test('can load tic-tac-toe and read game config in browser', async ({ page }) => {
    const tttJson = readFileSync(TTT_JSON_PATH, 'utf8')
    await page.route(/tic-tac-toe\.json$/, (route) =>
      route.fulfill({ contentType: 'application/json', body: tttJson })
    )
    await page.goto(EXAMPLES_URL, { waitUntil: 'load' })

    const config = await page.evaluate(async () => {
      const res = await fetch('/examples/tic-tac-toe.json')
      return res.json()
    })
    expect(config.entities).toBeDefined()
    expect(Array.isArray(config.entities)).toBe(true)
    expect(config.moves).toBeDefined()
    expect(config.moves.placePlayerMarker).toBeDefined()
    expect(config.numPlayers).toBe(2)
  })
})
