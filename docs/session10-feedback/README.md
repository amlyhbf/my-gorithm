# 맘고리즘 10회차 피드백 반영 — 2026-11-03

**개발 브랜치:** `feat/session10-ui-feedback-v1`  
**기반:** `feat/feed-diversity-v1` (인트로 V4.4 포함, 추천 피드 다양성 개선 유지)  
**기존 테스트 사이트:** `mamgorithm-v44-test.vercel.app` — 운영 중인 Production alias 변경하지 않음  
**Firebase / GitHub main:** 변경하지 않음

## ID별 구현 내용

- **S10-01 정밀 슬라이더:** 온보딩 및 하단 미니 독의 HTML range step을 5 → 1로 변경. 0–100 정수를 모두 지원. 드래그 중 진동은 5% 경계를 넘을 때만 발생하여 조작 부담 완화. 설정 저장 마커 `mamgorithm_weights_scale_v3`을 도입하여 새로운 1%, 2%, 3% 설정이 과거 0~3단계 데이터로 오인되지 않도록 함. 공유 URL의 s/t/c/h 파라미터도 0~100 정수로 해석.
- **S10-02 다시보기 홈 복귀:** 세 버튼이 먼저 홈/추천 피드(`viewFeed`)로 이동. 인트로 다시보기 영상 재생 후 자동 종료·홈 복귀(건너뛰기 역시 홈 복귀). 첫 방문 인트로의 기존 시작 버튼 흐름은 유지. 온보딩은 홈 위에 열리고, 미니 독 안내 코치마크는 홈의 실제 UI를 비춤.
- **S10-03 분야 컬러 카드:** 기존 data.js의 상징색(공부 #4F46E5, 기술 #0284C7, 문화 #BE185D, 취미 #059669)을 카드 왼쪽 5px 색상 레일과 썸네일의 큰 분야 텍스트 배지로 표시. 색 외에도 명확한 분야 이름을 항상 노출. 보관함 카드에도 동일한 공통 카드 렌더링 사용.
- **S10-04:** 아직 전달된 구체 내용 없음. 미구현 및 미결정.

## 검증 상태

- GitHub 브랜치 변경 저장 완료
- script.js / intro.js / 브라우저 테스트 파일 JavaScript 구문 검사 통과
- 코드 확인: 두 슬라이더 모두 step=1, 다시보기의 홈 이동 호출 3개, 기존 4색 적용 코드 존재
- `tests/session10.browser.cjs` Playwright 통합 테스트 코드 작성 완료. **실제 실행은 아직 하지 못했음**
- npm 및 Vite 전체 빌드: 미검증
- Vercel 새 브랜치 Preview 배포는 시도했으나 `git_info_fail`로 실패. 빌드까지 도달하지 못했으며 기존 Production 사이트는 변경되지 않음.
- 사용자의 디자인 승인: 대기

## 개발자가 로컬에서 실행할 테스트

```bash
npm ci
npm run test:intro
npm run test:feed
npm run build
npm run dev -- --host 127.0.0.1
# 별도의 터미널에서
npm run test:session10:browser
```

## Vercel 배포 시 주의

Vercel 연결 프로젝트가 GitHub 저장소를 직접 읽을 수 없어 새 브랜치 배포 시 `git_info_fail`가 발생함. 기존 V4.4 프로젝트의 Production alias를 변경하지 말고, **Work의 클라우드 컴퓨터에서 저장소를 checkout한 뒤 새 테스트용 Vercel 프로젝트**에 별도 Preview를 올려야 함. 배포 URL과 모바일·PC 검증이 완료될 때까지 실제 사이트 반영 완료로 간주하지 않음.
