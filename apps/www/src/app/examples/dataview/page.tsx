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
  EmptyState,
  Flex,
  getAvatarColor,
  IconButton,
  Indicator,
  Navbar,
  Sidebar,
  Text
} from '@raystack/apsara';
import { BellIcon, FilterIcon, SidebarIcon } from '@raystack/apsara/icons';

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

// Cell renderers shared between Table and List variants of DataView.List.
const renderNameCell = ({ row }: ProfileCell) => (
  <Flex align='center' gap={3} style={{ minWidth: 0 }}>
    <Avatar
      fallback={row.original.name.charAt(0)}
      size={5}
      radius='full'
      color={getAvatarColor(row.original.name)}
    />
    <Flex direction='column' style={{ minWidth: 0 }}>
      <Text size='small' weight='medium'>
        {row.original.name}
      </Text>
      <Text size='small' variant='secondary'>
        {row.original.subheading}
      </Text>
    </Flex>
  </Flex>
);

const renderEmailCell = ({ row }: ProfileCell) => (
  <Text size='small' variant='secondary'>
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
  <Text size='small' variant='secondary'>
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
      <Text size='small' variant='secondary'>
        —
      </Text>
    );
  }
  return (
    <AvatarGroup max={3}>
      {collaborators.map(c => (
        <Avatar
          key={c.id}
          fallback={c.name.charAt(0)}
          size={3}
          radius='full'
          color={getAvatarColor(c.name)}
        />
      ))}
    </AvatarGroup>
  );
};

const renderUpdatedAtCell = ({ row }: ProfileCell) => (
  <Text size='small' variant='secondary'>
    {row.original.updatedAt}
  </Text>
);

// Renderer-agnostic metadata — drives filters, sort, group, visibility across
// every renderer (List variants, Custom, …). Declared once on root.
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

// Table presentation of DataView.List — all fields surfaced as columns.
const tableColumns: DataViewListColumn<Profile>[] = [
  { accessorKey: 'name', cell: renderNameCell, width: 'minmax(220px, 1.5fr)' },
  {
    accessorKey: 'subheading',
    cell: renderEmailCell,
    width: 'minmax(200px, 1fr)'
  },
  { accessorKey: 'role', cell: renderRoleCell, width: '120px' },
  { accessorKey: 'label', cell: renderLabelCell, width: 'minmax(140px, 1fr)' },
  { accessorKey: 'team', cell: renderTeamCell, width: 'minmax(120px, 1fr)' },
  { accessorKey: 'status', cell: renderStatusCell, width: '120px' },
  {
    accessorKey: 'collaborators',
    cell: renderCollaboratorsCell,
    width: 'auto'
  },
  { accessorKey: 'updatedAt', cell: renderUpdatedAtCell, width: '140px' }
];

// List presentation of DataView.List — the `1fr` middle track on Name pushes
// trailing metadata to the right edge (justify-between effect via grid).
const listColumns: DataViewListColumn<Profile>[] = [
  { accessorKey: 'name', cell: renderNameCell, width: '1fr' },
  { accessorKey: 'label', cell: renderLabelCell, width: 'auto' },
  { accessorKey: 'team', cell: renderTeamCell, width: 'auto' },
  {
    accessorKey: 'collaborators',
    cell: renderCollaboratorsCell,
    width: 'auto'
  },
  { accessorKey: 'status', cell: renderStatusCell, width: 'auto' }
];

const INDICATOR_COLOR: Record<
  Profile['status'],
  'success' | 'warning' | 'neutral'
> = {
  Active: 'success',
  Away: 'warning',
  Offline: 'neutral'
};

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
          <Indicator variant={INDICATOR_COLOR[profile.status]}>
            <Avatar
              size={4}
              fallback={profile.name.charAt(0)}
              color={getAvatarColor(profile.name)}
            />
          </Indicator>
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
          <Text size='small' variant='secondary'>
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

const Page = () => {
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
            <Text size='regular' weight='medium'>
              Apsara
            </Text>
          </Flex>
        </Sidebar.Header>
        <Sidebar.Main>
          <Sidebar.Item
            href='/examples/dataview'
            leadingIcon={<SidebarIcon />}
            active
          >
            DataView
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
          <Navbar.Center></Navbar.Center>
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
            views={[
              { value: 'table', label: 'Table' },
              { value: 'list', label: 'List' },
              { value: 'custom', label: 'Custom' }
            ]}
            defaultView='table'
          >
            <DataView.Search placeholder='Search people' width={300} />
            <DataView.Toolbar>
              <DataView.Filters />
              <DataView.DisplayControls />
            </DataView.Toolbar>

            {/* Same renderer, two presentations — switched by the view switcher in DisplayControls */}
            <DataView.List
              name='table'
              variant='table'
              columns={tableColumns}
            />
            <DataView.List
              name='list'
              variant='list'
              columns={listColumns}
              rowHeight={72}
              showDividers
              showGroupHeaders
            />

            <DataView.Custom<Profile> name='custom'>
              {({ table, hasData }) => {
                if (!hasData) return null;
                const rows = table
                  .getRowModel()
                  .rows.filter(r => !r.subRows?.length);
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
            </DataView.Custom>

            {/* Empty/zero state lifted out of renderers — single sibling reads context */}
            <DataView.EmptyState>
              <EmptyState
                icon={<FilterIcon />}
                heading='No matching people'
                variant='empty1'
                subHeading='Try adjusting your filters or search.'
              />
            </DataView.EmptyState>
            <DataView.ZeroState>
              <EmptyState
                icon={<FilterIcon />}
                heading='No people yet'
                variant='empty1'
                subHeading='Add your first teammate to get started.'
              />
            </DataView.ZeroState>
          </DataView>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Page;
