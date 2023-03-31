import type { TableProps as RcTableProps } from "rc-table/lib/Table";
import type { ColumnType as RcColumnType, FixedType, RenderedCell as RcRenderedCell } from "rc-table/lib/interface";
import type { PaginationProps as RcPaginationProps } from "rc-pagination";
import type { TooltipProps as RcTooltipProps } from "rc-tooltip/lib/Tooltip";
import type { placements as Placements } from "rc-tooltip/lib/placements";
import { TooltipPlacement } from "../Tooltip/Tooltip";

export type SortOrder = "descend" | "ascend" | null;
export type Key = React.Key;
export type FilterValue = (Key | boolean)[];
export type CompareFn<T> = (a: T, b: T, sortOrder?: SortOrder) => number;

export interface ColumnTitleProps<RecordType> {
    /** @deprecated Please use `sorterColumns` instead. */
    sortOrder?: SortOrder;
    /** @deprecated Please use `sorterColumns` instead. */
    sortColumn?: ColumnType<RecordType>;
    sortColumns?: { column: ColumnType<RecordType>; order: SortOrder }[];

    filters?: Record<string, FilterValue>;
}

export type ColumnTitle<RecordType> = React.ReactNode | ((props: ColumnTitleProps<RecordType>) => React.ReactNode);
export interface ColumnFilterItem {
    text: React.ReactNode;
    value: string | number | boolean;
    children?: ColumnFilterItem[];
}
export interface FilterConfirmProps {
    closeDropdown: boolean;
}
export interface FilterDropdownProps {
    prefixCls: string;
    setSelectedKeys: (selectedKeys: React.Key[]) => void;
    selectedKeys: React.Key[];
    /**
     * Confirm filter value, if you want to close dropdown before commit, you can call with
     * {closeDropdown: true}
     */
    confirm: (param?: FilterConfirmProps) => void;
    clearFilters?: () => void;
    filters?: ColumnFilterItem[];
    /** Only close filterDropdown */
    close: () => void;
    visible: boolean;
}
export type FilterSearchType<RecordType = Record<string, any>> =
    | boolean
    | ((input: string, record: RecordType) => boolean);
export type Breakpoint = "xxl" | "xl" | "lg" | "md" | "sm" | "xs";
export interface ColumnType<RecordType> extends Omit<RcColumnType<RecordType>, "title"> {
    title?: ColumnTitle<RecordType>;
    // Sorter
    sorter?:
        | boolean
        | CompareFn<RecordType>
        | {
              compare?: CompareFn<RecordType>;
              /** Config multiple sorter order priority */
              multiple?: number;
          };
    sortOrder?: SortOrder;
    defaultSortOrder?: SortOrder;
    sortDirections?: SortOrder[];
    showSorterTooltip?: boolean | TooltipProps;

    // Filter
    filtered?: boolean;
    filters?: ColumnFilterItem[];
    filterDropdown?: React.ReactNode | ((props: FilterDropdownProps) => React.ReactNode);
    filterMultiple?: boolean;
    filteredValue?: FilterValue | null;
    defaultFilteredValue?: FilterValue | null;
    filterIcon?: React.ReactNode | ((filtered: boolean) => React.ReactNode);
    filterMode?: "menu" | "tree";
    filterSearch?: FilterSearchType<ColumnFilterItem>;
    onFilter?: (value: string | number | boolean, record: RecordType) => boolean;
    filterDropdownOpen?: boolean;
    onFilterDropdownOpenChange?: (visible: boolean) => void;
    filterResetToDefaultFilteredValue?: boolean;

    // Responsive
    responsive?: Breakpoint[];

    // Deprecated
    /** @deprecated Please use `filterDropdownOpen` instead */
    filterDropdownVisible?: boolean;
    /** @deprecated Please use `onFilterDropdownOpenChange` instead */
    onFilterDropdownVisibleChange?: (visible: boolean) => void;
}

export interface ColumnGroupType<RecordType> extends Omit<ColumnType<RecordType>, "dataIndex"> {
    children: ColumnsType<RecordType>;
}

export interface PaginationProps extends RcPaginationProps {
    showQuickJumper?: boolean | { goButton?: React.ReactNode };
    size?: "default" | "small";
    responsive?: boolean;
    role?: string;
    totalBoundaryShowSizeChanger?: number;
}
export type ColumnsType<RecordType = unknown> = (ColumnGroupType<RecordType> | ColumnType<RecordType>)[];
type TablePaginationPosition = "topLeft" | "topCenter" | "topRight" | "bottomLeft" | "bottomCenter" | "bottomRight";
export interface TablePaginationConfig extends PaginationProps {
    position?: TablePaginationPosition[];
}
const SpinSizes = ["small", "default", "large"] as const;
export type SpinSize = typeof SpinSizes[number];
export type SpinIndicator = React.ReactElement<HTMLElement>;
export interface SpinProps {
    prefixCls?: string;
    className?: string;
    spinning?: boolean;
    style?: React.CSSProperties;
    size?: SpinSize;
    tip?: React.ReactNode;
    delay?: number;
    wrapperClassName?: string;
    indicator?: SpinIndicator;
    children?: React.ReactNode;
}
export type SizeType = "small" | "middle" | "large" | undefined;
export interface TableLocale {
    filterTitle?: string;
    filterConfirm?: React.ReactNode;
    filterReset?: React.ReactNode;
    filterEmptyText?: React.ReactNode;
    filterCheckall?: React.ReactNode;
    filterSearchPlaceholder?: string;
    emptyText?: React.ReactNode | (() => React.ReactNode);
    selectAll?: React.ReactNode;
    selectNone?: React.ReactNode;
    selectInvert?: React.ReactNode;
    selectionAll?: React.ReactNode;
    sortTitle?: string;
    expand?: string;
    collapse?: string;
    triggerDesc?: string;
    triggerAsc?: string;
    cancelSort?: string;
}
export interface SorterResult<RecordType> {
    column?: ColumnType<RecordType>;
    order?: SortOrder;
    field?: Key | readonly Key[];
    columnKey?: Key;
}
const TableActions = ["paginate", "sort", "filter"] as const;
export type TableAction = typeof TableActions[number];
export interface TableCurrentDataSource<RecordType> {
    currentDataSource: RecordType[];
    action: TableAction;
}
export type RowSelectionType = "checkbox" | "radio";
export type RowSelectMethod = "all" | "none" | "invert" | "single" | "multiple";
export interface CheckboxChangeEventTarget extends CheckboxProps {
    checked: boolean;
}
export interface CheckboxChangeEvent {
    target: CheckboxChangeEventTarget;
    stopPropagation: () => void;
    preventDefault: () => void;
    nativeEvent: MouseEvent;
}

export interface AbstractCheckboxProps<T> {
    prefixCls?: string;
    className?: string;
    defaultChecked?: boolean;
    checked?: boolean;
    style?: React.CSSProperties;
    disabled?: boolean;
    onChange?: (e: T) => void;
    onClick?: React.MouseEventHandler<HTMLElement>;
    onMouseEnter?: React.MouseEventHandler<HTMLElement>;
    onMouseLeave?: React.MouseEventHandler<HTMLElement>;
    onKeyPress?: React.KeyboardEventHandler<HTMLElement>;
    onKeyDown?: React.KeyboardEventHandler<HTMLElement>;
    value?: any;
    tabIndex?: number;
    name?: string;
    children?: React.ReactNode;
    id?: string;
    autoFocus?: boolean;
    type?: string;
    skipGroup?: boolean;
}
export interface CheckboxProps extends AbstractCheckboxProps<CheckboxChangeEvent> {
    indeterminate?: boolean;
}
export type SelectionSelectFn<T> = (record: T, selected: boolean, selectedRows: T[], nativeEvent: Event) => void;
export type SelectionItemSelectFn = (currentRowKeys: Key[]) => void;
export interface SelectionItem {
    key: string;
    text: React.ReactNode;
    onSelect?: SelectionItemSelectFn;
}
export const SELECTION_ALL = "SELECT_ALL" as const;
export const SELECTION_INVERT = "SELECT_INVERT" as const;
export const SELECTION_NONE = "SELECT_NONE" as const;
export type INTERNAL_SELECTION_ITEM =
    | SelectionItem
    | typeof SELECTION_ALL
    | typeof SELECTION_INVERT
    | typeof SELECTION_NONE;
export interface TableRowSelection<T> {
    /** Keep the selection keys in list even the key not exist in `dataSource` anymore */
    preserveSelectedRowKeys?: boolean;
    type?: RowSelectionType;
    selectedRowKeys?: Key[];
    defaultSelectedRowKeys?: Key[];
    onChange?: (selectedRowKeys: Key[], selectedRows: T[], info: { type: RowSelectMethod }) => void;
    getCheckboxProps?: (record: T) => Partial<Omit<CheckboxProps, "checked" | "defaultChecked">>;
    onSelect?: SelectionSelectFn<T>;
    /** @deprecated This function is deprecated and should use `onChange` instead */
    onSelectMultiple?: (selected: boolean, selectedRows: T[], changeRows: T[]) => void;
    /** @deprecated This function is deprecated and should use `onChange` instead */
    onSelectAll?: (selected: boolean, selectedRows: T[], changeRows: T[]) => void;
    /** @deprecated This function is deprecated and should use `onChange` instead */
    onSelectInvert?: (selectedRowKeys: Key[]) => void;
    /** @deprecated This function is deprecated and should use `onChange` instead */
    onSelectNone?: () => void;
    selections?: INTERNAL_SELECTION_ITEM[] | boolean;
    hideSelectAll?: boolean;
    fixed?: FixedType;
    columnWidth?: string | number;
    columnTitle?: string | React.ReactNode;
    checkStrictly?: boolean;
    renderCell?: (
        value: boolean,
        record: T,
        index: number,
        originNode: React.ReactNode,
    ) => React.ReactNode | RcRenderedCell<T>;
}
export type GetPopupContainer = (triggerNode: HTMLElement) => HTMLElement;
export interface TableProps<RecordType>
    extends Omit<
        RcTableProps<RecordType>,
        "transformColumns" | "internalHooks" | "internalRefs" | "data" | "columns" | "scroll" | "emptyText"
    > {
    dropdownPrefixCls?: string;
    dataSource?: RcTableProps<RecordType>["data"];
    columns?: ColumnsType<RecordType>;
    pagination?: false | TablePaginationConfig;
    loading?: boolean | SpinProps;
    size?: SizeType;
    bordered?: boolean;
    locale?: TableLocale;

    onChange?: (
        pagination: TablePaginationConfig,
        filters: Record<string, FilterValue | null>,
        sorter: SorterResult<RecordType> | SorterResult<RecordType>[],
        extra: TableCurrentDataSource<RecordType>,
    ) => void;
    rowSelection?: TableRowSelection<RecordType>;

    getPopupContainer?: GetPopupContainer;
    scroll?: RcTableProps<RecordType>["scroll"] & {
        scrollToFirstRowOnChange?: boolean;
    };
    sortDirections?: SortOrder[];
    showSorterTooltip?: boolean | TooltipProps;
}

interface LegacyTooltipProps
    extends Partial<
        Omit<RcTooltipProps, "children" | "visible" | "defaultVisible" | "onVisibleChange" | "afterVisibleChange">
    > {
    open?: RcTooltipProps["visible"];
    defaultOpen?: RcTooltipProps["defaultVisible"];
    onOpenChange?: RcTooltipProps["onVisibleChange"];
    afterOpenChange?: RcTooltipProps["afterVisibleChange"];

    // Legacy
    /** @deprecated Please use `open` instead. */
    visible?: RcTooltipProps["visible"];
    /** @deprecated Please use `defaultOpen` instead. */
    defaultVisible?: RcTooltipProps["defaultVisible"];
    /** @deprecated Please use `onOpenChange` instead. */
    onVisibleChange?: RcTooltipProps["onVisibleChange"];
    /** @deprecated Please use `afterOpenChange` instead. */
    afterVisibleChange?: RcTooltipProps["afterVisibleChange"];
}
export const PresetColors = [
    "blue",
    "purple",
    "cyan",
    "green",
    "magenta",
    "pink",
    "red",
    "orange",
    "yellow",
    "volcano",
    "geekblue",
    "lime",
    "gold",
] as const;

export type PresetColorKey = typeof PresetColors[number];
export type LiteralUnion<T extends string> = T | (string & {});
type InverseColor = `${PresetColorKey}-inverse`;
export type PresetColorType = PresetColorKey | InverseColor;
export interface AdjustOverflow {
    adjustX?: 0 | 1;
    adjustY?: 0 | 1;
}
export interface AbstractTooltipProps extends LegacyTooltipProps {
    style?: React.CSSProperties;
    className?: string;
    color?: LiteralUnion<PresetColorType>;
    placement?: TooltipPlacement;
    builtinPlacements?: typeof Placements;
    openClassName?: string;
    arrowPointAtCenter?: boolean;
    autoAdjustOverflow?: boolean | AdjustOverflow;
    getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
    children?: React.ReactNode;
}

export type RenderFunction = () => React.ReactNode;

export interface TooltipPropsWithOverlay extends AbstractTooltipProps {
    title?: React.ReactNode | RenderFunction;
    overlay?: React.ReactNode | RenderFunction;
}

export interface TooltipPropsWithTitle extends AbstractTooltipProps {
    title: React.ReactNode | RenderFunction;
    overlay?: React.ReactNode | RenderFunction;
}

export declare type TooltipProps = TooltipPropsWithTitle | TooltipPropsWithOverlay;
