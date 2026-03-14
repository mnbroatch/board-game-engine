/**
 * Playwright test with optional coverage collection for Firefox e2e.
 * When COVERAGE=1, after each test we collect window.__coverage__ from the page
 * (from the instrumented bundle) and write it to .nyc_output/run/ for later merge.
 */
import { test as base } from '@playwright/test'
import { mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'

export const test = base.extend({
  page: async ({ page }, use, testInfo) => {
    await use(page)
    if (!process.env.COVERAGE || !page) return
    try {
      const coverage = await page.evaluate(() => window.__coverage__)
      if (coverage && typeof coverage === 'object' && Object.keys(coverage).length > 0) {
        const dir = join(process.cwd(), '.nyc_output', 'run')
        mkdirSync(dir, { recursive: true })
        const file = join(dir, `cov-${testInfo.workerIndex}-${testInfo.testId}.json`)
        writeFileSync(file, JSON.stringify(coverage), 'utf8')
      }
    } catch (_) {
      // page may be closed or __coverage__ not present
    }
  },
})

export { expect } from '@playwright/test'
