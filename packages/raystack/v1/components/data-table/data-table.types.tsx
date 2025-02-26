import { ColumnDef, Table } from "@tanstack/table-core";
import { FilterTypes } from "~/v1/types/filters";

export type DataTableMode = "client" | "server";

export const SortOrders = {
  ASC: "asc",
  DESC: "desc",
} as const;

interface Filter {
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
  filters?: Filter[];
  sort?: Sort[];
  group_by?: string[];
  offset?: number;
  limit?: number;
  search?: string;
}

export type DataTableColumnDef<TData, TValue> = ColumnDef<TData, TValue> & {
  header: string;
  columnType?: FilterTypes;
  enableColumnFilter?: boolean;
  enableSorting?: boolean;
  hidden?: boolean;
  enableHiding?: boolean;
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
  updateTableState: (fn: (state: DataTableState) => DataTableState) => void;
};

export interface ColumnData {
  label: string;
  id: string;
  isVisible?: boolean;
}
