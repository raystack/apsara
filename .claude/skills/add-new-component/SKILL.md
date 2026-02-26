---
name: add-new-component
description: End-to-end guide for adding a new component to the Apsara design system. Use when creating a new React component including source, styles, tests, documentation, and playground examples. Triggers on tasks involving adding, scaffolding, or creating new components in the component library.
metadata:
  author: raystack
  version: "1.0"
---

# Add New Component to Apsara

Step-by-step ultrathink instructions for adding a new component to the Apsara design system. Each component requires changes across two packages: `packages/raystack/` (source, styles, tests) and `apps/www/` (docs, demos, playground).

## Files to Create/Modify

```
packages/raystack/
├── index.tsx                                      # Add export (alphabetical)
└── components/<name>/
    ├── index.tsx                                   # Re-export only
    ├── <name>.tsx                                  # Component + Object.assign
    ├── <name>.module.css                           # Styles
    └── __tests__/<name>.test.tsx                   # Tests

apps/www/src/
├── content/docs/components/<name>/
│   ├── index.mdx                                   # Docs page
│   ├── demo.ts                                     # Code demos
│   └── props.ts                                    # Prop interfaces
└── components/playground/
    ├── <name>-examples.tsx                          # Playground example
    └── index.ts                                     # Register export
```

## Step 1: Create the Component Source

Create `packages/raystack/components/<name>/`.

For simple components, define everything in a single file. For complex components with multiple sub-components, split into separate files:

```
# Simple
<name>.tsx               # All sub-components + Object.assign

# Complex
<name>.tsx               # Object.assign composition (imports sub-components)
<name>-root.tsx          # Root wrapper
<name>-trigger.tsx       # Trigger sub-component
<name>-content.tsx       # Content sub-component
```

### Component File Template

```tsx
'use client';

import { ComponentName as ComponentPrimitive } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { ElementRef, forwardRef } from 'react';
import styles from './<name>.module.css';

const ComponentRoot = forwardRef<
  ElementRef<typeof ComponentPrimitive.Root>,
  ComponentPrimitive.Root.Props
>(({ className, ...props }, ref) => (
  <ComponentPrimitive.Root
    ref={ref}
    className={cx(styles.root, className)}
    {...props}
  />
));

ComponentRoot.displayName = 'Component';
```

Key rules:
- `'use client'` directive on all interactive component files
- `forwardRef` on every custom wrapper, typed with `ElementRef<typeof Primitive>`
- `displayName` set for React DevTools (e.g., `'Component.Trigger'`)
- `cx()` from `class-variance-authority` to merge CSS module class with user's `className`
- Spread `...props` last so consumers can override defaults

### Object.assign Composition

Multi-file:

```tsx
// <name>.tsx
import { ComponentRoot } from './<name>-root';
import { ComponentTrigger } from './<name>-trigger';
import { ComponentContent } from './<name>-content';

export const Component = Object.assign(ComponentRoot, {
  Trigger: ComponentTrigger,
  Content: ComponentContent
});
```

Single-file:

```tsx
// <name>.tsx
const ComponentRoot = forwardRef<...>(...);
const ComponentTrigger = forwardRef<...>(...);
const ComponentPanel = forwardRef<...>(...);

export const Component = Object.assign(ComponentRoot, {
  Trigger: ComponentTrigger,
  Panel: ComponentPanel
});
```

## Step 2: Create the Index File

Simple re-export:

```tsx
// packages/raystack/components/<name>/index.tsx
export { Component } from './<name>';
```

## Step 3: Add CSS Module Styles

Create `<name>.module.css`.

- Kebab-case class names (e.g., `.accordion-trigger`, `.panel`)
- Use `--rs-*` CSS variables for all design tokens (no hardcoded colors/spacing)
- Use Base UI data attributes for state-based styling

```css
.trigger {
  cursor: pointer;
  outline: none;
  background: var(--rs-color-background-base-primary);
  font-size: var(--rs-font-size-regular);
}

.trigger:hover,
.trigger:focus-visible {
  background-color: var(--rs-color-background-base-primary-hover);
}

.trigger:disabled {
  pointer-events: none;
  opacity: 0.5;
}

/* Base UI data attribute for state */
.trigger[data-panel-open] .icon {
  transform: rotate(180deg);
}

/* Animated panel with Base UI CSS variables */
.panel {
  height: var(--collapsible-panel-height);
  overflow: hidden;
  transition: height 150ms ease-out;
}

.panel[data-starting-style],
.panel[data-ending-style] {
  height: 0;
}
```

Common `--rs-*` tokens:
- **Colors:** `--rs-color-foreground-base-primary`, `--rs-color-background-base-primary`, `--rs-color-border-base-primary`
- **Spacing:** `--rs-space-2` through `--rs-space-5`
- **Typography:** `--rs-font-size-small`, `--rs-font-size-regular`, `--rs-line-height-regular`
- **Effects:** `--rs-radius-2`, `--rs-shadow-lifted`, `--rs-shadow-inset`

## Step 4: Register the Export

Add to `packages/raystack/index.tsx` in **alphabetical order**:

```tsx
export { Chip } from './components/chip';
export { CodeBlock } from './components/code-block';
export { Collapsible } from './components/collapsible';  // <-- new
export { Combobox } from './components/combobox';
```

## Step 5: Write Tests

Create `__tests__/<name>.test.tsx`.

### Test File Structure

```tsx
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Component } from '../<name>';
import styles from '../<name>.module.css';
```

### What to Test

1. **Basic rendering** — renders children, applies custom `className`, forwards `ref`
2. **Interaction** — click handlers, open/close toggling, state changes
3. **Controlled vs uncontrolled** — `value`/`open` props, `onChange` callbacks
4. **Keyboard navigation** — Tab, Enter, Space, Arrow keys as applicable
5. **Disabled state** — `aria-disabled`, no toggle on click
6. **Sub-components** — className, ref forwarding for each sub-component

### Testing Tips

- Use `fireEvent.click()` for basic click tests
- Use `userEvent.setup()` + `user.keyboard()` for keyboard tests
- For **portaled Base UI components** (e.g., Combobox popup), use `fireEvent.pointerDown` + `fireEvent.click` instead of `userEvent.click` (jsdom quirk)
- For **non-portaled Base UI components** (e.g., Select), use `flushMicrotasks` pattern:
  ```tsx
  const flushMicrotasks = async () => {
    await act(async () => {
      await new Promise(r => setTimeout(r, 0));
    });
  };
  ```
- Use `data-testid` to locate elements that lack ARIA roles
- Base UI uses `aria-disabled="true"` instead of the HTML `disabled` attribute

### Running Tests

```bash
pnpm --filter @raystack/apsara test -- --reporter=verbose components/<name>
```

## Step 6: Add Documentation

Create `apps/www/src/content/docs/components/<name>/` with three files.

The sidebar auto-discovers component pages from this directory structure (no config registration needed).

### `index.mdx`

```mdx
---
title: ComponentName
description: Short description of the component.
source: packages/raystack/components/<name>
tag: new
---

import { preview, controlledDemo, disabledDemo } from "./demo.ts";

<Demo data={preview} />

## Anatomy

Import and assemble the component:

\`\`\`tsx
import { Component } from '@raystack/apsara'

<Component>
  <Component.Trigger />
  <Component.Panel />
</Component>
\`\`\`

## API Reference

### Root

Groups all parts of the component.

<auto-type-table path="./props.ts" name="ComponentProps" />

### Trigger

Toggles the visibility of the panel.

<auto-type-table path="./props.ts" name="ComponentTriggerProps" />

### Panel

Contains the component content.

<auto-type-table path="./props.ts" name="ComponentPanelProps" />

## Examples

### Controlled

Description of the controlled example.

<Demo data={controlledDemo} />

### Disabled

Description of the disabled example.

<Demo data={disabledDemo} />

## Accessibility

- Bullet points about ARIA attributes, keyboard support, and WAI-ARIA patterns.
```

Frontmatter fields:
- `title` — Component display name
- `description` — Short summary
- `source` — Path to component source (relative to repo root)
- `tag: new` — Shows a "new" badge in the sidebar

### `demo.ts`

Preview/Code demo (static code rendered as a live example):

```ts
'use client';

export const preview = {
  type: 'code',
  code: `<Component>
  <Component.Trigger>Click me</Component.Trigger>
  <Component.Panel>Content here</Component.Panel>
</Component>`
};
```

Tabbed code demo (multiple variants):

```ts
export const variantDemo = {
  type: 'code',
  tabs: [
    { name: 'Default', code: `<Component>...</Component>` },
    { name: 'Disabled', code: `<Component disabled>...</Component>` }
  ]
};
```

Playground demo (interactive with controls):

```ts
import { getPropsString } from '@/lib/utils';

export const playground = {
  type: 'playground',
  controls: {
    disabled: { type: 'checkbox', defaultValue: false },
    size: { type: 'select', options: ['small', 'medium', 'large'], defaultValue: 'medium' }
  },
  getCode: (props: Record<string, unknown>) => {
    return `<Component${getPropsString(props)}>...</Component>`;
  }
};
```

Use `preview` (code type) for simple components. Use `playground` for components with many configurable props.

### `props.ts`

TypeScript interfaces with JSDoc comments consumed by `<auto-type-table>` in the MDX:

```ts
export interface ComponentProps {
  /** Whether the component is open (controlled). */
  open?: boolean;

  /**
   * Whether the component is initially open (uncontrolled).
   * @defaultValue false
   */
  defaultOpen?: boolean;

  /** Event handler called when the open state changes. */
  onOpenChange?: (open: boolean) => void;

  /**
   * Whether the component is disabled.
   * @defaultValue false
   */
  disabled?: boolean;

  /** Custom CSS class names */
  className?: string;
}
```

- Use `@defaultValue` JSDoc tag to document defaults
- Keep descriptions concise
- Include `className` prop on all sub-component interfaces

## Step 7: Add Playground Example

Create `apps/www/src/components/playground/<name>-examples.tsx`:

```tsx
'use client';

import { Component, Flex, Text } from '@raystack/apsara';
import PlaygroundLayout from './playground-layout';

export function ComponentExamples() {
  return (
    <PlaygroundLayout title='Component'>
      <Flex direction='column' gap='large'>
        <Text>Default:</Text>
        <Component>
          <Component.Trigger>Toggle</Component.Trigger>
          <Component.Panel>Content</Component.Panel>
        </Component>
      </Flex>
    </PlaygroundLayout>
  );
}
```

Register in `apps/www/src/components/playground/index.ts` (alphabetical order):

```ts
export * from './code-block-examples';
export * from './<name>-examples';  // <-- new
export * from './combobox-examples';
```

## Step 8: Verify

```bash
pnpm --filter @raystack/apsara build
pnpm --filter @raystack/apsara test -- --reporter=verbose components/<name>
pnpm --filter www build
```

Checklist:
- [ ] Component builds without errors
- [ ] All tests pass
- [ ] Docs site builds and new page is generated
- [ ] `forwardRef` and `displayName` set on all sub-components
- [ ] CSS uses `--rs-*` tokens only
- [ ] Export in `packages/raystack/index.tsx` in alphabetical order
- [ ] Playground example added and registered
