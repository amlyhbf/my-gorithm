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
const rC = [{ id: "tech-58434", category: "tech", type: "article", title: "2026 온디바이스 AI 혁명: 스마트폰 안으로 들어온 로컬 소형 언어 모델(SLM)", summary: "2026 온디바이스 AI 혁명: 스마트폰 안으로 들어온 로컬 소형 언어 모델(SLM)에 대한 심층 분석을 통해 단순 정보 습득을 넘어 삶과 업무에 적용 가능한 맘고리즘의 독자적 인사이트를 전달합니다.", source: "토스 테크 · Toss Tech", duration: "5분 읽기", date: "최신 칼럼", imageUrl: "https://images.pexels.com/photos/1542252/pexels-photo-1542252.jpeg?h=1000&w=1500&fit=crop&markalign=center%2Cmiddle&txt=pexels.com&txtalign=center&txtsize=60&txtclr=eeffffff&txtfont=Avenir-Heavy&txtshad=10&mark=https:%2F%2Fassets.imgix.net%2F~text%3Ftxtclr%3Dfff%26txtsize%3D120%26txtpad%3D20%26bg%3D80000000%26txtfont%3DAvenir-Heavy%26txtalign%3Dcenter%26w%3D1300%26txt%3D%25EB%25AC%25B4%25EB%25A3%258C%2520%25EC%258A%25A4%25ED%2586%25A1%2520%25EC%2582%25AC%25EC%25A7%2584", url: "https://toss.tech", recommendationReason: "현대 사회의 정보 과부하 속에서 2026 온디바이스 AI 혁명: 스마트폰 안으로 들어온 로컬 소형 언어 모델(SLM)이 갖는 본질적인 의미를 파악하고, 스스로 사고의 깊이를 넓힐 수 있는 필독 칼럼입니다.", keyPoints: ["2026 온디바이스 AI 혁명: 스마트폰 안으로 들어온 로컬 소형 언어 모델(SLM)의 기저에 흐르는 핵심 원리와 현대적 재해석.", "단편적 사실 나열을 탈피하여 구조적 맥락과 실용적 가치를 조명하는 통찰.", "개인의 지적 성장과 일상적인 의사결정에 즉시 활용할 수 있는 실천적 가이드."], sections: [{ heading: "1. 보이지 않는 구조: 왜 지금 이 주제에 주목해야 하는가", body: "2026 온디바이스 AI 혁명: 스마트폰 안으로 들어온 로컬 소형 언어 모델(SLM)은 단순한 일시적 유행이 아닙니다. 기술과 문화의 급격한 전환기에서 이 주제는 우리가 마주한 정보 처리 방식과 사고 구조에 중대한 질문을 던집니다. 과거의 방식으로는 해결할 수 없는 복잡한 문제들이 수면 위로 떠오를 때, 본질을 꿰뚫어 보는 시선이야말로 진정한 지적 경쟁력이 됩니다." }, { heading: "2. 심층 메커니즘: 복잡성을 관통하는 핵심 원리", body: "이 현상의 이면에는 치밀한 시스템과 인간 심리의 상호작용이 자리 잡고 있습니다. 다양한 데이터와 경험적 연구는 피상적인 접근이 아닌 근본적인 프레임워크의 필요성을 강력히 시사합니다. 이를 이해한다는 것은 단순히 지식을 쌓는 차원을 넘어, 복잡한 현실에서 올바른 우선순위를 판별하는 감각을 기르는 훈련과 같습니다." }, { heading: "3. 적용과 확장: 내 삶과 생각에 적용하는 실천적 통찰", body: "이론적 이해가 실질적인 변화로 이어지려면 일상의 루틴 속에 작고 명확한 규칙으로 자리 잡아야 합니다. 기술 영역에서 제시하는 이 접근법은 불필요한 노이즈를 걷어내고 가장 높은 레버리지를 가져다줄 핵심 행동에 집중할 수 있도록 돕습니다. 오늘부터 작은 실험을 시작해보는 것만으로도 장기적인 변화를 이끌어낼 수 있습니다." }] }, { id: "study-09417", category: "study", type: "article", title: "지식을 뇌에 각인하는 연금술: 시냅스 가소성과 인출 연습이 밝혀낸 초학습의 비밀", summary: "단순 반복 읽기가 왜 뇌를 배신하는지 규명하고, 신경 연결을 물리적으로 재설계하는 인출 연습(Retrieval Practice)의 뇌과학적 메커니즘을 심도 있게 탐구합니다.", source: "하버드 비즈니스 리뷰 · 뇌과학 아카이브", duration: "5분 읽기", date: "최신 칼럼", imageUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80", url: "https://hbr.org", recommendationReason: "노력에 비해 학습 성과가 지지부진하다고 느끼는 지식 노동자들에게 인지적 마찰을 진짜 지적 자산으로 전환하는 실증적 해법을 제시합니다.", keyPoints: ["반복해 읽는 행위는 뇌의 '유창성 착각'을 유발해 장기 기억 형성을 가로막는다.", "시냅스 가소성은 고통스러운 인출(Retrieval) 과정에서 화학적 신호를 구조적 신경망으로 고착화한다.", "백지 복습과 셀프 테스팅 같은 바람직한 어려움이 뇌의 지도를 영구적으로 재편하는 결정적 열쇠다."], sections: [{ heading: "1. 유창성의 함정: 왜 우리는 공부했다고 착각하는가", body: "많은 이들이 형광펜으로 밑줄을 긋고 책장을 넘기며 텍스트를 재독하는 데 수많은 시간을 쏟아붓습니다. 뇌는 이미 눈에 익은 문장을 마주할 때 인지적 편안함을 느끼며, 이 익숙함을 자신이 해당 개념을 완벽히 장악했다는 신호로 오해합니다. 인지심리학에서는 이를 '유창성의 착각(Illusion of Fluency)'이라 명명합니다. 단순히 외부 정보를 감각 기관을 통해 수동적으로 입력하는 과정은 작업 기억의 일시적 스크래치패드에만 머물 뿐, 해마와 대뇌피질 사이의 실질적인 신경 결합을 촉발하지 못합니다. 벼락치기로 암기한 지식이 시험장을 나서는 순간 신기루처럼 증발하는 현상은 바로 이 뇌의 수동적 처리 방식에 기인합니다. 진정한 학습은 정보를 머릿속으로 밀어 넣을 때가 아니라, 이미 들어간 정보를 강제로 끄집어내려고 분투하는 순간 비로소 시작됩니다." }, { heading: "2. 시냅스 가소성의 생물학: 인출이 신경망을 조각하는 방식", body: "신경과학의 핵심 원리인 헵의 법칙(Hebb's Rule)은 '함께 활성화된 뉴런은 함께 연결된다'고 단언합니다. 그러나 이 연결이 영구적인 장기 기억으로 자리 잡기 위해서는 '장기 증강(LTP, Long-Term Potentiation)'이라는 물리적 변화가 필수적입니다. 기억을 끄집어내는 '인출 연습(Retrieval Practice)'을 수행할 때, 뇌는 결손된 신경 신호를 재건하기 위해 전두엽과 해마를 격렬하게 가동합니다. 이 과정에서 시냅스 틈새로 글루타메이트가 분비되고 NMDA 수용체가 활성화되며 시냅스 후막의 AMPA 수용체 밀도가 급증합니다. 기억의 단서를 역추적하며 뇌가 겪는 찰나의 막힘과 인지적 마찰은 단순한 고통이 아니라, 시냅스 연결 통로를 좁은 오솔길에서 8차선 고속도로로 포장하는 생화학적 신호입니다. 즉, 답을 모른 채 머리를 쥐어짜는 그 괴로운 몇 초 동안 뇌는 자신의 물리적 지도를 재설계하고 있는 것입니다." }, { heading: "3. '바람직한 어려움'의 설계: 지식을 뇌에 영구 박제하는 기술", body: "공부가 쉬우면 뇌는 변하지 않습니다. 로버트 비요크 교수가 주창한 '바람직한 어려움(Desirable Difficulties)' 원리는 학습의 효율성이 즉각적인 수월함이 아닌 전략적 저항에서 탄생함을 입증합니다. 오늘부터 당장 실천할 수 있는 가장 우아한 인출 기법은 '블라인드 덤프(Blind Dump)'입니다. 챕터를 읽은 직후 책을 덮고, 백지 위에 방금 읽은 구조와 핵심 개념을 기억에만 의존해 토해내듯 적어보는 것입니다. 이 과정에서 발생하는 공백과 오류는 뇌에 가장 강력한 수정 피드백을 전달하며, 이어지는 재열람 시 해당 정보가 신경망에 흡착되는 흡수율을 폭발적으로 끌어올립니다. 질문 카드 작성, 동료를 향한 설명, 시간 간격을 둔 분산 인출은 수동적 소비자를 지식의 주권자로 전환합니다. 뇌는 쉽게 얻은 편안함을 기억하지 않으며, 오직 투쟁 끝에 쟁취한 결핍의 회복만을 영구적인 지혜로 각인합니다." }] }, { id: "culture-15514", category: "culture", type: "article", title: "물건을 숨긴 매장이 승리하는 법: 성수와 한남이 설계한 감각의 통제권", summary: "물건 대신 공감각적 서사를 판매하는 성수와 한남의 팝업스토어. 클릭 한 번이면 배송되는 시대에 브랜드가 오프라인 평당 효율을 버리고 '기억의 지분'을 사들이는 경험 경제학의 이면을 추적합니다.", source: "맘고리즘 · 도시문화 인덱스", duration: "5분 읽기", date: "최신 칼럼", imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80", url: "https://momgorithm.com/culture/spatial-branding-seongsu-hannam", recommendationReason: "디지털 전환의 정점에서 오히려 오프라인 영토 전쟁이 격화되는 역설을 공간 사회학과 미디어 이론의 렌즈로 명쾌하게 해체해 줍니다.", keyPoints: ["성수의 날것 그대로인 산업적 질감(Authenticity)과 한남의 폐쇄적 취향 공동체(Exclusivity)가 만든 로컬 문법의 차이", "매출 증대라는 즉각적 목적을 버리고 방문자의 '감각과 체류 시간'을 점유하여 온라인 2차 바이럴을 유도하는 환전 구조", "소비자가 공간의 구경꾼에서 '공동 연출자'로 전환되는 하이퍼 리테일 시대, 공간 브랜딩의 생존 공식"], sections: [{ heading: "1. 판매의 종말, 기억의 점유: 왜 브랜드는 부동산에 막대한 자본을 쏟는가", body: "스마트폰 화면 속에서 세상의 모든 재화가 1초 만에 결제되는 시대, 역설적이게도 서울의 골목은 거대한 팝업스토어 전시장으로 변모했습니다. 과거의 리테일 공간이 평당 매출을 극대화하기 위해 상품을 빽빽이 진열하던 '재고의 쇼케이스'였다면, 지금 성수동과 한남동의 오프라인 공간은 물건을 의도적으로 감추거나 최소화합니다. 브랜드들이 천문학적인 임대료와 인테리어 비용을 감수하며 오프라인으로 쏟아져 나오는 이유는 단순한 직접 판매가 아닙니다. 디지털 환경에서는 결코 획득할 수 없는 '신체적 몰입'과 '체류 시간'을 확보하기 위함입니다. 물리적 실체를 잃어버린 온라인 플랫폼의 한계를 돌파하기 위해, 기업들은 소비자의 뇌리에 지워지지 않는 감각적 문신을 새기는 장치로 공간을 재정의하고 있습니다. 물건을 파는 것이 아니라 브랜드의 세계관을 들이마시게 만드는 일, 이것이 오늘날 경험 경제학의 출발점입니다." }, { heading: "2. 성수의 해체주의적 날것 vs 한남의 밀도 높은 폐쇄성: 상반된 두 문법의 공간 심리학", body: "흥미로운 지점은 성수동과 한남동이 공간을 연출하는 방식의 극단적인 대조입니다. 붉은 벽돌과 준공업 지역의 유산을 품은 성수동은 거친 콘크리트와 철골을 날것 그대로 노출하며 '과정의 미학'을 소비하게 만듭니다. 성수의 팝업은 거리에 활짝 열려 있으며, 방문객이 공간 안팎을 유기적으로 유영하며 자유로운 탐험가가 되도록 유도합니다. 반면 대사관저와 고급 주거지가 밀집한 한남동은 은밀하고 우아한 '살롱 문화'를 표방합니다. 높은 가벽, 묵직한 철문, 조도를 낮춘 조명과 정제된 향을 통해 외부와 철저히 단절된 프라이빗한 경험을 선사합니다. 성수가 탈권위적이고 파괴적인 에너지를 통해 대중적 바이럴을 폭발시킨다면, 한남은 선택된 소수만이 향유한다는 은밀한 구별 짓기와 취향의 선별성을 무기로 삼습니다. 두 지역은 서로 다른 건축적·사회적 텍스트를 통해 소비자로 하여금 특정 라이프스타일의 주인공이 된 듯한 착각을 정교하게 설계해 냅니다." }, { heading: "3. 소비자는 더 이상 관객이 아니다: 무대화된 공간과 능동적 퍼포머의 탄생", body: "성공적인 팝업스토어의 핵심 메커니즘은 소비자를 수동적인 관람객에 머물게 두지 않고, 공간의 완성도를 결정짓는 '퍼포머'로 격상시키는 데 있습니다. 인스타그램의 사각 프레임에 최적화된 포토존, 직원의 일방적 설명 대신 주도적으로 향을 섞어보거나 미션을 수행하는 인터랙티브 동선은 방문자를 자발적 스토리텔러로 탈바꿈시킵니다. 소비자는 완성된 연극을 관람하는 것이 아니라, 자신이 주인공으로 등장하는 단편 영화를 촬영하기 위해 그곳을 방문합니다. 결국 오프라인 공간은 거대한 ‘촬영 세트장’이며, 소비자가 생성해 온라인 피드로 송출하는 무수한 UGC(사용자 생성 콘텐츠)야말로 공간 브랜딩이 거두어들이는 최종 화폐입니다. 물리적 공간의 진정한 승부는 문을 열고 들어서는 순간이 아니라, 문을 나선 소비자가 자신의 디지털 영토에 어떤 파편을 기록하고 전파하느냐에 달려 있습니다." }] }, { id: "hobby-44685", category: "hobby", type: "article", title: "벽 위에서 지우는 불안의 무게: 실내 클라이밍과 전신 기능성 스트렝스가 빚어내는 신경학적 회복", summary: "끝없는 만성 스트레스와 뇌 피로에 시달리는 현대인에게 실내 클라이밍은 신체 기능 회복을 넘어 코르티솔을 잠재우고 강제적 몰입을 선사하는 지적이고도 역동적인 신체적 해법입니다.", source: "라이프스타일 매거진 B", duration: "5분 읽기", date: "최신 칼럼", imageUrl: "https://images.unsplash.com/photo-1522163182402-834f871fd851?w=800&auto=format&fit=crop&q=80", url: "https://magazine-b.co.kr", recommendationReason: "단순한 땀 흘리기를 넘어 뇌의 과부하를 끄고 몸의 숨겨진 사슬을 깨우는 기능성 움직임의 과학적 통찰을 제공합니다.", keyPoints: ["홀드를 잡는 순간 촉발되는 고유수용감각이 전두엽의 반추 사고를 즉각 차단하고 코르티솔 수치를 감소시킵니다.", "고립 운동과 차별화된 다관절 전신 협응과 기능성 스트렝스가 척추와 코어를 재정렬하여 자세성 만성 피로를 해소합니다.", "신체적 문제 해결(루트 파인딩) 과정에서 분비되는 도파민과 성취감은 일상의 회복탄력성을 극적으로 강화합니다."], sections: [{ heading: "1. 뇌의 과부하를 끄는 수직의 탈출구: 멘탈 브레이크로서의 벽", body: "정보 과잉의 시대를 살아가는 현대인의 뇌는 늘 '켜짐' 상태로 유지되며, 끊임없이 코르티솔을 뿜어내는 반추 사고(Rumination)에 갇혀 있습니다. 모니터 앞에서의 지적 피로는 몸을 움직이지 않고서는 결코 해소되지 않는 역설을 품고 있습니다. 실내 클라이밍은 이 지점에서 가장 급진적이고 우아한 단절을 제공합니다. 지상에서 단 1미터만 발을 떼어도, 인간의 신경계는 생존 본능에 가까운 고유수용감각(Proprioception)을 강렬하게 가동합니다. 다음 홀드로 손을 뻗는 찰나의 순간, 직장 내의 갈등이나 미래에 대한 불안 같은 추상적 잡음은 시야에서 완전히 증발합니다. 떨어지지 않기 위해 온 감각을 손끝과 발끝의 마찰력에 집중하는 '강제된 현존(Forced Mindfulness)'은 과열된 전두엽을 일시 정지시키고, 체내 스트레스 호르몬 수치를 급격히 하향 안정화시키는 신경학적 리셋 버튼으로 작동합니다." }, { heading: "2. 근육의 파편화를 넘어선 유기적 사슬: 기능성 스트렝스의 재발견", body: "전통적인 헬스클럽의 웨이트 트레이닝이 특정 근육을 인위적으로 고립시켜 부피를 키우는 데 집중한다면, 클라이밍은 인체의 모든 근막 사슬(Myofascial Chains)을 하나의 유기체로 엮어내는 전신 기능성 스트렝스(Functional Strength) 훈련입니다. 손가락 끝의 미세한 힘은 전완근을 거쳐 광배근, 척추기립근, 둔근, 그리고 발끝의 엄지발가락까지 단절 없이 연결되어야만 수직 벽에 체중을 밀착시킬 수 있습니다. 특히 일상에서 극도로 퇴화하기 쉬운 심부 코어 근육과 견갑골 안정화 근육들이 불안정한 벽면 위에서 실시간으로 3차원적 수축과 이완을 반복합니다. 이는 좌식 생활로 붕괴된 신체 정렬을 근본적으로 복원할 뿐만 아니라, 중력에 저항하며 체중을 효율적으로 분산시키는 '살아있는 힘'을 길러줍니다. 결과적으로 파편화된 근육이 아닌 통합된 신체 조율 능력을 획득하게 되며, 이는 만성 근골격계 통증과 신체 피로를 근원적으로 밀어냅니다." }, { heading: "3. 3차원 체스판 위의 회복탄력성: 일상으로 전이되는 감각적 유능감", body: "클라이밍에서 하나의 등반 코스를 완등하는 행위는 '문제를 푼다(Problem Solving)'고 표현됩니다. 알록달록한 홀드의 배열을 관찰하고 신체의 무게중심 이동 궤적을 머릿속으로 시뮬레이션하는 '루트 파인딩'은 지적인 추론과 육체적 실행이 완벽하게 결합된 행위입니다. 수차례 추락을 경험하고, 실패의 원인을 신체 역학적으로 분석한 뒤 마침내 완등 홀드를 두 손으로 거머쥘 때 터져 나오는 도파민은 디지털 스크린이 주는 휘발성 보상과는 결이 완전히 다릅니다. 이는 통제 불가능해 보이는 현실의 스트레스 속에서 '스스로 몸과 마음을 통제하여 장애물을 돌파했다'는 강력한 자기효능감(Self-Efficacy)을 심어줍니다. 벽 위에서 단련된 전신의 기능적 견고함과 멘탈의 유연성은 일상으로 고스란히 전이되어, 거센 파도처럼 밀려오는 삶의 스트레스 앞에서도 부서지지 않고 유연하게 무게중심을 이동하는 회복탄력성의 단단한 밑바탕이 됩니다." }] }, { id: "tech-draft-1", category: "tech", type: "article", title: "2026 온디바이스 AI 패러다임: 클라우드를 벗어나 내 주머니 속으로 들어온 초경량 신경망", summary: "거대 데이터센터에 의존하던 LLM이 어떻게 1와트 미만의 스마트폰 AP 안으로 압축되었는지, NPU 아키텍처의 혁신을 분석합니다.", source: "토스 테크 · Toss Tech", duration: "6분 읽기", date: "최신 칼럼", imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80", url: "https://toss.tech", recommendationReason: "네트워크 연결 없이도 스마트폰 자체 칩셋에서 작동하는 온디바이스 AI의 보안성과 프라이버시 패러다임을 조명합니다.", keyPoints: ["클라우드 API 호출 지연 시간(Latency)과 데이터 유출 위험을 0으로 만드는 로컬 온디바이스 추론.", "양자화(Quantization)와 지식 증류(Distillation)를 통한 3B~7B 매개변수 초경량화 기법.", "스마트폰 배터리 소모를 극소화하는 모바일 전용 NPU(신경망처리장치) 칩셋 설계."], sections: [{ heading: "1. 중앙 집중형 클라우드의 한계와 로컬 지능의 태동", body: "지난 수년간 생성형 AI는 수천 개의 GPU가 돌아가는 거대 클라우드 데이터센터의 전유물이었습니다. 하지만 수억 명의 동시 접속으로 인한 천문학적인 서버 비용, 평균 1~2초에 달하는 네트워크 응답 지연(Latency), 그리고 민감한 개인정보의 외부 유출 우려는 클라우드 중심 AI의 치명적인 한계로 부각되었습니다. 이에 따라 글로벌 빅테크 기업들은 모델을 스마트폰, 노트북, 웨어러블 기기 자체에서 구동하는 '온디바이스(On-Device) AI'로 기술 축을 급격히 이동하고 있습니다." }, { heading: "2. 매개변수 다이어트: 수십 기가 모델이 2GB 램에 들어가는 원리", body: "온디바이스 AI의 핵심 기술은 고성능 거대 모델의 성능을 90% 이상 유지하면서 모델 크기를 10분의 1 이하로 줄이는 압축 공학입니다. 부동소수점 정밀도를 16비트에서 4비트(INT4)로 낮추는 양자화(Quantization) 기술과 불필요한 뉴런 연결을 가지치기하는 프루닝(Pruning), 그리고 거대 교사 모델이 소형 학생 모델을 지도하는 지식 증류(Knowledge Distillation) 기술이 결합되어 스마트폰의 제한된 NPU 자원에서도 초당 수십 토큰의 고속 추론을 실현했습니다." }, { heading: "3. 프라이버시와 개인화의 결합: 내 데이터를 서버에 보내지 않는 세상", body: "온디바이스 AI의 가장 강력한 무기는 타협 없는 보안입니다. 사용자의 사진, 음성, 금융 거래 내역, 개인 메시지가 기기 외부로 단 1바이트도 전송되지 않고 로컬에서 안전하게 처리됩니다. 이는 의료, 금융, 법률 등 고도의 프라이버시가 요구되는 산업군뿐만 아니라, 사용자의 실시간 행동 데이터를 실시간으로 반영하는 초개인화 알고리즘의 비약적인 진화를 의미합니다." }] }, { id: "study-draft-1", category: "study", type: "article", title: "뇌과학이 증명한 '인출 연습(Retrieval Practice)': 읽기만 하는 공부가 실패하는 이유", summary: "단순 반복 읽기는 뇌에 지적 착각만 줄 뿐입니다. 뇌신경 시냅스를 영구 강화하는 능동적 기억 인출의 과학적 메커니즘을 탐구합니다.", source: "하버드 비즈니스 리뷰 · 뇌과학 아카이브", duration: "5분 읽기", date: "최신 칼럼", imageUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80", url: "https://hbr.org", recommendationReason: "노력 대비 기억 지속 시간을 3배 이상 늘려주는 인지 심리학 최고의 학습 원리를 바로 일상에 적용할 수 있습니다.", keyPoints: ["입력(Input) 중심 학습의 치명적 함정: '알고 있다'는 착각을 유발하는 유창성 착각(Fluency Illusion).", "기억을 끄집어낼 때마다 시냅스 연결이 물리적으로 재구성되는 기억 고정화(Re-consolidation).", "플래시카드, 백지 복습법, 페이만 테크닉을 활용한 실전 인출 학습 프로토콜."], sections: [{ heading: "1. 교재를 형광펜으로 칠하는 행위가 주는 가짜 안도감", body: "많은 수험생과 지식 노동자들은 책을 여러 번 정독하고 중요한 문장에 형광펜을 칠하는 것만으로 충분한 공부를 했다고 착각합니다. 인지과학에서는 이를 '유창성 착각(Fluency Illusion)'이라고 부릅니다. 눈앞에 놓인 문장을 매끄럽게 읽어 내려갈 수 있다는 느낌이, 정작 시험장이나 실무 현장에서 그 지식을 스스로 끄집어낼 수 있다는 착각을 유발하기 때문입니다. 정보가 뇌로 들어오는 '입력' 과정 자체는 장기 기억을 만드는 데 거의 기여하지 못합니다." }, { heading: "2. 기억을 끄집어내는 고통이 시냅스를 재건축한다", body: "장기 기억의 형성은 정보를 머릿속에서 억지로 쥐어짜 내는 '인출(Retrieval)' 순간에 비로소 촉발됩니다. 뇌는 기억을 인출하려고 애쓰는 과정에서 도파민과 노르에피네프린을 분비하며, 관련 뉴런 간의 시냅스 연결을 더 굵고 단단하게 재배선합니다. 심리학 실험에 따르면, 4번 복습한 그룹보다 1번 읽고 3번 셀프 테스트를 본 그룹의 1주일 뒤 기억 잔존율이 50% 이상 월등히 높았습니다. 인출할 때 겪는 적절한 난이도와 인지적 고통이야말로 뇌가 기억을 중요한 자산으로 분류하는 신호입니다." }, { heading: "3. 내일부터 당장 실천하는 3단계 인출 프로토콜", body: "인출 연습을 삶에 안착시키는 방법은 매우 단순합니다. 첫째, 한 챕터를 읽은 후 책을 덮고 빈 종이에 방금 읽은 핵심 개념 3가지를 손으로 적어보는 '백지 복습법'을 적용하세요. 둘째, 내가 배운 개념을 초등학생도 이해할 수 있는 쉬운 비유로 소리 내어 설명해보는 '페이만 테크닉'을 병행합니다. 셋째, Anki 같은 간격 반복(Spaced Repetition) 알고리즘 도구를 활용해 잊힐 만한 시점에 인출 질문을 주기적으로 던지는 시스템을 구축하세요." }] }, { id: "culture-draft-1", category: "culture", type: "article", title: "성수동과 한남동의 공간 브랜딩: 오프라인 팝업스토어가 파는 '경험 경제학'", summary: "이커머스가 정복한 디지털 시대, 왜 브랜드들은 역설적으로 값비싼 오프라인 팝업 공간으로 몰려드는지 공간 신경학적 배경을 짚어봅니다.", source: "씨네21 · 독립·예술 기획", duration: "5분 읽기", date: "최신 칼럼", imageUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80", url: "http://www.cine21.com", recommendationReason: "스마트폰 화면을 넘어 오감(五感)을 자극하는 공간 경험이 브랜드의 충성도를 어떻게 결정짓는지 통찰을 얻을 수 있습니다.", keyPoints: ["클릭 몇 번으로 구매 가능한 시대, 소비자가 기꺼이 1시간씩 줄을 서는 '체험의 희소성'.", "시각, 촉각, 공간의 향(Scent)이 뇌의 편도체에 직접 각인시키는 정서적 유대감.", "물건을 파는 매장에서 브랜드의 세계관을 탐험하는 몰입형 전시장으로의 진화."], sections: [{ heading: "1. 쿠팡과 네이버가 줄 수 없는 것: 공간의 입체적 질감", body: "스마트폰 터치 한 번으로 새벽에 문 앞까지 배송되는 완벽한 편리함의 시대에, 2030 세대는 왜 성수동 골목길 팝업스토어 앞에 1시간씩 줄을 서서 기다릴까요? 답은 '경험의 결핍'에 있습니다. 디지털 환경은 극도의 효율성을 제공하지만, 오감을 자극하는 입체적인 질감과 장소성(Placeness)을 제공하지 못합니다. 현대의 소비자들에게 공간은 단순히 물건을 구매하는 매장이 아니라, 브랜드를 온몸으로 감각하고 자신만의 취향을 인증하는 문화적 무대로 작동합니다." }, { heading: "2. 뇌의 감정 중추를 자극하는 향기와 오브제의 심리학", body: "공간 브랜딩의 핵심은 뇌의 후각과 촉각 경로를 장악하는 것입니다. 젠틀몬스터, 탬버린즈, 아더에러 같은 공간 혁신 브랜드들은 입구에 들어서는 순간 독자적으로 조향된 시그니처 향과 기괴하면서도 웅장한 키네틱 아트를 마주하게 만듭니다. 후각과 시각적 충격은 이성적 판단을 관장하는 전두엽을 건너뛰고 기억과 감정을 관장하는 해마와 편도체로 직행합니다. 소비자는 물건의 가격표를 보기도 전에 이미 그 브랜드에 매혹되는 것입니다." }, { heading: "3. 미래의 상거래: '물건 판매자'에서 '세계관 설계자'로", body: "오프라인 매장의 성패는 이제 평당 매출액이 아닌 평당 체류 시간과 SNS 공유율로 측정됩니다. 제품을 진열해 파는 곳이 아니라, 고객이 브랜드의 세계관 속에 뛰어들어 주인공이 되는 놀이터를 만들어야 합니다. 온라인으로 고객을 모으는 획득 비용(CAC)이 천문학적으로 치솟는 지금, 잘 설계된 하나의 오프라인 공간은 수억 원의 디지털 광고보다 훨씬 강력하고 영구적인 팬덤을 형성하는 최고의 전략적 자산이 되었습니다." }] }, { id: "hobby-draft-1", category: "hobby", type: "article", title: "심폐 기능과 미토콘드리아를 깨우는 'Zone 2 러닝': 왜 천천히 달려야 더 빨라지는가", summary: "숨이 턱 끝까지 차오르게 달리는 것만이 능사가 아닙니다. 심장 근육과 지방 대사 효율을 극대화하는 과학적 유산소 훈련법을 해부합니다.", source: "라이프스타일 매거진 B", duration: "5분 읽기", date: "최신 칼럼", imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80", url: "https://magazine-b.co.kr", recommendationReason: "부상 없이 평생 지속할 수 있으면서도 심혈관 건강과 활력을 최상위 1%로 끌어올리는 운동의 황금률을 전달합니다.", keyPoints: ["최대 심박수의 60~70% 구간: 젖산이 축적되지 않고 지방을 주 연료로 태우는 에너지 시스템.", "세포 내 에너지 발전소인 미토콘드리아의 밀도와 부피를 폭발적으로 늘리는 저강도 자극.", "옆 사람과 숨차지 않게 대화할 수 있는 페이스로 주 3회 45분간 실천하는 루틴."], sections: [{ heading: "1. '고통 없이는 얻는 것도 없다'는 신화의 종말", body: "많은 러너들이 피를 토할 듯이 전력 질주해야만 제대로 된 운동이 된다고 믿습니다. 하지만 무리한 고강도 인터벌 러닝은 스트레스 호르몬인 코르티솔을 급증시키고 관절과 건에 과도한 부하를 주어 결국 번아웃이나 부상으로 이어집니다. 세계 최정상급 엘리트 마라토너와 사이클 선수들의 훈련 일지를 분석해보면 놀랍게도 전체 훈련량의 80% 이상이 '말을 편하게 할 수 있을 정도로 천천히 달리는' 저강도 유산소 영역에 집중되어 있습니다." }, { heading: "2. 미토콘드리아 청소와 지방 연소의 엔진룸", body: "Zone 2(존 2) 훈련의 핵심 목적은 세포 속 발전소인 미토콘드리아의 유연성과 효율을 극대화하는 것입니다. 심박수가 최대치의 60~70%에 머무는 구간에서 우리 몸은 탄수화물 대신 체지방을 산소와 결합하여 주된 에너지원으로 태웁니다. 또한 오래된 미토콘드리아를 스스로 정화하고 새로운 미토콘드리아를 증식시키는 생체 합성(Biogenesis)을 유도합니다. 이것이 바로 피로를 덜 타는 강철 체력과 대사 건강의 근본 토대입니다." }, { heading: "3. 스마트워치를 활용한 실전 Zone 2 페이스 설정법", body: "Zone 2를 측정하는 가장 정확한 기준은 '대화 테스트(Talk Test)'입니다. 달리는 도중 전화 통화를 끊김 없이 문장 단위로 이어갈 수 있는 속도가 본인의 Zone 2입니다. 스마트워치를 착용한다면 (220 - 나이) 공식에 0.65~0.75를 곱한 심박수를 유지하세요. 페이스가 생각보다 너무 느려 걷는 속도에 가깝더라도 조급해할 필요가 없습니다. 8주 동안 꾸준히 존 2를 누적하면, 같은 낮은 심박수에서도 러닝 페이스가 경이롭게 빨라지는 마법을 경험하게 됩니다." }] }, { id: "study-2199", category: "study", type: "article", title: "기억은 보관이 아닌 재구성이다: 시냅스 가소성과 '인출'의 신경과학", summary: "단순 반복 읽기가 왜 배움의 착각에 불과한지, 뇌과학의 시냅스 가소성과 장기 강화(LTP) 메커니즘을 통해 능동적 인출 훈련이 뇌 구조를 물리적으로 재설계하는 과정을 해부합니다.", source: "네이처 뉴로사이언스 · 인지과학 리뷰", duration: "5분 읽기", date: "최신 칼럼", imageUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80", url: "https://my-gorithm.web.app", recommendationReason: "노력 대비 성과가 나지 않는 비효율적인 공부 습관의 굴레를 끊어내고, 뇌의 생물학적 메커니즘에 정면으로 부합하는 학습 패러다임 전환을 이끌어냅니다.", keyPoints: ["반복해 읽는 수동적 입력은 친숙함에 기반한 '인지적 착각'을 유발하며, 기억 형성의 본질인 시냅스 구조 변화를 촉진하지 못한다.", "장기 기억의 정착은 정보를 꺼내는 순간 일어나는 '인출 노력'과 NMDA 수용체 기반의 장기 강화(LTP) 반응에 달려 있다.", "백지 복습과 셀프 테스트 같은 의도적 불편함은 신경망 연결을 강화해 지식을 완전히 내재화하는 가장 과학적인 지적 단련법이다."], sections: [{ heading: "1. 밑줄 긋기의 함정: 친숙함을 지식으로 오해하는 뇌", body: "수많은 학습자가 두꺼운 전공서나 강의 노트를 반복해 읽으며 밑줄을 긋는 행위에서 일종의 지적 안도감을 느낍니다. 페이지를 거듭 넘길수록 텍스트가 눈에 익고, 문맥이 매끄럽게 읽히면 뇌는 그 지식을 완전히 '이해하고 흡수했다'고 착각합니다. 인지심리학에서는 이를 '유창성의 착각(Illusion of Fluency)'이라 부릅니다. 감각기관을 통해 정보가 수동적으로 유입될 때 발생하는 친숙함은 망막과 단기 기억 피질의 일시적 활성화에 불과할 뿐, 해마에서 대뇌피질로 이어지는 견고한 신경학적 연결망을 구축하지 못합니다. 즉, 입력(Input) 중심의 전통적인 학습 태도는 에너지 소모를 최소화하려는 뇌의 본능에는 부합할지언정, 정작 시험장이나 실무 현장처럼 기억을 주도적으로 꺼내 써야 하는 결정적 순간에는 아무런 힘도 발휘하지 못하는 취약한 신기루에 가깝습니다." }, { heading: "2. 시냅스 가소성과 장기 강화(LTP): 뇌세포의 길을 내는 법", body: "우리의 뇌는 정적인 컴퓨터 하드디스크가 아닙니다. 경험과 자극의 형태에 따라 신경세포 사이의 시냅스 연결 강도가 유연하게 재편되는 '시냅스 가소성(Synaptic Plasticity)'이라는 생물학적 특성을 지니고 있습니다. 신경망에서 특정 경로가 강하게 반복 자극될 때 시냅스 신호 전달 효율이 반영구적으로 증대되는 현상을 '장기 강화(Long-Term Potentiation, LTP)'라고 합니다. 이때 핵심 매개체는 NMDA 수용체와 글루타메이트 신경전달물질입니다. 자극이 미약하면 마그네슘 이온에 막혀 있던 NMDA 채널이 열리지 않지만, 강렬하고 집중적인 인지적 부하가 걸릴 때 세포막이 탈분극되며 채널이 개방되고 칼슘 이온이 유입됩니다. 이 일련의 생화학적 연쇄 반응은 새로운 수용체를 합성하고 시냅스 말단의 물리적 접촉 면적을 확장합니다. 결국 기억이란 저장소에 얌전히 놓인 서류가 아니라, 뇌세포들이 서로를 부르며 형성한 정교한 전기화학적 '고속도로'인 셈입니다." }, { heading: "3. 인출 연습(Retrieval Practice): 고통스러운 재생산이 신경망을 굳힌다", body: "그렇다면 이 신경 고속도로를 가장 신속하고 견고하게 포장하는 방법은 무엇일까요? 인지신경과학 연구진은 입을 모아 '인출 연습(Retrieval Practice)'을 지목합니다. 정보를 머릿속에 집어넣는 데 집중하기보다, 이미 들어간 불완전한 지식을 온 힘을 다해 밖으로 끄집어내는 과정입니다. 뇌는 저장된 정보를 다시 끄집어낼 때(Recall) 기억의 흔적을 단순히 읽기만 하는 것이 아니라, 기억 회로를 일시적으로 불안정하게 만든 뒤 더 강한 연결 강도로 재응고(Reconsolidation)합니다. 기억이 잘 나지 않아 머리를 쥐어짜는 순간, 바로 그 '인지적 고통' 속에서 NMDA 수용체가 반응하고 시냅스 연결 단백질이 폭발적으로 합성됩니다. 실제로 헨리 뢰디거(Henry Roediger) 교수의 실험에 따르면, 4회 반복 학습한 집단보다 1회 학습 후 3회 시험을 치른 집단이 1주일 뒤 치러진 테스트에서 압도적으로 높은 장기 기억 보존율을 기록했습니다." }, { heading: "4. 인텔리전스의 구조적 재설계: 의도적 불편함을 환영하라", body: "진정한 공부는 수동적 소비자가 아닌 적극적 생산자의 태도를 취할 때 완성됩니다. 책을 덮고 빈 종이 위에 방금 배운 개념의 뼈대를 그려보는 '백지 복습', 배운 내용을 동료나 거울 앞의 자신에게 설명하는 '페인만 기법', 그리고 시간 간격을 두고 오답을 스스로 검증하는 플래시카드 테스트는 시냅스를 단련하는 가장 훌륭한 뇌의 피트니스 루틴입니다. 이러한 훈련 과정은 즉각적인 만족감을 주지 않으며, 때로는 자신의 무지와 마주하게 만들어 불쾌감을 동반하기도 합니다. 그러나 인지적 마찰이 없는 배움은 뇌에 아무런 흔적도 남기지 못합니다. 뇌세포의 회로를 물리적으로 바꾸고 평생 유지되는 통찰로 굳히고 싶다면, 친숙한 읽기의 안락함을 버리고 기꺼이 '인출의 불편함' 속으로 뛰어들어야 합니다. 배움의 성패는 얼마나 많이 집어넣었는가가 아니라, 얼마나 치열하게 끄집어냈는가로 결정됩니다." }] }, { id: "tech-2", category: "tech", type: "video", title: "애플뮤직은 왜 로고를 액체로 흔들었을까? | Apple Music 'Made by Sound' 리뷰", summary: "사운드와 브랜딩 디자인의 혁신적인 결합: 액체 인터랙션 비주얼 시스템과 애플의 최신 크리에이티브 테크놀로지 분석.", source: "YouTube · RBI : 브랜드와 디자인 이야기", duration: "08:45", date: "추천 영상", imageUrl: "https://i.ytimg.com/vi/6uc4QM79mZ8/hqdefault.jpg", youtubeId: "6uc4QM79mZ8", url: "https://www.youtube.com/watch?v=6uc4QM79mZ8" }, { id: "tech-1", category: "tech", type: "article", title: "토스 쇼핑 추천 시스템: 수백만 사용자와 상품을 잇는 멀티 스테이지 접근법", summary: "방대한 사용자 트래픽 속에서 효율적이고 정확한 추천을 제공하기 위한 멀티 스테이지(Retrieval → Ranking → Re-ranking) 파이프라인 설계 전략.", source: "토스 테크 · Toss Tech", duration: "7분 읽기", date: "오늘", imageUrl: "https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=800&auto=format&fit=crop&q=80", url: "https://toss.tech/article/toss-shopping-recommendation", keyPoints: ["수백만 상품 풀에서 목적형/탐색형 사용자를 만족시키는 멀티 스테이지(Retrieval → Ranking → Re-ranking) 아키텍처.", "pCTR(클릭률)과 pCVR(전환율)을 동시에 고려하는 딥러닝 모델링과 비즈니스 다양성 최적화.", "사용자의 실시간 행동 피드백을 추천 후보군에 즉각 반영하는 파이프라인 엔지니어링."], sections: [{ heading: "탐색형 사용자를 위한 추천의 본질", body: "명확한 목적을 가지고 검색하는 사용자와 달리, 피드를 둘러보며 흥미를 발견하는 탐색형 사용자는 취향과 맥락에 대한 정교한 예측이 필요합니다. 토스 쇼핑은 방대한 상품 속에서 사용자가 자연스럽게 매력을 느낄 수 있도록 다단계 추천 파이프라인을 구축했습니다." }, { heading: "멀티 스테이지 추천 파이프라인의 설계", body: "첫 번째 Retrieval 단계에서는 수백만 상품 중 사용자가 관심을 가질 만한 수천 개의 후보군을 초고속으로 추려냅니다. 두 번째 Ranking 단계에서는 딥러닝 기반 pCTR/pCVR 모델을 통해 상품별 점수를 정밀 계산합니다. 마지막 Re-ranking 단계에서는 카테고리 다양성, 신규 아이템 탐색(Exploration), 비즈니스 목표를 반영해 최종 피드를 완성합니다." }, { heading: "지속적인 실험과 사용자 경험 혁신", body: "추천 모델의 성능은 오프라인 지표뿐만 아니라 실제 사용자의 체감 만족도로 검증되어야 합니다. 후보군 수(TopK) 최적화와 실시간 A/B 테스트를 통해 알고리즘이 사용자에게 피로감을 주지 않고 가치 있는 발견을 돕도록 고도화하고 있습니다." }] }, { id: "tech-4", category: "tech", type: "video", title: "파이썬 코딩 무료 강의: 5시간 만에 끝내는 실전 프로그래밍 기초", summary: "프로그래밍 언어 문법부터 실전 웹 스크래핑과 업무 자동화까지 한 번에 배우는 코딩 입문 가이드.", source: "YouTube · 조코딩 JoCoding", duration: "4:52:10", date: "인기 강의", imageUrl: "https://i.ytimg.com/vi/KL1MIuBfWe0/hqdefault.jpg", youtubeId: "KL1MIuBfWe0", url: "https://www.youtube.com/watch?v=KL1MIuBfWe0" }, { id: "tech-3", category: "tech", type: "article", title: "반응형 웹 디자인 핵심 가이드: 최신 CSS 레이아웃과 뷰포트 기법", summary: "모바일 작은 화면부터 대화면 데스크톱까지 일관되고 쾌적한 가독성을 제공하는 프론트엔드 스타일 설계 가이드.", source: "MDN Web Docs · 웹 개발 가이드", duration: "8분 읽기", date: "5일 전", imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80", url: "https://developer.mozilla.org/ko/docs/Learn/CSS/CSS_layout/Responsive_Design", keyPoints: ["모바일 화면부터 설계하는 Mobile-First 접근법은 불필요한 장식을 덜어내고 핵심 콘텐츠에 집중하게 만듭니다.", "최신 CSS Grid의 minmax()와 repeat(auto-fill, ...) 조합은 미디어 쿼리 없이도 완벽한 반응형 카드를 구성합니다.", "모바일 브라우저의 주소창 가변성에 대응하기 위해 100vh 대신 100dvh와 safe-area 단위를 채택하는 것이 표준입니다."], sections: [{ heading: "모바일 화면에서 출발하는 Less is More 철학", body: '데스크톱의 넓은 캔버스에서 시작하면 여백을 채우기 위해 불필요한 사이드바와 위젯을 남발하기 쉽습니다. 반면 390px 모바일 뷰포트에서 먼저 디자인을 시작하면, "사용자에게 지금 당장 가장 가치 있는 정보는 무엇인가?"라는 본질적인 질문에 집중할 수밖에 없습니다.' }, { heading: "미디어 쿼리를 줄이는 현대적 CSS 기법", body: "수많은 브레이크포인트로 분기하던 과거와 달리, 현대 CSS는 고유의 유연성을 활용합니다. grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)) 패턴은 뷰포트 너비에 따라 카드가 자연스럽게 1열, 2열, 3열로 유기적으로 재배치됩니다. 여기에 유동적 타이포그래피를 위한 clamp() 함수를 결합하면 유지보수성이 비약적으로 향상됩니다." }, { heading: "모바일 뷰포트의 새로운 표준: dvh와 세이프 에어리어", body: "스마트폰 브라우저는 스크롤 시 URL 바가 축소되거나 나타나며 높이가 수시로 변합니다. 과거의 100vh는 하단 버튼을 주소창 뒤로 숨기는 치명적인 결함이 있었습니다. 이제 동적 뷰포트 단위 100dvh와 노치/홈 인디케이터를 고려한 env(safe-area-inset-bottom)을 기본으로 적용해야 합니다." }] }, { id: "tech-6", category: "tech", type: "video", title: "제대로 파는 Git & GitHub: 버전 관리와 브랜치 협업 핵심 원리", summary: "원격 저장소 관리부터 풀 리퀘스트(PR) 코드 리뷰, 충돌(Conflict) 해결까지 실무 협업 흐름 정리.", source: "YouTube · 얄팍한 코딩사전", duration: "48:30", date: "필수 시청", imageUrl: "https://i.ytimg.com/vi/1I3hMwQU6GU/hqdefault.jpg", youtubeId: "1I3hMwQU6GU", url: "https://www.youtube.com/watch?v=1I3hMwQU6GU" }, { id: "tech-5", category: "tech", type: "article", title: "스마트폰 배터리 수명과 충전 효율을 지키는 올바른 배터리 관리 가이드", summary: "리튬이온 배터리 화학적 노화 원리부터 배터리 보호 모드, 발열 억제 및 수명 주기를 연장하는 실전 팁.", source: "삼성전자 고객지원 · 배터리 케어", duration: "5분 읽기", date: "4일 전", imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80", url: "https://www.samsung.com/sec/support/galaxy-battery/care-and-maintenance/", keyPoints: ["리튬이온 배터리는 완전 방전(0%)이나 완충(100%) 상태에서 전극의 화학적 스트레스가 가장 높습니다.", "배터리 잔량을 20%~80% 구간에서 유지하면 배터리 수명 주기(Cycle)를 2배 이상 연장할 수 있습니다.", "고속 충전 시 발생하는 발열 관리가 배터리 열화 및 OLED 디스플레이 번인을 막는 핵심입니다."], sections: [{ heading: "충전 사이클과 화학적 열화의 원리", body: "리튬이온 배터리는 양극과 음극 사이를 리튬 이온이 이동하며 충·방전이 이루어집니다. 0% 완전 방전 시에는 음극의 구리 집전체가 용해될 위험이 있고, 100% 완충 상태로 고전압이 장시간 유지되면 전해액이 분해되며 가스가 발생합니다. 따라서 80~85% 보호 충전 기능 활성화가 권장됩니다." }, { heading: "발열: 배터리와 디스플레이의 공통된 적", body: '급속 충전 자체보다 위험한 것은 동반되는 "온도 상승"입니다. 충전 중 고사양 3D 게임이나 4K 영상 렌더링을 병행하면 45도 이상의 고온에 노출되어 배터리 셀의 영구적 용량 감소를 유발합니다. 또한 높은 온도는 OLED의 유기 발광 소자 수명을 급격히 갉아먹어 잔상(번인) 현상을 앞당깁니다.' }, { heading: "실천 가능한 3가지 배터리 관리 루틴", body: '첫째, 밤새 충전기를 꽂아둘 때는 기기 내 "배터리 보호 모드"를 켜두세요. 둘째, 차량 내 직사광선 아래나 두꺼운 케이스를 씌운 채 고속 충전하는 것을 피하세요. 셋째, 20% 경고 알림이 뜨기 전에 미리 보조배터리로 충전하는 습관이 좋습니다.' }] }, { id: "tech-7", category: "tech", type: "article", title: "카카오의 언어모델, Kanana 테크니컬 리포트: 온디바이스와 경량화 AI의 미래", summary: "스마트폰 기기 자체에서 구동되는 초경량 언어 모델 아키텍처와 프라이버시 보호형 온디바이스 AI 개발기.", source: "카카오 테크 · Kakao Tech", duration: "6분 읽기", date: "어제", imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80", url: "https://tech.kakao.com/posts/689", keyPoints: ["온디바이스 AI는 클라우드 서버와의 통신 없이 스마트폰 내 NPU 칩에서 인공지능 모델을 직접 구동합니다.", "개인 민감 데이터(문서, 사진, 건강 정보)가 기기 밖으로 유출되지 않아 프라이버시가 완벽히 보장됩니다.", "네트워크 지연(Latency)이 0에 수렴하여 오프라인 환경에서도 즉각적인 실시간 인터랙션이 가능합니다."], sections: [{ heading: "클라우드 AI의 한계와 온디바이스의 부상", body: "대규모 언어 모델(LLM)이 촉발한 AI 혁명은 엄청난 클라우드 서버 비용과 데이터 프라이버시 문제를 낳았습니다. 내 사적인 통화 내용이나 작성 중인 메모가 외부 서버로 전송된다는 불안감은 AI 대중화의 큰 걸림돌이었습니다. 이를 극복하기 위해 경량화된 SLM(Small Language Model)을 스마트폰 칩셋에서 직접 구동하는 온디바이스 기술이 급부상했습니다." }, { heading: "NPU 아키텍처와 양자화(Quantization) 기술", body: "모바일 NPU(Neural Processing Unit)는 인공신경망의 행렬 연산을 초저전력으로 고속 처리합니다. 여기에 16비트 부동소수점 가중치를 4비트나 8비트 정수로 압축하는 양자화 기술이 더해져, 수 기가바이트 크기의 파라미터를 메모리 수백 메가바이트 수준으로 압축하여 탑재할 수 있게 되었습니다." }, { heading: "내 손안에서 완성되는 완벽한 개인화", body: "온디바이스 AI는 사용자의 이용 패턴, 캘린더, 수면 주기, 관심사 선호도를 기기 로컬 샌드박스에서만 학습합니다. 맘고리즘처럼 사용자가 직접 추천 기준을 조절하는 로컬 지향 서비스와 결합할 때, 진정한 의미의 독립적인 디지털 비서가 완성됩니다." }] }, { id: "tech-8", category: "tech", type: "article", isNew: true, title: "AI 시대를 이끌 3대 메가프로젝트는 무엇일까?", summary: "반도체의 데이터 처리 역할과 팹·패키징을 살펴보고 피지컬 AI, AI 데이터센터 등 미래 핵심 산업을 소개합니다.", recommendationReason: "최신 기술의 원리와 활용 분야에 관심 있는 사용자가 핵심 산업의 구조를 이해할 수 있습니다.", source: "대한민국 정책브리핑", duration: "6분 읽기", date: "정책 브리핑", imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80", url: "https://m.korea.kr/news/policyNewsView.do?newsId=148968025", keyPoints: ["초거대 AI 연산을 뒷받침하는 차세대 HBM(고대역폭 메모리)과 첨단 팹(Fab)·어드밴스드 패키징 인프라.", "로봇과 자율주행, 제조 현장에 AI 두뇌를 결합하는 물리적 공간의 혁신, 피지컬 AI(Physical AI).", "막대한 전력과 냉각 수요를 해결하는 친환경·고효율 미래형 AI 데이터센터 클러스터 구축."], sections: [{ heading: "반도체 생태계의 판도를 바꾸는 첨단 패키징", body: "미세 공정의 한계를 극복하기 위해 서로 다른 칩을 하나로 연결하는 3D 패키징과 HBM 메모리가 핵심 승부처로 떠올랐습니다. 반도체 팹 제조부터 패키징까지 이어지는 밸류체인 경쟁력이 AI 시대의 국가 경쟁력을 좌우합니다." }, { heading: "소프트웨어를 넘어 현실로: 피지컬 AI", body: "컴퓨터 화면 속 텍스트와 이미지 생성을 넘어 휴머노이드 로봇, 스마트 팩토리, 자율주행 이동체 등 현실 세계에서 스스로 감각하고 조작하는 피지컬 AI가 차세대 메가 트렌드로 진화하고 있습니다." }, { heading: "AI 데이터센터와 에너지 솔루션", body: "수만 장의 GPU가 뿜어내는 열을 식히는 액체 냉각(Liquid Cooling) 기술과 원활한 전력 공급망이 결합된 친환경 AI 데이터센터가 미래 인프라의 심장부로 집중 육성되고 있습니다." }] }, { id: "tech-9", category: "tech", type: "article", isNew: true, title: "AI가 스스로 계획하고 행동한다고?", summary: "AI가 목표를 세우고 여러 단계의 작업을 수행하는 에이전틱 AI의 개념과 활용 분야, 보안·개인정보 보호 등의 위험 요소를 알아봅니다.", recommendationReason: "AI가 질문에 답하는 수준을 넘어 실제 작업을 수행하는 방식과 주의할 점을 이해할 수 있습니다.", source: "대한민국 정책브리핑", duration: "5분 읽기", date: "미래 기술", imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=80", url: "https://m.korea.kr/news/policyNewsView.do?newsId=148968687", keyPoints: ["인간의 단일 프롬프트를 해석해 목표 달성에 필요한 하위 태스크를 자율적으로 분해하고 실행하는 에이전틱 AI(Agentic AI).", "도구 사용(Tool Use), 메모리 관리, 웹 브라우징 및 코드 실행을 결합해 복합 워크플로우를 자동 완성.", "자율성이 커짐에 따른 권한 오남용, 프롬프트 인젝션 취약점 및 개인정보 보호를 위한 안전 가드레일 필요성."], sections: [{ heading: "단순 챗봇에서 행동하는 자율 에이전트로", body: '기존의 생성형 AI가 "이 질문에 답해줘"에 응답하는 수동적 비서였다면, 에이전틱 AI는 "다음 달 워크숍 장소를 비교해 팀원 일정에 맞춰 예약해줘"라는 최종 목표를 주면 검색부터 비교, 이메일 전송까지 순차적으로 완수합니다.' }, { heading: "에이전틱 아키텍처의 3요소: 계획, 도구, 반추", body: "에이전트는 복잡한 문제를 쪼개는 계획(Planning), API와 계산기 등을 다루는 도구(Tools), 그리고 실행 결과가 잘못되었을 때 다시 시도하는 자기 반추(Reflection) 루프를 통해 성공률을 높입니다." }, { heading: "자율성 뒤에 숨은 보안과 책임의 과제", body: "에이전트가 외부 시스템과 금융, 개인 데이터에 직접 접근할 수 있게 되면서 의도치 않은 삭제나 권한 탈취를 막기 위한 인가 프로토콜과 인간 승인(Human-in-the-loop) 안전장치가 필수적으로 요구됩니다." }] }, { id: "tech-11", category: "tech", type: "article", isNew: true, title: "게임 속 세상은 어떤 기술로 움직일까?", summary: "최근 비디오 게임 콘솔과 그래픽 하드웨어의 발전, 실시간 3D 렌더링과 디지털 배포망이 게임 속 세상을 구현하는 기술적 원리를 살펴봅니다.", recommendationReason: "기술 분야 관심도에 따라 최신 비디오 게임 및 하드웨어 그래픽 기술의 원리를 추천합니다.", source: "한국어 위키백과 · 비디오 게임 콘솔", duration: "5분 읽기", date: "위키백과", imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80", url: "https://ko.wikipedia.org/wiki/%EB%B9%84%EB%94%94%EC%98%A4_%EA%B2%8C%EC%9E%84_%EC%BD%98%EC%86%94", keyPoints: ["5~7년 세대 주기로 발전하며 가정용 컴퓨터 아키텍처와 통합되는 최신 콘솔 시스템.", "실시간 3D 렌더링을 가능케 하는 전용 GPU 하드웨어와 초소형 고성능 칩셋 제조 공정.", "블루투스, 무선 네트워킹과 디지털 배포를 통한 글로벌 게임 에코시스템 구현."], sections: [{ heading: "가정용 컴퓨터와 콘솔의 기술적 통합", body: "최근의 콘솔은 가정용 컴퓨터와의 추가적인 통합을 보여 개발자들이 여러 플랫폼에서 게임을 출시하기 쉽게 만들었습니다. 광학 미디어 또는 스트리밍 미디어 서비스에서 영화 및 음악을 재생할 수 있는 기능을 갖춘 미디어 플레이어로도 진화했습니다." }, { heading: "실시간 3D 렌더링과 그래픽 프로세서", body: "더 낮은 비용과 작은 크기로 컴퓨팅 파워를 극대화하는 반도체 칩 제조 개선, 실시간 렌더링을 위한 3D 그래픽 및 하드웨어 기반 그래픽 프로세서(GPU) 도입이 게임 내 방대한 가상세계를 사실적으로 구현합니다." }, { heading: "디지털 통신과 글로벌 배포망", body: "인터넷, 무선 네트워킹 및 블루투스와 같은 디지털 통신 기술과 대용량 디지털 배포 방식이 결합하여 게임의 전송과 플레이 경험을 혁신하고 있습니다." }] }, { id: "tech-12", category: "tech", type: "article", isNew: true, title: "추천 결과를 바꾸는 규칙의 정체", summary: "수학과 컴퓨터 과학의 엄밀한 명령 체계인 알고리즘이 조건 분기와 의사 결정을 통해 추천 결과를 도출하는 과정을 알아봅니다.", recommendationReason: "알고리즘의 조건 분기와 자동화된 추론 절차를 통해 추천 시스템의 핵심 기술을 이해할 수 있습니다.", source: "한국어 위키백과 · 알고리즘", duration: "5분 읽기", date: "위키백과", imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80", url: "https://ko.wikipedia.org/wiki/%EC%95%8C%EA%B3%A0%EB%A6%AC%EC%A6%98", keyPoints: ["수학과 컴퓨터 과학에서 특정 계산 문제를 해결하기 위한 수학적으로 엄밀한 유한 명령 수열.", "단순 계산을 넘어 조건문을 활용해 실행 경로를 분기하는 자동화된 의사 결정 메커니즘.", "입력 데이터로부터 타당한 결론을 도출하는 자동화된 추론 기술의 기초."], sections: [{ heading: "알고리즘의 정의와 유한 명령 수열", body: "수학과 컴퓨터 과학에서 알고리즘은 특정 종류의 계산 문제를 풀거나 계산을 수행하기 위한, 수학적으로 엄밀한 명령의 유한 수열입니다." }, { heading: "조건문과 자동화된 의사 결정", body: "더 발전된 알고리즘은 조건문을 사용해 실행 경로를 여러 갈래로 나누고 자동화된 의사 결정을 내립니다. 이를 통해 사용자의 다양한 입력 조건에 맞춤형 결과를 제시할 수 있습니다." }, { heading: "자동화된 추론과 추천 파이프라인", body: "알고리즘은 주어진 데이터로부터 타당한 추론을 이끌어 냄으로써 추천 시스템, 검색 엔진, 데이터 분류 등 복잡한 현대 소프트웨어의 기반이 됩니다." }] }, { id: "tech-13", category: "tech", type: "article", isNew: true, title: "인공지능은 어떻게 판단하는 걸까?", summary: "대규모 데이터 학습과 파운데이션 모델, 생성형 AI가 입력을 처리하여 예측값과 결정을 만들어내는 원리를 탐구합니다.", recommendationReason: "현대 인공지능이 사람의 뇌를 모방하지 않으면서도 고차원 추론과 판단을 내리는 메커니즘을 배울 수 있습니다.", source: "한국어 위키백과 · 인공지능", duration: "6분 읽기", date: "위키백과", imageUrl: "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=80", url: "https://ko.wikipedia.org/wiki/%EC%9D%B8%EA%B3%B5%EC%A7%80%EB%8A%A5", keyPoints: ["대규모 데이터 사전학습 기반의 파운데이션 모델과 생성형 AI의 확산.", "사람의 뇌 구조를 직접 복제하지 않고 입력 데이터를 처리해 예측값, 추천, 결정을 도출하는 추론 구조.", "산업, 과학, 창작 전반의 효율성 향상과 편향·신뢰성 등 기술적 고려 사항."], sections: [{ heading: "파운데이션 모델과 생성형 AI의 시대", body: "2020년대에는 대규모 자료로 미리 학습한 파운데이션 모델과 생성형 인공지능이 확산되면서, 인공지능은 일상적인 정보 서비스뿐 아니라 과학, 의료, 산업과 창작 활동에도 널리 쓰이고 있습니다." }, { heading: "입력 처리와 예측·결정 메커니즘", body: "인공지능 시스템은 입력을 처리해 예측값, 추천, 결정, 글·그림 같은 결과를 만들며, 반드시 사람의 사고 과정을 그대로 흉내 내는 것은 아닙니다. 방대한 패턴 분석과 통계적 추론을 통해 최적의 해답을 도출합니다." }, { heading: "기술 혁신과 신뢰성 과제", body: "인공지능은 반복적인 일을 줄이고 과학적 탐구에 새로운 도구를 제공하지만, 잘못된 결과나 편향, 보안 등 안전성을 보장하기 위한 기술적 정렬(Alignment) 작업이 필수적입니다." }] }, { id: "tech-14", category: "tech", type: "article", isNew: true, title: "로봇은 어떻게 주변을 감지하고 움직일까?", summary: "프로그래밍과 수치 제어를 통해 위험하고 정밀한 작업을 사람 대신 자동 실행하는 기계 장치와 지능형 로봇의 제어 원리를 소개합니다.", recommendationReason: "제조 라인부터 푸드테크까지 자동화된 로봇의 움직임을 구현하는 프로그래밍 제어 원리를 학습합니다.", source: "한국어 위키백과 · 로봇", duration: "5분 읽기", date: "위키백과", imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80", url: "https://ko.wikipedia.org/wiki/%EB%A1%9C%EB%B4%87", keyPoints: ["프로그램으로 제어되어 사람이 직접 하기 어려운 복잡한 작업을 대신 실행하는 기계적 장치.", "수치 정보 입력을 통해 기계가 스스로 정밀 가공과 동작을 완수하는 수치 제어 원리.", "환경을 인식해 스스로 판단하는 지능형 로봇 및 푸드테크·산업 자동화의 확장."], sections: [{ heading: "프로그램으로 작동하는 자동 기계", body: "로봇은 프로그램으로 작동하고, 사람이 직접 수행할 수 없는 어렵고 복잡하며 위험한 일련의 작업들을 사람 대신 실행하는 기계적 장치입니다." }, { heading: "수치 제어와 정밀 동작의 구현", body: "수치 제어 공작 기계는 가공하는 작업의 순서와 내용을 수치 정보로 만들어 기계에 입력시키면 기계가 자동적으로 가공 작업을 수행합니다. 이러한 수치 제어 기술이 로봇의 정확한 동작 궤적을 완성합니다." }, { heading: "산업용 로봇에서 지능형 로봇으로", body: "제조공장에서 조립, 용접, 핸들링을 수행하는 산업용 로봇에 이어, 센서와 알고리즘으로 환경을 인식해 스스로 판단하는 지능형 로봇과 급식·조리용 푸드테크 로봇으로 발전하고 있습니다." }] }, { id: "tech-15", category: "tech", type: "article", isNew: true, title: "악성 소프트웨어는 어떻게 관찰하고 확인할까?", summary: "바이러스와 랜섬웨어 같은 악성 소프트웨어를 탐지하기 위해 보안 시스템이 사용하는 정적 분석과 동적/휴리스틱 분석의 원리를 살펴봅니다.", recommendationReason: "보안 백신 프로그램이 위험한 코드를 사전에 포착하고 무력화하는 최신 소프트웨어 분석 기술을 다룹니다.", source: "한국어 위키백과 · 악성 소프트웨어", duration: "5분 읽기", date: "위키백과", imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80", url: "https://ko.wikipedia.org/wiki/%EC%95%85%EC%84%B1_%EC%86%8C%ED%94%84%ED%8A%B8%EC%9B%A8%EC%96%B4", keyPoints: ["파일을 직접 실행하지 않고 시그니처와 구조를 검사하는 정적 분석(Static Analysis).", "가상 환경(샌드박스)에서 프로그램 동작과 의심 행위를 실시간 감시하는 동적/휴리스틱 분석.", "초기 컴퓨터 바이러스 연구부터 현대 암호화 랜섬웨어 대응까지의 보안 기술 진화."], sections: [{ heading: "악성 소프트웨어 연구와 암호화 기술", body: "프레드 코헨의 초기 컴퓨터 바이러스 실험 이후, 악성 코드는 탐지 회피와 자가 난독화 기법을 진화시켜 왔으며 현대에는 암호화 기술을 결합한 랜섬웨어 형태로 발전했습니다." }, { heading: "정적 분석: 시그니처와 코드 구조 검사", body: "바이러스 백신 소프트웨어는 악성 소프트웨어를 탐지하기 위해 두 가지 기술을 사용합니다. 첫 번째인 정적 분석은 파일을 실행하지 않고 고유 시그니처와 코드 패턴을 대조하여 위험을 즉시 식별합니다." }, { heading: "동적 및 휴리스틱 분석: 행위 기반 감시", body: "변종 및 미등록 위협에 대응하기 위해 보안 시스템은 프로그램을 격리된 환경에서 실행하며 시스템 콜, 네트워크 연결, 메모리 변조 행위를 실시간 감시하는 동적/휴리스틱 분석을 병행합니다." }] }, { id: "tech-16", category: "tech", type: "article", isNew: true, title: "컴퓨터가 사람의 말을 다루는 방법", summary: "자연어 처리(NLP)가 음성 인식, 문서 분류, 텍스트 이해와 생성을 구현하기 위해 사용하는 수학적 통계와 기계학습 모델의 구조를 소개합니다.", recommendationReason: "컴퓨터가 인간의 복잡한 언어 체계를 수학적 벡터로 변환하고 처리하는 NLP 핵심 원리를 이해할 수 있습니다.", source: "한국어 위키백과 · 자연어 처리", duration: "6분 읽기", date: "위키백과", imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80", url: "https://ko.wikipedia.org/wiki/%EC%9E%90%EC%97%B0%EC%96%B4_%EC%B2%98%EB%A6%AC", keyPoints: ["음성 인식, 문서 분류, 자연어 이해(NLU), 자연어 생성(NLG)을 아우르는 핵심 처리 파이프라인.", "언어학과 인지과학적 현상을 수학적·통계적 벡터 공간으로 수량화하는 모델링.", "대규모 언어 모델(LLM)과 기계학습 도구를 활용한 실시간 대화 및 문맥 해석 기술."], sections: [{ heading: "자연어 처리 시스템의 주요 파이프라인", body: "NLP 시스템의 주요 처리 작업에는 음성 인식, 문서 분류, 자연어 이해(NLU), 자연어 생성(NLG)이 포함됩니다. 컴퓨터가 소리를 문자로 변환하고 그 의미를 파악해 응답을 생성하는 일련의 과정입니다." }, { heading: "언어학과 수학·통계학의 결합", body: "자연어 처리는 연구 대상이 언어이기 때문에 언어 자체를 연구하는 언어학 및 언어 현상의 내적 기제를 탐구하는 인지 과학과 연관이 깊습니다. 이를 구현하기 위해 수학적·통계적 도구를 광범위하게 활용합니다." }, { heading: "기계학습과 트랜스포머의 혁신", body: "특히 기계학습 및 딥러닝 도구를 적극 채택하면서 문맥과 뉘앙스를 스스로 학습하는 모델로 진화하였으며, 현대 챗봇과 번역 시스템의 두뇌 역할을 담당하고 있습니다." }] }, { id: "tech-17", category: "tech", type: "article", isNew: true, title: "로봇 수술은 우리 생활에서 어디에 쓰일까?", summary: "의사의 정밀한 제어 명령을 마이크로 로봇 관절로 전달하여 수술의 정확도를 높이고 환자 회복을 돕는 현대 의료 로봇 공학의 성과를 다룹니다.", recommendationReason: "정밀 제어 기술과 비전 시스템이 의료 현장과 결합하여 인간의 한계를 극복하는 실전 테크 사례입니다.", source: "한국어 위키백과 · 로봇 수술", duration: "4분 읽기", date: "위키백과", imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80", url: "https://ko.wikipedia.org/wiki/%EB%A1%9C%EB%B4%87_%EC%88%98%EC%88%A0", keyPoints: ["의사의 손동작을 미세 로봇 팔로 실시간 동기화하여 제어하는 컴퓨터 보조 수술 시스템.", "인간 손의 미세 떨림을 필터링하고 고배율 3D 고화질 시야를 제공하는 엔지니어링.", "외과를 넘어 비뇨의학과, 흉부외과 등 광범위한 임상 영역으로의 응용 확장."], sections: [{ heading: "로봇 수술의 개념과 의사의 정밀 제어", body: "로봇 수술은 수술 도구를 움직일 수 있는 로봇을 의사가 제어하며 진행하는 수술 방식입니다. 로봇이 단독으로 판단하는 것이 아니라 전문의의 숙련된 조작을 초정밀 기계 장치로 전달합니다." }, { heading: "최소 침습과 3차원 확대 비전 시스템", body: "극소 절개를 통해 마이크로 관절 도구를 환자 몸속으로 삽입하고, 고해상도 3D 입체 카메라를 통해 미세 혈관과 신경을 선명하게 관찰함으로써 수술 후 출혈과 회복 기간을 획기적으로 줄입니다." }, { heading: "다양한 의학 분야로의 기술 확장", body: "초기 외과 영역을 넘어 현재는 심장 흉부외과, 산부인과, 비뇨의학과 등 고도의 정밀함이 요구되는 복잡한 임상 수술 분야로 응용 범위가 지속적으로 확장되고 있습니다." }] }, { id: "tech-18", category: "tech", type: "article", isNew: true, title: "구글 제미나이는 생각과 기억에 어떻게 연결될까?", summary: "멀티모달 대형 언어 모델 구글 제미나이가 텍스트, 코드, 이미지를 처리하고 사용자의 과거 대화 맥락을 기억·참조하는 기술 메커니즘을 알아봅니다.", recommendationReason: "대화 세션을 넘어 장기 기억과 맥락을 유지하는 최신 대형 언어 모델의 개인화 기술을 조망합니다.", source: "한국어 위키백과 · 구글 제미나이", duration: "5분 읽기", date: "위키백과", imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=80", url: "https://ko.wikipedia.org/wiki/%EA%B5%AC%EA%B8%80_%EC%A0%9C%EB%AF%B8%EB%82%98%EC%9D%B4", keyPoints: ["텍스트, 코드, 이미지, 오디오, 비디오를 네이티브로 동시 처리하는 멀티모달 아키텍처.", "과거 대화 내역을 보존하고 필요 시 참조하여 개인화된 맥락을 구축하는 장기 기억 기능.", "단순 질의응답을 넘어 사용자의 취향과 작업 흐름을 유지하는 AI 에이전트 인터페이스."], sections: [{ heading: "네이티브 멀티모달 LLM 아키텍처", body: "제미나이 아키텍처는 여러 데이터 유형에 대해 기본적으로 학습되어 모델이 텍스트, 컴퓨터 코드, 이미지, 오디오 및 비디오를 별도의 변환 없이 동시에 처리하고 생성할 수 있는 강점을 지닙니다." }, { heading: "과거 대화의 기억과 맥락 참조", body: "구글은 과거의 대화를 기억하고 참조할 수 있는 메모리 기능을 도입했습니다. 이를 통해 AI는 이전 세션에서 공유한 사용자의 선호도, 프로젝트 배경, 규칙을 기억하여 매번 설명할 필요 없는 연속적인 대화를 지원합니다." }, { heading: "개인화 가상 비서로의 진화", body: "장기 기억과 실시간 추론이 결합된 AI 비서는 문서 작성과 코드 분석뿐 아니라 일상의 맞춤형 계획 수립까지 포괄하는 고지능 파트너로 진화하고 있습니다." }] }, { id: "tech-19", category: "tech", type: "article", isNew: true, title: "2차원 컴퓨터 그래픽스에는 어떤 종류가 있을까?", summary: "벡터 그래픽스와 래스터 이미지, 기하 함수 모델이 디지털 문서와 디스플레이 화면에서 어떻게 결합하고 제어되는지 기술적 분류를 살펴봅니다.", recommendationReason: "픽셀 기반 래스터와 수학적 수식 기반 벡터 그래픽의 차이를 명확히 이해하고 응용할 수 있습니다.", source: "한국어 위키백과 · 2차원 컴퓨터 그래픽스", duration: "5분 읽기", date: "위키백과", imageUrl: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=80", url: "https://ko.wikipedia.org/wiki/2%EC%B0%A8%EC%9B%90_%EC%BB%B4%ED%93%A8%ED%84%B0_%EA%B7%B8%EB%9E%98%ED%94%BD%EC%8A%A4", keyPoints: ["기하 모델(벡터 그래픽스)과 디지털 이미지(래스터 그래픽스)의 상호 보완적 결합.", "탁상출판, 설계, 웹 UI에서 3D 모델 대비 훨씬 가벼운 용량과 정밀한 제어력 제공.", "조판 텍스트, 수학적 함수, 래스터라이징 파이프라인의 조화로운 처리."], sections: [{ heading: "2차원 그래픽 모델의 핵심 구성 요소", body: "2차원 그래픽 모델은 기하 모델(벡터 그래픽스), 디지털 이미지(래스터 그래픽스), 조판될 텍스트(폰트, 크기, 색상, 좌표), 수학적 함수 및 방정식을 결합하여 구성됩니다." }, { heading: "직접적인 이미지 제어와 높은 효율성", body: "2차원 모델은 3차원 컴퓨터 그래픽스보다 이미지에 대한 직접적인 제어를 제공합니다. 탁상출판이나 인터페이스 설계 영역에서 2D 그래픽스 기술 기반 문서는 비트맵 이미지 대비 용량을 수천 배 이상 절감할 수 있습니다." }, { heading: "현대 디지털 인터페이스에서의 응용", body: "웹 표준 SVG와 캔버스 렌더링, 폰트 렌더링 엔진 등 현대 화면 디자인의 근간에는 정교한 2차원 벡터 연산과 래스터라이제이션 기술이 자리 잡고 있습니다." }] }, { id: "tech-20", category: "tech", type: "article", isNew: true, title: "영화 속 불가능한 장면은 어떻게 만들어질까?", summary: "현실에서 촬영하기 힘든 시각 효과를 창조하는 컴퓨터 그래픽스(CG)의 3D 모델링, 렌더링, 셰이더, GPU 하드웨어 파이프라인을 분석합니다.", recommendationReason: "영화와 게임의 환상적인 비주얼을 실제로 구축하는 렌더링 및 컴퓨터 애니메이션 공학을 배울 수 있습니다.", source: "한국어 위키백과 · 컴퓨터 그래픽스", duration: "6분 읽기", date: "위키백과", imageUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80", url: "https://ko.wikipedia.org/wiki/%EC%BB%B4%ED%93%A8%ED%84%B0_%EA%B7%B8%EB%9E%98%ED%94%BD%EC%8A%A4", keyPoints: ["컴퓨터를 이용해 영상과 예술을 창조하는 현대 디지털 영화 및 게임의 핵심 기술.", "기하 처리, 3차원 모델링, 광선 추적(Ray Tracing), 실시간 셰이더 렌더링 기술의 총체.", "전용 그래픽 프로세서(GPU) 설계와 계산과학이 이끄는 사실적 시각 효과 구현."], sections: [{ heading: "영상과 예술을 생성하는 컴퓨터 그래픽스", body: "컴퓨터 그래픽스는 컴퓨터를 이용하여 영상과 예술을 생성하는 작업을 다룹니다. 디지털 사진술, 영화, 비디오 게임, 디스플레이 하드웨어의 필수적인 핵심 기술입니다." }, { heading: "렌더링과 광선 추적의 과학", body: "스프라이트, 래스터, 3차원 모델링, 셰이더, 광선 추적(Ray Tracing) 등 복잡한 빛의 반사와 굴절을 물리 방정식으로 시뮬레이션하여 실사보다 더 사실적인 가상 영상을 만들어냅니다." }, { heading: "GPU 아키텍처와 시각화의 미래", body: "고성능 GPU 하드웨어와 계산 기하학, 이미지 처리 알고리즘의 발전에 힘입어 과거 수일이 걸리던 대규모 특수 효과 렌더링이 점차 실시간 인터랙티브 환경으로 진화하고 있습니다." }] }, { id: "tech-21", category: "tech", type: "article", isNew: true, title: "중화인민공화국의 인공지능 산업은 어떻게 등장하고 발전했을까?", summary: "경제 개혁 이후 과학기술 진흥 정책에서 출발해 국가적 의제와 인재 육성을 거쳐 글로벌 AI 강국으로 도약한 중국의 기술 산업 생태계를 살펴봅니다.", recommendationReason: "국가 차원의 전략적 로드맵과 R&D 투자가 기술 산업의 폭발적 성장을 견인한 과정을 분석합니다.", source: "한국어 위키백과 · 중화인민공화국의 인공지능 산업", duration: "5분 읽기", date: "위키백과", imageUrl: "https://images.unsplash.com/photo-1508873696983-2df5703bc225?w=800&auto=format&fit=crop&q=80", url: "https://ko.wikipedia.org/wiki/%EC%A4%91%ED%99%94%EC%9D%B8%EB%AF%BC%EA%B3%B5%ED%99%94%EA%B5%AD%EC%9D%98_%EC%9D%B8%EA%B3%B5%EC%A7%80%EB%8A%A5_%EC%82%B0%EC%97%85", keyPoints: ["1970년대 후반 과학기술을 주요 생산력으로 강조하며 시작된 기술 발전 토대.", "해외 유학파 과학자들의 초기 연구와 2006년 이후의 국가적 인공지능 개발 의제 수립.", "막대한 데이터 인프라와 산학 협력을 통해 선도적인 글로벌 AI 강국으로 부상한 과정."], sections: [{ heading: "과학기술 생산력 강조와 발전의 토대", body: "중국 AI 개발의 뿌리는 1970년대 후반 경제 개혁 이후 국가의 주요 생산력으로서 과학기술을 강조하면서 시작되었습니다. 초기에는 기술적 격차가 있었으나 인재 양성을 통해 격차를 좁혀갔습니다." }, { heading: "국가적 의제 설정과 집중 육성", body: "2006년부터 정부 차원의 중장기 인공지능 개발을 위한 국가적 로드맵을 꾸준히 발전시켜 왔으며, 정책적 지원과 방대한 내수 시장을 무대로 연구 개발을 가속화했습니다." }, { heading: "글로벌 AI 선도국으로의 도약", body: "딥러닝 알고리즘, 컴퓨터 비전, 자연어 처리 및 자율주행 영역에서 대규모 투자가 이어지며 오늘날 세계에서 가장 역동적인 AI 생태계 중 하나로 평가받고 있습니다." }] }, { id: "tech-22", category: "tech", type: "article", isNew: true, title: "빛이 닿지 않는 바닷속을 담는 수중사진의 기술", summary: "빛의 산란과 높은 수압을 극복하는 특수 하우징, 인공 광원 동기화, 해양 탐사 데이터 기록을 위한 수중 이미징 엔지니어링을 살펴봅니다.", recommendationReason: "극한의 수중 환경에서 빛과 데이터를 포착하는 특수 광학 기술과 촬영 장비의 원리를 배웁니다.", source: "한국어 위키백과 · 수중사진", duration: "5분 읽기", date: "위키백과", imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80", url: "https://ko.wikipedia.org/wiki/%EC%88%98%EC%A4%91%EC%82%AC%EC%A7%84", keyPoints: ["수중에서 빛의 굴절과 색 손실(적색광 감쇠)을 보정하는 돔 포트와 고광량 스트로브 기술.", "수심 수십 미터의 고압 환경에서 카메라를 안전하게 보호하는 정밀 방수 하우징 엔지니어링.", "해양 생태계 조사, 난파선 탐사, 수중 지형 측량 등 과학적 데이터 기록 수단으로의 확장."], sections: [{ heading: "수중 광학과 인공 광원의 동기화", body: "물속에서는 빛이 공기 중에서보다 800배 빠르게 흡수되며, 특히 붉은색 파장이 먼저 사라집니다. 성공적인 수중 이미징은 돔 포트로 화각 왜곡을 잡고, 고출력 수중 플래시(스트로브)를 셔터와 정밀 동기화하여 피사체 본연의 생생한 색상을 복원합니다." }, { heading: "극한 압력을 견디는 정밀 방수 하우징", body: "깊은 바다는 수압이 매우 높아 일반 전자 기기가 즉시 파손됩니다. 고강도 알루미늄 합금 하우징과 이중 O-링 밀폐 기술, 수중 부력 밸런싱 시스템을 통해 다이버가 수심 수십 미터 아래에서도 카메라의 모든 다이얼과 센서를 정밀 조작할 수 있습니다." }, { heading: "예술을 넘어 해양 데이터 기록으로", body: "수중 사진은 감성적인 예술 창작일 뿐 아니라 해양 생물 다양성 모니터링, 산호초 백화 현상 추적, 수중 문화재 3D 측량 등 해양 과학 데이터를 수집하고 기록하는 필수적인 도구로 널리 쓰이고 있습니다." }] }, { id: "study-1", category: "study", type: "video", title: "내 안의 가능성을 끌어내는 메타인지의 비밀 | 리사 손 교수", summary: "단순 암기 대신 내가 무엇을 알고 모르는지 직시하고 실수를 두려워하지 않는 인지과학적 성장 학습법.", source: "YouTube · 세바시 Sebasi Talk", duration: "15:20", date: "인기 강연", imageUrl: "https://i.ytimg.com/vi/9vjJC7TwA3Y/hqdefault.jpg", youtubeId: "9vjJC7TwA3Y", url: "https://www.youtube.com/watch?v=9vjJC7TwA3Y" }, { id: "study-2", category: "study", type: "article", title: "읽고 잊지 않는 생각의 아카이빙: 나만의 두 번째 뇌를 만드는 메모 독서법", summary: "읽고 휘발되는 파편적 정보를 연결하여 나만의 사고 체계로 축적하는 현대적 노트 필기와 메모 독서 체계.", source: "브런치스토리 · 마인드와칭 (메모 독서법)", duration: "6분 읽기", date: "어제", imageUrl: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&auto=format&fit=crop&q=80", url: "https://brunch.co.kr/@mindwatching", keyPoints: ["단순히 베껴 쓰는 필기는 뇌의 인지 부하를 줄여 장기 기억으로 전환되지 못하고 휘발됩니다.", "코넬식 노트는 필기 영역, 단서 영역, 요약 영역의 3분할 구조로 능동적 인출(Active Recall)을 유도합니다.", "제텔카스텐(Zettelkasten)은 지식을 원자 단위 메모로 쪼개고 하이퍼링크처럼 연결하는 창의적 지식 네트워크입니다."], sections: [{ heading: "필기의 함정: 수동적 기록 vs 능동적 재구성", body: '강의나 책의 내용을 그대로 받아 적는 행위는 "공부를 많이 했다"는 착각을 줍니다. 하지만 인지과학 연구에 따르면, 정보가 뇌에 새겨지려면 자신의 어휘로 재구성하고 요약하는 인출 과정이 반드시 수반되어야 합니다.' }, { heading: "코넬 노트 시스템: 한 장으로 끝내는 체계화", body: "코넬 대학교의 월터 포크 교수가 고안한 이 시스템은 종이를 세 칸으로 나눕니다. 오른쪽 넓은 칸에 핵심 강의를 기록하고, 왼쪽 좁은 칸에는 수업 직후 복습용 핵심 키워드와 질문을 작성합니다. 맨 아래쪽에는 전체 내용을 2~3문장으로 압축하는 요약 영역을 둡니다. 나중에 복습할 때는 오른쪽을 가리고 왼쪽 질문만 보며 스스로 답하는 훈련이 가능합니다." }, { heading: "제텔카스텐: 파편화된 지식의 연결망", body: "사회학자 니클라스 루만은 평생 9만 장의 인덱스 카드를 연결해 70여 권의 책을 집필했습니다. 한 장의 카드에는 단 하나의 생각(원자성)만 담고, 관련된 다른 카드 번호를 상호 참조로 링크합니다. 노션이나 옵시디언 같은 현대 마크다운 도구 역시 이 제텔카스텐의 양방향 링크 원리를 바탕으로 나만의 두 번째 뇌를 구축할 수 있게 돕습니다." }] }, { id: "study-5", category: "study", type: "video", title: "원달러 1,384원: 격해지는 글로벌 환율 전쟁과 경제 흐름 읽기", summary: "기준금리 인상과 환율 변동이 내 월급과 자산에 미치는 영향을 거시경제 흐름으로 알기 쉽게 해설.", source: "YouTube · 슈카월드 Syuka World", duration: "19:40", date: "3일 전", imageUrl: "https://i.ytimg.com/vi/ZIx30v8J0Ro/hqdefault.jpg", youtubeId: "ZIx30v8J0Ro", url: "https://www.youtube.com/watch?v=ZIx30v8J0Ro" }, { id: "study-4", category: "study", type: "article", title: "뽀모도로 타이머 최적화: 번아웃 없이 하루 4시간 초몰입 유지하는 법", summary: "25분 집중-5분 휴식 원리를 개인 인지 주기와 피로도에 맞추어 커스텀하는 실전 생산성 루틴.", source: "Pomofocus · 타임블로킹 가이드", duration: "5분 읽기", date: "1주 전", imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80", url: "https://pomofocus.io", keyPoints: ["뽀모도로 테크닉은 25분 집중과 5분 완전 휴식을 한 세트로 진행하여 뇌의 인지 피로를 차단합니다.", "휴식 시간 5분 동안 스마트폰이나 SNS를 확인하면 뇌가 쉬지 못해 다음 세션의 집중력이 반토막 납니다.", "개인 업무 성격에 맞춰 50분 집중-10분 휴식 등 유연한 스냅 주기로 커스텀하는 것이 성공의 열쇠입니다."], sections: [{ heading: "인간의 집중력 한계와 시간 조각화(Timeboxing)", body: '집중력은 무한정 쓸 수 있는 자원이 아니라 스마트폰 배터리처럼 소모되는 인지 에너지입니다. "오늘 4시간 동안 공부해야지"라는 막연한 목표는 시작 전부터 뇌에 저항감을 주어 딴짓을 유발합니다. 뽀모도로 기법은 시간 단위를 25분이라는 짧은 조각으로 분할해 시작 허들을 극단적으로 낮춥니다.' }, { heading: "휴식 시간의 품질이 다음 세션을 결정한다", body: "가장 흔한 실수는 5분의 쉬는 시간에 인스타그램이나 유튜브 쇼츠를 켜는 것입니다. 화면을 보며 자극적인 도파민을 소비하면 뇌의 기본모드신경망(DMN)이 활성화되지 못해 이전 25분간 습득한 지식을 정리할 수 없습니다. 5분 동안은 자리에서 일어나 스트레칭을 하거나 물을 마시며 뇌를 비워야 합니다." }, { heading: "실무자를 위한 뽀모도로 고도화 팁", body: "코딩이나 글쓰기처럼 딥워크가 필요한 작업은 25분이 너무 짧을 수 있습니다. 이럴 때는 50분 집중-10분 휴식 주기로 확장하세요. 중요한 것은 타이머가 울리면 작업 흐름을 끊고 반드시 휴식 규칙을 엄격히 지키는 것입니다." }] }, { id: "study-6", category: "study", type: "article", title: "인지심리학 기반 공부법: 벼락치기 대신 인출 연습과 간격 반복의 과학", summary: "망각 시점에 맞춰 자동으로 복습 주기를 계산해주는 과학적 플래시카드 복습 시스템 원리.", source: "동아비즈니스리뷰 (DBR) · 인지과학 리포트", duration: "7분 읽기", date: "2일 전", imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80", url: "https://dbr.donga.com/article/view/1202/article_no/8172", keyPoints: ["에빙하우스의 망각 곡선에 따르면 학습 후 하루만 지나도 기억의 약 70%가 소실됩니다.", "망각 직전의 타이밍에 복습을 배치하면 뇌는 해당 정보를 생존에 필수적인 영구 기억으로 분류합니다.", "Anki나 SuperMemo의 SM-2 알고리즘을 활용하면 최소한의 복습 횟수로 최대의 기억 파지를 달성할 수 있습니다."], sections: [{ heading: "벼락치기가 시험 후 망각되는 이유", body: "시험 전날 밤을 새워 수백 페이지를 머릿속에 밀어 넣으면 단기 기억 저장소인 해마에는 머무를 수 있지만, 장기 기억을 관장하는 대뇌 피질로는 이동하지 못합니다. 벼락치기는 시험 당일 아침에는 통할지 몰라도, 일주일만 지나면 거의 모든 지식이 백지화되는 비효율적인 방식입니다." }, { heading: "간격 반복 알고리즘: 기억의 감쇠를 거스르는 기술", body: '간격 반복(Spaced Repetition System)은 정보를 망각하기 바로 직전에 복습 신호를 보내는 방식입니다. 첫 복습은 1일 뒤, 두 번째는 3일 뒤, 세 번째는 7일 뒤, 네 번째는 16일 뒤처럼 간격을 지수 함수적으로 늘려갑니다. 이때 기억을 떠올리려고 애쓰는 "인출 노력"이 강할수록 시냅스 연결이 물리적으로 강화됩니다.' }, { heading: "디지털 플래시카드로 나만의 망각 방어선 구축하기", body: "Anki 같은 도구는 사용자가 문제의 난이도를 평가할 때마다 다음 출제일을 수학적으로 재계산해 줍니다. 이미 잘 아는 문제는 한 달 뒤로 미루고, 자주 헷갈리는 문제만 집중적으로 매일 출제되므로 공부 시간을 최대 80%까지 절약할 수 있습니다." }] }, { id: "study-8", category: "study", type: "article", title: "파인만 학습 기법: 복잡한 지식을 가장 단순한 언어로 설명하는 4단계", summary: "복잡한 전문 지식을 직관적인 비유와 쉬운 언어로 재구성하여 지적 빈틈을 메우는 4단계 학습법.", source: "Farnam Street (fs.blog) · 멘탈 모델", duration: "5분 읽기", date: "3일 전", imageUrl: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&auto=format&fit=crop&q=80", url: "https://fs.blog/the-feynman-technique/", keyPoints: ["노벨 물리학상 수상자 리처드 파인만이 고안한 최고의 메타인지 자가 점검 학습법입니다.", "어려운 전문 용어와 수식의 장막 뒤에 숨지 않고, 초등학생도 이해할 수 있는 쉬운 일상 언어로 설명합니다.", "설명이 막히는 지점이 바로 내가 안다고 착각했던 지적 빈틈이며, 이 부분을 원전에서 집중 보완합니다."], sections: [{ heading: "지식의 두 가지 유형: 이름만 아는 것 vs 원리를 아는 것", body: '리처드 파인만은 "새의 이름을 안다고 해서 그 새에 대해 아는 것은 아니다"라고 강조했습니다. 전문 용어나 학술적 단어를 외워 읊는 것은 지식이 아니라 단순한 명명에 불과합니다. 진짜 이해는 복잡한 개념의 인과관계를 가장 기초적인 직관으로 풀어낼 수 있을 때 비로소 증명됩니다.' }, { heading: "파인만 기법 4단계 실천 가이드", body: "1단계: 백지 상단에 배우고자 하는 주제를 적습니다. 2단계: 가상의 8세 아이에게 가르친다고 생각하고 쉬운 단어와 친근한 비유로 설명문을 적어 내려갑니다. 3단계: 설명이 막히거나 전문 용어 없이는 문장이 이어지지 않는 지점을 찾아냅니다. 4단계: 교재나 원문으로 돌아가 그 구멍을 메우고 비유를 정교하게 다듬습니다." }, { heading: "비유의 힘: 추상을 구체로 바꾸기", body: '예를 들어 "컴퓨터 RAM과 SSD의 차이"를 설명할 때, 버스 대역폭이나 플래시 메모리 구조를 언급하는 대신 "공부하는 책상 위 공간(RAM)과 뒤편 책꽂이(SSD)"로 비유하면 누구나 직관적으로 깨닫습니다. 비유를 만드는 과정 자체가 뇌 속 지식의 입체적 지도를 완성합니다.' }] }, { id: "study-9", category: "study", type: "article", isNew: true, title: "나에게는 어떤 공부방법이 맞을까?", summary: "자신의 학습 수준에 맞는 기초·기본·발전 강좌를 선택하고 학습 목표를 설정해 자기주도학습을 실천하는 방법을 살펴봅니다.", recommendationReason: "공부에 관심이 있는 사용자가 자신의 수준에 맞는 학습 계획을 세우는 데 도움이 되는 자료입니다.", source: "EBSi", duration: "5분 읽기", date: "학습 가이드", imageUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80", url: "https://www.ebsi.co.kr/ebs/pot/poth/RetrieveHelpBgnGud.ebs", keyPoints: ["자신의 현재 학습 수준(기초·기본·발전)을 객관적으로 진단하고 무리하지 않는 현실적인 단계별 강좌를 선택합니다.", "목표를 세분화하여 매일 실천 가능한 학습 루틴을 만들고 자기주도학습 습관을 형성합니다.", "EBSi 수준별 맞춤 커리큘럼을 활용해 취약한 단원을 집중 보완하고 성취감을 단계적으로 쌓아갑니다."], sections: [{ heading: "내 수준에 맞는 강좌 선택이 첫걸음", body: "많은 학생들이 자신의 실력보다 앞선 고난도 강의를 선택했다가 중도 포기하곤 합니다. 기초가 부족할 때는 기초·기본 강좌를 통해 개념을 탄탄히 다진 후 발전 강좌로 넘어가는 단계적 접근이 효과적입니다." }, { heading: "자기주도학습을 이끄는 학습 목표 설정법", body: '단순히 "오늘 공부 열심히 하기" 대신 "수학 3단원 개념 정리 2강 수강 및 예제 10문제 풀기"처럼 구체적이고 측정 가능한 일일 목표를 세우면 집중력과 실천율이 크게 향상됩니다.' }, { heading: "EBSi 학습 로드맵과 피드백 활용", body: "강좌별 맛보기 강의와 진단 테스트를 통해 나에게 맞는 선생님과 커리큘럼을 찾아보고, 완강 후 오답 노트를 복습하며 취약점을 보완하는 선순환을 만들어보세요." }] }, { id: "study-10", category: "study", type: "article", isNew: true, title: "영어 단어 공부, 더 쉽게 해볼까?", summary: "좋아하는 영어 영상에서 AI로 핵심 단어를 찾고 뜻·영어 풀이·예문을 확인한 뒤, 수준에 맞춰 단어 카드와 퀴즈로 반복 학습하는 방법을 알아봅니다.", recommendationReason: "영어 공부에 관심 있는 사용자가 친숙한 영상과 AI를 활용해 어휘 공부를 시작할 수 있습니다.", source: "KSW 뉴스", duration: "4분 읽기", date: "어휘 학습", imageUrl: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&auto=format&fit=crop&q=80", url: "https://www.ksw-news.com/news/articleView.html?idxno=3032912", keyPoints: ["좋아하는 애니메이션이나 유튜브 영상의 자막에서 AI가 자주 쓰이는 핵심 어휘를 자동으로 추출합니다.", "단어의 사전적 뜻뿐만 아니라 영상 속 실제 문맥 예문과 영영 풀이를 함께 익혀 자연스러운 쓰임새를 체득합니다.", "수준별 플래시 단어 카드와 스피드 퀴즈를 결합해 지루하지 않게 장기 기억으로 전환합니다."], sections: [{ heading: "영상 콘텐츠와 AI가 만난 단어 학습", body: "두꺼운 단어장을 기계적으로 암기하는 방식은 쉽게 피로해집니다. 내가 좋아하는 영어 영상에서 실제로 원어민이 사용하는 대화 속 단어를 AI로 추출하면 학습 동기가 자연스럽게 유지됩니다." }, { heading: "문맥으로 기억하는 3단계 어휘 확장", body: "AI가 단어의 핵심 의미, 영영 풀이, 실제 영상 내 문장을 한눈에 제공하여 단편적인 1:1 번역 암기가 아닌 상황별 뉘앙스를 직관적으로 이해할 수 있습니다." }, { heading: "단어 카드와 인터랙티브 퀴즈로 복습", body: "망각 곡선에 맞춘 복습 알림과 퀴즈 게임을 통해 방금 익힌 단어를 잊어버리기 전에 반복 노출하여 장기 기억으로 확실하게 정착시킵니다." }] }, { id: "study-11", category: "study", type: "article", isNew: true, title: "갈릴레오 갈릴레이는 데이터를 어떻게 활용할까?", summary: "자체 개량한 망원경으로 목성의 4대 위성과 달의 표면을 관측하고, 이 경험적 수량 자료로 코페르니쿠스의 지동설을 과학적으로 입증한 관측천문학의 정수를 다룹니다.", recommendationReason: "편견에 맞서 실제 관측 데이터와 수학적 수량 분석으로 진리를 증명한 과학적 탐구 정신을 배웁니다.", source: "한국어 위키백과 · 갈릴레오 갈릴레이", duration: "6분 읽기", date: "위키백과", imageUrl: "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=800&auto=format&fit=crop&q=80", url: "https://ko.wikipedia.org/wiki/%EA%B0%88%EB%A6%B4%EB%A0%88%EC%98%A4_%EA%B0%88%EB%A6%B4%EB%A0%88%EC%9D%B4", keyPoints: ["경험적 사실의 수량적 분석과 보편적 수학 법칙을 결합한 근대 과학 연구 방법의 확립.", "1609년 직접 망원경을 개량하여 목성의 4대 위성, 달의 반점, 태양 흑점을 정밀 관측.", "확보된 관측 데이터를 논리적 근거로 삼아 당시 통념이었던 천동설을 반박하고 지동설을 입증."], sections: [{ heading: "수량적 분석과 근대 과학 방법론의 확립", body: "갈릴레오의 최대 공적은 과학적 연구 방법으로서 보편적 수학적 법칙과 경험적 사실의 수량적 분석을 확립한 점에 있습니다. 추상적 사변이 아닌 데이터 기반 탐구의 시대를 열었습니다." }, { heading: "망원경 개량과 천체 관측 데이터의 확보", body: "1609년 망원경을 개량해 천체 관측에 응용함으로써 목성의 위성들, 달의 표면 분화구, 태양의 흑점 등을 발견하고 이를 정밀하게 기록했습니다." }, { heading: "데이터를 통한 지동설의 과학적 입증", body: "목성 주위를 도는 위성들의 관측 자료를 결정적 증거로 삼아 지구 중심설(천동설)에 맞서 코페르니쿠스의 태양 중심설(지동설)이 정당함을 입증하는 저술을 펴냈습니다." }] }, { id: "study-12", category: "study", type: "article", isNew: true, title: "왜 어떤 기억은 오래 남고 어떤 기억은 사라질까?", summary: "감각 정보가 단기 기억과 작업 기억을 거쳐 장기 기억으로 고착되거나 잊혀지는 인간의 인지적 기억 메커니즘을 탐구합니다.", recommendationReason: "인간의 뇌가 정보를 선별하고 장기 기억으로 정착시키는 인지 심리학의 원리를 배웁니다.", source: "한국어 위키백과 · 기억", duration: "5분 읽기", date: "위키백과", imageUrl: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800&auto=format&fit=crop&q=80", url: "https://ko.wikipedia.org/wiki/%EA%B8%B0%EC%96%B5", keyPoints: ["모든 감각 기관의 경험과 개념, 규칙을 현재 상황에 맞춰 인출하는 필수 인지 과정.", "즉각적인 행동 완료 후 불필요한 정보는 소멸시키는 단기/작업 기억의 필터링 기능.", "반복 부호화와 의미 부여를 통해 뇌 신경망에 영구 보존되는 장기 기억의 원리."], sections: [{ heading: "인지 과정으로서의 기억과 자아 정체성", body: "기억은 모든 감각 경험과 논리적 해석, 개념, 가치를 보존하고 인출하는 필수 인지 과정입니다. 과거 경험을 바탕으로 현재를 분석하고 미래를 예측하며 자아 정체성을 유지하게 돕습니다." }, { heading: "단기 기억의 망각과 효율적 정보 선별", body: "단기 기억이나 작업 기억은 지금의 행동이 완료된 뒤 크게 의미가 없으면 짧은 시간 뒤에 자연스럽게 잊혀집니다. 이는 뇌가 과도한 정보 부하로 과열되는 것을 막는 중요한 적응 메커니즘입니다." }, { heading: "장기 기억으로의 고착화와 학습의 원리", body: "생존에 중요하거나 깊은 정서적 교감이 동반된 정보, 혹은 반복적인 인출 훈련을 거친 정보는 여러 뇌 신경 작용을 통해 장기 기억으로 견고하게 저장됩니다." }] }, { id: "study-13", category: "study", type: "article", isNew: true, title: "별과 행성의 비밀은 어떻게 밝혀질까?", summary: "빛과 전파를 통해 물리 자료를 수집하는 관측 천문학과, 컴퓨터 수치 시뮬레이션으로 우주 모형을 세우는 이론 천문학의 탐구 방식을 분석합니다.", recommendationReason: "관측 데이터와 컴퓨터 모형 분석이 어떻게 거대한 우주의 비밀을 풀어내는지 과학적 사고를 넓혀줍니다.", source: "한국어 위키백과 · 천문학", duration: "5분 읽기", date: "위키백과", imageUrl: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&auto=format&fit=crop&q=80", url: "https://ko.wikipedia.org/wiki/%EC%B2%9C%EB%AC%B8%ED%95%99", keyPoints: ["관측 데이터를 수집하는 관측 천문학과 컴퓨터 시뮬레이션 모형을 세우는 이론 천문학의 상호작용.", "일반상대성론과 중력 방정식을 이용한 천체 움직임의 정밀 물리 해석.", "초거대 망원경과 우주 망원경이 포착한 빛의 스펙트럼 분석을 통한 우주 진화 추적."], sections: [{ heading: "관측 천문학과 이론 천문학의 양대 축", body: "현대 천문학은 관측 분야와 이론 분야로 체계화되어 있습니다. 관측 천문학은 천체에 대한 자료를 얻고 물리적으로 분석하는 데 초점을 두며, 이론 천문학은 현상들을 컴퓨터나 해석적 방법으로 설명하는 모형을 세웁니다." }, { heading: "중력 방정식과 컴퓨터 모형 시뮬레이션", body: "천체의 움직임에서 가장 비중이 큰 힘은 중력이므로 아인슈타인의 일반상대론을 적극적으로 이용합니다. 슈퍼컴퓨터를 이용한 수치 모형을 통해 별의 탄생과 은하 충돌 과정을 가상으로 재현합니다." }, { heading: "다파장 관측을 통한 우주의 기원 탐구", body: "가시광선뿐 아니라 전파, 적외선, X선 등 우주에서 날아오는 다양한 파장의 신호를 분석함으로써 암흑 물질과 행성계의 기원을 밝혀내고 있습니다." }] }, { id: "study-14", category: "study", type: "article", isNew: true, title: "불쾌한 골짜기는 어떻게 등장하고 발전했을까?", summary: "로봇이나 가상 캐릭터가 사람과 너무 흡사해질 때 발생하는 기괴함과 반발감을 규명한 모리 마사히로의 로봇공학 이론과 심리학적 계보를 살펴봅니다.", recommendationReason: "심리학과 공학이 교차하는 지점에서 인간의 인식과 인공물의 상호작용을 깊이 있게 탐구합니다.", source: "한국어 위키백과 · 불쾌한 골짜기", duration: "5분 읽기", date: "위키백과", imageUrl: "https://images.unsplash.com/photo-1534972195531-a756b1126975?w=800&auto=format&fit=crop&q=80", url: "https://ko.wikipedia.org/wiki/%EB%B6%88%EC%BE%8C%ED%95%9C_%EA%B3%A8%EC%A7%9C%EA%B8%B0", keyPoints: ["로봇의 인간 유사도가 극도로 높아질 때 호감도가 급락하며 거부감으로 변하는 심리 현상.", "1906년 옌치의 심리학 논문과 프로이트의 무의식 연구에서 출발한 이론적 뿌리.", "1970년 모리 마사히로의 정립 이후 휴머노이드 로봇과 3D 애니메이션 캐릭터 제작의 핵심 기준 확립."], sections: [{ heading: "모리 마사히로의 이론과 호감도의 급락", body: "로봇공학자 모리 마사히로의 이론에 따르면, 로봇이 점점 더 사람의 모습과 흡사해질수록 인간이 느끼는 호감도가 증가하다가, 특정 임계점에 도달하면 갑자기 강한 거부감과 오싹함으로 바뀌게 됩니다." }, { heading: "섬뜩함의 심리학적 기원", body: "이 개념은 1906년 에른스트 옌치의 논문 〈섬뜩함의 심리학에 관하여〉와 지그문트 프로이트의 연구에 뿌리를 두고 있습니다. 친숙한 대상이 미묘하게 비틀릴 때 인간 뇌가 느끼는 위험 신호와 밀접합니다." }, { heading: "현대 CG 애니메이션과 로봇 설계의 과제", body: "불쾌한 골짜기는 폴라 익스프레스와 같은 3D 그래픽이나 사실적 휴머노이드 안드로이드 제작 시 시각적 어색함을 극복하기 위해 반드시 고려해야 하는 중요한 공학적·인지적 기준이 되었습니다." }] }, { id: "study-15", category: "study", type: "article", isNew: true, title: "퍼즐을 풀 때 머릿속에서 일어나는 일", summary: "단서를 조합하고 패턴을 인식하며 논리적 연역과 귀납을 반복하는 퍼즐 풀이 과정에서 일어나는 인지 전략과 문제 해결 사고력을 분석합니다.", recommendationReason: "지적 유희인 퍼즐을 풀 때 활성화되는 패턴 인식과 논리 추론의 인지적 메커니즘을 배웁니다.", source: "한국어 위키백과 · 퍼즐", duration: "5분 읽기", date: "위키백과", imageUrl: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&auto=format&fit=crop&q=80", url: "https://ko.wikipedia.org/wiki/%ED%8D%BC%EC%A6%90", keyPoints: ["사람의 창의성과 논리적 사고력을 시험하고 조각을 체계적으로 조합하는 지적 활동.", "반복적인 패턴 인식과 일정한 순서 규칙(알고리즘) 준수를 요구하는 문제 해결 전략.", "단순한 여가 오락을 넘어 심각한 수학적·논리적 가설 검증과 인지 능력 단련에 기여."], sections: [{ heading: "지적 탐구와 창의성을 시험하는 퍼즐", body: "퍼즐은 사람의 창의성이나 지식을 시험하는 게임, 문제, 또는 장난감입니다. 퍼즐 해결자는 숨겨진 해답을 찾기 위해 조각들을 논리적인 방식으로 조합하거나 분해하는 고차원 사고를 발휘합니다." }, { heading: "패턴 인식과 순서 준수의 인지 전략", body: "퍼즐의 해답은 종종 패턴 인식과 특정 종류의 순서 준수를 필요로 합니다. 뇌는 과거에 학습한 규칙들을 조합해 새로운 가설을 세우고 오류를 수정하는 피드백 루프를 반복합니다." }, { heading: "수학과 논리학으로 이어지는 문제 해결력", body: "퍼즐은 일상의 가벼운 오락으로 즐겨지지만, 동시에 심각한 수학적 난제나 컴퓨터 과학의 알고리즘 최적화 연구에서 비롯되기도 하며 인간의 분석적 사고력을 단련하는 훌륭한 교재가 됩니다." }] }, { id: "study-16", category: "study", type: "article", isNew: true, title: "날것의 재료가 음식이 되는 마법: 조리의 과학", summary: "단백질 변성, 전분의 호화, 마이야르 반응 등 가열과 조리를 통해 식재료의 영양 흡수율이 높아지고 풍미가 폭발하는 분자 과학의 원리를 알아봅니다.", recommendationReason: "인류의 문명을 바꾼 불의 발견과 음식 조리 과정에 숨겨진 물리·화학적 메커니즘을 배웁니다.", source: "한국어 위키백과 · 요리", duration: "5분 읽기", date: "위키백과", imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80", url: "https://ko.wikipedia.org/wiki/%EC%9A%94%EB%A6%AC", keyPoints: ["열과 산, 효소를 통해 단백질과 탄수화물의 화학 구조를 변형시키는 식품 과학의 기초.", "소화 흡수율을 극대화하고 식물 속 독성을 중화하여 뇌 진화를 이끈 조리의 인류학적 의의.", "아미노산과 당이 열을 만나 수백 가지 복합 향기를 뿜어내는 마이야르(Maillard) 반응의 원리."], sections: [{ heading: "단백질 변성과 전분의 호화 메커니즘", body: "단단하고 질긴 날고기에 열을 가하면 꼬여 있던 단백질 분자가 풀리며 부드러워지고, 곡물의 빽빽한 전분 구조는 수분을 머금고 팽창하여 젤 상태(호화)가 됩니다. 이 과정을 통해 우리 몸은 적은 소화 에너지로도 영양분을 극대화하여 흡수할 수 있습니다." }, { heading: "독성 중화와 인류 진화의 기폭제", body: "야생 식물과 버섯, 뿌리채소에 존재하는 천연 독소와 유해 세균은 가열 조리를 통해 파괴되거나 중화됩니다. 조리된 음식의 높은 에너지 효율은 인류가 소화기관을 줄이고 거대한 뇌를 발달시키는 결정적인 생물학적 계기가 되었습니다." }, { heading: "풍미의 정점, 마이야르 반응과 캐러멜화", body: "단백질 속 아미노산과 환원당이 140도 이상의 고열에서 반응하는 마이야르 반응은 구운 고기나 빵 표면의 노릇한 갈색과 함께 수백 가지 고소한 아로마 화합물을 만들어냅니다. 요리는 재료를 분자 단위에서 재구성하는 가장 일상적인 응용 화학입니다." }] }, { id: "culture-3", category: "culture", type: "video", title: "Relaxing Jazz Piano Radio: 몰입과 휴식을 위한 24/7 슬로우 재즈", summary: "차분한 피아노 선율과 따뜻한 브라스 사운드로 일상에 감성적인 휴식을 더해주는 재즈 라이브 세션.", source: "YouTube · Relaxing Jazz Piano", duration: "라이브 스트리밍", date: "실시간", imageUrl: "https://i.ytimg.com/vi/Dx5qFachd3A/hqdefault.jpg", youtubeId: "Dx5qFachd3A", url: "https://www.youtube.com/watch?v=Dx5qFachd3A" }, { id: "culture-2", category: "culture", type: "article", title: "현대미술 전시가 낯설 때: 도슨트 없이도 작품의 개념과 물성을 읽는 법", summary: "전시 서문 읽는 순서부터 작가의 재료 선택 의도와 시대 배경을 포착하는 현대미술 입문 가이드.", source: "월간미술 (Monthly Art) · 전시 리뷰 & 비평", duration: "6분 읽기", date: "3일 전", imageUrl: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80", url: "https://monthlyart.com", keyPoints: ["현대미술은 시각적 아름다움을 감상하는 대상이 아니라 작가가 던지는 질문과 개념을 탐색하는 대화입니다.", "전시장에 들어서면 전시장 서문과 작가의 약력을 먼저 읽어 시대적 맥락을 파악하세요.", "작품 캡션에 적힌 재료(Medium)를 유심히 관찰하면 작가가 표현하고자 한 물성의 메시지가 보입니다."], sections: [{ heading: "왜 현대미술은 난해하게 느껴질까?", body: '르네상스나 인상주의 회화는 눈에 보이는 대상을 재현했기 때문에 직관적 감상이 가능했습니다. 하지만 20세기 마르셀 뒤샹의 "샘(변기)" 이후 현대미술은 시각적 쾌락을 넘어 "미술이란 무엇인가?"라는 개념 미술의 영역으로 진화했습니다. 형태보다 그 작품이 놓인 맥락과 작가의 문제의식이 핵심이 되었습니다.' }, { heading: "스마트폰을 내리고 1분간 응시하기 (Slow Looking)", body: "미술관 관람객이 작품 하나를 바라보는 평균 시간은 15초 남짓이며, 그마저도 사진 촬영에 쓰입니다. 마음에 드는 작품 앞에 서서 최소 1분간 눈을 떼지 마세요. 붓 터치의 두께, 캔버스의 질감, 빛의 반사, 설치된 공간의 여백을 온전히 감각할 때 도록이나 화면에서는 결코 느낄 수 없는 울림이 다가옵니다." }, { heading: '캡션 속 "재료(Medium)"가 건네는 힌트', body: "작품 옆 작은 명판에는 제목뿐 아니라 재료가 적혀 있습니다. 전통적인 캔버스에 유채 대신 왜 버려진 플라스틱, 녹슨 철사, 흙, 유기물을 사용했을까요? 재료는 단순한 수단이 아니라 작가가 전하고자 하는 시대비판이나 생명성, 덧없음의 상징입니다." }] }, { id: "culture-4", category: "culture", type: "article", title: '쇼츠와 릴스의 시대, 왜 2030은 "텍스트 힙(Text Hip)"에 열광하는가', summary: "즉각적인 숏폼 자극을 넘어 깊은 호흡의 사유와 물성을 가진 서가를 찾는 2030 세대의 독서 문화 분석.", source: "매거진한경 · 트렌드 인사이트", duration: "7분 읽기", date: "어제", imageUrl: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&auto=format&fit=crop&q=80", url: "https://magazine.hankyung.com/business/article/202404176251b", keyPoints: ["알고리즘이 끝없이 밀어 넣는 15초 쇼츠의 과도한 도파민 자극에 피로를 느낀 세대의 문화적 반작용입니다.", "종이책을 읽고 밑줄을 긋는 행위가 개성적이고 지적인 라이프스타일의 상징(Text Hip)으로 떠올랐습니다.", "대형 체인 서점의 베스트셀러 획일화를 벗어나 서점주의 철학이 깃든 독립서점이 새로운 쉼터가 되고 있습니다."], sections: [{ heading: "숏폼의 시대, 왜 역설적으로 긴 글을 찾는가?", body: '하루에도 수백 편의 숏폼 영상을 넘겨보지만, 밤이 되면 머릿속에 남는 것은 공허함과 인지적 산만함뿐입니다. 즉각적인 보상에 지친 젊은 층을 중심으로 깊은 호흡으로 사유할 수 있는 긴 텍스트와 책장을 넘기는 아날로그 촉각에 대한 갈망이 "텍스트 힙"이라는 신조어로 발현되었습니다.' }, { heading: "물성(Tactile)을 가진 오브제로서의 책", body: "디지털 전자책이나 웹 아티클이 주지 못하는 종이의 무게감, 표지의 타이포그래피, 손때 묻은 책갈피는 그 자체로 하나의 개인적 취향을 대변하는 오브제가 됩니다. 북카페나 북클럽에서 조용히 책을 읽는 시간은 디지털 디톡스와 멘탈 케어의 리추얼로 자리 잡았습니다." }, { heading: "독립서점이 제안하는 큐레이션의 미학", body: "알고리즘 추천은 사용자가 이미 좋아하는 것의 복제품만 추천하여 확증 편향의 필터 버블을 만듭니다. 반면 골목길 독립서점의 책장에는 서점주의 독특한 안목으로 엄선된 시집, 인문 에세이, 독립출판물이 꽂혀 있어 뜻밖의 우연한 발견(Serendipity)의 기쁨을 선사합니다." }] }, { id: "culture-6", category: "culture", type: "article", title: "공연장 좌석 선택부터 인터미션 에티켓까지: 뮤지컬 첫 관람 가이드", summary: "무대 예술의 현장감을 오롯이 즐기기 위한 극장 구조 이해와 초심자 예매 팁 총정리.", source: "플레이DB (PlayDB) · 인터파크 공연 매거진", duration: "5분 읽기", date: "2일 전", imageUrl: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&auto=format&fit=crop&q=80", url: "http://www.playdb.co.kr/magazine/", keyPoints: ["대극장은 1층 중블(중앙 블록) 5~10열이 배우의 표정 연기와 전체 무대 연출의 최적 밸런스 구역입니다.", "오페라글라스는 2층이나 3층 가성비 좌석에서도 배우의 미세한 감정선을 포착할 수 있는 필수 아이템입니다.", "공연 중에는 수그리(등받이에 등을 떼고 앞으로 숙이는 행위) 금지와 커튼콜 촬영 허용 여부 숙지가 기본 에티켓입니다."], sections: [{ heading: "극장 좌석 배치도의 비밀: 음향과 시야의 골든존", body: "뮤지컬 티켓팅 시 무조건 맨 앞자리가 최고는 아닙니다. 1~2열은 배우의 숨소리와 땀방울까지 보이지만 무대 바닥의 앙상블 대열이나 조명 연출 전체를 조망하기 어렵고 목에 피로가 옵니다. 무대 전체의 웅장한 세트와 배우의 연기를 고루 즐기려면 1층 6~12열 중앙 블록이 음향과 시야 모두에서 최상의 감동을 선사합니다." }, { heading: "인터미션 20분 현명하게 활용하기", body: "1막과 2막 사이 주어지는 20분 내외의 인터미션은 화장실 대기 줄이 매우 길어집니다. 1막이 끝나자마자 화장실을 이용하거나 프로그램 북을 미리 둘러보는 것이 좋습니다. 공연의 여운을 음미하며 2막의 클라이맥스를 기대하는 설렘도 뮤지컬만의 묘미입니다." }, { heading: "서로의 몰입을 지키는 관람 에티켓", body: '스마트폰 전원을 비행기 탑승 모드가 아닌 "전원 종료"로 해두어야 진동이나 화면 불빛 테러를 막을 수 있습니다. 또한 앞좌석 관객이 상체를 앞으로 숙이면 뒷좌석 관객의 시야 전체가 가려지는 "수그리" 현상이 발생하므로, 등받이에 등을 밀착하고 관람하는 배려가 필요합니다.' }] }, { id: "culture-8", category: "culture", type: "article", title: "국제 영화제가 주목한 올해의 독립·예술영화 큐레이션 리포트", summary: "정형화된 공식을 비껴가며 독창적인 연출 감각과 인간 내면의 깊이를 조명하는 독립 영화 7편 소개.", source: "씨네21 (Cine21) · 독립·예술영화 기획", duration: "6분 읽기", date: "3일 전", imageUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80", url: "http://www.cine21.com", keyPoints: ["천만 관객 상업 영화의 자극적 클리셰를 벗어나 인물의 내면과 사회적 소외를 섬세하게 응시하는 7편의 걸작.", "칸, 베를린, 베니스 국제 영화제 수상작들이 채택한 미장센과 롱테이크 연출의 독창성을 집중 조명합니다.", "러닝타임 내내 관객에게 질문을 던지며 엔딩 크레디트 이후 깊은 여운과 토론을 이끌어내는 시네마틱 경험."], sections: [{ heading: "상업 영화의 공식 뒤편에서 피어난 시네마", body: "거대 자본이 투입된 블록버스터는 흥행을 위해 예측 가능한 기승전결과 빠른 편집, 과장된 감정선을 강요하기 마련입니다. 반면 독립·예술영화는 정답을 정해두지 않고, 삶의 부조리함이나 관계의 미묘한 틈새를 고요하게 포착하여 관객 각자의 삶을 거울처럼 비추어 줍니다." }, { heading: "침묵과 여백이 빚어내는 미장센의 미학", body: "뛰어난 작가주의 감독들은 대사보다 인물의 침묵과 카메라 앵글, 빛과 그림자의 질감으로 이야기를 전합니다. 인물의 뒷모습을 오래도록 비추는 롱테이크(Long Take) 샷은 관객으로 하여금 극 중 인물의 호흡과 고뇌에 온전히 동기화되는 특별한 영화적 체험을 선사합니다." }, { heading: "오늘 밤을 위한 추천 영화 큐레이션", body: "일상의 소소한 대화 속에서 가족의 의미를 되묻는 정주리 감독의 신작부터, 자연의 소리와 침묵을 앰비언트 사운드로 직조한 유럽 다큐멘터리까지 다양합니다. 스마트폰을 멀리 두고 불을 끈 채 방 안을 작은 영화관으로 만들어 보세요." }] }, { id: "culture-9", category: "culture", type: "article", isNew: true, title: "우리 전통문화가 세계로 나아간다고?", summary: "한식·한복·한지·한글·한옥 등 한국 전통문화를 세계적인 문화 브랜드로 발전시키려는 계획을 소개합니다.", recommendationReason: "한국 전통문화가 현대 사회에서 어떻게 활용되고 세계로 확장되는지 알아볼 수 있습니다.", source: "매일신문", duration: "5분 읽기", date: "전통 문화", imageUrl: "https://images.unsplash.com/photo-1548115184-bc6544d06a58?w=800&auto=format&fit=crop&q=80", url: "https://m.imaeil.com/page/view/2025041516144443640", keyPoints: ['한식, 한복, 한지, 한글, 한옥을 아우르는 "5-K 전통문화 세계화" 브랜드 전략 본격 추진.', "단순한 과거 유물 보존을 넘어 현대적인 라이프스타일 디자인과 글로벌 팝 컬처와의 융합.", "친환경 한지 공예, 현대 감각의 생활 한복, K-푸드 웰빙 식문화가 글로벌 명품 시장에서 각광."], sections: [{ heading: "한국의 5대 정체성: 한식·한복·한지·한글·한옥", body: "한국의 정체성을 담은 5가지 전통 자산(5-K)이 전 세계적인 K-웨이브 열풍과 결합하여 고부가가치 문화 브랜드로 재탄생하고 있습니다. 전통의 뿌리를 보존하면서도 현대적 감각으로 재해석하는 작업이 핵심입니다." }, { heading: "현대 라이프스타일 속에 스며든 전통 미학", body: "천연 닥나무 섬유로 만든 한지가 친환경 럭셔리 포장재와 음향 스피커 진동판으로 쓰이고, 한옥의 처마 곡선과 차경(借景) 철학이 현대 건축 디자인에 영감을 주며 글로벌 건축계의 찬사를 받고 있습니다." }, { heading: "세계인이 함께 즐기는 K-컬처 플랫폼", body: "해외 주요 문화원과 글로벌 박람회를 통해 전 세계 시민들이 직접 한복을 입고, 궁중 병과를 맛보며, 한글의 조형미를 캘리그라피로 체험하는 인터랙티브 문화 교류가 확산되고 있습니다." }] }, { id: "culture-10", category: "culture", type: "article", isNew: true, title: "우리 전통문화를 직접 체험하려면?", summary: "울산의 향교와 서원에서 전통 예절·붓글씨·도예·전통 음식 등을 체험하는 문화유산 활용 프로그램을 소개합니다.", recommendationReason: "전통문화를 직접 체험할 기회를 살펴보고 우리 문화유산의 가치를 이해할 수 있습니다.", source: "연합뉴스", duration: "4분 읽기", date: "문화재 체험", imageUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80", url: "https://www.yna.co.kr/view/AKR20260526109300057", keyPoints: ["울산향교와 구강서원 등 역사적 고택을 시민들에게 개방하는 살아있는 문화유산 활용 사업.", "전통 다도(茶道), 붓글씨 서예, 도예 빚기, 전통 한과 만들기 등 남녀노소 맞춤형 체험 코스 운영.", "엄숙한 유적지 관람에서 벗어나 오감으로 만지고 즐기는 지역 문화유산의 대중화 모델."], sections: [{ heading: "문턱을 낮춘 고택과 서원의 변신", body: "담장 너머로 바라보기만 하던 울산향교와 구강서원이 시민들의 일상 속 쉼터이자 배움터로 문을 열었습니다. 유서 깊은 한옥 마루에 앉아 바람 소리를 들으며 전통의 지혜를 배우는 특별한 시간이 마련됩니다." }, { heading: "오감으로 배우는 다도와 서예", body: "차를 우리고 대접하는 정갈한 다도 예절을 통해 마음의 안정을 찾고, 먹향 그윽한 한지 위에 먹물로 붓글씨를 쓰며 디지털 기기에서 벗어나 아날로그 몰입의 즐거움을 경험할 수 있습니다." }, { heading: "가족과 함께하는 주말 전통 레저", body: "흙을 직접 빚어 나만의 도자기를 굽고, 전통 방식으로 다식을 찍어내는 등 아이부터 어르신까지 온 가족이 함께 참여할 수 있는 실감형 프로그램이 계절별로 다채롭게 펼쳐집니다." }] }, { id: "culture-11", category: "culture", type: "article", isNew: true, title: "포켓몬스터는 어떻게 등장하고 발전했을까?", summary: "1996년 휴대용 게임기에서 시작해 수집·훈련·배틀의 매력으로 전 세계 183개국 애니메이션과 완구, 대중문화를 뒤흔든 프랜차이즈의 여정을 다룹니다.", recommendationReason: "하나의 게임 타이틀이 전 세계 세대를 아우르는 문화적 신드롬과 미디어 믹스로 확장된 역사를 배웁니다.", source: "한국어 위키백과 · 포켓몬스터", duration: "6분 읽기", date: "위키백과", imageUrl: "https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?w=800&auto=format&fit=crop&q=80", url: "https://ko.wikipedia.org/wiki/%ED%8F%AC%EC%BC%93%EB%AA%AC%EC%8A%A4%ED%84%B0", keyPoints: ["1996년 게임보이용 《포켓몬스터 레드·그린》으로 출발한 역사상 최고 수익의 미디어 프랜차이즈.", "수집, 훈련, 배틀이라는 핵심 철학을 바탕으로 모든 매체를 아우르는 일관된 세계관 구축.", "애니메이션, 트레이딩 카드 게임(TCG), 영화, 캐릭터 굿즈로 확장된 글로벌 대중문화의 상징."], sections: [{ heading: "게임보이의 작은 화면에서 시작된 신화", body: "《포켓몬스터》는 1996년 2월 게임 프리크가 개발해 닌텐도 휴대용 게임기 게임보이로 출시된 《포켓몬스터 레드·그린》으로 시작했습니다. 통신 케이블을 통한 교환이라는 독창적 아이디어가 돌풍을 일으켰습니다." }, { heading: "수집, 훈련, 배틀을 관통하는 세계관", body: "이 세 가지 요소는 비디오 게임, 1,000편 이상의 글로벌 애니메이션, 카드 게임, 만화 등 포켓몬스터의 모든 파생 매체에 변함없이 등장하며 팬들에게 공통의 모험 감동을 선사합니다." }, { heading: "글로벌 미디어 믹스 프랜차이즈의 정점", body: "누적 게임 판매량 3억 8천만 장 이상을 기록하며 전 세계 183개국에 방영된 역사상 가장 성공적인 미디어 믹스이자 팝 컬처 아이콘으로 자리매김했습니다." }] }, { id: "culture-12", category: "culture", type: "article", isNew: true, title: "텔레비전 드라마에서는 정보가 어떻게 전달될까?", summary: "시청각성과 대량전달성을 무기로 안방극장을 탄생시킨 텔레비전 드라마가 대본을 영상, 소리, 연출로 구체화하여 감정과 정보를 전달하는 예술적 기법을 살펴봅니다.", recommendationReason: "대본 속 활자가 감독의 미장센과 음향 연출을 거쳐 대중의 공감을 이끌어내는 영상 화법을 탐구합니다.", source: "한국어 위키백과 · 텔레비전 드라마", duration: "5분 읽기", date: "위키백과", imageUrl: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800&auto=format&fit=crop&q=80", url: "https://ko.wikipedia.org/wiki/%ED%85%94%EB%A0%88%EB%B9%84%EC%A0%84_%EB%93%9C%EB%9D%BC%EB%A7%88", keyPoints: ["시청각성, 동시성, 대량전달성, 박진성을 특성으로 발전한 현대 종합 대중 예술 장르.", "텍스트로 이루어진 대본을 영상미와 배경 음악, 배우의 연기로 구상화(具象化)하는 연출 메커니즘.", "가정 내 안방극장을 통해 시청자 공동체의 감정적 공감대와 사회적 담론을 형성하는 파급력."], sections: [{ heading: "안방극장의 탄생과 텔레비전의 매체적 특성", body: "텔레비전 드라마는 방송 시작과 함께 태어난 새로운 장르의 예술로, 시청각성·동시성·대량전달성·박진성 등의 강력한 힘을 발판으로 안방극장이란 친근한 문화를 만들어냈습니다." }, { heading: "연출을 통한 대본의 구상화", body: "연출자는 말로만 구성된 대본을 영상과 소리에 의해 구상화(具象化)합니다. 카메라 앵글, 조명, 인물의 동선, 효과음이 한데 어우러져 단순 정보 이상의 감정적 울림을 전달합니다." }, { heading: "동시대적 공감과 문화적 영향력", body: "드라마는 일상적인 시간대에 거실로 직접 전달되는 특성 덕분에 시대의 가치관과 가족관, 사회적 갈등을 투영하고 대중적 담론을 형성하는 강력한 문화적 창구 역할을 합니다." }] }, { id: "culture-13", category: "culture", type: "article", isNew: true, title: "청소년을 다른 개념과 구별하는 특징", summary: "급속한 2차 성장기를 거쳐 성인으로 이행하는 청소년기가 사회문화적 규정과 법적 기준, 그리고 발달 단계별 교육 환경 속에서 어떻게 정의되는지 조명합니다.", recommendationReason: "단순 생물학적 나이를 넘어 사회문화적 맥락과 교육 제도가 청소년을 어떻게 규정하는지 균형 있게 이해할 수 있습니다.", source: "한국어 위키백과 · 청소년", duration: "5분 읽기", date: "위키백과", imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80", url: "https://ko.wikipedia.org/wiki/%EC%B2%AD%EC%86%8C%EB%85%84", keyPoints: ["2차 성징의 급속 성장기 이후 성인이 되기 전까지 신체적·정서적 과도기를 가리키는 개념.", "사회, 문화 및 국가별 법적 규정에 따라 만 12~17세(로틴/하이틴) 등 유동적인 연령 구분.", "지적·정서적·사회적 발달에 부합하는 토의형 교육과 자아 정체성 탐색의 중요성."], sections: [{ heading: "과도기로서의 신체적·심리적 성장 단계", body: "청소년은 2차 성징이 나타나면서 성장이 급속화되는 급속 성장기를 거쳐 성인이 되기 전의 연령을 일컫습니다. 아동기와 성인기 사이에서 독특한 심리적 역동을 겪습니다." }, { heading: "사회문화 및 법적 규정의 다양성", body: "사회, 문화 및 법적 규정은 각각 조금씩 나이의 차이를 보입니다. 연령 단계로 나눠 만 12~14세를 로틴(중학생), 만 15~17세를 하이틴(고등학생)으로 부르는 등 사회적 쓰임새에 따라 유연하게 구분됩니다." }, { heading: "발달 단계에 상응하는 교육의 역할", body: "이 시기에는 학생의 신체적·지적·정서적·사회적 발달에 상응하는 교육 내용과 방법이 요구되며, 충분히 토의하고 연구할 수 있는 자율적인 환경이 성숙한 시민으로의 성장을 돕습니다." }] }, { id: "culture-14", category: "culture", type: "article", isNew: true, title: "미국의 문화는 어떻게 등장하고 발전했을까?", summary: "유럽 전통의 뿌리 위에 세계 각국 이민자들의 고유한 유산이 융합되어 독창적인 언어, 음악, 미술, 식문화를 꽃피운 미국 문화의 다양화 과정을 살펴봅니다.", recommendationReason: "대규모 이민의 역사 속에서 형성된 다문화주의와 현대 글로벌 대중문화의 기원을 살펴볼 수 있습니다.", source: "한국어 위키백과 · 미국의 문화", duration: "5분 읽기", date: "위키백과", imageUrl: "https://images.unsplash.com/photo-1508433957232-3107f5fd5995?w=800&auto=format&fit=crop&q=80", url: "https://ko.wikipedia.org/wiki/%EB%AF%B8%EA%B5%AD%EC%9D%98_%EB%AC%B8%ED%99%94", keyPoints: ["유럽 서양 문화의 초기 전통에서 출발해 독자적인 언어, 관습, 예술을 형성한 역사적 궤적.", "전 세계 수많은 국가로부터의 대규모 이민을 흡수하며 구축된 민족적·인종적 다문화주의.", "재즈, 록, 할리우드 영화, 대중 요리 등 전 세계로 파급된 현대 글로벌 팝 컬처의 원동력."], sections: [{ heading: "유럽의 영향과 독자적 서양 문화의 발전", body: "미국의 문화는 원래 유럽 문화의 영향을 받아서 발전한 서양 문화입니다. 미국 영어, 독창적 음악과 미술, 사회적 관습을 갖춘 나라가 되기 전부터 오랜 역사적 축적을 거쳤습니다." }, { heading: "이민과 인종적 다양성이 만든 모자이크", body: "오늘날 미국은 초기 기독교 문화의 전통에서 역사적으로 다른 수많은 국가로부터 대규모 이민을 받아들이면서 민족적으로나 인종적으로 가장 다채로운 문화를 지닌 국가가 되었습니다." }, { heading: "글로벌 대중문화로의 확산", body: "각양각색의 전통이 충돌하고 융합하며 탄생한 미국의 영화, 대중음악, 패션, 라이프스타일은 전 세계인의 일상에 스며드는 글로벌 문화 코드로 성장했습니다." }] }, { id: "culture-15", category: "culture", type: "article", isNew: true, title: "숭늉은 우리 생활에서 어디에 쓰일까?", summary: "가마솥 밥 짓기에서 시작되어 식사의 마지막을 따뜻하고 개운하게 장식하는 한국 고유의 음료이자 독창적인 쌀 식문화를 조명합니다.", recommendationReason: "한국의 전통 가마솥 조리 환경이 낳은 고유한 식사 마무리 문화와 숭늉의 지혜를 이해합니다.", source: "한국어 위키백과 · 숭늉", duration: "4분 읽기", date: "위키백과", imageUrl: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=800&auto=format&fit=crop&q=80", url: "https://ko.wikipedia.org/wiki/%EC%88%AD%EB%8A%89", keyPoints: ["가마솥 바닥에 눌어붙은 누룽지에 물을 부어 끓여 낸 한국 전통의 구수한 곡차 겸 음료.", "한·중·일 쌀 문화권 중에서도 한국인만이 독자적으로 향유해 온 고유한 음식문화.", "식사 후 숭늉을 마시거나 밥을 말아먹음으로써 한 끼 식사의 순서를 온전히 마무리하는 관습."], sections: [{ heading: "가마솥 조리 도구가 낳은 지혜의 음료", body: "숭늉은 밥솥 바닥에 눌어붙은 누룽지에 물을 붓고 한소끔 끓여 만든 음료입니다. 한국인들은 전통적으로 가마솥을 이용해 밥을 지었으며, 조리 과정에서 자연스럽게 남은 누룽지를 활용해 숭늉을 만들어 즐겼습니다." }, { heading: "식사의 완결을 알리는 고유한 식문화", body: "밥을 먹고 숭늉을 마시거나 숭늉에 밥을 말아 먹으면 식사의 순서가 끝나는 독특한 식문화를 형성했습니다. 입안을 개운하게 씻어주고 소화를 돕는 후식 역할을 담당했습니다." }, { heading: "동아시아 쌀 문화권 속 한국만의 독창성", body: "쌀을 주식으로 공유하는 한국, 중국, 일본 중에서도 숭늉 형태로 식사를 마치는 것은 한국만이 지닌 따뜻하고 포용적인 음식 문화의 고유한 유산입니다." }] }, { id: "culture-16", category: "culture", type: "article", isNew: true, title: "음식 배달은 우리 생활에서 어디에 쓰일까?", summary: "전화 주문에서 모바일 앱과 전동 모빌리티로 진화하며 가정, 오피스, 의료 시설까지 일상 식생활의 패러다임을 바꾼 배달 서비스 문화를 분석합니다.", recommendationReason: "외식과 유통, 디지털 플랫폼이 결합하여 현대 도시 라이프스타일을 어떻게 재정의했는지 탐구합니다.", source: "한국어 위키백과 · 음식 배달", duration: "5분 읽기", date: "위키백과", imageUrl: "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=800&auto=format&fit=crop&q=80", url: "https://ko.wikipedia.org/wiki/%EC%9D%8C%EC%8B%9D_%EB%B0%B0%EB%8B%AC", keyPoints: ["전화 및 모바일 앱, 플랫폼 서비스를 통해 음식과 식료품을 소비자의 문 앞까지 연결.", "가정식 소비뿐 아니라 구내식당, 의료 시설, B2B 도매 케이터링까지 포괄하는 생활 인프라.", "도시 밀도와 라이프스타일에 맞춘 자전거, 전동 스쿠터 등 마이크로 모빌리티 생태계와의 결합."], sections: [{ heading: "디지털 플랫폼과 모바일 주문의 일상화", body: "음식 배달 주문은 전화에서 공급업체 웹사이트, 모바일 앱, 그리고 제3자 주문 플랫폼을 통해 표준화되었습니다. 메인 요리부터 디저트, 신선 식료품까지 보온·보냉 포장으로 신속하게 배송됩니다." }, { heading: "가정을 넘어 의료·복지 시설로의 쓰임새 확장", body: "음식 배달의 영역은 일반 가정을 넘어 음식점 식자재 공급, 구내식당 운영, 의료 시설 및 케이터링 도매 배달 서비스까지 우리 생활 전반의 필수 유통 축으로 확장되었습니다." }, { heading: "도시 교통과 라이프스타일의 변화", body: "자동차뿐 아니라 대도시 환경에 최적화된 자전거나 전동 스쿠터 배달원이 도심을 유기적으로 연결하며, 집밥과 외식의 경계를 허무는 새로운 도시 음식 문화를 이끌고 있습니다." }] }, { id: "culture-17", category: "culture", type: "article", isNew: true, title: "태국 요리를 다른 개념과 구별하는 특징", summary: "풍부한 열대 과일과 허브, 매운맛·신맛·단맛이 어우러지는 토착 전통과 외래 문화의 조화가 만들어낸 태국 식문화의 정체성을 살펴봅니다.", recommendationReason: "이국적인 향신료의 배합과 문화적 융합이 빚어낸 동남아시아 대표 미식의 매력을 배웁니다.", source: "한국어 위키백과 · 태국 요리", duration: "4분 읽기", date: "위키백과", imageUrl: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800&auto=format&fit=crop&q=80", url: "https://ko.wikipedia.org/wiki/%ED%83%9C%EA%B5%AD_%EC%9A%94%EB%A6%AC", keyPoints: ["열대 과일, 쌀, 다채로운 천연 향신료(레몬그라스, 갈랑갈 등)가 자아내는 독보적 풍미.", "매운맛, 신맛, 단맛, 짠맛이 한 그릇 안에서 절묘한 균형과 조화를 이루는 미식 철학.", "동남아시아 토착 전통 식문화 위에 중국, 인도 등의 외부 교류가 융합된 문화적 산물."], sections: [{ heading: "열대 기후와 풍부한 식재료의 보고", body: "태국 요리는 동남아시아 태국의 자연환경을 반영하여 열대 과일과 쌀, 그리고 다양한 향신료들이 풍성하게 들어가는 독특한 특징을 지닙니다." }, { heading: "네 가지 맛의 역동적인 하모니", body: "매운맛, 신맛, 단맛, 짠맛 등 각기 다른 자극적인 맛들이 부딪히지 않고 하나의 절묘한 조화를 이룹니다. 라임의 산미와 피시소스의 감칠맛, 고추의 칼칼함이 태국 요리의 정체성을 완성합니다." }, { heading: "토착 식문화와 문명 교류의 산물", body: "태국 요리의 진정한 매력은 자국의 토착적인 전통 음식 문화가 주변 해상 교역을 통해 들어온 외래 식문화와 유기적으로 혼재되어 개성 있게 발달했다는 점에 있습니다." }] }, { id: "culture-18", category: "culture", type: "article", isNew: true, title: "중국 요리, 음식으로 살펴보는 또 하나의 문화", summary: "광대한 대륙의 기후와 화교 네트워크를 타고 전 세계로 퍼져나가며 현지 식습관과 융합한 중국 요리의 세계적 문화 전파력을 탐구합니다.", recommendationReason: "이주 역사와 현지화 전략을 통해 세계인의 식탁을 사로잡은 음식 문화의 글로벌 전파를 이해합니다.", source: "한국어 위키백과 · 중국 요리", duration: "5분 읽기", date: "위키백과", imageUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=80", url: "https://ko.wikipedia.org/wiki/%EC%A4%91%EA%B5%AD_%EC%9A%94%EB%A6%AC", keyPoints: ["광대한 지역적 풍토에 기반한 다양한 조리법과 문화적 총칭으로서의 중국 요리.", "화교 이주 역사를 통해 각 나라와 지역의 입맛에 맞춰 적극적으로 변형된 현지화 성공 사례.", "단순한 음식을 넘어 사회적 연대와 환대, 철학적 세계관을 공유하는 식문화의 상징."], sections: [{ heading: "동아시아를 대표하는 유구한 요리 문화", body: "중국 요리는 동아시아의 대표적인 요리 문화로서, 좁게는 대륙 각 지방의 전통 요리를 의미하나 넓게는 전 세계적으로 화교들의 영향을 받은 현지 음식까지 모두 아우르는 거대한 문화적 총칭입니다." }, { heading: "화교 네트워크와 적극적인 현지화", body: "화교들이 일찍부터 외국으로 진출한 덕분에 각 나라의 고유한 입맛과 재료에 맞게 적극적인 현지화를 꾀하였으며, 이는 전 세계 곳곳에 중국 음식이 친숙하게 뿌리내린 핵심 비결입니다." }, { heading: "나눔과 화합을 중시하는 식사 철학", body: "원탁에 둘러앉아 음식을 돌려먹으며 소통하는 중국의 식사 방식은 가족과 동료 간의 유대감을 돈독히 하는 중요한 문화적 의례로 작동합니다." }] }, { id: "culture-19", category: "culture", type: "article", isNew: true, title: "일본 식탁에서 발견하는 음식 문화", summary: "사찰 음식부터 절기 행사 음식인 오세치와 보타모치까지, 자연의 계절감과 형식미를 담아내는 일본 고유의 식문화를 조명합니다.", recommendationReason: "계절의 변화와 전통 의례를 정갈하게 식탁 위에 구현하는 일본의 식문화 미학을 소개합니다.", source: "한국어 위키백과 · 일본 요리", duration: "5분 읽기", date: "위키백과", imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=80", url: "https://ko.wikipedia.org/wiki/%EC%9D%BC%EB%B3%B8_%EC%9A%94%EB%A6%AC", keyPoints: ["나라 시대부터 축적된 고유 식재료 활용법과 서양 요리를 독창적으로 재해석한 융합력.", "가이세키와 사찰음식 등 엄격한 형식미와 정갈함을 강조하는 전통 조리 체계.", "새해 오세치, 꽃놀이 당고, 동지 호박 등 사계절 명절·의례와 밀접하게 결합된 식문화."], sections: [{ heading: "전통의 계승과 외래 식문화의 독창적 재해석", body: "일본 요리는 나라 시대부터 이어진 고유의 방식과 재료를 계승하면서도 메이지 유신 이후 스파게티, 피자 등 서양 요리를 일본인의 입맛과 풍토에 맞게 재해석하여 풍성하게 발전해 왔습니다." }, { heading: "형식미와 예법을 담은 가이세키와 정식", body: "사찰음식과 가이세키 요리처럼 격식에 입각한 차림새는 시각적인 아름다움과 그릇의 조화, 식재료 본연의 담백한 맛을 살리는 데 깊은 정성을 쏟습니다." }, { heading: "절기와 축제를 수놓는 행사 음식", body: "새해를 맞이하는 오세치 요리, 피안의 보타모치, 벚꽃놀이와 달맞이의 당고, 동지의 호박 요리 등 사계절의 순환과 전통 행사를 함께 기념하는 따뜻한 문화적 의미를 지닙니다." }] }, { id: "culture-20", category: "culture", type: "article", isNew: true, title: "로봇의 눈물은 실사와 CGI를 어떻게 결합했을까?", summary: "오픈 소스 3D 툴 블렌더(Blender)를 활용해 배우의 실제 연기와 가상 컴퓨터 그래픽을 정교하게 합성해 낸 단편 영화 《로봇의 눈물》의 시각 예술을 살펴봅니다.", recommendationReason: "오픈 소스 창작 생태계와 컴퓨터 그래픽 기술이 영화적 서사와 결합한 예술적 시도를 만날 수 있습니다.", source: "한국어 위키백과 · 로봇의 눈물", duration: "5분 읽기", date: "위키백과", imageUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&auto=format&fit=crop&q=80", url: "https://ko.wikipedia.org/wiki/%EB%A1%9C%EB%B4%87%EC%9D%98_%EB%88%88%EB%AC%BC", keyPoints: ["실제 배우의 라이브 액션 촬영과 고난도 3D CGI 기술을 긴밀하게 결합한 시각 효과.", "오픈 소스 소프트웨어 블렌더(Blender)의 성능 개선 프로젝트를 통해 제작된 단편 영화.", "크리에이티브 커먼즈 라이선스를 채택하여 전 세계 디지털 창작자들에게 자산을 개방한 공유 문화."], sections: [{ heading: "실사와 컴퓨터 그래픽의 혁신적 결합", body: "《로봇의 눈물》(Tears of Steel)은 라이브 액션 실사 연기와 정밀한 CGI를 결합한 공상과학 단편 영화입니다. 현실 배우의 감정선 위에 정교한 로봇 메카닉 그래픽을 덧입혔습니다." }, { heading: "오픈 소스 그래픽 툴 블렌더의 한계 돌파", body: "자유·오픈 소스 3D 그래픽 소프트웨어 패키지인 블렌더의 새로운 시각 효과 개선 기능을 검증하고 끌어올리기 위해 제작되었으며, 시각 효과와 합성 작업 전반이 블렌더로 완수되었습니다." }, { heading: "공유와 오픈 라이선스의 문화적 의의", body: "영화 본편과 스튜디오에서 제작된 모든 에셋이 크리에이티브 커먼즈 라이선스로 전 세계에 공개되어, 미래 세대 독립 영상 제작자들에게 귀중한 학습 및 창작 자산이 되었습니다." }] }, { id: "culture-21", category: "culture", type: "article", isNew: true, title: "노래는 어떻게 등장하고 발전했을까?", summary: "중세 유럽 음유시인의 서정시에서 출발해 오페라, 극장 공연, 현대 디지털 음원 스튜디오로 이어지는 노래의 예술적 진화 과정을 탐색합니다.", recommendationReason: "인간의 목소리가 역사 속 음유시인과 작곡가들의 손을 거쳐 찬란한 음악 예술로 발전한 역사를 배웁니다.", source: "한국어 위키백과 · 노래", duration: "5분 읽기", date: "위키백과", imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80", url: "https://ko.wikipedia.org/wiki/%EB%85%B8%EB%9E%98", keyPoints: ["음유시인(트루바두르)들의 낭만적 서정시 전통에서 꽃피운 기록된 노래의 기원.", "클래식 가곡부터 오페라, 뮤지컬, 현대 녹음 스튜디오로 다변화된 공연 예술 형태.", "인간의 정서와 시대를 기록하고 전승하는 보편적인 문화적 소통 양식."], sections: [{ heading: "음유시인의 낭만 전통과 노래의 시작", body: "유럽의 트루바두르와 음유시인들이 기록된 낭만적 노래의 전통을 시작했으며, 이는 엘리자베스 시대의 류트 연주자들과 음유 가객들에 의해 대를 이어 계승 발전되었습니다." }, { heading: "예술 가곡과 무대 공연 예술의 만남", body: "클래식 작곡가들에 의해 콘서트용 예술 가곡이 체계화되었고, 노래는 극장 무대의 오페라, 영화, TV 프로그램의 핵심 내러티브 장치로 융합되었습니다." }, { heading: "녹음 기술과 대중음악의 번영", body: "스튜디오 음향 녹음 기술의 발전과 라이브 공연 문화가 결합하면서 노래는 전 인류가 시공간을 초월해 감정과 이야기를 공유하는 가장 대중적인 문화 언어가 되었습니다." }] }, { id: "culture-22", category: "culture", type: "article", isNew: true, title: "여성주의 운동은 사회를 어떻게 바꾸어 왔을까?", summary: "참정권 쟁취에서 시작해 교육권, 경제적 자립, 문화적 고정관념 타파로 확장되며 인류 사회의 평등과 연대를 이끌어온 여성주의 운동의 발전사를 살펴봅니다.", recommendationReason: "역사적 차별에 맞서 제도적 변화와 사회문화적 평등을 일궈낸 시민 운동의 흐름을 이해할 수 있습니다.", source: "한국어 위키백과 · 여성주의", duration: "6분 읽기", date: "위키백과", imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80", url: "https://ko.wikipedia.org/wiki/%EC%97%AC%EC%84%B1", keyPoints: ["성별로 인한 정치·경제·사회·문화적 차별을 해소하고자 태동한 근현대 시민 평등 운동.", "19세기 여성 참정권(서프러제트) 운동에서 교육권 보장과 직업적 기회균등으로의 지평 확대.", "사회적 관습과 고정관념을 넘어 다양성과 상호 연대를 지향하는 현대 문화 담론으로의 진화."], sections: [{ heading: "차별에 맞선 참정권 운동의 출발", body: "여성주의 운동은 성별로 인해 발생하는 정치·경제·사회적 차별을 철폐하기 위한 견해이자 실천입니다. 역사적으로 교육과 투표권에서 배제되었던 현실을 타파하기 위해 19세기 말 서프러제트(참정권 운동)로 본격화되었습니다." }, { heading: "교육권 보장과 경제적 자립의 길", body: "참정권 쟁취 이후 운동은 여성의 고등교육 접근권과 공평한 노동권, 임금 격차 해소로 외연을 넓혔습니다. 교육을 통한 지적 성장은 여성이 가부장적 종속에서 벗어나 주체적인 사회 구성원으로 설 수 있는 발판이 되었습니다." }, { heading: "현대 사회문화 담론과 연대의 확장", body: "현대의 여성주의는 단순한 법적 권리 획득을 넘어 미디어 속 성별 고정관념 탈피, 일·가정 양립 제도 개선, 그리고 모든 사회적 약자와의 교차적 연대를 통해 포용적이고 지속 가능한 공동체를 향해 나아가고 있습니다." }] }, { id: "culture-23", category: "culture", type: "article", isNew: true, title: "셰프의 감각에 맡기는 미식, 오마카세의 문화", summary: "정해진 메뉴 대신 셰프가 계절 식재료와 손님의 취향을 섬세하게 읽어 최적의 코스를 완성하는 일본의 맡김 요리 문화와 미식 철학을 탐구합니다.", recommendationReason: "손님과 셰프 사이의 깊은 신뢰와 즉흥적 장인정신이 만들어내는 현대 외식 미식 문화를 배웁니다.", source: "한국어 위키백과 · 오마카세", duration: "5분 읽기", date: "위키백과", imageUrl: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=800&auto=format&fit=crop&q=80", url: "https://ko.wikipedia.org/wiki/%EC%98%A4%EB%A7%88%EC%B9%B4%EC%84%B8", keyPoints: ['일본어로 "맡긴다"는 뜻으로, 셰프의 당일 재료 선별과 재량에 온전히 식사를 맡기는 방식.', "손님의 식사 속도, 취향, 반응을 실시간으로 관찰하고 대화하며 조율하는 맞춤형 접객(오모테나시).", "획일화된 메뉴판을 벗어나 계절감과 스토리를 음미하는 프리미엄 미식 라이프스타일."], sections: [{ heading: "맡김(お任せ)의 의미와 계절 식재료", body: '오마카세는 "주방장에게 맡긴다"는 뜻으로, 고정된 메뉴 대신 그날 시장에서 공수한 최상의 제철 식재료에 따라 셰프의 재량으로 코스를 구성하는 독특한 식문화입니다.' }, { heading: "손님과 소통하는 즉석 조리와 오모테나시", body: "소수의 손님만을 카운터에 모시고 즉석에서 요리를 내어주며 재료의 산지와 조리 의도를 설명합니다. 셰프는 손님의 먹는 속도와 선호도를 세심하게 기억하고 다음 요리의 간과 온도를 즉각 조절합니다." }, { heading: "경험과 취향을 소비하는 현대 미식 트렌드", body: "오늘날 오마카세는 스시를 넘어 한우, 디저트, 티 코스 등 다양한 영역으로 확장되며, 단순한 한 끼 식사를 넘어 셰프의 예술적 철학을 오감으로 교감하는 라이프스타일 문화로 자리 잡았습니다." }] }, { id: "hobby-1", category: "hobby", type: "video", title: "달리기의 기초: 무릎 부상 없는 착지 자세와 지치지 않는 2박자 호흡법", summary: "시선 처리, 코어 유지, 미드풋 발 디딤과 산소 섭취를 극대화하는 러닝 교과서 기초 가이드.", source: "YouTube · 러닝 텍스트북", duration: "12:45", date: "추천 영상", imageUrl: "https://i.ytimg.com/vi/Q-5MAWBA8FI/hqdefault.jpg", youtubeId: "Q-5MAWBA8FI", url: "https://www.youtube.com/watch?v=Q-5MAWBA8FI" }, { id: "hobby-5", category: "hobby", type: "video", title: "이탈리아 정통 말고 한국 스타일! 실패 없는 K-알리오올리오 파스타", summary: "마늘과 올리브유, 면수를 완벽하게 결합(Emulsion)하여 깊은 풍미를 완성하는 초간단 홈쿠킹 레시피.", source: "YouTube · 백종원 PAIK JONG WON", duration: "11:20", date: "인기 레시피", imageUrl: "https://i.ytimg.com/vi/ohihzV6Z85k/hqdefault.jpg", youtubeId: "ohihzV6Z85k", url: "https://www.youtube.com/watch?v=ohihzV6Z85k" }, { id: "hobby-2", category: "hobby", type: "article", title: "홈카페 핸드드립 입문: 원두 로스팅 포인트와 분쇄도별 브루잉 공식", summary: "산미와 단맛의 균형을 이끌어내는 물 온도(92도)와 드리퍼 형태별 푸어오버 테크닉.", source: "블랙워터이슈 (BWIssue) · 스페셜티 커피 전문지", duration: "5분 읽기", date: "2일 전", imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80", url: "https://bwissue.com", keyPoints: ["물 온도 90~93도와 원두:물 비율 1:15~1:16 공식만 지켜도 카페 부럽지 않은 깔끔한 브루잉이 완성됩니다.", "약배전(라이트 로스팅) 원두는 얇은 분쇄도와 고온(93도)으로 화사한 산미를, 강배전 원두는 중거친 분쇄도로 바디감을 살립니다.", "추출 시작 전 40초간의 원두 뜸들이기(Blooming) 과정이 원두 내 이산화탄소를 배출해 잡미를 없애는 핵심입니다."], sections: [{ heading: "핸드드립의 핵심 3대 변수: 원두, 물, 시간", body: '에스프레소 머신 없이도 드리퍼와 필터, 주전자만으로 훌륭한 커피를 내릴 수 있는 것이 핸드드립의 매력입니다. 가장 중요한 기본 공식은 원두 20g 기준 300g의 물을 내리는 "1:15 브루잉 레이시오(Brewing Ratio)"입니다. 이 비율을 기준으로 취향에 따라 농도를 조절해 나갈 수 있습니다.' }, { heading: "뜸들이기(Blooming): 커피의 숨구멍을 여는 40초", body: '신선하게 로스팅된 원두 속에는 다량의 이산화탄소가 갇혀 있습니다. 처음 원두 가루 전체가 살짝 적셔질 만큼 40~50g의 물을 부어주면 빵처럼 부풀어 오르는 "커피 번(Coffee Bun)" 현상이 나타납니다. 이 뜸 과정을 거쳐야 물길이 균일하게 형성되어 과소추출이나 떫은맛을 방지할 수 있습니다.' }, { heading: "하리오 V60 vs 칼리타 웨이브: 드리퍼의 차이", body: "빠른 유속과 깔끔한 산미를 선호한다면 원뿔형 구조의 하리오 V60을, 균일한 추출과 묵직한 단맛을 원한다면 평평한 바닥에 구멍이 3개 뚫린 칼리타 웨이브를 추천합니다. 원두 산지(에티오피아의 과일 향, 콜롬비아의 고소한 너트 향)에 어울리는 드리퍼를 매칭하는 재미가 쏠쏠합니다." }] }, { id: "hobby-4", category: "hobby", type: "article", title: "실내 간접광에서도 건강하게 자라는 공기정화 반려식물 5종과 물주기", summary: "과습으로 인한 뿌리 썩음을 방지하는 화분 흙 건조도 체크법과 플랜테리어 입문 안내.", source: "국립원예특작과학원 · 반려식물 가이드", duration: "6분 읽기", date: "5일 전", imageUrl: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&auto=format&fit=crop&q=80", url: "https://www.nihhs.go.kr", keyPoints: ["실내 식물이 시드는 가장 큰 원인은 물 부족이 아니라 과습(Overwatering)과 통풍 부족입니다.", "몬스테라, 스킨답서스, 산세베리아, 테이블야자, 필로덴드론은 직사광선 없는 거실에서도 튼튼하게 자랍니다.", "정해진 요일에 기계적으로 물을 주지 말고, 나무젓가락으로 흙 속 3~5cm가 말랐는지 확인 후 듬뿍 줍니다."], sections: [{ heading: "식물 킬러를 탈출하는 첫걸음: 빛과 바람의 이해", body: '많은 초보 식집사들이 "식물은 햇빛을 많이 받아야 한다"며 베란다 직사광선에 바로 내놓았다가 잎이 타버리는 경험을 합니다. 실내 관엽식물 대다수는 열대 우림의 큰 나무 그늘 아래서 진화했기 때문에, 커튼을 한 번 거친 부드러운 "밝은 간접광"에서 가장 윤기 나는 잎을 보여줍니다.' }, { heading: "과습을 막는 저면관수와 겉흙 체크법", body: '"일주일에 한 번 물주기"라는 규칙은 계절과 실내 습도에 따라 위험합니다. 나무젓가락을 화분 가장자리에 5cm 깊이로 찔러 넣었다가 뺐을 때 흙이 묻어나지 않고 보송보송할 때가 물을 줄 타이밍입니다. 물을 줄 때는 화분 밑바닥 배수구로 물이 콸콸 흘러나올 만큼 충분히 주고, 받침대에 고인 물은 즉시 비워 뿌리 호흡을 도와주세요.' }, { heading: "초보자를 위한 베스트 3종 추천", body: '공기정화 능력이 탁월하고 어두운 방에서도 강인한 "스킨답서스", 찢어진 잎의 이국적인 조형미를 뽐내는 "몬스테라", 건조에 강해 한 달에 한 번만 줘도 끄떡없는 "산세베리아"부터 시작해 보세요. 반려식물과 함께하는 초록빛 일상이 주는 정서적 위로는 놀라울 정도로 큽니다.' }] }, { id: "hobby-6", category: "hobby", type: "article", title: "아이패드 드로잉과 어반스케치: 형태 왜곡을 두려워하지 않는 취미 미술", summary: "사진을 트레이싱하지 않고도 일상의 장면을 자신만의 선과 색상 팔레트로 기록하는 드로잉 가이드.", source: "Procreate 공식 핸드북 · 디지털 드로잉 가이드", duration: "5분 읽기", date: "6일 전", imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop&q=80", url: "https://procreate.com/kr/handbook/procreate", keyPoints: ["똑같이 그리는 사진 복사가 아니라 일상의 한 조각을 나만의 시선과 필선으로 담아내는 감성 드로잉입니다.", "프로크리에이트(Procreate)의 모노라인 브러시와 스튜디오 펜으로 가벼운 외곽선부터 시작해 보세요.", "투시도법의 엄격한 법칙에 얽매이지 않고 비뚤어진 선조차 손그림 특유의 따뜻한 매력으로 승화시키는 태도가 중요합니다."], sections: [{ heading: "백지 공포증을 이기는 낙서(Doodle)의 힘", body: "처음 디지털 펜슬을 잡으면 매끈한 유리 액정 위에서 손이 미끄러지고, 선 하나도 완벽하게 그어야 한다는 강박에 지우개 버튼(Undo)만 누르다 지치기 쉽습니다. 종이 질감 필름을 붙이거나 브러시의 떨림 보정 수치를 살짝 올려두고, 카페의 커피잔이나 책상 위 안경 같은 작은 소품부터 편안하게 낙서하듯 그려보세요." }, { heading: "어반스케치: 여행의 순간을 영원으로 박제하는 법", body: "스마트폰 카메라로 찍은 수천 장의 사진은 갤러리 속에서 잊히기 쉽지만, 여행지 길모퉁이에 15분간 서서 스케치북에 담은 골목길의 풍경은 평생 기억에 남습니다. 건물의 모든 창문과 벽돌을 다 그릴 필요는 없습니다. 빛을 받는 지붕의 실루엣과 그림자진 벽면의 큰 덩어리감만 잡아내면 충분합니다." }, { heading: "나만의 색감 팔레트 만들기", body: '그림의 분위기를 결정하는 것은 정밀한 형태보다 "색상의 통일감"입니다. 자연의 초록색, 카페 벽돌의 테라코타 주황색, 흐린 하늘의 슬레이트 블루처럼 3~4가지 메인 컬러 팔레트를 정해두고 채색해 보세요. 비뚤어진 선과 어우러져 그림에 유일무이한 개성이 깃듭니다.' }] }, { id: "hobby-8", category: "hobby", type: "article", title: "에어프라이어로 만드는 겉바속촉 플레인 버터 스콘: 베이킹 기본기", summary: "차가운 버터 큐브 샌딩과 반죽 휴지 시간을 지켜 오븐 없이도 바삭한 식감을 완성하는 베이킹 레시피.", source: "만개의레시피 · 홈베이킹 연구소", duration: "6분 읽기", date: "4일 전", imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80", url: "https://www.10000recipe.com", keyPoints: ["오븐이 없어도 에어프라이어의 대류 열풍으로 겉은 바삭하고 속은 촉촉한 영국식 플레인 스콘을 구울 수 있습니다.", "버터가 반죽에 녹아들지 않도록 깍둑썰기하여 차갑게 유지하고, 가루류와 모래알 크기로 샌딩하는 것이 결 생성의 비밀입니다.", "반죽을 치대지 않고 접어서 30분간 냉장 휴지한 뒤 180도에서 15분 구워내면 완벽한 크랙이 완성됩니다."], sections: [{ heading: "홈베이킹의 훌륭한 입문작, 스콘", body: "발효 과정이 필요한 빵이나 머랭을 올려야 하는 케이크와 달리, 퀵 브레드(Quick Bread)인 스콘은 가루류와 차가운 버터, 우유만 있으면 30분 만에 반죽을 끝낼 수 있어 홈베이커에게 최고의 첫 도전 과제입니다. 갓 구워낸 따끈한 스콘에 딸기잼과 클로티드 크림을 곁들이면 주말 오후가 홈카페로 변신합니다." }, { heading: "버터를 사수하라: 샌딩(Sanding)과 결 만들기", body: '스콘의 생명인 파이 같은 "결"은 차가운 버터 조각이 가루 사이에 층층이 갇혀 있다가, 뜨거운 에어프라이어 열기 속에서 버터가 녹아 수증기를 뿜어내며 틈새를 밀어 올릴 때 생겨납니다. 손의 체온으로 버터가 녹지 않도록 스크래퍼나 포크를 사용해 콩알 크기로 빠르게 다져주는 것이 핵심입니다.' }, { heading: "에어프라이어 온도 세팅과 실패 방지 꿀팁", body: "에어프라이어는 열선과 반죽 사이 거리가 가까워 윗면이 쉽게 탈 수 있습니다. 175~180도로 예열한 뒤 종이호일을 깔고 12~15분간 구워줍니다. 윗면 색이 너무 빨리 짙어진다면 마지막 3분은 호일을 가볍게 덮어주세요. 겉은 비스킷처럼 바삭하고 속은 버터의 풍미가 가득한 인생 스콘을 만날 수 있습니다." }] }, { id: "hobby-9", category: "hobby", type: "article", isNew: true, title: "된장 마요 김치볶음밥? 같이 만들어 볼까?", summary: "김치에 된장·마요네즈·간장 등의 양념을 넣고 볶은 뒤 밥을 섞어 만드는 색다른 김치볶음밥 조리법을 소개합니다.", recommendationReason: "익숙한 김치볶음밥에 새로운 양념을 더해 색다른 요리를 시도해 볼 수 있습니다.", source: "아리마리 티스토리", duration: "5분 읽기", date: "홈쿠킹 레시피", imageUrl: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&auto=format&fit=crop&q=80", url: "https://arimarim.tistory.com/1158", keyPoints: ["잘 익은 신김치의 산미를 된장의 구수한 감칠맛과 마요네즈의 고소함으로 부드럽게 감싸는 황금 비율.", "된장 반 스푼, 마요네즈 한 스푼, 진간장 살짝을 팬 가장자리에 눌려 불향을 입히는 핵심 팁.", "기존 고추장·고춧가루 볶음밥과 달리 자극적이지 않고 풍미가 깊어 혼밥 요리로 안성맞춤."], sections: [{ heading: "김치볶음밥에 된장과 마요네즈를 넣는 이유", body: "김치볶음밥에 된장이라니 생소하게 느껴질 수 있지만, 된장의 아미노산 감칠맛이 김치의 시큼한 맛을 중화하고 마요네즈의 유지방이 밥알 하나하나를 코팅해 윤기와 고소함을 극대화해 줍니다." }, { heading: "실패 없는 재료 손질과 양념 볶기", body: "잘게 썬 김치 1공기에 대파를 넉넉히 썰어 파기름을 낸 뒤 김치를 달달 볶아줍니다. 김치가 투명해질 때 팬 한쪽에 된장 0.5스푼, 진간장 0.5스푼을 넣고 지글지글 끓여 불향을 내는 것이 결정적 비법입니다." }, { heading: "마요네즈로 마무리하는 밥알 코팅", body: "불을 약하게 줄이고 식은 밥을 넣어 주걱으로 가르듯 섞은 뒤, 마지막에 마요네즈 1스푼을 둘러 센 불에서 1분간 빠르게 볶아냅니다. 반숙 계란후라이와 김가루를 얹으면 근사한 한 그릇 요리가 완성됩니다." }] }, { id: "hobby-10", category: "hobby", type: "article", isNew: true, title: "스마트폰으로 사진을 더 잘 찍을 수 있을까?", summary: "스마트폰으로 사진을 찍을 때 구도와 빛을 활용해 더 좋은 사진을 만드는 기본 촬영 방법을 소개합니다.", recommendationReason: "사진 촬영에 관심 있는 사용자가 일상에서 쉽게 적용할 수 있는 촬영 기법을 배울 수 있습니다.", source: "브로시스터", duration: "6분 읽기", date: "스마트폰 사진", imageUrl: "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=800&auto=format&fit=crop&q=80", url: "https://brosister.officialsite.kr/photography/smartphone-photography", keyPoints: ["스마트폰 카메라 설정에서 격자(3x3 삼분할 그리드)를 켜고 수평과 여백을 맞추는 구도의 마법.", "카메라 렌즈를 옷소매로 깨끗이 닦는 것만으로도 빛 번짐과 안개 낀 듯한 뿌연 현상을 즉시 해결.", "직사광선보다는 창가 간접광이나 해 질 녘 골든아워(Golden Hour)의 부드러운 자연광 활용법."], sections: [{ heading: "렌즈 닦기와 3x3 격자선 활성화", body: '멋진 풍경을 찍기 전 스마트폰 카메라 렌즈를 안경 닦이나 부드러운 천으로 닦는 것만으로 사진의 선명도가 2배는 올라갑니다. 카메라 설정에서 "격자선"을 켜고 교차점에 주인공을 배치하는 3분할 법칙만 지켜도 안정감이 살아납니다.' }, { heading: "빛의 방향 읽기: 순광, 역광, 사광", body: "인물이나 음식을 찍을 때는 피사체 정면에서 비추는 강한 빛보다 45도 측면에서 들어오는 사광(Side Light)을 활용하면 입체감 있는 그림자가 생겨 분위기가 극대화됩니다." }, { heading: "탭으로 초점과 노출(밝기) 수동 조절하기", body: "화면에서 가장 중요한 피사체를 손가락으로 가볍게 탭한 뒤 옆에 나타나는 해 모양 아이콘을 살짝 아래로 내려 노출을 조금 어둡게 맞추면 하이라이트가 날아가지 않고 색감이 훨씬 깊고 진해집니다." }] }, { id: "hobby-11", category: "hobby", type: "article", isNew: true, title: "네모바지 스폰지밥은 어떻게 등장하고 발전했을까?", summary: "집게리아의 긍정적인 요리사로 첫 등장해 기상천외한 순발력과 유쾌한 매력으로 전 세계 극장판 영화와 대중문화를 사로잡은 스폰지밥의 이야기를 다룹니다.", recommendationReason: "일상에 유쾌한 활력을 주는 세계적인 인기 애니메이션 캐릭터의 탄생과 유머 코드를 살펴봅니다.", source: "한국어 위키백과 · 네모바지 스폰지밥 (캐릭터)", duration: "5분 읽기", date: "위키백과", imageUrl: "https://images.unsplash.com/photo-1593085512500-5d55148d6f0d?w=800&auto=format&fit=crop&q=80", url: "https://ko.wikipedia.org/wiki/%EB%84%A4%EB%AA%A8%EB%B0%94%EC%A7%80_%EC%8A%A4%ED%8F%B0%EC%A7%80%EB%B0%A5_(%EC%BA%90%EB%A6%AD%ED%84%B0)", keyPoints: ["집게리아의 열정 넘치는 버거 요리사로 첫 에피소드부터 기상천외한 매력을 발산한 캐릭터.", "특유의 낙천적인 웃음과 엉뚱한 순발력으로 남녀노소 모두에게 사랑받는 글로벌 애니메이션.", "TV 시리즈를 넘어 극장판 장편 영화, 뮤지컬, 팝 컬처 밈으로 지속 확장 중인 캐릭터 자산."], sections: [{ heading: "집게리아 첫 출근과 전설의 게살버거", body: "집게사장은 처음에는 스폰지밥의 실력을 미덥지 않게 여겼지만, 시즌 1 첫 번째 에피소드 〈직원모집〉 편에서 몰려든 손님들에게 게살버거를 기상천외한 순발력으로 대접하는 모습을 보고 감동해 즉시 채용했습니다." }, { heading: "긍정의 아이콘과 독창적인 유머 세계", body: "바닷속 비키니시티를 배경으로 징징이, 뚱이, 다람이와 엮이며 벌어지는 스폰지밥의 순수한 낙천주의는 전 세계 시청자들에게 큰 웃음과 위로를 선사했습니다." }, { heading: "극장판 영화와 글로벌 팝 컬처의 마스코트", body: "2020년 장편 영화 《스폰지밥 무비: 핑핑이 구출 대작전》을 비롯해 영화사의 대표 마스코트로 자리 잡았으며, 다채로운 상품과 밈으로 소비되는 현대 대중 취미 문화의 상징이 되었습니다." }] }], Fs = [{ id: "balanced", get name() {
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
  if (!t) {
    const s = i.duration ? i.duration.replace("분 읽기", " min read").replace("분 분량", " min read") : i.type === "video" ? "10:00" : "5 min read", o = i.date ? i.date.replace("어제", "Yesterday").replace("오늘", "Today").replace("일 전", "d ago") : "Recent";
    return { ...i, duration: s, date: o };
  }
  const n = t.duration || (i.duration ? i.duration.replace("분 읽기", " min read") : "5 min read"), r = t.date || i.date;
  return { ...i, title: t.title || i.title, summary: t.summary || i.summary, source: t.source || i.source, duration: n, date: r, recommendationReason: t.recommendationReason || i.recommendationReason, keyPoints: t.keyPoints || i.keyPoints, sections: t.sections || i.sections };
}
const xl = { apiKey: "AIzaSyBcmT4HagqGYpo_ZfizIReEIvDPG-LtsJs", authDomain: "my-gorithm.firebaseapp.com", projectId: "my-gorithm", storageBucket: "my-gorithm.firebasestorage.app", messagingSenderId: "844754199331", appId: "1:844754199331:web:2adf2f89e4cf45e188e296", measurementId: "G-SEVD6WLTHP" }, rB = () => xl.apiKey && xl.apiKey !== "YOUR_API_KEY";
let il = null, Ki = null, Oe = null, Et = null;
const Fl = /* @__PURE__ */ new Set(), Bp = new yn();
Bp.setCustomParameters({ prompt: "select_account" });
if (rB()) try {
  il = Df(xl), Ki = f_(il), Oe = Cv(il), oI(Oe, (i) => {
    Et = i, i ? console.log("🔥 Firebase Auth 상태:", i.isAnonymous ? "익명 게스트" : i.email, i.uid) : Ym(Oe).catch((e) => {
      console.warn("Firebase 익명 로그인 안내:", (e == null ? void 0 : e.message) || e);
    }), Fl.forEach((e) => {
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
    await aI(Oe), Ym(Oe).catch(() => {
    });
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
    n === 0 ? (U.shuffleSeed = 0, localStorage.setItem(mt.VISIT_COUNT, "1")) : (U.shuffleSeed = Date.now() % 9973 + n * 53 || 1, localStorage.setItem(mt.VISIT_COUNT, String(n + 1))), document.body.classList.remove("dark-mode", "apple-glass"), localStorage.removeItem("mamgorithm_ui_mode_v2"), localStorage.removeItem("mamgorithm_theme_v2");
  } catch (i) {
    console.warn("설정 불러오기 실패:", i);
  }
}
let Zd = { ...U.weights };
function an() {
  try {
    Jt.trackMixerChange(Zd, U.weights), Zd = { ...U.weights }, localStorage.setItem(mt.WEIGHTS, JSON.stringify(U.weights)), rB() && (Et != null && Et.uid) && hp(Et.uid, U.weights);
  } catch {
  }
}
function qn() {
  try {
    localStorage.setItem(mt.SAVED_IDS, JSON.stringify([...U.savedIds])), Jt.scheduleSync();
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
      o !== null && (U.weights.study = o), c !== null && (U.weights.tech = c), l !== null && (U.weights.culture = l), u !== null && (U.weights.hobby = u), an(), X("success"), xe(t("toast.recipeApplied"));
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
function gp(i, e = 0, t = 8) {
  if (i.totalWeight === 0) return [];
  const r = sB().filter((F) => U.contentType === "all" ? true : F.type === U.contentType), s = ["study", "tech", "culture", "hobby"], o = {};
  let c = 0;
  const l = [];
  s.forEach((F) => {
    const G = U.weights[F];
    if (G <= 0) {
      o[F] = 0;
      return;
    }
    const ae = G / i.totalWeight * t, Be = Math.floor(ae);
    o[F] = Be, c += Be, l.push({ cat: F, rem: ae - Be, weight: G });
  });
  let u = t - c;
  l.sort((F, G) => G.rem - F.rem || G.weight - F.weight).forEach((F) => {
    u > 0 && (o[F.cat] = (o[F.cat] || 0) + 1, u--);
  });
  const h = {};
  s.forEach((F, G) => {
    const Z = o[F] || 0;
    if (Z <= 0) {
      h[F] = [];
      return;
    }
    const ae = r.filter((D) => D.category === F);
    if (ae.length === 0) {
      h[F] = [];
      return;
    }
    const Be = U.shuffleSeed === 0 ? e * 7919 + (G + 1) * 31 : U.shuffleSeed + e * 997 + (G + 1) * 131, fe = Pv(ae, Be), I = [], E = e * Z % fe.length;
    for (let D = 0; D < Z; D++) I.push(fe[(E + D) % fe.length]);
    h[F] = I;
  });
  const d = ["hobby", "tech", "study", "culture"], p = [...U.shuffleSeed === 0 ? d : d.map((F, G) => d[(G + U.shuffleSeed + e) % d.length])].sort((F, G) => U.weights[G] - U.weights[F]), w = [];
  let S = true, N = 0;
  for (; S; ) {
    S = false;
    for (const F of p) h[F] && N < h[F].length && (w.push(h[F][N]), S = true);
    N++;
  }
  return w;
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
        <div class="card-media-wrap">
          <img
            src="${e.imageUrl}"
            alt="${e.title}"
            class="card-media-img"
            loading="lazy"
            onerror="this.src='https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80'"
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
function xv() {
  const i = document.getElementById("infiniteScrollSentinel"), e = document.getElementById("infiniteElasticContainer");
  if (!i) return;
  "IntersectionObserver" in window && new IntersectionObserver((s) => {
    s.forEach((o) => {
      o.isIntersecting && !U.isLoadingInfinite && U.currentTab === "viewFeed" && nf();
    });
  }, { root: null, rootMargin: "140px 0px 80px 0px", threshold: 0.05 }).observe(i);
  let t = 0, n = false;
  window.addEventListener("touchstart", (r) => {
    if (U.currentTab !== "viewFeed" || U.isLoadingInfinite) return;
    const s = window.innerHeight + window.scrollY, o = document.documentElement.scrollHeight;
    s >= o - 50 ? (t = r.touches[0].clientY, n = true) : n = false;
  }, { passive: true }), window.addEventListener("touchmove", (r) => {
    if (!n || U.isLoadingInfinite || !e) return;
    const s = r.touches[0].clientY, o = t - s;
    if (o > 6) {
      const c = Math.min(105, Math.pow(o, 0.76) * 2.1);
      e.classList.add("pulling"), e.style.maxHeight = `${c}px`, e.style.transform = `translateY(0) scale(${Math.min(1.02, 0.93 + c * 9e-4)})`, c > 32 && Math.floor(o) % 24 < 6 && X("light");
    }
  }, { passive: true }), window.addEventListener("touchend", (r) => {
    if (!n || U.isLoadingInfinite || !e) return;
    n = false, (parseFloat(e.style.maxHeight) || 0) >= 45 ? nf() : (e.classList.remove("pulling"), e.style.maxHeight = "", e.style.transform = "");
  }, { passive: true });
}
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
    nC(), X("light"), hf(), tt(), Yn && of(Yn), xe(P("toast.langSwitched")), Jt.syncToFirestore();
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
    } catch {
      X("error"), xe(P("auth.loginFailed"));
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
  }), bv(($) => {
    Dp($), bp(), $ && !$.isAnonymous && (Dv($.uid).then((ce) => {
      ce ? (U.weights = { ...U.weights, ...ce }, an(), tt()) : hp($.uid, U.weights);
    }), Jt.syncToFirestore());
  }), document.querySelectorAll(".tab-btn").forEach(($) => {
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
