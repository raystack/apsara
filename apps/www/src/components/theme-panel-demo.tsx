'use client';

import {
  ACCENT_COLORS,
  Avatar,
  Badge,
  Button,
  Callout,
  Checkbox,
  Chip,
  Flex,
  GRAY_COLOR_VALUES,
  Input,
  PANEL_BACKGROUNDS,
  Popover,
  Progress,
  RADII,
  SCALINGS,
  Select,
  Separator,
  Switch,
  Text,
  ThemePreview,
  type ThemeSettings,
  Tooltip,
  useThemePreview
} from '@raystack/apsara';
import { useState } from 'react';

const APPEARANCES = ['light', 'dark', 'system'] as const;

/** A live control for every setting, next to a sampler of components. */
function Controls() {
  const { value, resolved, setValue } = useThemePreview();

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
      {field('Appearance', 'appearance', APPEARANCES)}
      {field('Accent', 'accentColor', ACCENT_COLORS)}
      {field('Gray', 'grayColor', GRAY_COLOR_VALUES)}
      {field('Radius', 'radius', RADII)}
      {field('Scaling', 'scaling', SCALINGS)}
      {field('Panel', 'panelBackground', PANEL_BACKGROUNDS)}
      {field('Reduced motion', 'reducedMotion', ['system', 'true', 'false'])}

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

      <Flex gap={3}>
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
      </Flex>
    </Flex>
  );
}

/** `isRoot={false}`: one example on a page, not the page itself. */
export default function ThemePanelDemo() {
  return (
    <ThemePreview
      isRoot={false}
      defaultValue={{ appearance: 'light' }}
      style={{
        padding: 'var(--rs-space-5)',
        border: '1px solid var(--rs-color-border-base-primary)',
        borderRadius: 'var(--rs-radius-4)'
      }}
    >
      <Flex gap={7} wrap='wrap' align='start'>
        <Controls />
        <Separator orientation='vertical' />
        <Sampler />
      </Flex>
    </ThemePreview>
  );
}
