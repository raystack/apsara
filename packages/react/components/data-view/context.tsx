'use client';

import type { RowData } from '@tanstack/react-table';
import { createContext } from 'react';

import { DataViewContextType } from './data-view.types';

export const DataViewContext =
  createContext<DataViewContextType<RowData> | null>(null);
