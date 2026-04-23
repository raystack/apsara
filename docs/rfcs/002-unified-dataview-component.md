---
ID: RFC 002
Created: April 23, 2026
Status: Draft
RFC PR: https://github.com/raystack/apsara/pull/752
---

# Unified DataView Component

This RFC proposes replacing the current `DataTable` with a unified `DataView` root that owns data-modeling state and exposes swappable renderer subcomponents (Table, List, Timeline, Custom), so the same query/filter/sort/group/search state can drive multiple presentations.

## Table of Contents

- [Unified DataView Component](#unified-dataview-component)
  - [Table of Contents](#table-of-contents)
  - [Background](#background)
    - [Current Problems](#current-problems)
  - [Proposal](#proposal)
  - [Why a Unified DataView?](#why-a-unified-dataview)
  - [Pros and Cons](#pros-and-cons)
    - [Pros](#pros)
    - [Cons](#cons)
  - [Differences and Analysis](#differences-and-analysis)
    - [General Differences from DataTable](#general-differences-from-datatable)
      - [Root Owns Data, Renderers Own Presentation](#root-owns-data-renderers-own-presentation)
      - [`columns` Renamed to `fields` on Root](#columns-renamed-to-fields-on-root)
      - [Explicit Toolbar Composition](#explicit-toolbar-composition)
      - [Unified Column Visibility via `DisplayAccess`](#unified-column-visibility-via-displayaccess)
      - [Virtualization as a Prop, Not a Component](#virtualization-as-a-prop-not-a-component)
    - [Renderer-Specific Differences](#renderer-specific-differences)
      - [Table](#table)
      - [List](#list)
      - [Timeline](#timeline)
      - [Custom](#custom)
      - [Grouping](#grouping)
  - [Table of Comparison](#table-of-comparison)
  - [Impact](#impact)
  - [Discarded Approaches and Considerations](#discarded-approaches-and-considerations)
    - [Rejected Alternatives](#rejected-alternatives)
    - [Scoped-Out Decisions](#scoped-out-decisions)
  - [Helpful Links](#helpful-links)

## Background

Apsara currently ships a single data-presentation primitive: `DataTable` (`packages/raystack/components/data-table/`). It bundles two layers that are conceptually separate:

- **Data-modeling layer** — query state (`filters`, `sort`, `group_by`, `search`, `offset`, `limit`), client-vs-server mode, row model derivation via TanStack Table.
- **Tabular rendering layer** — table header/body/row/cell DOM, column visibility UI, virtualization, sticky group headers.

Consumer apps increasingly need non-tabular presentations of the same data: list views (person cards), timeline / Gantt views (range bars on a time axis), and ad-hoc custom renderers (Kanban, Gallery, Map). Today each of these would have to re-implement the data-modeling layer from scratch.

### Current Problems

- **Layer 1 is not reusable.** Query state, filter predicates, client/server mode, `groupData`, and the `useFilters` hook all live inside `DataTable` and cannot drive any non-tabular renderer without duplication.
- **No cross-view state persistence.** A user who applies filters/sorts in a tabular view and switches to a list/timeline view loses that state because each view owns its own data layer.
- **Grouping is accessor-only.** `groupData()` groups by a plain `accessorKey` string. Timeline-style bucketing (by day/week/month) or "updated this week / earlier" grouping in a list view is not expressible.
- **Visibility story does not generalize.** Column visibility is hard-coded to `<td>` collapse in the table renderer; non-columnar renderers (timeline bars, custom cards) have no uniform way to react to the Display Properties toggle, so the control silently no-ops for them.
- **Table-specific concerns leak into shared state.** `stickyGroupHeader`, `VirtualizedContent` as a separate export, and `shouldShowFilters` mixing data-layer checks with `table.getRowModel()` all blur the line between data and presentation.

**Roughly 80% of today's `DataTable` logic is already renderer-agnostic; the work is largely an extraction + renaming exercise rather than a rewrite.**

## Proposal

We propose introducing a single `DataView` root that owns the data-modeling layer, alongside swappable renderer subcomponents for presentation:

- `DataView.Toolbar`, `DataView.Search`, `DataView.Filters`, `DataView.DisplayControls` — presentation-agnostic controls that read/write query state through context.
- `DataView.Table` — the current tabular renderer, unchanged in behavior. Takes a `columns` prop of `DataViewTableColumn<TData>[]`.
- `DataView.List` — CSS `grid` + `subgrid` renderer. Shares the column-spec shape with Table (drops `header`, adds a grid-track `width`).
- `DataView.Timeline` — variable-width range bars on a continuous time axis (Gantt-style). Takes `startField`, `endField`, `renderBar`.
- `DataView.Custom` — escape hatch; render lives in children, context is passed as argument.
- `DataView.DisplayAccess` — foundational visibility primitive: wraps any JSX and gates it on the current `columnVisibility` state so non-columnar renderers honor the same Display Properties toggle.

Target API:

```tsx
<DataView data={rows} fields={fields} defaultSort={{ name: 'createdAt', order: 'desc' }}>
  <DataView.Toolbar>
    <DataView.Search />
    <DataView.Filters />
    <DataView.DisplayControls />
  </DataView.Toolbar>

  {/* pick one — or switch between them with a tab/toggle */}
  <DataView.Table columns={tableColumns} />
  <DataView.List  columns={listColumns} />
  <DataView.Timeline
    startField="startDate"
    endField="endDate"
    renderBar={(row) => (
      <Flex gap={2}>
        <DataView.DisplayAccess accessorKey="title">
          <Text>{row.getValue('title')}</Text>
        </DataView.DisplayAccess>
        <DataView.DisplayAccess accessorKey="priority">
          <Chip>{row.getValue('priority')}</Chip>
        </DataView.DisplayAccess>
      </Flex>
    )}
  />
  <DataView.Custom>{(api) => /* ... */}</DataView.Custom>
</DataView>
```

The migration will preserve the existing `DataTable` export as a thin alias over `<DataView>` + `<DataView.Table>` through at least one major version, so consumers can migrate incrementally.

## Why a Unified DataView?

A `DataView` root with swappable renderers is the right fit for Apsara's needs:

- **Headless core already exists.** TanStack Table (already a dependency) is headless — the `table` object produces a `Row<T>` tree from `data + column defs + state` and emits no DOM. The same row model can drive Table, List, Timeline, or anything else.
- **Presentation-agnostic logic is already >80% of the surface.** Query state, filter predicates (`filterOperationsMap`), `useFilters`, wire-format translation (`transformToDataTableQuery` / `dataTableQueryToInternal`), client/server mode — all of it reuses as-is.
- **Cross-renderer state persistence comes for free.** Because filters/sort/search live on context, switching from Table to List to Timeline inside one `DataView` preserves the user's query state with zero wiring.
- **Familiar composition pattern.** Same `<Root>.<Part>` idiom already used by every Apsara primitive (Dialog, Popover, Select, etc.) — no new mental model.
- **Open to future renderers.** `DataView.Custom` + shared context supports Kanban, Gallery, Map, or a third-party `<MyOrg.DataViewKanban>` without any root changes.
- **No new dependency.** TanStack Table is already used by `DataTable`; this RFC only restructures how its output is consumed.

## Pros and Cons

### Pros

- **Code reuse**: One data layer serves every renderer. Eliminates the duplicate-or-fork tax on new presentation formats.
- **Consistent UX**: Filters, search, sort, grouping, and display-visibility work identically across Table/List/Timeline/Custom.
- **Cross-view state persistence**: Users can toggle between renderers in the same `<DataView>` without losing query state.
- **Unified visibility story**: One `DisplayControls` component drives both columnar (Table/List) and non-columnar (Timeline, Custom) renderers via `<DataView.DisplayAccess>`.
- **Cleaner separation of concerns**: Props live where they're read — renderer knobs on the renderer, data-layer concerns on the root.
- **Non-breaking migration path**: `DataTable` stays as an alias; most work is additive (new renderers), not refactor.
- **Richer grouping**: Function resolvers unlock "group by week", "group by status bucket", etc. — impossible with today's accessor-only API.
- **Future-proof**: `DataView.Custom` + `DisplayAccess` handle any future renderer without touching the root type.

### Cons

- **Surface area grows**: Three new renderer components (List, Timeline, Custom) plus `DisplayAccess` need to be designed, documented, and tested.
- **Two API shapes at once**: During migration, both `DataTable` (alias) and `DataView` (new) co-exist. Cognitive cost for consumers until the alias is removed.
- **Timeline complexity**: Two-axis virtualization + lane packing + time-axis math is genuinely new code (~15 lines for the packer, plus the axis component and virtualization glue).
- **DisplayAccess adoption**: Consumers building Timeline/Custom renderers must remember to wrap fields in `<DataView.DisplayAccess>`, or the Display Properties toggle silently no-ops for those renderers. Mitigated by a dev warning at mount.
- **Shared column-spec shape invites visual drift**: Table and List share the spec but need intentionally different chrome. Risk of the two bleeding into each other visually; handled by design-review per renderer and token-driven styling.

## Differences and Analysis

### General Differences from DataTable

#### Root Owns Data, Renderers Own Presentation

- `DataTable`: data props, render specs, and rendering all live on a single component.
- `DataView`: root takes only data-layer props (`data`, `fields`, `defaultSort`, `query`, `mode`, `isLoading`, `onQueryChange`, `onLoadMore`, `onItemClick`, ...). Each renderer subcomponent takes its own render spec (`columns` for Table/List; `startField`/`endField`/`renderBar` for Timeline).

```tsx
// Before
<DataTable data={rows} columns={cols} defaultSort={...} mode="client">
  <DataTable.Toolbar />
  <DataTable.Content virtualized />
</DataTable>

// After
<DataView data={rows} fields={fields} defaultSort={...} mode="client">
  <DataView.Toolbar>
    <DataView.Search />
    <DataView.Filters />
    <DataView.DisplayControls />
  </DataView.Toolbar>
  <DataView.Table columns={cols} virtualized />
</DataView>
```

> [!NOTE]
> **Analysis**
>
> Props live where they're read. `columns` is consumed only by column-based renderers (Table, List); `renderBar` only by Timeline. Declaring them on each renderer is the natural React shape and keeps the root type small.

#### `columns` Renamed to `fields` on Root

- `DataTable`: `columns` prop mixed field metadata (filterable, sortable, groupable) with cell/header renderers.
- `DataView`: `fields` on root carries only presentation-agnostic metadata. Cell/header renderers live on `columns` declared per-renderer (`DataView.Table`, `DataView.List`).

```ts
// Field — presentation-agnostic
interface DataViewField<TData> {
  accessorKey: Extract<keyof TData, string>;
  label: string;
  filterable?: boolean;
  filterType?: FilterTypes;
  sortable?: boolean;
  groupable?: boolean;
  hideable?: boolean;
  defaultHidden?: boolean;
  // ... filter capability, group presentation
}

// Renderer column — pure reference + cell rendering
interface DataViewTableColumn<TData, TValue = unknown> {
  accessorKey: Extract<keyof TData, string>;  // pointer into fields[]
  cell?:   ColumnDef<TData, TValue>['cell'];
  header?: ColumnDef<TData, TValue>['header'];
  classNames?: { cell?: string; header?: string };
  styles?:     { cell?: CSSProperties; header?: CSSProperties };
}
```

> [!NOTE]
> **Analysis**
>
> Disambiguates metadata (shared across renderers) from render spec (per-renderer). Also renames `enableColumnFilter` → `filterable` et al. to drop table-speak. Old prop names can be kept as aliases for one release.

#### Explicit Toolbar Composition

- `DataTable`: `<DataTable.Toolbar />` auto-renders `Filters + DisplaySettings`; `Search` is a separate peer.
- `DataView`: user composes children explicitly.

```tsx
// Before — Toolbar is opaque
<DataTable.Toolbar />
<DataTable.Search />

// After — explicit composition
<DataView.Toolbar>
  <DataView.Search />
  <DataView.Filters />
  <DataView.DisplayControls />
  {/* user can also add: <Button>Export</Button>, bulk-action chips, etc. */}
</DataView.Toolbar>
```

> [!NOTE]
> **Analysis**
>
> Lets consumers place search outside the toolbar (common in master-detail layouts), add custom actions (bulk actions, "Export", "New"), and reorder elements. Small cost in verbosity; large gain in flexibility.

#### Unified Column Visibility via `DisplayAccess`

- `DataTable`: column visibility is local TanStack state; only the `<td>` renderer reacts to it.
- `DataView`: `columnVisibility` + `setColumnVisibility` are lifted onto context. Table and List gate columns internally (hidden grid tracks / `<td>` collapse). Timeline and Custom use `<DataView.DisplayAccess>` to wrap any JSX and reactively hide/show it.

```tsx
// Inside a Timeline bar
<DataView.Timeline
  startField="start"
  endField="end"
  renderBar={(row) => (
    <Flex>
      <DataView.DisplayAccess accessorKey="priority">
        <Chip>{row.getValue('priority')}</Chip>
      </DataView.DisplayAccess>
      <DataView.DisplayAccess accessorKey="title">
        <Text>{row.getValue('title')}</Text>
      </DataView.DisplayAccess>
    </Flex>
  )}
/>
```

> [!NOTE]
> **Analysis**
>
> Without this primitive, non-columnar renderers would each need a bespoke visibility mechanism — or the toggle would silently no-op. `DisplayAccess` is the one cross-renderer primitive consumers compose inside `renderBar` or custom renderers. Table/List don't need it at the call site — their `columns` already carry `accessorKey`, so the renderer gates visibility internally from the same context state. A dev warning fires at mount if a `hideable: true` field is referenced by neither a column spec nor any DisplayAccess instance.

#### Virtualization as a Prop, Not a Component

- `DataTable`: exports both `DataTable.Content` and `DataTable.VirtualizedContent` as separate components.
- `DataView`: virtualization is a prop on the renderer.

```tsx
// Before
<DataTable.VirtualizedContent rowHeight={44} overscan={5} />

// After
<DataView.Table virtualized rowHeight={44} overscan={5} />
```

> [!NOTE]
> **Analysis**
>
> Cleaner API. Both exports can coexist during migration.

### Renderer-Specific Differences

#### Table

- `DataTable.Content`: renders `<table><thead><tbody>` with `flexRender(columnDef.cell)` per cell, `columnDef.header` per header.
- `DataView.Table`: same renderer internals, same `flexRender` pipeline, same sticky group header, same virtualization. Difference is the source of its column spec (a local `columns` prop, not a root prop) and that it reads context for query state / visibility.

> [!NOTE]
> **Analysis**
>
> Behaviorally unchanged. The extraction is mechanical.

#### List

- `DataTable`: no list renderer exists today; consumers roll their own.
- `DataView.List`: shares the column-spec shape with Table (drops `header`, adds `width`). Renders rows inside a CSS `grid` container; each row is `display: subgrid; grid-column: 1 / -1` so cells align vertically across rows.

```ts
interface DataViewListColumn<TData, TValue = unknown> {
  accessorKey: Extract<keyof TData, string>;
  cell?:  ColumnDef<TData, TValue>['cell'];
  width?: string | number;                 // CSS grid track — '1fr' | '200px' | 'auto' | 'minmax(80px, 1fr)' | number(px)
  classNames?: { cell?: string };
  styles?:     { cell?: CSSProperties };
}
```

> [!NOTE]
> **Analysis**
>
> Column visibility works identically — `table.getVisibleLeafColumns()` already respects `ctx.columnVisibility`, so toggling a column off collapses its grid track across every row with no extra code. Swapping `<DataView.Table>` ↔ `<DataView.List>` is close to a tag change.

#### Timeline

- `DataTable`: no timeline renderer exists.
- `DataView.Timeline`: variable-width range bars on a continuous time axis. Uses `renderBar(row)` because a shared `grid-template-columns` can't fit both 1-day and month-long bars. Visibility inside the bar is composed via `<DataView.DisplayAccess>`.

```tsx
<DataView.Timeline
  startField: keyof TData         // required
  endField?:  keyof TData         // omitted → point marker; present → Gantt bar
  renderBar:  (row: Row<TData>) => ReactNode
  scale?:        'day' | 'week' | 'month' | 'quarter'
  today?:        boolean | Date
  lanePacking?:  'auto' | 'one-per-row'
  rowHeight?:    number
  laneGap?:      number
  viewportRange?:   [Date, Date]
  onViewportChange?: (range: [Date, Date]) => void
  renderLaneGroup?: (group: GroupedData<TData>) => ReactNode
/>
```

> [!NOTE]
> **Analysis**
>
> Timeline bypasses `groupData` and buckets internally (horizontal pixel math). Lane packing is a small, pure utility (`packLanes`, ~15 lines of greedy interval scheduling). Two-axis virtualization (time × lanes) is solvable with one `useVirtualizer` per axis. None of this leaks into the data layer.

#### Custom

- `DataTable`: escape hatch requires consumers to build their own root.
- `DataView.Custom`: receives the full context as a render prop argument; users emit any DOM they like.

```tsx
<DataView.Custom>
  {({ rows, fields, tableQuery, updateTableQuery, columnVisibility, ... }) => (
    <MyKanban rows={rows} onMove={next => updateTableQuery(q => ({...q, ...}))} />
  )}
</DataView.Custom>
```

> [!NOTE]
> **Analysis**
>
> Keeps the root surface small while supporting unbounded future renderers (Kanban, Gallery, Map, etc.). Third-party renderers compose cleanly via the same pattern.

#### Grouping

- `DataTable`: `group_by` is a list of `accessorKey` strings. `groupData()` groups by exact field value.
- `DataView`: `group_by` strings stay on the wire (so server-mode is unchanged), but an optional `groupByResolvers: Record<string, (row: TData) => string>` map on root lets string ids resolve to functions locally. Timeline can bypass `groupData` entirely and bucket by its own pixel math.

```ts
// Root prop
groupByResolvers?: Record<string, (row: TData) => string>;

// Example: "group by week of createdAt"
groupByResolvers={{
  createdAt_week: (row) => dayjs(row.createdAt).startOf('week').format('YYYY-[W]WW'),
}}
```

> [!NOTE]
> **Analysis**
>
> Keeps the wire format (`group_by: string[]`) intact while unlocking non-accessor buckets. Renderers that need bespoke grouping (Timeline) can ignore `group_by` and do their own thing — they still read the same filtered `rows`.

## Table of Comparison

| Concern | Today (`DataTable`) | Proposed (`DataView`) |
| :--- | :--- | :--- |
| Query state (`filters`, `sort`, `group_by`, `search`) | In `DataTable` | On `DataView` root context (unchanged shape) |
| Filter predicates (`filterOperationsMap`) | In `DataTable` | Reused as-is |
| Client/server mode | `mode: 'client' \| 'server'` | Same |
| Row model engine | TanStack Table | TanStack Table (unchanged) |
| Column/field metadata | `columns` prop | `fields` prop on root |
| Table cell/header renderers | `columns` prop | `columns` on `DataView.Table` |
| List renderer | Not available | `DataView.List` with grid/subgrid |
| Timeline / Gantt renderer | Not available | `DataView.Timeline` with `renderBar` |
| Custom renderer | Not supported | `DataView.Custom` |
| Toolbar composition | `<DataTable.Toolbar />` auto-renders Filters + DisplaySettings | Explicit children: `Search`, `Filters`, `DisplayControls`, custom actions |
| Virtualization | `DataTable.VirtualizedContent` (separate export) | `virtualized` prop on each renderer |
| Column visibility | TanStack local state, Table-only | Lifted to context; Table/List gate internally, Timeline/Custom use `<DataView.DisplayAccess>` |
| Grouping | `group_by: string[]`, accessor-only | Same wire format + optional `groupByResolvers` map |
| Sticky group header | `stickyGroupHeader` on root | Prop on `DataView.Table` (not in shared context) |
| Empty vs zero state | Per-renderer implementation | `emptyState` / `zeroState` props on each renderer; decision driven by root-computed `hasActiveQuery` |
| Infinite scroll (`onLoadMore`, `totalRowCount`) | `DataTable` | `DataView` root (renderer-independent); each renderer detects bottom-reached |

## Impact

- **1 component replaced + 4 new renderers added.** `DataTable` becomes a thin alias over `<DataView>` + `<DataView.Table>` during migration.
- **Consumers unlock non-tabular presentations with the same data layer.** Existing tabular usage is near-zero-change; list/timeline/custom views are net-new capabilities.
- **Prop surface grows on the renderer side, shrinks on the root side.** Net result is clearer separation of concerns.
- **Breaking changes for deep imports only.** Public `<DataTable>` keeps working through at least one major version.

## Discarded Approaches and Considerations

Several alternatives were evaluated and rejected, and a handful of ideas were deliberately scoped out of the root type. Capturing them here so the decisions don't have to be re-litigated.

### Rejected Alternatives

- **Hand-rolled query state + predicates (no TanStack).** Would mean reimplementing filter operators, stable sort, filter-from-leaf-rows, and expanded sub-rows. Pure churn for no user-visible gain, and TanStack Table is already a dependency. Kept as the engine.
- **`useReactTable` only for `DataView.Table`; bespoke hooks for List/Timeline.** Forks the filter-predicate path per renderer, and cross-renderer switches (Table ↔ List toggle) would have to re-derive state. Defeats the whole reason for extracting the data layer. Rejected.
- **`ag-grid` / `react-data-grid` / `material-react-table`.** Heavy, opinionated renderers that aren't pluggable at the DOM level. Wrong fit for a headless-core-plus-swappable-renderers architecture.
- **Putting renderer row specs (`columns`, `renderBar`) on the `DataView` root.** Considered for symmetry with today's `DataTable`. Rejected because each spec is consumed by exactly one renderer — declaring them on the root inflates the root type and makes third-party renderers (e.g. `<MyOrg.DataViewKanban>`) awkward. Props live where they're read.
- **Unifying Timeline's bar layout under the Table/List column spec.** Considered because it would mean one spec shape for all three renderers. Rejected because bars are variable-width: a `grid-template-columns` that fits a month-long bar overflows a 1-day bar. Timeline uses `renderBar` + `<DataView.DisplayAccess>` instead, which gives the same visibility story without forcing a column grid onto bar content.
- **Making Display Properties visibility a per-renderer concern.** Considered because Timeline/Custom are structurally different from columnar renderers. Rejected because users expect one Display Properties toggle to work everywhere; otherwise the control silently no-ops on non-columnar views. `<DataView.DisplayAccess>` (one context-reading wrapper) solves this with ~10 lines of shared code.

### Scoped-Out Decisions

- **`DataView.VirtualizedContent` as a separate export** — folded into `<DataView.Table virtualized />`. Two exports for the same renderer was redundant.
- **`stickyGroupHeader` on shared context** — kept as a prop on `DataView.Table` only. It's a table-DOM concern and doesn't apply to List/Timeline/Custom; polluting context with Table-only knobs would invite similar leakage for every new renderer.
- **Implicit zero-state / empty-state rendering inside renderers** — moved to explicit `emptyState` / `zeroState` props on each renderer, with the empty-vs-zero decision driven by root-computed `hasActiveQuery`. Today's `Content` and `VirtualizedContent` duplicate this branch; consolidating it removes drift.
- **Recomputing `shouldShowFilters` from `table.getRowModel()`.** Dropped the `try/catch` around a TanStack call inside a data-layer check. Computed from `data.length + filters.length + search` instead — keeps the data layer free of rendering-engine hooks.
- **`onItemDrag` / `onResize` on Timeline (editable Gantt).** Out of scope for v1. Completely renderer-local when added later — doesn't touch `DataView` root.
- **Responsive hiding inside Timeline bars** (hide subtitle when bar is narrow). Separate concern from user-driven visibility; solved by container queries or a priority-aware wrapper at the call site. `DisplayAccess` is only for the Display Properties toggle, not viewport-driven hiding.
- **Backward-compat cell/header renaming.** Considered keeping `enableColumnFilter`, `enableGrouping`, etc. permanently. Decision: accept both the old and new names (`enableColumnFilter` as an alias of `filterable`) for one release, then drop the aliases. Short-term migration cost, long-term cleaner API.

## Helpful Links

- [TanStack Table — Headless API](https://tanstack.com/table/latest/docs/introduction) — core engine already used by `DataTable`.
- [TanStack Virtual](https://tanstack.com/virtual/latest) — virtualization library already used; supports the two-axis case needed by Timeline.
- [CSS Subgrid — MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Subgrid) — underpins the List renderer's cross-row cell alignment.
- [Linear — Views & Layouts](https://linear.app/docs/views) — prior art for the Table/List/Timeline triad over a shared query model.
- [Notion — Databases](https://www.notion.so/help/views-filters-and-sorts) — prior art for swappable renderers driven by one filter/sort model.
- Internal reference: `.claude/worktrees/dataview/ANALYSIS.md` — feasibility + architecture analysis backing this RFC.
