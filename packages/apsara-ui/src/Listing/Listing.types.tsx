import { SorterResult } from "../Table/TableProps";
import { IVirtualTable } from "../Table/VirtualisedTable";
import { Column } from "../TableV2/VirtualisedTable";

export type ColumnRenderFunc<T> = (path: string, sortedInfo: SorterResult<T>) => Column<T>[];

export interface ListingProps<T> {
    list?: T[];
    loading?: boolean;
    resourceName?: string;
    resourcePath?: string;
    rowKey?: string;
    className?: string;
    tableProps?: {
        getColumnList?: ColumnRenderFunc<T>;
        selectedRowId?: number;
        scroll?: any;
    } & Omit<IVirtualTable, "columns" | "items">;
    filterProps?: { filterFieldList?: IGroupOptions[] };
    searchProps?: {
        searchPlaceholder?: string;
        searchFields?: string[];
        disabled?: boolean;
    };
    calculateRowHeight?: (index: number, defaultRowHeight: number) => number;
    calculateColumnWidth?: (index: number, defaultColumnWidth: number) => number;
    renderExtraFilters?: React.ReactNode;
    renderHeader?: React.ReactNode;
    renderBody?: React.ReactNode;
    rowClick?: (props: any) => any;
    sortable?: boolean;
    defaultSearchTerm?: string;
    onChangeCallback?: (props: any) => void;
}

export interface IGroupOptions {
    name: string;
    slug: string;
    multi?: boolean;
    data: { label: string; value: string }[];
    searchEnabled?: boolean;
}

export interface ILoadMoreProps {
    nextPage: number;
    search: string;
    filters: unknown;
}
