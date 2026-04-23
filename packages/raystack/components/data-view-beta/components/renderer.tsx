'use client';

import { ReactNode } from 'react';
import { DataViewContextType } from '../data-view.types';
import { useDataView } from '../hooks/useDataView';

export interface DataViewRendererProps<TData> {
  /**
   * Render prop that receives the full DataView context (table, fields,
   * tableQuery, etc.) and returns the rendered view. Use together with
   * `<DataView.DisplayAccess>` to keep field visibility in sync with the
   * single Display Properties toggle.
   */
  children: (context: DataViewContextType<TData>) => ReactNode;
}

/**
 * Escape-hatch renderer for free-form views (cards, kanban, map, etc.).
 * Consumes the DataView context and hands it to a render prop.
 */
export function DataViewRenderer<TData>({
  children
}: DataViewRendererProps<TData>) {
  const ctx = useDataView<TData>();
  return <>{children(ctx)}</>;
}

DataViewRenderer.displayName = 'DataView.Renderer';
