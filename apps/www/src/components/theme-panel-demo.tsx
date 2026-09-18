'use client';

import {
  Avatar,
  Badge,
  Button,
  Callout,
  Checkbox,
  Chip,
  Flex,
  Input,
  Popover,
  Progress,
  Select,
  Separator,
  Switch,
  Text,
  THEME_SETTING_VALUES,
  ThemePreview,
  type ThemeSettings,
  Tooltip,
  useThemePreview
} from '@raystack/apsara';
import { useState } from 'react';

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
      {field('Appearance', 'appearance', THEME_SETTING_VALUES.appearance)}
      {field('Accent', 'accentColor', THEME_SETTING_VALUES.accentColor)}
      {field('Gray', 'grayColor', THEME_SETTING_VALUES.grayColor)}
      {field('Radius', 'radius', THEME_SETTING_VALUES.radius)}
      {field('Scaling', 'scaling', THEME_SETTING_VALUES.scaling)}
      {field('Panel', 'panelBackground', THEME_SETTING_VALUES.panelBackground)}
      {field(
        'Reduced motion',
        'reducedMotion',
        THEME_SETTING_VALUES.reducedMotion
      )}

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

      {/* The page behind these popups is the colour the translucent panel mixes
          from, so without something else under them `Panel` has no visible effect. */}
      <Flex
        direction='column'
        align='start'
        style={{
          minHeight: 168,
          padding: 'var(--rs-space-4)',
          borderRadius: 'var(--rs-radius-3)',
          background:
            'repeating-linear-gradient(45deg, var(--rs-color-background-accent-emphasis) 0 120px, var(--rs-color-background-attention-emphasis) 120px 240px)'
        }}
      >
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
    </Flex>
  );
}

/** `isRoot={false}`: one example on the page, not the page itself. */
export default function ThemePanelDemo() {
  return (
    <ThemePreview
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
    </ThemePreview>
  );
}
