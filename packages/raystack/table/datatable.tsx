import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import React, { Children, ReactElement, ReactNode } from "react";
import { Button } from "~/button";
import { Flex } from "~/flex";
import { Text } from "~/text";
import { DataTableClearFilter } from "./DataTableClearFilter";
import { DataTableFilterChips } from "./DataTableFilterChips";
import { DataTableFilterOptions } from "./DataTableFilterOptions";
import { DataTableGloabalSearch } from "./DataTableGloabalSearch";
import { DataTableToolbar } from "./DataTableToolbar";
import { DataTableViewOptions } from "./DataTableViewOptions";
import { Table } from "./table";
import { TableBottomContainer } from "./TableBottomContainer";
import { TableContext } from "./TableContext";
import { TableDetailContainer } from "./TableDetailContainer";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  multiRowSelectionEnabled?: boolean;
  children?: ReactNode;
}

function DataTableRoot<TData, TValue>({
  columns,
  data,
  children,
}: DataTableProps<TData, TValue>) {
  const convertedChildren = Children.toArray(children) as ReactElement[];
  const header = convertedChildren.find(
    (child) => child.type === DataTableToolbar
  ) || <></>;
  const footer = convertedChildren.find(
    (child) => child.type === TableBottomContainer
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
    <Flex
      direction="column"
      justify="between"
      style={{ width: "100%", height: "100%" }}
    >
      <TableContext.Provider
        value={{
          table,
          globalFilter,
          onGlobalFilterChange: setGlobalFilter,
          onChange: () => ({}),
        }}
      >
        <Flex direction="column" style={{ flex: 1 }}>
          {header}
          <Flex>
            <Table>
              <Table.Header>
                {table.getHeaderGroups().map((headerGroup) => (
                  <Table.Row key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <Table.Head key={header.id}>
                          <Text
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
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
                    <Table.Cell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
            {detail}
          </Flex>
          {footer}
        </Flex>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            padding: "1rem",
          }}
        >
          <div style={{ flex: 1, fontSize: "12px" }}>
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <Button
              variant="outline"
              size="small"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="small"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
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
});
