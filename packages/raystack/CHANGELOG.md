# @raystack/apsara

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