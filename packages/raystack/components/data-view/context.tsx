'use client';

import { createContext } from 'react';

import { DataViewContextType } from './data-view.types';

export const DataViewContext = createContext<DataViewContextType<any> | null>(
  null
);
