# Firebase 통합 전환 준비 · 2026-11-10

## 결과

원본 Firebase 프로젝트 `my-gorithm`에 배포할 통합본을 준비했습니다. 운영 Hosting·사용자 DB·기존 main은 변경하지 않았습니다. Firebase CLI `login:list --non-interactive` 결과 연결된 배포 계정이 없어 최종 배포는 아직 실행할 수 없습니다.

- 기사 65개 + 영상 8개 = 73개. 공통 64개의 승인된 해설·이미지와 현석 개발본의 추가 9개를 보존합니다.
- 19초 인트로, 관심사 설정 인터랙션, 출처, 이미지 최적화, YouTube 썸네일, 하단 당겨 새 추천 받기, 언어 전환, PWA를 유지합니다.
- **익명 로그인과 비회원 Firestore 수집을 복원했습니다.** `users/{uid}`의 기존 지표 구조를 사용합니다. 인증 전 로컬 임의 ID로는 DB에 쓰지 않습니다.
- 익명 UID의 관심사·북마크 저장 및 재접속 복원, 오프라인 후 재전송을 확인했습니다.
- 초기 설정을 읽기 전에 지표 일부를 먼저 쓰면 SDK의 임시 문서가 전체 설정처럼 보일 수 있는 문제를 수정했습니다. 최초 읽기를 마친 뒤 설정·지표를 쓰며, 읽기 실패 시 로컬 설정을 보존하고 지표 전송은 시도합니다.
- CSV·엑셀의 4분야 검토 가중치는 추천 계산에 적용하지 않습니다.

## 소스 기준과 편집

GitHub main `003a7d3cd4da4d736de39eb586bfbcc8259071b9`와 실제 운영 배포본에 차이가 있어, 실제 운영 UI(`index-D8c0-hb2.js`, SHA256 `66b2028c3501da36db84454b9eab4ac078a298262f7240634fcddf0e7f8288a3`)와 공개 통합본을 기준으로 정리했습니다.

SDK를 배포 파일에서 복제하지 않고 `firebase` 패키지에서 직접 가져옵니다. `firebase.js`는 기존 프로젝트 설정과 SDK 연결, `integration/runtime.js`는 익명 인증·저장·추적의 추가 동작입니다. `content/cards.json`에서 기사와 출처를 편집합니다. `integration/upstream/ui.js`는 SDK 부분을 뺀 고정 운영 UI이며 함수 이름은 배포물의 축약 이름을 유지합니다. `integration/prepare-source.cjs`가 이를 반영해 루트 `script.js`, `data.js`, `index.html`, `style.css`를 생성합니다. 생성된 파일을 직접 바꿀 경우 다음 빌드에서 덮어써지므로 생성 원본을 수정합니다.

GitHub 도구의 바이너리 업로드 제약 때문에 새 미디어 파일은 Git 소스에 SHA256 목록으로 기록합니다. `integration/prepare-assets.cjs`가 기존 공개 통합본에서 68개 자산을 내려받아 크기와 해시를 검증합니다. 소스 ZIP에는 이 미디어 파일도 포함하므로 내려받을 필요 없이 빌드할 수 있습니다. 운영 배포 결과에는 미디어 실파일이 들어가며 실행 중 Sites에서 이를 가져오는 구조가 아닙니다. 이후 공개 통합본을 폐쇄하려면 이 미디어를 원본 저장소나 별도 보관소에 먼저 보존해야 합니다.

```
npm ci
npm run build
node integration/verify-release.cjs
```

`npm run build`는 미디어 검증·소스 생성·Vite 빌드를 수행합니다. `dist/release.json`으로 운영/에뮬레이터 빌드를 구분하며, 배포 검증기는 에뮬레이터 빌드를 거부합니다. 배포 대상은 `.firebaserc`의 `my-gorithm`입니다. `firebase.json`에는 Hosting 설정만 있으며 운영 Auth 제공자나 Firestore 규칙을 변경하지 않습니다.

## 최종 배포에 남은 단계

Firebase 계정이 연결된 환경에서:

```
npx --yes firebase-tools login
npm run deploy
```

`npm run deploy`는 운영 빌드를 검증하고 **`--only hosting --project my-gorithm`**으로 배포합니다. 이미 준비된 배포 ZIP을 사용하는 경우 압축을 푼 폴더에서:

```
node integration/verify-release.cjs
npx --yes firebase-tools deploy --only hosting --project my-gorithm
```

배포 후 기존 주소에서 익명 기록 적재와 Google 로그인·기기 간 설정/북마크 복원을 실제 계정으로 확인해야 합니다. 기존 주소는 Firebase Auth에 이미 허용되어 있습니다. Sites 주소를 추가하는 설정은 이 전환에 필요하지 않습니다.

## 실제 검증

- `anonymous-browser-results.json`: Firebase Auth·Firestore **실제 에뮬레이터**에서 가입→익명 UID→지표/관심사/북마크 저장→재접속 복원→삭제→오프라인 재전송을 검증했습니다. 다른 익명 UID의 접근 거부도 에뮬레이터 전용 규칙으로 확인했습니다.
- `anonymous-sync-results.json`: 초기 인증 중복 방지, 실패 후 재시도, 지연 응답·로그아웃 경합, 읽기 실패 시 설정 보존을 검증했습니다.
- `merge-results.json`: 전체 카드 데이터, 리더, 이미지 56개, 언어, 기기 저장, 공유 비율, 테마·키보드를 검증합니다.
- `bottom-refresh-results.json`: 실제 Chromium 터치 입력으로 당기기·취소·역방향·다중 터치·필터 유지·키보드·모션 감소를 검증합니다.
- `merge-pwa-results.json`: 첫 이용/19초 인트로, 설치 아이콘, 캐시한 셸의 오프라인 접속, iPhone 사용자 에이전트 설치 안내를 검증합니다.
- 추천 함수 단위 테스트 8개도 통과했습니다.

에뮬레이터 프로젝트는 `demo-mamgorithm-merge`이며 운영 DB 쓰기는 0건입니다. 에뮬레이터 규칙은 `tests/integration/firestore.test.rules`에만 있고 운영 규칙 검증/변경을 의미하지 않습니다. 실계정 Google 로그인, 실물 Safari, 운영 보안 규칙 및 관리자 배포 권한은 미검증입니다. Vite의 500KB 초과 번들 경고가 남아 있으며 빌드 실패는 아닙니다. 기존 `tests/intro.integration.cjs`, `tests/session10.browser.cjs`는 이전 main의 UI 구조를 대상으로 하므로 이번 검증 결과에 포함하지 않았습니다.

에뮬레이터 실행 방법:

```
npx --yes firebase-tools emulators:start --only auth,firestore --project demo-mamgorithm-merge --config tests/integration/firebase.emulators.json
npm run build:emulator
python -m http.server 4177 --directory dist
node tests/integration/anonymous-browser.cjs
```

별도 터미널에서 서버를 실행한 다음 브라우저 검증을 실행합니다. `npm run build`로 운영 빌드를 다시 만든 뒤에만 배포합니다.

## 보존·복구

원본 main은 그대로이며 작업은 별도 브랜치에 있습니다. 공개 운영 HTML·CSS·JS·16초 인트로·설치 자산 15개를 내려받은 복구 ZIP과 파일별 SHA256을 별도로 준비했습니다. 운영 Hosting 전환 후에는 Firebase Hosting의 이전 배포로 롤백하거나 복구 ZIP을 Hosting에 배포할 수 있습니다. Hosting 롤백은 DB 기록을 되돌리는 작업이 아닙니다. 이번 작업에서 기존 DB 문서 수정/삭제/이관은 하지 않았습니다.
