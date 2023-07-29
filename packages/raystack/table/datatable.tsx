import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";
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

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  multiRowSelectionEnabled?: boolean;
  children?: ReactNode;
  emptyState?: ReactNode;
  parentStyle?: CSSProperties;
} & ComponentProps<typeof Table>;

function DataTableRoot<TData, TValue>({
  columns,
  data,
  emptyState,
  children,
  parentStyle,
  ...props
}: DataTableProps<TData, TValue>) {
  const convertedChildren = Children.toArray(children) as ReactElement[];
  const header = convertedChildren.find(
    (child) => child.type === DataTableToolbar
  ) || <></>;
  const footer = convertedChildren.find(
    (child) => child.type === DataTableFooter
  ) || <></>;
  const detail = convertedChildren.find(
    (child) => child.type === TableDetailContainer
  ) || <></>;

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState("");
  const { filteredColumns, addFilterColumn, removeFilterColumn, resetColumns } =
    useTableColumn();

  const table = useReactTable({
    data,
    columns,
    globalFilterFn: "auto",
    enableRowSelection: true,
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
        }}
      >
        <Flex direction="column" className={styles.datatable}>
          {header}
          <Flex style={parentStyle}>
            <Table {...props}>
              <Table.Header>
                {table.getHeaderGroups().map((headerGroup) => (
                  <Table.Row key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <Table.Head key={header.id}>
                          <Text className={styles.head}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                            {{
                              asc: <ArrowUpIcon />,
                              desc: <ArrowDownIcon />,
                            }[header.column.getIsSorted() as string] ?? null}
                          </Text>
                        </Table.Head>
                      );
                    })}
                  </Table.Row>
                ))}
              </Table.Header>
              <Table.Body>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <Table.Row
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <Table.Cell key={cell.id}>
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
