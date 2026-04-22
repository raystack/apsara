'use client';

import { DataViewTableProps } from '../data-view.types';
import { Content } from './content';
import { VirtualizedContent } from './virtualized-content';

/**
 * DataView.Table — renders the current filtered/sorted/grouped rows as an
 * aligned-column table. Takes its own `columns` (DataViewTableColumn[]) that
 * install cell/header renderers keyed by field accessorKey. Metadata like
 * filterable/sortable/groupable/hideable is declared on `fields` at the root,
 * not duplicated here.
 *
 * Set `virtualized` to render rows through a virtualizer with sticky headers.
 */
export function DataViewTable<TData, TValue = unknown>({
  columns,
  virtualized = false,
  rowHeight,
  groupHeaderHeight,
  overscan,
  loadMoreOffset,
  stickyGroupHeader,
  emptyState,
  zeroState,
  classNames
}: DataViewTableProps<TData, TValue>) {
  if (virtualized) {
    return (
      <VirtualizedContent
        columns={columns}
        rowHeight={rowHeight}
        groupHeaderHeight={groupHeaderHeight}
        overscan={overscan}
        loadMoreOffset={loadMoreOffset}
        stickyGroupHeader={stickyGroupHeader}
        emptyState={emptyState}
        zeroState={zeroState}
        classNames={classNames}
      />
    );
  }
  return (
    <Content
      columns={columns}
      emptyState={emptyState}
      zeroState={zeroState}
      classNames={classNames}
      stickyGroupHeader={stickyGroupHeader}
    />
  );
}

DataViewTable.displayName = 'DataView.Table';
