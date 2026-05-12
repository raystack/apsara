'use client';

import { Cross2Icon } from '@radix-ui/react-icons';
import type { Header, Row } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { cx } from 'class-variance-authority';
import { CSSProperties, useCallback, useEffect, useMemo, useRef } from 'react';

import { Badge } from '../../badge';
import { Button } from '../../button';
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
  hasActiveTableFiltering
} from '../utils';

function formatGridWidth(width: string | number | undefined) {
  if (width === undefined) return '1fr';
  if (typeof width === 'number') return `${width}px`;
  return width;
}

export function DataViewList<TData, TValue = unknown>({
  name,
  variant = 'list',
  showHeaders,
  role,
  fields: fieldsOverride,
  columns,
  rowHeight,
  virtualized = false,
  overscan = 8,
  showDividers,
  showGroupHeaders = true,
  stickyGroupHeader = false,
  loadMoreOffset = 100,
  classNames = {}
}: DataViewListProps<TData, TValue>) {
  const {
    table,
    mode,
    onRowClick,
    isLoading,
    loadMoreData,
    tableQuery,
    totalRowCount,
    updateTableQuery,
    activeView,
    registerFieldsForView,
    hasData
  } = useDataView<TData>();

  // Register per-view field override so the toolbar's effectiveFields reflects
  // this renderer's metadata while it's the active view.
  useEffect(() => {
    if (!name || !fieldsOverride) return;
    return registerFieldsForView(name, fieldsOverride);
  }, [name, fieldsOverride, registerFieldsForView]);

  // Multi-view gate. When `name` is set, render only when this is the active
  // view. When `name` is unset (single-renderer mode), always render.
  const isActive = !name || activeView === undefined || activeView === name;

  const isTableVariant = variant === 'table';
  const headersVisible = showHeaders ?? isTableVariant;
  const ariaRole = role ?? (isTableVariant ? 'table' : 'list');
  const dividers = showDividers ?? isTableVariant;
  const effectiveRowHeight = rowHeight ?? (isTableVariant ? 40 : 56);

  const visibleLeafColumns = table.getVisibleLeafColumns();

  const columnMap = useMemo(() => {
    const map = new Map<string, DataViewListColumn<TData, TValue>>();
    columns.forEach(c => map.set(c.accessorKey, c));
    return map;
  }, [columns]);

  // Render order from `columns`, filtered by current TanStack visibility.
  const renderedAccessors = useMemo(() => {
    const visibleSet = new Set(visibleLeafColumns.map(c => c.id));
    return columns.map(c => c.accessorKey).filter(k => visibleSet.has(k));
  }, [columns, visibleLeafColumns]);

  const gridTemplateColumns = useMemo(() => {
    return renderedAccessors
      .map(accessor => formatGridWidth(columnMap.get(accessor)?.width))
      .join(' ');
  }, [renderedAccessors, columnMap]);

  const headerGroups = table?.getHeaderGroups() ?? [];
  const lastHeaderGroup = headerGroups[headerGroups.length - 1];
  const headersInOrder = useMemo(() => {
    if (!lastHeaderGroup) return [] as Header<TData, TValue>[];
    return renderedAccessors
      .map(
        accessor =>
          lastHeaderGroup.headers.find(h => h.column.id === accessor) as
            | Header<TData, TValue>
            | undefined
      )
      .filter((h): h is Header<TData, TValue> => Boolean(h));
  }, [lastHeaderGroup, renderedAccessors]);

  const rowModel = table?.getRowModel();
  const { rows = [] } = rowModel || {};

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
    if (!isActive) return;
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
  }, [isActive, mode, virtualized, rows.length, handleObserver]);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: i => {
      const row = rows[i];
      const isGroupHeader = row?.subRows && row.subRows.length > 0;
      return isGroupHeader ? 36 : effectiveRowHeight;
    },
    overscan
  });

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

  if (!isActive) return null;
  if (!hasData) return null;

  const renderHeaderRow = () => {
    if (!headersVisible) return null;
    return (
      <div
        role={ariaRole === 'table' ? 'rowgroup' : undefined}
        className={cx(styles.listHeader, classNames.header)}
      >
        <div
          role={ariaRole === 'table' ? 'row' : undefined}
          className={styles.listHeaderRow}
        >
          {headersInOrder.map(header => {
            const spec = columnMap.get(header.column.id);
            const content =
              spec?.header !== undefined
                ? flexRender(spec.header, header.getContext())
                : flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  );
            return (
              <div
                role={ariaRole === 'table' ? 'columnheader' : undefined}
                key={header.id}
                className={cx(
                  styles.listHeaderCell,
                  spec?.classNames?.header,
                  classNames.headerCell
                )}
                style={spec?.styles?.header}
              >
                {content}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderRowCells = (row: Row<TData>) =>
    renderedAccessors.map(accessor => {
      const spec = columnMap.get(accessor);
      const cell = row.getVisibleCells().find(c => c.column.id === accessor);
      if (!cell) {
        return (
          <div
            role={ariaRole === 'table' ? 'cell' : undefined}
            key={accessor}
            className={cx(
              styles.listCell,
              spec?.classNames?.cell,
              classNames.cell
            )}
            style={spec?.styles?.cell}
          />
        );
      }
      return (
        <div
          role={ariaRole === 'table' ? 'cell' : undefined}
          key={cell.id}
          className={cx(
            styles.listCell,
            spec?.classNames?.cell,
            classNames.cell
          )}
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
        className={cx(
          styles.listGroupHeader,
          stickyGroupHeader && styles.listGroupHeaderSticky,
          classNames.groupHeader
        )}
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
      role={ariaRole === 'table' ? 'row' : 'listitem'}
      key={key ?? row.id}
      ref={refCb}
      className={cx(
        styles.listRow,
        dividers && styles.listRowDivider,
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
      <div
        role={ariaRole}
        className={styles.listGrid}
        style={{ gridTemplateColumns }}
      >
        {renderHeaderRow()}
        {virtualized ? (
          <div
            role={ariaRole === 'table' ? 'rowgroup' : undefined}
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
