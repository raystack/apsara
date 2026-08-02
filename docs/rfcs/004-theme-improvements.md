---
ID: RFC 004
Created: August 3, 2026
Status: Draft
RFC PR: https://github.com/raystack/apsara/pull/880
---

# Theme Improvements

This RFC proposes a rewrite of Apsara's `Theme` component and a restructuring of the token stylesheets beneath it. The current provider mounts its design tokens on `<html>` by writing attributes imperatively, which makes it impossible to server-render, impossible to nest more than once per document, and silently broken for portalled content inside a scoped theme. The rewrite moves token mounting onto a real element, so the root theme, a scoped subtree, and a portalled popover all become the same mechanism. On top of that foundation it adds the customisation surface tracked in [issue #578](https://github.com/raystack/apsara/issues/578) — appearance, accent, gray, radius, scaling, panel background, reduced motion, and font families — together with per-component `radius` overrides, and it retires the `style` prop whose responsibilities are absorbed by `radius` and the font tokens.

This is a breaking change. There is no compatibility shim; a standalone migration guide accompanies the implementation.

## Table of Contents

- [Theme Improvements](#theme-improvements)
  - [Table of Contents](#table-of-contents)
  - [Background](#background)
    - [Current Architecture](#current-architecture)
    - [Current Problems](#current-problems)
  - [Proposal](#proposal)
    - [Architecture: Tokens Mount on a Theme Element](#architecture-tokens-mount-on-a-theme-element)
      - [Canvas Sync](#canvas-sync)
      - [Background Painting](#background-painting)
    - [The Theme API](#the-theme-api)
      - [Settings](#settings)
      - [Component Props](#component-props)
      - [The useTheme Hook](#the-usetheme-hook)
    - [State, Persistence, and Flash Prevention](#state-persistence-and-flash-prevention)
      - [Two Readers of Storage](#two-readers-of-storage)
      - [The Inline Script](#the-inline-script)
      - [What Persists](#what-persists)
    - [Token System Changes](#token-system-changes)
      - [Zero-Specificity Token Declarations](#zero-specificity-token-declarations)
      - [The rs-theme Class](#the-rs-theme-class)
      - [Scaling](#scaling)
      - [Radius](#radius)
      - [Surfaces and Panel Background](#surfaces-and-panel-background)
      - [Reduced Motion](#reduced-motion)
      - [Colour Palette](#colour-palette)
    - [Per-Component Overrides](#per-component-overrides)
    - [Portals](#portals)
    - [Stylesheets and Fonts](#stylesheets-and-fonts)
  - [Issue #578 Audit](#issue-578-audit)
  - [Breaking Changes](#breaking-changes)
  - [Implementation Plan](#implementation-plan)
  - [Testing](#testing)
  - [Impact](#impact)
  - [Open Items](#open-items)
  - [Future Work](#future-work)
  - [Alternatives](#alternatives)
    - [Alternative A: Expanded Accent Palette](#alternative-a-expanded-accent-palette)
  - [Discarded Approaches and Considerations](#discarded-approaches-and-considerations)
    - [Rejected Features](#rejected-features)
    - [Rejected Mechanisms](#rejected-mechanisms)
  - [Helpful Links](#helpful-links)

## Background

### Current Architecture

Apsara themes through data attributes. CSS declares tokens under attribute selectors — `[data-theme="light"]` for colours, `[data-style="modern"]` for radius and font family, `[data-accent-color="orange"]` and `[data-gray-color="mauve"]` for palette ramps — and the provider's job is to put those attributes on an element.

`Theme` (`components/theme-provider/theme.tsx`) branches on whether a `ThemeContext` already exists. With no ancestor it renders `Root`, which writes `data-theme`, `data-style`, `data-accent-color`, and `data-gray-color` onto `document.documentElement` from inside an effect, and emits an inline script that repeats the same writes before hydration to prevent a flash. With an ancestor it renders `Scoped`, which renders a plain `<div>` carrying the same attributes, layered over the parent's context values.

The remaining token families are not attribute-scoped at all. `--rs-space-*` (`styles/spacing.css`), the shadow, transition, duration, easing and blur tokens (`styles/effects.css`), and the z-index tokens (`styles/primitives/z-index.css`) are declared on `:root`.

### Current Problems

**Two code paths for one concept.** `Root` and `Scoped` share no implementation. `Root` applies its values imperatively through an `applyTheme` callback; `Scoped` applies them declaratively as JSX attributes. They have separate persistence implementations, separate `storage` event listeners, and different `setTheme` semantics — at the root, `undefined` is a no-op; inside a persistent scope it clears the entry and re-inherits.

**The root cannot be server-rendered.** Attributes on `<html>` can only be written by an effect or by the pre-hydration script, so the server emits nothing and every setting has to be string-interpolated into that script. This is the origin of the roughly ninety lines of string concatenation in `theme.tsx`, where `d.setAttribute('data-accent-color', …)` appears in three separate branches.

**Only one provider can exist per document.** `apps/www` demonstrates the cost: `app/layout.tsx` stacks `NextThemeProvider` and Apsara's provider, both competing for `<html>`, and `components/theme.tsx` resolves the conflict by slaving Apsara to next-themes through `forcedTheme` plus a `key` remount hack keyed on accent, gray, and style.

**Scoped theming is silently broken for portalled content.** Thirteen components portal into `document.body` — `alert-dialog`, `combobox`, `command`, `context-menu`, `dialog`, `drawer`, `menu`, `popover`, `preview-card`, `select`, `toast`, `tooltip`, `tour`. None re-injects theme state, and none exposes a `container` prop. A popover opened inside a `Theme` scope renders in the root's theme, because its DOM home is outside the scope's `<div>`. This works today only for the root, and only because the root writes to `<html>`.

**Half the token system is not scopable.** Spacing, effects, and z-index live on `:root`, so a scoped theme cannot change them. Any density or scaling feature is blocked on moving them.

**Radius is welded to `style`.** `data-style` appears in exactly two files — `styles/radius.css` and `styles/typography.css` — and in zero component stylesheets. `style="modern|traditional"` is therefore precisely "a radius scale plus a font-family pair," with no way to vary one without the other. The two scales are also not proportional: modern runs 2/4/6/8/12/16 and traditional 8/16/20/24/32/40, ratios from 4× down to 2.5×, so traditional cannot be expressed as a multiple of modern.

**No page background and no surface tokens.** Nothing in `styles/` or `normalize.css` paints a page background; every consumer does it by hand. There is no `--rs-color-panel` or `--rs-color-surface` family — the thirteen overlay components share twenty declarations of `--rs-color-background-base-primary` — so translucent panels have nothing to hang off.

**A hydration hazard.** `Root` seeds its state with a `useState` initialiser that reads `localStorage` during the hydration render. This is harmless for the provider itself, which mutates `<html>` imperatively and so has no element to diff, but any child branching on `theme` will mismatch. `ThemeSwitcher` does exactly that when it chooses between the sun and moon icons, and is separately wrong for `theme === 'system'`, which it treats as light.

**Leftovers from next-themes.** `themes`, `attribute`, `value`, `enableSystem`, and `enableColorScheme` model arbitrary named themes, which conflicts with a fixed token system. `enableColorScheme` is redundant with `styles/primitives/appearance.css`, which already sets `color-scheme` under `[data-theme]`.

**Unreachable and duplicated assets.** The `sage` gray ramp exists in `styles/primitives/gray.css` but is absent from `GRAY_COLORS` in `types.ts`, so it cannot be selected. `styles/typography.css` opens with four render-blocking Google Fonts imports — Inter, Lora, Josefin Sans, JetBrains Mono — that every consumer pays for regardless of use; `apps/www` loads Inter a second time through `next/font/google`. `--rs-font-mono` lists Menlo ahead of JetBrains Mono, so the imported mono font never renders on macOS.

## Proposal

### Architecture: Tokens Mount on a Theme Element

`Theme` renders an element that carries every token-bearing attribute. The root theme, a nested scope, and the theme re-injected inside a portal are all the same component rendering the same attributes; only their defaults and their background behaviour differ. There is no separate `Root` and `Scoped` implementation, no imperative `applyTheme`, and no writing to `document.documentElement`.

Because all token declarations are attribute-based, the mount element can be anything. A `render` prop provides the `asChild`-style escape hatch for merging the theme attributes onto a caller-supplied element rather than introducing a wrapper node.

The trade-off accepted here is that consumer CSS and hand-rolled portals living outside the provider no longer see `--rs-*`. This is documented, and `container` props on the portalling components give consumers a supported way to place portalled content inside the theme.

#### Canvas Sync

Four things live outside the React tree and cannot be controlled from an element inside it: the overscroll area, the document scrollbar, the region below short content, and native widget defaults such as autofill and date pickers. All four follow the root element's `color-scheme`.

The root theme element is marked with a dedicated attribute — `data-rs-root` — that nested themes and portal re-injections do not carry, so the stylesheet can distinguish "the theme that owns the page" from "a theme somewhere in the tree." `<html>` then derives its colour scheme from that element using `:has()`, in the same shape Radix uses: a `:root:where(:has(…))` rule matching the root marker plus the appearance attribute, setting `color-scheme` accordingly.

No JavaScript is involved, nothing is written to `<html>`, and the rule re-evaluates immediately when the pre-hydration script patches the appearance attribute. The `enableColorScheme` prop and the imperative `d.style.colorScheme` write are both deleted. The overscroll canvas follows `color-scheme` on its own, so it lands close to the theme background without a second mechanism.

#### Background Painting

Once tokens live on a real element, that element can paint — and whether it should is not inferable, because "re-tint the accent here" and "flip this panel to dark" use the same component but need opposite behaviour.

A `hasBackground` prop governs it. When true, the element paints `--rs-color-background-base-primary`; the root additionally establishes a stacking context and covers the viewport so short pages do not expose bare canvas. The default follows Radix's heuristic: true at the root, and true for a nested theme that sets an explicit `light` or `dark` appearance, false for a nested theme that only changes accent, gray, radius, or scaling. Consumers that paint their own page background pass `hasBackground={false}`; `apps/www`, which paints its body in `layout.module.css`, will be one on day one.

Foreground colour is applied unconditionally, independent of `hasBackground`.

### The Theme API

#### Settings

The theme is described by a single settings object. Every key is independently seedable, controllable, and persistable.

| Setting | Values | Default | Mechanism |
|---|---|---|---|
| `appearance` | `light`, `dark`, `system` | `system` | `data-theme` (resolved) |
| `accentColor` | `indigo`, `orange`, `mint` | `indigo` | `data-accent-color` |
| `grayColor` | `gray`, `mauve`, `slate`, `sage`, `auto` | `auto` | `data-gray-color` (resolved) |
| `radius` | `none`, `small`, `medium`, `large`, `full` | `medium` | `data-radius` |
| `scaling` | `90%`, `95%`, `100%`, `105%`, `110%` | `100%` | `data-scaling` |
| `panelBackground` | `solid`, `translucent` | `solid` | `data-panel-background` |
| `reducedMotion` | `true`, `false`, `system` | `system` | `data-reduced-motion` |
| `fontFamily` | any font stack string | Inter stack | inline `--rs-font-body` |
| `fontFamilyTitle` | any font stack string | Inter stack | inline `--rs-font-title` |
| `fontFamilyMono` | any font stack string | JetBrains Mono stack | inline `--rs-font-mono` |

The seven enumerated settings become data attributes. The three font settings are strings and cannot be enumerated, so they are written as inline custom properties on the theme element instead. This makes the prop and the CSS variable literally the same mechanism, which is what allows fonts to be overridden either way, and gives a coherent precedence chain: stylesheet default, then the `Theme` prop as an inline style, then any consumer rule targeting a deeper element.

`grayColor: 'auto'` pairs the gray ramp to the accent through a lookup map, resolved before the attribute is written. `appearance: 'system'` resolves against `prefers-color-scheme` before the attribute is written; `data-theme` therefore only ever holds `light` or `dark`.

#### Component Props

| Prop | Purpose |
|---|---|
| `defaultValue` | Partial settings. Seeds uncontrolled keys. Persisted and settable at runtime. |
| `value` | Partial settings. Controlled keys — always win, never persisted, never written by the script. |
| `onValueChange` | Fires with the full next settings object and the changed subset. |
| `persist` | `true`, `false`, or an array of setting keys. Default `true`. |
| `storageKey` | Storage key prefix. One key per setting, suffixed by setting name. |
| `hasBackground` | Overrides the painting heuristic. |
| `disableTransitionOnChange` | Suppresses the colour transition during an appearance switch. |
| `nonce` | CSP nonce for the inline script. |
| `render` | `asChild`-style escape hatch for the mount element. |

Control is per key. A consumer may drive `appearance` from a cookie while leaving accent and radius uncontrolled, persisted, and adjustable. This resolves the precedence question directly: a key in `value` is authoritative and stale storage can never shadow it, while a key in `defaultValue` is a seed that a user's stored choice legitimately overrides.

`disableTransitionOnChange` is retained because `styles/primitives/appearance.css` deliberately puts a 0.4s colour transition on themed elements, and switching appearance without suppressing it produces a visible sweep.

#### The useTheme Hook

The hook mirrors the props exactly and exposes no per-setting setters.

| Member | Description |
|---|---|
| `value` | The full settings object as set, including `system` and `auto`. |
| `resolved` | The settings as applied — `appearance` resolved against the OS, `grayColor` resolved against the accent. |
| `setValue` | Accepts a partial settings object. Controlled keys are ignored. |
| `root` | The same shape, bound to the root provider, for flipping the page theme from inside a scope. |
| `systemAppearance` | What the OS reports, regardless of the current setting. |

`root` replaces the `useTheme({ storageKey })` scope-targeting API and the internal `scopes` registry, giving the same capability without magic string keys.

The hook throws when called outside a provider rather than returning a silent no-op. This surfaces a failure that is already real: every colour token is declared under `[data-theme]`, so a tree with no provider has no colours at all. The internal portal re-injector reads the raw context with a null check and never throws.

### State, Persistence, and Flash Prevention

#### Two Readers of Storage

Storage is read in two places, for two different purposes, and both are required.

The **inline script** reads storage to patch the DOM before first paint. Its job is the pixels, and it exists only because server-rendered HTML cannot know a client-side value.

**React state** reads storage so the component knows the value — for `useTheme` consumers, for re-renders, and for cross-tab sync. Its job is the state.

React state uses `useSyncExternalStore`, because it is the only primitive that reads storage during the first render under CSR without poisoning hydration under SSR. Its server snapshot returns the seed, so the hydration render matches the server; its client snapshot reads storage. Under CSR there is no hydration, so the first render — and therefore the first paint — is already correct with no script involved. Under SSR the script has already corrected the DOM, and the post-hydration snapshot returns the same value, so nothing moves. Its subscribe function listens to the `storage` event, which delivers cross-tab sync for free and replaces the two hand-rolled listeners in the current implementation.

Each setting is stored under its own key holding a primitive, rather than one JSON blob, so snapshots compare by value and do not loop.

#### The Inline Script

The script renders as the first child of the theme element and patches its own parent, located through `document.currentScript.parentElement` with a query-selector fallback. The parent's opening tag has already been parsed at that point, so the attribute is corrected before any child content is parsed. Nothing is written to `<html>`.

It is far smaller than the current one, because accent, gray, radius, scaling and panel background are ordinary props that React server-renders correctly on the first byte. The script only patches persisted, uncontrolled settings — in the default configuration, appearance alone.

The theme element carries `suppressHydrationWarning`, which suppresses attribute diffs one level deep, exactly the scope required.

The script is omitted entirely when there is nothing for it to resolve — when every persistable setting is either controlled or excluded from `persist`. A consumer reading appearance from a cookie therefore ships no inline script at all.

The script and the React reader must be generated from one shared configuration of key names, defaults, and the `system` resolution rule. The current implementation writes this logic twice and the two copies have already diverged in how they handle the `value` and `attribute` mapping.

#### What Persists

`persist` defaults to `true`, covering all enumerated settings. Consumers opt out wholesale or per key.

Font families are excluded from the default persist set. They are the one group with no realistic runtime picker, and persisting them would recreate the failure the controlled/uncontrolled split exists to prevent: a developer changes the default font in code and their own stale storage keeps serving the old one. Keeping fonts out also keeps the inline script enumerated-only.

### Token System Changes

#### Zero-Specificity Token Declarations

Every `--rs-*` declaration is wrapped in `:where()`. Declarations of real CSS properties keep normal selectors.

Without this, consumer overrides are unreliable or impossible. `styles/primitives/accent.css` declares accent ramps under compound selectors such as `[data-accent-color="orange"][data-theme="dark"]`, specificity (0,2,0); a consumer's single-class override at (0,1,0) loses outright, and the only escapes are `!important` or duplicating our internal selector shape, which then breaks whenever we change it. Even in the equal-specificity cases the winner is decided by bundler output order, which consumers do not reliably control — the reason Radix's documentation has to advise loading custom CSS after theirs.

`:where()` contributes zero specificity, so any consumer selector on the theme element wins regardless of load order and without `!important`. Ordering among our own rules continues to resolve by source order, which is already the case today.

The accepted trade-off is that a consumer's unintended selector can also clobber tokens. Given the alternative is overrides that cannot be made to work at all, this is the correct side to err on.

#### The rs-theme Class

Every theme element — root, scope, and portal re-injection — carries a stable `rs-theme` class as the documented CSS override target, so consumers can restyle tokens from their own stylesheet without passing `style`. Combined with `:where()`, a consumer rule on `.rs-theme` reliably beats every built-in token declaration.

#### Scaling

`scaling` is a zoom, not a density control: it multiplies type along with everything else, in the Radix model. Density — tightening spacing and control heights while leaving type alone — is a distinct feature and is deliberately not in scope.

| Scales with `--rs-scaling` | Does not scale |
|---|---|
| `--rs-space-1` … `--rs-space-17` | Border and divider widths |
| `--rs-radius-1` … `--rs-radius-6` | Font weights |
| `--rs-font-size-*`, including title and mono steps | Letter spacing — already `em`-based, so it scales implicitly |
| `--rs-line-height-*` | |
| Intrinsic component dimensions with no matching token | |

Roughly 113 of the 357 raw pixel literals in component CSS are hairline borders and dividers, which must not scale. The remaining fixed dimensions are a tail of around forty and get triaged individually: an intrinsic control height scales, a truncation guard's `max-width` does not.

`--rs-scaling` is set absolutely per value rather than multiplied, so a 90% scope nested inside a 90% scope remains 90%.

Spacing, effects, and z-index move off `:root` onto the theme selector as part of this, which is what makes them scopable.

#### Radius

Radius becomes a factor applied to a fixed base scale, replacing the two hardcoded scales currently keyed off `data-style`. Two variables drive it: a numeric factor, and a separate full-radius length that pill-shaped elements select with `max()`.

| `radius` | Factor | Full |
|---|---|---|
| `none` | 0 | 0 |
| `small` | 0.75 | 0 |
| `medium` | 1 | 0 |
| `large` | 1.5 | 0 |
| `full` | 1.5 | pill |

Each `--rs-radius-N` derives from its base step multiplied by `--rs-scaling` and the factor.

`style` is retired rather than reinterpreted. Because the traditional scale is not a constant multiple of the modern one, it cannot survive as a factor without changing its output — and since `style` decomposes exactly into a radius level plus a font-family pair, both of which are now first-class settings, keeping it would mean two knobs fighting over the same six variables. "Traditional" becomes a documented recipe in the theming guide rather than an API.

#### Surfaces and Panel Background

A surface token family is introduced: a resolved panel colour, its solid and translucent variants, an overlay colour, and a panel backdrop-filter value. `data-panel-background` selects between the solid and translucent variants and switches the backdrop filter on or off. The variants themselves flip with appearance.

The twenty `--rs-color-background-base-primary` declarations across the thirteen overlay components move onto the panel token. `--rs-alpha-a*` already provides the alpha ramps the translucent variant needs, and `dialog.module.css` already uses `backdrop-filter`.

The default is `solid`, not Radix's `translucent`, so the appearance of thirteen components does not change silently. Translucency is opt-in.

#### Reduced Motion

`reducedMotion: 'system'` already works: `prefers-reduced-motion` is honoured across fifty component stylesheets today, and remains the default.

A forced value writes `data-reduced-motion`, under which the duration tokens collapse to a near-zero value. This neutralises transitions and any animation whose duration comes from a token, which is the large majority. It does not reach the animations gated behind `@media (prefers-reduced-motion: no-preference)` blocks, which would require converting fifty files to attribute-driven guards. The partial coverage is documented; the full conversion is listed under Future Work.

#### Colour Palette

The accent palette stays at three — `indigo`, `orange`, `mint`. See [Alternatives](#alternatives) for the expansion proposal, which is open for a vote.

`sage` is added to the gray union so the ramp already present in `styles/primitives/gray.css` becomes selectable, bringing grays to four.

`grayColor: 'auto'` becomes the default and pairs each accent with a complementary gray through a lookup map. With three accents this is a three-entry map; it becomes materially more valuable if the palette is expanded.

One defect to fix while restructuring the palette files: the default indigo ramp is declared under `[data-theme]` rather than `[data-accent-color="indigo"]`, so setting `data-accent-color="indigo"` inside an orange scope does not reset it. Each accent gets its own selector.

### Per-Component Overrides

Components gain a single override prop, `radius`, taking the same five values as the theme setting.

Accent override is not offered. With three accents the case is weak, and the semantic `color` prop already covers the common intent — though note that `color` is currently overloaded three different ways across the library, meaning semantic intent on `Button`, `Spinner` and `Chip`, hierarchy on `Separator`, and a thirteen-entry palette on `Avatar`. Radix's per-component override prop is named `color` and means palette; ours cannot be.

Two semantics distinguish this from Radix's implementation:

**Element-only.** The override affects the component it is set on and nothing inside it. Tree-level changes are made through `Theme`, not by setting a prop on an arbitrary component. This rules out Radix's approach of re-declaring the radius token scale on the element, since custom properties inherit by definition.

**Non-compounding.** A `large` theme with a `small` component yields small, not large multiplied by small. The override therefore re-derives from the component's raw base step rather than scaling the already-scaled token.

The mechanism is a shared cva variant plus a shared CSS module, so no component carries bespoke override CSS. Each participating component contributes one declaration naming its own base radius step; the shared classes compute the final value from that step, `--rs-scaling`, and the level's factor. The `full` level selects the pill length directly.

One implementation constraint: the override class and the component's own class have equal specificity, so bundle order would otherwise decide the winner, and CSS Modules ordering is not guaranteed. The override selectors are written with doubled specificity rather than relying on import order.

`Image` and `Avatar` already expose bespoke `radius` variants disconnected from the theme scale — `none | small | medium | full` and `small | full` respectively. Both migrate onto the shared five-value scale so `radius` means one thing library-wide.

### Portals

Two independent problems, with two different solutions.

**Theme values** cross the portal through React context, not the DOM. An internal component wraps portalled content and re-emits the inherited settings — data attributes and the inline font custom properties alike — onto the portalled element, merging rather than adding a node. This is the standard fix and is what Radix does in every portalling component. It also repairs the existing bug where a popover opened inside a scoped theme renders in the root's theme.

**Component overrides** do not go through context, so they cannot be re-emitted. Instead the override prop lives on the portalled sub-component itself: `Popover.Content`, `Select.Content`, `Dialog.Content`. There is then nothing to forward. Apsara already uses the compound Root/Trigger/Content shape across these components, so the prop has a natural home.

Order matters within the re-injection: the component's own override must be resolved after the inherited theme values, or the re-emitted theme value clobbers it.

All thirteen portalling components additionally expose a `container` prop, giving consumers a supported way to portal into a subtree that is inside the theme.

### Stylesheets and Fonts

Font families are overridable two ways, and both resolve to the same three tokens.

| Prop | Token |
|---|---|
| `fontFamily` | `--rs-font-body` |
| `fontFamilyTitle` | `--rs-font-title` |
| `fontFamilyMono` | `--rs-font-mono` |

Inter and JetBrains Mono remain the defaults. Lora and Josefin Sans are dropped along with `style`, taking the imports from four to two. The `--rs-font-mono` stack is reordered so JetBrains Mono precedes Menlo.

Two stylesheets are published, and a consumer imports exactly one:

| Export | Contents |
|---|---|
| `style.css` | Tokens, components, and the Inter and JetBrains Mono imports |
| `style-no-fonts.css` | Tokens and components, no font imports |

An internal `fonts.css` partial holds the import statements and is inlined at build time by `postcss-import`. It exists only so the token CSS is not maintained twice, and is never listed in package exports.

`normalize.css` remains a separate opt-in export. It is `modern-normalize`, which zeroes margins, padding and borders globally across the consumer's entire application, not only Apsara components. Folding that into the main stylesheet would shift layouts on upgrade with a cause that is hard to trace. Making single-import possible requires scoping the reset to Apsara's own components, which is listed under Future Work.

Custom fonts carry a documented caveat rather than a guarantee. `styles/typography.css` pairs pixel font sizes with pixel line heights, and its letter-spacing values are explicitly tuned for Inter — the file says so in a comment. A font with different metrics leaves line heights uncentred and tracking wrong, and because Apsara's controls are sized by padding plus line-height rather than fixed heights, control dimensions shift. Radix ships per-role `font-size-adjust` and leading-trim tokens for exactly this, and goes as far as hand-written `@font-face` metric overrides for a single fallback family. Providing that machinery is Future Work; this RFC documents the constraint and does not claim metric safety.

## Issue #578 Audit

| # | Proposed | Verdict | Notes |
|---|---|---|---|
| 1 | Scaling / density | Adopted as zoom | Radix model, `90%`–`110%`. Density is a separate feature, not in scope |
| 2 | Border radius control | Adopted | Factor model, plus element-only per-component override |
| 3a | `fontFamily` | Adopted | Three settings, overridable by prop or CSS variable |
| 3b | `fontSize` scale | Rejected | Redundant — `scaling` already multiplies every font-size token |
| 4 | `tokens` deep-override prop | Rejected | Obsolete under the new architecture; see Discarded Approaches |
| 5 | Component-level defaults | Rejected | See Discarded Approaches |
| 6a | `reducedMotion: 'system'` | Already works | Honoured across fifty stylesheets |
| 6b | `reducedMotion` forced | Adopted, partial | Duration tokens collapse; the fifty media-query guards are Future Work |
| 6c | `transitionDuration` | Rejected | Overlaps 6b; no equivalent in comparable systems |
| 7 | Nested appearance | Already exists | It is the scoped theming being rewritten |
| 8 | `panelBackground` | Adopted | Requires the new surface token family; defaults to `solid`, not `translucent` |
| 9 | Cursor tokens | Rejected | See Discarded Approaches |
| 10 | Auto-paired gray | Adopted | `grayColor: 'auto'` becomes the default |

The interface sketch in the issue is superseded by [The Theme API](#the-theme-api).

## Breaking Changes

| Removed | Replacement |
|---|---|
| `theme` | `value.appearance` |
| `defaultTheme` | `defaultValue.appearance` |
| `forcedTheme` | `value.appearance` |
| `accentColor`, `grayColor` as flat props | `defaultValue.accentColor`, `defaultValue.grayColor` |
| `style` | `radius` plus the font settings |
| `onThemeChange` | `onValueChange` |
| `enableSystem` | `appearance: 'system'` |
| `enableColorScheme` | Handled by the stylesheet |
| `themes`, `attribute`, `value` as a name-to-attribute map | None — arbitrary named themes are not supported |
| `ThemeProvider` alias | `Theme` |
| `useTheme().theme` / `.setTheme` / `.resolvedTheme` / `.systemTheme` | `value` / `setValue` / `resolved` / `systemAppearance` |
| `useTheme().themes` / `.forcedTheme` / `.style` / `.scopes` | None |
| `useTheme({ storageKey })` | `useTheme().root` |
| `Image` and `Avatar` bespoke `radius` values | The shared five-value scale |

Beyond the API, the structural change means tokens are no longer available on `<html>`: consumer CSS and hand-rolled portals outside the provider stop resolving `--rs-*`. `useTheme` now throws outside a provider instead of returning a no-op. `ThemeSwitcher` is rewritten against the new hook, fixing its incorrect handling of `system`.

No compatibility shim ships. A standalone migration guide covers each row above with before-and-after examples.

## Implementation Plan

Four stacked pull requests.

**1 — Token foundation.** Wrap every `--rs-*` declaration in `:where()`. Move spacing, effects, and z-index off `:root` onto the theme selector. Introduce `--rs-scaling`, the radius factor and full-radius variables, and the surface token family. Give each accent its own selector. Add `sage` to the gray union.

This phase is invisible to consumers. The current provider writes `data-theme` to `<html>`, and a `:where([data-theme])` rule matches it exactly as `:root` did — so the widest-reaching, highest-risk change in the RFC lands with no behavioural delta and can be verified on its own.

**2 — The new `Theme`.** The element-mounted architecture, `defaultValue` and `value`, `useTheme`, `useSyncExternalStore` persistence, the inline script, `:has()` canvas sync, `hasBackground`, and the `render` escape hatch. Removes `style`, the next-themes leftovers, and the `Root`/`Scoped` split.

**3 — Portals and per-component radius.** The portal re-injection component across the thirteen portalling components, plus `container` props. The shared radius cva and CSS module, applied across components that expose the prop. `Image` and `Avatar` migrated onto the shared scale.

**4 — Surfaces, fonts, and documentation.** The panel token swap across the twenty overlay declarations. The stylesheet split and font import changes. Documentation, the migration guide, and the theme panel in the docs playground.

## Testing

Unit tests only, extending the existing suite. No browser-based testing is introduced; the repository has none today, and standing it up is a separate project.

Coverage to add:

- Attribute output for every setting, at the root and in nested scopes
- Controlled versus uncontrolled precedence, per key, including that a controlled key ignores stored values and is never written
- `persist` in all three forms, and that font settings are excluded by default
- Storage reads under CSR — the first render already carries the correct value
- Storage reads under SSR — the server snapshot matches the hydration render, and the script renders inside the theme element
- Cross-tab synchronisation through the `storage` event
- `system` and `auto` resolution, and `resolved` versus `value`
- The portal re-injector emitting inherited attributes and font custom properties
- `useTheme().root` reaching the root provider from inside a scope
- `useTheme` throwing outside a provider
- Script omission when every persistable setting is controlled or excluded

A known limitation: jsdom does not resolve custom properties from stylesheets, so token arithmetic — whether `scaling: '90%'` actually produces the right spacing, and whether a per-component `radius` leaks to descendants — cannot be asserted in this layer. Those outcomes are verified by review against the docs playground, which renders every component. Closing this gap is listed under Future Work.

## Impact

The `Theme` component and `useTheme` are rewritten; every application wrapping itself in `Theme` must migrate. Within this repository the only consumer is `apps/www`, which is simplified rather than complicated: the `NextThemeProvider` stack, the `forcedTheme` bridge, and the `key`-based remount hack in `components/theme.tsx` all disappear, as does the duplicated Inter load. Apsara is consumed as an open-source package, so external migration is served by the migration guide rather than coordinated directly.

Every file under `styles/` is touched by phase 1. Component CSS is touched in three places: `border-radius` declarations for the shared radius mechanism, the twenty panel background declarations, and the fixed-dimension triage for scaling.

The library gains a page background it never painted, a scoped theming feature that works for portalled content for the first time, and a token system a consumer can actually override from their own stylesheet.

## Open Items

- **Font-free stylesheet name.** Proposed as `style-no-fonts.css`. `style-min.css` was also considered and set aside because `.min.css` universally denotes a minified build.
- **Expanded accent palette.** See [Alternatives](#alternatives).

## Future Work

- **Scoping the reset.** Applying a reset class per component instead of a global one would make `normalize.css` safe to fold into the main stylesheet, reducing consumers to a single import.
- **Per-role typography metric tokens.** Font-size-adjust and leading-trim tokens per role, which would make font swapping metric-safe rather than merely possible.
- **Density.** A spacing-and-height-only control, separate from `scaling`. It needs a curated per-component map — a table row and a dialog do not tighten by the same ratio — and must reconcile with the existing `density` concept in `data-view`.
- **Full reduced-motion coverage.** Converting the fifty `@media (prefers-reduced-motion)` guards to attribute-driven rules so a forced setting reaches every animation.
- **Visual regression testing.** Computed-style assertions in a real browser would cover token arithmetic and radius containment; screenshot testing would cover the canvas, overscroll, and translucent panels.
- **Runtime custom accent generation.** Deriving a twelve-step ramp from an arbitrary brand colour. `culori` is already a dependency, but a perceptually correct ramp is a research problem, costs work on every page load, and cannot be server-rendered. If pursued, the right shape is build-time code generation, not a runtime prop.

## Alternatives

### Alternative A: Expanded Accent Palette

The proposal keeps three accents. The alternative expands the palette by promoting the existing visualisation ramps to accents.

`styles/primitives/appearance.css` already defines fourteen visualisation hues — sky, mint, lime, grass, green, jade, cyan, blue, iris, purple, pink, crimson, orange, gold — for both light and dark, and `Avatar` already surfaces a thirteen-value palette drawn from them. The hue selection is therefore settled.

The cost is not zero, and should be understood before voting. Each visualisation hue carries only the four steps the charts needed — 6, 8, 9 and 11 — whereas an accent requires the full twelve-step scale plus a contrast value. Promoting a hue means generating the eight missing steps in both appearances and verifying contrast at 9 and 10, which is colour work rather than code generation. The existing three accents show what a complete ramp looks like, and `mint` shows why the check matters: its 9 and 10 steps are light enough that its contrast token is dark text rather than white.

Adopting it would strengthen two decisions made under the three-accent assumption. `grayColor: 'auto'` becomes materially useful, since pairing matters more across a wide palette. And per-component accent override, rejected here as weak at three accents, becomes worth reconsidering — Radix offers it precisely because they ship twenty-eight.

This is recorded as an open vote rather than a discarded option.

## Discarded Approaches and Considerations

### Rejected Features

**Component-level defaults.** A theme-level map of default props per component was rejected because it is already solved in React: a consumer writes a wrapper component and uses it throughout the application, maintaining one file. The library alternative costs a typed props map spanning roughly eighty components, forces the provider to know every component's prop types, and adds a context read to every component.

**Cursor tokens.** Rejected on the same reasoning — a wrapper component achieves it without new library surface. Recorded caveat: the argument is weaker here than for props, because Apsara ships hashed CSS Module class names, so a consumer cannot target component internals from their own stylesheet and would need a wrapper per interactive component along with a specificity contest against disabled states. The decision stands; the caveat is noted because reviewers will raise it.

**A `fontSize` scale.** Redundant. `scaling` already multiplies every font-size and line-height token, so a second multiplier would produce two knobs computing the same value.

**`transitionDuration`.** A global animation-speed multiplier overlaps the reduced-motion work and has no equivalent in comparable systems. Skipped as a novelty knob.

**A `tokens` deep-override prop.** Issue #578 proposed a deeply-partial token object. This was rejected because the new architecture makes it unnecessary: tokens now live on a real element, so passing `style` with any `--rs-*` property already works, and `.rs-theme` covers the CSS-side case. A prop would add a `DeepPartial` type over roughly two hundred tokens, a runtime object-to-variable serializer, and an SSR path — to deliver something the platform already does. The item is closed by documentation.

**Runtime custom accent generation.** Deferred to Future Work rather than rejected outright; see above.

### Rejected Mechanisms

**Keeping tokens on `<html>`.** Retaining the current mount point would preserve two genuine advantages — consumer CSS and hand-rolled portals outside the provider keep working, and the canvas background costs one line instead of a `:has()` rule. It was rejected because it cannot be server-rendered, forcing every setting into a string-interpolated blocking script; because only one provider can exist per document, a limitation `apps/www` already works around; and because it requires two separate implementations for root and scope, which is the source of most of the current component's complexity. Since portal re-injection is required for scoped themes and component overrides regardless of this choice, the marginal cost of the element-mounted model is close to zero.

**Radix's subtree radius scoping.** Radix implements per-component radius by re-declaring the radius token scale on the element, so the value cascades to descendants — setting `radius="full"` on a card rounds everything inside it. Rejected in favour of element-only semantics: tree-level changes belong to `Theme`, and a component prop should affect only that component. This also forced the non-compounding requirement, since the override can no longer simply re-scale the inherited token.

**A zero-JavaScript system-appearance trick.** Emitting every token block twice — once plainly and once inside a `prefers-color-scheme` media query, both keyed to a `system` attribute value — would make the default configuration flash-free with no inline script at all. Rejected because it duplicates essentially the entire colour layer in the shipped bundle, which is a poor trade against a script measured in hundreds of bytes.

**A compatibility shim.** Mapping the old props onto the new shape for a deprecation window was considered and rejected in favour of a clean break with a migration guide. A prop shim could not have covered the structural change anyway, since tokens moving off `<html>` is not expressible as a prop mapping.

## Helpful Links

- [Issue #578 — Theme: Enhance customization capabilities](https://github.com/raystack/apsara/issues/578)
- [Radix Themes playground](https://www.radix-ui.com/themes/playground)
- [Radix Themes source — `components/theme.tsx`](https://github.com/radix-ui/themes/blob/main/packages/radix-ui-themes/src/components/theme.tsx)
- [Radix Themes source — `styles/tokens/`](https://github.com/radix-ui/themes/tree/main/packages/radix-ui-themes/src/styles/tokens)
- [Radix Themes — Typography customisation](https://www.radix-ui.com/themes/docs/theme/typography)
- [MDN — `:where()`](https://developer.mozilla.org/en-US/docs/Web/CSS/:where)
- [React — `useSyncExternalStore`](https://react.dev/reference/react/useSyncExternalStore)
