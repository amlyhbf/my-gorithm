// Run npm run dev -- --host 127.0.0.1, then npm run test:content:browser.
// Network requests outside local Vite origin are blocked (no Firebase).
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const { chromium } = require('playwright');
const BASE = process.env.TEST_BASE_URL || 'http://127.0.0.1:5173';
const HEADERS = [
  '분야1','분야2','형태','제목','원본제목','소개','분야연결근거',
  '추천이유','원본URL','출처','썸네일URL','링크검증','개발반영상태','저장일'
];
const input = [
  '기술','문화','기사','추천 시스템은 어떻게 작동할까?','추천 시스템',
  '추천 시스템은 콘텐츠를 정렬하고 이용자에게 관련 정보와 새로운 주제를 제공하도록 설계됩니다.',
  '기술: 알고리즘 / 문화: 콘텐츠','','https://ko.wikipedia.org/wiki/추천_시스템',
  '한국어 위키백과','','미확인','미확인','2026-10-29'
];
const enc = values => values.map(v => '"' + String(v).replace(/"/g,'""') + '"').join(',');
const csv = '\uFEFF' + enc(HEADERS) + '\r\n' + enc(input) + '\r\n';

(async () => {
  const browser = await chromium.launch({
    headless: true, ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}),
    args: ['--no-sandbox']
  });
  const context = await browser.newContext({ acceptDownloads:true, viewport:{ width:1280, height:900 } });
  await context.route('**/*', route => {
    const url = new URL(route.request().url());
    return url.origin === new URL(BASE).origin ? route.continue() : route.abort();
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  try {
    await page.goto(BASE + '/tools/content-admin.html');
    await page.locator('#csvFile').setInputFiles({
      name:'test-candidates.csv', mimeType:'text/csv', buffer:Buffer.from(csv,'utf8')
    });
    assert.equal(await page.locator('#totalCount').textContent(), '1');
    assert.equal(await page.locator('#approvedCount').textContent(), '0');
    assert.equal(await page.locator('#approveButton').isDisabled(), true);
    console.log('PASS: CSV imported; incomplete items are not automatically approved');

    await page.locator('[name="recommendationReason"]').fill('새로운 추천 알고리즘을 이해하려는 사용자를 위한 기초 읽을거리입니다.');
    await page.locator('[name="imageUrl"]').fill('https://example.org/thumb.png');
    await page.locator('[name="imageCredit"]').fill('직접 제작한 썸네일 / 사용 권한 확인');
    for (const name of ['linkChecked','contentChecked','rightsChecked']) await page.locator('[name="' + name + '"]').check();
    assert.equal(await page.locator('#approveButton').isEnabled(), true);
    await page.locator('#approveButton').click();
    assert.equal(await page.locator('#approvedCount').textContent(), '1');
    console.log('PASS: manual review gates and approval');

    let downloadEvent = page.waitForEvent('download');
    await page.locator('#exportApproved').click();
    const jsonDownload = await downloadEvent;
    const cards = JSON.parse(await fs.readFile(await jsonDownload.path(), 'utf8'));
    assert.equal(cards.length,1);
    assert.equal(cards[0].category,'tech');
    assert.equal(cards[0].recommendationReason.includes('알고리즘'),true);
    console.log('PASS: approved cards JSON export');

    downloadEvent = page.waitForEvent('download');
    await page.locator('#exportReview').click();
    const csvDownload = await downloadEvent;
    const review = await fs.readFile(await csvDownload.path(), 'utf8');
    assert(review.includes('검토메모') && review.includes('승인'));
    await page.reload();
    assert.equal(await page.locator('#approvedCount').textContent(), '1');
    console.log('PASS: local draft retained across reload');

    page.on('dialog', dialog => dialog.accept());
    await page.locator('#csvFile').setInputFiles({
      name:'review-backup.csv', mimeType:'text/csv', buffer:Buffer.from(review, 'utf8')
    });
    assert.equal(await page.locator('#approvedCount').textContent(),'1');
    console.log('PASS: reviewed CSV backup can be re-imported');
    assert.deepEqual(errors,[]);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
