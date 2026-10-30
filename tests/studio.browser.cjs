// Launch npm run studio and then npm run test:studio:browser.
// Does not call OpenAI or Wikimedia; all nonlocal requests are blocked.
const {chromium}=require('playwright');
const {strict:assert}=require('node:assert');
const fs=require('node:fs/promises');
const BASE=process.env.STUDIO_BASE_URL||'http://127.0.0.1:4178';
const headers=['분야1','분야2','형태','제목','원본제목','소개','분야연결근거',
  '추천이유','원본URL','출처','썸네일URL','링크검증','개발반영상태','저장일'];
const values=['기술','취미','기사','추천 알고리즘 작동 방식 이해하기','알고리즘',
  '추천 알고리즘은 사용자에게 다양한 콘텐츠를 보여주도록 정보와 자료를 처리합니다.',
  '기술과 취미의 관련성','',
  'https://ko.wikipedia.org/wiki/알고리즘','한국어 위키백과','','미확인','미확인','2026-10-29'];
const csv=[headers,values].map(a=>a.map(x=>'"'+x.replaceAll('"','""')+'"').join(',')).join('\n');
(async()=>{
  const browser=await chromium.launch({headless:true,
    ...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{}),
    args:['--no-sandbox']});
  const context=await browser.newContext({acceptDownloads:true});
  await context.route('**/*',route=>{
    const url=new URL(route.request().url());
    return url.origin===BASE?route.continue():route.abort();
  });
  const page=await context.newPage();const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  try{
    await page.goto(BASE+'/tools/card-studio.html');
    await page.locator('#csvFile').setInputFiles({name:'candidates.csv',mimeType:'text/csv',buffer:Buffer.from(csv)});
    assert.match(await page.locator('#counts').textContent(),/1개 후보/);
    assert.equal(await page.locator('#approve').isDisabled(),true);
    assert.equal(await page.locator('#title').inputValue(),'추천 알고리즘 작동 방식 이해하기');
    console.log('PASS: CSV import and fixed-layout card preview');

    await page.locator('#recommendationReason').fill('추천 시스템의 원리를 알고 싶은 사람에게 필요한 기초 개념을 알려주기 때문입니다.');
    await page.locator('#point0').fill('첫 번째 요약은 사용자 추천을 만드는 데이터 처리 과정을 설명합니다.');
    await page.locator('#point1').fill('두 번째 요약은 추천 순서와 관련된 기본적인 알고리즘 원리를 설명합니다.');
    await page.locator('#point2').fill('세 번째 요약은 사용자 관심도에 따른 정보 선택의 차이를 설명합니다.');
    const blocks=page.locator('.content-section');
    await blocks.nth(0).locator('.heading').fill('알고리즘이란 무엇인가');
    await blocks.nth(0).locator('.body').fill('알고리즘은 문제를 해결하기 위해 단계적인 절차를 정리한 것입니다. 사용자에게 추천할 콘텐츠의 순서를 결정하는 데도 이러한 절차가 활용됩니다.');
    await blocks.nth(1).locator('.heading').fill('추천 기술의 활용');
    await blocks.nth(1).locator('.body').fill('추천 기술은 사용자 관심 분야에 맞는 자료를 정렬하는 데 쓰일 수 있습니다. 이 과정을 이해하면 어떤 기준으로 콘텐츠가 제시되는지 생각해 볼 수 있습니다.');
    await page.locator('#imageUrl').fill('https://example.org/cover.jpg');
    await page.locator('#imageCredit').fill('테스트 제작 이미지 · 사용 조건 확인');
    for(const id of ['linkChecked','contentChecked','rightsChecked'])await page.locator('#'+id).check();
    await page.locator('#approve').click();
    assert.match(await page.locator('#counts').textContent(),/1개 승인/);
    console.log('PASS: inline editing, required review gates, manual approval');

    const downloadEvent=page.waitForEvent('download');
    await page.locator('#exportCards').click();
    const download=await downloadEvent;const buffer=await fs.readFile(await download.path());
    const cards=JSON.parse(buffer.toString('utf8'));
    assert.equal(cards.length,1);assert.equal(cards[0].keyPoints.length,3);
    assert.equal(cards[0].sections.length,2);
    assert.equal(cards[0].contentAttribution,'테스트 제작 이미지 · 사용 조건 확인');
    console.log('PASS: generated website JSON includes article-reader fields');

    await page.reload();
    assert.match(await page.locator('#counts').textContent(),/1개 승인/);
    await page.locator('#title').fill('원문을 다시 검토할 카드 제목');
    assert.equal(await page.locator('#approve').isDisabled(),true);
    assert.match(await page.locator('#counts').textContent(),/0개 승인/);
    console.log('PASS: draft persistence and re-review on text changes');
    assert.deepEqual(errors,[]);
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
