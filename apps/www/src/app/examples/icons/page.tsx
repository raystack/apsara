'use client';

/**
 * A/B review page for the icon registry.
 *
 * The left column of every pair renders inside `<Theme icons={radixIcons}>`,
 * which restores the old @radix-ui/react-icons appearance. The right column
 * uses the lucide defaults that Apsara now ships. So this page is both the
 * review tool and a live test of the override mechanism.
 *
 * The `radixIcons` map below lives in this file only — the package ships no
 * radix preset. It is also the map that the migration guide gives to a consumer
 * that wants to keep the old appearance.
 *
 * DELETE THIS PAGE after the release.
 */

import {
  ArrowDownIcon as RadixArrowDown,
  ArrowUpIcon as RadixArrowUp,
  CalendarIcon as RadixCalendar,
  CheckIcon as RadixCheck,
  CheckCircledIcon as RadixCheckCircled,
  ChevronDownIcon as RadixChevronDown,
  ChevronLeftIcon as RadixChevronLeft,
  ChevronRightIcon as RadixChevronRight,
  CopyIcon as RadixCopy,
  Cross1Icon as RadixCross1,
  CrossCircledIcon as RadixCrossCircled,
  DotsHorizontalIcon as RadixDotsHorizontal,
  ExclamationTriangleIcon as RadixExclamationTriangle,
  FileTextIcon as RadixFileText,
  InfoCircledIcon as RadixInfoCircled,
  MagnifyingGlassIcon as RadixMagnifyingGlass,
  MinusIcon as RadixMinus,
  MixerHorizontalIcon as RadixMixerHorizontal,
  MoonIcon as RadixMoon,
  PlusIcon as RadixPlus,
  SizeIcon as RadixSize,
  StopIcon as RadixStop,
  SunIcon as RadixSun,
  TableIcon as RadixTable,
  TextAlignBottomIcon as RadixTextAlignBottom,
  TextAlignTopIcon as RadixTextAlignTop,
  TriangleDownIcon as RadixTriangleDown
} from '@radix-ui/react-icons';
import {
  Accordion,
  ArrowDownIcon,
  ArrowDownWideNarrowIcon,
  ArrowUpIcon,
  ArrowUpNarrowWideIcon,
  Breadcrumb,
  Button,
  CalendarDaysIcon,
  Callout,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleCheckIcon,
  CircleXIcon,
  CoPilotIcon,
  CopyIcon,
  EllipsisIcon,
  ExpandIcon,
  FileTextIcon,
  Flex,
  type IconOverrides,
  InfoIcon,
  ListFilterIcon,
  Menu,
  MinusIcon,
  MoonIcon,
  NumberField,
  PlusIcon,
  Search,
  SearchIcon,
  Select,
  ShrinkIcon,
  SlidersHorizontalIcon,
  SquareIcon,
  SunIcon,
  TableIcon,
  Text,
  Theme,
  TriangleAlertIcon,
  XIcon
} from '@raystack/apsara';

/** The map that restores the radix appearance. 27 of the 29 internal keys. */
const radixIcons: IconOverrides = {
  XIcon: RadixCross1,
  CircleXIcon: RadixCrossCircled,
  CircleCheckIcon: RadixCheckCircled,
  TriangleAlertIcon: RadixExclamationTriangle,
  InfoIcon: RadixInfoCircled,
  CheckIcon: RadixCheck,
  CopyIcon: RadixCopy,
  SearchIcon: RadixMagnifyingGlass,
  ChevronDownIcon: RadixChevronDown,
  ChevronLeftIcon: RadixChevronLeft,
  ChevronRightIcon: RadixChevronRight,
  ArrowUpIcon: RadixArrowUp,
  ArrowDownIcon: RadixArrowDown,
  PlusIcon: RadixPlus,
  MinusIcon: RadixMinus,
  EllipsisIcon: RadixDotsHorizontal,
  ExpandIcon: RadixSize,
  ShrinkIcon: RadixMinus,
  SquareIcon: RadixStop,
  CalendarDaysIcon: RadixCalendar,
  FileTextIcon: RadixFileText,
  TableIcon: RadixTable,
  SlidersHorizontalIcon: RadixMixerHorizontal,
  ArrowUpNarrowWideIcon: RadixTextAlignTop,
  ArrowDownWideNarrowIcon: RadixTextAlignBottom,
  SunIcon: RadixSun,
  MoonIcon: RadixMoon
};

/**
 * The sidebar used the solid `TriangleDownIcon`, so its "before" is not the
 * radix `ChevronDownIcon` that other call sites used. Kept separate so the map
 * above stays a straight per-key preset.
 */
const sidebarBefore: IconOverrides = { ChevronDownIcon: RadixTriangleDown };

type Row = {
  key: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  replaces: string;
  changes?: string;
  /** The "before" is not in `radixIcons` — see the note in each row. */
  before?: IconOverrides;
};

const ROWS: Row[] = [
  { key: 'XIcon', Icon: XIcon, replaces: 'Cross1Icon, Cross2Icon' },
  {
    key: 'CircleXIcon',
    Icon: CircleXIcon,
    replaces: 'CrossCircledIcon',
    changes: 'Shared key: the toast error and the search clear'
  },
  {
    key: 'CircleCheckIcon',
    Icon: CircleCheckIcon,
    replaces: 'CheckCircledIcon'
  },
  {
    key: 'TriangleAlertIcon',
    Icon: TriangleAlertIcon,
    replaces: 'ExclamationTriangleIcon'
  },
  { key: 'InfoIcon', Icon: InfoIcon, replaces: 'InfoCircledIcon' },
  { key: 'CheckIcon', Icon: CheckIcon, replaces: 'CheckIcon' },
  { key: 'CopyIcon', Icon: CopyIcon, replaces: 'CopyIcon' },
  { key: 'SearchIcon', Icon: SearchIcon, replaces: 'MagnifyingGlassIcon' },
  {
    key: 'ChevronDownIcon',
    Icon: ChevronDownIcon,
    replaces: 'ChevronDownIcon'
  },
  {
    key: 'ChevronDownIcon (sidebar)',
    Icon: ChevronDownIcon,
    replaces: 'TriangleDownIcon',
    changes: 'A solid triangle becomes a chevron. lucide has no solid caret',
    before: sidebarBefore
  },
  {
    key: 'ChevronLeftIcon',
    Icon: ChevronLeftIcon,
    replaces: 'ChevronLeftIcon'
  },
  {
    key: 'ChevronRightIcon',
    Icon: ChevronRightIcon,
    replaces: 'ChevronRightIcon, in-house TriangleRightIcon',
    changes: 'The submenu marker changes: a solid triangle becomes a chevron'
  },
  { key: 'ArrowUpIcon', Icon: ArrowUpIcon, replaces: 'ArrowUpIcon' },
  { key: 'ArrowDownIcon', Icon: ArrowDownIcon, replaces: 'ArrowDownIcon' },
  { key: 'PlusIcon', Icon: PlusIcon, replaces: 'PlusIcon' },
  {
    key: 'MinusIcon',
    Icon: MinusIcon,
    replaces: 'MinusIcon',
    changes: 'The number field only'
  },
  { key: 'EllipsisIcon', Icon: EllipsisIcon, replaces: 'DotsHorizontalIcon' },
  {
    key: 'ExpandIcon',
    Icon: ExpandIcon,
    replaces: 'SizeIcon',
    changes: 'The chat panel. The appearance changes'
  },
  {
    key: 'ShrinkIcon',
    Icon: ShrinkIcon,
    replaces: 'MinusIcon',
    changes:
      'The chat panel. The appearance changes. Expand and Shrink are a matched pair'
  },
  {
    key: 'SquareIcon',
    Icon: SquareIcon,
    replaces: 'StopIcon',
    changes: 'The radix icon is solid'
  },
  {
    key: 'CalendarDaysIcon',
    Icon: CalendarDaysIcon,
    replaces: 'CalendarIcon',
    changes: 'The Figma file gives calendar-days, not calendar'
  },
  { key: 'FileTextIcon', Icon: FileTextIcon, replaces: 'FileTextIcon' },
  { key: 'TableIcon', Icon: TableIcon, replaces: 'TableIcon' },
  {
    key: 'SlidersHorizontalIcon',
    Icon: SlidersHorizontalIcon,
    replaces: 'MixerHorizontalIcon'
  },
  {
    key: 'ArrowUpNarrowWideIcon',
    Icon: ArrowUpNarrowWideIcon,
    replaces: 'TextAlignTopIcon',
    changes: 'The appearance changes'
  },
  {
    key: 'ArrowDownWideNarrowIcon',
    Icon: ArrowDownWideNarrowIcon,
    replaces: 'TextAlignBottomIcon',
    changes: 'The appearance changes'
  },
  { key: 'SunIcon', Icon: SunIcon, replaces: 'SunIcon' },
  { key: 'MoonIcon', Icon: MoonIcon, replaces: 'MoonIcon' },
  {
    key: 'ListFilterIcon',
    Icon: ListFilterIcon,
    replaces: 'in-house FilterIcon',
    changes:
      'No radix equivalent, so the left cell shows the lucide icon too. The shape is almost the same as the in-house SVG'
  },
  {
    key: 'CoPilotIcon',
    Icon: CoPilotIcon,
    replaces: 'in-house co-pilot.svg',
    changes: 'The default stays the in-house SVG, so both cells are identical'
  }
];

const panel = {
  padding: 'var(--rs-space-5)',
  borderRadius: 'var(--rs-space-3)',
  border: '1px solid var(--rs-color-border-base-primary)',
  backgroundColor: 'var(--rs-color-background-base-primary)'
};

const cell = {
  padding: 'var(--rs-space-3) var(--rs-space-4)',
  borderBottom: '1px solid var(--rs-color-border-base-secondary)',
  textAlign: 'left' as const,
  verticalAlign: 'middle' as const
};

/** Side by side: the same children under radix, then under the lucide default. */
function AB({
  children,
  before = radixIcons
}: {
  children: React.ReactNode;
  before?: IconOverrides;
}) {
  return (
    <Flex gap={7} align='center'>
      <Flex
        align='center'
        justify='center'
        style={{ minWidth: 120, ...panel, padding: 'var(--rs-space-4)' }}
      >
        <Theme icons={before}>{children}</Theme>
      </Flex>
      <Flex
        align='center'
        justify='center'
        style={{ minWidth: 120, ...panel, padding: 'var(--rs-space-4)' }}
      >
        {children}
      </Flex>
    </Flex>
  );
}

export default function IconsExamplePage() {
  return (
    <Flex
      direction='column'
      gap={9}
      style={{ padding: 'var(--rs-space-9)', maxWidth: 1100 }}
    >
      <Flex direction='column' gap={3}>
        <Text size='large' weight='medium'>
          Icon registry — A/B review
        </Text>
        <Text size='regular' variant='secondary'>
          The left column of every pair restores the old radix appearance
          through <code>&lt;Theme icons=&#123;radixIcons&#125;&gt;</code>. The
          right column is the lucide default that Apsara now ships. 29 internal
          keys, 9 of which change the appearance.
        </Text>
        <Text size='small' variant='secondary'>
          Base props: <code>width=16 height=16 strokeWidth=1.5</code>. lucide
          draws in a 24-unit viewBox, so the rendered stroke is{' '}
          <code>strokeWidth × 16 / 24 = 1px</code> — the stroke weight the Figma
          library uses at 16px.
        </Text>
      </Flex>

      <Flex direction='column' gap={5}>
        <Text size='large' weight='medium'>
          The internal 29
        </Text>
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th style={cell}>
                <Text size='small' weight='medium'>
                  Key
                </Text>
              </th>
              <th style={cell}>
                <Text size='small' weight='medium'>
                  Before (radix)
                </Text>
              </th>
              <th style={cell}>
                <Text size='small' weight='medium'>
                  After (lucide)
                </Text>
              </th>
              <th style={cell}>
                <Text size='small' weight='medium'>
                  Replaces
                </Text>
              </th>
              <th style={cell}>
                <Text size='small' weight='medium'>
                  Note
                </Text>
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map(({ key, Icon, replaces, changes, before }) => (
              <tr
                key={key}
                style={
                  changes
                    ? {
                        background:
                          'var(--rs-color-background-base-primary-hover)'
                      }
                    : undefined
                }
              >
                <td style={cell}>
                  <Text size='small'>
                    <code>{key}</code>
                  </Text>
                </td>
                <td style={cell}>
                  <Theme icons={before ?? radixIcons}>
                    <Icon />
                  </Theme>
                </td>
                <td style={cell}>
                  <Icon />
                </td>
                <td style={cell}>
                  <Text size='small' variant='secondary'>
                    {replaces}
                  </Text>
                </td>
                <td style={{ ...cell, maxWidth: 280 }}>
                  <Text size='micro' variant='secondary'>
                    {changes ?? ''}
                  </Text>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Flex>

      <Flex direction='column' gap={5}>
        <Text size='large' weight='medium'>
          Stroke weight
        </Text>
        <Text size='small' variant='secondary'>
          1.5 matches the Figma library, which draws a 1px stroke in a 16px
          frame. The neighbours are here to confirm that reading on screen.
        </Text>
        <Flex gap={7} align='center'>
          {[1, 1.25, 1.5, 1.75, 2].map(weight => (
            <Flex
              key={weight}
              direction='column'
              gap={2}
              align='center'
              style={panel}
            >
              <Theme iconProps={{ strokeWidth: weight }}>
                <Flex gap={3} align='center'>
                  <SearchIcon />
                  <ChevronDownIcon />
                  <XIcon />
                  <SunIcon />
                </Flex>
              </Theme>
              <Text size='micro' variant='secondary'>
                {weight}
                {weight === 1.5 ? ' (design)' : ''}
              </Text>
            </Flex>
          ))}
        </Flex>
      </Flex>

      <Flex direction='column' gap={5}>
        <Text size='large' weight='medium'>
          The components that show these icons
        </Text>
        <Text size='small' variant='secondary'>
          Each pair is the same component: radix on the left, lucide on the
          right.
        </Text>

        <Flex direction='column' gap={7}>
          <Labelled label='Search — SearchIcon, CircleXIcon'>
            <AB>
              <Search
                placeholder='Search'
                defaultValue='query'
                showClearButton
              />
            </AB>
          </Labelled>

          <Labelled label='Select — ChevronDownIcon'>
            <AB>
              <Select defaultValue='apple'>
                <Select.Trigger style={{ width: 160 }}>
                  <Select.Value placeholder='Select a fruit' />
                </Select.Trigger>
                <Select.Content>
                  <Select.Group>
                    <Select.Item value='apple'>Apple</Select.Item>
                    <Select.Item value='banana'>Banana</Select.Item>
                  </Select.Group>
                </Select.Content>
              </Select>
            </AB>
          </Labelled>

          <Labelled label='NumberField — MinusIcon, PlusIcon'>
            <AB>
              <NumberField defaultValue={3} />
            </AB>
          </Labelled>

          <Labelled label='Callout — XIcon, InfoIcon'>
            <AB>
              <Callout
                type='grey'
                onDismiss={() => {
                  // The review page keeps the callout mounted.
                }}
              >
                A callout
              </Callout>
            </AB>
          </Labelled>

          <Labelled label='Accordion — ChevronDownIcon'>
            <AB>
              <Accordion>
                <Accordion.Item value='item-1'>
                  <Accordion.Trigger>Is it accessible?</Accordion.Trigger>
                  <Accordion.Content>Yes.</Accordion.Content>
                </Accordion.Item>
              </Accordion>
            </AB>
          </Labelled>

          <Labelled label='Breadcrumb — ChevronRightIcon, EllipsisIcon'>
            <AB>
              <Breadcrumb>
                <Breadcrumb.Item href='#'>Home</Breadcrumb.Item>
                <Breadcrumb.Separator />
                <Breadcrumb.Ellipsis />
                <Breadcrumb.Separator />
                <Breadcrumb.Item href='#' current>
                  Shoes
                </Breadcrumb.Item>
              </Breadcrumb>
            </AB>
          </Labelled>

          <Labelled label='Menu submenu — ChevronRightIcon (was a solid triangle)'>
            <AB>
              <Menu>
                <Menu.Trigger render={<Button size='small' />}>
                  Actions
                </Menu.Trigger>
                <Menu.Content>
                  <Menu.Item>Assign member…</Menu.Item>
                  <Menu.Submenu>
                    <Menu.SubmenuTrigger>Export</Menu.SubmenuTrigger>
                    <Menu.SubmenuContent>
                      <Menu.Item>CSV</Menu.Item>
                    </Menu.SubmenuContent>
                  </Menu.Submenu>
                </Menu.Content>
              </Menu>
            </AB>
          </Labelled>

          <Labelled label='Buttons with icons — CopyIcon, CheckIcon'>
            <AB>
              <Flex gap={3} align='center'>
                <Button size='small' leadingIcon={<CopyIcon />}>
                  Copy
                </Button>
                <Button size='small' leadingIcon={<CheckIcon />}>
                  Done
                </Button>
              </Flex>
            </AB>
          </Labelled>

          <Labelled label='Data controls — SlidersHorizontalIcon, sort arrows, ListFilterIcon'>
            <AB>
              <Flex gap={4} align='center'>
                <SlidersHorizontalIcon />
                <ArrowUpNarrowWideIcon />
                <ArrowDownWideNarrowIcon />
                <ListFilterIcon />
                <TableIcon />
              </Flex>
            </AB>
          </Labelled>

          <Labelled label='Toast icons — InfoIcon, CircleCheckIcon, CircleXIcon, TriangleAlertIcon'>
            <AB>
              <Flex gap={4} align='center'>
                <InfoIcon />
                <CircleCheckIcon />
                <CircleXIcon />
                <TriangleAlertIcon />
                <XIcon />
              </Flex>
            </AB>
          </Labelled>

          <Labelled label='Chat panel controls — ExpandIcon, ShrinkIcon (a matched pair)'>
            <AB>
              <Flex gap={4} align='center'>
                <ExpandIcon />
                <ShrinkIcon />
                <CoPilotIcon />
              </Flex>
            </AB>
          </Labelled>

          <Labelled label='Prompt input — ArrowUpIcon, SquareIcon (was a solid StopIcon)'>
            <AB>
              <Flex gap={4} align='center'>
                <ArrowUpIcon />
                <SquareIcon />
                <ArrowDownIcon />
              </Flex>
            </AB>
          </Labelled>

          <Labelled label='Sidebar collapse — ChevronDownIcon (was a solid TriangleDownIcon)'>
            <AB before={sidebarBefore}>
              <ChevronDownIcon />
            </AB>
          </Labelled>
        </Flex>
      </Flex>
    </Flex>
  );
}

function Labelled({
  label,
  children
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Flex direction='column' gap={3}>
      <Text size='small' weight='medium'>
        {label}
      </Text>
      {children}
    </Flex>
  );
}
