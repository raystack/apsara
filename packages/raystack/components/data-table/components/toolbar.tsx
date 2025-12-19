'use client';

import { cx } from 'class-variance-authority';
import { Flex } from '../../flex';
import styles from '../data-table.module.css';
import { useDataTable } from '../hooks/useDataTable';
import { DisplaySettings } from './display-settings';
import { Filters } from './filters';

export function Toolbar<TData, TValue>({ className }: { className?: string }) {
  const { shouldShowFilters = false } = useDataTable();

  if (!shouldShowFilters) {
    return null;
  }

  return (
    <Flex
      className={cx(styles['toolbar'], className)}
      justify='between'
      align='center'
    >
      <Filters<TData, TValue> />
      <DisplaySettings />
    </Flex>
  );
}
