'use client';

import { Cross2Icon } from '@radix-ui/react-icons';
import { cx } from 'class-variance-authority';
import { useCallback } from 'react';
import { Button } from '../../button';
import { Flex } from '../../flex';
import styles from '../data-view.module.css';
import { useDataView } from '../hooks/useDataView';
import {
  countLeafRows,
  getClientHiddenLeafRowCount,
  hasActiveTableFiltering
} from '../utils';

export interface DataViewClearFiltersProps {
  className?: string;
}

/**
 * The filter-summary row plus a "Clear Filters" action. Reads everything from
 * `DataView` context and renders nothing when there is nothing to clear.
 *
 * Flat by default (the footer `DataView.List` renders when rows are hidden by
 * filters); a bordered panel in the empty state. Shared between the List footer
 * and `DataView.ClearFilters` so the markup lives in one place.
 *
 * Internal — not exported from the package.
 */
export function FilterSummary({ className }: DataViewClearFiltersProps) {
  const {
    table,
    mode,
    isLoading,
    totalRowCount,
    isEmptyState,
    updateTableQuery
  } = useDataView();

  const rows = table?.getRowModel()?.rows ?? [];
  const hiddenLeafRowCount =
    mode === 'client'
      ? getClientHiddenLeafRowCount(table)
      : totalRowCount !== undefined
        ? Math.max(0, totalRowCount - countLeafRows(rows))
        : null;
  const hasActiveFiltering = !isLoading && hasActiveTableFiltering(table);
  const showFilterSummary =
    hasActiveFiltering &&
    (mode === 'server' ||
      (typeof hiddenLeafRowCount === 'number' && hiddenLeafRowCount > 0));

  const handleClearFilters = useCallback(() => {
    updateTableQuery(prev => ({ ...prev, filters: [], search: '' }));
  }, [updateTableQuery]);

  // Matches DataTable: render only when rows are hidden by filters.
  // `isEmptyState` controls styling (bordered panel), not visibility.
  if (!showFilterSummary) return null;

  return (
    <Flex
      className={cx(
        styles.filterSummaryFooter,
        isEmptyState && styles.filterSummaryFooterEmpty,
        className
      )}
      justify='center'
      align='center'
    >
      {mode === 'server' && hiddenLeafRowCount === null ? (
        <span className={styles.filterSummaryLabel}>
          Some items might be hidden by filters
        </span>
      ) : (
        <Flex align='center' gap={2}>
          <span className={styles.filterSummaryCount}>
            {hiddenLeafRowCount}
          </span>
          <span className={styles.filterSummaryLabel}>
            items hidden by filters
          </span>
        </Flex>
      )}
      <Button
        variant='text'
        color='neutral'
        size='small'
        trailingIcon={<Cross2Icon />}
        onClick={handleClearFilters}
      >
        Clear Filters
      </Button>
    </Flex>
  );
}

FilterSummary.displayName = 'DataView.FilterSummary';

/**
 * Surfaces the bordered "Clear Filters" panel in the empty state (a query
 * returned no rows). Place it as a sibling of `DataView.List` — separate from
 * `DataView.EmptyState`. Renders nothing outside the empty state; the flat
 * footer for the data state is rendered automatically by `DataView.List`.
 */
export function DataViewClearFilters({ className }: DataViewClearFiltersProps) {
  const { isEmptyState } = useDataView();
  if (!isEmptyState) return null;
  return <FilterSummary className={className} />;
}

DataViewClearFilters.displayName = 'DataView.ClearFilters';
