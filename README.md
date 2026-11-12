# NUMERA 홈페이지

Cloudflare Workers(정적 자산 포함)로 배포하는 홈페이지입니다.

- `public/` 정적 페이지, `src/worker.js` `/api/*` 처리
- 로컬 확인: `npm install && npm run dev`
- 수동 배포: `npx wrangler login && npm run deploy`

## Git 연동 배포 (Cloudflare 대시보드)
1. 이 저장소를 GitHub에 올립니다.
2. Cloudflare 대시보드 → Workers & Pages → Create → Import a repository 에서 저장소를 선택합니다.
3. Build command는 비워두고, Deploy command는 `npx wrangler deploy` 로 둡니다.
4. 이후 `main` 브랜치에 푸시할 때마다 자동 배포됩니다.
