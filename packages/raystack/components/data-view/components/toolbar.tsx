'use client';

import { cx } from 'class-variance-authority';
import { PropsWithChildren } from 'react';
import { Flex } from '../../flex';
import styles from '../data-view.module.css';
import { useDataView } from '../hooks/useDataView';
import { countLeafRows, hasActiveTableFiltering } from '../utils';
import { DisplayControls } from './display-controls';
import { Filters } from './filters';

interface ToolbarProps {
  className?: string;
}

/**
 * Toolbar container for `DataView`. Visible whenever there is data OR an active
 * query, and pure zero state keeps it hidden. Consumers compose children
 * (`<DataView.Search>`, `<DataView.Filters>`, `<DataView.DisplayControls>`,
 * custom actions); omitting children renders the default
 * `<Filters> + <DisplayControls>` pair.
 */
export function Toolbar<TData>({
  className,
  children
}: PropsWithChildren<ToolbarProps>) {
  const { shouldShowFilters, table, isLoading } = useDataView<TData>();
  if (!shouldShowFilters) return null;

  const resultCount =
    !isLoading && hasActiveTableFiltering(table)
      ? countLeafRows(table.getFilteredRowModel().rows)
      : null;

  return (
    <Flex
      className={cx(styles['toolbar'], className)}
      justify='between'
      gap={3}
      align='start'
      data-slot='data-view-toolbar'
    >
      {children || (
        <>
          <Filters<TData> />
          <DisplayControls<TData> />
        </>
      )}
      <span
        role='status'
        className={styles['sr-only']}
        data-slot='data-view-toolbar-status'
      >
        {resultCount === null
          ? ''
          : `${resultCount} ${resultCount === 1 ? 'result' : 'results'}`}
      </span>
    </Flex>
  );
}

Toolbar.displayName = 'DataView.Toolbar';
