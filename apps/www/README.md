# Apsara Documentation Site

The documentation site for [Apsara](https://apsara.raystack.org), built with [Next.js](https://nextjs.org) and [Fumadocs](https://fumadocs.dev).

## Getting Started

From the repo root, `pnpm start` runs both the component library and this docs site together. To run only the docs site, from this folder:

```sh
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see it.

The site reads the local `@raystack/apsara` package, so a build of the library runs automatically before `pnpm build`. When you change a component, restart the library dev server (or `pnpm start` from the root) to pick it up.

## Content

Documentation lives in `src/content/docs/` as `.mdx` files. Each component has its own folder:

```
src/content/docs/components/<name>/
├── index.mdx   # the page: overview, anatomy, examples, accessibility
├── props.ts    # prop tables, rendered by <auto-type-table />
└── demo.ts      # live code examples shown by the <Demo /> component
```

Navigation for sections like `theme` and `ai-elements` is set by their `meta.json`. The `components/` folder has no `meta.json`, so its pages are picked up automatically in alphabetical order.

To add or edit a component page, see the [Documentation Development](../../CONTRIBUTING.md#documentation-development) section in the contributing guide.

## Scripts

```sh
pnpm dev         # start the dev server
pnpm build       # build the static site (builds the library first)
pnpm start       # serve the production build
pnpm lint        # check formatting and lint rules with Biome
```
