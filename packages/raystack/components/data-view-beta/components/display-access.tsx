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
 * Gates children on the current column visibility state from DataView context.
 * Use inside free-form renderers (Timeline bars, custom renderers, cell overrides)
 * so the single DisplayControls toggle reaches the same visibility story that
 * Table/List rows get through their column specs.
 */
export function DisplayAccess({
  accessorKey,
  children,
  fallback = null
}: DataViewDisplayAccessProps) {
  const { table } = useDataView();
  const column = table?.getColumn(accessorKey);
  // If the column doesn't exist, default to visible so consumers can wrap JSX
  // in DisplayAccess without worrying about typos silently breaking the render.
  const isVisible = column ? column.getIsVisible() : true;
  return <>{isVisible ? children : fallback}</>;
}

DisplayAccess.displayName = 'DataView.DisplayAccess';
