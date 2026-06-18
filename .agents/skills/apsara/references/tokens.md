# Design Tokens (`--rs-*`)

Apsara's entire visual system is CSS custom properties prefixed `--rs-`, all shipped in `@raystack/apsara/style.css`. Reference them with `var(--rs-…)` in your CSS / inline styles so your UI inherits theme, accent, gray, and style-variant changes automatically.

Live, always-current versions of each category:
`https://apsara.raystack.org/tokens/{colors,spacing,typography,effects,radius}.mdx`

## How the token system is layered

1. **Primitive ramps** — raw color scales, steps `1`–`12` (Radix-style), e.g. `--rs-neutral-1 … --rs-neutral-12`, `--rs-accent-1 … --rs-accent-12`, plus `-contrast` and alpha (`-a1 … -a12`). These are remapped when `data-accent-color` / `data-gray-color` change. **Don't consume primitives directly** — use semantic tokens.
2. **Semantic tokens** — meaning-based aliases that point at primitives and flip with `data-theme`, e.g. `--rs-color-foreground-base-primary`. **These are what you should use.**
3. **Scalar tokens** — spacing, radius, typography, effects.

> **Rule of thumb:** prefer `--rs-color-foreground-base-primary` over `--rs-neutral-12`. Semantic tokens carry intent and adapt across themes; primitives do not.

The active neutral ramp is exposed as `--rs-neutral-*` (driven by `data-gray-color`) and the active brand ramp as `--rs-accent-*` (driven by `data-accent-color`). Status ramps are `--rs-danger-*`, `--rs-success-*`, `--rs-attention-*`.

---

## Color tokens (semantic)

All semantic color tokens are defined for both `[data-theme="light"]` and `[data-theme="dark"]` and resolve automatically.

### Foreground (text / icons)

| Token | Purpose |
|---|---|
| `--rs-color-foreground-base-primary` | Primary text |
| `--rs-color-foreground-base-secondary` | Secondary / muted text |
| `--rs-color-foreground-base-tertiary` | Tertiary / disabled-ish text |
| `--rs-color-foreground-base-emphasis` | Text on emphasis/inverted surfaces |
| `--rs-color-foreground-accent-primary` / `-hover` | Accent-colored text |
| `--rs-color-foreground-accent-emphasis` | Text on an accent-emphasis fill |
| `--rs-color-foreground-danger-primary` / `-hover` / `-emphasis` | Danger text |
| `--rs-color-foreground-success-primary` / `-hover` / `-emphasis` | Success text |
| `--rs-color-foreground-attention-primary` / `-hover` / `-emphasis` | Attention/warning text |

### Background (surfaces / fills)

| Token | Purpose |
|---|---|
| `--rs-color-background-base-primary` / `-hover` | App / primary surface |
| `--rs-color-background-base-secondary` | Secondary surface (cards, raised) |
| `--rs-color-background-neutral-primary` | Neutral fill |
| `--rs-color-background-neutral-secondary` / `-hover` | Neutral fill (subtle controls) |
| `--rs-color-background-neutral-tertiary` / `-hover` | Stronger neutral fill |
| `--rs-color-background-neutral-emphasis` | High-contrast neutral fill |
| `--rs-color-background-accent-primary` | Subtle accent surface |
| `--rs-color-background-accent-emphasis` / `-hover` | Solid accent fill (primary buttons) |
| `--rs-color-background-danger-primary` | Subtle danger surface |
| `--rs-color-background-danger-emphasis` / `-hover` | Solid danger fill |
| `--rs-color-background-success-primary` | Subtle success surface |
| `--rs-color-background-success-emphasis` / `-hover` | Solid success fill |
| `--rs-color-background-attention-primary` | Subtle attention surface |
| `--rs-color-background-attention-emphasis` / `-hover` | Solid attention fill |

### Border

| Token | Purpose |
|---|---|
| `--rs-color-border-base-primary` | Default border |
| `--rs-color-border-base-secondary` | Subtle border |
| `--rs-color-border-base-tertiary` / `-hover` | Stronger / structural border |
| `--rs-color-border-base-focus` | Focus ring border |
| `--rs-color-border-base-emphasis` | High-contrast border |
| `--rs-color-border-accent-primary` | Accent border |
| `--rs-color-border-accent-emphasis` / `-hover` | Solid accent border |
| `--rs-color-border-danger-primary` / `-emphasis` / `-hover` | Danger borders |
| `--rs-color-border-success-primary` / `-emphasis` / `-hover` | Success borders |
| `--rs-color-border-attention-primary` / `-emphasis` / `-hover` | Attention borders |

### Overlays

Translucent layers for scrims, hovers, and elevation. `base` follows the theme; `black`/`white` are fixed.

- `--rs-color-overlay-base-a1 … -a12` — theme-aware alpha overlay
- `--rs-color-overlay-black-a1 … -a12` — black at increasing opacity (`0.05`→`0.95`)
- `--rs-color-overlay-white-a1 … -a12` — white at increasing opacity (`0.05`→`0.95`)

### Visualization (charts / categorical)

14 hues, each with steps `6`, `8`, `9`, `11`: `--rs-color-viz-<hue>-<step>`.

Hues: `sky`, `mint`, `lime`, `grass`, `green`, `jade`, `cyan`, `blue`, `iris`, `purple`, `pink`, `crimson`, `orange`, `gold`. Example: `var(--rs-color-viz-blue-9)`.

### Raw scales (advanced — prefer semantic tokens)

`--rs-neutral-{1..12}`, `--rs-accent-{1..12}` (+ `--rs-accent-contrast`), `--rs-danger-{1..12}`, `--rs-success-{1..12}`, `--rs-attention-{1..12}` (each with `-contrast`), plus theme-aware alpha `--rs-alpha-a{1..12}`.

```css
.card {
  color: var(--rs-color-foreground-base-primary);
  background: var(--rs-color-background-base-secondary);
  border: 1px solid var(--rs-color-border-base-primary);
}
```

---

## Spacing — `--rs-space-*`

Use for padding, margin, and gap. Values are in `px`.

| Token | px | | Token | px |
|---|---|---|---|---|
| `--rs-space-1` | 2 | | `--rs-space-10` | 40 |
| `--rs-space-2` | 4 | | `--rs-space-11` | 48 |
| `--rs-space-3` | 8 | | `--rs-space-12` | 56 |
| `--rs-space-4` | 12 | | `--rs-space-13` | 64 |
| `--rs-space-5` | 16 | | `--rs-space-14` | 72 |
| `--rs-space-6` | 20 | | `--rs-space-15` | 80 |
| `--rs-space-7` | 24 | | `--rs-space-16` | 96 |
| `--rs-space-8` | 28 | | `--rs-space-17` | 120 |
| `--rs-space-9` | 32 | | | |

> Layout components (`Flex`, `Grid`, `Box`) accept numeric `gap`/`padding` props that map to this scale (e.g. `gap={4}` → `--rs-space-4` = 12px).

---

## Radius — `--rs-radius-*`

Radius depends on `data-style`. `modern` is the default; `traditional` is rounder.

| Token | `modern` | `traditional` |
|---|---|---|
| `--rs-radius-1` | 2px | 8px |
| `--rs-radius-2` | 4px | 16px |
| `--rs-radius-3` | 6px | 20px |
| `--rs-radius-4` | 8px | 24px |
| `--rs-radius-5` | 12px | 32px |
| `--rs-radius-6` | 16px | 40px |
| `--rs-radius-full` | 800px | 1600px |

---

## Typography — `--rs-font-*` / `--rs-line-height-*` / `--rs-letter-spacing-*`

### Families & weights

| Token | Value |
|---|---|
| `--rs-font-body` | Inter (sans) in `modern`; Josefin Sans in `traditional` |
| `--rs-font-title` | Inter in `modern`; Lora (serif) in `traditional` |
| `--rs-font-mono` | Menlo / JetBrains Mono / monospace |
| `--rs-font-weight-regular` | 400 |
| `--rs-font-weight-medium` | 500 |

### Body text sizes (paired size / line-height / letter-spacing)

| Scale | size | line-height | letter-spacing |
|---|---|---|---|
| `micro` | 10px | 12px | 0.5px |
| `mini` | 11px | 16px | 0.5px |
| `small` | 12px | 16px | 0.4px |
| `regular` | 14px | 20px | 0.25px |
| `large` | 16px | 24px | 0.5px |

Tokens: `--rs-font-size-<scale>`, `--rs-line-height-<scale>`, `--rs-letter-spacing-<scale>`.

### Title sizes

| Scale | size | line-height |
|---|---|---|
| `t1` | 20px | 24px |
| `t2` | 24px | 32px |
| `t3` | 28px | 36px |
| `t4` | 32px | 40px |

Tokens: `--rs-font-size-t{1..4}`, `--rs-line-height-t{1..4}`, `--rs-letter-spacing-t{1..4}`.

### Mono sizes

`mini` (11/16), `small` (12/16), `regular` (14/20), `large` (16/24) — tokens `--rs-font-size-mono-<scale>`, `--rs-line-height-mono-<scale>`, `--rs-letter-spacing-mono-<scale>`.

> Prefer the `Text`, `Headline`, and `Label` components, whose `size`/`weight` props map to these tokens, over hand-applying typography tokens.

---

## Effects — shadows, transitions, blurs

### Shadows (theme-aware: deeper in dark mode)

| Token | Tier |
|---|---|
| `--rs-shadow-feather` | sm |
| `--rs-shadow-soft` | md |
| `--rs-shadow-lifted` | lg |
| `--rs-shadow-floating` | xl (overlays/popovers) |
| `--rs-shadow-inset` | inset |

```css
.popover { box-shadow: var(--rs-shadow-floating); }
```

### Transitions

- `--rs-transition-interactive` — standard 0.2s ease transition for `background-color`, `border-color`, `color`, `box-shadow`, `opacity`. Use it on interactive custom elements for consistent motion.

### Blurs (for `backdrop-filter`)

| Token | Value |
|---|---|
| `--rs-blur-sm` | blur(0.5px) |
| `--rs-blur-md` | blur(1px) |
| `--rs-blur-lg` | blur(2px) |
| `--rs-blur-xl` | blur(4px) |

```css
.scrim { backdrop-filter: var(--rs-blur-md); }
```

---

## Theme `data-*` attributes (for state/theme-conditional CSS)

Set by `<Theme>` on the document root (and on scope wrappers):

| Attribute | Values |
|---|---|
| `data-theme` | `light`, `dark` |
| `data-style` | `modern`, `traditional` |
| `data-accent-color` | `indigo`, `orange`, `mint` |
| `data-gray-color` | `gray`, `mauve`, `slate`, `sage` |

```css
[data-theme="dark"] .custom-card { border-color: var(--rs-color-border-base-tertiary); }
[data-style="traditional"] .hero { font-family: var(--rs-font-title); }
```

## Token usage rules

- Use semantic color tokens, not raw scales or hex.
- Use `--rs-space-*` for spacing; `--rs-radius-*` for corners; effect tokens for shadows/blurs.
- Don't hard-code colors that should follow the theme.
- To customize a palette, override semantic tokens under a theme selector (see `styling.md`) rather than editing primitives ad hoc.
