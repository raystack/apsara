'use client';

import { ListBulletIcon, RowsIcon } from '@radix-ui/react-icons';
import {
  Avatar,
  Badge,
  Button,
  // biome-ignore lint/suspicious/noShadowRestrictedNames: legitimate export name
  DataView,
  DataViewField,
  DataViewListColumn,
  Flex,
  Text
} from '@raystack/apsara';
import { useMemo, useState } from 'react';

type Person = {
  id: string;
  name: string;
  email: string;
  team: 'Eng' | 'Design' | 'Ops';
  status: 'active' | 'invited' | 'archived';
};

const people: Person[] = [
  {
    id: '1',
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    team: 'Eng',
    status: 'active'
  },
  {
    id: '2',
    name: 'Grace Hopper',
    email: 'grace@example.com',
    team: 'Eng',
    status: 'active'
  },
  {
    id: '3',
    name: 'Margaret Hamilton',
    email: 'margaret@example.com',
    team: 'Eng',
    status: 'invited'
  },
  {
    id: '4',
    name: 'Katherine Johnson',
    email: 'katherine@example.com',
    team: 'Ops',
    status: 'active'
  },
  {
    id: '5',
    name: 'Susan Kare',
    email: 'susan@example.com',
    team: 'Design',
    status: 'archived'
  }
];

const fields: DataViewField<Person>[] = [
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
    accessorKey: 'team',
    label: 'Team',
    sortable: true,
    filterable: true,
    filterType: 'select',
    hideable: true,
    groupable: true,
    filterOptions: [
      { label: 'Eng', value: 'Eng' },
      { label: 'Design', value: 'Design' },
      { label: 'Ops', value: 'Ops' }
    ]
  },
  {
    accessorKey: 'status',
    label: 'Status',
    sortable: true,
    filterable: true,
    filterType: 'select',
    hideable: true,
    groupable: true,
    filterOptions: [
      { label: 'Active', value: 'active' },
      { label: 'Invited', value: 'invited' },
      { label: 'Archived', value: 'archived' }
    ]
  }
];

const tableColumns: DataViewListColumn<Person>[] = [
  {
    accessorKey: 'name',
    width: '1.2fr',
    cell: ({ row }) => <Text>{row.original.name}</Text>
  },
  {
    accessorKey: 'email',
    width: '1fr',
    cell: ({ row }) => <Text variant='secondary'>{row.original.email}</Text>
  },
  {
    accessorKey: 'team',
    width: 'auto',
    cell: ({ row }) => <Badge variant='neutral'>{row.original.team}</Badge>
  },
  {
    accessorKey: 'status',
    width: 'auto',
    cell: ({ row }) => (
      <Badge
        variant={
          row.original.status === 'active'
            ? 'success'
            : row.original.status === 'invited'
              ? 'warning'
              : 'neutral'
        }
      >
        {row.original.status}
      </Badge>
    )
  }
];

const listColumns: DataViewListColumn<Person>[] = [
  {
    accessorKey: 'name',
    width: '1fr',
    cell: ({ row }) => (
      <Flex gap={3} align='center'>
        <Avatar size={3} fallback={row.original.name.charAt(0)} />
        <Flex direction='column'>
          <Text weight='medium'>{row.original.name}</Text>
          <Text size='small' variant='secondary'>
            {row.original.email}
          </Text>
        </Flex>
      </Flex>
    )
  },
  {
    accessorKey: 'team',
    width: 'auto',
    cell: ({ row }) => <Badge variant='neutral'>{row.original.team}</Badge>
  },
  {
    accessorKey: 'status',
    width: 'auto',
    cell: ({ row }) => (
      <Badge
        variant={
          row.original.status === 'active'
            ? 'success'
            : row.original.status === 'invited'
              ? 'warning'
              : 'neutral'
        }
      >
        {row.original.status}
      </Badge>
    )
  }
];

const defaultSort = { name: 'name', order: 'asc' as const };

export function DataViewTableDemo() {
  return (
    <Flex direction='column' gap={4} style={{ width: '100%' }}>
      <div style={{ height: 400 }}>
        <DataView data={people} fields={fields} defaultSort={defaultSort}>
          <DataView.Toolbar>
            <DataView.Filters />
            <DataView.DisplayControls />
          </DataView.Toolbar>
          <DataView.List variant='table' columns={tableColumns} />
        </DataView>
      </div>
    </Flex>
  );
}

export function DataViewListDemo() {
  return (
    <Flex direction='column' gap={4} style={{ width: '100%' }}>
      <div style={{ height: 400 }}>
        <DataView data={people} fields={fields} defaultSort={defaultSort}>
          <DataView.Toolbar>
            <DataView.Filters />
          </DataView.Toolbar>
          <DataView.List variant='list' columns={listColumns} />
        </DataView>
      </div>
    </Flex>
  );
}

export function DataViewSearchDemo() {
  return (
    <Flex direction='column' gap={4} style={{ width: '100%' }}>
      <div style={{ height: 400 }}>
        <DataView data={people} fields={fields} defaultSort={defaultSort}>
          <DataView.Toolbar>
            <DataView.Search placeholder='Search by name, email, team…' />
          </DataView.Toolbar>
          <DataView.List variant='table' columns={tableColumns} />
          <DataView.EmptyState>
            <Text>No people match your search.</Text>
          </DataView.EmptyState>
          <DataView.ClearFilters />
        </DataView>
      </div>
    </Flex>
  );
}

export function DataViewMultiViewDemo() {
  const views = useMemo(
    () => [
      { value: 'table', label: 'Table', leadingIcon: <RowsIcon /> },
      { value: 'list', label: 'List', leadingIcon: <ListBulletIcon /> }
    ],
    []
  );
  return (
    <Flex direction='column' gap={4} style={{ width: '100%' }}>
      <div style={{ height: 400 }}>
        <DataView
          data={people}
          fields={fields}
          defaultSort={defaultSort}
          views={views}
          defaultView='table'
        >
          <DataView.Toolbar>
            <DataView.Filters />
            <DataView.DisplayControls />
          </DataView.Toolbar>
          <DataView.List name='table' variant='table' columns={tableColumns} />
          <DataView.List name='list' variant='list' columns={listColumns} />
        </DataView>
      </div>
    </Flex>
  );
}

export function DataViewEmptyZeroDemo() {
  const [filtered, setFiltered] = useState(false);
  return (
    <Flex direction='column' gap={4} style={{ width: '100%' }}>
      <div style={{ height: 400 }}>
        <DataView
          data={filtered ? [] : people}
          fields={fields}
          defaultSort={defaultSort}
          query={
            filtered
              ? { filters: [{ name: 'name', operator: 'eq', value: 'Nobody' }] }
              : undefined
          }
        >
          <DataView.Toolbar>
            <DataView.Filters />
          </DataView.Toolbar>
          <DataView.List variant='table' columns={tableColumns} />
          <DataView.EmptyState>
            <Text>No people match your filters.</Text>
          </DataView.EmptyState>
          <DataView.ZeroState>
            <Text>Nothing here yet.</Text>
          </DataView.ZeroState>
          <DataView.ClearFilters />
        </DataView>
      </div>
    </Flex>
  );
}

export function DataViewCustomDemo() {
  return (
    <Flex direction='column' gap={4} style={{ width: '100%' }}>
      <DataView data={people} fields={fields} defaultSort={defaultSort}>
        <DataView.Toolbar>
          <DataView.Filters />
          <DataView.DisplayControls />
        </DataView.Toolbar>
        <DataView.Custom>
          {ctx => (
            <Flex gap={3} wrap='wrap' style={{ padding: 'var(--rs-space-4)' }}>
              {(ctx.data as Person[]).map(p => (
                <Flex
                  key={p.id}
                  direction='column'
                  gap={2}
                  style={{
                    padding: 'var(--rs-space-4)',
                    border: '0.5px solid var(--rs-color-border-base-primary)',
                    borderRadius: 'var(--rs-radius-3)',
                    width: 220
                  }}
                >
                  <DataView.DisplayAccess accessorKey='name'>
                    <Text weight='medium'>{p.name}</Text>
                  </DataView.DisplayAccess>
                  <DataView.DisplayAccess accessorKey='email'>
                    <Text size='small' variant='secondary'>
                      {p.email}
                    </Text>
                  </DataView.DisplayAccess>
                  <Flex gap={2}>
                    <DataView.DisplayAccess accessorKey='team'>
                      <Badge variant='neutral'>{p.team}</Badge>
                    </DataView.DisplayAccess>
                    <DataView.DisplayAccess accessorKey='status'>
                      <Badge variant='success'>{p.status}</Badge>
                    </DataView.DisplayAccess>
                  </Flex>
                </Flex>
              ))}
            </Flex>
          )}
        </DataView.Custom>
      </DataView>
    </Flex>
  );
}

// ---------------------------------------------------------------------------
// Virtualized large-dataset demo
// ---------------------------------------------------------------------------

function generatePeople(count: number): Person[] {
  const teams: Person['team'][] = ['Eng', 'Design', 'Ops'];
  const statuses: Person['status'][] = ['active', 'invited', 'archived'];
  const firstNames = [
    'Ada',
    'Grace',
    'Margaret',
    'Katherine',
    'Susan',
    'Hedy',
    'Radia',
    'Lynn',
    'Frances',
    'Joan'
  ];
  const lastNames = [
    'Lovelace',
    'Hopper',
    'Hamilton',
    'Johnson',
    'Kare',
    'Lamarr',
    'Perlman',
    'Conway',
    'Allen',
    'Clarke'
  ];
  return Array.from({ length: count }, (_, i) => ({
    id: String(i + 1),
    name: `${firstNames[i % firstNames.length]} ${lastNames[(i + 3) % lastNames.length]}`,
    email: `user${i + 1}@example.com`,
    team: teams[i % teams.length],
    status: statuses[i % statuses.length]
  }));
}

export function DataViewVirtualizedDemo() {
  const data = useMemo(() => generatePeople(1000), []);
  return (
    <Flex direction='column' gap={4} style={{ width: '100%' }}>
      <div style={{ height: 400 }}>
        <DataView data={data} fields={fields} defaultSort={defaultSort}>
          <DataView.Toolbar>
            <DataView.Filters />
            <DataView.DisplayControls />
          </DataView.Toolbar>
          <DataView.List
            variant='table'
            columns={tableColumns}
            virtualized
            estimatedRowHeight={44}
          />
        </DataView>
      </div>
    </Flex>
  );
}

// ---------------------------------------------------------------------------
// Grouping + sticky group header demo
// ---------------------------------------------------------------------------

export function DataViewGroupingDemo() {
  // 60 rows across 3 teams forces the table to scroll inside a 320px viewport,
  // so the sticky group header visibly swaps as the user moves between teams.
  const groupedPeople = useMemo(() => generatePeople(60), []);
  return (
    <Flex direction='column' gap={4} style={{ width: '100%' }}>
      <div style={{ height: 320 }}>
        <DataView
          data={groupedPeople}
          fields={fields}
          defaultSort={defaultSort}
          query={{ group_by: ['team'] }}
        >
          <DataView.Toolbar>
            <DataView.Filters />
            <DataView.DisplayControls />
          </DataView.Toolbar>
          <DataView.List
            variant='table'
            columns={tableColumns}
            stickyGroupHeader
          />
        </DataView>
      </div>
    </Flex>
  );
}

// ---------------------------------------------------------------------------
// Virtualized + grouping + sticky header — exercises the combined path that
// uses the anchor pattern (single sticky element whose content swaps as you
// scroll past each group's offset).
// ---------------------------------------------------------------------------

export function DataViewVirtualizedGroupingDemo() {
  const data = useMemo(() => generatePeople(1500), []);
  return (
    <Flex direction='column' gap={4} style={{ width: '100%' }}>
      <div style={{ height: 360 }}>
        <DataView
          data={data}
          fields={fields}
          defaultSort={defaultSort}
          query={{ group_by: ['team'] }}
        >
          <DataView.Toolbar>
            <DataView.Filters />
            <DataView.DisplayControls />
          </DataView.Toolbar>
          <DataView.List
            variant='table'
            columns={tableColumns}
            virtualized
            estimatedRowHeight={44}
            stickyGroupHeader
          />
        </DataView>
      </div>
    </Flex>
  );
}

// ---------------------------------------------------------------------------
// Loading skeleton demo
// ---------------------------------------------------------------------------

export function DataViewLoadingDemo() {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <Flex direction='column' gap={4} style={{ width: '100%' }}>
      <Flex gap={3} align='center'>
        <Button
          size='small'
          variant='outline'
          color='neutral'
          onClick={() => setIsLoading(v => !v)}
        >
          {isLoading ? 'Stop loading' : 'Show skeletons'}
        </Button>
        <Text size='small' variant='secondary'>
          Skeleton rows render while `isLoading` is true.
        </Text>
      </Flex>
      <div style={{ height: 320 }}>
        <DataView
          data={isLoading ? [] : people}
          fields={fields}
          defaultSort={defaultSort}
          isLoading={isLoading}
          loadingRowCount={4}
        >
          <DataView.Toolbar>
            <DataView.Filters />
          </DataView.Toolbar>
          <DataView.List variant='table' columns={tableColumns} />
        </DataView>
      </div>
    </Flex>
  );
}

// ---------------------------------------------------------------------------
// Loading + virtualization combined
// ---------------------------------------------------------------------------

export function DataViewVirtualizedLoadingDemo() {
  const [isLoading, setIsLoading] = useState(true);
  const allPeople = useMemo(() => generatePeople(1000), []);
  return (
    <Flex direction='column' gap={4} style={{ width: '100%' }}>
      <Flex gap={3} align='center'>
        <Button
          size='small'
          variant='outline'
          color='neutral'
          onClick={() => setIsLoading(v => !v)}
        >
          {isLoading ? 'Stop loading' : 'Show skeletons'}
        </Button>
        <Text size='small' variant='secondary'>
          Skeleton rows render under existing rows even when virtualized.
        </Text>
      </Flex>
      <div style={{ height: 400 }}>
        <DataView
          data={isLoading ? [] : allPeople}
          fields={fields}
          defaultSort={defaultSort}
          isLoading={isLoading}
          loadingRowCount={6}
        >
          <DataView.Toolbar>
            <DataView.Filters />
          </DataView.Toolbar>
          <DataView.List
            variant='table'
            columns={tableColumns}
            virtualized
            estimatedRowHeight={44}
          />
        </DataView>
      </div>
    </Flex>
  );
}

// ---------------------------------------------------------------------------
// Per-view fields override demo — Email hidden in the List view only.
// ---------------------------------------------------------------------------

export function DataViewPerViewFieldsDemo() {
  const views = useMemo(
    () => [
      { value: 'table', label: 'Table', leadingIcon: <RowsIcon /> },
      { value: 'list', label: 'List', leadingIcon: <ListBulletIcon /> }
    ],
    []
  );
  const listFields = useMemo(
    () =>
      fields.map(f =>
        f.accessorKey === 'email'
          ? { ...f, hideable: false, defaultHidden: true }
          : f
      ),
    []
  );
  return (
    <Flex direction='column' gap={4} style={{ width: '100%' }}>
      <div style={{ height: 400 }}>
        <DataView
          data={people}
          fields={fields}
          defaultSort={defaultSort}
          views={views}
          defaultView='table'
        >
          <DataView.Toolbar>
            <DataView.Filters />
            <DataView.DisplayControls />
          </DataView.Toolbar>
          <DataView.List name='table' variant='table' columns={tableColumns} />
          <DataView.List
            name='list'
            variant='list'
            columns={listColumns}
            fields={listFields}
          />
        </DataView>
      </div>
    </Flex>
  );
}
