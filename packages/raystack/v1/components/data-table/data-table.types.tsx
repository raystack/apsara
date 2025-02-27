import type { Column, ColumnDef, Table } from "@tanstack/table-core";
import type { FilterSelectOption, FilterTypes } from "~/v1/types/filters";

export type DataTableMode = "client" | "server";

export const SortOrders = {
  ASC: "asc",
  DESC: "desc",
} as const;

export interface RQLFilter {
  name: string;
  operator: string;
  value: any;
}

export interface DataTableFilter {
  name: string;
  operator: string;
  value: any;
}

type SortOrdersKeys = keyof typeof SortOrders;
export type SortOrdersValues = typeof SortOrders[SortOrdersKeys];

export interface Sort {
  key: string;
  order: SortOrdersValues;
}

export interface DataTableQuery {
  filters?: RQLFilter[];
  sort?: Sort[];
  group_by?: string[];
  offset?: number;
  limit?: number;
  search?: string;
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
  columnType: FilterTypes;
  enableColumnFilter?: boolean;
  enableSorting?: boolean;
  enableHiding?: boolean;
  defaultVisibility?: boolean;
  filterOptions?: FilterSelectOption[];
};

export interface DataTableProps<TData, TValue> {
  columns: DataTableColumnDef<TData, TValue>[];
  data: TData[];
  mode?: DataTableMode;
  isLoading?: boolean;
  loadingRowCount?: number;
  tableQuery?: DataTableQuery;
  onTableQueryChange?: (query: DataTableQuery) => void;
  defaultSort: Sort;
  onLoadMore?: () => Promise<void>;
}

export type DataTableContentProps = {
  emptyState?: React.ReactNode;
};

export type TableContextType<TData, TValue> = {
  table: Table<TData>;
  columns: DataTableColumnDef<TData, TValue>[];
  isLoading?: boolean;
  loadMoreData: () => void;
  mode: DataTableMode;
  defaultSort: Sort;
  tableQuery?: DataTableQuery;
  loadingRowCount?: number;
  onDisplaySettingsReset: () => void;
  updateTableQuery: (fn: (query: DataTableQuery) => DataTableQuery) => void;
};

export interface ColumnData {
  label: string;
  id: string;
  isVisible?: boolean;
}

interface SubRows<T> {}

export interface GroupedData<T> extends SubRows<T> {
  group_key: string;
  subRows: T[];
}
