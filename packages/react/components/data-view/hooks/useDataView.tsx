'use client';

import { useContext } from 'react';

import { DataViewContext } from '../context';
import { DataViewContextType } from '../data-view.types';

export const useDataView = <TData = unknown>(): DataViewContextType<TData> => {
  const ctx = useContext(DataViewContext);
  if (ctx === null) {
    throw new Error('useDataView must be used inside of a <DataView> provider');
  }
  return ctx as DataViewContextType<TData>;
};
