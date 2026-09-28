# Setup & Installation

Use this when bootstrapping Apsara in a consumer app or debugging "styles/tokens aren't applying" or theme-flash issues.

## Prerequisites

- **React** 18 or 19 (the package declares a React 19 peer dependency; React 19 is recommended).
- **Node.js** 18+.
- No bundler config, PostCSS, or Tailwind setup is required — Apsara ships a single prebuilt stylesheet.

## 1. Install

```bash
npm install @raystack/apsara
# or
pnpm add @raystack/apsara
# or
yarn add @raystack/apsara
```

## 2. Import the stylesheet (once, at the app root)

```ts
import "@raystack/apsara/style.css";
```

This one file contains **all** component styles and **all** `--rs-*` design tokens. Import it before any component renders. Importing it more than once is harmless but unnecessary.

Optional normalize stylesheet (cross-browser resets) — import it **before** `style.css`:

```ts
import "@raystack/apsara/normalize.css";
import "@raystack/apsara/style.css";
```

## 3. Wrap the app in `<Theme>`

`Theme` renders an element carrying `data-theme` / `data-accent-color` / `data-gray-color` / `data-radius` / `data-scaling` / `data-panel-background` / `data-reduced-motion`, and every `--rs-*` token is declared under those attributes. **Tokens only resolve inside it**, so it has to wrap anything that reads them.

```tsx
import { Theme } from "@raystack/apsara";

function App() {
  return (
    <Theme persistKey="app-theme" defaultValue={{ appearance: "system" }}>
      <YourApp />
    </Theme>
  );
}
```

`defaultValue` seeds the seven settings; `appearance` accepts `"light"`, `"dark"` or `"system"` (follows OS preference). `persistKey` turns on persistence and names its storage entry — without it, settings live in memory only. See `theming.md` for the full settings and prop list.

## Framework wiring

### Next.js (App Router)

Put the CSS import and the theme in the root layout. `suppressHydrationWarning` on `<html>` is **not** needed: nothing is written to `<html>`, and `Theme` marks its own element.

```tsx
// app/layout.tsx
import { Theme } from "@raystack/apsara";
import "@raystack/apsara/style.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Theme persistKey="app-theme">{children}</Theme>
      </body>
    </html>
  );
}
```

Notes for the App Router:
- The CSS import and `Theme` can live in a server component (layout); `Theme` itself is a client component (`"use client"`) and handles that boundary internally. It server-renders its attributes on the first byte.
- Passing `icons` requires a client component, because an override map is an object of functions. Move the theme into a `providers.tsx` marked `'use client'` in that case.
- Interactive Apsara components are client components — render them within client boundaries as usual.

### Vite / CRA / SPA

Import CSS and wrap the root in the entry file:

```tsx
// main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { Theme } from "@raystack/apsara";
import "@raystack/apsara/style.css";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Theme persistKey="app-theme">
      <App />
    </Theme>
  </React.StrictMode>
);
```

## Subpath exports

| Import | Contents |
|---|---|
| `@raystack/apsara` | All components, `Theme`/`useTheme`/`ThemeSwitcher`, `toastManager`/`useToastManager`, type exports |
| `@raystack/apsara/icons` | The 31 icons Apsara's components draw, plus `createIcon` |
| `@raystack/apsara/hooks` | Utility hooks (`useCopyToClipboard`, `useDebouncedState`, `useIsomorphicLayoutEffect`, `useMouse`) |
| `@raystack/apsara/style.css` | The full stylesheet (required) |
| `@raystack/apsara/normalize.css` | Optional CSS reset |

```tsx
import { Button } from "@raystack/apsara";
import { MagnifyingGlassIcon, Cross2Icon } from "@raystack/apsara/icons";
import { useCopyToClipboard } from "@raystack/apsara/hooks";
```

> `@raystack/apsara/v1` is an alias of the root entry kept for compatibility; new code should import from `@raystack/apsara`.

## First component

```tsx
import { Button, Flex, Text } from "@raystack/apsara";

export function Example() {
  return (
    <Flex direction="column" gap={4}>
      <Text size="regular" weight="medium">Welcome to Apsara</Text>
      <Flex gap={3}>
        <Button variant="solid" color="accent">Primary action</Button>
        <Button variant="outline">Secondary</Button>
      </Flex>
    </Flex>
  );
}
```

## Setup troubleshooting

- **Components render unstyled / tokens are blank** → `style.css` isn't imported, or it's imported after a CSS reset that overrides it. Import it once at the root.
- **Colors don't change with light/dark, or `var(--rs-color-*)` resolves to nothing** → the element isn't inside `<Theme>`. Tokens are declared on the theme element, not `<html>`, so anything outside it — including a hand-rolled portal into `document.body` — has no colors at all.
- **`useTheme` throws** → it is being called outside a `<Theme>`. That is deliberate; move the caller inside.
- **Theme flashes wrong on first paint** → `Theme` has no `persistKey`, so it emits no pre-hydration script, or it isn't high enough in the tree.
