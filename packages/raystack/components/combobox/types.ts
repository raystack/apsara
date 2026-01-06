import { ReactNode } from 'react';

export type ComboboxItemType = {
  leadingIcon?: ReactNode;
  children: ReactNode;
  value: string;
};
