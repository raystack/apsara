'use client';

import { cx } from 'class-variance-authority';
import { PropsWithChildren, useEffect } from 'react';
import { useDebouncedState } from '~/hooks';
import { Flex } from '../../flex';
import styles from '../data-view.module.css';
import { useDataView } from '../hooks/useDataView';
import { useFilterSummary } from './clear-filters';
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
  const { shouldShowFilters, isLoading } = useDataView<TData>();
  const summaryText = useFilterSummary()?.text ?? '';
  const [status, setStatus] = useDebouncedState('', 500);

  useEffect(() => {
    // Keep the last text while loading so a refetch does not re-announce it.
    setStatus(previous => (isLoading ? previous : summaryText));
  }, [isLoading, summaryText, setStatus]);

  if (!shouldShowFilters) return null;

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
        {status}
      </span>
    </Flex>
  );
}

Toolbar.displayName = 'DataView.Toolbar';
