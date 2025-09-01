import type { Column, ColumnDef, Table } from "@tanstack/table-core";
import type {
  FilterOperatorTypes,
  RQLFilterOperatorTypes,
  FilterSelectOption,
  FilterTypes,
  FilterValueType,
} from "~/types/filters";

export type DataTableMode = "client" | "server";

export const SortOrders = {
  ASC: "asc",
  DESC: "desc",
} as const;

export interface RQLFilterValues {
  value: any;
  // Only one of these value fields should be present at a time
  boolValue?: boolean;
  stringValue?: string;
  numberValue?: number;
}
// Internal filter with UI operators and metadata
export interface InternalFilter extends RQLFilterValues {
  _type?: FilterTypes;
  _dataType?: FilterValueType;
  name: string;
  operator: FilterOperatorTypes;
}

// Data table filter for backend API (no internal fields)
export interface DataTableFilter extends RQLFilterValues {
  name: string;
  operator: RQLFilterOperatorTypes;
}

type SortOrdersKeys = keyof typeof SortOrders;
export type SortOrdersValues = typeof SortOrders[SortOrdersKeys];

export interface DataTableSort {
  name: string;
  order: SortOrdersValues;
}

// Internal query with UI operators and metadata
export interface InternalQuery {
  filters?: InternalFilter[];
  sort?: DataTableSort[];
  group_by?: string[];
  offset?: number;
  limit?: number;
  search?: string;
}

// Data table query for backend API (clean, no internal fields)
export interface DataTableQuery extends Omit<InternalQuery, 'filters'> {
  filters?: DataTableFilter[];
}

export type DataTableColumn<TData, TValue> = Omit<
  Column<TData, TValue>,
  "columnDef"
> & {
  columnDef: DataTableColumnDef<TData, TValue>;
};

export type DataTableColumnDef<TData, TValue> = ColumnDef<TData, TValue> & {
  accessorKey: string;
  header: string;
  filterType?: FilterTypes;
  dataType?: FilterValueType;
  enableColumnFilter?: boolean;
  enableSorting?: boolean;
  enableHiding?: boolean;
  defaultHidden?: boolean;
  filterOptions?: FilterSelectOption[];
  classNames?: {
    cell?: string;
    header?: string;
  };
  styles?: {
    cell?: React.CSSProperties;
    header?: React.CSSProperties;
  };
  enableGrouping?: boolean;
  showGroupCount?: boolean;
  groupCountMap?: Record<string, number>;
  groupLabelsMap?: Record<string, string>;
  // TODO: implement these
  icon?: React.ReactNode;
};

export interface DataTableProps<TData, TValue> {
  columns: DataTableColumnDef<TData, TValue>[];
  data: TData[];
  query?: DataTableQuery;  // Initial query (will be transformed to internal format)
  mode?: DataTableMode;
  isLoading?: boolean;
  loadingRowCount?: number;
  tableQuery?: DataTableQuery;
  onTableQueryChange?: (query: DataTableQuery) => void;
  defaultSort: DataTableSort;
  onLoadMore?: () => Promise<void>;
  onRowClick?: (row: TData) => void;
}

export type DataTableContentProps = {
  emptyState?: React.ReactNode;
  classNames?: {
    root?: string;
    table?: string;
    header?: string;
    body?: string;
    row?: string;
  };
};

export type TableQueryUpdateFn = (query: InternalQuery) => InternalQuery;

export type TableContextType<TData, TValue> = {
  table: Table<TData>;
  columns: DataTableColumnDef<TData, TValue>[];
  isLoading?: boolean;
  loadMoreData: () => void;
  mode: DataTableMode;
  defaultSort: DataTableSort;
  tableQuery?: InternalQuery;
  loadingRowCount?: number;
  onDisplaySettingsReset: () => void;
  updateTableQuery: (fn: TableQueryUpdateFn) => void;
  onRowClick?: (row: TData) => void;
};

export interface ColumnData {
  label: string;
  id: string;
  isVisible?: boolean;
}

interface SubRows<T> {}

export interface GroupedData<T> extends SubRows<T> {
  label: string;
  group_key: string;
  subRows: T[];
  count?: number;
  showGroupCount?: boolean;
}

export const defaultGroupOption = {
  id: "--",
  label: "No grouping",
};
