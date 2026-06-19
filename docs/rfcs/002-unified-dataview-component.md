---
ID: RFC 002
Created: April 23, 2026
Status: Completed
RFC PR: https://github.com/raystack/apsara/pull/752
---

# Unified DataView Component

This RFC proposes replacing the current `DataTable` with a unified `DataView` root that owns data-modeling state and exposes swappable renderer subcomponents (List for Table+List, Timeline, Custom), so the same query/filter/sort/group/search state can drive multiple presentations of the same data — switchable at runtime through a built-in multi-view system.

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
  - [Multi-View Architecture](#multi-view-architecture)
    - [Active View in Context](#active-view-in-context)
    - [Behavior on Mismatch](#behavior-on-mismatch)
    - [Single-Renderer Use](#single-renderer-use)
  - [Differences and Analysis](#differences-and-analysis)
    - [General Differences from DataTable](#general-differences-from-datatable)
      - [Root Owns Data, Renderers Own Presentation](#root-owns-data-renderers-own-presentation)
      - [`columns` Renamed to `fields` on Root](#columns-renamed-to-fields-on-root)
      - [Explicit Toolbar Composition](#explicit-toolbar-composition)
      - [Per-View Field Overrides via `fields` on Renderer](#per-view-field-overrides-via-fields-on-renderer)
      - [Unified Column Visibility via `DisplayAccess`](#unified-column-visibility-via-displayaccess)
      - [Empty and Zero States as Siblings](#empty-and-zero-states-as-siblings)
      - [Virtualization as a Prop, Not a Component](#virtualization-as-a-prop-not-a-component)
    - [Renderer-Specific Differences](#renderer-specific-differences)
      - [List (Table + List)](#list-table--list)
      - [Timeline](#timeline)
      - [Custom](#custom)
      - [Grouping](#grouping)
  - [Table of Comparison](#table-of-comparison)
  - [Impact](#impact)
  - [Future Work](#future-work)
  - [Discarded Approaches and Considerations](#discarded-approaches-and-considerations)
    - [Rejected Alternatives](#rejected-alternatives)
    - [Scoped-Out Decisions](#scoped-out-decisions)
  - [Helpful Links](#helpful-links)

## Background

Apsara currently ships a single data-presentation primitive: `DataTable` (`packages/raystack/components/data-table/`). It bundles two layers that are conceptually separate:

- **Data-modeling layer** — query state (`filters`, `sort`, `group_by`, `search`, `offset`, `limit`), client-vs-server mode, row model derivation via TanStack Table.
- **Tabular rendering layer** — table header/body/row/cell DOM, column visibility UI, virtualization, sticky group headers.

Consumer apps increasingly need non-tabular presentations of the same data: list views (person cards), timeline / Gantt views (range bars on a time axis), and ad-hoc custom renderers (Kanban, Gallery, Map). Today each of these would have to re-implement the data-modeling layer from scratch. They also need to let users **switch between presentations at runtime** without losing query state.

### Current Problems

- **Layer 1 is not reusable.** Query state, filter predicates, client/server mode, `groupData`, and the `useFilters` hook all live inside `DataTable` and cannot drive any non-tabular renderer without duplication.
- **No cross-view state persistence.** A user who applies filters/sorts in a tabular view and switches to a list/timeline view loses that state because each view owns its own data layer.
- **No view-switching primitive.** Consumers who need a Table↔List toggle have to wire it up themselves above `DataTable`.
- **Grouping is accessor-only.** `groupData()` groups by a plain `accessorKey` string. Timeline-style bucketing (by day/week/month) or "updated this week / earlier" grouping in a list view is not expressible.
- **Visibility story does not generalize.** Column visibility is hard-coded to `<td>` collapse in the table renderer; non-columnar renderers (timeline bars, custom cards) have no uniform way to react to the Display Properties toggle, so the control silently no-ops for them.
- **Empty/zero state logic is duplicated** across renderer variants (`Content` and `VirtualizedContent`), with each fork drifting independently.
- **Table-specific concerns leak into shared state.** `stickyGroupHeader`, `VirtualizedContent` as a separate export, and `shouldShowFilters` mixing data-layer checks with `table.getRowModel()` all blur the line between data and presentation.

**Roughly 80% of today's `DataTable` logic is already renderer-agnostic; the work is largely an extraction + renaming exercise rather than a rewrite.**

## Proposal

We propose introducing a single `DataView` root that owns the data-modeling layer, alongside swappable renderer subcomponents and a built-in multi-view system:

- `DataView.Toolbar`, `DataView.Search`, `DataView.Filters`, `DataView.DisplayControls` — presentation-agnostic controls that read/write query state through context. `DisplayControls` also hosts the view switcher when `views` is set.
- `DataView.List` — single grid+subgrid renderer for both **Table** and **List** presentations, controlled by `variant`. Replaces the separate Table and List components from earlier drafts.
- `DataView.Timeline` — variable-width range bars on a continuous time axis (Gantt-style). Takes `startField`, `endField`, `renderBar`.
- `DataView.Custom` — escape hatch; render lives in children, context is passed as argument.
- `DataView.DisplayAccess` — foundational visibility primitive: wraps any JSX and gates it on the current `columnVisibility` state so non-columnar renderers honor the same Display Properties toggle.
- `DataView.EmptyState`, `DataView.ZeroState` — sibling components that render based on context-computed empty/zero conditions; renderers no longer own this UI.

Target API:

```tsx
<DataView
  data={rows}
  fields={fields}
  defaultSort={{ name: 'createdAt', order: 'desc' }}
  views={[
    { value: 'table', label: 'Table' },
    { value: 'list',  label: 'List' },
    { value: 'gantt', label: 'Timeline' },
    { value: 'board', label: 'Custom' },
  ]}
  defaultView="table"
>
  <DataView.Toolbar>
    <DataView.Search />
    <DataView.Filters />
    <DataView.DisplayControls /> {/* renders the view switcher when views.length > 1 */}
  </DataView.Toolbar>

  {/* Same renderer, two presentations */}
  <DataView.List name="table" variant="table" columns={tableColumns} />
  <DataView.List name="list"  variant="list"  columns={listColumns} />

  <DataView.Timeline
    name="gantt"
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

  <DataView.Custom name="board">
    {(api) => <Kanban {...api} />}
  </DataView.Custom>

  {/* Sibling empty/zero states — render based on context, not props on renderer */}
  <DataView.EmptyState>
    <EmptyState heading="No matching items" action={<ClearFiltersButton />} />
  </DataView.EmptyState>
  <DataView.ZeroState>
    <EmptyState heading="No data yet" />
  </DataView.ZeroState>
</DataView>
```

The migration will preserve the existing `DataTable` export as a thin alias over `<DataView>` + `<DataView.List variant="table" />` through at least one major version, so consumers can migrate incrementally.

## Why a Unified DataView?

A `DataView` root with swappable renderers and built-in multi-view is the right fit for Apsara's needs:

- **Headless core already exists.** TanStack Table (already a dependency) is headless — the `table` object produces a `Row<T>` tree from `data + column defs + state` and emits no DOM. The same row model can drive Table, List, Timeline, or anything else.
- **Presentation-agnostic logic is already >80% of the surface.** Query state, filter predicates (`filterOperationsMap`), `useFilters`, wire-format translation (`transformToDataTableQuery` / `dataTableQueryToInternal`), client/server mode — all of it reuses as-is.
- **Cross-renderer state persistence comes for free.** Because filters/sort/search/visibility live on context, switching views inside one `DataView` preserves the user's query state with zero wiring.
- **Familiar composition pattern.** Same `<Root>.<Part>` idiom already used by every Apsara primitive (Dialog, Popover, Select, etc.) — no new mental model.
- **Open to future renderers.** `DataView.Custom` + shared context supports Kanban, Gallery, Map, or a third-party `<MyOrg.DataViewKanban>` without any root changes.
- **No new dependency.** TanStack Table is already used by `DataTable`; this RFC only restructures how its output is consumed.

## Pros and Cons

### Pros

- **Code reuse**: One data layer serves every renderer. Eliminates the duplicate-or-fork tax on new presentation formats.
- **Built-in view switching**: Consumers declare `views` + give each renderer a `name`; the toolbar's `DisplayControls` hosts the switcher and the matching renderer renders. No bespoke tab UI.
- **Consistent UX**: Filters, search, sort, grouping, and display-visibility work identically across views.
- **Cross-view state persistence**: Users can toggle between renderers in the same `<DataView>` without losing filters, sort, search, group_by, or visibility.
- **Unified visibility story**: One `DisplayControls` component drives both columnar (List) and non-columnar (Timeline, Custom) renderers via `<DataView.DisplayAccess>`.
- **Per-view field overrides without duplication**: Field metadata is declared once on root; a renderer can pass an optional `fields` prop to override metadata for its view only.
- **Cleaner separation of concerns**: Props live where they're read — renderer knobs on the renderer, data-layer concerns on the root.
- **Empty/zero state lifted out of renderers**: Sibling `<DataView.EmptyState>` / `<DataView.ZeroState>` consume context-derived conditions, eliminating the empty-vs-zero branch duplicated across `Content` and `VirtualizedContent`.
- **Non-breaking migration path**: `DataTable` stays as an alias; most work is additive (new renderers, multi-view), not refactor.
- **Richer grouping**: Function resolvers unlock "group by week", "group by status bucket", etc. — impossible with today's accessor-only API.
- **Future-proof**: `DataView.Custom` + `DisplayAccess` handle any future renderer without touching the root type.

### Cons

- **Surface area grows**: New renderers (Timeline, Custom), `DisplayAccess`, `EmptyState`/`ZeroState`, view-switcher, and `name`/`views` plumbing all need to be designed, documented, and tested.
- **Two API shapes at once**: During migration, both `DataTable` (alias) and `DataView` (new) co-exist. Cognitive cost for consumers until the alias is removed.
- **Timeline complexity**: Two-axis virtualization + lane packing + time-axis math is genuinely new code (~15 lines for the packer, plus the axis component and virtualization glue).
- **DisplayAccess adoption**: Consumers building Timeline/Custom renderers must remember to wrap fields in `<DataView.DisplayAccess>`, or the Display Properties toggle silently no-ops for those renderers. Mitigated by a dev warning at mount.
- **Per-view fields override can drift from root**: Consumers who pass `fields` to a renderer must keep it in sync with root if they care about cross-view consistency. Spreading root fields and tweaking is the documented pattern.
- **Single global visibility state**: Toggling "show priority" in one view shows it in every view. Trade-off accepted for simpler state shape; can be revisited if per-view persistence demand emerges.

## Multi-View Architecture

Multi-view is a first-class concern of `DataView`, not an afterthought. The design must work cleanly for both single-renderer ("just a Table") and multi-renderer ("Table↔List↔Timeline switch") use cases.

The model is intentionally minimal:

- **`views` prop on root** — `Array<{ value: string; label: string; icon?: ReactNode }>`. Optional; declares the set of presentations the consumer offers.
- **`name` prop on each renderer** — string identifier matching one `views[].value`. Optional.
- **Active view** — controlled (`view` + `onViewChange`) or uncontrolled (`defaultView`). Held in context.
- **View switcher** — rendered by `<DataView.DisplayControls>` when `views.length > 1`. Also exported standalone as `<DataView.ViewSwitcher>` for layout flexibility (sidebar, page header, etc.).

### Active View in Context

`activeView` lives on context. Each renderer reads it and returns `null` when `name !== activeView`. The Filters, Search, and DisplayControls always read `effectiveFields` (= the active view's overridden `fields` if provided, else root `fields`) so the toolbar reflects the active view's metadata.

### Behavior on Mismatch

- A `views[]` entry without a matching renderer → nothing renders for that view.
- A renderer with a `name` not in `views[]` → nothing renders.
- No fallback, no console warning theatre. Consumer is responsible for keeping `views` and renderer `name`s in sync.

This is intentional: data-layer behavior shouldn't depend on best-guess heuristics. If the wiring is wrong, the missing UI surfaces it immediately.

### Single-Renderer Use

When `views` is omitted and only one renderer is mounted, the `name` prop is unnecessary, and the view switcher is not rendered. The component degrades to a single-renderer surface identical in shape to today's `DataTable`. Multi-view is opt-in.

## Differences and Analysis

### General Differences from DataTable

#### Root Owns Data, Renderers Own Presentation

- `DataTable`: data props, render specs, and rendering all live on a single component.
- `DataView`: root takes only data-layer props (`data`, `fields`, `defaultSort`, `query`, `mode`, `isLoading`, `views`, `defaultView`/`view`, `onViewChange`, `onQueryChange`, `onLoadMore`, `onRowClick`, ...). Each renderer subcomponent takes its own render spec (`columns` for List; `startField`/`endField`/`renderBar` for Timeline) and an optional `name` for view switching.

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
  <DataView.List columns={cols} variant="table" virtualized />
</DataView>
```

> [!NOTE]
> **Analysis**
>
> Props live where they're read. `columns` is consumed only by columnar renderers (List); `renderBar` only by Timeline. Declaring them on each renderer is the natural React shape and keeps the root type small.

#### `columns` Renamed to `fields` on Root

- `DataTable`: `columns` prop mixed field metadata (filterable, sortable, groupable) with cell/header renderers.
- `DataView`: `fields` on root carries only presentation-agnostic metadata. Cell/header renderers live on `columns` declared per-renderer (`DataView.List`).

```ts
// Field — presentation-agnostic, declared once on root
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
interface DataViewListColumn<TData, TValue = unknown> {
  accessorKey: Extract<keyof TData, string>;  // pointer into fields[]
  cell?:   ColumnDef<TData, TValue>['cell'];
  header?: ColumnDef<TData, TValue>['header'];
  width?:  string | number;                    // grid track
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
  <DataView.DisplayControls /> {/* hosts the view switcher when views.length > 1 */}
  {/* user can also add: <Button>Export</Button>, bulk-action chips, etc. */}
</DataView.Toolbar>
```

> [!NOTE]
> **Analysis**
>
> Lets consumers place search outside the toolbar (common in master-detail layouts), add custom actions (bulk actions, "Export", "New"), and reorder elements. `DisplayControls` is also where the view switcher lives by default; consumers who need it elsewhere can use `<DataView.ViewSwitcher>` directly. Small cost in verbosity; large gain in flexibility.

#### Per-View Field Overrides via `fields` on Renderer

- `DataTable`: filter/sort/visibility config is fixed by the column array; no notion of differing per view.
- `DataView`: each renderer accepts an optional `fields?: DataViewField<TData>[]`. When provided, it fully replaces the root `fields` for that view's active session. The Filters, Search, and DisplayControls (and the headless TanStack column model) read `effectiveFields` from context.

```tsx
const listFields = fields.map(f =>
  f.accessorKey === 'priority'
    ? { ...f, hideable: false, defaultHidden: true }
    : f,
);

<DataView.List
  name="list"
  variant="list"
  columns={listColumns}
  fields={listFields}
/>
```

> [!NOTE]
> **Analysis**
>
> A renderer's `fields` prop is a full replacement, not a merge — keeps semantics dead simple (one shape, no merge rules). Consumers tweaking just one or two flags spread root fields and override; consumers wanting a fundamentally different metadata set pass a fresh array. No partial-override DSL to learn. Crucially, this works uniformly for **every** renderer including non-columnar ones (Timeline, Custom) — they're not forced into a `columns` shape just to override `hideable`/`defaultHidden`. Field metadata stays in one declaration shape (`DataViewField`) regardless of renderer.

#### Unified Column Visibility via `DisplayAccess`

- `DataTable`: column visibility is local TanStack state; only the `<td>` renderer reacts to it.
- `DataView`: `columnVisibility` + `setColumnVisibility` are lifted onto context as a **single global map**. List gates columns internally (hidden grid tracks). Timeline and Custom use `<DataView.DisplayAccess>` to wrap any JSX and reactively hide/show it.

`hideable` and `defaultHidden` live only on `fields[]` (or the active view's overridden `fields`). Effective visibility for the active view = global state ∩ effective `hideable` from active view's fields. A field forced `hideable: false` in the active view stays hidden regardless of stored state.

```tsx
// Inside a Timeline bar — works the same way for List/Custom
<DataView.Timeline
  name="gantt"
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
> Without this primitive, non-columnar renderers would each need a bespoke visibility mechanism — or the toggle would silently no-op. `DisplayAccess` is the one cross-renderer primitive consumers compose inside `renderBar` or custom renderers. List doesn't need it at the call site — its `columns` already carry `accessorKey`, so the renderer gates visibility internally from the same context state. State is **global** (single map, not per-view) — a deliberate simplicity trade-off; per-view persistence can be added later as `Record<viewName, VisibilityState>` if demand emerges. A dev warning fires at mount if a `hideable: true` field is referenced by neither a column spec nor any DisplayAccess instance.

#### Empty and Zero States as Siblings

- `DataTable`: `Content` and `VirtualizedContent` each accept their own `emptyState` / `zeroState` props and re-derive the empty-vs-zero branch internally — duplicated across both forks.
- `DataView`: empty/zero detection is computed once in context (`isEmptyState`, `isZeroState`, `hasActiveQuery`). Sibling components consume it.

```tsx
<DataView ...>
  <DataView.Toolbar>...</DataView.Toolbar>
  <DataView.List columns={cols} name="table" />

  <DataView.EmptyState>
    <EmptyState heading="No matching items" action={<ClearFiltersButton />} />
  </DataView.EmptyState>
  <DataView.ZeroState>
    <EmptyState heading="No data yet" />
  </DataView.ZeroState>
</DataView>
```

Renderers no longer accept `emptyState` / `zeroState` props. When `!hasData`, the renderer renders nothing (or only its chrome — header row, scroll shell), and the `EmptyState` / `ZeroState` siblings render based on context. If both siblings are omitted, nothing is rendered — Apsara doesn't ship a default-fallback heading.

> [!NOTE]
> **Analysis**
>
> The empty/zero distinction is a function of `data + filters + search + sort` — all global. Computing it once in context drops the duplicated branch out of every renderer and gives consumers a single composable place to declare the messaging. Per-view variations (different copy on Table vs. List) can be done with conditional children inside one `<DataView.EmptyState>` (reading `activeView` via `useDataView()`); a `forView` prop is a future addition only if requested. The "N items hidden by filters" footer remains inside each renderer because it's a renderer-DOM concern (positioning, sticky, virtualizer-aware) — not lifted out.

#### Virtualization as a Prop, Not a Component

- `DataTable`: exports both `DataTable.Content` and `DataTable.VirtualizedContent` as separate components.
- `DataView`: virtualization is a prop on the renderer.

```tsx
// Before
<DataTable.VirtualizedContent rowHeight={44} overscan={5} />

// After
<DataView.List variant="table" virtualized rowHeight={44} overscan={5} />
```

> [!NOTE]
> **Analysis**
>
> Cleaner API. Both exports can coexist during migration.

### Renderer-Specific Differences

#### List (Table + List)

- `DataTable.Content`: renders `<table><thead><tbody>` with `flexRender(columnDef.cell)` per cell, `columnDef.header` per header.
- `DataView.List`: a **single** renderer that handles both the tabular and list presentations. Both presentations use CSS `grid` + `subgrid` over a `<div>` tree, with appropriate ARIA roles applied so semantic table assistive-tech behavior is preserved.

```ts
interface DataViewListProps<TData, TValue = unknown> {
  name?: string;                      // for multi-view; matches views[].value
  variant?: 'table' | 'list';         // default 'list'
  showHeaders?: boolean;              // default = (variant === 'table')
  role?: 'table' | 'list';            // default derived from variant
  columns: DataViewListColumn<TData, TValue>[];
  fields?: DataViewField<TData>[];    // optional view-scoped override
  // virtualization, sticky group header, classNames, etc.
}

interface DataViewListColumn<TData, TValue = unknown> {
  accessorKey: string;
  cell?:   ColumnDef<TData, TValue>['cell'];
  header?: ColumnDef<TData, TValue>['header'];
  width?:  string | number;           // grid track: '1fr' | '200px' | 'auto' | 'minmax(80px, 1fr)' | number(px)
  classNames?: { cell?: string; header?: string };
  styles?:     { cell?: CSSProperties; header?: CSSProperties };
}
```

`variant="table"` defaults to `showHeaders={true}` and `role="table"`. `variant="list"` defaults to `showHeaders={false}` and `role="list"`. Both can be overridden independently for fine-grained control.

The justify-between layout common in list views (primary content on the left, metadata on the right) is the consumer's responsibility — declare a column with `width: '1fr'` between `auto` columns and CSS does the rest:

```tsx
const listColumns = [
  { accessorKey: 'avatar', width: 'auto', cell: ({ row }) => <Avatar src={row.original.avatarUrl} /> },
  { accessorKey: 'name',   width: '1fr',  cell: ({ row }) => <Text>{row.original.name}</Text> },
  { accessorKey: 'status', width: 'auto', cell: ({ row }) => <Chip>{row.original.status}</Chip> },
];
```

A consumer who wants both a Table and a List in the same `DataView` declares the renderer twice with different `variant` and `name`:

```tsx
<DataView.List name="table" variant="table" columns={tableColumns} />
<DataView.List name="list"  variant="list"  columns={listColumns} />
```

> [!NOTE]
> **Analysis**
>
> Unifying Table and List into one renderer drops ~half the renderer-layer code. CSS grid + subgrid handles both column-aligned tables and justify-between lists with one DOM strategy; semantic table behavior is preserved through ARIA roles. Column visibility works identically — `table.getVisibleLeafColumns()` already respects `ctx.columnVisibility`, so toggling a column off collapses its grid track across every row with no extra code. Sticky group header is implemented via `position: sticky` on the group row; works in both variants.

#### Timeline

- `DataTable`: no timeline renderer exists.
- `DataView.Timeline`: variable-width range bars on a continuous time axis. Uses `renderBar(row)` because a shared `grid-template-columns` can't fit both 1-day and month-long bars. Visibility inside the bar is composed via `<DataView.DisplayAccess>`.

```tsx
<DataView.Timeline
  name="gantt"
  startField: keyof TData         // required
  endField?:  keyof TData         // omitted → point marker; present → Gantt bar
  renderBar:  (row: Row<TData>) => ReactNode
  fields?: DataViewField<TData>[] // optional view-scoped override
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
> Timeline bypasses `groupData` and buckets internally (horizontal pixel math). Lane packing is a small, pure utility (`packLanes`, ~15 lines of greedy interval scheduling). Two-axis virtualization (time × lanes) is solvable with one `useVirtualizer` per axis. None of this leaks into the data layer. Timeline accepts the same `fields` override prop as List — consistent shape across renderers.

#### Custom

- `DataTable`: escape hatch requires consumers to build their own root.
- `DataView.Custom`: receives the full context as a render prop argument; users emit any DOM they like.

```tsx
<DataView.Custom name="board" fields={boardFields}>
  {({ rows, fields, tableQuery, updateTableQuery, columnVisibility, ... }) => (
    <MyKanban rows={rows} onMove={next => updateTableQuery(q => ({...q, ...}))} />
  )}
</DataView.Custom>
```

> [!NOTE]
> **Analysis**
>
> Keeps the root surface small while supporting unbounded future renderers (Kanban, Gallery, Map, etc.). Third-party renderers compose cleanly via the same pattern — declare a `name`, optionally pass a `fields` override, read context.

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
| Per-view field override | Not available | Optional `fields` prop on each renderer (full replacement) |
| Cell/header renderers (table) | `columns` prop | `columns` on `DataView.List` |
| Table renderer | `DataTable.Content` / `DataTable.VirtualizedContent` | `DataView.List variant="table"` |
| List renderer | Not available | `DataView.List variant="list"` |
| Timeline / Gantt renderer | Not available | `DataView.Timeline` with `renderBar` |
| Custom renderer | Not supported | `DataView.Custom` |
| View switching (Table↔List, etc.) | Consumer wires it themselves | Built-in via `views` + `name` + `DataView.DisplayControls` |
| Toolbar composition | `<DataTable.Toolbar />` auto-renders Filters + DisplaySettings | Explicit children: `Search`, `Filters`, `DisplayControls`, custom actions |
| Virtualization | `DataTable.VirtualizedContent` (separate export) | `virtualized` prop on each renderer |
| Column visibility | TanStack local state, Table-only | Lifted to context as single global map; List gates internally, Timeline/Custom use `<DataView.DisplayAccess>` |
| Grouping | `group_by: string[]`, accessor-only | Same wire format + optional `groupByResolvers` map |
| Sticky group header | `stickyGroupHeader` on root | Prop on `DataView.List` (not in shared context) |
| Empty vs zero state | Per-renderer `emptyState`/`zeroState` props | Sibling `<DataView.EmptyState>` / `<DataView.ZeroState>` driven by context-computed `isEmptyState`/`isZeroState` |
| Filter summary footer | Per-renderer | Stays per-renderer (renderer-DOM concern) |
| Infinite scroll (`onLoadMore`, `totalRowCount`) | `DataTable` | `DataView` root (renderer-independent); each renderer detects bottom-reached |

## Impact

- **1 component replaced + multiple new renderers added.** `DataTable` becomes a thin alias over `<DataView>` + `<DataView.List variant="table" />` during migration.
- **Built-in multi-view.** Consumers stop building bespoke Table↔List toggles above the data primitive.
- **Consumers unlock non-tabular presentations with the same data layer.** Existing tabular usage is near-zero-change; list/timeline/custom views are net-new capabilities.
- **Empty/zero state hoisted out of renderers.** Sibling components are a small breaking change for power users who passed `emptyState` / `zeroState` props directly to `Content`/`VirtualizedContent`; addressed in the migration guide.
- **Prop surface grows on the renderer side, shrinks on the root side.** Net result is clearer separation of concerns.
- **Breaking changes for deep imports only.** Public `<DataTable>` keeps working through at least one major version.

## Future Work

Deliberately scoped out of v1 but worth flagging so the design doesn't preclude them:

- **Density toggle** (`compact | standard | comfortable`) sitting next to the view switcher in `DisplayControls`. Per-view state. Universally requested.
- **Faceted filter values** — TanStack already exposes `column.getFacetedUniqueValues()`. Categorical filters auto-populate from data instead of consumers passing `filterOptions` manually.
- **Keyboard view switching** (`⌘1`, `⌘2`, …). Cheap once `DataView.ViewSwitcher` exists.
- **Row selection + bulk-action slot.** Selection state is global (cross-view). A `<DataView.BulkActions>` slot in toolbar would surface when selection is non-empty.
- **Saved views as a separate concept.** Today's `views` prop is a renderer-selection mechanism. Linear/Notion-style saved-views (named filter+sort+visibility bundles) would extend this — possibly via `views: Array<{ value, label, query?, visibility? }>` later. The current shape is a strict subset, so additive.
- **`onStateChange` for persistence.** A single callback emitting `{ activeView, query, columnVisibility, ... }` so consumers can persist to URL/localStorage/server.
- **Per-view visibility persistence**, if global-state model proves insufficient. Additive: change `columnVisibility` to `Record<viewName, VisibilityState>`.
- **Column pinning, resizing, reordering** (MUI/ag-Grid features). Useful but large surface area; revisit after v1 ships.
- **CSV export, inline editing, pivot/aggregation, master-detail.** Out of scope; ag-Grid / MUI X territory.

## Discarded Approaches and Considerations

Several alternatives were evaluated and rejected, and a handful of ideas were deliberately scoped out of the root type. Capturing them here so the decisions don't have to be re-litigated.

### Rejected Alternatives

- **Hand-rolled query state + predicates (no TanStack).** Would mean reimplementing filter operators, stable sort, filter-from-leaf-rows, and expanded sub-rows. Pure churn for no user-visible gain, and TanStack Table is already a dependency. Kept as the engine.
- **`useReactTable` only for Table; bespoke hooks for List/Timeline.** Forks the filter-predicate path per renderer, and cross-renderer switches (Table ↔ List toggle) would have to re-derive state. Defeats the whole reason for extracting the data layer. Rejected.
- **`ag-grid` / `react-data-grid` / `material-react-table`.** Heavy, opinionated renderers that aren't pluggable at the DOM level. Wrong fit for a headless-core-plus-swappable-renderers architecture.
- **Putting renderer row specs (`columns`, `renderBar`) on the `DataView` root.** Considered for symmetry with today's `DataTable`. Rejected because each spec is consumed by exactly one renderer — declaring them on the root inflates the root type and makes third-party renderers (e.g. `<MyOrg.DataViewKanban>`) awkward. Props live where they're read.
- **Separate `DataView.Table` and `DataView.List` renderers.** Earlier draft. Rejected after analysis showed the two share ~90% of their renderer logic; the only structural diff is DOM (`<table>` vs `<div>` grid) and the presence of a header row. Unifying them under `DataView.List` with `variant="table" \| "list"` (and ARIA-role + `showHeaders` controllable for fine-grained cases) drops half the renderer code and keeps consumer ergonomics ("declare two renderers if you want both presentations").
- **Per-renderer `defaultHidden` / `hideable` on column specs.** Considered to give each view its own initial visibility set. Rejected because it works only for columnar renderers — Timeline/Custom don't take a `columns` array, so they'd need a separate "view-specific fields" prop, splitting the metadata story. The `fields` prop on each renderer (full replacement) is the unified mechanism: same shape for every renderer, no parallel APIs.
- **Per-view visibility state (`Record<viewName, VisibilityState>`).** Considered for clean per-view persistence. Rejected for v1 in favor of a single global `columnVisibility` map — simpler shape, simpler mental model, and the additive path to per-view state stays open if demand emerges.
- **Empty/zero state as renderer props.** Today's pattern. Rejected because the empty-vs-zero branch is a function of `data + filters + search + sort` — all global. Computing it in context once and exposing siblings (`<DataView.EmptyState>` / `<DataView.ZeroState>`) eliminates the duplicated branch in every renderer and gives consumers one composable place to declare messaging.
- **Auto-fallback when active view has no matching renderer (or vice versa).** Considered as a usability cushion. Rejected because best-guess heuristics hide wiring bugs. Mismatches render nothing — surfaces the bug immediately at integration time.
- **Unifying Timeline's bar layout under the List column spec.** Considered because it would mean one spec shape for all three renderers. Rejected because bars are variable-width: a `grid-template-columns` that fits a month-long bar overflows a 1-day bar. Timeline uses `renderBar` + `<DataView.DisplayAccess>` instead, which gives the same visibility story without forcing a column grid onto bar content.
- **Making Display Properties visibility a per-renderer concern.** Considered because Timeline/Custom are structurally different from columnar renderers. Rejected because users expect one Display Properties toggle to work everywhere; otherwise the control silently no-ops on non-columnar views. `<DataView.DisplayAccess>` (one context-reading wrapper) solves this with ~10 lines of shared code.
- **Lifting the filter-summary footer to a sibling `<DataView.FilterSummary>`.** Considered for symmetry with `EmptyState`/`ZeroState`. Rejected because the footer is a renderer-DOM concern (positioning relative to scroll container, sticky behavior, virtualizer awareness) — lifting it forces every renderer to expose its scroll/virtualizer internals to a sibling. Stays inside each renderer.

### Scoped-Out Decisions

- **`DataView.VirtualizedContent` as a separate export** — folded into `<DataView.List virtualized />`. Two exports for the same renderer was redundant.
- **`stickyGroupHeader` on shared context** — kept as a prop on `DataView.List` only. It's a renderer-DOM concern and doesn't apply to Timeline/Custom; polluting context with renderer-only knobs would invite similar leakage for every new renderer.
- **Recomputing `shouldShowFilters` from `table.getRowModel()`.** Dropped the `try/catch` around a TanStack call inside a data-layer check. Computed from `data.length + filters.length + search` instead — keeps the data layer free of rendering-engine hooks.
- **`forView` prop on `DataView.EmptyState` / `DataView.ZeroState`.** Considered for per-view empty messaging. Deferred — consumers can read `activeView` from `useDataView()` inside one EmptyState and branch. Add `forView` only if requested.
- **`onItemDrag` / `onResize` on Timeline (editable Gantt).** Out of scope for v1. Completely renderer-local when added later — doesn't touch `DataView` root.
- **Responsive hiding inside Timeline bars** (hide subtitle when bar is narrow). Separate concern from user-driven visibility; solved by container queries or a priority-aware wrapper at the call site. `DisplayAccess` is only for the Display Properties toggle, not viewport-driven hiding.
- **Backward-compat cell/header renaming.** Considered keeping `enableColumnFilter`, `enableGrouping`, etc. permanently. Decision: accept both the old and new names (`enableColumnFilter` as an alias of `filterable`) for one release, then drop the aliases. Short-term migration cost, long-term cleaner API.

## Helpful Links

- [TanStack Table — Headless API](https://tanstack.com/table/latest/docs/introduction) — core engine already used by `DataTable`.
- [TanStack Virtual](https://tanstack.com/virtual/latest) — virtualization library already used; supports the two-axis case needed by Timeline.
- [CSS Subgrid — MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Subgrid) — underpins the List renderer's cross-row cell alignment.
- [Linear — Views & Layouts](https://linear.app/docs/views) — prior art for the Table/List/Timeline triad over a shared query model and built-in view switching.
- [Notion — Databases](https://www.notion.so/help/views-filters-and-sorts) — prior art for swappable renderers driven by one filter/sort model.
- [MUI X Data Grid](https://mui.com/x/react-data-grid/) — reference for column features (pinning, resizing, faceted filters) flagged as future work.
- [ag-Grid](https://www.ag-grid.com/) — reference for advanced features (pivot, aggregation, master-detail) deliberately out of scope.
- Internal reference: `.claude/worktrees/dataview/ANALYSIS.md` — feasibility + architecture analysis backing this RFC.
