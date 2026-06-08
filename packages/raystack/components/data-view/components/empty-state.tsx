'use client';

import { cx } from 'class-variance-authority';
import { ReactNode } from 'react';
import styles from '../data-view.module.css';
import { useDataView } from '../hooks/useDataView';

export interface DataViewEmptyStateProps {
  /** Restrict to a specific view's `name`. */
  forView?: string;
  className?: string;
  children: ReactNode;
}

/**
 * Renders its children when the current data + query result in an empty state
 * (a query is active but no rows match). Reads `isEmptyState` from `DataView`
 * context.
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
