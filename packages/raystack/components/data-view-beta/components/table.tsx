'use client';

import { DataViewTableProps } from '../data-view.types';
import { DataViewList } from './list';

/**
 * @deprecated Prefer `<DataView.List variant="table" />`. Kept as a thin alias
 * during the multi-renderer migration.
 */
export function DataViewTable<TData, TValue = unknown>(
  props: DataViewTableProps<TData, TValue>
) {
  return <DataViewList<TData, TValue> {...props} variant='table' />;
}

DataViewTable.displayName = 'DataView.Table';
