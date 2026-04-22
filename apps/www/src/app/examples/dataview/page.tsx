/** biome-ignore-all lint/suspicious/noShadowRestrictedNames: TODO: look into this later */
'use client';

import { CalendarIcon } from '@radix-ui/react-icons';
import {
  Avatar,
  AvatarGroup,
  Badge,
  Chip,
  DataView,
  type DataViewField,
  type DataViewListColumn,
  type DataViewTableColumn,
  EmptyState,
  Flex,
  IconButton,
  Navbar,
  Sidebar,
  Tabs,
  Text
} from '@raystack/apsara';
import { BellIcon, FilterIcon, SidebarIcon } from '@raystack/apsara/icons';
import { useState } from 'react';

type ProfileCell = { row: { original: Profile } };

type Profile = {
  id: string;
  name: string;
  subheading: string;
  role: 'Admin' | 'User' | 'Manager';
  label: string;
  status: 'Active' | 'Away' | 'Offline';
  collaborators: { id: string; name: string }[];
  team: string;
  updatedAt: string;
};

const profiles: Profile[] = [
  {
    id: '1',
    name: 'Alice Cooper',
    subheading: 'alice@example.com',
    role: 'Admin',
    label: 'Platform Lead',
    status: 'Active',
    collaborators: [
      { id: 'c1', name: 'Bob' },
      { id: 'c2', name: 'Carol' },
      { id: 'c3', name: 'Dan' }
    ],
    team: 'Frontend',
    updatedAt: '2024-02-15'
  },
  {
    id: '2',
    name: 'Bob Nguyen',
    subheading: 'bob@example.com',
    role: 'User',
    label: 'Designer',
    status: 'Active',
    collaborators: [
      { id: 'c4', name: 'Eve' },
      { id: 'c5', name: 'Grace' }
    ],
    team: 'Design',
    updatedAt: '2024-03-01'
  },
  {
    id: '3',
    name: 'Carol Park',
    subheading: 'carol@example.com',
    role: 'Manager',
    label: 'Backend Mgr',
    status: 'Active',
    collaborators: [
      { id: 'c6', name: 'Henry' },
      { id: 'c7', name: 'Ryan' },
      { id: 'c8', name: 'Wendy' },
      { id: 'c9', name: 'Leo' }
    ],
    team: 'Backend',
    updatedAt: '2024-01-22'
  },
  {
    id: '4',
    name: 'Dave Sanders',
    subheading: 'dave@example.com',
    role: 'User',
    label: 'Sales AE',
    status: 'Away',
    collaborators: [{ id: 'c10', name: 'Paul' }],
    team: 'Sales East',
    updatedAt: '2024-02-28'
  },
  {
    id: '5',
    name: 'Eve Okafor',
    subheading: 'eve@example.com',
    role: 'Admin',
    label: 'Eng Lead',
    status: 'Active',
    collaborators: [
      { id: 'c11', name: 'Uma' },
      { id: 'c12', name: 'Jack' }
    ],
    team: 'Frontend',
    updatedAt: '2024-03-10'
  },
  {
    id: '6',
    name: 'Frank Liu',
    subheading: 'frank@example.com',
    role: 'User',
    label: 'Support',
    status: 'Active',
    collaborators: [],
    team: 'Tier 1',
    updatedAt: '2024-03-04'
  },
  {
    id: '7',
    name: 'Grace Romero',
    subheading: 'grace@example.com',
    role: 'Manager',
    label: 'Design Mgr',
    status: 'Active',
    collaborators: [
      { id: 'c13', name: 'Bob' },
      { id: 'c14', name: 'Mia' },
      { id: 'c15', name: 'Tom' }
    ],
    team: 'Design',
    updatedAt: '2024-02-02'
  },
  {
    id: '8',
    name: 'Henry Becker',
    subheading: 'henry@example.com',
    role: 'Admin',
    label: 'SRE',
    status: 'Offline',
    collaborators: [
      { id: 'c16', name: 'Carol' },
      { id: 'c17', name: 'Amy' }
    ],
    team: 'DevOps',
    updatedAt: '2024-01-11'
  },
  {
    id: '9',
    name: 'Ivy Chen',
    subheading: 'ivy@example.com',
    role: 'User',
    label: 'Content Writer',
    status: 'Active',
    collaborators: [{ id: 'c18', name: 'Quinn' }],
    team: 'Content',
    updatedAt: '2024-03-08'
  },
  {
    id: '10',
    name: 'Jack Patel',
    subheading: 'jack@example.com',
    role: 'User',
    label: 'Frontend Eng',
    status: 'Active',
    collaborators: [
      { id: 'c19', name: 'Alice' },
      { id: 'c20', name: 'Eve' },
      { id: 'c21', name: 'Olivia' }
    ],
    team: 'Frontend',
    updatedAt: '2024-02-20'
  },
  {
    id: '11',
    name: 'Kate Rhodes',
    subheading: 'kate@example.com',
    role: 'Manager',
    label: 'Sales Mgr',
    status: 'Active',
    collaborators: [
      { id: 'c22', name: 'Victor' },
      { id: 'c23', name: 'Dave' }
    ],
    team: 'Sales West',
    updatedAt: '2024-01-30'
  },
  {
    id: '12',
    name: 'Leo Braganza',
    subheading: 'leo@example.com',
    role: 'Admin',
    label: 'DevOps Lead',
    status: 'Active',
    collaborators: [
      { id: 'c24', name: 'Amy' },
      { id: 'c25', name: 'Henry' }
    ],
    team: 'DevOps',
    updatedAt: '2024-02-11'
  }
];

const STATUS_COLOR: Record<
  Profile['status'],
  'success' | 'warning' | 'neutral'
> = {
  Active: 'success',
  Away: 'warning',
  Offline: 'neutral'
};

// Cell renderers shared between Table and List renderers.
const renderNameCell = ({ row }: ProfileCell) => (
  <Flex align='center' gap={3} style={{ minWidth: 0 }}>
    <Avatar fallback={row.original.name.charAt(0)} size={5} />
    <Flex direction='column' style={{ minWidth: 0 }}>
      <Text size={3} weight='medium'>
        {row.original.name}
      </Text>
      <Text size={2} variant='secondary'>
        {row.original.subheading}
      </Text>
    </Flex>
  </Flex>
);

const renderEmailCell = ({ row }: ProfileCell) => (
  <Text size={2} variant='secondary'>
    {row.original.subheading}
  </Text>
);

const renderRoleCell = ({ row }: ProfileCell) => (
  <Badge variant='neutral'>{row.original.role}</Badge>
);

const renderLabelCell = ({ row }: ProfileCell) => (
  <Chip variant='outline' size='small' color='neutral'>
    {row.original.label}
  </Chip>
);

const renderTeamCell = ({ row }: ProfileCell) => (
  <Text size={2} variant='secondary'>
    {row.original.team}
  </Text>
);

const renderStatusCell = ({ row }: ProfileCell) => {
  const status = row.original.status;
  return <Badge variant={STATUS_COLOR[status]}>{status}</Badge>;
};

const renderCollaboratorsCell = ({ row }: ProfileCell) => {
  const collaborators = row.original.collaborators;
  if (!collaborators.length) {
    return (
      <Text size={2} variant='secondary'>
        —
      </Text>
    );
  }
  return (
    <AvatarGroup max={3}>
      {collaborators.map(c => (
        <Avatar key={c.id} fallback={c.name.charAt(0)} size={4} />
      ))}
    </AvatarGroup>
  );
};

const renderUpdatedAtCell = ({ row }: ProfileCell) => (
  <Text size={2} variant='secondary'>
    {row.original.updatedAt}
  </Text>
);

// Renderer-agnostic metadata — drives filters, sort, group, visibility across
// every renderer (Table, List, Timeline, …).
const fields: DataViewField<Profile>[] = [
  {
    accessorKey: 'name',
    label: 'Name',
    filterable: true,
    filterType: 'string',
    sortable: true,
    hideable: false
  },
  {
    accessorKey: 'subheading',
    label: 'Email',
    filterable: true,
    filterType: 'string',
    hideable: true
  },
  {
    accessorKey: 'role',
    label: 'Role',
    filterable: true,
    filterType: 'select',
    groupable: true,
    hideable: true,
    showGroupCount: true,
    filterOptions: [
      { value: 'Admin', label: 'Admin' },
      { value: 'User', label: 'User' },
      { value: 'Manager', label: 'Manager' }
    ]
  },
  {
    accessorKey: 'label',
    label: 'Label',
    filterable: true,
    filterType: 'string',
    hideable: true
  },
  {
    accessorKey: 'team',
    label: 'Team',
    filterable: true,
    filterType: 'string',
    groupable: true,
    hideable: true
  },
  {
    accessorKey: 'status',
    label: 'Status',
    filterable: true,
    filterType: 'select',
    groupable: true,
    hideable: true,
    filterOptions: [
      { value: 'Active', label: 'Active' },
      { value: 'Away', label: 'Away' },
      { value: 'Offline', label: 'Offline' }
    ]
  },
  {
    accessorKey: 'collaborators',
    label: 'Collaborators',
    hideable: true
  },
  {
    accessorKey: 'updatedAt',
    label: 'Updated',
    filterable: true,
    filterType: 'date',
    sortable: true,
    hideable: true
  }
];

// Table renderer spec — pairs a cell renderer to each field that should
// appear as a table column.
const tableColumns: DataViewTableColumn<Profile>[] = [
  { accessorKey: 'name', cell: renderNameCell },
  { accessorKey: 'subheading', cell: renderEmailCell },
  { accessorKey: 'role', cell: renderRoleCell },
  { accessorKey: 'label', cell: renderLabelCell },
  { accessorKey: 'team', cell: renderTeamCell },
  { accessorKey: 'status', cell: renderStatusCell },
  { accessorKey: 'collaborators', cell: renderCollaboratorsCell },
  { accessorKey: 'updatedAt', cell: renderUpdatedAtCell }
];

// List renderer spec — composes Name+Email into a single cell and omits
// fields it doesn't show. Each column gets its own grid track width.
const listColumns: DataViewListColumn<Profile>[] = [
  {
    accessorKey: 'name',
    cell: renderNameCell,
    width: 'minmax(240px, 1.5fr)'
  },
  {
    accessorKey: 'label',
    cell: renderLabelCell,
    width: 'minmax(160px, 1fr)'
  },
  {
    accessorKey: 'team',
    cell: renderTeamCell,
    width: 'minmax(140px, 1fr)'
  },
  {
    accessorKey: 'collaborators',
    cell: renderCollaboratorsCell,
    width: 'auto'
  },
  {
    accessorKey: 'status',
    cell: renderStatusCell,
    width: '120px'
  }
];

const STATUS_DOT_COLOR: Record<Profile['status'], string> = {
  Active: 'var(--rs-color-foreground-success-primary, #16a34a)',
  Away: 'var(--rs-color-foreground-attention-primary, #d97706)',
  Offline: 'var(--rs-color-foreground-base-tertiary, #9ca3af)'
};

function StatusRing({ status }: { status: Profile['status'] }) {
  const color = STATUS_DOT_COLOR[status];
  return (
    <div
      style={{
        width: 8,
        height: 8,
        backgroundColor: color,
        borderRadius: '100%'
      }}
    />
  );
}

function ProfileCard({ profile }: { profile: Profile }) {
  return (
    <Flex
      direction='column'
      gap={3}
      style={{
        border: '1px solid var(--rs-color-border-base-primary, #e5e7eb)',
        borderRadius: '8px',
        padding: '12px 16px',
        backgroundColor: 'var(--rs-color-background-base-primary)'
      }}
    >
      <Flex align='center' gap={3} style={{ minWidth: 0 }}>
        <DataView.DisplayAccess accessorKey='status'>
          <StatusRing status={profile.status} />
        </DataView.DisplayAccess>
        <DataView.DisplayAccess accessorKey='name'>
          <Text
            size={4}
            weight='medium'
            style={{
              flex: 1,
              minWidth: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {profile.name}
          </Text>
        </DataView.DisplayAccess>
        <DataView.DisplayAccess accessorKey='role'>
          <Text size={2} variant='secondary'>
            {profile.role}
          </Text>
        </DataView.DisplayAccess>
      </Flex>
      <Flex align='center' gap={3} style={{ minWidth: 0 }}>
        <DataView.DisplayAccess accessorKey='updatedAt'>
          <Chip
            variant='outline'
            size='small'
            color='neutral'
            leadingIcon={<CalendarIcon />}
          >
            Updated {profile.updatedAt}
          </Chip>
        </DataView.DisplayAccess>
        <DataView.DisplayAccess accessorKey='team'>
          <Text
            size={2}
            variant='secondary'
            style={{
              minWidth: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {profile.team}
          </Text>
        </DataView.DisplayAccess>
      </Flex>
    </Flex>
  );
}

type ViewMode = 'table' | 'list' | 'custom';

const Page = () => {
  const [navbarSearch, setNavbarSearch] = useState('');
  const [view, setView] = useState<ViewMode>('table');

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
            <IconButton size={4} onClick={() => {}} aria-label='Logo'>
              <BellIcon width={24} height={24} />
            </IconButton>
            <Text size={4} weight='medium'>
              Raystack
            </Text>
          </Flex>
        </Sidebar.Header>
        <Sidebar.Main>
          <Sidebar.Item href='/examples' active leadingIcon={<BellIcon />}>
            Examples
          </Sidebar.Item>
          <Sidebar.Item
            href='/examples/dataview-list'
            leadingIcon={<SidebarIcon />}
          >
            DataView · People
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
        <Navbar>
          <Navbar.Start>
            <Text size='regular' weight='medium'>
              DataView · People directory
            </Text>
          </Navbar.Start>
          <Navbar.Center>
            <Tabs
              value={view}
              onValueChange={v => setView(v as ViewMode)}
              size='small'
              style={{ width: '400px' }}
            >
              <Tabs.List>
                <Tabs.Tab value='table'>Table View</Tabs.Tab>
                <Tabs.Tab value='list'>List View</Tabs.Tab>
                <Tabs.Tab value='custom'>Custom View</Tabs.Tab>
              </Tabs.List>
            </Tabs>
          </Navbar.Center>
        </Navbar>

        <Flex
          direction='column'
          style={{
            flex: 1,
            overflow: 'auto',
            padding: '24px',
            minWidth: 0
          }}
        >
          <DataView<Profile>
            data={profiles}
            fields={fields}
            mode='client'
            defaultSort={{ name: 'name', order: 'asc' }}
            getRowId={(row: Profile) => row.id}
          >
            <Flex gap={4} direction='column'>
              <DataView.Search placeholder='Search people' />
              <DataView.Toolbar />
            </Flex>
            {view === 'table' && (
              <DataView.Table
                columns={tableColumns}
                emptyState={
                  <EmptyState
                    icon={<FilterIcon />}
                    heading='No matching people'
                    variant='empty1'
                    subHeading='Try adjusting your filters or search.'
                  />
                }
              />
            )}
            {view === 'list' && (
              <DataView.List
                columns={listColumns}
                rowHeight={72}
                showDividers
                showGroupHeaders
                emptyState={
                  <EmptyState
                    icon={<FilterIcon />}
                    heading='No matching people'
                    variant='empty1'
                    subHeading='Try adjusting your filters or search.'
                  />
                }
              />
            )}
            {view === 'custom' && (
              <DataView.Renderer<Profile>>
                {({ table }) => {
                  const rows = table
                    .getRowModel()
                    .rows.filter(r => !r.subRows?.length);
                  if (!rows.length) {
                    return (
                      <EmptyState
                        icon={<FilterIcon />}
                        heading='No matching people'
                        variant='empty1'
                        subHeading='Try adjusting your filters or search.'
                      />
                    );
                  }
                  return (
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          'repeat(auto-fill, minmax(320px, 1fr))',
                        gap: '12px'
                      }}
                    >
                      {rows.map(row => (
                        <ProfileCard key={row.id} profile={row.original} />
                      ))}
                    </div>
                  );
                }}
              </DataView.Renderer>
            )}
          </DataView>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Page;
