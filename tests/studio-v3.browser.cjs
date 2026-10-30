// Start npm run dev:studio:v3, then npm run test:studio:v3:browser.
// This test never calls paid OpenAI endpoints or real Wikipedia services.
const {chromium}=require('playwright');
const fs=require('node:fs/promises');
const assert=require('node:assert/strict');
const ORIGIN=process.env.STUDIO_V3_ORIGIN||'http://127.0.0.1:5173';
const WIKI_URL='https://ko.wikipedia.org/wiki/%EC%95%8C%EA%B3%A0%EB%A6%AC%EC%A6%98';
const work={
  title:'알고리즘은 우리에게 어떤 콘텐츠를 추천할까?',
  summary:'알고리즘은 일련의 문제 해결 절차를 뜻합니다. 콘텐츠를 추천하는 과정에서 알고리즘의 원리가 어떻게 사용되는지 알아보는 읽을거리입니다.',
  recommendationReason:'추천 시스템의 원리를 이해하는 데 도움이 되는 주제이기 때문에 추천합니다.',
  keyPoints:[
    '알고리즘은 문제를 해결하기 위한 단계적 절차입니다.',
    '알고리즘의 활용은 기술과 일상생활의 여러 부분에 나타납니다.',
    '추천 서비스도 특정 기준을 활용해 자료를 선택할 수 있습니다.'
  ],
  sections:[
    {heading:'알고리즘의 정의',body:'알고리즘은 문제를 해결하기 위한 정해진 절차입니다. 여러 단계로 이루어진 처리 과정을 통해 컴퓨터는 입력된 정보를 이용할 수 있습니다.'},
    {heading:'일상 속의 알고리즘',body:'알고리즘은 검색 결과 정렬이나 콘텐츠 추천 같은 분야에서도 활용될 수 있습니다. 다만 어떤 자료를 추천할지는 실제 시스템의 목표와 기준에 따라 달라집니다.'}
  ]
};

(async()=>{
 const browser=await chromium.launch({headless:true,
   ...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{}),
   args:['--no-sandbox']});
 const context=await browser.newContext({acceptDownloads:true});
 const page=await context.newPage();
 const errors=[],external=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/*', route=>{
   const u=new URL(route.request().url());
   if(u.origin!==ORIGIN){external.push(u.href);return route.abort();}
   return route.continue();
 });
 try{
   await page.goto(ORIGIN+'/tools/card-studio-v3.html');
   assert.match(await page.locator('#serverStatus').textContent(),/유료 API 사용 안 함/);
   assert.equal(await page.locator('#generateDraft').isHidden(),true);
   console.log('PASS: static Work editor opens without AI API server');

   page.on('dialog',dialog=>{
     if(dialog.type()==='prompt')dialog.accept(WIKI_URL);
     else dialog.accept();
   });
   await page.locator('#createNewCandidate').click();
   assert.match(await page.locator('#counts').textContent(),/1개 후보/);
   assert.equal(await page.locator('#approve').isDisabled(),true);
   assert((await page.locator('#workPrompt').inputValue()).includes('위키백과'));
   console.log('PASS: source-only draft and ready-to-copy Work instruction');

   await page.locator('#cardJson').fill(JSON.stringify(work));
   await page.locator('#fillJson').click();
   assert.equal(await page.locator('#title').inputValue(),work.title);
   assert.equal(await page.locator('#point0').inputValue(),work.keyPoints[0]);
   assert.equal(await page.locator('.content-section').count(),2);
   assert.equal(await page.locator('#originalUrl').inputValue(),WIKI_URL);
   assert.equal(await page.locator('#approve').isDisabled(),true);
   console.log('PASS: one-paste JSON fills card without altering original URL or auto approving');

   await page.locator('#imageUrl').fill('https://example.org/test-cover.png');
   await page.locator('#imageCredit').fill('제작자가 직접 만든 이미지 · 사용 조건 검토 완료');
   for(const checkbox of ['linkChecked','contentChecked','rightsChecked'])
     await page.locator('#'+checkbox).check();
   assert.equal(await page.locator('#approve').isEnabled(),true);
   await page.locator('#approve').click();
   assert.match(await page.locator('#counts').textContent(),/1개 승인/);
   console.log('PASS: human review required for approval');

   const downloadReady=page.waitForEvent('download');
   await page.locator('#exportCards').click();
   const download=await downloadReady;
   const cards=JSON.parse(await fs.readFile(await download.path(),'utf8'));
   assert.equal(cards.length,1);
   assert.equal(cards[0].keyPoints.length,3);
   assert.equal(cards[0].sections.length,2);
   assert.equal(cards[0].url,WIKI_URL);
   console.log('PASS: approved website JSON export');

   await page.reload();
   assert.match(await page.locator('#counts').textContent(),/1개 승인/);
   await page.locator('#title').fill('수정한 카드 제목을 다시 검토합니다');
   assert.match(await page.locator('#counts').textContent(),/0개 승인/);
   assert.equal(await page.locator('#approve').isDisabled(),true);
   console.log('PASS: browser draft storage and approval reset after edits');
   assert.deepEqual(errors,[]);
   assert(external.every(x=>!x.includes('api.openai.com')));
 }finally{await browser.close();}
})().catch(err=>{console.error(err);process.exitCode=1;});
