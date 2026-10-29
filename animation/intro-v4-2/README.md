# 맘고리즘 Rive 인트로 V4.2

V4.1의 16초·5개 장면·모바일 9:16·다크/라이트·사이트 디자인을 유지하고 두 장면만 정밀 수정했다.
작업 저장소는 `amlyhbf/my-gorithm`, 별도 브랜치는 `feat/rive-intro-v4-2`다.

## 먼저 보기

- [다크 MP4 다운로드](https://github.com/amlyhbf/my-gorithm/raw/refs/heads/feat/rive-intro-v4-2/animation/intro-v4-2/preview/intro-v4-2-dark.mp4)
- [라이트 MP4 다운로드](https://github.com/amlyhbf/my-gorithm/raw/refs/heads/feat/rive-intro-v4-2/animation/intro-v4-2/preview/intro-v4-2-light.mp4)
- [6–10초 모핑 전후 비교](https://github.com/amlyhbf/my-gorithm/raw/refs/heads/feat/rive-intro-v4-2/animation/intro-v4-2/preview/compare-morph-6-10.mp4)
- [9.6–13.2초 피드 전후 비교](https://github.com/amlyhbf/my-gorithm/raw/refs/heads/feat/rive-intro-v4-2/animation/intro-v4-2/preview/compare-feed-9-6-13-2.mp4)

비교 영상은 **왼쪽 V4.1 / 오른쪽 V4.2**다. 같은 영상 시각을 맞췄다.
V4.2는 10–13초 안의 시연 키를 두 조절 동작으로 정리했으므로 중간 관심도 숫자는 다를 수 있다.
시작값과 최종값, 전체 길이, 실제 추천 계산은 유지했다.

## 두 가지 수정

모핑은 **응집·압축 → 한 번 크게 펼침 → 비대칭 정착**으로 나누었다.
긴 유동 펄스를 반복하는 대신 6.95–8.25초에 한 번의 강조 동작을 배치했다.
같은 8개 곡선 꼭짓점 본체를 유지하며 손잡이·트랙으로 이어진다.

피드는 `추천 12장` 대신 **맞춤 피드**라는 제목과 **2열×3행**의 큰 대표 카드를 쓴다.
공부 비중이 늘면 기술 카드 하나가 나가고 실제 공부 콘텐츠가 들어온다.
이어 취미 카드가 상단으로 이동하고 기술·문화 카드가 시간차와 서로 다른 궤적으로 재배치된다.
같은 카드의 제목과 분야색은 고정해, 카드를 갈아 칠하는 변화가 아닌 같은 객체의 이동으로 보이게 했다.

첫 스틸에서 세 카드가 함께 겹쳐 제목을 가리는 순간을 발견했다.
취미는 먼저 도착하고 다른 두 카드는 위·아래 곡선으로 이동하도록 수정한 뒤 테스트했다.
짧은 이동 도중의 일부 겹침은 남지만, 세 카드가 동시에 중앙에 쌓이는 구간을 줄였다.

## 추천 규칙과 대표 카드

서비스의 기본 추천은 계속 **12개**다. 영상의 6개는 **대표 미리보기**다.
실제 사이트의 배정·선택 함수를 읽기 전용 실행해 12개/6개 용량으로 계산했고,
그 결과의 분야 비중과 콘텐츠 ID, 선택된 카드의 원래 상대 순서를 따랐다.
카드 수가 작아 정수 배정으로 반올림되므로 전체 비율은 슬라이더 옆 숫자로 확인한다.

분야를 관심도 순으로 정한 뒤 교차 배치하는 실제 규칙을 유지했다.
최종 실제 12개 배정은 공부 6 / 기술 2 / 문화 1 / 취미 3으로 V4.1과 같다.
새로운 추천 기능이나 6개 설정을 실제 사이트에 추가한 것은 아니다.

## 결과물 위치

| 경로 | 내용 |
| --- | --- |
| `scene.rml`, `rive.yaml`, `Pretendard-*.ttf` | 편집 가능한 Rive CLI 원본과 폰트 |
| `build/intro-v4-2.riv` | 실제 빌드·로컬 네이티브 검증한 런타임 파일 |
| `preview/intro-v4-2-{dark,light}.mp4` | 1080×1920, 60 FPS 최종 영상 |
| `preview/compare-*.mp4` | 두 구간의 V4.1 전후 비교 |
| `preview/storyboard-{dark,light}.png` | 실제 최종 렌더 프레임으로 만든 전체 장면 보드 |
| `preview/storyboard-{morph,feed}-before-after.png` | 수정 장면 전후 스틸 보드 |
| `preview/scene-*.png`, `phone-*.png` | Full HD 장면과 세 가지 모바일 크기의 정적 시안 |
| `preview/morph-phase-curves.png` | 출력 RML에서 읽은 단계별 폭·두께 변화 |
| `preview/test-*.mp4`, `test-review-*.png` | 전체 고해상도 전에 확인한 30 FPS 테스트와 연속 프레임 |
| `PRODUCTION_NOTES.md` | 무엇을 왜 바꿨는지, 추천 규칙과 시각 설명 |
| `VALIDATION.md`, `final-media-verification.json` | 최종 실측·검증 결과 |
| `WORK_LOG.md` | 작업 진행·문제 수정 기록 |

## 재현과 실제 렌더 방법

공식 Rive CLI 1.8.0이 벡터 프레임을 실제 렌더링한다. FFmpeg는 MP4 압축과 비교 배치에 사용한다.
Python의 NumPy/SciPy/FontTools/Brotli/Matplotlib는 RML 생성·곡선·검증 자료를 만든다.
기존 폰트에 새 피드 문구 글리프를 포함하도록 다시 서브셋했고, 기존 장면의 실제 RGB 일치도 확인했다.

```bash
./tools/rive animation/intro-v4-2 --verify
./tools/rive inspect animation/intro-v4-2 --summary
python tools/verify-rive-v42.py
python tools/prove-rive-v42-preservation.py
python tools/render-rive-v42.py tests
python tools/compare-rive-v42.py tests
# 테스트/연속 프레임을 검토하고 해당 소스·폰트 해시의 test-review.json을 남긴 후:
python tools/render-rive-v42.py final
python tools/compare-rive-v42.py final
python tools/review-rive-v42.py
```

`tools/create-rive-v42.py`는 V4.1을 읽어 새 원본을 생성한다. 직접 편집한 RML이 있으면 먼저 보존해야 한다.
최종 캡처는 최대 4개 작업자를 쓰며 작업자별 RML·출력 폴더를 분리한다.
고해상도 원시 PNG와 임시 빌드는 Git에서 제외했다. 원본 프레임 캐시가 없는 새 환경에서는 모든 960장을 네이티브 렌더한다.
캐시가 있으면 수치·실제 RGB 일치가 확인된 앞 6초와 마지막 2초만 V4.1의 원래 60 FPS PNG를 보존한다.
수정한 6–14초는 매 1/60초마다 새로 렌더한다. 저프레임 영상의 중복 프레임이나 광학 보간으로 60 FPS를 만들지 않는다.

## 현재 범위

RML은 수정 가능한 원본이며 `.riv`와 MP4는 서로 다른 결과물이다.
`.riv`는 로컬 네이티브 검증 단계이며, 웹 편집기용 `.rev`는 공식 로그인 필요로 생성하지 않았다.
실제 유체·3D·셔터 블러를 구현한 것은 아니다. 벡터·시간차·곡선과 기존 절제된 글로우를 사용했다.
실제 휴대폰 웹 성능·첫 방문·건너뛰기·다시 보기·오류 폴백·움직임 감소·테마 자동 선택은 승인 후 별도 작업이다.

V4.1과 이전 결과물을 보존했고, 운영 사이트 연결·Firebase 배포·원본 저장소 수정·기존 브랜치 병합은 하지 않았다.
