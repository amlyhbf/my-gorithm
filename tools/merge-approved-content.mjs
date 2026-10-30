#!/usr/bin/env node
// Developer-only tool: merge a team-approved JSON export into a preview copy
// of data.js. Requires --apply to alter the actual source file.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CONTENT_DATA } from '../data.js';
import { canonicalUrl } from './content-admin-core.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataFile = path.join(root, 'data.js');

export function validateApprovedPayload(cards, current = CONTENT_DATA) {
  if (!Array.isArray(cards) || !cards.length) throw new Error('승인된 카드 JSON 배열이 필요합니다.');
  if (cards.length > 500) throw new Error('한 번에 최대 500개까지 검토하세요.');
  const oldIds = new Set(current.map(x => x.id));
  const oldTitles = new Set(current.map(x => x.title.trim().toLowerCase()));
  const oldUrls = new Set(current.map(x => canonicalUrl(x.url)));
  const newIds = new Set(), newUrls = new Set();
  for (const card of cards) {
    if (!card || typeof card !== 'object') throw new Error('카드 형식이 올바르지 않습니다.');
    if (!/^(study|tech|culture|hobby)$/.test(card.category)) throw new Error('분야 오류: ' + card.id);
    if (!/^(video|article)$/.test(card.type)) throw new Error('형태 오류: ' + card.id);
    if (!/^[a-z0-9-]{5,100}$/.test(card.id || '')) throw new Error('카드 ID 오류');
    for (const key of ['title', 'summary', 'recommendationReason', 'source', 'imageUrl', 'url']) {
      if (typeof card[key] !== 'string' || !card[key].trim()) throw new Error(card.id + ': ' + key + ' 누락');
    }
    if (!card.url.startsWith('https://') || !canonicalUrl(card.url)) throw new Error(card.id + ': 원본 HTTPS 링크 필요');
    if (!card.imageUrl.startsWith('https://') || !canonicalUrl(card.imageUrl)) throw new Error(card.id + ': 썸네일 HTTPS 링크 필요');
    if ([card.title, card.summary, card.recommendationReason, card.source].some(v => /[<>]/.test(v)) ||
        /"/.test(card.title)) throw new Error(card.id + ': HTML 삽입 위험이 있는 문자열');
    const url = canonicalUrl(card.url);
    if (oldIds.has(card.id) || newIds.has(card.id)) throw new Error(card.id + ': ID 중복');
    if (oldUrls.has(url) || newUrls.has(url)) throw new Error(card.id + ': URL 중복');
    if (oldTitles.has(card.title.trim().toLowerCase())) throw new Error(card.id + ': 제목 중복');
    newIds.add(card.id); newUrls.add(url);
  }
  return cards;
}
export function mergeDataSource(source, cards) {
  const marker = '\n];\n\nexport const PRESET_MODES';
  const offset = source.indexOf(marker);
  const start = source.indexOf('export const CONTENT_DATA = [');
  if (start < 0 || offset <= start || source.lastIndexOf(marker) !== offset)
    throw new Error('data.js 구조가 예상과 달라 자동 변환을 중단했습니다.');
  const snippet = cards.map(c => '  ' + JSON.stringify(c, null, 2).replace(/\n/g, '\n  ')).join(',\n');
  return source.slice(0,offset) + ',\n' + snippet + source.slice(offset);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const filepath = process.argv[2];
    const apply = process.argv.includes('--apply');
    if (!filepath || filepath.startsWith('--'))
      throw new Error('사용법: node tools/merge-approved-content.mjs 승인카드.json [--apply]');
    const cards = validateApprovedPayload(JSON.parse(fs.readFileSync(path.resolve(filepath), 'utf8')));
    const original = fs.readFileSync(dataFile, 'utf8');
    const merged = mergeDataSource(original, cards);
    const output = apply ? dataFile : path.join(root, 'tools', 'content-data.preview.js');
    fs.writeFileSync(output, merged, 'utf8');
    console.log((apply ? '[반영됨] ' : '[미리보기만 생성] ') + output);
    console.log('새 카드 ' + cards.length + '개. 기존 등록 콘텐츠를 보존합니다.');
    if (!apply) console.log('팀 검토 후 --apply 옵션으로 data.js에 반영하세요. 운영 배포는 별개입니다.');
  } catch (error) {
    console.error('[중단] ' + error.message);
    process.exitCode = 1;
  }
}
