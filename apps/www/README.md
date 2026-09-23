# Apsara docs site

The source of [apsara.raystack.org](https://apsara.raystack.org), built with [Next.js](https://nextjs.org) and [Fumadocs](https://fumadocs.dev).

Run `pnpm dev` in this folder to start only the docs site at http://localhost:3000. From the repo root, `pnpm start` runs the library and the docs site together.

The site uses the local `@raystack/apsara` package, and `pnpm build` builds the library first.

The page layout, scripts, and setup are in [DEVELOPMENT.md](../../DEVELOPMENT.md). The docs rules are in [AGENTS.md](../../AGENTS.md#docs).
