/* Firebase integration. Anonymous users have Firebase UIDs and participate in analytics. */
let mergeCloudReadyUid = null;
let mergeTelemetryReadyUid = null;
let mergeAuthRevision = 0;
let mergeSyncTimer = null;
let mergeSyncChain = Promise.resolve();
let mergeCloudGeneration = 0;
let mergeRecentIds = [];
let mergeFeedCache = null;
let mergeAnonymousRequest = null;

function mergeSignedIn() { return !!(Et && Et.uid); }
function mergeEnsureAnonymous() {
  if (!Oe || Et?.uid || mergeAnonymousRequest) return mergeAnonymousRequest;
  mergeAnonymousRequest = Ym(Oe).catch(() => {
    // Keep using the device cache while offline; retry on the next online event.
    mergeSyncStatus('error');
    return null;
  }).finally(() => { mergeAnonymousRequest = null; });
  return mergeAnonymousRequest;
}
function mergeValidWeights(value) {
  if (!value || typeof value !== 'object') return null;
  const result = {};
  for (const key of ['study','tech','culture','hobby']) {
    if (!Number.isFinite(value[key])) return null;
    result[key] = Math.max(0, Math.min(100, Math.round(value[key])));
  }
  return result;
}
function mergeValidSavedIds(value) {
  const valid = new Set(sB().map(card => card.id));
  return Array.isArray(value) ? [...new Set(value.filter(id => typeof id === 'string' && valid.has(id)))] : null;
}
function mergeSyncStatus(status) {
  window.dispatchEvent(new CustomEvent('mamgorithm:sync', { detail: { status } }));
  const target = document.getElementById('authSyncStatus');
  if (target) target.textContent = status === 'saved' ? (Zn()==='en' ? 'Interests and bookmarks saved.' : '관심사와 북마크를 저장했어요.')
    : status === 'error' ? (Zn()==='en' ? 'Saved on this device. Cloud sync will retry.' : '이 기기에 저장했어요. 클라우드 연결은 다시 시도할게요.')
    : status === 'loading' ? (Zn()==='en' ? 'Connecting your account…' : '계정의 설정을 불러오고 있어요.') : '';
}
function mergeScheduleSave() {
  if (!mergeSignedIn() || mergeCloudReadyUid !== Et.uid) return;
  clearTimeout(mergeSyncTimer);
  mergeSyncTimer = setTimeout(mergeSaveCloud, 400);
}
async function mergeSaveCloud() {
  if (!mergeSignedIn() || mergeCloudReadyUid !== Et.uid || !Ki) return false;
  const uid = Et.uid, revision = mergeAuthRevision;
  const data = { weights: { ...U.weights }, savedIds: [...U.savedIds], updatedAt: new Date() };
  // Serialize writes so a slow older request cannot overwrite a later bookmark removal.
  const save = async () => {
    if (!mergeSignedIn() || Et.uid !== uid || revision !== mergeAuthRevision) return false;
    try {
      await Rm(yu(Ki, 'users', uid), data, { merge: true });
      if (revision === mergeAuthRevision) mergeSyncStatus('saved');
      return true;
    } catch { if (revision === mergeAuthRevision) mergeSyncStatus('error'); return false; }
  };
  mergeSyncChain = mergeSyncChain.then(save, save);
  return mergeSyncChain;
}
async function mergeHandleAuth(user) {
  const revision = ++mergeAuthRevision;
  const generation = mergeCloudGeneration;
  mergeCloudReadyUid = null;
  mergeTelemetryReadyUid = null;
  clearTimeout(mergeSyncTimer);
  Dp(user); bp();
  if (!user || !Ki) return;
  // Hydrate before the first partial write. An optimistic write on an empty SDK cache
  // can otherwise make the initial read look like a telemetry-only document.
  mergeSyncStatus('loading');
  try {
    const doc = await C_(yu(Ki, 'users', user.uid));
    if (revision !== mergeAuthRevision || !Et || Et.uid !== user.uid) return;
    const remote = doc.exists() ? doc.data() : {};
    // Changes made while the request was in flight take precedence over the snapshot.
    if (generation === mergeCloudGeneration) {
      const weights = mergeValidWeights(remote.weights);
      if (weights) U.weights = weights;
      const ids = mergeValidSavedIds(remote.savedIds);
      if (ids) U.savedIds = new Set(ids);
      localStorage.setItem(mt.WEIGHTS, JSON.stringify(U.weights));
      localStorage.setItem(mt.SAVED_IDS, JSON.stringify([...U.savedIds]));
    }
    mergeCloudReadyUid = user.uid;
    mergeTelemetryReadyUid = user.uid;
    tt();
    await mergeSaveCloud();
    await Jt.syncToFirestore();
  } catch {
    if (revision === mergeAuthRevision && Et?.uid===user.uid) {
      // Reads may be denied while writes are allowed. Preserve local preferences and
      // still attempt analytics for this authenticated UID without overwriting settings.
      mergeTelemetryReadyUid=user.uid;
      mergeSyncStatus('error');
      await Jt.syncToFirestore();
    }
  }
}

// Preserve the original anonymous + Google-account analytics schema and collection.
Jt.syncToFirestore = async function() {
  try {
    localStorage.setItem(sn.BEHAVIOR, JSON.stringify({ totalAppDwellSec:this.totalDwellSec, cardClickCount:this.cardClickCount,
      readerDwellSec:this.totalReaderDwellSec, cardDwellMap:this.cardDwellMap, reopenedBookmarkCount:this.reopenedBookmarkCount }));
    if (mergeSignedIn() && mergeTelemetryReadyUid===Et.uid && Ki) {
      const uid=Et.uid,revision=mergeAuthRevision;
      const snapshot=this.buildFullTelemetrySnapshot(window.__mamgorithm_state, window.__mamgorithm_pool);
      // Force attribution to this authenticated session rather than any local fallback ID.
      snapshot.personalInfo.userId=uid;
      snapshot.personalInfo.email=Et.email || (Et.isAnonymous ? '비회원 (익명 UID)' : '미로그인');
      const send=async()=>{
        if(!Et || Et.uid!==uid || revision!==mergeAuthRevision)return false;
        try{await Rm(yu(Ki,'users',uid),snapshot,{merge:true});return true;}
        catch{if(revision===mergeAuthRevision)mergeSyncStatus('error');return false;}
      };
      mergeSyncChain=mergeSyncChain.then(send,send);
      return await mergeSyncChain;
    }
  } catch { mergeSyncStatus('error'); }
};

function mergeAuthError(error) {
  const target = document.getElementById('authConnectionNotice');
  const message = error?.code === 'auth/unauthorized-domain'
    ? (Zn()==='en' ? 'Google sign-in is being connected for this address. You can continue as a guest.' : '이 주소의 Google 로그인 연결을 준비 중이에요. 로그인 없이도 이용할 수 있어요.')
    : (Zn()==='en' ? 'Could not connect. Please try again or continue as a guest.' : '연결하지 못했어요. 다시 시도하거나 로그인 없이 이용해주세요.');
  if (target) { target.textContent=message; target.hidden=false; }
  xe(message);
}
async function mergeCheckAuthDomain() {
  // This is the same public project configuration endpoint used by Firebase Auth.
  // No account, token or Firestore data is requested.
  try {
    const response = await fetch('https://identitytoolkit.googleapis.com/v1/projects?key='+encodeURIComponent(xl.apiKey));
    if (!response.ok) return;
    const config = await response.json();
    if (!Array.isArray(config.authorizedDomains)) return;
    const allowed = config.authorizedDomains.includes(location.hostname);
    document.documentElement.dataset.googleLoginReady = String(allowed);
    if (!allowed) {
      const target = document.getElementById('authConnectionNotice');
      if (target) { target.hidden=false; target.textContent=Zn()==='en'
        ? 'Google sign-in is being connected for this address. You can continue as a guest.'
        : '이 주소의 Google 로그인 연결을 준비 중이에요. 로그인 없이도 이용할 수 있어요.'; }
    }
  } catch { /* Offline or blocked config does not prevent guest use. */ }
}

document.addEventListener('DOMContentLoaded', () => {
  mergeCheckAuthDomain();
  const id = new URLSearchParams(location.search).get('article');
  const card = id && sB().find(card => card.id===id && card.type==='article');
  if (card) {
    const blockers=['introSplashOverlay','authOverlay','onboardingOverlay','coachmarkOverlay'].map(id=>document.getElementById(id)).filter(Boolean);
    const visible=el=>!el.classList.contains('hidden') && el.getClientRects().length && getComputedStyle(el).visibility!=='hidden' && getComputedStyle(el).display!=='none';
    const observer=new MutationObserver(check);
    let timer;
    function check(){ clearTimeout(timer); timer=setTimeout(()=>{
      if(blockers.some(visible))return;
      observer.disconnect(); of(card);
    },400); }
    blockers.forEach(el=>observer.observe(el,{attributes:true,attributeFilter:['class','style']}));
    check();
  }
  window.addEventListener('online',()=>{
    if(!mergeSignedIn())mergeEnsureAnonymous();
    else if(mergeCloudReadyUid!==Et.uid)mergeHandleAuth(Et);
    else mergeScheduleSave();
    Jt.syncToFirestore();
    mergeCheckAuthDomain();
  });
  document.addEventListener('keydown',event=>{
    if(event.key!=='Enter' && event.key!==' ')return;
    const card=event.target.closest('.content-feed-card');
    if(card && event.target===card){event.preventDefault();card.click();}
  });
  window.addEventListener('mamgorithm:language',()=>{
    mergeCheckAuthDomain();
    document.dispatchEvent(new Event('mamgorithm:language'));
  });
});
