// Generated from the frozen deployed UI plus integration/runtime.js.
import {firebaseConfig, Df, f_, Cv, oI, Ym, yn, TI, aI, yu, Rm, C_} from './firebase.js';
import {CONTENT_DATA} from './data.js';
// Pure recommendation helpers: preserve user-controlled category weights without
// duplicating an item or repeatedly prioritizing the same registered entries.
const FEED_CATEGORIES = ['study', 'tech', 'culture', 'hobby'];

function shuffledTieRank(id, seed) {
  let value = (seed >>> 0) || 2166136261;
  for (let i = 0; i < id.length; i++) {
    value = Math.imul(value ^ id.charCodeAt(i), 16777619) >>> 0;
  }
  return value;
}

// Largest-remainder allocation with per-category inventory limits.
// When one category runs out, only other enabled categories can fill its slots.
function allocateAvailableSlots(weights, capacity, requested) {
  const counts = Object.fromEntries(FEED_CATEGORIES.map(c => [c, 0]));
  const total = Math.min(
    Math.max(0, Math.floor(requested) || 0),
    FEED_CATEGORIES.reduce((sum, c) => sum + (weights[c] > 0 ? Math.max(0, capacity[c] || 0) : 0), 0)
  );
  let remaining = total;
  while (remaining > 0) {
    const active = FEED_CATEGORIES.filter(c => weights[c] > 0 && counts[c] < (capacity[c] || 0));
    if (!active.length) break;
    const weightSum = active.reduce((sum, c) => sum + weights[c], 0);
    const ideals = active.map(c => ({ c, exact: remaining * weights[c] / weightSum }));
    let allocated = 0;
    for (const { c, exact } of ideals) {
      const add = Math.min(Math.floor(exact), (capacity[c] || 0) - counts[c]);
      counts[c] += add;
      allocated += add;
    }
    remaining -= allocated;
    if (!remaining) break;
    ideals.sort((a, b) =>
      (b.exact % 1) - (a.exact % 1) ||
      weights[b.c] - weights[a.c] ||
      FEED_CATEGORIES.indexOf(a.c) - FEED_CATEGORIES.indexOf(b.c)
    );
    // Award each remainder once before recalculating after inventory caps.
    for (const { c } of ideals) {
      if (!remaining) break;
      if (counts[c] >= (capacity[c] || 0)) continue;
      counts[c] += 1;
      remaining -= 1;
    }
  }
  return counts;
}

function recommendPage(items, weights, { limit = 12, type = 'all', excludeIds = [], recentIds = [], seed = 0 } = {}) {
  const excluded = new Set(excludeIds);
  const unique = new Set();
  const pool = items.filter(item => {
    if (!item?.id || unique.has(item.id)) return false;
    unique.add(item.id);
    return !excluded.has(item.id) && weights[item.category] > 0 && (type === 'all' || item.type === type);
  });
  const recentRank = new Map(recentIds.map((id, index) => [id, index]));
  const buckets = {};
  const capacity = {};
  for (const c of FEED_CATEGORIES) {
    buckets[c] = pool.filter(item => item.category === c).sort((a, b) => {
      const aRank = recentRank.has(a.id) ? recentRank.get(a.id) : -1;
      const bRank = recentRank.has(b.id) ? recentRank.get(b.id) : -1;
      return aRank - bRank || shuffledTieRank(a.id, seed) - shuffledTieRank(b.id, seed);
    });
    capacity[c] = buckets[c].length;
  }
  const quotas = allocateAvailableSlots(weights, capacity, limit);
  const order = [...FEED_CATEGORIES].sort((a, b) =>
    weights[b] - weights[a] || FEED_CATEGORIES.indexOf(a) - FEED_CATEGORIES.indexOf(b)
  );
  const selected = [];
  let round = 0;
  let any = true;
  while (any) {
    any = false;
    for (const c of order) {
      if (round < quotas[c]) {
        selected.push(buckets[c][round]);
        any = true;
      }
    }
    round++;
  }
  return { cards: selected, available: pool.length, remaining: pool.length - selected.length, quotas };
}

// Oldest -> newest. Previously shown cards can gradually return after
// the finite catalog is exhausted rather than repeating immediately.
function updateRecentFeed(previous, newIds, maxLength = 120) {
  const next = [...previous.filter(id => !newIds.includes(id)), ...newIds];
  return [...new Set(next)].slice(-maxLength);
}

var Yp = Object.defineProperty;
var Xp = (i, e, t) => e in i ? Yp(i, e, { enumerable: true, configurable: true, writable: true, value: t }) : i[e] = t;
var j = (i, e, t) => Xp(i, typeof e != "symbol" ? e + "" : e, t);
(function() {
  const e = document.createElement("link").relList;
  if (e && e.supports && e.supports("modulepreload")) return;
  for (const r of document.querySelectorAll('link[rel="modulepreload"]')) n(r);
  new MutationObserver((r) => {
    for (const s of r) if (s.type === "childList") for (const o of s.addedNodes) o.tagName === "LINK" && o.rel === "modulepreload" && n(o);
  }).observe(document, { childList: true, subtree: true });
  function t(r) {
    const s = {};
    return r.integrity && (s.integrity = r.integrity), r.referrerPolicy && (s.referrerPolicy = r.referrerPolicy), r.crossOrigin === "use-credentials" ? s.credentials = "include" : r.crossOrigin === "anonymous" ? s.credentials = "omit" : s.credentials = "same-origin", s;
  }
  function n(r) {
    if (r.ep) return;
    r.ep = true;
    const s = t(r);
    fetch(r.href, s);
  }
})();
const Bf = "mamgorithm_lang_v1", Fc = { ko: { brand: { title: "맘고리즘", sub: "내맘대로 추천 피드", badge: "My-gorithm" }, header: { installApp: "맘고리즘 앱 설치", quickTune: "알고리즘 비율 조절", langToggleTitle: "언어 변경 (KO / EN)", langLabel: "KO", authBtn: "로그인" }, auth: { signIn: "로그인", signOut: "로그아웃", account: "내 계정", skip: "닫기", modalTitle: "맘고리즘", modalSubtitle: "내 취향대로 튜닝하는 알고리즘 피드", googleSignIn: "Google 계정으로 계속하기", guestContinue: "로그인 없이 둘러보기", loginSuccess: "{name}님, 환영합니다!", logoutSuccess: "로그아웃되었습니다.", loginFailed: "로그인에 실패했습니다. 다시 시도해주세요.", statsBannerTitle: "Google 계정 연동", statsBannerDesc: "로그인하면 다른 기기에서도 튜닝 비율이 유지됩니다.", btnSyncLogin: "로그인", syncActive: "클라우드 연동됨" }, splash: { title: "맘고리즘", sub: "내맘대로 추천 피드" }, intro: { brand: "맘고리즘", startWithSound: "소리와 함께 시작", skip: "건너뛰기", soundOn: "소리 켬", soundOff: "음소거" }, banner: { main: "맘고리즘 앱으로 더 쾌적하게", sub: "홈 화면에 추가해 1초 만에 실행하세요", install: "앱 설치" }, feed: { all: "전체", video: "영상", article: "기사", refresh: "새로고침", emptyTitle: "관심 분야가 모두 꺼져 있습니다", emptyDesc: "맘고리즘은 사용자가 원하는 분야만 추천합니다.<br/>하단 미니 독을 터치해 관심 분야를 1% 이상으로 올려보세요.", restoreBalance: "균형 모드로 켜기", infiniteLoading: "내 알고리즘 맞춤 콘텐츠 탐색 중...", infiniteLoadingSub: "실시간 가중치 기반 다음 피드 로딩" }, presets: { balanced: { name: "균형 모드", desc: "모든 분야를 골고루" }, growth: { name: "커리어·성장", desc: "공부와 기술 집중" }, healing: { name: "휴식·힐링", desc: "문화와 취미 위주" }, studyOnly: { name: "학습 집중", desc: "오직 공부 콘텐츠만" } }, categories: { study: { name: "공부", shortTag: "학습 · 교양", desc: "학습법, 인문·교양 지식" }, tech: { name: "기술", shortTag: "IT · 트렌드", desc: "AI, 개발, IT 트렌드" }, culture: { name: "문화", shortTag: "예술 · 라이프", desc: "문화, 예술 트렌드" }, hobby: { name: "취미", shortTag: "액티비티 · 일상", desc: "운동, 가드닝, 쿠킹" } }, cards: { badgeNew: "NEW", bookmarkSave: "보관함에 저장", bookmarkRemove: "보관함에서 제거", sourceLabel: "출처", minRead: "분 읽기", video: "영상", article: "기사" }, tabs: { feed: "피드", stats: "내 알고리즘", saved: "보관함" }, dock: { tune: "튜닝", title: "알고리즘 믹서", desc: "슬라이더를 조절하면 피드에 즉시 반영됩니다.", tooltip: "믹서 사용 팁", shareRecipe: "현재 알고리즘 레시피 공유", reset: "균형 리셋", close: "믹서 닫기", allZeroAlert: "모든 분야가 0%입니다. 최소 1개 이상의 관심도를 올려주세요.", allExcluded: "모든 분야 제외됨 (터치하여 설정)", apply: "피드 확인하기" }, sliders: { ticks: { 0: "제외", 25: "낮음", 50: "보통", 75: "높음", 100: "최대" }, levels: { 0: { label: "제외", desc: "피드에서 숨김" }, 25: { label: "조금", desc: "가끔 1~2개 추천" }, 50: { label: "보통", desc: "균형 있게 추천" }, 75: { label: "선호", desc: "자주 추천" }, 100: { label: "집중", desc: "피드 최우선 배치" } } }, stats: { title: "내 알고리즘 분석", subtitle: "맘고리즘의 추천 공식과 현재 설정된 가중치를 투명하게 공개합니다.", shareTitle: "내 알고리즘 레시피 공유", shareDesc: "내가 튜닝한 관심도 비율을 친구에게 링크로 전달해보세요. 친구가 링크를 열면 내 설정이 그대로 반영됩니다.", shareBtn: "현재 레시피 링크 복사 및 공유", calcTitle: "추천 계산 메커니즘", calcDesc: "맘고리즘은 사용자의 머무는 시간이나 광고 수익에 기반한 <strong>중독형 블랙박스 알고리즘을 사용하지 않습니다.</strong>", formula: "추천 비율(%) = (카테고리 설정값 ÷ 전체 가중치 합) × 100", formulaSub: "설정값이 0%인 분야는 추천 피드에서 100% 원천 배제되며, 1% 이상으로 지정한 분야만 비율에 맞추어 균등하게 교차 배치됩니다.", tableTitle: "현재 가중치 배분표", thCategory: "분야", thWeight: "설정 가중치", thRatio: "추천 비율", thCards: "피드 카드 수", cardsUnit: "장", replayTitle: "시작 화면 및 안내 다시 보기", replayDesc: "처음 접속했을 때의 인터랙티브 알고리즘 튜닝과 미니 독 사용 가이드를 홈 화면으로 자동 이동하여 다시 체험할 수 있습니다.", btnLightIntro: "라이트 인트로 재생", btnDarkIntro: "다크 인트로 재생", btnOnboarding: "시작 화면(온보딩) 열기", btnCoachmark: "미니 독 튜닝 안내(코치마크)", addCardTitle: "새 콘텐츠 카드 추가", addCardDesc: "원하는 유튜브 영상이나 아티클 정보를 입력하여 추천 풀에 즉시 새로운 카드를 추가할 수 있습니다.", labelCategory: "카테고리 분야", labelType: "콘텐츠 유형", labelTitle: "카드 제목", placeholderTitle: "예: 2026 반드시 알아야 할 디자인 시스템 트렌드", labelSummary: "요약 설명 (2줄 내외)", placeholderSummary: "핵심 내용을 간결하게 입력하세요", labelSource: "출처 / 채널명", placeholderSource: "예: YouTube · 디자인 채널", labelUrl: "연결 URL (유튜브 또는 원문 링크)", btnAddCard: "새 카드 피드에 추가하기", btnResetCards: "추가한 카드 초기화", customCardPill: "추가된 카드 {count}장" }, saved: { title: "보관함", subtitle: "북마크한 기사와 영상을 나중에 다시 찾아볼 수 있습니다.", clearAll: "전체 비우기", emptyTitle: "보관한 콘텐츠가 없습니다", emptyDesc: "피드 카드의 북마크 버튼을 누르면<br/>나중에 다시 읽고 싶은 콘텐츠가 이곳에 저장됩니다." }, onboarding: { title: "내 취향대로 맞추는 피드", desc: "관심 있는 분야의 슬라이더를 손끝으로 가볍게 튜닝해보세요.", presetsTitle: "빠른 프리셋", gaugeTitle: "실시간 추천 비율", haptic: "햅틱 피드백", start: "이 설정으로 내 피드 열기" }, video: { youtubeOriginal: "YouTube 원본", feedbackTitle: "추천 알고리즘 피드백", feedbackDesc: "이 영상이 마음에 드셨다면 해당 분야의 관심도를 높여보세요.", tuneBtn: "비율 조절" }, reader: { keyPointsTitle: "3줄 핵심 요약", recomReason: "맘고리즘 추천 이유", visitOriginal: "원문 방문", visitOriginalFull: "원문 사이트 방문하기", feedbackTitle: "{category} 알고리즘 피드백", feedbackDesc: "이 기사가 유익하셨다면 알고리즘 믹서에서 {category} 비율을 높여보세요.", backToFeed: "피드로 돌아가기", notice: "※ 외부 사이트의 보안 설정이나 모바일 네트워크 환경에 따라 링크 연결이 지연될 경우, 위 인앱 리더의 핵심 요약과 상세 본문에서 전문을 바로 확인하실 수 있습니다." }, coachmark: { badge1: "TIP · 1 / 2", title1: "하단 미니 독으로 언제든 조절하세요", desc1: "피드를 탐색하다가 언제든 하단 바를 살짝 위로 올리면 4개 분야의 추천 비율을 실시간으로 믹싱할 수 있습니다.", badge2: "TIP · 2 / 2", title2: "원터치 프리셋 & 셔플", desc2: "상황에 맞는 프리셋 버튼을 눌러 분위기를 바꾸거나, 새로고침(셔플)으로 새로운 조합을 즉시 탐색해보세요.", skip: "건너뛰기", next: "다음", start: "시작하기" }, confirm: { title: "확인", defaultDesc: "정말 진행하시겠습니까?", cancel: "취소", ok: "확인", resetTitle: "알고리즘 균형 재설정", resetDesc: "모든 분야 관심도를 50% 균등 분배로 재설정하시겠습니까?", resetConfirm: "재설정", clearSavedTitle: "보관함 전체 비우기", clearSavedDesc: "보관함에 저장된 콘텐츠 {count}개를 모두 삭제하시겠습니까?", clearSavedConfirm: "전체 삭제", resetCardsTitle: "직접 추가한 카드 초기화", resetCardsDesc: "사용자가 직접 추가한 콘텐츠 카드 {count}장을 모두 삭제하고 기본 데이터셋으로 되돌리시겠습니까?", resetCardsConfirm: "초기화" }, iosInstall: { title: "홈 화면에 맘고리즘 추가하기", desc: "Safari에서 3초 만에 앱처럼 전체 화면으로 등록할 수 있습니다.", step1: "Safari 하단 메뉴의 <strong>공유 버튼</strong>을 탭합니다.", step2: "메뉴를 아래로 내려 <strong>'홈 화면에 추가'</strong>를 선택합니다.", step3: "우측 상단의 <strong>'추가'</strong>를 누르면 홈 화면에 앱이 설치됩니다!", done: "확인했습니다" }, tooltip: { stats: "맘고리즘은 전체 가중치 합산 대비 각 분야의 비율을 최대 잔여수(Largest Remainder) 방식으로 정밀 계산하여 피드 12장의 구성을 투명하게 맞춥니다.", mixer: "슬라이더를 1% 단위로 조절하면 다른 분야와의 상대 비율이 실시간 계산됩니다. 0%로 맞춘 분야는 피드에서 100% 원천 배제됩니다." }, toast: { langSwitched: "한국어로 설정되었습니다.", recipeApplied: "공유받은 알고리즘 레시피가 적용되었습니다.", recipeCopied: "알고리즘 레시피 링크가 복사되었습니다.", balancedApplied: "균형 모드가 적용되었습니다.", presetApplied: "{preset} 설정이 적용되었습니다.", balancedReset: "모든 분야 관심도를 50% 균등으로 재설정했습니다.", saved: "보관함에 저장되었습니다.", removed: "보관함에서 제거되었습니다.", restored: "보관함에 다시 복원되었습니다.", allRestored: "보관함 콘텐츠가 모두 복원되었습니다.", cleared: "보관함이 모두 비워졌습니다.", undo: "실행 취소", allClearedCount: "{count}개의 콘텐츠가 모두 삭제되었습니다.", zeroWarning: "모든 분야가 0%입니다. 관심도를 1% 이상 올려주세요.", shuffled: "새로운 추천 콘텐츠 조합을 불러왔습니다.", titleRequired: "카드 제목과 핵심 요약을 입력해주세요.", cardAdded: "새로운 {category} 카드가 피드에 추가되었습니다.", cardsReset: "직접 추가한 카드가 모두 초기화되었습니다.", appInstalled: "맘고리즘 앱이 성공적으로 설치되었습니다!", iosGuide: "Safari 공유 메뉴에서 [홈 화면에 추가]를 선택하세요.", online: "네트워크가 정상적으로 다시 연결되었습니다.", offline: "네트워크 연결이 끊겼습니다. 오프라인 모드로 실행됩니다.", shareMsg: "내가 직접 튜닝한 맘고리즘 추천 비율 (공부 {study}% · 기술 {tech}% · 문화 {culture}% · 취미 {hobby}%)을 확인해보세요!", sharePrompt: "아래 링크를 복사하여 공유하세요:", onboardingFeedReady: "내 맞춤 추천 피드가 열렸습니다.", appUpdated: "새로운 기능과 디자인이 업데이트되었습니다.", reload: "새로고침" } }, en: { brand: { title: "My-gorithm", sub: "User-Driven Recommendation Feed", badge: "My-gorithm" }, header: { installApp: "Install My-gorithm App", quickTune: "Tune Algorithm Mixer", langToggleTitle: "Change Language (KO / EN)", langLabel: "EN", authBtn: "Sign In" }, auth: { signIn: "Sign In", signOut: "Sign Out", account: "Account", skip: "Close", modalTitle: "My-gorithm", modalSubtitle: "Tune your recommendation feed your way", googleSignIn: "Continue with Google", guestContinue: "Browse without logging in", loginSuccess: "Welcome, {name}!", logoutSuccess: "Signed out successfully.", loginFailed: "Login failed. Please try again.", statsBannerTitle: "Connect Google Account", statsBannerDesc: "Sign in to keep your tuning ratio across all devices.", btnSyncLogin: "Sign In", syncActive: "Cloud synced" }, splash: { title: "My-gorithm", sub: "User-Driven Recommendation Feed" }, intro: { brand: "My-gorithm", startWithSound: "Start with Sound", skip: "Skip", soundOn: "Sound On", soundOff: "Mute" }, banner: { main: "Experience More with App", sub: "Add to home screen for instant 1-second launch", install: "Install" }, feed: { all: "All", video: "Video", article: "Article", refresh: "Refresh", emptyTitle: "All categories are turned off", emptyDesc: "My-gorithm only recommends what you want to see.<br/>Tap the mini dock below and raise any category above 1%.", restoreBalance: "Turn on Balanced Mode", infiniteLoading: "Discovering more personalized content...", infiniteLoadingSub: "Loading next feed batch by real-time weights" }, presets: { balanced: { name: "Balanced", desc: "Even mix across all fields" }, growth: { name: "Career & Growth", desc: "Focus on Study & Tech" }, healing: { name: "Rest & Chill", desc: "Culture & Hobby focused" }, studyOnly: { name: "Deep Study", desc: "Exclusively Study content" } }, categories: { study: { name: "Study", shortTag: "Learning & Culture", desc: "Study methods, humanities & culture" }, tech: { name: "Tech", shortTag: "IT & Trends", desc: "AI, engineering & tech trends" }, culture: { name: "Culture", shortTag: "Arts & Life", desc: "Culture, arts & modern life" }, hobby: { name: "Hobby", shortTag: "Activity & Daily", desc: "Sports, cooking & lifestyle" } }, cards: { badgeNew: "NEW", bookmarkSave: "Save to bookmarks", bookmarkRemove: "Remove from bookmarks", sourceLabel: "Source", minRead: "min read", video: "Video", article: "Article" }, tabs: { feed: "Feed", stats: "My Algorithm", saved: "Bookmarks" }, dock: { tune: "Tune", title: "Algorithm Mixer", desc: "Adjust sliders to instantly shape your recommendation feed.", tooltip: "Mixer tips", shareRecipe: "Share current algorithm recipe", reset: "Reset to balance", close: "Close mixer", allZeroAlert: "All categories are 0%. Please raise at least one above 0%.", allExcluded: "All topics off (tap to configure)", apply: "View Feed" }, sliders: { ticks: { 0: "Off", 25: "Low", 50: "Mid", 75: "High", 100: "Max" }, levels: { 0: { label: "Exclude", desc: "Hidden from feed" }, 25: { label: "Low", desc: "1~2 cards occasionally" }, 50: { label: "Normal", desc: "Balanced recommendation" }, 75: { label: "Preferred", desc: "Frequent recommendations" }, 100: { label: "Focus", desc: "Top priority in feed" } } }, stats: { title: "My Algorithm Insights", subtitle: "Transparent recommendation formula and live weights breakdown.", shareTitle: "Share My Algorithm Recipe", shareDesc: "Send your customized interest ratio to friends with a single link. When opened, your settings apply immediately.", shareBtn: "Copy & Share Recipe Link", calcTitle: "Recommendation Mechanism", calcDesc: "My-gorithm <strong>does not use addictive black-box algorithms</strong> designed to maximize screen time or ad profits.", formula: "Target Ratio (%) = (Category Weight ÷ Total Weights Sum) × 100", formulaSub: "Categories set to 0% are 100% excluded. Only categories with 1%+ are evenly interleaved according to their ratio.", tableTitle: "Current Weight Allocation", thCategory: "Category", thWeight: "Set Weight", thRatio: "Target Ratio", thCards: "Feed Cards", cardsUnit: " cards", replayTitle: "Replay Intro & Guides", replayDesc: "Experience the interactive algorithm onboarding and mini dock guide again.", btnLightIntro: "Play Light Intro", btnDarkIntro: "Play Dark Intro", btnOnboarding: "Open Onboarding", btnCoachmark: "Mini Dock Guide", addCardTitle: "Add New Content Card", addCardDesc: "Add YouTube videos or articles directly into your recommendation pool.", labelCategory: "Category", labelType: "Content Type", labelTitle: "Card Title", placeholderTitle: "e.g. 2026 Key Design System Trends", labelSummary: "Summary (about 2 lines)", placeholderSummary: "Enter concise highlights of the content", labelSource: "Source / Channel", placeholderSource: "e.g. YouTube · Design Channel", labelUrl: "Link URL (YouTube or Article link)", btnAddCard: "Add Card to Feed", btnResetCards: "Reset Added Cards", customCardPill: "{count} custom card(s)" }, saved: { title: "Bookmarks", subtitle: "Read or watch saved content whenever you are ready.", clearAll: "Clear All", emptyTitle: "No saved content yet", emptyDesc: "Tap the bookmark icon on feed cards<br/>to save articles and videos here for later." }, onboarding: { title: "Tune Feeds to Your Taste", desc: "Freely adjust the topic sliders with your fingertips.", presetsTitle: "Quick Presets", gaugeTitle: "Live Recommendation Ratio", haptic: "Haptic Feedback", start: "Open Feed with These Settings" }, video: { youtubeOriginal: "YouTube Original", feedbackTitle: "Algorithm Feedback", feedbackDesc: "If you enjoyed this video, increase its topic weight in the mixer.", tuneBtn: "Tune Ratio" }, reader: { keyPointsTitle: "3-Line Summary", recomReason: "Why Recommended", visitOriginal: "Visit Original", visitOriginalFull: "Visit Original Website", feedbackTitle: "{category} Algorithm Feedback", feedbackDesc: "If this article was insightful, raise {category} weight in the mixer.", backToFeed: "Back to Feed", notice: "※ If external web loading is slow, you can read the complete summary and structured text directly inside this in-app reader." }, coachmark: { badge1: "TIP · 1 / 2", title1: "Adjust Anytime with the Mini Dock", desc1: "Whenever you want to switch topics, simply slide up the bottom mini dock to reshape your feed in real-time.", badge2: "TIP · 2 / 2", title2: "One-Touch Presets & Shuffle", desc2: "Tap preset buttons to instantly adapt your feed mood, or hit shuffle to explore fresh content mixes.", skip: "Skip", next: "Next", start: "Get Started" }, confirm: { title: "Confirm", defaultDesc: "Are you sure you want to proceed?", cancel: "Cancel", ok: "Confirm", resetTitle: "Reset Algorithm Balance", resetDesc: "Reset all category weights back to 50% equal balance?", resetConfirm: "Reset", clearSavedTitle: "Clear Entire Bookmarks", clearSavedDesc: "Delete all {count} saved items from your bookmarks?", clearSavedConfirm: "Clear All", resetCardsTitle: "Reset Custom Cards", resetCardsDesc: "Delete all {count} custom content cards and revert to default pool?", resetCardsConfirm: "Reset" }, iosInstall: { title: "Add My-gorithm to Home Screen", desc: "Launch in full screen like a native app in 3 seconds via Safari.", step1: "Tap the <strong>Share button</strong> in Safari bottom menu.", step2: "Scroll down and select <strong>'Add to Home Screen'</strong>.", step3: "Tap <strong>'Add'</strong> on top right to install on your home screen!", done: "Got it" }, tooltip: { stats: "My-gorithm calculates transparent 12-card proportions via the Largest Remainder method relative to total weights sum.", mixer: "Adjusting sliders at 1% increments recalculates live proportions. Categories set to 0% are 100% excluded." }, toast: { langSwitched: "Language switched to English.", recipeApplied: "Shared algorithm recipe applied.", recipeCopied: "Algorithm recipe link copied to clipboard.", balancedApplied: "Balanced mode applied.", presetApplied: "{preset} preset applied.", balancedReset: "Reset all category weights to 50% equal balance.", saved: "Saved to bookmarks.", removed: "Removed from bookmarks.", restored: "Restored to bookmarks.", allRestored: "All bookmarks restored.", cleared: "All bookmarks cleared.", undo: "Undo", allClearedCount: "All {count} content items were deleted.", zeroWarning: "All categories are 0%. Please raise at least one.", shuffled: "Loaded a fresh combination of recommendations.", titleRequired: "Please enter card title and summary.", cardAdded: "New {category} card added to feed.", cardsReset: "Custom cards have been reset.", appInstalled: "My-gorithm app installed successfully!", iosGuide: "Select [Add to Home Screen] from the Safari Share menu.", online: "Network connection restored.", offline: "You are offline. Running in offline cache mode.", shareMsg: "Check out my custom My-gorithm recommendation mix (Study {study}% · Tech {tech}% · Culture {culture}% · Hobby {hobby}%)!", sharePrompt: "Copy the link below to share:", onboardingFeedReady: "Your personalized feed is now live.", appUpdated: "New features and improvements updated.", reload: "Reload" } } };
let qt = "ko";
const Zp = /* @__PURE__ */ new Set();
function eC() {
  try {
    if (typeof localStorage < "u") {
      const i = localStorage.getItem(Bf);
      i && (i === "ko" || i === "en") ? qt = i : typeof navigator < "u" && (qt = (navigator.language || "").toLowerCase().startsWith("ko") ? "ko" : "en");
    }
  } catch {
    qt = "ko";
  }
  return typeof document < "u" && document.documentElement && (document.documentElement.lang = qt), qt;
}
function Zn() {
  return qt;
}
function tC(i) {
  i !== "ko" && i !== "en" && (i = "ko"), qt = i;
  try {
    typeof localStorage < "u" && localStorage.setItem(Bf, i);
  } catch {
  }
  return typeof document < "u" && document.documentElement && (document.documentElement.lang = i), Zp.forEach((e) => {
    try {
      e(qt);
    } catch (t) {
      console.error(t);
    }
  }), qt;
}
function nC() {
  return tC(qt === "ko" ? "en" : "ko");
}
function P(i, e = {}) {
  const t = Fc[qt] || Fc.ko, n = i.split(".");
  let r = t;
  for (const o of n) if (r && typeof r == "object" && o in r) r = r[o];
  else {
    let c = Fc.ko;
    for (const l of n) if (c && typeof c == "object" && l in c) c = c[l];
    else return i;
    r = c;
    break;
  }
  if (typeof r != "string") return i;
  let s = r;
  for (const [o, c] of Object.entries(e)) s = s.replace(new RegExp(`\\{${o}\\}`, "g"), c);
  return s;
}
function hf(i = document) {
  if (!i) return;
  i.querySelectorAll("[data-i18n]").forEach((t) => {
    const n = t.dataset.i18n;
    n && (t.innerHTML = P(n));
  }), i.querySelectorAll("[data-i18n-placeholder]").forEach((t) => {
    const n = t.dataset.i18nPlaceholder;
    n && (t.placeholder = P(n));
  }), i.querySelectorAll("[data-i18n-title]").forEach((t) => {
    const n = t.dataset.i18nTitle;
    n && (t.title = P(n));
  }), i.querySelectorAll("[data-i18n-aria]").forEach((t) => {
    const n = t.dataset.i18nAria;
    n && t.setAttribute("aria-label", P(n));
  });
  const e = document.getElementById("currentLangLabel");
  e && (e.textContent = qt.toUpperCase());
}
const Me = { study: { id: "study", get name() {
  return P("categories.study.name");
}, get shortTag() {
  return P("categories.study.shortTag");
}, color: "#4338CA", tagBg: "#E0E7FF", tagText: "#312E81", border: "#818CF8", solidBg: "#4338CA", solidText: "#FFFFFF", solidBorder: "#4338CA", darkSolidBg: "#3730A3", darkSolidBorder: "#4F46E5", glowShadow: "rgba(67, 56, 202, 0.28)", get description() {
  return P("categories.study.desc");
}, iconSvg: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>' }, tech: { id: "tech", get name() {
  return P("categories.tech.name");
}, get shortTag() {
  return P("categories.tech.shortTag");
}, color: "#0284C7", tagBg: "#E0F2FE", tagText: "#075985", border: "#38BDF8", solidBg: "#0284C7", solidText: "#FFFFFF", solidBorder: "#0284C7", darkSolidBg: "#0369A1", darkSolidBorder: "#0284C7", glowShadow: "rgba(2, 132, 199, 0.28)", get description() {
  return P("categories.tech.desc");
}, iconSvg: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>' }, culture: { id: "culture", get name() {
  return P("categories.culture.name");
}, get shortTag() {
  return P("categories.culture.shortTag");
}, color: "#BE185D", tagBg: "#FFE4E6", tagText: "#881337", border: "#FB7185", solidBg: "#BE185D", solidText: "#FFFFFF", solidBorder: "#BE185D", darkSolidBg: "#9F1239", darkSolidBorder: "#BE185D", glowShadow: "rgba(190, 24, 93, 0.28)", get description() {
  return P("categories.culture.desc");
}, iconSvg: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle></svg>' }, hobby: { id: "hobby", get name() {
  return P("categories.hobby.name");
}, get shortTag() {
  return P("categories.hobby.shortTag");
}, color: "#059669", tagBg: "#D1FAE5", tagText: "#064E3B", border: "#34D399", solidBg: "#059669", solidText: "#FFFFFF", solidBorder: "#059669", darkSolidBg: "#047857", darkSolidBorder: "#059669", glowShadow: "rgba(5, 150, 105, 0.28)", get description() {
  return P("categories.hobby.desc");
}, iconSvg: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>' } };
function df(i) {
  var o;
  const e = Me[i.category] ? i.category : "study", t = i.type === "video" ? "video" : "article", n = { study: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80", tech: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80", culture: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80", hobby: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&auto=format&fit=crop&q=80" };
  let r = i.youtubeId || "";
  if (t === "video" && !r && i.url) {
    const c = i.url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    c && (r = c[1]);
  }
  const s = ((o = i.imageUrl) == null ? void 0 : o.trim()) || (r ? `https://i.ytimg.com/vi/${r}/hqdefault.jpg` : n[e]);
  return { id: i.id || `${e}-custom-${Date.now()}`, category: e, type: t, isNew: i.isNew !== void 0 ? !!i.isNew : true, title: (i.title || "새 추천 콘텐츠").trim(), summary: (i.summary || "사용자 맞춤형으로 추가된 추천 콘텐츠입니다.").trim(), source: (i.source || (t === "video" ? "YouTube · 추천 채널" : "추천 아티클")).trim(), duration: (i.duration || (t === "video" ? "10:00" : "5분 읽기")).trim(), date: (i.date || "신규 등록").trim(), imageUrl: s, youtubeId: r, url: (i.url || "https://my-gorithm.web.app").trim(), recommendationReason: i.recommendationReason || `${Me[e].name} 분야 관심도 설정에 따라 우선 배정된 신규 콘텐츠입니다.`, keyPoints: Array.isArray(i.keyPoints) && i.keyPoints.length > 0 ? i.keyPoints : [(i.summary || "핵심 요약 내용을 확인해보세요.").trim(), `카테고리: ${Me[e].name} (${Me[e].description})`, "원문 방문 버튼을 통해 전체 상세 내용을 확인하실 수 있습니다."], sections: Array.isArray(i.sections) && i.sections.length > 0 ? i.sections : [{ heading: i.title || "콘텐츠 핵심 내용", body: i.summary || "사용자 맞춤형으로 추가된 추천 콘텐츠입니다." }] };
}
const ds = { 0: { get label() {
  return P("sliders.levels.0.label");
}, get desc() {
  return P("sliders.levels.0.desc");
} }, 25: { get label() {
  return P("sliders.levels.25.label");
}, get desc() {
  return P("sliders.levels.25.desc");
} }, 50: { get label() {
  return P("sliders.levels.50.label");
}, get desc() {
  return P("sliders.levels.50.desc");
} }, 75: { get label() {
  return P("sliders.levels.75.label");
}, get desc() {
  return P("sliders.levels.75.desc");
} }, 100: { get label() {
  return P("sliders.levels.100.label");
}, get desc() {
  return P("sliders.levels.100.desc");
} } };
function iC(i) {
  return i <= 0 ? ds[0] : i <= 25 ? ds[25] : i <= 60 ? ds[50] : i <= 85 ? ds[75] : ds[100];
}
const rC = CONTENT_DATA, Fs = [{ id: "balanced", get name() {
  return P("presets.balanced.name");
}, get desc() {
  return P("presets.balanced.desc");
}, weights: { study: 50, tech: 50, culture: 50, hobby: 50 } }, { id: "growth", get name() {
  return P("presets.growth.name");
}, get desc() {
  return P("presets.growth.desc");
}, weights: { study: 80, tech: 80, culture: 20, hobby: 0 } }, { id: "healing", get name() {
  return P("presets.healing.name");
}, get desc() {
  return P("presets.healing.desc");
}, weights: { study: 0, tech: 20, culture: 80, hobby: 80 } }, { id: "studyOnly", get name() {
  return P("presets.studyOnly.name");
}, get desc() {
  return P("presets.studyOnly.desc");
}, weights: { study: 100, tech: 0, culture: 0, hobby: 0 } }], sC = { "tech-1": { title: "Toss Shopping Recommendation Engine: Matching Millions of Users to Relevant Products", summary: "A look into real-time collaborative filtering and deep retrieval models that curate optimal product streams without cluttering user experience.", source: "Toss Tech", date: "3d ago", recommendationReason: "Provides insight into production-scale e-commerce ML pipelines and two-tower recommendation architectures.", keyPoints: ["Multi-stage recommendation funnel: Candidate generation (Recall) -> Ranking -> Business logic re-ranking.", "Balancing exploitation of known user preferences with serendipitous exploration of new merchandise categories.", "Real-time streaming features utilizing user dwell time and immediate add-to-cart signals."], sections: [{ heading: "The Core Philosophy of Discovery-Driven Shopping", body: "Unlike search-driven commerce where users know exactly what product model they seek, recommendation feeds cater to browsing users. The system must anticipate unspoken intent through subtle behavioral signals like scroll deceleration and dwell time without showing repetitive clutter." }, { heading: "Architecture of the Multi-Stage Funnel", body: "Processing millions of items in under 50 milliseconds requires a funnel architecture. Lightweight vector similarity searches (ANN) first narrow millions of items down to several hundred candidates. Then, a deep ranking model calculates exact click-through and purchase probabilities." }, { heading: "Continuous A/B Experimentation and Experience Guardrails", body: "A recommendation system is never static. Continuous online bandit testing balances familiar bestsellers with fresh discovery candidates, backed by algorithmic rules that prevent visual fatigue and redundant merchant exposure." }] }, "tech-2": { title: "Why Apple Music Shook Its Logo Like Liquid: The Art of Dynamic Motion Design", summary: "Analyzing the physics and emotional resonance behind Apple Music's animated fluid branding and kinetic identity system.", source: "YouTube · Toss Tech", date: "Must Watch", recommendationReason: "Explore how micro-animations and physics simulations communicate brand emotion in modern UI design." }, "tech-3": { title: "Modern Responsive Web Design: Clean Layouts with CSS Grid, Container Queries & Fluid Units", summary: "A practical architecture guide to building scalable, adaptive interfaces without relying on bloated media query chains.", source: "Toss Tech", date: "2d ago", recommendationReason: "Essential layout strategies for modern web developers targeting diverse mobile, tablet, and desktop viewports.", keyPoints: ["Mobile-First design philosophy cuts decorative excess to prioritize essential content hierarchy.", "CSS Grid minmax() and repeat(auto-fill, ...) construct fluid card grids with zero breakpoint overhead.", "Adopting dynamic viewport units (100dvh) and env(safe-area-inset) solves mobile browser URL bar shifting."], sections: [{ heading: "The Less-is-More Philosophy Starting on Mobile", body: "Starting on desktop canvases tempts designers to fill empty space with unnecessary sidebars and decorative widgets. Designing for 390px mobile viewports first forces focus on the fundamental question: What is the most immediate value for the user?" }, { heading: "Modern CSS Techniques Reducing Media Query Clutter", body: "Modern CSS leverages inherent layout flexibility. The pattern `grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))` dynamically arranges cards across 1, 2, or 3 columns based on available container width, eliminating brittle breakpoint rules." }, { heading: "New Standards for Mobile Viewports: dvh and Safe Areas", body: "Mobile browser address bars expand and collapse during scroll, breaking legacy 100vh calculations. Today, production applications must utilize 100dvh along with `env(safe-area-inset-bottom)` to prevent buttons from hiding behind native browser chrome." }] }, "tech-4": { title: "Python Programming Crash Course: From Core Syntax to Practical Automation in 5 Hours", summary: "A fast-paced hands-on guide covering variables, lists, dictionaries, functions, web scraping, and office task automation.", source: "YouTube · JoCoding", date: "Featured Video", recommendationReason: "Perfect foundational course for beginners aiming to automate repetitive desktop workflows." }, "tech-5": { title: "Prolonging Smartphone Battery Health: The Chemistry of Lithium-Ion Degradation", summary: "Understanding electrochemical aging in lithium-ion cells, thermal throttling, and practical charging habits to double battery cycle longevity.", source: "Samsung Support · Battery Care", date: "4d ago", recommendationReason: "Practical advice on device care, charging limits, and thermal management to protect battery capacity and prevent OLED burn-in.", keyPoints: ["Lithium-ion cells endure maximum chemical stress at extreme states of charge (0% deep discharge or 100% full charge).", "Maintaining charge levels between 20% and 80% can extend battery lifespan cycles by over twofold.", "Managing heat dissipation during fast charging is paramount to prevent electrolyte breakdown and display degradation."], sections: [{ heading: "Charge Cycles and Electrochemical Degradation", body: "Lithium-ion batteries operate via ion transfer between cathode and anode. At 0% deep discharge, the copper current collector risks dissolution, while sustaining 100% high voltage causes electrolyte decomposition and gas generation. Capping charging at 80~85% preserves long-term cell integrity." }, { heading: "Heat: The Common Enemy of Batteries and Displays", body: "The real danger of fast charging is concurrent temperature rise. Running high-end 3D graphics or recording 4K video while charging exposes cells to temperatures above 45°C, accelerating permanent capacity loss and speeding up OLED organic sub-pixel burn-in." }, { heading: "Three Practical Habits for Everyday Battery Health", body: 'First, enable "Protect Battery" mode when charging overnight. Second, avoid fast charging under direct sunlight or inside thick insulated cases. Third, plug into a charger before remaining battery drops below the 20% warning threshold.' }] }, "tech-6": { title: "Git & GitHub Collaboration Mastery: Version Control, Branches & Conflict Resolution", summary: "Essential team workflows from remote repository hygiene to Pull Request code reviews and resolving merge conflicts cleanly.", source: "YouTube · Quick Coding Guide", date: "Must Watch", recommendationReason: "A must-watch masterclass for engineers collaborating on shared production codebases." }, "tech-7": { title: "Kakao Kanana Technical Report: The Future of On-Device AI and Small Language Models", summary: "How lightweight language model architectures run locally on mobile silicon to preserve privacy and enable real-time interaction.", source: "Kakao Tech", date: "Yesterday", recommendationReason: "Deep dive into mobile neural processing architectures and the paradigm of local privacy-first AI.", keyPoints: ["On-device AI executes neural models directly on the smartphone NPU without pinging remote cloud servers.", "Sensitive user data (conversations, photos, health logs) never leaves the physical device sandbox.", "Zero round-trip network latency enables instantaneous interactions even in offline environments."], sections: [{ heading: "Cloud AI Limits and the Shift to Edge Silicon", body: "While massive cloud LLMs ignited the generative AI boom, they introduced staggering server costs and serious privacy hurdles. Reluctance to transmit private notes and recordings to external servers prompted the development of Small Language Models (SLMs) running directly on device silicon." }, { heading: "NPU Architectures and Integer Quantization", body: "Mobile Neural Processing Units (NPUs) accelerate matrix mathematics with ultra-low power consumption. Combined with 4-bit and 8-bit integer quantization (INT4/INT8), gigabyte-sized weight files are compressed into several hundred megabytes of RAM." }, { heading: "Complete Personalization Inside Your Hands", body: "On-device models learn usage rhythms, calendar appointments, and subject affinities exclusively within the local OS sandbox. Combined with user-driven algorithmic mixers like My-gorithm, it forms an autonomous, private personal companion." }] }, "tech-8": { title: "The 3 Mega Projects Leading the AI Era: Physical AI, Advanced Packaging & Eco Data Centers", summary: "Exploring high-bandwidth memory (HBM), 3D semiconductor packaging, physical robotics, and high-efficiency AI data center clusters.", source: "Korea Policy Briefing", date: "Policy Briefing", recommendationReason: "Essential reading to grasp the structural pillars of next-generation hardware and manufacturing ecosystems.", keyPoints: ["Next-generation High Bandwidth Memory (HBM) and advanced 3D packaging powering hyper-scale neural computation.", "Physical AI integrating artificial intelligence into humanoid robotics, autonomous fleets, and smart factory floors.", "Building sustainable, liquid-cooled green data center clusters to meet surging energy demands."], sections: [{ heading: "Advanced Packaging Reshaping the Semiconductor Landscape", body: "As traditional process shrinking approaches atomic limits, 3D packaging and HBM memory linking separate silicon dies have emerged as the primary technological battleground." }, { heading: "Beyond Code: Physical AI Embodied in Reality", body: "AI is expanding from on-screen text generation to Physical AI embodied in humanoid robots, automated factory cells, and autonomous vehicles that sense, interact with, and manipulate the physical world." }, { heading: "AI Data Centers and Sustainable Energy Infrastructure", body: "Cooling clusters of tens of thousands of GPUs demands liquid cooling technologies and resilient clean energy grids, establishing green data center infrastructure as a core national asset." }] }, "tech-9": { title: "Agentic AI: Can Artificial Intelligence Autonomously Plan, Execute, and Reflect?", summary: "An exploration of agentic architectures that break down complex multi-step goals, use external tools, and self-correct across workflows.", source: "Korea Policy Briefing", date: "Future Tech", recommendationReason: "Understand how AI is transitioning from conversational chatbots into autonomous software agents that execute real tasks.", keyPoints: ["Agentic AI parses human intent, decomposes high-level goals into sub-tasks, and executes them autonomously.", "Combines tool use, long-term memory retrieval, web browsing, and code execution to automate complex workflows.", "Requires strict safety guardrails and authorization protocols to prevent unauthorized actions and prompt injection."], sections: [{ heading: "From Conversational Bots to Action-Oriented Agents", body: 'While traditional generative AI answered single questions passively, Agentic AI accepts overarching goals—such as "compare workshop venues next month and book the best option"—and executes every prerequisite step sequentially.' }, { heading: "The Triad of Agentic Architecture: Planning, Tools, and Reflection", body: "Agents achieve high success rates by combining task planning (breaking down problems), tool utilization (APIs, calculators, shells), and reflection loops that inspect intermediate outputs to self-correct mistakes." }, { heading: "Security and Governance Behind Autonomous Action", body: "Because agents can modify files and execute transactions, robust authorization protocols and Human-in-the-Loop approval checkpoints are indispensable to prevent runaway actions or data loss." }] }, "tech-11": { title: "The Tech Powering Virtual Worlds: Real-Time 3D Rendering & Game Hardware", summary: "How modern gaming hardware, ray-tracing pipelines, and global distribution networks construct hyper-realistic virtual spaces.", source: "Wikipedia · Video Game Consoles", date: "Latest Column", recommendationReason: "Understand the cutting-edge intersection of graphics hardware, physics engines, and real-time 3D simulation.", keyPoints: ["Dedicated GPU silicon accelerating real-time ray-tracing and geometric shader calculations.", "High-speed NVMe SSD architectures eliminating in-game loading screens via asset streaming.", "Global low-latency content networks enabling synchronized multi-user simulations."], sections: [{ heading: "Hardware Convergence in Modern Gaming", body: "Modern gaming consoles share unified x86 CPU architectures, high-speed unified memory, and ray-tracing capable GPUs, democratizing film-grade visual rendering in consumer living rooms." }, { heading: "The Physics of Real-Time Ray Tracing", body: "Rather than relying solely on pre-baked lighting, modern graphics engines calculate billions of virtual photon rays per second to simulate realistic refractions, reflections, and ambient occlusions." }, { heading: "Global Distribution and Seamless World Streaming", body: "Massive virtual game environments are streamed on-the-fly from high-speed SSDs directly into GPU VRAM, allowing gamers to travel vast digital landscapes with zero loading delays." }] }, "tech-12": { title: "The Rules Behind Recommendations: How Ranking Algorithms Shape Digital Discovery", summary: "A conceptual study of algorithmic decision sequences, conditional weighting, and automated inference pipelines in content platforms.", source: "Wikipedia · Algorithms", date: "Technology Science", recommendationReason: "Examines the fundamental mechanics of ranking formulas and why transparent user control is essential.", keyPoints: ["Algorithms as finite sequences of unambiguous rules transforming user signals into sorted outputs.", "Balancing multi-objective loss functions: relevance, freshness, and category diversity.", "The importance of transparent algorithmic knobs that place curation sovereignty back in user hands."], sections: [{ heading: "Defining Algorithmic Sequences", body: "An algorithm is fundamentally a finite sequence of well-defined computational instructions. In recommendation feeds, it transforms user preferences and content metadata into an ordered stream." }, { heading: "Conditional Logic and Decision Thresholds", body: "Modern feed pipelines evaluate hundreds of weighted ranking signals, from historical click propensity to category balance, determining which cards are surfaced and which are excluded." }, { heading: "Transparent Curation vs Black Box Traps", body: "When recommendation algorithms operate secretly to maximize screen addiction, user autonomy suffers. User-tuned architectures restore agency by making weight sliders and formulas completely transparent." }] }, "tech-13": { title: "How Artificial Intelligence Makes Decisions: Weights, Probabilities & Explainability", summary: "Demystifying the internal mechanics of deep neural networks: matrix multiplications, attention heads, and probabilistic outputs.", source: "Wikipedia · Artificial Intelligence", date: "AI Theory", recommendationReason: "A clear conceptual primer on how machine learning models generate decisions and navigate hallucination risks.", keyPoints: ["Deep learning models as billions of tunable numerical weights optimized via backpropagation.", "Probability distributions over vocabulary tokens and latent feature spaces.", "The urgent engineering frontier of AI explainability, calibration, and safety alignment."], sections: [{ heading: "From Static Code to Learned Synaptic Weights", body: "Traditional software relies on explicit human-written conditionals. In contrast, neural networks learn mathematical weights by observing patterns across billions of data examples." }, { heading: "Attention Mechanisms and Contextual Weighting", body: "The Transformer architecture revolutionized AI by enabling models to assign varying mathematical attention to every word in a prompt, capturing nuanced contextual relationships." }, { heading: "Explainability and the Challenge of Trust", body: "As neural networks grow in complexity, understanding why a model arrived at a specific conclusion becomes crucial, driving rapid research into mechanistic interpretability." }] }, "tech-14": { title: "How Robots Sense and Navigate: Sensor Fusion, LiDAR, SLAM & Computer Vision", summary: "How autonomous machines perceive unstructured environments, fuse multimodal sensor streams, and execute high-precision movements.", source: "Wikipedia · Robotics", date: "Robotics Science", recommendationReason: "Explore how physical robots map the world and calculate navigation vectors in real-world spaces.", keyPoints: ["Sensor fusion combining cameras, ultrasonic detectors, and LiDAR for robust spatial perception.", "Simultaneous Localization and Mapping (SLAM) enabling robots to map unknown rooms in real time.", "From rigid industrial robotic arms to agile mobile humanoids and service automatons."], sections: [{ heading: "The Sensory Organs of Machines", body: "Robots rely on complementary sensor suites: cameras provide rich color and semantic textures, while time-of-flight LiDAR sensors measure millimetric depth regardless of ambient lighting." }, { heading: "Real-Time Spatial Mapping with SLAM", body: 'SLAM algorithms allow machines to answer two fundamental questions simultaneously: "Where am I right now?" and "What does the surrounding environment look like?"' }, { heading: "Precision Actuation and Motor Control", body: "Turning spatial understanding into movement requires harmonic drive gearboxes and high-frequency closed-loop feedback controllers to ensure smooth, safe physical interaction." }] }, "tech-15": { title: "Detecting Malicious Software: Static Disassembly, Sandboxing & Behavioral Profiling", summary: "Inside the cat-and-mouse game of cybersecurity: How security researchers deconstruct malware signatures and analyze suspicious binaries.", source: "Wikipedia · Malware Analysis", date: "Security Analysis", recommendationReason: "Essential concepts of cybersecurity defense, safe code sandboxes, and proactive threat detection.", keyPoints: ["Static analysis inspecting PE headers, cryptographic hashes, and compiled opcode patterns without execution.", "Dynamic sandboxing observing runtime API calls, process spawning, and network exfiltration attempts.", "Heuristic detection models identifying novel zero-day malware based on behavioral anomalies."], sections: [{ heading: "Static Code Disassembly and Signature Verification", body: "Static analysis examines binary code while at rest. Analysts inspect import address tables, cryptographic certificates, and strings to flag known malicious patterns without executing risk." }, { heading: "Dynamic Behavioral Sandboxes", body: "To bypass obfuscation and code packers, analysts execute files in instrumented virtual machines, monitoring file system modifications, registry edits, and outbound network traffic." }, { heading: "Heuristics and Machine Learning Defense", body: "Modern antivirus engines utilize machine learning models trained on millions of benign and malicious samples, predicting threats based on behavioral intent rather than exact file hashes." }] }, "tech-16": { title: "How Computers Understand Human Language: Tokenization, Embeddings & Transformers", summary: "The technological trajectory of Natural Language Processing: From statistical n-grams to high-dimensional semantic vector spaces.", source: "Wikipedia · Natural Language Processing", date: "Language Tech", recommendationReason: "Clear explanation of how raw text characters are converted into mathematical coordinates that algorithms can comprehend.", keyPoints: ["Byte-Pair Encoding (BPE) tokenization converting unstructured prose into discrete numeric tokens.", "Dense vector embeddings placing semantically related concepts close together in high-dimensional space.", "Self-attention mechanisms enabling neural models to track long-distance grammatical dependencies."], sections: [{ heading: "From Letters to Tokens", body: "Computers cannot read text natively; they compute numbers. Tokenizers dissect sentences into sub-word tokens, creating an indexable numerical vocabulary for neural processing." }, { heading: "The Geometry of Semantics: Vector Embeddings", body: "Word embeddings assign multi-hundred-dimensional vectors to each token. Words with similar meanings or contexts naturally cluster together, allowing mathematical reasoning across concepts." }, { heading: "The Transformer Revolution", body: "Self-attention layers compute cross-token relationships across entire paragraphs simultaneously, allowing models to grasp complex pronouns, humor, and nuanced logical arguments." }] }, "tech-17": { title: "Robotic Surgery in Modern Medicine: Sub-Millimeter Precision & 3D Teleoperation", summary: "How robotic armatures, stereoscopic 3D cameras, and tremor-filtering algorithms assist surgeons in performing minimally invasive procedures.", source: "Wikipedia · Robotic Surgery", date: "Medical Tech", recommendationReason: "Examines the engineering triumphs of surgical robotics and how precision mechanical design protects patient outcomes.", keyPoints: ["Master-slave teleoperation translating surgeon hand gestures into sub-millimeter robotic tool movements.", "Tremor-canceling algorithms and 7 degrees of instrument wrist articulation exceeding human hand agility.", "Minimally invasive incisions reducing postoperative pain, blood loss, and patient recovery durations."], sections: [{ heading: "The Principles of Surgical Teleoperation", body: "In robotic surgery, the surgeon sits at an ergonomic console, manipulating high-sensitivity master grips that translate finger movements into micro-movements of miniaturized arms inside the patient." }, { heading: "Overcoming Human Physical Limitations", body: "Robotic systems filter out natural physiological tremors and offer 360-degree wrist rotations in tight anatomical spaces where human fingers cannot fit, dramatically boosting precision." }, { heading: "Minimizing Surgical Trauma", body: "By operating through keyhole incisions with 3D high-definition magnification, tissue trauma and blood loss are minimized, allowing patients to return home significantly faster." }] }, "tech-18": { title: "Google Gemini and Multimodal Intelligence: Intertwining Thought, Vision, and Audio", summary: "Inside native multimodal foundation models: How AI processes text, code, high-resolution imagery, and audio streams in a single unified architecture.", source: "Wikipedia · Gemini (Language Model)", date: "AI Innovation", recommendationReason: "An overview of native multimodal neural architectures and how unified token representations unlock cross-domain reasoning.", keyPoints: ["Built from the ground up as native multimodal models rather than stitching separate vision models together.", "Massive million-token context windows enabling comprehensive analysis of entire book libraries or codebases.", "Versatile deployment across scales, from Ultra clusters down to mobile Nano silicon."], sections: [{ heading: "The Architecture of Native Multimodality", body: "Past AI architectures connected vision encoders to separate text models, losing subtle cross-modal nuance. Native multimodal models process audio waveforms, video frames, and text tokens inside a unified latent space." }, { heading: "Million-Token Context Horizons", body: "Gemini expanded context windows beyond one million tokens, enabling the model to absorb hours of raw video, hundreds of pages of documentation, and entire GitHub repositories in a single inference call." }, { heading: "From Hyperscale Clouds to Edge Nano", body: "Architecting models across multiple tiers allows lightweight variants like Nano to run securely on smartphone chips while Ultra models tackle complex multi-step reasoning in cloud clusters." }] }, "tech-19": { title: "The Landscape of 2D Computer Graphics: Scalable Vectors, Raster Pipelines & Canvas APIs", summary: "The mathematical foundations behind digital images: Bézier curves, rasterization, bitmap compression, and dynamic WebGL rendering.", source: "Wikipedia · 2D Computer Graphics", date: "Visual Tech", recommendationReason: "A foundational look at graphic rendering technologies that power modern mobile screens and browser viewports.", keyPoints: ["Vector graphics utilizing mathematical coordinate formulas for infinite lossless scaling.", "Raster images mapping discrete color values across high-density pixel grids.", "Hardware acceleration leveraging GPU shaders for instantaneous interface compositing."], sections: [{ heading: "Vectors vs Raster: Mathematical Precision vs Pixel Realism", body: "Vector graphics define shapes through mathematical formulas and Bézier control points, staying razor-sharp at any zoom level. Raster graphics excel at continuous tones in digital photographs by assigning color coordinates to individual pixels." }, { heading: "The Pipeline of Screen Rasterization", body: "Before vector paths or HTML DOM elements appear on display panels, they must be converted into raster pixels via GPU rasterization engines, running at 60 to 120 frames per second." }, { heading: "Modern Web Graphics and GPU Acceleration", body: "Technologies like SVG, Canvas 2D, and WebGL allow web applications to delegate complex rendering directly to device GPUs, ensuring ultra-smooth scrolling and crisp typography." }] }, "tech-20": { title: "Creating the Impossible on Screen: The Fusion of Practical Effects & Photorealistic CGI", summary: "How computer graphics, volumetric lighting, and physical camera sensors blend to craft seamless cinematic visual effects.", source: "Wikipedia · Computer Graphics", date: "CGI Innovation", recommendationReason: "Gain insight into the computational physics behind 3D visual effects and cinematic worldbuilding.", keyPoints: ["Monte Carlo ray-tracing simulating physical photon transport and material shaders.", "Photogrammetry and motion capture recording real-world actors and landscapes into digital assets.", "Virtual production LED stages replacing green screens with real-time parallax backgrounds."], sections: [{ heading: "The Science of Photorealistic Rendering", body: "Modern visual effects rely on physically-based rendering (PBR) that simulates real-world optical phenomena—surface roughness, subsurface scattering in human skin, and atmospheric light diffusion." }, { heading: "Digital Asset Capture and Motion Tracking", body: "High-speed camera rigs capture human facial muscle micro-movements, transferring live actor emotion directly onto computer-generated characters with breathtaking fidelity." }, { heading: "The Revolution of Virtual LED Volumes", body: "Rather than performing in front of green screens, actors now stand within gigantic curved LED volumes that render background parallax in real time via game engines, casting realistic ambient light onto sets." }] }, "tech-21": { title: "The Evolution of China's AI Industry: National Infrastructure, Talent & Enterprise Scale", summary: "A macro perspective on China's technological rise: Supercomputing infrastructure, manufacturing robotics, and expansive mobile data ecosystems.", source: "Wikipedia · AI Industry in China", date: "Global Tech", recommendationReason: "Analyzes global geopolitical competition and technical specialization across international artificial intelligence ecosystems.", keyPoints: ["Massive domestic consumer data pools fueling rapid computer vision and recommendation engine refinement.", "National strategic roadmaps pairing academic institutes with enterprise technology champions.", "Heavy investment into physical manufacturing automation and localized semiconductor fabs."], sections: [{ heading: "Data Scale as an Engine for Vision AI", body: "Widespread mobile payments and urban infrastructure created massive multimodal datasets, giving Chinese tech firms early global leadership in facial recognition, optical character recognition, and logistics routing." }, { heading: "Strategic National Initiatives", body: "Through coordinated multi-year technology roadmaps, government and private sectors established dedicated AI experimental zones and nationwide compute network backbones." }, { heading: "Navigating Hardware Supply Realities", body: "Global trade restrictions spurred massive domestic investments into indigenous chip design, RISC-V architectures, and open-source software frameworks to achieve independent technological resilience." }] }, "tech-22": { title: "Underwater Photography: Lighting, Optical Physics & Color Correction Beneath the Waves", summary: "The physics of light attenuation in water: Specialized pressure-resistant housings, strobe synchronization, and restoring lost reds in ocean depths.", source: "Wikipedia · Underwater Photography", date: "Optics & Nature", recommendationReason: "Learn the fascinating optical physics and camera adaptations required to photograph deep marine ecosystems.", keyPoints: ["Water selectively absorbs warm wavelengths first, leaving deep waters bathed in monochrome blue.", "Submersible camera housings engineered to withstand immense hydrostatic water pressure.", "Artificial strobe placement minimizing backscatter reflection from suspended particles."], sections: [{ heading: "The Optical Physics of Light Attenuation", body: "Water is approximately 800 times denser than air. As light penetrates the ocean surface, red and orange wavelengths are absorbed within the first 5 meters, requiring artificial light or white-balance correction to restore true natural color." }, { heading: "Pressure-Resistant Engineering and Dome Ports", body: "Underwater housings utilize marine-grade aluminum and optical glass domes. The curved dome port corrects for water-induced optical refraction, restoring the camera lens's true wide field of view." }, { heading: "Taming Backscatter with Dual Strobes", body: "Firing camera flashes directly forward reflects off floating plankton and debris, creating white specks called backscatter. Positioning strobes far to the sides at 45-degree angles illuminates the subject while bypassing floating particles." }] }, "study-1": { title: "Unlocking Inner Potential with Metacognition: The Psychology of Learning", summary: "Cognitive psychologist Prof. Lisa Son explains how knowing what you truly know vs what you don't transforms learning speed.", source: "YouTube · Sebasi Talk (15 Min to Change the World)", date: "Must Watch", recommendationReason: "Understand the difference between surface familiarity and genuine metacognitive mastery." }, "study-2": { title: "Mindful Archiving: Building a Second Brain That Actually Remembers", summary: "Moving beyond passive note-taking to the Zettelkasten and Cornell methods that turn fleeting insights into permanent intellectual assets.", source: "Harvard Business Review · Neuroscience Archive", date: "Today", recommendationReason: "Build a personalized knowledge management system that connects isolated ideas into actionable wisdom.", keyPoints: ["The passive note-taking trap: Transcribing text verbatim creates zero neural memory traces.", "The Cornell Note-taking System: Structuring notes into cues, summaries, and main concepts on a single page.", "The Zettelkasten method: Linking atomic notes into a dynamic, compounding web of ideas."], sections: [{ heading: "The Note-taking Trap: Passive Recording vs Active Synthesis", body: "Writing down every word a lecturer speaks feels productive, but cognitive science shows it bypasses deep processing. Transforming notes into original sentences and questions forces active neural synthesis." }, { heading: "The Cornell System: Clean Organization on One Page", body: "Dividing your paper into a wide notes column, a left-hand cue margin, and a bottom summary box naturally guides you through review, synthesis, and self-testing." }, { heading: "Zettelkasten: Compounding Networks of Fragmented Thoughts", body: "Rather than filing notes into rigid folders where they are forgotten, linking individual atomic thoughts creates an interconnected knowledge network that sparks creative breakthroughs." }] }, "study-4": { title: "Pomodoro Optimization: 4 Hours of Deep Flow Without Burnout", summary: "The neuroscience of finite human attention and how structured intervals of 25-minute focus and 5-minute rest recharge cognitive energy.", source: "Harvard Business Review · Neuroscience Archive", date: "Yesterday", recommendationReason: "Scientifically proven protocol to eliminate afternoon brain fog and sustain razor-sharp concentration.", keyPoints: ["Human prefrontal cortex focus naturally fatigues after 25~45 minutes of continuous cognitive strain.", "True rest during breaks: Step away from screens to prevent sensory overload and dopamine depletion.", "Advanced Pomodoro tuning: Customizing cycle durations to match personal tasks and circadian rhythms."], sections: [{ heading: "Attention Limits and the Power of Timeboxing", body: "The human brain cannot maintain peak concentration indefinitely. Timeboxing tasks into distinct 25-minute sprints creates a healthy sense of urgency that silences digital distractions." }, { heading: "The Quality of Rest Dictates the Next Sprint", body: "Scrolling social media during a 5-minute break is not resting; it floods visual pathways with rapid stimuli. Taking a brief walk or stretching with closed eyes restores prefrontal cortex reserves." }, { heading: "Pro Tips for Deep Workers", body: "Bundle smaller administrative tasks into a single 25-minute block. For deep analytical work, expand the interval to 50 minutes followed by a 10-minute restorative pause." }] }, "study-5": { title: "USD/KRW at 1,384: The Global Currency War and Macroeconomic Realities", summary: "A clear macro breakdown of Federal Reserve interest rates, geopolitical tensions, and how currency fluctuations ripple across household finance.", source: "YouTube · Sampro TV", date: "Trending Video", recommendationReason: "Essential financial literacy to understand inflation, interest rate shifts, and global currency dynamics." }, "study-6": { title: "Evidence-Based Learning: Spaced Repetition and Active Recall Over Cramming", summary: "Why pulling all-nighters leads to rapid forgetting, and how algorithm-driven spaced retrieval permanently hardens memory traces.", source: "Harvard Business Review · Neuroscience Archive", date: "5d ago", recommendationReason: "Learn the gold-standard learning protocol of cognitive psychology to master exams and professional skills with minimal fatigue.", keyPoints: ["The Ebbinghaus forgetting curve shows over 70% of newly acquired information fades within 48 hours without recall.", "Spaced repetition algorithms schedule reviews at the exact mathematical moment of impending memory decay.", "Active recall via digital flashcards forces synapses to rebuild stronger pathways than passive rereading."], sections: [{ heading: "Why Cramming Evaporates Right After Exams", body: "All-night cramming places information into transient working memory buffers. Without sleep-driven memory consolidation in the hippocampus, nearly all retained facts evaporate within days." }, { heading: "Spaced Repetition: Defeating the Forgetting Curve", body: "Reviewing a concept just as it begins to slip from memory triggers deep synaptic reinforcement. Spacing reviews over 1 day, 3 days, 1 week, and 1 month locks information into permanent long-term storage." }, { heading: "Building Your Flashcard Defense Line", body: "Apps like Anki automate this algorithm. Crafting concise, single-question flashcards makes daily 10-minute reviews effortless and extraordinarily potent over years." }] }, "study-8": { title: "The Feynman Learning Technique: Explaining Complexity in Crystal-Clear Language", summary: "Nobel laureate Richard Feynman's mental model for learning anything: If you cannot explain it to a sixth-grader, you don't truly understand it.", source: "Harvard Business Review · Neuroscience Archive", date: "1w ago", recommendationReason: "Exposes hidden conceptual gaps and cements intuitive mastery over technical topics.", keyPoints: ["Choose a target concept and explain it using everyday analogies with zero professional jargon.", "Identify the exact friction point where your explanation stumbles, and revisit source materials.", "Refine, simplify, and crystallize until the concept feels entirely intuitive and self-evident."], sections: [{ heading: "The Jargon Trap in Modern Knowledge", body: "Hiding behind esoteric terminology is often a mask for shallow comprehension. Real understanding shines through the ability to describe complex ideas using plain, everyday language." }, { heading: "The 4 Steps of the Feynman Protocol", body: "Step 1: Write down the concept name. Step 2: Teach it to an imaginary child. Step 3: Pinpoint where your explanation falters and reread the core literature. Step 4: Simplify analogies until they are effortless." }, { heading: "From Memorization to Deep Intuition", body: "Once you can explain how a neural network works using a kitchen recipe analogy, the knowledge belongs to you forever, unlocking effortless creative application." }] }, "study-9": { title: "Finding Your Personal Learning Style: Aligning Cognitive Strengths with Study Methods", summary: "How individual cognitive processing differences, attention rhythms, and sensory strengths shape effective study habits.", source: "Wikipedia · Cognitive Psychology", date: "Cognitive Science", recommendationReason: "Identify your personal learning rhythms and craft study strategies that leverage your natural strengths.", keyPoints: ["Understanding auditory, visual, and kinesthetic information processing styles.", "Matching environmental conditions (lighting, noise, desk setup) to your attentional profile.", "Continuous self-monitoring to adjust study routines for maximum intellectual energy."], sections: [{ heading: "Diverse Cognitive Profiles Among Learners", body: "Every individual processes sensory information with distinct efficiency. Some grasp abstract concepts through visual diagrams, while others require verbal discussions or hands-on practice." }, { heading: "Designing an Optimized Study Ecosystem", body: "Aligning your workspace with your sensory preferences—such as using noise-canceling headphones or tactile notebooks—drastically reduces background cognitive friction." }, { heading: "Metacognitive Self-Adjustment", body: "Regularly evaluating which study techniques yield the highest retention per hour allows you to discard ineffective habits and build an agile, enjoyable learning routine." }] }, "study-10": { title: "Effortless Vocabulary Acquisition: Mnemonics, Context & Etymology", summary: "Cognitive memory strategies for learning languages: Why root-word etymology and contextual immersion surpass rote vocabulary lists.", source: "Wikipedia · Cognitive Psychology", date: "Language Science", recommendationReason: "Master foreign language vocabulary faster by leveraging linguistic roots and vivid contextual imagery.", keyPoints: ["Latin and Greek root-word patterns unlocking dozens of related terms simultaneously.", "Contextual sentence immersion anchoring vocabulary into emotional and episodic memory.", "Mnemonic keyword associations turning abstract spellings into memorable mental pictures."], sections: [{ heading: "The Limits of Isolated Word Lists", body: "Memorizing two-column word lists treats vocabulary as abstract symbols without context. Without rich episodic hooks, words quickly fade from memory." }, { heading: "Etymology: The Architectural Skeleton of Words", body: "Understanding prefixes, roots, and suffixes allows you to intuit the meanings of unfamiliar words instantly, turning vocabulary building into an intriguing puzzle." }, { heading: "Contextual Immersion and Dual Coding", body: "Reading engaging stories and associating new vocabulary with vivid mental images engages both verbal and visual memory pathways, dramatically boosting recall speed." }] }, "study-11": { title: "Galileo Galilei and the Dawn of Empirical Science: Measuring Truth Through Data", summary: "How empirical observation, mathematical physics, and the telescope shattered dogma and founded the modern scientific method.", source: "Wikipedia · Galileo Galilei", date: "History Archive", recommendationReason: "A historical perspective on how empirical measurement and reproducible experiments revolutionized human knowledge.", keyPoints: ["Challenging philosophical dogma through rigorous physical measurement and reproducible experimentation.", "Telescopic observations of Jupiter's moons providing concrete empirical proof of the Copernican solar system.", "Establishing mathematical relationships as the universal language of physical phenomena."], sections: [{ heading: "The Paradigm Shift from Philosophical Dogma to Measurement", body: "Before Galileo, natural philosophy relied heavily on Aristotle's abstract deductions. Galileo insisted that true knowledge requires quantifiable observation and verifiable experiments." }, { heading: "The Telescope that Shattered the Heavens", body: "Pointing his homemade telescope to the night sky, Galileo discovered mountains on the moon and four moons orbiting Jupiter, dismantling the ancient belief that all celestial bodies must circle the Earth." }, { heading: "The Legacy of Mathematical Physics", body: "By quantifying the acceleration of falling bodies and the laws of pendulums, Galileo laid the mathematical foundations upon which Isaac Newton would soon build modern physics." }] }, "study-12": { title: "Why Some Memories Last a Lifetime While Others Vanish: The Neurobiology of Retention", summary: "An exploration of episodic memory, hippocampal consolidation, emotional encoding, and the biological purpose of forgetting.", source: "Wikipedia · Human Memory", date: "Neuroscience Archive", recommendationReason: "Understand the biological mechanics of how the brain filters daily experiences into permanent long-term memories.", keyPoints: ["The hippocampus functioning as an indexer before transferring memories into the cerebral cortex.", "Emotional arousal and adrenaline chemically tagging events for priority consolidation.", "Forgetting as an active neurobiological optimization process to eliminate clutter and extract abstract concepts."], sections: [{ heading: "The Gateway of Memory: The Hippocampus", body: "Daily experiences are first processed as temporary synaptic patterns in the hippocampus. During deep slow-wave sleep, these memories are replayed and consolidated into the neocortex for permanent storage." }, { heading: "Why Emotionally Charged Memories Stand the Test of Time", body: "When an event triggers surprise, fear, or joy, the amygdala releases stress hormones that act as biochemical priority tags, ensuring critical survival information is permanently preserved." }, { heading: "The Evolutionary Gift of Forgetting", body: "If our brains retained every trivial sensory input—such as the license plate of every car passed—cognitive processing would freeze. Forgetting allows us to generalize and think conceptually." }] }, "study-13": { title: "Unlocking the Secrets of Stars and Exoplanets: Spectroscopy and Modern Astronomy", summary: "How analyzing starlight wavelengths reveals stellar composition, exoplanet atmospheres, and the cosmic history of the universe.", source: "Wikipedia · Astronomy", date: "Astrophysics", recommendationReason: "Discover how astronomical instruments decode invisible light to map the frontiers of the cosmos.", keyPoints: ["Spectroscopic absorption lines revealing chemical element fingerprints across billions of light-years.", "Transit photometry detecting exoplanet silhouettes as they cross in front of host stars.", "Space observatories like James Webb peering through cosmic dust to capture the earliest infant galaxies."], sections: [{ heading: "Decoding the Colors of Starlight", body: "Every chemical element absorbs and emits specific wavelengths of light. By dispersing starlight through prisms and gratings into spectral lines, astronomers can determine the temperature, density, and chemical makeup of distant stars." }, { heading: "Hunting for Alien Worlds in the Shadows", body: "When an exoplanet passes between its parent star and our telescopes, the star's brightness dips slightly. Analyzing the filtered starlight through the planet's atmosphere allows scientists to detect water vapor, methane, and carbon dioxide." }, { heading: "Looking Back to the Dawn of Time", body: "Because light takes time to travel cosmic distances, infrared space telescopes act as time machines, capturing photons emitted over 13 billion years ago just after the Big Bang." }] }, "study-14": { title: "The Uncanny Valley: Why Almost-Human Faces Evoke Deep Unease in Robotics & CGI", summary: "The evolutionary psychology and perceptual neuroscience behind our visceral discomfort when encountering androids that look almost—but not quite—human.", source: "Wikipedia · Uncanny Valley", date: "Psychology Lab", recommendationReason: "Explore the psychological boundaries of human facial perception, robotics design, and synthetic avatars.", keyPoints: ["The perceptual cliff where emotional affinity plummets as artificial realism reaches near-human fidelity.", "Evolutionary disease-avoidance hypotheses flagging subtle facial asymmetry or unnatural eye movements.", "Design strategies in robotics and animation intentionally stylizing characters to stay safely outside the valley."], sections: [{ heading: "The Origin of the Uncanny Curve", body: "In 1970, roboticist Masahiro Mori hypothesized that as robots appear more human, our emotional response becomes increasingly positive—until a point where subtle flaws turn admiration into sudden revulsion." }, { heading: "Evolutionary Defense Mechanisms in Action", body: "Evolutionary psychologists suggest this unease is a vital survival adaptation designed to keep humans away from diseased corpses or individuals carrying contagious pathogens with altered motor behaviors." }, { heading: "Navigating the Valley in Modern Animation and AI", body: "Studios like Pixar deliberately stylize characters with enlarged eyes and exaggerated proportions to bypass the uncanny valley, creating warm, emotionally resonant digital beings." }] }, "study-15": { title: "What Happens Inside the Brain When Solving Puzzles: Working Memory & Insight Moments", summary: "The neurodynamics of problem-solving: Cognitive flexibility, working memory buffers, and the sudden 'Aha!' spark of creative illumination.", source: "Wikipedia · Puzzles & Cognition", date: "Cognitive Psychology", recommendationReason: "Understand how playful puzzles sharpen logical deduction, pattern recognition, and intellectual adaptability.", keyPoints: ["Prefrontal cortex managing working memory buffers while systematically testing candidate solutions.", "Pattern recognition linking fragmented spatial and numerical clues into coherent heuristics.", "The 'Eureka' moment: How incubation periods during rest spark spontaneous creative breakthroughs."], sections: [{ heading: "Working Memory as an Intellectual Workbench", body: "When tackling complex puzzles like Sudoku or chess tactics, your prefrontal cortex holds multiple provisional moves in mind simultaneously, testing outcomes before committing to action." }, { heading: "Pattern Recognition and Heuristics", body: "Experienced puzzle solvers develop visual and mathematical heuristics that immediately eliminate dead-end choices, transforming broad searches into lightning-fast intuitive decisions." }, { heading: "The Neuroscience of the 'Eureka' Flash", body: "When you step away from a stuck puzzle to shower or take a walk, the brain's default mode network continues subconscious association, suddenly connecting distant neural circuits in a flash of insight." }] }, "study-16": { title: "The Magic of Raw Ingredients Becoming Cuisine: The Science of Cooking Chemistry", summary: "Protein denaturation, starch gelatinization, the Maillard reaction, and how heat transforms molecular structures into mouthwatering flavors.", source: "Wikipedia · Culinary Science", date: "Culinary Science", recommendationReason: "Learn the fascinating chemical reactions that dictate flavor, texture, and aroma in everyday cooking.", keyPoints: ["Protein denaturation uncoiling tight molecular bonds into tender, flavorful textures.", "The Maillard reaction between amino acids and reducing sugars creating golden-brown crusts and deep umami aromas.", "The evolutionary significance of cooking in unlocking calorie density that propelled human brain expansion."], sections: [{ heading: "Denaturation and Gelatinization: Restructuring Texture", body: "Applying heat breaks hydrogen bonds inside proteins, causing them to unfold and coagulate into tender morsels. In starches, heat and water cause granules to swell and gelatinize, creating silky sauces." }, { heading: "The Maillard Reaction: The Holy Grail of Flavor", body: "Above 140°C, amino acids react with sugars on searing meats and baking breads, generating hundreds of new aromatic compounds responsible for savory, roasted, and nutty notes." }, { heading: "Cooking as the Spark of Human Evolution", body: "Anthropologists note that harnessing fire to cook predigested food allowed early hominids to absorb vastly more calories with minimal digestive energy, directly fueling our rapid cranial encephalization." }] }, "culture-2": { title: "Appreciating Contemporary Art Without a Docent: Deciphering Concepts and Context", summary: "A friendly guide to exploring modern art galleries: Slow looking, understanding medium choices, and embracing open interpretation.", source: "National Museum of Korea · Curator Talk", date: "Today", recommendationReason: "Overcome the intimidation of abstract and contemporary art with intuitive visual exploration tools.", keyPoints: ["Why contemporary art feels abstract: It questions the definition and social context of art itself.", "The practice of 'Slow Looking': Putting away smartphones to gaze at a single artwork for a full uninterrupted minute.", "Deciphering clues hidden inside the gallery wall caption's 'Medium' and exhibition statement."], sections: [{ heading: "Why Does Contemporary Art Feel Cryptic?", body: "Historically, art focused on realistic representation. Contemporary art shifted its axis toward conceptual questions: What can be art? Who decides value? Embracing ambiguity is the first step." }, { heading: "Slow Looking: The Lost Art of Contemplation", body: "Studies show the average gallery visitor looks at an artwork for just 8 seconds before snapping a photo. Spending a full 60 seconds reveals unexpected brushstroke textures and emotional nuances." }, { heading: "Finding Narrative Clues in the Caption", body: "Check the medium listed on the placard. If an artist uses discarded plastics or volcanic ash instead of oil paint, the material itself holds the core narrative message of the exhibition." }] }, "culture-3": { title: "Relaxing Jazz Piano Radio: Warm Ambient Melodies for Deep Focus and Creative Work", summary: "Gentle, comforting acoustic jazz piano chords perfect for background work, reading, programming, and evening relaxation.", source: "Lofi Girl · ChilledCow", date: "Featured Video", recommendationReason: "Gentle acoustic piano harmonies that reduce stress and promote uninterrupted flow states." }, "culture-4": { title: "'Text Hip' in the Shorts Era: Why Gen Z is Passionately Turning to Physical Books", summary: "Amid digital fatigue from TikTok and YouTube Shorts, young generations are rediscovering physical books as stylish, tactile cultural totems.", source: "Cine21 · Independent & Art Cinema", date: "3d ago", recommendationReason: "Analyzes modern cultural counter-movements embracing analog tactile depth amidst digital overload.", keyPoints: ["The rise of 'Text Hip': Turning reading and book ownership into an aesthetic statement of intellectual discernment.", "The irreplaceable tactile sensory weight of paper texture, binding scents, and margin annotations.", "Independent bookstores evolving into cultural salons curating community and thoughtful conversation."], sections: [{ heading: "Why Seek Long Texts in an Era of Hyper-Short Clips?", body: "When dopamine-chasing algorithms flood feeds with 15-second videos, cognitive exhaustion naturally follows. Physical books offer a slow sanctuary where readers govern their own pacing and thoughts." }, { heading: "The Tactile Object Quality of Physical Books", body: "Holding paper, flipping pages, and feeling paper grain connects physical touch to intellectual consumption, transforming paper books into cherished artistic objects on personal shelves." }, { heading: "The Aesthetic Curation of Indie Bookstores", body: "Neighborhood independent bookshops curate hand-picked themes, hosting evening reading circles and conversation clubs that foster authentic, intimate human connections." }] }, "culture-6": { title: "Theater Etiquette and Seat Selection: An Essential Primer for Musical First-Timers", summary: "A comprehensive guide from picking the best acoustic and sightline zones to intermission timing and respectful curtain call applause.", source: "Cine21 · Independent & Art Cinema", date: "5d ago", recommendationReason: "Essential theater tips to maximize your immersion and visual appreciation at stage performances.", keyPoints: ["The golden acoustic sweet spot: Rows 7 through 12 in the center stalls balance stereo mix and visual angles.", "Making the most of 20-minute intermissions: Pre-ordering refreshments and avoiding restroom bottlenecks.", "Respectful viewing etiquette: Keeping phone screens dark and holding applause for musical endings."], sections: [{ heading: "Deciphering the Theater Seating Chart", body: "Sitting too close in row 1 strains your neck and drowns out orchestral balance. The acoustic golden zone sits around rows 8 to 12 in the center orchestra, offering panoramic views of choreographies." }, { heading: "Navigating the 20-Minute Intermission", body: "Intermission flies by quickly. Head directly to the restroom when house lights rise, or preorder interval drinks beforehand to relax and discuss act one with companions." }, { heading: "Etiquette that Protects Communal Immersion", body: "Live theater is an intimate shared acoustic bubble. Keeping phones completely powered off and saving applause until the musical chord finishes ensures magical immersion for all." }] }, "culture-8": { title: "Independent and Art Cinema Highlights of the Year: Film Festival Curations", summary: "A curated selection of visionary independent films from Cannes, Venice, and Busan that defy commercial Hollywood formulas.", source: "IndieSpace · Art Film Archive", date: "1w ago", recommendationReason: "Discover poetic, provocative independent cinema that expands empathy and visual imagination.", keyPoints: ["Cinema that breathes: Exploring deliberate pacing, deep silence, and poetic visual mise-en-scène.", "Intimate character studies that illuminate underrepresented human conditions and ethical questions.", "Curated recommendations to transform your quiet weekend evening into a festival screening."], sections: [{ heading: "Cinema Blooming Behind Commercial Formulas", body: "Away from predictable blockbuster tropes, independent cinema explores raw human vulnerabilities and social complexities, using film as a profound medium of personal reflection." }, { heading: "The Poetics of Silence and Negative Space", body: "Visionary directors use lingering ambient soundscapes and quiet pauses to give audiences room to contemplate characters' internal turmoil without manipulative musical cues." }, { heading: "Curated Recommendations for Tonight", body: "Explore intimate coming-of-age tales and atmospheric neo-realist cinema that linger in your heart for weeks long after the end credits roll." }] }, "culture-9": { title: "Traditional Heritage on the Global Stage: The Modern Reinterpretation of K-Culture", summary: "How Hanbok fashion, Hanok architecture, and artisan crafts are reimagined as sleek contemporary design icons across the world.", source: "Wikipedia · Korean Traditional Culture", date: "Cultural Heritage", recommendationReason: "Explore how ancient Korean craftsmanship and design philosophies inspire modern architecture and global fashion.", keyPoints: ["The five pillars of Korean heritage: Hansik, Hanbok, Hanji, Hangul, and Hanok.", "Contemporary designers incorporating traditional natural dyes and minimalist silhouettes.", "Global digital platforms celebrating living heritage through immersive modern storytelling."], sections: [{ heading: "The Five Aesthetic Pillars of Korean Heritage", body: "From the ergonomic beauty of Hangul letterforms to the breathable comfort of Hanok wood-and-stone structures, traditional Korean design embodies harmony with natural cycles." }, { heading: "Traditional Aesthetics in Contemporary Lifestyles", body: "Modern industrial designers are incorporating Hanji paper into acoustic lamps and crafting minimalist streetwear inspired by traditional Hanbok drapery, finding fresh global acclaim." }, { heading: "A Living Heritage Celebrated Worldwide", body: "Rather than sitting behind museum glass, traditional pottery, tea rituals, and music are embraced by youth worldwide as sophisticated, sustainable lifestyle choices." }] }, "culture-10": { title: "Immersive Traditional Heritage: Experiencing Historic Hanok Estates and Tea Culture", summary: "Stepping into preserved Joseon scholar academies and historic estates to experience mindful tea ceremonies and calligraphic arts hands-on.", source: "Wikipedia · Korean Traditional Culture", date: "Living Heritage", recommendationReason: "A weekend guide to experiencing historic architecture, serene tea ceremonies, and mindfulness in nature.", keyPoints: ["Restored historic estates offering immersive weekend stay programs away from urban hustle.", "The multi-sensory art of Korean tea ceremonies (Dado): Aroma, visual clarity, and temperature mindfulness.", "Family-friendly heritage workshops blending history, traditional confectionery, and landscape exploration."], sections: [{ heading: "Historic Estates Reborn as Welcoming Retreats", body: "Century-old scholar academies (Seowon) and traditional estates have opened their wooden gates, allowing travelers to sleep on heated ondol floors and listen to rain tapping against clay roof tiles." }, { heading: "The Mindful Art of the Korean Tea Ceremony", body: "Unlike fast-paced espresso routines, the slow pouring and contemplation of green tea teaches patience and sensory awareness, soothing frayed modern nerves." }, { heading: "Weekend Escapes for the Whole Family", body: "From natural indigo dye workshops to woodblock printing, hands-on cultural programs provide joyful, tactile bonding experiences across generations." }] }, "culture-11": { title: "The History and Phenomenon of Pokémon: From Game Boy Cartridge to Global Cultural Icon", summary: "The 30-year evolution of the Pokémon franchise: Satoshi Tajiri's insect-collecting childhood memories, social trading, and global transmedia synergy.", source: "Wikipedia · Pokémon Franchise", date: "Pop Culture Archive", recommendationReason: "A cultural and business study of the world's most profitable entertainment franchise and social gaming phenomenon.", keyPoints: ["The humble origin: Capturing the nostalgic magic of childhood bug collecting on a Game Boy link cable.", "The core triumvirate of gameplay: Collect, Train, and Trade fostering real-world friendships.", "Flawless transmedia integration across anime, trading cards, mobile AR, and retail empires."], sections: [{ heading: "A Legend Born on a Tiny Monochrome Screen", body: "In 1996, Satoshi Tajiri channeled his childhood memories of catching beetles in rural forests into a portable RPG, creating a digital world where players could capture magical creatures." }, { heading: "Social Connectivity as Game Mechanics", body: "By requiring players to use a physical Link Cable to trade monsters exclusive to Red or Blue versions, Pokémon pioneered social networking through video gaming long before social media existed." }, { heading: "The Apex of Global Transmedia Empires", body: "By synchronizing video games with a hit animated television series, physical trading cards, and movies, Pokémon became the highest-grossing media franchise in entertainment history." }] }, "culture-12": { title: "Narrative Architecture in Television Dramas: Pacing, Cliffhangers & Emotional Resonance", summary: "How scriptwriters structure episode arcs, develop multifaceted character flaws, and weave societal themes into compelling living-room dramas.", source: "Wikipedia · Television Drama", date: "Media Studies", recommendationReason: "Analyze the storytelling engines and psychological hooks that make episodic dramas universally captivating.", keyPoints: ["The rise of serialized television as the dominant modern novel of our cultural era.", "Three-act episode structures ending on carefully calibrated cliffhangers to sustain suspense.", "Reflecting contemporary societal anxieties, family dynamics, and justice themes through character choices."], sections: [{ heading: "Television as the Modern Novel", body: "With hours of narrative real estate, television dramas allow character arcs to breathe and evolve slowly, exploring moral ambiguities that standard two-hour films must truncate." }, { heading: "The Anatomy of the Episodic Cliffhanger", body: "Master screenwriters structure each episode with clear micro-resolutions while ending on unresolved narrative questions that spark passionate water-cooler debate." }, { heading: "Reflecting the Zeitgeist of Society", body: "From workplace dramas tackling corporate inequality to family sagas exploring changing gender roles, episodic series hold a mirror to contemporary social shifts." }] }, "culture-13": { title: "Defining the Adolescent Mind: Distinct Psychological and Social Milestones", summary: "Inside the teenage brain: The limbic system developing ahead of the prefrontal cortex, peer identity formation, and supporting emotional transitions.", source: "Wikipedia · Adolescent Psychology", date: "Developmental Psychology", recommendationReason: "Insights into cognitive and emotional transformations during youth to foster deeper empathy across generations.", keyPoints: ["The transitional bridge between dependent childhood and autonomous adult identity.", "Neurodevelopmental imbalance: Reward centers surge while executive risk-assessment matures into the mid-20s.", "The supportive role of educators, family communication, and constructive creative outlets."], sections: [{ heading: "The Great Psychological Metamorphosis", body: "Adolescence is not merely a biological growth spurt; it is a profound identity revolution where individuals construct their moral boundaries and question inherited social norms." }, { heading: "The Neurobiology of Risk and Passion", body: "During teenage years, the emotional limbic system reaches full maturity while the rational prefrontal cortex is still pruning synapses, explaining heightened emotional sensitivity and boldness." }, { heading: "The Power of Empathetic Mentorship", body: "Providing teenagers with safe environments to take healthy risks, express artistic identity, and discuss doubts without fear of judgment anchors lifelong emotional resilience." }] }, "culture-14": { title: "The Evolution and Identity of American Popular Culture: A Global Mosaic", summary: "How immigrant traditions, African American musical roots, Hollywood cinema, and consumer technology blended into an influential global cultural export.", source: "Wikipedia · American Culture", date: "Cultural Anthropology", recommendationReason: "Explore how historical migrations, democratic ideals, and industrial media shaped the landscape of modern popular entertainment.", keyPoints: ["The cultural melting pot blending European, African, and Indigenous heritages into distinct art forms.", "Jazz, blues, rock, and hip-hop as foundational musical revolutions born from community struggle.", "Hollywood and Silicon Valley acting as global conduits projecting narrative archetypes worldwide."], sections: [{ heading: "A Mosaic Forged Through Migration", body: "American culture is not a monolithic heritage but a dynamic mosaic where immigrant communities constantly cross-pollinated food, language, and artistic expressions." }, { heading: "The African American Roots of Modern Sound", body: "From Delta blues and New Orleans jazz to Motown soul and Bronx hip-hop, African American innovators created the rhythmic and harmonic vocabulary that underpins global popular music." }, { heading: "Cinema and the Export of Narrative Ideals", body: "Through the silver screens of Hollywood, American storytelling popularized ideals of individual freedom, optimism, and reinvention, shaping cultural aspirations worldwide." }] }, "culture-15": { title: "Sungnyung: The Cultural and Digestive Wisdom of Scorched Rice Tea in Korean Living", summary: "The culinary origins of toasted rice tea brewed in traditional cast-iron cauldrons: Enzymatic digestion, warmth, and the comforting finish of Korean dining.", source: "Wikipedia · Sungnyung (Scorched Rice Tea)", date: "Culinary History", recommendationReason: "Discover the zero-waste heritage and gentle digestive science behind Korea's oldest traditional post-meal beverage.", keyPoints: ["Born from cast-iron cauldrons (Gamasot) naturally toasting bottom rice into crispy Nurungji.", "Enzymatic and dextrin benefits soothing the digestive tract after robust, savory meals.", "A distinctive culinary symbol of warmth, zero waste, and communal hospitality across generations."], sections: [{ heading: "Born from the Cast-Iron Cauldron", body: "When traditional Korean cooks scooped rice from heavy iron Gamasot cauldrons, a golden, nutty layer of scorched rice remained. Boiling water poured over this crust created Sungnyung." }, { heading: "Digestive Chemistry in a Bowl", body: "The toasting process breaks down starches into easily digestible dextrins. Drinking warm Sungnyung after salty or spicy dishes washes the palate and gently settles stomach acid." }, { heading: "Hospitality and Zero-Waste Philosophy", body: "Serving piping-hot Sungnyung to guests marked the harmonious conclusion of a shared meal, embodying an ancient Korean ethos where nothing cultivated with care went to waste." }] }, "culture-16": { title: "The Platform Architecture of Food Delivery: Urban Logistics, Apps & Dining Lifestyles", summary: "How mobile dispatch algorithms, cloud kitchens, and two-sided marketplaces transformed metropolitan culinary culture and everyday dinner tables.", source: "Wikipedia · Food Delivery Platforms", date: "Urban Sociology", recommendationReason: "An analytical look into how mobile delivery networks alter city traffic, restaurant business models, and household dining habits.", keyPoints: ["Routing algorithms pairing rider coordinates, kitchen prep times, and traffic data in real time.", "The rise of cloud kitchens and ghost restaurants optimized entirely for online app storefronts.", "Shifting social rituals from home cooking and formal restaurant visits toward on-demand dining convenience."], sections: [{ heading: "The Algorithmic Orchestration of Urban Dinners", body: "Behind every delivery app lies an intricate dispatch engine balancing kitchen preparation estimations, rider locations, traffic bottlenecks, and customer delivery windows in milliseconds." }, { heading: "The Ghost Kitchen Revolution", body: "Eliminating the need for prime street-level retail space, commercial ghost kitchens allow innovative chefs to test regional menus with minimal overhead and rapid iteration." }, { heading: "The Evolving Definition of the Family Meal", body: "While delivery apps offer unmatched convenience for busy households, sociologists also examine the changing social rituals as collective family cooking is increasingly outsourced to mobile platforms." }] }, "culture-17": { title: "The Dynamic Flavor Balance of Thai Cuisine: Sweet, Sour, Spicy, and Umami Harmonies", summary: "A culinary journey through Southeast Asia: Fresh lemongrass, galangal, kaffir lime, and the aromatic balance that makes Thai food globally irresistible.", source: "Wikipedia · Thai Cuisine", date: "Gastronomy Culture", recommendationReason: "Learn how contrasting aromatics and herbs create one of the most vibrant flavor profiles in global gastronomy.", keyPoints: ["The sacred quartet of Thai cooking: balancing sweet palm sugar, tart lime, fiery chilis, and savory fish sauce.", "Aromatic herb bouquets of lemongrass, galangal, cilantro roots, and crushed kaffir lime leaves.", "Regional diversity from the coconut curries of the south to the fiery herbal salads of the northeastern Isan plateau."], sections: [{ heading: "The Symphony of Four Flavors", body: "Thai chefs strive for dynamic tension in every dish. A single spoonful of Tom Yum soup simultaneously sparks sharp lime acidity, deep fish sauce umami, chili heat, and a mellow sweetness." }, { heading: "Fresh Aromatics Over Dried Spices", body: "Unlike cuisines that rely heavily on dried spice powders, Thai cooking pounds fresh rhizomes and bruised leaves in stone mortars, preserving lively, volatile herbal oils." }, { heading: "Rich Regional Diversity", body: "From the rich coconut-infused curries of the lush southern peninsula to the pungent herbal broths of the northern mountains, Thailand's geography offers endless gastronomic wonder." }] }, "culture-18": { title: "Regional Gastronomy Across China: Eight Great Culinary Traditions and Philosophy", summary: "From Sichuan numbing spice and Cantonese seafood delicacy to Shandong banquets: How geography and Taoist balance shape Chinese culinary heritage.", source: "Wikipedia · Chinese Culinary Traditions", date: "East Asian Food Culture", recommendationReason: "Explore the vast regional diversity, wok hei techniques, and communal dining philosophies of Chinese culinary culture.", keyPoints: ["The Eight Great Culinary Traditions reflecting distinct climates, trade routes, and local agriculture.", "Wok Hei: The breath of the wok imparting smoky complexity through high-heat searing.", "Dining as communal harmony: Shared circular lazy Susans and the philosophical balance of Yin and Yang."], sections: [{ heading: "The Eight Great Regional Schools", body: "China's vast geography gave birth to eight distinct culinary canons—from the numbing peppercorn heat of Sichuan to the light, ingredient-focused steamed delicacies of coastal Canton." }, { heading: "Wok Hei: The Elusive Breath of the Wok", body: "Master chefs manipulate scorching cast-iron woks over roaring flames, vaporizing micro-droplets of oil to impart a prized smoky essence into flash-fried vegetables and meats." }, { heading: "Food as Medicine and Harmony", body: "Rooted in traditional medicine, Chinese cuisine pairs warming and cooling ingredients to promote bodily equilibrium, using shared banquets as joyful celebrations of family unity." }] }, "culture-19": { title: "Everyday Aesthetics on the Japanese Dining Table: Seasonality, Vessel & Balance", summary: "The philosophy of Ichiju-sansai (one soup, three dishes), seasonal ingredients (Shun), and visual harmony in traditional Japanese dining.", source: "Wikipedia · Japanese Gastronomy", date: "Japanese Culinary Heritage", recommendationReason: "Gain insight into the refined visual presentation, fermentation heritage, and seasonal mindfulness of Washoku dining.", keyPoints: ["Ichiju-Sansai: The nutritional balance of steamed rice, dashi miso soup, and three complementary side dishes.", "Celebrating 'Shun': The fleeting peak moment when a fish, vegetable, or mushroom tastes at its absolute prime.", "Vessel aesthetics: Choosing handmade ceramics and lacquerware that mirror the changing seasons."], sections: [{ heading: "The Balanced Geometry of Ichiju-Sansai", body: "Traditional Japanese tables follow an ergonomic formula: rice on the left, soup on the right, and three seasonal dishes arranged behind, ensuring nutritional harmony and mindful eating." }, { heading: "The Ephemeral Beauty of Shun", body: "Japanese cuisine reveres 'Shun'—the fleeting 10-day window when seasonal produce possesses peak sweetness and fragrance, connecting diners intimately with nature's calendar." }, { heading: "Visual Harmony Through Ceramics", body: "An old proverb says: 'Japanese food is eaten with the eyes.' Irregular earthenware bowls in autumn and cool translucent glassware in summer reflect the seasonal environment outside." }] }, "culture-20": { title: "Combining Live Action with Open-Source CGI: The Legacy of 'Tears of Steel'", summary: "How the Blender Foundation proved that open-source software and open licenses can produce studio-caliber visual effects and sci-fi cinema.", source: "Wikipedia · Tears of Steel (Open Movie)", date: "Open Source Cinema", recommendationReason: "A milestone study in open-source creativity, digital visual effects, and collective global collaboration.", keyPoints: ["Live-action footage shot in Amsterdam blended with full 3D robotic armatures and post-apocalyptic environments.", "Blender open-source 3D suite used for camera tracking, compositing, color grading, and rendering.", "Creative Commons licensing releasing all project assets, scripts, and 3D rigs freely for global learners."], sections: [{ heading: "A Bold Experiment in Open-Source Cinema", body: "In 2012, the Blender Foundation brought international VFX artists to Amsterdam to shoot a live-action science-fiction short, aiming to push open-source tools to professional Hollywood limits." }, { heading: "Breakthroughs in Open-Source Visual Pipelines", body: "Production of 'Tears of Steel' drove major improvements in Blender's native motion tracking, green-screen keying, and node-based compositing, proving proprietary software was no longer mandatory." }, { heading: "The Generosity of Open Collaboration", body: "Every digital asset, raw 4K camera frame, and textured 3D mech model was released freely to the public under Creative Commons licenses, providing an invaluable masterclass for aspiring digital filmmakers." }] }, "culture-21": { title: "The Evolutionary History of Song: From Prehistoric Chants to Modern Recorded Music", summary: "Why humans sing: The social bonding of communal singing, acoustic storytelling, and the recording technology revolution.", source: "Wikipedia · History of Song & Singing", date: "Music History", recommendationReason: "An anthropological and musicological survey of how human voice and melodic harmony shaped civilization.", keyPoints: ["Singing as an ancient communal bonding tool pre-dating complex spoken syntactical language.", "Troubadours, bards, and folk songs transmitting historical lore and moral philosophy across generations.", "The 20th-century recording revolution transforming singing from ephemeral live moments into universal global culture."], sections: [{ heading: "The Voice as Our First Musical Instrument", body: "Evolutionary anthropologists believe rhythmic vocalizing helped early hominids synchronize group emotions, sooth infants, and build tribal solidarity long before written words existed." }, { heading: "The Bardic Tradition of Oral History", body: "Across ancient civilizations, traveling bards encoded genealogical histories, heroic epics, and moral philosophies into rhyming verses that could be easily remembered and sung by heart." }, { heading: "The Phonograph and Democratic Listening", body: "The invention of sound recording liberated music from physical performance halls, allowing human voices from every continent to resonate inside living rooms around the world." }] }, "culture-22": { title: "How Feminist Movements Reshaped Society: Suffrage, Workplace Rights & Modern Discourse", summary: "A historical reflection on feminist milestones: The fight for voting rights, reproductive autonomy, workplace pay equity, and contemporary intersectional solidarity.", source: "Wikipedia · Feminist Movements", date: "Social History", recommendationReason: "A historical and sociological overview of civil rights milestones that expanded legal, social, and economic equality.", keyPoints: ["First-wave suffrage movements securing fundamental constitutional voting rights for women.", "Second and third waves breaking professional barriers, advocating equal workplace pay, and challenging cultural stereotypes.", "Contemporary intersectional dialogues championing universal human dignity across diverse backgrounds."], sections: [{ heading: "The Battle for the Ballot: First-Wave Suffrage", body: "In the late 19th and early 20th centuries, courageous suffragettes endured imprisonment and public ridicule to win the foundational democratic right to vote and hold public office." }, { heading: "Dismantling Institutional Barriers", body: "Mid-20th-century feminist movements expanded the struggle into higher education, corporate boardrooms, and legal protections against domestic violence and workplace discrimination." }, { heading: "Intersectional Solidarity in the 21st Century", body: "Modern feminist discourse recognizes that gender equality intersects deeply with socioeconomic class, ethnicity, and disability, working toward universal justice for all marginalized communities." }] }, "culture-23": { title: "The Culture of Omakase: Chef's Intuition, Seasonality & Gastronomic Storytelling", summary: "Entrusting your dinner to the chef: Counter-side dialogue, knife craftsmanship, fish aging techniques, and the modern experience economy of fine dining.", source: "Wikipedia · Omakase Dining Culture", date: "Gourmet Trends", recommendationReason: "Understand the culinary etiquette, knife mastery, and hospitality philosophy behind personalized omakase dining.", keyPoints: ["Omakase literally meaning 'I leave it up to you': A relationship of trust between diner and artisan chef.", "Counter seating turning dining into an intimate, front-row theatrical performance of precision knife work.", "A cultural manifestation of the modern experience economy where diners invest in authentic craftsmanship."], sections: [{ heading: "The Philosophy of Trust: Entrusting Your Meal", body: "Unlike ordering from fixed menus, omakase asks the guest to surrender control to the chef, who curates a bespoke succession of dishes based on morning fish-market catches and guest reactions." }, { heading: "Intimate Counter Hospitality (Omotenashi)", body: "Sitting directly across from the master allows diners to observe knife angles, precise rice seasoning temperatures, and subtle culinary pacing, fostering warm personal connection." }, { heading: "The Rise of Experiential Gastronomy", body: "In modern cities, omakase has expanded into hanwoo beef, coffee, and dessert bars, reflecting consumers' desire to trade mass consumption for bespoke, memorable artisanal encounters." }] }, "hobby-1": { title: "Running Form Fundamentals: Midfoot Landing, Cadence & Knee Injury Prevention", summary: "The biomechanics of safe running: Why overstriding ruins knee joints, how to establish a 180 SPM cadence, and upright core posture.", source: "YouTube · Running Fundamentals", date: "Must Watch", recommendationReason: "Essential mechanics guide for runners of all levels to enjoy effortless strides without shin splints or knee pain." }, "hobby-2": { title: "Home Hand-Drip Pour Over Essentials: Roasting Profiles, Grind Size & Water Ratios", summary: "A step-by-step masterclass: Blooming timers, pouring circles, water temperatures, and choosing between Hario V60 and Kalita Wave.", source: "Specialty Coffee Association (SCA) Korea", date: "Today", recommendationReason: "Master specialty coffee brewing at home with precise extraction science and aromatic balance.", keyPoints: ["The holy triad of pour over: coffee bean freshness, uniform grind particle distribution, and 90~93°C water temperature.", "The blooming stage: 40 seconds of pre-wetting to degas CO2 and open the bed for optimal flavor extraction.", "Dripper geometry: Conical Hario V60 highlighting bright acidity vs flat-bottom Kalita Wave emphasizing sweet body."], sections: [{ heading: "The Three Decisive Variables in Every Cup", body: "Hand-drip coffee is accessible science. Balancing freshly roasted beans, a 1:15 to 1:16 coffee-to-water ratio, and 92°C filtered water extracts sweet fruit notes while avoiding bitter over-extraction." }, { heading: "Blooming: Opening Coffee's Lungs in 40 Seconds", body: "Pouring twice the coffee's weight in hot water and pausing for 40 seconds allows trapped carbon dioxide gas to escape, creating a permeable coffee bed for uniform solvent extraction." }, { heading: "Choosing Your Dripper: Conical vs Flat Bed", body: "The conical Hario V60 features a single large exit hole and spiraled ribs, producing a bright, clean, tea-like clarity. The flat-bottom Kalita Wave slows flow rate, yielding rounded sweetness and rich body." }] }, "hobby-4": { title: "5 Hardy Air-Purifying Indoor Plants That Thrive Even in Low Indirect Light", summary: "Rescue your home garden: Understanding light thresholds, soil drainage, bottom-watering, and top air-cleaning houseplants for beginners.", source: "National Institute of Forest Science · Indoor Gardening", date: "2d ago", recommendationReason: "Beginner-friendly indoor plant care tips to green your living space and purify indoor air effortlessly.", keyPoints: ["The number one killer of indoor houseplants is chronic overwatering, not underwatering.", "Understanding indoor light: Bright indirect light near windows vs low light in corners.", "Top 5 beginner champions: Snake Plant, ZZ Plant, Pothos, Peace Lily, and Monstera."], sections: [{ heading: "Escaping the 'Plant Killer' Curse", body: "Most indoor plants perish from root rot caused by stagnant water in dense soil. Roots require oxygen as much as moisture. Always ensure pots have drainage holes and allow topsoil to dry before watering." }, { heading: "Checking Soil and Bottom-Watering Secrets", body: "Insert a wooden chopstick 3cm into the pot; if it comes out clean and dry, it is time to water. Bottom-watering by letting the pot sit in a saucer of water encourages deep, sturdy root growth." }, { heading: "Top Beginner Indoor Plant Champions", body: "Snake plants and ZZ plants thrive on neglect and handle dim light effortlessly. For trailing green aesthetics, resilient golden pothos forgives forgotten waterings while purifying air." }] }, "hobby-5": { title: "Authentic Korean-Style Aglio e Olio: Garlic-Infused Pasta with a Savory K-Twist", summary: "Culinary secrets to rich pasta: Emulsifying starchy pasta water with olive oil, golden garlic browning, and a pinch of savory seasoned salt.", source: "YouTube · Paik Jong-won Cooking", date: "Featured Video", recommendationReason: "Master the Italian classic with clever Korean home-cooking tips for rich, non-greasy garlic pasta." }, "hobby-6": { title: "iPad Drawing and Urban Sketching: Embracing Imperfection in Everyday Line Art", summary: "Overcoming blank-canvas fear: Quick gesture doodles, traveling with a digital stylus, and building your personal color palette.", source: "Urban Sketchers Archive", date: "4d ago", recommendationReason: "Inspires creative confidence to capture everyday street scenes and travel memories through relaxing line sketches.", keyPoints: ["The magic of doodling: Erasing perfectionism by embracing wobbly, organic hand-drawn lines.", "Urban sketching philosophy: Recording the authentic sensory atmosphere of a travel moment in 15 minutes.", "Building signature digital color palettes with muted pastel tones and textured ink brushes."], sections: [{ heading: "Curing Blank Canvas Paralysis with Quick Doodles", body: "Staring at an empty white digital canvas can be intimidating. Starting with loose, continuous contour lines without lifting your stylus trains your eye to see shapes rather than judgment." }, { heading: "Urban Sketching: Preserving Travel Moments Forever", body: "A digital sketch captures memories far more vividly than a quick smartphone snap. Sitting on a bench for 15 minutes to sketch a historic café cements the sound of chatter and the afternoon breeze into memory." }, { heading: "Crafting Your Personal Color Palette", body: "Limit each drawing to two or three harmonized colors. Using soft watercolor wash brushes with paper-texture overlays creates warm, inviting analog textures directly on your iPad." }] }, "hobby-8": { title: "Air Fryer Golden Butter Scones: Crisp on the Outside, Fluffy on the Inside", summary: "The perfect weekend baking project: Cold butter 'sanding' technique, creating flaky layers, and foolproof air fryer temperature settings.", source: "Home Baking Laboratory", date: "1w ago", recommendationReason: "Simple, fail-safe home baking guide to enjoy freshly baked European-style bakery scones in 20 minutes.", keyPoints: ["The golden rule of flaky scones: Keep unsalted butter icy cold until entering the oven.", "Sanding technique: Gently rubbing butter cubes into flour until pea-sized crumbs form.", "Air fryer baking secrets: 170°C for 15 minutes yields a golden crust and pillowy, moist interior."], sections: [{ heading: "The Ultimate Gateway to Home Baking: Scones", body: "Unlike sourdough or macarons that require hours of proofing and exacting humidity control, buttery British scones come together in a single mixing bowl in under 15 minutes." }, { heading: "Protect the Butter: Sanding and Layering", body: "Never let your butter melt into the dough. Cold butter cubes expand into steam pockets during baking, creating signature flaky layers and a melt-in-your-mouth crumb." }, { heading: "Air Fryer Settings for Golden Perfection", body: "Preheat your air fryer to 180°C. Brush the tops of your cut scone triangles with milk or egg wash for a lustrous sheen, and bake at 170°C for 14 to 16 minutes until delightfully golden." }] }, "hobby-9": { title: "Doenjang Mayo Kimchi Fried Rice: An Addictive Savory Korean Fusion Recipe", summary: "Why adding half a spoon of Korean fermented soybean paste and a swirl of mayonnaise elevates standard kimchi fried rice into restaurant-grade comfort food.", source: "WorldSkills Korean Cuisine Archive", date: "Cooking Tips", recommendationReason: "A creative culinary hack that balances acidic kimchi with rich, savory fermented depth.", keyPoints: ["A teaspoon of Doenjang adds deep savory umami that rounds out sharp, fermented kimchi acidity.", "Coating cooked rice in mayonnaise before stir-frying separates individual grains for a non-soggy texture.", "Finishing with a crispy sunny-side-up egg and toasted seaweed strips for the ultimate comfort meal."], sections: [{ heading: "The Secret Flavor Weapon: Fermented Doenjang", body: "Standard kimchi fried rice can sometimes taste overly sour or one-dimensional. Searing half a teaspoon of Korean fermented soybean paste with scallion oil adds deep umami undertones." }, { heading: "Mayonnaise: The Grain-Separating Hack", body: "Mixing a tablespoon of mayonnaise into chilled rice before adding it to the wok coats each grain in oil and egg lecithin, ensuring individual grains fry crisp rather than clumping." }, { heading: "High-Heat Assembly and Plating", body: "Stir-fry well-aged kimchi until caramelized, toss in the coated rice over roaring heat, and press against the bottom of the pan for a minute to achieve coveted crispy rice (Nurungji) bottoms." }] }, "hobby-10": { title: "Smartphone Photography Masterclass: Composition, Natural Lighting & Perspective", summary: "Take professional photographs on your phone: Enabling 3x3 grid lines, reading natural directional light, and manual exposure locks.", source: "Smartphone Photography Academy", date: "Photography Tips", recommendationReason: "Instantly transform everyday travel and food snapshots into striking, gallery-worthy photographs.", keyPoints: ["Always clean your camera lens glass to eliminate hazy light glare and smudged reflections.", "Activate the 3x3 grid rule of thirds, placing key subjects along intersecting grid lines.", "Tap and slide to manually lock focus and dial down exposure, preserving rich shadow details."], sections: [{ heading: "The Most Neglected Step: Cleaning Your Lens", body: "Smartphone lenses pick up finger oils constantly in pockets. Wiping the lens with your shirt before snapping a photo eliminates fuzzy glare and instantly restores razor-sharp contrast." }, { heading: "Reading the Direction of Natural Light", body: "Harsh midday sun casts unflattering shadows. Look for soft window light or golden hour sidelight that sculpts gentle contours and rich dimensional textures on food and portraits." }, { heading: "Tapping for Exposure Control", body: "Smartphones tend to overexpose scenes. Tap on your subject to lock focus, then drag the sun slider down slightly; slightly darker exposure yields richer color saturation and prevents blown-out skies." }] }, "hobby-11": { title: "The Enduring Charm of SpongeBob SquarePants: Animation History & Cultural Impact", summary: "Stephen Hillenburg's marine biology vision: Bikini Bottom's timeless optimism, hand-drawn character physics, and cross-generational pop culture legacy.", source: "Wikipedia · SpongeBob SquarePants", date: "Animation History", recommendationReason: "A heartwarming celebration of creative character design, surreal nautical humor, and animation craftsmanship.", keyPoints: ["Created by marine science educator Stephen Hillenburg to celebrate eccentric underwater life.", "Timeless character dynamics: SpongeBob's boundless optimism juxtaposed with Squidward's weary realism.", "A global pop culture milestone spanning hundreds of episodes, feature films, and viral internet memes."], sections: [{ heading: "Marine Biology Meets Whimsical Animation", body: "Before animating, creator Stephen Hillenburg taught marine science in California. SpongeBob was born from an educational comic book he drew to teach students about tidal pool sea creatures." }, { heading: "Universal Comedy Rooted in Timeless Archetypes", body: "The comedy of Bikini Bottom endures because it mirrors universal human archetypes—the cheerful workaholic sponge, the cynical clarinet-playing neighbor, and the penny-pinching crustacean boss." }, { heading: "An Enduring Icon of Modern Pop Culture", body: "Decades after its 1999 premiere, SpongeBob continues to inspire Broadway musicals, designer fashion collaborations, and millions of daily internet memes that connect multiple generations." }] }, "tech-draft-1": { title: "2026 On-Device AI Paradigm: Ultra-Lightweight Neural Networks in Your Pocket", summary: "How LLMs once dependent on massive server farms were compressed into sub-1-watt mobile silicon through NPU architectural innovation.", source: "Toss Tech", date: "Latest Tech", recommendationReason: "Explore how quantized neural networks deliver fast, private AI computing directly on personal mobile devices.", keyPoints: ["Compression of billion-parameter models via INT4/INT8 quantization and pruning.", "Dedicated NPU hardware engines processing tokens with sub-watt power efficiency.", "Zero-latency, privacy-first local inference without cloud round-trip delays."], sections: [{ heading: "The Liberation from Cloud Datacenters", body: "Early generative AI required high-power GPU server clusters. However, latency and privacy constraints catalyzed a rapid migration toward compact neural networks running on mobile silicon." }, { heading: "NPU Hardware Acceleration and Quantization", body: "Modern mobile SoCs integrate dedicated Neural Processing Units optimized for 8-bit and 4-bit integer matrix math, slashing memory footprints while sustaining high perceptual accuracy." }, { heading: "The Future of Sovereign Personal Intelligence", body: "On-device intelligence ensures sensitive photos, chats, and documents never leave the hardware boundary, giving users complete data sovereignty." }] }, "study-draft-1": { title: "Retrieval Practice Proven by Neuroscience: Why Passive Re-reading Fails", summary: "Passive review creates an illusion of competence. Explore the synaptic mechanisms of active retrieval that forge permanent memory traces.", source: "Harvard Business Review · Neuroscience Archive", date: "Cognitive Science", recommendationReason: "Transform passive reading into durable neural encoding through science-backed retrieval techniques.", keyPoints: ["Passive highlighting triggers surface recognition without deep neural consolidation.", "Active retrieval strengthens synaptic long-term potentiation (LTP).", "Spaced testing loops produce exponential retention gains compared to massed cramming."], sections: [{ heading: "The Illusion of Competence in Passive Reading", body: "When re-reading familiar text, the brain mistakes ease of visual recognition for true intellectual mastery, leading to swift forgetting during real-world recall." }, { heading: "Neurobiology of Synaptic Retrieval", body: "Every time the brain struggles to retrieve a memory without looking at notes, neural pathways undergo Long-Term Potentiation (LTP), physically cementing synaptic connections." }, { heading: "Practical Retrieval Systems for Daily Work", body: "Close the book immediately after reading and write three key concepts from memory. Implementing self-quizzing and flashcards turns fleeting input into lasting mastery." }] }, "culture-draft-1": { title: 'Spatial Branding in Seongsu & Hannam: The "Experience Economics" of Offline Pop-ups', summary: "In an era dominated by e-commerce, why do global brands flock to expensive physical pop-up spaces? Unpacking the neurology of spatial emotion.", source: "Cine21 · Independent & Art Feature", date: "Spatial Trend", recommendationReason: "Understand why tactile, multi-sensory physical spaces have become the ultimate brand differentiator in the digital age.", keyPoints: ["Digital channels offer friction-free buying but lack visceral emotional bonding.", "Multi-sensory physical spaces forge deep dopamine and memory associations.", "Pop-up venues operate as cultural media hubs designed for social sharing."], sections: [{ heading: "The Paradox of the Post-Digital Retail Era", body: "While digital storefronts solved convenience, they flattened brands into identical two-dimensional screens. Brands now build physical spaces not to sell goods, but to forge unforgettable emotional memories." }, { heading: "Multi-Sensory Architecture and Spatial Neurology", body: "Custom architectural scents, tactile materials, ambient lighting, and curated acoustic soundscapes engage all human senses simultaneously, creating profound neural resonance." }, { heading: "The Pop-Up as Ephemeral Cultural Media", body: "Limited-run pop-up spaces create psychological urgency (FOMO) and act as scenic stages for consumer co-creation, generating millions of organic social media impressions." }] }, "hobby-draft-1": { title: "Zone 2 Running for Heart Health & Mitochondria: Why Slowing Down Makes You Faster", summary: "Sprinting to exhaustion is not the most effective cardio. Dissecting the aerobic science that optimizes mitochondrial density and metabolic fat oxidation.", source: "Lifestyle Magazine B", date: "Health & Wellness", recommendationReason: "Discover the cardiovascular physiology behind low-intensity aerobic training for sustainable athletic longevity.", keyPoints: ["Zone 2 training operates below the first lactate threshold, maximizing mitochondrial biogenesis.", "Trains cellular physiology to burn lipid fats efficiently rather than quickly depleting glycogen.", "Minimizes central nervous system fatigue and joint strain while building an immense cardiovascular base."], sections: [{ heading: "The Science of Low-Intensity Aerobic Base", body: "Most recreational runners train too fast on easy days and too slow on hard days. Zone 2 training targets a conversational pace where lactate clearance matches lactate production." }, { heading: "Mitochondrial Density and Lipid Metabolism", body: "Zone 2 stimulates the growth of new cellular mitochondria and oxidative enzymes, transforming the body into an efficient engine capable of utilizing fatty acids as sustained fuel." }, { heading: "Sustainable Longevity Without Burnout", body: "By reducing cardiac strain and orthopedic pounding, Zone 2 running allows consistent weekly mileage volume without chronic inflammation or overtraining syndrome." }] }, "study-2199": { title: "Memory is Reconstruction, Not Storage: Synaptic Plasticity & the Neuroscience of Retrieval", summary: "Why passive re-reading creates an illusion of learning. How synaptic plasticity and Long-Term Potentiation (LTP) physically rewire the brain during active retrieval.", source: "Nature Neuroscience · Cognitive Review", date: "Neuroscience", recommendationReason: "Deep dive into neurobiology showing how challenging retrieval rewires brain circuitry for permanent retention.", keyPoints: ["Synaptic plasticity and NMDA receptor activation during active recall.", "Long-Term Potentiation (LTP) consolidating fragile short-term traces into cortical storage.", "Interleaving diverse problem sets to stimulate adaptive neural network routing."], sections: [{ heading: "The Myth of Static Brain Storage", body: "The human brain does not function like a hard drive storing static files. Memory is an active neural reconstruction process where every retrieval event alters and strengthens underlying synaptic connections." }, { heading: "Synaptic Plasticity and Long-Term Potentiation", body: "When neurons fire in synchronized patterns during focused recall, glutamate receptors activate Long-Term Potentiation (LTP), physically increasing synaptic spine density and dendritic branching." }, { heading: "Desirable Difficulty in Human Learning", body: "Cognitive effort that feels slightly strenuous during study produces vastly superior long-term retention. Embracing active retrieval transforms the brain into a resilient learning instrument." }] } };
function ql(i, e = "ko") {
  if (!i || e !== "en") return i;
  const t = sC[i.id];
    if(i.fullEditorial)return {...i,title:t?.title||i.title,summary:t?.summary||i.summary,
      duration:(i.duration||'').replace('약 ','About ').replace('분 읽기',' min read'),contentLanguage:'ko'};
  if (!t) {
    const s = i.duration ? i.duration.replace("분 읽기", " min read").replace("분 분량", " min read") : i.type === "video" ? "10:00" : "5 min read", o = i.date ? i.date.replace("어제", "Yesterday").replace("오늘", "Today").replace("일 전", "d ago") : "Recent";
    return { ...i, duration: s, date: o };
  }
  const n = t.duration || (i.duration ? i.duration.replace("분 읽기", " min read") : "5 min read"), r = t.date || i.date;
  return { ...i, title: t.title || i.title, summary: t.summary || i.summary, source: t.source || i.source, duration: n, date: r, recommendationReason: t.recommendationReason || i.recommendationReason, keyPoints: t.keyPoints || i.keyPoints, sections: t.sections || i.sections };
}
const xl = firebaseConfig, rB = () => xl.apiKey && xl.apiKey !== "YOUR_API_KEY";
let il = null, Ki = null, Oe = null, Et = null;
const Fl = /* @__PURE__ */ new Set(), Bp = new yn();
Bp.setCustomParameters({ prompt: "select_account" });
if (rB()) try {
  il = Df(xl), Ki = f_(il), Oe = Cv(il), oI(Oe, (i) => {
    Et = i, !i && mergeEnsureAnonymous(), Fl.forEach((e) => {
      try {
        e(i);
      } catch (t) {
        console.error(t);
      }
    });
  });
} catch (i) {
  console.error("Firebase 초기화 에러:", i);
}
else console.info("💡 Firebase 설정이 아직 완료되지 않아 로컬 모드(localStorage)로 동작합니다.");
async function Ev() {
  if (!Oe) throw new Error("Firebase Auth가 초기화되지 않았습니다.");
  try {
    return (await TI(Oe, Bp)).user;
  } catch (i) {
    if (i.code === "auth/popup-closed-by-user" || i.code === "auth/cancelled-popup-request") return null;
    throw console.error("Google 로그인 실패:", i), i;
  }
}
async function wv() {
  if (Oe) try {
    await mergeSaveCloud(), await aI(Oe);
  } catch (i) {
    throw console.error("로그아웃 실패:", i), i;
  }
}
function bv(i) {
  return Fl.add(i), Et !== void 0 && i(Et), () => Fl.delete(i);
}
async function hp(i, e) {
  if (!Ki || !i) return false;
  try {
    const t = yu(Ki, "users", i);
    return await Rm(t, { weights: e, updatedAt: /* @__PURE__ */ new Date() }, { merge: true }), true;
  } catch (t) {
    return console.error("클라우드 설정 저장 실패:", t), false;
  }
}
async function Dv(i) {
  if (!Ki || !i) return null;
  try {
    const e = yu(Ki, "users", i), t = await C_(e);
    if (t.exists()) return t.data().weights;
  } catch (e) {
    console.error("클라우드 설정 불러오기 실패:", e);
  }
  return null;
}
const sn = { USER_ID: "mamgorithm_telemetry_uid", PROFILE: "mamgorithm_telemetry_profile", BEHAVIOR: "mamgorithm_telemetry_behavior", ALGO_STATS: "mamgorithm_telemetry_algo", VISITS: "mamgorithm_telemetry_visits" };
function _v() {
  const i = navigator.userAgent || "";
  let e = "PC";
  /iPad|Tablet/i.test(i) || navigator.maxTouchPoints > 1 && window.innerWidth >= 768 ? e = "태블릿" : /Mobi|Android|iPhone/i.test(i) && (e = "모바일");
  let t = "기타";
  /Whale/i.test(i) ? t = "Naver Whale" : /SamsungBrowser/i.test(i) ? t = "Samsung Internet" : /Edg/i.test(i) ? t = "Microsoft Edge" : /Chrome/i.test(i) ? t = "Google Chrome" : /Safari/i.test(i) ? t = "Apple Safari" : /Firefox/i.test(i) && (t = "Mozilla Firefox");
  const n = document.documentElement.dataset.systemTheme === "dark" || window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches, s = (localStorage.getItem("mamgorithm_lang_v1") || (navigator.language && navigator.language.startsWith("ko") ? "ko" : "en")) === "ko" ? `한국어 (${navigator.language || "ko-KR"})` : `English (${navigator.language || "en-US"})`;
  return { deviceType: e, browser: t, colorTheme: n ? "다크 모드" : "라이트 모드", language: s };
}
function Iv() {
  const i = new URLSearchParams(window.location.search), e = i.get("utm_source"), t = i.get("utm_medium");
  if (e) return t ? `${e} (${t})` : e;
  const n = document.referrer;
  if (!n) return "직접 접속 (Direct / PWA)";
  if (n.includes("google")) return "구글 검색 (Google)";
  if (n.includes("naver")) return "네이버 (Naver)";
  if (n.includes("kakao") || n.includes("kakaotalk")) return "카카오톡 공유";
  if (n.includes("instagram")) return "인스타그램 (Instagram)";
  if (n.includes("twitter") || n.includes("x.com")) return "X (트위터)";
  try {
    return new URL(n).hostname;
  } catch {
    return "기타 웹사이트";
  }
}
class vv {
  constructor() {
    this.sessionStartTime = Date.now(), this.lastActiveTime = Date.now(), this.totalDwellSec = 0, this.isTabActive = true, this.cardDwellMap = {}, this.cardImpressions = {}, this.activeCardTimers = {}, this.currentReaderItem = null, this.readerStartTime = null, this.totalReaderDwellSec = 0, this.cardClickCount = 0, this.lastScrollY = window.scrollY, this.lastScrollTime = Date.now(), this.scrollSpeedSamples = [], this.tuneCount = 0, this.lastTuneTime = Date.now(), this.mixerHistory = [], this.reopenedBookmarkCount = 0, this.syncTimer = null, this.init();
  }
  init() {
    this.initSession(), this.setupActiveTimeTracker(), this.setupScrollSpeedTracker(), this.setupCardIntersectionObserver(), setInterval(() => {
      this.syncToFirestore();
    }, 3e4), window.addEventListener("visibilitychange", () => {
      document.hidden ? (this.isTabActive = false, this.syncToFirestore(true)) : (this.isTabActive = true, this.lastActiveTime = Date.now());
    }), window.addEventListener("pagehide", () => this.syncToFirestore(true));
  }
  initSession() {
    if (!localStorage.getItem(sn.USER_ID)) {
      const t = "user_" + Math.random().toString(36).substring(2, 10) + "_" + Date.now().toString(36);
      localStorage.setItem(sn.USER_ID, t);
    }
    let e = parseInt(localStorage.getItem(sn.VISITS) || "0", 10);
    e += 1, localStorage.setItem(sn.VISITS, e.toString()), this.visitCount = e, localStorage.getItem("mamgorithm_first_visit_date") || localStorage.setItem("mamgorithm_first_visit_date", (/* @__PURE__ */ new Date()).toISOString());
    try {
      const t = JSON.parse(localStorage.getItem(sn.BEHAVIOR) || "{}");
      this.totalDwellSec = t.totalAppDwellSec || 0, this.cardClickCount = t.cardClickCount || 0, this.totalReaderDwellSec = t.readerDwellSec || 0, this.cardDwellMap = t.cardDwellMap || {}, this.reopenedBookmarkCount = t.reopenedBookmarkCount || 0;
      const n = JSON.parse(localStorage.getItem(sn.ALGO_STATS) || "{}");
      this.tuneCount = n.tuneCount || 0, this.lastTuneTime = n.lastTuneTime || Date.now(), this.mixerHistory = n.mixerHistory || [];
    } catch {
    }
  }
  setupActiveTimeTracker() {
    setInterval(() => {
      this.isTabActive && !document.hidden && (this.totalDwellSec += 1);
    }, 1e3);
  }
  setupScrollSpeedTracker() {
    window.addEventListener("scroll", () => {
      const e = Date.now(), t = (e - this.lastScrollTime) / 1e3;
      if (t > 0.05) {
        const n = Math.abs(window.scrollY - this.lastScrollY), r = Math.round(n / t);
        this.scrollSpeedSamples.push(r), this.scrollSpeedSamples.length > 20 && this.scrollSpeedSamples.shift(), this.lastScrollY = window.scrollY, this.lastScrollTime = e;
      }
    }, { passive: true });
  }
  getAverageScrollSpeed() {
    if (this.scrollSpeedSamples.length === 0) return 0;
    const e = this.scrollSpeedSamples.reduce((t, n) => t + n, 0);
    return Math.round(e / this.scrollSpeedSamples.length);
  }
  setupCardIntersectionObserver() {
    typeof window > "u" || !("IntersectionObserver" in window) || (this.cardObserver = new IntersectionObserver((e) => {
      e.forEach((t) => {
        const n = t.target.dataset.id, r = t.target.dataset.category;
        if (n) {
          if (t.isIntersecting && t.intersectionRatio >= 0.5) this.activeCardTimers[n] = { start: Date.now(), category: r }, this.cardImpressions[n] = (this.cardImpressions[n] || 0) + 1;
          else if (this.activeCardTimers[n]) {
            const s = (Date.now() - this.activeCardTimers[n].start) / 1e3;
            s > 0.5 && s < 120 && (this.cardDwellMap[n] = (this.cardDwellMap[n] || 0) + Math.round(s * 10) / 10), delete this.activeCardTimers[n];
          }
        }
      });
    }, { threshold: [0.5] }));
  }
  observeFeedCards() {
    if (!this.cardObserver) return;
    document.querySelectorAll(".content-feed-card[data-id]").forEach((t) => this.cardObserver.observe(t));
  }
  trackCardClick(e, t = false) {
    this.cardClickCount += 1, t && (this.reopenedBookmarkCount += 1), this.scheduleSync();
  }
  trackReaderOpen(e) {
    this.currentReaderItem = e, this.readerStartTime = Date.now();
  }
  trackReaderClose() {
    if (this.readerStartTime && this.currentReaderItem) {
      const e = (Date.now() - this.readerStartTime) / 1e3;
      if (e > 1 && e < 600) {
        this.totalReaderDwellSec += Math.round(e);
        const t = this.currentReaderItem.id;
        this.cardDwellMap[t] = (this.cardDwellMap[t] || 0) + Math.round(e);
      }
    }
    this.currentReaderItem = null, this.readerStartTime = null, this.scheduleSync();
  }
  trackMixerChange(e, t) {
    this.tuneCount += 1;
    const n = Date.now(), r = Math.round((n - this.lastTuneTime) / 6e4);
    this.lastTuneTime = n;
    const s = Object.keys(t).filter((l) => t[l] === 0), o = Object.entries(t).sort((l, u) => u[1] - l[1]), c = o[0] ? o[0][0] : "study";
    this.mixerHistory.unshift({ timestamp: (/* @__PURE__ */ new Date()).toISOString(), prevWeights: { ...e }, newWeights: { ...t }, durationMinutes: r, topCategory: c, zeroCategories: s }), this.mixerHistory.length > 20 && this.mixerHistory.pop(), localStorage.setItem(sn.ALGO_STATS, JSON.stringify({ tuneCount: this.tuneCount, lastTuneTime: this.lastTuneTime, mixerHistory: this.mixerHistory })), this.scheduleSync();
  }
  calculateBookmarkStats(e, t) {
    const n = e.size;
    if (n === 0) return { bookmarkCount: 0, bookmarkCategoryRatio: { study: 0, tech: 0, culture: 0, hobby: 0 }, bookmarkMediaTypeRatio: { article: 0, video: 0 }, reopenedCount: this.reopenedBookmarkCount, bookmarkReopenedRatio: 0 };
    const r = { study: 0, tech: 0, culture: 0, hobby: 0 }, s = { article: 0, video: 0 };
    e.forEach((u) => {
      const h = t.find((d) => d.id === u);
      if (h) {
        r[h.category] !== void 0 && (r[h.category] += 1);
        const d = h.type === "video" ? "video" : "article";
        s[d] = (s[d] || 0) + 1;
      }
    });
    const o = {};
    for (const u of ["study", "tech", "culture", "hobby"]) o[u] = Math.round(r[u] / n * 100);
    const c = { article: Math.round(s.article / n * 100), video: Math.round(s.video / n * 100) }, l = Math.min(100, Math.round(this.reopenedBookmarkCount / n * 100));
    return { bookmarkCount: n, bookmarkCategoryRatio: o, bookmarkMediaTypeRatio: c, reopenedCount: this.reopenedBookmarkCount, bookmarkReopenedRatio: l };
  }
  calculateActualConsumedCategoryRatio(e) {
    const t = { study: 0, tech: 0, culture: 0, hobby: 0 };
    let n = 0;
    for (const [r, s] of Object.entries(this.cardDwellMap)) {
      const o = e.find((c) => c.id === r);
      o && t[o.category] !== void 0 && (t[o.category] += s, n += s);
    }
    return n === 0 ? { study: 25, tech: 25, culture: 25, hobby: 25 } : { study: Math.round(t.study / n * 100), tech: Math.round(t.tech / n * 100), culture: Math.round(t.culture / n * 100), hobby: Math.round(t.hobby / n * 100) };
  }
  scheduleSync() {
    this.syncTimer && clearTimeout(this.syncTimer), this.syncTimer = setTimeout(() => {
      this.syncToFirestore();
    }, 2500);
  }
  buildFullTelemetrySnapshot(e, t) {
    var F, G, Z, ae, Be;
    const n = _v(), r = Iv(), s = /* @__PURE__ */ new Date(), o = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"], c = (e == null ? void 0 : e.weights) || { study: 50, tech: 50, culture: 50, hobby: 50 }, l = Object.keys(c).filter((fe) => c[fe] === 0), u = Object.entries(c).sort((fe, I) => I[1] - fe[1]), h = u[0] ? u[0][0] : "study", d = Math.round((Date.now() - this.lastTuneTime) / 6e4), m = this.calculateActualConsumedCategoryRatio(t || []), p = this.getAverageScrollSpeed(), w = this.calculateBookmarkStats((e == null ? void 0 : e.savedIds) || /* @__PURE__ */ new Set(), t || []), S = ((F = Oe == null ? void 0 : Oe.currentUser) == null ? void 0 : F.uid) || localStorage.getItem(sn.USER_ID) || "anonymous-user", N = ((G = Oe == null ? void 0 : Oe.currentUser) == null ? void 0 : G.email) || ((Z = Oe == null ? void 0 : Oe.currentUser) != null && Z.isAnonymous ? "비회원 (익명 UID)" : "미로그인");
    return { personalInfo: { userId: S, email: N, displayName: ((ae = Oe == null ? void 0 : Oe.currentUser) == null ? void 0 : ae.displayName) || null, photoURL: ((Be = Oe == null ? void 0 : Oe.currentUser) == null ? void 0 : Be.photoURL) || null, age: localStorage.getItem("mamgorithm_user_age") || null, gender: localStorage.getItem("mamgorithm_user_gender") || null, signupSource: r, createdAt: localStorage.getItem("mamgorithm_first_visit_date") || s.toISOString() }, behavior: { totalAppDwellSec: this.totalDwellSec, cardDwellMap: this.cardDwellMap, cardClickCount: this.cardClickCount, scrollVelocity: `${p} px/s`, readerDwellSec: this.totalReaderDwellSec, actualConsumedCategoryRatio: m }, algorithmSettings: { currentWeights: c, tuneCount: this.tuneCount, zeroCategories: l, topCategory: h, durationMinutesSinceLastTune: d, history: this.mixerHistory.slice(0, 10) }, bookmarks: w, accessPattern: { visitCount: this.visitCount, dayOfWeek: o[s.getDay()], hourOfDay: s.getHours(), lastActiveAt: s.toISOString() }, environment: n, updatedAt: s.toISOString() };
  }
  async syncToFirestore(e = false) {
    var t;
    try {
      const n = window.__mamgorithm_state, r = window.__mamgorithm_pool, s = this.buildFullTelemetrySnapshot(n, r);
      if (localStorage.setItem(sn.BEHAVIOR, JSON.stringify({ totalAppDwellSec: this.totalDwellSec, cardClickCount: this.cardClickCount, readerDwellSec: this.totalReaderDwellSec, cardDwellMap: this.cardDwellMap, reopenedBookmarkCount: this.reopenedBookmarkCount })), rB() && Ki) {
        const o = ((t = Oe == null ? void 0 : Oe.currentUser) == null ? void 0 : t.uid) || localStorage.getItem(sn.USER_ID);
        if (o) {
          const c = yu(Ki, "users", o);
          await Rm(c, s, { merge: true }), console.log("📡 [Telemetry] 29개 핵심 지표가 Firestore에 성공적으로 적재되었습니다.");
        }
      }
    } catch (n) {
      console.warn("📡 [Telemetry] 클라우드 동기화 대기 (로컬 캐시 보관):", n.message);
    }
  }
}
const Jt = new vv();
typeof window < "u" && (window.getTelemetryData = () => {
  const i = window.__mamgorithm_state, e = window.__mamgorithm_pool, t = Jt.buildFullTelemetrySnapshot(i, e);
  return console.table({ 아이디: t.personalInfo.userId, 이메일: t.personalInfo.email, 가입경로: t.personalInfo.signupSource, "총 체류시간": `${t.behavior.totalAppDwellSec}초`, "카드 클릭수": t.behavior.cardClickCount, "인앱 리더 열람": `${t.behavior.readerDwellSec}초`, "스크롤 속도": t.behavior.scrollVelocity, "실제 소비 분야": JSON.stringify(t.behavior.actualConsumedCategoryRatio), "현재 믹서 설정": JSON.stringify(t.algorithmSettings.currentWeights), "0% 배제 분야": JSON.stringify(t.algorithmSettings.zeroCategories), "1순위 분야": t.algorithmSettings.topCategory, "설정 변경 횟수": t.algorithmSettings.tuneCount, "현재 보관수": t.bookmarks.bookmarkCount, "보관 후 재열람률": `${t.bookmarks.bookmarkReopenedRatio}%`, "방문 횟수": t.accessPattern.visitCount, "접속 요일": t.accessPattern.dayOfWeek, "접속 시간대": `${t.accessPattern.hourOfDay}시`, "기기 종류": t.environment.deviceType, 브라우저: t.environment.browser, 테마: t.environment.colorTheme, 언어: t.environment.language }), t;
});
const mt = { WEIGHTS: "mamgorithm_weights_v2", SAVED_IDS: "mamgorithm_saved_v2", ONBOARDED: "mamgorithm_onboarded_v2", COACHMARK_SEEN: "mamgorithm_coachmark_seen", VISIT_COUNT: "mamgorithm_visit_count_v1", CUSTOM_CARDS: "mamgorithm_custom_cards_v1", INTRO_SEEN: "mamgorithm_intro_seen_v1" }, U = { weights: { study: 50, tech: 50, culture: 50, hobby: 50 }, currentTab: "viewFeed", contentType: "all", feedSize: 12, shuffleSeed: 0, savedIds: /* @__PURE__ */ new Set(), customCards: [], isDockExpanded: false, infinitePage: 1, isLoadingInfinite: false };
function sB() {
  const i = [...U.customCards, ...rC];
  return typeof window < "u" && (window.__mamgorithm_pool = i, window.__mamgorithm_state = U), i;
}
let ps = null, Xd = 0;
function dp() {
  try {
    const i = window.AudioContext || window.webkitAudioContext;
    return i ? (ps || (ps = new i()), ps.state === "suspended" && ps.resume().catch(() => {
    }), ps) : null;
  } catch {
    return null;
  }
}
if (typeof window < "u") {
  const i = () => {
    dp();
  };
  window.addEventListener("pointerdown", i, { passive: true, once: true }), window.addEventListener("touchstart", i, { passive: true, once: true });
}
function fp(i = "light") {
  try {
    const e = dp();
    if (!e || e.state !== "running") return;
    const t = e.currentTime, n = e.createOscillator(), r = e.createGain();
    n.type = "triangle", i === "light" ? (n.frequency.setValueAtTime(85, t), n.frequency.exponentialRampToValueAtTime(32, t + 0.012), r.gain.setValueAtTime(0.14, t), r.gain.exponentialRampToValueAtTime(1e-3, t + 0.012), n.start(t), n.stop(t + 0.013)) : i === "medium" ? (n.frequency.setValueAtTime(105, t), n.frequency.exponentialRampToValueAtTime(38, t + 0.018), r.gain.setValueAtTime(0.2, t), r.gain.exponentialRampToValueAtTime(1e-3, t + 0.018), n.start(t), n.stop(t + 0.019)) : i === "success" ? (n.frequency.setValueAtTime(95, t), n.frequency.exponentialRampToValueAtTime(130, t + 0.025), r.gain.setValueAtTime(0.22, t), r.gain.exponentialRampToValueAtTime(1e-3, t + 0.026), n.start(t), n.stop(t + 0.027)) : (n.frequency.setValueAtTime(75, t), n.frequency.exponentialRampToValueAtTime(28, t + 0.022), r.gain.setValueAtTime(0.18, t), r.gain.exponentialRampToValueAtTime(1e-3, t + 0.022), n.start(t), n.stop(t + 0.023)), n.connect(r), r.connect(e.destination);
  } catch {
  }
}
function X(i = "light") {
  const e = performance.now();
  if (i === "light" && e - Xd < 18) return;
  Xd = e;
  let t = false;
  if (typeof navigator < "u" && typeof navigator.vibrate == "function") try {
    switch (i) {
      case "light":
        t = navigator.vibrate(12);
        break;
      case "medium":
        t = navigator.vibrate(25);
        break;
      case "success":
        t = navigator.vibrate([18, 35, 24]);
        break;
      case "delete":
        t = navigator.vibrate([24, 40, 18]);
        break;
      default:
        t = navigator.vibrate(15);
    }
  } catch {
  }
  if (!t && i !== "light") try {
    const n = document.getElementById("iosHapticLabel");
    n && n.click();
  } catch {
  }
  fp(i);
}
let Qn = false, cn = null;
function Tv(i) {
  const e = document.getElementById("quickBrandSplash");
  if (!e) {
    typeof i == "function" && i();
    return;
  }
  const t = localStorage.getItem("mamgorithm_theme_v2") === "dark";
  e.classList.toggle("theme-dark", t), e.classList.toggle("theme-light", !t);
  let n = false;
  const r = () => {
    n || (n = true, e.classList.add("splash-dismissed"), setTimeout(() => {
      e.style.display = "none", typeof i == "function" && i();
    }, 240));
  };
  setTimeout(() => {
    try {
      fp("light");
    } catch {
    }
  }, 60);
  const s = setTimeout(r, 720);
  e.addEventListener("click", () => {
    clearTimeout(s), r();
  }, { once: true });
}
function Av(i) {
  const e = document.getElementById("introSplashOverlay"), t = document.getElementById("introStartGate"), n = document.getElementById("introVideoContainer"), r = document.getElementById("introVideo"), s = document.getElementById("btnStartExperience"), o = document.getElementById("btnStartSkipToFeed"), c = document.getElementById("btnIntroSkip"), l = document.getElementById("btnIntroMute"), u = document.getElementById("textIntroMute"), h = document.getElementById("quickBrandSplash");
  if (h && (h.style.display = "none"), !e || !t) {
    typeof i == "function" && i();
    return;
  }
  e.classList.remove("theme-dark"), e.classList.add("theme-light"), e.classList.remove("hidden"), e.style.display = "flex", t.classList.remove("hidden", "fade-out"), t.style.display = "flex", n && (n.classList.add("hidden"), n.style.display = "none"), Qn = false, cn && clearTimeout(cn);
  const d = () => {
    if (!Qn) {
      if (Qn = true, cn && clearTimeout(cn), localStorage.setItem(mt.INTRO_SEEN, "true"), document.documentElement.classList.remove("is-first-visit"), document.documentElement.classList.add("is-returning-user"), r) try {
        r.pause();
      } catch {
      }
      e.classList.add("hidden"), setTimeout(() => {
        e.style.display = "none", typeof i == "function" && i();
      }, 350);
    }
  };
  s && (s.onclick = () => {
    X("medium"), t.classList.add("fade-out"), setTimeout(() => {
      if (t.classList.add("hidden"), t.style.display = "none", n && r) {
        n.classList.remove("hidden"), n.style.display = "flex";
        const m = "/videos/intro_algo_light.mp4";
        r.src = m;
        try {
          r.currentTime = 0;
        } catch {
        }
        r.load(), r.muted = false, r.volume = 1, u && (u.textContent = P("intro.soundOn")), r.play().catch(() => {
          r.muted = true, u && (u.textContent = P("intro.soundOff")), r.play().catch(() => d());
        }), r.onended = d;
      } else d();
    }, 250);
  }), o && (o.onclick = () => {
    X("light"), d();
  }), c && (c.onclick = (m) => {
    m.stopPropagation(), X("light"), d();
  }), l && r && (l.onclick = (m) => {
    m.stopPropagation(), r.muted = !r.muted, X("light"), u && (u.textContent = r.muted ? P("intro.soundOff") : P("intro.soundOn"));
  }), cn = setTimeout(() => {
    Qn || d();
  }, 28e3);
}
function Sv() {
  const i = document.getElementById("introSplashOverlay"), e = document.getElementById("introStartGate"), t = document.getElementById("introVideoContainer"), n = document.getElementById("introVideo"), r = document.getElementById("btnIntroSkip"), s = document.getElementById("btnIntroMute"), o = document.getElementById("textIntroMute");
  if (!i || !n) return;
  const c = (l = "light") => {
    Qn = false, cn && clearTimeout(cn);
    const u = l === "dark";
    i.classList.toggle("theme-dark", u), i.classList.toggle("theme-light", !u);
    const h = u ? "/videos/intro_algo_dark.mp4" : "/videos/intro_algo_light.mp4";
    n.src = h;
    try {
      n.currentTime = 0;
    } catch {
    }
    n.load(), n.muted = false, n.volume = 1, o && (o.textContent = P("intro.soundOn")), e && (e.classList.add("hidden"), e.style.display = "none"), t && (t.classList.remove("hidden"), t.style.display = "flex"), n.play().catch(() => {
      n.muted = true, o && (o.textContent = P("intro.soundOff")), n.play().catch(() => d());
    });
    const d = () => {
      if (!Qn) {
        Qn = true, cn && clearTimeout(cn);
        try {
          n.pause();
        } catch {
        }
        i.classList.add("hidden"), i.classList.remove("force-show"), setTimeout(() => {
          i.style.display = "none";
        }, 350);
      }
    };
    n.onended = d, r && (r.onclick = (m) => {
      m.stopPropagation(), X("light"), d();
    }), s && (s.onclick = (m) => {
      m.stopPropagation(), n.muted = !n.muted, X("light"), o && (o.textContent = n.muted ? P("intro.soundOff") : P("intro.soundOn"));
    }), cn = setTimeout(() => {
      Qn || d();
    }, 24e3);
  };
  window.playIntroWithTheme = (l) => {
    i.classList.add("force-show"), i.classList.remove("hidden"), i.style.display = "flex", c(l);
  };
}
document.addEventListener("DOMContentLoaded", () => {
  eC(), hf(), Rv(), kv(), Uv(), tt({ withSkeleton: true, delay: 280 }), xv(), Sv();
  const i = () => {
    const t = localStorage.getItem(mt.ONBOARDED), n = sessionStorage.getItem("mamgorithm_auth_dismissed") === "true", r = Et && !Et.isAnonymous;
    if (!t && !r && !n) {
      Gl({ onDismiss: () => {
        Hl();
      } });
      return;
    }
    t ? localStorage.getItem(mt.COACHMARK_SEEN) || setTimeout(() => lB(), 400) : Hl();
  };
  localStorage.getItem(mt.INTRO_SEEN) === "true" ? Tv(i) : Av(i);
});
function Rv() {
  try {
    const i = localStorage.getItem(mt.WEIGHTS);
    if (i) {
      const r = JSON.parse(i), o = Math.max(...["study", "tech", "culture", "hobby"].map((c) => typeof r[c] == "number" ? r[c] : 0)) <= 3;
      ["study", "tech", "culture", "hobby"].forEach((c) => {
        if (typeof r[c] == "number") if (o) {
          const l = { 0: 0, 1: 25, 2: 50, 3: 100 };
          U.weights[c] = l[r[c]] ?? 50;
        } else U.weights[c] = Math.max(0, Math.min(100, Math.round(r[c])));
      });
    }
    const e = localStorage.getItem(mt.SAVED_IDS);
    e && (U.savedIds = new Set(JSON.parse(e)));
    const t = localStorage.getItem(mt.CUSTOM_CARDS);
    if (t) {
      const r = JSON.parse(t);
      Array.isArray(r) && (U.customCards = r.map(df));
    }
    const n = parseInt(localStorage.getItem(mt.VISIT_COUNT) || "0", 10);
    n === 0 ? (U.shuffleSeed = 0, localStorage.setItem(mt.VISIT_COUNT, "1")) : (U.shuffleSeed = Date.now() % 9973 + n * 53 || 1, localStorage.setItem(mt.VISIT_COUNT, String(n + 1))), document.body.classList.remove("apple-glass"), document.body.classList.toggle("dark-mode",localStorage.getItem("mamgorithm_theme_v2")==="dark");
  } catch (i) {
    console.warn("설정 불러오기 실패:", i);
  }
}
let Zd = { ...U.weights };
function an() {
  try {
    Jt.trackMixerChange(Zd, U.weights), Zd = { ...U.weights }, localStorage.setItem(mt.WEIGHTS, JSON.stringify(U.weights)), mergeCloudGeneration++, mergeScheduleSave();
  } catch {
  }
}
function qn() {
  try {
    localStorage.setItem(mt.SAVED_IDS, JSON.stringify([...U.savedIds])), mergeCloudGeneration++, mergeScheduleSave(), Jt.scheduleSync();
  } catch {
  }
}
function ef() {
  try {
    localStorage.setItem(mt.CUSTOM_CARDS, JSON.stringify(U.customCards));
  } catch {
  }
}
function kv() {
  try {
    const i = new URLSearchParams(window.location.search), e = i.get("s"), t = i.get("t"), n = i.get("c"), r = i.get("h");
    if (e !== null || t !== null || n !== null || r !== null) {
      const s = (h) => {
        if (h === null || isNaN(parseInt(h, 10))) return null;
        let d = parseInt(h, 10);
        return d <= 3 && !h.includes("0") ? { 0: 0, 1: 25, 2: 50, 3: 100 }[d] ?? d : Math.max(0, Math.min(100, d));
      }, o = s(e), c = s(t), l = s(n), u = s(r);
      o !== null && (U.weights.study = o), c !== null && (U.weights.tech = c), l !== null && (U.weights.culture = l), u !== null && (U.weights.hobby = u), an(), X("success"), xe(P("toast.recipeApplied"));
    }
  } catch {
  }
}
function tf() {
  const i = `${window.location.origin}${window.location.pathname}?s=${U.weights.study}&t=${U.weights.tech}&c=${U.weights.culture}&h=${U.weights.hobby}`, e = P("toast.shareMsg", { study: U.weights.study, tech: U.weights.tech, culture: U.weights.culture, hobby: U.weights.hobby });
  navigator.share ? navigator.share({ title: P("stats.shareTitle"), text: e, url: i }).then(() => {
    X("success");
  }).catch(() => {
  }) : navigator.clipboard && navigator.clipboard.writeText ? navigator.clipboard.writeText(i).then(() => {
    X("success"), xe(P("toast.recipeCopied"));
  }).catch(() => {
    prompt(P("toast.sharePrompt"), i);
  }) : prompt(P("toast.sharePrompt"), i);
}
function ft() {
  const i = ["study", "tech", "culture", "hobby"], e = i.reduce((h, d) => h + U.weights[d], 0), t = {};
  if (e === 0) return i.forEach((h) => {
    t[h] = { weight: 0, exactPct: 0, displayPct: 0, cardCount: 0 };
  }), { totalWeight: 0, categories: t };
  const n = U.feedSize;
  let r = 0, s = 0;
  const o = [], c = [];
  i.forEach((h) => {
    const d = U.weights[h], m = d / e, p = m * 100, w = Math.floor(p), S = m * n, N = Math.floor(S);
    r += N, s += w, o.push({ cat: h, rem: S - N, weight: d }), c.push({ cat: h, rem: p - w, weight: d }), t[h] = { weight: d, exactPct: p, displayPct: w, cardCount: N };
  });
  let l = 100 - s;
  c.filter((h) => h.weight > 0).sort((h, d) => d.rem - h.rem || d.weight - h.weight).forEach((h) => {
    l > 0 && (t[h.cat].displayPct += 1, l -= 1);
  });
  let u = n - r;
  return o.filter((h) => h.weight > 0).sort((h, d) => d.rem - h.rem || d.weight - h.weight).forEach((h) => {
    u > 0 && (t[h.cat].cardCount += 1, u -= 1);
  }), { totalWeight: e, categories: t };
}
function Pv(i, e) {
  const t = [...i];
  if (e === 0) return t;
  let n = e;
  for (let r = t.length - 1; r > 0; r--) {
    n = (n * 9301 + 49297) % 233280;
    const s = Math.floor(n / 233280 * (r + 1));
    [t[r], t[s]] = [t[s], t[r]];
  }
  return t;
}
function gp(ratio,page=0,limit=8){
    if(ratio.totalWeight===0)return [];
    const key=JSON.stringify([U.weights,U.contentType,U.shuffleSeed,page,limit,U.customCards]);
    if(mergeFeedCache?.key===key)return mergeFeedCache.cards;
    const result=recommendPage(sB(),U.weights,{limit,type:U.contentType,recentIds:mergeRecentIds,seed:U.shuffleSeed+page*997});
    mergeRecentIds=updateRecentFeed(mergeRecentIds,result.cards.map(c=>c.id));
    mergeFeedCache={key,cards:result.cards};return result.cards;
  }
function Ov(i) {
  return gp(i, 0, U.feedSize);
}
function tt(i = {}) {
  const e = ft();
  mp(), i.withSkeleton ? Ml(e, i.delay || 260, i.onComplete) : ec(e), yp(e), Vl(e), Ep(), Mv(), Fv(), Dp(Et);
}
function Lv() {
  return `
    <div class="skeleton-card" aria-hidden="true">
      <div class="skeleton-main-box">
        <div class="skeleton-media-wrap skeleton-shimmer">
          <div class="skeleton-badge-overlay"></div>
          <div class="skeleton-duration-overlay"></div>
        </div>
        <div class="skeleton-content-body">
          <div class="skeleton-line skeleton-title-1 skeleton-shimmer"></div>
          <div class="skeleton-line skeleton-title-2 skeleton-shimmer"></div>
          <div class="skeleton-line skeleton-desc skeleton-shimmer"></div>
        </div>
      </div>
      <div class="skeleton-detached-footer skeleton-shimmer"></div>
    </div>
  `;
}
function Nv(i, e = 3) {
  i && (i.innerHTML = Array.from({ length: e }, () => Lv()).join(""));
}
let Cs = null;
function Ml(i, e = 260, t = null) {
  const n = document.getElementById("feedCardsList");
  if (!n) return;
  Cs && (clearTimeout(Cs), Cs = null);
  const r = window.innerWidth >= 768 ? 4 : 3;
  Nv(n, r), Cs = setTimeout(() => {
    ec(i), Cs = null, typeof t == "function" && t();
  }, e);
}
function mp() {
  const i = document.getElementById("presetContainer");
  i && (i.innerHTML = Fs.map((e) => `
      <button
        type="button"
        class="preset-chip-btn ${["study", "tech", "culture", "hobby"].every((n) => U.weights[n] === e.weights[n]) ? "active" : ""}"
        data-preset-id="${e.id}"
        title="${e.desc}"
      >
        ${e.name}
      </button>
    `).join(""));
}
function oB(i) {
  const e = ql(i, Zn()), t = Me[e.category] || Me.study, n = U.savedIds.has(e.id), r = e.type === "video", s = P(r ? "cards.video" : "cards.article"), o = Zn();
  let c = e.duration || (r ? "10:00" : o === "en" ? "5 min read" : "5분 읽기");
  return o === "en" && typeof c == "string" && (c = c.replace("분 읽기", " min read").replace("분 분량", " min")), `
    <article
      class="content-feed-card"
      data-id="${e.id}"
      data-type="${e.type}"
      data-category="${e.category}"
      data-url="${e.url}"
      role="link"
      tabindex="0"
      aria-label="${t.name} ${s}: ${e.title}"
    >
      <!-- 1. 상단 메인 콘텐츠 카드 (썸네일 + 제목 + 요약) -->
      <div class="card-main-box">
        <div class="card-media-wrap" style="--subject-background:${/^#[0-9a-f]{6}$/i.test(e.imageBackground||'')?e.imageBackground:'var(--bg-subtle)'}">
          <img
            src="${e.imageUrl}"
            alt="${e.imageAlt||e.title}"
            class="card-media-img${e.imageFit==='contain'?' is-subject-image':''}" style="object-position:${e.imagePosition||'50% 50%'}" decoding="async"
            loading="lazy"
            onerror="window.handleCardImageError(this,'${e.imageFallbackUrl||''}')"
          />
          <div class="card-tag-overlay">
            <span class="card-tag-indicator" style="background-color: ${t.color}"></span>
            <span><strong>${t.name}</strong> · ${s}</span>
          </div>
          ${e.isNew ? `<span class="card-badge-new">${P("cards.badgeNew")}</span>` : ""}
          <span class="card-duration-overlay">${c}</span>
          <button
            type="button"
            class="card-bookmark-btn ${n ? "saved" : ""}"
            data-bookmark-id="${e.id}"
            title="${P(n ? "cards.bookmarkRemove" : "cards.bookmarkSave")}"
            aria-label="${P("cards.bookmarkSave")}"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="${n ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
          </button>
        </div>

        <div class="card-content-body">
          <h3 class="card-title-text">${e.title}</h3>
          <p class="card-summary-text">${e.summary}</p>
        </div>
      </div>

      <!-- 2. 하단 완전히 분리된 솔리드 테마 출처 캡슐 바 (순백색 폰트 + 테마 솔리드) -->
      <div
        class="card-detached-footer"
        style="--footer-solid-bg: ${t.solidBg}; --footer-solid-text: ${t.solidText}; --footer-solid-border: ${t.solidBorder}; --footer-dark-bg: ${t.darkSolidBg}; --footer-dark-border: ${t.darkSolidBorder}; --footer-glow: ${t.glowShadow};"
      >
        <div class="card-footer-source">
          <span class="card-footer-source-label">${P("cards.sourceLabel")}</span>
          <strong class="card-footer-source-name">${e.source}</strong>
          <span class="card-footer-sep">·</span>
          <span class="card-footer-date">${e.date}</span>
        </div>
      </div>
    </article>
  `;
}
function ec(i) {
  const e = document.getElementById("feedCardsList");
  if (!e) return;
  U.infinitePage = 1, U.isLoadingInfinite = false;
  const t = document.getElementById("infiniteElasticContainer");
  t && (t.classList.remove("active", "pulling"), t.style.maxHeight = "", t.style.transform = "");
  const n = document.getElementById("infiniteScrollSentinel");
  if (n && (n.style.display = i.totalWeight === 0 ? "none" : "flex"), i.totalWeight === 0) {
    e.innerHTML = `
      <div class="empty-feed-placeholder">
        <div class="empty-feed-title">${P("feed.emptyTitle")}</div>
        <p class="empty-feed-desc">${P("feed.emptyDesc")}</p>
        <button type="button" class="btn-primary-reset" id="btnRestoreBalance">${P("feed.restoreBalance")}</button>
      </div>
    `;
    const s = document.getElementById("btnRestoreBalance");
    s && s.addEventListener("click", () => {
      U.weights = { study: 50, tech: 50, culture: 50, hobby: 50 }, an(), tt(), X("medium"), xe(P("toast.balancedApplied"));
    });
    return;
  }
  const r = Ov(i);
  e.innerHTML = r.map(oB).join(""), setTimeout(() => Jt.observeFeedCards(), 60);
}
async function nf() {
  if (U.isLoadingInfinite || U.currentTab !== "viewFeed") return;
  const i = ft();
  if (i.totalWeight === 0) return;
  const e = document.getElementById("infiniteElasticContainer"), t = document.getElementById("feedCardsList");
  if (!t) return;
  U.isLoadingInfinite = true, e && (e.classList.remove("pulling"), e.style.maxHeight = "", e.style.transform = "", e.classList.add("active")), X("light"), await new Promise((r) => setTimeout(r, 600)), U.infinitePage = (U.infinitePage || 1) + 1;
  const n = gp(i, U.infinitePage - 1, 8);
  if (n.length > 0) {
    const r = document.createElement("div");
    for (r.innerHTML = n.map((s, o) => oB(s).replace('class="content-feed-card"', `class="content-feed-card infinite-entrance" style="--stagger-idx:${o};"`)).join(""); r.firstChild; ) t.appendChild(r.firstChild);
    X("selection"), setTimeout(() => Jt.observeFeedCards(), 80);
  }
  e && e.classList.remove("active"), setTimeout(() => {
    U.isLoadingInfinite = false;
  }, 450);
}
function xv() {}
function aB(i) {
  i || (i = ft());
  const e = ["study", "tech", "culture", "hobby"], t = document.getElementById("dockTopGauge");
  t && (!t.querySelector(".gauge-segment") || t.children.length !== 4 ? t.innerHTML = e.map((o) => {
    const c = Me[o], l = i.totalWeight === 0 ? 0 : i.categories[o].exactPct;
    return `<div class="gauge-segment" data-cat="${o}" style="width:${l}%; background-color:${c.color}"></div>`;
  }).join("") : e.forEach((o) => {
    const c = t.querySelector(`.gauge-segment[data-cat="${o}"]`);
    if (c) {
      const l = i.totalWeight === 0 ? 0 : i.categories[o].exactPct;
      c.style.width = `${l}%`;
    }
  }));
  const n = document.getElementById("dockRatioPills");
  n && (i.totalWeight === 0 ? n.innerHTML = `<span style="font-size:0.74rem; color:var(--text-muted); font-weight:600;">${P("dock.allExcluded")}</span>` : n.innerHTML = e.filter((o) => U.weights[o] > 0).map((o) => {
    const c = Me[o], l = i.categories[o];
    return `
            <span class="dock-ratio-pill">
              <span class="dock-ratio-dot" style="background-color: ${c.color}"></span>
              <span>${c.name} <strong>${l.displayPct}%</strong></span>
            </span>
          `;
  }).join(""));
  const r = document.getElementById("dockStackedBar");
  r && (!r.querySelector(".gauge-segment") || r.children.length !== 4 ? r.innerHTML = e.map((o) => {
    const c = Me[o], l = i.totalWeight === 0 ? 0 : i.categories[o].exactPct;
    return `<div class="gauge-segment" data-cat="${o}" style="width:${l}%; background-color:${c.color}"></div>`;
  }).join("") : e.forEach((o) => {
    const c = r.querySelector(`.gauge-segment[data-cat="${o}"]`);
    if (c) {
      const l = i.totalWeight === 0 ? 0 : i.categories[o].exactPct;
      c.style.width = `${l}%`;
    }
  }));
  const s = document.getElementById("dockLegendRow");
  s && (!s.querySelector(".gauge-legend-pill") || s.children.length !== 4 ? s.innerHTML = e.map((o) => {
    const c = Me[o], l = i.categories[o];
    return `
          <div class="gauge-legend-pill" data-cat="${o}">
            <div class="legend-name-group">
              <span class="legend-dot" style="background-color: ${c.color}"></span>
              <span class="legend-theme-name">${c.name}</span>
              <span class="legend-theme-sep">|</span>
              <span class="legend-theme-desc">${c.description}</span>
            </div>
            <span class="legend-pct-text">${l.displayPct}%</span>
          </div>
        `;
  }).join("") : e.forEach((o) => {
    const c = s.querySelector(`.gauge-legend-pill[data-cat="${o}"]`), l = c == null ? void 0 : c.querySelector(".legend-pct-text");
    l && (l.textContent = `${i.categories[o].displayPct}%`);
  }));
}
function pp(i) {
  const e = ["study", "tech", "culture", "hobby"], t = document.getElementById("onboardingStackedBar"), n = document.getElementById("onboardingLegendRow");
  t && (!t.querySelector(".gauge-segment") || t.children.length !== 4 ? t.innerHTML = e.map((r) => {
    const s = Me[r], o = i.totalWeight === 0 ? 0 : i.categories[r].exactPct;
    return `<div class="gauge-segment" data-cat="${r}" style="width:${o}%; background-color:${s.color}"></div>`;
  }).join("") : e.forEach((r) => {
    const s = t.querySelector(`.gauge-segment[data-cat="${r}"]`);
    if (s) {
      const o = i.totalWeight === 0 ? 0 : i.categories[r].exactPct;
      s.style.width = `${o}%`;
    }
  })), n && (!n.querySelector(".gauge-legend-pill") || n.children.length !== 4 ? n.innerHTML = e.map((r) => {
    const s = Me[r], o = i.categories[r];
    return `
          <div class="gauge-legend-pill" data-cat="${r}">
            <div class="legend-name-group">
              <span class="legend-dot" style="background-color: ${s.color}"></span>
              <span class="legend-theme-name">${s.name}</span>
              <span class="legend-theme-sep">|</span>
              <span class="legend-theme-desc">${s.description}</span>
            </div>
            <span class="legend-pct-text">${o.displayPct}%</span>
          </div>
        `;
  }).join("") : e.forEach((r) => {
    const s = n.querySelector(`.gauge-legend-pill[data-cat="${r}"]`), o = s == null ? void 0 : s.querySelector(".legend-pct-text");
    o && (o.textContent = `${i.categories[r].displayPct}%`);
  }));
}
function rf(i, e) {
  i && (i.id, i.querySelectorAll("[data-channel]").forEach((t) => {
    const n = t.dataset.channel, r = U.weights[n], s = e.categories[n], o = t.querySelector(".channel-status-pill");
    o && (o.innerHTML = r === 0 ? '<span class="is-zero">0%</span>' : `<span class="pct-num">${s.displayPct}</span><span class="pct-unit">%</span>`), t.querySelectorAll(".tick-label").forEach((l) => {
      const u = parseInt(l.dataset.val, 10);
      l.classList.toggle("active", u === r);
    });
  }));
}
function Cp(i) {
  i || (i = ft());
  const e = document.getElementById("mixerInlineAlert"), t = document.getElementById("btnApplyDockMixer"), n = i.totalWeight === 0;
  e && e.classList.toggle("hidden", !n), t && t.classList.toggle("disabled", n);
}
function yp(i) {
  i || (i = ft());
  const e = ["study", "tech", "culture", "hobby"];
  aB(i), Cp(i);
  const t = document.getElementById("dockSlidersList");
  t && (t.innerHTML = e.map((n) => {
    const r = Me[n], s = U.weights[n], o = i.categories[n];
    return `
        <div class="mixer-channel-card" data-channel="${n}">
          <div class="channel-top-line">
            <div class="channel-title-group">
              <span class="channel-color-bar" style="background-color: ${r.color}"></span>
              <div class="channel-name">${r.name}</div>
            </div>
            <span class="channel-status-pill" style="color: ${r.color}">
              ${s === 0 ? '<span class="is-zero">0%</span>' : `<span class="pct-num">${o.displayPct}</span><span class="pct-unit">%</span>`}
            </span>
          </div>

          <div class="slider-wrap">
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value="${s}"
              class="channel-range-input dock-range-input"
              data-cat="${n}"
              style="--thumb-color: ${r.color}; background: linear-gradient(to right, ${r.color} ${s}%, var(--bg-subtle) ${s}%);"
              aria-label="${r.name} ${P("dock.title")}"
            />
            <div class="slider-ticks-row">
              <span class="tick-label ${s === 0 ? "active" : ""}" data-cat="${n}" data-val="0">${P("sliders.ticks.0")}</span>
              <span class="tick-label ${s === 25 ? "active" : ""}" data-cat="${n}" data-val="25">${P("sliders.ticks.25")}</span>
              <span class="tick-label ${s === 50 ? "active" : ""}" data-cat="${n}" data-val="50">${P("sliders.ticks.50")}</span>
              <span class="tick-label ${s === 75 ? "active" : ""}" data-cat="${n}" data-val="75">${P("sliders.ticks.75")}</span>
              <span class="tick-label ${s === 100 ? "active" : ""}" data-cat="${n}" data-val="100">${P("sliders.ticks.100")}</span>
            </div>
          </div>
        </div>
      `;
  }).join(""));
}
let vr = false;
function oa() {
  var t;
  const i = document.getElementById("dockMixerContainer");
  if (!i || vr) return;
  vr = true, U.isDockExpanded = true;
  const e = ft();
  yp(e), i.classList.remove("closing"), i.classList.add("expanded"), (t = document.getElementById("dockPeekBar")) == null || t.setAttribute("aria-expanded", "true"), document.body.style.overflow = "hidden", X("medium"), setTimeout(() => {
    vr = false;
  }, 360);
}
function vs() {
  var t;
  const i = document.getElementById("dockMixerContainer");
  if (!i || vr || !i.classList.contains("expanded")) return;
  vr = true, U.isDockExpanded = false, (t = document.getElementById("dockPeekBar")) == null || t.setAttribute("aria-expanded", "false"), document.body.style.overflow = "";
  const e = ft();
  aB(e), X("light"), i.classList.add("closing"), setTimeout(() => {
    i.classList.remove("expanded"), i.classList.remove("closing"), vr = false;
  }, 280);
}
function Vl(i) {
  const e = document.getElementById("statsTableContainer");
  if (!e) return;
  const t = ["study", "tech", "culture", "hobby"].map((n) => {
    const r = Me[n], s = i.categories[n], o = iC(s.weight);
    return `
        <tr>
          <td>
            <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background-color:${r.color}; margin-right:6px;"></span>
            <strong>${r.name}</strong>
          </td>
          <td>${s.weight}% (${o.label})</td>
          <td><strong>${s.displayPct}%</strong></td>
          <td>${s.cardCount}${P("stats.cardsUnit")}</td>
        </tr>
      `;
  }).join("");
  e.innerHTML = `
    <table class="stats-table">
      <thead>
        <tr>
          <th>${P("stats.thCategory")}</th>
          <th>${P("stats.thWeight")}</th>
          <th>${P("stats.thRatio")}</th>
          <th>${P("stats.thCards")}</th>
        </tr>
      </thead>
      <tbody>
        ${t}
      </tbody>
    </table>
  `;
}
function Fv() {
  const i = document.getElementById("customCardCountPill"), e = document.getElementById("btnResetCustomCards"), t = U.customCards.length;
  i && (i.textContent = P("stats.customCardPill", { count: t })), e && e.classList.toggle("hidden", t === 0);
}
function Ep() {
  const i = document.getElementById("savedCardsList"), e = document.getElementById("btnClearSaved");
  if (!i) return;
  const n = sB().filter((r) => U.savedIds.has(r.id));
  if (e && e.classList.toggle("hidden", n.length === 0), n.length === 0) {
    i.innerHTML = `
      <div class="empty-feed-placeholder">
        <div class="empty-feed-title">${P("saved.emptyTitle")}</div>
        <p class="empty-feed-desc">${P("saved.emptyDesc")}</p>
      </div>
    `;
    return;
  }
  i.innerHTML = n.map(oB).join("");
}
function Mv() {
  const i = document.getElementById("savedCountBadge");
  if (!i) return;
  const e = U.savedIds.size;
  i.textContent = e > 99 ? "99+" : e, i.classList.toggle("hidden", e === 0);
}
let Ut = null;
function cB() {
  const i = document.getElementById("onboardingPresetRow");
  if (!i) return;
  const e = ["study", "tech", "culture", "hobby"];
  i.querySelectorAll(".preset-chip-btn").forEach((t) => {
    const n = Fs.find((s) => s.id === t.dataset.presetId), r = n && e.every((s) => U.weights[s] === n.weights[s]);
    t.classList.toggle("active", !!r);
  });
}
function sf(i, e) {
  const t = ["study", "tech", "culture", "hobby"], n = { ...U.weights };
  Ut && (cancelAnimationFrame(Ut), Ut = null);
  const r = document.getElementById("onboardingPresetRow");
  if (r && r.querySelectorAll(".preset-chip-btn").forEach((p) => {
    p.classList.toggle("active", p.dataset.presetId === e);
  }), t.every((p) => Math.round(n[p]) === i[p])) return;
  const o = 440, c = performance.now(), l = (p) => 1 - Math.pow(1 - p, 3), u = document.getElementById("onboardingStackedBar"), h = document.getElementById("onboardingLegendRow"), d = document.getElementById("onboardingSlidersList");
  function m(p) {
    const w = p - c, S = Math.min(1, w / o), N = l(S);
    t.forEach((G) => {
      const Z = n[G], ae = i[G];
      U.weights[G] = Math.round(Z + (ae - Z) * N);
    }), S >= 1 && t.forEach((G) => {
      U.weights[G] = i[G];
    });
    const F = ft();
    u && t.forEach((G) => {
      const Z = u.querySelector(`.gauge-segment[data-cat="${G}"]`);
      if (Z) {
        const ae = F.totalWeight === 0 ? 0 : F.categories[G].exactPct;
        Z.style.width = `${ae}%`;
      }
    }), h && t.forEach((G) => {
      const Z = h.querySelector(`.gauge-legend-pill[data-cat="${G}"]`), ae = Z == null ? void 0 : Z.querySelector(".legend-pct-text");
      ae && (ae.textContent = `${F.categories[G].displayPct}%`);
    }), d && t.forEach((G) => {
      const Z = d.querySelector(`[data-channel="${G}"]`);
      if (!Z) return;
      const ae = Z.querySelector(".onboarding-range-input"), Be = Z.querySelector(".channel-status-pill"), fe = Me[G], I = U.weights[G], E = F.categories[G];
      ae && (ae.value = I, ae.style.background = `linear-gradient(to right, ${fe.color} ${I}%, var(--bg-subtle) ${I}%)`), Be && (Be.innerHTML = I === 0 ? '<span class="is-zero">0%</span>' : `<span class="pct-num">${E.displayPct}</span><span class="pct-unit">%</span>`);
    }), S < 1 ? Ut = requestAnimationFrame(m) : (Ut = null, cB(), X("light"));
  }
  Ut = requestAnimationFrame(m);
}
function Vv(i = {}) {
  const e = document.getElementById("onboardingOverlay");
  if (!e || e.classList.contains("hidden")) return;
  const t = ft(), n = document.getElementById("onboardingPresetRow");
  document.getElementById("onboardingStackedBar"), document.getElementById("onboardingLegendRow");
  const r = document.getElementById("onboardingSlidersList"), s = ["study", "tech", "culture", "hobby"];
  n && (!n.querySelector(".preset-chip-btn") || i.forceRebuild ? n.innerHTML = Fs.slice(0, 3).map((o) => `
          <button
            type="button"
            class="preset-chip-btn ${s.every((l) => U.weights[l] === o.weights[l]) ? "active" : ""}"
            data-preset-id="${o.id}"
          >
            ${o.name}
          </button>
        `).join("") : cB()), pp(t), r && (!r.querySelector(".onboarding-channel-card") || i.forceRebuild ? r.innerHTML = s.map((o) => {
    const c = Me[o], l = U.weights[o], u = t.categories[o];
    return `
          <div class="onboarding-channel-card" data-channel="${o}">
            <div class="channel-top-line" style="margin-bottom:6px;">
              <div class="channel-title-group">
                <span class="channel-color-bar" style="background-color: ${c.color}"></span>
                <span class="channel-name" style="font-size:0.86rem; font-weight:700;">${c.name}</span>
              </div>
              <span class="channel-status-pill" style="color: ${c.color}">
                ${l === 0 ? '<span class="is-zero">0%</span>' : `<span class="pct-num">${u.displayPct}</span><span class="pct-unit">%</span>`}
              </span>
            </div>

            <div class="slider-wrap">
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value="${l}"
                class="channel-range-input onboarding-range-input"
                data-cat="${o}"
                style="--thumb-color: ${c.color}; background: linear-gradient(to right, ${c.color} ${l}%, var(--bg-subtle) ${l}%);"
                aria-label="${c.name} ${P("onboarding.gaugeTitle")}"
              />
            </div>
          </div>
        `;
  }).join("") : s.forEach((o) => {
    const c = r.querySelector(`[data-channel="${o}"]`);
    if (!c) return;
    const l = c.querySelector(".onboarding-range-input"), u = c.querySelector(".channel-status-pill"), h = Me[o], d = U.weights[o], m = t.categories[o];
    l && (l.value = d, l.style.background = `linear-gradient(to right, ${h.color} ${d}%, var(--bg-subtle) ${d}%)`), u && (u.innerHTML = d === 0 ? '<span class="is-zero">0%</span>' : `<span class="pct-num">${m.displayPct}</span><span class="pct-unit">%</span>`);
  }));
}
let Da = null;
function Gl(i = {}) {
  const e = document.getElementById("authOverlay");
  e && (Da = i.onDismiss || null, bp(), e.classList.remove("hidden"), document.body.style.overflow = "hidden", X("light"));
}
function wp() {
  const i = document.getElementById("authOverlay");
  i && i.classList.add("hidden"), document.body.style.overflow = "";
}
function aa(i = true) {
  if (wp(), i && (sessionStorage.setItem("mamgorithm_auth_dismissed", "true"), X("light")), typeof Da == "function") {
    const e = Da;
    Da = null, e();
  }
}
function bp() {
  const i = document.getElementById("authLoggedOutView"), e = document.getElementById("authLoggedInView"), t = document.getElementById("authUserPhoto"), n = document.getElementById("authUserName"), r = document.getElementById("authUserEmail");
  Et && !Et.isAnonymous ? (i && i.classList.add("hidden"), e && e.classList.remove("hidden"), t && (t.src = Et.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"), n && (n.textContent = Et.displayName || P("auth.account")), r && (r.textContent = Et.email || "")) : (i && i.classList.remove("hidden"), e && e.classList.add("hidden"));
}
function Dp(i) {
  const e = document.getElementById("btnHeaderAuth"), t = document.getElementById("headerAuthAvatar"), n = document.getElementById("headerAuthLabel"), r = i && !i.isAnonymous;
  if (e) {
    if (e.classList.toggle("logged-in", r), r) {
      if (t) if (i.photoURL) t.innerHTML = `<img src="${i.photoURL}" alt="${i.displayName || "User"}" class="auth-avatar-img" />`;
      else {
        const s = (i.displayName || i.email || "U").charAt(0).toUpperCase();
        t.innerHTML = `<span style="font-weight:700; font-size:11px;">${s}</span>`;
      }
      if (n) {
        const s = i.displayName ? i.displayName.split(" ")[0] : P("auth.account");
        n.textContent = s;
      }
    } else t && (t.innerHTML = `
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      `), n && (n.textContent = P("auth.signIn"));
    Gv(i);
  }
}
function Gv(i) {
  const e = document.getElementById("authStatsCard"), t = document.getElementById("authStatsTitle"), n = document.getElementById("authStatsDesc"), r = document.getElementById("btnAuthStatsAction"), s = document.getElementById("authStatsIconWrap");
  if (!e) return;
  const o = i && !i.isAnonymous;
  e.classList.toggle("connected", o), o ? (s && (s.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      `), t && (t.textContent = i.displayName || i.email), n && (n.textContent = `${i.email} · ${P("auth.syncActive")}`), r && (r.textContent = P("auth.account"), r.classList.add("secondary"))) : (s && (s.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      `), t && (t.textContent = P("auth.statsBannerTitle")), n && (n.textContent = P("auth.statsBannerDesc")), r && (r.textContent = P("auth.btnSyncLogin"), r.classList.remove("secondary")));
}
function Hl() {
  const i = document.getElementById("onboardingOverlay");
  i && (i.classList.remove("hidden"), document.body.style.overflow = "hidden", Vv({ forceRebuild: true }));
}
function Hv() {
  Ut && (cancelAnimationFrame(Ut), Ut = null);
  const i = document.getElementById("onboardingOverlay");
  i && i.classList.add("hidden"), document.body.style.overflow = "";
  try {
    localStorage.setItem(mt.ONBOARDED, "true");
  } catch {
  }
  an(), tt(), X("success"), xe(P("toast.onboardingFeedReady")), localStorage.getItem(mt.COACHMARK_SEEN) || setTimeout(() => lB(), 500);
}
function hr(i) {
  vs(), U.currentTab = i, X("light"), document.querySelectorAll(".tab-view").forEach((e) => {
    e.classList.toggle("active", e.id === i);
  }), document.querySelectorAll(".tab-btn").forEach((e) => {
    e.classList.toggle("active", e.dataset.tab === i);
  }), window.scrollTo({ top: 0, behavior: "smooth" }), i === "viewSaved" && Ep();
}
let ca = null, Ti = null, la = null;
function Uv() {
  var r, s, o, c, l, u, h, d, m, p, w, S, N, F, G, Z, ae, Be, fe, I, E, D, A, T, k, b, ot, tn, Ao, So, pi, Ci, Ro, jr, Jr, zr, yi, er, tr, nr, ir, Kr, ko;
  (r = document.getElementById("btnLanguageToggle")) == null || r.addEventListener("click", () => {
    nC(), X("light"), hf(), tt(), Yn && of(Yn), xe(P("toast.langSwitched")), Jt.syncToFirestore(), window.dispatchEvent(new Event("mamgorithm:language"));
  }), (s = document.getElementById("btnHeaderAuth")) == null || s.addEventListener("click", () => {
    Gl();
  }), (o = document.getElementById("btnAuthSkip")) == null || o.addEventListener("click", () => {
    aa(true);
  }), (c = document.getElementById("btnGuestContinue")) == null || c.addEventListener("click", () => {
    aa(true);
  }), (l = document.getElementById("authBackdrop")) == null || l.addEventListener("click", () => {
    aa(true);
  }), (u = document.getElementById("btnGoogleLogin")) == null || u.addEventListener("click", async () => {
    const $ = document.getElementById("btnGoogleLogin");
    if ($) try {
      X("medium"), $.style.opacity = "0.6", $.style.pointerEvents = "none";
      const ce = await Ev();
      ce && (X("success"), xe(P("auth.loginSuccess", { name: ce.displayName || ce.email })), aa(false), Jt.syncToFirestore());
    } catch (error) {
      X("error"), mergeAuthError(error);
    } finally {
      $.style.opacity = "1", $.style.pointerEvents = "auto";
    }
  }), (h = document.getElementById("btnAuthLogout")) == null || h.addEventListener("click", async () => {
    try {
      X("light"), await wv(), xe(P("auth.logoutSuccess")), wp(), Jt.syncToFirestore();
    } catch ($) {
      console.error($);
    }
  }), (d = document.getElementById("btnAuthStatsAction")) == null || d.addEventListener("click", () => {
    Gl();
  }), bv(($) => { mergeHandleAuth($); }), document.querySelectorAll(".tab-btn").forEach(($) => {
    $.addEventListener("click", () => {
      hr($.dataset.tab);
    });
  }), (m = document.getElementById("brandHome")) == null || m.addEventListener("click", () => {
    hr("viewFeed");
  }), (p = document.getElementById("btnQuickTune")) == null || p.addEventListener("click", () => {
    oa();
  }), (w = document.getElementById("dockPeekBar")) == null || w.addEventListener("click", () => {
    oa();
  }), (S = document.getElementById("btnCollapseDock")) == null || S.addEventListener("click", vs), (N = document.getElementById("dockBackdrop")) == null || N.addEventListener("click", vs), (F = document.getElementById("btnApplyDockMixer")) == null || F.addEventListener("click", () => {
    if (ft().totalWeight === 0) {
      X("light"), xe(P("dock.allZeroAlert"));
      return;
    }
    vs(), hr("viewFeed"), X("success"), xe(P("toast.recipeApplied"));
  }), (G = document.getElementById("btnResetMixerInDock")) == null || G.addEventListener("click", () => {
    sl({ title: P("confirm.resetTitle"), message: P("confirm.resetDesc"), confirmText: P("confirm.resetConfirm"), cancelText: P("confirm.cancel"), isDanger: false, onConfirm: () => {
      U.weights = { study: 50, tech: 50, culture: 50, hobby: 50 }, an(), tt(), X("delete"), xe(P("toast.balancedReset"));
    } });
  }), (Z = document.getElementById("btnShareRecipeInDock")) == null || Z.addEventListener("click", tf), (ae = document.getElementById("btnShareRecipeInStats")) == null || ae.addEventListener("click", tf);
  const i = document.getElementById("dockSlidersList");
  i && (i.addEventListener("input", ($) => {
    const ce = $.target.closest(".dock-range-input");
    if (!ce) return;
    const Ce = ce.dataset.cat, _e = parseInt(ce.value, 10);
    if (Ce && !Number.isNaN(_e)) {
      U.weights[Ce] = Math.max(0, Math.min(100, _e)), X("light");
      const Mt = Me[Ce];
      ce.style.background = `linear-gradient(to right, ${Mt.color} ${_e}%, var(--bg-subtle) ${_e}%)`, ca && cancelAnimationFrame(ca), ca = requestAnimationFrame(() => {
        const Bt = ft();
        aB(Bt), Cp(Bt), rf(i, Bt), mp(), ca = null;
      }), Ti && clearTimeout(Ti), Ti = setTimeout(() => {
        an();
        const Bt = ft();
        ec(Bt), Vl(Bt), Ti = null;
      }, 55);
    }
  }), i.addEventListener("change", () => {
    Ti && (clearTimeout(Ti), Ti = null), an();
    const $ = ft();
    ec($), Vl($);
  }), i.addEventListener("click", ($) => {
    const ce = $.target.closest(".tick-label");
    if (!ce) return;
    const Ce = ce.dataset.cat, _e = parseInt(ce.dataset.val, 10);
    Ce && !Number.isNaN(_e) && (U.weights[Ce] = Math.max(0, Math.min(100, _e)), X("light"), an(), tt());
  }));
  const e = document.getElementById("onboardingSlidersList");
  e && (e.addEventListener("input", ($) => {
    const ce = $.target.closest(".onboarding-range-input");
    if (!ce) return;
    Ut && (cancelAnimationFrame(Ut), Ut = null);
    const Ce = ce.dataset.cat, _e = parseInt(ce.value, 10);
    if (Ce && !Number.isNaN(_e)) {
      U.weights[Ce] = Math.max(0, Math.min(100, _e)), X("light");
      const Mt = Me[Ce];
      ce.style.background = `linear-gradient(to right, ${Mt.color} ${_e}%, var(--bg-subtle) ${_e}%)`, la && cancelAnimationFrame(la), la = requestAnimationFrame(() => {
        const Bt = ft();
        pp(Bt), rf(e, Bt), cB(), la = null;
      });
    }
  }), e.addEventListener("click", ($) => {
    const ce = $.target.closest(".tick-label");
    if (!ce) return;
    const Ce = ce.dataset.cat, _e = parseInt(ce.dataset.val, 10);
    if (Ce && !Number.isNaN(_e)) {
      X("light");
      const Mt = { ...U.weights, [Ce]: Math.max(0, Math.min(100, _e)) };
      sf(Mt);
    }
  })), (Be = document.getElementById("onboardingPresetRow")) == null || Be.addEventListener("click", ($) => {
    const ce = $.target.closest(".preset-chip-btn");
    if (!ce) return;
    const Ce = Fs.find((_e) => _e.id === ce.dataset.presetId);
    Ce && (X("medium"), sf(Ce.weights, Ce.id));
  }), (fe = document.getElementById("btnOnboardingStart")) == null || fe.addEventListener("click", Hv), (I = document.getElementById("btnReplayIntroLight")) == null || I.addEventListener("click", () => {
    X("medium"), typeof window.playIntroWithTheme == "function" && window.playIntroWithTheme("light");
  }), (E = document.getElementById("btnReplayIntroDark")) == null || E.addEventListener("click", () => {
    X("medium"), typeof window.playIntroWithTheme == "function" && window.playIntroWithTheme("dark");
  }), (D = document.getElementById("btnReopenOnboarding")) == null || D.addEventListener("click", () => {
    X("medium"), hr("viewFeed"), window.scrollTo({ top: 0, behavior: "auto" }), setTimeout(() => {
      Hl();
    }, 120);
  }), (A = document.getElementById("presetContainer")) == null || A.addEventListener("click", ($) => {
    const ce = $.target.closest(".preset-chip-btn");
    if (!ce) return;
    const Ce = Fs.find((_e) => _e.id === ce.dataset.presetId);
    Ce && (U.weights = { ...Ce.weights }, an(), tt({ withSkeleton: true, delay: 240 }), X("medium"), xe(P("toast.presetApplied", { preset: Ce.name })));
  }), document.querySelectorAll(".type-pill").forEach(($) => {
    $.addEventListener("click", () => {
      if ($.classList.contains("active")) return;
      document.querySelectorAll(".type-pill").forEach((Ce) => Ce.classList.remove("active")), $.classList.add("active"), U.contentType = $.dataset.type, X("light");
      const ce = ft();
      Ml(ce, 120);
    });
  }), (T = document.getElementById("btnShuffle")) == null || T.addEventListener("click", () => {
    const $ = document.getElementById("btnShuffle");
    $ && $.classList.add("spinning"), U.shuffleSeed += 1, X("medium");
    const ce = ft();
    Ml(ce, 140, () => {
      $ && $.classList.remove("spinning"), xe(P("toast.shuffled"));
    });
  });
  const t = ($) => {
    const ce = $.target.closest(".card-bookmark-btn");
    if (ce) {
      $.stopPropagation();
      const _e = ce.dataset.bookmarkId;
      U.savedIds.has(_e) ? (U.savedIds.delete(_e), qn(), tt(), X("delete"), Ia(P("toast.removed"), P("toast.undo"), () => {
        U.savedIds.add(_e), qn(), tt(), X("success"), xe(P("toast.restored"));
      }, 4500)) : (U.savedIds.add(_e), qn(), tt(), X("success"), xe(P("toast.saved")));
      return;
    }
    const Ce = $.target.closest(".content-feed-card");
    if (Ce) {
      const _e = Ce.dataset.type, Mt = Ce.dataset.id, Vt = sB().find((Je) => Je.id === Mt), rr = !!Ce.closest("#savedCardsList");
      Vt && Jt.trackCardClick(Vt, rr), _e === "video" && Vt ? (X("medium"), jv(Vt)) : _e === "article" && Vt ? (X("medium"), of(Vt)) : Ce.dataset.url && (X("light"), window.open(Ce.dataset.url, "_blank", "noopener,noreferrer"));
    }
  };
  (k = document.getElementById("feedCardsList")) == null || k.addEventListener("click", t), (b = document.getElementById("savedCardsList")) == null || b.addEventListener("click", t), (ot = document.getElementById("btnVideoSheetClose")) == null || ot.addEventListener("click", () => {
    X("light"), ys();
  }), (tn = document.getElementById("sheetDragHandle")) == null || tn.addEventListener("click", () => {
    X("light"), ys();
  }), (Ao = document.getElementById("videoSheetBackdrop")) == null || Ao.addEventListener("click", ($) => {
    $.target.id === "videoSheetBackdrop" && (X("light"), ys());
  }), (So = document.getElementById("btnSheetTune")) == null || So.addEventListener("click", () => {
    ys(), oa();
  }), (pi = document.getElementById("btnArticleSheetClose")) == null || pi.addEventListener("click", () => {
    X("light"), dr();
  }), (Ci = document.getElementById("articleDragHandle")) == null || Ci.addEventListener("click", () => {
    X("light"), dr();
  }), (Ro = document.getElementById("btnArticleBackToFeed")) == null || Ro.addEventListener("click", () => {
    X("light"), dr();
  }), (jr = document.getElementById("articleSheetBackdrop")) == null || jr.addEventListener("click", ($) => {
    $.target.id === "articleSheetBackdrop" && (X("light"), dr());
  }), (Jr = document.getElementById("btnArticleSheetTune")) == null || Jr.addEventListener("click", () => {
    dr(), oa();
  }), (zr = document.getElementById("btnArticleBookmark")) == null || zr.addEventListener("click", () => {
    if (!Yn) return;
    const $ = Yn.id;
    U.savedIds.has($) ? (U.savedIds.delete($), _a(), qn(), tt(), X("delete"), Ia(P("toast.removed"), P("toast.undo"), () => {
      U.savedIds.add($), _a(), qn(), tt(), X("success"), xe(P("toast.restored"));
    }, 4500)) : (U.savedIds.add($), _a(), qn(), tt(), X("success"), xe(P("toast.saved")));
  }), (yi = document.getElementById("btnClearSaved")) == null || yi.addEventListener("click", () => {
    if (U.savedIds.size === 0) return;
    const $ = U.savedIds.size;
    sl({ title: P("confirm.clearSavedTitle"), message: P("confirm.clearSavedDesc", { count: $ }), confirmText: P("confirm.clearSavedConfirm"), cancelText: P("confirm.cancel"), isDanger: true, onConfirm: () => {
      const ce = new Set(U.savedIds);
      U.savedIds.clear(), qn(), tt(), X("delete"), Ia(P("toast.allClearedCount", { count: $ }), P("toast.undo"), () => {
        U.savedIds = new Set(ce), qn(), tt(), X("success"), xe(P("toast.allRestored"));
      }, 5e3);
    } });
  }), (er = document.getElementById("btnStatsTooltip")) == null || er.addEventListener("click", ($) => {
    $.stopPropagation(), X("light"), af($.currentTarget, P("tooltip.stats"));
  }), (tr = document.getElementById("btnMixerTooltip")) == null || tr.addEventListener("click", ($) => {
    $.stopPropagation(), X("light"), af($.currentTarget, P("tooltip.mixer"));
  }), document.addEventListener("click", ($) => {
    !$.target.closest(".tooltip-popover") && !$.target.closest(".btn-tooltip-trigger") && va();
  }), window.addEventListener("scroll", () => {
    va();
  }, { passive: true }), (nr = document.getElementById("btnCoachmarkSkip")) == null || nr.addEventListener("click", () => {
    X("light"), xs();
  }), (ir = document.getElementById("btnCoachmarkNext")) == null || ir.addEventListener("click", () => {
    const $ = _p();
    Ta < $.length - 1 ? (Ta += 1, X("light"), Ip(Ta)) : (X("success"), xs());
  }), (Kr = document.getElementById("btnReplayCoachmark")) == null || Kr.addEventListener("click", () => {
    X("medium"), hr("viewFeed"), window.scrollTo({ top: 0, behavior: "auto" }), setTimeout(() => {
      lB();
    }, 160);
  });
  const n = document.getElementById("addCardForm");
  n && n.addEventListener("submit", ($) => {
    var Ei, Po, Wr, Oo, Ln, $r, Qr, sr, Lo, No, Yr, Xr, Nn, or;
    $.preventDefault();
    const ce = ((Ei = document.getElementById("newCardCategory")) == null ? void 0 : Ei.value) || "study", Ce = ((Po = document.getElementById("newCardType")) == null ? void 0 : Po.value) || "video", _e = (Oo = (Wr = document.getElementById("newCardTitle")) == null ? void 0 : Wr.value) == null ? void 0 : Oo.trim(), Mt = ($r = (Ln = document.getElementById("newCardSummary")) == null ? void 0 : Ln.value) == null ? void 0 : $r.trim(), Bt = ((sr = (Qr = document.getElementById("newCardSource")) == null ? void 0 : Qr.value) == null ? void 0 : sr.trim()) || (Zn() === "en" ? "My-gorithm Curation" : "맘고리즘 큐레이션"), Vt = ((No = (Lo = document.getElementById("newCardDuration")) == null ? void 0 : Lo.value) == null ? void 0 : No.trim()) || (Ce === "video" ? "10:00" : Zn() === "en" ? "4 min read" : "4분 읽기"), rr = ((Xr = (Yr = document.getElementById("newCardUrl")) == null ? void 0 : Yr.value) == null ? void 0 : Xr.trim()) || "", Je = ((or = (Nn = document.getElementById("newCardImage")) == null ? void 0 : Nn.value) == null ? void 0 : or.trim()) || "";
    if (!_e || !Mt) {
      X("light"), xe(P("toast.titleRequired"));
      return;
    }
    const at = df({ category: ce, type: Ce, title: _e, summary: Mt, source: Bt, duration: Vt, url: rr, imageUrl: Je, date: Zn() === "en" ? "Just added" : "방금 추가됨", isNew: true });
    U.customCards.unshift(at), ef(), U.weights[ce] === 0 && (U.weights[ce] = 35, an()), U.contentType !== "all" && U.contentType !== Ce && (U.contentType = "all", document.querySelectorAll(".type-pill").forEach((ar) => {
      ar.classList.toggle("active", ar.dataset.type === "all");
    })), U.shuffleSeed = 0, n.reset(), tt(), hr("viewFeed"), X("success"), xe(P("toast.cardAdded", { category: Me[ce].name }));
  }), (ko = document.getElementById("btnResetCustomCards")) == null || ko.addEventListener("click", () => {
    if (U.customCards.length === 0) return;
    const $ = U.customCards.length;
    sl({ title: P("confirm.resetCardsTitle"), message: P("confirm.resetCardsDesc", { count: $ }), confirmText: P("confirm.resetCardsConfirm"), cancelText: P("confirm.cancel"), isDanger: true, onConfirm: () => {
      U.customCards = [], ef(), tt(), X("delete"), xe(P("toast.cardsReset"));
    } });
  }), window.addEventListener("keydown", ($) => {
    var ce;
    $.key === "Escape" && (ys(), dr(), vs(), va(), (ce = document.getElementById("confirmModalBackdrop")) == null || ce.classList.add("hidden"), xs());
  });
}
function qv(i) {
  if (!i) return "6uc4QM79mZ8";
  const e = i.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return e ? e[1] : "6uc4QM79mZ8";
}
function jv(i) {
  const e = document.getElementById("videoSheetBackdrop"), t = document.getElementById("youtubeIframe"), n = document.getElementById("sheetCategoryName"), r = document.getElementById("sheetIndicator"), s = document.getElementById("sheetExternalLink"), o = document.getElementById("sheetVideoTitle"), c = document.getElementById("sheetChannelName"), l = document.getElementById("sheetDuration"), u = document.getElementById("sheetSummary");
  if (!e || !t || !i) return;
  const h = ql(i, Zn()), d = Me[h.category] || Me.study, m = h.youtubeId || qv(h.url);
  t.src = `https://www.youtube.com/embed/${m}?autoplay=1&playsinline=1&rel=0`, n && (n.textContent = `${d.name} · ${P("cards.video")}`), r && (r.style.backgroundColor = d.color), s && (s.href = h.url), o && (o.textContent = h.title), c && (c.textContent = h.source), l && (l.textContent = h.duration), u && (u.textContent = h.summary), e.classList.remove("hidden"), document.body.style.overflow = "hidden";
}
function ys() {
  const i = document.getElementById("videoSheetBackdrop"), e = document.getElementById("youtubeIframe");
  i && i.classList.add("hidden"), e && (e.src = ""), document.body.style.overflow = "";
}
let Yn = null;
function of(i) {
  const e = document.getElementById("articleSheetBackdrop");
  if (!e || !i) return;
  const t = ql(i, Zn());
  Yn = t, Jt.trackReaderOpen(i);
  const n = Me[t.category] || Me.study, r = document.getElementById("articleCategoryName"), s = document.getElementById("articleIndicator"), o = document.getElementById("articleReadTime"), c = Zn();
  r && (r.textContent = `${n.name} · ${P("cards.article")}`), s && (s.style.backgroundColor = n.color);
  let l = t.duration || (c === "en" ? "5 min read" : "5분 읽기");
  c === "en" && typeof l == "string" && (l = l.replace("분 읽기", " min read").replace("분 분량", " min")), o && (o.textContent = l), _a();
  const u = document.getElementById("articleExternalLink"), h = document.getElementById("btnArticleFooterOriginal");
  u && (u.href = t.url), h && (h.href = t.url);
  const d = document.getElementById("articleHeroImg");
  d && (d.src = t.imageUrl, d.alt = t.title);
  const m = document.getElementById("articleSource"), p = document.getElementById("articleDate");
  m && (m.textContent = t.source), p && (p.textContent = t.date);
  const w = document.getElementById("articleTitle");
  w && (w.textContent = t.title);
  const S = document.getElementById("articleKeyPoints");
  if (S) {
    let Be = "";
    t.recommendationReason && (Be += `
        <li class="article-recom-box">
          <div class="article-recom-badge">${P("reader.recomReason")}</div>
          <div class="article-recom-text">${t.recommendationReason}</div>
        </li>
      `);
    const fe = t.keyPoints && t.keyPoints.length > 0 ? t.keyPoints : [t.summary];
    Be += fe.map((I) => `<li>${I}</li>`).join(""), S.innerHTML = Be;
  }
  const N = document.getElementById("articleFullContent");
  N && (t.sections && t.sections.length > 0 ? N.innerHTML = t.sections.map((Be) => `
        <div class="article-section-block">
          <h3 class="article-section-heading">${Be.heading}</h3>
          <p class="article-section-body">${Be.body}</p>
        </div>
      `).join("") : N.innerHTML = `
        <div class="article-section-block">
          <p class="article-section-body">${t.summary}</p>
        </div>
      `);
  window.renderEditorialDetails?.(t);
  const F = document.querySelector(".article-summary-card");
  F && (F.style.borderLeftColor = n.color);
  const G = document.getElementById("articleAlgoTitle"), Z = document.getElementById("articleAlgoDesc");
  G && (G.textContent = P("reader.feedbackTitle", { category: n.name })), Z && (Z.textContent = P("reader.feedbackDesc", { category: n.name }));
  const ae = document.getElementById("articleReaderBody");
  ae && (ae.scrollTop = 0), e.classList.remove("hidden"), document.body.style.overflow = "hidden";
}
function dr() {
  const i = document.getElementById("articleSheetBackdrop");
  i && i.classList.add("hidden"), Jt.trackReaderClose(), Yn = null, document.body.style.overflow = "";
}
function _a() {
  const i = document.getElementById("btnArticleBookmark");
  if (!i || !Yn) return;
  const e = U.savedIds.has(Yn.id);
  i.classList.toggle("saved", e), i.title = P(e ? "cards.bookmarkRemove" : "cards.bookmarkSave"), i.setAttribute("aria-label", P(e ? "cards.bookmarkRemove" : "cards.bookmarkSave"));
}
let rl = null;
function xe(i) {
  const e = document.getElementById("toastPopup");
  e && (e.textContent = i, e.classList.remove("hidden"), rl && clearTimeout(rl), rl = setTimeout(() => {
    e.classList.add("hidden");
  }, 2200));
}
let Es = null;
function Ia(i, e, t, n = 4e3) {
  const r = document.getElementById("snackbarContainer"), s = document.getElementById("snackbarMessage"), o = document.getElementById("snackbarActionBtn"), c = document.getElementById("snackbarProgress");
  !r || !s || !o || !c || (Es && clearTimeout(Es), s.textContent = i, o.textContent = e || P("toast.undo"), c.classList.remove("animate"), c.style.animationDuration = `${n}ms`, c.offsetWidth, c.classList.add("animate"), o.onclick = () => {
    r.classList.add("hidden"), Es && clearTimeout(Es), typeof t == "function" && t(), o.onclick = null;
  }, r.classList.remove("hidden"), Es = setTimeout(() => {
    r.classList.add("hidden"), o.onclick = null;
  }, n));
}
function sl({ title: i, message: e, confirmText: t = P("confirm.ok"), cancelText: n = P("confirm.cancel"), isDanger: r = true, onConfirm: s, onCancel: o }) {
  const c = document.getElementById("confirmModalBackdrop"), l = document.getElementById("confirmModalTitle"), u = document.getElementById("confirmModalDesc"), h = document.getElementById("btnModalConfirm"), d = document.getElementById("btnModalCancel"), m = document.getElementById("confirmModalIcon");
  if (!c || !l || !u || !h || !d) return;
  l.textContent = i, u.textContent = e, h.textContent = t, d.textContent = n, r ? (h.classList.remove("primary-mode"), m == null || m.classList.remove("info-mode")) : (h.classList.add("primary-mode"), m == null || m.classList.add("info-mode"));
  const p = () => {
    c.classList.add("hidden"), h.onclick = null, d.onclick = null, c.onclick = null;
  };
  h.onclick = () => {
    X("medium"), p(), typeof s == "function" && s();
  }, d.onclick = () => {
    X("light"), p(), typeof o == "function" && o();
  }, c.onclick = (w) => {
    w.target === c && (p(), typeof o == "function" && o());
  }, c.classList.remove("hidden");
}
let Ul = null;
function af(i, e) {
  const t = document.getElementById("tooltipPopover"), n = document.getElementById("tooltipBody"), r = document.getElementById("tooltipArrow");
  if (!t || !n || !r || !i) return;
  if (Ul === i && !t.classList.contains("hidden")) {
    va();
    return;
  }
  n.textContent = e, t.classList.remove("hidden"), Ul = i;
  const s = i.getBoundingClientRect(), o = t.getBoundingClientRect();
  let c = s.top - o.height - 8, l = true;
  c < 12 && (c = s.bottom + 8, l = false);
  let u = s.left + s.width / 2 - o.width / 2;
  u = Math.max(12, Math.min(window.innerWidth - o.width - 12, u)), t.style.top = `${c}px`, t.style.left = `${u}px`;
  const h = s.left + s.width / 2 - u - 4;
  r.style.left = `${Math.max(10, Math.min(o.width - 18, h))}px`, l ? (r.style.bottom = "-4px", r.style.top = "auto") : (r.style.top = "-4px", r.style.bottom = "auto");
}
function va() {
  const i = document.getElementById("tooltipPopover");
  i && i.classList.add("hidden"), Ul = null;
}
function _p() {
  return [{ targetId: "dockPeekBar", badge: P("coachmark.badge1"), title: P("coachmark.title1"), desc: P("coachmark.desc1"), nextText: P("coachmark.next") }, { targetId: "presetContainer", badge: P("coachmark.badge2"), title: P("coachmark.title2"), desc: P("coachmark.desc2"), nextText: P("coachmark.start") }];
}
let Ta = 0;
function lB() {
  Ta = 0, Ip(0);
}
function Ip(i) {
  const e = document.getElementById("coachmarkOverlay"), t = document.getElementById("coachmarkSpotlight"), n = document.getElementById("coachmarkCard"), r = document.getElementById("coachmarkBadge"), s = document.getElementById("coachmarkTitle"), o = document.getElementById("coachmarkDesc"), c = document.getElementById("btnCoachmarkNext"), l = document.getElementById("btnCoachmarkSkip");
  if (!e || !t || !n || !r || !s || !o || !c) return;
  const h = _p()[i];
  if (!h) {
    xs();
    return;
  }
  const d = document.getElementById(h.targetId);
  if (!d) {
    xs();
    return;
  }
  r.textContent = h.badge, s.textContent = h.title, o.textContent = h.desc, c.textContent = h.nextText, l && (l.textContent = P("coachmark.skip")), e.classList.remove("hidden");
  const m = d.getBoundingClientRect(), p = 6, w = Math.max(0, m.top - p), S = Math.max(0, m.left - p), N = m.width + p * 2, F = m.height + p * 2;
  t.style.top = `${w}px`, t.style.left = `${S}px`, t.style.width = `${N}px`, t.style.height = `${F}px`;
  let Z = w - 150 - 14;
  (Z < 20 || w < window.innerHeight / 2) && (Z = w + F + 14);
  let ae = S + N / 2 - 160;
  ae = Math.max(16, Math.min(window.innerWidth - 336, ae)), n.style.top = `${Z}px`, n.style.left = `${ae}px`;
}
function xs() {
  const i = document.getElementById("coachmarkOverlay");
  i && i.classList.add("hidden");
  try {
    localStorage.setItem(mt.COACHMARK_SEEN, "true");
  } catch {
  }
}
let wr = null;
const vp = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream, Tp = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
"serviceWorker" in navigator && window.addEventListener("load", () => {
  navigator.serviceWorker.register("/sw.js").then((i) => {
    i.addEventListener("updatefound", () => {
      const e = i.installing;
      e && e.addEventListener("statechange", () => {
        e.state === "installed" && navigator.serviceWorker.controller && Ia(P("toast.appUpdated"), P("toast.reload"), () => {
          window.location.reload();
        }, 7e3);
      });
    });
  }).catch((i) => {
    console.debug("ServiceWorker 등록 예외:", i);
  });
});
window.addEventListener("beforeinstallprompt", (i) => {
  i.preventDefault(), wr = i, Ap();
});
window.addEventListener("appinstalled", () => {
  wr = null, uB(), X("success"), xe(P("toast.appInstalled"));
});
function Ap() {
  if (Tp) return;
  const i = sessionStorage.getItem("mamgorithm_install_dismissed") === "true", e = document.getElementById("btnInstallApp");
  e && e.classList.remove("hidden");
  const t = document.getElementById("appInstallBanner");
  t && !i && t.classList.remove("hidden");
}
function uB() {
  const i = document.getElementById("btnInstallApp");
  i && i.classList.add("hidden");
  const e = document.getElementById("appInstallBanner");
  e && e.classList.add("hidden");
}
function cf() {
  X("medium"), wr ? (wr.prompt(), wr.userChoice.then((i) => {
    i.outcome === "accepted" && uB(), wr = null;
  })) : vp ? Jv() : xe(P("toast.iosGuide"));
}
function Jv() {
  const i = document.getElementById("iosInstallSheet");
  i && (i.classList.remove("hidden"), X("light"));
}
function lf() {
  const i = document.getElementById("iosInstallSheet");
  i && (i.classList.add("hidden"), X("light"));
}
function uf() {
  var i, e, t, n, r;
  Tp ? (document.body.classList.add("is-pwa-standalone"), uB()) : vp && Ap(), (i = document.getElementById("btnInstallApp")) == null || i.addEventListener("click", () => {
    cf();
  }), (e = document.getElementById("btnBannerInstall")) == null || e.addEventListener("click", () => {
    cf();
  }), (t = document.getElementById("btnBannerDismiss")) == null || t.addEventListener("click", () => {
    X("light");
    const s = document.getElementById("appInstallBanner");
    s && s.classList.add("hidden"), sessionStorage.setItem("mamgorithm_install_dismissed", "true");
  }), (n = document.getElementById("btnIosInstallDone")) == null || n.addEventListener("click", () => {
    lf();
  }), (r = document.getElementById("iosInstallBackdrop")) == null || r.addEventListener("click", () => {
    lf();
  }), window.addEventListener("online", () => {
    xe(P("toast.online"));
  }), window.addEventListener("offline", () => {
    xe(P("toast.offline"));
  });
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", uf) : uf();

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
