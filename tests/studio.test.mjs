import test from 'node:test';
import assert from 'node:assert/strict';
import {fromCsv,studioIssues,toApprovedStudioCard,approvedStudioCards,applyAiDraft} from '../tools/studio-core.js';
import {importCandidates} from '../tools/content-admin-core.js';

const HEADERS=['분야1','분야2','형태','제목','원본제목','소개','분야연결근거',
  '추천이유','원본URL','출처','썸네일URL','링크검증','개발반영상태','저장일'];
const values=['기술','문화','기사','추천 알고리즘은 왜 중요할까?','추천 시스템',
  '추천 기술이 데이터를 처리하는 과정을 이해하기 위해 설계한 소개 콘텐츠입니다.',
  '기술: 알고리즘 연결','',
  'https://ko.wikipedia.org/wiki/추천_시스템','한국어 위키백과','','미확인','미확인','2026-10-29'];
const csv=[HEADERS,values].map(a=>a.map(v=>'"'+v.replaceAll('"','""')+'"').join(',')).join('\r\n');

function validItem(){
  const [item]=fromCsv(csv,[]);
  Object.assign(item,{
    recommendationReason:'추천 시스템의 기본 개념을 탐구하는 사용자에게 도움이 되는 읽을거리입니다.',
    imageUrl:'https://upload.wikimedia.org/test.png',imageCredit:'Wikimedia Commons · 출처 및 라이선스 확인',linkChecked:true,rightsChecked:true,
    contentChecked:true,
    keyPoints:[
      '추천 시스템은 데이터를 이용해 콘텐츠를 분류하고 사용자에게 제시합니다.',
      '기본적인 알고리즘 개념을 이해하는 데 도움이 될 수 있습니다.',
      '추천 결과를 선택하는 사용자 통제권에 대한 생각을 확장할 수 있습니다.'
    ],
    sections:[{heading:'추천 시스템의 목적',body:'정보를 발견하고 탐색하는 과정을 돕기 위해 추천 시스템을 구성합니다. 원문에 나타난 개념들을 사용자가 쉽게 이해할 수 있도록 소개합니다.'},
      {heading:'추천이 이루어지는 과정',body:'데이터를 입력받아 정해진 규칙에 따라 관련 콘텐츠를 정렬하는 과정을 다룹니다. 사용자에게 제시되는 결과와 선택 기준을 함께 생각합니다.'}],
    status:'승인'
  });
  return item;
}
test('CSV candidates enter studio as editable drafts with no approvals',()=>{
  const items=fromCsv(csv,[]);
  assert.equal(items.length,1);
  assert.deepEqual(items[0].keyPoints,['','','']);
  assert.equal(items[0].sections.length,2);
  assert.equal(items[0].status,'대기');
  assert(studioIssues(items[0]).length>0);
});
test('article reader requires 3 key points and at least 2 complete sections',()=>{
  const item=validItem();
  assert.deepEqual(studioIssues(item),[]);
  item.keyPoints[1]='짧음';
  assert(studioIssues(item).some(x=>x.includes('핵심 요약')));
  item.keyPoints[1]='기본적인 알고리즘 개념을 이해하는 데 도움이 될 수 있습니다.';
  item.sections[0].body='짧음';
  assert(studioIssues(item).some(x=>x.includes('본문')));
});
test('approved output matches existing article reader data shape',()=>{
  const item=validItem();
  const card=toApprovedStudioCard(item);
  assert.equal(card.keyPoints.length,3);
  assert.equal(card.sections.length,2);
  assert.equal(card.secondaryCategory,'culture');
  assert.equal(card.source,'한국어 위키백과');
  assert.equal(approvedStudioCards([item]).length,1);
});
test('AI draft fills fields but resets human fact checking and approval',()=>{
  const item=validItem();
  const draft={title:'추천 시스템의 작동 원리를 쉽게 이해하는 방법',
    summary:'AI는 데이터를 바탕으로 어떤 추천이 적절한지 계산하고 사용자에게 관련 자료를 제공하도록 구성됩니다.',
    recommendationReason:'추천 기술의 원리를 이해하고 싶은 사람에게 추천할 수 있습니다.',
    keyPoints:['추천 시스템은 데이터를 처리합니다.','관심 분야와 관련된 자료를 보여 줍니다.','시스템은 사용자의 선택에 영향을 줍니다.'],
    sections:[{heading:'시스템의 원리',body:'추천 시스템은 다양한 데이터를 분석해서 사용자에게 관련 정보를 제시합니다. 원문에 언급된 처리 방식과 한계를 살펴볼 수 있습니다.'},
      {heading:'이용자 관점',body:'사용자는 추천되는 정보만 읽는 대신 관심도를 조절하고 자신이 원하는 콘텐츠를 선택할 수 있습니다. 정보 탐색의 주도성을 생각해 봅니다.'}]};
  const result=applyAiDraft(item,draft,{title:'추천 시스템',url:item.url});
  assert.equal(result.status,'검토중');
  assert.equal(result.contentChecked,false);
  assert.equal(result.linkChecked,false);
  assert.equal(result.keyPoints.length,3);
  assert.equal(item.title,'추천 알고리즘은 왜 중요할까?');
});
test('local AI image cannot be approved until permanent hosted URL exists',()=>{
  const item=validItem();
  item.imageUrl='/studio-generated/test.png';item.imagePending=true;
  assert(studioIssues(item).some(x=>x.includes('영구 HTTPS')));
  assert.throws(()=>toApprovedStudioCard(item),/승인 전/);
});
test('unapproved drafts are never exported',()=>{
  const item=validItem();item.status='검토중';
  assert.deepEqual(approvedStudioCards([item]),[]);
});
test('existing V1 CSV importer still reads the same input',()=>{
  assert.equal(importCandidates(csv,[]).length,1);
});
