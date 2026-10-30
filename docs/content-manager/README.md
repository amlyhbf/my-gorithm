# 맘고리즘 콘텐츠 관리 시스템 V1

기준 브랜치: feat/feed-diversity-v1
작업 브랜치: feat/content-manager-v1
**운영 사이트나 기존 Vercel 테스트 사이트에 카드를 자동 등록하지 않는 로컬 검토 도구입니다.**

## 실제 시험 자료
승민이의 맘고리즘_콘텐츠후보_2026-10-29(1).csv: 후보 32개, 전부 위키백과 기사형 읽을거리. 대표 분야 공부 10, 기술 11, 문화 7, 취미 4. 보조 분야 17개. 추천 이유와 썸네일 URL이 32개 모두 비어 있으므로 최초 승인 수는 0개가 정상입니다. 원본 CSV는 GitHub에 업로드하지 않았습니다.

## 로컬 실행 (Windows PowerShell)
1. cd $HOME
2. git clone --branch feat/content-manager-v1 --single-branch https://github.com/amlyhbf/my-gorithm.git my-gorithm-content-preview
3. cd .\my-gorithm-content-preview
4. npm.cmd ci
5. npm.cmd run dev -- --host 127.0.0.1
6. 브라우저에서 http://127.0.0.1:5173/tools/content-admin.html 로 이동

**반드시 /tools/content-admin.html 에 접속하세요.** 이 도구는 firebase.js를 import하지 않고 원본 CSV를 서버에 자동 업로드하지 않습니다.

## 검토 절차
1. 콘텐츠 후보 CSV를 업로드합니다.
2. 제목·요약을 원문과 비교하고 필요한 부분을 다시 작성합니다.
3. 추천 이유와 HTTPS 썸네일 링크를 작성합니다.
4. 링크를 직접 열어 확인하고, 저작권·라이선스 및 출처 표기를 확인합니다.
5. 링크 확인, 내용 대조·재작성, 이용 조건 확인 체크박스를 모두 확인합니다.
6. 승인 버튼이 활성화되면 수동 승인하고, 아니면 보류 또는 검토 중 상태를 유지합니다.
7. 진행 중간마다 검토표 CSV를 백업합니다. 검토표를 다시 선택하면 상태·확인 체크·메모를 복구할 수 있습니다.
8. 승인된 카드가 있다면 승인 카드 JSON을 다운로드합니다.

브라우저 자동 저장은 동일 브라우저의 localStorage 기준으로만 동작합니다. 다른 PC로 옮기기 전에 검토표 CSV를 저장해야 합니다.

## 개발용 데이터 자동 변환
승인 JSON을 로컬 프로젝트 폴더에 넣고 아래 명령을 실행하세요.

    node tools/merge-approved-content.mjs .\mamgorithm-approved-cards.json

기본 모드에서는 tools/content-data.preview.js 미리보기 파일만 생성하고 data.js는 변경하지 않습니다.
팀이 실제 반영을 결정한 뒤 개발 브랜치에서만 다음 명령을 실행하세요.

    node tools/merge-approved-content.mjs .\mamgorithm-approved-cards.json --apply

이 명령은 로컬 data.js를 수정합니다. Git diff 검토·기존 UI와 알고리즘 회귀 테스트를 거쳐 별도로 배포 결정을 해야 합니다. 메인 병합이나 Firebase 배포는 수행하지 않습니다.

## 자동 검사와 수동 확인
- npm run test:content
- npm run test:feed
- npm run build
- 개발 서버 실행 중 CHROMIUM_PATH 환경변수에 크로미움 실행 파일을 지정한 후 npm run test:content:browser

실제 브라우저에서 CSV 업로드, 승인, CSV 검토표 재가져오기, 승인 JSON 다운로드 및 로컬 저장 복구를 검증해야 합니다.
**작성·저장과 테스트 통과는 별도 상태입니다.**

## 품질 및 추천 시스템 유의점
- URL 문법과 완전 동일한 URL/제목 중복만 자동 검사합니다. 외부 접속과 의미상 중복은 직접 확인해야 합니다.
- 사용자의 분야1을 대표 category로 저장합니다. 분야2는 secondaryCategory에 보관하지만 현재 추천 엔진에는 반영되지 않습니다.
- 추천 이유는 기사 상세 화면에서 표시할 수 있으나, 화면 UI와 내용 품질은 별도 검토가 필요합니다.
- 위키백과 텍스트는 원문을 검토한 뒤 팀원 문장으로 재작성하고, 특히 위키미디어 이미지의 개별 라이선스·저작자·출처 표기 요건을 확인하세요.
- 이미지 출처 메모만으로 웹사이트에 적법한 저작자 표기가 표시되는 것은 아닙니다. 외부 이미지의 표시 요건은 개발자가 반영 전 확인해야 합니다.
- 카드 수 목표는 총 64개까지의 후보 잠재치이며, 모두 승인·등록 완료된 사실이 아닙니다.

## 역할 제안 (확정 업무 아님)
승민: 자료 수집과 설명. 진수·용운: 분야 분류 검토. 원우: UX 및 승인 기준. 현석: 데이터 반영과 기술 검증.
