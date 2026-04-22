'use client';

import { cx } from 'class-variance-authority';
import { PropsWithChildren } from 'react';
import { Flex } from '../../flex';
import styles from '../data-view.module.css';
import { useDataView } from '../hooks/useDataView';
import { DisplaySettings } from './display-settings';
import { Filters } from './filters';

interface ToolbarProps {
  className?: string;
}

export function Toolbar<TData>({
  className,
  children
}: PropsWithChildren<ToolbarProps>) {
  const { shouldShowFilters = false } = useDataView<TData>();

  if (!shouldShowFilters) {
    return null;
  }

  // If children are provided, render them so consumers can compose Search / Filters / DisplayControls.
  if (children) {
    return (
      <Flex
        className={cx(styles['toolbar'], className)}
        justify='between'
        align='center'
      >
        {children}
      </Flex>
    );
  }

  return (
    <Flex
      className={cx(styles['toolbar'], className)}
      justify='between'
      align='center'
    >
      <Filters<TData> />
      <DisplaySettings<TData> />
    </Flex>
  );
}

Toolbar.displayName = 'DataView.Toolbar';
