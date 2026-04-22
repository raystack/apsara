# DataView Component — Feasibility & Architecture Analysis

> **Verdict:** ✅ Highly feasible. ~80% of today's `DataTable` logic is already renderer-agnostic; the proposal is largely an **extraction + renaming** exercise, not a rewrite. TanStack Table's headless core can drive Table, List, and Timeline renderers. Real work is in defining the **field / renderer contract** and extending grouping to support non-accessor buckets (e.g. time ranges).

---

## 1. Problem Statement

Today's `DataTable` (`packages/raystack/components/data-table/`) couples two layers:

1. **A data-modeling layer** — query state (filters, sort, group, search, pagination), client-vs-server mode, row model derivation.
2. **A tabular rendering layer** — table header/body/row/cell DOM, column visibility UI, virtualization, sticky group headers.

Non-table presentations (List, Timeline, Kanban, Gallery) would need to duplicate layer 1 unless we extract it. The proposal: a single `DataView` root that owns layer 1, plus swappable renderer subcomponents for layer 2.

### Target API

```tsx
<DataView data={rows} fields={fields} defaultSort={{ name: 'createdAt', order: 'desc' }}>
  <DataView.Toolbar>
    <DataView.Search />
    <DataView.Filters />
    <DataView.DisplayControls />
  </DataView.Toolbar>

  {/* pick one — or switch between them with a tab/toggle */}
  <DataView.Table columns={tableColumns} />
  <DataView.List  columns={listColumns} />  {/* same column shape as Table + grid `width` */}
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
  <DataView.Custom>{(api) => ...}</DataView.Custom>
</DataView>
```

---

## 2. Inventory of Current DataTable

Source: `packages/raystack/components/data-table/`

### 2.1 Presentation-agnostic (lives in `DataView` root/context)

| Concern | Current location | Notes |
| --- | --- | --- |
| Query state `{ filters, sort, group_by, search, offset, limit }` | `data-table.tsx:75-76`, `data-table.types.tsx:52-60` (`InternalQuery`) | Pure state. Reusable as-is. |
| `updateTableQuery` mutator | `data-table.tsx:149-151` | Single entry point for all state changes. |
| Client↔server wire format | `utils/index.tsx:208-316` (`transformToDataTableQuery`, `dataTableQueryToInternal`) | Normalizes `ilike` wildcards, operator mapping. Reusable. |
| `mode: 'client' \| 'server'` | `data-table.types.tsx:16`, `data-table.tsx:124-136` | Switches whether TanStack does filter/sort locally or defers to backend. Renderer-independent. |
| `hasActiveQuery` / `hasQueryChanged` | `utils/index.tsx:167-195` | Distinguishes zero-state vs empty-state; detects change for `onTableQueryChange`. |
| `onLoadMore`, `totalRowCount`, `loadingRowCount`, pagination | `data-table.tsx:153-158` | Server-mode infinite scroll signals. Renderer-independent; each renderer implements its own "bottom-reached" detection. |
| `defaultSort`, `onDisplaySettingsReset` | `data-table.tsx:85-98` | Config. |
| Column-filter predicates (`filterOperationsMap`) | `utils/filter-operations.tsx:33-153` | TanStack `FilterFn` signatures. Reusable for any renderer that runs TanStack's row model. |
| Filter operator UI metadata (`filterOperators`) | `types/filters.tsx:85-117` | Already lives in `~/types/filters`, shared. |
| `groupData()` — groups flat list into `GroupedData<T>[]` with label/count/subRows | `utils/index.tsx:71-107` | Today only groups by **accessorKey string**. Needs extension to support a `groupBy` *function* so Timeline can bucket by day/week. |
| `useFilters()` hook — add/remove/change filters | `hooks/useFilters.tsx` | Pure logic over `updateTableQuery`. Reusable. |

### 2.2 Table-specific (belongs in `DataView.Table`)

| Concern | Current location |
| --- | --- |
| `<Headers>` / `<Rows>` / `<GroupHeader>` DOM | `components/content.tsx:29-174` |
| `flexRender(columnDef.header, header.getContext())` | `content.tsx:52` |
| `flexRender(columnDef.cell, cell.getContext())` | `content.tsx:167` |
| `table.getVisibleLeafColumns()` → `colSpan` | `content.tsx:242` |
| Virtualized table layout with absolute-positioned rows | `components/virtualized-content.tsx` |
| Sticky group header positioned under table `<thead>` | `virtualized-content.tsx:267-307` |
| Skeleton loader rows (column-shaped) | `content.tsx:72-92`, `virtualized-content.tsx:160-204` |
| IntersectionObserver on last `<tr>` for server load-more | `content.tsx:212-240` |
| "N items hidden by filters" footer | `content.tsx:314-344` — arguably renderer-agnostic, but uses table metrics |

### 2.3 Ambiguously coupled (needs explicit repositioning)

- **`columnDef.cell` / `columnDef.header`**: return `ReactNode` with TanStack's `CellContext`/`HeaderContext`. Consumed by any renderer that lays cells out in aligned columns — i.e. both `DataView.Table` (table DOM) and `DataView.List` (CSS `grid` + `subgrid`). They share the column spec shape, differ only in visual chrome. `DataView.Timeline` is different: bars are variable-width, so a shared column grid doesn't apply; Timeline uses `renderBar(row)` with `<DataView.DisplayAccess>` (§4.6) for visibility. **Decision:** keep `cell`/`header` on both Table and List column specs; Timeline uses the DisplayAccess primitive.
- **`enableColumnFilter / enableGrouping / enableSorting / enableHiding / defaultHidden`**: these describe the *field's* capability, not any particular cell. Stay on DataView root fields. Rename `enableColumnFilter` → `filterable` (keep alias) to drop table-speak.
- **Column visibility state**: meaningful for Table (hides columns), ambiguous for List (could hide metadata chips), meaningless for Timeline. **Decision:** keep visibility state in DataView root but let each renderer interpret it (or ignore it).
- **`onRowClick`**: fine as-is but conceptually "onItemClick". Keep name for continuity; rename is cosmetic.
- **`shouldShowFilters` computed from `table.getRowModel().rows.length`** (`data-table.tsx:173-185`): mixes data-layer and render-layer. Can be recomputed from `data.length + filters.length + search` without TanStack — decoupling improves clarity.

---

## 3. Can TanStack Table drive non-table renderers?

### Short answer: **Yes** — it's the right engine, with two caveats.

TanStack Table is *headless*. The core (`@tanstack/table-core`, already a dep) produces a `table` object whose job is to turn `data + column defs + state` into a **row model**: a tree of `Row<T>` with `.original`, `.getValue(colId)`, `.subRows`, `.getIsSelected()`, filtered/sorted/grouped/expanded per current state. Emitting DOM is entirely the caller's job.

So for any renderer we can do:

```tsx
const rows = table.getRowModel().rows;
// Table:    rows.map(row => <tr>…cells…</tr>)
// List:     rows.map(row => <GridRow>{columns.map(c => <Cell>{c.cell(row)}</Cell>)}</GridRow>)
// Timeline: bucketByDate(rows).map(bucket => <TimelineGroup>…</TimelineGroup>)
```

All three renderers share: filter state, sort state, search state, selection state, client/server mode, load-more. **This is the whole point of the extraction.**

### Caveat 1: `columnDef.cell` fits aligned-column layouts only

The `cell` render function returns a `ReactNode`. Any renderer that lays cells out in aligned columns can consume it — Table wraps each call in `<td>`, List wraps it in a CSS `grid` cell (`display: subgrid` per row). The two share the column spec shape. **Timeline is the exception**: bars are variable-width (a 1-day bar and a month-long bar can't share a `grid-template-columns`), so Timeline accepts `renderBar(row)` and relies on `<DataView.DisplayAccess>` (§4.6) to gate per-field visibility inside the bar. This keeps the visibility story uniform across all three renderers without forcing a column grid onto bar content.

### Caveat 2: Grouping only by accessor-key

`groupData()` (`utils/index.tsx:71`) is accessor-only. Timeline needs to bucket rows by computed keys (e.g. `dayjs(row.createdAt).format('YYYY-MM-DD')`). Fix: allow `group_by` to also be a user-supplied `(row: TData) => string` function, or let each renderer bypass `groupData` and bucket its own way (preferred: keeps root simple).

### Why keep TanStack (vs. rolling our own)?

- **Already a dep** and already powering DataTable. No new surface area.
- **Client-mode filter/sort row model is non-trivial** (stable sort, filter-from-leaf-rows, expanded sub-rows). Reimplementing this is pure churn.
- Users never import TanStack types directly — they import `DataViewField`, `DataViewTableColumn` — so the dep stays an implementation detail. Tree-shakes to ~20–25 kB.
- TanStack Virtual (also already a dep) works for all renderers.

### Rejected alternatives

- **Hand-rolled query state + predicates**: loses free row model, duplicates filter operators. Not worth it.
- **`useReactTable` only for `DataView.Table`, bespoke hooks for List/Timeline**: forks the filter-predicate path; cross-renderer switches (Table ↔ List toggle) would re-derive state. No.
- **`ag-grid`, `react-data-grid`, `material-react-table`**: heavy, opinionated renderers, not pluggable at the DOM level. Wrong fit.

---

## 4. Proposed Architecture

### 4.1 Layer cake

```
┌─────────────────────────────────────────────────────────────┐
│ <DataView>  — owns TanStack Table instance + tableQuery     │
│  state = { filters, sort, group_by, search, offset, limit } │
│  context exposes: table, rows, tableQuery, updateTableQuery,│
│  fields, mode, isLoading, loadMoreData, onItemClick, …      │
└───────────────┬─────────────────────────────────────────────┘
                │
   ┌────────────┼────────────┬───────────────┬──────────────┐
   ▼            ▼            ▼               ▼              ▼
<Search>  <Filters>  <DisplayControls>  <Table>  <List>  <Timeline>  <Custom>
 (reads    (reads     (reads/writes      (renderers; each reads `rows`
 search)   filters)   sort/group/hide)    or `table` from context and
                                          emits its own DOM)
```

### 4.2 Type contract

```ts
// Data-model field — presentation-agnostic
export interface DataViewField<TData> {
  accessorKey: Extract<keyof TData, string>;
  label: string;                                    // was `header` string form
  icon?: ReactNode;

  // filter capability
  filterable?: boolean;                             // alias: enableColumnFilter
  filterType?: FilterTypes;                         // number|string|date|select|multiselect
  dataType?: FilterValueType;
  filterOptions?: FilterSelectOption[];
  defaultFilterValue?: unknown;
  filterProps?: { select?: BaseSelectProps };

  // ordering / grouping / visibility capability
  sortable?: boolean;
  groupable?: boolean;
  hideable?: boolean;
  defaultHidden?: boolean;

  // group-header presentation (used by any renderer that groups)
  showGroupCount?: boolean;
  groupCountMap?: Record<string, number>;
  groupLabelsMap?: Record<string, string>;
}

// Table render spec — pure reference. Points at a field by `accessorKey`;
// only adds table-cell rendering. Does NOT extend DataViewField (filterable /
// sortable / filterType etc. live on the field, not duplicated here).
export interface DataViewTableColumn<TData, TValue = unknown> {
  accessorKey: Extract<keyof TData, string>;        // pointer into fields[]
  cell?: ColumnDef<TData, TValue>['cell'];          // flexRender-able body cell
  header?: ColumnDef<TData, TValue>['header'];      // flexRender-able header cell (overrides field.label)
  classNames?: { cell?: string; header?: string };
  styles?:     { cell?: CSSProperties; header?: CSSProperties };
}

// List render spec — same column shape as Table plus a CSS-grid `width` hint.
// List renders rows inside a CSS `grid` container; each row uses `display:
// subgrid` so cells align vertically across rows (same semantic as Table
// columns, different visual chrome — no thead, looser row styling, optional
// dividers).
export interface DataViewListColumn<TData, TValue = unknown> {
  accessorKey: Extract<keyof TData, string>;        // pointer into fields[]
  cell?: ColumnDef<TData, TValue>['cell'];          // flexRender-able cell
  width?: string | number;                          // CSS grid track — '1fr' | '200px' | 'auto' | 'minmax(80px, 1fr)' | number(px)
  classNames?: { cell?: string };
  styles?:     { cell?: CSSProperties };
}

// DisplayAccess — foundational visibility primitive (see §4.6).
// Wrap any JSX with it; the wrapper reads `columnVisibility` from DataView
// context and renders children only when the named field is currently visible.
// Used inside Timeline's `renderBar` and any custom renderer. Table/List use
// column specs, so they gate visibility internally from the same state.
export interface DataViewDisplayAccessProps {
  accessorKey: string;
  children: ReactNode;
  fallback?: ReactNode;                             // rendered when hidden (default: null)
}

// Root props — data layer only. No render specs here; each renderer takes its own.
export interface DataViewProps<TData> {
  data: TData[];
  fields: DataViewField<TData>[];
  defaultSort: DataViewSort;
  query?: DataViewQuery;
  mode?: 'client' | 'server';
  isLoading?: boolean;
  totalRowCount?: number;
  loadingRowCount?: number;
  onQueryChange?: (query: DataViewQuery) => void;
  onLoadMore?: () => Promise<void>;
  onItemClick?: (row: TData) => void;
  onColumnVisibilityChange?: (v: VisibilityState) => void;
  getRowId?: (row: TData, index: number) => string;
  groupByResolvers?: Record<string, (row: TData) => string>;
}
```

> **Renderer row render specs (`columns` on Table/List; `startField`/`endField`/`renderBar` on Timeline; …) are declared on their renderer subcomponent, not on `<DataView>`.** Rationale: they're consumed by exactly one component each, so they belong there (classic React composition). `<DataView.DisplayAccess>` (§4.6) is the one cross-renderer primitive consumers compose inside `renderBar` or custom renderers so visibility state reaches free-form JSX. See §4.5.

### 4.3 Context shape

```ts
export interface DataViewContext<TData> {
  table: Table<TData>;                 // full TanStack instance (renderers read rows/columns from here)
  rows: Row<TData>[];                  // filtered+sorted+grouped (convenience)
  fields: DataViewField<TData>[];      // metadata (Filters/DisplayControls/every renderer use it)
  tableQuery: InternalQuery;
  updateTableQuery: (fn: TableQueryUpdateFn) => void;
  mode: 'client' | 'server';
  isLoading: boolean;
  loadMoreData: () => void;
  defaultSort: DataViewSort;
  onItemClick?: (row: TData) => void;
  onDisplaySettingsReset: () => void;
  shouldShowFilters: boolean;          // computed from data.length + filters + search
  hasActiveQuery: boolean;             // drives empty-vs-zero state at each renderer
  totalRowCount?: number;
  loadingRowCount?: number;
  columnVisibility: VisibilityState;   // single source for DisplayAccess + column gating
  setColumnVisibility: (v: VisibilityState | ((prev: VisibilityState) => VisibilityState)) => void;
}
```

Context is strictly the **data layer**: state, derived rows, field metadata, mutators. Renderer-specific render specs are props on the renderer, not context.

Note: the current context already matches this almost 1:1. The diff is: rename `columns` → `fields`, expose `rows` as a convenience, surface `columnVisibility` + `setColumnVisibility` so `<DataView.DisplayAccess>` (§4.6) and every renderer read from the same source of truth, drop `stickyGroupHeader` (Table-only prop, not context).

### 4.4 Data flow

1. **Mount.** `DataView` constructs `tableQuery` from `defaultSort` + `query?` prop, builds TanStack Table over `data` + `fields` (translated to `ColumnDef`s with filter predicates wired from `filterOperationsMap`).
2. **User interacts with a toolbar control:**
   - `Search` → `updateTableQuery({search})` → TanStack applies `globalFilter` (client) OR parent `onQueryChange` fires with normalized `DataViewQuery` (server).
   - `Filters` → same dispatch path, updates `columnFilters`.
   - `DisplayControls` → sort / group_by / columnVisibility dispatch.
3. **Row model recomputes** (memoized). `rows = table.getRowModel().rows`.
4. **Renderer reads rows from context** and emits DOM.
   - `Table` renders TanStack rows as `<tr><td>flexRender(cell)</td></tr>`; columns hidden via `columnVisibility` collapse automatically.
   - `List` renders each row as a CSS-grid track (`display: subgrid`) with `flexRender(cell)` per column; hidden columns collapse their grid track the same way Table collapses its `<td>`.
   - `Timeline` skips `groupData`; instead reads filtered `rows`, positions each item by `startField`/`endField`, lane-packs to avoid overlap, and calls `renderBar(row)` — inside which any `<DataView.DisplayAccess>` reads the same `columnVisibility` state.
   - `Custom` receives the whole context and does anything.

### 4.5 Renderer-specific prop shapes

**Rule:** each renderer owns its row render spec + view knobs. Only data-layer concerns live on `<DataView>`. Props live where they're read.

**Table and List share the column-spec shape** — both lay cells out in aligned columns (Table uses table DOM; List uses CSS `grid` + `subgrid`). Column visibility flows through both automatically because each column is keyed by `accessorKey` and the renderer reads `columnVisibility` from context. **Timeline is structurally different** — bars are variable-width — so it uses `renderBar(row)` and relies on `<DataView.DisplayAccess>` (§4.6) to gate field visibility inside bars.

```tsx
// Table — aligned columns in table DOM
<DataView.Table
  columns: DataViewTableColumn<TData>[]       // required — per-column cell / header renderers
  virtualized?
  rowHeight?  groupHeaderHeight?  overscan?
  stickyGroupHeader?
  emptyState?  zeroState?
  classNames?
/>

// List — aligned columns in CSS grid/subgrid; same data shape as Table, different chrome
<DataView.List
  columns: DataViewListColumn<TData>[]        // required — per-column cell + grid `width`
  virtualized?                                // needs constant or estimated rowHeight
  rowHeight?  overscan?
  showDividers?
  showGroupHeaders?                            // when group_by is active
  emptyState?  zeroState?
  classNames?
/>

// Timeline — variable-width bars on a time axis
<DataView.Timeline
  startField: Extract<keyof TData, string>    // required — drives bar X position
  endField?:  Extract<keyof TData, string>    // omitted → point marker; present → Gantt bar
  renderBar:  (row: Row<TData>) => ReactNode  // required — compose with <DataView.DisplayAccess> for visibility
  laneField?: Extract<keyof TData, string>    // optional — partition into bands per group value
  scale?       // 'day' | 'week' | 'month' | 'quarter'
  today?       // boolean | Date
  lanePacking? // 'auto' | 'one-per-row'
  rowHeight?  laneGap?  overscan?
  viewportRange?  onViewportChange?
  renderLaneGroup?: (group: GroupedData<TData>) => ReactNode  // band header
  emptyState?  zeroState?
  classNames?
/>

// Custom — escape hatch; render lives in children
<DataView.Custom>
  {({ rows, fields, tableQuery, updateTableQuery, columnVisibility, ... }) => ReactNode}
</DataView.Custom>
```

**Why this split:**

- **Props live where they're read.** `columns` is consumed only by the column-based renderers; `renderBar` only by Timeline. Declaring them on each renderer is the natural React shape.
- **Shared column shape (Table ↔ List) is the ergonomic win.** Same mental model for declaring a row of cells; swapping renderers is close to a tag change. `DataViewTableColumn` adds `header`; `DataViewListColumn` adds grid `width`. Otherwise identical.
- **Timeline uses DisplayAccess, not columns.** Bars are variable-width, so a shared `grid-template-columns` can't apply — a template that fits a month bar overflows a 1-day bar. `<DataView.DisplayAccess>` (§4.6) gives Timeline the same visibility story as Table/List without forcing a column grid onto bar content.
- **Root stays lean.** `<DataView>` props describe the data; no renderer slots.
- **Third-party renderers compose cleanly.** A `<MyOrg.DataViewKanban>` reads from context and defines its own prop surface; it uses `<DataView.DisplayAccess>` for visibility without needing a slot on the root type.

**Renderer-switcher UI:** userland holds the specs and passes them conditionally. Toolbar/filters/search/sort persist across switches because they live on context, untouched.

```tsx
{view === 'table'    && <DataView.Table    columns={tableColumns} virtualized />}
{view === 'list'     && <DataView.List     columns={listColumns}  showDividers />}
{view === 'timeline' && <DataView.Timeline startField="start" endField="end" renderBar={renderBar} />}
```

### 4.6 DisplayAccess — foundational visibility primitive

One component that gates its children on the current `columnVisibility` state in context:

```tsx
<DataView.DisplayAccess accessorKey="priority">
  <Chip>{row.getValue('priority')}</Chip>
</DataView.DisplayAccess>
```

Semantics:

1. Reads `ctx.columnVisibility[accessorKey]` (defaults to `true` if the field has never been toggled).
2. Renders `children` when visible, `fallback` (default `null`) when hidden.
3. Renderer-agnostic. Works inside any JSX a renderer emits — Timeline bars, custom Kanban cards, map tooltips, detail drawers.

```tsx
// Typical use inside a Timeline bar
<DataView.Timeline
  startField="start" endField="end"
  renderBar={(row) => (
    <Flex direction="column" gap={1}>
      <DataView.DisplayAccess accessorKey="title">
        <Text weight={500}>{row.getValue('title')}</Text>
      </DataView.DisplayAccess>
      <DataView.DisplayAccess accessorKey="dueAt">
        <Text size={2} color="muted">{formatDate(row.getValue('dueAt'))}</Text>
      </DataView.DisplayAccess>
    </Flex>
  )}
/>
```

**Why this primitive exists.** Without it, non-columnar renderers (Timeline bars, custom) have no way to react to the single Display Properties toggle — each would need a bespoke visibility mechanism, or DisplayOptions would silently fail to affect their content. `DisplayAccess` is the one place where the data layer's visibility state reaches a free-form render function.

**Role in Table/List.** Table and List don't need it at the call site — `columns` already declares each cell's `accessorKey`, so the renderer gates the column internally (hiding the whole grid track or `<td>` when invisible). Consumers can still drop `DisplayAccess` inside a `cell` renderer for sub-field visibility (e.g. hide a secondary label inside a "name" cell), but the common case is handled automatically.

**Dev diagnostics.** If a field appears in `fields[]` with `hideable: true` but is referenced by **neither** a column spec **nor** a `<DataView.DisplayAccess>` (across any mounted renderer), log a dev warning at mount — the toggle would be a silent no-op. Cheap: one pass over fields × columns at mount, plus a registration callback from each `DisplayAccess` instance.

**Complementary, not a replacement.** Responsive hiding inside Timeline bars (hide subtitle when a bar is narrow) is a separate concern — solved by container queries or a `priority`-aware wrapper. `DisplayAccess` only handles user-driven visibility from DisplayOptions.

---

## 5. What to Improve vs Drop

### Improvements
1. **Explicit composition of Search in Toolbar.** Today `Toolbar` auto-renders `Filters + DisplaySettings`; `Search` is a peer but not included. Proposed API makes the user compose them, which lets consumers:
   - Place search outside the toolbar (common in master-detail layouts).
   - Add custom toolbar children (bulk actions, "Export", "New").
2. **Rename `columns` → `fields` at the root.** Disambiguates from renderer columns. `DataView.Table` still takes `columns` which are fields + cell/header renderers.
3. **Group-by function support.** Extend `InternalQuery.group_by` so a non-accessor resolver can be named. Unlocks Timeline bucketing, "updated this week / earlier" grouping in List, etc.
4. **Unified Display Properties across all renderers.** With `<DataView.DisplayAccess>` (§4.6) as the visibility primitive and `columnVisibility` on context, every renderer honors the same toggle uniformly — Table/List via column specs (hidden tracks collapse), Timeline via `DisplayAccess` wrappers inside `renderBar`. `DisplayControls` stays a single component; no capability gating required.
5. **Recompute `shouldShowFilters` from data-layer only.** Remove the try/catch around `table.getRowModel()`.
6. **Virtualization as a prop, not a separate component.** `<DataView.Content virtualized />` is cleaner than two exported components. Can keep both during migration.

### Drop / simplify
1. **`DataView.VirtualizedContent` as separate export** — fold into `DataView.Table virtualized`.
2. **`stickyGroupHeader` from context** — it's a Table renderer prop; doesn't need to be in shared context.
3. **Implicit zero-state rendering inside renderers** — push the zero/empty-state decision up to the root or expose as a `<DataView.Empty>` slot, so it's consistent across renderers instead of each renderer re-implementing the logic (today `Content` and `VirtualizedContent` duplicate the `hasActiveQuery` branch).

### Keep as-is
- All of `utils/filter-operations.tsx`.
- `useFilters` hook.
- `transformToDataTableQuery` / `dataTableQueryToInternal` (rename types to `DataViewQuery`).
- `mode: 'client' | 'server'` semantics.

---

## 6. Data Model Summary

Unchanged core query shape (just renamed):

```ts
// Wire format (what parents pass in / receive back)
export interface DataViewQuery {
  filters?: DataViewFilter[];   // each: { name, operator, value, stringValue?, numberValue?, boolValue? }
  sort?: DataViewSort[];        // each: { name, order: 'asc' | 'desc' }
  group_by?: string[];          // field accessor or resolver key
  search?: string;
  offset?: number;
  limit?: number;
}

// Internal (with UI metadata)
export interface InternalQuery {
  filters?: InternalFilter[];   // adds _type, _dataType for operator picker
  sort?: DataViewSort[];
  group_by?: string[];
  search?: string;
  offset?: number;
  limit?: number;
}
```

Row model state (TanStack-owned, exposed via `context.table` + `context.rows`):
- `globalFilter` ← `query.search`
- `columnFilters` ← `query.filters`
- `sorting` ← `query.sort`
- `expanded` ← true when grouping active
- `columnVisibility` ← local state + `onColumnVisibilityChange` callback

---

## 7. Migration Path

Recommended phased rollout to avoid a breaking "big bang":

**Phase 0 — rename internals (non-breaking):**
- Extract everything presentation-agnostic in `data-table/` into a `data-view/` package, re-export `DataTable` from there as a thin alias (`<DataView>` with `<DataView.Table>` only).
- Rename types: `DataTableQuery` → `DataViewQuery`, `TableContextType` → `DataViewContext`, etc. Keep old names as type aliases.

**Phase 1 — add renderer primitives:**
- Surface `columnVisibility` + `setColumnVisibility` on context (today it's a local TanStack state; just lift it for `DisplayAccess`).
- Ship `<DataView.DisplayAccess>` (tiny component — reads from context, gates children).
- Ship `<DataView.List>` (reuses Table column spec shape, adds `width`, CSS grid/subgrid) and `<DataView.Custom>`.
- Add `fields` as an alternative to `columns` on root (accept either; translate internally).

**Phase 2 — Timeline:**
- Ship `<DataView.Timeline>`: lane-packer util, time-axis component, `renderBar` contract.
- Extend `groupData` to accept function resolvers, OR let Timeline bypass `groupData` and bucket internally (preferred).
- Optionally: sugar wrapper `<DataView.RendererSwitch>` for Table ↔ List ↔ Timeline toggle inside a single `<DataView>`.

**Phase 3 (breaking, optional):**
- Remove old `DataTable` aliases one minor version later, after consumers migrate.

---

## 8. Risks & Open Questions

| Risk | Mitigation |
| --- | --- |
| Consumers of Timeline/custom renderers forget to wrap fields in `<DataView.DisplayAccess>`, making DisplayOptions a silent no-op | Dev warning at mount when a `hideable: true` field is referenced by neither a column spec nor any DisplayAccess instance (§4.6). Documented prominently. |
| Custom grouping function in Timeline breaks `InternalQuery.group_by: string[]` contract | Introduce a `groupByResolvers` map on root: keys are string ids (go into query) but resolve to functions locally. Wire format stays a string. |
| Column visibility and Timeline interact weirdly | Resolved by `<DataView.DisplayAccess>` — Timeline bars wrap each field in DisplayAccess, hidden fields disappear from the bar exactly like hidden columns disappear from Table/List. One toggle drives all three. |
| Perf: large unvirtualized List/Timeline | Each renderer must have a virtualized variant. `rowHeight` prop on List (grid track height); Timeline buckets are rendered, items inside a lane virtualize. |
| Multi-renderer mode (user toggles Table↔List↔Timeline in one DataView) | Already free — all renderers consume shared context. Filter/sort/search persist across switches. This is actually a feature, not a risk. |
| Keeping Table and List visually distinct despite sharing the column spec | Design review per renderer: Table has `<thead>` + denser rows + borders; List has no header + looser spacing + optional dividers + card-ish row styling. Token-driven so drift is contained. |
| Backwards-compat of the existing `DataTable` consumer API | Keep `DataTable` export as an alias through at least one major version. Only `DataTableDemo`-style imports need to change (`DataTable` → `DataView`, `DataTable.Content` → `DataView.Table`). |

---

## 9. Feasibility Scorecard

| Dimension | Score | Reason |
| --- | --- | --- |
| Technical feasibility | ★★★★★ | Existing code already separates layers; TanStack is headless. |
| API ergonomics of proposal | ★★★★☆ | Clean; one gotcha (fields vs columns naming) — solvable with typing. |
| Migration cost | ★★★★☆ | Non-breaking path exists. Most work is new code (List, Timeline) not refactor. |
| Coverage of future renderers (Kanban, Gallery, Map) | ★★★★★ | `DataView.Custom` + shared context handles anything. |
| Library choice (TanStack Table Core) | ★★★★★ | Already a dep; ideal fit for headless row modeling. |
| Risk | ★★★★☆ | Timeline grouping and column-visibility semantics are the only non-trivial issues. |

---

## 10. Case Study: Gantt-style Timeline (screenshot reference)

The task-prioritisation screenshot shows a **range-based timeline / Gantt**, not a point-in-time event timeline. Properties visible in the image:

- Continuous horizontal time axis (Jan 2025 → Feb), day-level ticks, month headers, a "today" marker (17 Jan).
- Each item is a **bar** spanning from its **start date to its end date** — width encodes duration.
- Items are **packed into lanes** (vertical rows) so they don't visually overlap.
- Each bar has a title, due date, assignee, priority chip, status icon — i.e. the same fields any renderer would read.
- Filter + Display controls sit above the canvas — a direct match for `<DataView.Toolbar>`.

### Does the proposed architecture support this?

**Yes, end-to-end.** The split between data layer and renderer holds up exactly:

| Concern in the screenshot | Where it lives |
| --- | --- |
| "Filter" button, applied filter chips, search | `<DataView.Filters>` / `<DataView.Search>` — unchanged. Filters read from `fields[]` metadata and dispatch through `updateTableQuery`. |
| "Display" button (sort / group / visible properties) | `<DataView.DisplayControls>` — unchanged. |
| Data subset actually visible on the canvas | Context `rows` after filter+sort+search. The Gantt renderer consumes `rows`, not raw `data`. |
| Ordering of items/lanes | `query.sort` — the renderer reads `rows` already in sorted order. Could sort by startDate, priority, assignee. |
| Grouping into lane-bands (e.g. one band per assignee) | `query.group_by` — renderer maps group → horizontal band, packs items into lanes *within* the band. |
| Start/end positioning of each bar | Pure renderer math: `left = pxPerDay * (row.start - viewportStart)`, `width = pxPerDay * (row.end - row.start)`. Data layer doesn't need to know about pixels. |
| Lane packing (collision-free vertical placement) | Renderer-owned algorithm: greedy interval-scheduling over sorted items. |
| Time-axis ruler + today marker | Renderer-owned. |
| Virtualization (the canvas clearly extends beyond the viewport in both axes) | Renderer-owned, two-axis: time-window virtualization + lane virtualization. TanStack Virtual handles each axis. |

### What the Timeline renderer needs to expose

A point-timeline shape (single date field) is insufficient — the screenshot forces a more general range-based shape:

```tsx
<DataView.Timeline
  // Required: which field drives the time position.
  startField: keyof TData
  // Optional: if set, items render as bars spanning start→end (Gantt).
  // If omitted, items render as point markers (event timeline).
  endField?: keyof TData

  // Viewport / axis
  scale?: 'day' | 'week' | 'month' | 'quarter'
  viewportRange?: [Date, Date]                 // controlled; omit for auto
  onViewportChange?: (range: [Date, Date]) => void
  today?: Date | boolean                       // draw today line (defaults: true, new Date())

  // Layout
  lanePacking?: 'auto' | 'one-per-row'         // auto = greedy pack to avoid overlap
  laneGap?: number
  rowHeight?: number

  // Rendering — bars are variable-width, so cells can't share a grid.
  // Compose freely; wrap each field in <DataView.DisplayAccess> so
  // "Display Properties" toggles apply to bar content the same way they
  // apply to Table/List columns.
  renderBar: (row: Row<TData>) => ReactNode
  renderLaneGroup?: (group: GroupedData<TData>) => ReactNode  // band header when grouped

  // Interaction
  onItemClick?: (row: TData) => void           // inherits from context if omitted
  // future: onItemDrag, onResize for editable Gantt
/>
```

### Why this still fits the shared-context story

Nothing above touches the data layer. Filtering out low-priority items with `<DataView.Filters>` simply shrinks `rows` — the Gantt renderer re-packs lanes. Switching from Gantt to Table (in a multi-renderer `<DataView>`) preserves filters, search, sort, selection, and column-visibility state. Grouping by assignee in the Display panel turns lanes into assignee-bands. Toggling "Priority" off in Display Properties hides the `<Chip>` inside the bar because it's wrapped in `<DataView.DisplayAccess accessorKey="priority">` — same toggle that hides the "Priority" column in Table/List.

### What the Gantt renderer adds that List/Table don't

1. **Two-axis virtualization** (time × lanes). Non-trivial but solvable; TanStack Virtual instance per axis, or a 2D library.
2. **Interval-scheduling lane packer.** ~15 lines, independent module, testable.
3. **Date-range operations on filters.** Already in `filterOperationsMap.date`. A "due this week" filter works as-is.
4. **Editable bars (future).** Drag to change start, resize to change end → callbacks that dispatch back into the parent's data source. Completely renderer-local; doesn't leak into DataView root.

### Risks specific to this view

| Risk | Mitigation |
| --- | --- |
| Items without an `endField` value | Default to point marker, or treat as same-day bar (`width = minBarWidth`). |
| Items with `start > end` (data bugs) | Renderer decides: swap, clamp, or hide + warn. Doesn't affect query state. |
| Extremely wide time range with sparse items | Timeline computes auto-viewport to fit `min(startField) → max(endField)` of filtered rows. |
| Screen text in bars overflowing (visible in screenshot — bars at viewport edges are clipped) | Rendering concern — standard text-overflow handling inside the bar. |
| Heavy re-renders when dragging | Renderer memoizes lane layout per `(rows, viewport)` tuple. |

### Bottom line

The screenshot is the **strongest validation** of the DataView proposal, not a counter-example. It exercises every toolbar primitive the proposal adds (`Search`, `Filters`, `DisplayControls` = "Filter" + "Display" in the image), requires no changes to the data model, and isolates the view-specific complexity (lane packing, time-axis math, two-axis virtualization) inside `<DataView.Timeline>`. If a tabular view of the same tasks were needed tomorrow, swapping `<DataView.Timeline>` for `<DataView.Table>` under the same `<DataView>` root would show the same filtered/sorted/grouped tasks with zero logic rewiring — which is exactly the goal.

---

## 11. Case Study: Uniform List view (screenshot reference)

The list screenshot (avatars + name/subheading + label chip + collaborator stack + status) is structurally a **row of aligned cells** — the same mental model as Table, just with different chrome. Using CSS `grid` on the list container + `display: subgrid` per row, cells align vertically across rows without a `<table>`. The column spec is the natural fit; the `width` hint maps straight to `grid-template-columns`.

### Mapping

```tsx
<DataView data={users} fields={userFields} defaultSort={{ name: 'name', order: 'asc' }}>
  <DataView.Toolbar>
    <DataView.Search />
    <DataView.Filters />
    <DataView.DisplayControls />
  </DataView.Toolbar>

  <DataView.List
    columns={userListColumns}
    itemHeight={72}                  // constant → trivial virtualization
    showDividers
  />
</DataView>
```

where the column spec mirrors Table (no `header`, adds `width`):

```tsx
const userListColumns: DataViewListColumn<User>[] = [
  {
    accessorKey: 'identity',
    width: '1fr',
    cell: ({ row }) => (
      <Flex align="center" gap={3}>
        <Avatar src={row.original.avatar} />
        <Flex direction="column" style={{ minWidth: 0 }}>
          <Text weight={500} truncate>{row.original.name}</Text>
          <Text size={2} color="muted" truncate>{row.original.subheading}</Text>
        </Flex>
      </Flex>
    ),
  },
  {
    accessorKey: 'label',
    width: 'auto',
    cell: ({ row }) => (
      <Chip size="small" leadingIcon={<SparkleIcon />}>{row.getValue('label')}</Chip>
    ),
  },
  {
    accessorKey: 'collaborators',
    width: 'auto',
    cell: ({ row }) => <AvatarStack users={row.original.collaborators} max={3} />,
  },
  {
    accessorKey: 'status',
    width: '120px',
    cell: ({ row }) => <StatusChip status={row.getValue('status')} />,
  },
];
```

`identity` is a synthetic column key that reads multiple fields from `row.original` — totally fine; the `accessorKey` just needs to match an entry in `fields[]` (a computed field with `hideable: false` if you don't want users toggling the avatar/name/subheading as one block). Or split it into three real columns for individual toggle control.

### What the shared context gives for free

- Filter "status = Draft" shrinks the list — renderer unchanged.
- Sort by name reorders rows via `<DataView.DisplayControls>`.
- Group by status produces "Draft / Published / Archived" section headers (same `groupData` path as Table).
- Search narrows rows through `globalFilter`.
- **Display Properties toggle a column off → its grid track collapses**, identical to Table. No extra wiring. No per-renderer visibility story to maintain.
- Infinite scroll via `loadMoreData` when bottom enters viewport — identical pattern to Table, just a different observer target.

### Why columns (not slots, not renderItem)

- **Native visibility**: each cell's `accessorKey` is explicit, so DisplayOptions works the same way it does in Table.
- **Vertical alignment across rows**: CSS subgrid keeps avatars/statuses aligned across every row — what the screenshot shows. A free-form `renderItem` per row can't guarantee that without consumers hard-coding widths themselves.
- **One API to learn**: Table↔List is a tag swap (drop `header`, add `width`, rename the tag), not a new render contract.

### Visual chrome difference from Table

Same column shape, intentionally different CSS:

| | Table | List |
| --- | --- | --- |
| Container element | `<table>` | `<div>` with `display: grid` + `grid-template-columns: ...` |
| Row element | `<tr>` | `<div>` with `display: subgrid; grid-column: 1 / -1` |
| Header row | `<thead>` | *none* (List has no column headers) |
| Separators | cell borders | optional `showDividers` between rows |
| Default density | compact | looser spacing; card-ish rows |
| `stickyGroupHeader` | supported | not supported (v1) |

---

## 12. Implementation Examples

Full end-to-end examples for each renderer using the root-owned spec shape from §4.5. Each subsection shows: (1) field metadata, (2) the renderer's row render spec, (3) full consumer JSX, (4) a sketch of the renderer's internals.

---

### 12.1 Table

Consumer-facing tasks table. Exercises filtering, sorting, grouping, column visibility, virtualization, sticky group headers.

#### 12.1.1 Field metadata

```ts
// types.ts
export type Task = {
  id: string;
  title: string;
  status: 'backlog' | 'in_progress' | 'review' | 'done';
  priority: 'P0' | 'P1' | 'P2' | 'P3';
  assignee: string;
  createdAt: string;
  dueAt: string;
};

// fields.ts
import type { DataViewField } from '@raystack/apsara';
import type { Task } from './types';

export const taskFields: DataViewField<Task>[] = [
  { accessorKey: 'title',    label: 'Title',    filterable: true, filterType: 'string', sortable: true },
  { accessorKey: 'status',   label: 'Status',   filterable: true, filterType: 'select',
    filterOptions: [
      { label: 'Backlog',      value: 'backlog' },
      { label: 'In progress',  value: 'in_progress' },
      { label: 'Review',       value: 'review' },
      { label: 'Done',         value: 'done' },
    ],
    sortable: true, groupable: true, showGroupCount: true, hideable: true,
  },
  { accessorKey: 'priority', label: 'Priority', filterable: true, filterType: 'select',
    filterOptions: [
      { label: 'P0', value: 'P0' }, { label: 'P1', value: 'P1' },
      { label: 'P2', value: 'P2' }, { label: 'P3', value: 'P3' },
    ],
    sortable: true, groupable: true, hideable: true,
  },
  { accessorKey: 'assignee',  label: 'Assignee', filterable: true, filterType: 'string', sortable: true, hideable: true },
  { accessorKey: 'createdAt', label: 'Created',  filterable: true, filterType: 'date',   sortable: true, hideable: true, defaultHidden: true },
  { accessorKey: 'dueAt',     label: 'Due',      filterable: true, filterType: 'date',   sortable: true, hideable: true },
];
```

#### 12.1.2 Table columns (the row render spec)

```tsx
// table-columns.tsx
import type { DataViewTableColumn } from '@raystack/apsara';
import { Checkbox, Flex, Text, Avatar } from '@raystack/apsara';
import dayjs from 'dayjs';
import { StatusChip, PriorityBadge } from './atoms';
import type { Task } from './types';

export const taskTableColumns: DataViewTableColumn<Task>[] = [
  {
    accessorKey: 'title',
    cell: ({ row }) => (
      <Flex gap={2} align="center">
        <Checkbox checked={row.getIsSelected()} onCheckedChange={v => row.toggleSelected(!!v)} />
        <Text weight={500}>{row.getValue('title')}</Text>
      </Flex>
    ),
    styles: { cell: { minWidth: 240 }, header: { minWidth: 240 } },
  },
  {
    accessorKey: 'status',
    cell:        ({ row }) => <StatusChip status={row.getValue('status')} />,
    styles:      { cell: { width: 120 }, header: { width: 120 } },
  },
  {
    accessorKey: 'priority',
    cell:        ({ row }) => <PriorityBadge value={row.getValue('priority')} />,
    styles:      { cell: { width: 80 }, header: { width: 80 } },
  },
  {
    accessorKey: 'assignee',
    cell:        ({ row }) => <Avatar name={row.getValue('assignee')} size={4} />,
    styles:      { cell: { width: 120 }, header: { width: 120 } },
  },
  {
    accessorKey: 'dueAt',
    cell:        ({ row }) => <Text size={2}>{dayjs(row.getValue('dueAt')).format('MMM D')}</Text>,
    styles:      { cell: { width: 100 }, header: { width: 100 } },
  },
];
```

#### 12.1.3 Full consumer usage

```tsx
// tasks-page.tsx
import { DataView } from '@raystack/apsara';
import { taskFields } from './fields';
import { taskTableColumns } from './table-columns';

export function TasksPage() {
  const { data: tasks = [], isLoading } = useTasksQuery();

  return (
    <DataView<Task>
      data={tasks}
      fields={taskFields}
      defaultSort={{ name: 'dueAt', order: 'asc' }}
      mode="client"
      isLoading={isLoading}
      getRowId={row => row.id}
      onItemClick={task => navigate(`/tasks/${task.id}`)}
    >
      <DataView.Toolbar>
        <DataView.Search placeholder="Search tasks" />
        <DataView.Filters />
        <DataView.DisplayControls />
      </DataView.Toolbar>

      <DataView.Table
        columns={taskTableColumns}
        virtualized
        rowHeight={44}
        stickyGroupHeader
        emptyState={<EmptyState icon={<TableIcon />} heading="No matching tasks" />}
        zeroState={<EmptyState icon={<TableIcon />} heading="No tasks yet" />}
      />
    </DataView>
  );
}
```

#### 12.1.4 Renderer internal sketch

```tsx
// packages/raystack/components/data-view/renderers/table.tsx
'use client';
import { flexRender } from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';
import { cx } from 'class-variance-authority';
import { Table } from '../../table';
import { useDataView } from '../hooks/useDataView';
import styles from '../data-view.module.css';

export function DataViewTable<TData>({
  columns,
  virtualized = false,
  rowHeight = 40,
  groupHeaderHeight,
  overscan = 5,
  stickyGroupHeader = false,
  emptyState,
  zeroState,
  classNames,
}: DataViewTableProps<TData>) {
  const ctx = useDataView<TData>();

  // Merge columns (presentation) with fields (metadata) at render time.
  // Context's TanStack table was built from fields only; here we install
  // cell/header renderers from `columns` keyed by accessorKey.
  const table = useTableWithColumns(ctx.table, ctx.fields, columns);
  const rows  = table.getRowModel().rows;

  if (!rows.length && !ctx.isLoading) {
    return <div className={classNames?.root}>{ctx.hasActiveQuery ? emptyState : zeroState}</div>;
  }

  return virtualized
    ? <VirtualTableBody table={table} rows={rows} rowHeight={rowHeight}
        groupHeaderHeight={groupHeaderHeight ?? rowHeight} overscan={overscan}
        stickyGroupHeader={stickyGroupHeader} onItemClick={ctx.onItemClick}
        classNames={classNames} />
    : <PlainTableBody   table={table} rows={rows} onItemClick={ctx.onItemClick}
        classNames={classNames} />;
}

function PlainTableBody({ table, rows, onItemClick, classNames }) {
  return (
    <Table className={classNames?.table}>
      <Table.Header>
        {table.getHeaderGroups().map(hg => (
          <Table.Row key={hg.id}>
            {hg.headers.map(h => (
              <Table.Head key={h.id}>{flexRender(h.column.columnDef.header, h.getContext())}</Table.Head>
            ))}
          </Table.Row>
        ))}
      </Table.Header>
      <Table.Body>
        {rows.map(row =>
          row.subRows?.length
            ? <GroupHeaderRow key={row.id} row={row} colSpan={row.getVisibleCells().length} />
            : (
              <Table.Row key={row.id} onClick={() => onItemClick?.(row.original)}
                         className={cx(onItemClick && styles.clickable)}>
                {row.getVisibleCells().map(cell => (
                  <Table.Cell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Table.Cell>
                ))}
              </Table.Row>
            ),
        )}
      </Table.Body>
    </Table>
  );
}

// VirtualTableBody omitted for brevity — same shape as today's virtualized-content.tsx,
// but reads `spec` from context instead of a `columns` prop.
```

---

### 12.2 List

Matches the List screenshot (§11). CSS `grid` + `subgrid` gives Table-style column alignment without the `<table>`; same column spec as Table, plus a `width` per column driving the grid track.

#### 12.2.1 Field metadata

```ts
// types.ts
export type Profile = {
  id: string;
  name: string;
  subheading: string;
  avatarUrl: string;
  label: string;
  collaborators: { id: string; avatarUrl: string }[];
  status: 'draft' | 'published' | 'archived';
  updatedAt: string;
};

// fields.ts
export const profileFields: DataViewField<Profile>[] = [
  { accessorKey: 'identity',   label: 'Person',     hideable: false },  // synthetic: avatar + name + subheading
  { accessorKey: 'name',       label: 'Name',       filterable: true, filterType: 'string', sortable: true },
  { accessorKey: 'subheading', label: 'Subtitle',   filterable: true, filterType: 'string' },
  { accessorKey: 'label',      label: 'Label',      filterable: true, filterType: 'select',
    filterOptions: [/* … */], groupable: true, showGroupCount: true, hideable: true },
  { accessorKey: 'collaborators', label: 'Collaborators', hideable: true },
  { accessorKey: 'status',     label: 'Status',     filterable: true, filterType: 'select',
    filterOptions: [
      { label: 'Draft',     value: 'draft' },
      { label: 'Published', value: 'published' },
      { label: 'Archived',  value: 'archived' },
    ],
    sortable: true, groupable: true, hideable: true,
  },
  { accessorKey: 'updatedAt',  label: 'Updated',    filterable: true, filterType: 'date', sortable: true },
];
```

#### 12.2.2 List columns (the row render spec)

```tsx
// list-columns.tsx
import type { DataViewListColumn } from '@raystack/apsara';
import { Avatar, AvatarStack, Chip, Flex, Text } from '@raystack/apsara';
import { SparkleIcon } from '~/icons';
import { StatusChip } from './atoms';
import type { Profile } from './types';

export const profileListColumns: DataViewListColumn<Profile>[] = [
  {
    accessorKey: 'identity',
    width: '1fr',
    cell: ({ row }) => (
      <Flex align="center" gap={3}>
        <Avatar src={row.original.avatarUrl} size={5} />
        <Flex direction="column" style={{ minWidth: 0 }}>
          <Text weight={500} truncate>{row.original.name}</Text>
          <Text size={2} color="muted" truncate>{row.original.subheading}</Text>
        </Flex>
      </Flex>
    ),
  },
  {
    accessorKey: 'label',
    width: 'auto',
    cell: ({ row }) => (
      <Chip size="small" leadingIcon={<SparkleIcon />}>{row.getValue('label')}</Chip>
    ),
  },
  {
    accessorKey: 'collaborators',
    width: 'auto',
    cell: ({ row }) => <AvatarStack users={row.original.collaborators} max={3} />,
  },
  {
    accessorKey: 'status',
    width: '120px',
    cell: ({ row }) => <StatusChip status={row.getValue('status')} />,
  },
];
```

Toggling the "Label" property off in DisplayControls collapses that grid track across every row — no per-cell logic needed. The column spec's `accessorKey` is the only binding.

#### 12.2.3 Full consumer usage

```tsx
// people-page.tsx
import { DataView } from '@raystack/apsara';
import { profileFields } from './fields';
import { profileListColumns } from './list-columns';

export function PeoplePage() {
  const { data: profiles = [], isLoading } = useProfilesQuery();

  return (
    <DataView<Profile>
      data={profiles}
      fields={profileFields}
      defaultSort={{ name: 'name', order: 'asc' }}
      mode="client"
      isLoading={isLoading}
      getRowId={row => row.id}
      onItemClick={profile => openProfile(profile.id)}
    >
      <DataView.Toolbar>
        <DataView.Search placeholder="Search people" />
        <DataView.Filters />
        <DataView.DisplayControls />
      </DataView.Toolbar>

      <DataView.List
        columns={profileListColumns}
        virtualized
        rowHeight={72}
        showDividers
        showGroupHeaders
        emptyState={<EmptyState icon={<PersonIcon />} heading="No matching people" />}
      />
    </DataView>
  );
}
```

#### 12.2.4 Renderer internal sketch

```tsx
// packages/raystack/components/data-view/renderers/list.tsx
'use client';
import { flexRender } from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef, useMemo } from 'react';
import { cx } from 'class-variance-authority';
import { useDataView } from '../hooks/useDataView';
import styles from '../data-view.module.css';

export function DataViewList<TData>({
  columns,
  virtualized = false,
  rowHeight = 56,
  showDividers = false,
  showGroupHeaders = true,
  overscan = 5,
  emptyState,
  zeroState,
  classNames,
}: DataViewListProps<TData>) {
  const ctx = useDataView<TData>();

  // Same merge as Table: install per-column cell renderers onto the context's
  // TanStack table (built from fields only).
  const table = useTableWithColumns(ctx.table, ctx.fields, columns);
  const rows  = table.getRowModel().rows;

  // Build grid-template-columns from visible columns only. Hidden columns are
  // already filtered out by TanStack via ctx.columnVisibility — same source
  // DisplayAccess reads from.
  const gridTemplateColumns = useMemo(
    () => table.getVisibleLeafColumns()
      .map(col => {
        const spec = columns.find(c => c.accessorKey === col.id);
        const w = spec?.width ?? '1fr';
        return typeof w === 'number' ? `${w}px` : w;
      })
      .join(' '),
    [table.getVisibleLeafColumns(), columns],
  );

  if (!rows.length && !ctx.isLoading) {
    return <div className={classNames?.root}>{ctx.hasActiveQuery ? emptyState : zeroState}</div>;
  }

  const scrollRef = useRef<HTMLDivElement>(null);
  const virtualizer = virtualized
    ? useVirtualizer({
        count: rows.length,
        getScrollElement: () => scrollRef.current,
        estimateSize: i => rows[i].subRows?.length ? 36 : rowHeight,
        overscan,
      })
    : null;

  const renderRow = (row: typeof rows[number], style?: React.CSSProperties) => {
    if (row.subRows?.length) {
      if (!showGroupHeaders) return null;
      return (
        <div key={row.id} style={{ ...style, gridColumn: '1 / -1' }} className={styles.listGroupHeader}>
          {(row.original as any).label}
          {(row.original as any).showGroupCount && <Badge>{(row.original as any).count}</Badge>}
        </div>
      );
    }
    return (
      <div
        key={row.id}
        style={{ ...style, display: 'subgrid', gridColumn: '1 / -1' }}
        className={cx(
          styles.listRow,
          showDividers && styles.listRowDivider,
          ctx.onItemClick && styles.clickable,
        )}
        onClick={() => ctx.onItemClick?.(row.original)}
      >
        {row.getVisibleCells().map(cell => (
          <div key={cell.id} className={styles.listCell}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      ref={scrollRef}
      className={cx(styles.listRoot, classNames?.root)}
      style={{ display: 'grid', gridTemplateColumns }}
    >
      {virtualizer
        ? (
          <div style={{ height: virtualizer.getTotalSize(), position: 'relative',
                        gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: 'subgrid' }}>
            {virtualizer.getVirtualItems().map(v =>
              renderRow(rows[v.index], { position: 'absolute', top: v.start, height: v.size, width: '100%' }),
            )}
          </div>
        )
        : rows.map(r => renderRow(r))}
    </div>
  );
}
```

Key point: the renderer uses `table.getVisibleLeafColumns()` (already respects `ctx.columnVisibility`) to build `grid-template-columns`. When a user toggles a column off in DisplayControls, that column disappears from both the row's `getVisibleCells()` and the container's grid template — the track collapses, rows reflow, no extra code.

---

### 12.3 Timeline (Gantt-range)

Matches the Task Prioritisation screenshot (§10). Items are bars with start/end dates, packed into lanes, rendered against a continuous time axis with a "today" marker.

#### 12.3.1 Field metadata

```ts
// types.ts
export type GanttTask = {
  id: string;
  title: string;
  priority: 'P1'|'P2'|'P3'|'P4'|'P5'|'P6'|'P7'|'P8'|'P9'|'P10';
  client: 'corteva' | 'gridline' | 'nasa';
  status: 'pending' | 'in_progress' | 'done';
  startDate: string;
  endDate: string;
  dueAt: string;
};

// fields.ts
export const ganttFields: DataViewField<GanttTask>[] = [
  { accessorKey: 'title',     label: 'Title',    filterable: true, filterType: 'string', sortable: true },
  { accessorKey: 'priority',  label: 'Priority', filterable: true, filterType: 'select',
    filterOptions: Array.from({ length: 10 }, (_, i) => ({ label: `P${i+1}`, value: `P${i+1}` })),
    sortable: true, groupable: true,
  },
  { accessorKey: 'client',    label: 'Client',   filterable: true, filterType: 'select',
    filterOptions: [
      { label: 'Corteva Agriscience',  value: 'corteva' },
      { label: 'Gridline Surveys',     value: 'gridline' },
      { label: 'NASA',                 value: 'nasa' },
    ],
    groupable: true, showGroupCount: true,
  },
  { accessorKey: 'status',    label: 'Status',   filterable: true, filterType: 'select' },
  { accessorKey: 'startDate', label: 'Start',    filterable: true, filterType: 'date', sortable: true },
  { accessorKey: 'endDate',   label: 'End',      filterable: true, filterType: 'date', sortable: true },
  { accessorKey: 'dueAt',     label: 'Due',      filterable: true, filterType: 'date', sortable: true },
];
```

#### 12.3.2 The timeline bar render spec

Timeline bars are variable-width, so no column grid. Compose freely with `<DataView.DisplayAccess>` so each field responds to the same DisplayControls toggle that drives columns in Table/List.

```tsx
// gantt-bar.tsx
import type { Row } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { DataView, Chip, Flex, Text } from '@raystack/apsara';
import { CalendarIcon } from '~/icons';
import { StatusDot } from './atoms';
import type { GanttTask } from './types';

export const renderGanttBar = (row: Row<GanttTask>) => (
  <Flex direction="column" gap={1} className="gantt-bar">
    <Flex justify="between" align="center" gap={2}>
      <Flex gap={2} align="center" style={{ minWidth: 0 }}>
        <DataView.DisplayAccess accessorKey="status">
          <StatusDot status={row.getValue('status')} />
        </DataView.DisplayAccess>
        <DataView.DisplayAccess accessorKey="title">
          <Text weight={500} truncate>{row.getValue('title')}</Text>
        </DataView.DisplayAccess>
      </Flex>
      <DataView.DisplayAccess accessorKey="priority">
        <Text size={2} color="muted">{row.getValue('priority')}</Text>
      </DataView.DisplayAccess>
    </Flex>
    <Flex gap={2} align="center">
      <DataView.DisplayAccess accessorKey="dueAt">
        <Chip size="small" leadingIcon={<CalendarIcon />}>
          Due {dayjs(row.getValue('dueAt')).format('D MMM')}
        </Chip>
      </DataView.DisplayAccess>
      <DataView.DisplayAccess accessorKey="client">
        <Text size={2} color="muted" truncate>{clientLabel(row.original.client)}</Text>
      </DataView.DisplayAccess>
    </Flex>
  </Flex>
);
```

#### 12.3.3 Full consumer usage

```tsx
// task-prioritisation-page.tsx
import { DataView } from '@raystack/apsara';
import { ganttFields } from './fields';
import { renderGanttBar } from './gantt-bar';

export function TaskPrioritisationPage() {
  const { data: tasks = [], isLoading } = useTasksQuery();

  return (
    <DataView<GanttTask>
      data={tasks}
      fields={ganttFields}
      defaultSort={{ name: 'startDate', order: 'asc' }}
      mode="client"
      isLoading={isLoading}
      getRowId={row => row.id}
      onItemClick={task => openTaskPanel(task.id)}
    >
      <DataView.Toolbar>
        <DataView.Search />
        <DataView.Filters />
        <DataView.DisplayControls />
      </DataView.Toolbar>

      <DataView.Timeline
        startField="startDate"
        endField="endDate"
        renderBar={renderGanttBar}
        scale="day"
        today
        lanePacking="auto"
        rowHeight={64}
        laneGap={8}
      />
    </DataView>
  );
}
```

#### 12.3.4 Renderer internal sketch

```tsx
// packages/raystack/components/data-view/renderers/timeline.tsx
'use client';
import { useMemo, useRef } from 'react';
import dayjs from 'dayjs';
import { cx } from 'class-variance-authority';
import { useDataView } from '../hooks/useDataView';
import { packLanes } from '../utils/pack-lanes';
import { TimelineAxis } from './timeline-axis';
import styles from '../data-view.module.css';

const SCALE_PX: Record<'day'|'week'|'month'|'quarter', number> = {
  day: 40, week: 28, month: 16, quarter: 8,
};

export function DataViewTimeline<TData>({
  startField,
  endField,
  renderBar,
  scale = 'day',
  today = true,
  lanePacking = 'auto',
  rowHeight = 56,
  laneGap = 6,
  viewportRange,
  onViewportChange,
  emptyState,
  zeroState,
  classNames,
}: DataViewTimelineProps<TData>) {
  const ctx = useDataView<TData>();
  const rows = ctx.rows.filter(r => !(r.subRows?.length)); // ignore group headers; timeline handles its own grouping
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. Auto-viewport from filtered rows if not controlled
  const [viewStart, viewEnd] = useMemo<[Date, Date]>(() => {
    if (viewportRange) return viewportRange;
    if (!rows.length)  return [dayjs().subtract(7, 'day').toDate(), dayjs().add(14, 'day').toDate()];
    const starts = rows.map(r => +new Date(r.getValue(startField)));
    const ends   = rows.map(r => +new Date(r.getValue(endField ?? startField)));
    return [new Date(Math.min(...starts)), new Date(Math.max(...ends))];
  }, [rows, startField, endField, viewportRange]);

  const pxPerDay  = SCALE_PX[scale];
  const totalDays = dayjs(viewEnd).diff(viewStart, 'day') + 1;
  const totalW    = totalDays * pxPerDay;

  // 2. Lane pack (greedy interval scheduling)
  const lanes = useMemo(
    () => packLanes(rows, {
      start: r => +new Date(r.getValue(startField)),
      end:   r => +new Date(r.getValue(endField ?? startField)),
      mode:  lanePacking,
    }),
    [rows, startField, endField, lanePacking],
  );

  if (!rows.length && !ctx.isLoading) {
    return <div className={classNames?.root}>{ctx.hasActiveQuery ? emptyState : zeroState}</div>;
  }

  const todayDate = today === true ? new Date() : (today || null);
  const bodyHeight = lanes.length * (rowHeight + laneGap);

  return (
    <div
      ref={scrollRef}
      className={cx(styles.timelineRoot, classNames?.root)}
      onScroll={() => onViewportChange?.(computeVisibleRange(scrollRef.current, viewStart, pxPerDay))}
    >
      <div style={{ width: totalW, position: 'relative' }}>
        <TimelineAxis
          start={viewStart}
          end={viewEnd}
          pxPerDay={pxPerDay}
          scale={scale}
          today={todayDate}
        />

        <div style={{ position: 'relative', height: bodyHeight }}>
          {lanes.flatMap((lane, laneIdx) =>
            lane.map(row => {
              const s = +new Date(row.getValue(startField));
              const e = +new Date(row.getValue(endField ?? startField));
              const left  = dayjs(s).diff(viewStart, 'day') * pxPerDay;
              const width = Math.max((dayjs(e).diff(s, 'day') + 1) * pxPerDay, 80);
              return (
                <div
                  key={row.id}
                  role="button"
                  tabIndex={0}
                  className={cx(styles.timelineItem, ctx.onItemClick && styles.clickable)}
                  style={{
                    position: 'absolute',
                    top:    laneIdx * (rowHeight + laneGap),
                    left,
                    width,
                    height: rowHeight,
                  }}
                  onClick={() => ctx.onItemClick?.(row.original)}
                >
                  {renderBar(row)}
                </div>
              );
            }),
          )}
        </div>
      </div>
    </div>
  );
}
```

```ts
// packages/raystack/components/data-view/utils/pack-lanes.ts
export function packLanes<T>(
  rows: T[],
  opts: {
    start: (r: T) => number;
    end:   (r: T) => number;
    mode:  'auto' | 'one-per-row';
  },
): T[][] {
  if (opts.mode === 'one-per-row') return rows.map(r => [r]);

  const sorted = [...rows].sort((a, b) => opts.start(a) - opts.start(b));
  const lanes: { end: number; items: T[] }[] = [];

  for (const row of sorted) {
    const start = opts.start(row);
    const end   = opts.end(row);
    const lane  = lanes.find(l => l.end <= start);
    if (lane) { lane.items.push(row); lane.end = end; }
    else      { lanes.push({ end, items: [row] }); }
  }
  return lanes.map(l => l.items);
}
```

The timeline renderer bypasses `groupData` entirely — it reads filtered `rows` from context and does its own horizontal bucketing via pixel math. If the user turns on grouping in `DisplayControls` (say, by `client`), lanes can optionally be partitioned per-group; the snippet above renders a single flat lane set for brevity.

---

### 12.4 What didn't change across the three examples

| | Table | List | Timeline |
| --- | --- | --- | --- |
| `data` prop | same | same | same |
| `fields` metadata | same | same | same |
| `<DataView.Toolbar>` | same | same | same |
| `<DataView.Search>` behavior | same | same | same |
| `<DataView.Filters>` menu & chips | same | same | same |
| `<DataView.DisplayControls>` ordering/grouping | same | same | partial (visibility ignored) |
| Filter predicates | same | same | same |
| `mode: 'client' \| 'server'` | same | same | same |
| `onItemClick` | same | same | same |
| `onLoadMore` / `totalRowCount` | same | same | same |
| Query state `{ filters, sort, group_by, search }` | same | same | same |

The difference across the three: the renderer subcomponent and its own render-spec props. Table and List share the **column spec shape** (List drops `header`, adds `width`); switching between them is mostly a tag change + renaming the column-spec type:

```tsx
- <DataView.Table  columns={taskTableColumns}  virtualized rowHeight={44} stickyGroupHeader />
+ <DataView.List   columns={taskListColumns}   virtualized rowHeight={64} showDividers />
```

Timeline replaces `columns` with `renderBar` (bars are variable-width) + `startField`/`endField`; field visibility inside the bar is handled by wrapping each field in `<DataView.DisplayAccess>`:

```tsx
+ <DataView.Timeline
+   startField="startDate"
+   endField="endDate"
+   renderBar={renderGanttBar}
+   scale="day" today
+ />
```

Everything in between — toolbar, filters, search, sort, group, selection, load-more, *and column visibility* — keeps working unchanged across all three renderers.

---

## 13. Recommendation

**Build it.** Ship in the phased order above. Start with Phase 0 (internal rename + extraction) as a pure refactor PR with no consumer-visible change — that validates the architecture without any risk. Then build `<DataView.List>` as the first new renderer (simplest shape, reuses the Table column spec + adds a `width` hint — cheap to ship, exercises the shared contract). Add `<DataView.DisplayAccess>` alongside List so Timeline inherits a proven visibility story. `<DataView.Timeline>` lands last — bucketization, lane packing, and two-axis virtualization are the only novel complexity.

Keep TanStack Table as the internal engine for all renderers. Do not roll a custom data-model library — the maintenance cost is real and the only "benefit" would be removing a dep the design system already uses.
