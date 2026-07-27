import { ReactNode, RefObject } from 'react';

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
  cell?: (ctx: T) => ReactNode;

  /** TanStack-style header renderer. Overrides the field `label`. */
  header?: (ctx: T) => ReactNode;

  /**
   * CSS grid track width.
   * Examples: `'1fr'`, `'auto'`, `'200px'`, `'minmax(80px, 1fr)'`, or a number (pixels).
   * @defaultValue "1fr"
   */
  width?: string | number;
}

/** Date inputs accepted by Timeline props and row fields. */
type TimelineDateInput = Date | number | string;

export interface DataViewTimelineProps {
  /** Multi-view name. When set, the renderer gates itself on the active view. */
  name?: string;

  /**
   * Accessible name of the scroll region. The pane is keyboard-focusable (arrow keys
   * scroll it natively), so screen readers announce this label on focus.
   * @defaultValue "Timeline"
   */
  'aria-label'?: string;

  /** Optional view-scoped field override (full replacement). */
  fields?: DataViewField[];

  /** Accessor key on the row yielding the start date. Rows with a missing/invalid value are skipped. (Required) */
  startField: string;

  /** Accessor key for the end date. Omitted → point markers; present → variable-width span cards. */
  endField?: string;

  /**
   * Renders the card interior. The Timeline owns positioning (x from start,
   * width from span, lane from packing, scroll); the consumer owns the card
   * visual entirely. The first argument is the TanStack `Row` wrapper — the
   * row data is on `row.original`. Keep the reference stable (`useCallback`):
   * cards are memoized against it. Compose `DataView.DisplayAccess` inside
   * for Display Properties support. (Required)
   */
  renderCard: (row: T, context: TimelineCardContext) => ReactNode;

  /**
   * Tick granularity of the time axis.
   * @defaultValue "day"
   */
  scale?: 'day' | 'week' | 'month' | 'quarter';

  /** Pixel width of one `scale` unit — density/zoom override. Defaults per scale (day 20, week 56, month 96, quarter 140). */
  unitWidth?: number;

  /**
   * Explicit time domain. Defaults to the data extent (plus today/markers) with padding.
   * A domain narrower than the container is extended at the end so the axis and gridlines fill the visible width.
   */
  range?: [TimelineDateInput, TimelineDateInput];

  /**
   * Vertical "today" line + axis badge. `true` uses the current date; a date pins it; `false` hides it.
   * @defaultValue true
   */
  today?: boolean | TimelineDateInput;

  /** Additional full-height marker lines with axis badges (milestones, deadlines). */
  markers?: TimelineMarker[];

  /**
   * Vertical gridlines at axis ticks.
   * @defaultValue true
   */
  showGridlines?: boolean;

  /** Label every Nth `scale` unit on the axis. Labels never render closer than the collision floor. Default: densest interval that fits. */
  tickInterval?: number;

  /**
   * Draw a gridline every Nth `scale` unit. Purely visual — positioning stays at full unit granularity.
   * @defaultValue 1
   */
  gridlineInterval?: number;

  /**
   * Hover crosshair snapped to the unit under the pointer, with a date badge on the axis.
   * @defaultValue true
   */
  showCursorLine?: boolean;

  // The literals are named in the description because the rendered type
  // column can't show them — TS collapses them into TimelineDateInput's
  // `string` when the union resolves. Same for scrollTo's target below.
  /**
   * Initial horizontal scroll target: a date, or one of `'today'` | `'start'` | `'end'`
   * (the domain edges).
   * @defaultValue "today"
   */
  defaultScrollTo?: TimelineDateInput | 'today' | 'start' | 'end';

  /**
   * After a filter or search change, scroll the earliest matching card into view when
   * no match is visible in the current viewport. A query change that keeps a card on
   * screen doesn't move the view.
   * @defaultValue true
   */
  scrollToResults?: boolean;

  /** Fires (rAF-throttled) with the visible time range as the user scrolls or resizes. */
  onVisibleRangeChange?: (range: [Date, Date]) => void;

  /** Receives the imperative navigation handle (`scrollTo`, `getVisibleRange`). */
  actionsRef?: RefObject<TimelineActions | null>;

  /**
   * `auto` packs non-overlapping cards into shared lanes; `one-per-row` gives every row
   * its own lane, in row-model (sorted) order. Both apply per group section while
   * `group_by` is active — cards never share a lane across sections.
   * @defaultValue "auto"
   */
  lanePacking?: 'auto' | 'one-per-row';

  /**
   * Estimated card height in px, same contract as `DataView.List`: cards render at their
   * natural content height and auto-measure after paint; the estimate seeds lane layout
   * until real heights arrive. Each lane sizes to its tallest card.
   * @defaultValue 66
   */
  estimatedRowHeight?: number;

  /**
   * Vertical gap between lanes in px.
   * @defaultValue 16
   */
  laneGap?: number;

  /**
   * Spans narrower than this (px) flip `context.collapsed` for `renderCard`.
   * @defaultValue 60
   */
  minCardWidth?: number;

  /**
   * Assumed width (px) of point-marker cards (rows without `endField`) for lane packing.
   * Set to roughly the widest point card to prevent horizontal overlap within a lane.
   * @defaultValue 120
   */
  estimatedPointWidth?: number;

  /** When true, only cards/gridlines near the visible viewport are rendered (horizontal culling). */
  virtualized?: boolean;

  /**
   * Render the group header band above each swim-lane section while `group_by`
   * is active. False hides the bands only — rows stay grouped into sections
   * (same contract as `DataViewListProps.showGroupHeaders`).
   * @defaultValue true
   */
  showGroupHeaders?: boolean;

  /** Class overrides per part: root, axis, band, tick, marker, gridline, cursor, canvas, card, groupHeader. */
  classNames?: Record<string, string>;
}

export interface TimelineCardContext {
  /** Pixel width of the time span (0 when `endField` is omitted). */
  width: number;

  /** True when the span is narrower than `minCardWidth`. */
  collapsed: boolean;

  /**
   * Lane (row) index assigned by packing. Relative to the card's own group
   * section when `group_by` is active — every section's first lane is 0.
   */
  laneIndex: number;

  /** Resolved start date. */
  start: Date;

  /** Resolved end date. Null when `endField` is omitted (point marker). */
  end: Date | null;
}

export interface TimelineMarker {
  /** Marker position. (Required) */
  date: TimelineDateInput;

  /** Badge content. Defaults to the marker date formatted as "17 Jan". */
  label?: ReactNode;

  /**
   * Badge/line color.
   * @defaultValue "default"
   */
  variant?: 'default' | 'accent' | 'danger';
}

export interface TimelineActions {
  /**
   * Scroll the viewport so the target lands at `align`. The target is a date, or
   * one of `'today'` | `'start'` | `'end'` (the domain edges) — same vocabulary as
   * `defaultScrollTo`. Edge alignments keep a small inset so the target doesn't sit
   * flush against the viewport edge (yields at the domain edges). Out-of-domain
   * dates clamp to the nearest edge; no-ops (dev warning) while the renderer is hidden.
   */
  scrollTo: (
    target: TimelineDateInput | 'today' | 'start' | 'end',
    options?: {
      /** @defaultValue "center" */
      align?: 'start' | 'center' | 'end';
      /** @defaultValue "smooth" */
      behavior?: 'auto' | 'smooth';
    }
  ) => void;

  /** The visible time window, or null while the renderer is hidden. */
  getVisibleRange: () => [Date, Date] | null;
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

export interface DataViewClearFiltersProps {
  /** Class applied to the filter-summary row. */
  className?: string;
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
