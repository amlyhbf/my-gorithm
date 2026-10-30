# 맘고리즘 인트로 V4.4

승인한 V4.3을 보존하면서 **연쇄 진입**과 **빠른 피드 반응** 두 부분만 수정했다.
저장소 amlyhbf/my-gorithm / 기준 feat/rive-intro-v4-3 / 작업 feat/rive-intro-v4-4.

## 최종 다운로드

- [다크 MP4](https://github.com/amlyhbf/my-gorithm/raw/refs/heads/feat/rive-intro-v4-4/animation/intro-v4-4/preview/intro-v4-4-dark.mp4)
- [라이트 MP4](https://github.com/amlyhbf/my-gorithm/raw/refs/heads/feat/rive-intro-v4-4/animation/intro-v4-4/preview/intro-v4-4-light.mp4)
- [오프닝 비교 영상](https://github.com/amlyhbf/my-gorithm/raw/refs/heads/feat/rive-intro-v4-4/animation/intro-v4-4/preview/compare-a-entrance.mp4)
- [슬라이더·피드 비교 영상](https://github.com/amlyhbf/my-gorithm/raw/refs/heads/feat/rive-intro-v4-4/animation/intro-v4-4/preview/compare-b-response.mp4)
- [RML 편집 원본](scene.rml) / [실제 로컬 빌드 .riv](build/intro-v4-4.riv)
- 기존 장면 보존 비교: [다크](preview/compare-c-preserved-dark.png) / [라이트](preview/compare-c-preserved-light.png)

두 테마 최종 렌더·실제 디코딩·헤드리스 재생을 완료했다. GitHub 링크8개를 실제 다운로드해 모두 HTTP200·크기·SHA256 일치를 확인했다.

| 버전 | 해상도 | FPS | 길이 | 디코딩 프레임 | 크기 | 비트레이트 |
| --- | --- | --- | --- | --- | --- | --- |
| 다크 | 1080×1920 | 60 FPS | 16.000초 | 960 | 3,358,480바이트 (3.36 MB) | 1,679,240 bit/s |
| 라이트 | 1080×1920 | 60 FPS | 16.000초 | 960 | 3,876,586바이트 (3.88 MB) | 1,938,293 bit/s |


## 변경 요약

네 도형은0/.25/.483/.683초에 서로 다른 가장자리에서 진입하고1.5초까지 원래 흐름으로 합류한다.
자유 이동과4초 모핑을24프레임 늦게 옮기며 **배속하지 않는다**. 새 오프닝에0.4초를 배정하고 전체16초를 유지한다.
피드는 슬라이더 이동의 약85–95% 지점에서 시작한다. 실제 마지막 손잡이 이동과4/6프레임 겹친다.
카드의 활성 경로·교체·재배치·속도, 최종 슬라이더 UI와 브랜드13.3–16초는 보존한다.

## 확인 자료

- [전후 시간표](TIMELINE.md): 실제 키프레임의 등장·자유 이동·모핑·조절·피드·브랜드 시각.
- [도형 경로 그림](preview/entrance-paths.png) / [제작 메모](PRODUCTION_NOTES.md): 도형별 경로, 반응 지연 전후, 자체 수정과 한계.
- [검증 기록](VALIDATION.md): 추천 계산·수치 연속성·출력·재생·네이티브 보존 근거.
- `preview/storyboard-{dark,light}.png`, `scene-*.png`: 주요 장면.
- `preview/phone-*.png`: 기존 UI를 보존한 모바일 정적 시안.
- `preview/source-verification.json`: 실제21개 추천 상태, 경로·시간·최종 UI 수치 검사.
- `preview/native-preservation.json`: 원래 프레임과 실제 네이티브 캡처 비교(미세 픽셀 차이도 기록).
- `preview/playback-verification.json`: 최종 두 MP4의 실제 헤드리스 FFplay 재생 결과.
- `github-download-verification.json`: 실제 GitHub 다운로드 후 크기·SHA256 확인 결과.

두 비교 영상은 왼쪽V4.3/오른쪽V4.4다. 오프닝은 같은0초부터, 반응 비교는 각 슬라이더 시작을 맞춘다.
두 경우 모두 원래 속도이며 카드 움직임을 빠르게 재생한 것이 아니다.

## 편집·복구

Rive CLI1.8.0을 사용한다. 원본 RML과 최종 .riv에는 전체 타임라인이 있다.
렌더용 임시 사본에서만 현재 보간 구간을 남겨 CLI 컴파일 비용을 줄인다.

```bash
python tools/create-rive-v44.py
./tools/rive animation/intro-v4-4 --verify --format=json
./tools/rive inspect animation/intro-v4-4 --summary --json
python tools/verify-rive-v44.py
```

이미 제작된 결과를 확인할 때 위 생성기를 다시 실행할 필요는 없다. 중단 복구는 [RECOVERY.md](RECOVERY.md)를 따른다.
최종본은 새 네이티브322프레임+검증된 기존638프레임/테마이며 모두 원래60FPS 자료다.
운영 웹사이트 연결·Firebase 배포·브랜치 병합·원본 저장소 수정은 하지 않는다.
