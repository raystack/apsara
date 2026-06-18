# Styling & Customization

Use this when customizing the look of Apsara components or building your own styled elements that live alongside them. Apsara is vanilla CSS + `--rs-*` tokens — no Tailwind, no runtime CSS-in-JS.

## The three ways to customize a component

### 1. `className` (preferred for reusable tweaks)

Every component accepts `className`. Combine with tokens:

```tsx
import { Button } from "@raystack/apsara";

<Button className="cta" variant="outline">Get started</Button>
```

```css
.cta {
  min-width: 200px;
  border-radius: var(--rs-radius-5);
}
```

### 2. `style` (one-off inline)

```tsx
<Flex gap={4} style={{ maxWidth: 600, margin: "0 auto" }}>
  <Button style={{ flex: 1 }}>Full width</Button>
</Flex>
```

### 3. `data-*` state attributes (state-driven, no JS)

Apsara components built on Base UI expose state via `data-*` attributes. Style against them instead of tracking state yourself:

```css
.my-sidebar[data-open]   { width: 240px; }
.my-sidebar[data-closed] { width: 57px; }
.my-nav-item[data-active="true"] { background: var(--rs-color-background-neutral-secondary); }

/* Enter/exit animation hooks provided by Base UI overlays */
.my-overlay[data-starting-style],
.my-overlay[data-ending-style] { opacity: 0; }
```

Common attributes: `data-open`, `data-closed`, `data-active`, `data-disabled`, `data-state`, `data-starting-style`, `data-ending-style`. Check a component's `.mdx` page for the ones it exposes.

## Theme-conditional styling

`<Theme>` sets `data-theme` / `data-style` / `data-accent-color` / `data-gray-color` on the root (and scope wrappers). Target them for theme-specific overrides:

```css
[data-theme="dark"] .custom-card { border-color: var(--rs-color-border-base-tertiary); }
[data-style="traditional"] .heading { font-family: var(--rs-font-title); }
```

## Overriding tokens (custom palette / sizing)

To re-skin globally or per-scope, redefine **semantic** tokens under a selector. Prefer semantic tokens over raw scale steps so the override stays theme-correct.

```css
/* Make the danger emphasis fill a custom red across the app */
:root,
[data-theme="light"],
[data-theme="dark"] {
  --rs-color-background-accent-emphasis: var(--rs-color-viz-iris-9);
}
```

Scope an override to a subtree by wrapping it in a nested `<Theme>` (see `theming.md`) and overriding tokens on that wrapper's class.

## Building your own styled components

Match Apsara's internal conventions so custom UI feels native.

### CSS Modules for scoping

```tsx
// status-card.tsx
import styles from "./status-card.module.css";

export function StatusCard({ status, children }) {
  return <div className={`${styles.card} ${styles[`card-${status}`]}`}>{children}</div>;
}
```

```css
/* status-card.module.css */
.card {
  padding: var(--rs-space-4);
  border-radius: var(--rs-radius-3);
  border: 1px solid var(--rs-color-border-base-primary);
}
.card-success {
  border-color: var(--rs-color-border-success-emphasis);
  background: var(--rs-color-background-success-primary);
}
.card-danger {
  border-color: var(--rs-color-border-danger-emphasis);
  background: var(--rs-color-background-danger-primary);
}
```

### CVA for variants

Apsara uses [`class-variance-authority`](https://cva.style/) (a direct dependency) for type-safe variants:

```tsx
import { cva, type VariantProps } from "class-variance-authority";
import styles from "./tag.module.css";

const tag = cva(styles.tag, {
  variants: {
    size: { small: styles["tag-small"], medium: styles["tag-medium"] },
    color: { neutral: styles["tag-neutral"], accent: styles["tag-accent"] },
  },
  defaultVariants: { size: "medium", color: "neutral" },
});

type TagProps = VariantProps<typeof tag> & { className?: string };
export function Tag({ size, color, className, children }: TagProps) {
  return <span className={tag({ size, color, className })}>{children}</span>;
}
```

## Best practices

- **Use semantic tokens, not primitives** (`--rs-color-foreground-base-primary`, not `--rs-neutral-12`).
- **No hard-coded colors** — every color should be a token so light/dark works.
- **Spacing/radius from tokens** — `--rs-space-*`, `--rs-radius-*`.
- **Prefer component props over overrides** — reach for `variant`/`size`/`color` props before custom CSS.
- **Keep specificity low** — single class selectors; avoid `!important` and deep nesting.
- **Co-locate** `.module.css` next to its component.
