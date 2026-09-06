'use client';

import {
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Calendar,
  Callout,
  Checkbox,
  Chip,
  Field,
  IconButton,
  Indicator,
  Input,
  Kbd,
  Menu,
  Meter,
  Popover,
  Progress,
  Radio,
  Select,
  Skeleton,
  Slider,
  Spinner,
  Switch,
  Tabs,
  Text,
  Toast,
  Toggle,
  Tooltip,
  toastManager
} from '@raystack/apsara';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowUpRight,
  Bell,
  Bold,
  Copy,
  Italic,
  Mail,
  MoreHorizontal,
  Pencil,
  Trash2,
  Underline
} from 'lucide-react';
import Link from 'next/link';
import { type ReactNode, useState } from 'react';
import styles from './landing.module.css';

type SpecimenProps = {
  index: number;
  name: string;
  slug: string;
  wide?: boolean;
  align?: 'center' | 'stretch';
  children: ReactNode;
};

function Specimen({
  index,
  name,
  slug,
  wide,
  align = 'center',
  children
}: SpecimenProps) {
  return (
    <div className={`${styles.specimen} ${wide ? styles.specimenWide : ''}`}>
      <div className={`${styles.label} ${styles.specimenHead}`}>
        <span>
          <span className={styles.specimenIndex}>
            {String(index).padStart(2, '0')}
          </span>
          <span className={styles.specimenName}>{name}</span>
        </span>
        <Link href={`/docs/components/${slug}`} aria-label={`${name} docs`}>
          <ArrowUpRight size={12} strokeWidth={1.5} />
        </Link>
      </div>
      <div className={styles.specimenBody} data-align={align}>
        {children}
      </div>
    </div>
  );
}

function CalendarSpecimen() {
  const [date, setDate] = useState<Date | undefined>(() => new Date());
  return <Calendar mode='single' selected={date} onSelect={setDate} />;
}

function SliderSpecimen() {
  const [value, setValue] = useState<number | readonly number[]>(40);
  const [range, setRange] = useState<number | readonly number[]>([20, 70]);
  return (
    <div className={styles.stack}>
      <div className={styles.fieldRow}>
        <Text size='small' variant='secondary'>
          Opacity
        </Text>
        <span className={styles.mono}>{value}%</span>
      </div>
      <Slider value={value} onValueChange={v => setValue(v)} />
      <div className={styles.fieldRow}>
        <Text size='small' variant='secondary'>
          Range
        </Text>
        <span className={styles.mono}>
          {Array.isArray(range) ? range.join(' – ') : range}
        </span>
      </div>
      <Slider variant='range' value={range} onValueChange={v => setRange(v)} />
    </div>
  );
}

function ChipSpecimen() {
  const [tags, setTags] = useState(['React 19', 'Base UI', 'TypeScript']);
  return (
    <>
      <div className={styles.row}>
        <Badge variant='accent'>Accent</Badge>
        <Badge variant='success'>Success</Badge>
        <Badge variant='warning'>Warning</Badge>
        <Badge variant='danger'>Danger</Badge>
        <Badge variant='neutral'>Neutral</Badge>
      </div>
      <div className={styles.row}>
        {tags.map(tag => (
          <Chip
            key={tag}
            isDismissible
            onDismiss={() => setTags(t => t.filter(x => x !== tag))}
          >
            {tag}
          </Chip>
        ))}
        {tags.length < 3 && (
          <Chip
            color='accent'
            onClick={() => setTags(['React 19', 'Base UI', 'TypeScript'])}
          >
            Reset
          </Chip>
        )}
      </div>
    </>
  );
}

function ToastSpecimen() {
  const [count, setCount] = useState(0);
  return (
    <div className={styles.row}>
      <Button
        variant='outline'
        color='neutral'
        onClick={() => {
          setCount(c => c + 1);
          toastManager.add({
            title: 'Saved',
            description: `Change ${count + 1} written to the sheet.`,
            type: 'success'
          });
        }}
      >
        Show toast
      </Button>
      <Button
        variant='outline'
        color='neutral'
        onClick={() =>
          toastManager.promise(
            new Promise(resolve => setTimeout(resolve, 1600)),
            {
              loading: { title: 'Publishing…' },
              success: { title: 'Published', type: 'success' },
              error: { title: 'Failed', type: 'error' }
            }
          )
        }
      >
        Promise
      </Button>
    </div>
  );
}

function SelectSpecimen() {
  const [value, setValue] = useState('indigo');
  return (
    <div className={styles.stack}>
      <Select value={value} onValueChange={setValue}>
        <Select.Trigger>
          <Select.Value placeholder='Accent' />
        </Select.Trigger>
        <Select.Content>
          <Select.Group>
            <Select.Label>Accent color</Select.Label>
            <Select.Item value='indigo'>Indigo</Select.Item>
            <Select.Item value='orange'>Orange</Select.Item>
            <Select.Item value='mint'>Mint</Select.Item>
          </Select.Group>
        </Select.Content>
      </Select>
      <Field label='Email' description='Used for sign-in only.'>
        <Input
          required
          placeholder='you@company.com'
          leadingIcon={<Mail size={14} strokeWidth={1.5} />}
        />
      </Field>
    </div>
  );
}

export default function Specimens() {
  return (
    <Toast.Provider position='bottom-right'>
      <div className={styles.specimens}>
        <Specimen index={1} name='Button' slug='button'>
          <div className={styles.row}>
            <Button>Solid</Button>
            <Button variant='outline'>Outline</Button>
            <Button variant='ghost'>Ghost</Button>
            <Button variant='text'>Text</Button>
          </div>
          <div className={styles.row}>
            <Button color='neutral' size='small'>
              Neutral
            </Button>
            <Button color='success' size='small'>
              Success
            </Button>
            <Button color='danger' variant='outline' size='small'>
              Danger
            </Button>
            <Button size='small' loading loaderText='Saving' />
          </div>
        </Specimen>

        <Specimen index={2} name='Badge · Chip' slug='badge'>
          <ChipSpecimen />
        </Specimen>

        <Specimen index={3} name='Switch · Checkbox · Radio' slug='switch'>
          <div className={styles.stack}>
            <div className={styles.fieldRow}>
              <Text size='small'>Email digests</Text>
              <Switch defaultChecked size='small' />
            </div>
            <div className={styles.fieldRow}>
              <Text size='small'>Two-factor auth</Text>
              <Switch size='small' />
            </div>
            <Checkbox.Group
              defaultValue={['build']}
              orientation='horizontal'
              aria-label='Notify on'
            >
              <Text size='small' render={<label />}>
                <Checkbox value='build' size='small' /> Builds
              </Text>
              <Text size='small' render={<label />}>
                <Checkbox value='deploy' size='small' /> Deploys
              </Text>
            </Checkbox.Group>
            <Radio.Group
              defaultValue='weekly'
              orientation='horizontal'
              size='small'
              aria-label='Cadence'
            >
              <Text size='small' render={<label />}>
                <Radio value='daily' size='small' /> Daily
              </Text>
              <Text size='small' render={<label />}>
                <Radio value='weekly' size='small' /> Weekly
              </Text>
            </Radio.Group>
          </div>
        </Specimen>

        <Specimen index={4} name='Tabs' slug='tabs' align='stretch'>
          <Tabs defaultValue='overview' size='small'>
            <Tabs.List>
              <Tabs.Tab value='overview'>Overview</Tabs.Tab>
              <Tabs.Tab value='usage'>Usage</Tabs.Tab>
              <Tabs.Tab value='billing'>Billing</Tabs.Tab>
            </Tabs.List>
            <Tabs.Content value='overview'>
              <Text size='small' variant='secondary'>
                Three variants: segmented, standalone and plain. The indicator
                slides between tabs on its own.
              </Text>
            </Tabs.Content>
            <Tabs.Content value='usage'>
              <Text size='small' variant='secondary'>
                Roving focus and arrow-key navigation come from Base UI.
              </Text>
            </Tabs.Content>
            <Tabs.Content value='billing'>
              <Text size='small' variant='secondary'>
                Controlled or uncontrolled, horizontal or vertical.
              </Text>
            </Tabs.Content>
          </Tabs>
          <Tabs defaultValue='a' variant='standalone' size='small'>
            <Tabs.List>
              <Tabs.Tab value='a'>Standalone</Tabs.Tab>
              <Tabs.Tab value='b'>Variant</Tabs.Tab>
            </Tabs.List>
          </Tabs>
        </Specimen>

        <Specimen index={5} name='Slider' slug='slider'>
          <SliderSpecimen />
        </Specimen>

        <Specimen index={6} name='Progress · Meter' slug='progress'>
          <div className={styles.stack}>
            <Progress value={64}>
              <Progress.Label>Uploading</Progress.Label>
              <Progress.Value />
              <Progress.Track />
            </Progress>
            <Meter value={38}>
              <Meter.Label>Storage</Meter.Label>
              <Meter.Value />
              <Meter.Track />
            </Meter>
          </div>
          <div className={styles.row}>
            <Progress value={64} variant='circular' />
            <Progress value={null} variant='circular' />
            <Spinner size={3} />
            <Spinner size={3} color='accent' />
          </div>
        </Specimen>

        <Specimen index={7} name='Select · Field' slug='select'>
          <SelectSpecimen />
        </Specimen>

        <Specimen index={8} name='Calendar' slug='calendar'>
          <CalendarSpecimen />
        </Specimen>

        <Specimen index={9} name='Menu · Popover · Tooltip' slug='menu'>
          <div className={styles.row}>
            <Menu>
              <Menu.Trigger
                render={<Button variant='outline' color='neutral' />}
              >
                Actions
              </Menu.Trigger>
              <Menu.Content>
                <Menu.Item leadingIcon={<Pencil size={14} strokeWidth={1.5} />}>
                  Rename
                </Menu.Item>
                <Menu.Item leadingIcon={<Copy size={14} strokeWidth={1.5} />}>
                  Duplicate
                </Menu.Item>
                <Menu.Separator />
                <Menu.Item leadingIcon={<Trash2 size={14} strokeWidth={1.5} />}>
                  Delete
                </Menu.Item>
              </Menu.Content>
            </Menu>
            <Popover>
              <Popover.Trigger
                render={<Button variant='outline' color='neutral' />}
              >
                Popover
              </Popover.Trigger>
              <Popover.Content side='bottom' align='start'>
                <Text size='small'>
                  Anchored, collision-aware, dismisses on outside press.
                </Text>
              </Popover.Content>
            </Popover>
            <Tooltip>
              <Tooltip.Trigger
                render={<IconButton size={3} aria-label='More' />}
              >
                <MoreHorizontal size={14} strokeWidth={1.5} />
              </Tooltip.Trigger>
              <Tooltip.Content showArrow>More options</Tooltip.Content>
            </Tooltip>
          </div>
        </Specimen>

        <Specimen index={10} name='Toggle · Kbd' slug='toggle'>
          <div className={styles.row}>
            <Toggle.Group defaultValue={['bold']}>
              <Toggle value='bold' aria-label='Bold'>
                <Bold size={14} strokeWidth={1.5} />
              </Toggle>
              <Toggle value='italic' aria-label='Italic'>
                <Italic size={14} strokeWidth={1.5} />
              </Toggle>
              <Toggle value='underline' aria-label='Underline'>
                <Underline size={14} strokeWidth={1.5} />
              </Toggle>
            </Toggle.Group>
            <Toggle.Group defaultValue={['left']}>
              <Toggle value='left' aria-label='Align left'>
                <AlignLeft size={14} strokeWidth={1.5} />
              </Toggle>
              <Toggle value='center' aria-label='Align center'>
                <AlignCenter size={14} strokeWidth={1.5} />
              </Toggle>
              <Toggle value='right' aria-label='Align right'>
                <AlignRight size={14} strokeWidth={1.5} />
              </Toggle>
            </Toggle.Group>
          </div>
          <div className={styles.row}>
            <Text size='small' variant='secondary'>
              Command palette
            </Text>
            <Kbd.Group variant='solid'>
              <Kbd variant='solid'>⌘</Kbd>
              <Kbd variant='solid'>K</Kbd>
            </Kbd.Group>
            <Text size='small' variant='secondary'>
              Save
            </Text>
            <Kbd.Group variant='ghost'>
              <Kbd variant='ghost'>⌘</Kbd>
              <Kbd variant='ghost'>S</Kbd>
            </Kbd.Group>
          </div>
        </Specimen>

        <Specimen index={11} name='Avatar · Indicator' slug='avatar'>
          <div className={`${styles.stack} ${styles.stackLoose}`}>
            <div className={styles.row}>
              <AvatarGroup max={4}>
              <Avatar size={5} fallback='HL' color='indigo' radius='full' />
              <Avatar size={5} fallback='ME' color='orange' radius='full' />
              <Avatar size={5} fallback='NF' color='mint' radius='full' />
              <Avatar size={5} fallback='OS' color='sky' radius='full' />
              <Avatar size={5} fallback='PC' color='purple' radius='full' />
              <Avatar size={5} fallback='QR' color='gold' radius='full' />
            </AvatarGroup>
          </div>
          <div className={styles.row}>
            <Avatar size={5} fallback='RS' variant='solid' color='indigo' />
            <Avatar size={5} fallback='RS' variant='soft' color='crimson' />
            <Indicator variant='danger' label='3'>
              <IconButton size={4} aria-label='Inbox'>
                <Bell size={16} strokeWidth={1.5} />
              </IconButton>
            </Indicator>
            <Indicator variant='success'>
              <Avatar size={5} fallback='ON' color='grass' radius='full' />
            </Indicator>
          </div>
        </Specimen>

        <Specimen index={12} name='Callout' slug='callout' align='stretch'>
          <Callout type='accent'>
            Tokens follow the theme. Swap the accent below and watch this one.
          </Callout>
          <Callout type='success' variant='outline'>
            Every control passes keyboard and screen-reader checks.
          </Callout>
          <Callout type='attention' dismissible>
            This one can be dismissed.
          </Callout>
        </Specimen>

        <Specimen index={13} name='Toast' slug='toast'>
          <ToastSpecimen />
        </Specimen>

        <Specimen index={14} name='Skeleton' slug='skeleton' align='stretch'>
          <div className={styles.row}>
            <Skeleton width='40px' height='40px' borderRadius='999px' />
            <div className={styles.stack}>
              <Skeleton height='14px' width='60%' />
              <Skeleton height='12px' width='40%' />
            </div>
          </div>
          <Skeleton count={3} height='12px' />
        </Specimen>

        <Specimen index={15} name='Text' slug='text' align='stretch'>
          <Text size='large' weight='medium' render={<p />}>
            Large, medium weight
          </Text>
          <Text size='regular' render={<p />}>
            Regular, the reading size for product surfaces.
          </Text>
          <Text size='small' variant='secondary' render={<p />}>
            Small, secondary. Tracking follows Inter's dynamic metric.
          </Text>
          <Text
            size='mini'
            variant='tertiary'
            transform='uppercase'
            render={<p />}
          >
            Mini, tertiary, uppercase
          </Text>
          <div className={styles.row} data-align='start'>
            <Text size='small' variant='accent'>
              accent
            </Text>
            <Text size='small' variant='success'>
              success
            </Text>
            <Text size='small' variant='attention'>
              attention
            </Text>
            <Text size='small' variant='danger'>
              danger
            </Text>
          </div>
        </Specimen>
      </div>
    </Toast.Provider>
  );
}
