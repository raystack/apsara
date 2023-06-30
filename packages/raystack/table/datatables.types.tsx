import {
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
export type ApsaraFilterFn<TData extends Record<string, any> = {}> =
  | FilterFn<TData>
  | ApsaraFilterOption;

export type ApsaraAggregationOption = string &
  keyof typeof ApsaraAggregationFns;
export type ApsaraAggregationFn<TData extends Record<string, any> = {}> =
  | AggregationFn<TData>
  | ApsaraAggregationOption;

export type ApsaraColumnDef<TData extends Record<string, any> = {}> = Omit<
  ColumnDef<TData, unknown>,
  | "accessorKey"
  | "aggregatedCell"
  | "aggregationFn"
  | "columns"
  | "filterFn"
  | "id"
  | "sortingFn"
> & {
  id?: LiteralUnion<string & keyof TData>;
  accessorKey?: DeepKeys<TData>;
  accessorFn?: (originalRow: TData) => any;
  aggregationFn?:
    | ApsaraAggregationFn<TData>
    | Array<ApsaraAggregationFn<TData>>;
  filterFn?: ApsaraFilterFn<TData>;
  filterVariant?:
    | "checkbox"
    | "date"
    | "date-range"
    | "multi-select"
    | "range"
    | "select"
    | "text";
  columnDefType?: "data" | "display" | "group";
  columns?: ApsaraColumnDef<TData>[];
};
