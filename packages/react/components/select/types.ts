import { ReactNode } from 'react';

export type ItemType = {
  leadingIcon?: ReactNode;
  children: ReactNode;
  value: string;
};
