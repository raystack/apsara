'use client';

import { TableIcon } from '@radix-ui/react-icons';
import type { HeaderGroup, Row } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { cx } from 'class-variance-authority';
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import tableStyles from '~/components/table/table.module.css';
import { Badge } from '../../badge';
import { EmptyState } from '../../empty-state';
import { Flex } from '../../flex';
import { Skeleton } from '../../skeleton';
import styles from '../data-table.module.css';
import {
  DataTableColumnDef,
  defaultGroupOption,
  GroupedData,
  VirtualizedContentProps
} from '../data-table.types';
import { useDataTable } from '../hooks/useDataTable';
import { useStickyGroupAnchor } from '../hooks/useStickyGroupAnchor';
import { hasActiveQuery } from '../utils';

function VirtualHeaders<TData>({
  headerGroups = [],
  className = ''
}: {
  headerGroups: HeaderGroup<TData>[];
  className?: string;
}) {
  return (
    <div role='rowgroup' className={cx(styles.virtualHeaderGroup, className)}>
      {headerGroups?.map(headerGroup => (
        <div
          role='row'
          key={headerGroup?.id}
          className={styles.virtualHeaderRow}
        >
          {headerGroup?.headers?.map(header => {
            const columnDef = header.column.columnDef as DataTableColumnDef<
              TData,
              unknown
            >;
            return (
              <div
                role='columnheader'
                key={header.id}
                className={cx(
                  tableStyles.head,
                  styles.virtualHead,
                  columnDef.classNames?.header
                )}
                style={columnDef.styles?.header}
              >
                {flexRender(columnDef.header, header.getContext())}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function VirtualGroupHeader<TData>({
  data,
  ...rest
}: {
  data: GroupedData<TData>;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div role='row' className={styles.virtualSectionHeader} {...rest}>
      <Flex gap={3} align='center'>
        {data?.label}
        {data.showGroupCount ? (
          <Badge variant='neutral'>{data?.count}</Badge>
        ) : null}
      </Flex>
    </div>
  );
}

function VirtualRows<TData>({
  rows,
  virtualizer,
  onRowClick,
  classNames,
  hiddenGroupIndex
}: {
  rows: Row<TData>[];
  virtualizer: ReturnType<typeof useVirtualizer>;
  onRowClick?: (row: TData) => void;
  classNames?: { row?: string };
  hiddenGroupIndex?: number | null;
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
      const isHidden = item.index === hiddenGroupIndex;
      return (
        <VirtualGroupHeader
          key={rowKey}
          data={row.original as GroupedData<unknown>}
          aria-hidden={isHidden ? 'true' : undefined}
          style={
            isHidden
              ? { ...positionStyle, visibility: 'hidden' }
              : positionStyle
          }
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
        {cells.map(cell => {
          const columnDef = cell.column.columnDef as DataTableColumnDef<
            TData,
            unknown
          >;
          return (
            <div
              role='cell'
              key={cell.id}
              className={cx(
                tableStyles.cell,
                styles.virtualCell,
                columnDef.classNames?.cell
              )}
              style={columnDef.styles?.cell}
            >
              {flexRender(columnDef.cell, cell.getContext())}
            </div>
          );
        })}
      </div>
    );
  });
}

function VirtualLoaderRows({
  columns,
  rowHeight,
  count
}: {
  columns: ReturnType<
    ReturnType<typeof useDataTable>['table']['getVisibleLeafColumns']
  >;
  rowHeight: number;
  count: number;
}) {
  return (
    <div role='rowgroup' className={styles.loaderContainer}>
      {Array.from({ length: count }).map((_, rowIndex) => (
        <div
          role='row'
          key={'loading-row-' + rowIndex}
          className={cx(styles.virtualRow, styles['row'], styles.loaderRow)}
          style={{ height: rowHeight }}
        >
          {columns.map((col, colIndex) => {
            const columnDef = col.columnDef as DataTableColumnDef<
              unknown,
              unknown
            >;
            return (
              <div
                role='cell'
                key={'loading-column-' + colIndex}
                className={cx(
                  tableStyles.cell,
                  styles.virtualCell,
                  columnDef.classNames?.cell
                )}
                style={columnDef.styles?.cell}
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

export function VirtualizedContent({
  rowHeight = 40,
  groupHeaderHeight,
  overscan = 5,
  loadMoreOffset = 100,
  emptyState,
  zeroState,
  classNames = {}
}: VirtualizedContentProps) {
  const {
    onRowClick,
    table,
    isLoading,
    loadMoreData,
    tableQuery,
    defaultSort,
    loadingRowCount = 3,
    stickyGroupHeader = false
  } = useDataTable();

  const headerGroups = table?.getHeaderGroups();
  const rowModel = table?.getRowModel();
  const { rows = [] } = rowModel || {};

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
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

  const anchorPixelHeight = groupHeaderHeight ?? rowHeight;

  const {
    stickyGroup,
    stickyGroupIndex,
    recompute: recomputeStickyGroup
  } = useStickyGroupAnchor<unknown>({
    enabled: stickyGroupHeader && isGrouped,
    groupHeaderList,
    virtualizer,
    scrollContainerRef
  });

  const handleVirtualScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    if (stickyGroupHeader) recomputeStickyGroup();
    if (isLoading) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    if (scrollHeight - scrollTop - clientHeight < loadMoreOffset) {
      loadMoreData();
    }
  }, [
    stickyGroupHeader,
    isLoading,
    loadMoreData,
    loadMoreOffset,
    recomputeStickyGroup
  ]);

  const totalHeight = virtualizer.getTotalSize();

  useLayoutEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.getBoundingClientRect().height);
    }
  }, [headerGroups]);

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

  const visibleColumns = table.getVisibleLeafColumns();

  return (
    <div
      ref={scrollContainerRef}
      className={cx(classNames.root, styles.scrollContainer)}
      onScroll={handleVirtualScroll}
    >
      <div role='table' className={cx(styles.virtualTable, classNames.table)}>
        <div
          ref={headerRef}
          className={cx(styles.stickyHeader, classNames.header)}
        >
          <VirtualHeaders headerGroups={headerGroups} />
        </div>
        {stickyGroupHeader && isGrouped && stickyGroup && (
          <div
            aria-hidden='true'
            className={styles.stickyGroupAnchor}
            style={{
              top: headerHeight,
              height: anchorPixelHeight,
              marginBottom: -anchorPixelHeight
            }}
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
            onRowClick={onRowClick}
            classNames={{
              row: classNames.row
            }}
            hiddenGroupIndex={stickyGroupIndex}
          />
        </div>
      </div>
      {showLoaderRows && (
        <VirtualLoaderRows
          columns={visibleColumns}
          rowHeight={rowHeight}
          count={loadingRowCount}
        />
      )}
    </div>
  );
}

VirtualizedContent.displayName = 'DataTable.VirtualizedContent';
