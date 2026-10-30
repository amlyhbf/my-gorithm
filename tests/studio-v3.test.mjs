import test from 'node:test';
import assert from 'node:assert/strict';
import {parseWorkJson,applyWorkDraft,workInstruction,newCandidate,wikipediaImage} from '../tools/studio-work-import.js';
import {studioIssues,toApprovedStudioCard} from '../tools/studio-core.js';

const work={
  title:'알고리즘이 우리에게 새로운 콘텐츠를 추천하는 방법',
  summary:'알고리즘이 어떤 정보를 추천할지 결정하는 과정을 소개하고, 사용자 선택에 따라서 다른 결과가 제시될 수 있는 이유를 설명합니다.',
  recommendationReason:'추천 시스템의 작동 원리를 이해하는 데 도움을 줄 수 있기 때문입니다.',
  keyPoints:['알고리즘은 정해진 단계에 따라 데이터를 처리합니다.',
    '추천 시스템은 관련 자료를 선택하는 데 규칙을 활용합니다.',
    '사용자가 관심도를 조정하면 보여지는 콘텐츠가 달라질 수 있습니다.'],
  sections:[
    {heading:'알고리즘의 기본 개념',
      body:'알고리즘은 정해진 문제를 해결하기 위한 단계별 방법입니다. 정보를 분류하거나 추천 후보를 선택하는 과정에서도 알고리즘을 사용할 수 있습니다.'},
    {heading:'추천에서 알고리즘이 하는 역할',
      body:'추천 시스템은 사용자 관심 분야와 콘텐츠의 관련성을 고려해 자료를 보여줍니다. 어떤 기준을 사용하느냐에 따라 사용자에게 제시되는 콘텐츠가 달라집니다.'}
  ]
};
const link='https://ko.wikipedia.org/wiki/%EC%95%8C%EA%B3%A0%EB%A6%AC%EC%A6%98';

test('Work JSON accepts object, fenced JSON and wrapped card form',()=>{
  assert.deepEqual(parseWorkJson(JSON.stringify(work)),work);
  const fence=String.fromCharCode(96).repeat(3);
  assert.deepEqual(parseWorkJson(fence+'json\n'+JSON.stringify(work)+'\n'+fence),work);
  assert.deepEqual(parseWorkJson(JSON.stringify({card:work})),work);
});
test('Work JSON rejects executable code, invalid fields and large payload',()=>{
  assert.throws(()=>parseWorkJson('const a = 1'),/JSON 형식/);
  assert.throws(()=>parseWorkJson(JSON.stringify({...work,keyPoints:['하나']})),/정확히 3개/);
  assert.throws(()=>parseWorkJson(JSON.stringify({...work,sections:[{heading:'하나',body:'짧음'}]})),/2~8개/);
  assert.throws(()=>parseWorkJson('x'.repeat(70000)),/65KB/);
});
test('Work import leaves original URL, image, source and approval under human control',()=>{
  const item=newCandidate(link,[],[]);
  Object.assign(item,{imageUrl:'https://upload.wikimedia.org/example.jpg',
    imageCredit:'저작자 확인',source:'한국어 위키백과',status:'승인',
    contentChecked:true,linkChecked:true,rightsChecked:true});
  const injected={...work,url:'https://attacker.example',status:'승인',
    source:'신뢰 불명',imageUrl:'https://attacker.example/tracker.png',rightsChecked:true};
  const next=applyWorkDraft(item,JSON.stringify(injected));
  assert.equal(next.url,item.url);
  assert.equal(next.imageUrl,item.imageUrl);
  assert.equal(next.source,item.source);
  assert.equal(next.rightsChecked,true);
  assert.equal(next.status,'검토중');
  assert.equal(next.contentChecked,false);
  assert.equal(next.keyPoints.length,3);
  assert.equal(item.title,'알고리즘');
});
test('new article candidate and Work prompt preserve link, no auto approve',()=>{
  const item=newCandidate(link,[],[]);
  assert.equal(item.type,'article');
  assert.equal(item.status,'대기');
  const instruction=workInstruction(item,'https://card-studio.example/tools/card-studio-v3.html');
  assert(instruction.includes(item.url));
  assert(instruction.includes('JSON'));
  assert(instruction.includes('자동 승인하지'));
  assert.throws(()=>newCandidate(link,[item],[]),/이미 등록된/);
  assert.throws(()=>newCandidate('https://evil.example/wiki/a',[],[]),/위키백과/);
});
test('approved output requires human verification and licensed image metadata',()=>{
  const item=applyWorkDraft(newCandidate(link,[],[]),JSON.stringify(work));
  assert(studioIssues(item).length>0);
  Object.assign(item,{
    imageUrl:'https://upload.wikimedia.org/commons/example.png',
    imageCredit:'Wikimedia Commons 출처·저작자·라이선스 직접 확인',
    rightsChecked:true,contentChecked:true,linkChecked:true,status:'승인'
  });
  assert.deepEqual(studioIssues(item),[]);
  const approved=toApprovedStudioCard(item);
  assert.equal(approved.keyPoints.length,3);
  assert.equal(approved.sections.length,2);
});
test('browser wiki image helper uses CORS origin and rejects unexpected URLs',async()=>{
  let requested='';
  const mock=async url=>{
    requested=url;
    return {ok:true,json:async()=>({query:{pages:[{title:'알고리즘',
      original:{source:'https://upload.wikimedia.org/commons/a/ab/figure.png'}}]}})};
  };
  const wiki=await wikipediaImage(link,mock);
  assert.equal(wiki.title,'알고리즘');
  assert(wiki.imageUrl.includes('upload.wikimedia.org'));
  assert(requested.includes('origin=*')||requested.includes('origin=%2A'));
  await assert.rejects(()=>wikipediaImage('https://malicious.com/data',mock),/위키백과/);
});
