import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import dayjs from 'dayjs';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

// biome-ignore lint/suspicious/noShadowRestrictedNames: legitimate export name
import { DataView } from '../data-view';
import type {
  DataViewField,
  DataViewQuery,
  DataViewTimelineProps,
  InternalFilter,
  TimelineActions
} from '../data-view.types';
import { useDataView } from '../hooks/useDataView';
import { packLanes } from '../utils/pack-lanes';
import { buildAxis, createTimeScale, toTimestamp } from '../utils/time-scale';

beforeAll(() => {
  // jsdom doesn't implement ResizeObserver — the timeline observes its scroll
  // container when viewport tracking is enabled.
  // biome-ignore lint/suspicious/noExplicitAny: jsdom lacks ResizeObserver
  (global as any).ResizeObserver =
    // biome-ignore lint/suspicious/noExplicitAny: jsdom lacks ResizeObserver
    (global as any).ResizeObserver ||
    vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn()
    }));
});

afterEach(() => {
  vi.restoreAllMocks();
});

/* ─────────────────────────── utils: packLanes ────────────────────────── */

describe('packLanes', () => {
  it('returns no lanes for empty input', () => {
    expect(packLanes([])).toEqual({ lanes: [], laneCount: 0 });
  });

  it('packs non-overlapping items into the same lane', () => {
    const { lanes, laneCount } = packLanes([
      { x: 0, width: 100 },
      { x: 120, width: 50 }
    ]);
    expect(lanes).toEqual([0, 0]);
    expect(laneCount).toBe(1);
  });

  it('opens a new lane for overlapping items', () => {
    const { lanes, laneCount } = packLanes([
      { x: 0, width: 100 },
      { x: 50, width: 100 }
    ]);
    expect(lanes).toEqual([0, 1]);
    expect(laneCount).toBe(2);
  });

  it('respects the gap: items closer than gapPx do not share a lane', () => {
    // First ends at 100; second starts at 104 < 100 + 8 → new lane.
    const tight = packLanes([
      { x: 0, width: 100 },
      { x: 104, width: 50 }
    ]);
    expect(tight.lanes).toEqual([0, 1]);
    // Exactly at the gap boundary → same lane.
    const exact = packLanes([
      { x: 0, width: 100 },
      { x: 108, width: 50 }
    ]);
    expect(exact.lanes).toEqual([0, 0]);
  });

  it('assigns lanes by ascending x regardless of input order', () => {
    const { lanes, laneCount } = packLanes([
      { x: 220, width: 60 }, // fits after the first item
      { x: 0, width: 100 },
      { x: 50, width: 100 } // overlaps the first → lane 1
    ]);
    expect(lanes).toEqual([0, 0, 1]);
    expect(laneCount).toBe(2);
  });
});

/* ─────────────────────────── utils: time scale ───────────────────────── */

describe('toTimestamp', () => {
  it('accepts Date, epoch ms, and parseable strings', () => {
    const date = new Date('2025-01-05T00:00:00');
    expect(toTimestamp(date)).toBe(date.getTime());
    expect(toTimestamp(1736035200000)).toBe(1736035200000);
    expect(toTimestamp('2025-01-05')).toBe(dayjs('2025-01-05').valueOf());
  });

  it('returns null for missing or invalid values', () => {
    expect(toTimestamp(null)).toBeNull();
    expect(toTimestamp(undefined)).toBeNull();
    expect(toTimestamp('not-a-date')).toBeNull();
    expect(toTimestamp(new Date('invalid'))).toBeNull();
    expect(toTimestamp(Number.NaN)).toBeNull();
    expect(toTimestamp({})).toBeNull();
  });
});

describe('createTimeScale', () => {
  it('snaps the domain to unit boundaries with padding', () => {
    const ts = createTimeScale({
      minTime: dayjs('2025-01-05T10:30:00').valueOf(),
      maxTime: dayjs('2025-01-20T18:00:00').valueOf(),
      scale: 'day',
      unitWidth: 20,
      padUnits: 2
    });
    expect(ts.t0).toBe(dayjs('2025-01-03').startOf('day').valueOf());
    // startOf(max) + (pad + 1) days.
    expect(ts.t1).toBe(dayjs('2025-01-23').startOf('day').valueOf());
  });

  it('extends the domain end to reach minWidth, in whole units', () => {
    // Jan 1 → Feb 1 = 31 days × 20px = 620px; filling to 1000px needs 50 days.
    const ts = createTimeScale({
      minTime: dayjs('2025-01-01').valueOf(),
      maxTime: dayjs('2025-01-31').valueOf(),
      scale: 'day',
      unitWidth: 20,
      padUnits: 0,
      minWidth: 1000
    });
    expect(ts.t0).toBe(dayjs('2025-01-01').valueOf());
    expect(ts.t1).toBe(dayjs('2025-02-20').valueOf());
    expect(ts.totalWidth).toBe(1000);
  });

  it('never shrinks a domain already wider than minWidth', () => {
    const ts = createTimeScale({
      minTime: dayjs('2025-01-01').valueOf(),
      maxTime: dayjs('2025-01-31').valueOf(),
      scale: 'day',
      unitWidth: 20,
      padUnits: 0,
      minWidth: 100
    });
    expect(ts.t1).toBe(dayjs('2025-02-01').valueOf());
    expect(ts.totalWidth).toBe(620);
  });

  it('reaches minWidth on calendar scales with uneven unit lengths', () => {
    // Months render at (actual ms × pxPerMs), not exactly unitWidth — the
    // fill must land at or past minWidth despite short months.
    const ts = createTimeScale({
      minTime: dayjs('2025-01-15').valueOf(),
      maxTime: dayjs('2025-02-15').valueOf(),
      scale: 'month',
      unitWidth: 96,
      padUnits: 0,
      minWidth: 500
    });
    expect(ts.totalWidth).toBeGreaterThanOrEqual(500);
    // Still snapped to a month boundary.
    expect(dayjs(ts.t1).date()).toBe(1);
  });

  it('maps time to px linearly and inverts with timeAt', () => {
    const ts = createTimeScale({
      minTime: dayjs('2025-01-01').valueOf(),
      maxTime: dayjs('2025-01-31').valueOf(),
      scale: 'day',
      unitWidth: 20,
      padUnits: 0
    });
    expect(ts.x(ts.t0)).toBe(0);
    expect(ts.x(dayjs('2025-01-05').valueOf())).toBe(80);
    const time = dayjs('2025-01-11').valueOf();
    expect(ts.timeAt(ts.x(time))).toBe(time);
    // Domain = Jan 1 → Feb 1 = 31 days.
    expect(ts.totalWidth).toBe(31 * 20);
  });

  it('clamps a zero or negative unitWidth to 1px instead of hanging', () => {
    // 0 → pxPerMs 0 (NaN geometry); negative → inverted scale whose
    // viewport-fill loop never terminates. Both clamp to a 1px unit.
    const zero = createTimeScale({
      minTime: dayjs('2025-01-01').valueOf(),
      maxTime: dayjs('2025-01-31').valueOf(),
      scale: 'day',
      unitWidth: 0,
      padUnits: 0,
      minWidth: 500
    });
    expect(Number.isFinite(zero.totalWidth)).toBe(true);
    expect(zero.totalWidth).toBeGreaterThanOrEqual(500);
    const negative = createTimeScale({
      minTime: dayjs('2025-01-01').valueOf(),
      maxTime: dayjs('2025-01-31').valueOf(),
      scale: 'day',
      unitWidth: -20,
      padUnits: 0,
      minWidth: 500
    });
    expect(negative.pxPerMs).toBeGreaterThan(0);
    expect(Number.isFinite(negative.totalWidth)).toBe(true);
    expect(negative.totalWidth).toBeGreaterThanOrEqual(500);
  });
});

describe('buildAxis', () => {
  const januaryScale = createTimeScale({
    minTime: dayjs('2025-01-01').valueOf(),
    maxTime: dayjs('2025-01-31').valueOf(),
    scale: 'day',
    unitWidth: 20,
    padUnits: 0
  });

  it('emits one tick per unit across the domain', () => {
    const { ticks } = buildAxis(januaryScale, 'day', 20);
    // Jan 1 … Feb 1 inclusive.
    expect(ticks).toHaveLength(32);
    expect(ticks[0].label).toBe('1');
    expect(ticks[0].x).toBe(0);
    expect(ticks[4].x).toBe(80);
  });

  it('thins tick labels below the minimum label spacing', () => {
    // 20px per tick < 28px minimum → every 2nd label.
    const thinned = buildAxis(januaryScale, 'day', 20).ticks;
    expect(thinned[0].showLabel).toBe(true);
    expect(thinned[1].showLabel).toBe(false);
    expect(thinned[2].showLabel).toBe(true);
    // 40px per tick → all labels show.
    const roomy = buildAxis(
      createTimeScale({
        minTime: dayjs('2025-01-01').valueOf(),
        maxTime: dayjs('2025-01-31').valueOf(),
        scale: 'day',
        unitWidth: 40,
        padUnits: 0
      }),
      'day',
      40
    ).ticks;
    expect(roomy.every(t => t.showLabel)).toBe(true);
  });

  it('labels every Nth unit when labelEvery is passed', () => {
    const roomyScale = createTimeScale({
      minTime: dayjs('2025-01-01').valueOf(),
      maxTime: dayjs('2025-01-31').valueOf(),
      scale: 'day',
      unitWidth: 40,
      padUnits: 0
    });
    // 40px fits every label; the override thins to every 2nd anyway.
    const { ticks } = buildAxis(roomyScale, 'day', 40, 2);
    expect(ticks.map(t => t.showLabel).slice(0, 4)).toEqual([
      true,
      false,
      true,
      false
    ]);
    expect(ticks[0].index).toBe(0);
    expect(ticks[3].index).toBe(3);
  });

  it('collision floor wins over a too-dense labelEvery', () => {
    // 10px per tick → auto floor is every 3rd; asking for every 2nd degrades.
    const dense = createTimeScale({
      minTime: dayjs('2025-01-01').valueOf(),
      maxTime: dayjs('2025-01-31').valueOf(),
      scale: 'day',
      unitWidth: 10,
      padUnits: 0
    });
    const { ticks } = buildAxis(dense, 'day', 10, 2);
    expect(ticks[0].showLabel).toBe(true);
    expect(ticks[1].showLabel).toBe(false);
    expect(ticks[2].showLabel).toBe(false);
    expect(ticks[3].showLabel).toBe(true);
  });

  it('emits month bands over day ticks, with the year on the first band', () => {
    const wide = createTimeScale({
      minTime: dayjs('2025-01-10').valueOf(),
      maxTime: dayjs('2025-02-20').valueOf(),
      scale: 'day',
      unitWidth: 20,
      padUnits: 0
    });
    const { bands } = buildAxis(wide, 'day', 20);
    expect(bands.map(b => b.label)).toEqual(['Jan 2025', 'Feb']);
  });

  it('emits year bands over month ticks', () => {
    const yearly = createTimeScale({
      minTime: dayjs('2024-11-01').valueOf(),
      maxTime: dayjs('2025-03-01').valueOf(),
      scale: 'month',
      unitWidth: 96,
      padUnits: 0
    });
    const { bands, ticks } = buildAxis(yearly, 'month', 96);
    expect(bands.map(b => b.label)).toEqual(['2024', '2025']);
    expect(ticks[0].label).toBe('Nov');
  });

  it('builds quarter ticks and year bands (hand-rolled, non-dayjs path)', () => {
    // Quarter snapping/stepping is hand-rolled (dayjs has no quarter unit
    // without a plugin): startOfUnit subtracts month % 3, addUnits steps by
    // 3 months, and tick labels derive Q1–Q4 from the month index.
    const quarterly = createTimeScale({
      minTime: dayjs('2024-11-15').valueOf(),
      maxTime: dayjs('2025-05-10').valueOf(),
      scale: 'quarter',
      unitWidth: 140,
      padUnits: 0
    });
    // Nov 15 snaps back to Q4's start; May 10 is in Q2, +1 unit → Jul 1.
    expect(dayjs(quarterly.t0).format('YYYY-MM-DD')).toBe('2024-10-01');
    expect(dayjs(quarterly.t1).format('YYYY-MM-DD')).toBe('2025-07-01');
    const { ticks, bands } = buildAxis(quarterly, 'quarter', 140);
    expect(ticks.map(t => t.label)).toEqual(['Q4', 'Q1', 'Q2', 'Q3']);
    expect(ticks[0].x).toBe(0);
    expect(bands.map(b => b.label)).toEqual(['2024', '2025']);
  });

  it('builds week ticks snapped to week starts, with month bands', () => {
    const weekly = createTimeScale({
      minTime: dayjs('2025-01-05').valueOf(), // a Sunday (dayjs week start)
      maxTime: dayjs('2025-01-20').valueOf(),
      scale: 'week',
      unitWidth: 56,
      padUnits: 0
    });
    const { ticks, bands } = buildAxis(weekly, 'week', 56);
    expect(ticks.map(t => t.label)).toEqual(['5', '12', '19', '26']);
    expect(bands.map(b => b.label)).toEqual(['Jan 2025']);
  });
});

/* ─────────────────────────── renderer ────────────────────────── */

type Order = {
  id: string;
  title: string;
  start: string | null;
  end: string | null;
  team?: string;
};

const fields: DataViewField<Order>[] = [
  { accessorKey: 'title', label: 'Title', sortable: true }
];

// x at unitWidth 20 over a Jan 2025 domain: Jan 5 → 80px, Jan 12 → 220px, …
const orders: Order[] = [
  { id: 'o1', title: 'Alpha', start: '2025-01-05', end: '2025-01-10' },
  { id: 'o2', title: 'Beta', start: '2025-01-12', end: '2025-01-15' },
  { id: 'o3', title: 'Gamma', start: '2025-01-06', end: '2025-01-09' }
];

/** Applies a filter through the same context path as the Filters toolbar. */
function ApplyFilterButton({ filters }: { filters: InternalFilter[] }) {
  const { updateTableQuery } = useDataView();
  return (
    <button
      type='button'
      data-testid='apply-filter'
      onClick={() => updateTableQuery(prev => ({ ...prev, filters }))}
    >
      apply
    </button>
  );
}

function renderTimeline(
  props: Partial<DataViewTimelineProps<Order>> = {},
  data: Order[] = orders,
  root: {
    fields?: DataViewField<Order>[];
    sort?: { name: string; order: 'asc' | 'desc' };
    query?: DataViewQuery;
  } = {}
) {
  return render(
    <DataView<Order>
      data={data}
      fields={root.fields ?? fields}
      mode='client'
      defaultSort={root.sort ?? { name: 'title', order: 'asc' }}
      query={root.query}
      getRowId={(row: Order) => row.id}
    >
      <DataView.Timeline<Order>
        startField='start'
        endField='end'
        range={['2025-01-01', '2025-01-31']}
        scale='day'
        unitWidth={20}
        today={false}
        defaultScrollTo='start'
        renderCard={(row, context) => (
          <div
            data-testid={`card-${row.original.id}`}
            data-collapsed={String(context.collapsed)}
            data-lane={context.laneIndex}
            data-point={String(context.end === null)}
          >
            {row.original.title}
          </div>
        )}
        {...props}
      />
    </DataView>
  );
}

describe('DataView.Timeline', () => {
  it('positions cards from the time scale (left = start, width = span)', () => {
    renderTimeline();
    const wrapper = screen.getByTestId('card-o1').parentElement!;
    // Jan 5 = 4 days after Jan 1 → 4 × 20px; Jan 5 → Jan 10 = 5 days → 100px.
    expect(wrapper.style.left).toBe('80px');
    expect(wrapper.style.width).toBe('100px');
    expect(wrapper).toHaveAttribute('role', 'listitem');
  });

  it('packs overlapping cards into separate lanes and reuses free lanes', () => {
    renderTimeline();
    // o1 [80..180] and o3 [100..180] overlap → different lanes.
    expect(screen.getByTestId('card-o1').dataset.lane).toBe('0');
    expect(screen.getByTestId('card-o3').dataset.lane).toBe('1');
    // o2 starts at 220 ≥ o1's end + gap → back onto lane 0.
    expect(screen.getByTestId('card-o2').dataset.lane).toBe('0');
  });

  it('exposes the scroll region as a focusable, labelled region', () => {
    renderTimeline();
    const region = screen.getByRole('region', { name: 'Timeline' });
    // Focusable so keyboard users can scroll the pane with arrow keys —
    // drag-to-pan is pointer-only.
    expect(region.tabIndex).toBe(0);
  });

  it('lets the consumer override the region label via aria-label', () => {
    renderTimeline({ 'aria-label': 'Order schedule' });
    expect(
      screen.getByRole('region', { name: 'Order schedule' })
    ).toBeInTheDocument();
  });

  it('stacks lanes from estimatedRowHeight while cards are unmeasured', () => {
    renderTimeline();
    // jsdom reports offsetHeight 0 → the estimate (66) drives lane tops:
    // lane 0 at laneGap 16, lane 1 at 16 + 66 + 16.
    expect(screen.getByTestId('card-o1').parentElement!.style.top).toBe('16px');
    expect(screen.getByTestId('card-o3').parentElement!.style.top).toBe('98px');
    // Height is content-driven — the wrapper never hard-sizes the card.
    expect(screen.getByTestId('card-o1').parentElement!.style.height).toBe('');
  });

  it('re-stacks lanes to the tallest measured card height', () => {
    // Cards auto-measure after paint (List semantics). Simulate layout by
    // reporting 90px for card wrappers.
    const spy = vi
      .spyOn(HTMLElement.prototype, 'offsetHeight', 'get')
      .mockImplementation(function (this: HTMLElement) {
        return this.getAttribute('role') === 'listitem' ? 90 : 0;
      });
    renderTimeline();
    // Lane 0 measured at 90px → lane 1 starts at 16 + 90 + 16.
    expect(screen.getByTestId('card-o1').parentElement!.style.top).toBe('16px');
    expect(screen.getByTestId('card-o3').parentElement!.style.top).toBe(
      '122px'
    );
    spy.mockRestore();
  });

  it('gives every row its own lane with lanePacking="one-per-row"', () => {
    renderTimeline({ lanePacking: 'one-per-row' });
    const lanes = ['o1', 'o2', 'o3'].map(
      id => screen.getByTestId(`card-${id}`).dataset.lane
    );
    expect(new Set(lanes).size).toBe(3);
  });

  it('flags spans narrower than minCardWidth as collapsed', () => {
    renderTimeline(undefined, [
      { id: 'wide', title: 'Wide', start: '2025-01-05', end: '2025-01-10' },
      { id: 'tiny', title: 'Tiny', start: '2025-01-12', end: '2025-01-14' }
    ]);
    // 5 days × 20px = 100px ≥ 60 → not collapsed.
    expect(screen.getByTestId('card-wide').dataset.collapsed).toBe('false');
    // 2 days × 20px = 40px < 60 → collapsed.
    expect(screen.getByTestId('card-tiny').dataset.collapsed).toBe('true');
  });

  it('renders point markers with intrinsic width when endField is omitted', () => {
    renderTimeline({ endField: undefined }, [
      { id: 'p1', title: 'Point', start: '2025-01-05', end: null }
    ]);
    const card = screen.getByTestId('card-p1');
    expect(card.dataset.point).toBe('true');
    expect(card.parentElement!.style.width).toBe('');
    expect(card.parentElement!.style.left).toBe('80px');
  });

  it('culls rows entirely outside an explicit range, keeps overlapping ones', () => {
    renderTimeline(undefined, [
      { id: 'in', title: 'Inside', start: '2025-01-05', end: '2025-01-10' },
      // Crosses the range end (Jan 31) → kept, clipped visually by the canvas.
      { id: 'edge', title: 'Edge', start: '2025-01-30', end: '2025-02-05' },
      // Entirely past the range end → dropped (no lane, no card).
      { id: 'after', title: 'After', start: '2025-02-10', end: '2025-02-15' },
      // Entirely before the range start → dropped.
      { id: 'before', title: 'Before', start: '2024-12-01', end: '2024-12-20' }
    ]);
    expect(screen.getByTestId('card-in')).toBeInTheDocument();
    expect(screen.getByTestId('card-edge')).toBeInTheDocument();
    expect(screen.queryByTestId('card-after')).not.toBeInTheDocument();
    expect(screen.queryByTestId('card-before')).not.toBeInTheDocument();
  });

  it('skips rows with a missing start value and warns in dev', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    renderTimeline(undefined, [
      { id: 'ok', title: 'Ok', start: '2025-01-05', end: '2025-01-10' },
      { id: 'bad', title: 'Bad', start: null, end: '2025-01-10' }
    ]);
    expect(screen.getByTestId('card-ok')).toBeInTheDocument();
    expect(screen.queryByTestId('card-bad')).toBeNull();
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('Skipped 1 row(s)')
    );
  });

  it('renders the today line badge and custom markers on the axis', () => {
    renderTimeline({
      today: '2025-01-17',
      markers: [
        { date: '2025-01-25' },
        { date: '2025-01-28', label: 'Launch', variant: 'danger' }
      ]
    });
    expect(screen.getByText('17 Jan')).toBeInTheDocument();
    expect(screen.getByText('25 Jan')).toBeInTheDocument();
    expect(screen.getByText('Launch')).toBeInTheDocument();
  });

  it('renders axis bands and tick labels', () => {
    renderTimeline();
    expect(screen.getByText('Jan 2025')).toBeInTheDocument();
    // unitWidth 20 thins labels to every other day (odd days from Jan 1).
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('fires onRowClick with the row data when a card is clicked', async () => {
    const onRowClick = vi.fn();
    const user = userEvent.setup();
    render(
      <DataView<Order>
        data={orders}
        fields={fields}
        mode='client'
        defaultSort={{ name: 'title', order: 'asc' }}
        getRowId={(row: Order) => row.id}
        onRowClick={onRowClick}
      >
        <DataView.Timeline<Order>
          startField='start'
          endField='end'
          range={['2025-01-01', '2025-01-31']}
          today={false}
          defaultScrollTo='start'
          renderCard={row => (
            <div data-testid={`card-${row.original.id}`}>
              {row.original.title}
            </div>
          )}
        />
      </DataView>
    );
    await user.click(screen.getByTestId('card-o1'));
    expect(onRowClick).toHaveBeenCalledWith(orders[0]);
  });

  it('gates itself on the active view when `name` is set', () => {
    const views = [
      { value: 'gantt', label: 'Timeline' },
      { value: 'other', label: 'Other' }
    ];
    const { unmount } = render(
      <DataView<Order>
        data={orders}
        fields={fields}
        mode='client'
        defaultSort={{ name: 'title', order: 'asc' }}
        views={views}
        defaultView='other'
      >
        <DataView.Timeline<Order>
          name='gantt'
          startField='start'
          endField='end'
          today={false}
          renderCard={row => <div data-testid={`card-${row.original.id}`} />}
        />
      </DataView>
    );
    expect(screen.queryByTestId('card-o1')).toBeNull();
    unmount();

    render(
      <DataView<Order>
        data={orders}
        fields={fields}
        mode='client'
        defaultSort={{ name: 'title', order: 'asc' }}
        views={views}
        defaultView='gantt'
      >
        <DataView.Timeline<Order>
          name='gantt'
          startField='start'
          endField='end'
          today={false}
          renderCard={row => <div data-testid={`card-${row.original.id}`} />}
        />
      </DataView>
    );
    expect(screen.getByTestId('card-o1')).toBeInTheDocument();
  });

  it('thins gridlines with gridlineInterval while the cursor snaps to every unit', async () => {
    const { container } = renderTimeline({
      gridlineInterval: 2,
      classNames: { gridline: 'test-gridline' }
    });
    // 32 ticks (Jan 1 … Feb 1); every 2nd from the domain start → 16 lines.
    expect(container.getElementsByClassName('test-gridline')).toHaveLength(16);

    // Jan 6 (index 5) has no gridline, but the hover cursor still snaps to it.
    const root = container.firstElementChild as HTMLElement;
    await act(async () => {
      fireEvent.mouseMove(root, { clientX: 100 });
      await new Promise(resolve => setTimeout(resolve, 30));
    });
    expect(screen.getByText('6 Jan')).toBeInTheDocument();
  });

  it('extends the domain so the grid fills a container wider than the data span', () => {
    // jsdom's clientWidth is 0 by default — pretend the scroll container is
    // 1000px wide. The explicit range renders 620px, so the domain end
    // extends Feb 1 → Feb 20 and ticks run Jan 1 … Feb 20 = 51 gridlines.
    vi.spyOn(Element.prototype, 'clientWidth', 'get').mockReturnValue(1000);
    const { container } = renderTimeline({
      classNames: { gridline: 'test-gridline' }
    });
    expect(container.getElementsByClassName('test-gridline')).toHaveLength(51);
    const canvas = container.querySelector('[role="list"]') as HTMLElement;
    expect(canvas.style.width).toBe('1000px');
  });

  it('renders nothing when there is no data and not loading', () => {
    const { container } = renderTimeline(undefined, []);
    expect(container.querySelector('[role="list"]')).toBeNull();
  });

  it('shows a cursor line snapped to the hovered sub-interval with a date badge', async () => {
    const { container } = renderTimeline();
    const root = container.firstElementChild as HTMLElement;
    // jsdom rects are all-zero and scrollLeft is 0, so canvasX = clientX.
    // x=100 at 20px/day from Jan 1 → snapped to Jan 6.
    await act(async () => {
      fireEvent.mouseMove(root, { clientX: 100 });
      await new Promise(resolve => setTimeout(resolve, 30)); // flush rAF
    });
    expect(screen.getByText('6 Jan')).toBeInTheDocument();

    await act(async () => {
      fireEvent.mouseLeave(root);
      await new Promise(resolve => setTimeout(resolve, 30));
    });
    expect(screen.queryByText('6 Jan')).toBeNull();
  });

  it('does not track the cursor when showCursorLine is false', async () => {
    const { container } = renderTimeline({ showCursorLine: false });
    const root = container.firstElementChild as HTMLElement;
    await act(async () => {
      fireEvent.mouseMove(root, { clientX: 100 });
      await new Promise(resolve => setTimeout(resolve, 30));
    });
    expect(screen.queryByText('6 Jan')).toBeNull();
  });

  it('pans both axes when the background is dragged', async () => {
    const { container } = renderTimeline();
    const root = container.firstElementChild as HTMLElement;
    fireEvent.pointerDown(root, {
      pointerType: 'mouse',
      button: 0,
      pointerId: 1,
      clientX: 300,
      clientY: 100
    });
    // Pointer moves 50px left / 20px up → content scrolls 50px right / 20px down.
    fireEvent.pointerMove(root, { pointerId: 1, clientX: 250, clientY: 80 });
    expect(root.scrollLeft).toBe(50);
    expect(root.scrollTop).toBe(20);
    expect(root.dataset.dragging).toBe('true');

    // Hold still past the stale window, then release — no glide.
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });
    fireEvent.pointerUp(root, { pointerId: 1 });
    expect(root.dataset.dragging).toBeUndefined();
    // Released — further movement no longer pans.
    fireEvent.pointerMove(root, { pointerId: 1, clientX: 100, clientY: 0 });
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 50));
    });
    expect(root.scrollLeft).toBe(50);
  });

  it('glides with momentum after a fling release', async () => {
    const { container } = renderTimeline();
    const root = container.firstElementChild as HTMLElement;
    fireEvent.pointerDown(root, {
      pointerType: 'mouse',
      button: 0,
      pointerId: 1,
      clientX: 300,
      clientY: 100
    });
    fireEvent.pointerMove(root, { pointerId: 1, clientX: 250, clientY: 100 });
    // Release mid-motion — the pan keeps scrolling and decays.
    fireEvent.pointerUp(root, { pointerId: 1 });
    expect(root.scrollLeft).toBe(50);
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });
    const glided = root.scrollLeft;
    expect(glided).toBeGreaterThan(50);

    // Wheel input cancels the glide.
    fireEvent.wheel(root);
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 50));
    });
    expect(root.scrollLeft).toBe(glided);
  });

  it('does not start a pan from a card or from touch pointers', () => {
    const { container } = renderTimeline();
    const root = container.firstElementChild as HTMLElement;
    // Press on a card (row-click territory) — no pan.
    fireEvent.pointerDown(screen.getByTestId('card-o1'), {
      pointerType: 'mouse',
      button: 0,
      pointerId: 1,
      clientX: 300,
      clientY: 100
    });
    fireEvent.pointerMove(root, { pointerId: 1, clientX: 200, clientY: 100 });
    expect(root.scrollLeft).toBe(0);

    // Touch pans natively — the drag handler must not hijack it.
    fireEvent.pointerDown(root, {
      pointerType: 'touch',
      button: 0,
      pointerId: 2,
      clientX: 300,
      clientY: 100
    });
    fireEvent.pointerMove(root, { pointerId: 2, clientX: 200, clientY: 100 });
    expect(root.scrollLeft).toBe(0);
  });

  it('keeps the left-edge time anchored when the domain is extended', async () => {
    const { container, rerender } = render(
      <DataView<Order>
        data={orders}
        fields={fields}
        mode='client'
        defaultSort={{ name: 'title', order: 'asc' }}
        getRowId={(row: Order) => row.id}
      >
        <DataView.Timeline<Order>
          startField='start'
          endField='end'
          range={['2025-01-01', '2025-01-31']}
          scale='day'
          unitWidth={20}
          today={false}
          defaultScrollTo='start'
          renderCard={row => <div>{row.original.title}</div>}
        />
      </DataView>
    );
    const root = container.firstElementChild as HTMLElement;
    // Viewport's left edge sits at Jan 11 (200px / 20px-per-day from Jan 1).
    root.scrollLeft = 200;

    // Extend the range a month to the left — t0 moves to Dec 1.
    rerender(
      <DataView<Order>
        data={orders}
        fields={fields}
        mode='client'
        defaultSort={{ name: 'title', order: 'asc' }}
        getRowId={(row: Order) => row.id}
      >
        <DataView.Timeline<Order>
          startField='start'
          endField='end'
          range={['2024-12-01', '2025-01-31']}
          scale='day'
          unitWidth={20}
          today={false}
          defaultScrollTo='start'
          renderCard={row => <div>{row.original.title}</div>}
        />
      </DataView>
    );
    // Dec 1 → Jan 11 = 41 days × 20px: the same time stays at the left edge.
    expect(root.scrollLeft).toBe(820);
  });

  it('fires onVisibleRangeChange with the visible time window', async () => {
    const onVisibleRangeChange = vi.fn();
    renderTimeline({ onVisibleRangeChange });
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    expect(onVisibleRangeChange).toHaveBeenCalled();
    const calls = onVisibleRangeChange.mock.calls;
    const [from, to] = calls[calls.length - 1][0];
    expect(from).toBeInstanceOf(Date);
    expect(to).toBeInstanceOf(Date);
    // jsdom viewport is 0-wide at scrollLeft 0 → both edges sit at t0 (Jan 1).
    expect(from.getTime()).toBe(dayjs('2025-01-01').valueOf());
  });

  it('does not re-fire onVisibleRangeChange when the window is unchanged', async () => {
    const onVisibleRangeChange = vi.fn();
    // Fresh `markers` array each render → domain/timeScale identity churn
    // without any change to the actual window.
    const makeUI = () => (
      <DataView<Order>
        data={orders}
        fields={fields}
        mode='client'
        defaultSort={{ name: 'title', order: 'asc' }}
        getRowId={(row: Order) => row.id}
      >
        <DataView.Timeline<Order>
          startField='start'
          endField='end'
          range={['2025-01-01', '2025-01-31']}
          scale='day'
          unitWidth={20}
          today={false}
          defaultScrollTo='start'
          markers={[{ date: '2025-01-20' }]}
          onVisibleRangeChange={onVisibleRangeChange}
          renderCard={row => <div>{row.original.title}</div>}
        />
      </DataView>
    );
    const { container, rerender } = render(makeUI());
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    const callsAfterMount = onVisibleRangeChange.mock.calls.length;
    expect(callsAfterMount).toBeGreaterThan(0);

    rerender(makeUI());
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    expect(onVisibleRangeChange.mock.calls.length).toBe(callsAfterMount);

    // An actual scroll still fires with the new window.
    const root = container.firstElementChild as HTMLElement;
    root.scrollLeft = 100;
    await act(async () => {
      fireEvent.scroll(root);
      await new Promise(resolve => setTimeout(resolve, 30)); // flush rAF
    });
    expect(onVisibleRangeChange.mock.calls.length).toBe(callsAfterMount + 1);
    const calls = onVisibleRangeChange.mock.calls;
    const [from] = calls[calls.length - 1][0];
    expect(from.getTime()).toBe(dayjs('2025-01-06').valueOf());

    // Sub-pixel drift (scroll anchoring's float round-trip, device-pixel
    // quantization of scrollLeft) is noise, not a scroll — no re-fire.
    root.scrollLeft = 100.4;
    await act(async () => {
      fireEvent.scroll(root);
      await new Promise(resolve => setTimeout(resolve, 30)); // flush rAF
    });
    expect(onVisibleRangeChange.mock.calls.length).toBe(callsAfterMount + 1);

    // A whole-pixel move is a real scroll again.
    root.scrollLeft = 101;
    await act(async () => {
      fireEvent.scroll(root);
      await new Promise(resolve => setTimeout(resolve, 30)); // flush rAF
    });
    expect(onVisibleRangeChange.mock.calls.length).toBe(callsAfterMount + 2);
  });

  it('scrolls the earliest match into view when a filter leaves the viewport empty', () => {
    const { container } = render(
      <DataView<Order>
        data={orders}
        fields={fields}
        mode='client'
        defaultSort={{ name: 'title', order: 'asc' }}
        getRowId={(row: Order) => row.id}
      >
        <DataView.Timeline<Order>
          startField='start'
          endField='end'
          range={['2025-01-01', '2025-01-31']}
          scale='day'
          unitWidth={20}
          today={false}
          defaultScrollTo='start'
          renderCard={row => <div>{row.original.title}</div>}
        />
        <ApplyFilterButton
          filters={[{ name: 'title', operator: 'eq', value: 'Beta' }]}
        />
      </DataView>
    );
    const root = container.firstElementChild as HTMLElement;
    // Parked far past every card (jsdom viewport is 0-wide).
    root.scrollLeft = 500;
    fireEvent.click(screen.getByTestId('apply-filter'));
    // Beta = Jan 12 → 11 days × 20px = 220, landing 24px (the edge inset)
    // inside the viewport's left edge.
    expect(root.scrollLeft).toBe(196);
  });

  it('does not move the view when a filter match is already visible', () => {
    const { container } = render(
      <DataView<Order>
        data={orders}
        fields={fields}
        mode='client'
        defaultSort={{ name: 'title', order: 'asc' }}
        getRowId={(row: Order) => row.id}
      >
        <DataView.Timeline<Order>
          startField='start'
          endField='end'
          range={['2025-01-01', '2025-01-31']}
          scale='day'
          unitWidth={20}
          today={false}
          defaultScrollTo='start'
          renderCard={row => <div>{row.original.title}</div>}
        />
        <ApplyFilterButton
          filters={[{ name: 'title', operator: 'eq', value: 'Alpha' }]}
        />
      </DataView>
    );
    const root = container.firstElementChild as HTMLElement;
    // Alpha spans x 80–180; a viewport at 100 already shows it.
    root.scrollLeft = 100;
    fireEvent.click(screen.getByTestId('apply-filter'));
    expect(root.scrollLeft).toBe(100);
  });

  it('keeps the scroll position on filter change when scrollToResults is false', () => {
    const { container } = render(
      <DataView<Order>
        data={orders}
        fields={fields}
        mode='client'
        defaultSort={{ name: 'title', order: 'asc' }}
        getRowId={(row: Order) => row.id}
      >
        <DataView.Timeline<Order>
          startField='start'
          endField='end'
          range={['2025-01-01', '2025-01-31']}
          scale='day'
          unitWidth={20}
          today={false}
          defaultScrollTo='start'
          scrollToResults={false}
          renderCard={row => <div>{row.original.title}</div>}
        />
        <ApplyFilterButton
          filters={[{ name: 'title', operator: 'eq', value: 'Beta' }]}
        />
      </DataView>
    );
    const root = container.firstElementChild as HTMLElement;
    root.scrollLeft = 500;
    fireEvent.click(screen.getByTestId('apply-filter'));
    expect(root.scrollLeft).toBe(500);
  });

  it('restores the scroll position when a gated view is re-activated', () => {
    const views = [
      { value: 'gantt', label: 'Timeline' },
      { value: 'other', label: 'Other' }
    ];
    const makeUI = (view: string) => (
      <DataView<Order>
        data={orders}
        fields={fields}
        mode='client'
        defaultSort={{ name: 'title', order: 'asc' }}
        getRowId={(row: Order) => row.id}
        views={views}
        view={view}
      >
        <DataView.Timeline<Order>
          name='gantt'
          startField='start'
          endField='end'
          range={['2025-01-01', '2025-01-31']}
          scale='day'
          unitWidth={20}
          today={false}
          defaultScrollTo='start'
          renderCard={row => <div data-testid={`card-${row.original.id}`} />}
        />
      </DataView>
    );
    const { container, rerender } = render(makeUI('gantt'));
    const root = container.firstElementChild as HTMLElement;
    // User scrolls to Jan 11 (200px), then switches away and back.
    root.scrollLeft = 200;
    fireEvent.scroll(root);
    rerender(makeUI('other'));
    expect(screen.queryByTestId('card-o1')).toBeNull();

    rerender(makeUI('gantt'));
    // The DOM is recreated at scroll 0 — the stashed position must come back
    // instead of stranding the user at the domain start.
    const newRoot = container.firstElementChild as HTMLElement;
    expect(screen.getByTestId('card-o1')).toBeInTheDocument();
    expect(newRoot.scrollLeft).toBe(200);
  });

  it('packs point markers using estimatedPointWidth', () => {
    const points: Order[] = [
      { id: 'p1', title: 'P1', start: '2025-01-05', end: null }, // x = 80
      { id: 'p2', title: 'P2', start: '2025-01-08', end: null } // x = 140
    ];
    // Default estimate (120px): p1 occupies [80, 200] → p2 at 140 overlaps
    // → separate lanes, even though the old 24px floor would have packed them.
    renderTimeline({ endField: undefined }, points);
    expect(screen.getByTestId('card-p1').dataset.lane).not.toBe(
      screen.getByTestId('card-p2').dataset.lane
    );
  });

  it('shares a lane when estimatedPointWidth says the points fit', () => {
    const points: Order[] = [
      { id: 'p1', title: 'P1', start: '2025-01-05', end: null },
      { id: 'p2', title: 'P2', start: '2025-01-08', end: null }
    ];
    // 40px estimate + 8px lane gap ≤ 60px separation → same lane.
    renderTimeline({ endField: undefined, estimatedPointWidth: 40 }, points);
    expect(screen.getByTestId('card-p1').dataset.lane).toBe(
      screen.getByTestId('card-p2').dataset.lane
    );
  });

  it('culls cards outside the overscanned viewport when virtualized', () => {
    // jsdom viewport: left 0, width 0 → overscan 400 → cull window [-400, 400].
    renderTimeline({ virtualized: true }, [
      { id: 'near', title: 'Near', start: '2025-01-05', end: '2025-01-10' }, // x = 80
      { id: 'far', title: 'Far', start: '2025-01-27', end: '2025-01-30' } // x = 520
    ]);
    expect(screen.getByTestId('card-near')).toBeInTheDocument();
    expect(screen.queryByTestId('card-far')).toBeNull();
  });

  it('does not re-render cards on hover-cursor updates (memoized wrapper)', async () => {
    const renderSpy = vi.fn();
    const { container } = renderTimeline({
      renderCard: row => {
        renderSpy(row.original.id);
        return (
          <div data-testid={`card-${row.original.id}`}>
            {row.original.title}
          </div>
        );
      }
    });
    const callsAfterMount = renderSpy.mock.calls.length;
    const root = container.firstElementChild as HTMLElement;
    await act(async () => {
      fireEvent.mouseMove(root, { clientX: 100 });
      await new Promise(resolve => setTimeout(resolve, 30));
    });
    // The cursor badge proves a root re-render happened…
    expect(screen.getByText('6 Jan')).toBeInTheDocument();
    // …but no card interior re-rendered.
    expect(renderSpy.mock.calls.length).toBe(callsAfterMount);
  });
});

/* ───────────────────────────── ordering contract ─────────────────────────
   Sort can't move a card horizontally (x is locked to time), so it only shows
   up where vertical order is free: `lanePacking="one-per-row"`. `auto` packing
   stays purely chronological — these two tests are the regression guard. */

describe('DataView.Timeline ordering', () => {
  const laneOf = (id: string) =>
    screen.getByTestId(`card-${id}`).dataset.lane as string;
  const topOf = (id: string) =>
    screen.getByTestId(`card-${id}`).parentElement!.style.top;

  it('follows the active sort with lanePacking="one-per-row"', () => {
    // Titles Alpha (o1), Beta (o2), Gamma (o3) → descending puts Gamma first.
    const { unmount } = renderTimeline({ lanePacking: 'one-per-row' }, orders, {
      sort: { name: 'title', order: 'desc' }
    });
    expect([laneOf('o3'), laneOf('o2'), laneOf('o1')]).toEqual(['0', '1', '2']);
    unmount();

    renderTimeline({ lanePacking: 'one-per-row' }, orders, {
      sort: { name: 'title', order: 'asc' }
    });
    expect([laneOf('o1'), laneOf('o2'), laneOf('o3')]).toEqual(['0', '1', '2']);
  });

  it('leaves the packed layout untouched when the sort changes', () => {
    const { unmount } = renderTimeline(undefined, orders, {
      sort: { name: 'title', order: 'asc' }
    });
    const ascending = ['o1', 'o2', 'o3'].map(id => [laneOf(id), topOf(id)]);
    unmount();

    renderTimeline(undefined, orders, {
      sort: { name: 'title', order: 'desc' }
    });
    const descending = ['o1', 'o2', 'o3'].map(id => [laneOf(id), topOf(id)]);
    expect(descending).toEqual(ascending);
  });
});

/* ────────────────────────── grouping (swim lanes) ───────────────────────
   Grouped geometry over the same Jan 2025 domain. Cards are unmeasured in
   jsdom, so every lane is estimatedRowHeight (66) tall with laneGap 16 and a
   38px band (List's group-header box) per section:

     Eng     band  0 →  38 | lane 0 top  54 | lane 1 top 136 | section ends 218
     Design  band 218 → 256 | lane 0 top 272                 | canvas ends 354 */

const groupedFields: DataViewField<Order>[] = [
  { accessorKey: 'title', label: 'Title', sortable: true },
  { accessorKey: 'team', label: 'Team', groupable: true, showGroupCount: true }
];

const groupedOrders: Order[] = [
  // Eng: a1 [80..180] and a2 [100..180] overlap → two lanes.
  {
    id: 'a1',
    title: 'A1',
    team: 'Eng',
    start: '2025-01-05',
    end: '2025-01-10'
  },
  {
    id: 'a2',
    title: 'A2',
    team: 'Eng',
    start: '2025-01-06',
    end: '2025-01-09'
  },
  // Design: b1 sits at the same x as a1 but packs in its own section → lane 0.
  {
    id: 'b1',
    title: 'B1',
    team: 'Design',
    start: '2025-01-05',
    end: '2025-01-10'
  }
];

function renderGrouped(
  props: Partial<DataViewTimelineProps<Order>> = {},
  data: Order[] = groupedOrders
) {
  return renderTimeline(
    { classNames: { groupHeader: 'band' }, ...props },
    data,
    {
      fields: groupedFields,
      query: { group_by: ['team'] }
    }
  );
}

const bands = (container: HTMLElement) =>
  Array.from(container.getElementsByClassName('band'));

describe('DataView.Timeline grouping', () => {
  it('renders one band per group, in row-model order, with label and count', () => {
    const { container } = renderGrouped();
    // First-occurrence order from `groupData` — the same order List renders.
    expect(bands(container).map(band => band.textContent)).toEqual([
      'Eng2',
      'Design1'
    ]);
  });

  it('omits the count badge when the field does not opt in', () => {
    const { container } = renderTimeline(
      { classNames: { groupHeader: 'band' } },
      groupedOrders,
      {
        fields: [
          { accessorKey: 'title', label: 'Title', sortable: true },
          { accessorKey: 'team', label: 'Team', groupable: true }
        ],
        query: { group_by: ['team'] }
      }
    );
    expect(bands(container).map(band => band.textContent)).toEqual([
      'Eng',
      'Design'
    ]);
  });

  it('packs each section independently and stacks sections vertically', () => {
    renderGrouped();
    // Lane indices reported to renderCard are section-relative.
    expect(screen.getByTestId('card-a1').dataset.lane).toBe('0');
    expect(screen.getByTestId('card-a2').dataset.lane).toBe('1');
    expect(screen.getByTestId('card-b1').dataset.lane).toBe('0');
    // …but the tops are global: Design's lane 0 sits below Eng's lanes.
    expect(screen.getByTestId('card-a1').parentElement!.style.top).toBe('54px');
    expect(screen.getByTestId('card-a2').parentElement!.style.top).toBe(
      '136px'
    );
    expect(screen.getByTestId('card-b1').parentElement!.style.top).toBe(
      '272px'
    );
  });

  it('gives each band a slot spanning its whole section, contiguously', () => {
    const { container } = renderGrouped();
    // Contiguous slots are what makes a pinned band get pushed out by the
    // next one exactly as that section arrives (CSS sticky, no JS).
    const slots = Array.from(
      container.querySelectorAll<HTMLElement>('[class*="timelineGroupSlot"]')
    ).map(slot => [slot.style.top, slot.style.height]);
    expect(slots).toEqual([
      ['0px', '218px'],
      ['218px', '136px']
    ]);
    const canvas = container.querySelector('[role="list"]') as HTMLElement;
    expect(canvas.style.height).toBe('354px');
  });

  it('keeps a card in its own section when it starts under another group', () => {
    renderGrouped();
    // Same x as a1 (80px) — proves packing never leaks across sections.
    expect(screen.getByTestId('card-b1').parentElement!.style.left).toBe(
      '80px'
    );
    expect(screen.getByTestId('card-a1').parentElement!.style.left).toBe(
      '80px'
    );
  });

  it('hides the bands but keeps the sections with showGroupHeaders={false}', () => {
    const { container } = renderGrouped({ showGroupHeaders: false });
    expect(bands(container)).toHaveLength(0);
    expect(container.querySelector('[class*="timelineGroupSlot"]')).toBeNull();
    // Rows stay grouped (List semantics): the 38px bands are gone, so every
    // section shifts up, but Design's lane still starts after Eng's two.
    expect(screen.getByTestId('card-a1').parentElement!.style.top).toBe('16px');
    expect(screen.getByTestId('card-a2').parentElement!.style.top).toBe('98px');
    expect(screen.getByTestId('card-b1').parentElement!.style.top).toBe(
      '196px'
    );
  });

  it('drops a group whose cards are all outside the domain', () => {
    const { container } = renderGrouped({}, [
      ...groupedOrders,
      // Entirely past the range end → the whole Ops section disappears.
      {
        id: 'c1',
        title: 'C1',
        team: 'Ops',
        start: '2025-03-01',
        end: '2025-03-05'
      }
    ]);
    expect(bands(container).map(band => band.textContent)).toEqual([
      'Eng2',
      'Design1'
    ]);
    expect(screen.queryByTestId('card-c1')).toBeNull();
  });

  it('counts the whole group in the badge even when cards are culled', () => {
    const { container } = renderGrouped({}, [
      ...groupedOrders,
      // A third Eng row outside the range: culled from the canvas, but the
      // badge still reports `GroupedData.count` — same as List.
      {
        id: 'a3',
        title: 'A3',
        team: 'Eng',
        start: '2025-03-01',
        end: '2025-03-05'
      }
    ]);
    expect(bands(container)[0].textContent).toBe('Eng3');
    expect(screen.queryByTestId('card-a3')).toBeNull();
    expect(screen.getByTestId('card-a1')).toBeInTheDocument();
  });

  it('renders no band layer when grouping is off', () => {
    const { container } = renderTimeline({
      classNames: { groupHeader: 'band' }
    });
    expect(bands(container)).toHaveLength(0);
    expect(container.querySelector('[class*="timelineGroupLayer"]')).toBeNull();
    // Degenerate single-section geometry is the ungrouped layout, unchanged.
    expect(screen.getByTestId('card-o1').parentElement!.style.top).toBe('16px');
  });

  it('applies one-per-row packing within each section', () => {
    renderGrouped({ lanePacking: 'one-per-row' });
    expect(screen.getByTestId('card-a1').dataset.lane).toBe('0');
    expect(screen.getByTestId('card-a2').dataset.lane).toBe('1');
    // Design's single row restarts at lane 0 rather than continuing to 2.
    expect(screen.getByTestId('card-b1').dataset.lane).toBe('0');
  });

  it('drops a whole section when its rows are filtered out', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <DataView<Order>
        data={groupedOrders}
        fields={[
          { accessorKey: 'title', label: 'Title', sortable: true },
          {
            accessorKey: 'team',
            label: 'Team',
            groupable: true,
            showGroupCount: true,
            filterable: true,
            filterType: 'select'
          }
        ]}
        mode='client'
        defaultSort={{ name: 'title', order: 'asc' }}
        query={{ group_by: ['team'] }}
        getRowId={(row: Order) => row.id}
      >
        <ApplyFilterButton
          filters={[
            { name: 'team', operator: 'eq', value: 'Design', _type: 'select' }
          ]}
        />
        <DataView.Timeline<Order>
          startField='start'
          endField='end'
          range={['2025-01-01', '2025-01-31']}
          scale='day'
          unitWidth={20}
          today={false}
          defaultScrollTo='start'
          classNames={{ groupHeader: 'band' }}
          renderCard={row => (
            <div data-testid={`card-${row.original.id}`}>
              {row.original.title}
            </div>
          )}
        />
      </DataView>
    );
    expect(bands(container)).toHaveLength(2);
    await user.click(screen.getByTestId('apply-filter'));
    // Only the matching group survives, and it moves to the top of the canvas.
    expect(bands(container).map(band => band.textContent)).toEqual(['Design1']);
    expect(screen.queryByTestId('card-a1')).toBeNull();
    expect(screen.getByTestId('card-b1').parentElement!.style.top).toBe('54px');
  });
});

/* ─────────────────────── actionsRef (imperative handle) ─────────────────
   Domain: explicit range Jan 1 → Jan 31 2025, day scale, 20px/unit.
   t0 = Jan 1, t1 = Feb 1, totalWidth = 620px. jsdom clientWidth is 0, so
   'center' collapses to the target's own x, while 'start'/'end' offset by
   the 24px edge inset (clamped at the domain edges). */

describe('DataView.Timeline actionsRef', () => {
  const makeActionsRef = () => ({ current: null as TimelineActions | null });

  it('scrolls to a date, aligned to the viewport edge requested', () => {
    const actionsRef = makeActionsRef();
    const { container } = renderTimeline({ actionsRef });
    const root = container.firstElementChild as HTMLElement;
    expect(actionsRef.current).not.toBeNull();
    // Jan 11 = 10 days after Jan 1 → 10 × 20px, minus the 24px edge inset.
    actionsRef.current!.scrollTo('2025-01-11', {
      align: 'start',
      behavior: 'auto'
    });
    expect(root.scrollLeft).toBe(176);
  });

  it("resolves 'start' and 'end' to the domain edges", () => {
    const actionsRef = makeActionsRef();
    const { container } = renderTimeline({ actionsRef });
    const root = container.firstElementChild as HTMLElement;
    actionsRef.current!.scrollTo('end', { behavior: 'auto' });
    expect(root.scrollLeft).toBe(620);
    actionsRef.current!.scrollTo('start', { behavior: 'auto' });
    expect(root.scrollLeft).toBe(0);
  });

  it('clamps out-of-domain dates to the nearest domain edge', () => {
    const actionsRef = makeActionsRef();
    const { container } = renderTimeline({ actionsRef });
    const root = container.firstElementChild as HTMLElement;
    // Clamped to t1 (x 620), then the 24px edge inset applies.
    actionsRef.current!.scrollTo('2030-06-01', {
      align: 'start',
      behavior: 'auto'
    });
    expect(root.scrollLeft).toBe(596);
    // Clamped to t0 (x 0) — the inset yields to the scroll floor.
    actionsRef.current!.scrollTo('1999-01-01', {
      align: 'start',
      behavior: 'auto'
    });
    expect(root.scrollLeft).toBe(0);
  });

  it('defaults to smooth behavior via Element.scrollTo when available', () => {
    const actionsRef = makeActionsRef();
    const { container } = renderTimeline({ actionsRef });
    const root = container.firstElementChild as HTMLElement;
    const scrollToSpy = vi.fn();
    // biome-ignore lint/suspicious/noExplicitAny: jsdom lacks Element.scrollTo
    (root as any).scrollTo = scrollToSpy;
    actionsRef.current!.scrollTo('2025-01-11', { align: 'start' });
    expect(scrollToSpy).toHaveBeenCalledWith({ left: 176, behavior: 'smooth' });
  });

  it('warns and no-ops on an invalid date', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const actionsRef = makeActionsRef();
    const { container } = renderTimeline({ actionsRef });
    const root = container.firstElementChild as HTMLElement;
    actionsRef.current!.scrollTo('not-a-date', { behavior: 'auto' });
    expect(root.scrollLeft).toBe(0);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('invalid date'));
  });

  it('reports the visible time window from the live scroll position', () => {
    const actionsRef = makeActionsRef();
    const { container } = renderTimeline({ actionsRef });
    const root = container.firstElementChild as HTMLElement;
    root.scrollLeft = 200;
    const range = actionsRef.current!.getVisibleRange();
    expect(range).not.toBeNull();
    const [from, to] = range!;
    expect(from.getTime()).toBe(dayjs('2025-01-11').valueOf());
    // 0-wide jsdom viewport → both edges coincide.
    expect(to.getTime()).toBe(dayjs('2025-01-11').valueOf());
  });

  it('no-ops with a dev warning while hidden, and getVisibleRange is null', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const actionsRef = makeActionsRef();
    renderTimeline({ actionsRef }, []); // no data + not loading → renders null
    expect(actionsRef.current).not.toBeNull();
    actionsRef.current!.scrollTo('today');
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('not rendered'));
    expect(actionsRef.current!.getVisibleRange()).toBeNull();
  });
});
