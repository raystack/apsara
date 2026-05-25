'use client';

import { Button, ColorPicker, Flex, Popover, Text } from '@raystack/apsara';
import { useState } from 'react';

const cardStyle = {
  width: 280,
  padding: 16,
  borderRadius: 8,
  background: 'var(--rs-color-background-base-primary)',
  border: '1px solid var(--rs-color-border-base-primary)'
} as const;

export default function ColorPickerExamplesPage() {
  const [controlledValue, setControlledValue] = useState(
    'oklch(0.5438 0.191 267.01)'
  );
  const [controlledMode, setControlledMode] = useState<
    'hex' | 'rgb' | 'hsl' | 'oklch'
  >('oklch');
  const [popoverColor, setPopoverColor] = useState('#DA2929');

  return (
    <Flex
      direction='column'
      gap={9}
      style={{
        padding: 32,
        background: 'var(--rs-color-background-neutral-secondary)',
        minHeight: '100vh'
      }}
    >
      <Flex direction='column' gap={2}>
        <Text size='large' weight='medium'>
          ColorPicker
        </Text>
        <Text size='small' variant='secondary'>
          The picker edits internally in OKLCH for perceptual uniformity. The
          area pad shows a chroma × lightness cross-section at the selected hue;
          the <code>mode</code> prop selects the output format (hex / rgb / hsl
          / oklch).
        </Text>
      </Flex>

      <Flex gap={6} wrap='wrap'>
        <Flex direction='column' gap={3} style={cardStyle}>
          <Text size='small' weight='medium'>
            Default (hex)
          </Text>
          <ColorPicker defaultValue='#DA2929'>
            <ColorPicker.Area />
            <ColorPicker.Hue />
            <ColorPicker.Alpha />
            <Flex direction='row' gap={2}>
              <ColorPicker.Mode />
              <ColorPicker.Input />
            </Flex>
          </ColorPicker>
        </Flex>

        <Flex direction='column' gap={3} style={cardStyle}>
          <Text size='small' weight='medium'>
            OKLCH mode
          </Text>
          <Text size='micro' variant='secondary'>
            <code>defaultValue=&apos;oklch(0.5438 0.191 267.01)&apos;</code>{' '}
            with <code>defaultMode=&apos;oklch&apos;</code>.
          </Text>
          <ColorPicker
            defaultValue='oklch(0.5438 0.191 267.01)'
            defaultMode='oklch'
          >
            <ColorPicker.Area />
            <ColorPicker.Hue />
            <ColorPicker.Alpha />
            <Flex direction='row' gap={2}>
              <ColorPicker.Mode />
              <ColorPicker.Input />
            </Flex>
          </ColorPicker>
        </Flex>

        <Flex direction='column' gap={3} style={cardStyle}>
          <Text size='small' weight='medium'>
            Controlled — emits live value
          </Text>
          <ColorPicker
            value={controlledValue}
            mode={controlledMode}
            onValueChange={(value, mode) => {
              setControlledValue(value);
              setControlledMode(mode as typeof controlledMode);
            }}
            onModeChange={mode =>
              setControlledMode(mode as typeof controlledMode)
            }
          >
            <ColorPicker.Area />
            <ColorPicker.Hue />
            <ColorPicker.Alpha />
            <Flex direction='row' gap={2}>
              <ColorPicker.Mode />
              <ColorPicker.Input />
            </Flex>
          </ColorPicker>
          <Flex direction='column' gap={1}>
            <Text size='micro' variant='secondary'>
              value:
            </Text>
            <Text
              size='small'
              style={{
                fontFamily: 'monospace',
                wordBreak: 'break-all'
              }}
            >
              {controlledValue}
            </Text>
            <Text size='micro' variant='secondary' style={{ marginTop: 4 }}>
              mode: <code>{controlledMode}</code>
            </Text>
          </Flex>
        </Flex>

        <Flex direction='column' gap={3} style={cardStyle}>
          <Text size='small' weight='medium'>
            Popover trigger
          </Text>
          <Popover>
            <Popover.Trigger
              render={
                <Button
                  style={{
                    width: 60,
                    height: 60,
                    background: popoverColor
                  }}
                />
              }
            />
            <Popover.Content>
              <ColorPicker
                value={popoverColor}
                onValueChange={setPopoverColor}
                style={{ width: 240, height: 320 }}
              >
                <ColorPicker.Area />
                <ColorPicker.Hue />
                <ColorPicker.Alpha />
                <Flex direction='row' gap={2}>
                  <ColorPicker.Mode />
                  <ColorPicker.Input />
                </Flex>
              </ColorPicker>
            </Popover.Content>
          </Popover>
          <Text
            size='small'
            style={{
              fontFamily: 'monospace',
              wordBreak: 'break-all'
            }}
          >
            {popoverColor}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
}
