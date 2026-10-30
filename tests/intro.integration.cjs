// Run npm run dev in another terminal, then npm run test:intro.
// All nonlocal requests are blocked, including production Firebase.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require('playwright');
const BASE = process.env.TEST_BASE_URL || 'http://127.0.0.1:5173';
const SHOTS = 'docs/intro-web-integration/screenshots';
const K = { seen:'mamgorithm_intro_seen_v1', onboard:'mamgorithm_onboarded_v2', coach:'mamgorithm_coachmark_seen', weights:'mamgorithm_weights_v2', saved:'mamgorithm_saved_v2', theme:'mamgorithm_theme_v2' };
const results=[];
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{}),args:['--no-sandbox']});
 async function session({storage={},mobile=false,reduced=false,denyPlay=false,broken=false,posterBroken=false,blockedStorage=false,stall=false}={}) {
  const ctx=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1440,height:900},hasTouch:mobile,isMobile:mobile,reducedMotion:reduced?'reduce':'no-preference'});
  await ctx.route('**/*',r=>new URL(r.request().url()).origin===new URL(BASE).origin?r.continue():r.abort());
  if(broken)await ctx.route('**/intro/*.mp4',r=>r.abort());
  if(posterBroken)await ctx.route('**/intro/*.png',r=>r.abort());
  await ctx.addInitScript(({storage,denyPlay,blockedStorage,stall})=>{
    if(!sessionStorage.seeded){for(const [k,v] of Object.entries(storage))localStorage.setItem(k,v);sessionStorage.seeded='1';}
    if(denyPlay)HTMLMediaElement.prototype.play=()=>Promise.reject(new DOMException('Blocked','NotAllowedError'));
    if(stall)HTMLMediaElement.prototype.play=()=>new Promise(()=>{});
    if(blockedStorage){Storage.prototype.getItem=()=>{throw new DOMException('Blocked','SecurityError')};Storage.prototype.setItem=()=>{throw new DOMException('Blocked','SecurityError')};}
  },{storage,denyPlay,blockedStorage,stall});
  const p=await ctx.newPage(); const errors=[];const mp4=[];
  p.on('pageerror',e=>errors.push(e.message));p.on('request',r=>{if(r.url().endsWith('.mp4'))mp4.push(r.url());});
  return {ctx,p,errors,mp4};
 }
 async function test(name,fn){try{await fn();results.push({name,status:'PASS'});console.log('PASS',name);}catch(e){results.push({name,status:'FAIL',error:e.stack});console.error('FAIL',name,e.message);}}
 async function opacity(p){return p.locator('.intro-skip').evaluate(e=>Number(getComputedStyle(e).opacity));}
 async function brand(p){await p.locator('.intro-start').waitFor({state:'visible',timeout:40000});}
 async function hiddenOnboard(p){assert(await p.locator('#onboardingOverlay').evaluate(e=>e.classList.contains('hidden')));}
 async function shot(p,name){await p.screenshot({path:`${SHOTS}/${name}.png`});}
 fs.mkdirSync(SHOTS,{recursive:true});
 await test('mobile: real 16s light playback → final poster → unchanged onboarding → 12 cards → revisit',async()=>{
  const {ctx,p,mp4,errors}=await session({mobile:true});await p.goto(BASE);await p.locator('.intro-dialog.is-playing').waitFor();
  assert.equal(await opacity(p),0);await hiddenOnboard(p);
  const attrs=await p.locator('.intro-video').evaluate(v=>({muted:v.muted,inline:v.playsInline,controls:v.controls,loop:v.loop}));
  assert.deepEqual(attrs,{muted:true,inline:true,controls:false,loop:false});
  await p.waitForFunction(()=>document.querySelector('.intro-video').currentTime>1);
  await shot(p,'mobile-playing');await brand(p);
  const v=await p.locator('.intro-video').evaluate(v=>({ended:v.ended,time:v.currentTime,duration:v.duration}));
  assert(v.ended);assert.equal(v.duration,16);assert(v.time>=15.9);
  await shot(p,'mobile-final');await p.waitForTimeout(300);assert.equal(await p.locator('.intro-video').evaluate(v=>v.currentTime),v.time);
  assert(mp4.length>0 && mp4.every(u=>u.endsWith('intro-v4-4-light.mp4')));
  assert.equal(await p.evaluate(k=>localStorage.getItem(k),K.onboard),null);
  await p.locator('.intro-start').click();await p.locator('#onboardingOverlay').waitFor({state:'visible'});
  assert.deepEqual(await p.locator('.onboarding-range-input').evaluateAll(es=>es.map(e=>e.value)),['50','50','50','50']);
  await shot(p,'mobile-onboarding');await p.locator('#btnOnboardingStart').click();
  await p.locator('#btnCoachmarkSkip').click();await p.waitForTimeout(500);
  assert.equal(await p.locator('#feedCardsList .content-feed-card').count(),12);
  await shot(p,'mobile-feed');await p.reload();await p.waitForTimeout(500);
  assert.equal(await p.locator('.intro-dialog').count(),0);await hiddenOnboard(p);assert.deepEqual(errors,[]);await ctx.close();
 });
 await test('touch: first tap reveals only; 1.8s hide; repeated taps reset; actual skip opens onboarding',async()=>{
  const {ctx,p}=await session({mobile:true});await p.goto(BASE);await p.locator('.intro-dialog.is-playing').waitFor();
  await p.touchscreen.tap(180,250);await p.waitForTimeout(200);assert.equal(await opacity(p),1);assert.equal(await p.locator('.intro-dialog').count(),1);
  await p.waitForTimeout(900);await p.touchscreen.tap(180,250);await p.waitForTimeout(1100);assert.equal(await opacity(p),1);
  await p.waitForTimeout(1050);assert.equal(await opacity(p),0);await p.touchscreen.tap(180,250);await p.waitForTimeout(200);assert.equal(await opacity(p),1);
  await p.locator('.intro-skip').tap();await p.locator('#onboardingOverlay').waitFor({state:'visible'});assert.equal(await p.evaluate(k=>localStorage.getItem(k),K.onboard),null);await ctx.close();
 });
 await test('keyboard and hover keep skip visible; focus isolated; refresh bypasses repeat',async()=>{
  const {ctx,p}=await session();await p.goto(BASE);await p.locator('.intro-dialog').waitFor();
  await p.keyboard.press('Tab');assert.equal(await p.locator('.intro-skip').evaluate(e=>e===document.activeElement),true);
  await p.waitForTimeout(2200);assert.equal(await opacity(p),1);await p.keyboard.press('Shift+Tab');
  assert(await p.evaluate(()=>document.activeElement.closest('dialog')!==null || document.activeElement===document.body));
  await p.mouse.move(300,80);await p.locator('.intro-skip').hover();await p.waitForTimeout(2200);assert.equal(await opacity(p),1);
  await shot(p,'desktop-skip');await p.reload();await p.locator('#onboardingOverlay').waitFor({state:'visible'});assert.equal(await p.locator('.intro-dialog').count(),0);await ctx.close();
 });
 await test('dark: real playback completes; replay restores settings, focus, scroll; presets/bookmarks/shuffle/theme remain usable',async()=>{
  const weights=JSON.stringify({study:80,tech:35,culture:20,hobby:65});
  const {ctx,p,mp4}=await session({storage:{[K.seen]:'true',[K.onboard]:'true',[K.coach]:'true',[K.weights]:weights,[K.theme]:'dark'}});
  await p.goto(BASE);await p.waitForTimeout(600);
  const bookmark=p.locator('#feedCardsList .card-bookmark-btn').first();await bookmark.click();const saved=await p.evaluate(k=>localStorage.getItem(k),K.saved);assert(saved);
  await p.locator('#btnShuffle').click();await p.waitForTimeout(500);assert.equal(await p.locator('#feedCardsList .content-feed-card').count(),12);
  await p.locator('[data-tab="viewStats"]').click();await p.locator('#btnReplayIntro').focus();await p.waitForTimeout(300);
  const scroll=await p.evaluate(()=>scrollY);await p.locator('#btnReplayIntro').click();await p.locator('.intro-dialog.is-playing').waitFor();await brand(p);
  assert(await p.locator('.intro-video').evaluate(v=>v.ended));await shot(p,'desktop-dark-final');assert(mp4.every(u=>u.endsWith('intro-v4-4-dark.mp4')));
  await p.locator('.intro-start').click();assert.equal(await p.locator('.intro-dialog').count(),0);await hiddenOnboard(p);
  assert.equal(await p.evaluate(()=>document.activeElement.id),'btnReplayIntro');assert.equal(await p.evaluate(()=>scrollY),scroll);
  assert.equal(await p.evaluate(k=>localStorage.getItem(k),K.weights),weights);assert.equal(await p.evaluate(k=>localStorage.getItem(k),K.saved),saved);
  await p.locator('#btnReplayIntro').click();await p.keyboard.press('Tab');await p.keyboard.press('Enter');await hiddenOnboard(p);
  await p.locator('#btnReopenOnboarding').click();assert.deepEqual(await p.locator('.onboarding-range-input').evaluateAll(es=>es.map(e=>e.value)),['80','35','20','65']);
  await p.locator('#onboardingPresetRow button').first().click();await p.locator('#btnOnboardingStart').click();await p.locator('#btnThemeToggle').click();assert.equal(await p.evaluate(k=>localStorage.getItem(k),K.theme),'light');await ctx.close();
 });
 for(const mode of ['reduced','denyPlay','broken','stall'])await test(`${mode}: static brand and working start button`,async()=>{
  const {ctx,p,mp4}=await session({[mode]:true});await p.goto(BASE);await brand(p);
  if(mode==='reduced')assert.equal(mp4.length,0);
  if(mode==='stall')assert.equal(await p.locator('.intro-video').evaluate(v=>v.currentTime),0);
  await p.locator('.intro-start').click();await p.locator('#onboardingOverlay').waitFor({state:'visible'});await ctx.close();
 });
 await test('shared recipe stays intact through intro and onboarding',async()=>{
  const {ctx,p}=await session({reduced:true});await p.goto(BASE+'/?s=80&t=35&c=20&h=65');await brand(p);await p.locator('.intro-start').click();
  assert.deepEqual(await p.locator('.onboarding-range-input').evaluateAll(es=>es.map(e=>e.value)),['80','35','20','65']);await p.locator('#btnOnboardingStart').click();
  assert.deepEqual(JSON.parse(await p.evaluate(k=>localStorage.getItem(k),K.weights)),{study:80,tech:35,culture:20,hobby:65});assert(p.url().includes('?s=80&t=35&c=20&h=65'));await ctx.close();
 });
 await test('poster failure, blocked storage and reduced motion still offer a usable entry',async()=>{
  const {ctx,p,errors}=await session({reduced:true,posterBroken:true,blockedStorage:true});await p.goto(BASE);await brand(p);await p.waitForTimeout(100);
  assert(await p.locator('.intro-poster').evaluate(e=>e.hidden));await p.locator('.intro-start').click();await p.locator('#onboardingOverlay').waitFor({state:'visible'});assert.deepEqual(errors,[]);await ctx.close();
 });
 await test('small landscape viewport keeps complete portrait and CTA in viewport',async()=>{
  const {ctx,p}=await session({reduced:true});await p.setViewportSize({width:844,height:390});await p.goto(BASE);await brand(p);
  const stage=await p.locator('.intro-stage').boundingBox(),cta=await p.locator('.intro-start').boundingBox();assert(Math.abs(stage.width/stage.height-9/16)<.01);assert(cta.y>=0 && cta.y+cta.height<=390);await shot(p,'landscape-final');await ctx.close();
 });
 await browser.close();fs.writeFileSync('docs/intro-web-integration/test-results.json',JSON.stringify({browser:'Chromium',results},null,2)+'\n');
 if(results.some(r=>r.status==='FAIL'))process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1});
