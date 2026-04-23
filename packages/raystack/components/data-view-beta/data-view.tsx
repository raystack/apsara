'use client';

import {
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  Updater,
  useReactTable,
  VisibilityState
} from '@tanstack/react-table';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Content } from './components/content';
import { DisplayAccess } from './components/display-access';
import { DisplaySettings } from './components/display-settings';
import { Filters } from './components/filters';
import { DataViewList } from './components/list';
import { DataViewRenderer } from './components/renderer';
import { DataViewSearch } from './components/search';
import { DataViewTable } from './components/table';
import { Toolbar } from './components/toolbar';
import { VirtualizedContent } from './components/virtualized-content';
import { DataViewContext } from './context';
import {
  DataViewContextType,
  DataViewProps,
  defaultGroupOption,
  GroupedData,
  InternalQuery,
  TableQueryUpdateFn
} from './data-view.types';
import {
  fieldsToColumnDefs,
  getDefaultTableQuery,
  getInitialColumnVisibility,
  groupData,
  hasQueryChanged,
  queryToTableState,
  transformToDataViewQuery
} from './utils';

function DataViewRoot<TData>({
  data = [],
  fields,
  query,
  mode = 'client',
  isLoading = false,
  totalRowCount,
  loadingRowCount = 3,
  defaultSort,
  children,
  onTableQueryChange,
  onLoadMore,
  onRowClick,
  onColumnVisibilityChange,
  getRowId
}: React.PropsWithChildren<DataViewProps<TData>>) {
  const defaultTableQuery = useMemo(
    () => getDefaultTableQuery(defaultSort, query),
    [defaultSort, query]
  );
  const initialColumnVisibility = useMemo(
    () => getInitialColumnVisibility(fields),
    [fields]
  );

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    initialColumnVisibility
  );
  const handleColumnVisibilityChange = useCallback(
    (value: Updater<VisibilityState>) => {
      setColumnVisibility(prev => {
        const newValue = typeof value === 'function' ? value(prev) : value;
        onColumnVisibilityChange?.(newValue);
        return newValue;
      });
    },
    [onColumnVisibilityChange]
  );

  const [tableQuery, setTableQuery] =
    useState<InternalQuery>(defaultTableQuery);

  const oldQueryRef = useRef<InternalQuery | null>(null);

  const reactTableState = useMemo(
    () => queryToTableState(tableQuery),
    [tableQuery]
  );

  const onDisplaySettingsReset = useCallback(() => {
    setTableQuery(prev => ({
      ...prev,
      ...defaultTableQuery,
      sort: [defaultSort],
      group_by: [defaultGroupOption.id]
    }));
    handleColumnVisibilityChange(initialColumnVisibility);
  }, [
    defaultSort,
    defaultTableQuery,
    initialColumnVisibility,
    handleColumnVisibilityChange
  ]);

  const group_by = tableQuery.group_by?.[0];

  // Metadata-only ColumnDefs. Filter fn is installed from field metadata and
  // the current filter query; cell/header rendering lives on each renderer's
  // column spec (DataView.Table / DataView.List), not here.
  const columnDefs = useMemo(
    () => fieldsToColumnDefs<TData>(fields, tableQuery.filters),
    [fields, tableQuery.filters]
  );

  const groupedData = useMemo(
    () => groupData(data, group_by, fields),
    [data, group_by, fields]
  );

  useEffect(() => {
    if (
      tableQuery &&
      onTableQueryChange &&
      hasQueryChanged(oldQueryRef.current, tableQuery) &&
      mode === 'server'
    ) {
      onTableQueryChange(transformToDataViewQuery(tableQuery));
      oldQueryRef.current = tableQuery;
    }
  }, [tableQuery, onTableQueryChange]);

  const table = useReactTable({
    data: groupedData as unknown as TData[],
    columns: columnDefs,
    getRowId,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSubRows: row => (row as unknown as GroupedData<TData>)?.subRows || [],
    getSortedRowModel: mode === 'server' ? undefined : getSortedRowModel(),
    getFilteredRowModel: mode === 'server' ? undefined : getFilteredRowModel(),
    manualSorting: mode === 'server',
    manualFiltering: mode === 'server',
    onColumnVisibilityChange: handleColumnVisibilityChange,
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

  // Determine if filters should be visible
  // Filters should be visible if there is data OR if filters are applied (empty state)
  // Filters should NOT be visible if no data AND no filters (zero state)
  // Note: Search alone does not show the filter bar
  const shouldShowFilters = useMemo(() => {
    const hasFilters =
      (tableQuery?.filters && tableQuery.filters.length > 0) || false;

    try {
      const rowModel = table.getRowModel();
      const hasData = (rowModel?.rows?.length ?? 0) > 0;
      return hasData || hasFilters;
    } catch {
      // If table is not ready yet, check if we have initial data
      // If no filters and no data, don't show filters
      return hasFilters || data.length > 0;
    }
  }, [table, tableQuery, data.length]);

  const contextValue: DataViewContextType<TData> = useMemo(() => {
    return {
      table,
      fields,
      mode,
      isLoading,
      loadMoreData,
      tableQuery,
      updateTableQuery,
      onDisplaySettingsReset,
      defaultSort,
      totalRowCount,
      loadingRowCount,
      onRowClick,
      shouldShowFilters
    };
  }, [
    table,
    fields,
    mode,
    isLoading,
    loadMoreData,
    tableQuery,
    updateTableQuery,
    onDisplaySettingsReset,
    defaultSort,
    totalRowCount,
    loadingRowCount,
    onRowClick,
    shouldShowFilters
  ]);

  return <DataViewContext value={contextValue}>{children}</DataViewContext>;
}

DataViewRoot.displayName = 'DataView';

/**
 * @preview
 * `DataView` is a preview component. Its API is not yet stable and
 * **will have breaking changes** before the 1.0 release — prop names,
 * sub-component shapes, and context surface may all change without
 * following semver. Pin to exact versions if depending on it.
 */
// biome-ignore lint/suspicious/noShadowRestrictedNames: public component name intentionally matches the package export
export const DataView = Object.assign(DataViewRoot, {
  // Renderers — each takes its own row render spec (`columns` on Table/List).
  Table: DataViewTable,
  List: DataViewList,
  // Escape hatch — render prop receives the full DataView context.
  Renderer: DataViewRenderer,
  // Legacy sub-renderer exports (used by consumers that imported inner pieces).
  Content: Content,
  VirtualizedContent: VirtualizedContent,
  // Visibility primitive for free-form renderers.
  DisplayAccess: DisplayAccess,
  // Toolbar primitives
  Toolbar: Toolbar,
  Search: DataViewSearch,
  Filters: Filters,
  DisplayControls: DisplaySettings
});
