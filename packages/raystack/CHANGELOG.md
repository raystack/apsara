# @raystack/apsara

## Unreleased

### CalendarPreview — a subcomposed replacement for the calendar family

`CalendarPreview` is one root with dot-notation parts, replacing `Calendar`,
`DatePicker` and `RangePicker`. Every piece of state is owned explicitly —
selection, visible month, open, granularity — so popover open state is public
for the first time and Base UI owns dismissal. See
[CalendarPreview](https://apsara.raystack.io/docs/components/calendar-preview)
and RFC 005.

Twelve parts: `Trigger`, `Content`, `Input`, `RangeInput`, `GranularityTabs`,
`Nav`, `Grid`, `MonthGrid`, `TimeField`, `Footer`, `Apply`, `Cancel`.

The old family still ships and is unchanged. It is removed a release after
this one.

- **Day, month, quarter, half-year and year selection**, switchable through
  `GranularityTabs`. Non-day granularities emit the first day of the chosen
  period.
- **Both range fields are typable.** The old `RangePicker` left them
  `readOnly`.
- **`lock="from" | "to"`** holds one endpoint read-only in both the input and
  the grid, so "fix the start, pick the end" no longer disables the whole
  picker.
- **`commit="explicit"`** buffers edits until `Apply`, so a popover can be
  abandoned without the parent seeing intermediate states.
- **No `slotProps`.** Every surface is a part, and every part spreads
  `...props` last.
- **The popover opens `bottom-start`**, not above the trigger.

#### Breaking changes

- **`FilterChipCalendarProps` changes shape.** It was a subset of
  `DatePickerProps`; it is now a subset of `CalendarPreview`'s root props.
  Props renamed: `dateFormat` → `format`, `onSelect` → `onValueChange`,
  `calendarProps.startMonth`/`endMonth` → `minDate`/`maxDate`. `slotProps`,
  `inputProps` and `showCalendarIcon` are gone — compose parts instead. This
  reaches `DataTable`'s and `DataView`'s `filterProps.calendar`.
- **`FilterChip`'s date control is now `CalendarPreview`.** Its `data-slot`
  names change accordingly: `date-picker-input` becomes
  `calendar-preview-input`. Styling that targeted the old slots must be
  updated.

#### Other changes

- `DataView` fields gain `filterProps.calendar`, which the 0.49.0 notes
  already claimed existed but which only `DataTable` had.
- `DataTable` and `DataView` filter operations no longer register dayjs
  plugins themselves. Date comparison lives in one adapter, which removes the
  import-order dependence behind the 0.49.0 keystroke crash.

### Icons — lucide replaces @radix-ui/react-icons (BREAKING)

Apsara names every icon with a stable key that does not name a library —
`SearchIcon`, `SortAscendingIcon`, `ClearIcon` — and draws it with lucide.
The package exports the 32 icons its own components use, and `createIcon`
is public, so an app builds any other icon the same way. See the
[migration guide](https://apsara.raystack.io/docs/migrating-to-lucide-icons)
and [Icons](https://apsara.raystack.io/docs/theme/icons).

#### Breaking changes

- **`lucide-react` is a new peer dependency**, range `>=0.500.0 <1.0.0`.
  Install it.
- **`@radix-ui/react-icons` is no longer a dependency.** If your own code
  imports from it, keep it in your own `dependencies`.
- **`@raystack/apsara/icons` exports icon components, not raw SVG
  assets.** Twelve names are gone: `BellIcon`, `BellSlashIcon`,
  `BuildingsFilledIcon`, `CheckCircleFilledIcon`, `CoinIcon`,
  `CoinColoredIcon`, `CrossCircleFilledIcon`, `OrganizationIcon`,
  `ResetIcon`, `ShoppingBagFilledIcon`, `SidebarIcon` and
  `TriangleRightIcon`. Import the glyph from `lucide-react` instead, and
  wrap it with `createIcon` if you want it replaceable. `CoPilotIcon` and
  `FilterIcon` keep their names but draw lucide `Sparkles` and
  `ListFilter` rather than the in-house solid SVGs.
- **Icons render at 16×16** with `strokeWidth={1.5}`, where the radix
  icons were intrinsically 15×15. A call site that sets a CSS class or an
  explicit `width`/`height` is unaffected. `1.5` is 1 rendered pixel: the
  prop counts units of lucide's 24-unit viewBox, so the stroke on screen
  is `strokeWidth × width / 24`.
- **Some icons inside Apsara's components draw a different shape.** The
  `Sidebar` collapse control and the submenu marker become chevrons
  (lucide has no solid caret); `ChatPanel` expand and minimize become the
  matched `ExpandIcon` / `ShrinkIcon` pair; the `PromptInput` stop button
  goes from solid to stroke; the `DataTable` and `DataView` sort controls
  change glyph; the `ChatPanel` bubble goes from a solid sparkle pair to a
  stroked `Sparkles`; and `DatePicker` gains day marks inside its calendar
  glyph.
- **Icon replacements must be registered from a client component.** An
  override map is an object of functions, and a function cannot cross the
  boundary from a React Server Component, so a `<Theme>` that sits
  directly in a server layout must move into a `providers.tsx` marked
  `'use client'`.

#### New features

- **32 icons**, from `@raystack/apsara` and from
  `@raystack/apsara/icons` — all drawn by lucide, from 30 drawings
  (`ClearIcon` and `ErrorIcon` share one). These are the icons Apsara's
  own components draw: the keys you cannot reach from your own call
  sites. Prefer the subpath
  when you want icons without the component library — it reaches no
  component module, so one icon costs one icon even in CJS, where the
  root barrel eagerly requires every component.
- **`<Theme icons={{ components, props }}>`** replaces the icons inside
  Apsara's components. `components` swaps a drawing by key, `props`
  applies to every icon built with `createIcon`. Both maps are partial,
  the props at the call site still win, and a nested `<Theme>` layers on
  the one above it key by key.
- **`createIcon(key, Default)` is public.** Wrap any component with it
  and it gets the same base props, the same `data-icon`, and the same
  replaceability as Apsara's own icons.
- **`data-icon="<Key>"`** on every icon, so CSS can style one icon
  without a re-render and a test can select it.
- **New public types**: `IconName` (the union of the 32 keys, so a typo
  in an override map is a type error), `IconOptions`, `IconOverrides`,
  `IconComponent`, `IconProps`, `IconProviderProps`, and `IconProvider`
  itself.

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