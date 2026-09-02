import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { cleanup, render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectSlots, getAllSlots, getSlot } from '~/test-utils/data-slots';
import { CalendarPreview } from '../calendar-preview';

/*
 * `data-slot` names are public API covered by semver, and three separate
 * audits found slots shipping without ever reaching a document.
 *
 * The first version of this guard scanned the source for
 * `data-slot='calendar-preview-…'` — single-quoted JSX literals only. Two
 * slots are written as a ternary and one as an object property inside
 * `mergeProps`, so the regex never saw them, and because it compared detected
 * against documented, all three passed unnoticed in *both* directions. A
 * fourth audit then found them.
 *
 * So this collects from the DOM instead: what the component actually promises
 * is what it renders, not how the attribute happens to be spelled. The source
 * scan survives as a cross-check in the other direction — a new part whose
 * slot no composition below renders would otherwise slip past a DOM-only
 * collector just as quietly.
 */
const componentDir = join(__dirname, '..');
const docsPage = join(
  __dirname,
  '../../../../../apps/www/src/content/docs/components/calendar-preview/index.mdx'
);

const MONTH = new Date(2024, 3, 1);
const DAY = new Date(2024, 3, 17, 9, 30);
const OTHER = new Date(2024, 3, 20, 9, 30);

/**
 * Between them these must render every slot the component can emit. A slot
 * reachable only under a prop needs its own case: the meridiem wants
 * `hourCycle={12}`, the skeleton wants `loading`, the revert button wants a
 * value that differs from its default, and `.MonthGrid` renders nothing at
 * all under the default day granularity.
 */
const compositions = [
  // The headline composition, opened, with every optional part present.
  <CalendarPreview
    key='full'
    selection='range'
    commit='explicit'
    defaultOpen
    defaultMonth={MONTH}
    granularities={['day', 'month']}
    value={{ from: DAY, to: OTHER }}
    defaultValue={{ from: OTHER, to: OTHER }}
  >
    <CalendarPreview.Trigger>
      <CalendarPreview.RangeInput />
    </CalendarPreview.Trigger>
    <CalendarPreview.Content>
      <CalendarPreview.Presets>
        <CalendarPreview.Preset range={{ from: DAY, to: OTHER }}>
          This week
        </CalendarPreview.Preset>
      </CalendarPreview.Presets>
      <CalendarPreview.GranularityTabs />
      <CalendarPreview.Nav />
      <CalendarPreview.Grid />
      <CalendarPreview.TimeField hourCycle={12} />
      <CalendarPreview.Footer>
        <CalendarPreview.Cancel />
        <CalendarPreview.Apply />
      </CalendarPreview.Footer>
    </CalendarPreview.Content>
  </CalendarPreview>,

  // Single selection, so the one-field `.Input` rather than `.RangeInput`.
  <CalendarPreview key='single' defaultMonth={MONTH}>
    <CalendarPreview.Input />
  </CalendarPreview>,

  // `.MonthGrid` returns null under the day granularity.
  <CalendarPreview
    key='month'
    defaultGranularity='month'
    granularities={['day', 'month']}
    defaultMonth={MONTH}
    minDate={new Date(2023, 0, 1)}
    maxDate={new Date(2025, 11, 31)}
  >
    <CalendarPreview.MonthGrid />
  </CalendarPreview>,

  // Skeletons stand in for the nav and the grid while loading.
  <CalendarPreview key='loading' loading defaultMonth={MONTH}>
    <CalendarPreview.Nav />
    <CalendarPreview.Grid />
  </CalendarPreview>
];

/** Every slot name rendered by any composition above, portals included. */
function collectEmitted(): Set<string> {
  const emitted = new Set<string>();
  for (const composition of compositions) {
    render(composition);
    const slotted = Array.from(
      document.body.querySelectorAll('[data-slot^="calendar-preview-"]')
    );
    for (const element of slotted) {
      emitted.add(element.getAttribute('data-slot') as string);
    }
    cleanup();
  }
  return emitted;
}

/**
 * Slot-shaped string literals in the source, however they are spelled — a JSX
 * attribute, a ternary arm, an object property. Nothing else in this folder
 * uses a `calendar-preview-` string for anything but a slot; if that changes,
 * this fails loudly rather than silently, which is the point.
 */
function collectDeclared(): Set<string> {
  const declared = new Set<string>();
  for (const file of readdirSync(componentDir)) {
    if (!file.endsWith('.tsx')) continue;
    const source = readFileSync(join(componentDir, file), 'utf8');
    for (const match of source.matchAll(/'(calendar-preview-[a-z-]+)'/g)) {
      declared.add(match[1]);
    }
  }
  return declared;
}

function collectDocumented(): Set<string> {
  const page = readFileSync(docsPage, 'utf8');
  return new Set(
    [...page.matchAll(/^\| `(calendar-preview-[a-z-]+)` \|$/gm)].map(
      match => match[1]
    )
  );
}

const missing = (from: Set<string>, against: Set<string>) =>
  [...from].filter(slot => !against.has(slot)).sort();

describe('CalendarPreview data-slot documentation', () => {
  it('renders every slot the source declares', () => {
    // Guards the collector, not the component: a slot no composition above
    // reaches cannot be checked against the docs at all.
    expect(
      missing(collectDeclared(), collectEmitted()),
      'declared in the source but not rendered by any composition in this test'
    ).toEqual([]);
  });

  it('documents every slot the component emits, and no others', () => {
    const emitted = collectEmitted();
    const documented = collectDocumented();

    expect(
      missing(emitted, documented),
      'emitted but not in the docs Slots table'
    ).toEqual([]);
    expect(
      missing(documented, emitted),
      'documented but no longer emitted'
    ).toEqual([]);
  });
});

describe('CalendarPreview data-slot contract', () => {
  it('exposes grid slots when composed inline, with no popover', () => {
    const { container } = render(
      <CalendarPreview defaultMonth={MONTH}>
        <CalendarPreview.Grid />
      </CalendarPreview>
    );

    expectSlots(container, [
      'calendar-preview-grid',
      'calendar-preview-weeks',
      'calendar-preview-table',
      'calendar-preview-day',
      'calendar-preview-day-number'
    ]);
    // Nothing portals when there is no `.Content`.
    expect(getSlot(document.body, 'calendar-preview-content')).toBeNull();
  });

  it('exposes trigger, positioner and content slots when open', () => {
    render(
      <CalendarPreview defaultMonth={MONTH} defaultOpen>
        <CalendarPreview.Trigger>Pick a date</CalendarPreview.Trigger>
        <CalendarPreview.Content>
          <CalendarPreview.Grid />
        </CalendarPreview.Content>
      </CalendarPreview>
    );

    // Portaled parts are asserted against the document, not the container.
    expectSlots(document.body, [
      'calendar-preview-trigger',
      'calendar-preview-positioner',
      'calendar-preview-content',
      'calendar-preview-grid'
    ]);
  });

  it('omits the content slot while closed', () => {
    render(
      <CalendarPreview defaultMonth={MONTH}>
        <CalendarPreview.Trigger>Pick a date</CalendarPreview.Trigger>
        <CalendarPreview.Content>
          <CalendarPreview.Grid />
        </CalendarPreview.Content>
      </CalendarPreview>
    );

    expect(getSlot(document.body, 'calendar-preview-trigger')).not.toBeNull();
    expect(getSlot(document.body, 'calendar-preview-content')).toBeNull();
  });

  it('renders one day slot per day button', () => {
    const { container } = render(
      <CalendarPreview defaultMonth={MONTH}>
        <CalendarPreview.Grid />
      </CalendarPreview>
    );

    // April 2024 has 30 days and outside days are off by default.
    expect(getAllSlots(container, 'calendar-preview-day')).toHaveLength(30);
    // The month name belongs to `.Nav`, which this composition omits.
    expect(getSlot(container, 'calendar-preview-nav-caption')).toBeNull();
  });

  it('renders two months of day slots when months is 2', () => {
    const { container } = render(
      <CalendarPreview defaultMonth={MONTH}>
        <CalendarPreview.Grid months={2} />
      </CalendarPreview>
    );

    // April (30) + May (31).
    expect(getAllSlots(container, 'calendar-preview-day')).toHaveLength(61);
    expect(getAllSlots(container, 'calendar-preview-table')).toHaveLength(2);
  });

  it('never mounts a Select — the caption is a plain label', () => {
    const { container } = render(
      <CalendarPreview defaultMonth={MONTH}>
        <CalendarPreview.Grid />
      </CalendarPreview>
    );

    expect(getSlot(container, 'select-trigger')).toBeNull();
    expect(getSlot(container, 'calendar-preview-nav-month')).toBeNull();
    expect(container.querySelector('select')).toBeNull();
  });
});

/*
 * Moved here from `regressions.test.tsx`, which grouped fixes by the audit
 * pass that found them. The assertions are unchanged; each now sits with the
 * behaviour it guards.
 */
describe('regressions', () => {
  it('does not clobber Input own data-slot', () => {
    const { container } = render(
      <CalendarPreview selection='range' defaultMonth={MONTH}>
        <CalendarPreview.RangeInput />
      </CalendarPreview>
    );
    // Both contracts hold: ours on the wrapper, Input's on its own elements.
    expect(getSlot(container, 'calendar-preview-input-start')).not.toBeNull();
    expect(container.querySelectorAll('[data-slot="input"]')).toHaveLength(2);
    expect(
      container.querySelectorAll('[data-slot="input-container"]')
    ).toHaveLength(2);
  });
});
