# @raystack/apsara

## 0.50.0

### Icon registry — lucide replaces @radix-ui/react-icons (BREAKING)

Apsara refers to every icon by a stable name held in one map,
`packages/raystack/icons/icon-map.json`. Changing that map and running
`pnpm build:icon-registry` changes the icon library for the whole design
system — no call site and no consumer code changes. Consumers can also
replace any icon with their own component, once, at `<Theme>`.

The default library moves from `@radix-ui/react-icons` to lucide in the
same release, so some icons look different. See the
[migration guide](https://apsara.raystack.io/docs/migrating-to-lucide-icons).

#### Breaking changes

- **`lucide-react` is a new peer dependency**, range
  `>=0.500.0 <0.600.0`. Install it. The range is narrow because lucide is
  a 0.x package and a wide range would let the consumer's version decide
  how Apsara looks.
- **`@radix-ui/react-icons` is no longer a dependency.** It remains a
  `devDependency` because `scripts/generate-icons-code-connect.js` needs
  it for `pnpm figma:sync`.
- **Eight icons draw a different shape.** The sidebar collapse caret and
  the submenu marker change from a solid triangle to a chevron (lucide has
  no solid caret); `ChatPanel` expand/minimize become the matched
  `ExpandIcon`/`ShrinkIcon` pair; the `PromptInput` stop button and
  `ShoppingBagFilledIcon` go from solid to stroke; and the `DataTable` sort
  arrows change glyph. `DatePicker` gains day marks inside its calendar
  glyph.
- **Icons render at 16×16** with `strokeWidth={1.5}`, where the radix
  icons were intrinsically 15×15. A call site that sets a CSS class or an
  explicit `width`/`height` is unaffected. `1.5` is 1 rendered pixel: the
  prop counts units of lucide's 24-unit viewBox, so the stroke on screen
  is `strokeWidth × width / 24`.
- **Icon overrides must be registered from a client component.** An icon
  map is an object of functions, and a function cannot cross the boundary
  from a React Server Component. A `<Theme>` that sits directly in a
  server layout must move into a `providers.tsx` marked `'use client'`.
- **The 10 in-house SVG assets that lucide can replace are deleted.**
  Five of their names are registry keys and still resolve; the other nine
  must be renamed — see the subpath note below.

#### New features

- **`<Theme icons={…}>`** replaces any icon by name. The map is partial,
  so an override of one icon leaves the rest alone, and a nested `<Theme>`
  layers on the one above it per name.
- **`<Theme iconProps={…}>`** applies props to every icon. The props at
  the call site still win.
- **`data-icon="<Name>"`** on every icon, so CSS can style one icon
  without a re-render and a test can select it.
- **243 icons**, from `@raystack/apsara/icons` and from the package root —
  239 lucide, 4 in-house SVGs that lucide cannot draw (`CoPilotIcon`,
  `CheckCircleFilledIcon`, `CrossCircleFilledIcon`, `CoinColoredIcon`).
  Each icon is its own module, so a build that shows three icons ships
  three icons rather than all 243. A bundle test enforces this. Prefer the
  subpath: it reaches no component module, so one icon costs one icon even
  when a bundler does not honour `"sideEffects": false`.
- **New public types**: `IconName` (the union of all 243 names, so a typo
  in an override map is a type error), `IconOverrides`, `IconComponent`,
  `IconProps`, `IconProviderProps`, and `IconProvider` itself.
- **`pnpm check:icon-map`** asserts that every lucide name in the map is a
  real export and that every in-house `asset` names a file that exists, so
  moving the peer range cannot silently break an icon name.

#### The `@raystack/apsara/icons` subpath

- **The subpath stays supported, and is now the icons-only entry point.**
  It exports the same 243 icons as the package root, as the same
  overridable registry wrappers, and reaches no component module — which
  matters for CJS, where the root barrel's `.cjs` eagerly requires every
  component.
- **Nine in-house icon names are removed** (breaking). The subpath used to
  export the raw SVG assets; it now exports registry keys, so rename:
  `BellSlashIcon` → `BellOffIcon`, `BuildingsFilledIcon` →
  `Building2Icon`, `CoinIcon` → `CoinsIcon`, `FilterIcon` →
  `ListFilterIcon`, `OrganizationIcon` → `Building2Icon`, `ResetIcon` →
  `RotateCcwIcon`, `ShoppingBagFilledIcon` → `ShoppingBagIcon`,
  `SidebarIcon` → `PanelLeftIcon`, `TriangleRightIcon` →
  `ChevronRightIcon`. `BuildingsFilledIcon` and `OrganizationIcon` both
  become `Building2Icon`, so they are now one component. Five names are
  unchanged because they were already registry keys: `BellIcon`,
  `CoPilotIcon`, `CoinColoredIcon`, `CheckCircleFilledIcon`,
  `CrossCircleFilledIcon`.

## 0.49.0

### Calendar / DatePicker / RangePicker improvements (PR #819)

A coordinated overhaul of the three calendar surfaces — `Calendar`,
`DatePicker`, `RangePicker` — that had drifted apart on behavior,
defaults, and exposed API. 18 P0/P1 bugs fixed, a new `slotProps`
API added, and the three legacy prop names (`inputProps`,
`inputsProps`, `calendarProps`, `popoverProps`) marked
`@deprecated` for a one-release window.

#### New features

- **`slotProps` API** on both pickers — consolidates the per-slot
  configuration into a single, consistent prop shape:
  - `DatePicker`: `slotProps={{ input?, calendar?, popover? }}`
  - `RangePicker`: `slotProps={{ startInput?, endInput?, calendar?, popover? }}`
  - Legacy `inputProps`/`inputsProps`/`calendarProps`/`popoverProps`
    still work; when both are set, `slotProps` wins.
- **`DatePicker.defaultValue`** added — pair with controlled `value`
  for the standard React controlled/uncontrolled pattern.
- **Unselected initial state** on `DatePicker` — omitting both
  `value` and `defaultValue` now starts the picker empty; the
  "Select date" placeholder is honored. `onSelect` stays typed
  `(date: Date) => void` and only fires with a defined date.
- **Public types** — `CalendarProps`, `CalendarPropsExtended`, and
  `DateRange` re-exported from `@raystack/apsara`.

#### Bug fixes

- **DatePicker `TypeError` on every keystroke** (P0 hotfix) —
  `dayjs.extend(isSameOrAfter)` and `isSameOrBefore` were missing;
  bounds checks threw on each input.
- **Future dates no longer silently rejected** — the hardcoded
  `isSameOrBefore(dayjs())` ceiling is gone; bounds come from
  `calendarProps.startMonth` / `endMonth`.
- **`value` prop is reactive** on both pickers — form resets, preset
  buttons, and URL-driven changes now propagate to the input.
- **Month navigation no longer mutates selection** on `DatePicker` —
  visible month tracked separately from selected date.
- **`calendarProps` overrides respected** on both pickers — type
  widened to `Omit<PropsBase, 'mode'> & CalendarPropsExtended`.
- **Strict format parsing** for typed input on `DatePicker` —
  single digits no longer commit "Jan 5 2001"-style V8 fallbacks.
- **`calendarProps.defaultMonth` honored** on every open.
- **`Calendar.mode` no longer forced** away from consumer overrides.
- **Popover machinery extracted** into shared `usePickerPopover`
  hook — RangePicker gains the year/month dropdown carve-out plus
  outside-click handling.
- **RangePicker: `{today, today}` default removed** — uncontrolled
  picker now correctly shows the placeholder until the first
  interaction.
- **RangePicker state machine rewritten** — branches on actual
  `from`/`to` state (A/B1/B2/C) rather than which input is active;
  resolves cases where the machine got stuck.
- **RangePicker controlled-mode wasted renders** eliminated —
  `setInternalValue` skipped when `value` is set.
- **RangePicker `onSelect` typing** corrected to `{from?, to?}` —
  matches the runtime `DateRange` shape.
- **Calendar tz-aware `dateKey`** for `tooltipMessages` / `dateInfo`
  lookups — UTC-day grids in non-UTC browsers no longer miss
  messages keyed at UTC midnight.
- **Calendar `onDropdownOpen` re-fire** fixed — ref-based mirror so
  the effect depends only on `open`; parent callback identity churn
  no longer re-fires.
- **`disabled` on input now also gates the popover** on both pickers
  — the trailing calendar icon renders as a sibling `<div>` to the
  `<input>`, so its clicks bubbled to `Popover.Trigger` and opened
  the calendar even when the input was `disabled`. RangePicker
  treats either input disabled as fully disabled (partial-disable
  would let the shared range state machine rewrite the "disabled"
  side through the grid; constrain via `calendarProps` for
  fix-one-side use cases).
- **`dateInfo` icons render correctly when their day is selected** —
  the `.dayInfo svg { fill: emphasis }` rule was overriding
  `fill="none"` on stroke-based icons (lucide) and filling the
  outline paths solid. `color` alone now carries the selected style
  via `currentColor` for both stroke- and fill-based icon libraries.
- **FilterChip date column no longer crashes** — the stricter
  `DatePicker` `value?: Date` contract above surfaced a latent bug:
  `FilterChip` seeded its value with `''` and forwarded that string
  straight to the picker, so the new controlled-sync effect's
  `valueProp?.getTime()` threw `TypeError`. `FilterChip` now parses
  string and epoch-number values into a `Date` (unparseable values
  start the field unselected) and uses the new `slotProps.input` API
  instead of the deprecated `inputProps`.
- **FilterChip `calendarProps`** — mirrors the existing `selectProps`
  pattern: forwards arbitrary props (e.g. `dateFormat`, `timeZone`,
  `slotProps.calendar`) to the underlying `DatePicker` for
  `columnType="date"`. `value`/`onSelect`/`defaultValue`/`children`
  remain owned by `FilterChip`. The standalone `dateFormat` prop is
  removed — pass `calendarProps={{ dateFormat: '…' }}` instead.
  `DataTable` / `DataView` columns gain a parallel `filterProps.calendar`
  slot alongside `filterProps.select`. The supporting types —
  `FilterChipProps`, `FilterChipCalendarProps`, `FilterChipValue`,
  `DatePickerProps`, `DatePickerSlotProps` — are exported from the
  package root.
- **`DatePicker` / `RangePicker` `dateFormat` default is now
  `"DD MMM YYYY"`** (previously `"DD/MM/YYYY"`). Text-based months
  (e.g. "27 May 2026") avoid the DD/MM vs MM/DD ambiguity that
  showed up in mixed-locale screenshots. Consumers who relied on
  the slash default must pass `dateFormat="DD/MM/YYYY"` explicitly.
  `FilterChip`'s `columnType="date"` inherits the new default
  directly — its prior internal override is removed.

#### Code-review and audit follow-ups

- `usePickerPopover`: document mouseup listener cleaned up on unmount.
- `usePickerPopover`: `handleInputBlur` closes immediately when the
  first blur moves focus outside (keyboard-Tab path).
- `usePickerPopover`: `onOpenChange` now lets explicit close requests
  (Escape, trigger toggle) through; only redundant re-opens are
  suppressed.
- `DatePicker.closePicker`: emits the committed `Date` directly
  instead of round-tripping through `dayjs(formattedString).toDate()`
  (which could mis-parse non-ISO formats like `DD/MM/YYYY`).
- Picker trigger always renders as `<div>` with `nativeButton={false}`
  to avoid Base UI's button-nesting warning when consumers pass a
  button element.
- RangePicker `computedDefaultMonth`: short-circuits when
  `currentMonth` is undefined (was passing `dayjs(undefined)` → "now"
  and falsely matching `endMonth`).
- RangePicker controlled-clear `value.from` sync now unpins the
  calendar on parent reset.

#### Deprecations (one-release window)

- `DatePicker.inputProps` → `slotProps.input`
- `DatePicker.calendarProps` → `slotProps.calendar`
- `DatePicker.popoverProps` → `slotProps.popover`
- `RangePicker.inputsProps` → `slotProps.startInput` / `slotProps.endInput`
- `RangePicker.calendarProps` → `slotProps.calendar`
- `RangePicker.popoverProps` → `slotProps.popover`

All marked `@deprecated` via JSDoc; IDEs surface the replacement.
Old props still work — `slotProps` wins when both are set.

#### Docs

- Calendar docs page split into **Layout & appearance**
  (Basic / Loading / Dropdowns / Footer) and **Behavior & data**
  (Tooltips / Disabled / Timezone / Controlled Month) demo blocks.
- `RangePicker` and `DatePicker` prose rewritten to describe actual
  behavior (state machine, typed input commit semantics).
- `CalendarProps` surface fully documented (previously only a
  subset).
- Migration notes for deprecated `fromYear` / `toYear` /
  `fromMonth` / `toMonth` / `fromDate` / `toDate` props folded into
  the docs for `startMonth` / `endMonth` / `hidden`.
- Showcase demos migrated to `slotProps`.
- New **Disabled** and **Disabled Dates** tabs on both picker
  demos. The RangePicker **Disabled** demo includes an inline
  comment explaining the any-disabled gating rule and points at
  `calendarProps` for partial-lock use cases.

#### Tests

47 new tests across 4 new files:
- `date-picker.test.tsx` (31 tests) — slotProps, defaultValue,
  unselected state, single-fire onSelect, strict parsing, bounds,
  month navigation, calendarProps surface, disabled-state gating.
- `date-picker.runtime.test.tsx` (4 tests) — mount/unmount loops
  with `captionLayout='dropdown'`.
- `range-picker.test.tsx` (19 tests) — slotProps, state machine
  (A/B1/B2/C), value→currentMonth sync, calendarProps surface,
  disabled-state gating (both-disabled and partial-disabled paths).
- `range-picker.runtime.test.tsx` (2 tests) — mount/unmount loops.

Plus regression tests added to the existing `calendar.test.tsx`
for the tz-aware `dateKey` fix.

#### Internal

- New shared hook `use-picker-popover.ts` — encapsulates open/close
  state, outside-click listener, and the year/month dropdown
  carve-out.
- `dayjs` bumped to `^1.11.20` (was `^1.11.11`) for the strict-parse
  + tz plugins.

### FilterChip & filter toolbar fixes (PR #821)

#### Fixes

- **FilterChip values truncate instead of clipping** — the value
  input hugs its content (`field-sizing: content`, `width: auto`
  fallback), caps at 200px, and under toolbar resize pressure shrinks
  with a visible ellipsis and intact side padding (previously the
  wrapper clipped the input, hiding both). An empty value keeps a
  50px clickable floor — the whole visible value area now focuses the
  input.
- **Applied filter chips wrap to the panel** — `DataTable`'s
  `.filterContainer` and `DataView`'s filters row fill the toolbar,
  wrap, and let chips shrink instead of overflowing in a single row.
- **DataTable: adding a `select` filter with no `filterOptions` no
  longer crashes** (`options[0].value` → `options[0]?.value`, parity
  with DataView).
- **DataTable: `multiselect` filters preselect the first option**
  (matching `select`; `[]` when there are no options) instead of
  falling through to `''` — the chip's multi-`Select` expects an
  array value.
- **DataTable: `classNames.addFilter` is now applied** to the default
  add-filter triggers (it was accepted and silently dropped).
- **FilterChip: removed a dead `selectColumn` class reference** left
  behind by #810; the chip's `border-radius` + `overflow: clip`
  already rounds the select trigger.

## 0.11.3

### Patch Changes

- 18254e1: export select scroll buttons

## 0.11.2

### Patch Changes

- 8eaeaec: fix: select options font color

## 0.11.1

### Patch Changes

- 9057c8c: fix: show more than 10 columns in table.

## 0.11.0

### Minor Changes

- 1375394: fix: table style