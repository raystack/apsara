---
ID: RFC 001
Created: January 15, 2026
Status: Completed
RFC PR: https://github.com/raystack/apsara/pull/730
---

# Base UI Migration

This RFC proposes migrating the Apsara design system from Radix UI to Base UI for enhanced consistency and features.

## Table of Contents

- [Base UI Migration](#base-ui-migration)
  - [Table of Contents](#table-of-contents)
  - [Background](#background)
    - [Current Problems](#current-problems)
  - [Proposal](#proposal)
  - [Why Base UI?](#why-base-ui)
  - [Pros and Cons](#pros-and-cons)
    - [Pros](#pros)
    - [Cons](#cons)
  - [Differences and Analysis](#differences-and-analysis)
    - [General Differences from Radix UI](#general-differences-from-radix-ui)
      - [`asChild` Prop Replacement](#aschild-prop-replacement)
      - [Naming Conventions](#naming-conventions)
      - [Backdrop vs. Overlay](#backdrop-vs-overlay)
      - [Positioning of Content](#positioning-of-content)
      - [Detached Triggers](#detached-triggers)
    - [Component-Specific Differences from Radix UI](#component-specific-differences-from-radix-ui)
      - [Accordion](#accordion)
      - [Slider and Accordion](#slider-and-accordion)
      - [Command](#command)
      - [Command, Combobox, Select](#command-combobox-select)
      - [Dropdown](#dropdown)
  - [Table of Comparison](#table-of-comparison)
  - [Impact and Effort](#impact-and-effort)
    - [Impact](#impact)
    - [Effort](#effort)
  - [Helpful Links](#helpful-links)

## Background

Apsara is our internal design system library, currently relying on multiple third-party UI libraries for component implementation:

- **Radix UI**: Used for the majority of components (e.g., primitives like dialogs, etc.).
- **Ariakit**: Used to implement select, dropdown, and combobox components.
- **Cmdk**: Handles the command menu functionality.
- **Sonner**: Used to implement Toast.

### Current Problems

This multi-library approach has led to inconsistencies in props, component structures, and behavior. Notable issues include conflicts when combining Ariakit and Radix, primarily due to differing focus scopes, which complicate composition and lead to accessibility and usability problems.

Additionally, Radix UI has not been actively maintained for an extended period, resulting in numerous unresolved issues. In contrast, Base UI is actively maintained, with regular updates, and a focus on resolving common pain points in UI component libraries.

**Out of Apsara's 52 components, 18 currently depend on Radix, Ariakit, Cmdk, or Sonner, making a targeted migration feasible without overhauling the entire system.**

## Proposal

We propose migrating all existing components in Apsara to use Base UI primitives. This would:

- Replace Radix, Ariakit, Cmdk, and Sonner with Base UI.
- Standardize component props, structures, and behaviors across the design system.
- Leverage Base UI's built-in support for additional components (e.g., autocomplete, progress, number field, meter)

The migration will focus on the 18 dependent components first, with potential expansion to others for consistency. As a significant overhaul, it will introduce breaking changes. Rather than prioritizing backward compatibility, the emphasis will be on delivering an improved developer experience (DX) moving forward.

## Why Base UI?

Base UI is an excellent fit for Apsara's requirements:

- Headless, accessibility-first.
- Similar component composition pattern to Radix.
- Consistent and familiar props, such as `onOpenChange` and `onValueChange`.
- Broader component surface (Autocomplete, Combobox, Progress, Meter, NumberField, etc.)
- From the creators of Radix, Floating UI, and Material UI.
- The library is actively maintained unlike Radix.
- Better composition and useful features like detached and multiple triggers, etc

## Pros and Cons

### Pros

- **Consistency**: Unified props and structures reduce developer friction and bugs from library mismatches.
- **Simplified Dependencies**: Reduces bundle size and maintenance overhead by eliminating four libraries.
- **Enhanced Features**: Base UI is more powerful than Radix
  - Supports detached triggers (useful for dialogs, popovers, dropdowns),
  - Supports flexible value types, unlike Radix which only supports string.
  - Has better SSR handling.
- **Active Maintenance**: Base UI is actively developed, addressing issues that Radix has left unsolved.
- **Additional Components**: Native support for more components like autocomplete, combobox, progress, number field, meter, etc.
- **Migration Ease**: Similar patterns to Radix easing migration
- **Package Size:** The required package size would reduce by 50%

### Cons

- **Initial Effort**: Requires migrating 18 components, including API changes.
- **Component Migration**: Apsara components, which might have breaking changes, need to be migrated in consumer code.
- **Learning Curve for Team**: Team members familiar with Radix/Ariakit may need time to adapt to Base UI.

## Differences and Analysis

### General Differences from Radix UI

#### `asChild` Prop Replacement

- Radix: `asChild` for simple component composition.
- Base UI: Introduces a `render` prop, which can mimic `asChild` or act as a function for more control.

```jsx
// Radix
<DropdownMenu.Trigger asChild> // Radix has asChild prop
  <Button>Edit profile</Button>
</DropdownMenu.Trigger>

// Base UI
<DropdownMenu.Trigger render={<Button />}> // Base UI has render prop which is more powerful
   Edit profile
</DropdownMenu.Trigger>
```

> [!NOTE]
> **Analysis**
>
> More powerful for complex cases, we would be going ahead with `render` moving forward.
> e.g, `Sidebar.Item` requires custom element rendering, but due its DOM structure, `asChild` couldn't be used. We had to add an `as` prop to solve this, but `render` resolves this natively.

#### Naming Conventions

- Radix: Uniform `*.Content` for all component content.
- Base UI: Uses `*.Popup` or `*.Panel`

```jsx
// Radix
<Popover.Root>
  // Radix has a consistent Content component for all
  <Popover.Content side="left" align="start">
   content here
  </Popover.Content>
</Popover.Root>

<Accordion.Root>
  trigger
  <Accordion.Content side="left" align="start">
     content here
  </Accordion.Content>
</Accordion.Root>

// Base UI
<Popover.Root>
  // Base UI has Popup component for things that pop out of screen like, Dialog, Menu, Select etc
  <Popover.Popup side="left" align="start">
   content here
  </Popover.Popup>
</Popover.Root>

<Accordion.Root>
  // Base UI has Panel component for other components like Tabs, Accordion
  <Accordion.Panel side="left" align="start">
     content here
  </Accordion.Panel>
</Accordion.Root>
```

> [!NOTE]
> **Analysis**
>
> To maintain consistency across components, we'll expose `*.Content` in Apsara wrappers, abstracting the difference.

#### Backdrop vs. Overlay

- Radix: Component named `Overlay`.
- Base UI: Component named `Backdrop`.

```jsx
// Radix
<Dialog.Root>
  <Dialog.Overlay />
  <Dialog.Content />
</Dialog.Root>

// Base UI
<Dialog.Root>
  <Dialog.Backdrop />
  <Dialog.Popup />
</Dialog.Root>
```

> [!NOTE]
> **Analysis**
>
> Minor rename; we'll retain `Overlay` in Apsara for familiarity.

#### Positioning of Content

- Radix: Props like `side` and `align` directly on `*.Content` (e.g., `Popover.Content`).
- Base UI: Props passed to a separate `Positioner` component.

```jsx
// Radix
<Popover.Root>
  <Popover.Content side="left" align="start"> // Previously we used positioning props here
    content here
  </Popover.Content>
</Popover.Root>

// Base UI
<Popover.Root>
  <Popover.Positioner side="left" align="start"> // Base UI has a new Positioner component
    <Popover.Popup>
     content here
    </Popover.Popup>
  </Popover.Positioner>
</Popover.Root>
```

> [!NOTE]
> **Analysis**
>
> We'll wrap Positioner + Content in Apsara and expose a single `Content` component, hiding the complexity.

#### Detached Triggers

- Radix: Not supported.
- Base UI: Supported for Dialog, Popover, DropdownMenu, allowing triggers outside the component tree.

```jsx
// Base UI
// We can use detached triggers where the trigger can exist outside the component tree
const demoDialog = Dialog.createHandle();
<Dialog.Trigger handle={demoDialog}>Open</Dialog.Trigger>
<Dialog.Root handle={demoDialog}>
  ...
</Dialog.Root>
```

> [!NOTE]
> **Analysis**
>
> A significant upgrade for flexible UIs, addressing a common Radix limitation.

### Component-Specific Differences from Radix UI

#### Accordion

- Radix: `type="single" | "multiple"`.
- Base UI: `multiple={boolean}` (default: `false`).

> [!NOTE]
> **Analysis**
>
> Simpler API; we'll map existing props in Apsara wrappers. This aligns with how `multiple` is used in Select & Dropdown

#### Slider and Accordion

- Radix: Works with both array and singular values
- Base UI: Always accepts arrays for values.

> [!NOTE]
> **Analysis**
>
> We will be keeping the support for both array and singular values, internally we would be formatting as per Base UI needs

#### Command

- Cmdk: Custom API.
- Base UI: Aligns with Combobox/Select.

> [!NOTE]
> **Analysis**
>
> Removes Cmdk dependency. We would be implementing this with Autocomplete + Dialog in Apsara

#### Command, Combobox, Select

- Radix/Ariakit: Support only string-only values.
- Base UI: Supports any value type, multiple composition modes

Composition options:
- **Option A (recommended)**: Pass items to root; Base UI handles filtering, empty states, and labels
- Option B: Use render functions for value/output customization
- Option C: Use object values directly without an items array

> [!NOTE]
> **Analysis**
>
> We would be preferring Option A but also abstract Apsara API to support similar usage like before.

#### Dropdown

- Ariakit: For filterable/nested menus.
- Base UI: Menu + Autocomplete.

> [!NOTE]
> **Analysis**
>
> Removes Ariakit dependency. We would be implementing this with Autocomplete + Menu in Apsara

## Table of Comparison

| Apsara Component | Current Implementation | Base UI Equivalent |
| :--- | :--- | :--- |
| Accordion | Radix Accordion | Accordion |
| Avatar | Radix Avatar | Avatar |
| Checkbox | Radix Checkbox | Checkbox + CheckboxGroup |
| Combobox | Radix Popover + Ariakit Combobox | Combobox |
| Command | Cmdk | Autocomplete + Dialog |
| Dialog | Radix Dialog | Dialog |
| DropdownMenu | Ariakit Menu | Autocomplete + Menu |
| Popover | Radix Popover | Popover |
| Radio | Radix RadioGroup | Radio + RadioGroup |
| ScrollArea | Radix ScrollArea | ScrollArea |
| Select | Radix Select + Ariakit Combobox | Select + Combobox |
| Separator | Radix Separator | Separator |
| Sheet | Radix Dialog | Drawer |
| Sidebar | Radix Collapsible | Collapsible |
| Slider | Radix Slider | Slider |
| Switch | Radix Switch | Switch |
| Tabs | Radix Tabs | Tabs |
| Tooltip | Sonner | Tooltip |

## Impact and Effort

### Impact

- 18 / 52 Apsara components affected
- Easier to add new components in future
- Consistent prop and structure, improved stability, reduced bugs from library conflicts
- Breaking changes for Apsara consumers

### Effort

- **Implementation:** ~2 weeks for migration in Apsara. Focus on high-impact ones first (e.g., Select, Dropdown).
- **Testing & Documentation**: 0.5-1 week for testing and writing proper migration guide (LLM friendly)
- **Consumer Migration:** ~1 week for migration and testing in consumer projects. Time can be greatly reduced with the help of AI and proper migration guide

## Helpful Links

- [cal.com team - Radix Shadcn Migration](https://coss.com/ui/docs/radix-shadcn-migration)
- [Shadcn UI Docs - Components](https://ui.shadcn.com/docs/components) (recently introduced base ui in docs)
- [basecn - Migrating from Radix UI](https://basecn.dev/docs/get-started/migrating-from-radix-ui)
