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

export interface DataTableState {
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
  tableState?: DataTableState;
  onTableStateChange?: (state: DataTableState) => void;
  defaultSort: Sort;
}

export type DataTableContentProps = {
  emptyState?: React.ReactNode;
};

export type TableContextType<TData, TValue> = {
  table: Table<TData>;
  columns: DataTableColumnDef<TData, TValue>[];
  isLoading?: boolean;
  defaultSort: Sort;
  tableState: DataTableState;
  onDisplaySettingsReset: () => void;
  updateTableState: (fn: (state: DataTableState) => DataTableState) => void;
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
