---
ID: RFC 004
Created: August 3, 2026
Status: Draft
RFC PR: https://github.com/raystack/apsara/pull/880
---

# Theme Improvements

This RFC proposes rewriting the `Theme` component and the token stylesheets under it. Tokens move off `<html>` onto a real element, so the root theme, a nested scope, and a portal all work the same way. That fixes server rendering, the one provider per page limit, and scoped themes breaking inside portals.

On that foundation it adds the customisation surface tracked in [issue #578](https://github.com/raystack/apsara/issues/578), appearance, accent, gray, radius, scaling, panel background, reduced motion and font families, together with per-component `radius` overrides, and it retires `style`. This is a breaking change: no compatibility shim ships, and a migration guide accompanies the implementation.

## Table of Contents

- [Theme Improvements](#theme-improvements)
  - [Table of Contents](#table-of-contents)
  - [Background](#background)
    - [Current Architecture](#current-architecture)
    - [Current Problems](#current-problems)
  - [Proposal](#proposal)
    - [Architecture: Tokens Mount on a Theme Element](#architecture-tokens-mount-on-a-theme-element)
      - [Root Colour Scheme](#root-colour-scheme)
      - [The hasBackground Prop](#the-hasbackground-prop)
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

## Background

### Current Architecture

Apsara themes through data attributes. CSS declares tokens under attribute selectors: `[data-theme]` for colours, `[data-style]` for radius and fonts, `[data-accent-color]` and `[data-gray-color]` for palette ramps. The provider's only job is putting those attributes on an element.

`Theme` (`components/theme-provider/theme.tsx`) branches on whether a `ThemeContext` already exists. With no ancestor it renders `Root`, which writes the attributes onto `document.documentElement` from an effect and emits an inline script repeating those writes before hydration to stop a flash. With an ancestor it renders `Scoped`, a plain `<div>` carrying the same attributes layered over the parent's values.

The rest of the tokens are not attribute-scoped at all. Spacing (`styles/spacing.css`), shadows, transitions, durations, easings and blurs (`styles/effects.css`), and z-index (`styles/primitives/z-index.css`) all sit on `:root`.

### Current Problems

**Two code paths for one concept.** `Root` applies values imperatively through `applyTheme`, `Scoped` applies them as JSX attributes. Separate persistence, separate `storage` listeners, and different `setTheme` semantics: at the root `undefined` is a no-op, in a persistent scope it clears the entry and re-inherits.

**The root cannot be server-rendered.** Attributes on `<html>` come only from an effect or the pre-hydration script, so the server emits nothing and every setting is interpolated into that script.

**Only one provider can exist per document.** `apps/www` shows the cost: `app/layout.tsx` stacks `NextThemeProvider` and Apsara's provider, both competing for `<html>`, and `components/theme.tsx` resolves the conflict by slaving Apsara to next-themes through `forcedTheme` plus a `key` remount hack keyed on accent, gray and style.

**Scoped theming is silently broken in portals.** Thirteen components portal into `document.body`: `alert-dialog`, `combobox`, etc. A portaled component opened inside a `Theme` scope renders in the root's theme. Scoping works today only for the root.

**Half the tokens are not scopable.** Spacing, effects and z-index sit on `:root`, so a scope cannot change them. Scaling and density are blocked until they move.

**Radius is welded to `style`.** `data-style` appears in `styles/radius.css` and `styles/typography.css` and in zero component stylesheets, so `style="modern|traditional"` is exactly a radius scale plus a font pair. The two scales are also not proportional: modern runs 2/4/6/8/12/16 and traditional 8/16/20/24/32/40, ratios from 4× down to 2.5×, so traditional cannot be expressed as a multiple of modern.

**No page background or surface tokens.** Every consumer paints the background by hand. There is no `--rs-color-panel` family for translucent panels to hang off; the thirteen overlay components paint themselves from `--rs-color-background-base-primary` instead, sixteen surface declarations spread across eleven stylesheets.

**A hydration hazard.** `Root` reads `localStorage` in a `useState` initialiser during the hydration render. Harmless for the provider, which has no element to diff, but any child branching on `theme` mismatches. `ThemeSwitcher` does exactly that when it picks between the sun and moon icons, and is separately wrong for `theme === 'system'`, which it treats as light.

**Leftovers from next-themes.** `themes`, `attribute`, `value`, `enableSystem` and `enableColorScheme` model arbitrary named themes, which conflicts with a fixed token system. `enableColorScheme` is redundant with `styles/primitives/appearance.css`, which already sets `color-scheme` under `[data-theme]`.

**Unreachable and duplicated assets.** The `sage` color exists in `styles/primitives/gray.css` but is missing from `GRAY_COLORS` in `types.ts`, so it cannot be selected. `styles/typography.css` opens with four render-blocking Google Fonts imports, Inter, Lora, Josefin Sans and JetBrains Mono, that every consumer pays for regardless of use, and `apps/www` loads Inter again through `next/font/google`. `--rs-font-mono` lists Menlo ahead of JetBrains Mono, so the imported mono font never renders on macOS.

## Proposal

### Architecture: Tokens Mount on a Theme Element

`Theme` renders an element carrying every token-bearing attribute. The root theme, a nested scope and a portal re-injection are the same component rendering the same attributes; only their defaults and background behaviour differ. There is no `Root` and `Scoped` split, no `applyTheme`, and nothing is written to `document.documentElement`.

Because all token declarations are attribute-based, the mount element can be anything. A `render` prop provides the `asChild`-style escape hatch for merging the attributes onto a caller-supplied element instead of adding a wrapper node.

The trade-off accepted here is that consumer CSS and hand-rolled portals living outside the provider no longer see `--rs-*`. That is documented, and the `container` props added to the portalling components give consumers a supported way to place portalled content inside the theme.

#### Root Colour Scheme

Four things the browser paints itself live outside the React tree and cannot be styled from an element inside it: the overscroll area, the document scrollbar, the region below short content, and native widget defaults such as autofill and date pickers. All four follow the root element's `color-scheme`.

The root theme element MUST carry a marker attribute, `data-rs-root`, that nested themes and portal re-injections do not, so the stylesheet can tell the theme that owns the page from a theme somewhere in the tree. `<html>` then derives its colour scheme from that element with `:has()`, in the shape Radix uses: a `:root:where(:has(...))` rule matching the marker plus the appearance attribute. This needs no JavaScript, writes nothing to `<html>`, and re-evaluates as soon as the pre-hydration script patches the attribute. `enableColorScheme` and the imperative `d.style.colorScheme` write are both deleted. The overscroll area follows `color-scheme` on its own, so it lands close to the theme background without a second mechanism.

#### The hasBackground Prop

The component cannot infer whether it should paint, because re-tinting the accent and flipping a panel to dark use the same component but want opposite behaviour. A `hasBackground` prop decides.

When true, the element paints `--rs-color-background-base-primary`, and the root additionally establishes a stacking context and covers the viewport so short pages do not leave an unthemed strip below the content. The default follows Radix's heuristic: true at the root, true for a nested theme that sets an explicit `light` or `dark` appearance, and false for a nested theme that only changes accent, gray, radius or scaling. Consumers that paint their own page background SHOULD pass `hasBackground={false}`; `apps/www` will, since it paints its body in `layout.module.css`. Foreground colour applies regardless of `hasBackground`.

### The Theme API

#### Settings

One settings object describes the theme. Every key is independently seedable and controllable, and every key except `fontFamily` is independently persistable.

| Setting | Values | Default | Mechanism |
|---|---|---|---|
| `appearance` | `light`, `dark`, `system` | `system` | `data-theme` (resolved) |
| `accentColor` | `indigo`, `orange`, `mint` | `indigo` | `data-accent-color` |
| `grayColor` | `gray`, `mauve`, `slate`, `sage`, `auto` | `auto` | `data-gray-color` (resolved) |
| `radius` | `none`, `small`, `medium`, `large`, `full` | `medium` | `data-radius` |
| `scaling` | `90%`, `95%`, `100%`, `105%`, `110%` | `100%` | `data-scaling` |
| `panelBackground` | `solid`, `translucent` | `solid` | `data-panel-background` |
| `reducedMotion` | `true`, `false`, `system` | `system` | `data-reduced-motion` |
| `fontFamily` | `{ body, title, mono }`, each any font stack | Inter, Inter, JetBrains Mono | inline `--rs-font-body`, `--rs-font-title`, `--rs-font-mono` |

The seven enumerated settings become data attributes. `fontFamily` is a single setting holding three free-form stacks that cannot be enumerated, so its members are written as inline custom properties on the theme element. That makes the prop and the CSS variable the same mechanism, which is what lets fonts be overridden either way, and it gives a clear precedence chain: stylesheet default, then the prop as an inline style, then any consumer rule on a deeper element.

`fontFamily` members merge independently in `defaultValue`, in `value` and in `setValue`, exactly as top-level keys do, so passing `{ title: '...' }` leaves body and mono on their defaults rather than clearing them. Only the members actually supplied emit a custom property; the rest fall through to the stylesheet. The member is named `title` rather than issue #578's `heading` so it matches the existing `--rs-font-title` token.

`grayColor: 'auto'` pairs the gray ramp to the accent through a lookup map, and `appearance: 'system'` resolves against `prefers-color-scheme`. Both MUST resolve before the attribute is written, so `data-theme` only ever holds `light` or `dark`.

#### Component Props

| Prop | Purpose |
|---|---|
| `defaultValue` | Partial settings. Seeds uncontrolled keys. Persisted and settable at runtime. |
| `value` | Partial settings. Controlled keys always win; never persisted, never written by the script. |
| `onValueChange` | Fires with the full next settings object and the changed subset. |
| `persist` | `true`, `false`, or an array of setting keys. Default `true`. |
| `storageKey` | Storage key prefix. One key per setting, suffixed by setting name. |
| `hasBackground` | Overrides the painting heuristic. |
| `disableTransitionOnChange` | Suppresses the colour transition during an appearance switch. |
| `nonce` | CSP nonce for the inline script. |
| `render` | `asChild`-style escape hatch for the mount element. |

Control is per key. A consumer MAY drive `appearance` from a cookie while leaving accent and radius uncontrolled, persisted and adjustable. That settles precedence: a key in `value` is authoritative and stale storage cannot shadow it, while a key in `defaultValue` is only a seed that a stored user choice may override.

`disableTransitionOnChange` is retained because `styles/primitives/appearance.css` puts a deliberate 0.4s colour transition on themed elements, and switching appearance without suppressing it produces a visible sweep.

#### The useTheme Hook

The hook mirrors the props and exposes no per-setting setters.

| Member | Description |
|---|---|
| `value` | Settings as set, including `system` and `auto`. |
| `resolved` | Settings as applied, with `appearance` resolved against the OS and `grayColor` against the accent. |
| `setValue` | Takes a partial settings object. Controlled keys are ignored. |
| `root` | The same shape bound to the root provider, for flipping the page theme from inside a scope. |
| `systemAppearance` | What the OS reports, whatever the current setting is. |

`root` replaces the `useTheme({ storageKey })` scope-targeting API and the internal `scopes` registry, with the same capability and no magic string keys.

The hook MUST throw when called outside a provider rather than returning a silent no-op. The failure is already real: every colour token is declared under `[data-theme]`, so a tree with no provider has no colours at all. The internal portal re-injector reads the raw context with a null check and never throws.

### State, Persistence, and Flash Prevention

#### Two Readers of Storage

Storage is read in two places, for two different jobs, and both are needed. The inline script reads it to patch the DOM before first paint, and exists only because server-rendered HTML cannot know a client-side value. React state reads it so the component knows the value, for `useTheme` consumers, re-renders and cross-tab sync.

React state uses `useSyncExternalStore`, the only primitive that reads storage on the first render under CSR without breaking hydration under SSR. Its server snapshot returns the seed, so the hydration render matches the server, and its client snapshot reads storage. Under CSR there is no hydration, so the first render, and therefore the first paint, is already correct with or without the script. Under SSR the script has already corrected the DOM and the post-hydration snapshot returns the same value, so nothing moves. Its subscribe function listens to the `storage` event, which covers cross-tab sync and replaces the two hand-rolled listeners.

Each setting MUST be stored under its own key holding a primitive rather than as one JSON blob, so snapshots compare by value and do not loop.

#### The Inline Script

The script renders as the first child of the theme element and patches its own parent, located through `document.currentScript.parentElement` with a query-selector fallback. The parent's opening tag has already been parsed at that point, so the attribute is corrected before any child content is parsed. Nothing is written to `<html>`.

It is far smaller than the current one, because accent, gray, radius, scaling and panel background are ordinary props that React server-renders correctly on the first byte. The script only patches persisted, uncontrolled settings, which in the default configuration means appearance alone, and is omitted entirely when every persistable setting is either controlled or excluded from `persist`. A consumer reading appearance from a cookie therefore ships no inline script.

The theme element MUST carry `suppressHydrationWarning`, which suppresses attribute diffs one level deep, exactly the scope required. The script and the React reader MUST be generated from one shared configuration of key names, defaults and the `system` resolution rule; the current implementation writes this logic twice and the two copies have already diverged over the `value` and `attribute` mapping.

#### What Persists

`persist` defaults to `true`, covering all enumerated settings, and consumers opt out wholesale or per key.

`fontFamily` MUST NOT be persistable at all, rather than merely excluded by default, so `persist` accepts only the seven enumerated keys. It is the one setting with no realistic runtime picker, and persisting it would recreate the failure the controlled and uncontrolled split exists to prevent: a developer changes the default font in code and their own stale storage keeps serving the old one. It is also the one setting whose value is an object, so admitting it would break the one-primitive-per-key storage rule above. Excluding it keeps the inline script enumerated-only.

### Token System Changes

#### Zero-Specificity Token Declarations

Every `--rs-*` declaration MUST be wrapped in `:where()`. Declarations of real CSS properties MUST keep normal selectors.

Without this, consumer overrides are unreliable or impossible. `styles/primitives/accent.css` declares accent ramps under compound selectors such as `[data-accent-color="orange"][data-theme="dark"]`, specificity (0,2,0), so a consumer's single-class override at (0,1,0) loses outright, leaving only `!important` or a copy of our internal selector shape that breaks whenever we change it. Even where specificity is equal, the winner is decided by bundler output order, which consumers do not reliably control. That is why Radix's documentation has to tell people to load custom CSS after theirs.

`:where()` contributes zero specificity, so any consumer selector on the theme element wins regardless of load order and without `!important`. Ordering among our own rules continues to resolve by source order, as it does today.

This cuts both ways: an unintended consumer selector can overwrite tokens as easily as an intended one. Given the alternative is overrides that cannot be made to work at all, it is the better failure.

#### The rs-theme Class

Every theme element, whether root, scope or portal re-injection, carries a stable `rs-theme` class as the documented CSS override target, so consumers can restyle tokens from their own stylesheet without passing `style`. Combined with `:where()`, a rule on `.rs-theme` reliably beats every built-in token declaration.

#### Scaling

`scaling` is a zoom, not a density control: it multiplies type along with everything else, in the Radix model. Density, meaning tighter spacing and control heights with type left alone, is a separate feature and is deliberately out of scope.

| Scales with `--rs-scaling` | Does not scale |
|---|---|
| `--rs-space-1` through `--rs-space-17` | Border and divider widths |
| `--rs-radius-1` through `--rs-radius-6` | Font weights |
| `--rs-font-size-*`, including title and mono steps | Letter spacing (already `em`-based, so it scales implicitly) |
| `--rs-line-height-*` | |
| Intrinsic component dimensions with no matching token | |

Component CSS carries 357 raw pixel literals, 69 of them `1px`, and 112 border or outline declarations name a pixel width. Borders and dividers MUST NOT scale, and most of the remaining literals either already have a matching token or are decorative offsets. That leaves a tail of roughly forty intrinsic dimensions to triage individually: an intrinsic control height scales, a truncation guard's `max-width` does not.

`--rs-scaling` MUST be set absolutely per value rather than multiplied, so a 90% scope nested inside a 90% scope remains 90%. Spacing, effects and z-index move off `:root` onto the theme selector as part of this, which is what makes them scopable.

#### Radius

Radius becomes a factor applied to a fixed base scale, replacing the two hardcoded scales currently keyed off `data-style`. Two variables drive it: a numeric factor, and a separate full-radius length that pill-shaped elements select with `max()`. Each `--rs-radius-N` derives from its base step multiplied by `--rs-scaling` and the factor.

| `radius` | Factor | Full |
|---|---|---|
| `none` | 0 | 0 |
| `small` | 0.75 | 0 |
| `medium` | 1 | 0 |
| `large` | 1.5 | 0 |
| `full` | 1.5 | pill |

`style` is retired rather than reinterpreted. Traditional is not a constant multiple of modern, so it cannot survive as a factor without changing its output, and since `style` decomposes exactly into a radius level plus a font pair, both of which are now first-class settings, keeping it would mean two knobs fighting over the same six variables. Traditional becomes a documented recipe in the theming guide rather than an API.

#### Surfaces and Panel Background

A surface token family is introduced: a resolved panel colour, its solid and translucent variants, an overlay colour, and a panel backdrop-filter value. `data-panel-background` selects between the variants and switches the backdrop filter on or off, and the variants themselves flip with appearance. `--rs-alpha-a*` already provides the alpha ramps the translucent variant needs, and `dialog.module.css` already uses `backdrop-filter`.

The sixteen surface declarations of `--rs-color-background-base-primary`, across eleven overlay stylesheets, move onto the panel token. The swap is not blind: the same token appears in six more `-hover` state declarations and in three foreground `color` declarations in `tooltip`, `preview-card` and `tour`, none of which are panel surfaces and none of which move. `alert-dialog` and `context-menu` carry no declaration of their own and inherit from `dialog` and `menu`.

The default is `solid`, not Radix's `translucent`, so the appearance of thirteen components does not change silently. Translucency is opt-in.

#### Reduced Motion

`reducedMotion: 'system'` already works, since `prefers-reduced-motion` is honoured across fifty component stylesheets, and it stays the default.

A forced value writes `data-reduced-motion`, under which the duration tokens collapse to a near-zero value. That neutralises transitions and any animation whose duration comes from a token, which is the large majority. It does not reach animations gated behind `@media (prefers-reduced-motion: no-preference)` blocks, which would require converting fifty files to attribute-driven guards.

#### Colour Palette

The accent palette stays at three: `indigo`, `orange` and `mint`. Expansion is recorded as [Alternative A](#alternative-a-expanded-accent-palette) and is open for a vote.

`sage` is added to the gray union so the ramp already present in `styles/primitives/gray.css` becomes selectable, bringing grays to four. `grayColor: 'auto'` becomes the default and pairs each accent with a complementary gray through a lookup map. With three accents that is a three-entry map, and it becomes materially more valuable if the palette is expanded.

One defect to fix while restructuring the palette files: the default indigo ramp is declared under `[data-theme]` rather than `[data-accent-color="indigo"]`, so setting `data-accent-color="indigo"` inside an orange scope does not reset it. Each accent MUST get its own selector.

### Per-Component Overrides

Components gain a single override prop, `radius`, taking the same five values as the theme setting.

Accent override is not offered. With three accents the case is weak, and the semantic `color` prop already covers the common intent. `color` is also overloaded three ways today: semantic on `Button`, `Spinner` and `Chip`, hierarchy on `Separator`, and a thirteen-entry palette on `Avatar`. Radix's spelling, where the per-component override prop is `color` and means palette, is therefore not available to us.

Two semantics distinguish this from Radix. The override MUST affect only the component it is set on, and nothing inside it, because tree-level changes belong to `Theme`; this rules out re-declaring the radius token scale on the element, since custom properties inherit by definition. The override also MUST NOT compound with the theme radius, so a `large` theme with a `small` component yields small rather than large multiplied by small. It therefore re-derives from the component's raw base step instead of scaling the already-scaled token.

The mechanism is a shared cva variant plus a shared CSS module, so no component carries bespoke override CSS. Each participating component contributes one declaration naming its own base radius step, and the shared classes compute the final value from that step, `--rs-scaling` and the level's factor. `full` selects the pill length directly. Because the override class and the component's own class have equal specificity and CSS Modules ordering is not guaranteed, the override selectors MUST use doubled specificity rather than relying on import order.

`Image` and `Avatar` already expose bespoke `radius` variants disconnected from the theme scale, `none | small | medium | full` and `small | full` respectively. Both migrate onto the shared five-value scale so `radius` means one thing library-wide.

### Portals

Portals present two independent problems with two different solutions.

Theme values cross the portal through React context rather than the DOM. An internal component wraps portalled content and re-emits the inherited settings, both the data attributes and the inline font custom properties, onto the portalled element, merging rather than adding a node. This is the standard fix and what Radix does in every portalling component, and it repairs the existing bug where a popover opened inside a scoped theme renders in the root's theme.

Component overrides do not go through context, so they cannot be re-emitted. Instead the override prop lives on the portalled sub-component itself: `Popover.Content`, `Select.Content`, `Dialog.Content`. Nothing then needs forwarding, and Apsara already uses the compound Root, Trigger and Content shape across these components. Within the re-injection, the component's own override MUST resolve after the inherited theme values, or the re-emitted theme value clobbers it.

All thirteen portalling components additionally expose a `container` prop, giving consumers a supported way to portal into a subtree that is inside the theme.

### Stylesheets and Fonts

Font families are overridable two ways, and both resolve to the same three tokens.

| Setting member | Token |
|---|---|
| `fontFamily.body` | `--rs-font-body` |
| `fontFamily.title` | `--rs-font-title` |
| `fontFamily.mono` | `--rs-font-mono` |

Inter and JetBrains Mono remain the defaults. Lora and Josefin Sans are dropped along with `style`, taking the imports from four to two, and the `--rs-font-mono` stack is reordered so JetBrains Mono precedes Menlo.

Two stylesheets are published, and a consumer imports exactly one.

| Export | Contents |
|---|---|
| `style.css` | Tokens, components, and the Inter and JetBrains Mono imports |
| `style-no-fonts.css` | Tokens and components, no font imports |

An internal `fonts.css` partial holds the import statements and is inlined at build time by `postcss-import`. It exists only so the token CSS is not maintained twice, and MUST NOT be listed in package exports.

`normalize.css` remains a separate opt-in export. It is `modern-normalize`, which zeroes margins, padding and borders globally across the consumer's whole application rather than only Apsara components, so folding it into the main stylesheet would shift layouts on upgrade for a cause that is hard to trace. Reducing consumers to a single import requires scoping the reset to Apsara's own components, which is Future Work.

Custom fonts carry a documented caveat rather than a guarantee. `styles/typography.css` pairs pixel font sizes with pixel line heights, and its letter-spacing values are explicitly tuned for Inter; the file says so in a comment. A font with different metrics leaves line heights uncentred and tracking wrong, and because Apsara's controls are sized by padding plus line-height rather than fixed heights, control dimensions shift with it. Radix ships per-role `font-size-adjust` and leading-trim tokens for exactly this, and goes as far as hand-written `@font-face` metric overrides for a single fallback family. Providing that machinery is Future Work; this RFC makes font swapping possible and does not claim it is metric-safe.

## Issue #578 Audit

| # | Proposed | Verdict | Notes |
|---|---|---|---|
| 1 | Scaling / density | Adopted as zoom | Radix model, `90%` to `110%`. Density is separate and out of scope |
| 2 | Border radius control | Adopted | Factor model, plus element-only per-component override |
| 3a | `fontFamily` | Adopted | One setting with `body`, `title` and `mono` members, overridable by prop or CSS variable |
| 3b | `fontSize` scale | Rejected | Redundant, since `scaling` already multiplies every font-size token |
| 4 | `tokens` deep-override prop | Rejected | Obsolete under the new architecture; see Discarded Approaches |
| 5 | Component-level defaults | Rejected | See Discarded Approaches |
| 6a | `reducedMotion: 'system'` | Already works | Honoured across fifty stylesheets |
| 6b | `reducedMotion` forced | Adopted, partial | Duration tokens collapse; the fifty media-query guards are Future Work |
| 6c | `transitionDuration` | Rejected | Overlaps 6b; no equivalent in comparable systems |
| 7 | Nested appearance | Already exists | It is the scoped theming being rewritten |
| 8 | `panelBackground` | Adopted | Needs the new surface tokens; defaults to `solid`, not `translucent` |
| 9 | Cursor tokens | Rejected | See Discarded Approaches |
| 10 | Auto-paired gray | Adopted | `grayColor: 'auto'` becomes the default |
| 11 | Custom accent from a hex or hsl string | Deferred | Runtime ramp generation is Future Work; build-time generation is the viable shape |
| 12 | `borderStyle`: `solid`, `subtle`, `glow` | Deferred | Needs a border colour and glow token family that does not exist yet |
| 13 | `shadowStyle`: `neutral`, `colored`, `glow` | Deferred | Needs shadow colours expressed as RGB so they can be tinted, which the issue itself names as a prerequisite |
| 14 | `animationStyle`: `subtle`, `expressive` | Deferred | Distinct from the rejected `transitionDuration`: it wants per-component curve and duration pairs, not one multiplier |

Items 1 to 10 come from the issue body, 11 to 14 from the comment thread. All four deferrals are additive rather than blocked: each is one new data attribute over one new token family, and once tokens live on the theme element and spacing, effects and z-index are scopable, any of them can land later without the API changing again. All four are recorded under [Future Work](#future-work).

Two departures from the issue's spelling are deliberate. `scaling` ships as `90%` to `110%` rather than `compact | default | comfortable | spacious`, because the values are a zoom factor and density-flavoured names would mis-describe what they do; the names belong to the density feature, which is separate. `appearance` has no `inherit` value, because a nested `Theme` already inherits every key it does not set, so `inherit` is expressed by omission.

The precedence model in the first comment, which layers the feature props over `style`, is superseded: `style` is retired, so each setting stands alone and there is nothing to layer over. That comment's conclusion, that features should carry absolute values rather than values relative to `style`, is preserved by the factor model, where `radius="small"` means the same thing in every configuration. The interface sketch in [issue #578](https://github.com/raystack/apsara/issues/578) is superseded by [The Theme API](#the-theme-api).

## Breaking Changes

| Removed | Replacement |
|---|---|
| `theme` | `value.appearance` |
| `defaultTheme` | `defaultValue.appearance` |
| `forcedTheme` | `value.appearance` |
| `accentColor`, `grayColor` as flat props | `defaultValue.accentColor`, `defaultValue.grayColor` |
| `style` | `radius` plus `fontFamily` |
| `onThemeChange` | `onValueChange` |
| `enableSystem` | `appearance: 'system'` |
| `enableColorScheme` | Handled by the stylesheet |
| `themes`, `attribute`, `value` as a name-to-attribute map | None. Arbitrary named themes are not supported |
| `ThemeProvider` alias | `Theme` |
| `useTheme().theme` / `.setTheme` / `.resolvedTheme` / `.systemTheme` | `value` / `setValue` / `resolved` / `systemAppearance` |
| `useTheme().themes` / `.forcedTheme` / `.style` / `.scopes` | None |
| `useTheme({ storageKey })` | `useTheme().root` |
| `Image` and `Avatar` bespoke `radius` values | The shared five-value scale |

Beyond the API, tokens are no longer available on `<html>`, so consumer CSS and hand-rolled portals outside the provider stop resolving `--rs-*`. `useTheme` throws outside a provider instead of returning a no-op. `ThemeSwitcher` is rewritten against the new hook, which fixes its handling of `system`.

No compatibility shim ships. The migration guide covers each row above with before-and-after examples.

## Implementation Plan

Four stacked pull requests.

Phase 1 lays the token foundation. Wrap every `--rs-*` declaration in `:where()`, move spacing, effects and z-index off `:root` onto the theme selector, add `--rs-scaling`, the radius factor and full-radius variables and the surface tokens, give each accent its own selector, and add `sage` to the gray union. This phase is invisible to consumers, because the current provider writes `data-theme` to `<html>` and a `:where([data-theme])` rule matches it exactly as `:root` did. The widest-reaching and highest-risk change in the RFC therefore lands with no behavioural delta and can be verified on its own.

Phase 2 is the new `Theme`: the element-mounted architecture, `defaultValue` and `value`, `useTheme`, `useSyncExternalStore` persistence, the inline script, the `:has()` colour-scheme rule, `hasBackground` and `render`. It removes `style`, the next-themes leftovers and the `Root` and `Scoped` split.

Phase 3 covers portals and per-component radius: portal re-injection and `container` props across the thirteen portalling components, the shared radius cva and CSS module, and `Image` and `Avatar` migrated onto the shared scale.

Phase 4 covers surfaces, fonts and documentation: the panel token swap, the stylesheet split and font import changes, then documentation, the migration guide and the theme panel in the docs playground.

## Testing

Unit tests only, extending the existing suite. No browser-based testing is introduced; the repository has none today and standing it up is a separate project.

Coverage to add:

- Attribute output for every setting, at the root and in nested scopes
- Controlled versus uncontrolled precedence, per key, including that a controlled key ignores stored values and is never written
- `persist` in all three forms, and that `fontFamily` is not persistable in any of them
- `fontFamily` members merging independently, so a partial object leaves the other two members on their defaults and emits no custom property for them
- Storage reads under CSR, where the first render already carries the correct value
- Storage reads under SSR, where the server snapshot matches the hydration render and the script renders inside the theme element
- Cross-tab synchronisation through the `storage` event
- `system` and `auto` resolution, and `resolved` versus `value`
- The portal re-injector emitting inherited attributes and font custom properties
- `useTheme().root` reaching the root provider from inside a scope
- `useTheme` throwing outside a provider
- Script omission when every persistable setting is controlled or excluded

One known limitation: jsdom does not resolve custom properties from stylesheets, so token arithmetic cannot be asserted at this layer. Whether `scaling: '90%'` produces the right spacing, and whether a per-component `radius` leaks to descendants, are verified by review against the docs playground, which renders every component. Closing that gap is Future Work.

## Impact

`Theme` and `useTheme` are rewritten, so every application wrapping itself in `Theme` must migrate. Within this repository the only consumer is `apps/www`, which is simplified rather than complicated: the `NextThemeProvider` stack, the `forcedTheme` bridge, the `key`-based remount hack and the duplicated Inter load all disappear. Apsara is consumed as an open-source package, so external migration is served by the migration guide rather than coordinated directly.

Every file under `styles/` is touched by phase 1. Component CSS is touched in three places: `border-radius` declarations for the shared radius mechanism, the sixteen panel background declarations, and the fixed-dimension triage for scaling.

The library gains a page background it never painted, scoped theming that works inside portals for the first time, and a token system a consumer can override from their own stylesheet.

## Open Items

- The font-free stylesheet name, proposed as `style-no-fonts.css`. `style-min.css` was considered and set aside because `.min.css` universally denotes a minified build.
- The expanded accent palette, recorded as [Alternative A](#alternative-a-expanded-accent-palette).

## Future Work

- Scoping the reset. Applying a reset class per component instead of a global one would make `normalize.css` safe to fold into the main stylesheet, reducing consumers to a single import.
- Per-role typography metric tokens. Font-size-adjust and leading-trim tokens per role, which would make font swapping metric-safe rather than merely possible.
- Density. A spacing-and-height-only control, separate from `scaling`. It needs a curated per-component map, since a table row and a dialog do not tighten by the same ratio, and it must reconcile with the existing `density` concept in `data-view`.
- Full reduced-motion coverage. Converting the fifty `@media (prefers-reduced-motion)` guards to attribute-driven rules so a forced setting reaches every animation.
- Visual regression testing. Computed-style assertions in a real browser would cover token arithmetic and radius containment, and screenshot testing would cover the overscroll area, the region below short content and translucent panels.
- Expressive style presets. `borderStyle`, `shadowStyle` and `animationStyle` from the issue comment thread, each blocked on a token family rather than on the API: border colour and glow tokens, shadow colours expressed as RGB so they can be tinted by the accent, and per-component curve and duration pairs.
- Runtime custom accent generation. Deriving a twelve-step ramp from an arbitrary brand colour. `culori` is already a dependency, but a perceptually correct ramp is a research problem, costs work on every page load and cannot be server-rendered. If pursued, the right shape is build-time code generation rather than a runtime prop.

## Alternatives

### Alternative A: Expanded Accent Palette

The proposal keeps three accents. This alternative expands the palette by promoting the existing visualisation ramps to accents. `styles/primitives/appearance.css` already defines fourteen visualisation hues, sky, mint, lime, grass, green, jade, cyan, blue, iris, purple, pink, crimson, orange and gold, for both appearances, and `Avatar` already surfaces thirteen of them, so the hue selection is settled.

The cost is not zero and should be understood before voting. Each visualisation hue carries only the four steps the charts needed, 6, 8, 9 and 11, whereas an accent requires the full twelve-step scale plus a contrast value. Promoting a hue therefore means generating the eight missing steps in both appearances and verifying contrast at 9 and 10, which is colour work rather than code generation. `mint` shows why the check matters: its 9 and 10 steps are light enough that its contrast token is dark text rather than white.

Adopting it would strengthen two decisions made under the three-accent assumption. `grayColor: 'auto'` becomes considerably more useful, since pairing matters more across a wide palette, and per-component accent override, rejected here as weak at three accents, becomes worth reconsidering; Radix offers it precisely because they ship twenty-eight.

This is recorded as an open vote rather than a discarded option.

## Discarded Approaches and Considerations

### Rejected Features

Component-level defaults, a theme-level map of default props per component, are already solved in React: a consumer writes a wrapper component and uses it throughout the application, maintaining one file. The library alternative costs a typed props map spanning roughly eighty components, forces the provider to know every component's prop types, and adds a context read to every component.

Cursor tokens are rejected on the same reasoning, since a wrapper component achieves it without new library surface. One caveat is worth recording because reviewers will raise it: the argument is weaker here than for props, because Apsara ships hashed CSS Module class names, so a consumer cannot target component internals from their own stylesheet and would need a wrapper per interactive component along with a specificity contest against disabled states. The decision stands.

A `fontSize` scale is redundant, because `scaling` already multiplies every font-size and line-height token, so a second multiplier would produce two knobs computing the same value. A `transitionDuration` prop is a global animation-speed multiplier that overlaps the reduced-motion work and has no equivalent in comparable systems, so it is skipped as a novelty knob.

A `tokens` deep-override prop was proposed in issue #578 as a deeply-partial token object. The new architecture makes it unnecessary: tokens now live on a real element, so passing `style` with any `--rs-*` property already works, and `.rs-theme` covers the CSS-side case. A prop would add a `DeepPartial` type over roughly two hundred tokens, a runtime object-to-variable serializer and an SSR path, to deliver something the platform already does. The item is closed by documentation.

Runtime custom accent generation is deferred to Future Work rather than rejected outright.

### Rejected Mechanisms

Keeping tokens on `<html>` would preserve two genuine advantages: consumer CSS and hand-rolled portals outside the provider keep working, and the page background costs one line instead of a `:has()` rule. It is rejected because it cannot be server-rendered, forcing every setting into a string-interpolated blocking script; because only one provider can exist per document, a limitation `apps/www` already works around; and because it requires two separate implementations for root and scope, which is the source of most of the current component's complexity. Since portal re-injection is required for scoped themes and component overrides regardless of this choice, the marginal cost of the element-mounted model is close to zero.

Radix's subtree radius scoping implements per-component radius by re-declaring the radius token scale on the element, so the value cascades to descendants and setting `radius="full"` on a card rounds everything inside it. It is rejected in favour of element-only semantics, since tree-level changes belong to `Theme` and a component prop should affect only that component. This is also what forces the non-compounding requirement, because the override can no longer simply re-scale the inherited token.

A zero-JavaScript system-appearance trick would emit every token block twice, once plainly and once inside a `prefers-color-scheme` media query, both keyed to a `system` attribute value, making the default configuration flash-free with no inline script at all. It is rejected because it duplicates essentially the entire colour layer in the shipped bundle, a poor trade against a script measured in hundreds of bytes.

A compatibility shim mapping the old props onto the new shape for a deprecation window was considered and rejected in favour of a clean break with a migration guide. A prop shim could not have covered the structural change anyway, since tokens moving off `<html>` is not expressible as a prop mapping.
