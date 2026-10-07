'use client';

import { createContext } from 'react';

import { TableContextType } from './data-table.types';

export const TableContext = createContext<TableContextType<
  unknown,
  unknown
> | null>(null);
