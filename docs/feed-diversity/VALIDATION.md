# 추천 피드 V1 검증 결과 — 2026-10-30

결과: 로컬 전체 빌드와 요청된 자동화 검증 완료. 추천 배분 오류 1건 수정. 운영 배포 및 main 병합 없음.

대상은 `amlyhbf/my-gorithm`의 `feat/feed-diversity-v1`, 검토 시작 SHA는 `7e5e5ce6c1a187769c814545fed02474c952127c`.
기준 `feat/intro-web-integration` SHA는 `80589bf2e6bbb923bb49e6f7442cc367ce16c631`이며 대상이 11개 커밋 앞서 있었음.
요청한 7개 파일과 package 설정, Firebase 초기화 및 기존 인트로 연동을 검토함.

## 실제 실행 결과

| 명령 | 결과 | 증거 |
| --- | --- | --- |
| `npm ci` | 성공, 잠금 파일 기준 102개 패키지 설치 | package-lock 변경 없음 |
| `npm run test:feed` | 성공 | [로그](validation/unit-after.txt) |
| `node tests/feed-engine.test.mjs` | 8/8 성공, 기존 7개 + 배분 회귀 1개 | 위 로그 후반 |
| `npm run build` | 성공, 27개 모듈 변환 | [로그](validation/build-after.txt) |
| `CHROMIUM_PATH=/usr/bin/chromium npm run test:feed:browser` | 성공 | [로그](validation/browser-after.txt) |
| `CHROMIUM_PATH=/usr/bin/chromium npm run test:intro` | 11/11 성공 | [로그](validation/intro-after.txt), [JSON](validation/intro-results.json) |
| `git diff --check` | 성공 | 커밋 전 검사 |

환경: [Node/Playwright/Vite/Chromium 버전](validation/versions.txt). 개발 서버는 `127.0.0.1:5173`에서 실행.
이 환경의 `node --test` 출력은 파일 단위 1건으로 집계되어, 같은 테스트 파일 직접 실행 결과 8개도 함께 저장함.
빌드에는 500 kB 초과 번들 경고가 남음(약 750 kB, gzip 약 202 kB). 빌드 실패는 아님.

## 발견한 오류와 수정

1. **관심도 배분 잔여 카드 편중**
   - 재현: 가중치 공부/기술/문화/취미 `10/20/30/40`, 재고 `8/9/7/8`, 요청 12.
   - 기존 결과 `1/2/3/6`, 최대 나머지 방식의 기대 결과 `1/2/4/5`.
   - 원인: 잔여 2장 중 첫 장을 취미에 준 뒤 비율을 다시 계산해 취미를 다시 선택함.
   - 수정: 정렬된 나머지 순으로 분야마다 한 장씩 배정한 뒤 재고가 제한된 경우에만 다음 라운드에서 재계산.
   - `feed-engine.js` 최소 수정, `tests/feed-engine.test.mjs` 회귀 검사 추가.
   - [시작 커밋에서 실제 재현한 입력/결과](validation/allocation-reproduction.json).

2. **브라우저 테스트의 재방문 전제 오류**
   - 기존 테스트는 이미 전체 32개를 표시한 뒤 처음 12개와 겹치지 않아야 한다고 요구함.
   - 기존 설계는 전체 소진 후 오래전에 표시한 콘텐츠를 다시 추천하므로 실제로 처음 12개가 돌아왔음.
   - 미노출 카드가 남은 첫 12장 직후 새로고침에서 중복 0을 검사하고,
     32개 소진 후에는 마지막에 추가한 8개보다 이전 카드가 먼저 나오는지 별도로 검사함.
   - 중복 없는 12→24→32, 재방문 12개 검사는 유지. 검증을 삭제하거나 허용 중복 수를 늘리지 않음.
   - [원래 검사 실패 로그](validation/browser-before.txt).

3. **브라우저 테스트의 모호한 필터 선택자**
   - `[data-type="video"]`는 필터 버튼과 영상 카드 모두에 해당해 strict mode 오류 발생.
   - `.type-pill[data-type="video"]`로 버튼 범위를 한정하고 기사 필터도 검증함.
   - 제품 코드의 필터 동작 변경은 없음.

제품 코드 변경은 `feed-engine.js`뿐이며, UI 파일 `script.js`, `index.html`, `style.css`의 기존 구현은 유지함.

## 사용자 경험 검증

- 균형: 초기 12 → 더 보기 24 → 다시 32, 각 단계 ID 중복 0, 마지막 버튼 숨김.
- 재방문: 12장 직후 새로고침은 기존 12개와 중복 0. 전체 소진 후 최근 추가분보다 오래된 카드 우선.
- 공부 전용: 프리셋 및 실제 믹서 슬라이더 키보드 조작으로 공부 100/나머지 0 설정, 공부 8개만 표시, 더 보기 숨김.
- 단위 검사: 재고 부족 할당 재조정, 전체 0%, 유형 필터, 중복 ID 입력, 최근 이력 갱신 검증.
- 관심도/프리셋: 저장 값과 실제 카드 수 검증. 믹서를 열어 슬라이더에 Home/End 키 입력 후 피드 적용.
- 영상/기사 필터: 해당 유형 카드만 표시되는지 확인.
- 북마크: 저장 → 새로고침 → 보관함 표시 → 해제 → 저장 값에서 제거 확인.
- 통계: 32개 표시 시 분야별 현재 표시 카드 수 합계 32 확인.
- 테마: 다크·라이트 전환 및 저장 값 확인, PC/모바일 화면 저장.
- 레시피: 공유 버튼의 클립보드 API를 테스트 대역으로 받아 URL을 검증하고 해당 URL로 재진입해 공부 8개 확인.
- 인트로: 실제 라이트/다크 16초 재생, 첫 방문 온보딩, 탭/키보드 건너뛰기, 다시 보기의 설정·초점·스크롤 보존,
  reduced motion, 재생 거절/오류/정지, 저장소 차단, 포스터 오류, 공유 레시피, 작은 가로 화면 모두 통과.
- 자동화에서 확인한 런타임 오류 없음. 기존 기능과 피드 변경의 충돌은 검증 범위에서 발견하지 못함.

## 안전한 격리 및 중단 진단

모든 브라우저 컨텍스트가 로컬 서버와 다른 origin의 요청을 Playwright route에서 차단함.
운영 Firebase 익명 인증·Firestore 요청, 외부 이미지·영상 서비스 요청도 차단됨. 운영 데이터 쓰기/읽기 검증 없음.
실제 Firebase 파일이나 MP4, intro.js/intro.css는 수정하지 않았음.

초기 Git/설치/서버 오류는 샌드박스 네트워크·포트 제한(EPERM/프록시 연결 실패)이었으며,
명령별 추가 네트워크 권한으로 해결함. 샌드박스 해제나 보안 설정 변경은 하지 않음.
두 차례 중단은 도구가 `aborted by user`를 반환한 기록이며, 응답 완료로 턴을 종료한 기록은 아님.
승인 창 취소인지 일반 실행 취소인지는 도구 기록으로 구분할 수 없음. 현재 검증에 남은 승인 대기나 환경 차단 없음.

첫 인트로 실행은 모바일 최종 버튼 대기 40초 초과로 10/11 성공.
동일 모바일 조건의 [재생 계측](validation/intro-probe.txt)은 16초 정상 종료를 확인했고,
테스트·인트로 코드·타임아웃을 바꾸지 않은 전체 재실행에서 11/11 성공함.
최초 지연의 근본 원인은 확정하지 못했으며, 일시 실패 기록을 [보존](validation/intro-before.txt)함.

## 이번 실행에서 생성한 스크린샷

| 화면 | 모바일 | PC |
| --- | --- | --- |
| 라이트 피드 | [보기](screenshots/mobile-light-feed.png) | [보기](screenshots/desktop-light-feed.png) |
| 다크 피드 | [보기](screenshots/mobile-dark-feed.png) | [보기](screenshots/desktop-dark-feed.png) |
| 통계 | [보기](screenshots/mobile-stats.png) | [보기](screenshots/desktop-light-stats.png) |
| 더 보기 | [보기](screenshots/mobile-load-more.png) | — |
| 믹서 / 공부 전용 | [믹서](screenshots/mobile-mixer.png), [8장 조건](screenshots/mobile-study-only.png) | — |
| 북마크 | [보기](screenshots/mobile-bookmarks.png) | — |
| 인트로 | [재생](screenshots/intro-mobile-playing.png), [종료](screenshots/intro-mobile-final.png), [온보딩](screenshots/intro-mobile-onboarding.png) | [다크 종료](screenshots/intro-desktop-dark-final.png) |

스크린샷은 외부 이미지 요청을 차단한 격리 환경에서 촬영했으므로 빈 이미지/대체 텍스트가 포함됨.
한 화면에 32장을 모두 담는 대신 DOM 개수·고유 ID로 확인함. 이전 검증 문서의 캡처를 새 결과로 재사용하지 않음.

## 남은 수동 확인 / 미검증

- 실제 iOS Safari/Android Chrome 기기의 터치 드래그·영상 정책·모바일 OS 공유 시트. 자동화는 Chromium 데스크톱/모바일 에뮬레이션임.
- 실제 클립보드와 OS 네이티브 공유 성공 여부. URL 생성과 재적용은 검증했으나 공유 API는 테스트 대역 사용.
- 외부 썸네일, YouTube 임베드, 기사 원문 서비스의 실제 가용성.
- 운영 Firebase 동기화, 여러 기기/계정 간 동기화. 운영 데이터 보호를 위해 의도적으로 미검증.
- 인트로 최초 시간 초과의 확정 원인. 동일 현상 발생 시 기기/브라우저 버전과 재생 시간을 기록할 것.
- 32개 카탈로그를 모두 소진하면 오래된 카드가 다시 나오는 것은 현재 설계임. 최근 이력은 로컬 브라우저 기준이며 장기 노출 횟수 통계가 아님.

직접 확인 순서: 시크릿 첫 방문 인트로→온보딩→균형 12/24/32→첫 12개 직후 별도 새로고침→공부 전용 8개→
영상/기사→북마크 저장/새로고침/해제→다크/라이트→레시피 공유와 새 탭 적용→통계와 표시 카드 수 비교.
운영 데이터를 건드리지 않으려면 동일한 외부 요청 차단 테스트 환경을 사용할 것.
