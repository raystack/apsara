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

The `Theme` provider applies `data-theme` / `data-style` / `data-accent-color` / `data-gray-color` to the document and injects a small inline script that sets them **before paint** to avoid a flash of the wrong theme. Tokens only resolve correctly inside it.

```tsx
import { Theme } from "@raystack/apsara";

function App() {
  return (
    <Theme defaultTheme="system">
      <YourApp />
    </Theme>
  );
}
```

`defaultTheme` accepts `"light"`, `"dark"`, or `"system"` (follows OS preference). See `theming.md` for the full prop list (accent color, gray color, style variant, storage key, forced theme, etc.).

## Framework wiring

### Next.js (App Router)

Put the CSS import and provider in the root layout. `suppressHydrationWarning` on `<html>` is **required** because the no-flash script mutates `<html>` attributes before React hydrates.

```tsx
// app/layout.tsx
import { Theme } from "@raystack/apsara";
import "@raystack/apsara/style.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Theme defaultTheme="system">{children}</Theme>
      </body>
    </html>
  );
}
```

Notes for the App Router:
- The CSS import and `Theme` can live in a server component (layout); `Theme` itself is a client component (`"use client"`) and handles that boundary internally.
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
    <Theme defaultTheme="system">
      <App />
    </Theme>
  </React.StrictMode>
);
```

## Subpath exports

| Import | Contents |
|---|---|
| `@raystack/apsara` | All components, the `Theme` provider, `toastManager`/`useToastManager`, type exports |
| `@raystack/apsara/icons` | Icon set (re-exports + Apsara icons) |
| `@raystack/apsara/hooks` | Utility hooks (e.g. `useTheme`) |
| `@raystack/apsara/style.css` | The full stylesheet (required) |
| `@raystack/apsara/normalize.css` | Optional CSS reset |

```tsx
import { Button } from "@raystack/apsara";
import { MagnifyingGlassIcon, Cross2Icon } from "@raystack/apsara/icons";
import { useTheme } from "@raystack/apsara/hooks"; // also re-exported from the root
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
- **Colors don't change with light/dark, or `var(--rs-color-*)` resolves to nothing** → the tree isn't wrapped in `<Theme>`, so `data-theme` is never set on the document.
- **Theme flashes wrong on first paint (Next.js)** → missing `suppressHydrationWarning` on `<html>`, or `Theme` isn't high enough in the tree.
- **Hydration mismatch warnings around theme** → expected without `suppressHydrationWarning`; add it to `<html>`.
