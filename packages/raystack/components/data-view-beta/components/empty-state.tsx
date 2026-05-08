'use client';

import { cx } from 'class-variance-authority';
import { ReactNode } from 'react';
import styles from '../data-view.module.css';
import { useDataView } from '../hooks/useDataView';

export interface DataViewEmptyStateProps {
  /** Restrict to a specific view's `name`. When set, the EmptyState only renders if both `isEmptyState` is true AND the active view matches. */
  forView?: string;
  className?: string;
  children: ReactNode;
}

/**
 * Renders its children when the current data + query result in an empty state
 * (i.e., a query is active but no rows match). Reads `isEmptyState` from
 * DataView context, so the empty/zero distinction is computed in one place.
 */
export function DataViewEmptyState({
  forView,
  className,
  children
}: DataViewEmptyStateProps) {
  const { isEmptyState, activeView } = useDataView();
  if (!isEmptyState) return null;
  if (forView && activeView !== forView) return null;
  return (
    <div className={cx(styles.dataStateContainer, className)}>{children}</div>
  );
}

DataViewEmptyState.displayName = 'DataView.EmptyState';
