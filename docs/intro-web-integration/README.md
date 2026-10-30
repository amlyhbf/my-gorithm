# V4.4 인트로 웹 연동 검토 보고

검증일: 2026-10-30 (한국 시간). 운영 배포 없이 별도 브랜치에 보존한 구현입니다.

## 작업 기준과 운영 코드 확인

- 작업 저장소: `amlyhbf/my-gorithm`
- 개발 브랜치: `feat/intro-web-integration`
- 원본 `kaeruru/my-gorithm/main`과 복사본 `amlyhbf/my-gorithm/main`의 최신 커밋은 모두 `519b1890be360f94813c5c2664178ddae1399aaa`였습니다. 동일 커밋에서 새 브랜치를 생성했습니다.
- 운영 사이트에는 GET 요청만 보냈습니다. 운영 JS와 CSS는 위 main을 현재 의존성으로 빌드한 결과와 SHA-256이 각각 일치했습니다.
  - JS `/assets/index-B5NMuB2N.js`: `4eb9848691b70b322bec138531c62987916d63ffa351c9b822a3a4b03fc7b2e8`
  - CSS `/assets/index-BD-nOHKT.css`: `83cf71353ea6478920a66436ea8e8cff2d11fb212fb8a93d095e53cbdbe34b91`
- 애니메이션 브랜치는 병합하지 않았습니다. 아래 네 자산만 `feat/rive-intro-v4-4`의 커밋 `ec977fb7754fc472dbb7b80ec4958b2fa41b9005`에서 복사했습니다.
- 원본 저장소, main, V4.4 원본, Firebase 설정과 사용자 데이터는 변경하지 않았습니다. Firebase Hosting 및 Sites 배포를 실행하지 않았습니다.

## 변경 파일과 동작

| 파일 | 변경 |
| --- | --- |
| `intro.js` | 독립 인트로 재생 및 정적 화면, 건너뛰기 타이머, 접근성·포커스·스크롤 복원, 첫 방문/다시 보기 구분 |
| `intro.css` | 전체 화면 모달, 9:16 비율 유지, 테마 배경, 안전 영역, 버튼 표시·숨김, 움직임 감소 대응 |
| `script.js` | 초기 온보딩 앞에 인트로 연결, 완료 후 기존 온보딩/피드 진입, 다시 보기 이벤트 연결 |
| `index.html` | 통계·설정에 ‘인트로 다시 보기’ 버튼 추가 |
| `public/intro/` | 승인된 MP4 두 개와 마지막 프레임 포스터 두 개 |
| `package.json`, `package-lock.json` | 개발용 Playwright와 `test:intro` 실행 명령 추가 |
| `tests/intro.integration.cjs` | 실제 Chromium 재생·상호작용·오류 경로 회귀 테스트 |
| `docs/intro-web-integration/` | 이 보고서, 테스트 결과, 브라우저 스크린샷 |

`data.js`, `firebase.js`, `style.css`, `firebase.json`, `.firebaserc`는 수정하지 않았습니다. 추천 계산 함수, 기존 온보딩 슬라이더·프리셋·저장 로직도 변경하지 않았습니다.

### 첫 방문과 재방문

- `mamgorithm_intro_seen_v1`은 모달 표시 직후 기록합니다. 도중 새로고침/종료 시 영상을 강제로 반복하지 않습니다. 저장이 차단된 브라우저에서는 기록을 유지할 수 없어 다음 방문에 다시 나타날 수 있습니다.
- 기존 `mamgorithm_onboarded_v2`는 별도로 유지합니다. 인트로 재생·건너뛰기만으로 온보딩을 완료 처리하지 않습니다.
- 처음에는 인트로 → ‘내 알고리즘 만들기 →’ 또는 건너뛰기 → 기존 `openOnboarding()`으로 이동합니다. 온보딩 완료 사용자는 기존 피드 흐름을 따릅니다.
- 이미 인트로를 본 미완료 사용자는 바로 기존 온보딩을, 온보딩 완료 사용자는 기존 피드를 봅니다.
- 다시 보기는 설정을 유지하고 종료·건너뛰기·Escape 시 이전 화면·포커스·스크롤로 돌아갑니다. 마지막 버튼은 ‘돌아가기 →’입니다.

### 재생과 건너뛰기

- 기존 테마 상태에서 선택한 MP4 하나만 지정합니다. 기본 플레이어 UI와 반복 재생은 없으며 음소거·인라인 재생을 사용합니다.
- 영상 종료 시 이미 로드한 승인 포스터로 덮어 마지막 브랜드 화면을 유지합니다. 비디오를 처음으로 되감지 않습니다. HTML 시작 버튼은 원본 하단 여백(영상 높이의 85%)에 배치했습니다.
- 건너뛰기는 처음에 투명하고 포인터 이벤트를 받지 않습니다. 첫 터치 또는 마우스 움직임으로만 나타납니다. 실제 버튼 클릭만 영상을 건너뜁니다.
- 0.15초 등장, 마지막 상호작용 후 1.8초 대기, 0.2초 숨김. 반복 터치는 타이머를 갱신합니다. 마우스 hover 또는 키보드 포커스 동안은 숨기지 않습니다.
- Tab으로 숨겨진 버튼에 접근하면 표시되고 Enter로 실행됩니다. 네이티브 modal dialog가 배경 조작과 포커스 이탈을 제한합니다.
- 자동 재생 거부, 미디어 오류, 12초간 재생 진전이 없는 경우에는 정적 화면과 시작 버튼으로 전환합니다. 백그라운드 탭 시간은 정체로 계산하지 않습니다.
- `prefers-reduced-motion: reduce`에서는 MP4 source를 지정하지 않아 영상 다운로드도 하지 않습니다. 포스터까지 실패하면 HTML 브랜드 제목과 슬로건, 시작 버튼이 남습니다.

## 승인 자산 무변경 확인

다크·라이트 MP4 모두 ffprobe로 16.000초, 1080×1920, 60FPS임을 확인했습니다. 아래 Git blob 해시는 원본 브랜치와 동일합니다. 재렌더링하지 않았습니다.

| 대상 경로 | Git blob SHA |
| --- | --- |
| `public/intro/intro-v4-4-dark.mp4` | `24a8eb5f775d4fb95a3b1628f610c75318bcf5f3` |
| `public/intro/intro-v4-4-light.mp4` | `cec373bb2d5dc12ab40b74df983d2ed71bcbe8bb` |
| `public/intro/poster-dark.png` | `d601cc124dac8e6b50ae72578bf0c66be3cff332` |
| `public/intro/poster-light.png` | `b3950319d63c679dd07c64f779a81d59926295e1` |

## 직접 수행한 검증

`npm run build` 성공. 기존 main에서도 발생하는 500 kB 초과 번들 경고는 남아 있습니다. `git diff --check` 통과.

Chromium 실제 브라우저 자동화 11개 시나리오 모두 통과했습니다. 테스트는 모바일 크기 390×844, PC 1440×900, 가로 화면 844×390을 사용했습니다. 비디오는 mock하지 않고 다크·라이트 MP4 모두 처음부터 자연 종료까지 재생했습니다. 오류 시나리오에만 play 거부/네트워크 실패/정체를 주입했습니다.

| 시나리오 | 결과 |
| --- | --- |
| 첫 방문, 라이트 실제 재생, 음소거·인라인·재생바 없음 | 통과 |
| 정상 ended 이벤트, 마지막 프레임 유지, HTML 시작 버튼 | 통과 |
| 시작 버튼 → 기존 기본값 50/50/50/50 온보딩 → 12개 카드 피드 → 재방문 생략 | 통과 |
| 첫 터치로 표시만, 자동 숨김, 재터치 타이머 갱신, 버튼 터치로만 건너뛰기 | 통과 |
| Tab/Enter, hover/포커스 시 유지, 도중 새로고침 시 인트로 생략 | 통과 |
| 다크 실제 재생, 설정 다시 보기, 이전 화면·포커스·스크롤 복귀 | 통과 |
| 북마크·기존 가중치 유지, 셔플 12개 카드, 기존 프리셋 및 테마 버튼 조작 | 통과 |
| 움직임 감소, 자동 재생 거부, MP4 로딩 실패, 재생 정체 대체 화면 | 통과 |
| 공유 URL `?s=80&t=35&c=20&h=65`의 온보딩 값·저장 값·URL 보존 | 통과 |
| 저장소 및 포스터 실패에서도 정적 브랜드와 온보딩 진입 가능 | 통과 |
| 짧은 가로 화면에서 9:16 유지 및 버튼이 화면 안에 배치 | 통과 |

상세 자동화 결과: [test-results.json](test-results.json). 최종 빌드 미리보기 검사: [build-smoke.json](build-smoke.json).

테스트 중 모든 외부 네트워크 요청을 차단했습니다. Firebase 익명 가입·Firestore 쓰기와 콘텐츠 외부 링크 호출을 수행하지 않았습니다. 클라우드 데이터 연동 보존은 `firebase.js` 무변경으로 확인했으며 실제 운영 데이터 읽기/쓰기는 검증하지 않았습니다.

## 브라우저 스크린샷

- [모바일: 실제 영상 재생](screenshots/mobile-playing.png)
- [모바일: 마지막 브랜드 화면과 시작 버튼](screenshots/mobile-final.png)
- [모바일: 기존 온보딩](screenshots/mobile-onboarding.png)
- [모바일: 온보딩 완료 후 추천 피드](screenshots/mobile-feed.png)
- [PC: 건너뛰기 버튼](screenshots/desktop-skip.png)
- [PC: 다크 마지막 화면과 돌아가기 버튼](screenshots/desktop-dark-final.png)
- [PC: 최종 빌드 라이트 마지막 화면](screenshots/desktop-light-final.png)
- [가로 화면: 브랜드와 시작 버튼](screenshots/landscape-final.png)

## 재현 방법

```sh
npm ci
npx playwright install chromium
npm run dev -- --host 127.0.0.1
```

별도 터미널:

```sh
npm run test:intro
npm run build
npm run preview -- --host 127.0.0.1
```

기존 시스템 Chromium을 쓰려면 `CHROMIUM_PATH=/usr/bin/chromium npm run test:intro`. 다른 포트의 미리보기에는 `TEST_BASE_URL=http://127.0.0.1:4173`을 지정할 수 있습니다. 테스트는 별도 브라우저 컨텍스트와 로컬 저장소를 사용합니다.

## 확인 한계 및 운영 통합 전 검토

- 모바일 스크린샷은 Chromium의 터치·모바일 에뮬레이션입니다. 실제 iPhone Safari와 Android Chrome에서의 자동 재생, 안전 영역, 주소창 높이 변화는 아직 확인하지 않았습니다.
- Safari/WebKit·Firefox, 실제 스크린리더·스위치 제어는 실행하지 않았습니다. 최신 브라우저의 네이티브 dialog 지원을 전제로 합니다.
- 코치마크의 첫 진입·닫기는 브라우저에서 확인했으나 모든 안내 단계, 모든 북마크/콘텐츠 데이터 조합 및 Firebase 실데이터 연동은 전수 테스트하지 않았습니다. 해당 기존 구현은 보존했습니다.
- 정체 대체 화면은 12초를 기준으로 합니다. 실제 저속 모바일 네트워크에서 초기 로딩 체감과 이 기준이 적절한지 확인하세요.
- 실제 기기에서 마지막 프레임 전환·하단 버튼 위치와 터치 건너뛰기 UX를 윤현석 담당자와 검토하세요.
- 승인 후 별도 코드 리뷰와 기존 기능 회귀 확인을 거쳐 운영 통합을 진행하세요. 이 작업에서는 main 병합이나 배포를 하지 않았습니다.
