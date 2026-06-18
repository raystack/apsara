# Theming

Use this for anything involving the `Theme` provider, light/dark mode, accent/gray colors, the modern/traditional style variant, reading or changing the theme at runtime, or scoping a theme to part of the tree.

## The `Theme` provider

`Theme` (aliased as the deprecated `ThemeProvider`) configures the active theme and writes `data-*` attributes that the token CSS keys off. Mount it once near the root (see `setup.md`). It can also be nested to scope a theme to a subtree (see "Scoped themes" below).

```tsx
import { Theme } from "@raystack/apsara";

<Theme
  defaultTheme="system"   // "light" | "dark" | "system"
  accentColor="indigo"    // "indigo" (default) | "orange" | "mint"
  grayColor="gray"        // "gray" (default) | "mauve" | "slate" | "sage"
  style="modern"          // "modern" (default) | "traditional"
>
  <App />
</Theme>
```

### Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `defaultTheme` | `string` | `"system"` (or `"light"` if `enableSystem` is false) | Initial theme when nothing is stored. |
| `forcedTheme` | `string` | — | Locks the page to a theme; ignores storage and system. |
| `enableSystem` | `boolean` | `true` | Follow `prefers-color-scheme` when theme is `"system"`. |
| `enableColorScheme` | `boolean` | `true` | Sets `color-scheme` so native UI (scrollbars, inputs) matches. |
| `disableTransitionOnChange` | `boolean` | `false` | Suppress CSS transitions during a theme switch (no flicker). |
| `storageKey` | `string` | `"theme"` | localStorage key for the persisted choice. |
| `themes` | `string[]` | `["light","dark"]` | Allowed theme names. |
| `attribute` | `string \| "class"` | `"data-theme"` | Which HTML attribute reflects the theme. |
| `value` | `Record<string,string>` | — | Map theme name → attribute value. |
| `nonce` | `string` | — | CSP nonce for the inline no-flash script. |
| `style` | `"modern" \| "traditional"` | `"modern"` | Style variant — controls radius scale and fonts. |
| `accentColor` | `"indigo" \| "orange" \| "mint"` | `"indigo"` | Brand accent ramp. |
| `grayColor` | `"gray" \| "mauve" \| "slate" \| "sage"` | `"gray"` | Neutral ramp. |
| `onThemeChange` | `(theme, resolvedTheme) => void` | — | Fires on change (not on initial mount). `resolvedTheme` is `"light"`/`"dark"` when theme is `"system"`. |

These attributes land on `<html>` (root provider) and drive the tokens:

| Attribute | Values |
|---|---|
| `data-theme` | `light`, `dark` |
| `data-style` | `modern`, `traditional` |
| `data-accent-color` | `indigo`, `orange`, `mint` |
| `data-gray-color` | `gray`, `mauve`, `slate`, `sage` |

## Reading & changing the theme: `useTheme`

Exported from both `@raystack/apsara` and `@raystack/apsara/hooks`. Must be called under a `Theme` provider.

```tsx
import { useTheme } from "@raystack/apsara";

function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  return (
    <Button onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
      {resolvedTheme === "dark" ? "Light" : "Dark"} mode
    </Button>
  );
}
```

Returned values:

- `theme` — the active selection (may be `"system"`).
- `resolvedTheme` — the actually applied theme: `forcedTheme` if set; otherwise `"light"`/`"dark"` (resolving `"system"`); otherwise equals `theme`. **Use this for conditional UI**, not `theme`.
- `systemTheme` — OS preference (`"light"`/`"dark"`) when `enableSystem`.
- `setTheme(name)` — update + persist the nearest scope's theme. At the root this persists the user's choice. Passing `undefined` inside a scope clears that scope's storage and re-inherits from the parent.
- `style`, `accentColor`, `grayColor` — the nearest provider's effective values.
- `forcedTheme`, `themes`.

`useTheme({ storageKey })` targets a specific provider (the root or a named scope) instead of the nearest one — useful for flipping the page theme from inside a scoped subtree.

## `ThemeSwitcher`

A minimal prebuilt sun/moon toggle button (toggles light↔dark via `useTheme`):

```tsx
import { ThemeSwitcher } from "@raystack/apsara";

<ThemeSwitcher size={30} />
```

For anything richer (system option, accent pickers), build your own control on top of `useTheme`.

## Scoped (nested) themes

Nesting `<Theme>` scopes overrides to a subtree without affecting the rest of the page. A scope renders a wrapper `<div>` carrying the layered `data-*` attributes, and `useTheme()` inside it sees the scope's effective values.

```tsx
<Theme defaultTheme="dark">
  <App />

  {/* This panel is always light + orange accent, regardless of the page theme */}
  <Theme forcedTheme="light" accentColor="orange">
    <PromoPanel />
  </Theme>
</Theme>
```

- A scope with a `storageKey` persists and registers itself, so `useTheme({ storageKey })` can address it.
- A stateless scope with no overrides is a transparent pass-through (no wrapper, no extra context).
- `setTheme` from a scope updates only that scope and never propagates outward.

## Custom accent / palette beyond the presets

The built-in `accentColor`/`grayColor` presets cover the common cases. To go further, override the `--rs-*` color tokens under a theme selector in your own CSS (see `tokens.md` for the variable names and `styling.md` for override patterns). Prefer overriding **semantic** tokens (`--rs-color-background-accent-emphasis`) over raw scale steps.

## Theming pitfalls

- Conditional rendering should branch on `resolvedTheme`, not `theme` (which can be `"system"`).
- `setTheme(undefined)` is a no-op at the root; inside a persistent scope it clears + re-inherits.
- Next.js: missing `suppressHydrationWarning` on `<html>` causes hydration warnings because the no-flash script pre-sets attributes (see `setup.md`).
- Changing `accentColor`/`grayColor`/`style` at runtime just swaps `data-*` attributes — all themed tokens update automatically; you don't need to re-import CSS.
