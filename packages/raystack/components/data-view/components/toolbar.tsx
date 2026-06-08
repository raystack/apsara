'use client';

import { cx } from 'class-variance-authority';
import { PropsWithChildren } from 'react';
import { Flex } from '../../flex';
import styles from '../data-view.module.css';
import { useDataView } from '../hooks/useDataView';
import { DisplayControls } from './display-controls';
import { Filters } from './filters';

interface ToolbarProps {
  className?: string;
}

/**
 * Toolbar container for `DataView`. Visible whenever there is data OR an active
 * query — pure zero state keeps it hidden. Consumers compose children
 * (`<DataView.Search>`, `<DataView.Filters>`, `<DataView.DisplayControls>`,
 * custom actions); omitting children renders the default
 * `<Filters> + <DisplayControls>` pair.
 */
export function Toolbar<TData>({
  className,
  children
}: PropsWithChildren<ToolbarProps>) {
  const { shouldShowFilters } = useDataView<TData>();
  if (!shouldShowFilters) return null;

  if (children) {
    return (
      <Flex
        className={cx(styles['toolbar'], className)}
        justify='between'
        gap={3}
        align='start'
      >
        {children}
      </Flex>
    );
  }

  return (
    <Flex
      className={cx(styles['toolbar'], className)}
      justify='between'
      gap={3}
      align='start'
    >
      <Filters<TData> />
      <DisplayControls<TData> />
    </Flex>
  );
}

Toolbar.displayName = 'DataView.Toolbar';
