/**
 * Playwright test with optional coverage collection for Firefox e2e.
 * When COVERAGE=1, after each test we collect window.__coverage__ from the page
 * (from the instrumented bundle) and write it to .nyc_output/run/ for later merge.
 */
import { test as base } from '@playwright/test'
import { mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'

/** JSON.stringify with circular reference guard; returns a string safe to log. */
function safeStringify (value, seen = new WeakSet()) {
  if (value === null) return 'null'
  if (value === undefined) return 'undefined'
  const t = typeof value
  if (t !== 'object') return String(value)
  if (seen.has(value)) return '[Circular]'
  seen.add(value)
  try {
    if (Array.isArray(value)) {
      return '[' + value.map((v) => safeStringify(v, seen)).join(', ') + ']'
    }
    const entries = Object.entries(value).map(([k, v]) => JSON.stringify(k) + ': ' + safeStringify(v, seen))
    return '{ ' + entries.join(', ') + ' }'
  } finally {
    seen.delete(value)
  }
}

export const test = base.extend({
  page: async ({ page }, use, testInfo) => {
    if (process.env.DEBUG_CONSOLE && page) {
      page.on('console', async (msg) => {
        const type = msg.type()
        const args = msg.args()
        const values = await Promise.all(
          args.map((arg) => arg.jsonValue().catch(() => '[Unserializable]'))
        )
        const formatted = values.map((v) => {
          if (v !== null && typeof v === 'object') return safeStringify(v)
          return v
        })
        console.log(`[browser ${type}]`, ...formatted)
      })
    }
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
