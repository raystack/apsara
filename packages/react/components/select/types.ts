import { ReactNode } from 'react';

export type ItemType = {
  leadingIcon?: ReactNode;
  children: ReactNode;
  value: string;
};

export type SelectItems =
  | { value: string; label: ReactNode }[]
  | Record<string, ReactNode>;
