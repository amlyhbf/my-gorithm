import test from 'node:test';
import assert from 'node:assert/strict';
import { parseCsv, importCandidates, validateCandidate, toWebsiteCard,
  approvedCards, exportReviewCsv } from '../tools/content-admin-core.js';
import { mergeDataSource, validateApprovedPayload } from '../tools/merge-approved-content.mjs';

const headers = [
  '분야1','분야2','형태','제목','원본제목','소개','분야연결근거',
  '추천이유','원본URL','출처','썸네일URL','링크검증','개발반영상태','저장일'
];
function row(url, title, reason = '') {
  return [
    '기술','문화','기사',title,'원래 문서',
    '여기는 원문을 바탕으로 팀원이 재작성한 콘텐츠 요약입니다. 추가 설명입니다.',
    '기술 / 문화 연결',reason,url,'한국어 위키백과','','미확인','미확인','2026-10-29'
  ];
}
const csv = '\uFEFF' + headers.map(x => '"' + x + '"').join(',') + '\r\n' +
  [row('https://ko.wikipedia.org/wiki/%EC%95%8C%EA%B3%A0%EB%A6%AC%EC%A6%98','알고리즘 소개'),
   row('https://ko.wikipedia.org/wiki/컴퓨터_비전','"인용" 및 쉼표, 있는 제목')]
  .map(values => values.map(x => '"' + x.replace(/"/g,'""') + '"').join(',')).join('\r\n');

test('UTF-8 BOM, quote, comma and multi-line CSV parsing', () => {
  const rows = parseCsv(csv);
  assert.equal(rows.length, 2);
  assert.equal(rows[1]['제목'], '"인용" 및 쉼표, 있는 제목');
  const multiline = '"분야1","분야2","형태","제목","원본제목","소개","분야연결근거","추천이유","원본URL","출처","썸네일URL","링크검증","개발반영상태","저장일"\n' +
    row('https://ko.wikipedia.org/wiki/컴퓨터_비전','테스트').map((x,i) => '"'+ (i===5?'첫 줄\n둘째 줄':x).replace(/"/g,'""')+'"').join(',');
  assert.equal(parseCsv(multiline)[0]['소개'], '첫 줄\n둘째 줄');
});
test('missing headers and malformed CSV are rejected', () => {
  assert.throws(() => parseCsv('제목,원본URL\n제목,https://example.com'),/누락된 열/);
  assert.throws(() => parseCsv(csv + '\r\n"broken'),/닫히지 않은/);
});
test('import maps categories and catches decoded URL duplicates', () => {
  const old = [{ id:'tech-1', url:'https://ko.wikipedia.org/wiki/알고리즘',title:'다른 제목' }];
  const items = importCandidates(csv, old);
  assert.equal(items.length, 2);
  assert.deepEqual([items[0].category,items[0].secondaryCategory,items[0].type],['tech','culture','article']);
  assert(items[0].duplicates.includes('기존 카드와 URL 중복'));
  assert.equal(items[0].status,'대기');
});
test('approval requires link, source, review, reason, rights and thumbnail', () => {
  const [item] = importCandidates(csv);
  assert(validateCandidate(item).length >= 5);
  Object.assign(item, {
    recommendationReason:'관심 분야를 이해하는 데 필요한 원리를 설명합니다.',
    imageUrl:'https://images.example.com/thumb.png',
    linkChecked:true,contentChecked:true,rightsChecked:true,status:'승인'
  });
  assert.deepEqual(validateCandidate(item), []);
  const card = toWebsiteCard(item);
  assert.equal(card.category,'tech');
  assert.equal(card.secondaryCategory,'culture');
  assert.equal(card.recommendationReason,item.recommendationReason);
  assert.match(card.id,/^curated-tech-/);
});
test('approval must not be bypassed by a status field or dangerous URL', () => {
  const [item] = importCandidates(csv);
  item.status='승인';
  assert.throws(() => toWebsiteCard(item),/승인되지/);
  item.url='javascript:alert(1)';
  item.imageUrl='javascript:alert(1)';
  assert(validateCandidate(item).includes('HTTPS 원본 URL 필요'));
  assert(validateCandidate(item).includes('HTTPS 썸네일 URL 필요'));
});
test('review export roundtrip preserves checked flags only when still valid', () => {
  const [item] = importCandidates(csv);
  Object.assign(item,{
    recommendationReason:'이 분야의 개념을 이해하고 싶은 사용자에게 추천합니다.',
    imageUrl:'https://images.example.com/cover.png',
    imageCredit:'직접 제작한 이미지',
    linkChecked:true,contentChecked:true,rightsChecked:true,status:'승인'
  });
  const reviewCsv=exportReviewCsv([item]);
  const restored=importCandidates(reviewCsv);
  assert.equal(restored[0].status,'승인');
  assert.equal(restored[0].imageCredit,'직접 제작한 이미지');
  assert.deepEqual(validateCandidate(restored[0]),[]);
  const damaged = reviewCsv.replace('직접 제작한 이미지','');
  assert.equal(importCandidates(damaged)[0].status,'승인'); // credit memo optional.
});
test('approved payload merge is explicit and rejects source collisions', () => {
  const [item] = importCandidates(csv);
  Object.assign(item,{
    recommendationReason:'기초 원리 이해에 도움이 되는 정보를 제공합니다.',
    imageUrl:'https://images.example.com/cover.png',
    linkChecked:true,contentChecked:true,rightsChecked:true,status:'승인'
  });
  const cards=approvedCards([item]);
  assert.equal(validateApprovedPayload(cards, []),cards);
  const source='export const CONTENT_DATA = [\n  { id:"old" }\n];\n\nexport const PRESET_MODES = [];';
  const merged = mergeDataSource(source,cards);
  assert(merged.includes(cards[0].id));
  assert(merged.includes('id:"old"'));
  assert.throws(() => validateApprovedPayload(cards,[{...cards[0]}]),/ID 중복/);
  assert.throws(() => mergeDataSource('const x = 1;',cards),/구조/);
});
