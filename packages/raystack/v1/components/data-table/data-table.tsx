import { useEffect, useMemo, useRef, useState } from "react";
import { TableContext } from "./context";
import {
  DataTableProps,
  DataTableQuery,
  GroupedData,
  TableContextType,
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
  groupData,
  hasQueryChanged,
  queryToTableState,
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
  onTableQueryChange,
  onLoadMore,
}: React.PropsWithChildren<DataTableProps<TData, TValue>>) {
  const defaultTableQuery = {
    sort: [defaultSort],
    group_by: [defaultGroupOption.id],
  };

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [tableQuery, setTableQuery] =
    useState<DataTableQuery>(defaultTableQuery);

  const oldQueryRef = useRef<DataTableQuery | null>(null);

  const initialColumnVisibility = useMemo(() => {
    return columns?.reduce((acc, col) => {
      return { ...acc, [col.accessorKey]: col.defaultVisibility ?? true };
    }, {});
  }, [columns]);

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
    () => groupData(data, group_by),
    [data, group_by]
  );

  useEffect(() => {
    if (
      tableQuery &&
      onTableQueryChange &&
      hasQueryChanged(oldQueryRef.current, tableQuery)
    ) {
      onTableQueryChange(tableQuery);
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

  function updateTableQuery(fn: (prev: DataTableQuery) => DataTableQuery) {
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
