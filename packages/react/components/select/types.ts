import { ReactNode } from 'react';

export type SelectItems =
  | { value: string; label: ReactNode }[]
  | Record<string, ReactNode>;
