'use client';

import {
  Button,
  // biome-ignore lint/suspicious/noShadowRestrictedNames: legitimate export name
  DataView,
  type DataViewField,
  Flex,
  Text,
  type TimelineCardContext,
  type TimelineMarker
} from '@raystack/apsara';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 * Timeline virtualization harness.
 *
 * The doc demos run a dozen cards, which says nothing about what the renderer
 * does at scale. This drives it at 1k–50k so the culling is observable: the
 * readout counts what is actually in the DOM and times the frames the browser
 * spends while scrolling, which is the number jsdom cannot produce.
 *
 * Toggle `virtualized` off at 10k to see the difference — and expect the tab
 * to struggle, which is the point.
 */

type Task = {
  id: string;
  title: string;
  team: string;
  status: 'todo' | 'active' | 'done';
  start: string;
  end: string;
};

const DAY_MS = 86_400_000;
const TEAMS = ['Eng', 'Design', 'Ops', 'Data', 'Support'];
const STATUSES: Task['status'][] = ['todo', 'active', 'done'];
const DOMAIN_START = Date.parse('2025-01-01T00:00:00.000Z');
/** Domain lengths the harness can switch between, in days. */
const SPANS = { '1 year': 365, '5 years': 1826 } as const;
type SpanLabel = keyof typeof SPANS;

const isoDay = (ms: number) => new Date(ms).toISOString().slice(0, 10);

/**
 * Hoisted so the reference is stable. The timeline memoizes its resolved
 * markers on this prop, and an inline literal would invalidate that memo on
 * every commit — churn this page would then report as its own frame cost.
 */
const MARKERS: TimelineMarker[] = [
  { date: '2025-07-01', label: 'H2', variant: 'accent' }
];

/** Seeded LCG — the same row count always renders the same canvas. */
function seededRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

function makeTasks(count: number, domainDays: number): Task[] {
  const random = seededRandom(count + domainDays);
  return Array.from({ length: count }, (_, i) => {
    const startDay = Math.floor(random() * domainDays);
    // Mostly short spans with a long tail, so lanes pack unevenly the way
    // real schedules do rather than into a tidy grid.
    const span = 1 + Math.floor(random() ** 3 * 40);
    return {
      id: `t${i}`,
      title: `Task ${i}`,
      team: TEAMS[i % TEAMS.length],
      status: STATUSES[i % STATUSES.length],
      start: new Date(DOMAIN_START + startDay * DAY_MS).toISOString(),
      end: new Date(DOMAIN_START + (startDay + span) * DAY_MS).toISOString()
    };
  });
}

const fields: DataViewField<Task>[] = [
  { accessorKey: 'title', label: 'Title', sortable: true },
  {
    accessorKey: 'team',
    label: 'Team',
    groupable: true,
    showGroupCount: true,
    filterable: true,
    filterType: 'select',
    filterOptions: TEAMS.map(team => ({ label: team, value: team }))
  },
  { accessorKey: 'status', label: 'Status', groupable: true, filterable: true }
];

const STATUS_COLOR: Record<Task['status'], string> = {
  todo: 'var(--rs-color-background-neutral-primary)',
  active: 'var(--rs-color-background-accent-primary)',
  done: 'var(--rs-color-background-success-primary)'
};

/**
 * Card height is fixed at 64 to sit inside the 66px lane pitch. Under
 * `virtualized` the lane height is exactly `estimatedRowHeight`, so a taller
 * card would overflow into the lane below instead of growing its own.
 */
function TaskCard({
  task,
  context
}: {
  task: Task;
  context: TimelineCardContext;
}) {
  return (
    <div
      style={{
        height: 64,
        boxSizing: 'border-box',
        overflow: 'hidden',
        padding: 'var(--rs-space-3)',
        borderRadius: 'var(--rs-radius-3)',
        border: '1px solid var(--rs-color-border-base-primary)',
        background: STATUS_COLOR[task.status],
        fontSize: 'var(--rs-font-size-mini)',
        whiteSpace: 'nowrap'
      }}
    >
      {context.collapsed ? '•' : task.title}
    </div>
  );
}

interface Stats {
  cards: number;
  nodes: number;
  ticks: number;
  bands: number;
  groupSlots: number;
  canvasWidth: number;
  canvasHeight: number;
  /**
   * Height of a single gridline. These are pinned `top: 0; bottom: 0`, so
   * unclamped they are as tall as the whole canvas and their rasterization
   * cost tracks the domain rather than the viewport — the dominant scroll cost
   * before the clamp landed. Worth watching directly: it should stay near the
   * pane height, not the canvas height.
   */
  gridlineHeight: number;
}

/**
 * Worst frame over the last second of scrolling. A mean would hide exactly
 * what matters — one 200ms frame is a visible stall no average survives.
 *
 * Takes the element rather than a ref: the pane is found by query after the
 * timeline paints, and assigning a ref does not re-run an effect, so a
 * ref-based version silently never attaches its listener.
 */
function useFrameMonitor(pane: HTMLElement | null) {
  const [worstFrame, setWorstFrame] = useState(0);
  const frameRef = useRef<number | null>(null);
  /** Deadline for the sampling loop, pushed out by each new scroll event. */
  const untilRef = useRef(0);

  const measure = useCallback(() => {
    // Extend the window while the user keeps scrolling, rather than sampling a
    // fixed second from the first event and ignoring the rest of the drag.
    untilRef.current = performance.now() + 1000;
    if (frameRef.current !== null) return;
    let worst = 0;
    let last = performance.now();
    const step = () => {
      const now = performance.now();
      const delta = now - last;
      last = now;
      if (delta > worst) worst = delta;
      if (now < untilRef.current) {
        frameRef.current = requestAnimationFrame(step);
      } else {
        frameRef.current = null;
        setWorstFrame(Math.round(worst));
      }
    };
    frameRef.current = requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    if (!pane) return;
    pane.addEventListener('scroll', measure, { passive: true });
    return () => {
      pane.removeEventListener('scroll', measure);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [pane, measure]);

  return worstFrame;
}

export default function TimelineStressPage() {
  const [rowCount, setRowCount] = useState(10_000);
  const [spanLabel, setSpanLabel] = useState<SpanLabel>('1 year');
  const [virtualized, setVirtualized] = useState(true);
  const [onePerRow, setOnePerRow] = useState(false);
  const [grouped, setGrouped] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [buildMs, setBuildMs] = useState(0);
  const [stableRenderCard, setStableRenderCard] = useState(true);

  // State, not a ref: the frame monitor's effect has to re-run once the pane
  // exists, and the pane is only found after the timeline paints.
  const [pane, setPane] = useState<HTMLElement | null>(null);
  const worstFrame = useFrameMonitor(pane);

  const domainDays = SPANS[spanLabel];
  const tasks = useMemo(
    () => makeTasks(rowCount, domainDays),
    [rowCount, domainDays]
  );
  // Generation and the axis read the same day count, so the domain can never
  // drift out from under the data.
  const range = useMemo(
    () =>
      [
        isoDay(DOMAIN_START),
        isoDay(DOMAIN_START + (domainDays - 1) * DAY_MS)
      ] as [string, string],
    [domainDays]
  );

  /**
   * The card memo compares `renderCard` by identity, so an inline arrow — what
   * a consumer writes by default — makes every mounted card re-render on every
   * commit. This toggle isolates that cost from the canvas's own.
   */
  const memoizedRenderCard = useCallback(
    (row: { original: Task }, context: TimelineCardContext) => (
      <TaskCard task={row.original} context={context} />
    ),
    []
  );

  // Remount on every switch: mount cost is part of what's being measured, and
  // a stale canvas would otherwise linger under the new settings.
  const runKey = `${rowCount}-${domainDays}-${virtualized}-${onePerRow}-${grouped}`;

  // biome-ignore lint/correctness/useExhaustiveDependencies: `runKey` isn't read here — it's the remount signal, and re-running on it is the point.
  useEffect(() => {
    const start = performance.now();
    // After paint, so the number covers layout of what actually mounted.
    const id = requestAnimationFrame(() => {
      const pane = document.querySelector<HTMLElement>(
        '[data-slot="data-view-timeline"]'
      );
      setPane(pane);
      if (!pane) return;
      const count = (slot: string) =>
        pane.querySelectorAll(`[data-slot="data-view-timeline-${slot}"]`)
          .length;
      const canvas = pane.querySelector<HTMLElement>('[role="list"]');
      const gridline = pane.querySelector<HTMLElement>(
        '[data-slot="data-view-timeline-gridline"]'
      );
      setBuildMs(Math.round(performance.now() - start));
      setStats({
        cards: count('card'),
        nodes: pane.querySelectorAll('*').length,
        ticks: count('axis-tick'),
        bands: count('axis-band'),
        groupSlots: count('group-slot'),
        canvasWidth: canvas ? Math.round(canvas.offsetWidth) : 0,
        canvasHeight: canvas ? Math.round(canvas.offsetHeight) : 0,
        gridlineHeight: gridline ? Math.round(gridline.offsetHeight) : 0
      });
    });
    return () => cancelAnimationFrame(id);
    // Re-measure whenever the run changes — `runKey` also remounts the view.
  }, [runKey]);

  const stat = (label: string, value: string | number) => (
    <Flex direction='column' gap={1} style={{ minWidth: 108 }}>
      <Text size='micro' variant='secondary'>
        {label}
      </Text>
      <Text size='small' style={{ fontVariantNumeric: 'tabular-nums' }}>
        {value}
      </Text>
    </Flex>
  );

  return (
    <Flex
      direction='column'
      gap={5}
      style={{ padding: 24, height: '100vh', boxSizing: 'border-box' }}
    >
      <Flex direction='column' gap={2}>
        <Text size='large'>Timeline virtualization stress</Text>
        <Text size='small' variant='secondary'>
          Scroll the canvas in both directions and watch the counts. Culling is
          bounded by the viewport, so they should barely move with row count.
        </Text>
      </Flex>

      <Flex gap={7} align='end' wrap='wrap'>
        <Flex direction='column' gap={2}>
          <Text size='micro' variant='secondary'>
            Rows
          </Text>
          <Flex gap={2}>
            {[1_000, 10_000, 50_000].map(count => (
              <Button
                key={count}
                size='small'
                variant={count === rowCount ? 'solid' : 'outline'}
                onClick={() => setRowCount(count)}
              >
                {count.toLocaleString()}
              </Button>
            ))}
          </Flex>
        </Flex>
        <Flex direction='column' gap={2}>
          <Text size='micro' variant='secondary'>
            Span
          </Text>
          <Flex gap={2}>
            {(Object.keys(SPANS) as SpanLabel[]).map(label => (
              <Button
                key={label}
                size='small'
                variant={label === spanLabel ? 'solid' : 'outline'}
                onClick={() => setSpanLabel(label)}
              >
                {label}
              </Button>
            ))}
          </Flex>
        </Flex>
        <Flex direction='column' gap={2}>
          <Text size='micro' variant='secondary'>
            Options
          </Text>
          <Flex gap={2}>
            {(
              [
                ['virtualized', virtualized, setVirtualized],
                ['one lane per row', onePerRow, setOnePerRow],
                ['group by team', grouped, setGrouped],
                ['stable renderCard', stableRenderCard, setStableRenderCard]
              ] as const
            ).map(([label, on, set]) => (
              <Button
                key={label}
                size='small'
                variant={on ? 'solid' : 'outline'}
                onClick={() => set(current => !current)}
              >
                {label}
              </Button>
            ))}
          </Flex>
        </Flex>
      </Flex>

      <Flex
        gap={5}
        wrap='wrap'
        style={{
          padding: 'var(--rs-space-4)',
          borderRadius: 'var(--rs-radius-3)',
          border: '1px solid var(--rs-color-border-base-primary)',
          background: 'var(--rs-color-background-base-primary)'
        }}
      >
        {stat('Rows', rowCount.toLocaleString())}
        {stat('Cards in DOM', stats?.cards.toLocaleString() ?? '—')}
        {stat('DOM nodes', stats?.nodes.toLocaleString() ?? '—')}
        {stat('Tick labels', stats?.ticks ?? '—')}
        {stat('Month bands', stats?.bands ?? '—')}
        {stat('Group slots', stats?.groupSlots ?? '—')}
        {stat('Canvas', `${stats?.canvasWidth.toLocaleString() ?? '—'}px`)}
        {stat(
          'Canvas height',
          `${stats?.canvasHeight.toLocaleString() ?? '—'}px`
        )}
        {stat(
          'Gridline height',
          `${stats?.gridlineHeight.toLocaleString() ?? '—'}px`
        )}
        {stat('Mount', `${buildMs}ms`)}
        {stat('Worst frame', worstFrame ? `${worstFrame}ms` : 'scroll me')}
      </Flex>

      <Flex direction='column' style={{ flex: 1, minHeight: 0 }}>
        <DataView<Task>
          key={runKey}
          data={tasks}
          fields={fields}
          mode='client'
          defaultSort={{ name: 'start', order: 'asc' }}
          query={grouped ? { group_by: ['team'] } : undefined}
          getRowId={task => task.id}
        >
          <DataView.Toolbar>
            <DataView.Filters />
            <DataView.DisplayControls hideOrdering />
          </DataView.Toolbar>
          <Flex
            direction='column'
            style={{ flex: 1, overflow: 'hidden', minWidth: 0 }}
          >
            <DataView.Timeline<Task>
              startField='start'
              endField='end'
              range={range}
              scale='day'
              unitWidth={40}
              virtualized={virtualized}
              lanePacking={onePerRow ? 'one-per-row' : 'auto'}
              defaultScrollTo='start'
              markers={MARKERS}
              renderCard={
                stableRenderCard
                  ? memoizedRenderCard
                  : (row, context) => (
                      <TaskCard task={row.original} context={context} />
                    )
              }
            />
          </Flex>
        </DataView>
      </Flex>
    </Flex>
  );
}
