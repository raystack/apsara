import type { ReactElement, ReactNode } from "react";

import type {
    AggregationFn,
    ColumnDef,
    CoreOptions,
    DeepKeys,
    FilterFn,
    InitialTableState,
    TableOptions,
} from "@tanstack/react-table";
import type { CSS } from "~/stitches.config";
import type { TableColumnSelect } from "./filter/TableColumnClearSelection";
import type TableColumnFilterSelection from "./filter/TableColumnFilterSelection";
import type TableColumnsFilter from "./filter/TableColumnsViewFilter";
import type { TableGlobalSearch } from "./search/TableGlobalSearch";
import type { TableBottomContainer } from "./TableBottomContainer";
import type { onTableChangeEvent, TableFormType } from "./TableContext";
import { TableDetailContainer } from "./TableDetailContainer";
import type { TableTopContainer } from "./TableTopContainer";
import type { RaypointAggregationFns } from "./utils/aggregationFns";
import type { RaypointFilterFns } from "./utils/filterFns";

export interface TableProps<T> {
    css?: CSS;
    data: T[];
    /**
     * Defines how each row is uniquely identified. It is highly recommended that you specify this prop to an ID that makes sense.
     */
    getRowId?: CoreOptions<T>["getRowId"];
    /**
     * Columns to display in the table.
     *
     * @see https://tanstack.com/table/v8/docs/guide/column-defs
     */
    columns: Array<ColumnDef<T> & { hidden?: true; filterFn?: RaypointFilterFn<any> }>;
    onMount?: onTableChangeEvent;
    onChange?: onTableChangeEvent;
    /**
     * Function that generates the expandable content of a row
     * Return null for rows that don't need to be expandable
     *
     * @param datum the row for which the children should be generated.
     */
    getExpandChildren?: (datum: T) => ReactNode;
    noDataChildren?: ReactNode;
    loading?: boolean;
    /**
     * Childrens to display in the table. They need to be wrap in either `Table.Header` or `Table.Footer`
     *
     * @example
     * <Table ...>
     *     <Table.Header>
     *         <div>Hello</div>
     *     </Table.Header>
     * </Table>
     */
    children?: ReactNode;
    initialState?: InitialTableState & Partial<TableFormType>;
    doubleClickAction?: (datum: T) => void;
    multiRowSelectionEnabled?: boolean;
    isHeaderVisible?: boolean;
    options?: Omit<
        Partial<TableOptions<T>>,
        | "initialState"
        | "data"
        | "columns"
        | "manualPagination"
        | "enableMultiRowSelection"
        | "getRowId"
        | "getRowCanExpand"
    >;
}

export interface TableType {
    <T>(props: TableProps<T>): ReactElement;
    TableColumnsFilter: typeof TableColumnsFilter;
    TableGlobalSearch: typeof TableGlobalSearch;
    TopContainer: typeof TableTopContainer;
    DetailContainer: typeof TableDetailContainer;
    BottomContainer: typeof TableBottomContainer;
    ColumnSelect: typeof TableColumnSelect;
    ColumnFilterSelection: typeof TableColumnFilterSelection;
}

type LiteralUnion<T extends U, U = string> = T | (U & Record<never, never>);

export type RaypointFilterOption = LiteralUnion<string & keyof typeof RaypointFilterFns>;
export type RaypointFilterFn<TData extends Record<string, any> = {}> = FilterFn<TData> | RaypointFilterOption;

export type RaypointAggregationOption = string & keyof typeof RaypointAggregationFns;
export type RaypointAggregationFn<TData extends Record<string, any> = {}> =
    | AggregationFn<TData>
    | RaypointAggregationOption;

export type RaypointColumnDef<TData extends Record<string, any> = {}> = Omit<
    ColumnDef<TData, unknown>,
    | "accessorKey"
    | "aggregatedCell"
    | "aggregationFn"
    | "cell"
    | "columns"
    | "filterFn"
    | "footer"
    | "header"
    | "id"
    | "sortingFn"
> & {
    id?: LiteralUnion<string & keyof TData>;
    header: string;
    footer?: string;
    accessorKey?: DeepKeys<TData>;
    accessorFn?: (originalRow: TData) => any;
    aggregationFn?: RaypointAggregationFn<TData> | Array<RaypointAggregationFn<TData>>;
    filterFn?: RaypointFilterFn<TData>;
    filterVariant?: "checkbox" | "date" | "date-range" | "multi-select" | "range" | "select" | "text";
    columnDefType?: "data" | "display" | "group";
    columns?: RaypointColumnDef<TData>[];
};
