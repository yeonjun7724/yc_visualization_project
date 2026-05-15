# 영천시 공간정보 기반 축제 분석 — 시각화 웹앱

**영천시 공공데이터·AI 활용 창업 경진대회** 데이터 시각화 부문 출품작

## 구조
- `components/FestivalMap.tsx` — pydeck 스타일 WebGL 지도 (scatter/heat/buffer/flow)
- `components/EDAPanel.tsx` — EDA 차트 패널 (방문자·체류·소비·유입·업종·읍면동)
- `public/shops.json` — 소상공인 상가 4,833개 압축 좌표
- `public/dong.json` — 읍면동 40개 집계 데이터
- `public/appdata.json` — 소비·방문자·버퍼·유입 등 분석 결과

## 로컬 실행
```bash
npm install
npm run dev   # http://localhost:3000
```

## Vercel 배포
```bash
npm install -g vercel && vercel --prod
```
