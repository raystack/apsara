/** biome-ignore-all lint/suspicious/noShadowRestrictedNames: public component name intentionally matches the package export */
'use client';

import {
  Badge,
  Button,
  DataView,
  type DataViewField,
  type DataViewListColumn,
  Dialog,
  EmptyState,
  Flex,
  IconButton,
  Navbar,
  Sidebar,
  Text,
  type TimelineActions,
  type TimelineCardContext
} from '@raystack/apsara';
import { BellIcon, FilterIcon, SidebarIcon } from '@raystack/apsara/icons';
import dayjs from 'dayjs';
import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';

type OrderStatus = 'scheduled' | 'in-progress' | 'partial' | 'completed';

type Order = {
  id: string;
  name: string;
  org: string;
  priority: number;
  status: OrderStatus;
  startDate: string;
  dueDate: string;
};

/* Dates are generated relative to today so the today-line and the
   "Due in N days" danger states are always live in the example. Pinned to
   midnight so server- and client-rendered output match (no hydration drift). */
const DAY_MS = 86_400_000;
const startOfToday = () => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now.getTime();
};
const daysFromNow = (days: number) =>
  new Date(startOfToday() + days * DAY_MS).toISOString();

/* ── Programmatic scroll domain (min/max of the timeline) ─────────────────
   The explorable window is fixed to ±6 months around today. An explicit
   `range` keeps the coordinate space stable while data streams in — the
   scrollbar never jumps as new rows load. */
const RANGE: [string, string] = [daysFromNow(-183), daysFromNow(183)];

/* How far beyond the visible window to prefetch on each scroll event. */
const PREFETCH_MS = 14 * DAY_MS;
/* Minimum spacing between range fetches while scrolling. */
const FETCH_THROTTLE_MS = 200;
/* Simulated network latency for the fake orders API. */
const API_LATENCY_MS = 500;

const ORG_LIST = [
  'Company A',
  'Company B',
  'Company C',
  'Company D',
  'Company E'
];

const NAME_POOL = [
  'Order_1',
  'Order_2',
  'Order_3',
  'Order_4',
  'Order_5',
  'Order_6',
  'Order_7',
  'Order_8',
  'Order_9'
];

/* Orders generated per month. Deliberately dense: enough cards for lane
   packing to stack several deep inside every status band, which is what makes
   the grouped swim-lane layout (and horizontal culling) worth looking at. */
const ORDERS_PER_MONTH_MIN = 18;
const ORDERS_PER_MONTH_MAX = 26;

const STATUS_LABEL: Record<OrderStatus, string> = {
  scheduled: 'Scheduled',
  'in-progress': 'In progress',
  partial: 'Partially delivered',
  completed: 'Completed'
};

/* ── Simulated orders backend ──────────────────────────────────────────────
   The full dataset is generated once up front (the "database table"), then
   `fetchOrdersApi` answers range queries against it with the interval-overlap
   predicate — the same shape a real RQL backend would run:

     start_time <= to AND end_time >= from

   i.e. a card is returned iff it has at least one visible pixel in the
   window. A containment filter (`start >= from AND end <= to`) would drop
   cards that straddle either window edge. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function ordersForMonth(monthKey: string): Order[] {
  const monthStart = dayjs(`${monthKey}-01`);
  const rng = mulberry32(monthStart.year() * 100 + monthStart.month());
  const today = startOfToday();
  const count =
    ORDERS_PER_MONTH_MIN +
    Math.floor(rng() * (ORDERS_PER_MONTH_MAX - ORDERS_PER_MONTH_MIN + 1));
  return Array.from({ length: count }, (_, i) => {
    const start = monthStart.add(Math.floor(rng() * 27), 'day');
    const due = start.add(2 + Math.floor(rng() * 16), 'day');
    let status: OrderStatus;
    if (due.valueOf() < today) {
      status = rng() < 0.75 ? 'completed' : 'partial';
    } else if (start.valueOf() > today) {
      status = 'scheduled';
    } else {
      status = rng() < 0.5 ? 'in-progress' : 'partial';
    }
    return {
      id: `${monthKey}-${i}`,
      name: NAME_POOL[Math.floor(rng() * NAME_POOL.length)],
      org: ORG_LIST[Math.floor(rng() * ORG_LIST.length)],
      priority: 1 + Math.floor(rng() * 10),
      status,
      startDate: start.toISOString(),
      dueDate: due.toISOString()
    };
  });
}

function monthKeysBetween(fromMs: number, toMs: number): string[] {
  const keys: string[] = [];
  let cursor = dayjs(fromMs).startOf('month');
  const end = dayjs(toMs);
  while (cursor.isBefore(end)) {
    keys.push(cursor.format('YYYY-MM'));
    cursor = cursor.add(1, 'month');
  }
  return keys;
}

/* The whole "table", generated once at module load. Seeded per month, so the
   data is stable across renders and reloads within a day. */
const ALL_ORDERS: Order[] = monthKeysBetween(
  Date.parse(RANGE[0]),
  Date.parse(RANGE[1])
).flatMap(ordersForMonth);

function fetchOrdersApi(fromMs: number, toMs: number): Promise<Order[]> {
  // Interval-overlap predicate: starts before the window closes AND ends
  // after it opens — catches fully-inside cards and edge-spanners alike.
  const rows = ALL_ORDERS.filter(
    order =>
      Date.parse(order.startDate) <= toMs && Date.parse(order.dueDate) >= fromMs
  ).sort((a, b) => Date.parse(a.startDate) - Date.parse(b.startDate));
  return new Promise(resolve =>
    setTimeout(() => resolve(rows), API_LATENCY_MS)
  );
}

// Renderer-agnostic metadata — drives search, filters, and the Display
// Properties toggles that the card composes via <DataView.DisplayAccess>.
const fields: DataViewField<Order>[] = [
  {
    accessorKey: 'name',
    label: 'Order',
    filterable: true,
    filterType: 'string',
    sortable: true,
    hideable: false
  },
  {
    accessorKey: 'org',
    label: 'Organization',
    filterable: true,
    filterType: 'select',
    hideable: true,
    // Groupable fields drive the Grouping control in Display settings. The
    // timeline renders one swim-lane section per group; the list view renders
    // the same groups as section headers.
    groupable: true,
    showGroupCount: true,
    filterOptions: ORG_LIST.map(org => ({ value: org, label: org }))
  },
  {
    accessorKey: 'status',
    label: 'Status',
    filterable: true,
    filterType: 'select',
    hideable: true,
    groupable: true,
    showGroupCount: true,
    // Bucket keys are the raw status values; the band shows these labels.
    groupLabelsMap: STATUS_LABEL,
    filterOptions: (Object.keys(STATUS_LABEL) as OrderStatus[]).map(status => ({
      value: status,
      label: STATUS_LABEL[status]
    }))
  },
  { accessorKey: 'priority', label: 'Priority', hideable: true },
  {
    accessorKey: 'startDate',
    label: 'Start date',
    filterable: true,
    filterType: 'date',
    sortable: true,
    hideable: true
  },
  {
    accessorKey: 'dueDate',
    label: 'Due date',
    filterable: true,
    filterType: 'date',
    sortable: true,
    hideable: true
  }
];

/* Status icons matching the Figma card anatomy: outlined circle (scheduled),
   pie (in progress), half-filled circle (partially delivered), check circle
   (completed). */
function StatusIcon({ status }: { status: OrderStatus }) {
  const accent = 'var(--rs-color-foreground-accent-primary)';
  const success = 'var(--rs-color-foreground-success-primary)';
  const shared = {
    width: 16,
    height: 16,
    viewBox: '0 0 16 16',
    'aria-label': STATUS_LABEL[status],
    role: 'img',
    style: { flexShrink: 0 }
  } as const;
  switch (status) {
    case 'completed':
      return (
        <svg {...shared}>
          <circle cx='8' cy='8' r='6.5' fill={success} />
          <path
            d='M5 8.2 7.1 10.3 11 6.2'
            stroke='white'
            strokeWidth='1.5'
            fill='none'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      );
    case 'partial':
      return (
        <svg {...shared}>
          <circle
            cx='8'
            cy='8'
            r='6'
            stroke={success}
            strokeWidth='1.5'
            fill='none'
          />
          <path d='M8 2 A6 6 0 0 1 8 14 Z' fill={success} />
        </svg>
      );
    case 'in-progress':
      return (
        <svg {...shared}>
          <circle
            cx='8'
            cy='8'
            r='6'
            stroke={accent}
            strokeWidth='1.5'
            fill='none'
          />
          <path d='M8 8 L8 3.5 A4.5 4.5 0 1 1 3.5 8 Z' fill={accent} />
        </svg>
      );
    case 'scheduled':
      return (
        <svg {...shared}>
          <circle
            cx='8'
            cy='8'
            r='6'
            stroke={accent}
            strokeWidth='1.5'
            fill='none'
          />
        </svg>
      );
  }
}

/* ── Shared order-details dialog ──────────────────────────────────────────
   One detached Dialog instance serves every card. Cards don't render their
   own <Dialog.Trigger>; clicking a card opens this instance imperatively via
   the handle, passing the clicked order as the payload. */
const orderDialog = Dialog.createHandle<Order>();

const ellipsis: React.CSSProperties = {
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
};

function formatDue(date: Date) {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

const STATUS_BADGE_VARIANT: Record<
  OrderStatus,
  'accent' | 'success' | 'warning' | 'neutral'
> = {
  scheduled: 'neutral',
  'in-progress': 'accent',
  partial: 'warning',
  completed: 'success'
};

/* Due-date urgency shared by the timeline card, the list view, and the
   details dialog. */
function dueState(order: Order) {
  const due = new Date(order.dueDate);
  const daysLeft = Math.ceil((due.getTime() - Date.now()) / DAY_MS);
  return {
    due,
    daysLeft,
    urgent: daysLeft >= 0 && daysLeft <= 5 && order.status !== 'completed'
  };
}

function DueBadge({ order }: { order: Order }) {
  const { due, daysLeft, urgent } = dueState(order);
  return (
    <Badge
      size='micro'
      variant={urgent ? 'danger' : 'neutral'}
      style={{ flexShrink: 0 }}
    >
      {urgent
        ? `Due in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`
        : `Due on ${formatDue(due)}`}
    </Badge>
  );
}

/* ── List view (table variant of DataView.List) ───────────────────────────
   Same row model, columnar presentation — switched with the view tabs in
   the Display settings popover. Columns reference the same accessorKeys as
   `fields`, so visibility toggles, filters, and sort apply to both views. */
type OrderCell = { row: { original: Order } };

const orderColumns: DataViewListColumn<Order>[] = [
  {
    accessorKey: 'name',
    width: 'minmax(220px, 1.5fr)',
    cell: ({ row }: OrderCell) => (
      <Flex align='center' gap={3} style={{ minWidth: 0 }}>
        <StatusIcon status={row.original.status} />
        <Text size='small' weight='medium' style={ellipsis}>
          {row.original.name}
        </Text>
      </Flex>
    )
  },
  {
    accessorKey: 'status',
    width: '150px',
    cell: ({ row }: OrderCell) => (
      <Badge size='micro' variant={STATUS_BADGE_VARIANT[row.original.status]}>
        {STATUS_LABEL[row.original.status]}
      </Badge>
    )
  },
  {
    accessorKey: 'priority',
    width: '90px',
    cell: ({ row }: OrderCell) => (
      <Text size='small' variant='secondary'>
        P{row.original.priority}
      </Text>
    )
  },
  {
    accessorKey: 'startDate',
    width: '120px',
    cell: ({ row }: OrderCell) => (
      <Text size='small'>{formatDue(new Date(row.original.startDate))}</Text>
    )
  },
  {
    accessorKey: 'dueDate',
    width: '150px',
    cell: ({ row }: OrderCell) => <DueBadge order={row.original} />
  },
  {
    accessorKey: 'org',
    width: 'minmax(180px, 1fr)',
    cell: ({ row }: OrderCell) => (
      <Text size='small' variant='secondary' style={ellipsis}>
        {row.original.org}
      </Text>
    )
  }
];

/* The card is entirely consumer-owned — the Timeline only positions it.
   Chrome, danger state, truncation, and the collapsed stub all live here. */
function OrderCard({
  order,
  context
}: {
  order: Order;
  context: TimelineCardContext;
}) {
  const { urgent } = dueState(order);

  // Card height is content-driven (the wrapper auto-measures, like
  // DataView.List rows) — fix it here so collapsed stubs match full cards.
  const chrome: React.CSSProperties = {
    height: 64,
    boxSizing: 'border-box',
    borderRadius: 'var(--rs-radius-3)',
    border: `1px solid ${
      urgent
        ? 'var(--rs-color-border-danger-emphasis)'
        : 'var(--rs-color-border-base-primary)'
    }`,
    background: urgent
      ? 'var(--rs-color-background-danger-primary)'
      : 'var(--rs-color-background-base-primary)',
    overflow: 'hidden'
  };

  // Narrow spans (context.collapsed) render as a compact priority stub, like
  // the tiny "P10" card in the design.
  if (context.collapsed) {
    return (
      <Flex align='center' justify='center' style={chrome}>
        <Text
          size='micro'
          weight='medium'
          variant={urgent ? 'danger' : 'secondary'}
        >
          P{order.priority}
        </Text>
      </Flex>
    );
  }

  return (
    <Flex
      direction='column'
      justify='between'
      style={{ ...chrome, padding: 'var(--rs-space-3)' }}
    >
      <Flex align='center' gap={3} style={{ minWidth: 0 }}>
        <StatusIcon status={order.status} />
        <Text size='small' weight='medium' style={{ ...ellipsis, flex: 1 }}>
          {order.name}
        </Text>
        <DataView.DisplayAccess accessorKey='priority'>
          <Text size='micro' variant='secondary'>
            P{order.priority}
          </Text>
        </DataView.DisplayAccess>
      </Flex>
      <Flex align='center' gap={3} style={{ minWidth: 0 }}>
        <DataView.DisplayAccess accessorKey='dueDate'>
          <DueBadge order={order} />
        </DataView.DisplayAccess>
        <DataView.DisplayAccess accessorKey='org'>
          <Text size='micro' variant='secondary' style={ellipsis}>
            {order.org}
          </Text>
        </DataView.DisplayAccess>
      </Flex>
    </Flex>
  );
}

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <Flex justify='between' align='center' gap={5}>
      <Text size='small' variant='secondary'>
        {label}
      </Text>
      <Text size='small' weight='medium' style={{ textAlign: 'right' }}>
        {value}
      </Text>
    </Flex>
  );
}

/* The dialog body renders from the handle's payload — the order of whichever
   card was clicked last. */
function OrderDetailsDialog() {
  return (
    <Dialog handle={orderDialog}>
      {({ payload: order }) =>
        order ? (
          <Dialog.Content style={{ maxWidth: 400 }}>
            {/* Dialog.Header is a row flex by default — stack title over
                description, and keep clear of the top-right close button. */}
            <Dialog.Header
              direction='column'
              align='start'
              gap={2}
              style={{ paddingRight: 'var(--rs-space-13)' }}
            >
              <Flex align='center' gap={3}>
                <StatusIcon status={order.status} />
                <Dialog.Title>{order.name}</Dialog.Title>
              </Flex>
              <Dialog.Description>
                {STATUS_LABEL[order.status]} · {order.org}
              </Dialog.Description>
            </Dialog.Header>
            <Dialog.Body>
              <Flex direction='column' gap={4}>
                <DetailRow label='Order ID' value={order.id} />
                <DetailRow
                  label='Status'
                  value={
                    <Badge
                      size='micro'
                      variant={STATUS_BADGE_VARIANT[order.status]}
                    >
                      {STATUS_LABEL[order.status]}
                    </Badge>
                  }
                />
                <DetailRow label='Priority' value={`P${order.priority}`} />
                <DetailRow
                  label='Start date'
                  value={formatDue(new Date(order.startDate))}
                />
                <DetailRow
                  label='Due date'
                  value={formatDue(new Date(order.dueDate))}
                />
                <DetailRow label='Organization' value={order.org} />
              </Flex>
            </Dialog.Body>
          </Dialog.Content>
        ) : null
      }
    </Dialog>
  );
}

const Page = () => {
  /* ── Range-window infinite loading ──────────────────────────────────────
     The timeline reports its visible [from, to] via onVisibleRangeChange.
     We widen that window by a prefetch pad and query the API with it. Month
     buckets exist only as client-side bookkeeping of what's already been
     requested — contiguous missing buckets coalesce into one query. Because
     the API returns everything *overlapping* the window, a card straddling a
     window edge comes back from both adjacent fetches, so merging dedupes by
     row id. */
  const [orders, setOrders] = useState<Order[]>([]);
  /* Imperative navigation handle — drives the "Today" button in the toolbar.
     Null while the timeline view is inactive (methods no-op with a warning). */
  const timelineActions = useRef<TimelineActions | null>(null);
  // Starts true: the first window is fetched on mount, and `isLoading` keeps
  // the timeline shell (axis + skeletons) rendered while it's empty.
  const [isLoading, setIsLoading] = useState(true);
  const requestedRef = useRef<Set<string>>(new Set());
  const inflightRef = useRef(0);
  const lastFetchRef = useRef(0);
  const trailingRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadWindow = useCallback((fromMs: number, toMs: number) => {
    const clampedFrom = Math.max(fromMs, Date.parse(RANGE[0]));
    const clampedTo = Math.min(toMs, Date.parse(RANGE[1]));
    if (clampedFrom >= clampedTo) return;
    const missing = monthKeysBetween(clampedFrom, clampedTo).filter(
      key => !requestedRef.current.has(key)
    );
    if (missing.length === 0) return;
    for (const key of missing) requestedRef.current.add(key);
    // Coalesce consecutive missing months into contiguous [first, last] runs
    // (jump-scrolling can leave already-fetched holes between them).
    const runs: [string, string][] = [];
    for (const key of missing) {
      const last = runs[runs.length - 1];
      if (
        last &&
        dayjs(`${last[1]}-01`).add(1, 'month').format('YYYY-MM') === key
      ) {
        last[1] = key;
      } else {
        runs.push([key, key]);
      }
    }
    inflightRef.current += runs.length;
    setIsLoading(true);
    for (const [firstKey, lastKey] of runs) {
      const runFrom = dayjs(`${firstKey}-01`).valueOf();
      const runTo = dayjs(`${lastKey}-01`).endOf('month').valueOf();
      fetchOrdersApi(runFrom, runTo)
        .then(rows => {
          setOrders(prev => {
            const seen = new Set(prev.map(order => order.id));
            const fresh = rows.filter(order => !seen.has(order.id));
            return fresh.length > 0 ? [...prev, ...fresh] : prev;
          });
        })
        .catch(error => {
          // Un-mark the failed months so scrolling back retries them —
          // otherwise a transient failure leaves a permanent hole.
          for (const key of monthKeysBetween(runFrom, runTo)) {
            requestedRef.current.delete(key);
          }
          console.error('Failed to load orders', error);
        })
        .finally(() => {
          inflightRef.current -= 1;
          if (inflightRef.current === 0) setIsLoading(false);
        });
    }
  }, []);

  // Throttled (leading + trailing), NOT debounced: a debounce would wait for
  // scrolling to stop, leaving a gap of missing cards during a long drag.
  // Throttling fetches while the scroll is still in flight, and the trailing
  // call covers the final resting position. Dedup in loadWindow keeps the
  // extra invocations free.
  const handleVisibleRangeChange = useCallback(
    ([from, to]: [Date, Date]) => {
      const fetchWindow = () => {
        lastFetchRef.current = Date.now();
        loadWindow(from.getTime() - PREFETCH_MS, to.getTime() + PREFETCH_MS);
      };
      if (trailingRef.current) clearTimeout(trailingRef.current);
      const elapsed = Date.now() - lastFetchRef.current;
      if (elapsed >= FETCH_THROTTLE_MS) {
        fetchWindow();
      } else {
        trailingRef.current = setTimeout(
          fetchWindow,
          FETCH_THROTTLE_MS - elapsed
        );
      }
    },
    [loadWindow]
  );

  // Initial fetch around today — the timeline starts centered on it, and
  // subsequent windows load through onVisibleRangeChange as the user scrolls.
  useEffect(() => {
    const today = startOfToday();
    loadWindow(today - 2 * PREFETCH_MS, today + 2 * PREFETCH_MS);
  }, [loadWindow]);

  useEffect(
    () => () => {
      if (trailingRef.current) clearTimeout(trailingRef.current);
    },
    []
  );

  return (
    <Flex
      style={{
        height: '100vh',
        backgroundColor: 'var(--rs-color-background-base-primary)',
        overflow: 'hidden'
      }}
    >
      <Sidebar defaultOpen>
        <Sidebar.Header>
          <Flex align='center' gap={3}>
            <IconButton size={4} aria-label='Logo'>
              <BellIcon width={24} height={24} />
            </IconButton>
            <Text size='regular' weight='medium'>
              Apsara
            </Text>
          </Flex>
        </Sidebar.Header>
        <Sidebar.Main>
          <Sidebar.Item
            href='/examples/timeline'
            leadingIcon={<SidebarIcon />}
            active
          >
            Timeline
          </Sidebar.Item>
        </Sidebar.Main>
        <Sidebar.Footer>
          <Sidebar.Item href='#'>Help & Support</Sidebar.Item>
          <Sidebar.Item href='#'>Preferences</Sidebar.Item>
        </Sidebar.Footer>
      </Sidebar>

      <Flex
        direction='column'
        style={{ flex: 1, overflow: 'hidden', minWidth: 0 }}
      >
        <DataView<Order>
          data={orders}
          fields={fields}
          mode='client'
          isLoading={isLoading}
          loadingRowCount={3}
          defaultSort={{ name: 'dueDate', order: 'asc' }}
          /* Opens grouped by status — one swim-lane band per status in the
             timeline, the same buckets as the list view's group headers.
             Switch it in Display settings → Grouping. */
          query={{ group_by: ['status'] }}
          getRowId={(row: Order) => row.id}
          onRowClick={order => orderDialog.openWithPayload(order)}
          views={[
            { value: 'timeline', label: 'Timeline' },
            { value: 'list', label: 'List' }
          ]}
          defaultView='timeline'
        >
          <Navbar>
            <Navbar.Start>
              <Text size='regular' weight='medium'>
                Order management · Timeline
              </Text>
            </Navbar.Start>
            <Navbar.End>
              <DataView.Search placeholder='Search orders' width={300} />
              <Button
                size='small'
                color='neutral'
                variant='outline'
                onClick={() =>
                  timelineActions.current?.scrollTo('today', {
                    align: 'center',
                    behavior: 'smooth'
                  })
                }
              >
                Today
              </Button>
              <Text size='mini' variant='secondary'>
                Orders load as you scroll · {orders.length} loaded
              </Text>
            </Navbar.End>
          </Navbar>
          <DataView.Toolbar>
            <DataView.Filters />
            <DataView.DisplayControls />
          </DataView.Toolbar>

          {/* Empty/zero states live inside the same flex-1 pane as the
              timeline: when the timeline renders null they center in the
              pane instead of being pushed below an empty spacer. */}
          <Flex
            direction='column'
            justify='center'
            style={{ flex: 1, overflow: 'hidden', minWidth: 0 }}
          >
            <DataView.Timeline<Order>
              name='timeline'
              startField='startDate'
              endField='dueDate'
              scale='day'
              unitWidth={20}
              tickInterval={2}
              gridlineInterval={2}
              range={RANGE}
              virtualized
              actionsRef={timelineActions}
              onVisibleRangeChange={handleVisibleRangeChange}
              renderCard={(row, context) => (
                <OrderCard order={row.original} context={context} />
              )}
            />
            <DataView.List
              name='list'
              variant='table'
              columns={orderColumns}
              stickyGroupHeader
            />
            <DataView.EmptyState>
              <EmptyState
                icon={<FilterIcon />}
                heading='No matching orders'
                variant='empty1'
                subHeading='Try adjusting your filters or search.'
              />
            </DataView.EmptyState>
            <DataView.ZeroState>
              <EmptyState
                icon={<FilterIcon />}
                heading='No orders yet'
                variant='empty1'
                subHeading='Orders will show up here once they are scheduled.'
              />
            </DataView.ZeroState>
          </Flex>

          <DataView.ClearFilters />
        </DataView>
      </Flex>
      <OrderDetailsDialog />
    </Flex>
  );
};

export default Page;
