'use client';

import {
  Button,
  Callout,
  Flex,
  IconButton,
  Text,
  ThemeProvider
} from '@raystack/apsara';
import { Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '@/components/theme';

type Accent = 'indigo' | 'orange' | 'mint';
type Gray = 'gray' | 'mauve' | 'slate';
type Style = 'modern' | 'traditional';
type Scheme = 'light' | 'dark';

const ACCENTS: Accent[] = ['indigo', 'orange', 'mint'];
const GRAYS: Gray[] = ['gray', 'mauve', 'slate'];

const panelStyle = {
  padding: 'var(--rs-space-7)',
  borderRadius: 'var(--rs-space-3)',
  border: '1px solid var(--rs-color-border-base-primary)',
  backgroundColor: 'var(--rs-color-background-base-primary)'
};

const cycle = <T,>(values: T[], current: T): T =>
  values[(values.indexOf(current) + 1) % values.length];

const Page = () => {
  const { theme, setTheme } = useTheme();
  const GlobalIcon = theme === 'dark' ? Sun : Moon;

  const [accentScheme, setAccentScheme] = useState<Scheme>('light');
  const [accent, setAccent] = useState<Accent>('orange');

  const [grayScheme, setGrayScheme] = useState<Scheme>('light');
  const [gray, setGray] = useState<Gray>('mauve');

  const [styleScheme, setStyleScheme] = useState<Scheme>('light');
  const [variant, setVariant] = useState<Style>('traditional');

  const [fullScheme, setFullScheme] = useState<Scheme>('dark');

  return (
    <Flex
      direction='column'
      gap={9}
      style={{
        minHeight: '100vh',
        padding: 'var(--rs-space-11)',
        backgroundColor: 'var(--rs-color-background-base-primary)'
      }}
    >
      <Flex justify='between' align='center'>
        <Flex direction='column' gap={2}>
          <Text size={6} weight={500}>
            Theme Overrides
          </Text>
          <Text size={3} variant='secondary'>
            Each panel nests a `ThemeProvider` that overrides one or more tokens
            for its subtree. Use the switches inside each panel to change the
            scope&apos;s theme and tokens — the page-level theme is untouched.
          </Text>
        </Flex>
        <IconButton
          aria-label='Toggle page theme'
          size={3}
          onClick={() =>
            setTheme({ theme: theme === 'dark' ? 'light' : 'dark' })
          }
        >
          <GlobalIcon />
        </IconButton>
      </Flex>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: 'var(--rs-space-7)'
        }}
      >
        <ThemeProvider forcedTheme={accentScheme} accentColor={accent}>
          <Flex direction='column' gap={5} style={panelStyle}>
            <Flex justify='between' align='center' gap={5}>
              <Text size={4} weight={500}>
                Accent override
              </Text>
              <Flex gap={3} align='center'>
                <Button
                  variant='outline'
                  color='neutral'
                  onClick={() => setAccent(cycle(ACCENTS, accent))}
                >
                  {accent}
                </Button>
                <IconButton
                  aria-label='Toggle accent scope theme'
                  size={3}
                  onClick={() =>
                    setAccentScheme(accentScheme === 'dark' ? 'light' : 'dark')
                  }
                >
                  {accentScheme === 'dark' ? <Sun /> : <Moon />}
                </IconButton>
              </Flex>
            </Flex>
            <Text size={3} variant='secondary'>
              <code>accentColor=&quot;{accent}&quot;</code>. Only the accent
              token changes here.
            </Text>
            <Flex gap={3}>
              <Button variant='solid' color='accent'>
                Solid
              </Button>
              <Button variant='outline' color='accent'>
                Outline
              </Button>
            </Flex>
            <Callout type='accent'>
              Accent uses the scope&apos;s {accent}
            </Callout>
          </Flex>
        </ThemeProvider>

        <ThemeProvider forcedTheme={grayScheme} grayColor={gray}>
          <Flex direction='column' gap={5} style={panelStyle}>
            <Flex justify='between' align='center' gap={5}>
              <Text size={4} weight={500}>
                Gray override
              </Text>
              <Flex gap={3} align='center'>
                <Button
                  variant='outline'
                  color='neutral'
                  onClick={() => setGray(cycle(GRAYS, gray))}
                >
                  {gray}
                </Button>
                <IconButton
                  aria-label='Toggle gray scope theme'
                  size={3}
                  onClick={() =>
                    setGrayScheme(grayScheme === 'dark' ? 'light' : 'dark')
                  }
                >
                  {grayScheme === 'dark' ? <Sun /> : <Moon />}
                </IconButton>
              </Flex>
            </Flex>
            <Text size={3} variant='secondary'>
              <code>grayColor=&quot;{gray}&quot;</code>. Neutral surfaces, text,
              and borders shift hue.
            </Text>
            <Flex gap={3}>
              <Button variant='solid' color='neutral'>
                Neutral
              </Button>
              <Button variant='outline' color='neutral'>
                Outline
              </Button>
            </Flex>
            <Callout type='grey'>
              Neutral callout picks up the {gray} grays
            </Callout>
          </Flex>
        </ThemeProvider>

        <ThemeProvider forcedTheme={styleScheme} style={variant}>
          <Flex direction='column' gap={5} style={panelStyle}>
            <Flex justify='between' align='center' gap={5}>
              <Text size={4} weight={500}>
                Style override
              </Text>
              <Flex gap={3} align='center'>
                <Button
                  variant='outline'
                  color='neutral'
                  onClick={() =>
                    setVariant(variant === 'modern' ? 'traditional' : 'modern')
                  }
                >
                  {variant}
                </Button>
                <IconButton
                  aria-label='Toggle style scope theme'
                  size={3}
                  onClick={() =>
                    setStyleScheme(styleScheme === 'dark' ? 'light' : 'dark')
                  }
                >
                  {styleScheme === 'dark' ? <Sun /> : <Moon />}
                </IconButton>
              </Flex>
            </Flex>
            <Text size={3} variant='secondary'>
              <code>style=&quot;{variant}&quot;</code>. Radius and font tokens
              flip; same colors as the page.
            </Text>
            <Flex gap={3}>
              <Button variant='solid' color='accent'>
                Solid
              </Button>
              <Button variant='outline' color='neutral'>
                Outline
              </Button>
            </Flex>
            <Callout type='attention'>
              Edges are softer; type metrics shift
            </Callout>
          </Flex>
        </ThemeProvider>

        <ThemeProvider
          forcedTheme={fullScheme}
          accentColor='mint'
          grayColor='slate'
          style='modern'
        >
          <Flex direction='column' gap={5} style={panelStyle}>
            <Flex justify='between' align='center' gap={5}>
              <Text size={4} weight={500}>
                Full override
              </Text>
              <IconButton
                aria-label='Toggle full scope theme'
                size={3}
                onClick={() =>
                  setFullScheme(fullScheme === 'dark' ? 'light' : 'dark')
                }
              >
                {fullScheme === 'dark' ? <Sun /> : <Moon />}
              </IconButton>
            </Flex>
            <Text size={3} variant='secondary'>
              Theme, accent, gray, and style all set explicitly. The scope is
              independent of the page&apos;s appearance.
            </Text>
            <Flex gap={3}>
              <Button variant='solid' color='accent'>
                Solid
              </Button>
              <Button variant='outline' color='neutral'>
                Outline
              </Button>
            </Flex>
            <Callout type='success'>
              All four data-* attributes set on this subtree
            </Callout>
          </Flex>
        </ThemeProvider>
      </div>
    </Flex>
  );
};

export default Page;
