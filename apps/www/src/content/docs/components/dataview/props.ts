import { ReactNode } from 'react';

// Documentation-only placeholders so `auto-type-table` can render the public
// API without surfacing real generics (TData is shown as `T` for readability).
type T = any;
type DataViewContext = unknown;

export interface DataViewProps {
  /** Renderer-agnostic field metadata. Drives filter/sort/group/visibility. (Required) */
  fields: DataViewField[];

  /** Table data. (Required) */
  data: Array<T>;

  /** Default sort. (Required) */
  defaultSort: DataViewSort;

  /**
   * Data processing mode.
   * @defaultValue "client"
   */
  mode?: 'client' | 'server';

  /**
   * Loading state.
   * @defaultValue false
   */
  isLoading?: boolean;

  /** Initial query state. */
  query?: DataViewQuery;

  /** Called whenever the internal query changes — only in server mode. */
  onTableQueryChange?: (query: DataViewQuery) => void;

  /** Infinite scroll callback. */
  onLoadMore?: () => Promise<void> | void;

  /** Row click handler. */
  onRowClick?: (row: T) => void;

  /** Column visibility change callback. */
  onColumnVisibilityChange?: (visibility: Record<string, boolean>) => void;

  /** Return a stable unique id for each row (used as React key). */
  getRowId?: (row: T, index: number) => string;

  /** Total rows available on server (used for the "hidden by filters" footer in server mode). */
  totalRowCount?: number;

  /**
   * Skeleton rows to render while loading.
   * @defaultValue 3
   */
  loadingRowCount?: number;

  /** Multi-view configuration. */
  views?: ViewSpec[];

  /** Default active view (uncontrolled). */
  defaultView?: string;

  /** Active view (controlled). */
  view?: string;

  /** Called when the active view changes. */
  onViewChange?: (view: string) => void;

  /**
   * Optional local resolvers for non-accessor `group_by` keys.
   * Keeps the wire format (`group_by: string[]`) unchanged.
   */
  groupByResolvers?: Record<string, (row: T) => string>;
}

export interface DataViewField {
  /** Key into the row object. */
  accessorKey: string;

  /** Human-readable label. */
  label: string;

  /** Optional icon (e.g. for grouping menu). */
  icon?: ReactNode;

  /** Allow filtering on this field. */
  filterable?: boolean;

  /** Filter input type. */
  filterType?: 'string' | 'number' | 'date' | 'select' | 'multiselect';

  /** Options when filterType is select/multiselect. */
  filterOptions?: Array<{ label: string; value: string }>;

  /** Allow sorting. */
  sortable?: boolean;

  /** Allow grouping. */
  groupable?: boolean;

  /** Allow toggling visibility. */
  hideable?: boolean;

  /** Hide this field by default. */
  defaultHidden?: boolean;

  /** Show item count next to the group header label. */
  showGroupCount?: boolean;

  /** Override group bucket labels (key → label). */
  groupLabelsMap?: Record<string, string>;
}

export interface DataViewListProps {
  /** Multi-view name. When set, the renderer gates itself on the active view. */
  name?: string;

  /**
   * Visual variant. `table` renders headers and uses `role="table"`;
   * `list` renders no headers and uses `role="list"`.
   * @defaultValue "list"
   */
  variant?: 'table' | 'list';

  /** Override the header visibility. */
  showHeaders?: boolean;

  /** Override the root ARIA role. */
  role?: 'table' | 'list';

  /** Optional view-scoped field override (full replacement). */
  fields?: DataViewField[];

  /** Column render specs. (Required) */
  columns: DataViewListColumn[];

  /**
   * Initial row-height estimate (px). Rows are auto-measured after they paint,
   * so this is only used until the first measurement. Default 40 for table,
   * 56 for list.
   */
  estimatedRowHeight?: number;

  /** When true, only viewport-visible rows render. Parent must have a fixed height. */
  virtualized?: boolean;

  /** Render dividers between rows (default true for table). */
  showDividers?: boolean;

  /** Render group section headers when grouping is active. Default true. */
  showGroupHeaders?: boolean;

  /** When true, the active group header sticks under the table header while scrolling. */
  stickyGroupHeader?: boolean;
}

export interface DataViewListColumn {
  /** Pointer into `fields[]`. */
  accessorKey: string;

  /** TanStack-style cell renderer. */
  cell?: (ctx) => ReactNode;

  /** TanStack-style header renderer. Overrides the field `label`. */
  header?: (ctx) => ReactNode;

  /**
   * CSS grid track width.
   * Examples: `'1fr'`, `'auto'`, `'200px'`, `'minmax(80px, 1fr)'`, or a number (pixels).
   * @defaultValue "1fr"
   */
  width?: string | number;
}

export interface DataViewCustomProps {
  /** Multi-view name. */
  name?: string;

  /** Optional view-scoped field override. */
  fields?: DataViewField[];

  /** Render prop. Receives the full DataView context. */
  children: (context: DataViewContext) => ReactNode;
}

export interface DataViewDisplayAccessProps {
  /** Field accessor key whose visibility gates `children`. */
  accessorKey: string;

  /** Rendered when the field is currently hidden. */
  fallback?: ReactNode;

  children: ReactNode;
}

export interface DataViewEmptyStateProps {
  /** Restrict to a specific view's `name`. */
  forView?: string;
  children: ReactNode;
}

export interface DataViewZeroStateProps {
  /** Restrict to a specific view's `name`. */
  forView?: string;
  children: ReactNode;
}

export interface DataViewDisplayControlsProps {
  /** Custom trigger element for the popover. */
  trigger?: ReactNode;
  /** Hide the multi-view switcher (shown by default when `views.length > 1`). */
  hideViewSwitcher?: boolean;
  /** Hide the Ordering (sort) control. */
  hideOrdering?: boolean;
  /** Hide the Grouping control. */
  hideGrouping?: boolean;
  /** Hide the Display Properties (column visibility) section. */
  hideDisplayProperties?: boolean;
}

export interface ViewSpec {
  /** Matches the `name` prop on a renderer. */
  value: string;
  /** Shown in the view switcher. */
  label: string;
  /** Optional icon rendered before the view's label in the switcher tab. */
  leadingIcon?: ReactNode;
}

export interface DataViewQuery {
  filters?: Array<{
    name: string;
    operator: string;
    value: unknown;
  }>;
  sort?: DataViewSort[];
  group_by?: string[];
  search?: string;
  offset?: number;
  limit?: number;
}

export interface DataViewSort {
  name: string;
  order: 'asc' | 'desc';
}
