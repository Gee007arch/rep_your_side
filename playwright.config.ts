/**
 * Playwright E2E and Visual Parity Configuration (Gates G3 & G4)
 * Browsers: Chromium, WebKit, and 390px mobile emulation (Approved Decision Q5).
 */
export default {
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: 'chromium-desktop',
      use: {
        browserName: 'chromium',
        viewport: { width: 1440, height: 900 }
      }
    },
    {
      name: 'webkit-desktop',
      use: {
        browserName: 'webkit',
        viewport: { width: 1440, height: 900 }
      }
    },
    {
      name: 'mobile-390',
      use: {
        browserName: 'webkit',
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true
      }
    }
  ],
  webServer: [
    {
      command: 'npm run dev',
      url: 'http://localhost:5173',
      reuseExistingServer: !process.env.CI
    },
    {
      command: 'npm run oracle',
      url: 'http://localhost:8000',
      reuseExistingServer: !process.env.CI
    }
  ]
};

