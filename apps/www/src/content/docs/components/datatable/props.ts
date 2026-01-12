import { ReactNode } from 'react';

export interface DataTableProps {
  /** Column definitions (Required) */
  columns: DataTableColumnDef[];

  /** Table data (Required) */
  data: Array<T>;

  /**
   * Data processing mode
   * @defaultValue "client"
   */
  mode?: 'client' | 'server';

  /**
   * Loading state
   * @defaultValue false
   */
  isLoading?: boolean;

  /** Default sort configuration */
  defaultSort?: Sort;

  /** Initial query state */
  query?: DataTableQuery;

  /** Query change callback */
  onTableQueryChange?: (query: DataTableQuery) => void;

  /** Infinite scroll callback */
  onLoadMore?: () => Promise<void>;

  /** Column visibility change callback */
  onColumnVisibilityChange?: (
    columnVisibility: Record<string, boolean>
  ) => void;
}

export interface DataTableQuery {
  filters?: Array<{
    name: string;
    operator: FilterOperatorTypes;
    value: any;
  }>;
  sort?: Array<{
    key: string;
    order: 'asc' | 'desc';
  }>;
  group_by?: string[];
  search?: string;
}

export interface DataTableColumnDef<TData, TValue> {
  /** Key to access data */
  accessorKey: string;

  /** Column header text */
  header: string;

  /** Data type */
  columnType: 'text' | 'number' | 'date' | 'select';

  /** Enable sorting */
  enableSorting?: boolean;

  /** Enable filtering */
  enableColumnFilter?: boolean;

  /** Enable column visibility toggle */
  enableHiding?: boolean;

  /** Enable grouping */
  enableGrouping?: boolean;

  /** Options for select filter */
  filterOptions?: FilterSelectOption[];

  /** Hide column by default */
  defaultHidden?: boolean;
}

export interface DisplayControlsProps {
  /** Trigger element */
  trigger?: ReactNode;
}

export interface FiltersProps {
  /** Trigger element */
  trigger?:
    | ReactNode
    | (({
        availableFilters,
        appliedFilters
      }: {
        availableFilters: DataTableColumn<TData, TValue>[];
        appliedFilters: Set<string>;
      }) => ReactNode);
export interface DataTableContentProps {
  /**
   * Custom empty state shown when initial data exists but no results match after filters/search.
   * Filter bar remains visible in this state.
   */
  emptyState?: React.ReactNode;

  /**
   * Custom zero state shown when no data has been fetched initially (no filters/search applied).
   * Filter bar is automatically hidden in this state.
   */
  zeroState?: React.ReactNode;

  /** Custom class names for styling */
  classNames?: {
    root?: string;
    table?: string;
    header?: string;
    body?: string;
    row?: string;
  };
}

export interface VirtualizedContentProps {
  /**
   * Height of the virtualized container.
   * Parent must have a fixed height for percentage values to work.
   * @defaultValue "100%"
   */
  height?: number | string;

  /**
   * Height of each row in pixels.
   * @defaultValue 40
   */
  rowHeight?: number;

  /**
   * Height of group header rows in pixels.
   * Falls back to rowHeight if not specified.
   */
  groupHeaderHeight?: number;

  /**
   * Number of rows to render outside the visible area.
   * @defaultValue 5
   */
  overscan?: number;

  /**
   * Custom empty state shown when no results match after filters/search.
   */
  emptyState?: React.ReactNode;

  /**
   * Custom zero state shown when no data exists initially.
   */
  zeroState?: React.ReactNode;

  /** Custom class names for styling */
  classNames?: {
    root?: string;
    table?: string;
    header?: string;
    body?: string;
    row?: string;
  };
}
