import { ColumnDef, Table } from "@tanstack/table-core";

export type DataTableMode = "client" | "server";

export const columnTypesMap = {
  select: "select",
  number: "number",
  text: "text",
  date: "date",
} as const;

export type columnTypes = keyof typeof columnTypesMap;

interface Filter {
  name: string;
  operator: string;
  dataType: string;
  value: any;
}

interface Sort {
  key: string;
  order: string;
}

export interface TableState {
  filters: Filter[];
  sort: Sort[];
  group_by: string[];
  offset: number;
  limit: number;
  search: string;
}

export type DataTableColumnDef<TData, TValue> = ColumnDef<TData, TValue> & {
  columnType?: columnTypes;
};

export interface DataTableProps<TData, TValue> {
  columns: DataTableColumnDef<TData, TValue>[];
  data: TData[];
  mode?: DataTableMode;
  isLoading?: boolean;
  tableState?: TableState;
  onTableStateChange?: (state: TableState) => void;
}

export type TableContextType<TData> = {
  table: Table<TData>;
};
