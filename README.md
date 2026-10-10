# 풍경종 계곡 / Windbell Valley / 风铃溪谷

따뜻한 손그림 마을 산책과 한국어 단편 영상. 외부 CDN이나 서버 API 없이 GitHub Pages에서 실행하는 정적 웹 작품입니다.

## 감상과 조작

- 길을 눌러 여행자를 이동합니다. 방향키 또는 WASD로 길을 따라 걸을 수 있습니다.
- 화면을 끌어 탐색하고, 휠/확대 버튼으로 줌합니다.
- 주민을 클릭하면 한국어 인사말이 나타납니다. 장소 버튼과 자동 산책도 지원합니다.
- 음악은 소리 켜기를 누른 뒤 시작합니다. 영상 재생 시 웹 음악은 정지합니다.
- 모바일에서는 손가락으로 끌고 아래 방향 버튼으로 걷습니다.
- 움직임 일시정지와 시스템의 동작 감소 설정을 지원합니다.

## 결과물

- `assets/windbell-valley-ko.mp4`: 36초, 1920×1080, 24fps, 한국어 자막 내장, H.264/AAC.
- `assets/windbell-theme.wav`: 새로 작곡·합성한 36초 스테레오 음악.
- `assets/valley.png`: 새로 생성한 1536×1024 마을 배경.
- `assets/*-walk.png`: 주민 4종, 각 4프레임 투명 걷기 스트립.
- `assets/characters-original.png`, `assets/sprites.json`: 원본 생성 아틀라스와 프레임 명세.

## 참고와 출처

[aldegad/sprite-gen의 village-scene.gif](https://github.com/aldegad/sprite-gen/blob/main/docs/assets/village-scene.gif)의 상점·원경·앞길·인물 레이어 구성을 참고했습니다. 사용자가 제시한 `aldegad/sprite` 주소는 확인 당시 404여서 제작자의 현재 저장소에서 같은 GIF를 확인했습니다. 원본 소재를 복제하거나 사이트에 포함하지 않았습니다.

배경/캐릭터는 OpenAI 이미지 생성 도구로 제작한 새로운 이미지입니다. 특정 영화의 기존 캐릭터와 장면을 사용하지 않습니다. 음악은 `scripts/prepare_assets.py`에서 오음 음계 멜로디와 합성 악기/개울 소리로 생성하며, 외부 음원을 사용하지 않습니다. 자세한 설명은 `credits.html`에 있습니다.

## 개발과 검증

```sh
python -m http.server 8766 --bind 127.0.0.1
npm test
npm run check
```

`scene-core.mjs`에 실제 배경의 돌길에 맞춘 노드/간선과 이동 경로가 있습니다. `scene.js`는 프레임별 장면을 그리는 동일한 렌더러를 웹 산책과 영화 내보내기에 사용합니다.

영상 재생성은 Pillow/numpy, FFmpeg, Playwright와 Chromium이 필요합니다. `scripts/prepare_assets.py`가 투명 프레임 스트립과 WAV를 만들며 `scripts/render_film.mjs`가 로컬 웹 장면을 864프레임으로 내보냅니다. 이 스크립트의 실행 파일 경로는 제작 환경에 맞춰 지정돼 있어 다른 컴퓨터에서는 해당 경로를 수정해야 합니다.

GitHub Pages는 `main` 브랜치 루트(`/`)에서 게시합니다. `.nojekyll`로 빌드 과정 없이 그대로 제공됩니다. 서버에 개인 데이터, 키, 외부 계정 인증은 필요하지 않습니다.
