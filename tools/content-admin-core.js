// 맘고리즘 콘텐츠 관리 V1: CSV 후보 검토용 순수 로직.
// No automatic publishing, network scraping or production data changes.
export const CSV_HEADERS = [
  '분야1', '분야2', '형태', '제목', '원본제목', '소개', '분야연결근거',
  '추천이유', '원본URL', '출처', '썸네일URL', '링크검증', '개발반영상태', '저장일'
];
export const CATEGORIES = { 공부: 'study', 기술: 'tech', 문화: 'culture', 취미: 'hobby' };
export const TYPES = { 기사: 'article', 영상: 'video' };

export function parseCsv(text) {
  if (typeof text !== 'string') throw new Error('CSV 문자열이 필요합니다.');
  const data = text.replace(/^\uFEFF/, '');
  const rows = [];
  let row = [], value = '', quoted = false;
  for (let i = 0; i < data.length; i++) {
    const ch = data[i];
    if (quoted) {
      if (ch === '"' && data[i + 1] === '"') { value += '"'; i++; }
      else if (ch === '"') quoted = false;
      else value += ch;
    } else if (ch === '"') {
      if (value) throw new Error('CSV 따옴표 형식이 올바르지 않습니다.');
      quoted = true;
    } else if (ch === ',') {
      row.push(value); value = '';
    } else if (ch === '\r' || ch === '\n') {
      if (ch === '\r' && data[i + 1] === '\n') i++;
      row.push(value); value = '';
      if (row.some(cell => cell.trim())) rows.push(row);
      row = [];
    } else value += ch;
  }
  if (quoted) throw new Error('닫히지 않은 CSV 따옴표가 있습니다.');
  row.push(value);
  if (row.some(cell => cell.trim())) rows.push(row);
  if (!rows.length) throw new Error('CSV 파일이 비어 있습니다.');
  const headers = rows.shift().map(x => x.trim());
  const missing = CSV_HEADERS.filter(h => !headers.includes(h));
  if (missing.length) throw new Error('누락된 열: ' + missing.join(', '));
  return rows.map((cells, index) => {
    if (cells.length !== headers.length) throw new Error((index + 2) + '행: 열 개수가 다릅니다.');
    return Object.fromEntries(headers.map((header, j) => [header, cells[j].trim()]));
  });
}
export function canonicalUrl(value) {
  try {
    const url = new URL(value);
    if (!['https:', 'http:'].includes(url.protocol)) return '';
    // Wikipedia pages with different percent encoding should compare equally.
    const path = decodeURIComponent(url.pathname).replace(/\/$/, '');
    const query = url.hostname.endsWith('wikipedia.org') ? '' : url.search;
    return url.hostname.toLowerCase() + path + query;
  } catch { return ''; }
}
function hash(input) {
  let h = 2166136261;
  for (const ch of input) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return (h >>> 0).toString(36);
}
export function importCandidates(text, existingCards = []) {
  const rows = parseCsv(text);
  const oldUrls = new Set(existingCards.map(x => canonicalUrl(x.url)).filter(Boolean));
  const oldTitles = new Set(existingCards.map(x => (x.title || '').trim().toLowerCase()));
  const seenUrls = new Set();
  return rows.map((row, index) => {
    const key = canonicalUrl(row['원본URL']);
    const title = row['제목'];
    const duplicates = [];
    if (key && oldUrls.has(key)) duplicates.push('기존 카드와 URL 중복');
    if (oldTitles.has(title.toLowerCase())) duplicates.push('기존 카드와 제목 중복');
    if (key && seenUrls.has(key)) duplicates.push('이번 CSV 내 URL 중복');
    if (key) seenUrls.add(key);
    return {
      importId: 'candidate-' + (index + 1) + '-' + hash(row['원본URL'] + title),
      rowNumber: index + 2,
      category: CATEGORIES[row['분야1']] || '',
      secondaryCategory: CATEGORIES[row['분야2']] || '',
      type: TYPES[row['형태']] || '',
      title, originalTitle: row['원본제목'], summary: row['소개'],
      rationale: row['분야연결근거'], recommendationReason: row['추천이유'],
      url: row['원본URL'], source: row['출처'], imageUrl: row['썸네일URL'],
      imageCredit: '', reviewNotes: '',
      linkChecked: false, contentChecked: false, rightsChecked: false,
      status: '대기', duplicates,
      originalDate: row['저장일']
    };
  });
}
export function validateCandidate(item) {
  const errors = [];
  if (!item.category) errors.push('대표 분야 확인 필요');
  if (!item.type) errors.push('콘텐츠 유형 확인 필요');
  if (!(item.title || '').trim()) errors.push('제목 필요');
  if (!(item.summary || '').trim() || item.summary.trim().length < 25) errors.push('요약 25자 이상 필요');
  if (!(item.recommendationReason || '').trim()) errors.push('추천 이유 필요');
  if (!(item.source || '').trim()) errors.push('출처 필요');
  if (!canonicalUrl(item.url) || !String(item.url).startsWith('https://')) errors.push('HTTPS 원본 URL 필요');
  if (!canonicalUrl(item.imageUrl) || !String(item.imageUrl).startsWith('https://')) errors.push('HTTPS 썸네일 URL 필요');
  if (!item.linkChecked) errors.push('원본 링크 수동 확인 필요');
  if (!item.contentChecked) errors.push('제목·요약 원문 대조 및 재작성 확인 필요');
  if (!item.rightsChecked) errors.push('텍스트·썸네일 이용 조건 확인 필요');
  if ((item.duplicates || []).length) errors.push(...item.duplicates);
  // The existing website inserts some card fields into HTML.
  if ([item.title, item.summary, item.recommendationReason, item.source, item.imageCredit]
      .some(v => /[<>]/.test(v || ''))) errors.push('HTML 특수기호(<, >) 제거 필요');
  return errors;
}
export function toWebsiteCard(item) {
  const errors = validateCandidate(item);
  if (item.status !== '승인' || errors.length) throw new Error((item.title || '') + ': 승인되지 않았거나 오류가 있습니다: ' + errors.join(', '));
  return {
    id: 'curated-' + item.category + '-' + hash(canonicalUrl(item.url)),
    category: item.category, type: item.type,
    title: item.title.trim(), summary: item.summary.trim(),
    recommendationReason: item.recommendationReason.trim(),
    source: item.source.trim(), duration: '읽을거리', date: '검토 콘텐츠',
    imageUrl: item.imageUrl.trim(), url: item.url.trim(),
    secondaryCategory: item.secondaryCategory || undefined,
    contentAttribution: item.imageCredit?.trim() || undefined,
    isNew: true
  };
}
export function approvedCards(items) {
  const result = [];
  const seen = new Set();
  for (const item of items) {
    if (item.status !== '승인') continue;
    const card = toWebsiteCard(item);
    if (seen.has(card.id)) throw new Error('승인 카드 ID 중복: ' + card.id);
    seen.add(card.id); result.push(card);
  }
  return result;
}
function safeCsvCell(value) {
  let v = String(value ?? '');
  if (/^[\s]*[=+@-]/.test(v)) v = "'" + v; // Prevent spreadsheet formula injection.
  return '"' + v.replace(/"/g, '""') + '"';
}
export function exportReviewCsv(items) {
  const cols = ['상태', '검토메모', '링크확인', '내용확인', '이용조건확인', '이미지출처', ...CSV_HEADERS];
  const lines = items.map(item => {
    const source = {
      상태: item.status, 검토메모: item.reviewNotes, 링크확인: item.linkChecked ? '확인' : '미확인',
      내용확인: item.contentChecked ? '확인' : '미확인', 이용조건확인: item.rightsChecked ? '확인' : '미확인',
      이미지출처: item.imageCredit,
      분야1: Object.keys(CATEGORIES).find(x => CATEGORIES[x] === item.category) || '',
      분야2: Object.keys(CATEGORIES).find(x => CATEGORIES[x] === item.secondaryCategory) || '',
      형태: Object.keys(TYPES).find(x => TYPES[x] === item.type) || '',
      제목: item.title, 원본제목: item.originalTitle, 소개: item.summary,
      분야연결근거: item.rationale, 추천이유: item.recommendationReason, 원본URL: item.url,
      출처: item.source, 썸네일URL: item.imageUrl, 링크검증: item.linkChecked ? '확인' : '미확인',
      개발반영상태: '미반영', 저장일: item.originalDate
    };
    return cols.map(key => safeCsvCell(source[key])).join(',');
  });
  return '\uFEFF' + [cols.map(safeCsvCell).join(','), ...lines].join('\r\n') + '\r\n';
}
