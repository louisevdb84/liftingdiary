# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## IMPORTANT: Always Read Relevant Docs First

**Before writing any code**, you MUST read the relevant documentation file in the `/docs` directory. Every feature, component, page, or API route has a corresponding doc — consult it first and follow it exactly. Do not rely on training data or assumptions; the `/docs` directory is the authoritative source for how this project should be built.

`/docs/ui.md`
`/docs/data-fetching.md`
`/docs/data-mutation.md`
`/docs/auth.md`

## Commands

```bash
npm run dev      # start dev server on localhost:3000
npm run build    # production build
npm run lint     # run ESLint
```

No test runner is configured yet.

## Architecture

This is a Next.js 16 app using the **App Router** (`src/app/`). Next.js 16 has breaking changes from earlier versions — always read `node_modules/next/dist/docs/` before writing routing, data-fetching, or navigation code.

- `src/app/layout.tsx` — root layout with Geist font setup and global CSS
- `src/app/page.tsx` — home page (currently the default scaffold)
- `src/app/globals.css` — Tailwind CSS v4 base styles

**Styling**: Tailwind CSS v4 via `@tailwindcss/postcss`. Tailwind v4 has breaking changes from v3 — configuration is done in CSS (`@theme` in globals.css), not `tailwind.config.js`.

**Key hint from Next.js docs**: For slow client-side navigations, Suspense alone is not enough — also export `unstable_instant` from the route. See `node_modules/next/dist/docs/01-app/02-guides/instant-navigation.mdx`.
