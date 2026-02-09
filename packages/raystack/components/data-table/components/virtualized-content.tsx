'use client';

import { TableIcon } from '@radix-ui/react-icons';
import type { HeaderGroup, Row } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { cx } from 'class-variance-authority';
import { useCallback, useRef } from 'react';
import tableStyles from '~/components/table/table.module.css';
import { Badge } from '../../badge';
import { EmptyState } from '../../empty-state';
import { Flex } from '../../flex';
import { Skeleton } from '../../skeleton';
import styles from '../data-table.module.css';
import {
  DataTableColumnDef,
  GroupedData,
  VirtualizedContentProps
} from '../data-table.types';
import { useDataTable } from '../hooks/useDataTable';

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

function VirtualRows<TData>({
  rows,
  virtualizer,
  onRowClick,
  classNames
}: {
  rows: Row<TData>[];
  virtualizer: ReturnType<typeof useVirtualizer>;
  onRowClick?: (row: TData) => void;
  classNames?: { row?: string };
}) {
  const items = virtualizer.getVirtualItems();

  return items.map((item, idx) => {
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
        {cells.map(cell => {
          const columnDef = cell.column.columnDef as DataTableColumnDef<
            unknown,
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
    <div className={styles.stickyLoaderContainer}>
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
    loadingRowCount = 3
  } = useDataTable();

  const headerGroups = table?.getHeaderGroups();
  const rowModel = table?.getRowModel();
  const { rows = [] } = rowModel || {};

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

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

  const handleVirtualScroll = useCallback(() => {
    if (!scrollContainerRef.current || isLoading) return;
    const { scrollTop, scrollHeight, clientHeight } =
      scrollContainerRef.current;
    if (scrollHeight - scrollTop - clientHeight < loadMoreOffset) {
      loadMoreData();
    }
  }, [isLoading, loadMoreData, loadMoreOffset]);

  const totalHeight = virtualizer.getTotalSize();

  const hasData = rows?.length > 0 || isLoading;

  const hasFiltersOrSearch =
    (tableQuery?.filters && tableQuery.filters.length > 0) ||
    Boolean(tableQuery?.search && tableQuery.search.trim() !== '');

  const isZeroState = !hasData && !hasFiltersOrSearch;
  const isEmptyState = !hasData && hasFiltersOrSearch;

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
        <VirtualHeaders
          headerGroups={headerGroups}
          className={cx(styles.stickyHeader, classNames.header)}
        />
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
