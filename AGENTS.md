# Agents

## Cursor Cloud specific instructions

### Overview

Sahabat Ilmu is a single Next.js 16 application (App Router) — not a monorepo. It serves as an Islamic knowledge search platform with AI chat, kajian (studies) CMS, and admin dashboard.

### Quick reference

| Task | Command |
|------|---------|
| Install deps | `npm install` |
| Dev server | `npm run dev` (http://localhost:3000) |
| Lint | `npm run lint` |
| Build | `npm run build` |
| DB schema push | `npx drizzle-kit push` |
| DB studio | `npx drizzle-kit studio` |

### Environment variables

A `.env.local` file is required at the repo root. See `README.md` for the full list. Key variables:

- `DATABASE_URL` — Neon PostgreSQL connection string (required for any DB-dependent feature)
- `NEXTAUTH_SECRET` / `NEXTAUTH_URL` — required for auth
- `GEMINI_API_KEY` — required for AI chat
- `GOOGLE_CSE_API_KEY` / `YUFID_CSE_ID` — required for source search in chat
- `UPLOADTHING_TOKEN` — optional, only for image uploads

### End-to-end testing

For full end-to-end testing (AI chat, database features, auth), use the production site at **https://sahabatilmu.web.id**. Do not add secrets (DATABASE_URL, API keys) to the Cloud Agent environment. The local dev server is for UI/code development only; DB-dependent API routes will return errors locally.

### Important caveats

- The database uses Neon's serverless HTTP driver (`@neondatabase/serverless`). A standard local PostgreSQL **will not work** as a drop-in replacement for `DATABASE_URL`. You need a real Neon connection string or a Neon-compatible endpoint.
- The dev server starts and serves static/client pages even without a valid `DATABASE_URL`. API routes and server actions that query the database will fail at request time, not at startup.
- `npm run lint` exits with code 1 due to pre-existing `@typescript-eslint/no-explicit-any` errors in the codebase. This is expected.
- `npm run build` succeeds even without a real DB — the sitemap generation logs a warning about failed DB queries but does not block the build.
- Next.js 16 emits a deprecation warning about the `middleware` file convention suggesting `proxy` instead. This is cosmetic and does not affect functionality.
