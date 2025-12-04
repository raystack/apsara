'use client';

import { cx } from 'class-variance-authority';
import { Flex } from '../../flex';
import styles from '../data-table.module.css';
import { useDataTable } from '../hooks/useDataTable';
import { DisplaySettings } from './display-settings';
import { Filters } from './filters';

export function Toolbar<TData, TValue>({ className }: { className?: string }) {
  const { data, isLoading, tableQuery, error } = useDataTable();

  // Check if we have filters with actual values (not empty)
  const hasFilters =
    tableQuery?.filters &&
    tableQuery.filters.length > 0 &&
    tableQuery.filters.some(
      filter => filter.value !== '' && filter.value != null
    );
  const hasSearch = tableQuery?.search && tableQuery.search.trim() !== '';

  // Zero state: no data fetched, not loading, no filters/search applied, no error
  const isZeroState =
    data.length === 0 && !isLoading && !hasFilters && !hasSearch && !error;

  // Hide toolbar in zero state (no data to filter) or error state
  if (isZeroState || error) {
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
