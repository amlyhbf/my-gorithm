// Card Studio V2 keeps existing review gates, and additionally requires
// real article-reader content (3 key points and 2+ sections) before approval.
import {importCandidates, validateCandidate, toWebsiteCard} from './content-admin-core.js';

export const STUDIO_STORAGE_KEY='mamgorithm_ai_card_studio_v2';

export function fromCsv(csv,existing) {
  return importCandidates(csv,existing).map(x=>({
    ...x,
    keyPoints: Array.isArray(x.keyPoints)?x.keyPoints:['','',''],
    sections: Array.isArray(x.sections)?x.sections:[
      {heading:'',body:''},{heading:'',body:''}
    ],
    wikiSource:null, generated:false, imagePending:false,
    status:'대기'
  }));
}
export function studioIssues(item) {
  const errors=validateCandidate(item);
  if (!Array.isArray(item.keyPoints) || item.keyPoints.length!==3 ||
    item.keyPoints.some(p=>typeof p!=='string'||p.trim().length<12))
    errors.push('핵심 요약 3개 모두 12자 이상 작성 필요');
  if (!Array.isArray(item.sections) || item.sections.length<2 ||
    item.sections.some(s=>!s || typeof s.heading!=='string'||s.heading.trim().length<3 ||
      typeof s.body!=='string'||s.body.trim().length<50))
    errors.push('본문 소제목·내용 최소 2개(각 본문 50자 이상) 필요');
  if (item.imagePending || String(item.imageUrl||'').startsWith('/studio-generated/'))
    errors.push('AI 이미지의 영구 HTTPS 주소를 등록해야 승인 가능');
  if (!(item.imageCredit || '').trim())
    errors.push('대표 이미지의 저작자·라이선스·출처 또는 직접 제작 근거 기록 필요');
  if (item.secondaryCategory && item.secondaryCategory===item.category)
    errors.push('대표 분야와 보조 분야 중복 확인');
  return [...new Set(errors)];
}
export function toApprovedStudioCard(item) {
  const errors=studioIssues(item);
  if (item.status!=='승인'||errors.length)
    throw new Error('승인 전 항목을 확인하세요: '+errors.join(', '));
  const basic=toWebsiteCard(item);
  return {...basic,duration:item.duration||basic.duration,date:item.date||basic.date,
    keyPoints:item.keyPoints.map(x=>x.trim()),
    sections:item.sections.map(s=>({heading:s.heading.trim(),body:s.body.trim()}))};
}
export function approvedStudioCards(items) {
  const result=[], ids=new Set(), urls=new Set();
  for (const item of items) {
    if (item.status!=='승인') continue;
    const card=toApprovedStudioCard(item);
    if (ids.has(card.id)||urls.has(card.url)) throw new Error('승인된 카드끼리 중복입니다.');
    ids.add(card.id);urls.add(card.url);result.push(card);
  }
  return result;
}
export function applyAiDraft(item, draft, wiki) {
  if (!item || !draft || !wiki) throw new Error('AI 초안이 없습니다.');
  if (!Array.isArray(draft.keyPoints) || draft.keyPoints.length!==3 ||
      !Array.isArray(draft.sections) || draft.sections.length<2)
    throw new Error('AI 초안이 요구 형식과 다릅니다.');
  return {...item,title:draft.title, summary:draft.summary,
    recommendationReason:draft.recommendationReason,
    keyPoints:[...draft.keyPoints],sections:draft.sections.map(x=>({...x})),
    source:'한국어 위키백과', originalTitle:wiki.title,
    url:wiki.url,generated:true, contentChecked:false,linkChecked:false,
    status:'검토중',wikiSource:{url:wiki.url,title:wiki.title,checkedAt:null}};
}
