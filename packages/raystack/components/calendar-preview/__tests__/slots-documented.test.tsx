import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { cleanup, render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
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
