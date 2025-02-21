import { useState } from "react";
import { TableContext } from "./context";
import {
  DataTableProps,
  DataTableState,
  TableContextType,
} from "./data-table.types";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { Row, HeaderGroup } from "@tanstack/react-table";
import { dataTableStateToReactTableState } from "./utils";
import { Table } from "../table";
import { EmptyState } from "../empty-state";
import { TableIcon } from "@radix-ui/react-icons";

function Headers<TData>({
  headerGroups = [],
}: {
  headerGroups: HeaderGroup<TData>[];
}) {
  return (
    <Table.Header>
      {headerGroups?.map((headerGroup) => (
        <Table.Row key={headerGroup?.id}>
          {headerGroup?.headers?.map((header) => (
            <Table.Head key={header.id} colSpan={header.colSpan}>
              {/* Handles all possible header column def scenarios for `header` */}
              {flexRender(header.column.columnDef.header, header.getContext())}
            </Table.Head>
          ))}
        </Table.Row>
      ))}
    </Table.Header>
  );
}

function Rows<TData>({ rows = [] }: { rows: Row<TData>[] }) {
  return (
    <>
      {rows?.map((row) => {
        const isSelected = row.getIsSelected();
        const cells = row.getVisibleCells() || [];
        return (
          <Table.Row key={row.id} data-state={isSelected && "selected"}>
            {cells.map((cell) => {
              return (
                <Table.Cell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Table.Cell>
              );
            })}
          </Table.Row>
        );
      })}
    </>
  );
}

const DefaultEmptyComponent = () => (
  <EmptyState icon={<TableIcon />} heading="No Data" />
);

function DataTableRoot<TData, TValue>({
  data = [],
  columns,
  mode = "client",
  emptyState,
  isLoading = false,
}: DataTableProps<TData, TValue>) {
  const [tableState, setTableState] = useState<DataTableState>({});

  const reactTableState = dataTableStateToReactTableState(tableState);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: mode === "server",
    manualFiltering: mode === "server",
    state: reactTableState,
  });

  const contextValue: TableContextType<TData> = {
    table,
  };

  const headerGroups = table?.getHeaderGroups();
  const { rows = [] } = table?.getRowModel();

  return (
    <div>
      <TableContext.Provider value={contextValue}>
        <Table>
          <Headers headerGroups={headerGroups} />
          <Table.Body>
            {rows?.length ? (
              <Rows rows={rows} />
            ) : (
              <Table.Row>
                <Table.Cell colSpan={columns.length}>
                  {emptyState || <DefaultEmptyComponent />}
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </TableContext.Provider>
    </div>
  );
}

export const DataTable = Object.assign(DataTableRoot, {});
