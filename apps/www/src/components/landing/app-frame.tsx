'use client';

import {
  Amount,
  Avatar,
  AvatarGroup,
  Badge,
  Breadcrumb,
  Button,
  IconButton,
  Progress,
  Search,
  Select,
  Table,
  Text
} from '@raystack/apsara';
import {
  Bell,
  Building2,
  ChartNoAxesColumn,
  Download,
  FolderKanban,
  LayoutDashboard,
  Plus,
  Settings,
  SlidersHorizontal,
  Users
} from 'lucide-react';
import { useState } from 'react';
import styles from './landing.module.css';

type Status = 'active' | 'trial' | 'churned' | 'paused';

const STATUS_VARIANT: Record<
  Status,
  'success' | 'accent' | 'danger' | 'neutral'
> = {
  active: 'success',
  trial: 'accent',
  churned: 'danger',
  paused: 'neutral'
};

const ROWS: Array<{
  name: string;
  initials: string;
  color: 'indigo' | 'orange' | 'mint' | 'sky' | 'purple' | 'gold';
  plan: string;
  status: Status;
  seats: number;
  usage: number;
  mrr: number;
}> = [
  {
    name: 'Halcyon Labs',
    initials: 'HL',
    color: 'indigo',
    plan: 'Enterprise',
    status: 'active',
    seats: 240,
    usage: 82,
    mrr: 1240000
  },
  {
    name: 'Meridian',
    initials: 'ME',
    color: 'orange',
    plan: 'Team',
    status: 'trial',
    seats: 18,
    usage: 46,
    mrr: 0
  },
  {
    name: 'Northwind Freight',
    initials: 'NF',
    color: 'mint',
    plan: 'Team',
    status: 'active',
    seats: 64,
    usage: 61,
    mrr: 312000
  },
  {
    name: 'Ostrava Studio',
    initials: 'OS',
    color: 'sky',
    plan: 'Starter',
    status: 'paused',
    seats: 6,
    usage: 12,
    mrr: 9900
  },
  {
    name: 'Pilgrim & Co',
    initials: 'PC',
    color: 'purple',
    plan: 'Enterprise',
    status: 'churned',
    seats: 120,
    usage: 0,
    mrr: 0
  }
];

const SIDE_ITEMS = [
  { icon: LayoutDashboard, label: 'Overview' },
  { icon: Building2, label: 'Customers', active: true },
  { icon: FolderKanban, label: 'Projects' },
  { icon: ChartNoAxesColumn, label: 'Usage' },
  { icon: Users, label: 'Members' }
];

/**
 * The application in the hero drawing. Nothing here is a screenshot: it is a
 * real page composed from the components further down, so the theme lab
 * re-inks it along with everything else.
 */
export default function AppFrame() {
  const [query, setQuery] = useState('');
  const [plan, setPlan] = useState('all');

  const visible = ROWS.filter(row => {
    const matchesQuery = row.name.toLowerCase().includes(query.toLowerCase());
    const matchesPlan = plan === 'all' || row.plan.toLowerCase() === plan;
    return matchesQuery && matchesPlan;
  });

  const activeMrr = ROWS.filter(r => r.status === 'active').reduce(
    (sum, r) => sum + r.mrr,
    0
  );

  return (
    <div className={styles.window} aria-label='Example application'>
      <div className={styles.windowBar}>
        <div className={styles.windowDots} aria-hidden>
          <span />
          <span />
          <span />
        </div>
        <div className={styles.windowUrl}>
          <span>console.example.com/customers</span>
        </div>
        <IconButton size={2} aria-label='Notifications'>
          <Bell size={14} strokeWidth={1.5} />
        </IconButton>
      </div>

      <aside className={styles.windowSide}>
        <p className={`${styles.label} ${styles.sideGroup}`}>Workspace</p>
        {SIDE_ITEMS.map(item => (
          <div
            key={item.label}
            className={`${styles.sideItem} ${
              item.active ? styles.sideItemActive : ''
            }`}
          >
            <item.icon size={14} strokeWidth={1.5} />
            {item.label}
          </div>
        ))}
        <p className={`${styles.label} ${styles.sideGroup}`}>Account</p>
        <div className={styles.sideItem}>
          <Settings size={14} strokeWidth={1.5} />
          Settings
        </div>
        <div className={styles.sideFoot}>
          <Avatar size={3} fallback='RS' color='indigo' radius='full' />
          <div>
            <Text size='small' weight='medium' render={<p />}>
              Raystack
            </Text>
            <Text size='mini' variant='tertiary' render={<p />}>
              Owner
            </Text>
          </div>
        </div>
      </aside>

      <div className={styles.windowMain}>
        <div className={styles.windowHead}>
          <Breadcrumb size='small'>
            <Breadcrumb.Item href='#'>Workspace</Breadcrumb.Item>
            <Breadcrumb.Separator />
            <Breadcrumb.Item current>Customers</Breadcrumb.Item>
          </Breadcrumb>
          <div className={styles.row}>
            <AvatarGroup max={3}>
              <Avatar size={2} fallback='AK' color='orange' radius='full' />
              <Avatar size={2} fallback='JD' color='mint' radius='full' />
              <Avatar size={2} fallback='MP' color='sky' radius='full' />
              <Avatar size={2} fallback='LT' color='purple' radius='full' />
            </AvatarGroup>
            <Button
              size='small'
              variant='outline'
              color='neutral'
              leadingIcon={<Download size={12} strokeWidth={1.5} />}
            >
              Export
            </Button>
            <Button
              size='small'
              leadingIcon={<Plus size={12} strokeWidth={1.5} />}
            >
              New customer
            </Button>
          </div>
        </div>

        <div className={styles.windowToolbar}>
          <Search
            size='small'
            placeholder='Search customers'
            value={query}
            onChange={e => setQuery(e.target.value)}
            onClear={() => setQuery('')}
            showClearButton
          />
          <Select value={plan} onValueChange={setPlan}>
            <Select.Trigger size='small'>
              <Select.Value placeholder='Plan' />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value='all'>All plans</Select.Item>
              <Select.Item value='enterprise'>Enterprise</Select.Item>
              <Select.Item value='team'>Team</Select.Item>
              <Select.Item value='starter'>Starter</Select.Item>
            </Select.Content>
          </Select>
          <Button
            size='small'
            variant='ghost'
            color='neutral'
            leadingIcon={<SlidersHorizontal size={12} strokeWidth={1.5} />}
          >
            Filters
          </Button>
        </div>

        <div className={styles.windowBody}>
          <div className={styles.kpis}>
            <div className={styles.kpi}>
              <span className={styles.label}>Active MRR</span>
              <div className={styles.kpiRow}>
                <span className={styles.kpiValue}>
                  <Amount value={activeMrr} hideDecimals />
                </span>
                <Badge variant='success' size='micro'>
                  +4.2%
                </Badge>
              </div>
            </div>
            <div className={styles.kpi}>
              <span className={styles.label}>Customers</span>
              <div className={styles.kpiRow}>
                <span className={styles.kpiValue}>{ROWS.length}</span>
                <Badge variant='neutral' size='micro'>
                  {ROWS.filter(r => r.status === 'trial').length} on trial
                </Badge>
              </div>
            </div>
            <div className={styles.kpi}>
              <span className={styles.label}>Seats in use</span>
              <div className={styles.kpiRow}>
                <span className={styles.kpiValue}>
                  {ROWS.reduce((s, r) => s + r.seats, 0)}
                </span>
                <Badge variant='warning' size='micro'>
                  2 near limit
                </Badge>
              </div>
            </div>
          </div>

          <div className={styles.tableWrap}>
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.Head>Customer</Table.Head>
                  <Table.Head>Plan</Table.Head>
                  <Table.Head>Status</Table.Head>
                  <Table.Head>Usage</Table.Head>
                  <Table.Head>MRR</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {visible.map(row => (
                  <Table.Row key={row.name} interactive>
                    <Table.Cell>
                      <span className={styles.cellName}>
                        <Avatar
                          size={2}
                          fallback={row.initials}
                          color={row.color}
                        />
                        <Text size='small' weight='medium'>
                          {row.name}
                        </Text>
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size='small' variant='secondary'>
                        {row.plan}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge variant={STATUS_VARIANT[row.status]} size='micro'>
                        {row.status}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <span className={styles.cellProgress}>
                        <Progress value={row.usage} />
                        <span className={styles.mono}>{row.usage}%</span>
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <span className={styles.mono}>
                        <Amount value={row.mrr} hideDecimals />
                      </span>
                    </Table.Cell>
                  </Table.Row>
                ))}
                {visible.length === 0 && (
                  <Table.Row>
                    <Table.Cell colSpan={5}>
                      <Text size='small' variant='tertiary'>
                        No customers match “{query}”.
                      </Text>
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
