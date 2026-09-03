---
ID: RFC 005
Created: August 24, 2026
Updated: September 3, 2026
Status: Draft
RFC PR: https://github.com/raystack/apsara/pull/890
---

# Calendar Rewrite: `CalendarPreview`

Replace `Calendar`, `DatePicker` and `RangePicker` with one subcomposed root.

- **Owns state explicitly** — selection, view month, popover open, scale, validity
- **Every surface is a part** — dot-notation, no `slotProps`
- **react-day-picker behind one file** — its prop union never reaches a consumer
- **New capability:** selection at scales coarser than a day — month, quarter, half-year, year — with the scale carried by the value, not inferred from a prop
- **Breaking, no shim.** Ships alongside the current family; old exports go one release later
- **Target:** `@raystack/apsara` (`packages/raystack/components/calendar-preview/`)

The body is the proposal. [Appendix A](#appendix-a--implementation-reference) holds the implementation reference — part props, file layout, slot map, prop migration. [Appendix B](#appendix-b--evidence) backs every factual claim below.

## Contents

[Background](#background) · [Goals](#goals) · [Proposal](#proposal) · [Scale Model](#the-scale-model) · [Root Props](#root-props) · [Parts](#parts) · [State](#state-ownership) · [Architecture](#architecture) · [Dependencies](#dependencies) · [Breaking Changes](#breaking-changes) · [Plan](#plan) · [Testing](#testing) · [Open Items](#open-items) · [Alternatives](#alternatives) · [Appendix A](#appendix-a--implementation-reference) · [Appendix B](#appendix-b--evidence)

## Background

`components/calendar/` ships three flat exports across 1,071 lines of TypeScript and 345 of CSS, plus a re-export of react-day-picker's `DateRange`.

Five problems account for this RFC — each a question about **who owns what**, not about rendering.

| # | Problem | Consequence today | The rewrite's answer |
|---|---|---|---|
| 1 | **Open state is private** | Neither picker takes `open`/`onOpenChange`, so dismissal cannot go to Base UI. 185 lines of bespoke popover code; `captionLayout='dropdown'` off by default because the `Select`s it mounts loop on unmount | `open` / `defaultOpen` / `onOpenChange` on the root; `use-picker-popover.ts` deleted |
| 2 | **No composition contract** | Three flat exports, zero sub-parts, against `composition.md`. `slotProps`, `children`-as-function and `onErrorChange` appear nowhere else in the library | One root, every surface a part, zero `slotProps` |
| 3 | **RDP's prop union *is* the public API** | The union leaks, `props.ts` is a hand-maintained mirror that has drifted, spread-last is unsatisfiable in the pickers | RDP reaches only `.Grid`, driven by derived props |
| 4 | **`Date` identity churn is load-bearing** | Three `biome-ignore`s plus a fourth effect left unguarded. `dayjs.extend()` runs in four modules in import-order sequence enforced by a comment — the 0.49.0 P0 | `dayKey()` / `epoch()` internally; one `date-adapter.ts` |
| 5 | **Coarser-than-day selection has no home** | A `Date` cannot say whether it means "August 2026" or "1 August 2026", and cells and chips render it with no calendar mounted | `ScaleValue` — the value carries its scale |

Evidence for each: [Appendix B](#appendix-b--evidence).

## Goals

**In scope**

- One export with dot-notation parts, matching `composition.md`
- **Single and range selection**, with the full current feature set of `Calendar`, `DatePicker` and `RangePicker`
- Explicit ownership of every piece of state
- react-day-picker isolated; spread-last holds at every part
- Scale-aware selection whose value carries its own scale
- Month and year navigation on by default — buttons and our own scrollers, never a `Select`
- All eight `SKILL.md` checklist items pass

**Out of scope**

- Preserving the old API — this is a rewrite
- Presets and time-of-day — no design exists
- **`selection='multiple'`** — picking an arbitrary set of individual dates (`Date[]`), today's `Calendar mode="multiple"`. This is a **removal of shipped surface**, not an unbuilt feature; see [Breaking Changes](#breaking-changes)
- i18n beyond what RDP already gives us
- Replacing the date library with Temporal — see [the date adapter](#the-date-adapter) for the seam that keeps it possible

## Proposal

```tsx
// Inline day calendar
<CalendarPreview value={date} onValueChange={setDate}>
  <CalendarPreview.Days />
</CalendarPreview>

// Date picker — a controlled trigger for the same calendar
<CalendarPreview value={date} onValueChange={setDate}>
  <CalendarPreview.Trigger><CalendarPreview.Input /></CalendarPreview.Trigger>
  <CalendarPreview.Content><CalendarPreview.Days /></CalendarPreview.Content>
</CalendarPreview>

// Scale-aware end-date field — the value annotation is the trigger
<CalendarPreview scales={['day','month','quarter','halfYear','year']}
                 value={end} onValueChange={setEnd} trailingValue minDate={start}>
  <CalendarPreview.Trigger />
  <CalendarPreview.Content><CalendarPreview.Picker /></CalendarPreview.Content>
</CalendarPreview>
```

- Every part renders its own default with no children — composition is opt-in depth
- `.Picker` alone gives label, input, scale switcher and views
- **No pre-composed recipes.** The compositions above are documentation, not exports

## The Scale Model

```tsx
type Scale = 'day' | 'month' | 'quarter' | 'halfYear' | 'year';

interface ScaleValue {
  date: string;   // 'YYYY-MM-DD', timeless
  scale: Scale;
}
```

### The value carries its scale; the `scale` prop does not

- `scale` is **the view that is open**; `value.scale` is **what the committed value means**
- They differ for as long as the user browses another scale
- After a reload, a prop cannot say what a stored date meant
- A `DataView` cell or `FilterChip` label renders the value with **no calendar mounted** and no prop to read
- One object makes an inconsistent `value`/`scale` pair unrepresentable

### Two value shapes, discriminated by `scales`

| `scales` | `value` |
|---|---|
| omitted, `'day'`, `['day']` — the default | `Date \| null`, or `DateRangeValue` for `selection='range'` |
| anything else | `ScaleValue \| null` |

Deliberate: the three migrated components carry back-compat debt that ISO strings would break; the scale-aware input has none. The cost is recorded in [Open Items](#open-items).

### Two different things are called a range

| | `selection='range'` | A start–end pair |
|---|---|---|
| Roots | one | **two, independent** |
| Scale | one, shared | one **per endpoint** |
| Value | one `DateRangeValue` | two separate values |
| Interaction | the from/to click machine | each field selects on its own |
| Why | the classic two-input picker | the design pairs `Aug 1st → Q3 2026`, different scale at each end |

### Period edges

`trailingValue` on the root selects which edge is emitted. Default `false`.

```
month     Aug 2026    leading 2026-08-01    trailing 2026-08-31
quarter   Q3 2026             2026-07-01             2026-09-30
halfYear  H1 2026             2026-01-01             2026-06-30
year      2026                2026-01-01             2026-12-31
```

- A start field emits the period's first day; an end field its last
- Month-end must be calendar-correct — **February 2028 trailing is `2028-02-29`**
- The edge affects only what is emitted, never how a stored value reads back — `2026-08-31` at `scale='month'` is unambiguously August 2026

### Conversion, drafts, availability

- **Conversion — one rule, every direction.** Take the anchor date, find the period of the target scale containing it, emit that period's start when leading and its end when trailing
- **Switching scale does not emit.** It moves the view and sets a draft. A cell click or Enter commits; Escape drops the draft and restores the input from `value`
- **Availability is the same rule.** A period is available when *the date it would produce* falls inside `[min, max]` — so availability depends on `trailingValue`, and one period can be selectable in a start field and disabled in an end field

For an end field bounded at `minDate = 15 Jul 2026`:

| Period | Emits | Produced-date rule | Period-start rule |
|---|---|---|---|
| H1 2026 | 30 Jun | disabled | disabled |
| Jul 2026 | 31 Jul | **available** | disabled ✗ |
| Q3 2026 | 30 Sep | **available** | disabled ✗ |
| Aug 2026 | 31 Aug | available | available |

- The period-start rule would stop a project starting 15 July from being said to end in July or in Q3
- The two rules are identical whenever `trailingValue` is false, so nothing simpler is being passed over
- **Bounds limit selection, not navigation** — out-of-range periods disable, the lists still scroll. A deliberate change from `startMonth`/`endMonth`; see [Breaking Changes](#breaking-changes)
- `periodOf`, `anchorOf`, `convertScale` and the availability predicate are **pure functions in `lib/`**, built and tested before any UI

## Root Props

```tsx
interface CalendarPreviewBaseProps {
  scales?: Scale | Scale[];        // @defaultValue 'day'; one value hides the switcher
  scale?: Scale;
  defaultScale?: Scale;
  onScaleChange?: (scale: Scale) => void;
  trailingValue?: boolean;         // @defaultValue false

  open?: boolean;                  // was entirely private
  defaultOpen?: boolean;
  onOpenChange?: PopoverRootProps['onOpenChange'];   // Base UI's typed details

  month?: Date;                    // view state, independent of selection
  defaultMonth?: Date;
  onMonthChange?: (month: Date) => void;
  yearRange?: { from: number; to: number };

  minDate?: Date;                  // selection bounds; navigation is never clamped
  maxDate?: Date;
  isDateUnavailable?: (date: Date) => boolean;

  /** Reset target for `.Reset`. Read even when `value` is controlled. */
  defaultDate?: Date;

  /** Defaults: DD/MM/YYYY at day scale; MMM YYYY, Q# YYYY, H# YYYY, YYYY above it. */
  formatValue?: (value: Date | ScaleValue, scale: Scale) => string;
  timeZone?: string;               // forwarded to the grid; no conversion of our own
  today?: Date;                    // injectable, for deterministic tests
  clearable?: boolean;

  disabled?: boolean;
  readOnly?: boolean;
}

interface ChangeDetails {
  reason: 'select' | 'input' | 'clear' | 'scale';
  period: { start: string; end: string };   // both edges, month-end correct
  toDate: () => Date;
}
```

Selection arms are discriminated on `selection` and `scales`; `onValueChange` receives `(value, details)`. Full signatures in [Appendix A](#appendix-a--implementation-reference).

| Choice | Replaces | Why |
|---|---|---|
| `onValueChange` | `onSelect` | Matches `Select`, `Combobox`, `Accordion`. For ranges it fires only on a complete range, so `to` is no longer nullable |
| `formatValue` | `dateFormat` | A scale-aware field needs a different format per scale, which no token string expresses. A function also sidesteps dayjs-versus-LDML token differences |
| `defaultDate` | — | The reset target. `defaultValue` is ignored by `useControlled` once `value` is passed, so a controlled consumer would never see `.Reset` |
| `readOnly` on `.Input` | `lock` / whole-picker disable | Makes one range endpoint read-only in input and grid, with a prop that already means this |

**Deliberately not on the root** — each moves to the part it applies to: `weekStartsOn`, `numberOfMonths`, `showOutsideDays`, `showWeekNumber`, `fixedWeeks`, `modifiers`, `onValidityChange`, `dateInfo`.

## Parts

```
<CalendarPreview>                       state owner
├── <CalendarPreview.Trigger>           anchor; renders the value annotation by default
│   └── <CalendarPreview.Input />       typed field; field="start" | "end" when paired
└── <CalendarPreview.Content>           portaled popover surface
    ├── <CalendarPreview.Picker>        label + input + scales + panel, all four by default
    │   ├── <CalendarPreview.Label />
    │   ├── <CalendarPreview.Input />
    │   ├── <CalendarPreview.Scales>
    │   │   └── <CalendarPreview.Scale />
    │   ├── <CalendarPreview.Separator />
    │   └── <CalendarPreview.Panel>     view container; renders the five views
    │       ├── <CalendarPreview.Days>
    │       │   ├── <CalendarPreview.Header>
    │       │   │   ├── <.PrevMonth /> <.Caption /> <.Reset /> <.NextMonth />
    │       │   └── <CalendarPreview.Grid>   react-day-picker, only here
    │       │       ├── <CalendarPreview.Day /> <CalendarPreview.Weekday />
    │       ├── <CalendarPreview.Months />
    │       ├── <CalendarPreview.Quarters />
    │       ├── <CalendarPreview.HalfYears />
    │       └── <CalendarPreview.Years />
    └── <CalendarPreview.Footer />      accepts a string or any node
```

| Decision | Detail |
|---|---|
| **Five sibling view parts**, not one switched by a prop | They need different layouts (3 / 4 / 2 / 1 columns) and different heights, and a consumer must be able to mount the quarter view alone. Each self-gates on the active scale exactly as `DataView`'s `.List` / `.Timeline` / `.Custom` do. Also retires `.MonthGrid`, which collided with RDP's own `MonthGrid` slot |
| **`.Caption`** | Opens our own two-column month+year scroller — never a `Select`, so the unmount loop cannot return. Standalone calendar only; inside a picker the caption is plain text and the scale switcher navigates |
| **`.Reset`** | Restores `defaultDate`. Renders only when `defaultDate` is set and the value differs. A **value** reset, not a view reset |
| **Height** | `.Days` hugs its content. The four period views are 320px and scroll — the whole list, not only the rows under a year heading |
| **Every part** | Takes `render`, `className`, `ref`, `data-slot`. **Children override context-computed content** the way `Tour.Title` does, so `<CalendarPreview.Caption>Q3 2026</CalendarPreview.Caption>` works |
| **Cell state** | `data-selected`, `data-draft`, `data-unavailable`, `data-today`, `data-outside`, `data-scale`. Slots say what an element is; these say what state it is in. `dateInfo` renders above the date number, as today |
| **`useCalendar()`** | Ships from the barrel, joining `useTour`, `useSidebar`, `useDataView` and four others, so consumers can build parts we did not. Return type deliberately narrow — value, scale, view month, setters, availability predicate — because whatever it returns is semver-covered |

## State Ownership

| State | Owner | Consumer access |
|---|---|---|
| Value | Root, `useControlled` | `value` / `defaultValue` / `onValueChange` |
| Draft (scale switch, typing) | Root, internal | never emitted; readable from `useCalendar()` |
| Scale | Root, `useControlled` | `scale` / `defaultScale` / `onScaleChange` / `scales` |
| Popover open | Root, `useControlled` | `open` / `defaultOpen` / `onOpenChange` |
| Visible month | Root, `useControlled` | `month` / `defaultMonth` / `onMonthChange` |
| Active range field | Root, internal | `.Input` reads it from context |
| Typed text and validity | `.Input` | `onValidityChange` on `.Input` |
| Focus and dismissal | Base UI `Popover` | — |

**The last row is the point of the exercise.** `use-picker-popover.ts` is deleted, because its three stated reasons dissolve:

| Its reason | Why it goes |
|---|---|
| `Select` portals look "outside" to a naive dismiss handler | `.Caption`'s scroller is ours; no `Select` is mounted anywhere |
| `onOpenChange` identity churn re-bound the store subscriber | `useControlled` returns a stable setter |
| `trigger-press` double-fire between `onFocus` and `useClick` | `.Trigger` owns opening — *provided we do not re-create the race* |

**That race is the largest implementation risk in this RFC.**

- The date picker must keep opening on focus
- Today the input's `onFocus` opens while Base UI's `useClick` toggles, and the two fight — that is most of what the 185 lines suppress
- In the rewrite: `.Trigger` owns opening, `.Input` never calls `setOpen` from a focus handler, and focus-to-open arrives as a Base UI trigger option rather than a second handler
- **Phase 2 does not exit until that is demonstrated in a real browser** — jsdom is what let the original regression through

**Commit**

| Trigger | Effect |
|---|---|
| Cell click, Enter, blur, outside click | Commits |
| Scale switch, typing | Sets the draft; emits nothing |
| Escape | Drops the draft, restores the input from `value` |
| Range, incomplete | Emits nothing; half-built state stays internal, readable from context for the track styling |

There is no Apply button and no `commit` prop.

## Field Integration

- `.Input` calls the non-throwing `useFieldContext()` exactly as `Input` does, so `required` and `aria-invalid` wire up by composition
- Replaces the `onErrorChange` → lift-into-`Field.error` dance the current docs prescribe
- Removes the need for `FilterChip`'s hashed-class CSS
- Every other convention followed is an existing library pattern, listed with its source in [Appendix A](#appendix-a--implementation-reference)
- Two deliberate departures: **no `slotProps`**, and **`render` instead of `children`-as-function**
- **Vocabulary note:** `Scale` is *not* `DataView`'s `TimelineScale` (`'day' | 'week' | 'month' | 'quarter'`) — that carries `week`, which the calendar does not, and lacks half-year and year, which it does. Same word, different members; the two must not be unified

## Architecture

### The date adapter

One module owning every date-library call, exporting `dayKey()`, `epoch()` and `parseKey()`, built on **date-fns + `@date-fns/tz`**.

| Job | Effect |
|---|---|
| Import-order dependence goes away | The plugin set is one fact in one place, so the 0.49.0 `TypeError` class becomes impossible. Both `filter-operations` modules migrate onto it |
| Identity churn goes away internally | Comparisons, memo keys and effect dependencies use day-keys, so the three `biome-ignore`s and the unguarded loop have nowhere to live |
| The library becomes swappable | The exported surface is identical whichever library backs it — reversible in one file |

**Why date-fns over dayjs**

- RDP depends on `date-fns` and `@date-fns/tz` unconditionally and Base UI peers them, so they already ship — **dayjs is a pure addition**
- The period maths this RFC needs is built in and leap-year correct; dayjs needs the `quarterOfYear` and `advancedFormat` plugins — two more `extend()` calls of exactly the kind this file exists to eliminate
- One implementation shared with the grid, rather than two libraries that can disagree about DST
- Neither has half-year helpers; that derivation is ours either way, in `lib/scale.ts` with its tests
- `dayjs` is bumped for the overlap window and **deleted at phase 6**

### The react-day-picker boundary

- **RDP earns its place for the day grid** — roving-tabindex navigation, week construction, outside days, locale weekday order and range modifier maths are solved and tested there, and a11y regressions in a date grid are expensive
- **What changes is the boundary.** RDP lives behind `calendar-preview-grid.tsx` only, driven by derived props, with `hideNavigation` and `captionLayout='label'` so it never mounts a `Select`
- `mode`, `selected`, `onSelect`, `required`, `month`, `onMonthChange` and `timeZone` come from root context and are **not in `GridProps` at all** — so nothing is force-overridden after a consumer spread and spread-last holds, for the first time in this family
- `.Day` and `.Weekday` bind to RDP's `DayButton` and `Weekday` component slots

## Dependencies

Verified against the npm registry and `pnpm-lock.yaml` on 3 September 2026.

| Package | Manifest | Lockfile | Latest |
|---|---|---|---|
| `react-day-picker` | `^9.6.7` | 9.6.7 | **10.0.1** |
| `@base-ui/react` | `~1.6.0` | 1.6.0 | **1.7.0** |
| `@base-ui/utils` | `~0.3.1` | 0.3.1 | **0.3.2** |
| `dayjs` | `^1.11.20` | 1.11.20 | **1.11.23** |

- **RDP 10 is no longer independent of this rewrite.** The `mode`/`required` union is unchanged 9.6.7 → 10.0.1 — verified by diffing the tarballs, where `types/selection.d.ts` gained JSDoc only — so the upgrade does not by itself fix the union
- But `.Day` and `.Weekday` bind to RDP's component-override slots and `.Grid` runs with `hideNavigation`, so those slot names must be checked against whichever major we ship. **It should land before phase 2**
- v10 also drops `date-fns-jalali` and the 16 `@deprecated` v8-era props, none of which we reference
- `@base-ui/react` 1.7.0 pins `@base-ui/utils` at exactly 0.3.2, so bumping Base UI moves utils with it
- Neither 1.6.0 nor 1.7.0 exports a date primitive; both ship `./internals/temporal` plus date-fns and Luxon adapters, and `date-adapter.ts` is shaped to that surface — adopting theirs later is a one-file swap, not a third rewrite

## Breaking Changes

Accepted, with no shim. Slot map and prop-by-prop migration: [Appendix A](#appendix-a--implementation-reference).

**Three changes are behavioural, not structural — a codemod cannot find them:**

| | Was | Is |
|---|---|---|
| **Ranges emit only on completion** | Fired every step with a partial `{ from?, to? }`; docs said to gate on `range.to` | Fires with a complete range or not at all. `to` is no longer nullable. Anyone relying on the first-click event loses it |
| **Bounds no longer clamp navigation** | `startMonth` / `endMonth` limited how far the user could navigate | `minDate` / `maxDate` limit **selection**. Out-of-range periods disable; the view still moves |
| **A read-only endpoint needs a value** | `lock` gated the whole picker | `readOnly` on one `.Input`. With no value on that endpoint the range cannot complete, so nothing emits |
| **`mode="multiple"` is removed** | `Calendar` accepted `mode="multiple"` with `selected: Date[]` — shipped, documented public API | No equivalent at v1. Anyone selecting an arbitrary set of dates has no upgrade path until `selection='multiple'` ships. **Needs a consumer search before phase 6**, since deleting `components/calendar/` is what actually takes it away |

**Every call site becomes a composition**, because the recipes were cut — mechanical, but a JSX expansion rather than a rename, so the codemod needs re-testing:

```tsx
<DatePicker value={d} onSelect={setD} />
// becomes
<CalendarPreview value={d} onValueChange={setD}>
  <CalendarPreview.Trigger><CalendarPreview.Input /></CalendarPreview.Trigger>
  <CalendarPreview.Content><CalendarPreview.Days /></CalendarPreview.Content>
</CalendarPreview>
```

**Landing with the rewrite, not after it**

| Target | Work |
|---|---|
| `FilterChip` | Rewrite to compose parts. Deletes `toDateValue()`, the shallow `slotProps.input` merge, and two dead hashed-class CSS rules |
| `DataView` | Add the `filterProps.calendar` slot that CHANGELOG 0.49.0 already claims exists |
| `filter-operations` ×2 | Move onto `date-adapter.ts` — **with tests**, since dayjs's `customParseFormat` is lenient where date-fns `parse` is stricter |
| Slot rename | Slot names embed the `calendar-preview-` prefix, so renaming to `Calendar` at phase 6 is itself breaking |

## Plan

- The three migrated components reach parity **before** the scale surface is built
- Phases 1–2 deliver `Calendar`, `DatePicker` and `RangePicker` as compositions with the full current feature set
- Phase 3 adds scale-aware selection on top of a root that already works
- The scale model is specified now because it determines the value contract and a contract cannot be retrofitted — **but it ships second**

| Phase | Content | Exit criteria |
|---|---|---|
| **0. Scale maths** | `lib/scale.ts`, `lib/parse.ts` | Pure functions, no UI. Leap years, month-end snapping, period boundaries, round trips and availability on both edges. Own PR |
| **1. Foundation** | `date-adapter.ts`, context, root, `Trigger`, `Content`, `Grid`, `Days` | An inline calendar renders; `data-slots.test.tsx` green |
| **2. Inputs** | `Input`, `Header`, `Caption`, `Reset`, `Footer`, `useCalendar()` | Parity with today's pickers, `date-picker.test.tsx` ported, **focus-to-open demonstrated in a real browser** |
| **3. Scales** | `Scales`, `Scale`, `Panel`, `Picker`, `Months`, `Quarters`, `HalfYears`, `Years` | Scale switching, the draft, and all four period views work against `lib/` |
| **4. Integrations** | `FilterChip`, `DataView` filter slot, `filter-operations` | No `slotProps` merge, no hashed-class CSS |
| **5. Docs and ship** | `index.mdx`, `demo.ts` **with a playground**, `props.ts`, CHANGELOG | All eight `SKILL.md` items pass |
| **6. Removal** | Delete `components/calendar/`, drop the old exports and `dayjs` | One release after phase 5 |

## Testing

- [ ] `lib/scale.ts` at full branch coverage **before phase 1 begins**
- [ ] Builds clean; `pnpm --filter @raystack/apsara test components/calendar-preview` green; docs site builds
- [ ] `displayName` on every part
- [ ] `data-slot` **and** the state `data-*` attributes on every rendered element, covered by `data-slots.test.tsx` (portaled parts asserted against `document.body`)
- [ ] CSS uses `--rs-*` tokens only — **zero** `Todo: var does not exist`
- [ ] Alphabetical export in `packages/raystack/index.tsx`; interactive `playground` in `demo.ts`
- [ ] **Zero `biome-ignore`** and **zero `slotProps`**; every part spreads `...props` last
- [ ] `open` / `onOpenChange` on the root; `use-picker-popover.ts` deleted
- [ ] **Focus-to-open verified in a real browser**, and **zero `Select`s mounted**
- [ ] Every current regression test ported, or explicitly retired with a stated reason

## Open Items

| # | Question | Decide by |
|---|---|---|
| 1 | **Typing the `scales` discriminator.** `'day' \| ['day']` versus "any other set" is awkward to express so that `['day','month']` narrows correctly. May need a helper type or an explicit second prop | Phase 1 |
| 2 | **`.Picker`'s name.** It renders the popup body. `.Picker` overloads the old `DatePicker` vocabulary; `.Field` collides with Apsara's `Field`. `.Body` and `.Editor` are the alternatives | Phase 3 |
| 3 | **`selection='multiple'`.** Adding a third union arm later is additive and breaks nobody, so v1 can ship without it — **but `Calendar mode="multiple"` exists today**, so this is a removal, not a gap. Search the consuming repos before phase 6: if anything uses it, it has to ship first | Before phase 6 |
| 4 | **Announcing the break.** No changesets setup exists, and `package.json` reads `0.48.0` while `CHANGELOG.md` already carries a `0.49.0` section. A `data-slot` rename has nothing but reviewer vigilance behind it | Phase 5 |

**Two costs are accepted rather than open:**

| Cost | Detail |
|---|---|
| `Date` stays public on the migrated three | The UTC-midnight display bug (`new Date('2026-08-01')` renders as 31 July at negative offsets) and `Date` identity churn remain in their public surface. `dayKey()` addresses the churn internally, not the display bug. A future major should revisit |
| The phase 6 rename is a second break | Slot names carry the `calendar-preview-` prefix |

## Alternatives

| Alternative | Verdict |
|---|---|
| **Patch the existing components again** | Rejected. #819 was already a coordinated overhaul fixing 18 P0/P1 bugs, and three fix PRs have landed since. Every theme in that changelog is a *contract* problem, and patches cannot supply a missing contract |
| **`'YYYY-MM-DD'` strings for every component** | Rejected for v1. Kills timezone ambiguity and identity churn outright, but breaks every call site including `FilterChip` and `DataTable`'s filter types, and the migration stops being mechanical. Adopted where there is no debt to pay |
| **One `scale` prop, plain `Date` value** | Rejected. Makes "August 2026" and "1 August 2026" the same value, cannot say what a stored date meant after a reload, and lets `value` and `scale` be set inconsistently |
| **One period view switched by a root prop** | Rejected. Cannot render a quarter-only picker without a root prop, and four layouts branch inside one component |
| **Ship the pre-composed recipes** | Rejected. Nothing in the library hangs a pre-composed assembly off a root, and `.Input` beside `.DatePicker` in one namespace reads badly. Parts that render their own defaults give the same brevity without a second tier |
| **Own the day grid; drop react-day-picker** | Rejected for v1, on a11y risk. Revisit if the boundary proves leaky |
| **Build on a Base UI date primitive** | Not available — verified at 1.6.0 and 1.7.0 |

---

# Appendix A — Implementation Reference

### Selection arms

```tsx
interface SingleDayProps extends CalendarPreviewBaseProps {
  selection?: 'single';
  scales?: 'day' | ['day'];
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (value: Date | null, details: ChangeDetails) => void;
}

interface SingleScaleProps extends CalendarPreviewBaseProps {
  selection?: 'single';
  scales: Scale | Scale[];              // see Open Item 1
  value?: ScaleValue | null;
  defaultValue?: ScaleValue | null;
  onValueChange?: (value: ScaleValue | null, details: ChangeDetails) => void;
}

interface RangeProps extends CalendarPreviewBaseProps {
  selection: 'range';
  scales?: 'day' | ['day'];
  value?: DateRangeValue | null;        // { from: Date; to: Date } — no nulls
  defaultValue?: DateRangeValue | null;
  onValueChange?: (value: DateRangeValue | null, details: ChangeDetails) => void;
}
```

### Part props

| Part | Element | Key props |
|---|---|---|
| `.Trigger` | `div` | `render`. Renders the formatted value or the empty-state label. Never a `<button>` |
| `.Input` | Apsara `Input` | `field`, `placeholder`, `onValidityChange`, `readOnly`, `Input` props. Parses every scale it is offered — `20/05/2027`, `May 2027`, `Q4`, `H1 2026`, `2025` — and moves the scale to match |
| `.Content` | Base UI `Popover.Popup` | `Popover.Content` props. Hosts the 320px scroll bound |
| `.Picker` | `div` | — Renders `.Label`, `.Input`, `.Scales`, `.Panel` when childless |
| `.Label` | `label` | `children` |
| `.Scales` | Apsara `Tabs` | — Renders nothing when `scales` has one entry |
| `.Scale` | `button` | `value`, `render`. Only needed to relabel or reorder |
| `.Panel` | `div` | — Renders the five views when childless; each self-gates |
| `.Days` | `div` | `numberOfMonths`. Hugs its content |
| `.Header` | `div` | `align`. Composes `PrevMonth`, `Caption`, `Reset`, `NextMonth` by default |
| `.Caption` | `button` / `span` | `dropdown` |
| `.Reset` | Apsara `Button` | `render` |
| `.Grid` | RDP `DayPicker` | `fixedWeeks`, `showOutsideDays`, `showWeekNumber`, `weekStartsOn`, `modifiers`, `components`, `dateInfo`, `showTooltip`, `tooltipMessages`, `loading` |
| `.Day` / `.Weekday` | `button` / `th` | `render`. Bound to RDP's `DayButton` and `Weekday` slots |
| `.Months` `.Quarters` `.HalfYears` `.Years` | `div` | `columns`, `render`. 3 / 4 / 2 / 1 columns, 320px, scrolling |
| `.Footer` | `Flex` | `children` — a string or any node |

### File layout

```
packages/raystack/components/calendar-preview/
├── index.tsx                     # re-export only
├── calendar-preview.tsx          # Object.assign composition
├── calendar-preview-root.tsx     # state, context provider
├── calendar-preview-context.tsx  # part-aware throwing hook
├── use-calendar.tsx              # the public hook
├── calendar-preview-grid.tsx     # the ONLY file importing react-day-picker
├── calendar-preview-<part>.tsx   # one per part
├── lib/
│   ├── scale.ts                  # periodOf, anchorOf, convertScale, isAvailable
│   └── parse.ts                  # multi-scale input parsing
├── date-adapter.ts               # ALL date-library setup
├── calendar-preview.module.css
└── __tests__/                    # scale, parse, calendar-preview, data-slots
```

### Conventions this follows

`Object.assign` composition, `displayName` shape, plain function components, `<Ctx value>`, `data-slot` before the spread and the rest of the `SKILL.md` checklist apply as they do to any new component. The choices worth naming are the ones that are not automatic:

| Convention | Canonical source |
|---|---|
| Sibling view parts that self-gate on the active view | `DataView`'s `.List` / `.Timeline` / `.Custom` |
| Children override context-computed content | `Tour.Title` |
| A consumer hook exported from the barrel | `useTour`, `useSidebar`, `useDataView`, `useDataTable`, `useTheme`, `useToastManager`, `useChatMessages` |
| Base UI `render`, never `asChild`; `useRender` + `mergeProps` for DOM parts | `composition.md`; `sidebar/sidebar-item.tsx` |
| `useControlled` for every controlled/uncontrolled pair | `tour/tour-root.tsx` |
| `part`-aware throwing context hook; generic value stored as `unknown` | `useChatPanelContext(part)`; `combobox/combobox-root.tsx` |
| Discriminated union for selection variants | `SelectRootProps` |

### `data-slot` map

`SKILL.md` makes slot names semver-covered public API. The current 23 all have a mapping, and because `CalendarPreview` is a new name this is purely additive — the old slots keep working while the old family ships.

| Old | New |
|---|---|
| `calendar` | `calendar-preview-grid` |
| `calendar-month-grid` | `calendar-preview-weeks` |
| `calendar-grid-table` / `-skeleton` | `calendar-preview-table` / `-skeleton` |
| `calendar-day`, `-day-info`, `-day-number`, `-day-tooltip` | prefix change only |
| `calendar-nav-next` / `-previous` | `calendar-preview-next-month` / `-prev-month` |
| `calendar-dropdown` / `-content` | `calendar-preview-caption` / `-caption-popup` |
| `date-picker-trigger`, `range-picker-trigger` | `calendar-preview-trigger` |
| `date-picker-positioner`, `range-picker-positioner` | `calendar-preview-positioner` |
| `date-picker-content`, `range-picker-content` | `calendar-preview-content` |
| `date-picker-input` | `calendar-preview-input` |
| `range-picker-start-input` / `-end-input` | `calendar-preview-input` + `data-field` |
| `range-picker-trigger-group` | removed — the two inputs are independent roots |
| `range-picker-footer` | `calendar-preview-footer` |

New: `-picker`, `-label`, `-scales`, `-scale`, `-separator`, `-panel`, `-days`, `-header`, `-caption`, `-reset`, `-weekday`, `-months`, `-quarters`, `-half-years`, `-years`, `-period-cell`.

### Prop migration

| Today | Rewrite |
|---|---|
| `dateFormat="DD/MM/YYYY"` | `formatValue={…}` |
| `slotProps.input` / `.popover` / `.calendar` | props on `.Input` / `.Content` / `.Grid` |
| `slotProps.startInput` / `endInput` | `<.Input field="start" />` / `field="end"` |
| `inputProps` / `inputsProps` / `calendarProps` / `popoverProps` (deprecated) | removed — the deprecation window closes here |
| `calendarProps.startMonth` / `endMonth` | root `minDate` / `maxDate` — **selection, not navigation** |
| `calendarProps.captionLayout="dropdown"` | `<.Caption dropdown />`; default on the standalone calendar |
| `numberOfMonths` | `<.Days numberOfMonths={2} />` |
| `weekStartsOn`, `showOutsideDays`, `showWeekNumber`, `fixedWeeks`, `modifiers` | props on `.Grid` |
| `dateInfo={{ '17-04-2024': … }}` | `dateInfo={(date) => …}` on `.Grid` — the record form is gone |
| `tooltipMessages={{ … }}` | `tooltipMessages={(date) => …}` on `.Grid` — same treatment |
| `loadingData` | `loading` on `.Grid` |
| `children={({ selectedDate }) => …}` | `<.Trigger render={…} />` |
| `footer={<Presets />}` | `<.Footer>` |
| `onErrorChange` | `onValidityChange` on `.Input`, or compose in `Field` |
| `pickerGroupClassName` | `className` on the element wrapping the two inputs |
| `DateRange` from `react-day-picker` | `DateRangeValue` from `@raystack/apsara` |
| whole-picker disable via one input | `readOnly` on one `.Input` |

---

# Appendix B — Evidence

Citations point at types, named effects, source comments and changelog headings rather than line numbers, so they survive the next merge from main.

### The 185 lines

- Six refs — two DOM handles, two internal flags, two mirrors of state and props kept purely so callback identities stay stable
- Three suppression branches inside a single `onOpenChange`: one swallows the dropdown's own open-change, one swallows `trigger-press` closes because Base UI's `useClick` toggles against the input's `onFocus`, one swallows redundant re-opens
- A handler named `handleMouseDown` registered on `'mouseup'`
- An uncleaned `setTimeout`
- A `setIsOpen` returned from the hook that neither picker ever calls
- The file's header comment names its own two reasons: `captionLayout='dropdown'` renders `Select`s whose portals look "outside" to a naive dismiss handler, and `isOpen` is read through a ref because Base UI's store subscriber re-binds on `onOpenChange` identity change and looped on mount

### Why spread-last is unsatisfiable

- `required` discriminates RDP's prop union, so a widened value breaks the narrowing
- That forces `required` to be pinned after the consumer spread — `true` in `range-picker.tsx`, `false` in `date-picker.tsx` — and seven more keys with it: `timeZone`, `onDropdownOpen`, `mode`, `month`, `selected`, `onSelect`, `onMonthChange`
- Three of those — `month`, `onMonthChange`, `timeZone` — are reachable through `slotProps.calendar` because they live in RDP's `PropsBase`, so a consumer can pass them and watch them vanish

### The unguarded effect

```tsx
// date-picker.tsx
useEffect(() => {
  if (popover.isOpen) {
    setViewMonth(calendarProps?.defaultMonth ?? selectedDate ?? new Date());
  }
}, [popover.isOpen, selectedDate, calendarProps?.defaultMonth]);
```

- `calendarProps` is a fresh object literal every render — `{ ...legacyCalendarProps, ...slotProps?.calendar }`
- So an inline `slotProps={{ calendar: { defaultMonth: new Date(2025, 0) } }}` yields a fresh `Date` identity per render → effect refires → `setViewMonth` → re-render → loop
- Its three siblings were hardened with `biome-ignore` comments reading *compare on timestamp, not Date identity*; this one was missed

### How `FilterChip` absorbs the cost

| Route | Effect |
|---|---|
| Shallow `slotProps.input` merge | A consumer-supplied `classNames` object **replaces** the chip's own, dropping its container class and breaking layout |
| `showCalendarIcon={false}` before the spread | Exactly as `SKILL.md` prescribes — so a consumer can re-enable the icon and break the chip |
| Two `[class*="…"]` CSS rules | Reach at what they assume are `Input`'s hashed class names for `helper-text` and `input-error-wrapper`. Those strings appear nowhere else in the repo, and `Input` renders no such element — both rules are dead code suppressing nothing |

### Published types are wrong

- `props.ts` types `slotProps.calendar` as the full docs `CalendarProps`, including `mode`, `selected`, `onSelect` and `footer` — none of which the real slot type accepts
- The barrel exports `RangePicker` but **not** `RangePickerProps` or `RangePickerSlotProps`, so consumers cannot type a `RangePicker` wrapper
- `pickerGroupClassName` is undocumented
- Five of the six deprecated props are absent from `props.ts` entirely; the one that is documented, `calendarProps`, is the only one carrying an `@deprecated` marker there. All six are marked in the source

### A documented integration was never built

- CHANGELOG 0.49.0 claims `DataTable` / `DataView` columns gained `filterProps.calendar`
- `data-view.types.tsx` has only `filterProps?: { select?: BaseSelectProps }`
- The slot exists solely on `DataTable`, which is `@deprecated`

### `dayjs.extend()` is import-order dependent

- Four modules extend independently
- `range-picker.tsx` extends nothing and rides on `calendar.tsx` importing first
- `date-picker.tsx` forwards `timeZone` without extending `utc` / `timezone`
- Ordering is enforced by a comment
- This is the failure class behind the 0.49.0 P0 — a `TypeError` on every keystroke — and two tests guard it

### Partial range disable is impossible today

- Disabling either input gates the whole picker, because the state machine rewrites both `from` and `to` regardless of which input was clicked
- Two tests assert the gate
- The source comment and CHANGELOG 0.49.0 both say to constrain the calendar instead

### Two `SKILL.md` checklist items fail

- CSS carries three `Todo: var does not exist` markers, a hardcoded `max-height: 260px`, and eight `var(--rs-space-10, 40px)` fallbacks
- There is no interactive `playground` in `demo.ts` — 54 other components have one

### Month/year nav is off by default but demoed

- In `range-picker.tsx`, `'dropdown'` mounts Apsara `Select`s whose unmount loops with "Maximum update depth"
- `date-picker.runtime.test.tsx` still asks for real-browser verification and credits a `useMemo` that no longer exists — `date-picker.tsx` has zero
- The "With Dropdowns" demo shows the feature on a standalone `<Calendar />` with nothing marking it unsafe inside a picker

## Helpful Links

- [Calendar docs page](https://apsara.raystack.org/docs/components/calendar)
- [PR #819 — the coordinated calendar overhaul](https://github.com/raystack/apsara/pull/819)
- [react-day-picker v10 release notes](https://daypicker.dev/)
- In-repo: `.agents/skills/apsara/references/composition.md`, `.agents/skills/add-new-component/SKILL.md`