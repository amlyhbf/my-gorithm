# 맘고리즘 인트로 V4.3

V4.2의 16초, 네 도형·4초 모핑, 여섯 대표 카드와 두 테마를 유지한 시간·UI 리파인.
작업 저장소 amlyhbf/my-gorithm / 브랜치 feat/rive-intro-v4-3. 운영 사이트 연결·배포·병합 없음.

## 최종 다운로드

최종 렌더·검증 후 아래 파일이 생성되면 다운로드할 수 있다. 진행 상태는 WORK_LOG.md 참조.

- [다크 MP4](https://github.com/amlyhbf/my-gorithm/raw/refs/heads/feat/rive-intro-v4-3/animation/intro-v4-3/preview/intro-v4-3-dark.mp4)
- [라이트 MP4](https://github.com/amlyhbf/my-gorithm/raw/refs/heads/feat/rive-intro-v4-3/animation/intro-v4-3/preview/intro-v4-3-light.mp4)
- [초반 비교 A](https://github.com/amlyhbf/my-gorithm/raw/refs/heads/feat/rive-intro-v4-3/animation/intro-v4-3/preview/compare-a-intro.mp4)
- [조절·피드 비교 B](https://github.com/amlyhbf/my-gorithm/raw/refs/heads/feat/rive-intro-v4-3/animation/intro-v4-3/preview/compare-b-cause-effect.mp4)
- [마지막 UI 비교 C · 다크](preview/compare-c-final-ui-dark.png) / [라이트](preview/compare-c-final-ui-light.png)
- [편집 가능한 RML](scene.rml) / [로컬 빌드 Rive](build/intro-v4-3.riv)

비교 영상은 **왼쪽 V4.2 / 오른쪽 V4.3**. 각각 원래 속도로 재생하고 짧은 쪽은 마지막 프레임을 유지한다.
길이를 맞추려고 배속하지 않았다. 비교 몽타주와 실제 16초 최종 MP4를 구분한다.

## 주요 변경

- 첫 2초는 보존. 이후 반복 우회 구간을 덜어낸 1.5초 연결. 4초 모핑은 배속 없이 3.5–7.5초로 이동.
- 두 차례 모두 슬라이더 → 0.25초 정착 → 피드 반응 → 결과 확인.
- 여섯 대표 카드와 실제 제목·분야색 유지. 한 번 교체, 한 번 재배치.
- 눈금 글꼴 29px 유지. 카드 높이 160px, 행 간격 176px, 하단 여백 확대.
- 제목·보조 문구는 원래 위치. 이후 HTML 버튼용 하단 공간 확보.

[시간표](TIMELINE.md) · [제작 메모와 한계](PRODUCTION_NOTES.md) · [작업 기록](WORK_LOG.md)

## 다시 편집할 때

```bash
python tools/create-rive-v43.py
./tools/rive animation/intro-v4-3 --verify --format=json
./tools/rive inspect animation/intro-v4-3 --summary --json
python tools/verify-rive-v43.py
```

소스를 고치면 기존 렌더 캐시를 그대로 믿지 않는다. 소스·폰트 SHA와 구간 동일성을 먼저 확인한다.
원본·최종 .riv에는 모든 키가 있다. 렌더용 임시 사본만 해당 시각의 보간 구간을 남겨
공식 CLI --screenshot/--advance로 각 1/60초 시각을 렌더한다. 사본 비교의 작은 픽셀 차이는
unchanged-intervals.json에 기록한다. PNG를 FFmpeg로 H.264 MP4에 압축하며 프레임 보간·배속은 하지 않는다.

최종 영상은 고정 9:16 미리보기다. 물리 기기 성능/브라우저 런타임은 미검증이며,
최종 축소된 눈금은 약 8–9.5px의 작은 보조 글자다. 웹 연결 시에는 실제 기기 가독성을 다시 확인한다.
공식 CLI 로컬 .riv를 빌드했으며 .rev 계정 내보내기·Rive 게시·웹사이트 연결은 수행하지 않는다.
