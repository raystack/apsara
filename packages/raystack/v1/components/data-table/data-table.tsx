import { useEffect, useMemo, useRef, useState } from "react";
import { TableContext } from "./context";
import {
  DataTableProps,
  DataTableQuery,
  GroupedData,
  TableContextType,
  TableQueryUpdateFn,
} from "./data-table.types";
import {
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  getExpandedRowModel,
} from "@tanstack/react-table";
import {
  defaultGroupOption,
  getColumnsWithFilterFn,
  getDefaultTableQuery,
  getInitialColumnVisibility,
  groupData,
  hasQueryChanged,
  queryToTableState,
  sanitizeTableQuery,
} from "./utils";
import { Content } from "./components/content";
import { Toolbar } from "./components/toolbar";
import { TableSearch } from "./components/search";

function DataTableRoot<TData, TValue>({
  data = [],
  columns,
  query,
  mode = "client",
  isLoading = false,
  loadingRowCount = 3,
  defaultSort,
  children,
  onTableQueryChange,
  onLoadMore,
  onRowClick,
}: React.PropsWithChildren<DataTableProps<TData, TValue>>) {
  const defaultTableQuery = getDefaultTableQuery(defaultSort, query);
  const initialColumnVisibility = getInitialColumnVisibility(columns);

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    initialColumnVisibility
  );
  const [tableQuery, setTableQuery] =
    useState<DataTableQuery>(defaultTableQuery);

  const oldQueryRef = useRef<DataTableQuery | null>(null);

  const reactTableState = useMemo(
    () => queryToTableState(tableQuery),
    [tableQuery]
  );

  function onDisplaySettingsReset() {
    setTableQuery((prev) => ({ ...prev, ...defaultTableQuery }));
    setColumnVisibility(initialColumnVisibility);
  }

  const group_by = tableQuery.group_by?.[0];

  const columnsWithFilters = useMemo(
    () => getColumnsWithFilterFn<TData, TValue>(columns, tableQuery.filters),
    [columns, tableQuery.filters]
  );

  const groupedData = useMemo(
    () => groupData(data, group_by, columns),
    [data, group_by, columns]
  );

  useEffect(() => {
    if (
      tableQuery &&
      onTableQueryChange &&
      hasQueryChanged(oldQueryRef.current, tableQuery) &&
      mode === "server"
    ) {
      onTableQueryChange(sanitizeTableQuery(tableQuery));
      oldQueryRef.current = tableQuery;
    }
  }, [tableQuery, onTableQueryChange]);

  const table = useReactTable({
    data: groupedData as TData[],
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

  function updateTableQuery(fn: TableQueryUpdateFn) {
    setTableQuery((prev) => fn(prev));
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
    tableQuery,
    updateTableQuery,
    onDisplaySettingsReset,
    defaultSort,
    loadingRowCount,
    onRowClick,
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
