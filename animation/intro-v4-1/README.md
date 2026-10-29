# 맘고리즘 Rive 인트로 V4.1 — 모션 리파인

V4의 16초·5개 장면·디자인·추천 상태·브랜드 마무리를 유지하고, 주로 0–10초의 움직임과 모핑을 재설계했다.
작업 저장소는 `amlyhbf/my-gorithm`, 별도 브랜치는 `feat/rive-intro-v4-1`이다.
운영 사이트 연결·배포·기존 브랜치 병합·원본 저장소 수정은 수행하지 않는다.

## 먼저 확인할 결과물

바로 다운로드: [다크 MP4](https://github.com/amlyhbf/my-gorithm/raw/refs/heads/feat/rive-intro-v4-1/animation/intro-v4-1/preview/intro-v4-1-dark.mp4) · [라이트 MP4](https://github.com/amlyhbf/my-gorithm/raw/refs/heads/feat/rive-intro-v4-1/animation/intro-v4-1/preview/intro-v4-1-light.mp4)

전후 비교: [0–6초 자유 이동](https://github.com/amlyhbf/my-gorithm/raw/refs/heads/feat/rive-intro-v4-1/animation/intro-v4-1/preview/compare-motion-0-6.mp4) · [6–10초 모핑](https://github.com/amlyhbf/my-gorithm/raw/refs/heads/feat/rive-intro-v4-1/animation/intro-v4-1/preview/compare-morph-6-10.mp4)

전체 근거는 [검증 보고서](VALIDATION.md), 한눈에 보는 비교는 [전후 스토리보드](preview/storyboard-before-after.png)에 있다.

| 파일 | 의미 |
| --- | --- |
| `preview/intro-v4-1-dark.mp4` | 다크 최종 영상. 실측 1080×1920 / 60 FPS / 16초 |
| `preview/intro-v4-1-light.mp4` | 라이트 최종 영상, 같은 타임라인 |
| `preview/compare-motion-0-6.mp4` | V4 왼쪽 / V4.1 오른쪽, 같은 0–6초를 실제 60 FPS로 비교 |
| `preview/compare-morph-6-10.mp4` | 같은 6–10초 모핑 비교 |
| `preview/storyboard-before-after.png` | 실제 렌더 프레임으로 구성한 전후 비교 |
| `preview/motion-curves-comparison.png` | 출력 RML에서 계산한 경로와 속도 곡선 |
| `preview/test-*.mp4` | 전체 고해상도 전에 검토한 30 FPS 테스트, 최종 영상과 구분 |
| `scene.rml` | 수정 가능한 Rive 원본, Dark/Light 아트보드 |
| `build/intro-v4-1.riv` | 실제 빌드·로컬 검증한 Rive 런타임 파일 |

V4.1의 구성은 V4와 같다: 0–3초 탄생, 3–6초 교차, 6–10초 모핑, 10–13초 조절과 추천, 13–16초 브랜드.
마지막 HTML 시작 버튼을 위한 빈 공간은 그대로 남겼다. Rive 속 손잡이는 시연이며 사용자 설정을 저장하지 않는다.

## 실제 개선

- 12프레임 선형 경로를 도형별 비주기 C2 경로와 미분값 기반 값 베지어로 교체했다.
- 회전은 위치 키를 그대로 따라가지 않고 속도·가속도에 반응하는 감쇠 응답으로 늦게 따라온다.
- 앞·중간·뒤의 상태가 다른 지연 표면을 사용한다. 선두가 먼저 늘어나고 후미 두께가 뒤늦게 얇아진다.
- 윤곽과 캡의 접선·법선·반경을 함께 계산하고, 두께 대비 지나친 굽힘을 제한해 접힘을 방지한다.
- 도형마다 굽힘의 방향·시각·지연이 다르고, 끝날 때 흔들림을 줄여 기존 UI로 정돈한다.
- 합류 조각과 잔상은 새 궤적을 추종한다. 본체를 숨기고 별도의 슬라이더로 바꾸지 않는다.

`keyframe-changes.md`에 방법과 시각을 정리했다. 수학적 연속성만으로 시각적 성공을 주장하지 않고,
실제 핵심 스틸과 테스트·전후 비교를 함께 검토했다.

## 보존한 부분

- 기존 HTML/CSS/JavaScript, 추천·설정·북마크·Firebase·콘텐츠 데이터 변경 없음.
- V4 원본과 MP4는 `protected-baseline.json`의 SHA-256으로 보호한다.
- 기존 Pretendard 폰트, 분야색과 다크·라이트 토큰을 그대로 복사했다.
- 실제 추천 함수로 계산한 22개 관심도 상태와 카드 ID 순서는 V4와 동일하다.
- 10–16초는 구조·값·두 테마 8개 실제 RGB 비교에서 일치했다. `preview/suffix-verification.json` 참조.
- 동일성이 검증된 마지막 6초는 V4의 원래 60 FPS 네이티브 프레임을 보존했다.
  새 0–10초는 매 1/60초의 상태를 Rive CLI로 새로 렌더링한다. 저프레임 픽셀 복제나 보간은 하지 않는다.

## 자체 수정 및 검증 기록

`WORK_LOG.md`에 Asia/Seoul 기준 진행 기록을 남긴다. 첨부 원문은 `requirements.md`에 보존했다.
첫 스틸에서 짧은 몸체의 윤곽 접힘과 예전 궤적으로 향하는 조각을 발견해, 곡률 상한과 추종 경로를 수정했다.
수정 뒤 실제 RML 2,404자세의 윤곽 검사를 수행했다. 판단 근거와 수치는 `preview/motion-analysis.json`에 있다.
수치는 서로 다른 경로의 최고 속도 자체가 더 낮아졌다는 뜻이 아니라, 각 버전의 접합점에서 속도가 불연속적으로 바뀌는 정도를 비교한 것이다.

## 파일·실행 안내

```bash
# 저장소 루트에서
./tools/rive animation/intro-v4-1 --verify
./tools/rive inspect animation/intro-v4-1 --summary
python tools/render-rive-v41.py tests
python tools/verify-rive-v41.py
python tools/analyze-rive-v41.py
python tools/verify-rive-v41-suffix.py
python tools/render-rive-v41.py final
python tools/compare-rive-v41.py final
python tools/review-rive-v41.py
```

`tools/motion_v41.py`는 연속 모션 리그, `create-rive-v41.py`는 RML 생성기다.
생성기는 원본을 다시 만들므로 직접 편집한 `scene.rml`이 있다면 먼저 보존해야 한다.
생성·분석에 기존 환경의 NumPy/SciPy/FontTools/Matplotlib를 사용한다. 영상은 이 도구가 그리는 것이 아니라 공식 Rive 1.8.0이 렌더링한다.
FFmpeg는 실제 프레임을 인코딩하거나 두 영상을 비교 배치하는 데 사용한다.
최종 캡처는 별도 빌드 폴더를 쓰는 최대 4개 작업자로 제한하고, 5개 CPU 환경에서 수행했다.
원시 PNG는 용량상 Git에 넣지 않았다. `final`은 검증된 V4 PNG 캐시가 있으면 마지막 6초를 보존하고,
새 체크아웃처럼 캐시가 없으면 V4.1의 960프레임을 모두 공식 CLI로 렌더링한다.
공유된 동일성 검증 JSON은 해당 RML 해시에 한해서만 유효하다. 소스를 바꿨다면 동일성 증명도 다시 생성해야 한다.

## 기술적 범위와 승인 전 제한

- 위치 설계는 시간축 C2, 출력된 cubicValue의 속도 접합은 C1, 공간 윤곽은 G1이다. 실제 유체 시뮬레이션이나 전 구간 G2라고 주장하지 않는다.
- 사전 계산한 지연 모델·감쇠 회전으로 관성을 표현한다. 네이티브 유체·3D·셔터 모션 블러를 추가한 것은 아니다.
- 곡선 정밀도가 높아 RML/런타임 파일이 V4보다 커졌다. 실제 모바일 웹 연결 때 로딩과 실행 성능을 따로 검증해야 한다.
- `.riv`는 실제 로컬 런타임 파일이고 MP4와 다르다. Editor용 `.rev`는 로그인 필요로 내보내지 않았다.
- 실제 웹 런타임/첫 방문/테마 선택/건너뛰기/다시 보기/종료/오류 폴백/움직임 감소/HTML 시작 버튼은 승인 후 별도 작업이다.

## 최종 실측

| 테마 | 해상도 | FPS | 길이 | 프레임 | 크기 | 전체 비트레이트 |
| --- | --- | --- | --- | --- | --- | --- |
| dark | 1080×1920 | 60 | 16.000초 | 960 | 3,435,603바이트 | 1,717,801 bit/s |
| light | 1080×1920 | 60 | 16.000초 | 960 | 4,069,039바이트 | 2,034,519 bit/s |

로컬 Rive 파일은 850,558바이트다. 두 테마를 18초까지 진행했을 때 마지막 포스터와 RGB 차이 0을 확인했다.
360×640·15 FPS 목표 GIF도 `preview/intro-v4-1-dark.gif`, `intro-v4-1-light.gif`에 있다.
움직임 품질 판단에는 60 FPS MP4를 사용한다.

원본은 [scene.rml](scene.rml), 실제 빌드는 [intro-v4-1.riv](build/intro-v4-1.riv), 실측 상세는 [final-media-verification.json](final-media-verification.json)이다.

## GitHub 다운로드 확인

다크·라이트 MP4, 두 비교 MP4, 전후 이미지, RML, `.riv`의 공개 GitHub 링크 7개에서 실제 파일을 내려받았다.
모두 HTTP 200이며 크기와 SHA-256이 로컬 최종 결과물과 일치했다.
[다운로드 검증 기록](github-download-verification.json)에 링크·크기·해시·검증 시각을 남겼다.
