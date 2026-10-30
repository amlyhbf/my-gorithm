// Run npm run dev -- --host 127.0.0.1, then npm run test:feed:browser.
// External network requests (including production Firebase) are blocked.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require('playwright');

const BASE = process.env.TEST_BASE_URL || 'http://127.0.0.1:5173';
const keys = {
  seen: 'mamgorithm_intro_seen_v1',
  onboarded: 'mamgorithm_onboarded_v2',
  coachmark: 'mamgorithm_coachmark_seen',
  recent: 'mamgorithm_recent_feed_v1'
};

(async () => {
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}),
    args: ['--no-sandbox']
  });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await context.route('**/*', route => {
    const target = new URL(route.request().url());
    return target.origin === new URL(BASE).origin ? route.continue() : route.abort();
  });
  await context.addInitScript(k => {
    try {
      localStorage.setItem(k.seen, 'true');
      localStorage.setItem(k.onboarded, 'true');
      localStorage.setItem(k.coachmark, 'true');
    } catch {}
  }, keys);

  const page = await context.newPage();
  const shots = 'docs/feed-diversity/screenshots';
  fs.mkdirSync(shots, { recursive: true });
  const shot = name => page.screenshot({ path: `${shots}/${name}.png` });
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  const cards = page.locator('#feedCardsList .content-feed-card');
  const ids = () => cards.evaluateAll(nodes => nodes.map(node => node.dataset.id));
  const ensureUnique = async expected => {
    await page.waitForFunction(n => document.querySelectorAll('#feedCardsList .content-feed-card').length === n, expected);
    const values = await ids();
    assert.equal(values.length, expected);
    assert.equal(new Set(values).size, expected, 'duplicated card ID in feed');
    return values;
  };

  try {
    await page.goto(BASE);
    const firstVisit = await ensureUnique(12);
    await page.reload();
    const first = await ensureUnique(12);
    assert.equal(first.filter(id => firstVisit.includes(id)).length, 0,
      'revisit repeated cards while unshown alternatives were available');
    console.log('PASS: revisit prioritizes unshown cards before catalog exhaustion');
    assert.equal(await page.locator('#btnFeedMore').isVisible(), true);
    await shot('mobile-light-feed');
    await page.locator('#btnFeedMore').scrollIntoViewIfNeeded();
    await shot('mobile-load-more');

    await page.locator('#btnFeedMore').click();
    await ensureUnique(24);
    await page.locator('#btnFeedMore').click();
    const all = await ensureUnique(32);
    const statCounts = await page.locator('#statsTableContainer tbody tr td:last-child').allTextContents();
    assert.equal(statCounts.reduce((n, v) => n + parseInt(v, 10), 0), 32);
    assert.equal(new Set(all).size, 32);
    assert.equal(await page.locator('#btnFeedMore').isVisible(), false);
    console.log('PASS: 12 → 24 → 32 distinct cards without duplicates');

    await page.reload();
    const revisit = await ensureUnique(12);
    assert.equal(revisit.filter(id => all.slice(24).includes(id)).length, 0,
      'after exhaustion, older cards must precede the most recently added page');
    assert.equal(await page.locator('#btnFeedMore').isVisible(), true);
    console.log('PASS: revisit prioritizes previously unshown/older cards');

    await page.locator('#btnShuffle').click();
    await ensureUnique(12);
    await page.locator('.type-pill[data-type="video"]').click();
    await page.waitForFunction(() => {
      const cards = [...document.querySelectorAll('#feedCardsList .content-feed-card')];
      return cards.length > 0 && cards.every(c => c.dataset.type === 'video');
    });
    const videoIds = await ids();
    assert.equal(new Set(videoIds).size, videoIds.length);
    console.log('PASS: shuffle, content-type filtering');

    await page.locator('.type-pill[data-type="article"]').click();
    await page.waitForFunction(() => {
      const nodes = [...document.querySelectorAll('#feedCardsList .content-feed-card')];
      return nodes.length > 0 && nodes.every(c => c.dataset.type === 'article');
    });

    await page.locator('.type-pill[data-type="all"]').click();
    await page.locator('#presetContainer [data-preset-id="studyOnly"]').click();
    await ensureUnique(8);
    assert.equal(await page.locator('#btnFeedMore').isVisible(), false);
    console.log('PASS: study-only shows 8 rather than duplicating to 12');

    await page.locator('#presetContainer [data-preset-id="balanced"]').click();
    await ensureUnique(12);
    await cards.first().locator('.card-bookmark-btn').click();
    const saved = await page.evaluate(() => localStorage.getItem('mamgorithm_saved_v2'));
    assert(saved && JSON.parse(saved).length >= 1, 'bookmark not saved');
    const savedId = JSON.parse(saved)[0];
    await page.reload();
    await ensureUnique(12);
    await page.locator('[data-tab="viewSaved"]').click();
    const savedCard = page.locator(`#savedCardsList [data-id="${savedId}"]`);
    await savedCard.waitFor({ state: 'visible' });
    await shot('mobile-bookmarks');
    await savedCard.locator('.card-bookmark-btn').click();
    assert.deepEqual(JSON.parse(await page.evaluate(() => localStorage.getItem('mamgorithm_saved_v2'))), []);
    await page.locator('[data-tab="viewFeed"]').click();
    await page.locator('#dockPeekBar').click();
    for (const [cat, value] of Object.entries({ study: 100, tech: 0, culture: 0, hobby: 0 })) {
      const slider = page.locator(`.dock-range-input[data-cat="${cat}"]`);
      await slider.focus();
      await slider.press(value === 100 ? 'End' : 'Home');
    }
    await shot('mobile-mixer');
    await page.locator('#btnApplyDockMixer').click();
    await ensureUnique(8);
    assert.deepEqual(JSON.parse(await page.evaluate(() => localStorage.getItem('mamgorithm_weights_v2'))),
      { study: 100, tech: 0, culture: 0, hobby: 0 });
    await shot('mobile-study-only');
    await page.locator('#btnThemeToggle').click();
    await shot('mobile-dark-feed');
    await page.locator('#btnThemeToggle').click();
    await page.locator('[data-tab="viewStats"]').click();
    await page.evaluate(() => {
      Object.defineProperty(navigator, 'share', { configurable: true, value: undefined });
      Object.defineProperty(navigator, 'clipboard', { configurable: true,
        value: { writeText: async text => { window.__sharedRecipe = text; } } });
    });
    await page.locator('#btnShareRecipeInStats').click();
    const shared = await page.evaluate(() => window.__sharedRecipe);
    assert.equal(new URL(shared).search, '?s=100&t=0&c=0&h=0');
    await shot('mobile-stats');
    await page.setViewportSize({ width: 1440, height: 900 });
    await shot('desktop-light-stats');
    await page.locator('#btnThemeToggle').click();
    assert.equal(await page.evaluate(() => localStorage.getItem('mamgorithm_theme_v2')), 'dark');
    await page.locator('[data-tab="viewFeed"]').click();
    await shot('desktop-dark-feed');
    await page.locator('#btnThemeToggle').click();
    assert.equal(await page.evaluate(() => localStorage.getItem('mamgorithm_theme_v2')), 'light');
    await shot('desktop-light-feed');
    await page.goto(shared);
    await ensureUnique(8);
    console.log('PASS: article filter, statistics, bookmark persistence/removal, sliders, themes and recipe round-trip');
    assert.equal(await page.locator('.intro-dialog').count(), 0);
    assert.equal(await page.locator('#onboardingOverlay').evaluate(node => node.classList.contains('hidden')), true);
    assert.deepEqual(pageErrors, []);
    console.log('PASS: presets/bookmarks remain functional; no runtime errors');
  } finally {
    await browser.close();
  }
})().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
