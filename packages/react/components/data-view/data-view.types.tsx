import type { Tabs as TabsPrimitive } from '@base-ui/react';
import type {
  ColumnDef,
  ColumnVisibilityState,
  ReactTable,
  Row,
  RowData,
  RowSelectionState,
  Updater
} from '@tanstack/react-table';
import type { ChangeDetails } from '~/shared/change-details';
import type { FilterOperations } from '~/shared/filter-operations';
import type {
  DateFilterOperatorType,
  FilterDataType,
  FilterOperatorTypes,
  FilterSelectOption,
  FilterTypes,
  FilterValueType,
  MultiSelectFilterOperatorType,
  NumberFilterOperatorType,
  SelectFilterOperatorType
} from '~/types/filters';
import type { BaseSelectProps } from '../select/select-root';
import type { DataViewFeatures } from './features';

/** The TanStack table that `DataView` builds, as returned by `useDataView().table`. */
export type DataViewTable<TData extends RowData> = ReactTable<
  DataViewFeatures,
  TData
>;

/** A row of the `DataView` table, as passed to `renderCard` and column cells. */
export type DataViewRow<TData extends RowData> = Row<DataViewFeatures, TData>;

export type DataViewMode = 'client' | 'server';

export type DataViewViewChangeDetails =
  ChangeDetails<TabsPrimitive.Root.ChangeEventReason>;

export type DataViewQueryChangeDetails = ChangeDetails<'none'>;

export const SortOrders = {
  ASC: 'asc',
  DESC: 'desc'
} as const;

type SortOrdersKeys = keyof typeof SortOrders;
export type SortOrdersValues = (typeof SortOrders)[SortOrdersKeys];

export interface DataViewSort {
  name: string;
  order: SortOrdersValues;
}

export type DataViewFilterValue =
  | FilterValueType
  | FilterValueType[]
  | Date
  | null
  | undefined;

export interface DataViewFilterValues {
  value: DataViewFilterValue;
  boolValue?: boolean;
  stringValue?: string;
  numberValue?: number;
}

export interface InternalFilter extends DataViewFilterValues {
  _type?: FilterTypes;
  _dataType?: FilterDataType;
  name: string;
  operator: FilterOperatorTypes;
}

/** Operators in the query. String `contains`, `starts_with` and `ends_with` are sent as `ilike`. */
export type DataViewFilterOperatorTypes =
  | NumberFilterOperatorType
  | 'eq'
  | 'neq'
  | 'ilike'
  | DateFilterOperatorType
  | SelectFilterOperatorType
  | MultiSelectFilterOperatorType
  | 'empty';

export interface DataViewFilter extends DataViewFilterValues {
  name: string;
  operator: DataViewFilterOperatorTypes;
}

export interface InternalQuery {
  filters?: InternalFilter[];
  sort?: DataViewSort[];
  group_by?: string[];
  offset?: number;
  limit?: number;
  search?: string;
}

export interface DataViewQuery extends Omit<InternalQuery, 'filters'> {
  filters?: DataViewFilter[];
}

/**
 * Renderer-agnostic field metadata. One entry per logical column of the data
 * model. Declared once on `<DataView>`; drives filter, sort, group, and
 * visibility behaviour across every renderer. Cell/header rendering belongs on
 * each renderer's own column spec, not here.
 */
export interface DataViewField<TData = unknown> {
  /** A key of `TData`, or a dotted path to a nested value. */
  accessorKey: Extract<keyof TData, string> | (string & {});
  /** Human-readable label shown in filter chips, Display controls, and the default Table header. */
  label: string;
  /** Icon for the field. No built-in DataView part renders it. */
  leadingIcon?: React.ReactNode;

  // filter capability
  /** Whether the add-filter menu offers this field. */
  filterable?: boolean;
  /**
   * Input type of the field's filter.
   * @default "string"
   */
  filterType?: FilterTypes;
  /**
   * Value type of a `select` or `multiselect` filter.
   * @default "string"
   */
  dataType?: FilterDataType;
  /**
   * Options of a `select` or `multiselect` filter. While this is empty, the
   * add-filter menu leaves out the field, and its trigger is disabled when no
   * other field is left.
   */
  filterOptions?: FilterSelectOption[];
  /**
   * Operations the filter chip offers. An array replaces the operations of the
   * filter type, a function receives them and returns the list to use. An
   * empty result falls back to the operations of the filter type.
   * @default the operations of the filter type
   */
  filterOperations?: FilterOperations;
  /**
   * Value a new filter on this field starts with. When it is not set or
   * `null`, a `date` filter starts with today, a `select` filter with its
   * first option, and other filters with `""`.
   */
  defaultFilterValue?: DataViewFilterValue;
  /** Props for the filter's control. The `Select` of a `select` or `multiselect` filter receives `select`. */
  filterProps?: {
    select?: BaseSelectProps;
  };

  // ordering / grouping / visibility capability
  /** Whether the Ordering control offers this field. */
  sortable?: boolean;
  /** Whether the Grouping control offers this field. */
  groupable?: boolean;
  /** Whether Display Properties can show and hide this field. */
  hideable?: boolean;
  /** Whether the field is hidden on the first render. */
  defaultHidden?: boolean;

  // group-header presentation (used by any renderer that groups)
  /** Whether group headers show the item count next to the label. */
  showGroupCount?: boolean;
  /** Count shown next to each group header when `showGroupCount` is set, by raw group value. A group not in the map shows its row count. */
  groupCountMap?: Record<string, number>;
  /** Labels of the group headers, by raw group value. A group not in the map shows its raw value. */
  groupLabelsMap?: Record<string, string>;
  /**
   * Section order when this field is the active `group_by`, keyed by raw group
   * value (the same keys `groupLabelsMap` uses), for example
   * `['High', 'Medium', 'Low']` for a priority field, which text sorting alone
   * can't produce.
   *
   * Values absent from the list follow in first-seen data order, and rows with
   * no value always land in the last section. A listed value with no rows
   * produces no section. Honoured by every renderer that groups.
   */
  groupOrder?: string[];
}

/**
 * Unified column spec for `DataView.List`. The same shape is used for both
 * `variant="table"` and `variant="list"`. The `header` slot is only rendered
 * when headers are visible (default for `variant="table"`).
 */
export interface DataViewListColumn<TData extends RowData, TValue = unknown> {
  /**
   * The `accessorKey` of the field the column shows. A key that no field has
   * makes a column that is always shown, for example for row actions.
   */
  accessorKey: string;
  /** TanStack-style cell renderer. */
  cell?: ColumnDef<DataViewFeatures, TData, TValue>['cell'];
  /** TanStack-style header renderer. Overrides the field's `label`. */
  header?: ColumnDef<DataViewFeatures, TData, TValue>['header'];
  /**
   * CSS grid track width, for example `"auto"`, `"200px"`, or
   * `"minmax(80px, 1fr)"`. A number is in pixels.
   * @default "1fr"
   */
  width?: string | number;
  /**
   * @deprecated Every cell and header cell carries `data-column={accessorKey}`
   * alongside its `data-slot`. Target this column with
   * `[data-slot="data-view-list-cell"][data-column="..."]` (and the
   * `-header-cell` variant) instead.
   */
  classNames?: { cell?: string; header?: string };
  /** Inline styles for the column's cells and its header cell. */
  styles?: { cell?: React.CSSProperties; header?: React.CSSProperties };
}

/**
 * Multi-view configuration entry. `value` must match the `name` prop on a
 * renderer; `label` is shown in the view switcher.
 */
export interface ViewSpec {
  /** Matches the `name` prop of a renderer. */
  value: string;
  /** Text of the view's tab in the view switcher. */
  label: string;
  /** Optional icon rendered before the view's label in the switcher tab. */
  leadingIcon?: React.ReactNode;
}

/**
 * Local resolver for a group_by key. Lets a string key in `group_by` (which
 * stays on the wire untouched for server-mode round-trips) map to a function
 * that returns a bucket id per row.
 */
export type GroupByResolver<TData> = (row: TData) => string;

export interface DataViewProps<TData extends RowData> {
  /** The rows to show. */
  data: TData[];
  /** Renderer-agnostic field metadata. Drives filter/sort/group/visibility. */
  fields: DataViewField<TData>[];
  /** The query (controlled). */
  query?: DataViewQuery;
  /** The query on the first render (uncontrolled). */
  defaultQuery?: DataViewQuery;
  /**
   * Where filtering, sorting, and search run. `client` runs them on `data`.
   * `server` leaves them to your backend.
   * @default "client"
   */
  mode?: DataViewMode;
  /**
   * Shows skeleton rows and holds back `onLoadMore`.
   * @default false
   */
  loading?: boolean;
  /** Total number of rows on the server. Server mode uses it to count the rows that filters hide. */
  totalRowCount?: number;
  /**
   * Number of skeleton rows shown while `loading`.
   * @default 3
   */
  loadingRowCount?: number;
  /** Called when the query changes. Server mode also calls it on mount. */
  onQueryChange?: (
    query: DataViewQuery,
    details: DataViewQueryChangeDetails
  ) => void;
  /** Sort used when the query has none. The reset button of `DataView.DisplayControls` returns to it. */
  defaultSort: DataViewSort;
  /** Called in server mode when `DataView.List` scrolls near its end. */
  onLoadMore?: () => Promise<void> | void;
  /** Called with the row's data when a row or a timeline card is clicked. */
  onRowClick?: (row: TData) => void;
  /** Called with the new visibility map when a field is shown or hidden. */
  onColumnVisibilityChange?: (columnVisibility: ColumnVisibilityState) => void;
  /**
   * Fires with the new selection map whenever rows are selected or deselected
   * (`row.toggleSelected()`, `table.toggleAllRowsSelected()`, …). Selection
   * itself lives on the table instance, so read it through
   * `useDataView().table`; this is only for mirroring it outside the tree.
   * Keys are `getRowId` values (row indices when `getRowId` is omitted).
   */
  onRowSelectionChange?: (rowSelection: RowSelectionState) => void;
  /** Stable unique id per row (React key). */
  getRowId?: (row: TData, index: number) => string;
  /** Multi-view configuration. When set, `DataView.DisplayControls` renders a view switcher and renderers gate themselves on the active view via their `name` prop. */
  views?: ViewSpec[];
  /** Default active view (uncontrolled). Should match a `views[].value`. */
  defaultView?: string;
  /** Active view (controlled). */
  view?: string;
  /** Called when the active view changes. */
  onViewChange?: (view: string, details: DataViewViewChangeDetails) => void;
  /**
   * Optional local resolver map for non-accessor `group_by` keys. The wire
   * format (`group_by: string[]`) stays unchanged; resolvers run in client mode
   * to compute the bucket id per row when a key matches one in this map.
   */
  groupByResolvers?: Record<string, GroupByResolver<TData>>;
  /** The DataView's toolbar, renderers, and other parts. */
  children?: React.ReactNode;
}

/** @deprecated Every key here has an equivalent `[data-slot]` selector. See the List slot table in the DataView docs. Prefer styling by `data-slot` over threading class names through props. */
export type DataViewListClassNames = {
  /** @deprecated Use `[data-slot="data-view-list"]` instead. */
  root?: string;
  /** @deprecated Use `[data-slot="data-view-list-header"]` instead. */
  header?: string;
  /** @deprecated Use `[data-slot="data-view-list-header-cell"]` instead. */
  headerCell?: string;
  /** @deprecated Use `[data-slot="data-view-list-row"]` instead. */
  row?: string;
  /** @deprecated Use `[data-slot="data-view-list-cell"]` instead. */
  cell?: string;
  /** @deprecated Use `[data-slot="data-view-list-group-header"]` instead. */
  groupHeader?: string;
};

export interface DataViewListProps<TData extends RowData, TValue = unknown> {
  /** Multi-view name. When set, the renderer gates itself on the active view. */
  name?: string;
  /**
   * Visual variant. `table` renders headers and uses `role="table"`; `list` renders no headers and uses `role="list"`.
   * @default "list"
   */
  variant?: 'table' | 'list';
  /** Override the header row visibility. Defaults to `variant === 'table'`. */
  showHeaders?: boolean;
  /** Override the ARIA role applied to the renderer root. Derived from `variant` by default. */
  role?: 'table' | 'list';
  /** Optional view-scoped field override. Full replacement of root `fields` for this view's active session. */
  fields?: DataViewField<TData>[];

  /** Column render specs (cell/header/width/styles). */
  columns: DataViewListColumn<TData, TValue>[];
  /**
   * Initial row-height estimate (px). Rows are auto-measured after they paint,
   * so this is only used until the first measurement. Default 40 for
   * `variant="table"`, 56 for `variant="list"`, multiplied by the theme's
   * `scaling`. An explicit value is used as passed.
   */
  estimatedRowHeight?: number;
  /**
   * When true, only viewport-visible rows render. Parent must have a fixed height.
   * @default false
   */
  virtualized?: boolean;
  /** Render thin dividers between rows. Defaults to true for `variant="table"`. */
  showDividers?: boolean;
  /**
   * Hide group section headers when grouping is active.
   * @default false
   */
  hideGroupHeaders?: boolean;
  /**
   * When true, group headers stick under the table header while scrolling.
   * @default false
   */
  stickyGroupHeader?: boolean;
  /** @deprecated Style rendered parts by `[data-slot]` instead. See `DataViewListClassNames`. */
  classNames?: DataViewListClassNames;
}

/** Date inputs accepted by Timeline props and row fields: Date, epoch ms, or a parseable string. */
export type TimelineDateInput = Date | number | string;

/** Tick granularity of the Timeline axis. */
export type TimelineScale = 'day' | 'week' | 'month' | 'quarter';

/** Full-height marker line with a badge pinned to the axis (milestones, deadlines). */
export interface TimelineMarker {
  /** Position of the marker. */
  date: TimelineDateInput;
  /** Badge content. Defaults to the marker date formatted as "17 Jan". */
  label?: React.ReactNode;
  /**
   * Color of the badge and the line.
   * @default "neutral"
   */
  color?: 'neutral' | 'accent' | 'danger';
}

/**
 * Geometry + state handed to `renderCard`. The Timeline owns positioning; the
 * consumer owns the card visual and uses this context to adapt it (e.g. render
 * a compact stub when `collapsed`).
 */
export interface TimelineCardContext {
  /** Pixel width of the time span (0 when `endField` is omitted). */
  width: number;
  /**
   * True when the span is narrower than `minCardWidth`. Always false for
   * point cards (no `endField`), which size to their content instead.
   */
  collapsed: boolean;
  /**
   * Lane (row) index assigned by packing. Relative to the card's own group
   * section when `group_by` is active, so every section's first lane is 0.
   */
  laneIndex: number;
  /** Resolved start date. */
  start: Date;
  /** Resolved end date. Null when `endField` is omitted (point marker). */
  end: Date | null;
}

/**
 * Imperative navigation surface exposed through `actionsRef` on
 * `DataView.Timeline` (same pattern as Tour's `actionsRef`). Available for the
 * lifetime of the component; methods no-op (with a dev warning) while the
 * renderer is hidden, whether by an inactive view or no data.
 */
export interface TimelineActions {
  /**
   * Scroll the viewport so `target` lands at `align` (default `'center'`),
   * with `behavior` (default `'smooth'`).
   * Accepts the `defaultScrollTo` vocabulary: a date input, `'today'`,
   * `'start'`, or `'end'` (domain edges). Dates outside the domain clamp to
   * the nearest edge; invalid dates no-op with a dev warning. Edge
   * alignments keep a small inset so the target doesn't sit flush against
   * the viewport edge (yields at the domain edges). While the renderer is
   * hidden, it does nothing and warns in development.
   */
  scrollTo: (
    target: TimelineDateInput | 'today' | 'start' | 'end',
    options?: {
      align?: 'start' | 'center' | 'end';
      /** Default `'smooth'`, since a navigation action should visibly travel. */
      behavior?: 'auto' | 'smooth';
    }
  ) => void;
  /** The visible time window, or null while the renderer is hidden. */
  getVisibleRange: () => [Date, Date] | null;
}

/** @deprecated Every key here has an equivalent `[data-slot]` selector. See the Timeline slot table in the DataView docs. Prefer styling by `data-slot` over threading class names through props. */
export type DataViewTimelineClassNames = {
  /** @deprecated Use `[data-slot="data-view-timeline"]` instead. */
  root?: string;
  /** @deprecated Use `[data-slot="data-view-timeline-axis"]` instead. */
  axis?: string;
  /** @deprecated Use `[data-slot="data-view-timeline-axis-band"]` instead. */
  band?: string;
  /** @deprecated Use `[data-slot="data-view-timeline-axis-tick"]` instead. */
  tick?: string;
  /** @deprecated Use `[data-slot="data-view-timeline-marker"]` instead. */
  marker?: string;
  /** @deprecated Use `[data-slot="data-view-timeline-gridline"]` instead. */
  gridline?: string;
  /** @deprecated Use `[data-slot="data-view-timeline-cursor"]` instead. */
  cursor?: string;
  /** @deprecated Use `[data-slot="data-view-timeline-canvas"]` instead. */
  canvas?: string;
  /** @deprecated Use `[data-slot="data-view-timeline-card"]` instead. */
  card?: string;
  /**
   * Group section header band (same name/role as `DataViewListClassNames.groupHeader`).
   * @deprecated Use `[data-slot="data-view-timeline-group-header"]` instead.
   */
  groupHeader?: string;
};

export interface DataViewTimelineProps<TData extends RowData> {
  /** Multi-view name. When set, the renderer gates itself on the active view. */
  name?: string;
  /**
   * Accessible name of the scroll region. The pane is keyboard-focusable
   * (arrow keys scroll it natively), so screen readers announce this label on
   * focus.
   * @default "Timeline"
   */
  'aria-label'?: string;
  /** Optional view-scoped field override. Full replacement of root `fields` for this view's active session. */
  fields?: DataViewField<TData>[];

  /** Accessor key on the row yielding the start date. Rows with a missing/invalid value are skipped. */
  startField: string;
  /** Accessor key for the end date. Omitted → point markers; present → variable-width span cards. */
  endField?: string;

  /**
   * Renders the card interior. The Timeline owns positioning (x from start,
   * width from span, lane from packing, scroll); the consumer owns the card
   * visual entirely: chrome, states, truncation, and the collapsed variant.
   * The first argument is a `DataViewRow`, the TanStack row wrapper, with the
   * row data on `row.original`.
   * Compose `<DataView.DisplayAccess>` inside for Display Properties support.
   *
   * Keep the reference stable (define outside the component or wrap in
   * `useCallback`), because cards are memoized against it and an inline function
   * defeats the memo so every visible card re-renders on each scroll frame.
   * The same applies to `onRowClick` on the `DataView` root.
   */
  renderCard: (
    row: DataViewRow<TData>,
    context: TimelineCardContext
  ) => React.ReactNode;

  /**
   * Tick granularity of the time axis.
   * @default "day"
   */
  scale?: TimelineScale;
  /**
   * Pixel width of one `scale` unit, as a density or zoom override. The default
   * (day 20, week 56, month 96, quarter 140) is multiplied by the theme's
   * `scaling`. An explicit value is used as passed.
   */
  unitWidth?: number;
  /**
   * Explicit time domain. Defaults to the data extent (plus today and the
   * markers) with padding. Either way, a domain narrower than the container is
   * extended at the end so the axis and gridlines always fill the visible width.
   */
  range?: [TimelineDateInput, TimelineDateInput];
  /**
   * Vertical "today" line + axis badge. `true` uses the current date, a date
   * pins it, and `false` hides it.
   * @default true
   */
  today?: boolean | TimelineDateInput;
  /** Additional full-height marker lines with axis badges. */
  markers?: TimelineMarker[];
  /**
   * Hide the vertical gridlines at every axis tick.
   * @default false
   */
  hideGridlines?: boolean;
  /**
   * Label every Nth `scale` unit on the axis, counted from the domain start
   * (e.g. `2` on a day scale labels every other day). Labels never render
   * closer than the collision floor, so a too-dense value degrades gracefully.
   * Default: the densest interval whose labels fit.
   */
  tickInterval?: number;
  /**
   * Draw a gridline every Nth `scale` unit, counted from the domain start.
   * Independent of `tickInterval` and purely visual: cards, the today line,
   * and the hover cursor still land on every unit.
   * @default 1
   */
  gridlineInterval?: number;
  /**
   * Hide the hover crosshair: a darker line snapped to the sub-interval (tick
   * unit) under the pointer, with a date badge pinned to the axis.
   * @default false
   */
  hideCursorLine?: boolean;
  /**
   * Initial horizontal scroll target. `start` and `end` are the edges of the
   * domain.
   * @default "today"
   */
  defaultScrollTo?: TimelineDateInput | 'today' | 'start' | 'end';
  /**
   * After a filter or search change, scroll the earliest matching card into
   * view when no match intersects the current viewport. Otherwise a filter
   * whose results are off-screen leaves the user parked on empty canvas. A
   * query change that keeps at least one card on screen doesn't move the
   * view.
   * @default true
   */
  scrollToResults?: boolean;
  /** Fires (rAF-throttled) with the visible time range as the user scrolls or resizes. */
  onVisibleRangeChange?: (range: [Date, Date]) => void;
  /** Receives the imperative navigation handle (`scrollTo`, `getVisibleRange`). */
  actionsRef?: React.RefObject<TimelineActions | null>;

  /**
   * 'auto' packs non-overlapping cards into shared lanes (greedy
   * interval scheduling); 'one-per-row' gives every row its own lane, in
   * row-model (sorted) order; 'one-per-sort-value' gives every distinct value of
   * the **sorted-by** field its own lane, packing that value's cards by date
   * within it. All apply per group section when `group_by` is active, so cards
   * never share a lane across sections.
   *
   * Under 'one-per-sort-value' the active sort does double duty: it picks the field
   * lanes are built from (sort by `priority` → a High lane, a Medium lane, a
   * Low lane) and it orders them, so the Ordering control repositions lanes
   * live. Lane order is the sort's order, so rank values that don't sort
   * naturally (High/Medium/Low) with a numeric field and sort on that. Rows
   * whose value is null, empty, or a non-primitive share one lane, placed last.
   * @default "auto"
   */
  lanePacking?: 'auto' | 'one-per-row' | 'one-per-sort-value';
  /**
   * Lane height in px. The default is multiplied by the theme's `scaling`. An
   * explicit value is used as passed.
   *
   * Unvirtualized this is an estimate, same contract as `DataView.List`: cards
   * render at their natural content height and are measured after paint, the
   * estimate only seeding lane layout until real heights arrive, and each lane
   * sizing to its tallest card.
   *
   * With `virtualized` it is exact. A culled card never mounts and so never
   * measures, so measured lanes would resize under the user as they scroll,
   * lanes take this value instead, and a card taller than it overflows its
   * lane rather than growing it. Set it to your card's height.
   * @default 66
   */
  estimatedRowHeight?: number;
  /**
   * Vertical gap between lanes in px. The default is multiplied by the theme's
   * `scaling`. An explicit value is used as passed.
   * @default 16
   */
  laneGap?: number;
  /**
   * Spans narrower than this (px) flip `context.collapsed` for `renderCard`.
   * The default is multiplied by the theme's `scaling`. An explicit value is
   * used as passed.
   * @default 60
   */
  minCardWidth?: number;
  /**
   * Assumed width (px) of point-marker cards (rows without `endField`) for
   * lane packing. Point cards size to their content, so the packer can't know
   * their width, so set this to roughly the widest point card to prevent
   * horizontal overlap within a lane. The default is multiplied by the theme's
   * `scaling`. An explicit value is used as passed.
   * @default 120
   */
  estimatedPointWidth?: number;

  /**
   * Render only the cards and gridlines near the visible viewport, culling on
   * both axes, so a frame costs what's on screen rather than what's in the data.
   * Recommended whenever the domain is long or rows are numerous.
   *
   * Lane heights become fixed to `estimatedRowHeight`; see the note there.
   * @default false
   */
  virtualized?: boolean;

  /**
   * Hide the group header band above each section when `group_by` is active.
   * Same contract as `DataViewListProps.hideGroupHeaders`: true hides the
   * bands only, and rows stay grouped into their sections.
   * @default false
   */
  hideGroupHeaders?: boolean;
  /** @deprecated Style rendered parts by `[data-slot]` instead. See `DataViewTimelineClassNames`. */
  classNames?: DataViewTimelineClassNames;
}

export type TableQueryUpdateFn = (query: InternalQuery) => InternalQuery;

export type DataViewContextType<TData extends RowData> = {
  table: DataViewTable<TData>;
  /** Effective fields for the active view (= override fields if registered, else root fields). */
  fields: DataViewField<TData>[];
  /** Root-declared fields, unchanged by view overrides. */
  rootFields: DataViewField<TData>[];

  // data
  data: TData[];
  isLoading?: boolean;
  loadMoreData: () => void;
  mode: DataViewMode;
  defaultSort: DataViewSort;
  tableQuery: InternalQuery;
  totalRowCount?: number;
  loadingRowCount?: number;
  onDisplaySettingsReset: () => void;
  updateTableQuery: (fn: TableQueryUpdateFn) => void;
  onRowClick?: (row: TData) => void;
  shouldShowFilters: boolean;

  // visibility (lifted to context per RFC §"Unified Column Visibility via DisplayAccess")
  columnVisibility: ColumnVisibilityState;
  setColumnVisibility: (value: Updater<ColumnVisibilityState>) => void;

  // selection
  rowSelection: RowSelectionState;
  setRowSelection: (value: Updater<RowSelectionState>) => void;

  // multi-view
  views?: ViewSpec[];
  activeView?: string;
  setActiveView: (view: string, details?: DataViewViewChangeDetails) => void;
  /** Called by each renderer on mount to register its `fields` override for its `name`. Returns a cleanup function. */
  registerFieldsForView: (
    name: string,
    fields: DataViewField<TData>[]
  ) => () => void;

  // global derived state, shared across all renderers and sibling components
  hasData: boolean;
  hasActiveQuery: boolean;
  isZeroState: boolean;
  isEmptyState: boolean;
};

export interface ColumnData {
  label: string;
  id: string;
  isVisible?: boolean;
}

interface SubRows<_T> {}

export interface GroupedData<T> extends SubRows<T> {
  label: string;
  group_key: string;
  subRows: T[];
  count?: number;
  showGroupCount?: boolean;
}

export const defaultGroupOption = {
  id: '--',
  label: 'No grouping'
};
