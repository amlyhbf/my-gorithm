// Run npm run dev -- --host 127.0.0.1, then npm run test:feed:browser.
// External network requests (including production Firebase) are blocked.
const assert = require('node:assert/strict');
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
    const first = await ensureUnique(12);
    assert.equal(await page.locator('#btnFeedMore').isVisible(), true);

    await page.locator('#btnFeedMore').click();
    await ensureUnique(24);
    await page.locator('#btnFeedMore').click();
    const all = await ensureUnique(32);
    assert.equal(new Set(all).size, 32);
    assert.equal(await page.locator('#btnFeedMore').isVisible(), false);
    console.log('PASS: 12 → 24 → 32 distinct cards without duplicates');

    await page.reload();
    const revisit = await ensureUnique(12);
    assert.equal(revisit.filter(id => first.includes(id)).length, 0, 'revisit repeated the initial page despite available alternatives');
    assert.equal(await page.locator('#btnFeedMore').isVisible(), true);
    console.log('PASS: revisit prioritizes previously unshown/older cards');

    await page.locator('#btnShuffle').click();
    await ensureUnique(12);
    await page.locator('[data-type="video"]').click();
    await page.waitForFunction(() => {
      const cards = [...document.querySelectorAll('#feedCardsList .content-feed-card')];
      return cards.length > 0 && cards.every(c => c.dataset.type === 'video');
    });
    const videoIds = await ids();
    assert.equal(new Set(videoIds).size, videoIds.length);
    console.log('PASS: shuffle, content-type filtering');

    await page.locator('[data-type="all"]').click();
    await page.locator('#presetContainer [data-preset-id="studyOnly"]').click();
    await ensureUnique(8);
    assert.equal(await page.locator('#btnFeedMore').isVisible(), false);
    console.log('PASS: study-only shows 8 rather than duplicating to 12');

    await page.locator('#presetContainer [data-preset-id="balanced"]').click();
    await ensureUnique(12);
    await cards.first().locator('.card-bookmark-btn').click();
    const saved = await page.evaluate(() => localStorage.getItem('mamgorithm_saved_v2'));
    assert(saved && JSON.parse(saved).length >= 1, 'bookmark not saved');
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
