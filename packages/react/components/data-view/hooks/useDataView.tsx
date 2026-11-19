'use client';

import type { RowData } from '@tanstack/react-table';
import { useContext } from 'react';

import { DataViewContext } from '../context';
import { DataViewContextType } from '../data-view.types';

export const useDataView = <
  TData extends RowData = RowData
>(): DataViewContextType<TData> => {
  const ctx = useContext(DataViewContext);
  if (ctx === null) {
    throw new Error('useDataView must be used inside of a <DataView> provider');
  }
  return ctx as DataViewContextType<TData>;
};
