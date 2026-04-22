'use client';

import { Cross2Icon, TableIcon } from '@radix-ui/react-icons';
import type { Row } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { cx } from 'class-variance-authority';
import { CSSProperties, useCallback, useEffect, useMemo, useRef } from 'react';

import { Badge } from '../../badge';
import { Button } from '../../button';
import { EmptyState } from '../../empty-state';
import { Flex } from '../../flex';
import styles from '../data-view.module.css';
import {
  DataViewListColumn,
  DataViewListProps,
  GroupedData
} from '../data-view.types';
import { useDataView } from '../hooks/useDataView';
import {
  countLeafRows,
  getClientHiddenLeafRowCount,
  hasActiveQuery,
  hasActiveTableFiltering
} from '../utils';

const DefaultEmptyComponent = () => (
  <EmptyState icon={<TableIcon />} heading='No Data' />
);

function formatGridWidth(width: string | number | undefined) {
  if (width === undefined) return '1fr';
  if (typeof width === 'number') return `${width}px`;
  return width;
}

export function DataViewList<TData, TValue = unknown>({
  columns,
  rowHeight = 56,
  virtualized = false,
  overscan = 8,
  showDividers = false,
  showGroupHeaders = true,
  loadMoreOffset = 100,
  emptyState,
  zeroState,
  classNames = {}
}: DataViewListProps<TData, TValue>) {
  const {
    table,
    mode,
    onRowClick,
    isLoading,
    loadMoreData,
    tableQuery,
    defaultSort,
    totalRowCount,
    updateTableQuery
  } = useDataView<TData>();

  const rowModel = table?.getRowModel();
  const { rows = [] } = rowModel || {};

  const visibleLeafColumns = table.getVisibleLeafColumns();

  const columnMap = useMemo(() => {
    const map = new Map<string, DataViewListColumn<TData, TValue>>();
    columns.forEach(c => map.set(c.accessorKey, c));
    return map;
  }, [columns]);

  // Render order comes from `columns` prop; filter out any accessor whose
  // TanStack column is currently hidden.
  const renderedAccessors = useMemo(() => {
    const visibleSet = new Set(visibleLeafColumns.map(c => c.id));
    return columns.map(c => c.accessorKey).filter(k => visibleSet.has(k));
  }, [columns, visibleLeafColumns]);

  const gridTemplateColumns = useMemo(() => {
    return renderedAccessors
      .map(accessor => formatGridWidth(columnMap.get(accessor)?.width))
      .join(' ');
  }, [renderedAccessors, columnMap]);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastRowRef = useRef<HTMLDivElement | null>(null);

  const loadMoreDataRef = useRef(loadMoreData);
  const isLoadingRef = useRef(isLoading);
  loadMoreDataRef.current = loadMoreData;
  isLoadingRef.current = isLoading;

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (!target?.isIntersecting) return;
    if (isLoadingRef.current) return;
    const loadMore = loadMoreDataRef.current;
    if (loadMore) loadMore();
  }, []);

  // Non-virtualized load-more via last-row IntersectionObserver
  useEffect(() => {
    if (mode !== 'server' || virtualized) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    const lastRow = lastRowRef.current;
    if (!lastRow) return;

    observerRef.current = new IntersectionObserver(handleObserver, {
      threshold: 0.1
    });
    observerRef.current.observe(lastRow);

    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, [mode, virtualized, rows.length, handleObserver]);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: i => {
      const row = rows[i];
      const isGroupHeader = row?.subRows && row.subRows.length > 0;
      return isGroupHeader ? 36 : rowHeight;
    },
    overscan
  });

  const hasData = rows.length > 0 || isLoading;
  const hasChanges = hasActiveQuery(tableQuery || {}, defaultSort);
  const isZeroState = !hasData && !hasChanges;
  const isEmptyState = !hasData && hasChanges;

  const stateToShow = isZeroState
    ? (zeroState ?? emptyState ?? <DefaultEmptyComponent />)
    : isEmptyState
      ? (emptyState ?? <DefaultEmptyComponent />)
      : null;

  const hiddenLeafRowCount =
    mode === 'client'
      ? getClientHiddenLeafRowCount(table)
      : totalRowCount !== undefined
        ? Math.max(0, totalRowCount - countLeafRows(rows))
        : null;
  const hasActiveFiltering = !isLoading && hasActiveTableFiltering(table);
  const showFilterSummary =
    hasActiveFiltering &&
    (mode === 'server' ||
      (typeof hiddenLeafRowCount === 'number' && hiddenLeafRowCount > 0));

  const handleClearFilters = useCallback(() => {
    updateTableQuery(prev => ({
      ...prev,
      filters: [],
      search: ''
    }));
  }, [updateTableQuery]);

  const handleVirtualScroll = useCallback(() => {
    if (!virtualized) return;
    const el = scrollRef.current;
    if (!el) return;
    if (isLoading) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    if (scrollHeight - scrollTop - clientHeight < loadMoreOffset!) {
      loadMoreData();
    }
  }, [virtualized, isLoading, loadMoreData, loadMoreOffset]);

  if (!hasData) {
    return (
      <div className={cx(styles.listRoot, classNames.root)}>
        <div className={styles.listEmptyState}>{stateToShow}</div>
      </div>
    );
  }

  const renderRowCells = (row: Row<TData>) =>
    renderedAccessors.map(accessor => {
      const spec = columnMap.get(accessor);
      const cell = row.getVisibleCells().find(c => c.column.id === accessor);
      if (!cell) {
        return (
          <div
            key={accessor}
            className={cx(styles.listCell, spec?.classNames?.cell)}
            style={spec?.styles?.cell}
          />
        );
      }
      return (
        <div
          key={cell.id}
          className={cx(styles.listCell, spec?.classNames?.cell)}
          style={spec?.styles?.cell}
        >
          {spec?.cell
            ? flexRender(spec.cell, cell.getContext())
            : ((cell.getValue() as React.ReactNode) ?? null)}
        </div>
      );
    });

  const renderGroupHeader = (
    row: Row<TData>,
    style?: CSSProperties,
    key?: string
  ) => {
    const data = row.original as GroupedData<unknown>;
    return (
      <div
        key={key ?? row.id}
        className={cx(styles.listGroupHeader, classNames.groupHeader)}
        style={style}
      >
        <Flex gap={3} align='center'>
          {data?.label}
          {data?.showGroupCount ? (
            <Badge variant='neutral'>{data?.count}</Badge>
          ) : null}
        </Flex>
      </div>
    );
  };

  const renderDataRow = (
    row: Row<TData>,
    style?: CSSProperties,
    key?: string,
    refCb?: (el: HTMLDivElement | null) => void
  ) => (
    <div
      key={key ?? row.id}
      ref={refCb}
      className={cx(
        styles.listRow,
        showDividers && styles.listRowDivider,
        onRowClick && styles.clickable,
        classNames.row
      )}
      style={style}
      onClick={() => onRowClick?.(row.original)}
    >
      {renderRowCells(row)}
    </div>
  );

  return (
    <div
      ref={scrollRef}
      className={cx(styles.listRoot, classNames.root)}
      onScroll={handleVirtualScroll}
    >
      <div className={styles.listGrid} style={{ gridTemplateColumns }}>
        {virtualized ? (
          <div
            style={{
              gridColumn: '1 / -1',
              display: 'grid',
              gridTemplateColumns: 'subgrid',
              position: 'relative',
              height: virtualizer.getTotalSize()
            }}
          >
            {virtualizer.getVirtualItems().map(item => {
              const row = rows[item.index];
              if (!row) return null;
              const isGroupHeader = row.subRows && row.subRows.length > 0;
              const positionStyle: CSSProperties = {
                position: 'absolute',
                top: item.start,
                left: 0,
                right: 0,
                height: item.size
              };
              if (isGroupHeader) {
                return showGroupHeaders
                  ? renderGroupHeader(
                      row,
                      positionStyle,
                      row.id + '-' + item.index
                    )
                  : null;
              }
              return renderDataRow(
                row,
                positionStyle,
                row.id + '-' + item.index
              );
            })}
          </div>
        ) : (
          rows.map((row, idx) => {
            const isGroupHeader = row.subRows && row.subRows.length > 0;
            const isLast = idx === rows.length - 1;
            if (isGroupHeader) {
              return showGroupHeaders ? renderGroupHeader(row) : null;
            }
            return renderDataRow(row, undefined, undefined, el => {
              if (isLast) lastRowRef.current = el;
            });
          })
        )}
      </div>
      {showFilterSummary ? (
        <Flex
          className={styles.filterSummaryFooter}
          justify='center'
          align='center'
        >
          {mode === 'server' && hiddenLeafRowCount === null ? (
            <span className={styles.filterSummaryLabel}>
              Some items might be hidden by filters
            </span>
          ) : (
            <Flex align='center' gap={2}>
              <span className={styles.filterSummaryCount}>
                {hiddenLeafRowCount}
              </span>
              <span className={styles.filterSummaryLabel}>
                items hidden by filters
              </span>
            </Flex>
          )}
          <Button
            variant='text'
            color='neutral'
            size='small'
            trailingIcon={<Cross2Icon />}
            onClick={handleClearFilters}
          >
            Clear Filters
          </Button>
        </Flex>
      ) : null}
    </div>
  );
}

DataViewList.displayName = 'DataView.List';
