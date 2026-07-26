import type {
  ColumnDef,
  Row,
  Table,
  Updater,
  VisibilityState
} from '@tanstack/table-core';
import type {
  DataTableFilterOperatorTypes,
  FilterOperatorTypes,
  FilterSelectOption,
  FilterTypes,
  FilterValueType
} from '~/types/filters';
import type { BaseSelectProps } from '../select/select-root';

export type DataViewMode = 'client' | 'server';

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

export interface DataViewFilterValues {
  value: any;
  boolValue?: boolean;
  stringValue?: string;
  numberValue?: number;
}

export interface InternalFilter extends DataViewFilterValues {
  _type?: FilterTypes;
  _dataType?: FilterValueType;
  name: string;
  operator: FilterOperatorTypes;
}

export interface DataViewFilter extends DataViewFilterValues {
  name: string;
  operator: DataTableFilterOperatorTypes;
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
export interface DataViewField<TData = any> {
  accessorKey: string;
  /** Human-readable label shown in filter chips, Display controls, and the default Table header. */
  label: string;
  icon?: React.ReactNode;

  // filter capability
  filterable?: boolean;
  filterType?: FilterTypes;
  dataType?: FilterValueType;
  filterOptions?: FilterSelectOption[];
  defaultFilterValue?: unknown;
  filterProps?: {
    select?: BaseSelectProps;
  };

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

/**
 * Unified column spec for `DataView.List`. The same shape is used for both
 * `variant="table"` and `variant="list"`. The `header` slot is only rendered
 * when headers are visible (default for `variant="table"`).
 */
export interface DataViewListColumn<TData, TValue = unknown> {
  accessorKey: string;
  /** TanStack-style cell renderer. */
  cell?: ColumnDef<TData, TValue>['cell'];
  /** TanStack-style header renderer. Overrides the field's `label`. */
  header?: ColumnDef<TData, TValue>['header'];
  /** CSS grid track width. `1fr`, `auto`, `'200px'`, `'minmax(80px, 1fr)'`, or a number (pixels). Defaults to `1fr`. */
  width?: string | number;
  classNames?: { cell?: string; header?: string };
  styles?: { cell?: React.CSSProperties; header?: React.CSSProperties };
}

/**
 * Multi-view configuration entry. `value` must match the `name` prop on a
 * renderer; `label` is shown in the view switcher.
 */
export interface ViewSpec {
  value: string;
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

export interface DataViewProps<TData> {
  data: TData[];
  /** Renderer-agnostic field metadata. Drives filter/sort/group/visibility. */
  fields: DataViewField<TData>[];
  /** Initial query. Transformed to the internal shape on mount. */
  query?: DataViewQuery;
  mode?: DataViewMode;
  isLoading?: boolean;
  totalRowCount?: number;
  loadingRowCount?: number;
  onTableQueryChange?: (query: DataViewQuery) => void;
  defaultSort: DataViewSort;
  onLoadMore?: () => Promise<void> | void;
  onRowClick?: (row: TData) => void;
  onColumnVisibilityChange?: (columnVisibility: VisibilityState) => void;
  /** Stable unique id per row (React key). */
  getRowId?: (row: TData, index: number) => string;
  /** Multi-view configuration. When set, `DataView.DisplayControls` renders a view switcher and renderers gate themselves on the active view via their `name` prop. */
  views?: ViewSpec[];
  /** Default active view (uncontrolled). Should match a `views[].value`. */
  defaultView?: string;
  /** Active view (controlled). */
  view?: string;
  /** Called when the active view changes. */
  onViewChange?: (view: string) => void;
  /**
   * Optional local resolver map for non-accessor `group_by` keys. The wire
   * format (`group_by: string[]`) stays unchanged; resolvers run in client mode
   * to compute the bucket id per row when a key matches one in this map.
   */
  groupByResolvers?: Record<string, GroupByResolver<TData>>;
}

export type DataViewListClassNames = {
  root?: string;
  header?: string;
  headerCell?: string;
  row?: string;
  cell?: string;
  groupHeader?: string;
};

export interface DataViewListProps<TData, TValue = unknown> {
  /** Multi-view name. When set, the renderer gates itself on the active view. */
  name?: string;
  /** Visual variant. `table` renders headers and uses `role="table"`; `list` renders no headers and uses `role="list"`. Default `list`. */
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
   * `variant="table"`, 56 for `variant="list"`.
   */
  estimatedRowHeight?: number;
  /** When true, only viewport-visible rows render. Parent must have a fixed height. */
  virtualized?: boolean;
  /** Render thin dividers between rows. Defaults to true for `variant="table"`. */
  showDividers?: boolean;
  /** Show group section headers when grouping is active. Default true. */
  showGroupHeaders?: boolean;
  /** When true, group headers stick under the table header while scrolling. Default false. */
  stickyGroupHeader?: boolean;
  classNames?: DataViewListClassNames;
}

/** Date inputs accepted by Timeline props and row fields: Date, epoch ms, or a parseable string. */
export type TimelineDateInput = Date | number | string;

/** Tick granularity of the Timeline axis. */
export type TimelineScale = 'day' | 'week' | 'month' | 'quarter';

/** Full-height marker line with a badge pinned to the axis (milestones, deadlines). */
export interface TimelineMarker {
  date: TimelineDateInput;
  /** Badge content. Defaults to the marker date formatted as "17 Jan". */
  label?: React.ReactNode;
  variant?: 'default' | 'accent' | 'danger';
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
   * point cards (no `endField`) — they size to their content instead.
   */
  collapsed: boolean;
  laneIndex: number;
  start: Date;
  /** Null when `endField` is omitted (point marker). */
  end: Date | null;
}

/**
 * Imperative navigation surface exposed through `actionsRef` on
 * `DataView.Timeline` (same pattern as Tour's `actionsRef`). Available for the
 * lifetime of the component; methods no-op (with a dev warning) while the
 * renderer is hidden — inactive view or no data.
 */
export interface TimelineActions {
  /**
   * Scroll the viewport so `target` lands at `align` (default `'center'`).
   * Accepts the `defaultScrollTo` vocabulary: a date input, `'today'`,
   * `'start'`, or `'end'` (domain edges). Dates outside the domain clamp to
   * the nearest edge; invalid dates no-op with a dev warning. Edge
   * alignments keep a small inset so the target doesn't sit flush against
   * the viewport edge (yields at the domain edges).
   */
  scrollTo: (
    target: TimelineDateInput | 'today' | 'start' | 'end',
    options?: {
      align?: 'start' | 'center' | 'end';
      /** Default `'smooth'` — a navigation action should visibly travel. */
      behavior?: 'auto' | 'smooth';
    }
  ) => void;
  /** The visible time window, or null while the renderer is hidden. */
  getVisibleRange: () => [Date, Date] | null;
}

export type DataViewTimelineClassNames = {
  root?: string;
  axis?: string;
  band?: string;
  tick?: string;
  marker?: string;
  gridline?: string;
  cursor?: string;
  canvas?: string;
  card?: string;
};

export interface DataViewTimelineProps<TData> {
  /** Multi-view name. When set, the renderer gates itself on the active view. */
  name?: string;
  /**
   * Accessible name of the scroll region. The pane is keyboard-focusable
   * (arrow keys scroll it natively), so screen readers announce this label on
   * focus. Default 'Timeline'.
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
   * visual entirely — chrome, states, truncation, and the collapsed variant.
   * Compose `<DataView.DisplayAccess>` inside for Display Properties support.
   *
   * Keep the reference stable (define outside the component or wrap in
   * `useCallback`) — cards are memoized against it, and an inline function
   * defeats the memo so every visible card re-renders on each scroll frame.
   * The same applies to `onRowClick` on the `DataView` root.
   */
  renderCard: (
    row: Row<TData>,
    context: TimelineCardContext
  ) => React.ReactNode;

  /** Tick granularity of the time axis. Default 'day'. */
  scale?: TimelineScale;
  /** Pixel width of one `scale` unit — density/zoom override. */
  unitWidth?: number;
  /**
   * Explicit time domain. Defaults to the data extent (plus today when shown)
   * with padding. Either way, a domain narrower than the container is extended
   * at the end so the axis and gridlines always fill the visible width.
   */
  range?: [TimelineDateInput, TimelineDateInput];
  /** Vertical "today" line + axis badge. `true` (default) uses the current date; a date pins it. */
  today?: boolean | TimelineDateInput;
  /** Additional full-height marker lines with axis badges. */
  markers?: TimelineMarker[];
  /** Vertical gridlines at every axis tick. Default true. */
  showGridlines?: boolean;
  /**
   * Label every Nth `scale` unit on the axis, counted from the domain start
   * (e.g. `2` on a day scale labels every other day). Labels never render
   * closer than the collision floor, so a too-dense value degrades gracefully.
   * Default: the densest interval whose labels fit.
   */
  tickInterval?: number;
  /**
   * Draw a gridline every Nth `scale` unit, counted from the domain start.
   * Independent of `tickInterval` and purely visual — cards, the today line,
   * and the hover cursor still land on every unit. Default 1.
   */
  gridlineInterval?: number;
  /**
   * Hover crosshair: a darker line snapped to the sub-interval (tick unit)
   * under the pointer, with a date badge pinned to the axis. Default true.
   */
  showCursorLine?: boolean;
  /** Initial horizontal scroll target. Default 'today'. */
  defaultScrollTo?: TimelineDateInput | 'today' | 'start' | 'end';
  /**
   * After a filter or search change, scroll the earliest matching card into
   * view when no match intersects the current viewport — otherwise a filter
   * whose results are off-screen leaves the user parked on empty canvas. A
   * query change that keeps at least one card on screen doesn't move the
   * view. Default true.
   */
  scrollToResults?: boolean;
  /** Fires (rAF-throttled) with the visible time range as the user scrolls or resizes. */
  onVisibleRangeChange?: (range: [Date, Date]) => void;
  /** Receives the imperative navigation handle (`scrollTo`, `getVisibleRange`). */
  actionsRef?: React.RefObject<TimelineActions | null>;

  /**
   * 'auto' (default) packs non-overlapping cards into shared lanes (greedy
   * interval scheduling); 'one-per-row' gives every row its own lane.
   */
  lanePacking?: 'auto' | 'one-per-row';
  /**
   * Estimated card height in px, same contract as `DataView.List`: cards
   * render at their natural content height and are measured after paint; the
   * estimate only seeds lane layout until real heights arrive. Each lane
   * sizes to its tallest card. Default 66.
   */
  estimatedRowHeight?: number;
  /** Vertical gap between lanes in px. Default 16. */
  laneGap?: number;
  /** Spans narrower than this (px) flip `context.collapsed` for `renderCard`. Default 60. */
  minCardWidth?: number;
  /**
   * Assumed width (px) of point-marker cards (rows without `endField`) for
   * lane packing. Point cards size to their content, so the packer can't know
   * their width — set this to roughly the widest point card to prevent
   * horizontal overlap within a lane. Default 120.
   */
  estimatedPointWidth?: number;

  /** When true, only cards/gridlines near the visible viewport are rendered (horizontal culling). */
  virtualized?: boolean;
  classNames?: DataViewTimelineClassNames;
}

export type TableQueryUpdateFn = (query: InternalQuery) => InternalQuery;

export type DataViewContextType<TData> = {
  table: Table<TData>;
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
  columnVisibility: VisibilityState;
  setColumnVisibility: (value: Updater<VisibilityState>) => void;

  // multi-view
  views?: ViewSpec[];
  activeView?: string;
  setActiveView: (view: string) => void;
  /** Called by each renderer on mount to register its `fields` override for its `name`. Returns a cleanup function. */
  registerFieldsForView: (
    name: string,
    fields: DataViewField<TData>[]
  ) => () => void;

  // global derived state — shared across all renderers and sibling components
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
