---
ID: RFC 005
Created: August 24, 2026
Status: Draft
RFC PR: https://github.com/raystack/apsara/pull/890
---

# Calendar Rewrite: `CalendarPreview`

This RFC proposes replacing `Calendar`, `DatePicker`, and `RangePicker` with a single subcomposed root, `CalendarPreview`, that owns date state and popover state explicitly and exposes every surface as a dot-notation part. The calendar family is the only part of Apsara that never adopted the composition contract; every recurring bug in it is downstream of that. Because open state is private, the pickers cannot use Base UI's dismissal, which forces 185 lines of bespoke popover machinery, two event-provenance guesses, three lint suppressions, and one reverted feature.

The rewrite is a breaking change with no compatibility shim. `CalendarPreview` ships alongside the current family and the old exports are removed one release later. Scope covers the full Figma surface — day/range selection, month-year navigation, granularity (day / month / quarter / half-year / year), presets, and time-of-day — because all of it is greenfield with no prior work to reconcile.

**Target package:** `@raystack/apsara` (`packages/raystack/components/calendar-preview/`)
**Verification:** every file/line citation below was checked against the branch point.

## Table of Contents

- [Calendar Rewrite: `CalendarPreview`](#calendar-rewrite-calendarpreview)
  - [Table of Contents](#table-of-contents)
  - [Background](#background)
    - [Current Architecture](#current-architecture)
    - [Current Problems](#current-problems)
      - [1. The composition contract was never adopted](#1-the-composition-contract-was-never-adopted)
      - [2. The causal chain: private open state to event guesses](#2-the-causal-chain-private-open-state-to-event-guesses)
      - [3. `Date` identity, and one unguarded effect](#3-date-identity-and-one-unguarded-effect)
      - [4. A reverted feature that is still advertised](#4-a-reverted-feature-that-is-still-advertised)
      - [5. RDP's prop union makes spread-last unsatisfiable](#5-rdps-prop-union-makes-spread-last-unsatisfiable)
      - [6. Global `dayjs.extend()` is import-order dependent](#6-global-dayjsextend-is-import-order-dependent)
      - [7. Capability loss shipped as intended behaviour](#7-capability-loss-shipped-as-intended-behaviour)
      - [8. Consumers and docs have drifted](#8-consumers-and-docs-have-drifted)
    - [Scorecard](#scorecard)
  - [Goals and Non-Goals](#goals-and-non-goals)
  - [Proposal](#proposal)
    - [API at a Glance](#api-at-a-glance)
    - [Recipes](#recipes)
    - [Root Props](#root-props)
    - [Parts](#parts)
    - [State Ownership](#state-ownership)
    - [Locking One End of a Range](#locking-one-end-of-a-range)
    - [Field Integration](#field-integration)
    - [Conventions This Follows](#conventions-this-follows)
  - [Internal Architecture](#internal-architecture)
    - [File Layout](#file-layout)
    - [Context](#context)
    - [The Date Adapter](#the-date-adapter)
    - [The react-day-picker Boundary](#the-react-day-picker-boundary)
  - [Dependencies](#dependencies)
  - [The `data-slot` Contract](#the-data-slot-contract)
  - [Design Blockers](#design-blockers)
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

The barrel (`components/calendar/index.tsx`, 6 lines) exports `Calendar`, `DatePicker`, `RangePicker`, and re-exports react-day-picker's `DateRange` type directly.

### Current Problems

#### 1. The composition contract was never adopted

`.agents/skills/apsara/references/composition.md:7` states the rule:

> Apsara exports **one name per component** and hangs every sub-part off it as a property.

The calendar family ships three flat exports with no sub-parts, and configures its internals through four mechanisms that appear nowhere else in the library:

| Mechanism | Where | What the rest of Apsara does |
|---|---|---|
| `slotProps` object bag | `date-picker.tsx:30-34`, `range-picker.tsx:24-29` | Composable sub-parts (`composition.md:7,29`) |
| `children` as a render function | `date-picker.tsx:61-63`, `range-picker.tsx:48-50` | `render` prop (`composition.md:43`) |
| No `open` / `onOpenChange` — popover state is private inside `use-picker-popover.ts` | `date-picker.tsx:257-263`, `range-picker.tsx:266-272` | `open` + `onOpenChange` (`composition.md:59`) |
| `onErrorChange` callback | `date-picker.tsx:58` | Compose inside `Field` |

Everything below follows from the third row.

#### 2. The causal chain: private open state to event guesses

Because open state never surfaces, the pickers cannot hand dismissal to Base UI. `use-picker-popover.ts:39-46` records why:

> Why custom instead of Base UI's dismissal: Calendar's `captionLayout='dropdown'` renders Selects inside the popover; their portals look "outside" to a naive dismiss handler. […] `onOpenChange` reads `isOpen` via ref so its identity stays stable — Base UI's store subscriber re-binds on identity change, which caused an updateStoreInstance loop on mount.

That single carve-out costs 185 lines containing:

- **Six refs, four of which shadow state or props** (`:56`, `:62`, `:65`, `:71`) purely to keep callback identities stable.
- **Two event-provenance guesses**, both load-bearing (`:141-167`): one swallows `trigger-press` closes because Base UI's `useClick` toggles against the input's `onFocus` (`:158`), one swallows redundant re-opens (`:165`).
- **A handler named `handleMouseDown` registered on `'mouseup'`** (`:84-94`).
- **An uncleaned `setTimeout`** (`:136`).

None of this is wrong for what it is asked to do. It exists only because the portal carve-out exists, and the carve-out exists only because the component owns dismissal instead of Base UI.

#### 3. `Date` identity, and one unguarded effect

Three effects suppress `useExhaustiveDependencies` because `Date` compares by identity: `date-picker.tsx:109`, `range-picker.tsx:105`, `range-picker.tsx:129`. A fourth instance of the same pattern is **not** guarded — `date-picker.tsx:151-155`:

```tsx
useEffect(() => {
  if (popover.isOpen) {
    setViewMonth(calendarProps?.defaultMonth ?? selectedDate ?? new Date());
  }
}, [popover.isOpen, selectedDate, calendarProps?.defaultMonth]);
```

`calendarProps` is rebuilt on every render (`date-picker.tsx:84`). A consumer writing `slotProps={{ calendar: { defaultMonth: new Date(2025, 0) } }}` inline gets a fresh `Date` identity per render → effect refires → `setViewMonth` → re-render → loop. Its sibling effects were hardened against exactly this; this one was missed.

#### 4. A reverted feature that is still advertised

Month/year dropdown navigation cannot be the default inside a picker. `range-picker.tsx:286-290`:

> No `captionLayout` default — 'dropdown' renders Apsara Selects inside the popover whose unmount loops ("Maximum update depth"). Consumers can opt in via `calendarProps.captionLayout`.

The fix has never been verified in a browser — `date-picker.runtime.test.tsx:44-49`:

> Passes in jsdom after the value-default useMemo + stable onOpenChange fixes. Real-browser verification still recommended before re-enabling `captionLayout='dropdown'` as the default.

That comment cites a `useMemo` in `date-picker.tsx` that no longer exists — the file contains zero `useMemo` calls. The guard has drifted from the mechanism it guards.

The docs compound this by omission rather than by error: `demo.ts:41-47` shows `captionLayout="dropdown"` on standalone `<Calendar />`, where it genuinely works. Nothing anywhere tells a reader it is unsafe *inside a picker*.

#### 5. RDP's prop union makes spread-last unsatisfiable

`.agents/skills/add-new-component/SKILL.md:75` requires "Spread `...props` last so consumers can override defaults." `Calendar` itself complies (`calendar.tsx:264`). The pickers structurally cannot — `range-picker.tsx:296-299`:

> Must stay after spread: `required` is the discriminator for RDP's prop union, and a widened value would break the narrowing.

So `mode`, `selected`, `onSelect`, `required`, `month`, and `onMonthChange` are all hard-overridden *after* the consumer spread (`date-picker.tsx:277-285`, `range-picker.tsx:294-306`). Consumers can pass them; they are silently discarded.

#### 6. Global `dayjs.extend()` is import-order dependent

Four modules extend plugins independently:

| File | Plugins |
|---|---|
| `calendar/calendar.tsx:18-19` | `utc`, `timezone` |
| `calendar/date-picker.tsx:19-21` | `customParseFormat`, `isSameOrAfter`, `isSameOrBefore` |
| `data-table/utils/filter-operations.tsx:22-23` | `isSameOrAfter`, `isSameOrBefore` |
| `data-view/utils/filter-operations.tsx:22-23` | `isSameOrAfter`, `isSameOrBefore` |

`range-picker.tsx` extends **nothing** and relies on `calendar.tsx` having been imported first. `date-picker.tsx` accepts and forwards a `timeZone` prop (`:65`, `:279`) but never extends `utc`/`timezone`; it inherits them only because line 15 imports `./calendar`. Plugin ordering (`timezone` depends on `utc`) is enforced by a comment at `calendar.tsx:17`.

This is the exact failure class behind the P0 at `CHANGELOG.md:33-35` — a `TypeError` on every keystroke because `isSameOrAfter` was missing — and two tests exist solely to guard it (`date-picker.test.tsx:656-698`).

#### 7. Capability loss shipped as intended behaviour

`range-picker.tsx:88-94`: disabling either input gates the entire picker, because the range state machine rewrites both `from` and `to` regardless of which input was clicked. This is asserted as correct at `range-picker.test.tsx:406` and `:421`. "Fix the start, let the user pick the end" is not expressible; the docs tell you to constrain the calendar instead.

#### 8. Consumers and docs have drifted

**`FilterChip` is the sole production consumer** (`filter-chip/filter-chip.tsx:183-195`) and carries three problems:

- Inside `slotProps.input`, the chip sets `classNames: { container: styles.dateField }` and then spreads `...calendarProps?.slotProps?.input` (`:190-193`). A consumer passing any `classNames` object **replaces** the chip's, silently dropping its own container class and breaking the layout. Objects need a deep merge here, not a spread.
- `showCalendarIcon={false}` sits *before* the consumer spread (`:184-185`). That is exactly what `SKILL.md:75` prescribes, and the consequence is that a consumer can re-enable the icon and break the chip. The house rule and the component's needs are in genuine tension; parts resolve it by making the icon a part you either render or don't.
- `filter-chip.module.css:226-232` reaches into `Input`'s hashed class names via `[class*="helper-text"]` and `[class*="input-error-wrapper"]`, which breaks silently if `Input` renames a class. It exists only to suppress error UI the picker shouldn't be rendering.

**A documented integration was never built.** `CHANGELOG.md:95-96` claims "`DataTable` / `DataView` columns gain a parallel `filterProps.calendar` slot". `data-view.types.tsx:83-85` has only `filterProps?: { select?: BaseSelectProps }`, and `data-view/components/filters.tsx:161` forwards `selectProps` and no calendar props. The calendar filter slot exists only on `DataTable`, which is deprecated.

**Type and doc drift:**

- `props.ts:175` and `props.ts:232` type `slotProps.calendar` as the full documented `CalendarProps`, including `mode` (`:44`), `selected` (`:47`), `onSelect` (`:50`), and `footer` (`:124`). The real type is `Omit<PropsBase, 'mode'> & CalendarPropsExtended` (`date-picker.tsx:28`), which excludes all four. That `Omit` is also vacuous — `mode` isn't in `PropsBase`, as the source comment at `date-picker.tsx:23-27` admits.
- `index.mdx:44` renders `<auto-type-table name="RangePickerProps" />`, but `RangePickerProps` and `RangePickerSlotProps` are declared without `export` (`range-picker.tsx:31`, `:24`) and appear in neither barrel. **Consumers cannot type a `RangePicker` wrapper.** (`DatePickerProps` *is* exported, which is why `FilterChip` can `Omit` from it.)
- `pickerGroupClassName` exists (`range-picker.tsx:45`) and is undocumented.
- Deprecations are documented inconsistently: `props.ts:262` marks only `DatePicker.calendarProps`, omitting `inputProps` and `popoverProps`; none of `RangePicker`'s three deprecated props appear in `props.ts` at all.
- `index.mdx:56-80` documents 23 slots; §[The `data-slot` Contract](#the-data-slot-contract) maps all of them.

### Scorecard

`SKILL.md:501-509` is the eight-item acceptance bar for a new component. The current family fails **two**:

| Checklist item | Status |
|---|---|
| Component builds without errors | Pass |
| All tests pass | Pass |
| Docs site builds, page generated | Pass |
| `displayName` on all sub-components | Pass |
| `data-slot` on every element + `data-slots.test.tsx` | Pass — 23 slots, well covered |
| Alphabetical export in `index.tsx` | Pass |
| CSS uses `--rs-*` tokens only | **Fail** — see below |
| Interactive `playground` in `demo.ts` | **Fail** — no `playground` export; `index.mdx` imports six demos, none of them a playground |

CSS detail: three `/* Todo: var does not exist */` markers (`calendar.module.css:6`, `:30`, `:189`), a hardcoded `max-height: 260px` (`:211`), a stray `gap: 0px` (`:282`), and eight `var(--rs-space-10, 40px)` hedged fallbacks (`:73`, `:74`, `:92`, `:93`, `:112`, `:113`, `:169`, `:170`). `SKILL.md:507` admits no hardcoded values.

Three further house rules — not on the checklist, but the reason this RFC exists — also fail: dot-notation composition (`composition.md:7,29`), spread-`...props`-last in the pickers (`SKILL.md:75`), and docs matching the code. The slot contract is the one genuinely clean part of this family, and the rewrite preserves it.

## Goals and Non-Goals

**Goals**

1. One export, dot-notation parts, matching `composition.md` exactly.
2. Explicit ownership of every piece of state — selection, view month, open, granularity, validity — with `value`/`onValueChange` and `open`/`onOpenChange` on the root.
3. react-day-picker fully isolated: its discriminated union never reaches a consumer, and `...props` spread-last becomes satisfiable at every part.
4. Month/year navigation works by default — the reverted `captionLayout` feature ships.
5. Cover the full Figma surface: day / month / quarter / half-year / year granularity, single and dual month, presets, time-of-day.
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

Pre-composed compositions hung off the same object. They accept the root's props plus a small set of layout switches, and they are *literally* implemented as compositions of the parts above — no private code paths.

```tsx
<CalendarPreview.DatePicker     value={d} onValueChange={setD} />
<CalendarPreview.RangePicker    value={r} onValueChange={setR} />
<CalendarPreview.DateTimePicker value={d} onValueChange={setD} />
<CalendarPreview.MonthPicker    value={d} onValueChange={setD} granularity="month" />
<CalendarPreview.Inline         value={d} onValueChange={setD} />   // no popover
```

**Rule: recipes take no `slotProps` and no escape hatches.** The moment you need to change what's inside the popover, you drop to parts. This is the whole answer to the props-bag problem — there is no third state where you configure structure through props.

Precedent for hanging non-part values off the root: `Object.assign` already carries `createHandle` (`dialog/dialog.tsx:22`) and `useFilter`/`useFilteredItems` (`combobox/combobox.tsx:19-20`).

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

export type CalendarPreviewProps = SingleProps | RangeProps | MultipleProps;
```

Notes on specific choices:

- **`onValueChange`, not `onSelect`.** Matches `Select`, `Combobox`, and `Accordion`. Today `onSelect` fires mid-interaction with a half-built range, so the docs have to instruct consumers to gate on `range.to` (`index.mdx:112`). With `commit='immediate'` the new callback still fires on each step, but the value shape is always a complete `DateRangeValue` with explicit `null`s — no "is this partial?" inference at the call site. With `commit='explicit'` it fires once, on `Apply`.
- **`DateRangeValue` is ours**, not RDP's `DateRange`. RDP's type currently leaks through the public barrel (`components/calendar/index.tsx:1`); that stops.
- **`commit`** is what makes the Figma's footer-with-actions layout expressible. Today `footer` is a bare `ReactNode` slot with no way to write back into state (`range-picker.tsx:52`), which is why presets are unimplementable.
- **`isDateUnavailable`** replaces RDP's `disabled` matcher for the common predicate case, so consumers don't need to learn RDP's matcher DSL. RDP matchers stay reachable on `Grid`.
- **`onValidityChange`** replaces `onErrorChange` (`date-picker.tsx:58`). The component still renders no error UI — `Field` does — but the payload is a state object rather than a stringly-typed message, and it reports *why*.
- **`lock`** lives on `RangeProps` only, since it is meaningless for the other two modes. See [Locking One End of a Range](#locking-one-end-of-a-range).

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

**`.Nav` is ours, not RDP's `components.Dropdown`.** This is the concrete fix for the reverted `captionLayout` feature. Today the loop happens because RDP mounts and unmounts Apsara `Select`s inside the popover through its `components.Dropdown` override (`calendar.tsx:154-160`). If `.Nav` is a sibling of the grid and we drive `month` ourselves, RDP runs with `hideNavigation` and `captionLayout='label'`, never mounts a `Select`, and the unmount ref-cleanup path is simply not entered. Month/year navigation becomes default-on, and `use-picker-popover.ts`'s entire reason for existing disappears with it.

**`.Grid` is the only part that touches RDP, and it never forwards the union.** `months`, `showOutsideDays`, `showWeekNumber`, and `modifiers` are ours; `mode`, `selected`, `onSelect`, `required`, `month`, and `onMonthChange` are derived from root context and are not in `GridProps` at all. Because nothing is force-overridden after a consumer spread, `...props` spread-last holds — satisfying `SKILL.md:75` for the first time in this family.

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

The last row is the point of the exercise: **`use-picker-popover.ts` is deleted entirely.** It has three stated reasons to exist, and all three dissolve:

- *The portal carve-out* (`use-picker-popover.ts:39-41`) — gone, because `.Nav` renders the `Select`s outside the grid and RDP never mounts one inside the popover.
- *`onOpenChange` identity churn* (`:43-46`) — gone, because `useControlled` returns a setter that is stable by construction, so Base UI's store subscriber has nothing to re-bind against.
- *The `trigger-press` double-fire* (`:158`) — gone **only if we do not re-create the race.** Today the input's `onFocus` opens the popover while Base UI's `useClick` toggles it, and the two fight. In the rewrite, opening is owned exclusively by `.Trigger`; `.Input` never calls `setOpen` from a focus handler. If a reviewer wants focus-to-open back, it has to arrive as a Base UI trigger option, not as a competing handler — that is the whole lesson of the 185 lines.

### Locking One End of a Range

```tsx
<CalendarPreview selection="range" lock="from" value={range} onValueChange={setRange} />
```

`lock` makes the named endpoint read-only in both the input and the grid, so "fix the start, pick the end" becomes expressible. That closes `range-picker.tsx:88-94`, which today disables the whole picker and tells you to constrain the calendar instead.

### Field Integration

`CalendarPreview.Input` calls the non-throwing `useFieldContext()` exactly as `Input` does at `input/input.tsx:58`, so `required` and `aria-invalid` wire up by composition:

```tsx
<Field name="starts">
  <Field.Label>Starts</Field.Label>
  <CalendarPreview.DatePicker value={d} onValueChange={setD} />
  <Field.Error />
</Field>
```

This replaces the `onErrorChange` → lift-into-`Field.error` dance the current docs prescribe (`demo.ts:188-206`) and removes the need for `FilterChip`'s hashed-class CSS hack (`filter-chip.module.css:226-232`).

### Conventions This Follows

Every rule below is an existing pattern in the library, cited — not an invention.

| Convention | Canonical source |
|---|---|
| `Object.assign(Root, { … })`; no namespace literals, no `Component.Item =` | 45 occurrences, zero exceptions — e.g. `select/select.tsx:9`, `tabs/tabs.tsx:92`, `sidebar/sidebar.tsx:10` |
| Root `displayName` is the bare name; parts are `'Root.Part'` | `select/select-root.tsx:235` (`'Select'`), `tabs/tabs.tsx:53` (`'Tabs.List'`). Only `Tabs` and `Theme` deviate, using `'X.Root'` for the root; we follow the majority. |
| Plain function components, `ref` as a prop, no `forwardRef` | `SKILL.md:72`; one legacy `forwardRef` left in the library (`command/command-dialog.tsx`) |
| Base UI `render` prop, never `asChild` | `composition.md:43` |
| `useRender` + `mergeProps` for plain-DOM parts that support `render` | `sidebar/sidebar-item.tsx:94-116`, `text/text.tsx:104-108` |
| `useControlled` from `@base-ui/utils/useControlled` | `tour/tour-root.tsx:135-145`, `chat-panel/chat-panel-root.tsx:290` |
| `part`-aware throwing context hook | `chat-panel/chat-panel-context.tsx:30-36` |
| `<Ctx value={…}>` (React 19), not `<Ctx.Provider>` | `sidebar/sidebar-root.tsx:208`, `data-table/data-table.tsx:221` |
| Discriminated union for single-vs-multiple | `select/select-root.tsx:61-86` |
| Generic value type stored as `unknown` in context, cast at the hook | `combobox/combobox-root.tsx:25-38` |
| `data-slot` before the spread, on every rendered element | `SKILL.md:76` |
| Non-throwing `useFieldContext()` for opt-in `Field` integration | `field/use-field-context.tsx`, consumed at `input/input.tsx:58` |

Two deliberate departures from what the *old calendar* did, both of which bring it back in line:

- **No `slotProps`.** Nothing else in Apsara configures a popover through a props bag. Customisation happens by composing parts.
- **`render`, not `children`-as-function.** `composition.md:43` is explicit; the picker's `children?: ReactNode | ((props) => ReactNode)` is a fourth idiom that exists nowhere else in the library.

## Internal Architecture

### File Layout

Per `SKILL.md:37-46`:

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

### Context

Newest house form — `part`-aware error, per `chat-panel/chat-panel-context.tsx:30-36`:

```tsx
export const CalendarPreviewContext =
  createContext<CalendarPreviewContextValue | null>(null);

export function useCalendarPreviewContext(part: string): CalendarPreviewContextValue {
  const context = useContext(CalendarPreviewContext);
  if (!context) {
    throw new Error(`CalendarPreview.${part} must be used within <CalendarPreview>`);
  }
  return context;
}
```

The value type is stored as `unknown` and cast at the hook boundary — the `Combobox` technique (`combobox/combobox-root.tsx:25-38`) — so the root can stay generic over selection mode without a generic `createContext`.

### The Date Adapter

One module, three jobs. Illustrated here with dayjs to match today's code; see [Dependencies](#dependencies) for why date-fns is the likely implementation.

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

1. **Import-order dependence goes away.** Every module that needs a date operation imports from here; the plugin set is a single fact in a single place. The failure class behind the `CHANGELOG.md:33-35` P0 becomes impossible. `data-table/utils/filter-operations.tsx` and `data-view/utils/filter-operations.tsx` migrate onto it too.
2. **`Date` identity churn goes away internally.** All internal comparisons, memo keys, and effect dependencies use `dayKey()` or `epoch()`. The public API stays `Date`, so migration is mechanical — but the three `biome-ignore`s and the unguarded loop at `date-picker.tsx:151-155` have nowhere left to live.
3. **The date library becomes swappable.** The module's exported surface is identical whichever library backs it, so the decision is reversible in one file.

### The react-day-picker Boundary

RDP still earns its place for the day grid: roving-tabindex keyboard navigation, week construction, outside days, locale-aware weekday order, and the range modifier maths are all solved and tested there. Rebuilding them is a large, low-glory job with real a11y regression risk.

What changes is the boundary. Today RDP's props *are* the public API — `CalendarProps = DayPickerProps & OnDropdownOpen & CalendarPropsExtended` (`calendar.tsx:37-39`) — which is why its union leaks and why `props.ts` is a hand-maintained 137-line mirror that has already drifted. In the rewrite RDP lives behind `calendar-preview-grid.tsx` only, driven by derived props, with `hideNavigation` and `captionLayout='label'` set so it never mounts a `Select`.

## Dependencies

The manifest and the lockfile disagree with the ecosystem, and one number in this table changes the "just upgrade instead" argument. All rows verified against the npm registry and `pnpm-lock.yaml` on 24 Aug 2026.

| Package | Manifest range | Lockfile resolves to | Latest published |
|---|---|---|---|
| `react-day-picker` | `^9.6.7` (`package.json:139`) | **9.6.7** | **10.0.1** |
| `@base-ui/react` | `~1.6.0` (`:121`) | 1.6.0 | 1.7.0 |
| `@base-ui/utils` | `~0.3.1` (`:122`) | 0.3.1 | 0.3.2 |
| `dayjs` | `^1.11.20` (`:131`) | 1.11.20 | 1.11.23 |

Three findings follow.

**RDP is two majors behind, and v10 does not change the union.** Diffing the 9.6.7 and 10.0.1 tarballs: `types/selection.d.ts` gained only JSDoc comments, so the `T["required"] extends true ? …` conditionals that force `required` after the spread (`range-picker.tsx:296-299`) are structurally unchanged. All 41 `UI` enum string values are identical, all 20 `classNames` keys we set survive, and all 5 `components` overrides we supply survive. v10 drops 16 v8-era props from `PropsBase` (`fromDate`, `fromMonth`, `fromYear`, `toDate`, `toMonth`, `toYear`, `initialFocus`, `onWeekNumberClick`, and eight `onDay*` touch/key handlers) and four unused `CustomComponents` entries (`Button`, `formatMonthCaption`, `formatYearCaption`, `labelDay`); none of the 20 are referenced anywhere in `packages/raystack`. **The v10 upgrade is a clean, separate PR that this rewrite neither needs nor blocks — and it does not remove the reason for isolating RDP.**

**date-fns is already in the tree, twice over.** `react-day-picker` declares `date-fns` and `@date-fns/tz` as real dependencies at 9.6.7, 9.14.0, and 10.0.1, and the lockfile shows `@base-ui/react@1.6.0` resolving against `date-fns@4.1.0` and `@date-fns/tz@1.2.0` as well. So we ship date-fns unconditionally and then *additionally* install and plugin-extend dayjs. Building `date-adapter.ts` on date-fns means one date implementation shared with the grid and with Base UI, at no install cost — subject to a measured bundle check in phase 1.

**Base UI is building toward date primitives but has not shipped them.** Neither 1.6.0 (81 export keys) nor 1.7.0 (83) exposes a `Calendar`, `DatePicker`, or `TimePicker`. Both do ship `./internals/temporal`, `./internals/temporal-adapter-date-fns`, and `./internals/temporal-adapter-luxon` — an adapter interface (`now`, `date`, `parse`, `setTimezone`, `isSameDay`, `startOfMonth`, `addMonths`, `getYear`, …) with two concrete implementations. Shaping `date-adapter.ts` to that method surface means adopting Base UI's primitives later is a swap inside one file rather than a third rewrite.

## The `data-slot` Contract

`SKILL.md:76` makes slot names semver-covered public API. The current 23 slots are the cleanest part of this component; the new tree preserves every meaningful one under a new prefix.

| Old slot | New slot |
|---|---|
| `calendar` | `calendar-preview-grid` |
| `calendar-nav-previous` / `-next` | `calendar-preview-nav-previous` / `-next` |
| `calendar-dropdown` / `-dropdown-content` | `calendar-preview-nav-month` / `-nav-year` |
| `calendar-month-grid` / `-grid-table` / `-grid-skeleton` | `calendar-preview-weeks` / `-table` / `-skeleton` |
| `calendar-day` / `-day-number` / `-day-info` / `-day-tooltip` | `calendar-preview-day` / `-day-number` / `-day-info` / `-day-tooltip` |
| `date-picker-trigger`, `range-picker-trigger` | `calendar-preview-trigger` |
| `date-picker-input` | `calendar-preview-input` |
| `date-picker-positioner`, `range-picker-positioner` | `calendar-preview-positioner` |
| `date-picker-content`, `range-picker-content` | `calendar-preview-content` |
| `range-picker-trigger-group` | `calendar-preview-range-inputs` |
| `range-picker-start-input` / `-end-input` | `calendar-preview-input-start` / `-input-end` |
| `range-picker-footer` | `calendar-preview-footer` |

New slots: `calendar-preview-presets`, `-preset`, `-granularity`, `-month-grid`, `-month-cell`, `-time-field`, `-apply`, `-cancel`, `-nav-caption`.

Because `CalendarPreview` is a new component name this is purely additive — the old slots keep working for as long as the old family ships.

## Design Blockers

From the design-side inspection of the Figma. The first three block phase 0.

1. **No focus state for the day cell**, and no `Focus Ring` composition, despite a `Focus Ring` component existing elsewhere in the DLS. A calendar grid is keyboard-driven; this is a design blocker, not an implementation detail. (Today's CSS improvises one at `calendar.module.css:262-265`.)
2. **`Active` has no `Position=Default` variant** — pressing a single non-range date is undefined.
3. **The range band's `End` corner rounding needs confirming.** Per-position rounding should come from the Figma `Position` concept (`Start` = `12 0 0 12`, `Middle` = `0`, `End` = `0 12 12 0`), not from the ad-hoc `:first-of-type` / `:last-of-type` / `:not()` chains at `calendar.module.css:132-150`. In the variant matrix `End` appears to round on the same side as `Start`, which would be a mirror error.
4. **Tokens.** `--rs-radius-5` = 12px (`tokens.md:130`) covers the selection pill and range-band ends. The four untokenised values in today's CSS — 346px min-height (`:7`), 0px border (`:31`), 0.5px hairline (`:190`), 260px dropdown max-height (`:211`) — need real tokens or a documented exception.
5. **`Info label`** placement and typography are unspecified for the `dateInfo` surface.

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

1. **`FilterChip`** (`filter-chip/filter-chip.tsx:183-195`) — rewrite to compose parts. Delete `toDateValue()` (`:43-50`), the shallow `slotProps.input` merge (`:188-194`), and the hashed-class CSS (`filter-chip.module.css:226-232`). `FilterChipCalendarProps` (`:58-61`) shrinks to a much smaller `Omit`.
2. **`DataView`** — add the `filterProps.calendar` slot that `CHANGELOG.md:95-96` already claims exists (`data-view.types.tsx:83-85`, `data-view/components/filters.tsx:161`). This is the going-forward surface; `DataTable` is deprecated.
3. **`data-table` / `data-view` filter-operations** — migrate off local `dayjs.extend()` (`:22-23` in both) onto `date-adapter.ts`.

## Implementation Plan

| Phase | Content | Exit criteria |
|---|---|---|
| **0. Design unblock** | Resolve the five gaps in [Design Blockers](#design-blockers) | Design sign-off; tokens exist or exception documented |
| **1. Foundation** | `date-adapter.ts` (incl. the date-fns-vs-dayjs bundle measurement), context, root, `Trigger`, `Content`, `Grid` | `<CalendarPreview.Inline />` renders; `data-slots.test.tsx` green |
| **2. Inputs and recipes** | `Input`, `RangeInput`, `Nav`, `DatePicker` / `RangePicker` / `Inline` recipes | Parity with today's behaviour, including the whole `date-picker.test.tsx` regression suite ported |
| **3. New surfaces** | `Presets`, `Footer`, `Apply`/`Cancel`, `commit='explicit'`, `GranularityTabs`, `MonthGrid`, `TimeField`, `DateTimePicker` / `MonthPicker` | Figma's granularity selector and Month-Year Picker reproduced |
| **4. Integrations** | `FilterChip` rewrite, `DataView` calendar filter slot, `filter-operations` on the adapter | No `slotProps` merge, no hashed-class CSS |
| **5. Docs and ship** | `index.mdx` + `demo.ts` **with an interactive `playground`** + `props.ts`; CHANGELOG entry | All eight `SKILL.md:501-509` items pass |
| **6. Removal** | Delete `components/calendar/`, drop the old exports | One release after phase 5 |

Two dependency PRs are independent of the above and can land in parallel: `@base-ui/react` → `~1.7.0`, and `react-day-picker` → `~10.0.1` (justified in [Dependencies](#dependencies); neither is a prerequisite).

Also worth resolving before phase 5: the root `package.json:27` pins `typescript@4.7` while `packages/raystack/package.json:117` pins `~5.4.3`. The workspace builds because turbo runs in the package, but the root pin is stale enough to confuse tooling.

## Testing

Acceptance criteria — the eight `SKILL.md:501-509` items, plus the four this rewrite exists to fix.

- [ ] Builds clean; `pnpm --filter @raystack/apsara test -- --reporter=verbose components/calendar-preview` green
- [ ] Docs site builds; new page generated
- [ ] `displayName` on every part (`'CalendarPreview'`, `'CalendarPreview.Grid'`, …)
- [ ] `data-slot` on every rendered element, covered by `data-slots.test.tsx` (portaled parts asserted against `document.body`, per `SKILL.md:270`)
- [ ] CSS uses `--rs-*` tokens only — **zero** `Todo: var does not exist`
- [ ] Alphabetical export in `packages/raystack/index.tsx`
- [ ] Interactive `playground` in `demo.ts`
- [ ] **Zero `biome-ignore`** in the new component
- [ ] **Zero `slotProps`**; every part spreads `...props` last
- [ ] `open` / `onOpenChange` on the root; `use-picker-popover.ts` deleted
- [ ] Month/year navigation on by default, verified **in a real browser** — jsdom is what let the `captionLayout` regression through the first time
- [ ] Every regression test in the current `__tests__/` ported, or explicitly retired with a stated reason

## Open Items

1. **`quarter` / `half-year` value shape.** *(Highest impact — decide before phase 1, it shapes the type union.)* What does `onValueChange` emit for "Q2 2026" — the first day of the period, or a `{ from, to }` range? A range is more truthful and makes `selection='range'` and granularity compose, but it means `granularity !== 'day'` changes the value *shape*, which `CalendarPreviewProps` then has to express.
2. **Name.** Does `CalendarPreview` graduate to `Calendar` at phase 6? "Preview" reads as *unstable preview*, which is honest for phases 1–4 and wrong once it is the only calendar. Proposal: keep `CalendarPreview` while both exist, then rename at phase 6 with `CalendarPreview` kept as a deprecated alias for one release. This blocks phase 5, because slot names embed the prefix and renaming them later is a breaking change under `SKILL.md:76`.
3. **`commit` default for ranges.** `'immediate'` matches today. But the Figma's footer layout implies `'explicit'` is the intended pattern for ranges — should `selection='range'` default to it?
4. **Presets as data or children?** `<CalendarPreview.Preset>` children is more composable; a `presets={[…]}` array on the recipes is less typing. Both precedents exist in-repo (`Combobox` takes items as children, `DataTable` takes columns as data). The recipe signatures in [Recipes](#recipes) deliberately omit `presets` until this is settled.
5. **Time zones.** Today `timeZone` is passed to RDP and used for `dateInfo` keys, with the function form of `dateInfo` explicitly pushing tz handling onto the consumer (`calendar.tsx:28-31`). Does the rewrite own tz conversion end-to-end, or stay a pass-through?
6. **`multiple` selection.** Nothing in the Figma calls for it. Ship it, or cut it from v1 and keep the union two-armed?
7. **Changesets.** There is no changeset setup in the repo (no `.changeset/`, no `@changesets/cli`), and `packages/raystack/package.json:3` reads `0.48.0` while `CHANGELOG.md:3` already reads `0.49.0`. Breaking changes are currently communicated by hand-written prose. A `data-slot` rename has nothing but reviewer vigilance behind it. Introduce changesets with this work, or keep prose?

## Alternatives

**Patch the existing components again.** Rejected. `CHANGELOG.md:5-12` describes PR #819 as "a coordinated overhaul … 18 P0/P1 bugs fixed", and the family has still needed `8d138d4`, `550fffb`, and `1ce8dc7` since. Every theme in that changelog is a *contract* problem — who owns state, who owns error presentation, who owns `mode`, who owns open/close — not a rendering problem. Patches cannot supply a missing contract.

**Upgrade react-day-picker to v10 instead of rewriting.** Rejected, because it addresses a different problem. Verified against the tarballs: the `mode`/`required` union is structurally unchanged from 9.6.7 through 10.0.1. The upgrade is worth taking on its own merits (see [Dependencies](#dependencies)) and should ship as its own PR, but two majors in, the union is still the shape it is. Waiting for upstream is not a plan.

**Own the day grid, drop react-day-picker.** Tempting: it makes spread-last trivially true, matches the Figma's `Position` model exactly, and removes the union entirely. Rejected for v1 on risk — keyboard roving tabindex, locale weekday order, week numbering, and range modifier maths all become ours, and a11y regressions in a date grid are expensive. The boundary in [The react-day-picker Boundary](#the-react-day-picker-boundary) gets most of the benefit. Revisit if that boundary proves leaky in practice.

**Build on a Base UI date primitive.** Not available — verified, no date component at 1.6.0 or 1.7.0. The `internals/temporal*` adapters show the primitives are in flight; `date-adapter.ts` is shaped to that surface so we can adopt them without a third rewrite.

**Keep the flat exports, just fix internals.** Rejected. It leaves `composition.md:29` violated, keeps `slotProps`, and keeps open state private — which keeps the custom popover hook, which keeps the whole causal chain.

**ISO day strings (`'2026-04-17'`) in the public API.** Genuinely attractive: it kills timezone ambiguity and identity churn outright and serialises cleanly to URLs and forms. Rejected for v1 because it breaks every call site including `FilterChip` and `DataTable`'s filter types, and the migration stops being mechanical. `date-adapter.ts` captures the internal benefit without the external cost. Worth reconsidering for a future major.

## Helpful Links

- [Calendar docs page](https://apsara.raystack.org/docs/components/calendar)
- [PR #819 — the coordinated calendar overhaul](https://github.com/raystack/apsara/pull/819) — `CHANGELOG.md:5-180`
- [react-day-picker v10 release notes](https://daypicker.dev/)
- In-repo conventions: `.agents/skills/apsara/references/composition.md`, `.agents/skills/add-new-component/SKILL.md`
