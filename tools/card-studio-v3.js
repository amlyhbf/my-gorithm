import {CONTENT_DATA} from '../data.js';
import {fromCsv, studioIssues, toApprovedStudioCard, approvedStudioCards,
  STUDIO_STORAGE_KEY as V2_STORAGE_KEY} from './studio-core.js';
import {parseWorkJson,applyWorkDraft,workInstruction,newCandidate,wikipediaImage} from './studio-work-import.js';
const STUDIO_STORAGE_KEY='mamgorithm_card_studio_v3_work_web_1';

const $=id=>document.getElementById(id);
const app={items:[],selectedId:null,filename:'',wikiById:{}};
const categories={study:'공부',tech:'기술',culture:'문화',hobby:'취미'};
let config={aiConfigured:false,imageEnabled:false,remainingDrafts:0,remainingImages:0};
let busy=false;
function selected(){return app.items.find(x=>x.importId===app.selectedId);}
function notify(message,type=''){$('notice').textContent=message;$('notice').className='notice '+type;}
function save(){
  try {localStorage.setItem(STUDIO_STORAGE_KEY,JSON.stringify(app));}
  catch(error){notify('임시 저장에 실패했어요. 검토 JSON을 내려받아 백업하세요.','error');}
}
function download(filename,data,mime){
  const url=URL.createObjectURL(new Blob([data],{type:mime}));
  const a=document.createElement('a');a.href=url;a.download=filename;
  document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1500);
}
function setValue(id,value){$(id).value=value??'';}
function getValue(id){return $(id).value;}
function autoHeight(node){
  if (!node || node.tagName!=='TEXTAREA') return;
  node.style.height='auto';node.style.height=Math.max(53,node.scrollHeight+4)+'px';
}
function reflectImage(){
  const x=selected();const image=$('cover'),empty=$('heroEmpty');
  const credit=$('previewImageCredit');
  credit.textContent=x?.imageCredit ? '이미지: '+x.imageCredit : '';
  credit.hidden=!x?.imageCredit;
  if(!x||!x.imageUrl){image.removeAttribute('src');image.classList.remove('visible');empty.hidden=false;return;}
  image.src=x.imageUrl;image.classList.add('visible');empty.hidden=true;
}
$('cover').addEventListener('error',()=>{
  $('cover').classList.remove('visible');$('heroEmpty').hidden=false;
  notify('이미지를 불러오지 못했습니다. 썸네일 URL 또는 접근 권한을 확인해 주세요.','error');
});
function updateBadge(){
  const x=selected();if(!x)return;
  $('badge').textContent=(categories[x.category]||'미분류')+' · '+(x.type==='video'?'영상':'기사');
  $('feedbackTitle').textContent=(categories[x.category]||'기본')+' 알고리즘 피드백';
}
function renderSections(){
  const x=selected();const area=$('sections');area.replaceChildren();
  for(let i=0;i<x.sections.length;i++){
    const section=x.sections[i];
    const wrap=document.createElement('div');wrap.className='content-section';
    const heading=document.createElement('input');heading.className='heading';
    heading.placeholder='본문 소제목 '+(i+1);heading.value=section.heading||'';
    heading.dataset.index=String(i);heading.dataset.field='heading';
    const body=document.createElement('textarea');body.className='body';body.rows=5;
    body.placeholder='원문을 바탕으로 재구성한 설명을 작성하세요.';body.value=section.body||'';
    body.dataset.index=String(i);body.dataset.field='body';
    const buttons=document.createElement('div');buttons.className='section-actions';
    const remove=document.createElement('button');remove.type='button';remove.textContent='섹션 삭제';
    remove.disabled=x.sections.length<=2;
    remove.addEventListener('click',()=>{
      x.sections.splice(i,1);invalidate('contentChecked');renderSections();updateReview();
    });
    buttons.append(remove);wrap.append(heading,body,buttons);area.appendChild(wrap);
    autoHeight(body);
  }
}
function displayCandidate(id){
  app.selectedId=id;const x=selected();
  $('reader').hidden=!x;$('blank').hidden=!!x;
  if(!x){drawLibrary();return;}
  setValue('title',x.title);setValue('source',x.source);
  setValue('recommendationReason',x.recommendationReason);
  setValue('readTime',x.duration||'약 5분 읽기');
  setValue('displayDate',x.date||'검토 콘텐츠');
  setValue('shortSummary',x.summary);
  setValue('originalUrl',x.url);
  setValue('imageUrl',x.imageUrl);
  setValue('imageCredit',x.imageCredit);
  setValue('reviewNotes',x.reviewNotes);
  setValue('category',x.category);
  setValue('secondaryCategory',x.secondaryCategory);
  for(let n=0;n<3;n++)setValue('point'+n,(x.keyPoints||[])[n]);
  for(const key of ['linkChecked','contentChecked','rightsChecked'])$(key).checked=!!x[key];
  $('originalLink').href=safeOriginalUrl(x.url)||'#';
  renderSections();updateBadge();reflectImage();updateReview();drawLibrary();
  for(const el of document.querySelectorAll('.reader textarea'))autoHeight(el);
  $('workPrompt').value=workInstruction(x,location.href);
  save();
}
function safeOriginalUrl(input){
  try {const url=new URL(input);return url.protocol==='https:'?url.href:null;}
  catch{return null;}
}
function drawLibrary(){
  const container=$('libraryList');container.replaceChildren();
  const q=$('search').value.trim().toLowerCase();
  const filtered=app.items.filter(x=>!q||(x.title||'').toLowerCase().includes(q)||(x.originalTitle||'').toLowerCase().includes(q));
  if(!filtered.length){
    const p=document.createElement('div');p.className='empty-list';p.textContent='표시할 후보가 없습니다.';container.appendChild(p);return;
  }
  for(const item of filtered){
    const button=document.createElement('button');button.type='button';
    button.className='library-item'+(item.importId===app.selectedId?' active':'');
    const tag=document.createElement('span');tag.className='status'+(item.status==='승인'?' approved':item.status==='보류'?' hold':'');
    tag.textContent=item.status;
    const title=document.createElement('strong');title.textContent=item.title||'제목 없음';
    const desc=document.createElement('small');desc.textContent=(categories[item.category]||'미분류')+' · '+(item.originalTitle||'');
    button.append(tag,title,desc);button.addEventListener('click',()=>displayCandidate(item.importId));
    container.append(button);
  }
}
function updateReview(){
  const x=selected();
  const total=app.items.length,approved=app.items.filter(v=>v.status==='승인').length;
  $('counts').textContent=total+'개 후보 · '+approved+'개 승인';
  $('exportCards').disabled=approved===0;
  const issues=$('issues');issues.replaceChildren();
  if(!x){$('approve').disabled=true;return;}
  const errors=studioIssues(x);
  issues.classList.toggle('ready',errors.length===0);
  const b=document.createElement('strong');b.textContent=errors.length?
    '승인 전 수정·확인 항목 '+errors.length+'개':'등록 규격 통과 · 수동 승인 가능';
  issues.appendChild(b);
  if(errors.length){const ul=document.createElement('ul');
    for(const error of errors){const li=document.createElement('li');li.textContent=error;ul.appendChild(li);}issues.appendChild(ul);}
  $('approve').disabled=errors.length!==0;
}
function invalidate(flag){
  const x=selected();if(!x)return;
  if(flag){x[flag]=false;if($(flag))$(flag).checked=false;}
  if(x.status==='승인')x.status='검토중';
}
function updateField(key,value,verify=null){
  const x=selected();if(!x)return;
  const unchanged=x[key]===value;
  x[key]=value;
  if(!unchanged)invalidate(verify);
  if(key==='url')$('originalLink').href=safeOriginalUrl(value)||'#';
  if(key==='imageUrl'||key==='imageCredit')reflectImage();
  if(key==='category')updateBadge();
  updateReview();save();
}
function bind(id,key,verify=null){
  const field=$(id);
  field.addEventListener(field.tagName==='SELECT'||field.type==='checkbox'?'change':'input',e=>{
    const value=field.type==='checkbox'?field.checked:field.value;
    updateField(key,value,verify);if(id==='title')drawLibrary();
    if(field.tagName==='TEXTAREA')autoHeight(field);
  });
}
bind('title','title','contentChecked');bind('source','source','contentChecked');
bind('recommendationReason','recommendationReason','contentChecked');
bind('readTime','duration');bind('displayDate','date');
bind('shortSummary','summary','contentChecked');bind('originalUrl','url','linkChecked');
bind('imageUrl','imageUrl','rightsChecked');bind('imageCredit','imageCredit','rightsChecked');
bind('reviewNotes','reviewNotes');
bind('category','category','contentChecked');bind('secondaryCategory','secondaryCategory','contentChecked');
for(const key of ['linkChecked','contentChecked','rightsChecked'])bind(key,key);
for(let i=0;i<3;i++){
  const field=$('point'+i);
  field.addEventListener('input',()=>{
    const x=selected();if(!x)return;
    x.keyPoints[i]=field.value;invalidate('contentChecked');autoHeight(field);updateReview();save();
  });
}
$('sections').addEventListener('input',e=>{
  const target=e.target;const index=Number(target.dataset.index);const field=target.dataset.field;
  if(!['heading','body'].includes(field)||!selected()?.sections[index])return;
  selected().sections[index][field]=target.value;invalidate('contentChecked');
  autoHeight(target);updateReview();save();
});
$('addSection').addEventListener('click',()=>{
  const x=selected();if(!x)return;
  if(x.sections.length>=8){notify('본문은 최대 8개 섹션까지 편집할 수 있어요.','error');return;}
  x.sections.push({heading:'',body:''});invalidate('contentChecked');renderSections();updateReview();save();
});
$('openOriginalBottom').addEventListener('click',()=>{
  const url=safeOriginalUrl(selected()?.url);
  if(url)window.open(url,'_blank','noopener,noreferrer');
  else notify('유효한 HTTPS 원본 링크를 확인해 주세요.','error');
});
$('search').addEventListener('input',drawLibrary);

async function refreshServer(){
  $('serverStatus').textContent='웹 편집 모드 · 유료 API 사용 안 함';
}
async function withBusy(fn){
  if(busy||!selected())return;
  busy=true;
  for(const key of ['loadWiki','useWikiImage'])$(key).disabled=true;
  try{await fn();}catch(error){notify(error.message,'error');}
  finally{busy=false;for(const key of ['loadWiki','useWikiImage'])$(key).disabled=false;}
}
async function fetchImageCandidate(){
  const x=selected();
  const info=await wikipediaImage(x.url);
  app.wikiById[x.importId]=info;
  x.originalTitle=info.title||x.originalTitle;
  return info;
}
$('loadWiki').addEventListener('click',()=>withBusy(async()=>{
  const x=selected();
  const wiki=await fetchImageCandidate();
  if(wiki.imageUrl&&!x.imageUrl){
    x.imageUrl=wiki.imageUrl;invalidate('rightsChecked');
    setValue('imageUrl',x.imageUrl);reflectImage();
  }
  updateReview();save();
  notify(wiki.imageUrl?'대표 이미지 후보를 적용했어. 사용 허락·이미지 출처는 직접 확인해야 해.':
    '이 문서에서 대표 이미지를 찾지 못했어. 직접 선택해 줘.','success');
}));
$('useWikiImage').addEventListener('click',()=>withBusy(async()=>{
  const x=selected();
  const info=app.wikiById[x.importId]?.imageUrl?app.wikiById[x.importId]:await fetchImageCandidate();
  if(!info.imageUrl)throw new Error('이 문서에는 자동 조회되는 대표 이미지가 없습니다.');
  x.imageUrl=info.imageUrl;invalidate('rightsChecked');
  setValue('imageUrl',x.imageUrl);reflectImage();updateReview();save();
  notify('이미지 후보를 적용했어. Wikimedia 파일 저작자·라이선스를 직접 확인해야 해.','success');
}));
$('changeImage').addEventListener('click',()=>{
  $('imageUrl').focus();$('imageUrl').scrollIntoView({behavior:'smooth',block:'center'});
});
// This is a static website; no paid API endpoints are exposed.
$('generateDraft').disabled=true;
$('aiImage').disabled=true;
$('focusJson').addEventListener('click',()=>{$('cardJson').focus();$('workPanel').scrollIntoView({behavior:'smooth',block:'start'});});
$('copyPrompt').addEventListener('click',async()=>{
  if(!selected())return notify('먼저 후보 카드를 선택해 줘.','error');
  const text=$('workPrompt').value;
  try{
    await navigator.clipboard.writeText(text);
    notify('Work 작성 지시문을 클립보드에 복사했어.','success');
  }catch{
    $('workPrompt').focus();$('workPrompt').select();
    notify('자동 복사가 제한됐어. 지시문이 선택됐으니 Ctrl+C로 복사해 줘.');
  }
});
$('selectPrompt').addEventListener('click',()=>{$('workPrompt').focus();$('workPrompt').select();});
$('clearJson').addEventListener('click',()=>{$('cardJson').value='';notify('JSON 입력칸을 비웠어.');});
$('fillJson').addEventListener('click',()=>{
  const x=selected();if(!x)return notify('카드를 먼저 선택해 줘.','error');
  try{
    const parsed=parseWorkJson($('cardJson').value);
    if((x.title!==parsed.title||x.summary!==parsed.summary)&&!confirm(
      '선택한 카드의 제목·3줄 요약·본문을 Work의 JSON으로 교체할까요? 승인 상태는 검토 중으로 돌아갑니다.'))return;
    const merged=applyWorkDraft(x,parsed);
    Object.assign(x,merged);
    displayCandidate(x.importId);
    notify('Work 카드 초안이 적용됐어. 제목·요약·본문을 확인하고 마지막에 직접 승인해 줘.','success');
  }catch(error){notify('JSON 가져오기 실패: '+error.message,'error');}
});
$('createNewCandidate').addEventListener('click',()=>{
  const raw=prompt('새 기사 카드의 한국어 위키백과 URL을 입력하세요.');
  if(!raw)return;
  try{
    const item=newCandidate(raw,app.items,CONTENT_DATA);
    app.items.push(item);app.selectedId=item.importId;
    $('importStatus').textContent='직접 등록한 후보 포함 · '+app.items.length+'개';
    displayCandidate(item.importId);
    notify('새 카드가 만들어졌어. 작성 지시문을 복사해서 Work에 전달해 줘.','success');
  }catch(error){notify(error.message,'error');}
});
$('imageUrl').addEventListener('change',()=>{
  const x=selected();if(!x)return;
  x.imagePending=String(x.imageUrl).startsWith('/studio-generated/');
  updateReview();save();
});
for(const [id,status] of [['approve','승인'],['hold','보류'],['review','검토중']]){
  $(id).addEventListener('click',()=>{
    const x=selected();if(!x)return;
    if(status==='승인'&&studioIssues(x).length){notify('검토 항목이 남아 있어 승인할 수 없습니다.','error');return;}
    x.status=status;drawLibrary();updateReview();save();
    notify(status==='승인'?'카드가 승인 목록에 추가됐어. 운영 사이트에는 아직 반영되지 않았어.':'상태를 '+status+'으로 변경했어.','success');
  });
}
$('exportCards').addEventListener('click',()=>{
  try{
    const cards=approvedStudioCards(app.items);
    if(!cards.length)throw new Error('승인된 카드가 없습니다.');
    download('mamgorithm-approved-cards.json',JSON.stringify(cards,null,2)+'\n','application/json');
    notify('승인된 카드 '+cards.length+'개를 JSON으로 저장했어.','success');
  }catch(error){notify(error.message,'error');}
});
$('downloadReview').addEventListener('click',()=>{
  download('mamgorithm-studio-review.json',JSON.stringify(app,null,2)+'\n','application/json');
  notify('검토 중인 초안과 승인 상태를 JSON으로 저장했어.','success');
});
$('csvFile').addEventListener('change',async e=>{
  const file=e.target.files?.[0];if(!file)return;
  try{
    if(app.items.length && !confirm('기존 편집 내역을 교체할까요? 검토 JSON을 먼저 백업해 주세요.'))return;
    const items=fromCsv(await file.text(),CONTENT_DATA);
    app.items=items;app.selectedId=items[0]?.importId||null;
    app.filename=file.name;app.wikiById={};
    $('importStatus').textContent=file.name+' · '+items.length+'개';
    displayCandidate(app.selectedId);save();
    notify('후보 '+items.length+'개를 불러왔어. 아직 어느 카드도 자동 승인되지 않았어.','success');
  }catch(error){notify(error.message,'error');}
  finally{e.target.value='';}
});
$('reviewFile').addEventListener('change',async e=>{
  const file=e.target.files?.[0];if(!file)return;
  try{
    if(app.items.length && !confirm('현재 작업을 백업한 뒤 복구 파일로 교체할까요?'))return;
    const data=JSON.parse(await file.text());
    if(!Array.isArray(data.items)||data.items.length>500||!data.items.every(x=>typeof x.importId==='string'&&Array.isArray(x.keyPoints)&&Array.isArray(x.sections)))
      throw new Error('카드 스튜디오 V3 검토 JSON 형식이 아닙니다.');
    app.items=data.items;app.selectedId=data.items[0]?.importId||null;
    app.filename=data.filename||file.name;app.wikiById=data.wikiById||{};
    for(const item of app.items){
      if(item.status==='승인' && studioIssues(item).length)item.status='검토중';
    }
    $('importStatus').textContent='복구됨: '+app.filename;
    displayCandidate(app.selectedId);save();notify('검토 파일을 복구했어.','success');
  }catch(error){notify(error.message,'error');}
  finally{e.target.value='';}
});
try{
  const old=JSON.parse(localStorage.getItem(STUDIO_STORAGE_KEY)||'null');
  if(old?.items?.length){
    Object.assign(app,old);if(!app.wikiById)app.wikiById={};
    $('importStatus').textContent='이전 작업 복구: '+(app.filename||'CSV');
    displayCandidate(app.selectedId||app.items[0].importId);
  }
}catch{notify('기존 임시 저장 데이터를 읽지 못했어요. CSV나 검토 JSON을 다시 불러오세요.','error');}
refreshServer();
