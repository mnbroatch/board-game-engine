const { devices } = require('@playwright/test')

const PORT = 5174

module.exports = {
  testDir: 'tests/e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
    viewport: { width: 800, height: 600 },
  },
  projects: [{ name: 'firefox', use: { ...devices['Desktop Firefox'] } }],
  webServer: {
    // Avoid `npx http-server` here: it can hang waiting for install/prompts in some environments,
    // which makes Playwright's webServer readiness check time out even though tests are fine.
    command: `node ./node_modules/http-server/bin/http-server . -p ${PORT} -c-1`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
}
