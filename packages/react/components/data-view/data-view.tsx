'use client';

import { useControlled } from '@base-ui/utils/useControlled';
import {
  getCoreRowModel,
  getExpandedRowModel,
  getSortedRowModel,
  RowSelectionState,
  Updater,
  useReactTable,
  VisibilityState
} from '@tanstack/react-table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { createChangeDetails } from '~/shared/change-details';

import { DataViewClearFilters } from './components/clear-filters';
import { DataViewCustom } from './components/custom';
import { DisplayAccess } from './components/display-access';
import { DisplayControls } from './components/display-controls';
import { DataViewEmptyState } from './components/empty-state';
import { Filters } from './components/filters';
import { DataViewList } from './components/list';
import { DataViewSearch } from './components/search';
import { DataViewTimeline } from './components/timeline';
import { Toolbar } from './components/toolbar';
import { DataViewZeroState } from './components/zero-state';
import { DataViewContext } from './context';
import {
  DataViewContextType,
  DataViewField,
  DataViewProps,
  DataViewQuery,
  DataViewViewChangeDetails,
  defaultGroupOption,
  GroupedData,
  InternalQuery,
  TableQueryUpdateFn
} from './data-view.types';
import {
  hasActiveQuery as computeHasActiveQuery,
  createRowIdResolver,
  fieldsToColumnDefs,
  getDefaultTableQuery,
  getFilteredRowModelWithFlatRows,
  getInitialColumnVisibility,
  groupData,
  hasQueryChanged,
  isGroupRowData,
  queryToTableState,
  transformToDataViewQuery
} from './utils';

function DataViewRoot<TData>({
  data = [],
  fields,
  query,
  defaultQuery,
  mode = 'client',
  isLoading = false,
  totalRowCount,
  loadingRowCount = 3,
  defaultSort,
  children,
  onQueryChange,
  onLoadMore,
  onRowClick,
  onColumnVisibilityChange,
  onRowSelectionChange,
  getRowId,
  views,
  defaultView,
  view,
  onViewChange,
  groupByResolvers
}: DataViewProps<TData>) {
  const defaultTableQuery = useMemo(
    () => getDefaultTableQuery(defaultSort, defaultQuery, fields),
    [defaultSort, defaultQuery, fields]
  );

  // Active view (controlled / uncontrolled).
  const [activeView, setActiveViewUnwrapped] = useControlled<
    string | undefined
  >({
    controlled: view,
    default: defaultView ?? views?.[0]?.value,
    name: 'DataView',
    state: 'view'
  });
  const setActiveView = useCallback(
    (
      next: string,
      details: DataViewViewChangeDetails = createChangeDetails('none')
    ) => {
      setActiveViewUnwrapped(next);
      onViewChange?.(next, details);
    },
    [onViewChange, setActiveViewUnwrapped]
  );

  // Per-view field overrides registered by mounted renderers.
  const [fieldsByView, setFieldsByView] = useState<
    Record<string, DataViewField<TData>[]>
  >({});

  const registerFieldsForView = useCallback(
    (name: string, override: DataViewField<TData>[]) => {
      setFieldsByView(prev => {
        if (prev[name] === override) return prev;
        return { ...prev, [name]: override };
      });
      return () => {
        setFieldsByView(prev => {
          if (!(name in prev)) return prev;
          const next = { ...prev };
          delete next[name];
          return next;
        });
      };
    },
    []
  );

  const effectiveFields = useMemo(() => {
    if (activeView && fieldsByView[activeView]) return fieldsByView[activeView];
    return fields;
  }, [activeView, fieldsByView, fields]);

  const initialColumnVisibility = useMemo(
    () => getInitialColumnVisibility(fields),
    [fields]
  );

  const [columnVisibility, setColumnVisibilityState] =
    useState<VisibilityState>(initialColumnVisibility);

  const handleColumnVisibilityChange = useCallback(
    (value: Updater<VisibilityState>) => {
      setColumnVisibilityState(prev => {
        const newValue = typeof value === 'function' ? value(prev) : value;
        onColumnVisibilityChange?.(newValue);
        return newValue;
      });
    },
    [onColumnVisibilityChange]
  );

  // Lifted so a selection change invalidates the memoized context value; the
  // table instance identity is stable and can't do it.
  const [rowSelection, setRowSelectionState] = useState<RowSelectionState>({});

  const handleRowSelectionChange = useCallback(
    (value: Updater<RowSelectionState>) => {
      setRowSelectionState(prev => {
        const newValue = typeof value === 'function' ? value(prev) : value;
        onRowSelectionChange?.(newValue);
        return newValue;
      });
    },
    [onRowSelectionChange]
  );

  const [currentQuery, setCurrentQuery] = useControlled<
    DataViewQuery | undefined
  >({
    controlled: query,
    default: defaultQuery,
    name: 'DataView',
    state: 'query'
  });
  const [tableQuery, setTableQuery] = useState<InternalQuery>(() =>
    getDefaultTableQuery(defaultSort, currentQuery, fields)
  );
  // The query `tableQuery` last matched. `tableQuery` also keeps filters that
  // have no value yet, which the query leaves out, so it follows a new query
  // only when the query differs from it.
  const [syncedQuery, setSyncedQuery] = useState(currentQuery);
  // Server mode reports the first query on mount, so the first page can load.
  const [reportedQuery, setReportedQuery] = useState<InternalQuery | null>(
    mode === 'server' ? null : tableQuery
  );
  if (currentQuery !== syncedQuery) {
    setSyncedQuery(currentQuery);
    const next = getDefaultTableQuery(defaultSort, currentQuery, fields);
    if (hasQueryChanged(tableQuery, next)) {
      setTableQuery(next);
      setReportedQuery(next);
    }
  }

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

  // Column defs are derived from EFFECTIVE fields so toolbar + headless filter/
  // sort/visibility reflect the active view's metadata override.
  const columnDefs = useMemo(
    () => fieldsToColumnDefs<TData>(effectiveFields, tableQuery.filters),
    [effectiveFields, tableQuery.filters]
  );

  const groupedData = useMemo(
    () => groupData(data, group_by, effectiveFields, groupByResolvers),
    [data, group_by, effectiveFields, groupByResolvers]
  );

  useEffect(() => {
    if (!hasQueryChanged(reportedQuery, tableQuery)) return;
    const next = transformToDataViewQuery(tableQuery);
    setReportedQuery(tableQuery);
    setSyncedQuery(next);
    setCurrentQuery(next);
    onQueryChange?.(next, createChangeDetails('none'));
  }, [tableQuery, reportedQuery, onQueryChange, setCurrentQuery]);

  const resolveRowId = useMemo(() => createRowIdResolver(getRowId), [getRowId]);

  const table = useReactTable({
    data: groupedData as unknown as TData[],
    columns: columnDefs,
    getRowId: resolveRowId,
    // Group rows render without cells, so they have no checkbox, so keeping them
    // unselectable keeps `rowSelection` one key per data row.
    enableRowSelection: row => !isGroupRowData(row.original),
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSubRows: row => (row as unknown as GroupedData<TData>)?.subRows || [],
    getSortedRowModel: mode === 'server' ? undefined : getSortedRowModel(),
    getFilteredRowModel:
      mode === 'server' ? undefined : getFilteredRowModelWithFlatRows(),
    manualSorting: mode === 'server',
    manualFiltering: mode === 'server',
    onColumnVisibilityChange: handleColumnVisibilityChange,
    onRowSelectionChange: handleRowSelectionChange,
    globalFilterFn: mode === 'server' ? undefined : 'auto',
    initialState: { columnVisibility: initialColumnVisibility },
    filterFromLeafRows: true,
    state: {
      ...reactTableState,
      columnVisibility,
      rowSelection,
      expanded:
        group_by && group_by !== defaultGroupOption.id ? true : undefined
    }
  });

  const updateTableQuery = useCallback((fn: TableQueryUpdateFn) => {
    setTableQuery(prev => fn(prev));
  }, []);

  const loadMoreData = useCallback(() => {
    if (mode === 'server' && onLoadMore) onLoadMore();
  }, [mode, onLoadMore]);

  const rowCount = (() => {
    try {
      return table.getRowModel().rows.length;
    } catch {
      return data.length;
    }
  })();

  const hasData = rowCount > 0 || isLoading;

  const hasActiveQueryFlag = useMemo(
    () => computeHasActiveQuery(tableQuery, defaultSort),
    [tableQuery, defaultSort]
  );

  const isZeroState = !hasData && !hasActiveQueryFlag;
  const isEmptyState = !hasData && hasActiveQueryFlag;

  // The filter bar shows whenever there's data OR an active query. The pure
  // zero state (no data + no query) keeps the surface clean.
  const shouldShowFilters = hasData || hasActiveQueryFlag;

  const contextValue: DataViewContextType<TData> = useMemo(
    () => ({
      table,
      fields: effectiveFields,
      rootFields: fields,
      data,
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
      shouldShowFilters,
      columnVisibility,
      setColumnVisibility: handleColumnVisibilityChange,
      rowSelection,
      setRowSelection: handleRowSelectionChange,
      views,
      activeView,
      setActiveView,
      registerFieldsForView,
      hasData,
      hasActiveQuery: hasActiveQueryFlag,
      isZeroState,
      isEmptyState
    }),
    [
      table,
      effectiveFields,
      fields,
      data,
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
      shouldShowFilters,
      columnVisibility,
      handleColumnVisibilityChange,
      rowSelection,
      handleRowSelectionChange,
      views,
      activeView,
      setActiveView,
      registerFieldsForView,
      hasData,
      hasActiveQueryFlag,
      isZeroState,
      isEmptyState
    ]
  );

  return (
    <DataViewContext
      value={contextValue as unknown as DataViewContextType<unknown>}
    >
      {children}
    </DataViewContext>
  );
}

DataViewRoot.displayName = 'DataView';

// biome-ignore lint/suspicious/noShadowRestrictedNames: public component name intentionally matches the package export
export const DataView = Object.assign(DataViewRoot, {
  List: DataViewList,
  Timeline: DataViewTimeline,
  Custom: DataViewCustom,
  DisplayAccess: DisplayAccess,
  EmptyState: DataViewEmptyState,
  ZeroState: DataViewZeroState,
  ClearFilters: DataViewClearFilters,
  Toolbar: Toolbar,
  Search: DataViewSearch,
  Filters: Filters,
  DisplayControls: DisplayControls
});
