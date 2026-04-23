'use client';

import { TableIcon } from '@radix-ui/react-icons';
import type { Header, Row } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { cx } from 'class-variance-authority';
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import tableStyles from '~/components/table/table.module.css';
import { Badge } from '../../badge';
import { EmptyState } from '../../empty-state';
import { Flex } from '../../flex';
import { Skeleton } from '../../skeleton';
import styles from '../data-view.module.css';
import {
  DataViewContentClassNames,
  DataViewTableColumn,
  defaultGroupOption,
  GroupedData
} from '../data-view.types';
import { useDataView } from '../hooks/useDataView';
import { hasActiveQuery } from '../utils';

export interface VirtualizedContentProps<TData, TValue = unknown> {
  columns: DataViewTableColumn<TData, TValue>[];
  emptyState?: React.ReactNode;
  zeroState?: React.ReactNode;
  classNames?: DataViewContentClassNames;
  rowHeight?: number;
  groupHeaderHeight?: number;
  overscan?: number;
  loadMoreOffset?: number;
  stickyGroupHeader?: boolean;
}

function VirtualHeaders<TData, TValue>({
  headers,
  columnMap,
  className
}: {
  headers: Header<TData, TValue>[];
  columnMap: Map<string, DataViewTableColumn<TData, TValue>>;
  className?: string;
}) {
  return (
    <div role='rowgroup' className={cx(styles.virtualHeaderGroup, className)}>
      <div role='row' className={styles.virtualHeaderRow}>
        {headers.map(header => {
          const spec = columnMap.get(header.column.id);
          const content =
            spec?.header !== undefined
              ? flexRender(spec.header, header.getContext())
              : flexRender(header.column.columnDef.header, header.getContext());
          return (
            <div
              role='columnheader'
              key={header.id}
              className={cx(
                tableStyles.head,
                styles.virtualHead,
                spec?.classNames?.header
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
}

function VirtualGroupHeader<TData>({
  data,
  style
}: {
  data: GroupedData<TData>;
  style?: React.CSSProperties;
}) {
  return (
    <div role='row' className={styles.virtualSectionHeader} style={style}>
      <Flex gap={3} align='center'>
        {data?.label}
        {data.showGroupCount ? (
          <Badge variant='neutral'>{data?.count}</Badge>
        ) : null}
      </Flex>
    </div>
  );
}

function VirtualRows<TData, TValue>({
  rows,
  virtualizer,
  renderedAccessors,
  columnMap,
  onRowClick,
  classNames
}: {
  rows: Row<TData>[];
  virtualizer: ReturnType<typeof useVirtualizer>;
  renderedAccessors: string[];
  columnMap: Map<string, DataViewTableColumn<TData, TValue>>;
  onRowClick?: (row: TData) => void;
  classNames?: { row?: string };
}) {
  const items = virtualizer.getVirtualItems();

  return items.map(item => {
    const row = rows[item.index];
    if (!row) return null;

    const isSelected = row.getIsSelected();
    const cells = row.getVisibleCells() || [];
    const isGroupHeader = row.subRows && row.subRows.length > 0;
    const rowKey = row.id + '-' + item.index;

    const positionStyle: React.CSSProperties = {
      height: item.size,
      top: item.start
    };

    if (isGroupHeader) {
      return (
        <VirtualGroupHeader
          key={rowKey}
          data={row.original as GroupedData<unknown>}
          style={positionStyle}
        />
      );
    }

    return (
      <div
        role='row'
        key={rowKey}
        className={cx(
          styles.virtualRow,
          styles['row'],
          onRowClick ? styles['clickable'] : '',
          classNames?.row
        )}
        style={positionStyle}
        data-state={isSelected && 'selected'}
        onClick={() => onRowClick?.(row.original)}
      >
        {renderedAccessors.map(accessor => {
          const spec = columnMap.get(accessor);
          const cell = cells.find(c => c.column.id === accessor);
          if (!cell) {
            return (
              <div
                role='cell'
                key={accessor}
                className={cx(
                  tableStyles.cell,
                  styles.virtualCell,
                  spec?.classNames?.cell
                )}
                style={spec?.styles?.cell}
              />
            );
          }
          return (
            <div
              role='cell'
              key={cell.id}
              className={cx(
                tableStyles.cell,
                styles.virtualCell,
                spec?.classNames?.cell
              )}
              style={spec?.styles?.cell}
            >
              {spec?.cell
                ? flexRender(spec.cell, cell.getContext())
                : ((cell.getValue() as React.ReactNode) ?? null)}
            </div>
          );
        })}
      </div>
    );
  });
}

function VirtualLoaderRows<TData, TValue>({
  renderedAccessors,
  columnMap,
  rowHeight,
  count
}: {
  renderedAccessors: string[];
  columnMap: Map<string, DataViewTableColumn<TData, TValue>>;
  rowHeight: number;
  count: number;
}) {
  return (
    <div className={styles.stickyLoaderContainer}>
      {Array.from({ length: count }).map((_, rowIndex) => (
        <div
          role='row'
          key={'loading-row-' + rowIndex}
          className={cx(styles.virtualRow, styles['row'], styles.loaderRow)}
          style={{ height: rowHeight }}
        >
          {renderedAccessors.map(accessor => {
            const spec = columnMap.get(accessor);
            return (
              <div
                role='cell'
                key={accessor}
                className={cx(
                  tableStyles.cell,
                  styles.virtualCell,
                  spec?.classNames?.cell
                )}
                style={spec?.styles?.cell}
              >
                <Skeleton containerClassName={styles['flex-1']} />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

const DefaultEmptyComponent = () => (
  <EmptyState icon={<TableIcon />} heading='No Data' />
);

export function VirtualizedContent<TData, TValue = unknown>({
  columns,
  rowHeight = 40,
  groupHeaderHeight,
  overscan = 5,
  loadMoreOffset = 100,
  emptyState,
  zeroState,
  classNames = {},
  stickyGroupHeader = false
}: VirtualizedContentProps<TData, TValue>) {
  const {
    onRowClick,
    table,
    isLoading,
    loadMoreData,
    tableQuery,
    defaultSort,
    loadingRowCount = 3
  } = useDataView<TData>();

  const columnMap = useMemo(() => {
    const map = new Map<string, DataViewTableColumn<TData, TValue>>();
    columns.forEach(c => map.set(c.accessorKey, c));
    return map;
  }, [columns]);

  const visibleLeafColumns = table.getVisibleLeafColumns();

  const renderedAccessors = useMemo(() => {
    const visibleSet = new Set(visibleLeafColumns.map(c => c.id));
    return columns.map(c => c.accessorKey).filter(k => visibleSet.has(k));
  }, [columns, visibleLeafColumns]);

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

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const [stickyGroup, setStickyGroup] = useState<GroupedData<unknown> | null>(
    null
  );
  const [headerHeight, setHeaderHeight] = useState(40);

  const groupBy = tableQuery?.group_by?.[0];
  const isGrouped = Boolean(groupBy) && groupBy !== defaultGroupOption.id;

  const groupHeaderList = useMemo(() => {
    const list: { index: number; data: GroupedData<unknown> }[] = [];
    rows.forEach((row, i) => {
      if (row.subRows && row.subRows.length > 0) {
        list.push({ index: i, data: row.original as GroupedData<unknown> });
      }
    });
    return list;
  }, [rows]);

  const showLoaderRows = isLoading && rows.length > 0;

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: index => {
      const row = rows[index];
      const isGroupHeader = row?.subRows && row.subRows.length > 0;
      return isGroupHeader ? (groupHeaderHeight ?? rowHeight) : rowHeight;
    },
    overscan
  });

  const updateStickyGroup = useCallback(() => {
    if (!stickyGroupHeader || !isGrouped || groupHeaderList.length === 0) {
      setStickyGroup(null);
      return;
    }
    const items = virtualizer.getVirtualItems();
    const firstIndex = items[0]?.index ?? 0;
    const current = groupHeaderList
      .filter(g => g.index <= firstIndex)
      .pop()?.data;
    setStickyGroup(current ?? null);
  }, [stickyGroupHeader, isGrouped, groupHeaderList, virtualizer]);

  const handleVirtualScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    if (stickyGroupHeader) updateStickyGroup();
    if (isLoading) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    if (scrollHeight - scrollTop - clientHeight < loadMoreOffset!) {
      loadMoreData();
    }
  }, [
    stickyGroupHeader,
    isLoading,
    loadMoreData,
    loadMoreOffset,
    updateStickyGroup
  ]);

  const totalHeight = virtualizer.getTotalSize();

  useLayoutEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.getBoundingClientRect().height);
    }
  }, [headersInOrder]);

  useLayoutEffect(() => {
    if (stickyGroupHeader) updateStickyGroup();
  }, [stickyGroupHeader, updateStickyGroup, groupHeaderList, isGrouped]);

  const hasData = rows?.length > 0 || isLoading;

  const hasChanges = hasActiveQuery(tableQuery || {}, defaultSort);

  const isZeroState = !hasData && !hasChanges;
  const isEmptyState = !hasData && hasChanges;

  const stateToShow: React.ReactNode = isZeroState
    ? (zeroState ?? emptyState ?? <DefaultEmptyComponent />)
    : isEmptyState
      ? (emptyState ?? <DefaultEmptyComponent />)
      : null;

  if (!hasData) {
    return <div className={classNames.root}>{stateToShow}</div>;
  }

  return (
    <div
      ref={scrollContainerRef}
      className={cx(classNames.root, styles.scrollContainer)}
      onScroll={handleVirtualScroll}
    >
      <div role='table' className={cx(styles.virtualTable, classNames.table)}>
        <div ref={headerRef}>
          <VirtualHeaders
            headers={headersInOrder}
            columnMap={columnMap}
            className={cx(styles.stickyHeader, classNames.header)}
          />
        </div>
        {stickyGroupHeader && isGrouped && stickyGroup && (
          <div
            role='row'
            className={styles.stickyGroupAnchor}
            style={{ top: headerHeight }}
          >
            <Flex gap={3} align='center'>
              {stickyGroup.label}
              {stickyGroup.showGroupCount ? (
                <Badge variant='neutral'>{stickyGroup.count}</Badge>
              ) : null}
            </Flex>
          </div>
        )}
        <div
          role='rowgroup'
          className={cx(styles.virtualBodyGroup, classNames.body)}
          style={{ height: totalHeight }}
        >
          <VirtualRows
            rows={rows}
            virtualizer={virtualizer}
            renderedAccessors={renderedAccessors}
            columnMap={columnMap}
            onRowClick={onRowClick}
            classNames={{ row: classNames.row }}
          />
        </div>
      </div>
      {showLoaderRows && (
        <VirtualLoaderRows
          renderedAccessors={renderedAccessors}
          columnMap={columnMap}
          rowHeight={rowHeight}
          count={loadingRowCount}
        />
      )}
    </div>
  );
}

VirtualizedContent.displayName = 'DataView.VirtualizedContent';
