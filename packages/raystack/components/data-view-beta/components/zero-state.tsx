'use client';

import { cx } from 'class-variance-authority';
import { ReactNode } from 'react';
import styles from '../data-view.module.css';
import { useDataView } from '../hooks/useDataView';

export interface DataViewZeroStateProps {
  /** Restrict to a specific view's `name`. When set, the ZeroState only renders if both `isZeroState` is true AND the active view matches. */
  forView?: string;
  className?: string;
  children: ReactNode;
}

/**
 * Renders its children when there is no data and no active query (the "first
 * use" state). Reads `isZeroState` from DataView context.
 */
export function DataViewZeroState({
  forView,
  className,
  children
}: DataViewZeroStateProps) {
  const { isZeroState, activeView } = useDataView();
  if (!isZeroState) return null;
  if (forView && activeView !== forView) return null;
  return (
    <div className={cx(styles.dataStateContainer, className)}>{children}</div>
  );
}

DataViewZeroState.displayName = 'DataView.ZeroState';
