'use client';
import {
  ActivityLogIcon,
  BarChartIcon,
  DashboardIcon,
  DotsHorizontalIcon,
  FileTextIcon,
  GearIcon,
  HomeIcon,
  MixerHorizontalIcon,
  PersonIcon,
  QuestionMarkCircledIcon,
  BellIcon as RadixBellIcon
} from '@radix-ui/react-icons';
import {
  Amount,
  Avatar,
  AvatarGroup,
  Breadcrumb,
  Button,
  Calendar,
  Callout,
  DataTable,
  DatePicker,
  Dialog,
  Drawer,
  EmptyState,
  Flex,
  IconButton,
  Indicator,
  Input,
  Menu,
  Navbar,
  Popover,
  RangePicker,
  ScrollArea,
  Search,
  Select,
  Sidebar,
  Spinner,
  Tabs,
  Text,
  TextArea,
  Tooltip
} from '@raystack/apsara';
import dayjs from 'dayjs';
import React, { useState } from 'react';

/** Kitchen-sink examples route rendering Apsara components for manual QA. */
const Page = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [nestedDialogOpen, setNestedDialogOpen] = useState(false);
  const [dialogDrawerOpen, setDialogDrawerOpen] = useState(false);
  const [dialogSheetOpen, setDialogSheetOpen] = useState(false);
  const [search1, setSearch1] = useState('');
  const [search2, setSearch2] = useState('');
  const [search3, setSearch3] = useState('');
  const [search4, setSearch4] = useState('');
  const [selectValue, setSelectValue] = useState('');
  const [selectValue1, setSelectValue1] = useState('');
  const [selectValue2, setSelectValue2] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [calloutDismissed, setCalloutDismissed] = useState(false);
  const [rangeValue, setRangeValue] = useState({
    from: dayjs('2027-11-15').toDate(),
    to: dayjs('2027-12-10').toDate()
  });

  // Sample options data with icons
  const selectOptions = [
    { value: 'dashboard', label: 'Dashboard', icon: <RadixBellIcon /> },
    { value: 'analytics', label: 'Analytics', icon: <MixerHorizontalIcon /> },
    { value: 'settings', label: 'Settings', icon: <PersonIcon /> },
    { value: 'profile', label: 'Profile', icon: <DashboardIcon /> }
  ];

  const filterOptions = [
    { value: 'Option 1', label: 'Option 1', icon: <RadixBellIcon /> },
    { value: 'Option 2', label: 'Option 2', icon: <MixerHorizontalIcon /> },
    { value: 'Option 3', label: 'Option 3', icon: <PersonIcon /> }
  ];

  return (
    <>
      <Flex
        style={{
          height: 'calc(100vh - 60px)',
          backgroundColor: 'var(--rs-color-background-base-primary)'
        }}
      >
        <Sidebar defaultOpen variant='plain'>
          <Sidebar.Header>
            <Flex align='center' gap={3}>
              <IconButton
                size={4}
                onClick={() => console.log('Logo clicked')}
                aria-label='Logo'
              >
                <RadixBellIcon width={24} height={24} />
              </IconButton>
              <Text size='regular' weight='medium'>
                Raystack
              </Text>
            </Flex>
          </Sidebar.Header>

          <Sidebar.Main>
            <Sidebar.Item href='#' active leadingIcon={<HomeIcon />}>
              Dashboard
            </Sidebar.Item>

            <Sidebar.Item href='#' leadingIcon={<BarChartIcon />}>
              Analytics
            </Sidebar.Item>

            <Sidebar.Group
              label='Resources'
              collapsible
              trailingIcon={
                <button
                  type='button'
                  onClick={() => alert('Resources trailing icon clicked')}
                  aria-label='Resources group actions'
                  style={{
                    border: 0,
                    background: 'transparent',
                    color: 'inherit',
                    padding: 0,
                    display: 'inline-flex',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <DotsHorizontalIcon width={16} height={16} />
                </button>
              }
            >
              <Sidebar.Item href='#' leadingIcon={<FileTextIcon />}>
                Reports
              </Sidebar.Item>
              <Sidebar.More label='More'>
                <Sidebar.Item
                  href='#'
                  target='_blank'
                  leadingIcon={<ActivityLogIcon />}
                >
                  Activities
                </Sidebar.Item>
                <Sidebar.Item
                  onClick={() => console.log('Notifications clicked')}
                  leadingIcon={<RadixBellIcon />}
                >
                  Notifications
                </Sidebar.Item>
              </Sidebar.More>
            </Sidebar.Group>

            <Sidebar.Group
              label='Account'
              trailingIcon={
                <button
                  type='button'
                  onClick={() => alert('Account trailing icon clicked')}
                  aria-label='Account group actions'
                  style={{
                    border: 0,
                    background: 'transparent',
                    color: 'inherit',
                    padding: 0,
                    display: 'inline-flex',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <DotsHorizontalIcon width={16} height={16} />
                </button>
              }
            >
              <Sidebar.Item href='#' leadingIcon={<GearIcon />}>
                Settings
              </Sidebar.Item>
              <Sidebar.More leadingIcon={<DotsHorizontalIcon />}>
                <Sidebar.Item href='#' leadingIcon={<RadixBellIcon />}>
                  Notifications
                </Sidebar.Item>
                <Sidebar.Item href='#' leadingIcon={<PersonIcon />} disabled>
                  Billing
                </Sidebar.Item>
              </Sidebar.More>
            </Sidebar.Group>
          </Sidebar.Main>

          <Sidebar.Footer>
            <Sidebar.Item href='#' leadingIcon={<QuestionMarkCircledIcon />}>
              Help & Support
            </Sidebar.Item>
            <Sidebar.More label='More footer'>
              <Sidebar.Item href='#' leadingIcon={<GearIcon />}>
                Preferences
              </Sidebar.Item>
              <Sidebar.Item href='#' leadingIcon={<FileTextIcon />}>
                Documentation
              </Sidebar.Item>
            </Sidebar.More>
          </Sidebar.Footer>
        </Sidebar>

        <Flex
          direction='column'
          style={{
            flex: 1,
            overflow: 'auto'
          }}
        >
          <Navbar sticky>
            <Navbar.Start>
              <Text size='regular' weight='medium'>
                Examples
              </Text>
            </Navbar.Start>
            <Navbar.End>
              <Button variant='ghost' size='small'>
                Home
              </Button>
              <Button variant='ghost' size='small'>
                Docs
              </Button>
            </Navbar.End>
          </Navbar>

          <Flex
            direction='column'
            style={{
              padding: '32px',
              flex: 1
            }}
          >
            <Text size='large' weight='medium' style={{ marginBottom: '24px' }}>
              Main
            </Text>
            <code
              style={{
                fontFamily: 'var(--rs-font-mono)',
                fontSize: 'var(--rs-font-size-regular)',
                lineHeight: 'var(--rs-line-height-regular)',
                maxWidth: '550px',
                padding: '16px'
              }}
            >{`const button = (x>=2 && y!=3)
            const getLoaderOnlyClass = (size) =>
              size === 'small'
                ? styles['loader-only-button-small']
                : styles['loader-only-button-normal'];

            const test = 10 >= 8 : true : false;


            <= < > >= == === !=  !==

            => ==> && || !! ??
            <-- -->  ***  ****
            <!-- -->
            /* comment */ /* ---------- __ */`}</code>

            <Flex direction='column' gap={4} style={{ maxWidth: '550px' }}>
              <Search
                placeholder='Default large search'
                showClearButton
                value={search1}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearch1(e.target.value)
                }
                onClear={() => setSearch1('')}
              />
              <DatePicker
                dateFormat='D MMM YYYY'
                value={dayjs().add(16, 'year').toDate()}
                onSelect={(value: Date) => console.log(value)}
                slotProps={{
                  calendar: {
                    captionLayout: 'dropdown',
                    startMonth: dayjs().add(3, 'month').toDate(),
                    endMonth: dayjs().add(4, 'year').toDate(),
                    disabled: {
                      before: dayjs().add(3, 'month').toDate(),
                      after: dayjs().add(3, 'year').toDate()
                    }
                  },
                  input: {
                    size: 'small'
                  }
                }}
              />

              <RangePicker
                dateFormat='D MMM YYYY'
                value={rangeValue}
                onSelect={range =>
                  setRangeValue({
                    from: range.from ?? new Date(),
                    to: range.to ?? new Date()
                  })
                }
                slotProps={{
                  calendar: {
                    captionLayout: 'dropdown',
                    numberOfMonths: 2,
                    startMonth: dayjs('2024-01-01').toDate(),
                    endMonth: dayjs('2027-12-01').toDate(),
                    defaultMonth: dayjs('2027-11-01').toDate()
                  },
                  startInput: {
                    size: 'small'
                  },
                  endInput: {
                    size: 'small'
                  }
                }}
              />

              <RangePicker
                footer={
                  <Callout style={{ width: '100%' }} type='success'>
                    Some important message in the footer
                  </Callout>
                }
              />

              <DatePicker
                slotProps={{
                  calendar: {
                    captionLayout: 'dropdown'
                  }
                }}
              />

              <Text
                size='large'
                weight='medium'
                style={{ marginTop: '32px', marginBottom: '16px' }}
              >
                Calendar with Date Info (Object)
              </Text>

              <Calendar
                numberOfMonths={2}
                dateInfo={{
                  [dayjs().format('DD-MM-YYYY')]: (
                    <Flex
                      align='center'
                      gap={1}
                      style={{
                        fontSize: '8px',
                        color: 'var(--rs-color-foreground-base-secondary)'
                      }}
                    >
                      <RadixBellIcon style={{ width: '8px', height: '8px' }} />
                      <Text style={{ fontSize: '8px' }} color='secondary'>
                        25%
                      </Text>
                    </Flex>
                  ),
                  [dayjs().add(5, 'day').format('DD-MM-YYYY')]: (
                    <Flex
                      align='center'
                      gap={1}
                      style={{
                        fontSize: '8px',
                        color: 'var(--rs-color-foreground-base-secondary)'
                      }}
                    >
                      <RadixBellIcon style={{ width: '8px', height: '8px' }} />
                      <Text style={{ fontSize: '8px' }} color='secondary'>
                        25%
                      </Text>
                    </Flex>
                  ),
                  [dayjs().add(10, 'day').format('DD-MM-YYYY')]: (
                    <Flex
                      align='center'
                      gap={1}
                      style={{
                        fontSize: '8px',
                        color: 'var(--rs-color-foreground-base-secondary)'
                      }}
                    >
                      <RadixBellIcon style={{ width: '8px', height: '8px' }} />
                      <Text style={{ fontSize: '8px' }} color='secondary'>
                        25%
                      </Text>
                    </Flex>
                  )
                }}
              />

              <Text
                size='large'
                weight='medium'
                style={{ marginTop: '32px', marginBottom: '16px' }}
              >
                Calendar with Date Info (Function)
              </Text>

              <Calendar
                numberOfMonths={2}
                dateInfo={date => {
                  const today = new Date();
                  const isToday =
                    date.getDate() === today.getDate() &&
                    date.getMonth() === today.getMonth() &&
                    date.getFullYear() === today.getFullYear();

                  // Show info on Sundays
                  if (date.getDay() === 0) {
                    return (
                      <Flex
                        align='center'
                        gap={1}
                        style={{
                          fontSize: '8px',
                          color: 'var(--rs-color-foreground-base-secondary)'
                        }}
                      >
                        <RadixBellIcon
                          style={{ width: '8px', height: '8px' }}
                        />
                        <Text style={{ fontSize: '8px' }} color='secondary'>
                          Sun
                        </Text>
                      </Flex>
                    );
                  }

                  // Show info on 15th of any month
                  if (date.getDate() === 15) {
                    return (
                      <Flex
                        align='center'
                        gap={1}
                        style={{
                          fontSize: '8px',
                          color: 'var(--rs-color-foreground-base-secondary)'
                        }}
                      >
                        <RadixBellIcon
                          style={{ width: '8px', height: '8px' }}
                        />
                        <Text style={{ fontSize: '8px' }} color='secondary'>
                          15th
                        </Text>
                      </Flex>
                    );
                  }

                  // Show info for today
                  if (isToday) {
                    return (
                      <Flex
                        align='center'
                        gap={1}
                        style={{
                          fontSize: '8px',
                          color: 'var(--rs-color-foreground-base-secondary)'
                        }}
                      >
                        <RadixBellIcon
                          style={{ width: '8px', height: '8px' }}
                        />
                        <Text style={{ fontSize: '8px' }} color='secondary'>
                          Today
                        </Text>
                      </Flex>
                    );
                  }

                  return null;
                }}
              />

              <Text
                size='large'
                weight='medium'
                style={{ marginTop: '32px', marginBottom: '16px' }}
              >
                Skeleton Examples
              </Text>

              <Tooltip>
                <Tooltip.Trigger
                  render={
                    <Button variant='solid' color='accent'>
                      Hello
                    </Button>
                  }
                />
                <Tooltip.Content>
                  Hello this is a long dummy text that spans multiple lines and
                  is quite lengthy. It is used to demonstrate the functionality
                  of the tooltip component in various scenarios. Hello this is a
                  long dummy text that spans multiple lines and is quite
                  lengthy. It is used to demonstrate the functionality of the
                  tooltip component in various scenarios.
                </Tooltip.Content>
              </Tooltip>

              <Flex gap={2}>
                <Search size='small' />
                <Button variant='outline' color='accent' size='small' loading>
                  Search
                </Button>
                <Input size='small' />
              </Flex>

              {/* Button Examples */}
              <Text
                size='large'
                weight='medium'
                style={{ marginBottom: '16px' }}
              >
                Button Examples - All Combinations
              </Text>

              {/* Solid Variant */}
              <Flex direction='column' gap={4} style={{ marginBottom: '32px' }}>
                <Text weight='medium'>Solid Variant</Text>

                {/* Normal Size */}
                <Flex direction='column' gap={2}>
                  <Text size='small'>Normal Size:</Text>
                  <Flex gap={2} wrap='wrap'>
                    <Button variant='solid' color='accent'>
                      Accent
                    </Button>
                    <Button variant='solid' color='danger'>
                      Danger
                    </Button>
                    <Button variant='solid' color='neutral'>
                      Neutral
                    </Button>
                    <Button variant='solid' color='success'>
                      Success
                    </Button>

                    <Button variant='solid' color='accent' disabled>
                      Accent Disabled
                    </Button>
                    <Button variant='solid' color='danger' disabled>
                      Danger Disabled
                    </Button>
                    <Button variant='solid' color='neutral' disabled>
                      Neutral Disabled
                    </Button>
                    <Button variant='solid' color='success' disabled>
                      Success Disabled
                    </Button>

                    <Button variant='solid' color='accent' loading>
                      Accent Loading
                    </Button>
                    <Button variant='solid' color='danger' loading>
                      Danger Loading
                    </Button>
                    <Button variant='solid' color='neutral' loading>
                      Neutral Loading
                    </Button>
                    <Button variant='solid' color='success' loading>
                      Success Loading
                    </Button>

                    <Button variant='solid' color='accent' loading disabled>
                      Accent Loading Disabled
                    </Button>
                    <Button variant='solid' color='danger' loading disabled>
                      Danger Loading Disabled
                    </Button>
                    <Button variant='solid' color='neutral' loading disabled>
                      Neutral Loading Disabled
                    </Button>
                    <Button variant='solid' color='success' loading disabled>
                      Success Loading Disabled
                    </Button>
                  </Flex>
                </Flex>

                {/* Small Size */}
                <Flex direction='column' gap={2}>
                  <Text size='small'>Small Size:</Text>
                  <Flex gap={2} wrap='wrap'>
                    <Button variant='solid' color='accent' size='small'>
                      Accent
                    </Button>
                    <Button variant='solid' color='danger' size='small'>
                      Danger
                    </Button>
                    <Button variant='solid' color='neutral' size='small'>
                      Neutral
                    </Button>
                    <Button variant='solid' color='success' size='small'>
                      Success
                    </Button>

                    <Button
                      variant='solid'
                      color='accent'
                      size='small'
                      disabled
                    >
                      Accent Disabled
                    </Button>
                    <Button
                      variant='solid'
                      color='danger'
                      size='small'
                      disabled
                    >
                      Danger Disabled
                    </Button>
                    <Button
                      variant='solid'
                      color='neutral'
                      size='small'
                      disabled
                    >
                      Neutral Disabled
                    </Button>
                    <Button
                      variant='solid'
                      color='success'
                      size='small'
                      disabled
                    >
                      Success Disabled
                    </Button>

                    <Button variant='solid' color='accent' size='small' loading>
                      Accent Loading
                    </Button>
                    <Button variant='solid' color='danger' size='small' loading>
                      Danger Loading
                    </Button>
                    <Button
                      variant='solid'
                      color='neutral'
                      size='small'
                      loading
                    >
                      Neutral Loading
                    </Button>
                    <Button
                      variant='solid'
                      color='success'
                      size='small'
                      loading
                    >
                      Success Loading
                    </Button>

                    <Button
                      variant='solid'
                      color='accent'
                      size='small'
                      loading
                      disabled
                    >
                      Accent Loading Disabled
                    </Button>
                    <Button
                      variant='solid'
                      color='danger'
                      size='small'
                      loading
                      disabled
                    >
                      Danger Loading Disabled
                    </Button>
                    <Button
                      variant='solid'
                      color='neutral'
                      size='small'
                      loading
                      disabled
                    >
                      Neutral Loading Disabled
                    </Button>
                    <Button
                      variant='solid'
                      color='success'
                      size='small'
                      loading
                      disabled
                    >
                      Success Loading Disabled
                    </Button>
                  </Flex>
                </Flex>
              </Flex>

              {/* Outline Variant */}
              <Flex direction='column' gap={4} style={{ marginBottom: '32px' }}>
                <Text weight='medium'>Outline Variant</Text>

                {/* Normal Size */}
                <Flex direction='column' gap={2}>
                  <Text size='small'>Normal Size:</Text>
                  <Flex gap={2} wrap='wrap'>
                    <Button variant='outline' color='accent'>
                      Accent
                    </Button>
                    <Button variant='outline' color='danger'>
                      Danger
                    </Button>
                    <Button variant='outline' color='neutral'>
                      Neutral
                    </Button>
                    <Button variant='outline' color='success'>
                      Success
                    </Button>

                    <Button variant='outline' color='accent' disabled>
                      Accent Disabled
                    </Button>
                    <Button variant='outline' color='danger' disabled>
                      Danger Disabled (issue)
                    </Button>
                    <Button variant='outline' color='neutral' disabled>
                      Neutral Disabled (issue)
                    </Button>
                    <Button variant='outline' color='success' disabled>
                      Success Disabled (issue)
                    </Button>

                    <Button variant='outline' color='accent' loading>
                      Accent Loading
                    </Button>
                    <Button variant='outline' color='danger' loading>
                      Danger Loading
                    </Button>
                    <Button variant='outline' color='neutral' loading>
                      Neutral Loading
                    </Button>
                    <Button variant='outline' color='success' loading>
                      Success Loading
                    </Button>

                    <Button variant='outline' color='accent' loading disabled>
                      Accent Loading Disabled
                    </Button>
                    <Button variant='outline' color='danger' loading disabled>
                      Danger Loading Disabled
                    </Button>
                    <Button variant='outline' color='neutral' loading disabled>
                      Neutral Loading Disabled
                    </Button>
                    <Button variant='outline' color='success' loading disabled>
                      Success Loading Disabled
                    </Button>
                  </Flex>
                </Flex>

                {/* Small Size */}
                <Flex direction='column' gap={2}>
                  <Text size='small'>Small Size:</Text>
                  <Flex gap={2} wrap='wrap'>
                    <Button variant='outline' color='accent' size='small'>
                      Accent
                    </Button>
                    <Button variant='outline' color='danger' size='small'>
                      Danger
                    </Button>
                    <Button variant='outline' color='neutral' size='small'>
                      Neutral
                    </Button>
                    <Button variant='outline' color='success' size='small'>
                      Success
                    </Button>

                    <Button
                      variant='outline'
                      color='accent'
                      size='small'
                      disabled
                    >
                      Accent Disabled
                    </Button>
                    <Button
                      variant='outline'
                      color='danger'
                      size='small'
                      disabled
                    >
                      Danger Disabled
                    </Button>
                    <Button
                      variant='outline'
                      color='neutral'
                      size='small'
                      disabled
                    >
                      Neutral Disabled
                    </Button>
                    <Button
                      variant='outline'
                      color='success'
                      size='small'
                      disabled
                    >
                      Success Disabled
                    </Button>

                    <Button
                      variant='outline'
                      color='accent'
                      size='small'
                      loading
                    >
                      Accent Loading
                    </Button>
                    <Button
                      variant='outline'
                      color='danger'
                      size='small'
                      loading
                    >
                      Danger Loading
                    </Button>
                    <Button
                      variant='outline'
                      color='neutral'
                      size='small'
                      loading
                    >
                      Neutral Loading
                    </Button>
                    <Button
                      variant='outline'
                      color='success'
                      size='small'
                      loading
                    >
                      Success Loading
                    </Button>

                    <Button
                      variant='outline'
                      color='accent'
                      size='small'
                      loading
                      disabled
                    >
                      Accent Loading Disabled
                    </Button>
                    <Button
                      variant='outline'
                      color='danger'
                      size='small'
                      loading
                      disabled
                    >
                      Danger Loading Disabled
                    </Button>
                    <Button
                      variant='outline'
                      color='neutral'
                      size='small'
                      loading
                      disabled
                    >
                      Neutral Loading Disabled
                    </Button>
                    <Button
                      variant='outline'
                      color='success'
                      size='small'
                      loading
                      disabled
                    >
                      Success Loading Disabled
                    </Button>
                  </Flex>
                </Flex>
              </Flex>

              {/* Ghost Variant */}
              <Flex direction='column' gap={4} style={{ marginBottom: '32px' }}>
                <Text weight='medium'>Ghost Variant</Text>

                {/* Normal Size */}
                <Flex direction='column' gap={2}>
                  <Text size='small'>Normal Size:</Text>
                  <Flex gap={2} wrap='wrap'>
                    <Button variant='ghost' color='accent'>
                      Accent
                    </Button>
                    <Button variant='ghost' color='danger'>
                      Danger
                    </Button>
                    <Button variant='ghost' color='neutral'>
                      Neutral
                    </Button>
                    <Button variant='ghost' color='success'>
                      Success
                    </Button>

                    <Button variant='ghost' color='accent' disabled>
                      Accent Disabled
                    </Button>
                    <Button variant='ghost' color='danger' disabled>
                      Danger Disabled
                    </Button>
                    <Button variant='ghost' color='neutral' disabled>
                      Neutral Disabled
                    </Button>
                    <Button variant='ghost' color='success' disabled>
                      Success Disabled
                    </Button>

                    <Button variant='ghost' color='accent' loading>
                      Accent Loading
                    </Button>
                    <Button variant='ghost' color='danger' loading>
                      Danger Loading
                    </Button>
                    <Button variant='ghost' color='neutral' loading>
                      Neutral Loading
                    </Button>
                    <Button variant='ghost' color='success' loading>
                      Success Loading
                    </Button>

                    <Button variant='ghost' color='accent' loading disabled>
                      Accent Loading Disabled
                    </Button>
                    <Button variant='ghost' color='danger' loading disabled>
                      Danger Loading Disabled
                    </Button>
                    <Button variant='ghost' color='neutral' loading disabled>
                      Neutral Loading Disabled
                    </Button>
                    <Button variant='ghost' color='success' loading disabled>
                      Success Loading Disabled
                    </Button>
                  </Flex>
                </Flex>

                {/* Small Size */}
                <Flex direction='column' gap={2}>
                  <Text size='small'>Small Size:</Text>
                  <Flex gap={2} wrap='wrap'>
                    <Button variant='ghost' color='accent' size='small'>
                      Accent
                    </Button>
                    <Button variant='ghost' color='danger' size='small'>
                      Danger
                    </Button>
                    <Button variant='ghost' color='neutral' size='small'>
                      Neutral
                    </Button>
                    <Button variant='ghost' color='success' size='small'>
                      Success
                    </Button>

                    <Button
                      variant='ghost'
                      color='accent'
                      size='small'
                      disabled
                    >
                      Accent Disabled
                    </Button>
                    <Button
                      variant='ghost'
                      color='danger'
                      size='small'
                      disabled
                    >
                      Danger Disabled
                    </Button>
                    <Button
                      variant='ghost'
                      color='neutral'
                      size='small'
                      disabled
                    >
                      Neutral Disabled
                    </Button>
                    <Button
                      variant='ghost'
                      color='success'
                      size='small'
                      disabled
                    >
                      Success Disabled
                    </Button>

                    <Button variant='ghost' color='accent' size='small' loading>
                      Accent Loading
                    </Button>
                    <Button variant='ghost' color='danger' size='small' loading>
                      Danger Loading
                    </Button>
                    <Button
                      variant='ghost'
                      color='neutral'
                      size='small'
                      loading
                    >
                      Neutral Loading
                    </Button>
                    <Button
                      variant='ghost'
                      color='success'
                      size='small'
                      loading
                    >
                      Success Loading
                    </Button>

                    <Button
                      variant='ghost'
                      color='accent'
                      size='small'
                      loading
                      disabled
                    >
                      Accent Loading Disabled
                    </Button>
                    <Button
                      variant='ghost'
                      color='danger'
                      size='small'
                      loading
                      disabled
                    >
                      Danger Loading Disabled
                    </Button>
                    <Button
                      variant='ghost'
                      color='neutral'
                      size='small'
                      loading
                      disabled
                    >
                      Neutral Loading Disabled
                    </Button>
                    <Button
                      variant='ghost'
                      color='success'
                      size='small'
                      loading
                      disabled
                    >
                      Success Loading Disabled
                    </Button>
                  </Flex>
                </Flex>
              </Flex>

              {/* Text Variant */}
              <Flex direction='column' gap={4} style={{ marginBottom: '32px' }}>
                <Text weight='medium'>Text Variant</Text>

                {/* Normal Size */}
                <Flex direction='column' gap={2}>
                  <Text size='small'>Normal Size:</Text>
                  <Flex gap={2} wrap='wrap'>
                    <Button variant='text' color='accent'>
                      Accent
                    </Button>
                    <Button variant='text' color='danger'>
                      Danger
                    </Button>
                    <Button variant='text' color='neutral'>
                      Neutral
                    </Button>
                    <Button variant='text' color='success'>
                      Success
                    </Button>

                    <Button variant='text' color='accent' disabled>
                      Accent Disabled
                    </Button>
                    <Button variant='text' color='danger' disabled>
                      Danger Disabled
                    </Button>
                    <Button variant='text' color='neutral' disabled>
                      Neutral Disabled
                    </Button>
                    <Button variant='text' color='success' disabled>
                      Success Disabled
                    </Button>

                    <Button variant='text' color='accent' loading>
                      Accent Loading
                    </Button>
                    <Button variant='text' color='danger' loading>
                      Danger Loading
                    </Button>
                    <Button variant='text' color='neutral' loading>
                      Neutral Loading
                    </Button>
                    <Button variant='text' color='success' loading>
                      Success Loading
                    </Button>

                    <Button variant='text' color='accent' loading disabled>
                      Accent Loading Disabled
                    </Button>
                    <Button variant='text' color='danger' loading disabled>
                      Danger Loading Disabled
                    </Button>
                    <Button variant='text' color='neutral' loading disabled>
                      Neutral Loading Disabled
                    </Button>
                    <Button variant='text' color='success' loading disabled>
                      Success Loading Disabled
                    </Button>
                  </Flex>
                </Flex>

                {/* Small Size */}
                <Flex direction='column' gap={2}>
                  <Text size='small'>Small Size:</Text>
                  <Flex gap={2} wrap='wrap'>
                    <Button variant='text' color='accent' size='small'>
                      Accent
                    </Button>
                    <Button variant='text' color='danger' size='small'>
                      Danger
                    </Button>
                    <Button variant='text' color='neutral' size='small'>
                      Neutral
                    </Button>
                    <Button variant='text' color='success' size='small'>
                      Success
                    </Button>

                    <Button variant='text' color='accent' size='small' disabled>
                      Accent Disabled
                    </Button>
                    <Button variant='text' color='danger' size='small' disabled>
                      Danger Disabled
                    </Button>
                    <Button
                      variant='text'
                      color='neutral'
                      size='small'
                      disabled
                    >
                      Neutral Disabled
                    </Button>
                    <Button
                      variant='text'
                      color='success'
                      size='small'
                      disabled
                    >
                      Success Disabled
                    </Button>

                    <Button variant='text' color='accent' size='small' loading>
                      Accent Loading
                    </Button>
                    <Button variant='text' color='danger' size='small' loading>
                      Danger Loading
                    </Button>
                    <Button variant='text' color='neutral' size='small' loading>
                      Neutral Loading
                    </Button>
                    <Button variant='text' color='success' size='small' loading>
                      Success Loading
                    </Button>

                    <Button
                      variant='text'
                      color='accent'
                      size='small'
                      loading
                      disabled
                    >
                      Accent Loading Disabled
                    </Button>
                    <Button
                      variant='text'
                      color='danger'
                      size='small'
                      loading
                      disabled
                    >
                      Danger Loading Disabled
                    </Button>
                    <Button
                      variant='text'
                      color='neutral'
                      size='small'
                      loading
                      disabled
                    >
                      Neutral Loading Disabled
                    </Button>
                    <Button
                      variant='text'
                      color='success'
                      size='small'
                      loading
                      disabled
                    >
                      Success Loading Disabled
                    </Button>
                  </Flex>
                </Flex>
              </Flex>

              <Text
                size='large'
                weight='medium'
                style={{ marginTop: '32px', marginBottom: '16px' }}
              >
                Spinner Examples
              </Text>

              <Flex direction='column' gap={4}>
                <Flex gap={4} align='center'>
                  <Spinner size={3} color='default' />
                  <Spinner size={3} color='neutral' />
                  <Spinner size={3} color='accent' />
                  <Spinner size={3} color='danger' />
                  <Spinner size={3} color='success' />
                  <Spinner size={3} color='attention' />
                </Flex>
              </Flex>

              <Text
                size='large'
                weight='medium'
                style={{ marginTop: '32px', marginBottom: '16px' }}
              >
                Button Loading States Examples
              </Text>

              <Flex direction='column' gap={6}>
                {/* Solid Variant */}
                <Flex direction='column' gap={3}>
                  <Text weight='medium'>Solid Variant (Inverted Spinner)</Text>
                  <Flex gap={4} align='center'>
                    <Button variant='solid' color='accent' loading>
                      Loading
                    </Button>
                    <Button variant='solid' color='danger' loading>
                      Loading
                    </Button>
                    <Button variant='solid' color='success' loading>
                      Loading
                    </Button>
                  </Flex>
                </Flex>

                {/* Outline Variant */}
                <Flex direction='column' gap={3}>
                  <Text weight='medium'>
                    Outline Variant (Matching Color Spinner)
                  </Text>
                  <Flex gap={4} align='center'>
                    <Button variant='outline' color='accent' loading>
                      Loading
                    </Button>
                    <Button variant='outline' color='danger' loading>
                      Loading
                    </Button>
                    <Button variant='outline' color='success' loading>
                      Loading
                    </Button>
                  </Flex>
                </Flex>

                {/* Ghost Variant */}
                <Flex direction='column' gap={3}>
                  <Text weight='medium'>
                    Ghost Variant (Matching Color Spinner for colored)
                  </Text>
                  <Flex gap={4} align='center'>
                    <Button variant='ghost' color='accent' loading>
                      Loading
                    </Button>
                    <Button variant='ghost' color='danger' loading>
                      Loading
                    </Button>
                    <Button variant='ghost' color='success' loading>
                      Loading
                    </Button>
                  </Flex>
                </Flex>

                {/* Text Variant */}
                <Flex direction='column' gap={3}>
                  <Text weight='medium'>
                    Text Variant (Matching Color Spinner for colored)
                  </Text>
                  <Flex gap={4} align='center'>
                    <Button variant='text' color='accent' loading>
                      Loading
                    </Button>
                    <Button variant='text' color='neutral' loading>
                      Loading
                    </Button>
                    <Button variant='text' color='danger' loading>
                      Loading
                    </Button>
                    <Button variant='text' color='success' loading>
                      Loading
                    </Button>
                  </Flex>
                </Flex>

                {/* Size Variants */}
                <Flex direction='column' gap={3}>
                  <Text weight='medium'>Size Variants</Text>
                  <Flex gap={4} align='center'>
                    <Button variant='solid' color='accent' size='small' loading>
                      Small
                    </Button>
                    <Button
                      variant='solid'
                      color='accent'
                      size='normal'
                      loading
                    >
                      Normal
                    </Button>
                    <Button
                      variant='outline'
                      color='accent'
                      size='small'
                      loading
                    >
                      Small
                    </Button>
                    <Button
                      variant='outline'
                      color='accent'
                      size='normal'
                      loading
                    >
                      Normal
                    </Button>
                  </Flex>
                </Flex>

                {/* Loading with and without text */}
                <Flex direction='column' gap={3}>
                  <Text weight='medium'>Loading With/Without Text</Text>
                  <Flex gap={4} align='center'>
                    <Button variant='solid' color='accent' loading>
                      Loading
                    </Button>
                    <Button
                      variant='solid'
                      color='accent'
                      loading
                      loaderText='Processing...'
                    >
                      Button
                    </Button>
                    <Button variant='outline' color='accent' loading>
                      Loading
                    </Button>
                    <Button
                      variant='outline'
                      color='accent'
                      loading
                      loaderText='Processing...'
                    >
                      Button
                    </Button>
                  </Flex>
                </Flex>

                {/* Disabled Loading State */}
                <Flex direction='column' gap={3}>
                  <Text weight='medium'>Disabled Loading State</Text>
                  <Flex gap={4} align='center'>
                    <Button variant='solid' color='accent' loading disabled>
                      Loading
                    </Button>
                    <Button variant='outline' color='accent' loading disabled>
                      Loading
                    </Button>
                    <Button variant='ghost' color='accent' loading disabled>
                      Loading
                    </Button>
                    <Button variant='text' color='accent' loading disabled>
                      Loading
                    </Button>
                  </Flex>
                </Flex>
              </Flex>

              <Search
                placeholder='Default small search'
                size='small'
                showClearButton
                value={search2}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearch2(e.target.value)
                }
                onClear={() => setSearch2('')}
              />

              <Search
                placeholder='Borderless large search'
                variant='borderless'
                showClearButton
                value={search3}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearch3(e.target.value)
                }
                onClear={() => setSearch3('')}
              />

              <Search
                placeholder='Borderless small search'
                variant='borderless'
                size='small'
                showClearButton
                value={search4}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearch4(e.target.value)
                }
                onClear={() => setSearch4('')}
              />
            </Flex>

            {/* Select component examples */}
            <Text
              size='large'
              weight='medium'
              style={{ marginTop: '32px', marginBottom: '16px' }}
            >
              Select Examples
            </Text>

            <EmptyState
              icon={<MixerHorizontalIcon />}
              heading='KYC required for image orders'
              subHeading='Please contact your organization owner to complete the KYC process for the image orders. You can also contact support@raystack.io for assistance.'
              primaryAction={
                <Button variant='outline' color='neutral'>
                  Add Data
                </Button>
              }
              variant='empty1'
            />

            <TextArea />

            <Flex direction='column' gap={4} style={{ maxWidth: '550px' }}>
              {/* Normal size select with icons */}
              <Flex direction='column' gap={2}>
                <Select
                  value={selectValue}
                  onValueChange={setSelectValue}
                  disabled
                >
                  <Select.Trigger size='small' variant='outline'>
                    <Select.Value placeholder='Choose an options' />
                  </Select.Trigger>
                  <Select.Content>
                    {filterOptions.map(option => (
                      <Select.Item
                        key={option.value}
                        value={option.value}
                        leadingIcon={option.icon}
                      >
                        {option.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select>

                <Select value={selectValue} onValueChange={setSelectValue}>
                  <Select.Trigger size='small' variant='text'>
                    <Select.Value placeholder='Choose an options option option' />
                  </Select.Trigger>
                  <Select.Content>
                    {filterOptions.map(option => (
                      <Select.Item
                        key={option.value}
                        value={option.value}
                        leadingIcon={option.icon}
                      >
                        {option.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select>
              </Flex>
            </Flex>

            <Flex direction='column' gap={4} style={{ maxWidth: '550px' }}>
              {/* Normal size select with icons */}
              <Flex direction='column' gap={2}>
                <Select
                  value={selectValue}
                  onValueChange={setSelectValue}
                  disabled
                >
                  <Select.Trigger size='small' variant='outline'>
                    <Select.Value placeholder='Choose an options' />
                  </Select.Trigger>
                  <Select.Content>
                    {filterOptions.map(option => (
                      <Select.Item
                        key={option.value}
                        value={option.value}
                        leadingIcon={option.icon}
                      >
                        {option.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select>
                <Text size='small'>Normal size:</Text>
                <Select value={selectValue1} onValueChange={setSelectValue1}>
                  <Select.Trigger>
                    <Select.Value placeholder='Choose an options' />
                  </Select.Trigger>
                  <Select.Content>
                    {selectOptions.map(option => (
                      <Select.Item
                        key={option.value}
                        value={option.value}
                        leadingIcon={option.icon}
                      >
                        {option.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select>
              </Flex>

              {/* Small size select with icons */}
              <Flex direction='column' gap={2}>
                <Text size='small'>Small size:</Text>
                <Select value={selectValue2} onValueChange={setSelectValue2}>
                  <Select.Trigger size='small'>
                    <Select.Value placeholder='Choose an options' />
                  </Select.Trigger>
                  <Select.Content>
                    {selectOptions.map(option => (
                      <Select.Item
                        key={option.value}
                        value={option.value}
                        leadingIcon={option.icon}
                      >
                        {option.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select>
              </Flex>
            </Flex>

            <Text
              size='large'
              weight='medium'
              style={{ marginTop: '32px', marginBottom: '16px' }}
            >
              Dialog Examples
            </Text>

            <Flex direction='column' gap={4}>
              <Button onClick={() => setDialogOpen(true)}>Open Dialog</Button>

              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <Dialog.Content style={{ width: 500 }}>
                  <Dialog.Header>
                    <Dialog.Title>Dialog Title</Dialog.Title>
                  </Dialog.Header>
                  <Dialog.Body>
                    <Text>This is the dialog content. </Text>
                    <Flex
                      direction='column'
                      gap={4}
                      style={{ marginTop: '16px' }}
                    >
                      <Text size='small'>Team Members:</Text>
                      <AvatarGroup>
                        <Avatar size={5} color='indigo' fallback='JD' />
                        <Avatar size={5} color='mint' fallback='AS' />
                        <Avatar size={5} color='sky' fallback='RK' />
                        <Avatar size={5} color='purple' fallback='+2' />
                      </AvatarGroup>

                      <Flex direction='column' gap={2}>
                        <Text size='small'>Quick Actions:</Text>
                        <Tooltip>
                          <Tooltip.Trigger
                            render={
                              <Button variant='solid' color='accent'>
                                Show hover tooltip
                              </Button>
                            }
                          />
                          <Tooltip.Content side='top'>
                            Click to send a message to all team members
                          </Tooltip.Content>
                        </Tooltip>
                      </Flex>
                    </Flex>

                    <Flex
                      direction='column'
                      gap={4}
                      style={{ marginTop: '32px' }}
                    >
                      <Flex direction='column' gap={2}>
                        <Text size='small'>Team Role:</Text>
                        <Select
                          value={selectValue}
                          onValueChange={setSelectValue}
                        >
                          <Select.Trigger>
                            <Select.Value placeholder='Select a role' />
                          </Select.Trigger>
                          <Select.Content>
                            <Select.Item value='admin'>
                              Administrator
                            </Select.Item>
                            <Select.Item value='editor'>Editor</Select.Item>
                            <Select.Item value='viewer'>Viewer</Select.Item>
                            <Select.Item value='member'>Member</Select.Item>
                          </Select.Content>
                        </Select>
                      </Flex>

                      <Flex direction='column' gap={2}>
                        <Popover>
                          <Popover.Trigger>
                            <Button variant='ghost' size='small'>
                              <MixerHorizontalIcon />
                              <Text size='small'>Filter Help</Text>
                            </Button>
                          </Popover.Trigger>
                          <Popover.Content>
                            <Flex
                              direction='column'
                              gap={2}
                              style={{ padding: '8px' }}
                            >
                              <Text size='small' weight='medium'>
                                Filter Team Members
                              </Text>
                              <Text size='small'>
                                You can filter team members by:
                              </Text>
                            </Flex>
                          </Popover.Content>
                        </Popover>
                        <Input
                          placeholder='Type to filter...'
                          leadingIcon={<MixerHorizontalIcon />}
                        />
                      </Flex>

                      <Flex direction='column' gap={2}>
                        <Text size='small'>Actions:</Text>
                        <Flex gap={2}>
                          <Indicator variant='success' label='5'>
                            <Button variant='outline'>Active Members</Button>
                          </Indicator>
                          <Button
                            variant='outline'
                            onClick={() => setNestedDialogOpen(true)}
                          >
                            Open Nested Dialog
                          </Button>
                          <Button
                            variant='outline'
                            onClick={() => setDialogSheetOpen(true)}
                          >
                            Open Sheet
                          </Button>
                          <Menu>
                            <Menu.Trigger render={<Button variant='outline' />}>
                              Open Menu
                            </Menu.Trigger>
                            <Menu.Content>
                              <Menu.Group>
                                <Menu.Label>Team Actions</Menu.Label>
                                <Tooltip>
                                  <Tooltip.Trigger
                                    render={<Menu.Item>Add Member</Menu.Item>}
                                  />
                                  <Tooltip.Content side='right'>
                                    Add a new member to your team
                                  </Tooltip.Content>
                                </Tooltip>
                                <Menu.Item>Edit Team</Menu.Item>
                              </Menu.Group>
                              <Menu.Separator />
                              <Menu.Group>
                                <Menu.Label>Settings</Menu.Label>
                                <Menu.Item>Permissions</Menu.Item>
                                <Menu.Item>Notifications</Menu.Item>
                              </Menu.Group>
                              <Menu.Separator />
                              <Menu.Item>Delete Team</Menu.Item>
                            </Menu.Content>
                          </Menu>
                        </Flex>
                      </Flex>
                    </Flex>

                    <TextArea
                      value={inputValue}
                      onChange={e => setInputValue(e.target.value)}
                    />
                  </Dialog.Body>
                  <Dialog.Footer>
                    <Button
                      variant='ghost'
                      onClick={() => setDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={() => setDialogOpen(false)}>Save</Button>
                  </Dialog.Footer>
                </Dialog.Content>
              </Dialog>

              <Dialog
                open={nestedDialogOpen}
                onOpenChange={setNestedDialogOpen}
              >
                <Dialog.Content style={{ width: 500 }}>
                  <Dialog.Body>
                    <Text>This is the nested dialog content. </Text>
                    <Flex
                      direction='column'
                      gap={4}
                      style={{ marginTop: '16px' }}
                    >
                      <Text size='small'>Team Members:</Text>
                      <AvatarGroup>
                        <Avatar size={5} color='indigo' fallback='JD' />
                        <Avatar size={5} color='mint' fallback='AS' />
                        <Avatar size={5} color='sky' fallback='RK' />
                        <Avatar size={5} color='purple' fallback='+2' />
                      </AvatarGroup>

                      <Flex direction='column' gap={2}>
                        <Text size='small'>Quick Actions:</Text>
                        <Tooltip>
                          <Tooltip.Trigger
                            render={
                              <Button variant='solid' color='accent'>
                                Show hover tooltip
                              </Button>
                            }
                          />
                          <Tooltip.Content side='top'>
                            Click to send a message to all team members
                          </Tooltip.Content>
                        </Tooltip>
                      </Flex>
                    </Flex>

                    <Flex
                      direction='column'
                      gap={4}
                      style={{ marginTop: '32px' }}
                    >
                      <Flex direction='column' gap={2}>
                        <Text size='small'>Team Role:</Text>
                        <Select
                          value={selectValue}
                          onValueChange={setSelectValue}
                        >
                          <Select.Trigger>
                            <Select.Value placeholder='Select a role' />
                          </Select.Trigger>
                          <Select.Content>
                            <Select.Item value='admin'>
                              Administrator
                            </Select.Item>
                            <Select.Item value='editor'>Editor</Select.Item>
                            <Select.Item value='viewer'>Viewer</Select.Item>
                            <Select.Item value='member'>Member</Select.Item>
                          </Select.Content>
                        </Select>
                      </Flex>

                      <Flex direction='column' gap={2}>
                        <Popover>
                          <Popover.Trigger>
                            <Button variant='ghost' size='small'>
                              <MixerHorizontalIcon />
                              <Text size='small'>Filter Help</Text>
                            </Button>
                          </Popover.Trigger>
                          <Popover.Content>
                            <Flex
                              direction='column'
                              gap={2}
                              style={{ padding: '8px' }}
                            >
                              <Text size='small' weight='medium'>
                                Filter Team Members
                              </Text>
                              <Text size='small'>
                                You can filter team members by:
                              </Text>
                              <ul style={{ margin: 0, paddingLeft: '16px' }}>
                                <li>
                                  <Text size='small'>Name</Text>
                                </li>
                                <li>
                                  <Text size='small'>Role</Text>
                                </li>
                                <li>
                                  <Text size='small'>Department</Text>
                                </li>
                              </ul>
                            </Flex>
                          </Popover.Content>
                        </Popover>
                        <Input
                          placeholder='Type to filter...'
                          leadingIcon={<MixerHorizontalIcon />}
                        />
                      </Flex>

                      <Flex direction='column' gap={2}>
                        <Text size='small'>Actions:</Text>
                        <Flex gap={2}>
                          <Indicator variant='success' label='5'>
                            <Button variant='outline'>Active Members</Button>
                          </Indicator>
                          <Menu>
                            <Menu.Trigger render={<Button variant='outline' />}>
                              Open Menu
                            </Menu.Trigger>
                            <Menu.Content>
                              <Menu.Group>
                                <Menu.Label>Team Actions</Menu.Label>
                                <Tooltip>
                                  <Tooltip.Trigger
                                    render={<Menu.Item>Add Member</Menu.Item>}
                                  />
                                  <Tooltip.Content side='right'>
                                    Add a new member to your team
                                  </Tooltip.Content>
                                </Tooltip>
                                <Menu.Item>Edit Team</Menu.Item>
                              </Menu.Group>
                              <Menu.Separator />
                              <Menu.Group>
                                <Menu.Label>Settings</Menu.Label>
                                <Menu.Item>Permissions</Menu.Item>
                                <Menu.Item>Notifications</Menu.Item>
                              </Menu.Group>
                              <Menu.Separator />
                              <Menu.Item>Delete Team</Menu.Item>
                            </Menu.Content>
                          </Menu>
                        </Flex>
                      </Flex>
                    </Flex>
                  </Dialog.Body>
                </Dialog.Content>
              </Dialog>
            </Flex>

            <Text
              size='large'
              weight='medium'
              style={{ marginTop: '32px', marginBottom: '16px' }}
            >
              Form Component Examples
            </Text>

            <Flex direction='column' gap={4} style={{ maxWidth: '300px' }}>
              {/* Select Examples */}
              <Flex direction='column' gap={2}>
                <Text size='small'>Disabled Select:</Text>
                <Select
                  value={selectValue}
                  onValueChange={setSelectValue}
                  disabled
                >
                  <Select.Trigger size='small' variant='outline'>
                    <Select.Value placeholder='Choose an option' />
                  </Select.Trigger>
                  <Select.Content>
                    {filterOptions.map(option => (
                      <Select.Item
                        key={option.value}
                        value={option.value}
                        leadingIcon={option.icon}
                      >
                        {option.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select>
              </Flex>

              <Flex direction='column' gap={2}>
                <Text size='small'>Test Normal size:</Text>
                <Select
                  value={selectValue}
                  onValueChange={value => {
                    console.log(value);
                    setSelectValue(value);
                  }}
                >
                  <Select.Trigger>
                    <Select.Value placeholder='Choose an option' />
                  </Select.Trigger>
                  <Select.Content>
                    {selectOptions.map(option => (
                      <Select.Item
                        key={option.value}
                        value={option.value}
                        leadingIcon={option.icon}
                      >
                        {option.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select>
                {/* <Select
              value={selectValue}
              onValueChange={value => {
                console.log(value);
                setSelectValue(value);
              }}>
              <Select.Trigger size="small" variant="outline">
                <Select.Value placeholder="Choose an option" />
              </Select.Trigger>
              <Select.Content>
                {selectOptions.map(option => (
                  <Select.Item
                    key={option.value}
                    value={option.value}
                    leadingIcon={option.icon}>
                    {option.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select> */}
                <Select value={selectValue} onValueChange={setSelectValue}>
                  <Select.Trigger size='small'>
                    <Select.Value placeholder='Choose an options' />
                  </Select.Trigger>
                  <Select.Content>
                    {selectOptions.map(option => (
                      <Select.Item
                        key={option.value}
                        value={option.value}
                        // leadingIcon={option.icon}
                      >
                        {option.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select>
              </Flex>
            </Flex>

            <Text
              size='large'
              weight='medium'
              style={{ marginTop: '32px', marginBottom: '16px' }}
            >
              <Amount
                value='10000100091636935'
                valueInMinorUnits={false}
                hideDecimals
              />
            </Text>

            <Text
              size='large'
              weight='medium'
              style={{ marginTop: '32px', marginBottom: '16px' }}
            >
              Amount Examples
            </Text>

            <Flex direction='column' gap={6}>
              {/* Basic Amount Examples */}
              <Flex direction='column' gap={3}>
                <Text size='small'>Basic Amount (Minor Units):</Text>
                <Flex gap={4}>
                  <Text>
                    USD: <Amount value={999990000} currency='USD' />
                  </Text>
                  <Text>
                    INR: <Amount value={129900} currency='INR' />
                  </Text>
                  <Text>
                    EUR: <Amount value={150000} currency='EUR' />
                  </Text>
                </Flex>
              </Flex>

              {/* Major Units Example */}
              <Flex direction='column' gap={3}>
                <Text size='small'>Major Units (valueInMinorUnits=false):</Text>
                <Flex gap={4}>
                  <Text>
                    USD:
                    <Amount
                      value={9999.9}
                      valueInMinorUnits={false}
                      currency='USD'
                    />
                  </Text>
                  <Text>
                    JPY:
                    <Amount
                      value={9999}
                      valueInMinorUnits={false}
                      currency='JPY'
                    />
                  </Text>
                  <Text>
                    BHD:
                    <Amount
                      value={99.999}
                      valueInMinorUnits={false}
                      currency='BHD'
                    />
                  </Text>
                </Flex>
              </Flex>

              {/* Currency Display Formats */}
              <Flex direction='column' gap={3}>
                <Text size='small'>Currency Display Formats:</Text>
                <Flex gap={4}>
                  <Text>
                    Symbol:
                    <Amount
                      value={129900}
                      currency='EUR'
                      currencyDisplay='symbol'
                    />
                  </Text>
                  <Text>
                    Code:
                    <Amount
                      value={129900}
                      currency='EUR'
                      currencyDisplay='code'
                    />
                  </Text>
                  <Text>
                    Name:
                    <Amount
                      value={129900}
                      currency='EUR'
                      currencyDisplay='name'
                    />
                  </Text>
                </Flex>
              </Flex>

              {/* Localization Example */}
              <Flex direction='column' gap={3}>
                <Text size='small'>Different Locales:</Text>
                <Flex gap={4}>
                  <Text>
                    US: <Amount value={129900} currency='EUR' locale='en-US' />
                  </Text>
                  <Text>
                    DE: <Amount value={129900} currency='EUR' locale='de-DE' />
                  </Text>
                  <Text>
                    JP: <Amount value={129900} currency='EUR' locale='ja-JP' />
                  </Text>
                </Flex>
              </Flex>

              {/* Decimal Control */}
              <Flex direction='column' gap={3}>
                <Text size='small'>Decimal Control:</Text>
                <Flex gap={4}>
                  <Text>
                    No Decimals:
                    <Amount value={129900} currency='USD' hideDecimals />
                  </Text>
                  <Text>
                    Min 2:
                    <Amount
                      value={129900}
                      currency='USD'
                      minimumFractionDigits={2}
                    />
                  </Text>
                  <Text>
                    Max 1:
                    <Amount
                      value={129900}
                      currency='USD'
                      maximumFractionDigits={1}
                    />
                  </Text>
                </Flex>
              </Flex>

              {/* Grouping Control */}
              <Flex direction='column' gap={3}>
                <Text size='small'>Grouping Control:</Text>
                <Flex gap={4}>
                  <Text>
                    With Grouping: <Amount value={9999999} currency='USD' />
                  </Text>
                  <Text>
                    No Grouping:
                    <Amount
                      value={9999999}
                      currency='USD'
                      groupDigits={false}
                    />
                  </Text>
                </Flex>
              </Flex>

              {/* Error Handling */}
              <Flex direction='column' gap={3}>
                <Text size='small'>Error Handling (Invalid Currency):</Text>
                <Flex gap={4}>
                  <Text>
                    Fallback to USD:{' '}
                    <Amount value={129900} currency='INVALID' />
                  </Text>
                </Flex>
              </Flex>
            </Flex>

            <Text
              size='large'
              weight='medium'
              style={{ marginTop: '32px', marginBottom: '16px' }}
            >
              Avatar Examples
            </Text>

            <Flex direction='column' gap={6}>
              <Flex direction='column' gap={3}>
                <AvatarGroup max={4}>
                  <Tooltip>
                    <Tooltip.Trigger
                      render={
                        <Avatar
                          radius='small'
                          size={7}
                          fallback='JD'
                          color='indigo'
                        />
                      }
                    />
                    <Tooltip.Content>JD</Tooltip.Content>
                  </Tooltip>
                  <Tooltip>
                    <Tooltip.Trigger
                      render={
                        <Avatar
                          radius='small'
                          size={7}
                          fallback='AS'
                          color='mint'
                        />
                      }
                    />
                    <Tooltip.Content>AS</Tooltip.Content>
                  </Tooltip>
                  <Tooltip>
                    <Tooltip.Trigger
                      render={
                        <Avatar
                          radius='small'
                          size={7}
                          fallback='RK'
                          color='sky'
                        />
                      }
                    />
                    <Tooltip.Content>RK</Tooltip.Content>
                  </Tooltip>
                  <Tooltip>
                    <Tooltip.Trigger
                      render={
                        <Avatar
                          radius='small'
                          size={7}
                          fallback='PL'
                          color='purple'
                        />
                      }
                    />
                    <Tooltip.Content>PL</Tooltip.Content>
                  </Tooltip>
                  <Tooltip>
                    <Tooltip.Trigger
                      render={
                        <Avatar
                          radius='small'
                          size={7}
                          fallback='MN'
                          color='pink'
                        />
                      }
                    />
                    <Tooltip.Content>MN</Tooltip.Content>
                  </Tooltip>
                </AvatarGroup>
              </Flex>
            </Flex>

            <Text
              size='large'
              weight='medium'
              style={{ marginTop: '32px', marginBottom: '16px' }}
            >
              DataTable - Zero State and Empty State Examples
            </Text>

            <Flex direction='column' gap={6}>
              <Flex direction='column' gap={3}>
                <Text size='small' weight='medium'>
                  Zero State - No Data, No Filters/Search
                </Text>
                <Text
                  size='small'
                  style={{ color: 'var(--rs-color-text-subtle)' }}
                >
                  Filter bar is hidden, search is disabled. Shows zeroState when
                  no data is fetched initially.
                </Text>
                <DataTable
                  data={[]}
                  columns={[
                    {
                      accessorKey: 'name',
                      header: 'Name',
                      enableColumnFilter: true,
                      filterType: 'string'
                    },
                    {
                      accessorKey: 'email',
                      header: 'Email',
                      enableColumnFilter: true,
                      filterType: 'string'
                    },
                    {
                      accessorKey: 'role',
                      header: 'Role',
                      enableColumnFilter: true,
                      filterType: 'string'
                    }
                  ]}
                  mode='client'
                  defaultSort={{ name: 'name', order: 'asc' }}
                >
                  <DataTable.Toolbar />
                  <DataTable.Search />
                  <DataTable.Content
                    zeroState={
                      <EmptyState
                        icon={<PersonIcon />}
                        heading='Zero state'
                        variant='empty2'
                        subHeading='Get started by creating your first user. Filter bar and search are hidden in zero state.'
                      />
                    }
                    emptyState={
                      <EmptyState
                        icon={<MixerHorizontalIcon />}
                        heading='Empty state'
                        variant='empty1'
                        subHeading="We couldn't find any matches for that keyword or filter."
                      />
                    }
                  />
                </DataTable>
              </Flex>

              <Flex direction='column' gap={3}>
                <Text size='small' weight='medium'>
                  Empty State - Filters Applied, No Results
                </Text>
                <Text
                  size='small'
                  style={{ color: 'var(--rs-color-text-subtle)' }}
                >
                  Filter bar is visible, search is enabled. Shows emptyState
                  when filters are applied but no results match.
                </Text>
                <DataTable
                  data={[
                    {
                      id: '1',
                      name: 'John Doe',
                      email: 'john@example.com',
                      role: 'Admin'
                    },
                    {
                      id: '2',
                      name: 'Jane Smith',
                      email: 'jane@example.com',
                      role: 'User'
                    },
                    {
                      id: '3',
                      name: 'Bob Johnson',
                      email: 'bob@example.com',
                      role: 'User'
                    }
                  ]}
                  columns={[
                    {
                      accessorKey: 'name',
                      header: 'Name',
                      enableColumnFilter: true,
                      filterType: 'string'
                    },
                    {
                      accessorKey: 'email',
                      header: 'Email',
                      enableColumnFilter: true,
                      filterType: 'string'
                    },
                    {
                      accessorKey: 'role',
                      header: 'Role',
                      enableColumnFilter: true,
                      filterType: 'select',
                      filterOptions: [
                        { value: 'Admin', label: 'Admin' },
                        { value: 'User', label: 'User' },
                        { value: 'Manager', label: 'Manager' }
                      ]
                    }
                  ]}
                  mode='client'
                  defaultSort={{ name: 'name', order: 'asc' }}
                >
                  <DataTable.Toolbar />
                  <DataTable.Search />
                  <DataTable.Content
                    zeroState={
                      <EmptyState
                        icon={<PersonIcon />}
                        heading='zero state'
                        variant='empty2'
                        subHeading='Get started by creating your first user.'
                      />
                    }
                    emptyState={
                      <EmptyState
                        icon={<MixerHorizontalIcon />}
                        heading='empty state'
                        variant='empty1'
                        subHeading="We couldn't find any matches for that filter. Try adjusting your filters or search query. Filter bar remains visible so you can modify filters."
                      />
                    }
                  />
                </DataTable>
              </Flex>

              <Flex direction='column' gap={3}>
                <Text size='small' weight='medium'>
                  Empty State - Search Applied, No Results (Filter Bar Hidden)
                </Text>
                <Text
                  size='small'
                  style={{ color: 'var(--rs-color-text-subtle)' }}
                >
                  Filter bar stays hidden when only search is applied (no
                  filters). Search is enabled. Shows emptyState.
                </Text>
                <DataTable
                  data={[
                    {
                      id: '1',
                      name: 'John Doe',
                      email: 'john@example.com',
                      role: 'Admin'
                    },
                    {
                      id: '2',
                      name: 'Jane Smith',
                      email: 'jane@example.com',
                      role: 'User'
                    },
                    {
                      id: '3',
                      name: 'Bob Johnson',
                      email: 'bob@example.com',
                      role: 'User'
                    }
                  ]}
                  columns={[
                    {
                      accessorKey: 'name',
                      header: 'Name',
                      enableColumnFilter: true,
                      filterType: 'string'
                    },
                    {
                      accessorKey: 'email',
                      header: 'Email',
                      enableColumnFilter: true,
                      filterType: 'string'
                    },
                    {
                      accessorKey: 'role',
                      header: 'Role',
                      enableColumnFilter: true,
                      filterType: 'string'
                    }
                  ]}
                  mode='client'
                  defaultSort={{ name: 'name', order: 'asc' }}
                >
                  <DataTable.Toolbar />
                  <DataTable.Search />
                  <DataTable.Content
                    zeroState={
                      <EmptyState
                        icon={<PersonIcon />}
                        heading='zero state'
                        variant='empty2'
                        subHeading='Get started by creating your first user.'
                      />
                    }
                    emptyState={
                      <EmptyState
                        icon={<MixerHorizontalIcon />}
                        heading='empty state'
                        variant='empty1'
                        subHeading="We couldn't find any matches for that search. Try a different search term. Filter bar stays hidden when only search is applied."
                      />
                    }
                  />
                </DataTable>
              </Flex>

              <Flex direction='column' gap={3}>
                <Text size='small' weight='medium'>
                  Zero State with Custom Content
                </Text>
                <Text
                  size='small'
                  style={{ color: 'var(--rs-color-text-subtle)' }}
                >
                  Custom zeroState with action button. Filter bar and search are
                  hidden.
                </Text>
                <DataTable
                  data={[]}
                  columns={[
                    {
                      accessorKey: 'name',
                      header: 'Name',
                      enableColumnFilter: true,
                      filterType: 'string'
                    },
                    {
                      accessorKey: 'email',
                      header: 'Email',
                      enableColumnFilter: true,
                      filterType: 'string'
                    },
                    {
                      accessorKey: 'role',
                      header: 'Role',
                      enableColumnFilter: true,
                      filterType: 'string'
                    }
                  ]}
                  mode='client'
                  defaultSort={{ name: 'name', order: 'asc' }}
                >
                  <DataTable.Toolbar />
                  <DataTable.Search />
                  <DataTable.Content
                    zeroState={
                      <Flex
                        direction='column'
                        gap={4}
                        align='center'
                        style={{ padding: '40px' }}
                      >
                        <PersonIcon
                          width={48}
                          height={48}
                          style={{ opacity: 0.5 }}
                        />
                        <Flex direction='column' gap={2} align='center'>
                          <Text size='regular' weight='medium'>
                            No data available
                          </Text>
                          <Text
                            size='small'
                            style={{ color: 'var(--rs-color-text-subtle)' }}
                          >
                            There are no users in the system. Create your first
                            user to get started.
                          </Text>
                        </Flex>
                        <Button size='small'>Create User</Button>
                      </Flex>
                    }
                    emptyState={
                      <EmptyState
                        icon={<MixerHorizontalIcon />}
                        heading='empty state'
                        variant='empty1'
                        subHeading='Try adjusting your filters or search query.'
                      />
                    }
                  />
                </DataTable>
              </Flex>

              <Flex direction='column' gap={3}>
                <Text size='small' weight='medium'>
                  Search Override - Always Enabled in Zero State
                </Text>
                <Text
                  size='small'
                  style={{ color: 'var(--rs-color-text-subtle)' }}
                >
                  Override auto-disable with autoDisableInZeroState={false}.
                  Filter bar stays hidden when only search is applied.
                </Text>
                <DataTable
                  data={[]}
                  columns={[
                    {
                      accessorKey: 'name',
                      header: 'Name',
                      enableColumnFilter: true,
                      filterType: 'string'
                    },
                    {
                      accessorKey: 'email',
                      header: 'Email',
                      enableColumnFilter: true,
                      filterType: 'string'
                    },
                    {
                      accessorKey: 'role',
                      header: 'Role',
                      enableColumnFilter: true,
                      filterType: 'string'
                    }
                  ]}
                  mode='client'
                  defaultSort={{ name: 'name', order: 'asc' }}
                >
                  <DataTable.Toolbar />
                  <DataTable.Search autoDisableInZeroState={false} />
                  <DataTable.Content
                    zeroState={
                      <EmptyState
                        icon={<PersonIcon />}
                        heading='zero state'
                        variant='empty2'
                        subHeading='Search is enabled even in zero state. Start typing to see empty state. Filter bar will only appear when filters are applied.'
                      />
                    }
                    emptyState={
                      <EmptyState
                        icon={<MixerHorizontalIcon />}
                        heading='empty state'
                        variant='empty1'
                        subHeading='Search applied but no results. Filter bar stays hidden when only search is used.'
                      />
                    }
                  />
                </DataTable>
              </Flex>

              <Flex direction='column' gap={3}>
                <Text size='small' weight='medium'>
                  Normal State - Data Present
                </Text>
                <Text
                  size='small'
                  style={{ color: 'var(--rs-color-text-subtle)' }}
                >
                  Filter bar and search are enabled when data exists.
                </Text>
                <DataTable
                  data={[
                    {
                      id: '1',
                      name: 'John Doe',
                      email: 'john@example.com',
                      role: 'Admin'
                    },
                    {
                      id: '2',
                      name: 'Jane Smith',
                      email: 'jane@example.com',
                      role: 'User'
                    },
                    {
                      id: '3',
                      name: 'Bob Johnson',
                      email: 'bob@example.com',
                      role: 'User'
                    }
                  ]}
                  columns={[
                    {
                      accessorKey: 'name',
                      header: 'Name',
                      enableColumnFilter: true,
                      filterType: 'string'
                    },
                    {
                      accessorKey: 'email',
                      header: 'Email',
                      enableColumnFilter: true,
                      filterType: 'string'
                    },
                    {
                      accessorKey: 'role',
                      header: 'Role',
                      enableColumnFilter: true,
                      filterType: 'string'
                    }
                  ]}
                  mode='client'
                  defaultSort={{ name: 'name', order: 'asc' }}
                >
                  <DataTable.Toolbar />
                  <DataTable.Search />
                  <DataTable.Content
                    zeroState={
                      <EmptyState
                        icon={<PersonIcon />}
                        heading='zero state'
                        variant='empty2'
                        subHeading='Get started by creating your first user.'
                      />
                    }
                    emptyState={
                      <EmptyState
                        icon={<MixerHorizontalIcon />}
                        heading='empty state'
                        variant='empty1'
                        subHeading="We couldn't find any matches for that keyword or filter."
                      />
                    }
                  />
                </DataTable>
              </Flex>
            </Flex>

            <Text
              size='large'
              weight='medium'
              style={{ marginTop: '32px', marginBottom: '16px' }}
            >
              ScrollArea Examples
            </Text>

            <Flex direction='column' gap={6}>
              {/* Basic Vertical ScrollArea */}
              <Flex direction='column' gap={3}>
                <Text size='small'>Basic Vertical ScrollArea:</Text>
                <ScrollArea
                  type='scroll'
                  style={{ height: '200px', width: '300px' }}
                >
                  <Flex direction='column' gap={2}>
                    {Array.from({ length: 20 }, (_, i) => (
                      <Text key={i} size='small'>
                        Item {i + 1}
                      </Text>
                    ))}
                  </Flex>
                </ScrollArea>
              </Flex>

              {/* Basic Horizontal ScrollArea */}
              <Flex direction='column' gap={3}>
                <Text size='small'>Basic Horizontal ScrollArea:</Text>
                <ScrollArea style={{ height: '150px', width: '300px' }}>
                  <Flex direction='row' gap={4} style={{ width: '600px' }}>
                    {Array.from({ length: 10 }, (_, i) => (
                      <Flex
                        key={i}
                        direction='column'
                        gap={2}
                        style={{ minWidth: '150px' }}
                      >
                        <Text weight='medium' size='small'>
                          Column {i + 1}
                        </Text>
                        <Text size='small' variant='secondary'>
                          Content here
                        </Text>
                      </Flex>
                    ))}
                  </Flex>
                </ScrollArea>
              </Flex>

              {/* Both Vertical and Horizontal Scrollbars */}
              <Flex direction='column' gap={3}>
                <Text size='small'>
                  Both Vertical and Horizontal Scrollbars (Corner auto-added):
                </Text>
                <ScrollArea style={{ height: '200px', width: '300px' }}>
                  <Flex direction='row' gap={4} style={{ width: '800px' }}>
                    {Array.from({ length: 15 }, (_, i) => (
                      <Flex
                        key={i}
                        direction='column'
                        gap={2}
                        style={{ minWidth: '180px' }}
                      >
                        <Text weight='medium' size='small'>
                          Column {i + 1}
                        </Text>
                        {Array.from({ length: 20 }, (_, j) => (
                          <Text key={j} size='small' variant='secondary'>
                            Row {j + 1}
                          </Text>
                        ))}
                      </Flex>
                    ))}
                  </Flex>
                </ScrollArea>
              </Flex>

              {/* Auto Scroll (default) */}
              <Flex direction='column' gap={3}>
                <Text size='small'>Auto Scroll (default):</Text>
                <ScrollArea style={{ height: '250px', width: '400px' }}>
                  <Flex direction='column' gap={4}>
                    {Array.from({ length: 50 }, (_, i) => (
                      <Flex key={i} direction='column' gap={2}>
                        <Text weight='medium' size='small'>
                          Section {i + 1}
                        </Text>
                        <Text size='small' variant='secondary'>
                          This is some content for section {i + 1}. The
                          scrollbar will appear on hover and overlay the content
                          without affecting the layout.
                        </Text>
                      </Flex>
                    ))}
                  </Flex>
                </ScrollArea>
              </Flex>
            </Flex>

            <Text
              size='large'
              weight='medium'
              style={{ marginTop: '32px', marginBottom: '16px' }}
            >
              Callout
            </Text>

            <Flex direction='column' gap={6} style={{ maxWidth: '600px' }}>
              {/* Types */}
              <Flex direction='column' gap={3}>
                <Text size='small' variant='secondary'>
                  Types
                </Text>
                <Flex direction='column' gap={3}>
                  <Callout width='100%' type='grey'>
                    Grey callout (default)
                  </Callout>
                  <Callout width='100%' type='success'>
                    Success callout
                  </Callout>
                  <Callout width='100%' type='alert'>
                    Alert callout
                  </Callout>
                  <Callout width='100%' type='gradient'>
                    Gradient callout
                  </Callout>
                  <Callout width='100%' type='accent'>
                    Accent callout
                  </Callout>
                  <Callout width='100%' type='attention'>
                    Attention callout
                  </Callout>
                  <Callout width='100%' type='normal'>
                    Normal callout
                  </Callout>
                </Flex>
              </Flex>

              {/* Outline */}
              <Flex direction='column' gap={3}>
                <Text size='small' variant='secondary'>
                  Outline
                </Text>
                <Callout width='100%' type='success'>
                  Without outline
                </Callout>
                <Callout width='100%' type='success' outline>
                  With outline
                </Callout>
              </Flex>

              {/* High contrast */}
              <Flex direction='column' gap={3}>
                <Text size='small' variant='secondary'>
                  High contrast
                </Text>
                <Callout width='100%' type='alert'>
                  Normal contrast
                </Callout>
                <Callout width='100%' type='alert' highContrast>
                  High contrast
                </Callout>
                <Callout width='100%' type='accent' outline highContrast>
                  Outline + high contrast
                </Callout>
              </Flex>

              {/* Custom icon */}
              <Flex direction='column' gap={3}>
                <Text size='small' variant='secondary'>
                  Custom icon
                </Text>
                <Callout width='100%' type='attention' icon={<RadixBellIcon />}>
                  Callout with a custom bell icon
                </Callout>
                <Callout width='100%' type='grey' icon={null}>
                  Callout with no icon
                </Callout>
              </Flex>

              {/* With action */}
              <Flex direction='column' gap={3}>
                <Text size='small' variant='secondary'>
                  With action
                </Text>
                <Callout
                  width='100%'
                  type='accent'
                  action={
                    <Button size='small' variant='outline'>
                      Upgrade
                    </Button>
                  }
                >
                  You&apos;re on the free plan
                </Callout>
              </Flex>

              {/* Dismissible (controlled) */}
              <Flex direction='column' gap={3}>
                <Text size='small' variant='secondary'>
                  Dismissible (controlled — consumer removes it in onDismiss)
                </Text>
                {calloutDismissed ? (
                  <Button
                    size='small'
                    onClick={() => setCalloutDismissed(false)}
                  >
                    Restore callout
                  </Button>
                ) : (
                  <Callout
                    width='100%'
                    type='success'
                    dismissible
                    onDismiss={() => setCalloutDismissed(true)}
                  >
                    Dismiss me
                  </Callout>
                )}
              </Flex>

              {/* Custom width */}
              <Flex direction='column' gap={3}>
                <Text size='small' variant='secondary'>
                  Custom width
                </Text>
                <Callout type='gradient' width={240}>
                  width = 240
                </Callout>
                <Callout type='gradient' width={480}>
                  width = 480
                </Callout>
              </Flex>

              {/*Figma replicas*/}
              <Flex direction='column' gap={3}>
                <Text size='small' variant='secondary'>
                  Figma replicas
                </Text>
                <Callout type='normal' outline>
                  A short message to attract user’s attention
                </Callout>
                <Callout type='success' outline>
                  A short message to attract user’s attention
                </Callout>
                <Callout type='gradient'>
                  A short message to attract user’s attention
                </Callout>
                <Callout type='accent'>
                  A short message to attract user’s attention
                </Callout>
                <Callout
                  type='grey'
                  action={
                    <Button variant='outline' color='neutral' size='small'>
                      Button
                    </Button>
                  }
                >
                  A short message to attract user’s attention
                </Callout>
                <Callout type='grey' dismissible>
                  A short message to attract user’s attention
                </Callout>
                <Callout
                  type='grey'
                  action={
                    <Button variant='outline' color='neutral' size='small'>
                      Button
                    </Button>
                  }
                >
                  A short message to attract user’s attention
                </Callout>
                <Callout type='gradient'>
                  A short message to attract user’s attention
                </Callout>
                <Callout type='gradient' outline>
                  A short message to attract user’s attention
                </Callout>
                <Callout type='gradient' highContrast>
                  A short message to attract user’s attention
                </Callout>
                <Callout type='gradient' outline highContrast>
                  A short message to attract user’s attention
                </Callout>
                <Callout type='normal'>
                  A short message to attract user’s attention
                </Callout>
                <Callout type='normal' outline>
                  A short message to attract user’s attention
                </Callout>
                <Callout type='normal' highContrast>
                  A short message to attract user’s attention
                </Callout>
                <Callout type='normal' outline highContrast>
                  A short message to attract user’s attention
                </Callout>
                <Callout type='grey'>
                  A short message to attract user’s attention
                </Callout>
                <Callout type='grey' outline>
                  A short message to attract user’s attention
                </Callout>
                <Callout type='grey' highContrast>
                  A short message to attract user’s attention
                </Callout>
                <Callout type='grey' outline highContrast>
                  A short message to attract user’s attention
                </Callout>
                <Callout type='accent'>
                  A short message to attract user’s attention
                </Callout>
                <Callout type='accent' outline>
                  A short message to attract user’s attention
                </Callout>
                <Callout type='accent' highContrast>
                  A short message to attract user’s attention
                </Callout>
                <Callout type='accent' outline highContrast>
                  A short message to attract user’s attention
                </Callout>
                <Callout type='alert'>
                  A short message to attract user’s attention
                </Callout>
                <Callout type='alert' outline>
                  A short message to attract user’s attention
                </Callout>
                <Callout type='alert' highContrast>
                  A short message to attract user’s attention
                </Callout>
                <Callout type='alert' outline highContrast>
                  A short message to attract user’s attention
                </Callout>
                <Callout type='success'>
                  A short message to attract user’s attention
                </Callout>
                <Callout type='success' outline>
                  A short message to attract user’s attention
                </Callout>
                <Callout type='success' highContrast>
                  A short message to attract user’s attention
                </Callout>
                <Callout type='success' outline highContrast>
                  A short message to attract user’s attention
                </Callout>
                <Callout type='attention'>
                  A short message to attract user’s attention
                </Callout>
                <Callout type='attention' outline>
                  A short message to attract user’s attention
                </Callout>
                <Callout type='attention' highContrast>
                  A short message to attract user’s attention
                </Callout>
                <Callout type='attention' outline highContrast>
                  A short message to attract user’s attention
                </Callout>
                <Callout type='gradient'>
                  A short message to attract user’s attention
                </Callout>
                <Callout type='gradient' outline>
                  A short message to attract user’s attention
                </Callout>
                <Callout type='gradient' highContrast>
                  A short message to attract user’s attention
                </Callout>
                <Callout type='gradient' outline highContrast>
                  A short message to attract user’s attention
                </Callout>
              </Flex>
            </Flex>

            <Flex justify='center' style={{ marginTop: 40 }}>
              <Button type='submit'>Submit button</Button>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default Page;
