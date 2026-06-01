import type {
  ColumnDef,
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
