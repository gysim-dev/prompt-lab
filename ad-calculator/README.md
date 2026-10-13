# DB 광고 성과 시뮬레이터

React + Vite + TypeScript 기반 광고 성과 계산기입니다.

## 주요 기능
- 노출량, 광고비, CTR, CVR 슬라이더 및 직접 입력
- CTR 기반 클릭수 계산 / 클릭수 직접 설정 전환
- 기준 성과 대비 DB 전환수 및 CPA 증감 비교
- 목표 CPA 역산 (필요 DB, CVR, 클릭수, CTR)
- 결과 클립보드 복사 및 초기화
- 브라우저 내 계산, 데이터 저장 및 서버 전송 없음

## 로컬 실행
```bash
npm install
npm run dev
```

## 배포
GitHub에 `ad-calculator` 저장소를 만들고 파일을 업로드한 뒤 Settings → Pages → Source를 **GitHub Actions**로 설정합니다. `main` 브랜치에 커밋하면 자동 배포됩니다.

배포 주소: `https://gysim-dev.github.io/ad-calculator/`

다른 저장소명이나 커스텀 도메인으로 배포할 때는 `vite.config.ts`의 `base`를 수정하세요.

## 계산 기준
- 클릭수 = 노출량 × CTR / 100 (반올림)
- DB 전환수 기대값 = 클릭수 × CVR / 100
- CPA = 광고비 / DB 전환수 기대값
- 목표 DB 수 = ceil(광고비 / 목표 CPA)
- 필요 CVR = 목표 DB 수 / 클릭수 × 100
- 필요 클릭수 = ceil(목표 DB 수 / (CVR / 100))
- 필요 CTR = 필요 클릭수 / 노출량 × 100

전환수는 기대값을 반올림하여 표시하지만 CPA는 반올림 전 기대값으로 계산합니다. 실제 성과는 달라질 수 있습니다.
