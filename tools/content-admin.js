import { CONTENT_DATA } from '../data.js';
import {
  importCandidates, validateCandidate, approvedCards, exportReviewCsv
} from './content-admin-core.js';

const STORAGE = 'mamgorithm_content_review_v1';
const $ = selector => document.querySelector(selector);
const app = { items: [], selectedId: null, filename: '' };
const FIELDS = [
  'category', 'secondaryCategory', 'title', 'summary', 'recommendationReason',
  'rationale', 'url', 'source', 'imageUrl', 'imageCredit', 'reviewNotes',
  'linkChecked', 'contentChecked', 'rightsChecked'
];
const CATEGORIES = { study: '공부', tech: '기술', culture: '문화', hobby: '취미' };

function persist() {
  try { localStorage.setItem(STORAGE, JSON.stringify(app)); }
  catch (error) { console.warn('검토 저장에 실패했습니다. CSV로 백업해 주세요.', error); }
}
function restore() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE) || 'null');
    if (!saved || !Array.isArray(saved.items)) return;
    Object.assign(app, saved);
    $('#fileName').textContent = '이전 검토 작업: ' + (app.filename || 'CSV');
    activate();
  } catch (error) { console.warn('이전 검토 내역을 복구할 수 없습니다.', error); }
}
function textNode(tag, value, className = '') {
  const node = document.createElement(tag);
  node.textContent = value;
  if (className) node.className = className;
  return node;
}
function statusClass(status) {
  return status === '승인' ? 'approved' : status === '보류' ? 'hold' :
    status === '검토중' ? 'review' : '';
}
function stats() {
  $('#totalCount').textContent = app.items.length;
  $('#approvedCount').textContent = app.items.filter(x => x.status === '승인').length;
  $('#reviewCount').textContent = app.items.filter(x => x.status === '검토중').length;
  $('#holdCount').textContent = app.items.filter(x => x.status === '보류').length;
  $('#exportApproved').disabled = !app.items.some(x => x.status === '승인');
}
function visibleItems() {
  const q = $('#searchInput').value.trim().toLowerCase();
  const status = $('#filterSelect').value;
  return app.items.filter(x => {
    const match = !q || [x.title,x.originalTitle,x.category,x.source].some(v => (v || '').toLowerCase().includes(q));
    return match && (status === 'all' ||
      (status === '중복' ? x.duplicates?.length : x.status === status));
  });
}
function drawList() {
  const target = $('#candidateList');
  target.replaceChildren();
  const items = visibleItems();
  if (!items.length) {
    target.appendChild(textNode('p', '조건에 맞는 후보가 없어요.', 'empty-message'));
    return;
  }
  for (const candidate of items) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'candidate-item' + (candidate.importId === app.selectedId ? ' active' : '');
    button.setAttribute('aria-current', candidate.importId === app.selectedId ? 'true' : 'false');
    const top = textNode('div', '', 'row-top');
    top.appendChild(textNode('small', CATEGORIES[candidate.category] || '분야 확인 필요'));
    top.appendChild(textNode('span', candidate.status, 'status-chip ' + statusClass(candidate.status)));
    button.append(top, textNode('strong', candidate.title),
      textNode('small', candidate.originalTitle || '원본 제목 없음'));
    if (candidate.duplicates?.length) button.appendChild(textNode('span', candidate.duplicates.join(' · '), 'duplicate-note'));
    button.addEventListener('click', () => selectCandidate(candidate.importId));
    target.appendChild(button);
  }
}
function current() { return app.items.find(x => x.importId === app.selectedId); }
function drawValidation() {
  const c = current();
  if (!c) return;
  const errors = validateCandidate(c);
  const target = $('#validation');
  target.replaceChildren();
  target.classList.toggle('ready', errors.length === 0);
  target.appendChild(textNode('strong', errors.length
    ? '승인 전 확인할 항목 ' + errors.length + '개'
    : '등록 준비 조건 통과 · 승인 가능'));
  if (errors.length) {
    const ul = document.createElement('ul');
    for (const error of errors) ul.appendChild(textNode('li', error));
    target.appendChild(ul);
  } else target.appendChild(textNode('p', '마지막으로 출처·내용을 확인한 후 승인해 주세요.'));
  $('#approveButton').disabled = errors.length > 0;
}
function selectCandidate(id) {
  app.selectedId = id;
  const candidate = current();
  if (!candidate) return;
  $('#emptyEditor').hidden = true;
  $('#editorContent').hidden = false;
  $('#selectedHeading').textContent = candidate.title;
  $('#candidateMeta').textContent = '원본: ' + (candidate.originalTitle || '없음') + ' · CSV ' + candidate.rowNumber + '행';
  $('#selectedStatus').textContent = candidate.status;
  $('#selectedStatus').className = 'status-chip ' + statusClass(candidate.status);
  const form = $('#reviewForm');
  for (const field of FIELDS) {
    const input = form.elements.namedItem(field);
    if (!input) continue;
    if (input.type === 'checkbox') input.checked = !!candidate[field];
    else input.value = candidate[field] || '';
  }
  form.elements.namedItem('originalTitle').value = candidate.originalTitle || '';
  try {
    const url = new URL(candidate.url);
    if (url.protocol !== 'https:') throw new Error('untrusted URL');
    $('#openSource').href = url.href;
    $('#openSource').removeAttribute('aria-disabled');
  } catch {
    $('#openSource').removeAttribute('href');
    $('#openSource').setAttribute('aria-disabled', 'true');
  }
  drawValidation();
  drawList();
  persist();
}
function updateCurrent(field, value) {
  const candidate = current();
  if (!candidate || !FIELDS.includes(field)) return;
  candidate[field] = value;
  // Any edit after approval triggers a fresh review; nothing auto-publishes.
  if (candidate.status === '승인') candidate.status = '검토중';
  $('#selectedHeading').textContent = candidate.title;
  $('#selectedStatus').textContent = candidate.status;
  $('#selectedStatus').className = 'status-chip ' + statusClass(candidate.status);
  if (field === 'url') {
    try {
      const url = new URL(candidate.url);
      if (url.protocol !== 'https:') throw new Error('invalid protocol');
      $('#openSource').href = url.href;
    } catch { $('#openSource').removeAttribute('href'); }
  }
  // Recompute duplicates consistently when a URL or title is edited.
  if (field === 'url' || field === 'title') {
    const oldUrls = new Set(CONTENT_DATA.map(x => canonicalUrlForCheck(x.url)));
    const oldTitles = new Set(CONTENT_DATA.map(x => x.title.trim().toLowerCase()));
    const urlCounts = new Map(), titleCounts = new Map();
    for (const item of app.items) {
      const url = canonicalUrlForCheck(item.url);
      const title = item.title.trim().toLowerCase();
      if (url) urlCounts.set(url, (urlCounts.get(url) || 0) + 1);
      if (title) titleCounts.set(title, (titleCounts.get(title) || 0) + 1);
    }
    for (const item of app.items) {
      const url = canonicalUrlForCheck(item.url);
      const title = item.title.trim().toLowerCase();
      item.duplicates = [];
      if (url && oldUrls.has(url)) item.duplicates.push('기존 카드와 URL 중복');
      if (title && oldTitles.has(title)) item.duplicates.push('기존 카드와 제목 중복');
      if (url && urlCounts.get(url) > 1) item.duplicates.push('이번 CSV 내 URL 중복');
      if (title && titleCounts.get(title) > 1) item.duplicates.push('이번 CSV 내 제목 중복');
      if (item.status === '승인' && item.duplicates.length) item.status = '검토중';
    }
  }
  drawValidation(); drawList(); stats(); persist();
}
function canonicalUrlForCheck(url) {
  try {
    const u = new URL(url);
    if (!['https:', 'http:'].includes(u.protocol)) return '';
    return u.hostname.toLowerCase() + decodeURIComponent(u.pathname).replace(/\/$/, '') +
      (u.hostname.endsWith('wikipedia.org') ? '' : u.search);
  } catch { return ''; }
}
function setStatus(next) {
  const c = current();
  if (!c) return;
  if (next === '승인' && validateCandidate(c).length) return;
  c.status = next;
  stats(); selectCandidate(c.importId); persist();
}
function activate() {
  const has = app.items.length > 0;
  $('#searchInput').disabled = !has;
  $('#filterSelect').disabled = !has;
  $('#exportReview').disabled = !has;
  stats();
  if (has) selectCandidate(app.selectedId || app.items[0].importId);
  else drawList();
}
function download(name, contents, type) {
  const file = new Blob([contents], { type });
  const url = URL.createObjectURL(file);
  const anchor = document.createElement('a');
  anchor.href = url; anchor.download = name;
  document.body.appendChild(anchor);
  anchor.click(); anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

$('#csvFile').addEventListener('change', async event => {
  const file = event.target.files?.[0];
  if (!file) return;
  if (app.items.length && !confirm('기존 검토 내역을 새 CSV로 교체할까요? 먼저 검토표 CSV를 저장해 주세요.')) {
    event.target.value = ''; return;
  }
  try {
    const rows = importCandidates(await file.text(), CONTENT_DATA);
    app.items = rows; app.selectedId = rows[0]?.importId || null; app.filename = file.name;
    $('#fileName').textContent = file.name + ' · ' + rows.length + '개';
    $('#filterSelect').value = 'all'; $('#searchInput').value = '';
    activate(); persist();
  } catch (error) {
    alert('CSV를 불러올 수 없습니다.\n' + error.message);
  } finally { event.target.value = ''; }
});
$('#searchInput').addEventListener('input', drawList);
$('#filterSelect').addEventListener('change', drawList);
$('#reviewForm').addEventListener('input', event => {
  if (!event.target.name || event.target.type === 'checkbox' || event.target.tagName === 'SELECT') return;
  updateCurrent(event.target.name, event.target.value);
});
$('#reviewForm').addEventListener('change', event => {
  const element = event.target;
  if (!element.name) return;
  updateCurrent(element.name, element.type === 'checkbox' ? element.checked : element.value);
});
$('#reviewForm').addEventListener('submit', e => e.preventDefault());
$('#holdButton').addEventListener('click', () => setStatus('보류'));
$('#reviewButton').addEventListener('click', () => setStatus('검토중'));
$('#approveButton').addEventListener('click', () => setStatus('승인'));
$('#exportReview').addEventListener('click', () => {
  download('맘고리즘_콘텐츠검토표.csv', exportReviewCsv(app.items), 'text/csv;charset=utf-8');
});
$('#exportApproved').addEventListener('click', () => {
  try {
    const cards = approvedCards(app.items);
    if (!cards.length) return;
    download('mamgorithm-approved-cards.json', JSON.stringify(cards,null,2) + '\n', 'application/json;charset=utf-8');
  } catch (error) { alert('승인된 카드에 문제가 있습니다.\n' + error.message); }
});
restore();
