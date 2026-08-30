---
ID: RFC 005
Created: August 24, 2026
Status: Draft
RFC PR: https://github.com/raystack/apsara/pull/890
---

# Calendar Rewrite: `CalendarPreview`

Replace `Calendar`, `DatePicker`, and `RangePicker` with one subcomposed root, `CalendarPreview`, that owns date state and popover state explicitly and exposes every surface as a dot-notation part.

Every recurring bug in this family traces to one fact: **popover open state is private**, so the pickers cannot hand dismissal to Base UI. That costs 185 lines of bespoke popover machinery, three suppression branches inside one callback, and a month/year navigation feature that is off by default but still demoed.

Breaking change, no compatibility shim. `CalendarPreview` ships alongside the current family; the old exports are removed one release later. Scope: single and range selection, month-year navigation, granularity (day / month / quarter / half-year / year), presets, and time-of-day.

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

`packages/raystack/components/calendar/` ships three flat exports across 1,071 lines of TypeScript and 345 of CSS. The barrel exports `Calendar`, `DatePicker`, `RangePicker`, and re-exports react-day-picker's `DateRange` type directly.

| File | Lines | Role |
|---|---|---|
| `calendar.tsx` | 269 | Wraps react-day-picker's `DayPicker`; 5 component overrides, 20 `classNames` keys |
| `date-picker.tsx` | 293 | Single-date picker with a typable input |
| `range-picker.tsx` | 324 | Two-input range picker |
| `use-picker-popover.ts` | 185 | Bespoke open/close, outside-click, and dropdown carve-out |
| `calendar.module.css` | 345 | Shared styles |

### Current Problems

| # | Problem | Evidence in the repo | Rewrite's answer |
|---|---|---|---|
| 1 | No dot-notation composition | Three flat exports, zero sub-parts, against `composition.md`'s "one name per component". `slotProps`, `children`-as-function, and `onErrorChange` appear in no other component. | One root, every surface a part |
| 2 | **Open state is private** | Neither picker takes `open` / `onOpenChange`; both pass `popover.isOpen` into `Popover` and expose nothing. `Menu`, `Select`, `Sidebar`, and `Tour` roots all expose it. | `open` / `defaultOpen` / `onOpenChange` on the root |
| 3 | 185 lines of popover machinery | `use-picker-popover.ts` — inventory below | File deleted; Base UI owns dismissal |
| 4 | `Date` identity churn | Three `biome-ignore`s for `useExhaustiveDependencies` — two reading *compare on timestamp, not Date identity*, one *engage/disengage are stable*. A fourth effect with the same problem is unguarded (below). | `dayKey()` / `epoch()` internally; zero suppressions |
| 5 | Month/year nav off by default | `range-picker.tsx`: `'dropdown'` mounts Apsara `Select`s whose unmount loops ("Maximum update depth"). `date-picker.runtime.test.tsx` still asks for real-browser verification and credits a `useMemo` that no longer exists — `date-picker.tsx` has zero. The "With Dropdowns" demo shows it on standalone `<Calendar />` with nothing marking it unsafe inside a picker. | `.Nav` is ours and renders no dropdown at all; no `Select` is mounted anywhere |
| 6 | Spread-last unsatisfiable | `SKILL.md` requires `...props` last; `Calendar` complies, the pickers cannot — eight keys are pinned after the consumer spread. Detail below. | RDP's union never reaches a part |
| 7 | `dayjs.extend()` is import-order dependent | Four modules extend independently. `range-picker.tsx` extends nothing and rides on `calendar.tsx` importing first; `date-picker.tsx` forwards `timeZone` without extending `utc`/`timezone`; ordering is enforced by a comment. This is the failure class behind the 0.49.0 P0 — a `TypeError` on every keystroke — and two tests guard it. | One `date-adapter.ts` owns every `extend()` |
| 8 | Partial range disable impossible | Disabling either input gates the whole picker, because the state machine rewrites both `from` and `to` regardless of which input was clicked. Two tests assert the gate; the source comment and CHANGELOG 0.49.0 both say to constrain the calendar instead. | `lock='from' \| 'to'` on `RangeProps` |
| 9 | `FilterChip` absorbs the cost | Sole production consumer, hit three ways. Detail below. | Compose parts; delete `toDateValue()`, the merge, and the dead CSS |
| 10 | Published types are wrong | `props.ts` types both `slotProps.calendar` as the full docs `CalendarProps`, including `mode`, `selected`, `onSelect`, `footer` — none of which the real slot type accepts. `RangePickerProps` and `RangePickerSlotProps` are unexported and absent from the barrel, so **consumers cannot type a `RangePicker` wrapper**. `pickerGroupClassName` is undocumented. Of six deprecated props, exactly one carries an `@deprecated` marker. | Regenerated in phase 5 against the real types |
| 11 | A documented integration was never built | CHANGELOG 0.49.0 claims `DataTable` / `DataView` columns gained `filterProps.calendar`. `data-view.types.tsx` has only `{ select?: BaseSelectProps }` — the slot exists solely on `DataTable`, which is `@deprecated`. | Added to `DataView` in phase 4 |
| 12 | Fails 2 of 8 `SKILL.md` checklist items | CSS carries three `Todo: var does not exist` markers, a hardcoded `max-height: 260px`, and eight `var(--rs-space-10, 40px)` fallbacks. No interactive `playground` in `demo.ts` — 54 other components have one. | Phase 5 exit criteria |

Three further house rules fail off-checklist: dot-notation composition, spread-last in the pickers, and docs matching code. The `data-slot` contract is the one genuinely clean part of this family, and the rewrite preserves it.

**What the 185 lines contain.** Six refs — two DOM handles, two internal flags, and two mirrors of state and props kept purely so callback identities stay stable. Three suppression branches inside a single `onOpenChange`: one swallows the dropdown's own open-change, one swallows `trigger-press` closes because Base UI's `useClick` toggles against the input's `onFocus`, one swallows redundant re-opens. Then a handler named `handleMouseDown` registered on `'mouseup'`, an uncleaned `setTimeout`, and a `setIsOpen` returned from the hook that neither picker ever calls.

**Why spread-last is unsatisfiable.** `required` discriminates react-day-picker's prop union, so a widened value breaks the narrowing — which forces `required={true}` to sit after the consumer spread, and seven more keys with it: `timeZone`, `onDropdownOpen`, `mode`, `month`, `selected`, `onSelect`, `onMonthChange`. Three of those (`month`, `onMonthChange`, `timeZone`) are reachable through `slotProps.calendar`, because they live in RDP's `PropsBase`, so a consumer can pass them and watch them vanish. The slot type — `Omit<PropsBase, 'mode'> & CalendarPropsExtended` — already excludes the rest.

**How `FilterChip` absorbs it.** Three ways. The shallow `slotProps.input` merge lets a consumer-supplied `classNames` object **replace** the chip's own, dropping its container class and breaking layout. `showCalendarIcon={false}` sits before the consumer spread exactly as `SKILL.md` prescribes, so a consumer can re-enable the icon and break the chip. And two `[class*="…"]` rules reach at what they assume are `Input`'s hashed class names for `helper-text` and `input-error-wrapper` — strings that appear nowhere else in the repo, and `Input` renders no such element, so both rules are dead code suppressing nothing.

**The causal chain.** `use-picker-popover.ts`'s header comment names its own reasons: `captionLayout='dropdown'` renders `Select`s whose portals look "outside" to a naive dismiss handler, and `isOpen` is read through a ref because Base UI's store subscriber re-binds on `onOpenChange` identity change and looped on mount. Both dissolve once `.Nav` drops the `Select`s entirely — the new design navigates with buttons, not dropdowns — and `useControlled` supplies a stable setter. None of the 185 lines is wrong for what it is asked to do — it exists only because the component owns dismissal instead of Base UI.

**The unguarded effect** is `setViewMonth` in `date-picker.tsx`:

```tsx
useEffect(() => {
  if (popover.isOpen) {
    setViewMonth(calendarProps?.defaultMonth ?? selectedDate ?? new Date());
  }
}, [popover.isOpen, selectedDate, calendarProps?.defaultMonth]);
```

`calendarProps` is a fresh object literal every render — `{ ...legacyCalendarProps, ...slotProps?.calendar }` — so an inline `slotProps={{ calendar: { defaultMonth: new Date(2025, 0) } }}` yields a fresh `Date` identity per render → effect refires → `setViewMonth` → re-render → loop.

## Goals and Non-Goals

**Goals.** One export with dot-notation parts, matching `composition.md`. Explicit ownership of every piece of state — selection, view month, open, granularity, validity. react-day-picker fully isolated, so its union never reaches a consumer and spread-last becomes satisfiable at every part. Month/year navigation on by default, driven by buttons rather than dropdowns. Full feature set: day / month / quarter / half-year / year granularity, single and dual month, presets, time-of-day. Zero `slotProps`. All eight `SKILL.md` checklist items pass.

**Non-goals.** Preserving the old API — this is a rewrite. Locale/i18n expansion beyond what RDP already gives us (tracked as follow-up). Replacing the date library with Temporal (see [The Date Adapter](#the-date-adapter) for the seam that makes it possible later).

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
    ├── <CalendarPreview.Nav />              caption + revert / previous / next
    ├── <CalendarPreview.Grid />             the day grid (replaces `Calendar`)
    ├── <CalendarPreview.MonthGrid />        month / quarter / half-year / year grid
    ├── <CalendarPreview.TimeField />        time-of-day
    └── <CalendarPreview.Footer>
        ├── <CalendarPreview.Cancel />
        └── <CalendarPreview.Apply />
```

### Recipes

Pre-composed compositions hung off the same object, implemented as compositions of the parts below — no private code paths.

```tsx
<CalendarPreview.DatePicker     value={d} onValueChange={setD} />
<CalendarPreview.RangePicker    value={r} onValueChange={setR} />
<CalendarPreview.DateTimePicker value={d} onValueChange={setD} />
<CalendarPreview.MonthPicker    value={d} onValueChange={setD} granularity="month" />
<CalendarPreview.Inline         value={d} onValueChange={setD} />   // no popover
```

**Recipes take no `slotProps` and no escape hatches.** The moment you need to change what is inside the popover, you drop to parts — there is no third state where you configure structure through props.

**Recipes have no precedent.** Nothing in the library hangs a pre-composed assembly off a root: what roots carry today is parts, re-exported Base UI primitives, hooks (`Combobox.useFilter`), factories (`Dialog.createHandle`), and providers (`Toast.Provider`). The nearest thing is `CodeBlock.LanguageSelect`, a context-bound `Select` wrapper whose siblings flatten into a name prefix (`LanguageSelectTrigger`, `LanguageSelectContent`) instead of nesting. So this is a new precedent, at one cost: `.Input` (a part) and `.DatePicker` (a whole picker) share a namespace with nothing at the call site telling them apart. See [Open Items](#open-items) #8.

### Root Props

```tsx
type CalendarSelection = 'single' | 'range' | 'multiple';
type CalendarGranularity = 'day' | 'month' | 'quarter' | 'half-year' | 'year';

interface CalendarPreviewBaseProps {
  /** @defaultValue 'day' */
  granularity?: CalendarGranularity;
  /** Switchable granularities. Renders `GranularityTabs` when >1. */
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

  /** Compose in `Field` for UI. */
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

| Choice | Replaces | Why |
|---|---|---|
| `onValueChange` | `onSelect` | Matches `Select`, `Combobox`, `Accordion`. Still fires on each step under `commit='immediate'`, but the value is always a complete `DateRangeValue` with explicit `null`s — today the docs must tell consumers to gate on `range.to`. |
| `DateRangeValue` | RDP's `DateRange` | Ours, not react-day-picker's, which currently leaks through the barrel. |
| `commit` | — | Makes a footer-with-actions layout expressible. Today `footer` is a bare `ReactNode` with no way to write back into state, which is why presets are unimplementable. |
| `isDateUnavailable` | RDP's `disabled` matcher | Covers the common predicate without learning RDP's matcher DSL. RDP matchers stay reachable on `.Grid`. |
| `onValidityChange` | `onErrorChange` | Still renders no error UI — `Field` does — but reports a state object with a reason, not a stringly-typed message. |
| `lock` | whole-picker disable | `RangeProps` only. Makes one endpoint read-only in input and grid, closing the partial-disable gate. |

### Parts

| Part | Parent | Element | Purpose | Key props |
|---|---|---|---|---|
| `.Trigger` | root | `div` | Anchors the popover. Never renders a `<button>`. | `render` |
| `.Input` | `.Trigger` | Apsara `Input` | Typed single-date field. Owns parse/format. | `Input` props minus `value`/`onChange` |
| `.RangeInput` | `.Trigger` | `Flex` of two `Input`s | Paired start/end fields. | `startProps`, `endProps` — both full `Input` props |
| `.Content` | root | Base UI `Popover.Popup` | Portaled surface. | `Popover.Content` props |
| `.Presets` | `.Content` | `div` | Preset column/row. | `orientation?: 'vertical' \| 'horizontal'` |
| `.Preset` | `.Presets` | `button` | One preset. Writes into root state. | `value` / `range`, `render` |
| `.GranularityTabs` | `.Content` | Apsara `Tabs` | Day \| Month \| Quarter \| Half-year \| Year. | renders only when `granularities.length > 1` |
| `.Nav` | `.Content` | `div` | Caption, revert-to-default, previous / next. **Ours, not RDP's, and no `Select`.** | `months?: 1 \| 2`, `align?: 'start' \| 'end'` |
| `.Grid` | `.Content` | RDP `DayPicker` | The day grid (replaces `Calendar`). | `months?: 1 \| 2`, `showOutsideDays`, `showWeekNumber`, `modifiers`, `dayProps` |
| `.MonthGrid` | `.Content` | `div` | Month / quarter / half-year / year cells. | inherits root `granularity` |
| `.TimeField` | `.Content` | Apsara `Input`s | Hour/minute (+ meridiem). | `step`, `hourCycle?: 12 \| 24` |
| `.Footer` | `.Content` | `Flex` | Action row. | — |
| `.Apply` / `.Cancel` | `.Footer` | Apsara `Button` | Commit / discard buffered value. | `render` |

Two parts carry the load:

- **`.Nav` is ours, not RDP's `components.Dropdown`, and it renders no `Select` at all** — which retires the `captionLayout` bug instead of working around it. The loop happens because RDP mounts and unmounts Apsara `Select`s through its `Dropdown` override; the new design navigates with a caption and three icon buttons — revert-to-default, previous and next — so there is no dropdown left to mount. `.Nav` is a sibling of the grid and drives `month` itself, so RDP runs with `hideNavigation` + `captionLayout='label'` and never enters the unmount ref-cleanup path. Month, quarter, half-year, and year are picked in `.MonthGrid`, a body view reached through `.GranularityTabs` — never through a caption dropdown.
- **`.Grid` is the only part that touches RDP, and it never forwards the union.** `months`, `showOutsideDays`, `showWeekNumber`, and `modifiers` are ours; `mode`, `selected`, `onSelect`, `required`, `month`, `onMonthChange`, and `timeZone` come from root context and are not in `GridProps` at all. Nothing is force-overridden after a consumer spread, so spread-last holds — for the first time in this family.

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

The last row is the point of the exercise: **`use-picker-popover.ts` is deleted entirely.** Its three stated reasons dissolve — the portal carve-out, because `.Nav` has no `Select` to portal; the identity churn, because `useControlled` returns a stable setter; and the `trigger-press` double-fire, *provided we do not re-create the race*. Today the input's `onFocus` opens the popover while Base UI's `useClick` toggles it, and the two fight. Here `.Trigger` owns opening and `.Input` never calls `setOpen` from a focus handler. If focus-to-open returns, it arrives as a Base UI trigger option, not a competing handler — that is the lesson of the 185 lines.

### Field Integration

`CalendarPreview.Input` calls the non-throwing `useFieldContext()` exactly as `Input` does, so `required` and `aria-invalid` wire up by composition. This replaces the `onErrorChange` → lift-into-`Field.error` dance the current docs prescribe, and removes the need for `FilterChip`'s hashed-class CSS.

```tsx
<Field name="starts">
  <Field.Label>Starts</Field.Label>
  <CalendarPreview.DatePicker value={d} onValueChange={setD} />
  <Field.Error />
</Field>
```

### Conventions This Follows

Every rule below is an existing pattern in the library, not an invention. [Recipes](#recipes) are the one thing in this RFC with no precedent — see the note there.

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

Two deliberate departures from the old calendar: **no `slotProps`**, and **`render` instead of `children`-as-function**.

## Internal Architecture

### File Layout

Per the file-layout convention in `SKILL.md`:

```
packages/raystack/components/calendar-preview/
├── index.tsx                      # re-export only
├── calendar-preview.tsx           # Object.assign composition
├── calendar-preview-root.tsx      # state, context provider
├── calendar-preview-context.tsx   # part-aware throwing hook
├── calendar-preview-grid.tsx      # the ONLY file importing react-day-picker
├── calendar-preview-<part>.tsx    # trigger, input (Input + RangeInput), content,
│                                  # nav, month-grid, presets, time-field, footer
├── recipes.tsx                    # DatePicker / RangePicker / DateTimePicker / MonthPicker / Inline
├── date-adapter.ts                # ALL date-library plugin setup lives here
├── calendar-preview.module.css
└── __tests__/                     # calendar-preview, recipes, granularity, data-slots
```

Context follows the newest house form: a `part`-aware hook that throws with the offending part name (`useChatPanelContext`), value stored as `unknown` and cast at the hook boundary (the `Combobox` technique), so the root stays generic over selection mode without a generic `createContext`.

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

| Job | Effect |
|---|---|
| Import-order dependence goes away | Every module needing a date operation imports from here, so the plugin set is one fact in one place and the 0.49.0 `TypeError` class becomes impossible. Both `filter-operations.tsx` modules migrate onto it. |
| `Date` identity churn goes away internally | All internal comparisons, memo keys, and effect dependencies use `dayKey()` or `epoch()`. The public API stays `Date`, so migration is mechanical — but the three `biome-ignore`s and the unguarded loop have nowhere left to live. |
| The date library becomes swappable | The exported surface is identical whichever library backs it, so the decision is reversible in one file. |

### The react-day-picker Boundary

RDP earns its place for the day grid: roving-tabindex keyboard navigation, week construction, outside days, locale-aware weekday order, and range modifier maths are solved and tested there, and rebuilding them carries real a11y regression risk.

What changes is the boundary. Today RDP's props *are* the public API (`CalendarProps = DayPickerProps & OnDropdownOpen & CalendarPropsExtended`) — which is why the union leaks and why the `CalendarProps` block in `props.ts` is a hand-maintained mirror that has already drifted. In the rewrite RDP lives behind `calendar-preview-grid.tsx` only, driven by derived props, with `hideNavigation` and `captionLayout='label'` set so it never mounts a `Select`.

## Dependencies

Verified against the npm registry, `pnpm-lock.yaml`, and the published tarballs on 27 Aug 2026.

| Package | Manifest range | Lockfile resolves to | Latest published |
|---|---|---|---|
| `react-day-picker` | `^9.6.7` | **9.6.7** | **10.0.1** |
| `@base-ui/react` | `~1.6.0` | 1.6.0 | 1.7.0 |
| `@base-ui/utils` | `~0.3.1` | 0.3.1 | 0.3.2 |
| `dayjs` | `^1.11.20` | 1.11.20 | 1.11.23 |

**RDP is two majors behind, and v10 does not change the union.** Diffing the 9.6.7 and 10.0.1 tarballs: `types/selection.d.ts` gained JSDoc only — zero non-comment lines changed — so the conditionals that force `required` after the spread are unchanged. All 41 class-name keys (`UI` 24, `DayFlag` 5, `SelectionState` 4, `Animation` 8) are identical, as are the 20 `classNames` keys we set and the 5 `components` overrides we supply. v10 drops the 16 `@deprecated` v8-era props (`fromDate`, `toDate`, `onDayKeyUp`, …) and one `CustomComponents` entry (`Button`); `packages/raystack` references none of them. The upgrade is a clean, separate PR this rewrite neither needs nor blocks.

**date-fns already ships, twice over.** `react-day-picker@9.6.7` depends on `date-fns@4.1.0`, `@date-fns/tz@1.2.0`, and `date-fns-jalali@4.1.0-0`; `@base-ui/react@1.6.0` lists `date-fns` and `@date-fns/tz` as optional peers, already satisfied here by RDP. So we ship date-fns unconditionally and then *additionally* install and plugin-extend dayjs. Building `date-adapter.ts` on date-fns means one implementation shared with the grid and with Base UI, at no install cost — subject to a measured bundle check in phase 1.

**Base UI has no date primitive yet.** Neither 1.6.0 nor 1.7.0 exports a `Calendar`, `DatePicker`, or `TimePicker`. Both ship `./internals/temporal` plus date-fns and Luxon adapters — `now`, `date`, `parse`, `setTimezone`, `isSameDay`, `startOfMonth`, `addMonths`, `getYear`, and ~80 more. Shaping `date-adapter.ts` to that surface makes adopting their primitives a one-file swap rather than a third rewrite.

## The `data-slot` Contract

`SKILL.md` makes slot names semver-covered public API. The current 23 slots are the cleanest part of this component, and every one has a mapping. Six change by prefix alone (`calendar-day` → `calendar-preview-day`, and likewise `-day-info`, `-day-number`, `-day-tooltip`, `calendar-nav-next`, `calendar-nav-previous`). The other 17 change name, and because the picker pairs collapse and the two dropdown slots retire with the dropdown, they land on 12:

| Old slot | New slot |
|---|---|
| `calendar` | `calendar-preview-grid` |
| `calendar-dropdown` | *retired* — `.Nav` has no dropdown; its caption is `calendar-preview-nav-caption` |
| `calendar-dropdown-content` | *retired* |
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

23 old slots therefore become 18, plus ten new: `calendar-preview-presets`, `-preset`, `-granularity`, `-month-grid`, `-month-cell`, `-time-field`, `-apply`, `-cancel`, `-nav-caption`, `-nav-undo`. Because `CalendarPreview` is a new component name this is purely additive — the old slots keep working for as long as the old family ships.

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
| `calendarProps.captionLayout="dropdown"` | removed — `.Nav` navigates with buttons, and month / quarter / half-year / year are picked in `.MonthGrid` via `.GranularityTabs` |
| `children={({ selectedDate }) => …}` | `<CalendarPreview.Trigger render={…} />` |
| `footer={<Presets />}` | `<CalendarPreview.Presets>` + `<CalendarPreview.Footer>` |
| `onErrorChange={fn}` | `onValidityChange={fn}`, or compose in `Field` |
| `pickerGroupClassName` | `className` on `.RangeInput` |
| `DateRange` from `react-day-picker` | `DateRangeValue` from `@raystack/apsara` |
| whole-picker disable via one input | `lock="from"` / `lock="to"` |

### Repo-Internal Follow-ups

These land with the rewrite, not after it.

| Target | Work |
|---|---|
| `FilterChip` | Rewrite to compose parts. Deletes `toDateValue()`, the shallow `slotProps.input` merge, and the two dead hashed-class CSS rules. |
| `DataView` | Add the `filterProps.calendar` slot CHANGELOG 0.49.0 already claims exists. This is the going-forward surface; `DataTable` is deprecated. |
| `data-table` / `data-view` filter-operations | Migrate off local `dayjs.extend()` onto `date-adapter.ts`. |

## Implementation Plan

| Phase | Content | Exit criteria |
|---|---|---|
| **1. Foundation** | `date-adapter.ts` (incl. the date-fns-vs-dayjs bundle measurement), context, root, `Trigger`, `Content`, `Grid` | `<CalendarPreview.Inline />` renders; `data-slots.test.tsx` green |
| **2. Inputs and recipes** | `Input`, `RangeInput`, `Nav`, `DatePicker` / `RangePicker` / `Inline` recipes | Parity with today's behaviour, including the whole `date-picker.test.tsx` regression suite ported |
| **3. New surfaces** | `Presets`, `Footer`, `Apply`/`Cancel`, `commit='explicit'`, `GranularityTabs`, `MonthGrid`, `TimeField`, `DateTimePicker` / `MonthPicker` | Granularity switching and the month/quarter/half-year/year grids work |
| **4. Integrations** | `FilterChip` rewrite, `DataView` calendar filter slot, `filter-operations` on the adapter | No `slotProps` merge, no hashed-class CSS |
| **5. Docs and ship** | `index.mdx` + `demo.ts` **with an interactive `playground`** + `props.ts`; CHANGELOG entry | All eight `SKILL.md` checklist items pass |
| **6. Removal** | Delete `components/calendar/`, drop the old exports | One release after phase 5 |

Two dependency PRs are independent and can land in parallel: `@base-ui/react` → `~1.7.0` and `react-day-picker` → `~10.0.1`. Neither is a prerequisite.

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
- [ ] Month/year navigation on by default and **zero `Select`s mounted**, verified **in a real browser** — jsdom is what let the `captionLayout` regression through the first time
- [ ] Every regression test in the current `__tests__/` ported, or explicitly retired with a stated reason

## Open Items

| # | Question | Decide by |
|---|---|---|
| 1 | **`quarter` / `half-year` value shape.** Does `onValueChange` emit the first day of the period, or a `{ from, to }` range? A range is more truthful and composes with `selection='range'`, but then `granularity !== 'day'` changes the value *shape*. | Phase 1 — it shapes the type union |
| 2 | **Name.** Does `CalendarPreview` graduate to `Calendar` at phase 6? "Preview" is honest for phases 1–4 and wrong once it is the only calendar. Proposal: keep it while both exist, rename at 6, keep `CalendarPreview` as a deprecated alias for one release. | Phase 5 — slot names embed the prefix, so renaming later is itself breaking |
| 3 | **`commit` default for ranges.** `'immediate'` matches today, but a footer with Apply/Cancel implies `'explicit'` is the intended range pattern. | Phase 3 |
| 4 | **Presets as data or children?** `<CalendarPreview.Preset>` children composes better; `presets={[…]}` is less typing. Both precedents exist in-repo (`Combobox` items as children, `DataTable` columns as data). The recipe signatures omit `presets` until this is settled. | Phase 3 |
| 5 | **Time zones.** Does the rewrite own tz conversion end-to-end, or stay the pass-through it is today? | Phase 1 |
| 6 | **`multiple` selection.** No current consumer needs it. Ship it, or keep the union two-armed? | Phase 1 |
| 7 | **Announcing the break.** No changesets setup exists, and `packages/raystack/package.json` reads `0.48.0` while `CHANGELOG.md` already carries a `0.49.0` section. A `data-slot` rename has nothing but reviewer vigilance behind it. Introduce changesets, or keep hand-written prose? | Phase 5 |
| 8 | **Do recipes ship at all?** No component hangs a pre-composed assembly off a root today, and `.Input` sitting beside `.DatePicker` in one namespace reads badly. The alternative is parts only, with the five compositions living in the docs as copyable examples. | Phase 2 — its exit criteria name them |

## Alternatives

| Alternative | Verdict | Why |
|---|---|---|
| **Patch the existing components again** | Rejected | PR #819 was already "a coordinated overhaul … 18 P0/P1 bugs fixed", and three further fix PRs have landed since (#821, #827, #881). Every theme in that changelog is a *contract* problem — who owns state, error presentation, `mode`, open/close — not a rendering problem, and patches cannot supply a missing contract. |
| **Upgrade react-day-picker to v10 instead** | Rejected; different problem | The `mode`/`required` union is unchanged from 9.6.7 through 10.0.1 (verified against the tarballs). Worth taking on its own merits, as its own PR, but waiting for upstream is not a plan. |
| **Own the day grid, drop react-day-picker** | Rejected for v1, on risk | Tempting: spread-last becomes trivially true and the union disappears. But roving tabindex, locale weekday order, week numbering, and range modifier maths all become ours, and a11y regressions in a date grid are expensive. The boundary above gets most of the benefit; revisit if it proves leaky. |
| **Build on a Base UI date primitive** | Not available | Verified: no date component at 1.6.0 or 1.7.0. `date-adapter.ts` is shaped to their `internals/temporal` surface so we can adopt them without a third rewrite. |
| **Keep the flat exports, just fix internals** | Rejected | Leaves `composition.md`'s dot-notation rule violated, keeps `slotProps`, and keeps open state private — which keeps the custom popover hook, which keeps the whole causal chain. |
| **ISO day strings (`'2026-04-17'`) in the public API** | Rejected for v1 | Attractive: kills timezone ambiguity and identity churn outright and serialises cleanly to URLs and forms. But it breaks every call site including `FilterChip` and `DataTable`'s filter types, and the migration stops being mechanical. `date-adapter.ts` captures the internal benefit without the external cost; worth reconsidering for a future major. |

## Helpful Links

- [Calendar docs page](https://apsara.raystack.org/docs/components/calendar)
- [PR #819 — the coordinated calendar overhaul](https://github.com/raystack/apsara/pull/819)
- [react-day-picker v10 release notes](https://daypicker.dev/)
- In-repo conventions: `.agents/skills/apsara/references/composition.md`, `.agents/skills/add-new-component/SKILL.md`
