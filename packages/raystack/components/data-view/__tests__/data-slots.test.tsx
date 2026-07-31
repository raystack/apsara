import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it, vi } from 'vitest';

// SVG icons are inlined via @svgr/rollup at build time. In Vitest they resolve
// to undefined, so stub the `~/icons` module with no-op components.
vi.mock('~/icons', () => ({
  FilterIcon: () => null,
  __esModule: true
}));

import { expectSlots, getAllSlots, getSlot } from '~/test-utils/data-slots';
// biome-ignore lint/suspicious/noShadowRestrictedNames: legitimate export name
import { DataView } from '../data-view';
import type { DataViewField, DataViewListColumn } from '../data-view.types';

beforeAll(() => {
  // jsdom lacks both observers; List/Timeline use them for infinite scroll
  // and measurement.
  // biome-ignore lint/suspicious/noExplicitAny: jsdom polyfill
  (global as any).IntersectionObserver =
    (global as any).IntersectionObserver ||
    vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn()
    }));
  // biome-ignore lint/suspicious/noExplicitAny: jsdom polyfill
  (global as any).ResizeObserver =
    (global as any).ResizeObserver ||
    vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn()
    }));
});

interface TestData {
  id: number;
  name: string;
  status: string;
  start: string;
  end: string;
}

const data: TestData[] = [
  {
    id: 1,
    name: 'John',
    status: 'active',
    start: '2025-01-05',
    end: '2025-01-10'
  },
  {
    id: 2,
    name: 'Jane',
    status: 'inactive',
    start: '2025-01-12',
    end: '2025-01-15'
  }
];

const fields: DataViewField<TestData>[] = [
  {
    accessorKey: 'name',
    label: 'Name',
    sortable: true,
    filterable: true,
    filterType: 'string',
    hideable: true
  },
  {
    accessorKey: 'status',
    label: 'Status',
    sortable: true,
    filterable: true,
    filterType: 'string',
    hideable: true,
    groupable: true
  }
];

const columns: DataViewListColumn<TestData>[] = [
  { accessorKey: 'name', cell: ({ getValue }) => getValue() as string },
  { accessorKey: 'status', cell: ({ getValue }) => getValue() as string }
];

const defaultSort = { name: 'name', order: 'asc' as const };

describe('DataView data-slot contract', () => {
  it('exposes slots for the list renderer', () => {
    const { container } = render(
      <DataView data={data} fields={fields} defaultSort={defaultSort}>
        <DataView.List variant='table' columns={columns} />
      </DataView>
    );
    expectSlots(container, [
      'data-view-list',
      'data-view-list-grid',
      'data-view-list-header',
      'data-view-list-header-row',
      'data-view-list-header-cell',
      'data-view-list-body',
      'data-view-list-row',
      'data-view-list-cell',
      'data-view-list-sentinel'
    ]);
  });

  it('exposes a slot on loader rows while loading', () => {
    const { container } = render(
      <DataView
        data={data}
        fields={fields}
        defaultSort={defaultSort}
        isLoading
        loadingRowCount={2}
      >
        <DataView.List variant='table' columns={columns} />
      </DataView>
    );
    const loaderRows = getAllSlots(container, 'data-view-list-loader-row');
    expect(loaderRows).toHaveLength(2);
    // Loader cells share the regular cell slot.
    expect(
      loaderRows[0].querySelector('[data-slot="data-view-list-cell"]')
    ).not.toBeNull();
  });

  it('exposes a slot on group headers when grouped', () => {
    const { container } = render(
      <DataView
        data={data}
        fields={fields}
        defaultSort={defaultSort}
        query={{ group_by: ['status'] }}
      >
        <DataView.List variant='table' columns={columns} />
      </DataView>
    );
    expect(getSlot(container, 'data-view-list-group-header')).not.toBeNull();
  });

  it('exposes slots for the toolbar, filters, and filter chips', () => {
    const { container } = render(
      <DataView
        data={data}
        fields={fields}
        defaultSort={defaultSort}
        query={{
          filters: [{ name: 'name', operator: 'eq', value: 'John' }]
        }}
      >
        <DataView.Toolbar />
        <DataView.List variant='table' columns={columns} />
      </DataView>
    );
    expectSlots(container, [
      'data-view-toolbar',
      'data-view-filters',
      'data-view-add-filter',
      'data-view-display-trigger',
      'filter-chip'
    ]);
  });

  it('exposes slots inside the display controls popover', async () => {
    const user = userEvent.setup();
    render(
      <DataView data={data} fields={fields} defaultSort={defaultSort}>
        <DataView.Toolbar />
        <DataView.List variant='table' columns={columns} />
      </DataView>
    );
    await user.click(screen.getByRole('button', { name: 'Display' }));
    // Popover content portals to the body.
    expectSlots(document.body, [
      'data-view-display-content',
      'data-view-display-section',
      'data-view-ordering',
      'data-view-ordering-label',
      'data-view-ordering-control',
      'data-view-ordering-select',
      'data-view-ordering-direction',
      'data-view-grouping',
      'data-view-grouping-label',
      'data-view-grouping-control',
      'data-view-grouping-select',
      'data-view-display-properties',
      'data-view-display-properties-label',
      'data-view-display-properties-list',
      'data-view-display-properties-chip',
      'data-view-display-reset',
      'data-view-display-reset-button'
    ]);
  });

  it('exposes slots on the filter summary when rows are hidden', () => {
    const { container } = render(
      <DataView
        data={data}
        fields={fields}
        defaultSort={defaultSort}
        query={{ search: 'John' }}
      >
        <DataView.List variant='table' columns={columns} />
      </DataView>
    );
    expectSlots(container, [
      'data-view-filter-summary',
      'data-view-filter-summary-text',
      'data-view-filter-summary-count',
      'data-view-filter-summary-label',
      'data-view-filter-summary-clear'
    ]);
  });

  it('exposes slots on the empty and zero states', () => {
    const empty = render(
      <DataView
        data={[]}
        fields={fields}
        defaultSort={defaultSort}
        query={{ search: 'nomatch' }}
      >
        <DataView.EmptyState>No results</DataView.EmptyState>
      </DataView>
    );
    expect(getSlot(empty.container, 'data-view-empty-state')).not.toBeNull();
    empty.unmount();

    const zero = render(
      <DataView data={[]} fields={fields} defaultSort={defaultSort}>
        <DataView.ZeroState>Nothing yet</DataView.ZeroState>
      </DataView>
    );
    expect(getSlot(zero.container, 'data-view-zero-state')).not.toBeNull();
  });

  it('exposes slots for the timeline renderer', () => {
    const { container } = render(
      <DataView
        data={data}
        fields={fields}
        defaultSort={defaultSort}
        getRowId={row => String(row.id)}
      >
        <DataView.Timeline<TestData>
          startField='start'
          endField='end'
          range={['2025-01-01', '2025-01-31']}
          scale='day'
          unitWidth={20}
          today={false}
          defaultScrollTo='start'
          renderCard={row => <div>{row.original.name}</div>}
        />
      </DataView>
    );
    expectSlots(container, [
      'data-view-timeline',
      'data-view-timeline-axis',
      'data-view-timeline-axis-band',
      'data-view-timeline-axis-band-label',
      'data-view-timeline-axis-tick',
      'data-view-timeline-canvas',
      'data-view-timeline-gridline',
      'data-view-timeline-card',
      'data-view-timeline-footer'
    ]);
  });
});
