'use client';

import { ListBulletIcon, RowsIcon, TransformIcon } from '@radix-ui/react-icons';
import {
  Avatar,
  Badge,
  Button,
  Checkbox,
  Chip,
  // biome-ignore lint/suspicious/noShadowRestrictedNames: legitimate export name
  DataView,
  DataViewField,
  DataViewListColumn,
  Flex,
  FloatingActions,
  Text,
  type TimelineActions,
  type TimelineCardContext,
  useDataView
} from '@raystack/apsara';
import { useMemo, useRef, useState } from 'react';

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

// ---------------------------------------------------------------------------
// Row selection demo — unmanaged checkbox column + a FloatingActions bar.
// ---------------------------------------------------------------------------

const selectionColumn: DataViewListColumn<Person> = {
  accessorKey: 'select',
  width: 48,
  header: ({ table }) => (
    <Checkbox
      size='small'
      checked={table.getIsAllRowsSelected()}
      indeterminate={
        table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
      }
      onCheckedChange={checked => table.toggleAllRowsSelected(Boolean(checked))}
      aria-label='Select all people'
    />
  ),
  cell: ({ row }) => (
    <Checkbox
      size='small'
      checked={row.getIsSelected()}
      onCheckedChange={checked => row.toggleSelected(Boolean(checked))}
      onClick={event => event.stopPropagation()}
      aria-label={`Select ${row.original.name}`}
    />
  )
};

const selectionColumns: DataViewListColumn<Person>[] = [
  selectionColumn,
  ...tableColumns
];

function SelectionBar() {
  const { table } = useDataView<Person>();
  const selectedCount = table.getSelectedRowModel().flatRows.length;
  if (selectedCount === 0) return null;

  return (
    <FloatingActions aria-label='Selection actions'>
      <Chip
        variant='outline'
        size='large'
        color='neutral'
        leadingIcon={<TransformIcon />}
        isDismissible
        onDismiss={() => table.resetRowSelection()}
      >
        {selectedCount} selected
      </Chip>
      <FloatingActions.Separator />
      <Button variant='outline' color='neutral' size='small'>
        Change team
      </Button>
      <Button variant='outline' color='neutral' size='small'>
        Archive
      </Button>
    </FloatingActions>
  );
}

export function DataViewSelectionDemo() {
  return (
    <Flex direction='column' gap={4} style={{ width: '100%' }}>
      {/* `transform` scopes the bar's `position: fixed` to this box. */}
      <div
        style={{
          height: 400,
          position: 'relative',
          overflow: 'hidden',
          transform: 'translateZ(0)'
        }}
      >
        <DataView
          data={people}
          fields={fields}
          defaultSort={defaultSort}
          getRowId={person => person.id}
        >
          <DataView.Toolbar>
            <DataView.Search placeholder='Search people…' />
            <DataView.Filters />
            <DataView.DisplayControls />
          </DataView.Toolbar>
          <DataView.List
            variant='table'
            columns={selectionColumns}
            classNames={{ root: 'dv-selection-demo-scroll' }}
          />
          <SelectionBar />
        </DataView>
      </div>
      <style>{`.dv-selection-demo-scroll { padding-bottom: 64px; }`}</style>
    </Flex>
  );
}

/* ── Timeline demo ─────────────────────────────────────────────────────── */

type Task = {
  id: string;
  title: string;
  team: 'Eng' | 'Design' | 'Ops';
  status: 'todo' | 'active' | 'done';
  priority: 'High' | 'Medium' | 'Low';
  /* Priority as a number. Sorting the label alphabetically gives High, Low,
     Medium — this is what "sort by priority" has to mean to be useful, and it
     is what the sort-value lane timeline lanes on. */
  rank: 1 | 2 | 3;
  start: string;
  end: string;
};

const TASK_RANK: Record<Task['priority'], Task['rank']> = {
  High: 1,
  Medium: 2,
  Low: 3
};

const TASK_DAY_MS = 86_400_000;

/* Dates relative to today, pinned to midnight so the today line is always
   live and SSR/client renders match (no hydration drift). */
const taskDate = (days: number) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return new Date(now.getTime() + days * TASK_DAY_MS).toISOString();
};

const taskSpec: Array<
  [
    string,
    string,
    Task['team'],
    Task['status'],
    Task['priority'],
    number,
    number
  ]
> = [
  ['t1', 'Design audit', 'Design', 'done', 'High', -16, -9],
  ['t2', 'API contracts', 'Eng', 'done', 'High', -13, -6],
  ['t3', 'Billing revamp', 'Eng', 'active', 'High', -7, 2],
  ['t4', 'Docs sprint', 'Design', 'active', 'Medium', -4, 4],
  ['t5', 'Bug bash', 'Ops', 'todo', 'Low', 1, 2],
  ['t6', 'Load testing', 'Ops', 'todo', 'Low', 3, 9],
  ['t7', 'Beta rollout', 'Eng', 'todo', 'High', 6, 14],
  ['t8', 'Launch comms', 'Design', 'todo', 'Medium', 10, 16],
  // Overlapping work per team, so packing stacks a few lanes deep inside each
  // group section rather than every band being a single row.
  ['t9', 'Schema migration', 'Eng', 'done', 'Medium', -15, -10],
  ['t10', 'Icon refresh', 'Design', 'done', 'Low', -12, -5],
  ['t11', 'On-call rotation', 'Ops', 'active', 'Medium', -11, -2],
  ['t12', 'Runbook cleanup', 'Ops', 'done', 'Low', -14, -8],
  ['t13', 'Search indexing', 'Eng', 'active', 'Medium', -3, 6],
  ['t14', 'Motion pass', 'Design', 'active', 'Low', -2, 5],
  ['t15', 'Cost review', 'Ops', 'todo', 'Medium', 4, 12],
  ['t16', 'SSO hardening', 'Eng', 'todo', 'Low', 8, 15],
  ['t17', 'Empty states', 'Design', 'todo', 'Medium', 7, 13],
  ['t18', 'Chaos drill', 'Ops', 'todo', 'High', 11, 15]
];

const tasks: Task[] = taskSpec.map(
  ([id, title, team, status, priority, from, to]) => ({
    id,
    title,
    team,
    status,
    priority,
    rank: TASK_RANK[priority],
    start: taskDate(from),
    end: taskDate(to)
  })
);

const taskFields: DataViewField<Task>[] = [
  {
    accessorKey: 'title',
    label: 'Task',
    filterable: true,
    filterType: 'string',
    hideable: false
  },
  {
    accessorKey: 'team',
    label: 'Team',
    filterable: true,
    filterType: 'select',
    hideable: true,
    // Groupable → the timeline renders one swim-lane section per team.
    groupable: true,
    showGroupCount: true,
    filterOptions: [
      { label: 'Eng', value: 'Eng' },
      { label: 'Design', value: 'Design' },
      { label: 'Ops', value: 'Ops' }
    ]
  },
  {
    accessorKey: 'status',
    label: 'Status',
    filterable: true,
    filterType: 'select',
    hideable: true,
    groupable: true,
    showGroupCount: true,
    groupLabelsMap: { todo: 'To do', active: 'Active', done: 'Done' },
    filterOptions: [
      { label: 'To do', value: 'todo' },
      { label: 'Active', value: 'active' },
      { label: 'Done', value: 'done' }
    ]
  },
  {
    accessorKey: 'priority',
    label: 'Priority',
    filterable: true,
    filterType: 'select',
    hideable: true,
    // groupOrder ranks the sections when grouping by priority — text sort
    // would give High, Low, Medium.
    groupable: true,
    showGroupCount: true,
    groupOrder: ['High', 'Medium', 'Low'],
    filterOptions: [
      { label: 'High', value: 'High' },
      { label: 'Medium', value: 'Medium' },
      { label: 'Low', value: 'Low' }
    ]
  },
  {
    // Sortable because the sort-value lane timeline lanes by whatever is sorted:
    // sorting on rank yields a High lane, a Medium lane and a Low lane.
    accessorKey: 'rank',
    label: 'Priority rank',
    sortable: true,
    hideable: true,
    defaultHidden: true
  },
  {
    accessorKey: 'start',
    label: 'Start',
    filterable: true,
    filterType: 'date',
    sortable: true,
    hideable: true
  },
  {
    accessorKey: 'end',
    label: 'End',
    filterable: true,
    filterType: 'date',
    sortable: true,
    hideable: true
  }
];

const TASK_STATUS_BADGE: Record<
  Task['status'],
  'neutral' | 'accent' | 'success'
> = {
  todo: 'neutral',
  active: 'accent',
  done: 'success'
};

/* The card interior is entirely consumer-owned — the Timeline only positions
   the wrapper. `context.collapsed` flags spans narrower than `minCardWidth`. */
function TaskCard({
  task,
  context
}: {
  task: Task;
  context: TimelineCardContext;
}) {
  // Card height is content-driven (the wrapper auto-measures, like
  // DataView.List rows) — fix it here so collapsed stubs match full cards.
  const chrome: React.CSSProperties = {
    height: 64,
    boxSizing: 'border-box',
    borderRadius: 'var(--rs-radius-3)',
    border: '1px solid var(--rs-color-border-base-primary)',
    background: 'var(--rs-color-background-base-primary)',
    overflow: 'hidden'
  };
  if (context.collapsed) {
    return (
      <Flex align='center' justify='center' style={chrome}>
        <Text size='micro' weight='medium' variant='secondary'>
          {task.title.charAt(0)}
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
      <Text
        size='small'
        weight='medium'
        style={{
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}
      >
        {task.title}
      </Text>
      <Flex align='center' gap={2}>
        <Badge size='micro' variant={TASK_STATUS_BADGE[task.status]}>
          {task.status}
        </Badge>
        <DataView.DisplayAccess accessorKey='team'>
          <Badge size='micro' variant='neutral'>
            {task.team}
          </Badge>
        </DataView.DisplayAccess>
        <DataView.DisplayAccess accessorKey='priority'>
          <Badge size='micro' variant='neutral'>
            {task.priority}
          </Badge>
        </DataView.DisplayAccess>
      </Flex>
    </Flex>
  );
}

/* ── Timeline point-marker demo (no endField) ──────────────────────────── */

type Release = {
  id: string;
  version: string;
  channel: 'stable' | 'beta';
  date: string;
};

const releases: Release[] = [
  { id: 'r1', version: 'v1.8', channel: 'stable', date: taskDate(-14) },
  { id: 'r2', version: 'v1.9', channel: 'stable', date: taskDate(-9) },
  { id: 'r3', version: 'v2.0-b1', channel: 'beta', date: taskDate(-4) },
  { id: 'r4', version: 'v2.0-b2', channel: 'beta', date: taskDate(1) },
  { id: 'r5', version: 'v2.0', channel: 'stable', date: taskDate(6) },
  { id: 'r6', version: 'v2.1-b1', channel: 'beta', date: taskDate(11) }
];

const releaseFields: DataViewField<Release>[] = [
  {
    accessorKey: 'version',
    label: 'Version',
    filterable: true,
    filterType: 'string',
    hideable: false
  },
  {
    accessorKey: 'channel',
    label: 'Channel',
    filterable: true,
    filterType: 'select',
    hideable: true,
    filterOptions: [
      { label: 'Stable', value: 'stable' },
      { label: 'Beta', value: 'beta' }
    ]
  },
  {
    accessorKey: 'date',
    label: 'Date',
    filterable: true,
    filterType: 'date',
    sortable: true,
    hideable: true
  }
];

export function DataViewTimelinePointDemo() {
  return (
    <Flex
      direction='column'
      style={{ width: '100%', height: 320, overflow: 'hidden' }}
    >
      <DataView<Release>
        data={releases}
        fields={releaseFields}
        defaultSort={{ name: 'date', order: 'asc' }}
        getRowId={release => release.id}
      >
        <DataView.Toolbar>
          <DataView.Filters />
          <DataView.DisplayControls hideOrdering hideGrouping />
        </DataView.Toolbar>
        <Flex
          direction='column'
          justify='center'
          style={{ flex: 1, overflow: 'hidden', minWidth: 0 }}
        >
          {/* No endField → point markers: the wrapper sizes to its content. */}
          <DataView.Timeline<Release>
            startField='date'
            estimatedRowHeight={28}
            renderCard={row => (
              <Badge
                variant={
                  row.original.channel === 'stable' ? 'accent' : 'neutral'
                }
              >
                {row.original.version}
              </Badge>
            )}
          />
          <DataView.EmptyState>
            <Text>No releases match your filters.</Text>
          </DataView.EmptyState>
        </Flex>
      </DataView>
    </Flex>
  );
}

export function DataViewTimelineDemo() {
  const timelineActions = useRef<TimelineActions | null>(null);
  return (
    <Flex
      direction='column'
      style={{ width: '100%', height: 420, overflow: 'hidden' }}
    >
      <DataView<Task>
        data={tasks}
        fields={taskFields}
        defaultSort={{ name: 'start', order: 'asc' }}
        getRowId={task => task.id}
      >
        <DataView.Toolbar>
          <DataView.Filters />
          <Flex gap={3} align='center'>
            <Button
              size='small'
              variant='outline'
              color='neutral'
              onClick={() => timelineActions.current?.scrollTo('today')}
            >
              Today
            </Button>
            {/* Sort can't move a card horizontally (x is time) and `auto`
                packing is chronological, so Ordering is hidden. Grouping is
                left in: it renders swim-lane sections — try Team or Status. */}
            <DataView.DisplayControls hideOrdering />
          </Flex>
        </DataView.Toolbar>
        {/* Empty state lives inside the flex-1 pane so it centers when the
            timeline renders null. */}
        <Flex
          direction='column'
          justify='center'
          style={{ flex: 1, overflow: 'hidden', minWidth: 0 }}
        >
          <DataView.Timeline<Task>
            startField='start'
            endField='end'
            actionsRef={timelineActions}
            markers={[
              { date: taskDate(12), label: 'Release', variant: 'accent' }
            ]}
            renderCard={(row, context) => (
              <TaskCard task={row.original} context={context} />
            )}
          />
          <DataView.EmptyState>
            <Text>No tasks match your filters.</Text>
          </DataView.EmptyState>
        </Flex>
      </DataView>
    </Flex>
  );
}

/* ── Grouped timeline demo (swim-lane sections) ────────────────────────────
   `group_by` in the query is the only wiring grouping needs — the timeline
   consumes the same group rows `DataView.List` renders as section headers, so
   labels, order, and counts match between the two views. Packing runs per
   section, and each band pins under the axis while its section is in view. */

export function DataViewTimelineGroupingDemo() {
  return (
    <Flex
      direction='column'
      style={{ width: '100%', height: 460, overflow: 'hidden' }}
    >
      <DataView<Task>
        data={tasks}
        fields={taskFields}
        defaultSort={{ name: 'start', order: 'asc' }}
        query={{ group_by: ['team'] }}
        getRowId={task => task.id}
      >
        <DataView.Toolbar>
          <DataView.Filters />
          <DataView.DisplayControls hideOrdering />
        </DataView.Toolbar>
        <Flex
          direction='column'
          justify='center'
          style={{ flex: 1, overflow: 'hidden', minWidth: 0 }}
        >
          <DataView.Timeline<Task>
            startField='start'
            endField='end'
            renderCard={(row, context) => (
              <TaskCard task={row.original} context={context} />
            )}
          />
          <DataView.EmptyState>
            <Text>No tasks match your filters.</Text>
          </DataView.EmptyState>
        </Flex>
      </DataView>
    </Flex>
  );
}

/* ── Timeline sort-value lane demo (lanePacking="one-per-sort-value") ────────────── */

export function DataViewTimelineSortValueLaneDemo() {
  return (
    <Flex
      direction='column'
      style={{ width: '100%', height: 460, overflow: 'hidden' }}
    >
      <DataView<Task>
        data={tasks}
        fields={taskFields}
        // The sort defines the lanes: rank asc → High, Medium, Low.
        defaultSort={{ name: 'rank', order: 'asc' }}
        getRowId={task => task.id}
      >
        <DataView.Toolbar>
          <DataView.Filters />
          {/* Ordering stays visible — it repositions and rebuilds lanes. */}
          <DataView.DisplayControls />
        </DataView.Toolbar>
        <Flex
          direction='column'
          justify='center'
          style={{ flex: 1, overflow: 'hidden', minWidth: 0 }}
        >
          <DataView.Timeline<Task>
            startField='start'
            endField='end'
            lanePacking='one-per-sort-value'
            renderCard={(row, context) => (
              <TaskCard task={row.original} context={context} />
            )}
          />
          <DataView.EmptyState>
            <Text>No tasks match your filters.</Text>
          </DataView.EmptyState>
        </Flex>
      </DataView>
    </Flex>
  );
}
