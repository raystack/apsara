import { useMemo, useState } from "react";
import { TableContext } from "./context";
import {
  DataTableProps,
  DataTableState,
  TableContextType,
} from "./data-table.types";
import {
  VisibilityState,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
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
  const defaultTableState = {
    sort: [defaultSort],
    group_by: [defaultGroupOption.id],
  };

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const initialColumnVisibility = useMemo(() => {
    return columns?.reduce((acc, col) => {
      return { ...acc, [col.accessorKey]: col.defaultVisibility ?? true };
    }, {});
  }, [columns]);

  const [tableState, setTableState] =
    useState<DataTableState>(defaultTableState);

  const reactTableState = useMemo(
    () => dataTableStateToReactTableState(tableState),
    [tableState]
  );

  function onDisplaySettingsReset() {
    setTableState((prev) => ({ ...prev, ...defaultTableState }));
    setColumnVisibility(initialColumnVisibility);
  }

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
    getSortedRowModel: getSortedRowModel(),
    manualSorting: mode === "server",
    manualFiltering: mode === "server",
    onColumnVisibilityChange: setColumnVisibility,
    initialState: {
      columnVisibility: initialColumnVisibility,
    },
    state: { ...reactTableState, columnVisibility: columnVisibility },
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
    onDisplaySettingsReset,
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
