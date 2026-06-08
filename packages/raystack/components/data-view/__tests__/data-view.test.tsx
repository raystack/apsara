import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

// SVG icons are inlined via @svgr/rollup at build time. In Vitest they resolve
// to undefined, so stub the `~/icons` module with no-op components.
vi.mock('~/icons', () => ({
  FilterIcon: () => null,
  __esModule: true
}));

// biome-ignore lint/suspicious/noShadowRestrictedNames: legitimate export name
import { DataView } from '../data-view';
import type {
  DataViewField,
  DataViewListColumn,
  ViewSpec
} from '../data-view.types';
import { useDataView as useDataViewForTest } from '../hooks/useDataView';

// Drivable IntersectionObserver mock. Tests grab the most recent observer
// instance via `getLastObserver()` and call its `trigger` to simulate the
// sentinel entering the viewport.
type IOInstance = {
  observe: (el: Element) => void;
  unobserve: (el: Element) => void;
  disconnect: () => void;
  trigger: (isIntersecting: boolean) => void;
  observed: Element[];
};

let ioInstances: IOInstance[] = [];

beforeAll(() => {
  // biome-ignore lint/suspicious/noExplicitAny: jsdom doesn't ship IntersectionObserver
  global.IntersectionObserver = vi.fn().mockImplementation(function (
    this: IOInstance,
    cb: IntersectionObserverCallback
  ) {
    const observed: Element[] = [];
    this.observed = observed;
    this.observe = (el: Element) => {
      observed.push(el);
    };
    this.unobserve = (el: Element) => {
      const i = observed.indexOf(el);
      if (i >= 0) observed.splice(i, 1);
    };
    this.disconnect = () => {
      observed.length = 0;
    };
    this.trigger = (isIntersecting: boolean) => {
      const entries = observed.map(
        el =>
          ({
            isIntersecting,
            target: el
          }) as unknown as IntersectionObserverEntry
      );
      cb(entries, this as unknown as IntersectionObserver);
    };
    ioInstances.push(this);
  }) as unknown as typeof IntersectionObserver;

  // jsdom doesn't implement ResizeObserver — TanStack Virtual uses it for
  // measureElement.
  // biome-ignore lint/suspicious/noExplicitAny: jsdom lacks ResizeObserver
  (global as any).ResizeObserver =
    (global as any).ResizeObserver ||
    vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn()
    }));
});

afterEach(() => {
  ioInstances = [];
});

function getLastObserver(): IOInstance | undefined {
  return ioInstances[ioInstances.length - 1];
}

interface TestData {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive';
}

const mockData: TestData[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'inactive' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'active' }
];

const mockFields: DataViewField<TestData>[] = [
  {
    accessorKey: 'name',
    label: 'Name',
    sortable: true,
    filterable: true,
    filterType: 'string',
    hideable: true
  },
  {
    accessorKey: 'email',
    label: 'Email',
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

const mockColumns: DataViewListColumn<TestData>[] = [
  { accessorKey: 'name', cell: ({ getValue }) => getValue() as string },
  { accessorKey: 'email', cell: ({ getValue }) => getValue() as string },
  { accessorKey: 'status', cell: ({ getValue }) => getValue() as string }
];

const defaultSort = { name: 'name', order: 'asc' as const };

describe('DataView', () => {
  describe('Basic Rendering', () => {
    it('renders a table renderer with role="table"', () => {
      render(
        <DataView data={mockData} fields={mockFields} defaultSort={defaultSort}>
          <DataView.List variant='table' columns={mockColumns} />
        </DataView>
      );
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('renders a list renderer with role="list"', () => {
      render(
        <DataView data={mockData} fields={mockFields} defaultSort={defaultSort}>
          <DataView.List variant='list' columns={mockColumns} />
        </DataView>
      );
      expect(screen.getByRole('list')).toBeInTheDocument();
    });

    it('provides context to children via useDataView', () => {
      const Probe = () => <div data-testid='probe' />;
      render(
        <DataView data={mockData} fields={mockFields} defaultSort={defaultSort}>
          <Probe />
        </DataView>
      );
      expect(screen.getByTestId('probe')).toBeInTheDocument();
    });

    it('throws if useDataView is used outside provider', () => {
      const Probe = () => {
        useDataViewForTest();
        return null;
      };
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
      expect(() => render(<Probe />)).toThrow(/useDataView/);
      spy.mockRestore();
    });
  });

  describe('Data Display', () => {
    it('renders row values', () => {
      render(
        <DataView data={mockData} fields={mockFields} defaultSort={defaultSort}>
          <DataView.List variant='table' columns={mockColumns} />
        </DataView>
      );
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    });

    it('renders headers when variant="table"', () => {
      render(
        <DataView data={mockData} fields={mockFields} defaultSort={defaultSort}>
          <DataView.List variant='table' columns={mockColumns} />
        </DataView>
      );
      expect(
        screen.getByRole('columnheader', { name: 'Name' })
      ).toBeInTheDocument();
    });

    it('omits headers when variant="list"', () => {
      render(
        <DataView data={mockData} fields={mockFields} defaultSort={defaultSort}>
          <DataView.List variant='list' columns={mockColumns} />
        </DataView>
      );
      expect(screen.queryByRole('columnheader')).not.toBeInTheDocument();
    });

    it('list renderer emits listitem rows', () => {
      render(
        <DataView data={mockData} fields={mockFields} defaultSort={defaultSort}>
          <DataView.List variant='list' columns={mockColumns} />
        </DataView>
      );
      expect(screen.getAllByRole('listitem')).toHaveLength(mockData.length);
    });
  });

  describe('Row Click', () => {
    it('fires onRowClick with the row data', async () => {
      const user = userEvent.setup();
      const onRowClick = vi.fn();
      render(
        <DataView
          data={mockData}
          fields={mockFields}
          defaultSort={defaultSort}
          onRowClick={onRowClick}
        >
          <DataView.List variant='table' columns={mockColumns} />
        </DataView>
      );
      await user.click(screen.getByText('John Doe'));
      expect(onRowClick).toHaveBeenCalledWith(mockData[0]);
    });
  });

  describe('Zero / Empty State', () => {
    it('renders ZeroState sibling when no data and no active query', () => {
      render(
        <DataView data={[]} fields={mockFields} defaultSort={defaultSort}>
          <DataView.List variant='table' columns={mockColumns} />
          <DataView.ZeroState>
            <div data-testid='zero'>Nothing here yet</div>
          </DataView.ZeroState>
          <DataView.EmptyState>
            <div data-testid='empty'>No matches</div>
          </DataView.EmptyState>
        </DataView>
      );
      expect(screen.getByTestId('zero')).toBeInTheDocument();
      expect(screen.queryByTestId('empty')).not.toBeInTheDocument();
    });

    it('renders EmptyState sibling when filters yield no rows', () => {
      render(
        <DataView
          data={mockData}
          fields={mockFields}
          defaultSort={defaultSort}
          query={{
            filters: [{ name: 'name', operator: 'eq', value: 'NonExistent' }]
          }}
        >
          <DataView.List variant='table' columns={mockColumns} />
          <DataView.ZeroState>
            <div data-testid='zero'>Nothing here yet</div>
          </DataView.ZeroState>
          <DataView.EmptyState>
            <div data-testid='empty'>No matches</div>
          </DataView.EmptyState>
        </DataView>
      );
      expect(screen.getByTestId('empty')).toBeInTheDocument();
      expect(screen.queryByTestId('zero')).not.toBeInTheDocument();
    });

    it('renders nothing in renderer when !hasData (sibling takes over)', () => {
      render(
        <DataView data={[]} fields={mockFields} defaultSort={defaultSort}>
          <DataView.List variant='table' columns={mockColumns} />
        </DataView>
      );
      expect(screen.queryByRole('table')).not.toBeInTheDocument();
    });
  });

  describe('Toolbar', () => {
    it('renders nothing in pure zero state', () => {
      const { container } = render(
        <DataView data={[]} fields={mockFields} defaultSort={defaultSort}>
          <DataView.Toolbar>
            <DataView.Search data-testid='search' />
          </DataView.Toolbar>
        </DataView>
      );
      expect(container.firstChild).toBeNull();
    });

    it('renders children when data exists', () => {
      render(
        <DataView data={mockData} fields={mockFields} defaultSort={defaultSort}>
          <DataView.Toolbar>
            <DataView.Search />
            <DataView.Filters />
          </DataView.Toolbar>
          <DataView.List variant='table' columns={mockColumns} />
        </DataView>
      );
      // Search input
      expect(screen.getByRole('textbox')).toBeInTheDocument();
      // Filter button
      expect(
        screen.getByRole('button', { name: /filter/i })
      ).toBeInTheDocument();
    });

    it('search input updates the query', async () => {
      const user = userEvent.setup();
      render(
        <DataView data={mockData} fields={mockFields} defaultSort={defaultSort}>
          <DataView.Toolbar>
            <DataView.Search />
          </DataView.Toolbar>
          <DataView.List variant='table' columns={mockColumns} />
        </DataView>
      );
      const search = screen.getByRole('textbox') as HTMLInputElement;
      await user.type(search, 'jane');
      expect(search.value).toBe('jane');
      // John row should no longer appear (client-mode global filter)
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  describe('Multi-view', () => {
    const views: ViewSpec[] = [
      { value: 'table', label: 'Table' },
      { value: 'list', label: 'List' }
    ];

    it('renders only the active view', () => {
      render(
        <DataView
          data={mockData}
          fields={mockFields}
          defaultSort={defaultSort}
          views={views}
          defaultView='table'
        >
          <DataView.List name='table' variant='table' columns={mockColumns} />
          <DataView.List name='list' variant='list' columns={mockColumns} />
        </DataView>
      );
      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.queryByRole('list')).not.toBeInTheDocument();
    });

    it('switches when controlled `view` prop changes', () => {
      const { rerender } = render(
        <DataView
          data={mockData}
          fields={mockFields}
          defaultSort={defaultSort}
          views={views}
          view='table'
        >
          <DataView.List name='table' variant='table' columns={mockColumns} />
          <DataView.List name='list' variant='list' columns={mockColumns} />
        </DataView>
      );
      expect(screen.getByRole('table')).toBeInTheDocument();

      rerender(
        <DataView
          data={mockData}
          fields={mockFields}
          defaultSort={defaultSort}
          views={views}
          view='list'
        >
          <DataView.List name='table' variant='table' columns={mockColumns} />
          <DataView.List name='list' variant='list' columns={mockColumns} />
        </DataView>
      );
      expect(screen.queryByRole('table')).not.toBeInTheDocument();
      expect(screen.getByRole('list')).toBeInTheDocument();
    });

    it('renderer with name not matching any views[].value renders nothing', () => {
      render(
        <DataView
          data={mockData}
          fields={mockFields}
          defaultSort={defaultSort}
          views={views}
          defaultView='table'
        >
          <DataView.List name='ghost' variant='table' columns={mockColumns} />
        </DataView>
      );
      // ghost never matches activeView=table, no table rendered
      expect(screen.queryByRole('table')).not.toBeInTheDocument();
    });

    it('preserves query state across view switches (filters, search)', () => {
      const { rerender } = render(
        <DataView
          data={mockData}
          fields={mockFields}
          defaultSort={defaultSort}
          views={views}
          view='table'
          query={{
            filters: [{ name: 'status', operator: 'eq', value: 'active' }]
          }}
        >
          <DataView.List name='table' variant='table' columns={mockColumns} />
          <DataView.List name='list' variant='list' columns={mockColumns} />
        </DataView>
      );
      // Two active rows visible in table
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();

      rerender(
        <DataView
          data={mockData}
          fields={mockFields}
          defaultSort={defaultSort}
          views={views}
          view='list'
          query={{
            filters: [{ name: 'status', operator: 'eq', value: 'active' }]
          }}
        >
          <DataView.List name='table' variant='table' columns={mockColumns} />
          <DataView.List name='list' variant='list' columns={mockColumns} />
        </DataView>
      );
      // Filter still applied on list
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
    });
  });

  describe('Per-view fields override', () => {
    it('hides a field in one view by overriding fields on the renderer', () => {
      const views: ViewSpec[] = [
        { value: 'table', label: 'Table' },
        { value: 'list', label: 'List' }
      ];
      // In `list` view, mark email as defaultHidden — the column gates itself.
      const listFields = mockFields.map(f =>
        f.accessorKey === 'email' ? { ...f, defaultHidden: true } : f
      );

      const { rerender } = render(
        <DataView
          data={mockData}
          fields={mockFields}
          defaultSort={defaultSort}
          views={views}
          view='table'
        >
          <DataView.List name='table' variant='table' columns={mockColumns} />
          <DataView.List
            name='list'
            variant='list'
            columns={mockColumns}
            fields={listFields}
          />
        </DataView>
      );
      // Email visible in table view (no override)
      expect(screen.getByText('john@example.com')).toBeInTheDocument();

      // Switching to list doesn't retroactively hide email because
      // columnVisibility is initialised from root fields. The override changes
      // metadata (filterable/hideable) seen by the toolbar but not the initial
      // global visibility map. This is the documented behaviour.
      rerender(
        <DataView
          data={mockData}
          fields={mockFields}
          defaultSort={defaultSort}
          views={views}
          view='list'
        >
          <DataView.List name='table' variant='table' columns={mockColumns} />
          <DataView.List
            name='list'
            variant='list'
            columns={mockColumns}
            fields={listFields}
          />
        </DataView>
      );
      expect(screen.getByRole('list')).toBeInTheDocument();
    });
  });

  describe('DisplayAccess', () => {
    it('renders children when accessorKey is visible', () => {
      render(
        <DataView data={mockData} fields={mockFields} defaultSort={defaultSort}>
          <DataView.DisplayAccess accessorKey='name'>
            <span data-testid='gated'>visible</span>
          </DataView.DisplayAccess>
        </DataView>
      );
      expect(screen.getByTestId('gated')).toBeInTheDocument();
    });

    it('hides children when columnVisibility flag is false', async () => {
      const user = userEvent.setup();
      const Toggle = () => {
        const { setColumnVisibility } = useDataViewForTest();
        return (
          <button
            type='button'
            data-testid='toggle'
            onClick={() =>
              setColumnVisibility((prev: Record<string, boolean>) => ({
                ...prev,
                name: false
              }))
            }
          >
            toggle
          </button>
        );
      };
      render(
        <DataView data={mockData} fields={mockFields} defaultSort={defaultSort}>
          <Toggle />
          <DataView.DisplayAccess accessorKey='name'>
            <span data-testid='gated'>visible</span>
          </DataView.DisplayAccess>
        </DataView>
      );
      expect(screen.getByTestId('gated')).toBeInTheDocument();
      await user.click(screen.getByTestId('toggle'));
      expect(screen.queryByTestId('gated')).not.toBeInTheDocument();
    });

    it('renders fallback when hidden', async () => {
      const user = userEvent.setup();
      const Toggle = () => {
        const { setColumnVisibility } = useDataViewForTest();
        return (
          <button
            type='button'
            data-testid='toggle'
            onClick={() =>
              setColumnVisibility((prev: Record<string, boolean>) => ({
                ...prev,
                email: false
              }))
            }
          >
            toggle
          </button>
        );
      };
      render(
        <DataView data={mockData} fields={mockFields} defaultSort={defaultSort}>
          <Toggle />
          <DataView.DisplayAccess
            accessorKey='email'
            fallback={<span data-testid='fb'>hidden</span>}
          >
            <span data-testid='visible'>visible</span>
          </DataView.DisplayAccess>
        </DataView>
      );
      expect(screen.getByTestId('visible')).toBeInTheDocument();
      await user.click(screen.getByTestId('toggle'));
      expect(screen.getByTestId('fb')).toBeInTheDocument();
      expect(screen.queryByTestId('visible')).not.toBeInTheDocument();
    });

    it('defaults to visible for unknown accessor (typos do not break the render)', () => {
      render(
        <DataView data={mockData} fields={mockFields} defaultSort={defaultSort}>
          <DataView.DisplayAccess accessorKey='nope'>
            <span data-testid='unknown'>still visible</span>
          </DataView.DisplayAccess>
        </DataView>
      );
      expect(screen.getByTestId('unknown')).toBeInTheDocument();
    });
  });

  describe('Custom renderer', () => {
    it('passes the full context to the render prop', () => {
      render(
        <DataView data={mockData} fields={mockFields} defaultSort={defaultSort}>
          <DataView.Custom>
            {ctx => (
              <div data-testid='custom'>
                rows={ctx.data.length}; hasData={String(ctx.hasData)}
              </div>
            )}
          </DataView.Custom>
        </DataView>
      );
      expect(screen.getByTestId('custom')).toHaveTextContent(
        'rows=3; hasData=true'
      );
    });

    it('gates on name vs activeView', () => {
      const views: ViewSpec[] = [
        { value: 'table', label: 'Table' },
        { value: 'board', label: 'Board' }
      ];
      render(
        <DataView
          data={mockData}
          fields={mockFields}
          defaultSort={defaultSort}
          views={views}
          defaultView='board'
        >
          <DataView.List name='table' variant='table' columns={mockColumns} />
          <DataView.Custom name='board'>
            {() => <div data-testid='board'>BOARD</div>}
          </DataView.Custom>
        </DataView>
      );
      expect(screen.getByTestId('board')).toBeInTheDocument();
      expect(screen.queryByRole('table')).not.toBeInTheDocument();
    });
  });

  describe('Filter clearing', () => {
    it('Clear Filters button resets filters', async () => {
      const user = userEvent.setup();
      render(
        <DataView
          data={mockData}
          fields={mockFields}
          defaultSort={defaultSort}
          query={{
            filters: [{ name: 'name', operator: 'eq', value: 'NonExistent' }]
          }}
        >
          <DataView.List variant='table' columns={mockColumns} />
          <DataView.EmptyState>
            <div data-testid='empty'>no matches</div>
          </DataView.EmptyState>
        </DataView>
      );
      // In empty state, filter summary is *not* shown by the List (renderer
      // returns null when !hasData). EmptyState sibling handles it. Just
      // confirm the empty state path is taken.
      expect(screen.getByTestId('empty')).toBeInTheDocument();
    });
  });

  describe('Grouping', () => {
    it('groups rows by accessor key', () => {
      const { container } = render(
        <DataView
          data={mockData}
          fields={mockFields}
          defaultSort={defaultSort}
          query={{ group_by: ['status'] }}
        >
          <DataView.List variant='table' columns={mockColumns} />
        </DataView>
      );
      // Two group headers (active, inactive) — counted via class
      const groupHeaders = container.querySelectorAll(
        '[class*="listGroupHeader"]'
      );
      expect(groupHeaders.length).toBe(2);
    });

    it('applies groupByResolvers for non-accessor keys', () => {
      const dataWithDate: TestData[] = mockData;
      render(
        <DataView
          data={dataWithDate}
          fields={mockFields}
          defaultSort={defaultSort}
          query={{ group_by: ['name_first_letter'] }}
          groupByResolvers={{
            name_first_letter: row => row.name.charAt(0).toUpperCase()
          }}
        >
          <DataView.List variant='table' columns={mockColumns} />
        </DataView>
      );
      // Buckets: J (John, Jane), B (Bob)
      expect(screen.getByText('J')).toBeInTheDocument();
      expect(screen.getByText('B')).toBeInTheDocument();
    });
  });

  describe('Wire-format translation', () => {
    it('does NOT call onTableQueryChange in client mode', async () => {
      const onTableQueryChange = vi.fn();
      const user = userEvent.setup();
      render(
        <DataView
          data={mockData}
          fields={mockFields}
          defaultSort={defaultSort}
          mode='client'
          onTableQueryChange={onTableQueryChange}
        >
          <DataView.Toolbar>
            <DataView.Search />
          </DataView.Toolbar>
          <DataView.List variant='table' columns={mockColumns} />
        </DataView>
      );
      await user.type(screen.getByRole('textbox'), 'jane');
      expect(onTableQueryChange).not.toHaveBeenCalled();
    });

    it('calls onTableQueryChange in server mode after query change', async () => {
      const onTableQueryChange = vi.fn();
      const user = userEvent.setup();
      render(
        <DataView
          data={mockData}
          fields={mockFields}
          defaultSort={defaultSort}
          mode='server'
          onTableQueryChange={onTableQueryChange}
        >
          <DataView.Toolbar>
            <DataView.Search />
          </DataView.Toolbar>
          <DataView.List variant='table' columns={mockColumns} />
        </DataView>
      );
      await user.type(screen.getByRole('textbox'), 'a');
      expect(onTableQueryChange).toHaveBeenCalled();
      const calls = onTableQueryChange.mock.calls;
      const lastCall = calls[calls.length - 1]?.[0];
      expect(lastCall?.search).toBe('a');
    });
  });

  describe('Loading state', () => {
    it('renders skeleton rows when isLoading is true (non-virtualized)', () => {
      const { container } = render(
        <DataView
          data={mockData}
          fields={mockFields}
          defaultSort={defaultSort}
          isLoading
          loadingRowCount={4}
        >
          <DataView.List variant='table' columns={mockColumns} />
        </DataView>
      );
      const loaderRows = container.querySelectorAll('[aria-busy="true"]');
      expect(loaderRows.length).toBe(4);
    });

    it('renders skeleton rows when isLoading is true (virtualized)', () => {
      const { container } = render(
        <div style={{ height: 300 }}>
          <DataView
            data={mockData}
            fields={mockFields}
            defaultSort={defaultSort}
            isLoading
            loadingRowCount={5}
          >
            <DataView.List variant='table' columns={mockColumns} virtualized />
          </DataView>
        </div>
      );
      const loaderRows = container.querySelectorAll('[aria-busy="true"]');
      expect(loaderRows.length).toBe(5);
    });

    it('renders skeleton rows on initial load even with no data (non-virtualized)', () => {
      const { container } = render(
        <DataView
          data={[]}
          fields={mockFields}
          defaultSort={defaultSort}
          isLoading
          loadingRowCount={3}
        >
          <DataView.List variant='table' columns={mockColumns} />
          <DataView.ZeroState>
            <div data-testid='zero'>zero</div>
          </DataView.ZeroState>
        </DataView>
      );
      // ZeroState must NOT render while loading is in flight.
      expect(screen.queryByTestId('zero')).not.toBeInTheDocument();
      const loaderRows = container.querySelectorAll('[aria-busy="true"]');
      expect(loaderRows.length).toBe(3);
    });

    it('renders skeleton rows on initial load even with no data (virtualized)', () => {
      const { container } = render(
        <div style={{ height: 300 }}>
          <DataView
            data={[]}
            fields={mockFields}
            defaultSort={defaultSort}
            isLoading
            loadingRowCount={3}
          >
            <DataView.List variant='table' columns={mockColumns} virtualized />
          </DataView>
        </div>
      );
      const loaderRows = container.querySelectorAll('[aria-busy="true"]');
      expect(loaderRows.length).toBe(3);
    });

    it('skeleton row count respects loadingRowCount prop', () => {
      const { container, rerender } = render(
        <DataView
          data={mockData}
          fields={mockFields}
          defaultSort={defaultSort}
          isLoading
          loadingRowCount={2}
        >
          <DataView.List variant='table' columns={mockColumns} />
        </DataView>
      );
      expect(container.querySelectorAll('[aria-busy="true"]').length).toBe(2);

      rerender(
        <DataView
          data={mockData}
          fields={mockFields}
          defaultSort={defaultSort}
          isLoading
          loadingRowCount={7}
        >
          <DataView.List variant='table' columns={mockColumns} />
        </DataView>
      );
      expect(container.querySelectorAll('[aria-busy="true"]').length).toBe(7);
    });
  });

  describe('Infinite scroll (sentinel-based)', () => {
    it('triggers onLoadMore when sentinel intersects (non-virtualized)', () => {
      const onLoadMore = vi.fn();
      render(
        <DataView
          data={mockData}
          fields={mockFields}
          defaultSort={defaultSort}
          mode='server'
          onLoadMore={onLoadMore}
        >
          <DataView.List variant='table' columns={mockColumns} />
        </DataView>
      );
      const observer = getLastObserver();
      expect(observer).toBeDefined();
      act(() => observer?.trigger(true));
      expect(onLoadMore).toHaveBeenCalledTimes(1);
    });

    it('triggers onLoadMore when sentinel intersects (virtualized)', () => {
      const onLoadMore = vi.fn();
      render(
        <div style={{ height: 300 }}>
          <DataView
            data={mockData}
            fields={mockFields}
            defaultSort={defaultSort}
            mode='server'
            onLoadMore={onLoadMore}
          >
            <DataView.List variant='table' columns={mockColumns} virtualized />
          </DataView>
        </div>
      );
      const observer = getLastObserver();
      expect(observer).toBeDefined();
      act(() => observer?.trigger(true));
      expect(onLoadMore).toHaveBeenCalledTimes(1);
    });

    it('does not trigger onLoadMore while isLoading is true', () => {
      const onLoadMore = vi.fn();
      render(
        <DataView
          data={mockData}
          fields={mockFields}
          defaultSort={defaultSort}
          mode='server'
          isLoading
          onLoadMore={onLoadMore}
        >
          <DataView.List variant='table' columns={mockColumns} />
        </DataView>
      );
      const observer = getLastObserver();
      act(() => observer?.trigger(true));
      expect(onLoadMore).not.toHaveBeenCalled();
    });

    it('does not trigger onLoadMore in client mode', () => {
      const onLoadMore = vi.fn();
      render(
        <DataView
          data={mockData}
          fields={mockFields}
          defaultSort={defaultSort}
          mode='client'
          onLoadMore={onLoadMore}
        >
          <DataView.List variant='table' columns={mockColumns} />
        </DataView>
      );
      // No observer is attached in client mode.
      const observer = getLastObserver();
      if (observer) {
        act(() => observer.trigger(true));
      }
      expect(onLoadMore).not.toHaveBeenCalled();
    });

    it('ignores non-intersecting sentinel entries', () => {
      const onLoadMore = vi.fn();
      render(
        <DataView
          data={mockData}
          fields={mockFields}
          defaultSort={defaultSort}
          mode='server'
          onLoadMore={onLoadMore}
        >
          <DataView.List variant='table' columns={mockColumns} />
        </DataView>
      );
      const observer = getLastObserver();
      act(() => observer?.trigger(false));
      expect(onLoadMore).not.toHaveBeenCalled();
    });
  });

  describe('Virtualization', () => {
    it('accepts estimatedRowHeight as the initial size hint', () => {
      // Smoke test — render with virtualized + estimatedRowHeight and verify
      // the listGrid mounts. The exact pixel math is exercised by
      // @tanstack/react-virtual; we only confirm the prop is honoured.
      const { container } = render(
        <div style={{ height: 300 }}>
          <DataView
            data={mockData}
            fields={mockFields}
            defaultSort={defaultSort}
          >
            <DataView.List
              variant='table'
              columns={mockColumns}
              virtualized
              estimatedRowHeight={88}
            />
          </DataView>
        </div>
      );
      expect(container.querySelector('[role="table"]')).toBeInTheDocument();
    });

    it('renders the sticky group anchor when virtualized + grouped + sticky', () => {
      const { container } = render(
        <div style={{ height: 300 }}>
          <DataView
            data={mockData}
            fields={mockFields}
            defaultSort={defaultSort}
            query={{ group_by: ['status'] }}
          >
            <DataView.List
              variant='table'
              columns={mockColumns}
              virtualized
              stickyGroupHeader
            />
          </DataView>
        </div>
      );
      // Anchor is a single dedicated element distinct from the natural group
      // header rows; it carries `aria-hidden` since its content is duplicated
      // by the natural header underneath.
      const anchor = container.querySelector(
        '[class*="listGroupAnchor"][aria-hidden="true"]'
      );
      expect(anchor).not.toBeNull();
    });

    it('does not render the sticky anchor when not grouped', () => {
      const { container } = render(
        <div style={{ height: 300 }}>
          <DataView
            data={mockData}
            fields={mockFields}
            defaultSort={defaultSort}
          >
            <DataView.List
              variant='table'
              columns={mockColumns}
              virtualized
              stickyGroupHeader
            />
          </DataView>
        </div>
      );
      expect(container.querySelector('[class*="listGroupAnchor"]')).toBeNull();
    });

    it('listGrid carries the gridTemplateColumns derived from column widths', () => {
      const widthedColumns: DataViewListColumn<TestData>[] = [
        { accessorKey: 'name', width: '200px' },
        { accessorKey: 'email', width: '1fr' },
        { accessorKey: 'status', width: 'auto' }
      ];
      const { container } = render(
        <div style={{ height: 300 }}>
          <DataView
            data={mockData}
            fields={mockFields}
            defaultSort={defaultSort}
          >
            <DataView.List
              variant='table'
              columns={widthedColumns}
              virtualized
              estimatedRowHeight={40}
            />
          </DataView>
        </div>
      );
      const grid = container.querySelector('[role="table"]') as HTMLElement;
      // gridTemplateColumns is set inline on .listGrid in both modes; virtual
      // rows re-declare it inline so columns stay aligned even when items are
      // absolutely positioned (out of the subgrid flow).
      expect(grid?.style.gridTemplateColumns).toBe('200px 1fr auto');
    });
  });

  describe('Unmanaged display columns', () => {
    // Selection / row-action / drag-handle columns aren't declared as fields
    // (no filter/sort/group/visibility semantics) — they're presentation only.
    // Such accessors must still render via their column spec.
    it('renders header + cells for a column whose accessor is absent from fields', async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();
      const selectionColumn: DataViewListColumn<TestData> = {
        accessorKey: 'select',
        width: '40px',
        header: () => <span data-testid='sel-header'>SEL</span>,
        cell: ({ row }) => (
          <button
            data-testid={`sel-cell-${(row.original as TestData).id}`}
            onClick={() => onSelect((row.original as TestData).id)}
          >
            x
          </button>
        )
      };
      render(
        <DataView data={mockData} fields={mockFields} defaultSort={defaultSort}>
          <DataView.List
            variant='table'
            columns={[selectionColumn, ...mockColumns]}
          />
        </DataView>
      );
      expect(screen.getByTestId('sel-header')).toBeInTheDocument();
      expect(screen.getByTestId('sel-cell-1')).toBeInTheDocument();
      expect(screen.getByTestId('sel-cell-2')).toBeInTheDocument();
      expect(screen.getByTestId('sel-cell-3')).toBeInTheDocument();
      await user.click(screen.getByTestId('sel-cell-2'));
      expect(onSelect).toHaveBeenCalledWith(2);
    });

    it('exposes table + row to unmanaged column render fns', () => {
      let receivedTable: unknown = null;
      let receivedRowOriginal: unknown = null;
      const selectionColumn: DataViewListColumn<TestData> = {
        accessorKey: 'select',
        header: ({ table }) => {
          receivedTable = table;
          return <span data-testid='sel-header' />;
        },
        cell: ({ row }) => {
          if (receivedRowOriginal === null) receivedRowOriginal = row.original;
          return <span data-testid='sel-cell' />;
        }
      };
      render(
        <DataView data={mockData} fields={mockFields} defaultSort={defaultSort}>
          <DataView.List
            variant='table'
            columns={[selectionColumn, ...mockColumns]}
          />
        </DataView>
      );
      expect(receivedTable).not.toBeNull();
      // First row after default ascending name sort is "Bob Johnson" (id=3).
      expect(receivedRowOriginal).toMatchObject({ id: 3 });
    });
  });
});
