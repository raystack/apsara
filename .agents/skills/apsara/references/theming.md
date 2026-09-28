# Theming

Use this for anything involving the `Theme` component, light/dark mode, accent/gray colors, radius, scaling, panel background, reduced motion, reading or changing the theme at runtime, or scoping a theme to part of the tree.

## The `Theme` component

`Theme` renders an element that carries every token-bearing `data-*` attribute, and the token CSS keys off those attributes. Mount it once near the root (see `setup.md`). It can also be nested to scope a theme to a subtree, and a portalled popup re-emits the scope it was opened in, so scoping works everywhere.

Tokens live on that element, so **anything reading `--rs-*` must be inside it**. Nothing is written to `<html>`.

```tsx
import { Theme } from "@raystack/apsara";

<Theme
  persistKey="app-theme"
  defaultValue={{ appearance: "system", accentColor: "indigo" }}
>
  <App />
</Theme>
```

### Settings

One object, seven keys. Each can be seeded, controlled or persisted on its own, and each becomes a data attribute on the theme element.

| Setting | Values | Default | Attribute |
|---|---|---|---|
| `appearance` | `light`, `dark`, `system` | `system` | `data-theme` |
| `accentColor` | `indigo`, `orange`, `mint` | `indigo` | `data-accent-color` |
| `grayColor` | `gray`, `mauve`, `slate`, `sage`, `auto` | `auto` | `data-gray-color` |
| `radius` | `none`, `small`, `medium`, `large`, `full` | `medium` | `data-radius` |
| `scaling` | `0.9`, `0.95`, `1`, `1.05`, `1.1` | `1` | `data-scaling` |
| `panelBackground` | `solid`, `translucent` | `solid` | `data-panel-background` |
| `reducedMotion` | `true`, `false`, `system` | `system` | `data-reduced-motion` |

`system` and `auto` are resolved before the attribute is written, so `data-theme` is always `light` or `dark` and `data-gray-color` is never `auto`. `grayColor: "auto"` pairs a gray to the accent (indigo→slate, orange→mauve, mint→sage).

Fonts are **not** a setting. They are the `--rs-font-body` / `--rs-font-title` / `--rs-font-mono` CSS variables; redeclare them on `.rs-theme`.

### Props

| Prop | Type | Notes |
|---|---|---|
| `defaultValue` | `Partial<ThemeSettings>` | Seeds uncontrolled keys. A stored user choice overrides it. |
| `value` | `Partial<ThemeSettings>` | Per-key control. A controlled key always wins and is never persisted. |
| `onValueChange` | `(value, changed) => void` | Fires when `setValue` requests a change. Controlled keys are reported but not applied; storage-driven changes do not fire it. |
| `persist` | `ThemeSettingKey[]` | Which settings the namespace covers. Defaults to all seven. |
| `persistKey` | `string` | Storage namespace. **Persistence is off unless this is set.** |
| `isRoot` | `boolean` | Whether this theme owns the document's color scheme. Defaults to true when there is no ancestor theme; an embedded widget should pass `false`. |
| `hasBackground` | `boolean` | Overrides the paint heuristic (true at the root and for a nested theme with its own `light`/`dark`, false otherwise). |
| `disableTransitionOnChange` | `boolean` | Suppresses the crossfade during an appearance switch. |
| `nonce` | `string` | CSP nonce for the inline script. |
| `icons` | `IconOptions` | Replaces the drawings inside Apsara's components and sets the props every icon receives. See `components.md` and the Icons docs. |
| `render` | element or function | `asChild`-style escape hatch; merges the theme onto your own element. |
| `className`, `style` | — | The stable `rs-theme` class is always present alongside your classes. |

Control is per key: drive `appearance` from a cookie while leaving accent and radius uncontrolled and persisted.

## Reading & changing the theme: `useTheme`

Must be called inside a `Theme`. It **throws** outside one, because no color token resolves there.

```tsx
import { useTheme } from "@raystack/apsara";

function AppearanceToggle() {
  const { resolved, setValue } = useTheme();
  const isDark = resolved.appearance === "dark";
  return (
    <Button onClick={() => setValue({ appearance: isDark ? "light" : "dark" })}>
      {isDark ? "Light" : "Dark"} mode
    </Button>
  );
}
```

Returned values:

- `value` — settings as set, `system` and `auto` included.
- `resolved` — settings as applied, with `appearance` resolved against the OS and `grayColor` against the accent. **Use this for conditional UI**, not `value`.
- `setValue(partial)` — applies a partial settings object. Controlled keys are reported to `onValueChange` but not applied.
- `systemAppearance` — what the OS reports, whatever the current setting is.
- `root` — the same handle bound to the root provider, for flipping the page theme from inside a scope.

## `ThemeSwitcher`

A prebuilt sun/moon icon button that flips light↔dark. It reads `resolved`, so `system` shows what is actually on screen.

```tsx
import { ThemeSwitcher } from "@raystack/apsara";

<ThemeSwitcher size={30} />          // flips the nearest scope
<ThemeSwitcher target="root" />      // flips the page
```

For anything richer (a system option, accent pickers), build your own control on `useTheme`.

## Scoped (nested) themes

Nesting `Theme` scopes overrides to a subtree. A nested theme inherits every key it does not set, and `useTheme()` inside it sees the scope's effective values.

```tsx
<Theme persistKey="app-theme">
  <App />

  {/* Always light + orange, regardless of the page theme */}
  <Theme value={{ appearance: "light", accentColor: "orange" }}>
    <PromoPanel />
  </Theme>
</Theme>
```

- Scaling does not compound: `0.9` inside `0.9` is `0.9`, not `0.81`.
- A nested theme paints a background only when it sets its own `light` or `dark`; one that only re-tints stays transparent. Override with `hasBackground`.
- A popup (Popover, Select, Menu, Tooltip, Dialog…) opened inside a scope carries that scope's theme onto the portalled element.
- Persistence is per `persistKey`, so a scope, a widget and a second root each keep their own state by default. Two themes sharing a key stay in step.

## Persistence and first paint

Set `persistKey` to persist; without it settings live in memory only. `persist` narrows which keys the namespace covers.

```tsx
<Theme persistKey="app-theme" persist={["appearance"]} />
```

A theme with a `persistKey` emits a small inline script as its first child, which patches its own element before the rest of the page is parsed — no flash, and nothing written to `<html>`. Accent, gray, radius, scaling and panel background server-render correctly on the first byte, so the script usually covers `appearance` alone. `<html>` does **not** need `suppressHydrationWarning`.

## Custom accent / palette beyond the presets

The built-in `accentColor`/`grayColor` presets cover the common cases. To go further, override the `--rs-*` color tokens on `.rs-theme` in your own CSS (see `tokens.md` for names and `styling.md` for patterns). Every `--rs-*` declaration is wrapped in `:where()`, so one class selector wins without `!important`. Prefer **semantic** tokens (`--rs-color-background-accent-emphasis`) over raw scale steps.

## Theming pitfalls

- Conditional rendering should branch on `resolved`, not `value` (which can hold `system`/`auto`).
- `useTheme` throws outside a provider — it is not a no-op. Anything calling it must be inside `Theme`.
- Tokens are not on `<html>`. CSS that declares custom properties on `:root` from `--rs-*` values, and hand-rolled portals rendered outside the tree, resolve to nothing.
- `:where()` means token declarations carry no specificity, so a consumer rule on `:root` now beats them. Scope overrides to `.rs-theme`.
- Changing `accentColor`/`grayColor`/`radius`/`scaling` at runtime just swaps `data-*` attributes — every token updates automatically, with no CSS re-import.
