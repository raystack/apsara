import { ColumnDef, Table } from "@tanstack/table-core";

export type DataTableMode = "client" | "server";

export const columnTypesMap = {
  select: "select",
  number: "number",
  text: "text",
  date: "date",
} as const;

export type columnTypes = keyof typeof columnTypesMap;

export const SortOrders = {
  ASC: "asc",
  DESC: "desc",
} as const;

interface Filter {
  name: string;
  operator: string;
  dataType: string;
  value: any;
}

type SortOrdersKeys = keyof typeof SortOrders;
type SortOrdersValues = typeof SortOrders[SortOrdersKeys];

interface Sort {
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
  columnType?: columnTypes;
};

export interface DataTableProps<TData, TValue> {
  columns: DataTableColumnDef<TData, TValue>[];
  data: TData[];
  mode?: DataTableMode;
  isLoading?: boolean;
  tableState?: DataTableState;
  onTableStateChange?: (state: DataTableState) => void;
}

export type TableContextType<TData> = {
  table: Table<TData>;
};
