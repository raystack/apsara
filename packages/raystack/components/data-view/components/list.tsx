'use client';

import type { Header, Row } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';
import { cx } from 'class-variance-authority';
import { CSSProperties, useCallback, useEffect, useMemo, useRef } from 'react';

import { Badge } from '../../badge';
import { Skeleton } from '../../skeleton';
import styles from '../data-view.module.css';
import {
  DataViewListColumn,
  DataViewListProps,
  defaultGroupOption,
  GroupedData
} from '../data-view.types';
import { useDataView } from '../hooks/useDataView';
import { useElementHeight } from '../hooks/useElementHeight';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { useStickyGroupAnchor } from '../hooks/useStickyGroupAnchor';
import { useVirtualRows } from '../hooks/useVirtualRows';
import { FilterSummary } from './clear-filters';

function formatGridWidth(width: string | number | undefined) {
  if (width === undefined) return '1fr';
  if (typeof width === 'number') return `${width}px`;
  return width;
}

const GROUP_HEADER_HEIGHT = 36;
const DEFAULT_TABLE_ROW_HEIGHT = 40;
const DEFAULT_LIST_ROW_HEIGHT = 56;

export function DataViewList<TData, TValue = unknown>({
  name,
  variant = 'list',
  showHeaders,
  role,
  fields: fieldsOverride,
  columns,
  estimatedRowHeight,
  virtualized = false,
  showDividers,
  showGroupHeaders = true,
  stickyGroupHeader = false,
  classNames = {}
}: DataViewListProps<TData, TValue>) {
  const {
    table,
    mode,
    onRowClick,
    isLoading,
    loadingRowCount = 3,
    loadMoreData,
    tableQuery,
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
  // view. When unset (single-renderer mode), always render.
  const isActive = !name || activeView === undefined || activeView === name;

  const isTableVariant = variant === 'table';
  const headersVisible = showHeaders ?? isTableVariant;
  const ariaRole = role ?? (isTableVariant ? 'table' : 'list');
  const dividers = showDividers ?? isTableVariant;
  const effectiveRowHeight =
    estimatedRowHeight ??
    (isTableVariant ? DEFAULT_TABLE_ROW_HEIGHT : DEFAULT_LIST_ROW_HEIGHT);

  const visibleLeafColumns = table.getVisibleLeafColumns();

  const columnMap = useMemo(() => {
    const map = new Map<string, DataViewListColumn<TData, TValue>>();
    columns.forEach(c => map.set(c.accessorKey, c));
    return map;
  }, [columns]);

  // Render order from `columns`. TanStack-managed accessors (those declared in
  // root `fields`) gate on the current visibility map. Accessors with no
  // matching field are "unmanaged" display columns (selection, row actions,
  // drag handles, …) — render unconditionally.
  const allLeafIds = useMemo(
    () => new Set(table.getAllLeafColumns().map(c => c.id)),
    [table, visibleLeafColumns]
  );
  const renderedAccessors = useMemo(() => {
    const visibleSet = new Set(visibleLeafColumns.map(c => c.id));
    return columns
      .map(c => c.accessorKey)
      .filter(k => !allLeafIds.has(k) || visibleSet.has(k));
  }, [columns, visibleLeafColumns, allLeafIds]);

  const gridTemplateColumns = useMemo(() => {
    if (renderedAccessors.length === 0) return '1fr';
    return renderedAccessors
      .map(accessor => formatGridWidth(columnMap.get(accessor)?.width))
      .join(' ');
  }, [renderedAccessors, columnMap]);

  const headerGroups = table?.getHeaderGroups() ?? [];
  const lastHeaderGroup = headerGroups[headerGroups.length - 1];
  const headerByAccessor = useMemo(() => {
    const map = new Map<string, Header<TData, TValue>>();
    lastHeaderGroup?.headers.forEach(h => map.set(h.column.id, h));
    return map;
  }, [lastHeaderGroup]);

  const rowModel = table?.getRowModel();
  const { rows = [] } = rowModel || {};

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  // Measure the column-header row so sticky group elements sit directly under it.
  const [headerMeasureRef, headerHeight] = useElementHeight();

  // Group offsets — needed for sticky group anchor under virtualization.
  const group_by = tableQuery?.group_by?.[0];
  const isGrouped = Boolean(group_by) && group_by !== defaultGroupOption.id;

  const groupHeaderList = useMemo(() => {
    const list: {
      index: number;
      start: number;
      data: GroupedData<TData>;
    }[] = [];
    let offset = 0;
    rows.forEach((row, i) => {
      const isGroupHeader = row.subRows && row.subRows.length > 0;
      if (isGroupHeader) {
        list.push({
          index: i,
          start: offset,
          data: row.original as GroupedData<TData>
        });
      }
      offset += isGroupHeader ? GROUP_HEADER_HEIGHT : effectiveRowHeight;
    });
    return list;
  }, [rows, effectiveRowHeight]);

  const { totalSize, items, measureRef } = useVirtualRows({
    enabled: virtualized,
    rows,
    scrollRef,
    estimatedRowHeight: effectiveRowHeight,
    estimateSize: row => {
      const isGroupHeader = row?.subRows && row.subRows.length > 0;
      return isGroupHeader ? GROUP_HEADER_HEIGHT : effectiveRowHeight;
    }
  });

  // Sticky group anchor (virtualized + grouped + opt-in).
  const {
    stickyGroup,
    stickyGroupIndex,
    recompute: recomputeStickyGroup
  } = useStickyGroupAnchor<TData>({
    enabled: virtualized && stickyGroupHeader && isGrouped,
    groupHeaderList,
    scrollContainerRef: scrollRef
  });

  // Single sentinel-based load-more for both virtualized and non-virtualized.
  useInfiniteScroll({
    enabled: isActive && mode === 'server' && Boolean(loadMoreData),
    sentinelRef,
    scrollRef,
    isLoading,
    onLoadMore: loadMoreData
  });

  // Sticky group anchor needs to recompute on scroll only. rAF-throttled so
  // the binary search runs at most once per frame regardless of how fast the
  // scroll events fire (mousewheel can dispatch dozens per frame on macOS).
  const rafIdRef = useRef<number | null>(null);
  const handleScroll = useCallback(() => {
    if (!(virtualized && stickyGroupHeader && isGrouped)) return;
    if (rafIdRef.current !== null) return;
    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = null;
      recomputeStickyGroup();
    });
  }, [virtualized, stickyGroupHeader, isGrouped, recomputeStickyGroup]);

  useEffect(
    () => () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    },
    []
  );

  if (!isActive) return null;
  // Render nothing when there's truly no data and no loading — sibling
  // `<DataView.EmptyState>` / `<DataView.ZeroState>` handle messaging.
  if (!hasData) return null;

  const renderHeaderRow = () => {
    if (!headersVisible) return null;
    return (
      <div
        ref={headerMeasureRef}
        role={ariaRole === 'table' ? 'rowgroup' : undefined}
        className={cx(styles.listHeader, classNames.header)}
      >
        <div
          role={ariaRole === 'table' ? 'row' : undefined}
          className={styles.listHeaderRow}
        >
          {renderedAccessors.map(accessor => {
            const spec = columnMap.get(accessor);
            const header = headerByAccessor.get(accessor);
            let content: React.ReactNode = null;
            if (header) {
              const source =
                spec?.header !== undefined
                  ? spec.header
                  : header.column.columnDef.header;
              content = flexRender(source, header.getContext());
            } else if (spec?.header !== undefined) {
              // Unmanaged column (e.g. selection): no TanStack header — render
              // the spec's header with a minimal context.
              content =
                typeof spec.header === 'function'
                  ? (
                      spec.header as (ctx: {
                        table: typeof table;
                      }) => React.ReactNode
                    )({ table })
                  : (spec.header as React.ReactNode);
            }
            return (
              <div
                role={ariaRole === 'table' ? 'columnheader' : undefined}
                key={accessor}
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
      let content: React.ReactNode = null;
      if (cell) {
        content = spec?.cell
          ? flexRender(spec.cell, cell.getContext())
          : ((cell.getValue() as React.ReactNode) ?? null);
      } else if (spec?.cell !== undefined) {
        // Unmanaged column (e.g. selection): no TanStack cell — render the
        // spec's cell with a synthetic context covering the common reads.
        content =
          typeof spec.cell === 'function'
            ? (
                spec.cell as (ctx: {
                  row: Row<TData>;
                  table: typeof table;
                }) => React.ReactNode
              )({ row, table })
            : (spec.cell as React.ReactNode);
      }
      return (
        <div
          role={ariaRole === 'table' ? 'cell' : undefined}
          key={cell?.id ?? accessor}
          className={cx(
            styles.listCell,
            spec?.classNames?.cell,
            classNames.cell
          )}
          style={spec?.styles?.cell}
        >
          {content}
        </div>
      );
    });

  type RowVisualProps = {
    style?: CSSProperties;
    key?: string;
    /** Virtualizer measure ref (auto-measurement). */
    measure?: (el: HTMLElement | null) => void;
    /** TanStack index, set so the virtualizer can reconcile measurements. */
    dataIndex?: number;
    /** When true, swap subgrid styles for inline grid-template-columns. */
    isVirtual?: boolean;
    hidden?: boolean;
  };

  const renderGroupHeader = (row: Row<TData>, props: RowVisualProps = {}) => {
    const { style, key, measure, dataIndex, isVirtual, hidden } = props;
    const data = row.original as GroupedData<unknown>;
    const isStickyInFlow = !virtualized && stickyGroupHeader;
    const composedStyle: CSSProperties = {
      ...style,
      ...(isStickyInFlow ? { top: headerHeight } : null),
      ...(hidden ? { visibility: 'hidden' } : null)
    };
    return (
      <div
        key={key ?? row.id}
        ref={measure}
        data-index={dataIndex}
        className={cx(
          isVirtual ? styles.listGroupHeaderVirtual : styles.listGroupHeader,
          isStickyInFlow && styles.listGroupHeaderSticky,
          classNames.groupHeader
        )}
        style={composedStyle}
        aria-hidden={hidden || undefined}
      >
        {data?.label}
        {data?.showGroupCount ? (
          <Badge variant='neutral'>{data?.count}</Badge>
        ) : null}
      </div>
    );
  };

  const renderDataRow = (row: Row<TData>, props: RowVisualProps = {}) => {
    const { style, key, measure, dataIndex, isVirtual } = props;
    const composedStyle: CSSProperties = isVirtual
      ? { ...style, gridTemplateColumns }
      : (style ?? {});
    return (
      <div
        role={ariaRole === 'table' ? 'row' : 'listitem'}
        key={key ?? row.id}
        ref={measure}
        data-index={dataIndex}
        className={cx(
          isVirtual ? styles.listRowVirtual : styles.listRow,
          dividers && styles.listRowDivider,
          onRowClick && styles.clickable,
          classNames.row
        )}
        style={composedStyle}
        onClick={() => onRowClick?.(row.original)}
      >
        {renderRowCells(row)}
      </div>
    );
  };

  const renderLoaderRows = () => {
    if (!isLoading) return null;
    const count = Math.max(1, loadingRowCount);
    return Array.from({ length: count }, (_, i) => (
      <div
        key={`__loader-${i}`}
        role={ariaRole === 'table' ? 'row' : 'listitem'}
        className={cx(styles.listLoaderRow, dividers && styles.listRowDivider)}
        aria-busy='true'
        style={{ minHeight: effectiveRowHeight }}
      >
        {renderedAccessors.map(accessor => {
          const spec = columnMap.get(accessor);
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
            >
              <Skeleton containerClassName={styles.skeletonFill} />
            </div>
          );
        })}
      </div>
    ));
  };

  const renderVirtualBody = () => (
    <div
      role={ariaRole === 'table' ? 'rowgroup' : undefined}
      className={styles.listBodyVirtual}
      style={{ height: totalSize }}
    >
      {stickyGroup && stickyGroupHeader ? (
        <div
          aria-hidden='true'
          className={cx(styles.listGroupAnchor, classNames.groupHeader)}
          style={{ top: headerHeight }}
        >
          {stickyGroup.label}
          {stickyGroup.showGroupCount ? (
            <Badge variant='neutral'>{stickyGroup.count}</Badge>
          ) : null}
        </div>
      ) : null}
      {items.map(item => {
        const row = rows[item.index];
        if (!row) return null;
        const isGroupHeader = row.subRows && row.subRows.length > 0;
        const positionStyle: CSSProperties = {
          transform: `translateY(${item.start}px)`
        };
        if (isGroupHeader) {
          if (!showGroupHeaders) return null;
          const hidden = stickyGroupIndex === item.index;
          return renderGroupHeader(row, {
            style: positionStyle,
            key: row.id + '-' + item.index,
            measure: measureRef,
            dataIndex: item.index,
            isVirtual: true,
            hidden
          });
        }
        return renderDataRow(row, {
          style: positionStyle,
          key: row.id + '-' + item.index,
          measure: measureRef,
          dataIndex: item.index,
          isVirtual: true
        });
      })}
    </div>
  );

  const renderFlatBody = () => (
    <div
      role={ariaRole === 'table' ? 'rowgroup' : undefined}
      className={styles.listBody}
    >
      {rows.map(row => {
        const isGroupHeader = row.subRows && row.subRows.length > 0;
        if (isGroupHeader) {
          return showGroupHeaders ? renderGroupHeader(row) : null;
        }
        return renderDataRow(row);
      })}
    </div>
  );

  return (
    <div
      ref={scrollRef}
      className={cx(styles.listRoot, classNames.root)}
      onScroll={handleScroll}
    >
      <div
        role={ariaRole}
        className={styles.listGrid}
        style={{ gridTemplateColumns }}
      >
        {renderHeaderRow()}
        {virtualized ? renderVirtualBody() : renderFlatBody()}
        {renderLoaderRows()}
        {/* Sentinel — triggers onLoadMore via IntersectionObserver in server mode. */}
        <div
          ref={sentinelRef}
          className={styles.listSentinel}
          aria-hidden='true'
        />
      </div>
      <FilterSummary />
    </div>
  );
}

DataViewList.displayName = 'DataView.List';
