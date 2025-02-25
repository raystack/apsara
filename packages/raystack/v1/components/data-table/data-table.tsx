import { useMemo, useState } from "react";
import { TableContext } from "./context";
import {
  DataTableProps,
  DataTableState,
  TableContextType,
} from "./data-table.types";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { dataTableStateToReactTableState, defaultGroupOption } from "./utils";
import { Content } from "./components/content";
import { Toolbar } from "./components/toolbar";

function DataTableRoot<TData, TValue>({
  data = [],
  columns,
  mode = "client",
  isLoading = false,
  loadingRowCount = 3,
  defaultSort,
  children,
}: React.PropsWithChildren<DataTableProps<TData, TValue>>) {
  const [tableState, setTableState] = useState<DataTableState>({
    sort: [defaultSort],
    group_by: [defaultGroupOption.id],
  });

  const reactTableState = dataTableStateToReactTableState(tableState);

  const loaderData = useMemo(
    () =>
      Array.from({ length: loadingRowCount }).map(
        (_, i) =>
          ({
            id: "loading-row-" + i,
          } as TData)
      ),
    [loadingRowCount]
  );

  const table = useReactTable({
    data: isLoading ? loaderData : data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: mode === "server",
    manualFiltering: mode === "server",
    state: reactTableState,
  });

  function onTableStateChange(fn: (prev: DataTableState) => DataTableState) {
    setTableState((prev) => fn(prev));
  }

  const contextValue: TableContextType<TData, TValue> = {
    table,
    columns,
    isLoading,
    tableState,
    updateTableState: onTableStateChange,
    defaultSort,
  };

  return (
    <TableContext.Provider value={contextValue}>
      {children}
    </TableContext.Provider>
  );
}

export const DataTable = Object.assign(DataTableRoot, {
  Content: Content,
  Toolbar: Toolbar,
});
