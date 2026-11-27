import { ReactNode } from 'react';

export type ItemType = {
  leadingIcon?: ReactNode;
  children: ReactNode;
  value: string;
};

export type SelectOption = {
  value: string;
  label: string;
};
