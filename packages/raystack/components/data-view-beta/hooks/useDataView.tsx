import { useContext } from 'react';

import { DataViewContext } from '../context';
import { DataViewContextType } from '../data-view.types';

export const useDataView = <TData = any>(): DataViewContextType<TData> => {
  const ctx = useContext(DataViewContext);
  if (ctx === null) {
    throw new Error('useDataView must be used inside of a DataView.Provider');
  }

  return ctx as DataViewContextType<TData>;
};
