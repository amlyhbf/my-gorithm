// Work-generated content is untrusted JSON, never executable code.
// Only text content is imported: source URLs and image licenses stay under human control.
const MAX_JSON_CHARS=65000;
const normalizeText=(v)=>typeof v==='string'?v.trim():'';
function assertText(value,label,min,max){
  const text=normalizeText(value);
  if(text.length<min||text.length>max)throw new Error(label+'은(는) '+min+'~'+max+'자여야 합니다.');
  if(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(text))throw new Error(label+'에 잘못된 제어 문자가 있습니다.');
  return text;
}
export function parseWorkJson(input){
  if(typeof input!=='string'||!input.trim()||input.length>MAX_JSON_CHARS)
    throw new Error('65KB 이하의 카드 JSON을 입력하세요.');
  let source=input.trim();
  const fenced=source.match(/^```(?:json)?\s*\n([\s\S]*?)\n```\s*$/i);
  if(fenced)source=fenced[1].trim();
  let object;
  try{object=JSON.parse(source);}catch{throw new Error('JSON 형식 오류: 큰따옴표·쉼표·줄바꿈을 확인해 주세요.');}
  if(object&&typeof object==='object'&&!Array.isArray(object)&&object.card)object=object.card;
  if(!object||typeof object!=='object'||Array.isArray(object))throw new Error('카드 JSON 객체가 필요합니다.');
  const title=assertText(object.title,'제목',8,150);
  const summary=assertText(object.summary,'피드 요약',25,1100);
  const recommendationReason=assertText(object.recommendationReason,'추천 이유',12,800);
  if(!Array.isArray(object.keyPoints)||object.keyPoints.length!==3)
    throw new Error('keyPoints는 정확히 3개의 문장이어야 합니다.');
  const keyPoints=object.keyPoints.map((s,i)=>assertText(s,'핵심 요약 '+(i+1),12,450));
  if(!Array.isArray(object.sections)||object.sections.length<2||object.sections.length>8)
    throw new Error('sections에는 2~8개의 본문 섹션이 필요합니다.');
  const sections=object.sections.map((s,i)=>{
    if(!s||typeof s!=='object'||Array.isArray(s))throw new Error('본문 섹션 '+(i+1)+' 형식 오류');
    return {heading:assertText(s.heading,'본문 소제목 '+(i+1),3,200),
      body:assertText(s.body,'본문 내용 '+(i+1),50,5000)};
  });
  // Do not import URLs, source, image or approval flags from AI responses.
  return {title,summary,recommendationReason,keyPoints,sections};
}
export function applyWorkDraft(item,data){
  if(item?.type!=='article')throw new Error('현재 Work 일괄 가져오기는 기사 카드만 지원합니다.');
  const body=typeof data==='string'?parseWorkJson(data):parseWorkJson(JSON.stringify(data));
  const duration='약 '+Math.max(1,Math.ceil(
    (body.summary+body.sections.map(x=>x.body).join('')).length/360))+'분 읽기';
  return {...item,...body,duration,status:'검토중',generated:true,contentChecked:false,
    // Title/summary has been modified; source URL, image license checks must remain human.
    reviewNotes:[item.reviewNotes,'Work 작성 초안 적용: 원문 사실관계를 재검토해야 합니다.'].filter(Boolean).join('\n')};
}
export function workInstruction(item,pageUrl=''){
  if(!item) return '왼쪽에서 카드를 선택하면 Work에 전달할 작성 지시문이 나타납니다.';
  const category={study:'공부',tech:'기술',culture:'문화',hobby:'취미'}[item.category]||'미분류';
  return [
    '맘고리즘 카드 스튜디오 V3에서 사용할 기사 카드 초안을 작성해 줘.',
    '원문 링크: '+item.url,
    '분야: '+category,
    '원본 주제: '+(item.originalTitle||item.title),
    '위 원문 페이지를 직접 열어 내용을 확인하고, 근거 없는 내용을 추가하지 마.',
    '원문의 긴 문장을 그대로 복제하지 말고 한국어 고등학생 독자를 위해 재구성해 줘.',
    '제목은 흥미롭되 원문에 충실하게, summary는 약 80~140자,',
    'recommendationReason은 1~2문장, keyPoints는 정확히 3개의 핵심 문장,',
    'sections는 heading과 body가 있는 2~4개의 문단(각 body 100~260자)으로 작성해.',
    '관련 내용이 원문에서 확인되지 않으면 추측하거나 지어내지 말고 먼저 알려 줘.',
    '결과는 마크다운 설명 없이 아래 필드만 포함하는 유효한 JSON 객체 하나로 줘:',
    '{"title":"...","summary":"...","recommendationReason":"...","keyPoints":["...","...","..."],"sections":[{"heading":"...","body":"..."},{"heading":"...","body":"..."}]}',
    '원본 URL, 이미지 URL, 출처, 사용 허락 확인, 승인 상태는 AI가 만들거나 변경하지 마.',
    '완성한 결과를 다음 카드 스튜디오 페이지의 해당 카드에 JSON 붙여넣기로 적용해:',
    pageUrl||'(현재 열려 있는 카드 스튜디오)',
    '카드를 자동 승인하지 말고 검토 중으로 남겨 줘.'
  ].join('\n');
}
export function newCandidate(url,existingItems=[],existingCards=[]){
  let u;
  try{u=new URL(String(url).trim());}catch{throw new Error('https://ko.wikipedia.org/wiki/... 링크를 입력하세요.');}
  if(u.protocol!=='https:'||u.hostname!=='ko.wikipedia.org'||!u.pathname.startsWith('/wiki/')||
     u.username||u.password)throw new Error('현재 직접 추가는 한국어 위키백과 문서만 지원합니다.');
  if(existingItems.some(x=>x.url===u.href)||existingCards.some(x=>x.url===u.href))
    throw new Error('이미 등록된 URL입니다.');
  let original;
  try{original=decodeURIComponent(u.pathname.slice(6)).replaceAll('_',' ');}catch{throw new Error('문서 주소를 해석할 수 없습니다.');}
  if(!original||original.length>200)throw new Error('문서 제목을 확인해 주세요.');
  return {importId:'manual-'+Date.now()+'-'+Math.floor(Math.random()*1e6),rowNumber:0,
    category:'tech',secondaryCategory:'',type:'article',title:original,originalTitle:original,
    summary:'',rationale:'',recommendationReason:'',url:u.href,source:'한국어 위키백과',
    imageUrl:'',imageCredit:'',reviewNotes:'',linkChecked:false,contentChecked:false,
    rightsChecked:false,status:'대기',duplicates:[],duration:'약 5분 읽기',
    date:'검토 콘텐츠',keyPoints:['','',''],sections:[{heading:'',body:''},{heading:'',body:''}],
    wikiSource:null,generated:false,imagePending:false};
}
export async function wikipediaImage(url,fetchImpl=fetch){
  let u;try{u=new URL(url);}catch{throw new Error('유효하지 않은 문서 URL입니다.');}
  if(u.protocol!=='https:'||u.hostname!=='ko.wikipedia.org'||!u.pathname.startsWith('/wiki/'))
    throw new Error('한국어 위키백과 링크만 사용할 수 있습니다.');
  const endpoint=new URL('https://ko.wikipedia.org/w/api.php');
  const params={action:'query',format:'json',formatversion:'2',origin:'*',redirects:'1',prop:'pageimages|info',
    inprop:'url',piprop:'thumbnail|original',pithumbsize:'1000',titles:decodeURIComponent(u.pathname.slice(6)).replaceAll('_',' ')};
  for(const [key,value] of Object.entries(params))endpoint.searchParams.set(key,value);
  const response=await fetchImpl(endpoint.href,{credentials:'omit'});
  if(!response.ok)throw new Error('위키백과 이미지 조회가 실패했습니다 ('+response.status+').');
  const data=await response.json();const page=data?.query?.pages?.[0];
  if(!page||page.missing)throw new Error('위키백과 문서를 찾지 못했습니다.');
  const image=page.original?.source||page.thumbnail?.source||'';
  if(image&&!/^https:\/\/upload\.wikimedia\.org\//.test(image))
    throw new Error('이미지 호스트가 예상과 다릅니다.');
  return {title:page.title||'',url:page.fullurl||u.href,imageUrl:image,
    imageStatus:'저작자·라이선스·출처 확인 필요'};
}
