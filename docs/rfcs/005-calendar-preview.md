---
ID: RFC 005
Created: August 24, 2026
Status: Draft
RFC PR: https://github.com/raystack/apsara/pull/890
---

# Calendar Rewrite: `CalendarPreview`

This RFC proposes replacing `Calendar`, `DatePicker`, and `RangePicker` with one subcomposed root, `CalendarPreview`, that owns date state and popover state explicitly and exposes every surface as a dot-notation part.

The calendar family is the only part of Apsara that never adopted the composition contract, and its recurring bugs all trace to one consequence: popover open state is private, so the pickers cannot hand dismissal to Base UI. That single fact costs 185 lines of bespoke popover machinery, two load-bearing guesses about where an event came from, and one reverted feature.

The rewrite is a breaking change with no compatibility shim. `CalendarPreview` ships alongside the current family, and the old exports are removed one release later. Scope covers single and range selection, month-year navigation, granularity (day / month / quarter / half-year / year), presets, and time-of-day.

**Target package:** `@raystack/apsara` (`packages/raystack/components/calendar-preview/`)

## Table of Contents

- [Calendar Rewrite: `CalendarPreview`](#calendar-rewrite-calendarpreview)
  - [Table of Contents](#table-of-contents)
  - [Background](#background)
    - [Current Architecture](#current-architecture)
    - [Current Problems](#current-problems)
  - [Goals and Non-Goals](#goals-and-non-goals)
  - [Proposal](#proposal)
    - [API at a Glance](#api-at-a-glance)
    - [Recipes](#recipes)
    - [Root Props](#root-props)
    - [Parts](#parts)
    - [State Ownership](#state-ownership)
    - [Field Integration](#field-integration)
    - [Conventions This Follows](#conventions-this-follows)
  - [Internal Architecture](#internal-architecture)
    - [File Layout](#file-layout)
    - [The Date Adapter](#the-date-adapter)
    - [The react-day-picker Boundary](#the-react-day-picker-boundary)
  - [Dependencies](#dependencies)
  - [The `data-slot` Contract](#the-data-slot-contract)
  - [Breaking Changes](#breaking-changes)
    - [Migration Map](#migration-map)
    - [Repo-Internal Follow-ups](#repo-internal-follow-ups)
  - [Implementation Plan](#implementation-plan)
  - [Testing](#testing)
  - [Open Items](#open-items)
  - [Alternatives](#alternatives)
  - [Helpful Links](#helpful-links)

## Background

### Current Architecture

`packages/raystack/components/calendar/` ships three flat exports across 1,071 lines of TypeScript and 345 of CSS:

| File | Lines | Role |
|---|---|---|
| `calendar.tsx` | 269 | Wraps react-day-picker's `DayPicker`; 5 component overrides, 20 `classNames` keys |
| `date-picker.tsx` | 293 | Single-date picker with a typable input |
| `range-picker.tsx` | 324 | Two-input range picker |
| `use-picker-popover.ts` | 185 | Bespoke open/close, outside-click, and dropdown carve-out |
| `calendar.module.css` | 345 | Shared styles |

The barrel exports `Calendar`, `DatePicker`, `RangePicker`, and re-exports react-day-picker's `DateRange` type directly.

### Current Problems

**The composition contract was never adopted.** `composition.md` states the rule: Apsara exports one name per component and hangs every sub-part off it as a property. The calendar family ships three flat exports with no sub-parts, and configures its internals through four mechanisms that appear nowhere else in the library:

| Mechanism | Where | What the rest of Apsara does |
|---|---|---|
| `slotProps` object bag | `DatePickerSlotProps`, `RangePickerSlotProps` | Composable sub-parts |
| `children` as a render function | the `children?: ReactNode \| ((props) => ReactNode)` union in both pickers | `render` prop |
| No `open` / `onOpenChange` — popover state is private in `use-picker-popover.ts` | both pickers pass `popover.isOpen` straight into `Popover` and expose nothing | `open` + `onOpenChange` |
| `onErrorChange` callback | `DatePickerProps.onErrorChange` | Compose inside `Field` |

Everything below follows from the third row.

**Private open state forces 185 lines of popover machinery.** Because open state never surfaces, the pickers cannot hand dismissal to Base UI. `use-picker-popover.ts`'s header comment records why: `captionLayout='dropdown'` renders Selects inside the popover and their portals look "outside" to a naive dismiss handler, and reading `isOpen` through a ref was needed to keep `onOpenChange` identity stable, because Base UI's store subscriber re-binds on identity change and looped on mount. The carve-out costs six refs: two DOM handles, two internal flags, and two mirrors of state and props kept purely so callback identities stay stable. On top of that it needs two load-bearing guesses about where an event came from, both inside its `onOpenChange` — one swallows `trigger-press` closes because Base UI's `useClick` toggles against the input's `onFocus`, the other swallows redundant re-opens — plus a handler named `handleMouseDown` registered on `'mouseup'` and an uncleaned `setTimeout`. None of it is wrong for what it is asked to do; it exists only because the component owns dismissal instead of Base UI.

**`Date` identity churn, with one effect left unguarded.** Two effects carry a `biome-ignore` for `useExhaustiveDependencies` with the same stated reason — *compare on timestamp, not Date identity* — one in `date-picker.tsx`, one in `range-picker.tsx`. A third suppression, also in `range-picker.tsx`, covers callback identity instead. A fourth effect with the same `Date` problem was never guarded at all — the `setViewMonth` effect in `date-picker.tsx`:

```tsx
useEffect(() => {
  if (popover.isOpen) {
    setViewMonth(calendarProps?.defaultMonth ?? selectedDate ?? new Date());
  }
}, [popover.isOpen, selectedDate, calendarProps?.defaultMonth]);
```

`calendarProps` is a fresh object literal on every render — `{ ...legacyCalendarProps, ...slotProps?.calendar }` — so an inline `slotProps={{ calendar: { defaultMonth: new Date(2025, 0) } }}` gives a fresh `Date` identity per render → effect refires → `setViewMonth` → re-render → loop.

**A reverted feature is still advertised.** Month/year dropdown navigation cannot be the default inside a picker: `'dropdown'` renders Apsara `Select`s whose unmount loops with "Maximum update depth", per the `captionLayout` comment in `range-picker.tsx`. The fix was never verified in a browser, and the header comment in `date-picker.runtime.test.tsx` guarding it cites a `useMemo` in `date-picker.tsx` that no longer exists — the file has zero `useMemo` calls. Meanwhile the "With Dropdowns" demo in `demo.ts` shows `captionLayout="dropdown"` on standalone `<Calendar />`, where it genuinely works, and nothing tells a reader it is unsafe *inside a picker*.

**RDP's prop union makes spread-last unsatisfiable.** `SKILL.md` requires `...props` spread last so consumers can override defaults. `Calendar` complies; the pickers structurally cannot, because `required` is the discriminator for react-day-picker's prop union and a widened value breaks the narrowing — hence `required={true}` pinned after the spread in `range-picker.tsx`. So `mode`, `selected`, `onSelect`, `required`, `month`, and `onMonthChange` are hard-overridden *after* the consumer spread. Consumers can pass them; they are silently discarded.

**Global `dayjs.extend()` is import-order dependent.** Four modules extend plugins independently — `calendar.tsx` (`utc`, `timezone`), `date-picker.tsx` (`customParseFormat`, `isSameOrAfter`, `isSameOrBefore`), and `filter-operations.tsx` in both `data-table` and `data-view` (`isSameOrAfter`, `isSameOrBefore`). `range-picker.tsx` extends nothing and relies on `calendar.tsx` having been imported first; `date-picker.tsx` accepts and forwards a `timeZone` prop but never extends `utc`/`timezone`, inheriting them only via its `./calendar` import. Plugin ordering (`timezone` depends on `utc`) is enforced by a comment. This is the exact failure class behind the P0 in `CHANGELOG.md` under 0.49.0 — a `TypeError` on every keystroke because `isSameOrAfter` was missing — and two tests exist solely to guard it.

**"Fix the start, pick the end" is not expressible.** Disabling either input gates the entire picker, and `range-picker.tsx` says so in a comment, because the range state machine rewrites both `from` and `to` regardless of which input was clicked. This is asserted as correct behaviour in tests; the docs tell you to constrain the calendar instead.

**`FilterChip` carries the cost.** It is the sole production consumer — its `DatePicker` call site in `filter-chip/filter-chip.tsx` and hits three problems at once. A consumer-passed `classNames` object **replaces** the chip's own inside `slotProps.input`, silently dropping its container class and breaking layout — objects need a deep merge, not a spread. `showCalendarIcon={false}` sits *before* the consumer spread exactly as `SKILL.md` prescribes, so a consumer can re-enable the icon and break the chip; the house rule and the component's needs are in genuine tension, and parts resolve it by making the icon something you render or don't. And the `.dateFieldWrapper` rules in `filter-chip.module.css` reach into `Input`'s hashed class names to suppress error UI the picker shouldn't be rendering at all.

**A documented integration was never built.** `CHANGELOG.md` under 0.49.0 claims `DataTable` / `DataView` columns gained a `filterProps.calendar` slot. `data-view.types.tsx` has only `filterProps?: { select?: BaseSelectProps }` — the calendar filter slot exists solely on `DataTable`, which is deprecated.

**The published types are wrong.** Both `slotProps.calendar` entries in `props.ts` type it as the full `CalendarProps`, including `mode`, `selected`, `onSelect`, and `footer`, none of which the real type accepts. `index.mdx` renders `<auto-type-table name="RangePickerProps" />` for a type that is never exported, so **consumers cannot type a `RangePicker` wrapper**. `pickerGroupClassName` is undocumented. And of the family's six deprecated props, `props.ts` documents exactly one — `DatePicker.calendarProps`, the only one carrying an `@deprecated` marker; the other five surface only as passing names inside the two `slotProps` descriptions, never as props a reader can look up.

Against the eight-item acceptance bar for a new component (the checklist closing `SKILL.md`), the family fails two: CSS carries non-token values (three `Todo: var does not exist` markers, a hardcoded `max-height: 260px`, eight hedged `var(--rs-space-10, 40px)` fallbacks), and there is no interactive `playground` in `demo.ts`. Three further house rules fail off-checklist — dot-notation composition, spread-last in the pickers, and docs matching code. The `data-slot` contract is the one genuinely clean part of this family, and the rewrite preserves it.

## Goals and Non-Goals

**Goals**

1. One export with dot-notation parts, matching `composition.md` exactly.
2. Explicit ownership of every piece of state — selection, view month, open, granularity, validity — with `value`/`onValueChange` and `open`/`onOpenChange` on the root.
3. react-day-picker fully isolated: its discriminated union never reaches a consumer, and `...props` spread-last becomes satisfiable at every part.
4. Month/year navigation works by default — the reverted `captionLayout` feature ships.
5. Cover the full feature set: day / month / quarter / half-year / year granularity, single and dual month, presets, time-of-day.
6. Zero `slotProps`. Recipes for the common case, parts for everything else.
7. Pass all eight `SKILL.md` checklist items.

**Non-goals**

- Preserving the old API. This is a rewrite; breaking changes are accepted.
- Locale/i18n expansion beyond what RDP already gives us (tracked as follow-up).
- Replacing the date library with Temporal (see [The Date Adapter](#the-date-adapter) for the seam that makes it possible later).

## Proposal

### API at a Glance

```tsx
import { CalendarPreview } from '@raystack/apsara';

// Zero-config recipe for the common case
<CalendarPreview.DatePicker value={date} onValueChange={setDate} />

// Same component, fully composed, when you need control
<CalendarPreview selection="range" value={range} onValueChange={setRange}>
  <CalendarPreview.Trigger>
    <CalendarPreview.RangeInput />
  </CalendarPreview.Trigger>
  <CalendarPreview.Content>
    <CalendarPreview.Presets>
      <CalendarPreview.Preset range={last7Days}>Last 7 days</CalendarPreview.Preset>
    </CalendarPreview.Presets>
    <CalendarPreview.Nav />
    <CalendarPreview.Grid months={2} />
    <CalendarPreview.Footer>
      <CalendarPreview.Cancel />
      <CalendarPreview.Apply />
    </CalendarPreview.Footer>
  </CalendarPreview.Content>
</CalendarPreview>
```

Full part tree:

```
<CalendarPreview>                        state owner
├── <CalendarPreview.Trigger>            anchor (render-friendly)
│   ├── <CalendarPreview.Input />          single text field
│   └── <CalendarPreview.RangeInput />     paired start/end fields
└── <CalendarPreview.Content>            portaled popover surface
    ├── <CalendarPreview.Presets>
    │   └── <CalendarPreview.Preset />
    ├── <CalendarPreview.GranularityTabs />  Day | Month | Quarter | Half-year | Year
    ├── <CalendarPreview.Nav />              caption + chevrons + month/year selects
    ├── <CalendarPreview.Grid />             the day grid (replaces `Calendar`)
    ├── <CalendarPreview.MonthGrid />        month / quarter / half-year / year grid
    ├── <CalendarPreview.TimeField />        time-of-day
    └── <CalendarPreview.Footer>
        ├── <CalendarPreview.Cancel />
        └── <CalendarPreview.Apply />
```

### Recipes

Pre-composed compositions hung off the same object. They take the root's props plus a few layout switches, and they are literally implemented as compositions of the parts above — no private code paths.

```tsx
<CalendarPreview.DatePicker     value={d} onValueChange={setD} />
<CalendarPreview.RangePicker    value={r} onValueChange={setR} />
<CalendarPreview.DateTimePicker value={d} onValueChange={setD} />
<CalendarPreview.MonthPicker    value={d} onValueChange={setD} granularity="month" />
<CalendarPreview.Inline         value={d} onValueChange={setD} />   // no popover
```

**Rule: recipes take no `slotProps` and no escape hatches.** The moment you need to change what's inside the popover, you drop to parts. That is the whole answer to the props-bag problem — there is no third state where you configure structure through props. Precedent for hanging non-part values off a root: `Dialog` carries `createHandle`, `Combobox` carries `useFilter` and `useFilteredItems`.

### Root Props

```tsx
type CalendarSelection = 'single' | 'range' | 'multiple';
type CalendarGranularity = 'day' | 'month' | 'quarter' | 'half-year' | 'year';

interface CalendarPreviewBaseProps {
  /** @defaultValue 'day' */
  granularity?: CalendarGranularity;
  /** Granularities the user may switch between. Renders `GranularityTabs` when >1. */
  granularities?: CalendarGranularity[];

  // popover state (was entirely private)
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean, details?: { reason?: string }) => void;

  // view state, independent of selection
  month?: Date;
  defaultMonth?: Date;
  onMonthChange?: (month: Date) => void;

  minDate?: Date;
  maxDate?: Date;
  isDateUnavailable?: (date: Date) => boolean;

  /** @defaultValue 'DD MMM YYYY' */
  format?: string;
  timeZone?: string;
  /** @defaultValue 0 */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;

  /**
   * `'immediate'` fires `onValueChange` on every interaction.
   * `'explicit'` buffers until `Apply` (requires a `Footer`).
   * @defaultValue 'immediate'
   */
  commit?: 'immediate' | 'explicit';

  /** Fires when the typed input's validity changes. Compose in `Field` for UI. */
  onValidityChange?: (validity: {
    valid: boolean;
    reason?: 'unparseable' | 'out-of-bounds' | 'unavailable';
  }) => void;

  disabled?: boolean;
  readOnly?: boolean;
  children?: ReactNode;
}

interface SingleProps extends CalendarPreviewBaseProps {
  selection?: 'single';
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (value: Date | null) => void;
}

interface RangeProps extends CalendarPreviewBaseProps {
  selection: 'range';
  value?: DateRangeValue | null;          // { from: Date | null; to: Date | null }
  defaultValue?: DateRangeValue | null;
  onValueChange?: (value: DateRangeValue | null) => void;
  /** Makes one endpoint read-only in both the input and the grid. */
  lock?: 'from' | 'to';
}

interface MultipleProps extends CalendarPreviewBaseProps {
  selection: 'multiple';
  value?: Date[];
  defaultValue?: Date[];
  onValueChange?: (value: Date[]) => void;
  maxSelected?: number;
}
```

Notes on specific choices:

- **`onValueChange`, not `onSelect`.** Matches `Select`, `Combobox`, and `Accordion`. Today `onSelect` fires mid-interaction with a half-built range, so the docs have to tell consumers to gate on `range.to`. The new callback still fires on each step under `commit='immediate'`, but the value shape is always a complete `DateRangeValue` with explicit `null`s — no "is this partial?" inference at the call site.
- **`DateRangeValue` is ours**, not RDP's `DateRange`, which currently leaks through the public barrel.
- **`commit`** is what makes a footer-with-actions layout expressible. Today `footer` is a bare `ReactNode` with no way to write back into state, which is why presets are unimplementable.
- **`isDateUnavailable`** replaces RDP's `disabled` matcher for the common predicate case, so consumers needn't learn RDP's matcher DSL. RDP matchers stay reachable on `Grid`.
- **`onValidityChange`** replaces `onErrorChange`. The component still renders no error UI — `Field` does — but the payload is a state object rather than a stringly-typed message, and it reports *why*.
- **`lock`** lives on `RangeProps` only. It makes the named endpoint read-only in both input and grid, closing the partial-disable gate in `range-picker.tsx`.

### Parts

| Part | Element | Purpose | Key props |
|---|---|---|---|
| `.Trigger` | `div` | Anchors the popover. Never renders a `<button>`. | `render` |
| `.Input` | Apsara `Input` | Typed single-date field. Owns parse/format. | `Input` props minus `value`/`onChange` |
| `.RangeInput` | `Flex` of two `Input`s | Paired fields. | `startProps`, `endProps` — both full `Input` props |
| `.Content` | Base UI `Popover.Popup` | Portaled surface. | `Popover.Content` props |
| `.Nav` | `div` | Caption + chevrons + month/year `Select`s. **Ours, not RDP's.** | `layout?: 'label' \| 'select'`, `align?: 'start' \| 'end'` |
| `.Grid` | RDP `DayPicker` | The day grid. | `months?: 1 \| 2`, `showOutsideDays`, `showWeekNumber`, `modifiers`, `dayProps` |
| `.MonthGrid` | `div` | Month / quarter / half-year / year cells. | inherits root `granularity` |
| `.GranularityTabs` | Apsara `Tabs` | Day \| Month \| Quarter \| Half-year \| Year. | renders only when `granularities.length > 1` |
| `.Presets` | `div` | Preset column/row. | `orientation?: 'vertical' \| 'horizontal'` |
| `.Preset` | `button` | One preset. Writes into root state. | `value` / `range`, `render` |
| `.TimeField` | Apsara `Input`s | Hour/minute (+ meridiem). | `step`, `hourCycle?: 12 \| 24` |
| `.Footer` | `Flex` | Action row. | — |
| `.Apply` / `.Cancel` | Apsara `Button` | Commit / discard buffered value. | `render` |

Two parts carry the load of this rewrite:

**`.Nav` is ours, not RDP's `components.Dropdown`.** This is the concrete fix for the reverted `captionLayout` feature. Today the loop happens because RDP mounts and unmounts Apsara `Select`s inside the popover through its `components.Dropdown` override. If `.Nav` is a sibling of the grid and we drive `month` ourselves, RDP runs with `hideNavigation` and `captionLayout='label'`, never mounts a `Select`, and the unmount ref-cleanup path is simply not entered. Month/year navigation becomes default-on, and `use-picker-popover.ts`'s reason for existing disappears with it.

**`.Grid` is the only part that touches RDP, and it never forwards the union.** `months`, `showOutsideDays`, `showWeekNumber`, and `modifiers` are ours; `mode`, `selected`, `onSelect`, `required`, `month`, and `onMonthChange` are derived from root context and are not in `GridProps` at all. Because nothing is force-overridden after a consumer spread, spread-last holds — satisfying the spread-last rule for the first time in this family.

### State Ownership

| State | Owner | Consumer access |
|---|---|---|
| Selected value | Root, via `useControlled` | `value` / `defaultValue` / `onValueChange` |
| Buffered value (`commit='explicit'`) | Root, internal | `.Apply` / `.Cancel` |
| Popover open | Root, via `useControlled` | `open` / `defaultOpen` / `onOpenChange` |
| Visible month | Root, via `useControlled` | `month` / `defaultMonth` / `onMonthChange` |
| Granularity | Root, via `useControlled` | `granularity` / `granularities` |
| Active range field (`from` \| `to`) | Root, internal | `.RangeInput` reads it from context |
| Typed-input text and validity | `.Input` / `.RangeInput` | `onValidityChange` on root |
| Focus and dismissal | Base UI `Popover` | — |

The last row is the point of the exercise: **`use-picker-popover.ts` is deleted entirely.** Its three stated reasons all dissolve — the portal carve-out, because `.Nav` renders the `Select`s outside the grid so RDP never mounts one in the popover; the `onOpenChange` identity churn, because `useControlled` returns a setter that is stable by construction; and the `trigger-press` double-fire, but only if we do not re-create the race. Today the input's `onFocus` opens the popover while Base UI's `useClick` toggles it, and the two fight. In the rewrite, opening is owned exclusively by `.Trigger` and `.Input` never calls `setOpen` from a focus handler. If focus-to-open comes back, it arrives as a Base UI trigger option, not a competing handler — that is the lesson of the 185 lines.

### Field Integration

`CalendarPreview.Input` calls the non-throwing `useFieldContext()` exactly as `Input` does in `input/input.tsx`, so `required` and `aria-invalid` wire up by composition:

```tsx
<Field name="starts">
  <Field.Label>Starts</Field.Label>
  <CalendarPreview.DatePicker value={d} onValueChange={setD} />
  <Field.Error />
</Field>
```

This replaces the `onErrorChange` → lift-into-`Field.error` dance the current docs prescribe, and removes the need for `FilterChip`'s hashed-class CSS hack.

### Conventions This Follows

Every rule below is an existing pattern in the library, not an invention.

| Convention | Canonical source |
|---|---|
| `Object.assign(Root, { … })`; no namespace literals | Every dot-notation component in the library, no exceptions — e.g. `select/select.tsx`, `tabs/tabs.tsx` |
| Root `displayName` is the bare name; parts are `'Root.Part'` | `SelectRoot.displayName = 'Select'`, `TabsList.displayName = 'Tabs.List'` |
| Plain function components, `ref` as a prop, no `forwardRef` | `SKILL.md` |
| Base UI `render` prop, never `asChild`; `useRender` + `mergeProps` for plain-DOM parts | `composition.md`; `useRender` in `sidebar/sidebar-item.tsx` |
| `useControlled` from `@base-ui/utils/useControlled` | `useControlled` in `tour/tour-root.tsx` |
| `part`-aware throwing context hook, generic value stored as `unknown` and cast at the hook | `useChatPanelContext(part)`; `ComboboxContextValue<unknown>` in `combobox/combobox-root.tsx` |
| `<Ctx value={…}>` (React 19), not `<Ctx.Provider>` | `<SidebarPopupContext value={…}>` in `sidebar/sidebar-root.tsx` |
| Discriminated union for single-vs-multiple | `SelectRootProps = SingleSelectProps \| MultipleSelectProps` |
| `data-slot` before the spread, on every rendered element | `SKILL.md` |
| Non-throwing `useFieldContext()` for opt-in `Field` integration | `field/use-field-context.tsx` |

Two deliberate departures from what the old calendar did: **no `slotProps`** (nothing else in Apsara configures a popover through a props bag), and **`render` instead of `children`-as-function** (`composition.md` is explicit, and the picker's `children?: ReactNode | ((props) => ReactNode)` exists nowhere else in the library).

## Internal Architecture

### File Layout

Per the file-layout convention in `SKILL.md`:

```
packages/raystack/components/calendar-preview/
├── index.tsx                      # re-export only
├── calendar-preview.tsx           # Object.assign composition
├── calendar-preview-root.tsx      # state, context provider
├── calendar-preview-context.tsx   # part-aware throwing hook
├── calendar-preview-trigger.tsx
├── calendar-preview-input.tsx     # Input + RangeInput
├── calendar-preview-content.tsx
├── calendar-preview-nav.tsx
├── calendar-preview-grid.tsx      # the ONLY file importing react-day-picker
├── calendar-preview-month-grid.tsx
├── calendar-preview-presets.tsx
├── calendar-preview-time-field.tsx
├── calendar-preview-footer.tsx
├── recipes.tsx                    # DatePicker / RangePicker / DateTimePicker / MonthPicker / Inline
├── date-adapter.ts                # ALL date-library plugin setup lives here
├── calendar-preview.module.css
└── __tests__/
    ├── calendar-preview.test.tsx
    ├── recipes.test.tsx
    ├── granularity.test.tsx
    └── data-slots.test.tsx
```

Context follows the newest house form: a `part`-aware hook that throws with the offending part name (`useChatPanelContext` in `chat-panel/chat-panel-context.tsx`), with the value type stored as `unknown` and cast at the hook boundary (the `Combobox` technique) so the root can stay generic over selection mode without a generic `createContext`.

### The Date Adapter

One module, three jobs. Shown with dayjs to match today's code; see [Dependencies](#dependencies) for why date-fns is the likely implementation.

```ts
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

// `timezone` depends on `utc` — ordering enforced here, once, not by comment.
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export function dayKey(date: Date): string;   // 'YYYY-MM-DD'
export function epoch(date: Date): number;
```

1. **Import-order dependence goes away.** Every module that needs a date operation imports from here, so the plugin set is a single fact in a single place and the 0.49.0 `TypeError` failure class becomes impossible. Both `filter-operations.tsx` modules migrate onto it.
2. **`Date` identity churn goes away internally.** All internal comparisons, memo keys, and effect dependencies use `dayKey()` or `epoch()`. The public API stays `Date`, so migration is mechanical — but the three `biome-ignore`s and the unguarded loop have nowhere left to live.
3. **The date library becomes swappable.** The exported surface is identical whichever library backs it, so the decision is reversible in one file.

### The react-day-picker Boundary

RDP still earns its place for the day grid: roving-tabindex keyboard navigation, week construction, outside days, locale-aware weekday order, and range modifier maths are all solved and tested there, and rebuilding them carries real a11y regression risk.

What changes is the boundary. Today RDP's props *are* the public API (`CalendarProps = DayPickerProps & OnDropdownOpen & CalendarPropsExtended`), which is why its union leaks and why the `CalendarProps` block in `props.ts` is a hand-maintained mirror of RDP's props that has already drifted. In the rewrite RDP lives behind `calendar-preview-grid.tsx` only, driven by derived props, with `hideNavigation` and `captionLayout='label'` set so it never mounts a `Select`.

## Dependencies

Verified against the npm registry and `pnpm-lock.yaml` on 24 Aug 2026.

| Package | Manifest range | Lockfile resolves to | Latest published |
|---|---|---|---|
| `react-day-picker` | `^9.6.7` | **9.6.7** | **10.0.1** |
| `@base-ui/react` | `~1.6.0` | 1.6.0 | 1.7.0 |
| `@base-ui/utils` | `~0.3.1` | 0.3.1 | 0.3.2 |
| `dayjs` | `^1.11.20` | 1.11.20 | 1.11.23 |

**RDP is two majors behind, and v10 does not change the union.** Diffing the 9.6.7 and 10.0.1 tarballs: `types/selection.d.ts` gained only JSDoc, so the conditionals that force `required` after the spread are structurally unchanged. All 41 `UI` values, all 20 `classNames` keys we set, and all 5 `components` overrides we supply survive. v10 drops 16 v8-era props and four unused `CustomComponents` entries, none of which `packages/raystack` references. The upgrade is a clean, separate PR that this rewrite neither needs nor blocks.

**date-fns is already in the tree, twice over.** `react-day-picker@9.6.7` declares `date-fns`, `@date-fns/tz`, and `date-fns-jalali` as hard dependencies, and `@base-ui/react@1.6.0` lists `date-fns` and `@date-fns/tz` as optional peers — already satisfied in this install by RDP. So we ship date-fns unconditionally and then *additionally* install and plugin-extend dayjs. Building `date-adapter.ts` on date-fns means one date implementation shared with the grid and with Base UI, at no install cost — subject to a measured bundle check in phase 1.

**Base UI has no date primitive yet.** Neither 1.6.0 nor 1.7.0 exposes a `Calendar`, `DatePicker`, or `TimePicker`, but both ship `./internals/temporal` plus date-fns and Luxon adapters — an interface of `now`, `date`, `parse`, `setTimezone`, `isSameDay`, `startOfMonth`, `addMonths`, `getYear`, and friends. Shaping `date-adapter.ts` to that method surface makes adopting Base UI's primitives later a swap inside one file rather than a third rewrite.

## The `data-slot` Contract

`SKILL.md` makes slot names semver-covered public API. The current 23 slots are the cleanest part of this component. All 23 survive under a `calendar-preview-` prefix. Most renames just extend the prefix (`calendar-day` → `calendar-preview-day`); these change it:

| Old slot | New slot |
|---|---|
| `calendar` | `calendar-preview-grid` |
| `calendar-dropdown` | `calendar-preview-nav-month` |
| `calendar-dropdown-content` | `calendar-preview-nav-year` |
| `calendar-month-grid` | `calendar-preview-weeks` |
| `calendar-grid-table` | `calendar-preview-table` |
| `calendar-grid-skeleton` | `calendar-preview-skeleton` |
| `date-picker-trigger`, `range-picker-trigger` | `calendar-preview-trigger` |
| `date-picker-positioner`, `range-picker-positioner` | `calendar-preview-positioner` |
| `date-picker-content`, `range-picker-content` | `calendar-preview-content` |
| `date-picker-input` | `calendar-preview-input` |
| `range-picker-footer` | `calendar-preview-footer` |
| `range-picker-trigger-group` | `calendar-preview-range-inputs` |
| `range-picker-start-input` | `calendar-preview-input-start` |
| `range-picker-end-input` | `calendar-preview-input-end` |

New slots: `calendar-preview-presets`, `-preset`, `-granularity`, `-month-grid`, `-month-cell`, `-time-field`, `-apply`, `-cancel`, `-nav-caption`.

Because `CalendarPreview` is a new component name this is purely additive — the old slots keep working for as long as the old family ships.

## Breaking Changes

Yes, and accepted. No compatibility shim ships. The new component lands alongside the old family; the old exports are deleted one release after the new docs land.

### Migration Map

Mechanical throughout, which makes most of it codemod-able.

| Today | Rewrite |
|---|---|
| `<Calendar mode="single" selected={d} onSelect={setD} />` | `<CalendarPreview.Inline value={d} onValueChange={setD} />` |
| `<Calendar mode="range" … />` | `<CalendarPreview.Inline selection="range" … />` |
| `<DatePicker value={d} onSelect={setD} />` | `<CalendarPreview.DatePicker value={d} onValueChange={setD} />` |
| `<RangePicker value={r} onSelect={setR} />` | `<CalendarPreview.RangePicker value={r} onValueChange={setR} />` |
| `dateFormat="DD/MM/YYYY"` | `format="DD/MM/YYYY"` |
| `slotProps.input={…}` | `<CalendarPreview.Input {…} />` |
| `slotProps.startInput` / `endInput` | `<CalendarPreview.RangeInput startProps={…} endProps={…} />` |
| `slotProps.popover={…}` | `<CalendarPreview.Content {…} />` |
| `slotProps.calendar={…}` | `<CalendarPreview.Grid {…} />` + root `month` / `minDate` / `maxDate` |
| `inputProps` / `inputsProps` / `calendarProps` / `popoverProps` (deprecated) | removed — the deprecation window closes here |
| `calendarProps.startMonth` / `endMonth` | root `minDate` / `maxDate` |
| `calendarProps.captionLayout="dropdown"` | default; opt *out* with `<CalendarPreview.Nav layout="label" />` |
| `children={({ selectedDate }) => …}` | `<CalendarPreview.Trigger render={…} />` |
| `footer={<Presets />}` | `<CalendarPreview.Presets>` + `<CalendarPreview.Footer>` |
| `onErrorChange={fn}` | `onValidityChange={fn}`, or compose in `Field` |
| `pickerGroupClassName` | `className` on `.RangeInput` |
| `DateRange` from `react-day-picker` | `DateRangeValue` from `@raystack/apsara` |
| whole-picker disable via one input | `lock="from"` / `lock="to"` |

### Repo-Internal Follow-ups

These land with the rewrite, not after it.

1. **`FilterChip`** — rewrite to compose parts. Deletes `toDateValue()`, the shallow `slotProps.input` merge, and the hashed-class CSS.
2. **`DataView`** — add the `filterProps.calendar` slot that `CHANGELOG.md` (0.49.0) already claims exists. This is the going-forward surface; `DataTable` is deprecated.
3. **`data-table` / `data-view` filter-operations** — migrate off local `dayjs.extend()` onto `date-adapter.ts`.

## Implementation Plan

| Phase | Content | Exit criteria |
|---|---|---|
| **1. Foundation** | `date-adapter.ts` (incl. the date-fns-vs-dayjs bundle measurement), context, root, `Trigger`, `Content`, `Grid` | `<CalendarPreview.Inline />` renders; `data-slots.test.tsx` green |
| **2. Inputs and recipes** | `Input`, `RangeInput`, `Nav`, `DatePicker` / `RangePicker` / `Inline` recipes | Parity with today's behaviour, including the whole `date-picker.test.tsx` regression suite ported |
| **3. New surfaces** | `Presets`, `Footer`, `Apply`/`Cancel`, `commit='explicit'`, `GranularityTabs`, `MonthGrid`, `TimeField`, `DateTimePicker` / `MonthPicker` | Granularity switching and the month/quarter/half-year/year grids work |
| **4. Integrations** | `FilterChip` rewrite, `DataView` calendar filter slot, `filter-operations` on the adapter | No `slotProps` merge, no hashed-class CSS |
| **5. Docs and ship** | `index.mdx` + `demo.ts` **with an interactive `playground`** + `props.ts`; CHANGELOG entry | All eight `SKILL.md` checklist items pass |
| **6. Removal** | Delete `components/calendar/`, drop the old exports | One release after phase 5 |

Two dependency PRs are independent of the above and can land in parallel: `@base-ui/react` → `~1.7.0` and `react-day-picker` → `~10.0.1`. Neither is a prerequisite.

## Testing

The eight `SKILL.md` checklist items, plus the four this rewrite exists to fix.

- [ ] Builds clean; `pnpm --filter @raystack/apsara test components/calendar-preview` green
- [ ] Docs site builds; new page generated
- [ ] `displayName` on every part (`'CalendarPreview'`, `'CalendarPreview.Grid'`, …)
- [ ] `data-slot` on every rendered element, covered by `data-slots.test.tsx` (portaled parts asserted against `document.body`)
- [ ] CSS uses `--rs-*` tokens only — **zero** `Todo: var does not exist`
- [ ] Alphabetical export in `packages/raystack/index.tsx`; interactive `playground` in `demo.ts`
- [ ] **Zero `biome-ignore`** in the new component
- [ ] **Zero `slotProps`**; every part spreads `...props` last
- [ ] `open` / `onOpenChange` on the root; `use-picker-popover.ts` deleted
- [ ] Month/year navigation on by default, verified **in a real browser** — jsdom is what let the `captionLayout` regression through the first time
- [ ] Every regression test in the current `__tests__/` ported, or explicitly retired with a stated reason

## Open Items

1. **`quarter` / `half-year` value shape.** *(Decide before phase 1 — it shapes the type union.)* What does `onValueChange` emit for "Q2 2026": the first day of the period, or a `{ from, to }` range? A range is more truthful and composes with `selection='range'`, but it means `granularity !== 'day'` changes the value *shape*.
2. **Name.** Does `CalendarPreview` graduate to `Calendar` at phase 6? "Preview" is honest for phases 1–4 and wrong once it is the only calendar. Proposal: keep the name while both exist, then rename at phase 6 with `CalendarPreview` kept as a deprecated alias for one release. This blocks phase 5, because slot names embed the prefix and renaming them later is itself breaking.
3. **`commit` default for ranges.** `'immediate'` matches today, but a footer with Apply/Cancel implies `'explicit'` is the intended pattern for ranges. Should `selection='range'` default to it?
4. **Presets as data or children?** `<CalendarPreview.Preset>` children is more composable; `presets={[…]}` on the recipes is less typing. Both precedents exist in-repo (`Combobox` takes items as children, `DataTable` takes columns as data). The recipe signatures above omit `presets` until this is settled.
5. **Time zones.** Does the rewrite own tz conversion end-to-end, or stay the pass-through it is today?
6. **`multiple` selection.** No current consumer needs it. Ship it, or cut it from v1 and keep the union two-armed?
7. **Announcing the break.** There is no changesets setup in the repo, and `packages/raystack/package.json` reads `0.48.0` while `CHANGELOG.md` already reads `0.49.0`. A `data-slot` rename currently has nothing but reviewer vigilance behind it. Introduce changesets with this work, or keep hand-written prose?

## Alternatives

**Patch the existing components again.** Rejected. PR #819 was already "a coordinated overhaul … 18 P0/P1 bugs fixed", and the family has needed three more fixes since. Every theme in that changelog is a *contract* problem — who owns state, error presentation, `mode`, open/close — not a rendering problem, and patches cannot supply a missing contract.

**Upgrade react-day-picker to v10 instead.** Rejected; different problem. The `mode`/`required` union is structurally unchanged from 9.6.7 through 10.0.1 (verified against the tarballs). The upgrade is worth taking on its own merits and should ship as its own PR, but waiting for upstream is not a plan.

**Own the day grid, drop react-day-picker.** Tempting — spread-last becomes trivially true and the union disappears entirely. Rejected for v1 on risk: roving tabindex, locale weekday order, week numbering, and range modifier maths all become ours, and a11y regressions in a date grid are expensive. The boundary above gets most of the benefit; revisit if it proves leaky.

**Build on a Base UI date primitive.** Not available — verified, no date component at 1.6.0 or 1.7.0. `date-adapter.ts` is shaped to their `internals/temporal` surface so we can adopt them without a third rewrite.

**Keep the flat exports, just fix internals.** Rejected. It leaves `composition.md`'s dot-notation rule violated, keeps `slotProps`, and keeps open state private — which keeps the custom popover hook, which keeps the whole causal chain.

**ISO day strings (`'2026-04-17'`) in the public API.** Genuinely attractive: it kills timezone ambiguity and identity churn outright and serialises cleanly to URLs and forms. Rejected for v1 because it breaks every call site including `FilterChip` and `DataTable`'s filter types, and the migration stops being mechanical. `date-adapter.ts` captures the internal benefit without the external cost; worth reconsidering for a future major.

## Helpful Links

- [Calendar docs page](https://apsara.raystack.org/docs/components/calendar)
- [PR #819 — the coordinated calendar overhaul](https://github.com/raystack/apsara/pull/819)
- [react-day-picker v10 release notes](https://daypicker.dev/)
- In-repo conventions: `.agents/skills/apsara/references/composition.md`, `.agents/skills/add-new-component/SKILL.md`
