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
  HeaderGroup,
  useReactTable,
} from "@tanstack/react-table";
import { dataTableStateToReactTableState } from "./utils";
import { Table } from "~/table";

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

function DataTableRoot<TData, TValue>({
  data,
  columns,
  mode = "client",
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

  return (
    <div>
      <TableContext.Provider value={contextValue}>
        <Table>
          <Headers headerGroups={headerGroups} />
        </Table>
      </TableContext.Provider>
    </div>
  );
}

export const DataTable = Object.assign(DataTableRoot, {});
