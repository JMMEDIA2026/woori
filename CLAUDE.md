# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

A single-page marketing + admin site for **우리원 (Woori_One)**, a Korean nonprofit, originally scaffolded via Google AI Studio. It's a React SPA (all Korean-language UI copy) served by a small Express server, backed by three different, only-partially-integrated data layers (see "Data layer" below).

## Commands

```bash
npm install        # install dependencies
npm run dev         # start Express + Vite middleware dev server on http://localhost:3000
npm run build        # vite build (client) + esbuild bundle of server.ts -> dist/server.cjs
npm run start        # run the production build (NODE_ENV=production node dist/server.cjs)
npm run lint         # tsc --noEmit (type-check only, no separate linter configured)
npm run clean        # rm -rf dist server.js
```

There is no test runner configured (no `test` script, no test files in the repo) despite the `.github/workflows/*.yml` files invoking `npm test` — those workflows are generic npm-publish boilerplate and are not wired to this app's actual dev/build/deploy flow.

Drizzle Kit is a devDependency but has no `package.json` script; run it directly against `src/db/drizzle.config.ts` when schema changes are needed, e.g. `npx drizzle-kit push`. `src/db/schema.sql` is a hand-maintained copy of the same schema for reference/manual application.

## Architecture

### Client-side routing is not a router

`src/App.tsx` owns two pieces of state, `view` and `subView` (plain strings), and dispatches which `src/page/*.tsx` component to render with nested ternaries/`&&`. `Navigation.tsx` defines the menu tree (`MENUS`) and calls `setView(view, subView)` — there is no `react-router` or URL-based routing, so page state does not survive a refresh or exist in the URL.

### Dev/prod server (`server.ts`)

A single Express app:
- In dev (`NODE_ENV !== "production"`): mounts the Vite dev server in middleware mode and lets Vite serve/transform the SPA.
- In prod: serves the built `dist/` folder as static files and falls back to `dist/index.html` for all routes (SPA fallback).
- Also exposes the REST API described below, on the same Express instance/port (3000). There's no separate API server.

### Data layer — three overlapping backends

This is the most important thing to understand before touching data-fetching code. Different features use different backends, and they are not consistently wired together:

1. **Postgres via Drizzle ORM**, defined in `src/db/schema.ts` (`members`, `contents`, `donations`, `consultations`, `settings` tables) and queried through `src/db/index.ts` (`getDb()`, a `pg.Pool` wrapped by `drizzle`). `server.ts` exposes this directly as REST endpoints: `/api/branding`, `/api/members`, `/api/contents`, `/api/donations`, `/api/consultations`, `/api/db-status`, `/api/supabase/config`. Connection config comes from `SQL_HOST`/`SQL_USER`/`SQL_PASSWORD`/`SQL_DB_NAME` env vars.
2. **Supabase client**, in `src/lib/supabaseClient.ts` + `src/lib/supabaseService.ts`. `supabaseService` wraps Supabase table access for the same four entities (members/contents/donations/consultations) with a snake_case↔camelCase mapping layer, and falls back to the `/api/*` Express endpoints above when Supabase isn't configured or a call errors. **`supabaseService` is currently not imported by any page component** — treat it as the intended-but-not-yet-adopted client data layer rather than dead code to delete; if you wire a page up to live data, prefer using it over ad hoc `fetch("/api/...")` calls.
3. **Firebase / Firestore**, in `src/lib/firebase.ts`, used directly (bypassing both of the above) by several `src/page/*.tsx` components (`AdminDashboard`, `CommunityBoard`, `SiteGallery`, `DashboardHome`) for `banners`, `posts` (gallery/notice/etc. via a `type` field), and `partners` collections. Firestore security (`firestore.rules`, mirrored in `firebase-blueprint.json`) allows public reads but requires `request.auth != null` for writes; `AdminDashboard.tsx` gates writes behind Google Sign-In (`signInWithPopup` + `GoogleAuthProvider`). The Firebase web config in `src/lib/firebase.ts` is a public client key (expected to be checked in) — access control lives in `firestore.rules`, not in the key.

When adding a data-backed feature, check which of these three the surrounding page already uses before introducing a fourth pattern.

### Cloudflare Worker / Hyperdrive path is currently unused

`wrangler.jsonc` and `src/db/hyperdrive.ts` set up a Cloudflare Workers deployment with a Hyperdrive Postgres binding, but `wrangler.jsonc`'s `main` points at `src/index.ts`, which does not exist. The app is actually run/deployed via `server.ts` + Express (see Commands above), not as a Worker — don't assume the Hyperdrive path is live without first creating the missing entrypoint.

### Root-level one-off scripts

The many `fix_*.js`, `generate_*.js`, `update_*.js`, `bump_*.js`, `cleanup-*.cjs` files at the repo root are one-shot codemods (they build a template string and `fs.writeFileSync` it over a `src/page/*.tsx` or `src/components/*.tsx` file) that were run once during development, not build tooling. They aren't invoked by `npm` scripts or CI. If you need to do a similar bulk rewrite of a component, editing the file directly (via normal edits) is preferred over adding another root-level script like these.

### Path alias

`@/*` resolves to the repo root (not `src/`) in both `tsconfig.json` and `vite.config.ts` — e.g. `@/src/lib/firebase`.

### Styling

Tailwind v4 via the `@tailwindcss/vite` plugin — there is no `tailwind.config.js`; theme customization (fonts) lives in `src/index.css` under `@theme`. Animations use `motion/react` (Framer Motion) plus a few custom CSS keyframes (`animate-fade-in`, `animate-slide-up`) also in `src/index.css`. Icons come from `lucide-react`.

### Environment variables

See `.env.example` for the full list. Key groups:
- `GEMINI_API_KEY`, `APP_URL` — injected by AI Studio at runtime.
- `SQL_HOST`, `SQL_PORT`, `SQL_DB_NAME`, `SQL_USER`, `SQL_PASSWORD`, `SQL_ADMIN_USER`, `SQL_ADMIN_PASSWORD` — Postgres/Drizzle connection (server-side and `drizzle-kit`, respectively).
- `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` — Supabase client config (`src/lib/supabaseClient.ts` falls back to placeholder values and logs a warning if unset, rather than throwing).
- `DB_HOST`/`DB_PORT` — legacy GnuBoard MySQL/MariaDB config, not read by any code currently in `src/` or `server.ts`.
