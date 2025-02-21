import { useState } from "react";
import { TableContext } from "./context";
import {
  DataTableProps,
  DataTableState,
  TableContextType,
} from "./data-table.types";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { dataTableStateToReactTableState } from "./utils";
import { Content } from "./content";

function DataTableRoot<TData, TValue>({
  data = [],
  columns,
  mode = "client",
  isLoading = false,
  children,
}: React.PropsWithChildren<DataTableProps<TData, TValue>>) {
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

  const contextValue: TableContextType<TData, TValue> = {
    table,
    columns,
    isLoading,
  };
  return (
    <TableContext.Provider value={contextValue}>
      {children}
    </TableContext.Provider>
  );
}

export const DataTable = Object.assign(DataTableRoot, {
  Content: Content,
});
