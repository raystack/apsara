import { TableContext } from "./context";
import { DataTableProps, TableContextType } from "./data-table.types";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";

function DataTableRoot<TData, TValue>({
  data,
  columns,
  mode = "client",
  isLoading = false,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: mode === "server",
    manualFiltering: mode === "server",
  });

  const contextValue: TableContextType<TData> = {
    table,
  };

  return (
    <div>
      <TableContext.Provider value={contextValue}></TableContext.Provider>
    </div>
  );
}

export const DataTable = Object.assign(DataTableRoot, {});
