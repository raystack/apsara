import { useContext } from 'react';

import { TableContext } from '../context';
import type { TableContextType } from '../data-table.types';

/**
 * @deprecated Use `DataView` instead. DataTable is deprecated and will not
 * receive new features.
 */
export const useDataTable = <TData = unknown, TValue = unknown>() => {
  const ctx = useContext(TableContext);
  if (ctx === null) {
    throw new Error('useDataTable must be used inside of a DataTable.Provider');
  }

  return ctx as TableContextType<TData, TValue>;
};
