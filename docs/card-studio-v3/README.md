# 맘고리즘 카드 스튜디오 V3 — Work 협업 웹 버전

작업 브랜치: feat/card-studio-v3-web
기준 브랜치: feat/ai-card-studio-v2
상태: 코드 작성 완료 / 실제 전체 Vite 빌드, Vercel 배포, Work 브라우저 접속은 아직 미검증.

## 주요 기능

- Work 또는 ChatGPT가 원문을 읽고 작성한 JSON을 한 번에 붙여넣어 카드 텍스트 전체에 반영
- 카드마다 URL·분야·원본 제목을 담은 Work 지시문 생성 및 복사
- CSV에서 후보 불러오기 또는 한국어 위키백과 URL로 새 기사 카드 직접 추가
- 고정된 카드 열람 템플릿에서 제목·추천 이유·3줄 요약·본문 섹션 직접 편집
- Wikimedia 대표 이미지 조회: 브라우저 CORS origin=* 사용
- 사용자 본인의 원문 확인, 이미지 출처·라이선스·저작자 표기, 검토 체크를 거쳐 수동 승인
- 검토 상태를 브라우저 localStorage에 저장하고 JSON 파일로 백업
- 승인된 카드만 개발용 JSON으로 내보내기
- JSON 붙여넣기 시 원본 URL·이미지 URL·출처·승인 상태는 자동 변경되지 않음
- 유료 OpenAI API 호출부와 비밀키는 V3 정적 빌드에서 완전히 제외

## 로컬 실행: Windows PowerShell

cd $HOME
git clone --branch feat/card-studio-v3-web --single-branch https://github.com/amlyhbf/my-gorithm.git my-gorithm-studio-v3
cd .\my-gorithm-studio-v3
npm.cmd ci
npm.cmd run dev:studio:v3

브라우저 주소:
http://127.0.0.1:5173/tools/card-studio-v3.html

로컬 API 서버가 필요 없는 정적 화면입니다. ChatGPT Plus와 별도의 API 결제 없이 사용할 수 있습니다.

## 테스트

npm.cmd run test:studio:v3
npm.cmd run test:content
npm.cmd run test:feed
npm.cmd run build:studio:v3

V3 서버를 실행한 채 다른 PowerShell에서:
npm.cmd run test:studio:v3:browser

Playwright Chromium이 설치되어 있어야 합니다. 테스트 코드를 작성한 것과 실제 테스트 통과는 별도입니다.

## Vercel 새 프로젝트 배포

기존 mamgorithm-v44-test 인트로 테스트 프로젝트를 건드리지 말고 반드시 별도 Vercel 프로젝트를 사용하세요.

새로 복사한 my-gorithm-studio-v3 폴더에서 다음 명령을 실행하세요.

npx.cmd vercel

처음 배포 시 프로젝트 새로 만들기를 선택하고, 예시 이름은 mamgorithm-card-studio-v3 로 합니다.
기존 Vercel 프로젝트에 연결하지 마세요.

브랜치의 vercel.json이 적용되어 다음과 같이 동작합니다.
- Build Command: npm run build:studio:v3
- Output Directory: dist-card-studio-v3
- 루트 페이지 / 요청을 /tools/card-studio-v3.html 로 연결
- noindex/nofollow 및 CSP, X-Content-Type-Options 등 보안 헤더
- Vite publicDir:false, 단일 V3 HTML 엔트리만 빌드하여 Firebase 원본 메인 UI/기존 인트로 자산 및 로컬 유료 API 서버 제외

Vercel 배포 후 발급되는 실제 HTTPS 주소를 Work에 전달하면 Work 클라우드 브라우저가 접근할 수 있습니다. 배포 URL이 확인되기 전에는 게시 완료로 기록하지 마세요.

## Work 협업 방법

1. Work가 Vercel 배포 V3 URL에 접속.
2. 같은 Work 브라우저에서 CSV 업로드하거나 '새 카드 직접 만들기'에서 한국어 위키백과 URL 입력.
3. 현재 카드에 표시되는 Work 지시문을 바탕으로 원본 페이지를 직접 읽고 JSON 카드 작성.
4. 완성한 JSON을 'Work가 작성한 카드 JSON 전체 붙여넣기'에 입력.
5. 'JSON 검사 후 카드 전체 채우기' 클릭.
6. 기존 카드 열람 화면에서 제목·요약·본문을 사람이 검토·수정.
7. 원문 링크 및 이미지 이용 조건을 직접 확인하고 승인.
8. Work 브라우저의 '검토 JSON 백업' 또는 '승인 카드 내보내기'로 생성된 파일을 다운로드하여 사용자 PC로 옮김.

Work 브라우저와 사용자의 PC는 각기 다른 localStorage를 사용합니다. 웹사이트 주소가 같아도 편집 데이터가 자동 동기화되는 것은 아닙니다.
로컬 저장만 제공하고 서버에 사용자별 기록을 보관하지 않으므로, 브라우저 세션이 삭제되기 전에 JSON 백업을 반드시 저장하세요.

## 저작권·정확성·보안

- ChatGPT 또는 Work가 작성한 문장은 원문과 대조한 뒤 사용해야 합니다.
- 원본 기사와 이미지의 이용 허락 조건을 검토해야 합니다. 위키 이미지라고 해서 사용 허락이 자동으로 검증되는 것은 아닙니다.
- AI가 만든 카드 JSON의 title, summary, recommendationReason, keyPoints, sections만 적용합니다. 원본 URL·출처·이미지·승인 여부는 AI가 변경하지 못합니다.
- 업로드한 후보 CSV 원본 파일 자체는 이 개발 브랜치에 게시되지 않았습니다.
- Vercel 사이트는 누구나 열 수 있는 공개 URL입니다. noindex는 인증을 대신하지 않습니다.
- API 키, 개인정보, 비공개 팀 문서, 결제 정보는 올리지 마세요.

## 상태 분리

- V3 GitHub 코드 작성: 완료
- JSON 파서·원본 필드 보호 부분 단위 검증: 일부 통과
- 전체 Vite 빌드 및 브라우저 통합 테스트: 미검증
- Vercel 실제 배포: 미완료
- Work 실제 브라우저 자동 입력: 미검증
- 신규 콘텐츠 32개 실제 등록: 미완료
- 원본 Firebase 운영 사이트나 기존 V4.4 Vercel 인트로 테스트 사이트: 미변경
