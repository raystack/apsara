import {
  CaretUpIcon,
  CaretDownIcon,
  CaretSortIcon,
} from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, {
  CSSProperties,
  Children,
  ComponentProps,
  ReactElement,
  ReactNode,
} from "react";
import { Flex } from "~/flex";
import { Text } from "~/text";
import { DataTableClearFilter } from "./DataTableClearFilter";
import { DataTableFilterChips } from "./DataTableFilterChips";
import { DataTableFilterOptions } from "./DataTableFilterOptions";
import { DataTableFooter } from "./DataTableFooter";
import { DataTableGloabalSearch } from "./DataTableGloabalSearch";
import { DataTableToolbar } from "./DataTableToolbar";
import { DataTableViewOptions } from "./DataTableViewOptions";
import { TableContext } from "./TableContext";
import { TableDetailContainer } from "./TableDetailContainer";
import styles from "./datatable.module.css";
import { useTableColumn } from "./hooks/useTableColumn";
import { Table } from "./table";
import {
  ApsaraColumnDef,
  tableFilterMap,
  updateColumnFilter,
} from "./datatables.types";
import Skeleton from "react-loading-skeleton";

type DataTableProps<TData, TValue> = {
  columns: ApsaraColumnDef<TData>[];
  data: TData[];
  multiRowSelectionEnabled?: boolean;
  children?: ReactNode;
  ShouldShowHeader?: boolean;
  emptyState?: ReactNode;
  parentStyle?: CSSProperties;
  isLoading?: boolean;
  loaderRow?: number;
} & ComponentProps<typeof Table>;

function DataTableRoot<TData, TValue>({
  columns,
  data,
  emptyState,
  children,
  parentStyle,
  isLoading = false,
  ShouldShowHeader = true,
  loaderRow = 5,
  ...props
}: DataTableProps<TData, TValue>) {
  const [tableCustomFilter, setTableCustomFilter] =
    React.useState<tableFilterMap>({});
  const convertedChildren = Children.toArray(children) as ReactElement[];
  const header =
    convertedChildren.find((child) => child.type === DataTableToolbar) || null;
  const footer =
    convertedChildren.find((child) => child.type === DataTableFooter) || null;
  const detail =
    convertedChildren.find((child) => child.type === TableDetailContainer) ||
    null;

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const tableData = isLoading
    ? [...new Array(loaderRow)].map((_, i) => ({ id: i } as TData))
    : data;

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState("");
  const { filteredColumns, addFilterColumn, removeFilterColumn, resetColumns } =
    useTableColumn();

  const columnWithCustomFilter = columns.map((col) => {
    // @ts-ignore;
    const colId: string = col.id || col?.accessorKey;
    if (colId && tableCustomFilter.hasOwnProperty(colId)) {
      col.filterFn = tableCustomFilter[colId];
    }
    col.cell = isLoading
      ? () => (
          <Skeleton
            containerClassName={styles.flex1}
            highlightColor="var(--background-base)"
            baseColor="var(--background-base-hover)"
          />
        )
      : col.cell;
    return col;
  });

  const updateColumnCustomFilter: updateColumnFilter = (id, filterFn) => {
    setTableCustomFilter((old) => ({ ...old, [id]: filterFn }));
  };

  const table = useReactTable({
    data: tableData,
    columns: columnWithCustomFilter as unknown as ColumnDef<TData, TValue>[],
    globalFilterFn: "auto",
    enableRowSelection: true,
    manualPagination: true,
    pageCount: -1,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting,
      globalFilter,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const tableStyle = table.getRowModel().rows?.length
    ? { width: "100%" }
    : { width: "100%", height: "100%" };

  return (
    <Flex direction="column" justify="between" className={styles.wrapper}>
      <TableContext.Provider
        value={{
          table,
          globalFilter,
          filteredColumns,
          addFilterColumn,
          removeFilterColumn,
          resetColumns,
          onGlobalFilterChange: setGlobalFilter,
          onChange: () => ({}),
          tableCustomFilter,
          updateColumnCustomFilter,
        }}
      >
        <Flex direction="column" className={styles.datatable}>
          {header}
          <Flex className={styles.tableContainer} style={parentStyle}>
            <Table {...props} style={tableStyle}>
              <Table.Header>
                {ShouldShowHeader
                  ? table.getHeaderGroups().map((headerGroup) => (
                      <Table.Row key={headerGroup.id}>
                        {headerGroup.headers.map((header, index) => {
                          return (
                            <Table.Head
                              key={`${header.id}_${index}`}
                              style={{
                                cursor: "pointer",
                                ...(header.column.columnDef?.meta?.style ?? {}),
                              }}
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              <Text className={styles.head}>
                                {header.isPlaceholder
                                  ? null
                                  : flexRender(
                                      header.column.columnDef.header,
                                      header.getContext()
                                    )}
                                {header.column.getCanSort()
                                  ? {
                                      asc: <CaretUpIcon />,
                                      desc: <CaretDownIcon />,
                                    }[
                                      header.column.getIsSorted() as string
                                    ] ?? <CaretSortIcon />
                                  : null}
                              </Text>
                            </Table.Head>
                          );
                        })}
                      </Table.Row>
                    ))
                  : null}
              </Table.Header>
              <Table.Body>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <Table.Row
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell, index) => (
                        <Table.Cell
                          key={`${cell.id}_${index}`}
                          style={{
                            ...(cell.column.columnDef?.meta?.style ?? {}),
                          }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </Table.Cell>
                      ))}
                    </Table.Row>
                  ))
                ) : (
                  <Table.Row>
                    <Table.Cell colSpan={columns.length}>
                      {emptyState || "No results."}
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
            {detail}
          </Flex>
        </Flex>
        {footer}
      </TableContext.Provider>
    </Flex>
  );
}

export const DataTable = Object.assign(DataTableRoot, {
  Toolbar: DataTableToolbar,
  GloabalSearch: DataTableGloabalSearch,
  FilterOptions: DataTableFilterOptions,
  ViewOptions: DataTableViewOptions,
  ClearFilter: DataTableClearFilter,
  FilterChips: DataTableFilterChips,
  Footer: DataTableFooter,
  DetailContainer: TableDetailContainer,
});
