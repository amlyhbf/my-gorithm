# 중단 시 복구

1. feat/rive-intro-v4-4 브랜치와 WORK_LOG.md, preview/capture-plan.json, build/final.stdout 확인.
2. 실행 중인 render-rive-v44.py final이 있으면 중복 실행하지 않는다.
3. 원본을 다시 생성하지 않고 `python tools/render-rive-v44.py final`로 이어 간다.
   소스/폰트 SHA가 같은 정상 PNG는 재사용하고, 실제 검증된 MP4도 재인코딩하지 않는다.
4. 완료된 테마는 즉시 별도 작업 브랜치에 보존한다. 다른 테마의 결과를 기다리다가 잃지 않는다.
5. 두 최종 MP4 이후 compare-rive-v44.py → review-rive-v44.py로 비교/실측/재생 검증.
6. 최종 MP4 프레임과 보존 비교를 열어 확인하고 본인 복사본 작업 브랜치에만 push한다.

V4.3·운영 사이트·원본 저장소는 수정하지 않는다. 병합·배포·웹 연결도 하지 않는다.
