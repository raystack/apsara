import { useEffect, useMemo, useState } from "react";
import { TableContext } from "./context";
import {
  DataTableProps,
  DataTableState,
  GroupedData,
  TableContextType,
} from "./data-table.types";
import {
  ColumnFiltersState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  getExpandedRowModel,
} from "@tanstack/react-table";
import {
  dataTableStateToReactTableState,
  defaultGroupOption,
  getColumnsWithFilterFn,
  groupData,
  getLoaderRows,
} from "./utils";
import { Content } from "./components/content";
import { Toolbar } from "./components/toolbar";
import { TableSearch } from "./components/search";

function DataTableRoot<TData, TValue>({
  data = [],
  columns,
  mode = "client",
  isLoading = false,
  loadingRowCount = 3,
  defaultSort,
  children,
  onTableStateChange,
  onLoadMore,
}: React.PropsWithChildren<DataTableProps<TData, TValue>>) {
  const defaultTableState = {
    sort: [defaultSort],
    group_by: [defaultGroupOption.id],
  };

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [tableState, setTableState] =
    useState<DataTableState>(defaultTableState);
  const initialColumnVisibility = useMemo(() => {
    return columns?.reduce((acc, col) => {
      return { ...acc, [col.accessorKey]: col.defaultVisibility ?? true };
    }, {});
  }, [columns]);

  const reactTableState = useMemo(
    () => dataTableStateToReactTableState(tableState),
    [tableState]
  );

  function onDisplaySettingsReset() {
    setTableState((prev) => ({ ...prev, ...defaultTableState }));
    setColumnVisibility(initialColumnVisibility);
  }

  const group_by = tableState.group_by?.[0];

  const loaderData = useMemo(
    () => getLoaderRows<TData>(loadingRowCount),
    [loadingRowCount]
  );

  const columnsWithFilters = useMemo(
    () => getColumnsWithFilterFn<TData, TValue>(columns, tableState.filters),
    [columns, tableState.filters]
  );

  const groupedData = useMemo(
    () => groupData(data, group_by),
    [data, group_by]
  );

  useEffect(() => {
    if (tableState && onTableStateChange) {
      onTableStateChange(tableState);
    }
  }, [tableState, onTableStateChange]);

  const table = useReactTable({
    data: isLoading ? loaderData : (groupedData as TData[]),
    columns: columnsWithFilters,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSubRows: (row) => (row as GroupedData<TData>)?.subRows || [],
    getSortedRowModel: mode === "server" ? undefined : getSortedRowModel(),
    getFilteredRowModel: mode === "server" ? undefined : getFilteredRowModel(),
    manualSorting: mode === "server",
    manualFiltering: mode === "server",
    onColumnVisibilityChange: setColumnVisibility,
    globalFilterFn: mode === "server" ? undefined : "auto",
    initialState: {
      columnVisibility: initialColumnVisibility,
    },
    filterFromLeafRows: true,
    state: {
      ...reactTableState,
      columnVisibility: columnVisibility,
      expanded:
        group_by && group_by !== defaultGroupOption.id ? true : undefined,
    },
  });

  function updateTableState(fn: (prev: DataTableState) => DataTableState) {
    setTableState((prev) => fn(prev));
  }

  function loadMoreData() {
    if (mode === "server" && onLoadMore) {
      onLoadMore();
    }
  }

  const contextValue: TableContextType<TData, TValue> = {
    table,
    columns,
    mode,
    isLoading,
    loadMoreData,
    tableState,
    updateTableState: updateTableState,
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
  Search: TableSearch,
});
