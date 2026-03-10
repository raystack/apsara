'use client';

import {
  Button,
  DataTable,
  EmptyState,
  Flex,
  IconButton,
  Navbar,
  Search,
  Sidebar,
  Text
} from '@raystack/apsara';
import { BellIcon, FilterIcon, SidebarIcon } from '@raystack/apsara/icons';
import { useState } from 'react';

const sampleData = [
  {
    id: '1',
    name: 'Alice',
    email: 'alice@example.com',
    role: 'Admin',
    department: 'Engineering',
    team: 'Frontend',
    location: 'NYC',
    phone: '+1-555-0101',
    status: 'Active',
    joined: '2022-01-15'
  },
  {
    id: '2',
    name: 'Bob',
    email: 'bob@example.com',
    role: 'User',
    department: 'Product',
    team: 'Design',
    location: 'SF',
    phone: '+1-555-0102',
    status: 'Active',
    joined: '2022-03-20'
  },
  {
    id: '3',
    name: 'Carol',
    email: 'carol@example.com',
    role: 'Manager',
    department: 'Engineering',
    team: 'Backend',
    location: 'NYC',
    phone: '+1-555-0103',
    status: 'Active',
    joined: '2021-11-08'
  },
  {
    id: '4',
    name: 'Dave',
    email: 'dave@example.com',
    role: 'User',
    department: 'Sales',
    team: 'East',
    location: 'Boston',
    phone: '+1-555-0104',
    status: 'Away',
    joined: '2023-02-14'
  },
  {
    id: '5',
    name: 'Eve',
    email: 'eve@example.com',
    role: 'Admin',
    department: 'Engineering',
    team: 'Frontend',
    location: 'Remote',
    phone: '+1-555-0105',
    status: 'Active',
    joined: '2020-06-01'
  },
  {
    id: '6',
    name: 'Frank',
    email: 'frank@example.com',
    role: 'User',
    department: 'Support',
    team: 'Tier 1',
    location: 'Austin',
    phone: '+1-555-0106',
    status: 'Active',
    joined: '2023-05-10'
  },
  {
    id: '7',
    name: 'Grace',
    email: 'grace@example.com',
    role: 'Manager',
    department: 'Product',
    team: 'Design',
    location: 'SF',
    phone: '+1-555-0107',
    status: 'Active',
    joined: '2021-09-22'
  },
  {
    id: '8',
    name: 'Henry',
    email: 'henry@example.com',
    role: 'Admin',
    department: 'Engineering',
    team: 'Backend',
    location: 'Seattle',
    phone: '+1-555-0108',
    status: 'Away',
    joined: '2019-12-05'
  },
  {
    id: '9',
    name: 'Ivy',
    email: 'ivy@example.com',
    role: 'User',
    department: 'Marketing',
    team: 'Content',
    location: 'NYC',
    phone: '+1-555-0109',
    status: 'Active',
    joined: '2022-08-30'
  },
  {
    id: '10',
    name: 'Jack',
    email: 'jack@example.com',
    role: 'User',
    department: 'Engineering',
    team: 'Frontend',
    location: 'Remote',
    phone: '+1-555-0110',
    status: 'Active',
    joined: '2023-01-12'
  },
  {
    id: '11',
    name: 'Kate',
    email: 'kate@example.com',
    role: 'Manager',
    department: 'Sales',
    team: 'West',
    location: 'LA',
    phone: '+1-555-0111',
    status: 'Active',
    joined: '2020-04-18'
  },
  {
    id: '12',
    name: 'Leo',
    email: 'leo@example.com',
    role: 'Admin',
    department: 'Engineering',
    team: 'DevOps',
    location: 'NYC',
    phone: '+1-555-0112',
    status: 'Active',
    joined: '2021-07-07'
  },
  {
    id: '13',
    name: 'Mia',
    email: 'mia@example.com',
    role: 'User',
    department: 'Product',
    team: 'Design',
    location: 'Chicago',
    phone: '+1-555-0113',
    status: 'Away',
    joined: '2022-11-25'
  },
  {
    id: '14',
    name: 'Noah',
    email: 'noah@example.com',
    role: 'User',
    department: 'Support',
    team: 'Tier 2',
    location: 'Austin',
    phone: '+1-555-0114',
    status: 'Active',
    joined: '2023-03-03'
  },
  {
    id: '15',
    name: 'Olivia',
    email: 'olivia@example.com',
    role: 'Manager',
    department: 'Engineering',
    team: 'Frontend',
    location: 'SF',
    phone: '+1-555-0115',
    status: 'Active',
    joined: '2020-10-11'
  },
  {
    id: '16',
    name: 'Paul',
    email: 'paul@example.com',
    role: 'Admin',
    department: 'Sales',
    team: 'East',
    location: 'Boston',
    phone: '+1-555-0116',
    status: 'Active',
    joined: '2019-08-19'
  },
  {
    id: '17',
    name: 'Quinn',
    email: 'quinn@example.com',
    role: 'User',
    department: 'Marketing',
    team: 'Growth',
    location: 'Remote',
    phone: '+1-555-0117',
    status: 'Active',
    joined: '2022-05-06'
  },
  {
    id: '18',
    name: 'Ryan',
    email: 'ryan@example.com',
    role: 'User',
    department: 'Engineering',
    team: 'Backend',
    location: 'Seattle',
    phone: '+1-555-0118',
    status: 'Away',
    joined: '2021-02-28'
  },
  {
    id: '19',
    name: 'Sara',
    email: 'sara@example.com',
    role: 'Manager',
    department: 'Support',
    team: 'Tier 1',
    location: 'Austin',
    phone: '+1-555-0119',
    status: 'Active',
    joined: '2020-01-14'
  },
  {
    id: '20',
    name: 'Tom',
    email: 'tom@example.com',
    role: 'Admin',
    department: 'Product',
    team: 'Design',
    location: 'NYC',
    phone: '+1-555-0120',
    status: 'Active',
    joined: '2018-12-01'
  },
  {
    id: '21',
    name: 'Uma',
    email: 'uma@example.com',
    role: 'User',
    department: 'Engineering',
    team: 'Frontend',
    location: 'Remote',
    phone: '+1-555-0121',
    status: 'Active',
    joined: '2023-04-17'
  },
  {
    id: '22',
    name: 'Victor',
    email: 'victor@example.com',
    role: 'User',
    department: 'Sales',
    team: 'West',
    location: 'LA',
    phone: '+1-555-0122',
    status: 'Active',
    joined: '2022-09-09'
  },
  {
    id: '23',
    name: 'Wendy',
    email: 'wendy@example.com',
    role: 'Manager',
    department: 'Engineering',
    team: 'Backend',
    location: 'SF',
    phone: '+1-555-0123',
    status: 'Away',
    joined: '2021-06-21'
  },
  {
    id: '24',
    name: 'Xavier',
    email: 'xavier@example.com',
    role: 'Admin',
    department: 'Marketing',
    team: 'Content',
    location: 'Chicago',
    phone: '+1-555-0124',
    status: 'Active',
    joined: '2019-03-12'
  },
  {
    id: '25',
    name: 'Yara',
    email: 'yara@example.com',
    role: 'User',
    department: 'Product',
    team: 'Design',
    location: 'Remote',
    phone: '+1-555-0125',
    status: 'Active',
    joined: '2022-07-04'
  },
  {
    id: '26',
    name: 'Zane',
    email: 'zane@example.com',
    role: 'User',
    department: 'Support',
    team: 'Tier 2',
    location: 'Austin',
    phone: '+1-555-0126',
    status: 'Active',
    joined: '2023-02-22'
  },
  {
    id: '27',
    name: 'Amy',
    email: 'amy@example.com',
    role: 'Manager',
    department: 'Engineering',
    team: 'DevOps',
    location: 'NYC',
    phone: '+1-555-0127',
    status: 'Active',
    joined: '2020-11-30'
  },
  {
    id: '28',
    name: 'Ben',
    email: 'ben@example.com',
    role: 'Admin',
    department: 'Sales',
    team: 'East',
    location: 'Boston',
    phone: '+1-555-0128',
    status: 'Away',
    joined: '2021-04-05'
  },
  {
    id: '29',
    name: 'Chloe',
    email: 'chloe@example.com',
    role: 'User',
    department: 'Marketing',
    team: 'Growth',
    location: 'SF',
    phone: '+1-555-0129',
    status: 'Active',
    joined: '2022-12-19'
  },
  {
    id: '30',
    name: 'Dan',
    email: 'dan@example.com',
    role: 'User',
    department: 'Engineering',
    team: 'Frontend',
    location: 'Seattle',
    phone: '+1-555-0130',
    status: 'Active',
    joined: '2023-06-08'
  }
];

const columns = [
  {
    accessorKey: 'name',
    header: 'Name',
    enableColumnFilter: true,
    filterType: 'string' as const,
    enableGrouping: true
  },
  {
    accessorKey: 'email',
    header: 'Email',
    enableColumnFilter: true,
    filterType: 'string' as const
  },
  {
    accessorKey: 'role',
    header: 'Role',
    enableColumnFilter: true,
    filterType: 'select' as const,
    enableGrouping: true,
    showGroupCount: true,
    filterOptions: [
      { value: 'Admin', label: 'Admin' },
      { value: 'User', label: 'User' },
      { value: 'Manager', label: 'Manager' }
    ]
  },
  { accessorKey: 'department', header: 'Department' },
  { accessorKey: 'team', header: 'Team' },
  { accessorKey: 'location', header: 'Location' },
  { accessorKey: 'phone', header: 'Phone' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'joined', header: 'Joined' },
  { accessorKey: 'name', id: 'name_2', header: 'Name (2)' },
  { accessorKey: 'email', id: 'email_2', header: 'Email (2)' },
  { accessorKey: 'role', id: 'role_2', header: 'Role (2)' },
  { accessorKey: 'department', id: 'dept_2', header: 'Department (2)' },
  { accessorKey: 'team', id: 'team_2', header: 'Team (2)' },
  { accessorKey: 'location', id: 'loc_2', header: 'Location (2)' },
  { accessorKey: 'phone', id: 'phone_2', header: 'Phone (2)' },
  { accessorKey: 'status', id: 'status_2', header: 'Status (2)' },
  { accessorKey: 'joined', id: 'joined_2', header: 'Joined (2)' },
  { accessorKey: 'name', id: 'name_3', header: 'Name (3)' },
  { accessorKey: 'email', id: 'email_3', header: 'Email (3)' },
  { accessorKey: 'role', id: 'role_3', header: 'Role (3)' }
];

const PAGE_SIZE = 10;
const MAX_ROWS = 50;

const Page = () => {
  const [navbarSearch, setNavbarSearch] = useState('');
  const [data, setData] = useState(() => sampleData.slice(0, PAGE_SIZE));
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = (): Promise<void> => {
    if (loading || !hasMore) return Promise.resolve();
    setLoading(true);
    return new Promise(resolve => {
      setTimeout(() => {
        setData(prev => {
          const next = sampleData.slice(prev.length, prev.length + PAGE_SIZE);
          if (next.length < PAGE_SIZE) setHasMore(false);
          return prev.length + next.length <= MAX_ROWS
            ? [...prev, ...next]
            : prev;
        });
        setLoading(false);
        resolve();
      }, 500);
    });
  };

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
            href='/examples/datatable'
            leadingIcon={<SidebarIcon />}
          >
            DataTable
          </Sidebar.Item>
          <Sidebar.Group label='Resources' leadingIcon={<FilterIcon />}>
            <Sidebar.Item href='#'>Reports</Sidebar.Item>
            <Sidebar.Item href='#'>Activities</Sidebar.Item>
          </Sidebar.Group>
          <Sidebar.Group label='Account'>
            <Sidebar.Item href='#'>Settings</Sidebar.Item>
            <Sidebar.Item href='#'>Notifications</Sidebar.Item>
          </Sidebar.Group>
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
              DataTable – Infinite scroll
            </Text>
          </Navbar.Start>
          <Navbar.End>
            <Search
              placeholder='Search'
              value={navbarSearch}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNavbarSearch(e.target.value)
              }
              onClear={() => setNavbarSearch('')}
              size='small'
              style={{ width: '200px' }}
            />
            <Button variant='outline' size='small' leadingIcon={<FilterIcon />}>
              Actions
            </Button>
          </Navbar.End>
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
          <DataTable
            data={data}
            columns={columns}
            mode='server'
            isLoading={loading}
            onLoadMore={loadMore}
            defaultSort={{ name: 'name', order: 'asc' }}
            stickyGroupHeader
          >
            <DataTable.Toolbar />
            <DataTable.Search />
            <DataTable.Content
              emptyState={
                <EmptyState
                  icon={<FilterIcon />}
                  heading='No results'
                  variant='empty1'
                  subHeading='Try adjusting your filters or search.'
                />
              }
            />
          </DataTable>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Page;
