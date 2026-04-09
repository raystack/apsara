# Apsara v1.0.0 Migration Guide: Radix UI / Ariakit -> Base UI

This guide covers all breaking changes when upgrading from the last stable Radix-based release to the current Base UI-based v1.0.0

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Cross-Cutting Changes](#cross-cutting-changes)
- [Component Migration](#component-migration)
  - [Accordion](#accordion)
  - [Avatar](#avatar)
  - [Breadcrumb](#breadcrumb)
  - [Button](#button)
  - [Checkbox](#checkbox)
  - [Combobox](#combobox)
  - [Data Table](#data-table)
  - [Dialog](#dialog)
  - [DropdownMenu -> Menu](#dropdownmenu---menu)
  - [Flex](#flex)
  - [Grid](#grid)
  - [Popover](#popover)
  - [Radio](#radio)
  - [ScrollArea](#scrollarea)
  - [Select](#select)
  - [Separator](#separator)
  - [Sheet -> Drawer](#sheet---drawer)
  - [Sidebar](#sidebar)
  - [Slider](#slider)
  - [Switch](#switch)
  - [Tabs](#tabs)
  - [Toast](#toast)
  - [Tooltip](#tooltip)
- [New Components](#new-components)
- [Removed Exports](#removed-exports)
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

Radix's `asChild` composition pattern is gone. Use the `render` prop instead:

```tsx
// Before
<Button asChild><a href="/">Link</a></Button>

// After
<Button render={<a href="/" />}>Link</Button>
```

Affected components: Button, Grid, Grid.Item, Popover.Trigger, Menu.Trigger, Drawer.Trigger, and others.

### Callback Signatures

Most `onValueChange`, `onOpenChange`, and `onCheckedChange` callbacks now receive a second `eventDetails` argument:

```tsx
// Before
onOpenChange={(open: boolean) => { ... }}

// After
onOpenChange={(open: boolean, eventDetails) => { ... }}
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
| `data-active-item="true"` | `data-highlighted` |
| `data-disabled="true"` | `data-disabled` (no value) |

### CSS Variables

If you reference these CSS variables in custom styles:

| Old | New |
|-----|-----|
| `--radix-popover-trigger-width` | `--anchor-width` |
| `--radix-select-trigger-width` | `--anchor-width` |
| `--radix-accordion-content-height` | `--accordion-panel-height` |
| `--radix-collapsible-content-*` | Removed |

---

## Component Migration

### Accordion

1. **`type` prop replaced with `multiple` boolean**, `collapsible` prop removed (always collapsible):
   ```tsx
   // Before
   <Accordion type="single" collapsible>
   <Accordion type="multiple">

   // After
   <Accordion>                    {/* single, always collapsible */}
   <Accordion multiple>           {/* multiple mode */}
   ```

2. **`onValueChange` in single mode** now receives `string | undefined` (not just `string`).

3. **Type exports removed** -- `AccordionItemProps`, `AccordionTriggerProps`, `AccordionContentProps` are no longer exported.

---

### Avatar

1. **`asChild` prop removed.**
2. **`delayMs` and other Radix-specific root props** no longer recognized.

Unchanged: `size`, `radius`, `variant`, `color`, `fallback`, `src`, `alt`, `className`, `AvatarGroup` with `max`, and `getAvatarColor`.

---

### Breadcrumb

1. **`as` prop renamed to `render`** on `BreadcrumbItem`:
   ```tsx
   // Before
   <Breadcrumb.Item as={<CustomLink />}>...</Breadcrumb.Item>

   // After
   <Breadcrumb.Item render={<CustomLink />}>...</Breadcrumb.Item>
   ```

2. **`current` items now render `<span>` instead of `<a>`.**

3. **`dropdownItems` shape changed** -- `label` -> `children`:
   ```tsx
   // Before
   dropdownItems={[{ label: 'Option', onClick: handler }]}

   // After
   dropdownItems={[{ children: 'Option', onClick: handler }]}
   ```

---

### Button

1. **`asChild` removed** -- use `render` prop:
   ```tsx
   // Before
   <Button asChild><a href="/">Link</a></Button>

   // After
   <Button render={<a href="/" />}>Link</Button>
   ```

---

### Checkbox

1. **Indeterminate API changed** -- `checked="indeterminate"` replaced by separate `indeterminate` boolean:
   ```tsx
   // Before
   <Checkbox checked="indeterminate" />

   // After
   <Checkbox indeterminate />
   ```

2. **`onCheckedChange` now receives 2 args** -- `(checked: boolean, eventDetails)`. The `CheckedState` type (`boolean | 'indeterminate'`) no longer exists.

3. **`CheckboxProps` type export removed.**

#### New: `Checkbox.Group`

```tsx
<Checkbox.Group defaultValue={['apple']} onValueChange={setSelected}>
  <Checkbox name="apple" />
  <Checkbox name="banana" />
</Checkbox.Group>
```

---

### Combobox

1. **`onOpenChange` signature changed** -- now `(open, eventDetails)` (2 args). `onValueChange` and `onInputValueChange` are unchanged (1 arg).

2. **Content props removed** -- `align`, `onOpenAutoFocus`, `onInteractOutside`, `onFocusOutside` no longer accepted. New: `initialFocus`, `finalFocus`.

3. **`modal` prop removed** -- always modal.

4. **`defaultInputValue` prop removed** -- use controlled `inputValue`.

5. **`focusOnHover` prop removed from Item.**

6. **Backspace-to-remove-last-chip removed** in multiple mode.

#### New Features

- `Combobox.useFilter` and `Combobox.useFilteredItems` hooks for declarative filtering
- Generic value type support: `<Combobox<CustomType>>`
- `items` prop on Root for built-in filtering
- `render` prop on Content and Item

```tsx
// Before
<Combobox modal={false} defaultInputValue="app" onOpenChange={(open) => {}}>
  <Combobox.Input placeholder="Search" />
  <Combobox.Content align="start" onInteractOutside={handler}>
    <Combobox.Item value="apple" focusOnHover>Apple</Combobox.Item>
  </Combobox.Content>
</Combobox>

// After
<Combobox onOpenChange={(open, details) => {}}>
  <Combobox.Input placeholder="Search" />
  <Combobox.Content>
    <Combobox.Item value="apple">Apple</Combobox.Item>
  </Combobox.Content>
</Combobox>
```

---

### Data Table

- `defaultSort` is now effectively required for "Reset to default" and empty/zero state detection to work properly.
- New `totalRowCount` prop -- when provided in `mode='server'`, shows a "N items hidden by filters" message.

---

### Dialog

1. **`DialogContent` props rewritten:**
   - Removed: `ariaLabel`, `ariaDescription`, `overlayBlur`, `overlayClassName`, `overlayStyle`, `scrollableOverlay`
   - New: `showCloseButton` (default `true`), `overlay` (object with `blur?: boolean`, `className`, `style`), `showNestedAnimation`

2. **CloseButton is now auto-rendered** inside Content. Remove manual `<Dialog.CloseButton />` from headers. Pass `showCloseButton={false}` to suppress.

```tsx
// Before
<Dialog.Content ariaLabel="Settings" overlayBlur overlayClassName="my-overlay">
  <Dialog.Header>
    <Dialog.Title>Settings</Dialog.Title>
    <Dialog.CloseButton />
  </Dialog.Header>
</Dialog.Content>

// After
<Dialog.Content aria-label="Settings" overlay={{ blur: true, className: "my-overlay" }}>
  <Dialog.Header>
    <Dialog.Title>Settings</Dialog.Title>
    {/* CloseButton auto-rendered by Content */}
  </Dialog.Header>
</Dialog.Content>
```

#### New Features

- `Dialog.createHandle` for imperative open/close
- `showNestedAnimation` for stacked dialog animations
- Header/Footer/Body accept all Flex props

---

### DropdownMenu -> Menu

**Export renamed: `DropdownMenu` -> `Menu`**

1. **Import changed:**
   ```tsx
   // Before
   import { DropdownMenu } from '@raystack/apsara';

   // After
   import { Menu } from '@raystack/apsara';
   ```

2. **Nested menu API restructured** -- `TriggerItem` replaced by dedicated sub-components:
   ```tsx
   // Before
   <DropdownMenu>
     <DropdownMenu.TriggerItem>Sub Menu</DropdownMenu.TriggerItem>
     <DropdownMenu.Content>
       <DropdownMenu.Item>Nested</DropdownMenu.Item>
     </DropdownMenu.Content>
   </DropdownMenu>

   // After
   <Menu.Submenu>
     <Menu.SubmenuTrigger>Sub Menu</Menu.SubmenuTrigger>
     <Menu.SubmenuContent>
       <Menu.Item>Nested</Menu.Item>
     </Menu.SubmenuContent>
   </Menu.Submenu>
   ```

3. **`asChild` -> `render`** on Trigger.

4. **Search prop renames:**
   - `searchValue` -> `inputValue`
   - `onSearch` -> `onInputValueChange`
   - `defaultSearchValue` -> `defaultInputValue`

5. **`focusLoop` -> `loopFocus`** (default changed from `true` to `false`).

6. **Content props:** `gutter` -> `sideOffset`. `portal`, `portalElement`, `unmountOnHide` removed.

#### New Features

- `Menu.Submenu`, `Menu.SubmenuTrigger`, `Menu.SubmenuContent`
- `Menu.createHandle` for imperative control
- Menubar integration

---

### Flex

- New `render` prop to change the underlying element (e.g., `render={<section />}`).
- Type changed to `useRender.ComponentProps<'div'>` -- may cause TypeScript errors if you typed Flex props explicitly.

---

### Grid

- `asChild` removed from both `Grid` and `Grid.Item`. Use `render`:
  ```tsx
  // Before
  <Grid asChild><section>...</section></Grid>

  // After
  <Grid render={<section />}>...</Grid>
  ```

---

### Popover

1. **`asChild` removed from Trigger** -- use `render` prop or pass children directly.
2. **`ariaLabel` custom prop removed** -- use standard `aria-label` instead.

Positioning props (`side`, `align`, `sideOffset`, `collisionPadding`) are preserved.

#### New Features

- `Popover.createHandle` for imperative control
- `initialFocus` / `finalFocus` for focus management

---

### Radio

**Component hierarchy inverted** -- this is the most disruptive change:

```tsx
// Before
import { Radio, RadioItem } from '@raystack/apsara';

<Radio defaultValue="opt1" onValueChange={handler}>
  <Radio.Item value="opt1" />
  <Radio.Item value="opt2" />
</Radio>

// After
import { Radio } from '@raystack/apsara';

<Radio.Group defaultValue="opt1" onValueChange={handler}>
  <Radio value="opt1" />
  <Radio value="opt2" />
</Radio.Group>
```

- `RadioItem` export removed -- use `Radio` for individual items.
- `onValueChange` now receives 2 args.
- `RadioItemProps` type export removed.

---

### ScrollArea

1. **`type="auto"` removed.** Remaining options: `'always'`, `'hover'`, `'scroll'`.
2. **Default `type` changed** from `'auto'` to `'hover'`.
3. **`ScrollAreaRootProps` renamed** to `ScrollAreaProps`.

---

### Select

1. **Sub-component renames:**
   - `Select.ScrollUpButton` -> `Select.ScrollUpArrow`
   - `Select.ScrollDownButton` -> `Select.ScrollDownArrow`
   - `Select.Viewport` -> removed (no longer needed)

2. **`SelectContent` props removed** -- `position`, `asChild`, `onEscapeKeyDown`, `onPointerDownOutside`.

3. **`SelectItem` uses `render` prop** instead of `asChild`.

#### New Features

- `items` prop for external filtering
- Explicit `disabled`, `required`, `name` props on Root

```tsx
// Before
<Select defaultValue="apple" onValueChange={setValue}>
  <Select.Trigger>
    <Select.Value placeholder="Pick a fruit" />
  </Select.Trigger>
  <Select.Content position="popper" sideOffset={4}>
    <Select.Viewport>
      <Select.Item value="apple">Apple</Select.Item>
    </Select.Viewport>
    <Select.ScrollDownButton />
  </Select.Content>
</Select>

// After
<Select defaultValue="apple" onValueChange={setValue}>
  <Select.Trigger>
    <Select.Value placeholder="Pick a fruit" />
  </Select.Trigger>
  <Select.Content sideOffset={4}>
    <Select.Item value="apple">Apple</Select.Item>
    <Select.ScrollDownArrow />
  </Select.Content>
</Select>
```

---

### Separator

1. **`decorative` prop removed.**
2. **Default `aria-label` removed** -- no longer auto-generates `"horizontal separator"`. Add explicitly if needed.

---

### Sheet -> Drawer

**Export renamed: `Sheet` -> `Drawer`**

1. **All sub-components renamed** -- `Sheet.*` -> `Drawer.*`.

2. **`asChild` -> `render`** on Trigger.

3. **`side` must be passed to both Root AND Content:**
   ```tsx
   // Before
   <Sheet><Sheet.Content side="left">...</Sheet.Content></Sheet>

   // After
   <Drawer side="left"><Drawer.Content side="left">...</Drawer.Content></Drawer>
   ```

4. **Close button prop renamed** -- `close` -> `showCloseButton` (default changed to `true`).

#### New Features

- Swipe-to-dismiss
- Structured layout: `Drawer.Header`, `Drawer.Body`, `Drawer.Footer`
- `Drawer.createHandle` for drag handle

```tsx
// Before
<Sheet open={open} onOpenChange={setOpen}>
  <Sheet.Trigger asChild><Button>Open</Button></Sheet.Trigger>
  <Sheet.Content side="right" close={true}>
    <Sheet.Title>Title</Sheet.Title>
    {content}
  </Sheet.Content>
</Sheet>

// After
<Drawer open={open} onOpenChange={setOpen} side="right">
  <Drawer.Trigger render={<Button />}>Open</Drawer.Trigger>
  <Drawer.Content side="right">
    <Drawer.Header>
      <Drawer.Title>Title</Drawer.Title>
    </Drawer.Header>
    <Drawer.Body>{content}</Drawer.Body>
  </Drawer.Content>
</Drawer>
```

---

### Sidebar

1. **`disabled` prop replaced by `collapsible={false}`.**

2. **`asChild` removed from Root** -- always renders `<aside>`.

3. **Item rendering:** `asChild` replaced by `as` prop:
   ```tsx
   // Before
   <Sidebar.Item asChild><Link href="/x">X</Link></Sidebar.Item>

   // After
   <Sidebar.Item as={<Link href="/x" />}>X</Sidebar.Item>
   ```

#### New Features

- `position` prop (`"left"` | `"right"`)
- `Sidebar.Header`, `Sidebar.Main`, `Sidebar.Footer`, `Sidebar.Group` sub-components
- `tooltipMessage` and `hideCollapsedItemTooltip` props
- Automatic collapsed state: text hidden, fallback avatar shown, tooltip on hover
- `data-collapse-hidden` attribute for elements that should hide when collapsed

---

### Slider

1. **`onChange` removed** -- use `onValueChange`:
   ```tsx
   // Before
   <Slider onChange={(val) => setValue(val)} />

   // After
   <Slider onValueChange={(val, details) => setValue(val)} />
   ```

#### New Features

- `Slider.Value` sub-component for inline value display

---

### Switch

1. **`onCheckedChange` now receives 2 args** -- `(checked, eventDetails)`.
2. **`required`:** `aria-required="true"` -> `data-required`.
3. **Hidden `<input>` for form `name`/`value` removed** -- form integration handled internally.

---

### Tabs

1. **`Tabs.Trigger` renamed to `Tabs.Tab`.**
2. **`icon` prop renamed to `leadingIcon`.**

```tsx
// Before
<Tabs.Trigger value="tab1" icon={<HomeIcon />}>Home</Tabs.Trigger>

// After
<Tabs.Tab value="tab1" leadingIcon={<HomeIcon />}>Home</Tabs.Tab>
```

#### New Features

- Three variants: `segmented` (default), `standalone`, `plain`
- Three sizes: `small`, `medium`, `large`

---

### Toast

**Exports renamed: `ToastContainer`/`toast` -> `Toast`/`toastManager`**

1. **Provider model changed** -- standalone `<ToastContainer />` -> wrapping `<Toast.Provider>`:
   ```tsx
   // Before
   <App /><ToastContainer />

   // After
   <Toast.Provider position="bottom-right"><App /></Toast.Provider>
   ```

2. **Toast creation API changed:**
   ```tsx
   // Before
   toast('Hello');
   toast.success('Done');
   toast.dismiss(id);
   toast('Deleted', { action: { label: 'Undo', onClick: handler } });

   // After
   toastManager.add({ title: 'Hello' });
   toastManager.add({ title: 'Done', type: 'success' });
   toastManager.close(id);
   toastManager.add({ title: 'Deleted', actionProps: { children: 'Undo', onClick: handler } });
   ```

3. **Callbacks:** `onDismiss`/`onAutoClose` -> `onClose`.

4. **No per-toast inline styles** -- styling is CSS-driven via `data-type` attribute.

#### New Features

- Toast stacking with peek animation and expand-on-hover
- Swipe-to-dismiss
- `toastManager.update(id, props)` for modifying existing toasts
- `Toast.createToastManager` and `Toast.useToastManager`

---

### Tooltip

**Complete API redesign -- every usage must be rewritten.**

```tsx
// Before
<Tooltip message="Hello" side="top" showArrow delayDuration={200}>
  <Button>Hover</Button>
</Tooltip>

// After
<Tooltip delay={200}>
  <Tooltip.Trigger render={<Button />}>Hover</Tooltip.Trigger>
  <Tooltip.Content side="top" showArrow>Hello</Tooltip.Content>
</Tooltip>
```

1. **`message` prop removed** -- content goes in `<Tooltip.Content>`.
2. **`children` is no longer the trigger** -- wrap in `<Tooltip.Trigger>`.
3. **Removed props:** `disabled`, `followCursor`, `classNames`, `triggerStyle`, `contentStyle`, `disableHoverableContent`, `skipDelayDuration`.
4. **Diagonal `side` values removed:**
   - `side="top-left"` -> `side="top" align="start"`
   - `side="top-right"` -> `side="top" align="end"`
   - `side="bottom-left"` -> `side="bottom" align="start"`
   - `side="bottom-right"` -> `side="bottom" align="end"`
5. **`showArrow` default changed** from `true` to `false`.
6. **`delayDuration` renamed to `delay`.**
7. **Auto-provider wrapping removed** -- consumer decides whether to use `<Tooltip.Provider>`.

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
- [ ] Global find-and-replace: `asChild` -> `render` prop pattern
- [ ] Update `onValueChange`/`onOpenChange`/`onCheckedChange` callback signatures
- [ ] Replace `DropdownMenu` imports with `Menu`
- [ ] Replace `Sheet` imports with `Drawer`
- [ ] Replace `ToastContainer`/`toast` with `Toast.Provider`/`toastManager`
- [ ] Replace `Radio`/`RadioItem` with `Radio.Group`/`Radio`
- [ ] Replace `Tabs.Trigger` with `Tabs.Tab`, `icon` with `leadingIcon`
- [ ] Replace `Slider.onChange` with `Slider.onValueChange`
- [ ] Replace `Select.ScrollUpButton`/`ScrollDownButton` with `ScrollUpArrow`/`ScrollDownArrow`
- [ ] Remove `Select.Viewport` wrapper
- [ ] Rewrite all Tooltip usages to compound component pattern
- [ ] Update custom CSS targeting `data-state` attributes (see [Data Attributes](#data-attributes))
- [ ] Update custom CSS referencing `--radix-*` variables (see [CSS Variables](#css-variables))
