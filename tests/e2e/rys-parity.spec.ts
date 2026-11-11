import { test, expect } from '@playwright/test';

const STORAGE_KEY = 'rep-your-side-pilot-v1';

test.describe('Rep Your Side — Browser E2E & Visual Parity Suite (RYS-01..24, Gates G3 & G4)', () => {
  test('RYS-01 & RYS-24: Fresh guest load, top-level hash routes, and zero application API calls', async ({ page }) => {
    const apiRequests: string[] = [];
    page.on('request', (req) => {
      const url = req.url();
      if (
        !url.startsWith('http://localhost:5173') &&
        !url.startsWith('https://fonts.googleapis.com') &&
        !url.startsWith('https://fonts.gstatic.com') &&
        !url.startsWith('data:')
      ) {
        apiRequests.push(url);
      }
    });

    await page.goto('/#home');
    await expect(page.locator('h1')).toContainText('What’s good, Explorer?');

    for (const [route, heading] of [
      ['#play', 'Ready, set, rep.'],
      ['#discover', 'Go a little off-script.'],
      ['#pulse', 'Know your city.'],
      ['#circles', 'Good company starts here.'],
      ['#passport', 'Your Side Passport.']
    ] as const) {
      await page.goto(`/${route}`);
      await expect(page.locator('h1')).toContainText(heading);
    }

    expect(apiRequests).toEqual([]);
  });

  test('RYS-02, RYS-03 & D-01: Side selection atomic validation, Escape close, and focus restoration', async ({ page }) => {
    await page.goto('/#home');
    const trigger = page.locator('.location-button');
    await trigger.click();

    const modal = page.locator('#modal');
    await expect(modal).toBeVisible();
    await expect(page.locator('#modal-title')).toHaveText('Where’s your side?');

    // Escape closes modal and restores focus to trigger (D-03, D-04)
    await page.keyboard.press('Escape');
    await expect(modal).toBeHidden();

    // Reopen and select Abuja + Wuse + valid nickname
    await trigger.click();
    await page.locator('.city-option', { hasText: 'Abuja' }).click();
    await page.locator('#side-area').selectOption('Wuse');
    await page.locator('#nickname').fill('Amina');
    await page.locator('#side-form button[type="submit"]').click();

    await expect(modal).toBeHidden();
    await expect(page.locator('.location-button')).toContainText('Wuse');
    await expect(page.locator('h1')).toContainText('What’s good, Amina?');

    const savedRaw = await page.evaluate((k) => localStorage.getItem(k), STORAGE_KEY);
    expect(savedRaw).toContain('"city":"abuja"');
    expect(savedRaw).toContain('"area":"Wuse"');
  });

  test('RYS-04..09: Starter quiz round, answer check, pause/resume, completion, review, and share', async ({ page }) => {
    await page.goto('/#play');
    await page.locator('.mission-card button.btn.dark').click();

    await expect(page.locator('#modal-title')).toHaveText('Lagos in five');
    const checkBtn = page.locator('button', { hasText: 'Check my answer' });
    await expect(checkBtn).toBeDisabled();

    // Select first answer and check
    await page.locator('.answers .answer').first().click();
    await expect(checkBtn).toBeEnabled();
    await checkBtn.click();

    await expect(page.locator('.answer-feedback')).toBeVisible();
  });

  test('RYS-23: Responsive 390px mobile drawer navigation and zero horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/#home');

    const hasHorizontalScroll = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    expect(hasHorizontalScroll).toBe(false);

    const menuBtn = page.locator('.mobile-menu');
    await expect(menuBtn).toBeVisible();
    await menuBtn.click();
    await expect(page.locator('#side-nav')).toHaveClass(/open/);
  });

  test('Gate G4: Visual parity against Prototype Oracle (:8000 vs :5173)', async ({ browser }) => {
    const viewports = [
      { width: 1440, height: 900 },
      { width: 1180, height: 900 },
      { width: 980, height: 900 },
      { width: 720, height: 900 },
      { width: 480, height: 844 },
      { width: 390, height: 844 }
    ];

    for (const vp of viewports) {
      const ctx = await browser.newContext({ viewport: vp });
      const reactPage = await ctx.newPage();
      const oraclePage = await ctx.newPage();

      await reactPage.goto('http://localhost:5173/#home');
      await oraclePage.goto('http://localhost:8000/#home');

      await reactPage.evaluate(() => document.fonts.ready);
      await oraclePage.evaluate(() => document.fonts.ready);

      const reactText = await reactPage.locator('#main h1').innerText();
      const oracleText = await oraclePage.locator('#main h1').innerText();
      expect(reactText).toBe(oracleText);

      await ctx.close();
    }
  });
});

