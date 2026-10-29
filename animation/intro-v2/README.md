# 맘고리즘 모션그래픽 V2

V1의 RML 아트보드·타임라인·상태 머신 구조를 바탕으로 만든 독립 프로젝트입니다.
V1과 운영 사이트 파일을 덮어쓰지 않습니다. 작업 브랜치: `feat/rive-intro`.

## 먼저 보기

- `preview/intro-v2.mp4`: 주 결과물, 1920×1080, 60 FPS, 3.4초, H.264.
- `preview/intro-v2.gif`: 다운로드·빠른 확인용, 960×540, 25 FPS.
- `preview/desktop-final.png`: Full HD 마지막 장면.
- `preview/mobile-final.png`: 세로형 모바일 아트보드 마지막 장면, 1080×1920.
- `preview/mobile-390.png`: 휴대폰 너비 390px로 축소한 가독성 확인 이미지.
- `preview/media-info.json`: MP4 실측 결과와 SHA-256.

GIF는 1/100초 단위 프레임 지연과 재생기 호환성 때문에 25 FPS로 만들었습니다.
60 FPS 품질과 실제 움직임은 MP4로 확인하세요. GIF는 256색 팔레트 형식이므로 색상·발광 품질도 MP4가 더 정확합니다.
영상은 웹 런타임 재구현이 아닌 **공식 Rive CLI의 실제 PNG 렌더링 204장**으로 구성합니다.
FFmpeg는 렌더된 프레임을 묶는 데만 사용하며 프레임 보간은 하지 않습니다.

## 디자인과 모션

- 배경 `#0B1020`, 강조색 `#589CFF`.
- 분야 색상은 현재 `data.js`의 `CATEGORY_META`에서 직접 읽어 일치시킵니다.
  공부 `#4F46E5`, 기술 `#0284C7`, 문화 `#BE185D`, 취미 `#059669`.
- 네 방향에서 도형이 등장하며 각각 다른 회전·높낮이와 가속·감속을 적용합니다.
- Rive Rectangle의 너비·높이·모서리 반경을 키잉해 네 도형이 슬라이더 구간으로 변합니다.
- 손잡이가 좌우로 이동하고 각 구간의 너비와 표시 비율이 함께 변합니다.
  25/25/25/25 → 40/30/15/15 → 15/25/35/25 → 30/25/20/25.
- 숫자는 최대 잔여수 방식으로 정수화해 합계 100%를 유지합니다.
- 마지막에 서비스 제목과 보조 문구가 나타나며 최종 상태를 유지합니다.
- 발광은 Rive 네이티브 `RadialGradient`, 깊이감은 그라데이션 카드·테두리·접촉 그림자로 구현합니다.
  `Feather`를 실제 시도했으나 현재 EGL/depthStencil 렌더 경로에서는 경계가 거칠게 보여 제외했습니다.
- 현재 손잡이는 인트로의 조절 **시연 모션**입니다. 실제 포인터 조작이나 사이트 상태 연결은 하지 않았습니다.

## 편집과 재생성

- `scene.rml`: 편집 가능한 Rive 원본. Desktop과 Mobile 아트보드가 함께 있습니다.
- `rive.yaml`: 프로젝트 이름 설정.
- `NotoSansKR-V2.otf`, `FONT-LICENSE.txt`: 한글 서브셋 폰트와 라이선스.
- `build/intro-v2.riv`: 생성된 런타임 파일(Git 제외). Rive Editor용 `.rev`와 다릅니다.
- `../../tools/create-rive-v2.py`: V1 구조와 사이트 색상에서 V2 RML을 생성한 스크립트.
- `../../tools/render-rive-v2.py`: 공식 CLI로 렌더링하고 MP4/GIF 및 파일 정보를 생성하는 스크립트.

저장소 루트 `/workspace/my-gorithm`에서:

```bash
./tools/rive animation/intro-v2 --verify
./tools/rive inspect animation/intro-v2 --summary
./tools/rive animation/intro-v2 --once
python tools/render-rive-v2.py
```

`python tools/create-rive-v2.py`는 V2 RML을 다시 생성하므로, 수작업으로 편집한 RML이 있으면 먼저 보존하세요.
새 환경에서 CLI가 없다면 `bash tools/install-rive.sh`로 공식 CLI와 로컬 라이브러리를 설치합니다.
Rive Editor용 `.rev` 내보내기는 Rive 로그인이 필요해 수행하지 않았습니다.
Rive 계정 업로드·웹 게시·Firebase 배포는 수행하지 않습니다.

## 가독성 검토와 통합 범위

PC는 Full HD 원본과 960px 축소 이미지, 모바일은 별도 세로 아트보드와 390px 축소 이미지로 확인합니다.
모바일에서 제목 약 28px, 보조 문구 약 17px, 분야 이름 약 17px, 비율 약 18px 상당이며
제목·분야·비율이 잘리지 않는지 실제 렌더 이미지로 검토합니다.
가로 MP4를 그대로 휴대폰 전체 화면에 끼워 넣는 방식은 권장하지 않습니다.
모바일 세로형은 같은 모션이 들어 있는 별도 Rive 아트보드이며, 이번에 제공하는 모바일 확인 파일은 정지 이미지입니다.
실제 휴대폰 브라우저 통합·접근성·전환 동작 검증은 승인 후 사이트 연결 단계에서 진행해야 합니다.

기존 사이트의 첫 방문 처리, 추천 기능, Firebase 설정은 변경하지 않습니다.

## 검증 기록

- 공식 CLI 1.8.0: `--verify` 0 errors / 0 warnings, `inspect --summary` problems 없음.
- 실제 Full HD 렌더 이미지에서 슬라이더의 색 구간 경계를 비교해 비율 변화가 픽셀에 반영되는 것을 확인.
- 모바일 1080×1920 네이티브 캡처와 너비 390px 축소본 육안 확인.
- V1 RML·MP4 SHA-256 변화 없음. 기존 HTML/JS/CSS·의존성 선언·잠금 파일 변화 없음.
- 기존 사이트 프로덕션 빌드 성공. 기존 번들 크기 경고만 존재.

최종 파일 실측: MP4 1920×1080 / 60 FPS / 204프레임 / 3.400초 / 390,032바이트. GIF 960×540 / 25 FPS / 85프레임 / 3.400초 / 1,144,878바이트.
