# Apsara v1.0.0 Migration Guide: Radix UI / Ariakit -> Base UI

This guide covers all breaking changes when upgrading from the last stable Radix-based release to the current Base UI-based v1.0.0

---

## Table of Contents

- [Apsara v1.0.0 Migration Guide: Radix UI / Ariakit -\> Base UI](#apsara-v100-migration-guide-radix-ui--ariakit---base-ui)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Cross-Cutting Changes](#cross-cutting-changes)
    - [`asChild` Replaced by `render`](#aschild-replaced-by-render)
    - [Callback Signatures](#callback-signatures)
    - [Data Attributes](#data-attributes)
    - [CSS Variables](#css-variables)
    - [Form Field Pattern](#form-field-pattern)
  - [Component Migration](#component-migration)
    - [Accordion](#accordion)
      - [New Props](#new-props)
    - [Avatar](#avatar)
    - [Breadcrumb](#breadcrumb)
    - [Button](#button)
    - [Chip](#chip)
    - [Checkbox](#checkbox)
      - [New: `Checkbox.Group`](#new-checkboxgroup)
      - [New Features](#new-features)
    - [Combobox](#combobox)
      - [New Features](#new-features-1)
    - [Command](#command)
      - [New Features](#new-features-2)
    - [Data Table](#data-table)
    - [Dialog](#dialog)
      - [New Features](#new-features-3)
    - [DropdownMenu -\> Menu](#dropdownmenu---menu)
      - [New Features](#new-features-4)
    - [Flex](#flex)
    - [Grid](#grid)
    - [Headline](#headline)
    - [Input (formerly InputField)](#input-formerly-inputfield)
    - [Label](#label)
    - [Popover](#popover)
      - [New Features](#new-features-5)
    - [Radio](#radio)
    - [ScrollArea](#scrollarea)
    - [Select](#select)
      - [New Features](#new-features-6)
    - [Separator](#separator)
    - [Sheet -\> Drawer](#sheet---drawer)
      - [New Features](#new-features-7)
    - [Sidebar](#sidebar)
      - [New Features](#new-features-8)
    - [Slider](#slider)
      - [New Features](#new-features-9)
    - [Switch](#switch)
    - [Tabs](#tabs)
      - [New Features](#new-features-10)
    - [Text](#text)
    - [TextArea](#textarea)
      - [New Features](#new-features-11)
    - [Toast](#toast)
      - [New Features](#new-features-12)
    - [Tooltip](#tooltip)
      - [New Features](#new-features-13)
  - [New Components](#new-components)
  - [Removed Exports](#removed-exports)
  - [| `RadioItem` | `Radio` | See Radio |](#-radioitem--radio--see-radio-)
  - [Migration Checklist](#migration-checklist)

---

## Prerequisites

- **React 19 required.** The peer dependency changed from `^18 || ^19` to `^19` only. React 18 is no longer supported.
- The library no longer uses `radix-ui`, `@ariakit/react`, or `sonner`. It now uses `@base-ui/react` and `@base-ui/utils` internally. These are installed automatically as dependencies of the package.
- `@radix-ui/react-icons` is still used.
---

## Cross-Cutting Changes

These patterns apply across many components. Address them globally before tackling individual components.

### `asChild` Replaced by `render`

Radix's `asChild` composition pattern is gone. Use the `render` prop instead. Note that with `render`, children text goes on the parent, not inside the rendered element.

```tsx
// Before — asChild merges props onto the child element
<Button asChild>
  <a href="/">Link</a>
</Button>

// After — render specifies the element, children go on the wrapper
<Button render={<a href="/" />}>Link</Button>
```

```tsx
// Before — Trigger with asChild
<Dialog.Trigger asChild>
  <Button variant="outline">Open Dialog</Button>
</Dialog.Trigger>

// After — Trigger with render
<Dialog.Trigger render={<Button variant="outline" />}>
  Open Dialog
</Dialog.Trigger>
```

```tsx
// Before — Close with asChild
<Dialog.Close asChild>
  <Button color="neutral">Cancel</Button>
</Dialog.Close>

// After — Close with render (entire element in render)
<Dialog.Close render={<Button color="neutral">Cancel</Button>} />
```

Affected components: Button, Grid, Grid.Item, Popover.Trigger, Menu.Trigger, Drawer.Trigger, Dialog.Trigger, Dialog.Close, AlertDialog.Trigger, Breadcrumb.Item, Tooltip.Trigger.

> **Note:** Text and Headline also replace their `as` prop with `render`, but using a different pattern. Instead of `asChild` (which forwarded all props to a child element), `as` was a simple string tag name. The new `render` prop accepts a JSX element or a render function, matching the Base UI convention. See [Text](#text) and [Headline](#headline) for details.

### Callback Signatures

Most `onValueChange`, `onOpenChange`, and `onCheckedChange` callbacks now receive an optional second `eventDetails` argument:

```tsx
// Before
<Accordion onValueChange={(value: string) => {
  console.log(value);
}} />

// After — second arg added, but it's optional
<Accordion onValueChange={(value: string | undefined, eventDetails) => {
  console.log(value);
}} />
```

```tsx
// Before
<Switch onCheckedChange={(checked: boolean) => setEnabled(checked)} />

// After
<Switch onCheckedChange={(checked: boolean, event) => setEnabled(checked)} />
```

Existing handlers that ignore extra args still work at runtime, but TypeScript types may require updating.

### Data Attributes

If you target Apsara component data attributes in custom CSS, these have changed globally:

| Old (Radix) | New (Base UI) |
|-------------|---------------|
| `data-state="open"` | `data-open` |
| `data-state="closed"` | `data-closed` |
| `data-state="checked"` | `data-checked` |
| `data-state="unchecked"` | `data-unchecked` |
| `data-state="active"` | `data-active` |
| `data-active-item="true"` | `data-highlighted` |
| `data-disabled="true"` | `data-disabled` (no value) |

```css
/* Before */
.my-panel[data-state="open"] { opacity: 1; }
.my-panel[data-state="closed"] { opacity: 0; }
.my-checkbox[data-state="checked"] { background: blue; }
.my-item[data-active-item="true"] { background: gray; }
.my-switch[data-disabled="true"] { opacity: 0.5; }

/* After */
.my-panel[data-open] { opacity: 1; }
.my-panel[data-closed] { opacity: 0; }
.my-checkbox[data-checked] { background: blue; }
.my-item[data-highlighted] { background: gray; }
.my-switch[data-disabled] { opacity: 0.5; }
```

Animation data attributes also changed:

```css
/* Before — Radix keyframe animation */
.overlay[data-state="open"] { animation: fadeIn 200ms; }
.overlay[data-state="closed"] { animation: fadeOut 200ms; }

/* After — Base UI CSS transitions */
.overlay { transition: opacity 200ms; }
.overlay[data-starting-style] { opacity: 0; }
.overlay[data-ending-style] { opacity: 0; }
```

### CSS Variables

If you reference these CSS variables in custom styles:

| Old | New |
|-----|-----|
| `--radix-popover-trigger-width` | `--anchor-width` |
| `--radix-select-trigger-width` | `--anchor-width` |
| `--radix-accordion-content-height` | `--accordion-panel-height` |
| `--radix-collapsible-content-*` | Removed |

```css
/* Before */
.dropdown { min-width: var(--radix-popover-trigger-width); }
.accordion-panel { height: var(--radix-accordion-content-height); }

/* After */
.dropdown { min-width: var(--anchor-width); }
.accordion-panel { height: var(--accordion-panel-height); }
```

#### Overlay Tokens

`--rs-color-overlay-base-primary` has been removed. Its direct equivalent is `--rs-color-overlay-black-a5`. For theme-aware behavior (black in light, white in dark), use `--rs-color-overlay-base-a5` instead.

```css
/* Before */
.backdrop { background-color: var(--rs-color-overlay-base-primary); }

/* After — equivalent (always 30% black) */
.backdrop { background-color: var(--rs-color-overlay-black-a5); }

/* After — theme-aware (30% black in light, 30% white in dark) */
.backdrop { background-color: var(--rs-color-overlay-base-a5); }
```

### Form Field Pattern

Labels, descriptions, errors, and optional indicators have been extracted from individual form controls into a new `Field` wrapper component. This is a **breaking change** for `InputField` (now `Input`) and `TextArea`.

**Before:** Each control rendered its own label, helper text, and error.

```tsx
<InputField label="Email" helperText="We won't share it" error="Required" optional />
<TextArea label="Bio" helperText="Tell us about yourself" />
```

**After:** Wrap controls with `<Field>` for labels, descriptions, and errors. Controls are now pure inputs. Note: `InputField` has also been renamed to `Input`.

```tsx
<Field label="Email" description="We won't share it" error="Required" required={false}>
  <Input />
</Field>
<Field label="Bio" description="Tell us about yourself">
  <TextArea />
</Field>
```

The `Field` component also provides context so that child controls (Input, TextArea, Select, Checkbox, Switch, Radio, NumberField, Combobox) automatically inherit `required` state without passing it explicitly.

See [Input (formerly InputField)](#input-formerly-inputfield) and [TextArea](#textarea) for full migration details.

---

## Component Migration

### Accordion

1. **`type` prop replaced with `multiple` boolean**, `collapsible` prop removed (always collapsible):

```tsx
// Before
<Accordion type="single" collapsible defaultValue="item-1">
  <Accordion.Item value="item-1">
    <Accordion.Trigger>Section 1</Accordion.Trigger>
    <Accordion.Content>Content 1</Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="item-2">
    <Accordion.Trigger>Section 2</Accordion.Trigger>
    <Accordion.Content>Content 2</Accordion.Content>
  </Accordion.Item>
</Accordion>

// After
<Accordion defaultValue="item-1">
  <Accordion.Item value="item-1">
    <Accordion.Trigger>Section 1</Accordion.Trigger>
    <Accordion.Content>Content 1</Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="item-2">
    <Accordion.Trigger>Section 2</Accordion.Trigger>
    <Accordion.Content>Content 2</Accordion.Content>
  </Accordion.Item>
</Accordion>
```

```tsx
// Before — multiple mode
<Accordion type="multiple" defaultValue={["item-1", "item-2"]}>

// After — multiple mode
<Accordion multiple defaultValue={["item-1", "item-2"]}>
```

2. **`onValueChange` in single mode** now receives `string | undefined` (not just `string`):

```tsx
// Before
<Accordion type="single" onValueChange={(value: string) => setValue(value)}>

// After — value can be undefined when all items are collapsed
<Accordion onValueChange={(value: string | undefined) => setValue(value)}>
```

3. **`forceMount` replaced by `keepMounted`:**

```tsx
// Before
<Accordion.Content forceMount>Always in DOM</Accordion.Content>

// After — on root (applies to all) or individual Content
<Accordion keepMounted>
  <Accordion.Item value="item-1">
    <Accordion.Trigger>Title</Accordion.Trigger>
    <Accordion.Content>Always in DOM</Accordion.Content>
  </Accordion.Item>
</Accordion>
```

4. **`dir` prop removed.**

5. **Type exports removed** -- `AccordionItemProps`, `AccordionTriggerProps`, `AccordionContentProps` are no longer exported.

#### New Props

- `loopFocus` -- loop keyboard navigation from last to first item
- `hiddenUntilFound` -- content is searchable by browser find-in-page even when collapsed

---

### Avatar

1. **`asChild` prop removed:**

```tsx
// Before
<Avatar asChild fallback="JD">
  <a href="/profile" />
</Avatar>

// After — compose by wrapping instead
<a href="/profile">
  <Avatar fallback="JD" />
</a>
```

2. **`delayMs` and other Radix-specific root props** no longer recognized:

```tsx
// Before — Radix-specific prop
<Avatar delayMs={300} src="/photo.jpg" fallback="JD" />

// After — delayMs removed, no equivalent
<Avatar src="/photo.jpg" fallback="JD" />
```

Unchanged: `size`, `radius`, `variant`, `color`, `fallback`, `src`, `alt`, `className`, `AvatarGroup` with `max`, and `getAvatarColor`.

---

### Breadcrumb

1. **`as` prop renamed to `render`** on `BreadcrumbItem`:

```tsx
// Before
<Breadcrumb>
  <Breadcrumb.Item as={<Link href="/home" />}>Home</Breadcrumb.Item>
  <Breadcrumb.Item as={<Link href="/settings" />}>Settings</Breadcrumb.Item>
  <Breadcrumb.Item current>Profile</Breadcrumb.Item>
</Breadcrumb>

// After
<Breadcrumb>
  <Breadcrumb.Item render={<Link href="/home" />}>Home</Breadcrumb.Item>
  <Breadcrumb.Item render={<Link href="/settings" />}>Settings</Breadcrumb.Item>
  <Breadcrumb.Item current>Profile</Breadcrumb.Item>
</Breadcrumb>
```

2. **`current` items now render `<span>` instead of `<a>`.** If you had CSS targeting `a` elements for current breadcrumb items, update to target `span`.

3. **`dropdownItems` shape changed** -- `label` -> `children`:

```tsx
// Before
<Breadcrumb.Item
  dropdownItems={[
    { label: 'Option A', onClick: handleA },
    { label: 'Option B', onClick: handleB },
  ]}
>
  More
</Breadcrumb.Item>

// After
<Breadcrumb.Item
  dropdownItems={[
    { children: 'Option A', onClick: handleA },
    { children: 'Option B', onClick: handleB },
  ]}
>
  More
</Breadcrumb.Item>
```

---

### Button

**`asChild` removed** -- use `render` prop:

```tsx
// Before — rendering as a link
<Button asChild variant="outline">
  <a href="/dashboard">Go to Dashboard</a>
</Button>

// After
<Button render={<a href="/dashboard" />} variant="outline">
  Go to Dashboard
</Button>
```

```tsx
// Before — rendering as a router Link
<Button asChild>
  <Link to="/settings">Settings</Link>
</Button>

// After
<Button render={<Link to="/settings" />}>Settings</Button>
```

---

### Chip

**`ariaLabel` prop removed** -- use the standard `aria-label` HTML attribute:

```tsx
// Before
<Chip ariaLabel="Dismissible chip" isDismissible onDismiss={...}>
  Tag
</Chip>

// After
<Chip aria-label="Dismissible chip" isDismissible onDismiss={...}>
  Tag
</Chip>
```

`Chip` now forwards all standard HTML attributes through `...props`, making the dedicated `ariaLabel` prop redundant. The auto-fallback to string children when no label is supplied is unchanged:

```tsx
// Still works — uses "Tag" as the accessibility label
<Chip>Tag</Chip>
```

---

### Checkbox

1. **Indeterminate API changed** -- `checked="indeterminate"` replaced by separate `indeterminate` boolean:

```tsx
// Before
<Checkbox checked="indeterminate" />
<Checkbox defaultChecked="indeterminate" />

// After
<Checkbox indeterminate />
<Checkbox indeterminate defaultChecked={false} />
```

2. **`onCheckedChange` now receives 2 args** -- `(checked: boolean, eventDetails)`. The `CheckedState` type (`boolean | 'indeterminate'`) no longer exists:

```tsx
// Before
<Checkbox
  checked={isChecked}
  onCheckedChange={(val: boolean | "indeterminate") => {
    if (val === "indeterminate") { /* handle */ }
    else { setChecked(val); }
  }}
/>

// After — val is always boolean, indeterminate is a separate prop
<Checkbox
  checked={isChecked}
  indeterminate={isIndeterminate}
  onCheckedChange={(val: boolean, event) => {
    setChecked(val);
  }}
/>
```

3. **`CheckboxProps` type export removed.**

#### New: `Checkbox.Group`

```tsx
<Checkbox.Group defaultValue={['apple']} onValueChange={setSelected}>
  <Checkbox name="apple" />
  <Checkbox name="banana" />
</Checkbox.Group>
```

#### New Features

- `size` prop (`'small' | 'large'`, default `'large'`) for controlling checkbox dimensions
- `render` prop for custom indicator rendering — receives `(props, state)` where state includes `checked` and `indeterminate`
- `readOnly` prop for non-editable display with reduced opacity
- `orientation` prop on `Checkbox.Group` (`'vertical' | 'horizontal'`, default `'vertical'`)
- Enhanced disabled state preserves checked/indeterminate visual appearance
- Invalid state styling with danger border (and danger background when checked/indeterminate)

```tsx
// Size variants
<Checkbox size="small" />
<Checkbox size="large" /> {/* default */}

// Custom indicator
<Checkbox
  checked
  render={(props, state) => (
    <span {...props}>{state.checked ? '✓' : ''}</span>
  )}
/>

// Read-only checkbox
<Checkbox checked readOnly />

// Horizontal group layout
<Checkbox.Group defaultValue={['apple']} orientation="horizontal">
  <Checkbox name="apple" />
  <Checkbox name="banana" />
</Checkbox.Group>
```

---

### Combobox

1. **`onOpenChange` signature changed** -- now `(open, eventDetails)` (2 args). `onValueChange` and `onInputValueChange` are unchanged (1 arg):

```tsx
// Before
<Combobox onOpenChange={(open: boolean) => setIsOpen(open)}>

// After
<Combobox onOpenChange={(open: boolean, eventDetails) => setIsOpen(open)}>
```

2. **Content props removed** -- `align`, `onOpenAutoFocus`, `onInteractOutside`, `onFocusOutside` no longer accepted. New: `initialFocus`, `finalFocus`:

```tsx
// Before
<Combobox.Content
  align="start"
  onOpenAutoFocus={(e) => e.preventDefault()}
  onInteractOutside={handleOutside}
  onFocusOutside={handleFocusOut}
>

// After
<Combobox.Content
  initialFocus={inputRef}
  finalFocus={triggerRef}
>
```

3. **`modal` prop removed** -- always modal.

4. **`defaultInputValue` prop removed** -- use controlled `inputValue`.

5. **`focusOnHover` prop removed from Item.**

6. **Backspace-to-remove-last-chip removed** in multiple mode.

**Full before/after example:**

```tsx
// Before
<Combobox
  modal={false}
  defaultInputValue="app"
  onOpenChange={(open) => setOpen(open)}
  onValueChange={(value) => setValue(value)}
>
  <Combobox.Input placeholder="Search fruits" />
  <Combobox.Content align="start" onInteractOutside={handleOutside}>
    <Combobox.Item value="apple" focusOnHover>Apple</Combobox.Item>
    <Combobox.Item value="banana" focusOnHover>Banana</Combobox.Item>
    <Combobox.Item value="cherry" focusOnHover>Cherry</Combobox.Item>
  </Combobox.Content>
</Combobox>

// After
<Combobox
  onOpenChange={(open, details) => setOpen(open)}
  onValueChange={(value) => setValue(value)}
>
  <Combobox.Input placeholder="Search fruits" />
  <Combobox.Content>
    <Combobox.Item value="apple">Apple</Combobox.Item>
    <Combobox.Item value="banana">Banana</Combobox.Item>
    <Combobox.Item value="cherry">Cherry</Combobox.Item>
  </Combobox.Content>
</Combobox>
```

#### New Features

- `Combobox.useFilter` and `Combobox.useFilteredItems` hooks for declarative filtering
- Generic value type support: `<Combobox<CustomType>>`
- `items` prop on Root for built-in filtering
- `render` prop on Content and Item

---

### Command

**Underlying primitive changed from `cmdk` to Base UI `Autocomplete`.** Most usages will need to be rewritten.

1. **`Command.List` renamed to `Command.Content`:**

```tsx
// Before
<Command>
  <Command.Input />
  <Command.List>
    <Command.Empty>No results</Command.Empty>
    <Command.Item>Item</Command.Item>
  </Command.List>
</Command>

// After
<Command>
  <Command.Input />
  <Command.Content>
    <Command.Empty>No results</Command.Empty>
    <Command.Item>Item</Command.Item>
  </Command.Content>
</Command>
```

2. **`Command.Group` `heading` prop replaced by `Command.Label` child:**

```tsx
// Before
<Command.Group heading="Suggestions">
  <Command.Item>Calendar</Command.Item>
  <Command.Item>Calculator</Command.Item>
</Command.Group>

// After
<Command.Group>
  <Command.Label>Suggestions</Command.Label>
  <Command.Item>Calendar</Command.Item>
  <Command.Item>Calculator</Command.Item>
</Command.Group>
```

3. **`Command.Item` `onSelect` replaced by `onClick`:**

```tsx
// Before — cmdk's onSelect with the item's value
<Command.Item value="calendar" onSelect={(value) => handleSelect(value)}>
  Calendar
</Command.Item>

// After — standard DOM onClick; derive the value from your handler closure
<Command.Item value="calendar" onClick={() => handleSelect('calendar')}>
  Calendar
</Command.Item>
```

`onClick` fires on pointer click and on keyboard `Enter` when the item is highlighted.

4. **Icons now use `leadingIcon` / `trailingIcon` props** instead of being composed inline:

```tsx
// Before — icons rendered as children
<Command.Item>
  <CalendarIcon />
  Calendar
  <Command.Shortcut>⌘ C</Command.Shortcut>
</Command.Item>

// After — icons passed as props, layout handled internally
<Command.Item
  leadingIcon={<CalendarIcon />}
  trailingIcon={<Command.Shortcut>⌘ C</Command.Shortcut>}
>
  Calendar
</Command.Item>
```

5. **`Command.Shortcut` now wraps each key in its own `<kbd>`.** The string children are split on whitespace; array/element children are wrapped per item. Previously `Command.Shortcut` rendered a single `<span>`:

```tsx
// Before — plain <span>
<Command.Shortcut>⌘ K</Command.Shortcut>
// renders: <span>⌘ K</span>

// After — <kbd> per token, split by whitespace
<Command.Shortcut>⌘ K</Command.Shortcut>
// renders: <span><kbd>⌘</kbd><kbd>K</kbd></span>
```

If you had custom CSS targeting `Command.Shortcut`'s inner content, update it to target the inner `<kbd>` elements.

6. **Dialog composition is now explicit.** The old `Command.Dialog` internally wrapped Apsara's `Dialog` + `Dialog.Content` and nested a `Command` root automatically. The new API splits that into three pieces: `Command.Dialog` (root), `Command.DialogTrigger`, and `Command.DialogContent`. You must render `<Command>` yourself inside `DialogContent`:

```tsx
// Before — Dialog and Command were fused
<Command.Dialog open={open} onOpenChange={setOpen}>
  <Command.Input />
  <Command.List>
    <Command.Item>Item</Command.Item>
  </Command.List>
</Command.Dialog>
{/* separate trigger wired via keyboard shortcut only */}

// After — explicit trigger + content + nested Command
<Command.Dialog open={open} onOpenChange={setOpen}>
  <Command.DialogTrigger render={<Button variant="outline" />}>
    Open Command Menu
  </Command.DialogTrigger>
  <Command.DialogContent>
    <Command>
      <Command.Input />
      <Command.Content>
        <Command.Item>Item</Command.Item>
      </Command.Content>
    </Command>
  </Command.DialogContent>
</Command.Dialog>
```

`Command.DialogContent` replaces the old reliance on `Dialog.Content`: it renders its own portal, backdrop, viewport, and popup. It does not render a close button — users dismiss with `Escape` or by clicking the backdrop. Pass `overlay={{ blur: true }}` for a blurred backdrop.

7. **`filter` prop signature changed** and now only applies when `items` is provided (see New Features). The old cmdk signature was `(value: string, search: string, keywords?: string[]) => number` (returning a 0–1 score); the new Base UI signature is `(itemValue: unknown, query: string) => boolean`:

```tsx
// Before — cmdk numeric score
<Command filter={(value, search) => value.includes(search) ? 1 : 0}>

// After — Base UI boolean (only active when `items` is provided)
<Command
  items={items}
  filter={(itemValue, query) =>
    String(itemValue).toLowerCase().includes(query.toLowerCase())
  }
>
```

Without `items`, `Command` uses its built-in auto-filter over `Command.Item` children (case-insensitive match against `value` and text content), and `filter` is ignored.

8. **`onValueChange` receives 2 args** on both the root and `Command.Input` — `(value: string, eventDetails)`.

9. **`Command.Input` props changed.** It now accepts the same props as `Input` (e.g. `size`, `leadingIcon`, `placeholder`, `autoFocus`). Defaults: `size="large"`, `autoFocus={true}`, leading icon is a magnifying glass. `trailingIcon`, `chips`, `maxChipsVisible`, and `variant` are not accepted.

**Full before/after example:**

```tsx
// Before
import { Command } from '@raystack/apsara';

<Command.Dialog open={open} onOpenChange={setOpen}>
  <Command.Input placeholder="Type a command..." />
  <Command.List>
    <Command.Empty>No results.</Command.Empty>
    <Command.Group heading="Suggestions">
      <Command.Item value="calendar" onSelect={(v) => run(v)}>
        <CalendarIcon />
        Calendar
        <Command.Shortcut>⌘ C</Command.Shortcut>
      </Command.Item>
    </Command.Group>
  </Command.List>
</Command.Dialog>

// After
import { Command, Button } from '@raystack/apsara';

<Command.Dialog open={open} onOpenChange={setOpen}>
  <Command.DialogTrigger render={<Button variant="outline" />}>
    Open Command Menu
  </Command.DialogTrigger>
  <Command.DialogContent>
    <Command>
      <Command.Input placeholder="Type a command..." />
      <Command.Content>
        <Command.Empty>No results.</Command.Empty>
        <Command.Group>
          <Command.Label>Suggestions</Command.Label>
          <Command.Item
            value="calendar"
            leadingIcon={<CalendarIcon />}
            trailingIcon={<Command.Shortcut>⌘ C</Command.Shortcut>}
            onClick={() => run('calendar')}
          >
            Calendar
          </Command.Item>
        </Command.Group>
      </Command.Content>
    </Command>
  </Command.DialogContent>
</Command.Dialog>
```

#### New Features

- `Command.Label` sub-component for group labels (pairs with `Command.Group`).
- `Command.DialogTrigger` and `Command.DialogContent` sub-components for composing the palette's dialog shell.
- `items` prop on Root to delegate filtering to Base UI. When provided, `Command.Content` accepts a render function that receives each item.
- `leadingIcon` / `trailingIcon` props on `Command.Item` with built-in layout.
- `autoHighlight`, `keepHighlight`, `inline`, and `open` props forwarded from Base UI `Autocomplete.Root`.
- Inherits Base UI combobox a11y: `role="combobox"` on the input, `role="listbox"` on the content, `role="option"` on items. `ArrowUp`/`ArrowDown`/`Enter`/`Escape` keyboard navigation.

---

### Data Table

```tsx
// Before — defaultSort was optional
<DataTable columns={columns} data={data} />

// After — defaultSort is effectively required for reset/empty state detection
<DataTable columns={columns} data={data} defaultSort={[{ id: 'name', desc: false }]} />
```

- New `totalRowCount` prop -- when provided in `mode='server'`, shows a "N items hidden by filters" message:

```tsx
<DataTable mode="server" totalRowCount={1000} columns={columns} data={visibleData} />
```

---

### Dialog

1. **`DialogContent` props rewritten:**
   - Removed: `ariaLabel`, `ariaDescription`, `overlayBlur`, `overlayClassName`, `overlayStyle`, `scrollableOverlay`
   - New: `showCloseButton` (default `true`), `overlay` (object with `blur?: boolean`, `className`, `style`), `showNestedAnimation`

2. **CloseButton is now auto-rendered** inside Content. Remove manual `<Dialog.CloseButton />` from headers. Pass `showCloseButton={false}` to suppress.

```tsx
// Before
<Dialog open={open} onOpenChange={setOpen}>
  <Dialog.Trigger asChild>
    <Button>Open Settings</Button>
  </Dialog.Trigger>
  <Dialog.Content
    width="500px"
    ariaLabel="Settings"
    ariaDescription="Configure your preferences"
    overlayBlur
    overlayClassName="my-overlay"
    overlayStyle={{ backgroundColor: "rgba(0,0,0,0.5)" }}
  >
    <Dialog.Header>
      <Dialog.Title>Settings</Dialog.Title>
      <Dialog.CloseButton />
    </Dialog.Header>
    <Dialog.Body>
      <Dialog.Description>Configure your preferences.</Dialog.Description>
      <form>{/* form fields */}</form>
    </Dialog.Body>
    <Dialog.Footer>
      <Dialog.Close asChild>
        <Button color="neutral">Cancel</Button>
      </Dialog.Close>
      <Button>Save</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog>

// After
<Dialog open={open} onOpenChange={setOpen}>
  <Dialog.Trigger render={<Button />}>Open Settings</Dialog.Trigger>
  <Dialog.Content
    width="500px"
    aria-label="Settings"
    overlay={{
      blur: true,
      className: "my-overlay",
      style: { backgroundColor: "rgba(0,0,0,0.5)" },
    }}
  >
    <Dialog.Header>
      <Dialog.Title>Settings</Dialog.Title>
      {/* CloseButton auto-rendered by Content — remove manual placement */}
    </Dialog.Header>
    <Dialog.Body>
      <Dialog.Description>Configure your preferences.</Dialog.Description>
      <form>{/* form fields */}</form>
    </Dialog.Body>
    <Dialog.Footer>
      <Dialog.Close render={<Button color="neutral">Cancel</Button>} />
      <Button>Save</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog>
```

To suppress the auto close button:

```tsx
<Dialog.Content showCloseButton={false}>
```

#### New Features

- `Dialog.createHandle` for imperative open/close
- `showNestedAnimation` for stacked dialog animations
- Header/Footer/Body accept all Flex props

---

### DropdownMenu -> Menu

**Export renamed: `DropdownMenu` -> `Menu`**

**Full before/after example:**

```tsx
// Before
import { DropdownMenu } from '@raystack/apsara';

<DropdownMenu
  autocomplete
  searchValue={query}
  onSearch={setQuery}
  focusLoop
  onOpenChange={(open) => console.log(open)}
>
  <DropdownMenu.Trigger asChild>
    <Button>Actions</Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content gutter={8} searchPlaceholder="Filter...">
    <DropdownMenu.Label>File</DropdownMenu.Label>
    <DropdownMenu.Group>
      <DropdownMenu.Item leadingIcon={<EditIcon />}>Edit</DropdownMenu.Item>
      <DropdownMenu.Item>Copy</DropdownMenu.Item>
    </DropdownMenu.Group>
    <DropdownMenu.Separator />
    <DropdownMenu>
      <DropdownMenu.TriggerItem>Export as...</DropdownMenu.TriggerItem>
      <DropdownMenu.Content>
        <DropdownMenu.Item>CSV</DropdownMenu.Item>
        <DropdownMenu.Item>PDF</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  </DropdownMenu.Content>
</DropdownMenu>

// After
import { Menu } from '@raystack/apsara';

<Menu
  autocomplete
  inputValue={query}
  onInputValueChange={setQuery}
  loopFocus
  onOpenChange={(open, details) => console.log(open)}
>
  <Menu.Trigger render={<Button />}>Actions</Menu.Trigger>
  <Menu.Content sideOffset={8} searchPlaceholder="Filter...">
    <Menu.Group>
      <Menu.Label>File</Menu.Label>
      <Menu.Item leadingIcon={<EditIcon />}>Edit</Menu.Item>
      <Menu.Item>Copy</Menu.Item>
    </Menu.Group>
    <Menu.Separator />
    <Menu.Submenu>
      <Menu.SubmenuTrigger>Export as...</Menu.SubmenuTrigger>
      <Menu.SubmenuContent>
        <Menu.Item>CSV</Menu.Item>
        <Menu.Item>PDF</Menu.Item>
      </Menu.SubmenuContent>
    </Menu.Submenu>
  </Menu.Content>
</Menu>
```

**Summary of prop renames:**

| Old (`DropdownMenu`) | New (`Menu`) |
|---------------------|-------------|
| `searchValue` | `inputValue` |
| `onSearch` | `onInputValueChange` |
| `defaultSearchValue` | `defaultInputValue` |
| `focusLoop` | `loopFocus` (default flipped: was `true`, now `false`) |
| `Content gutter={N}` | `Content sideOffset={N}` |
| `Content portal` | Removed (always portaled) |
| `Content portalElement` | Removed |
| `Content unmountOnHide` | Removed |
| `DropdownMenu.TriggerItem` | `Menu.SubmenuTrigger` (inside `Menu.Submenu`) |

#### New Features

- `Menu.Submenu`, `Menu.SubmenuTrigger`, `Menu.SubmenuContent`
- `Menu.createHandle` for imperative control
- Menubar integration

---

### Flex

```tsx
// Before — Flex always rendered as <div>
<Flex gap="3" align="center">content</Flex>

// After — unchanged for basic usage, but now supports render prop
<Flex gap="3" align="center">content</Flex>

// New — render as a different element
<Flex render={<section />} gap="3" align="center">content</Flex>
<Flex render={<nav />} gap="3" direction="column">links</Flex>
```

Type changed to `useRender.ComponentProps<'div'>` -- may cause TypeScript errors if you typed Flex props explicitly.

---

### Grid

**`asChild` removed** from both `Grid` and `Grid.Item`. Use `render`:

```tsx
// Before
<Grid asChild columns="3" gap="4">
  <section>
    <Grid.Item asChild colSpan="2">
      <article>Wide content</article>
    </Grid.Item>
    <Grid.Item>Narrow content</Grid.Item>
  </section>
</Grid>

// After
<Grid render={<section />} columns="3" gap="4">
  <Grid.Item render={<article />} colSpan="2">Wide content</Grid.Item>
  <Grid.Item>Narrow content</Grid.Item>
</Grid>
```

---

### Headline

**`as` prop replaced by `render`:**

The `as` prop accepted a string tag name (`'h1'` through `'h6'`). The new `render` prop accepts a JSX element or a render function, consistent with the Base UI pattern used across the library. The default element remains `<h2>`.

```tsx
// Before
<Headline as="h1" size="large">Page Title</Headline>
<Headline as="h3" size="small">Section Title</Headline>
<Headline>Default h2</Headline>

// After
<Headline render={<h1 />} size="large">Page Title</Headline>
<Headline render={<h3 />} size="small">Section Title</Headline>
<Headline>Default h2</Headline>
```

The `render` prop also supports render functions for full control:

```tsx
// Render function for custom element
<Headline render={props => <h1 {...props} />}>Page Title</Headline>
```

**TypeScript:** The type changed from `HeadlineBaseProps & ComponentProps<'h1'> & { as?: 'h1' | ... | 'h6' }` to `HeadlineBaseProps & useRender.ComponentProps<'h2'>`. If you explicitly typed Headline props, update to `HeadlineProps` (now exported).

---

### Input (formerly InputField)

**`InputField` has been renamed to `Input`.** Update all imports and usages: `import { InputField } from "@raystack/apsara"` → `import { Input } from "@raystack/apsara"`.

**Label, helper text, error, and optional indicator moved to `Field` wrapper.** Input is now a pure input control — wrap it with the new `Field` component for labels, descriptions, and error messages.

1. **`label` prop removed** — use `<Field label="...">`:

```tsx
// Before
<InputField label="Email" placeholder="Enter email" />

// After
<Field label="Email">
  <Input placeholder="Enter email" />
</Field>
```

2. **`helperText` prop removed** — use `<Field description="...">`:

```tsx
// Before
<InputField label="Password" helperText="Must be at least 8 characters" placeholder="Enter password" />

// After
<Field label="Password" description="Must be at least 8 characters">
  <Input placeholder="Enter password" />
</Field>
```

3. **`error` prop removed** — use `<Field error="...">`:

```tsx
// Before
<InputField label="Email" error="Please enter a valid email" placeholder="Enter email" />

// After
<Field label="Email" error="Please enter a valid email">
  <Input placeholder="Enter email" />
</Field>
```

4. **`optional` prop removed** — use `<Field required={false}>`:

```tsx
// Before
<InputField label="Phone" optional placeholder="Enter phone" />

// After
<Field label="Phone" required={false}>
  <Input placeholder="Enter phone" />
</Field>
```

5. **`infoTooltip` prop removed** — no direct replacement. Compose manually if needed.

6. **`required` now inherited from Field context.** When inside a `<Field>`, the Input automatically inherits the `required` state. You can still pass `required` directly to override.

7. **`InputFieldProps` type renamed to `InputProps`.** Update any explicit type imports.

**Full before/after example:**

```tsx
// Before
<InputField
  label="Email"
  helperText="We won't share your email"
  error={errors.email}
  optional
  infoTooltip="Used for account recovery"
  placeholder="Enter email"
  leadingIcon={<MailIcon size={16} />}
/>

// After
<Field label="Email" description="We won't share your email" error={errors.email} required={false}>
  <Input placeholder="Enter email" leadingIcon={<MailIcon size={16} />} />
</Field>
```

Unchanged props: `size`, `variant`, `disabled`, `leadingIcon`, `trailingIcon`, `prefix`, `suffix`, `width`, `chips`, `maxChipsVisible`, `containerRef`, and all native `<input>` attributes.

**Related API changes:**

- `DatePicker.inputFieldProps` → `DatePicker.inputProps`
- `RangePicker.inputFieldsProps` → `RangePicker.inputsProps`

---

### Label

The standalone `Label` component has been rebuilt as a polymorphic, layout-neutral component. The old `size` and `requiredIndicator` props are removed and the `required` prop semantics now match `Field.Label`.

1. **`size` prop removed.** Typography is fixed to match `Field.Label` (Body/Mini Plus — medium weight, mini font size, secondary foreground). If you need a different size, render a `Text` instead.

```tsx
// Before
<Label size="medium">Email</Label>
<Label size="large">Email</Label>

// After
<Label>Email</Label>
```

2. **`requiredIndicator` prop removed and `required` semantics flipped.** Previously `required={true}` rendered an asterisk via `requiredIndicator` (default `*`). Now `Label` follows the `Field` convention: passing `required={false}` renders an `(optional)` indicator. Customize the text via `optionalText`.

```tsx
// Before
<Label required>Email</Label>                                  // shows "Email *"
<Label required requiredIndicator=" (Required)">Email</Label>  // shows "Email (Required)"

// After
<Label>Email</Label>                                            // shows "Email"
<Label required={false}>Email</Label>                           // shows "Email (optional)"
<Label required={false} optionalText="— not required">Email</Label>
```

3. **No layout / spacing styles by default.** The new `Label` is typography-only — no `padding-bottom`. Pointer cursor is wired through the `.label[for]` selector, so it activates automatically when `htmlFor` is set. For inline rows next to Radio/Checkbox, compose with `Flex`.

```tsx
// Before — bare <label> next to a Radio.Item
<Flex gap="small" align="center">
  <Radio.Item value="1" id="opt-1" />
  <label htmlFor="opt-1">Option One</label>
</Flex>

// After — use Label
<Flex gap="small" align="center">
  <Radio value="1" id="opt-1" />
  <Label htmlFor="opt-1">Option One</Label>
</Flex>
```

4. **New: `render` prop.** `Label` now uses `useRender`, so you can swap the underlying element while preserving label semantics, classes, and ref forwarding.

```tsx
<Label render={<span />}>Inline label</Label>
```

5. **`Field.Label` now extends `LabelProps`.** `FieldLabelProps = FieldPrimitive.Label.Props & LabelProps`, so any future Label prop flows through automatically. The `(optional)` indicator is now owned by `Label` — no behavior change for callers; `Field.Label required={false}` still renders `(optional)`, and you can now also pass `optionalText` directly on `Field.Label`.

6. **Field spacing tightened.** `Field` now uses `gap: var(--rs-space-2)` (was `--rs-space-1`) and no longer applies `padding-bottom` to the label or `padding-top` to description/error. The visual gap between label / control / helper text is now ~4px (matches Figma). If you were relying on the old spacing, expect a slight reduction in vertical space.

**TypeScript:** The exported `LabelProps` changed from `PropsWithChildren<VariantProps<typeof label>> & Omit<ComponentProps<'label'>, 'required'>` to `useRender.ComponentProps<'label'> & { required?: boolean; optionalText?: string }`.

---

### Popover

1. **`asChild` removed from Trigger** -- use `render` prop or pass children directly:

```tsx
// Before
<Popover>
  <Popover.Trigger asChild>
    <Button>Open Popover</Button>
  </Popover.Trigger>
  <Popover.Content side="bottom" align="start" ariaLabel="Options">
    <p>Popover content here</p>
    <Popover.Close>Close</Popover.Close>
  </Popover.Content>
</Popover>

// After
<Popover>
  <Popover.Trigger render={<Button />}>Open Popover</Popover.Trigger>
  <Popover.Content side="bottom" align="start" aria-label="Options">
    <p>Popover content here</p>
    <Popover.Close>Close</Popover.Close>
  </Popover.Content>
</Popover>
```

2. **`ariaLabel` custom prop removed** -- use standard `aria-label` instead.

Positioning props (`side`, `align`, `sideOffset`, `collisionPadding`) are preserved.

#### New Features

- `Popover.createHandle` for imperative control
- `initialFocus` / `finalFocus` for focus management

---

### Radio

**Component hierarchy inverted** -- the root/item relationship is swapped:

```tsx
// Before
import { Radio, RadioItem } from '@raystack/apsara';

<Radio
  defaultValue="option2"
  onValueChange={(value: string) => setSelected(value)}
  orientation="vertical"
  aria-label="Choose plan"
>
  <Radio.Item value="option1" id="free" />
  <Radio.Item value="option2" id="pro" />
  <Radio.Item value="option3" id="enterprise" disabled />
</Radio>

// After
import { Radio } from '@raystack/apsara';

<Radio.Group
  defaultValue="option2"
  onValueChange={(value, event) => setSelected(value)}
  orientation="vertical"
  aria-label="Choose plan"
>
  <Radio value="option1" id="free" />
  <Radio value="option2" id="pro" />
  <Radio value="option3" id="enterprise" disabled />
</Radio.Group>
```

Key changes:
- `<Radio>` (was group root) -> `<Radio.Group>`
- `<Radio.Item>` (was individual item) -> `<Radio>`
- `RadioItem` named export removed
- `RadioItemProps` type export removed
- `onValueChange` now receives 2 args

---

### ScrollArea

```tsx
// Before — type="auto" was the default
<ScrollArea type="auto" style={{ height: 300 }}>
  <div>Scrollable content...</div>
</ScrollArea>

// After — type="auto" removed, default is now "hover"
<ScrollArea type="hover" style={{ height: 300 }}>
  <div>Scrollable content...</div>
</ScrollArea>
```

1. **`type="auto"` removed.** Remaining options: `'always'`, `'hover'`, `'scroll'`.
2. **Default `type` changed** from `'auto'` to `'hover'`.
3. **`ScrollAreaRootProps` renamed** to `ScrollAreaProps`.

---

### Select

1. **Sub-component renames:**

```tsx
// Before
<Select defaultValue="apple" onValueChange={setValue}>
  <Select.Trigger>
    <Select.Value placeholder="Pick a fruit" />
  </Select.Trigger>
  <Select.Content position="popper" sideOffset={4}>
    <Select.Viewport>
      <Select.Group>
        <Select.Label>Fruits</Select.Label>
        <Select.Item value="apple">Apple</Select.Item>
        <Select.Item value="banana">Banana</Select.Item>
      </Select.Group>
    </Select.Viewport>
    <Select.ScrollUpButton />
    <Select.ScrollDownButton />
  </Select.Content>
</Select>

// After
<Select defaultValue="apple" onValueChange={setValue}>
  <Select.Trigger>
    <Select.Value placeholder="Pick a fruit" />
  </Select.Trigger>
  <Select.Content sideOffset={4}>
    <Select.Group>
      <Select.Label>Fruits</Select.Label>
      <Select.Item value="apple">Apple</Select.Item>
      <Select.Item value="banana">Banana</Select.Item>
    </Select.Group>
    <Select.ScrollUpArrow />
    <Select.ScrollDownArrow />
  </Select.Content>
</Select>
```

Summary of renames:
- `Select.ScrollUpButton` -> `Select.ScrollUpArrow`
- `Select.ScrollDownButton` -> `Select.ScrollDownArrow`
- `Select.Viewport` -> removed (no longer needed, remove the wrapper)
- `position="popper"` -> removed (always popper-style)

2. **`SelectContent` props removed** -- `position`, `asChild`, `onEscapeKeyDown`, `onPointerDownOutside`.

3. **`SelectItem` uses `render` prop** instead of `asChild`.

#### New Features

- `items` prop for external filtering
- Explicit `disabled`, `required`, `name` props on Root

---

### Separator

```tsx
// Before — decorative was accepted, aria-label auto-generated
<Separator decorative orientation="horizontal" />
{/* auto-generated aria-label="horizontal separator" */}

// After — decorative removed, no auto aria-label
<Separator orientation="horizontal" />
{/* add aria-label manually if needed */}
<Separator orientation="horizontal" aria-label="Section divider" />
```

1. **`decorative` prop removed.**
2. **Default `aria-label` removed** -- no longer auto-generates `"horizontal separator"`. Add explicitly if needed.

---

### Sheet -> Drawer

**Export renamed: `Sheet` -> `Drawer`**

```tsx
// Before
import { Sheet } from '@raystack/apsara';

<Sheet open={open} onOpenChange={setOpen}>
  <Sheet.Trigger asChild>
    <Button>Open Panel</Button>
  </Sheet.Trigger>
  <Sheet.Content side="right" close={true}>
    <Sheet.Title>Settings</Sheet.Title>
    <Sheet.Description>Manage your preferences</Sheet.Description>
    <form>{/* form fields */}</form>
  </Sheet.Content>
</Sheet>

// After
import { Drawer } from '@raystack/apsara';

<Drawer open={open} onOpenChange={setOpen} side="right">
  <Drawer.Trigger render={<Button />}>Open Panel</Drawer.Trigger>
  <Drawer.Content side="right" showCloseButton>
    <Drawer.Header>
      <Drawer.Title>Settings</Drawer.Title>
      <Drawer.Description>Manage your preferences</Drawer.Description>
    </Drawer.Header>
    <Drawer.Body>
      <form>{/* form fields */}</form>
    </Drawer.Body>
    <Drawer.Footer>
      <Button>Save</Button>
    </Drawer.Footer>
  </Drawer.Content>
</Drawer>
```

Key changes:
- All `Sheet.*` -> `Drawer.*`
- `asChild` -> `render` on Trigger
- `side` must be on both `<Drawer>` root AND `<Drawer.Content>`
- `close` prop -> `showCloseButton` (default changed from `false` to `true`)
- New structured layout: `Drawer.Header`, `Drawer.Body`, `Drawer.Footer`

#### New Features

- Swipe-to-dismiss
- `Drawer.createHandle` for drag handle

---

### Sidebar

1. **`disabled` prop replaced by `collapsible={false}`:**

```tsx
// Before
<Sidebar disabled>

// After
<Sidebar collapsible={false}>
```

2. **`asChild` removed — Sidebar no longer wraps `Collapsible.Root`**

`Sidebar` renders `<aside>` directly and no longer accepts `Collapsible.Root`-specific props.

3. **`Sidebar.Item` custom element prop renamed: `as` -> `render`**

```tsx
// Before
<Sidebar.Item as={<Link href="/dashboard" />} leadingIcon={<HomeIcon />}>
  Dashboard
</Sidebar.Item>

// After
<Sidebar.Item render={<Link href="/dashboard" />} leadingIcon={<HomeIcon />}>
  Dashboard
</Sidebar.Item>
```

4. **Sidebar components no longer forward refs**

If you were attaching refs to `Sidebar`, `Sidebar.Header`, `Sidebar.Main`, `Sidebar.Footer`, `Sidebar.Group`, or `Sidebar.Item`, update those usages to target a wrapper DOM element instead.

5. **`data-state` replaced with `data-open` / `data-closed`**

```css
/* Before */
[data-state="expanded"] { ... }
[data-state="collapsed"] { ... }

/* After */
[data-open] { ... }
[data-closed] { ... }
```

6. **`Sidebar.Item` role changed: `menuitem` -> `listitem`**

7. **`Sidebar.Footer` role changed: `group` -> `list`**

**Full before/after example:**

```tsx
// Before
<Sidebar open={isOpen} onOpenChange={setIsOpen} disabled={!canCollapse}>
  <div>Logo</div>
  <Sidebar.Item as={<Link href="/home" />} leadingIcon={<HomeIcon />} active>
    Home
  </Sidebar.Item>
  <Sidebar.Item as={<Link href="/settings" />} leadingIcon={<SettingsIcon />}>
    Settings
  </Sidebar.Item>
</Sidebar>

// After
<Sidebar open={isOpen} onOpenChange={setIsOpen} collapsible={canCollapse} position="left">
  <Sidebar.Header>
    <span data-collapse-hidden>Logo</span>
  </Sidebar.Header>
  <Sidebar.Main>
    <Sidebar.Group label="Navigation">
      <Sidebar.Item render={<Link href="/home" />} leadingIcon={<HomeIcon />} active>
        Home
      </Sidebar.Item>
      <Sidebar.Item render={<Link href="/settings" />} leadingIcon={<SettingsIcon />}>
        Settings
      </Sidebar.Item>
    </Sidebar.Group>
  </Sidebar.Main>
</Sidebar>
```

#### New Features

- `position` prop (`"left"` | `"right"`)
- `Sidebar.Header`, `Sidebar.Main`, `Sidebar.Footer`, `Sidebar.Group` sub-components
- `tooltipMessage` and `hideCollapsedItemTooltip` props
- Automatic collapsed state: text hidden, fallback avatar shown, tooltip on hover
- `data-collapse-hidden` attribute for elements that should hide when collapsed

---

### Slider

**`onChange` removed** -- use `onValueChange`:

```tsx
// Before — single value
<Slider
  variant="single"
  defaultValue={50}
  min={0}
  max={100}
  step={1}
  onChange={(val) => console.log(val)}
/>

// After — single value
<Slider
  variant="single"
  defaultValue={50}
  min={0}
  max={100}
  step={1}
  onValueChange={(val, details) => console.log(val)}
/>
```

```tsx
// Before — range slider
<Slider variant="range" value={[20, 80]} onChange={(val) => setRange(val)} />

// After — range slider
<Slider variant="range" value={[20, 80]} onValueChange={(val, details) => setRange(val)} />
```

#### New Features

- `Slider.Value` sub-component for inline value display:

```tsx
<Slider defaultValue={50}>
  <Slider.Value />  {/* renders the current value */}
</Slider>
```

---

### Switch

```tsx
// Before
<Switch
  checked={enabled}
  onCheckedChange={(checked: boolean) => setEnabled(checked)}
  name="notifications"
  required
/>

// After
<Switch
  checked={enabled}
  onCheckedChange={(checked: boolean, event) => setEnabled(checked)}
  name="notifications"
  required
/>
```

1. **`onCheckedChange` now receives 2 args** -- `(checked, eventDetails)`.
2. **`required`:** `aria-required="true"` -> `data-required`.
3. **Hidden `<input>` for form `name`/`value` removed** -- form integration handled internally.

---

### Tabs

```tsx
// Before
<Tabs defaultValue="account" onValueChange={(val) => setTab(val)}>
  <Tabs.List>
    <Tabs.Trigger value="account" icon={<UserIcon />}>Account</Tabs.Trigger>
    <Tabs.Trigger value="settings" icon={<SettingsIcon />}>Settings</Tabs.Trigger>
    <Tabs.Trigger value="billing" disabled>Billing</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="account">Account content</Tabs.Content>
  <Tabs.Content value="settings">Settings content</Tabs.Content>
  <Tabs.Content value="billing">Billing content</Tabs.Content>
</Tabs>

// After
<Tabs defaultValue="account" onValueChange={(val, details) => setTab(val)}>
  <Tabs.List>
    <Tabs.Tab value="account" leadingIcon={<UserIcon />}>Account</Tabs.Tab>
    <Tabs.Tab value="settings" leadingIcon={<SettingsIcon />}>Settings</Tabs.Tab>
    <Tabs.Tab value="billing" disabled>Billing</Tabs.Tab>
  </Tabs.List>
  <Tabs.Content value="account">Account content</Tabs.Content>
  <Tabs.Content value="settings">Settings content</Tabs.Content>
  <Tabs.Content value="billing">Billing content</Tabs.Content>
</Tabs>
```

Key changes:
- `Tabs.Trigger` -> `Tabs.Tab`
- `icon` prop -> `leadingIcon`
- `onValueChange` now receives 2 args

#### New Features

- Three variants: `segmented` (default), `standalone`, `plain`
- Three sizes: `small`, `medium`, `large`

```tsx
<Tabs variant="standalone" size="small" defaultValue="tab1">
```

---

### Text

**`as` prop replaced by `render`:**

The `as` prop accepted a string tag name (`'span'`, `'p'`, `'div'`, `'label'`, `'a'`). The new `render` prop accepts a JSX element or a render function, consistent with the Base UI pattern used across the library. The default element remains `<span>`.

```tsx
// Before
<Text as="label">Username</Text>
<Text as="p">Paragraph text</Text>
<Text as="a" href="/link">Click here</Text>
<Text>Default span</Text>

// After
<Text render={<label />}>Username</Text>
<Text render={<p />}>Paragraph text</Text>
<Text render={<a href="/link" />}>Click here</Text>
<Text>Default span</Text>
```

Note that HTML attributes specific to the rendered element (like `href` for anchors, `htmlFor` for labels) now go on the JSX element inside `render`, not on `Text` itself:

```tsx
// Before
<Text as="label" htmlFor="email-input">Email</Text>
<Text as="a" href="#section" target="_blank">Link</Text>

// After
<Text render={<label htmlFor="email-input" />}>Email</Text>
<Text render={<a href="#section" target="_blank" />}>Link</Text>
```

The `render` prop also supports render functions for full control:

```tsx
// Render function for any element
<Text render={props => <section {...props} />}>Custom element</Text>
```

**TypeScript:** The type changed from a discriminated union (`TextSpanProps | TextDivProps | TextLabelProps | TextPProps | TextAProps`) to `TextBaseProps & useRender.ComponentProps<'span'>`. The `render` prop now accepts any element, so you are no longer limited to the five original tag names. The `// @ts-expect-error` that was needed internally for polymorphic refs is also gone.

---

### TextArea

**Label, helper text, error, and optional indicator moved to `Field` wrapper.** TextArea is now a pure textarea control — wrap it with the new `Field` component for labels, descriptions, and error messages.

1. **`label` prop removed** — use `<Field label="...">`:

```tsx
// Before
<TextArea label="Bio" placeholder="Write something..." />

// After
<Field label="Bio">
  <TextArea placeholder="Write something..." />
</Field>
```

2. **`helperText` prop removed** — use `<Field description="...">`:

```tsx
// Before
<TextArea label="Bio" helperText="Tell us about yourself" placeholder="Write something..." />

// After
<Field label="Bio" description="Tell us about yourself">
  <TextArea placeholder="Write something..." />
</Field>
```

3. **`error` prop changed** — was a `boolean` on TextArea, now a `string` message on Field:

```tsx
// Before
<TextArea label="Bio" error helperText="This field is required" />

// After
<Field label="Bio" error="This field is required">
  <TextArea />
</Field>
```

4. **`required` now driven by Field context.** The old TextArea had `required` which also controlled the optional indicator. Now `required` defaults to `true` on Field and is inherited via context:

```tsx
// Before — required=false showed "(optional)" indicator
<TextArea label="Bio" required={false} placeholder="Write something..." />

// After
<Field label="Bio" required={false}>
  <TextArea placeholder="Write something..." />
</Field>
```

5. **`infoTooltip` prop removed** — no direct replacement. Compose manually if needed.

6. **`overflow` changed from `hidden` to `auto`.** Text that exceeds the visible area now scrolls instead of being clipped. If you relied on the old hidden-overflow behavior (e.g., pairing with JavaScript auto-resize), test that your layout still works:

```css
/* Before — content beyond the visible area was clipped */
.textarea { overflow: hidden; }

/* After — content scrolls when it exceeds visible rows */
.textarea { overflow: auto; }
```

7. **`min-height` removed; height is now row-based.** The textarea no longer has a CSS `min-height` (`var(--rs-space-13)`). Instead, the visible height is determined by the `rows` attribute (default `3`). If you depended on the old fixed minimum height, set `rows` or apply a custom `min-height` via `style` or `className`:

```tsx
// Before — min-height enforced by CSS token
<TextArea placeholder="Write something..." />

// After — height determined by rows (default 3); override if needed
<TextArea placeholder="Write something..." rows={5} />
// or restore a min-height via style
<TextArea placeholder="Write something..." style={{ minHeight: 'var(--rs-space-13)' }} />
```

**Full before/after example:**

```tsx
// Before
<TextArea
  label="Bio"
  helperText="Tell us about yourself"
  error={hasError}
  required={false}
  infoTooltip="This will appear on your profile"
  placeholder="Write something..."
  width="400px"
/>

// After
<Field label="Bio" description="Tell us about yourself" error={hasError ? "This field is required" : undefined} required={false}>
  <TextArea placeholder="Write something..." width="400px" />
</Field>
```

Unchanged props: `disabled`, `placeholder`, `width`, `value`, `onChange`, `rows`, and all native `<textarea>` attributes.

#### New Features

- `size` prop — `'large'` (default) or `'small'`. Controls padding and font size:

```tsx
<TextArea size="small" placeholder="Compact textarea" />
```

- `variant` prop — `'default'` (default) or `'borderless'`. Controls border visibility:

```tsx
<TextArea variant="borderless" placeholder="No border" />
```

- `rows` prop — sets the number of visible text rows (default `3`). Replaces the old CSS `min-height` for controlling textarea height:

```tsx
<TextArea rows={6} placeholder="Taller textarea" />
```

---

### Toast

**Exports renamed: `ToastContainer`/`toast` -> `Toast`/`toastManager`**

```tsx
// ===== BEFORE (Sonner-based) =====
import { ToastContainer, toast } from '@raystack/apsara';

// Provider — rendered standalone, no children
function App() {
  return (
    <>
      <MainContent />
      <ToastContainer />
    </>
  );
}

// Creating toasts
toast('Simple message');
toast.success('Operation complete');
toast.error('Something went wrong');
toast('File deleted', {
  duration: 5000,
  action: { label: 'Undo', onClick: handleUndo },
});
const id = toast('Uploading...');
toast.dismiss(id);
toast.dismiss(); // dismiss all

// ===== AFTER (Base UI-based) =====
import { Toast, toastManager } from '@raystack/apsara';

// Provider — must wrap app as a context provider
function App() {
  return (
    <Toast.Provider position="bottom-right">
      <MainContent />
    </Toast.Provider>
  );
}

// Creating toasts
toastManager.add({ title: 'Simple message' });
toastManager.add({ title: 'Operation complete', type: 'success' });
toastManager.add({ title: 'Something went wrong', type: 'error' });
toastManager.add({
  title: 'File deleted',
  actionProps: { children: 'Undo', onClick: handleUndo },
});
const id = toastManager.add({ title: 'Uploading...' });
toastManager.close(id);
// no built-in dismiss-all
```

**Callbacks changed:**

```tsx
// Before
toast('msg', { onDismiss: handler, onAutoClose: handler2 });

// After
toastManager.add({ title: 'msg', onClose: handler });
```

#### New Features

- Toast stacking with peek animation and expand-on-hover
- Swipe-to-dismiss
- `toastManager.update(id, props)` for modifying existing toasts
- `Toast.createToastManager` and `Toast.useToastManager`

**Promise toast pattern:**

```tsx
toastManager.promise(fetchData(), {
  loading: { title: "Loading...", description: "Please wait" },
  success: { title: "Done!", type: "success" },
  error: { title: "Failed", type: "error" },
});
```

---

### Tooltip

**Complete API redesign -- monolithic wrapper to compound component. Every usage must be rewritten.**

```tsx
// Before — monolithic: message prop, children is the trigger
<Tooltip
  message="Save your changes"
  side="top"
  showArrow
  delayDuration={200}
>
  <Button>Save</Button>
</Tooltip>

// After — compound: separate Trigger and Content
<Tooltip delay={200}>
  <Tooltip.Trigger render={<Button />}>Save</Tooltip.Trigger>
  <Tooltip.Content side="top" showArrow>Save your changes</Tooltip.Content>
</Tooltip>
```

```tsx
// Before — with followCursor
<Tooltip message="Following you" followCursor side="bottom">
  <div className="area">Hover area</div>
</Tooltip>

// After — trackCursorAxis replaces followCursor
<Tooltip trackCursorAxis="both">
  <Tooltip.Trigger render={<div className="area" />}>Hover area</Tooltip.Trigger>
  <Tooltip.Content side="bottom">Following you</Tooltip.Content>
</Tooltip>
```

```tsx
// Before — diagonal side values
<Tooltip message="Info" side="top-left">
  <span>Hover</span>
</Tooltip>

// After — use side + align
<Tooltip>
  <Tooltip.Trigger render={<span />}>Hover</Tooltip.Trigger>
  <Tooltip.Content side="top" align="start">Info</Tooltip.Content>
</Tooltip>
```

```tsx
// Before — disabled tooltip
<Tooltip message="Won't show" disabled>
  <Button>No tooltip</Button>
</Tooltip>

// After — conditional rendering (no disabled prop)
{showTooltip ? (
  <Tooltip>
    <Tooltip.Trigger render={<Button />}>With tooltip</Tooltip.Trigger>
    <Tooltip.Content>Info</Tooltip.Content>
  </Tooltip>
) : (
  <Button>No tooltip</Button>
)}
```

```tsx
// Before — Provider with Radix props
<Tooltip.Provider delayDuration={100} skipDelayDuration={200}>
  <Tooltip message="First">Item 1</Tooltip>
  <Tooltip message="Second">Item 2</Tooltip>
</Tooltip.Provider>

// After — Provider with Base UI props
<Tooltip.Provider delay={100}>
  <Tooltip>
    <Tooltip.Trigger render={<span />}>Item 1</Tooltip.Trigger>
    <Tooltip.Content>First</Tooltip.Content>
  </Tooltip>
  <Tooltip>
    <Tooltip.Trigger render={<span />}>Item 2</Tooltip.Trigger>
    <Tooltip.Content>Second</Tooltip.Content>
  </Tooltip>
</Tooltip.Provider>
```

**Summary of all changes:**

| Old | New |
|-----|-----|
| `message="text"` | `<Tooltip.Content>text</Tooltip.Content>` |
| `children` (trigger) | `<Tooltip.Trigger render={<Element />}>` |
| `followCursor` | `trackCursorAxis="both"` (options: `"none"`, `"x"`, `"y"`, `"both"`) |
| `disabled` | Conditional rendering |
| `side="top-left"` | `side="top" align="start"` |
| `side="top-right"` | `side="top" align="end"` |
| `side="bottom-left"` | `side="bottom" align="start"` |
| `side="bottom-right"` | `side="bottom" align="end"` |
| `showArrow` (default `true`) | `showArrow` on Content (default `false`) |
| `delayDuration={N}` | `delay={N}` |
| `classNames={{ content, arrow }}` | `className` on Content |
| `triggerStyle` / `contentStyle` | `style` on Content or trigger element |
| `disableHoverableContent` | Removed |
| `skipDelayDuration` | Removed |

#### New Features

- `Tooltip.createHandle` for imperative control
- String children in Content auto-wrapped in `<Text>`

---

## New Components

These are purely additive -- no migration needed.

| Component | Key Sub-components |
|-----------|-------------------|
| **AlertDialog** | Trigger, Content, Close, Header, Footer, Body, Title, Description, createHandle |
| **Collapsible** | Trigger, Panel |
| **ContextMenu** | Trigger, Content, Item, Group, Label, Separator, Submenu, SubmenuTrigger, SubmenuContent |
| **Drawer** | Trigger, Content, Header, Title, Description, Body, Footer, Close, createHandle |
| **Field** | Label, Control, Error, Description, Validity. Wraps form controls with accessible labels, descriptions, and error messages. Supports simple props API (`label`, `description`, `error`) and sub-component API for constraint validation. |
| **Fieldset** | Legend. Groups related form fields with an accessible legend. |
| **Form** | Native form element with consolidated error handling, constraint validation, custom validation, and server-side error support. |
| **Menu** | Trigger, Content, Item, Group, Label, Separator, Submenu, SubmenuTrigger, SubmenuContent, createHandle |
| **Menubar** | (compose with Menu children) |
| **Meter** | Label, Value, Track (linear + circular variants) |
| **NumberField** | Group, Input, Decrement, Increment, ScrubArea |
| **PreviewCard** | Trigger, Content, Viewport, createHandle |
| **Progress** | Label, Value, Track (linear + circular variants) |
| **Toggle** | Group |
| **Toolbar** | Button, Group, Separator |

---

## Removed Exports

| Old Export | Replacement | Notes |
|-----------|-------------|-------|
| `DropdownMenu` | `Menu` | See [DropdownMenu -> Menu](#dropdownmenu---menu) |
| `Sheet` | `Drawer` | See [Sheet -> Drawer](#sheet---drawer) |
| `ToastContainer` | `Toast.Provider` | See [Toast](#toast) |
| `toast` (function) | `toastManager` (object) | See [Toast](#toast) |
| `RadioItem` | `Radio` | See [Radio](#radio) |
---

## Migration Checklist

- [ ] Upgrade to React 19
- [ ] Update CSS import order (`normalize.css` before `style.css`)
- [ ] Global find-and-replace: `asChild` -> `render` prop pattern
- [ ] Replace `Text as="..."` with `Text render={<element />}` (see [Text](#text))
- [ ] Replace `Headline as="..."` with `Headline render={<element />}` (see [Headline](#headline))
- [ ] Update callback signatures where TypeScript complains
- [ ] Replace `DropdownMenu` imports with `Menu`
- [ ] Replace `Sheet` imports with `Drawer`
- [ ] Replace `ToastContainer`/`toast` with `Toast.Provider`/`toastManager`
- [ ] Replace `Radio`/`RadioItem` with `Radio.Group`/`Radio`
- [ ] Replace `Tabs.Trigger` with `Tabs.Tab`, `icon` with `leadingIcon`
- [ ] Replace `Slider.onChange` with `Slider.onValueChange`
- [ ] Replace `Select.ScrollUpButton`/`ScrollDownButton` with `ScrollUpArrow`/`ScrollDownArrow`
- [ ] Remove `Select.Viewport` wrapper
- [ ] Rewrite all Tooltip usages to compound component pattern
- [ ] Update Accordion: `type` -> `multiple`, remove `collapsible`, `forceMount` -> `keepMounted`
- [ ] Update Command: `Command.List` -> `Command.Content`, `Group heading` -> `<Command.Label>`, `onSelect` -> `onClick`, inline icons -> `leadingIcon`/`trailingIcon`, wrap dialog usages with `Command.DialogTrigger` + `Command.DialogContent` (see [Command](#command))
- [ ] Update Label usages: drop `size` and `requiredIndicator` props; flip `required` to `required={false}` for an `(optional)` indicator (see [Label](#label))
- [ ] Wrap InputField usages with `<Field>` — move `label`, `helperText`, `error`, `optional` to Field props (see [InputField](#inputfield))
- [ ] Rename `InputField` imports/usages to `Input` (see [Input (formerly InputField)](#input-formerly-inputfield))
- [ ] Wrap Input usages with `<Field>` — move `label`, `helperText`, `error`, `optional` to Field props (see [Input (formerly InputField)](#input-formerly-inputfield))
- [ ] Wrap TextArea usages with `<Field>` — move `label`, `helperText`, `error`, `required` to Field props (see [TextArea](#textarea))
- [ ] Remove `infoTooltip` from Input and TextArea (no longer supported)
- [ ] Review TextArea usages for overflow behavior change (`hidden` -> `auto`) and removed `min-height` (see [TextArea](#textarea))
- [ ] Update custom CSS targeting `data-state` attributes (see [Data Attributes](#data-attributes))
- [ ] Update custom CSS referencing `--radix-*` variables (see [CSS Variables](#css-variables))
- [ ] Test all components end-to-end
