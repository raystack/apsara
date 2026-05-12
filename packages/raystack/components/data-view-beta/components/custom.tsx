'use client';

import { ReactNode, useEffect } from 'react';
import { DataViewContextType, DataViewField } from '../data-view.types';
import { useDataView } from '../hooks/useDataView';

export interface DataViewCustomProps<TData> {
  /** Multi-view name. When set, the renderer gates itself on the active view. */
  name?: string;
  /** Optional view-scoped field override. Full replacement of root `fields` for this view's active session. */
  fields?: DataViewField<TData>[];
  /**
   * Render prop that receives the full DataView context (table, fields,
   * tableQuery, hasData, isEmptyState, etc.) and returns the rendered view.
   * Pair with `<DataView.DisplayAccess>` to keep field visibility in sync with
   * the single Display Properties toggle.
   */
  children: (context: DataViewContextType<TData>) => ReactNode;
}

/**
 * Escape-hatch renderer for free-form views (cards, kanban, map, etc.).
 * Consumes the DataView context and hands it to a render prop.
 */
export function DataViewCustom<TData>({
  name,
  fields: fieldsOverride,
  children
}: DataViewCustomProps<TData>) {
  const ctx = useDataView<TData>();
  const { activeView, registerFieldsForView } = ctx;

  useEffect(() => {
    if (!name || !fieldsOverride) return;
    return registerFieldsForView(name, fieldsOverride);
  }, [name, fieldsOverride, registerFieldsForView]);

  const isActive = !name || activeView === undefined || activeView === name;
  if (!isActive) return null;

  return <>{children(ctx)}</>;
}

DataViewCustom.displayName = 'DataView.Custom';
