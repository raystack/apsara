'use client';

import { Cross2Icon, TableIcon } from '@radix-ui/react-icons';
import type { Header, Row } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';
import { cx } from 'class-variance-authority';
import { useCallback, useEffect, useMemo, useRef } from 'react';

import { Badge } from '../../badge';
import { Button } from '../../button';
import { EmptyState } from '../../empty-state';
import { Flex } from '../../flex';
import { Skeleton } from '../../skeleton';
import { Table } from '../../table';
import styles from '../data-view.module.css';
import {
  DataViewContentClassNames,
  DataViewTableColumn,
  GroupedData
} from '../data-view.types';
import { useDataView } from '../hooks/useDataView';
import {
  countLeafRows,
  getClientHiddenLeafRowCount,
  hasActiveQuery,
  hasActiveTableFiltering
} from '../utils';

export interface ContentProps<TData, TValue = unknown> {
  columns: DataViewTableColumn<TData, TValue>[];
  emptyState?: React.ReactNode;
  zeroState?: React.ReactNode;
  classNames?: DataViewContentClassNames;
  stickyGroupHeader?: boolean;
  loadingRowCount?: number;
}

interface HeadersProps<TData, TValue> {
  headers: Header<TData, TValue>[];
  columnMap: Map<string, DataViewTableColumn<TData, TValue>>;
  className?: string;
}

function Headers<TData, TValue>({
  headers,
  columnMap,
  className
}: HeadersProps<TData, TValue>) {
  return (
    <Table.Header className={className}>
      <Table.Row>
        {headers.map(header => {
          const spec = columnMap.get(header.column.id);
          const content =
            spec?.header !== undefined
              ? flexRender(spec.header, header.getContext())
              : flexRender(header.column.columnDef.header, header.getContext());
          return (
            <Table.Head
              key={header.id}
              colSpan={header.colSpan}
              className={cx(styles.head, spec?.classNames?.header)}
              style={spec?.styles?.header}
            >
              {content}
            </Table.Head>
          );
        })}
      </Table.Row>
    </Table.Header>
  );
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
  data,
  stickySectionHeader
}: {
  colSpan: number;
  data: GroupedData<TData>;
  stickySectionHeader?: boolean;
}) {
  return (
    <Table.SectionHeader
      colSpan={colSpan}
      classNames={
        stickySectionHeader ? { cell: styles.stickySectionHeader } : undefined
      }
    >
      <Flex gap={3} align='center'>
        {data?.label}
        {data.showGroupCount ? (
          <Badge variant='neutral'>{data?.count}</Badge>
        ) : null}
      </Flex>
    </Table.SectionHeader>
  );
}

interface RowsProps<TData, TValue> {
  rows: Row<TData>[];
  renderedAccessors: string[];
  columnMap: Map<string, DataViewTableColumn<TData, TValue>>;
  onRowClick?: (row: TData) => void;
  classNames?: { row?: string };
  lastRowRef?: React.RefObject<HTMLTableRowElement | null>;
  stickyGroupHeader?: boolean;
}

function Rows<TData, TValue>({
  rows,
  renderedAccessors,
  columnMap,
  onRowClick,
  classNames,
  lastRowRef,
  stickyGroupHeader = false
}: RowsProps<TData, TValue>) {
  return rows.map((row, idx) => {
    const isSelected = row.getIsSelected();
    const cells = row.getVisibleCells() || [];
    const isGroupHeader = row.subRows && row.subRows.length > 0;
    const isLastRow = idx === rows.length - 1;

    if (isGroupHeader) {
      return (
        <GroupHeader
          key={row.id}
          colSpan={renderedAccessors.length}
          data={row.original as GroupedData<unknown>}
          stickySectionHeader={stickyGroupHeader}
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
        {renderedAccessors.map(accessor => {
          const spec = columnMap.get(accessor);
          const cell = cells.find(c => c.column.id === accessor);
          if (!cell) {
            return (
              <Table.Cell
                key={accessor}
                className={cx(styles['cell'], spec?.classNames?.cell)}
                style={spec?.styles?.cell}
              />
            );
          }
          return (
            <Table.Cell
              key={cell.id}
              className={cx(styles['cell'], spec?.classNames?.cell)}
              style={spec?.styles?.cell}
            >
              {spec?.cell
                ? flexRender(spec.cell, cell.getContext())
                : ((cell.getValue() as React.ReactNode) ?? null)}
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

export function Content<TData, TValue = unknown>({
  columns,
  emptyState,
  zeroState,
  classNames = {},
  stickyGroupHeader = false,
  loadingRowCount
}: ContentProps<TData, TValue>) {
  const {
    onRowClick,
    table,
    mode,
    totalRowCount,
    isLoading,
    loadMoreData,
    loadingRowCount: ctxLoadingRowCount = 3,
    tableQuery,
    defaultSort,
    updateTableQuery
  } = useDataView<TData>();

  const effectiveLoadingRowCount = loadingRowCount ?? ctxLoadingRowCount;

  const columnMap = useMemo(() => {
    const map = new Map<string, DataViewTableColumn<TData, TValue>>();
    columns.forEach(c => map.set(c.accessorKey, c));
    return map;
  }, [columns]);

  const visibleLeafColumns = table.getVisibleLeafColumns();

  // Render order is taken from `columns` prop, filtered by TanStack visibility.
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

  const lastRowRef = useRef<HTMLTableRowElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  /* Refs keep callback stable so observer is only recreated when mode/rows.length change; */
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

  useEffect(() => {
    if (mode !== 'server') return;

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
  }, [mode, rows.length, handleObserver]);

  const visibleColumnsLength = renderedAccessors.length;

  const hasData = rows?.length > 0 || isLoading;

  const hasChanges = hasActiveQuery(tableQuery || {}, defaultSort);

  const isZeroState = !hasData && !hasChanges;
  const isEmptyState = !hasData && hasChanges;

  const stateToShow: React.ReactNode = isZeroState
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

  return (
    <div className={cx(styles.contentRoot, classNames.root)}>
      <Table className={classNames.table}>
        {hasData && (
          <Headers
            headers={headersInOrder}
            columnMap={columnMap}
            className={classNames.header}
          />
        )}
        <Table.Body className={classNames.body}>
          {hasData ? (
            <>
              <Rows
                rows={rows}
                renderedAccessors={renderedAccessors}
                columnMap={columnMap}
                lastRowRef={lastRowRef}
                onRowClick={onRowClick}
                classNames={{ row: classNames.row }}
                stickyGroupHeader={stickyGroupHeader}
              />
              {isLoading ? (
                <LoaderRows
                  rowCount={effectiveLoadingRowCount}
                  columnCount={visibleColumnsLength}
                />
              ) : null}
            </>
          ) : (
            <Table.Row>
              <Table.Cell
                colSpan={visibleColumnsLength || 1}
                className={styles.emptyStateCell}
              >
                {stateToShow}
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
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

Content.displayName = 'DataView.Content';
