'use client';

import { ReactNode } from 'react';
import { useDataView } from '../hooks/useDataView';

export interface DataViewDisplayAccessProps {
  /** Field (column) accessor key. Gates rendering on the column's current visibility state. */
  accessorKey: string;
  children: ReactNode;
  /** Rendered when the referenced field is currently hidden. Defaults to null. */
  fallback?: ReactNode;
}

/**
 * Gates children on the current column visibility from `DataView` context. Use
 * inside `DataView.Custom` or other free-form renderers so the single
 * `DisplayControls` toggle reaches the same visibility story that `DataView.List`
 * rows get for free.
 */
export function DisplayAccess({
  accessorKey,
  children,
  fallback = null
}: DataViewDisplayAccessProps) {
  const { columnVisibility, fields } = useDataView();
  // Visibility is stored as a single global map on context per RFC. A missing
  // entry means "not toggled off"; default to visible so consumers can wrap
  // JSX in DisplayAccess without typos silently breaking the render.
  const stateVisible = columnVisibility[accessorKey];
  // A field forced `hideable: false` in the active view is always shown
  // regardless of stored state (RFC §"Unified Column Visibility").
  const field = fields.find(f => f.accessorKey === accessorKey);
  const hideable = field?.hideable ?? true;
  const isVisible = !hideable || stateVisible !== false;
  return <>{isVisible ? children : fallback}</>;
}

DisplayAccess.displayName = 'DataView.DisplayAccess';
