<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Mail Notion

Gmail · Notion 연동 스케줄러. 웹 중심(PWA)으로 웹 / 모바일웹 / Android(홈 화면 설치) / macOS(Dock 설치)를 하나의 코드로 지원한다.

## 스택

- Next.js 16 (App Router, `src/app`) + TypeScript
- Tailwind CSS v4 (`src/app/globals.css` 에서 `@import "tailwindcss"`, 별도 config 파일 없음)
- 인증: Better Auth (`src/lib/auth.ts`, 핸들러 `src/app/api/auth/[...all]`). 현재 DB 없는 stateless 모드로 세션·Google 토큰을 암호화 쿠키에 저장
- Gmail: `@googleapis/gmail`, 읽기 전용 스코프. 호출은 `src/lib/gmail.ts` + Route Handler(`/api/gmail/*`)에서만. RSC 에서는 토큰 갱신 쿠키를 못 쓰므로 Route Handler/Server Action 에서 `getAccessToken({ useAccountCookie: true })` 사용
- PWA: `src/app/manifest.ts`, 서비스 워커 `src/lib/service-worker.js`, 등록 `src/components/pwa.tsx`

## 명령어

```bash
npm run dev     # 개발 서버
npm run build   # 프로덕션 빌드
npm run lint    # 린트
```

푸시 알림을 로컬에서 테스트할 때는 HTTPS 가 필요하다: `npx next dev --experimental-https`

## 규칙

- 비밀 값(Google/Notion 시크릿, VAPID 개인키)은 `.env.local` 에만 두고 커밋하지 않는다. 브라우저에 노출해도 되는 값만 `NEXT_PUBLIC_` 접두사.
- Gmail/Notion API 호출과 토큰 보관은 서버(Route Handler, Server Action)에서만 한다.
- 커밋 메시지는 한글 + Conventional Commits 접두사.
