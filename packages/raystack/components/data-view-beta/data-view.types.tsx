import type { ColumnDef, Table, VisibilityState } from '@tanstack/table-core';
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
  // Only one of these value fields should be present at a time
  boolValue?: boolean;
  stringValue?: string;
  numberValue?: number;
}

// Internal filter with UI operators and metadata
export interface InternalFilter extends DataViewFilterValues {
  _type?: FilterTypes;
  _dataType?: FilterValueType;
  name: string;
  operator: FilterOperatorTypes;
}

// DataView filter for backend API (no internal fields)
export interface DataViewFilter extends DataViewFilterValues {
  name: string;
  operator: DataTableFilterOperatorTypes;
}

// Internal query with UI operators and metadata
export interface InternalQuery {
  filters?: InternalFilter[];
  sort?: DataViewSort[];
  group_by?: string[];
  offset?: number;
  limit?: number;
  search?: string;
}

// DataView query for backend API (clean, no internal fields)
export interface DataViewQuery extends Omit<InternalQuery, 'filters'> {
  filters?: DataViewFilter[];
}

/**
 * Renderer-agnostic field metadata. One entry per logical column of the data
 * model. Declared once on `<DataView>`; drives filters, sort, group, visibility
 * across every renderer. Cell/header rendering belongs on the renderer's own
 * column spec, not here.
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
 * Table row render spec. Points at a field via `accessorKey` and adds
 * per-column cell/header renderers. Filterable/sortable/etc. live on the field,
 * not duplicated here.
 */
export interface DataViewTableColumn<TData, TValue = unknown> {
  accessorKey: string;
  /** TanStack-style cell renderer. Receives `CellContext` and returns ReactNode. */
  cell?: ColumnDef<TData, TValue>['cell'];
  /** TanStack-style header renderer. Overrides the field's `label` for this renderer. */
  header?: ColumnDef<TData, TValue>['header'];
  classNames?: {
    cell?: string;
    header?: string;
  };
  styles?: {
    cell?: React.CSSProperties;
    header?: React.CSSProperties;
  };
}

/**
 * List row render spec. Same data shape as Table plus a CSS grid `width` hint.
 * List has no column headers, so no `header` renderer.
 */
export interface DataViewListColumn<TData, TValue = unknown> {
  accessorKey: string;
  /** TanStack-style cell renderer. */
  cell?: ColumnDef<TData, TValue>['cell'];
  /** CSS grid track width. `1fr`, `auto`, `'200px'`, `'minmax(80px, 1fr)'`, or a number (pixels). Defaults to `1fr`. */
  width?: string | number;
  classNames?: { cell?: string };
  styles?: { cell?: React.CSSProperties };
}

export interface DataViewProps<TData> {
  data: TData[];
  /** Renderer-agnostic field metadata. Drives filter/sort/group/visibility. */
  fields: DataViewField<TData>[];
  query?: DataViewQuery; // Initial query (will be transformed to internal format)
  mode?: DataViewMode;
  isLoading?: boolean;
  totalRowCount?: number;
  loadingRowCount?: number;
  onTableQueryChange?: (query: DataViewQuery) => void;
  defaultSort: DataViewSort;
  onLoadMore?: () => Promise<void>;
  onRowClick?: (row: TData) => void;
  onColumnVisibilityChange?: (columnVisibility: VisibilityState) => void;
  /** Return a stable unique id for each row (used as React key). Use for sortable/filterable tables. */
  getRowId?: (row: TData, index: number) => string;
}

export type DataViewContentClassNames = {
  root?: string;
  table?: string;
  header?: string;
  body?: string;
  row?: string;
};

export type DataViewTableBaseProps<TData, TValue = unknown> = {
  /** Table column render specs (cell/header/styles) keyed by field accessor. */
  columns: DataViewTableColumn<TData, TValue>[];
  emptyState?: React.ReactNode;
  zeroState?: React.ReactNode;
  classNames?: DataViewContentClassNames;
  /** When true, renders with virtualized rows. */
  virtualized?: boolean;
  /** Height of each row in pixels. Used for virtualized mode. */
  rowHeight?: number;
  /** Height of group header rows in pixels. Falls back to rowHeight if not set. */
  groupHeaderHeight?: number;
  /** Number of rows to render outside visible area. */
  overscan?: number;
  /** Distance in pixels from bottom to trigger load more. */
  loadMoreOffset?: number;
  /** When true, group headers stick under the table header while scrolling. Default is false. */
  stickyGroupHeader?: boolean;
};

export type DataViewTableProps<
  TData,
  TValue = unknown
> = DataViewTableBaseProps<TData, TValue>;

export type DataViewListClassNames = {
  root?: string;
  row?: string;
  cell?: string;
  groupHeader?: string;
};

export interface DataViewListProps<TData, TValue = unknown> {
  /** List column render specs (cell/width/styles) keyed by field accessor. */
  columns: DataViewListColumn<TData, TValue>[];
  /** Row height in px. Used when virtualized. Default 56. */
  rowHeight?: number;
  /** When true, virtualizes rows. */
  virtualized?: boolean;
  /** Number of rows to render outside the viewport when virtualized. */
  overscan?: number;
  /** Render thin dividers between rows. */
  showDividers?: boolean;
  /** Show group section headers when grouping is active. Default true. */
  showGroupHeaders?: boolean;
  /** Distance in pixels from bottom to trigger load more. */
  loadMoreOffset?: number;
  emptyState?: React.ReactNode;
  zeroState?: React.ReactNode;
  classNames?: DataViewListClassNames;
}

export type TableQueryUpdateFn = (query: InternalQuery) => InternalQuery;

export type DataViewContextType<TData> = {
  table: Table<TData>;
  /** Renderer-agnostic field metadata — Filters/DisplayControls/every renderer reads from here. */
  fields: DataViewField<TData>[];
  isLoading?: boolean;
  loadMoreData: () => void;
  mode: DataViewMode;
  defaultSort: DataViewSort;
  tableQuery?: InternalQuery;
  totalRowCount?: number;
  loadingRowCount?: number;
  onDisplaySettingsReset: () => void;
  updateTableQuery: (fn: TableQueryUpdateFn) => void;
  onRowClick?: (row: TData) => void;
  shouldShowFilters?: boolean;
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
