'use client';

import {
  Avatar,
  Badge,
  Button,
  Callout,
  Checkbox,
  Chip,
  Dialog,
  Drawer,
  Flex,
  Input,
  Menu,
  Popover,
  Progress,
  Select,
  Separator,
  Switch,
  Text,
  Theme,
  type ThemeSettings,
  Tooltip,
  useTheme
} from '@raystack/apsara';
import { useState } from 'react';

/**
 * The legal values per setting, spelled out here rather than imported: the
 * package exports the settings, not a catalogue of their values. `satisfies`
 * keeps this honest — a value the type no longer allows fails the build.
 */
const SETTING_VALUES = {
  appearance: ['light', 'dark', 'system'],
  accentColor: ['indigo', 'orange', 'mint'],
  grayColor: ['gray', 'mauve', 'slate', 'sage', 'auto'],
  radius: ['none', 'small', 'medium', 'large', 'full'],
  scaling: ['0.9', '0.95', '1', '1.05', '1.1'],
  panelBackground: ['solid', 'translucent'],
  reducedMotion: ['true', 'false', 'system']
} as const satisfies {
  [K in keyof ThemeSettings]: readonly ThemeSettings[K][];
};

function Controls() {
  const { value, resolved, setValue } = useTheme();

  const field = <K extends keyof ThemeSettings>(
    label: string,
    key: K,
    options: readonly string[]
  ) => (
    <Flex direction='column' gap={2} key={key}>
      <Text size='mini' variant='secondary'>
        {label}
      </Text>
      <Select
        value={value[key]}
        onValueChange={next => setValue({ [key]: next as ThemeSettings[K] })}
      >
        <Select.Trigger style={{ width: 180 }}>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          {options.map(option => (
            <Select.Item key={option} value={option}>
              {option}
            </Select.Item>
          ))}
        </Select.Content>
      </Select>
    </Flex>
  );

  return (
    <Flex direction='column' gap={4} style={{ minWidth: 200 }}>
      {field('Appearance', 'appearance', SETTING_VALUES.appearance)}
      {field('Accent', 'accentColor', SETTING_VALUES.accentColor)}
      {field('Gray', 'grayColor', SETTING_VALUES.grayColor)}
      {field('Radius', 'radius', SETTING_VALUES.radius)}
      {field('Scaling', 'scaling', SETTING_VALUES.scaling)}
      {field('Panel', 'panelBackground', SETTING_VALUES.panelBackground)}
      {field('Reduced motion', 'reducedMotion', SETTING_VALUES.reducedMotion)}

      <Separator />
      <Text size='mini' variant='secondary'>
        Resolved: {resolved.appearance} · {resolved.grayColor}
      </Text>
    </Flex>
  );
}

function Sampler() {
  const [checked, setChecked] = useState(true);

  return (
    <Flex direction='column' gap={5} style={{ flex: 1, minWidth: 260 }}>
      <Flex gap={3} align='center' wrap='wrap'>
        <Button>Primary</Button>
        <Button variant='outline'>Outline</Button>
        <Button variant='ghost' radius='full'>
          radius=&quot;full&quot;
        </Button>
      </Flex>

      <Flex gap={3} align='center' wrap='wrap'>
        <Avatar fallback='AP' />
        <Badge>Badge</Badge>
        <Chip>Chip</Chip>
        <Switch checked={checked} onCheckedChange={setChecked} />
        <Checkbox defaultChecked />
      </Flex>

      <Input placeholder='Input' />
      <Progress value={62} />

      <Callout>Callouts follow the accent and the radius factor.</Callout>

      <Flex gap={3} wrap='wrap'>
        <Tooltip>
          <Tooltip.Trigger
            render={<Button variant='outline'>Tooltip</Button>}
          />
          <Tooltip.Content>Portalled, and still themed</Tooltip.Content>
        </Tooltip>

        <Popover>
          <Popover.Trigger
            render={<Button variant='outline'>Popover</Button>}
          />
          <Popover.Content>
            <Text>
              Theme values cross the portal through context, so this popup
              matches the scope it was opened from.
            </Text>
          </Popover.Content>
        </Popover>

        <Menu>
          <Menu.Trigger render={<Button variant='outline'>Menu</Button>} />
          <Menu.Content>
            <Menu.Group>
              <Menu.Label>Actions</Menu.Label>
              <Menu.Item>Assign member</Menu.Item>
              <Menu.Item>Rename</Menu.Item>
            </Menu.Group>
            <Menu.Separator />
            <Menu.Item>Delete</Menu.Item>
          </Menu.Content>
        </Menu>

        <Select defaultValue='medium'>
          <Select.Trigger style={{ width: 120 }}>
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value='small'>Small</Select.Item>
            <Select.Item value='medium'>Medium</Select.Item>
            <Select.Item value='large'>Large</Select.Item>
          </Select.Content>
        </Select>

        <Dialog>
          <Dialog.Trigger render={<Button variant='outline'>Dialog</Button>} />
          <Dialog.Content style={{ width: 360 }}>
            <Dialog.Header>
              <Dialog.Title>Dialog</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Dialog.Description>
                The scrim behind is what a translucent panel reads against.
              </Dialog.Description>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog>

        <Drawer>
          <Drawer.Trigger render={<Button variant='outline'>Drawer</Button>} />
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Drawer</Drawer.Title>
              <Drawer.Description>
                Radius, scaling and panel background all reach it.
              </Drawer.Description>
            </Drawer.Header>
            <Drawer.Body>
              <Text>
                Portalled parts re-emit the theme, so the drawer matches the
                scope its trigger lives in.
              </Text>
            </Drawer.Body>
          </Drawer.Content>
        </Drawer>
      </Flex>
    </Flex>
  );
}

/** `isRoot={false}`: one example on the page, not the page itself. */
export default function ThemePanelDemo() {
  return (
    <Theme
      isRoot={false}
      defaultValue={{ appearance: 'light' }}
      hasBackground
      style={{
        padding: 'var(--rs-space-5)',
        border: '1px solid var(--rs-color-border-base-primary)',
        borderRadius: 'var(--rs-radius-4)'
      }}
    >
      <Flex gap={7} wrap='wrap' align='stretch'>
        <Controls />
        {/* The separator's own `height: 100%` resolves to 0 against a
            content-sized row, so let the stretch decide its height. */}
        <Separator
          orientation='vertical'
          style={{ height: 'auto', alignSelf: 'stretch' }}
        />
        <Sampler />
      </Flex>
    </Theme>
  );
}
