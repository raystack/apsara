import { useContext } from 'react';

import { TableContext } from '../context';

/**
 * @deprecated Use `DataView` instead. DataTable is deprecated and will not
 * receive new features.
 */
export const useDataTable = () => {
  const ctx = useContext(TableContext);
  if (ctx === null) {
    throw new Error('useDataTable must be used inside of a DataTable.Provider');
  }

  return ctx;
};
