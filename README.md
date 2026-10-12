# PROMPT LAB

브랜드별 마케팅 카피 프롬프트를 한국어로 생성하는 무료 정적 웹사이트입니다.

## 기술 스택
React 19, Vite 6, TypeScript, Tailwind CSS 4, Lucide React. 외부 AI API 및 데이터베이스 없음.

## 로컬 실행

```bash
npm ci
npm run dev
```

Vite가 표시하는 로컬 주소로 접속하세요.

## 프로덕션 빌드

```bash
npm run build
npm run preview
```

`dist/` 디렉터리에 정적 파일이 생성됩니다. `vite.config.ts`의 `base: '/prompt-lab/'` 설정으로 GitHub Pages 하위 경로의 CSS/JS 자산 URL을 구성합니다.

## GitHub Pages 배포

1. GitHub에 `prompt-lab` 저장소를 생성합니다.
2. 이 프로젝트를 저장소의 `main` 브랜치에 푸시합니다.
3. 저장소 **Settings → Pages → Build and deployment → Source**에서 **GitHub Actions**를 선택합니다.
4. `.github/workflows/deploy.yml`이 `npm ci`, `npm run build`, `dist` 업로드 및 배포를 자동 실행합니다.
5. 배포 주소: `https://<GitHub-username>.github.io/prompt-lab/`.

저장소 이름을 바꾸면 `vite.config.ts`의 `base`도 변경해야 합니다.

## 기능
브랜드/캠페인 정보 입력, 톤앤매너/채널/프레임워크 선택, 한국어 프롬프트 생성, 미리보기/복사, ChatGPT 바로가기, 입력값 초기화.

## 데이터 정책
로그인/회원가입, DB, localStorage, sessionStorage, 쿠키, 외부 AI API 호출을 사용하지 않습니다. 입력값은 React 메모리 상태에서만 처리하며 새로고침하면 사라집니다. ChatGPT 링크는 새 탭에서 열리고 데이터가 자동 전송되지 않습니다.
