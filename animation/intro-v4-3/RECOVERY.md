# 중단 시 이어서 진행하는 방법

V4.3 브랜치에서 진행한다. 기존 RML을 다시 생성하지 않는다.

1. `git status`와 `preview/capture-plan.json`, `WORK_LOG.md`, `build/final.stdout` 확인.
2. 실행 중인 `render-rive-v43.py final`이 있으면 새 렌더 프로세스를 동시에 시작하지 않는다.
3. 실행이 끝났거나 멈췄다면 `python tools/render-rive-v43.py final` 실행.
   소스·폰트 SHA가 같은 캐시만 허용한다. 정상 PNG는 재사용하며 잘린/깨진 PNG만 재생성한다.
   기존 MP4와 정보 JSON의 소스·SHA·프레임 수가 맞으면 MP4 인코딩도 생략한다.
4. 두 최종 MP4가 완성되면 `python tools/compare-rive-v43.py`,
   `python tools/review-rive-v43.py`로 비교·실측 자료만 생성한다.
5. 실제 MP4 마지막 프레임/모바일 시안을 열어 확인한 뒤 결과물만 커밋·사용자 복사본에 push.
   원본 저장소/운영 사이트 배포/브랜치 병합은 하지 않는다.

변경된 원본과 SHA가 다른데 캐시의 source.json만 임의로 바꾸어 사용해서는 안 된다.
소스 변경이 있으면 대상 구간의 동등성을 증명하고 변경된 프레임만 다시 만든다.
비교 몽타주의 명시적 마지막 프레임 유지와 최종 MP4의 원본60FPS 프레임을 혼동하지 않는다.
