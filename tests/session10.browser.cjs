// 10회차 피드백 회귀 테스트. Vite 서버를 별도 실행한 후
// npm run test:session10:browser 로 실행합니다. 운영 사이트를 수정하지 않습니다.
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const BASE=process.env.TEST_BASE_URL||'http://127.0.0.1:5173';

(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox'],
   ...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})});
 const context=await browser.newContext({viewport:{width:390,height:844}});
 const origin=new URL(BASE).origin;
 await context.route('**/*',route=>{
   const target=new URL(route.request().url());
   return target.origin===origin?route.continue():route.abort();
 });
 await context.addInitScript(()=>{
   localStorage.setItem('mamgorithm_intro_seen_v1','true');
   localStorage.setItem('mamgorithm_onboarded_v2','true');
   localStorage.setItem('mamgorithm_coachmark_seen','true');
 });
 const page=await context.newPage();
 const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 const setRange=(selector,value)=>page.locator(selector).evaluate((el,next)=>{
   el.value=String(next);el.dispatchEvent(new Event('input',{bubbles:true}));
 },value);
 const isFeed=()=>page.locator('#viewFeed').evaluate(el=>el.classList.contains('active'));
 try{
   await page.goto(BASE);
   await page.waitForSelector('#feedCardsList .content-feed-card');
   await page.locator('#dockPeekBar').click();
   const dock=page.locator('.dock-range-input[data-cat="tech"]');
   assert.equal(await dock.getAttribute('step'),'1');
   await setRange('.dock-range-input[data-cat="tech"]',43);
   assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('mamgorithm_weights_v2')).tech),43);
   await setRange('.dock-range-input[data-cat="tech"]',38);
   assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('mamgorithm_weights_v2')).tech),38);
   await page.locator('#btnApplyDockMixer').click();
   await page.reload();
   await page.locator('#dockPeekBar').click();
   assert.equal(await page.locator('.dock-range-input[data-cat="tech"]').inputValue(),'38');
   console.log('PASS S10-01: 43 → 38 preserved across reload');

   await page.locator('#btnApplyDockMixer').click();
   await page.locator('.tab-btn[data-tab="viewStats"]').click();
   await page.locator('#btnReopenOnboarding').click();
   assert.equal(await isFeed(),true);
   assert.equal(await page.locator('#onboardingOverlay').isVisible(),true);
   assert.equal(await page.locator('.onboarding-range-input').first().getAttribute('step'),'1');
   await setRange('.onboarding-range-input[data-cat="study"]',43);
   await page.locator('#btnOnboardingStart').click();
   assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('mamgorithm_weights_v2')).study),43);
   console.log('PASS S10-02: onboarding starts on home; S10-01 applies to onboarding');

   await page.locator('.tab-btn[data-tab="viewStats"]').click();
   await page.locator('#btnReplayCoachmark').click();
   assert.equal(await isFeed(),true);
   assert.equal(await page.locator('#coachmarkOverlay').isVisible(),true);
   await page.locator('#btnCoachmarkSkip').click();
   console.log('PASS S10-02: replay tutorial starts on home');

   await page.locator('.tab-btn[data-tab="viewStats"]').click();
   await page.locator('#btnReplayIntro').click();
   assert.equal(await isFeed(),true);
   await page.locator('.intro-dialog').waitFor({state:'visible'});
   // Simulate video end without waiting 16s: V4.4 first-visit CTA remains unchanged.
   await page.locator('.intro-video').evaluate(el=>el.dispatchEvent(new Event('ended')));
   await page.locator('.intro-dialog').waitFor({state:'detached'});
   assert.equal(await isFeed(),true);
   console.log('PASS S10-02: replay intro returns automatically to home');

   const cards=page.locator('#feedCardsList .content-feed-card');
   assert((await cards.count())>0);
   const report=await cards.first().evaluate(card=>{
     const badge=card.querySelector('.card-tag-overlay');
     const label=badge.querySelector('.card-tag-category');
     return {
       category:label?.textContent?.trim(),
       color:card.style.getPropertyValue('--card-category-color').trim(),
       rail:parseFloat(getComputedStyle(card).borderInlineStartWidth),
       size:parseFloat(getComputedStyle(label).fontSize),
       badgeColor:getComputedStyle(badge).backgroundColor,
       aria:badge.getAttribute('aria-label')
     };
   });
   assert(['공부','기술','문화','취미'].includes(report.category));
   assert.match(report.color,/^#/);
   assert(report.rail>=5);
   assert(report.size>=13);
   assert(report.aria.includes('분야:'));
   console.log('PASS S10-03: prominent text badge plus established category color strip');
   assert.deepEqual(errors,[]);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
