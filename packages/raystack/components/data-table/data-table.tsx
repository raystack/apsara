'use client';

import {
  VisibilityState,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Content } from './components/content';
import { TableSearch } from './components/search';
import { Toolbar } from './components/toolbar';
import { TableContext } from './context';
import {
  DataTableProps,
  DataTableQuery,
  GroupedData,
  TableContextType,
  TableQueryUpdateFn,
  defaultGroupOption
} from './data-table.types';
import {
  getColumnsWithFilterFn,
  getDefaultTableQuery,
  getInitialColumnVisibility,
  groupData,
  hasQueryChanged,
  queryToTableState,
  sanitizeTableQuery
} from './utils';

function DataTableRoot<TData, TValue>({
  data = [],
  columns,
  query,
  mode = 'client',
  isLoading = false,
  loadingRowCount = 3,
  defaultSort,
  children,
  onTableQueryChange,
  onLoadMore,
  onRowClick
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

  const onDisplaySettingsReset = useCallback(() => {
    setTableQuery(prev => ({ ...prev, ...defaultTableQuery }));
    setColumnVisibility(initialColumnVisibility);
  }, [defaultTableQuery, initialColumnVisibility]);

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
      mode === 'server'
    ) {
      onTableQueryChange(sanitizeTableQuery(tableQuery));
      oldQueryRef.current = tableQuery;
    }
  }, [tableQuery, onTableQueryChange]);

  const table = useReactTable({
    data: groupedData as unknown as TData[],
    columns: columnsWithFilters,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSubRows: row => (row as unknown as GroupedData<TData>)?.subRows || [],
    getSortedRowModel: mode === 'server' ? undefined : getSortedRowModel(),
    getFilteredRowModel: mode === 'server' ? undefined : getFilteredRowModel(),
    manualSorting: mode === 'server',
    manualFiltering: mode === 'server',
    onColumnVisibilityChange: setColumnVisibility,
    globalFilterFn: mode === 'server' ? undefined : 'auto',
    initialState: {
      columnVisibility: initialColumnVisibility
    },
    filterFromLeafRows: true,
    state: {
      ...reactTableState,
      columnVisibility: columnVisibility,
      expanded:
        group_by && group_by !== defaultGroupOption.id ? true : undefined
    }
  });

  function updateTableQuery(fn: TableQueryUpdateFn) {
    setTableQuery(prev => fn(prev));
  }

  const loadMoreData = useCallback(() => {
    if (mode === 'server' && onLoadMore) {
      onLoadMore();
    }
  }, [mode, onLoadMore]);

  const searchQuery = query?.search;
  useEffect(() => {
    if (searchQuery) {
      updateTableQuery(prev => ({
        ...prev,
        search: searchQuery
      }));
    }
  }, [searchQuery]);

  const contextValue: TableContextType<TData, TValue> = useMemo(() => {
    return {
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
      onRowClick
    };
  }, [
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
    onRowClick
  ]);

  return (
    <TableContext.Provider value={contextValue}>
      {children}
    </TableContext.Provider>
  );
}

export const DataTable = Object.assign(DataTableRoot, {
  Content: Content,
  Toolbar: Toolbar,
  Search: TableSearch
});
