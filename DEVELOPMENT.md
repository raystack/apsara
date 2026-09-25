# Development guide

This guide covers setup, scripts, and the project layout. To send a change, see [CONTRIBUTING.md](./CONTRIBUTING.md). Code rules are in [AGENTS.md](./AGENTS.md) and apply to everyone.

## Requirements

- Node.js 22 or later
- pnpm 9.3.0. Install it with `npm install -g pnpm@9.3.0`.

## Setup

```bash
git clone https://github.com/raystack/apsara.git
cd apsara
pnpm install
pnpm start
```

`pnpm start` builds the library in watch mode and starts the docs site at http://localhost:3000.

The repo includes Biome settings for VS Code (`.vscode/`) and Zed (`.zed/`). Install the Biome extension so files format on save.

## Project structure

```
apps/www/                 Docs site (Next.js and Fumadocs)
packages/raystack/        The @raystack/apsara library
packages/tools-config/    Shared Biome and TypeScript config
packages/plugin-vscode/   VS Code extension for design tokens
docs/                     Migration guide and RFCs
```

### Library

```
packages/raystack/
  components/<name>/
    <name>.tsx            Component
    <name>.module.css     Styles
    index.tsx             Re-exports only
    __tests__/            Tests
  hooks/                  Hooks (@raystack/apsara/hooks)
  icons/                  Icons (@raystack/apsara/icons)
  shared/                 Shared variants, such as gap and radius
  styles/                 Design tokens and global CSS
  test-utils/             Test helpers
  figma/                  Figma Code Connect templates
  index.tsx               Public exports
```

### Docs page

```
apps/www/src/content/docs/components/<name>/
  index.mdx               Page content
  demo.ts                 Live examples and the playground
  props.ts                Prop types, rendered by <auto-type-table>
```

Component pages sort alphabetically. Other sections, such as `theme`, set their order in `meta.json`.

### Package exports

| Import | Contents |
| --- | --- |
| `@raystack/apsara` | Components |
| `@raystack/apsara/hooks` | Hooks |
| `@raystack/apsara/icons` | Icons |
| `@raystack/apsara/style.css` | Styles, with fonts |
| `@raystack/apsara/style-no-fonts.css` | Styles, without fonts |
| `@raystack/apsara/normalize.css` | CSS reset |
| `@raystack/apsara/v1` | Legacy alias of the root entry. Do not use it in new code. |

## Scripts

Run these from the repo root:

| Script | What it does |
| --- | --- |
| `pnpm start` | Library watch build and docs dev server |
| `pnpm dev` | Library watch build only |
| `pnpm build` | Build every package |
| `pnpm build:apsara` | Build the library |
| `pnpm test:apsara` | Run the library tests |
| `pnpm lint` | Lint the library with Biome |
| `pnpm format` | Format and fix staged files. The pre-commit hook runs it. |
| `pnpm clean` | Delete the library build output |

Run these from `packages/raystack/`:

| Script | What it does |
| --- | --- |
| `pnpm test -- components/<name>` | Run one component's tests |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm test:coverage` | Run tests with a coverage report |
| `pnpm lint:fix` | Fix lint issues |
| `pnpm exec tsc --noEmit` | Check types |

Run `pnpm dev` in `apps/www/` to start only the docs site.

## Tests

Tests use Vitest and Testing Library in jsdom. Put them in `components/<name>/__tests__/<name>.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Flex } from '../flex';

describe('Flex', () => {
  it('renders children', () => {
    render(<Flex>Content</Flex>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
```

## Build

`pnpm build:apsara` runs Rollup (`packages/raystack/rollup.config.mjs`) and writes ESM and CommonJS builds, type declarations, and CSS to `packages/raystack/dist/`. `pnpm dev` runs the same build in watch mode.

## Icons

All icons are in `packages/raystack/icons/icons.tsx`, one `createIcon` call per icon. There is no generator. To add, remove, or change an icon, edit that file. `icons/types.ts` derives `IconName` from the exports, so it cannot drift. `icons/__tests__/bundle.test.ts` checks that unused icons are removed from a bundle.

## VS Code extension

`packages/plugin-vscode/` adds autocomplete and hover previews for design tokens. To develop it, run the VS Code task `plugin-vscode: start-dev`. In that folder, `pnpm build` builds it and `pnpm package` creates the `.vsix` file.

## Troubleshooting

- Wrong versions: check that `node --version` is 22 or later and `pnpm --version` is 9.3.0.
- The build fails after you pull: run `pnpm clean`, `pnpm install`, then `pnpm build:apsara`.
- The docs site does not show a component change: restart `pnpm start`.
