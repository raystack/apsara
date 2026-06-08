'use client';

import { ReactNode, useEffect } from 'react';
import { DataViewContextType, DataViewField } from '../data-view.types';
import { useDataView } from '../hooks/useDataView';

export interface DataViewCustomProps<TData> {
  /** Multi-view name. When set, the renderer gates itself on the active view. */
  name?: string;
  /** Optional view-scoped field override (full replacement for this view). */
  fields?: DataViewField<TData>[];
  /**
   * Render prop receiving the full `DataView` context (table, fields, query,
   * derived empty/zero flags, etc.). Pair with `<DataView.DisplayAccess>` so
   * field visibility tracks the single Display Properties toggle.
   */
  children: (context: DataViewContextType<TData>) => ReactNode;
}

/**
 * Escape-hatch renderer for free-form views (cards, kanban, map, gallery).
 * Reads the `DataView` context and hands it to a render prop.
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
