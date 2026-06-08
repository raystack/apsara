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

import { DataViewCustom } from './components/custom';
import { DisplayAccess } from './components/display-access';
import { DisplayControls } from './components/display-controls';
import { DataViewEmptyState } from './components/empty-state';
import { Filters } from './components/filters';
import { DataViewList } from './components/list';
import { DataViewSearch } from './components/search';
import { Toolbar } from './components/toolbar';
import { DataViewZeroState } from './components/zero-state';
import { DataViewContext } from './context';
import {
  DataViewContextType,
  DataViewField,
  DataViewProps,
  defaultGroupOption,
  GroupedData,
  InternalQuery,
  TableQueryUpdateFn
} from './data-view.types';
import {
  hasActiveQuery as computeHasActiveQuery,
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
  getRowId,
  views,
  defaultView,
  view,
  onViewChange,
  groupByResolvers
}: React.PropsWithChildren<DataViewProps<TData>>) {
  const defaultTableQuery = useMemo(
    () => getDefaultTableQuery(defaultSort, query),
    [defaultSort, query]
  );

  // Active view (controlled / uncontrolled).
  const isViewControlled = view !== undefined;
  const [internalActiveView, setInternalActiveView] = useState<
    string | undefined
  >(defaultView ?? views?.[0]?.value);
  const activeView = isViewControlled ? view : internalActiveView;
  const setActiveView = useCallback(
    (next: string) => {
      if (!isViewControlled) setInternalActiveView(next);
      onViewChange?.(next);
    },
    [isViewControlled, onViewChange]
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
    if (
      tableQuery &&
      onTableQueryChange &&
      hasQueryChanged(oldQueryRef.current, tableQuery) &&
      mode === 'server'
    ) {
      onTableQueryChange(transformToDataViewQuery(tableQuery));
      oldQueryRef.current = tableQuery;
    }
  }, [tableQuery, onTableQueryChange, mode]);

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
    initialState: { columnVisibility: initialColumnVisibility },
    filterFromLeafRows: true,
    state: {
      ...reactTableState,
      columnVisibility,
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

  const searchQuery = query?.search;
  useEffect(() => {
    if (searchQuery) {
      setTableQuery(prev => ({ ...prev, search: searchQuery }));
    }
  }, [searchQuery]);

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

  return <DataViewContext value={contextValue}>{children}</DataViewContext>;
}

DataViewRoot.displayName = 'DataView';

// biome-ignore lint/suspicious/noShadowRestrictedNames: public component name intentionally matches the package export
export const DataView = Object.assign(DataViewRoot, {
  List: DataViewList,
  Custom: DataViewCustom,
  DisplayAccess: DisplayAccess,
  EmptyState: DataViewEmptyState,
  ZeroState: DataViewZeroState,
  Toolbar: Toolbar,
  Search: DataViewSearch,
  Filters: Filters,
  DisplayControls: DisplayControls
});
