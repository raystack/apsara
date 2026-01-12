'use client';

import { TableIcon } from '@radix-ui/react-icons';
import type { HeaderGroup, Row } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';
import { cx } from 'class-variance-authority';
import { useCallback, useEffect, useRef } from 'react';

import { Badge } from '../../badge';
import { EmptyState } from '../../empty-state';
import { Flex } from '../../flex';
import { Skeleton } from '../../skeleton';
import { Table } from '../../table';
import styles from '../data-table.module.css';
import {
  DataTableColumnDef,
  DataTableContentProps,
  GroupedData
} from '../data-table.types';
import { useDataTable } from '../hooks/useDataTable';

function Headers<TData>({
  headerGroups = [],
  className = ''
}: {
  headerGroups: HeaderGroup<TData>[];
  className?: string;
}) {
  return (
    <Table.Header className={className}>
      {headerGroups?.map(headerGroup => (
        <Table.Row key={headerGroup?.id}>
          {headerGroup?.headers?.map(header => {
            const columnDef = header.column.columnDef as DataTableColumnDef<
              TData,
              unknown
            >;
            return (
              <Table.Head
                key={header.id}
                colSpan={header.colSpan}
                className={cx(styles.head, columnDef.classNames?.header)}
                style={columnDef.styles?.header}
              >
                {flexRender(columnDef.header, header.getContext())}
              </Table.Head>
            );
          })}
        </Table.Row>
      ))}
    </Table.Header>
  );
}

interface RowsProps<TData> {
  rows: Row<TData>[];
  onRowClick?: (row: TData) => void;
  classNames?: {
    row?: string;
  };
  lastRowRef?: React.RefObject<HTMLTableRowElement | null>;
}

function LoaderRows({
  rowCount,
  columnCount
}: {
  rowCount: number;
  columnCount: number;
}) {
  const rows = Array.from({ length: rowCount });
  return rows.map((_, rowIndex) => {
    const columns = Array.from({ length: columnCount });
    return (
      <Table.Row key={'loading-row-' + rowIndex}>
        {columns.map((_, colIndex) => (
          <Table.Cell key={'loading-column-' + colIndex}>
            <Skeleton />
          </Table.Cell>
        ))}
      </Table.Row>
    );
  });
}

function GroupHeader<TData>({
  colSpan,
  data
}: {
  colSpan: number;
  data: GroupedData<TData>;
}) {
  return (
    <Table.SectionHeader colSpan={colSpan}>
      <Flex gap={3} align='center'>
        {data?.label}
        {data.showGroupCount ? (
          <Badge variant='neutral'>{data?.count}</Badge>
        ) : null}
      </Flex>
    </Table.SectionHeader>
  );
}

function Rows<TData>({
  rows = [],
  onRowClick,
  classNames,
  lastRowRef
}: RowsProps<TData>) {
  return rows.map((row, idx) => {
    const isSelected = row.getIsSelected();
    const cells = row.getVisibleCells() || [];
    const isGroupHeader = row.subRows && row.subRows.length > 0;
    const isLastRow = idx === rows.length - 1;

    if (isGroupHeader) {
      return (
        <GroupHeader
          key={row.id}
          colSpan={cells.length}
          data={row.original as GroupedData<unknown>}
        />
      );
    }

    return (
      <Table.Row
        key={row.id}
        className={cx(
          styles['row'],
          onRowClick ? styles['clickable'] : '',
          classNames?.row
        )}
        data-state={isSelected && 'selected'}
        ref={isLastRow ? lastRowRef : undefined}
        onClick={() => onRowClick?.(row.original)}
      >
        {cells.map(cell => {
          const columnDef = cell.column.columnDef as DataTableColumnDef<
            unknown,
            unknown
          >;
          return (
            <Table.Cell
              key={cell.id}
              className={cx(styles['cell'], columnDef.classNames?.cell)}
              style={columnDef.styles?.cell}
            >
              {flexRender(columnDef.cell, cell.getContext())}
            </Table.Cell>
          );
        })}
      </Table.Row>
    );
  });
}

const DefaultEmptyComponent = () => (
  <EmptyState icon={<TableIcon />} heading='No Data' />
);

export function Content({
  emptyState,
  zeroState,
  classNames = {}
}: DataTableContentProps) {
  const {
    onRowClick,
    table,
    mode,
    isLoading,
    loadMoreData,
    loadingRowCount = 3,
    tableQuery
  } = useDataTable();

  const headerGroups = table?.getHeaderGroups();
  const rowModel = table?.getRowModel();
  const { rows = [] } = rowModel || {};

  const lastRowRef = useRef<HTMLTableRowElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && !isLoading) {
        loadMoreData();
      }
    },
    [loadMoreData, isLoading]
  );

  useEffect(() => {
    if (mode !== 'server') return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(handleObserver, {
      threshold: 0.1
    });
    const lastRow = lastRowRef.current;
    if (lastRow) {
      observerRef.current.observe(lastRow);
    }

    return () => {
      if (observerRef.current && lastRow) {
        observerRef.current.unobserve(lastRow);
        observerRef.current.disconnect();
      }
    };
  }, [mode, rows.length, handleObserver]);

  const visibleColumnsLength = table.getVisibleLeafColumns().length;

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

  return (
    <div className={cx(styles.contentRoot, classNames.root)}>
      <Table className={classNames.table}>
        {hasData && (
          <Headers headerGroups={headerGroups} className={classNames.header} />
        )}
        <Table.Body className={classNames.body}>
          {hasData ? (
            <>
              <Rows
                rows={rows}
                lastRowRef={lastRowRef}
                onRowClick={onRowClick}
                classNames={{
                  row: classNames.row
                }}
              />
              {isLoading ? (
                <LoaderRows
                  rowCount={loadingRowCount}
                  columnCount={visibleColumnsLength}
                />
              ) : null}
            </>
          ) : (
            <Table.Row>
              <Table.Cell
                colSpan={visibleColumnsLength}
                className={styles.emptyStateCell}
              >
                {stateToShow}
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </div>
  );
}
