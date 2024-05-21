import {
  AccessorFn,
  AggregationFn,
  ColumnDef,
  DeepKeys,
  FilterFn,
} from "@tanstack/table-core";
import type { ApsaraAggregationFns } from "./helpers/aggregationFns";
import type { ApsaraFilterFns } from "./helpers/filterFns";

type LiteralUnion<T extends U, U = string> = T | (U & Record<never, never>);

export type ApsaraFilterOption = LiteralUnion<
  string & keyof typeof ApsaraFilterFns
>;
export type ApsaraFilterFn<TData> = FilterFn<TData> | ApsaraFilterOption;

export type ApsaraAggregationOption = string &
  keyof typeof ApsaraAggregationFns;
export type ApsaraAggregationFn<TData> =
  | AggregationFn<TData>
  | ApsaraAggregationOption;

export const columnTypesMap = {
  select: "select",
  number: "number",
  text: "text",
  date: "date",
} as const;

export type columnTypes = keyof typeof columnTypesMap;

export const filterValueTypeMap = {
  select: "select",
  text: "text",
  calendar: "calendar",
} as const;

export type filterValueType = keyof typeof filterValueTypeMap;

export type tableFilterMap = Record<string, FilterFn<any>>;

export type updateColumnFilter = (id: string, fn: FilterFn<any>) => void;

export interface FilterValue {
  value?: string | number;
  values?: Array<string | number>;
}

export type ApsaraColumnDef<TData> = Omit<
  ColumnDef<TData, any>,
  | "accessorKey"
  | "aggregatedCell"
  | "aggregationFn"
  | "columns"
  | "filterFn"
  | "id"
  | "columnDefType"
  | "sortingFn"
  | "filterVariant"
> & {
  id?: LiteralUnion<string & keyof TData>;
  accessorKey?: DeepKeys<TData>;
  accessorFn?: AccessorFn<TData, any>;
  aggregationFn?:
    | ApsaraAggregationFn<TData>
    | Array<ApsaraAggregationFn<TData>>;
  filterFn?: ApsaraFilterFn<TData>;
  filterVariant?: columnTypes;
  columnDefType?: "data" | "display" | "group";
  columns?: ApsaraColumnDef<TData>[];
};
