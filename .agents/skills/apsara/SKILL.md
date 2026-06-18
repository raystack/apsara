---
name: apsara
description: Helps consume the @raystack/apsara React component library correctly in an application. Use when installing or setting up Apsara, building UI with Apsara components (Button, Dialog, Select, Menu, DataTable, Form, Tabs, Sidebar, Toast, etc.), theming (light/dark, accent/gray colors, modern/traditional style), styling with design tokens, or troubleshooting Apsara component behavior. Covers install, the Theme provider, the `--rs-*` token system, compound-component composition, and common pitfalls.
license: ISC
metadata:
  author: raystack
---

# Apsara

Apsara (`@raystack/apsara`) is an open-source React component library built on [Base UI](https://base-ui.com/) primitives. It targets enterprise, data-dense interfaces (data tables, navigation shells, forms, overlays) and ships ~70 accessible, typed components. Styling is **vanilla CSS driven by `--rs-*` design tokens** that react to `data-*` attributes set by the theme provider — there is no Tailwind, no runtime CSS-in-JS, and no per-component install step.

## What this skill is for

Use this skill to help a **consumer** of the published package:

- install and wire up Apsara in a new or existing app (Next.js, Vite, etc.)
- pick and correctly compose Apsara components for a UI task
- theme the app (light/dark, accent/gray color, modern/traditional style)
- style and customize components using design tokens and `data-*` attributes
- avoid common composition and SSR pitfalls

This is **not** the skill for contributing components to the Apsara repo itself — for that, use the `add-new-component` skill.

## Source of truth

The library evolves quickly. Per-component exact props/variants are documented on the live docs site, which serves machine-readable Markdown. **Fetch these instead of guessing an API:**

- Docs index for agents: `https://apsara.raystack.org/llms.txt`
- Full docs (all pages concatenated): `https://apsara.raystack.org/llms-full.txt`
- Any single component: `https://apsara.raystack.org/docs/components/<name>.mdx` (e.g. `.../button.mdx`, `.../select.mdx`, `.../alert-dialog.mdx`)
- Any token category: `https://apsara.raystack.org/tokens/<category>.mdx` (`colors`, `spacing`, `typography`, `effects`, `radius`)

When you need a prop you are unsure about, fetch the component's `.mdx` page rather than inventing it.

## Core facts (always true)

1. **One package, one CSS import.** `npm install @raystack/apsara`, then `import "@raystack/apsara/style.css"` once at the app root. That stylesheet contains every component's styles and all tokens.
2. **Wrap the app in `<Theme>`.** Theming, dark mode, and the no-flash hydration script all come from the `Theme` provider. Without it, `data-theme`/token resolution will not work.
3. **Components are compound, dot-notation.** Apsara exports a single name per component and hangs sub-parts off it: `Dialog.Content`, `Select.Trigger`, `Menu.Item`, `Tabs.Tab`. It does **not** export flat names like `DialogContent`. (Contrast with shadcn/Radix and coss.)
4. **Style with tokens, never hard-coded values.** Use `--rs-*` custom properties (`var(--rs-color-foreground-base-primary)`, `var(--rs-space-5)`) so styling follows the active theme.
5. **Built on Base UI.** Components expose Base UI `data-*` state attributes (`data-open`, `data-disabled`, `data-starting-style`, …) for state-driven CSS, and trigger-based overlays follow Base UI composition.

## Principles for output

1. Use existing Apsara components before inventing custom markup.
2. Verify component props against the live `.mdx` docs; do not fabricate APIs.
3. Use dot-notation sub-components exactly as exported.
4. Use `--rs-*` tokens for all colors, spacing, radius, typography, and effects.
5. Keep accessibility intact: visible/`aria-label` labels, explicit `type` on buttons, icon `aria-hidden` when decorative.
6. Match Apsara's own conventions: CSS Modules + `class-variance-authority` for any custom styled components.

## Usage workflow

1. Confirm setup exists (CSS import + `<Theme>` wrapper). If not, see `references/setup.md`.
2. Identify the component(s) for the task. Use `references/components.md` as the registry index.
3. Fetch the component's `.mdx` page for exact props/variants when unsure.
4. Compose with correct dot-notation sub-parts (`references/composition.md`).
5. Style only via tokens / `className` / `data-*` (`references/styling.md`, `references/tokens.md`).
6. Self-check the output checklist below.

## References (read on demand)

- `references/setup.md` — install, CSS import, `<Theme>` wiring for Next.js App Router & Vite, icons & hooks subpath exports
- `references/theming.md` — full `Theme` / `ThemeProvider` API, `useTheme`, dark mode, accent/gray/style options, scoped (nested) themes, `ThemeSwitcher`
- `references/tokens.md` — **complete `--rs-*` token reference**: semantic colors, color scales, spacing, radius, typography, effects, theme `data-*` attributes
- `references/styling.md` — customizing components via `className`, `style`, `data-*`, CSS Modules, and CVA
- `references/composition.md` — compound dot-notation pattern, Base UI trigger/overlay composition, `render` prop, and per-component composition gotchas
- `references/components.md` — registry index of all exported components grouped by category, with imports and the live docs URL for each

## Output checklist

Before returning Apsara code:

- Component imports come from `@raystack/apsara` (icons from `@raystack/apsara/icons`, hooks from `@raystack/apsara/hooks`).
- Sub-parts use dot-notation exactly as exported (`Dialog.Content`, not `DialogContent`).
- Props/variants are verified against the live `.mdx` docs, not assumed.
- Colors/spacing/radius/typography use `--rs-*` tokens — no hard-coded hex/px for themed values.
- Buttons have explicit `type`; icon-only controls have `aria-label`; decorative icons have `aria-hidden`.
