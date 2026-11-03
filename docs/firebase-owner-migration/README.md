# 본인 소유 Firebase 프로젝트로 이전

## 대상

- 기존 프로젝트: `my-gorithm` (변경하지 않음)
- 새 프로젝트: `mamgorithm`, 표시 이름 `Mamgorithm`
- 새 프로젝트 소유 계정: 사용자가 Firebase 콘솔에서 선택한 Google 계정
- 요금제: Spark (무료), 결제 계정 연결 및 요금제 업그레이드 없음
- 새 웹 앱: 맘고리즘 웹 (`1:984165040136:web:394f53bd9b18a0ac16d1bd`)
- 웹 호스팅 사이트 ID: `mamgorithm` (콘텐츠 배포는 아직 안 함)

## 완료된 설정

- 새 Firebase 프로젝트 및 웹 앱 생성
- 선택 기능인 Google 개발자 프로그램 추가 가입, Gemini, Google 애널리틱스 비활성화로 생성
- Authentication의 익명 로그인 활성화 확인
- 기본 Standard Firestore 데이터베이스를 사용자 승인 후 서울 `asia-northeast3`에 생성
- 사용자 본인 문서만 읽고 쓸 수 있도록 prototype 규칙 게시 및 Firebase 콘솔 구문 검사 통과
- 콘솔 규칙 플레이그라운드 확인: 비로그인 읽기 거부, 본인 읽기 허용, 타인 읽기 거부
- 이 브랜치의 `.firebaserc`와 `firebase.js`를 새 프로젝트로 연결
- 기본 추천 테스트 8개 및 Vite 빌드 통과

## 아직 완료되지 않은 작업

- Firestore 쓰기·업데이트·스키마 위반 자동 검증: Java 21 이상이 필요한데 현재 환경은 Java 17이어서 에뮬레이터 실행이 차단됨. 쓰기 규칙을 완전히 검증했다고 판단하면 안 됨.
- 기존 데이터 확인 및 필요한 데이터 복사
- 새 Hosting 사이트에 콘텐츠 배포와 실제 접속 검증
- 이 브랜치의 main 반영

## 이전할 데이터 구분

- 콘텐츠 카드 32개: `data.js`에 포함되어 코드와 함께 이전됨.
- 개인 관심도: 브라우저 localStorage의 `mamgorithm_weights_v2`에 저장되며, 익명 로그인 시 `users/{uid}` 문서로도 저장됨.
- 북마크와 테마: 브라우저 localStorage에 저장됨. 다른 도메인으로 이동하면 자동으로 전달되지 않음.
- Firebase 익명 계정 UID와 브라우저 로그인 세션: 새 프로젝트에서 자동으로 연결되지 않음. 기존 문서를 복사하는 것만으로 개인 설정 복원이 보장되지 않음.
- `customCards`: Firebase 헬퍼 함수는 있으나 현재 메인 화면은 `data.js`의 카드 목록을 사용함. 기존 클라우드에 카드가 있는지는 추가 확인이 필요함.

기존 데이터나 사이트를 삭제하지 않는다. 개인 설정을 복사할 때는 소유자의 접근 권한을 유지하며, 새 UID에 임의로 다른 사용자의 설정을 연결하지 않는다.

## 배포 명령 (로그인 및 프로젝트 설정 완료 후)

```bash
npm ci
npm run test
npm run build
npx -y firebase-tools@latest deploy --only hosting --project mamgorithm
```

현재 실행 환경의 Firebase CLI에는 로그인된 계정이 없다. Google 브라우저 인증과 CLI 로그인은 별개다. 콘솔의 Cloud Shell도 이 브라우저에서는 `Site Unavailable`로 열리지 않아 아직 배포에 사용하지 못했다.

## 적용된 규칙의 범위와 한계

`users/{uid}`의 본인 문서만 읽기·생성·업데이트를 허용한다. 문서 필드는 `weights`, `updatedAt`만 허용하고, 관심도 맵은 4개 분야의 0~100 정수만 허용한다. 클라이언트 삭제와 다른 컬렉션 접근은 거부한다. `customCards`는 현재 화면에서 사용하지 않으므로 검토 전 클라이언트 접근을 허용하지 않았다.

I've set up prototype Security Rules to keep the data in Firestore safe. They are designed to be secure for private interest settings by restricting access to the document owner, validating both creates and updates, and denying unrecognized fields and paths. However, you should review and verify them before broadly sharing your app. If you'd like, I can help you harden these rules.

현재 로그인된 계정의 프로젝트 목록에서 원본 `my-gorithm` 프로젝트는 확인되지 않았다. 원본 프로젝트의 Firestore 콘솔에 직접 접속해도 "프로젝트가 존재하지 않거나 프로젝트의 앱을 나열할 권한이 없습니다."가 표시됐다. 기존 클라우드 데이터를 읽거나 복사하지 않았으며, 삭제·덮어쓰기도 하지 않았다. 새 프로젝트 데이터베이스는 아직 사용자 데이터를 이관하지 않은 상태다.
