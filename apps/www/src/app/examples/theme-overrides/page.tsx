'use client';

import {
  Button,
  Callout,
  Flex,
  IconButton,
  Text,
  Theme,
  useTheme as useScopeTheme
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

const PERSISTENT_BASIC_KEY = 'theme-overrides-persistent-basic';
const PERSISTENT_DEFAULT_KEY = 'theme-overrides-persistent-default';
const PERSISTENT_FORCED_KEY = 'theme-overrides-persistent-forced';

const panelStyle = {
  padding: 'var(--rs-space-7)',
  borderRadius: 'var(--rs-space-3)',
  border: '1px solid var(--rs-color-border-base-primary)',
  backgroundColor: 'var(--rs-color-background-base-primary)'
};

const testStripStyle = {
  marginTop: 'var(--rs-space-3)',
  paddingTop: 'var(--rs-space-3)',
  borderTop: '1px dashed var(--rs-color-border-base-primary)'
};

const cycle = <T,>(values: T[], current: T): T =>
  values[(values.indexOf(current) + 1) % values.length];

const TestNote = ({
  steps,
  expect
}: {
  steps: React.ReactNode;
  expect: React.ReactNode;
}) => (
  <Flex direction='column' gap={1} style={testStripStyle}>
    <Text size={2} variant='secondary'>
      <strong>Try:</strong> {steps}
    </Text>
    <Text size={2} variant='secondary'>
      <strong>Expect:</strong> {expect}
    </Text>
  </Flex>
);

// ─── Persistent scope controls ────────────────────────────────────────────
// These read the scope's state via `useTheme()` (which returns layered state
// inside a persistent scope) and call `setTheme` to update the scope's
// localStorage entry.

function PersistentControls({ defaultLabel }: { defaultLabel: string }) {
  const { theme, setTheme } = useScopeTheme();
  const current = theme ?? defaultLabel;
  return (
    <Flex gap={3} align='center'>
      <Text size={3} variant='secondary'>
        <code>theme=&quot;{current}&quot;</code>
      </Text>
      <IconButton
        aria-label='Toggle scope theme'
        size={3}
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      >
        {theme === 'dark' ? <Sun /> : <Moon />}
      </IconButton>
      <Button
        variant='outline'
        color='neutral'
        onClick={() => setTheme(undefined)}
      >
        Clear
      </Button>
    </Flex>
  );
}

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

  const [forcedOver, setForcedOver] = useState<Scheme | undefined>('dark');

  return (
    <Flex
      direction='column'
      gap={11}
      style={{
        minHeight: '100vh',
        padding: 'var(--rs-space-11)',
        backgroundColor: 'var(--rs-color-background-base-primary)'
      }}
    >
      {/* ─── Header ──────────────────────────────────────────────────── */}
      <Flex justify='between' align='center'>
        <Flex direction='column' gap={2}>
          <Text size={6} weight={500}>
            Theme Overrides
          </Text>
          <Text size={3} variant='secondary'>
            Demonstrates every nesting mode of `&lt;Theme&gt;`: stateless
            overrides, persistent scope, and bare `data-theme`. Each panel has
            test steps and expected behavior. The global toggle (top-right)
            changes the page-level theme; scopes either override it for display
            or own their own state.
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

      {/* ─── Section: Stateless overrides ────────────────────────────── */}
      <Flex direction='column' gap={5}>
        <Flex direction='column' gap={2}>
          <Text size={5} weight={500}>
            1. Stateless overrides
          </Text>
          <Text size={3} variant='secondary'>
            Nested `&lt;Theme&gt;` without a `storageKey` is a pure CSS wrapper.
            The override props (`forcedTheme`, `accentColor`, `grayColor`,
            `style`) set `data-*` attributes on a `&lt;div&gt;`; no
            localStorage, no state. `useTheme()` inside layers these overrides
            over the parent context.
          </Text>
        </Flex>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: 'var(--rs-space-7)'
          }}
        >
          {/* Accent override */}
          <Theme forcedTheme={accentScheme} accentColor={accent}>
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
                      setAccentScheme(
                        accentScheme === 'dark' ? 'light' : 'dark'
                      )
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
              <TestNote
                steps={
                  <>
                    Cycle the accent button. Toggle the scope&apos;s sun/moon.
                    Change the page theme via the header.
                  </>
                }
                expect={
                  <>
                    The accent colors change locally; toggling the scope&apos;s
                    theme flips this panel only; the page-level theme
                    doesn&apos;t affect this scope. Refresh: nothing persists —
                    panel resets to its declared defaults.
                  </>
                }
              />
            </Flex>
          </Theme>

          {/* Gray override */}
          <Theme forcedTheme={grayScheme} grayColor={gray}>
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
                <code>grayColor=&quot;{gray}&quot;</code>. Neutral surfaces,
                text, and borders shift hue.
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
              <TestNote
                steps={
                  <>
                    Cycle <code>gray → mauve → slate</code>. Toggle the
                    scope&apos;s theme.
                  </>
                }
                expect={
                  <>
                    Borders and neutral surfaces shift hue per the selected
                    gray. Accent stays unchanged (still inherits from page).
                  </>
                }
              />
            </Flex>
          </Theme>

          {/* Style override */}
          <Theme forcedTheme={styleScheme} style={variant}>
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
                      setVariant(
                        variant === 'modern' ? 'traditional' : 'modern'
                      )
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
              <TestNote
                steps={<>Toggle modern ↔ traditional.</>}
                expect={
                  <>
                    Button radii and font sizes change inside this panel only;
                    colors stay the same.
                  </>
                }
              />
            </Flex>
          </Theme>

          {/* Full override */}
          <Theme
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
              <TestNote
                steps={
                  <>
                    Toggle the page theme via the header; toggle this
                    scope&apos;s sun/moon.
                  </>
                }
                expect={
                  <>
                    The page theme has no effect here. The scope&apos;s theme
                    flips only this panel. Accent, gray, and style stay locked
                    to the values declared in the prop.
                  </>
                }
              />
            </Flex>
          </Theme>
        </div>
      </Flex>

      {/* ─── Section: Persistent scope ───────────────────────────────── */}
      <Flex direction='column' gap={5}>
        <Flex direction='column' gap={2}>
          <Text size={5} weight={500}>
            2. Persistent scope
          </Text>
          <Text size={3} variant='secondary'>
            With `storageKey`, the nested `&lt;Theme&gt;` becomes stateful:
            reads from localStorage on mount, writes on change, syncs across
            tabs. Inside, `useTheme()` returns the scope&apos;s `theme` and
            `setTheme` — call `setTheme(undefined)` to clear and re-inherit.
          </Text>
        </Flex>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: 'var(--rs-space-7)'
          }}
        >
          {/* Basic persistent — storageKey only */}
          <Theme storageKey={PERSISTENT_BASIC_KEY}>
            <Flex direction='column' gap={5} style={panelStyle}>
              <Flex justify='between' align='center' gap={5}>
                <Text size={4} weight={500}>
                  Basic persistent
                </Text>
                <PersistentControls defaultLabel='(inheriting)' />
              </Flex>
              <Text size={3} variant='secondary'>
                <code>storageKey=&quot;{PERSISTENT_BASIC_KEY}&quot;</code> only.
                No `defaultTheme` — scope inherits from the page until you
                toggle it.
              </Text>
              <Flex gap={3}>
                <Button variant='solid' color='accent'>
                  Solid
                </Button>
                <Button variant='outline' color='neutral'>
                  Outline
                </Button>
              </Flex>
              <TestNote
                steps={
                  <>
                    1. Toggle the page theme — this panel follows it. 2. Click
                    the panel&apos;s sun/moon — it pins to that theme. 3.
                    Refresh — the pinned value persists. 4. Click Clear — the
                    panel re-follows the page; refresh confirms it&apos;s
                    cleared.
                  </>
                }
                expect={
                  <>
                    Without a pin: panel inherits page theme. Once pinned: panel
                    ignores page changes and survives reload. Clearing removes
                    the localStorage entry and re-inherits.
                  </>
                }
              />
            </Flex>
          </Theme>

          {/* Persistent with defaultTheme */}
          <Theme storageKey={PERSISTENT_DEFAULT_KEY} defaultTheme='dark'>
            <Flex direction='column' gap={5} style={panelStyle}>
              <Flex justify='between' align='center' gap={5}>
                <Text size={4} weight={500}>
                  Persistent with default
                </Text>
                <PersistentControls defaultLabel='dark' />
              </Flex>
              <Text size={3} variant='secondary'>
                <code>defaultTheme=&quot;dark&quot;</code>. Used only when the
                storage key is empty; once the user toggles, their choice wins.
              </Text>
              <Flex gap={3}>
                <Button variant='solid' color='accent'>
                  Solid
                </Button>
                <Button variant='outline' color='neutral'>
                  Outline
                </Button>
              </Flex>
              <TestNote
                steps={
                  <>
                    1. First visit: panel is dark even if the page is light. 2.
                    Toggle to light, refresh — light persists. 3. Click Clear,
                    refresh — back to dark default.
                  </>
                }
                expect={
                  <>
                    Priority order:{' '}
                    <code>localStorage &gt; defaultTheme &gt; inherit</code>.
                    Default seeds the initial render; persisted value supersedes
                    it.
                  </>
                }
              />
            </Flex>
          </Theme>

          {/* Persistent with forcedTheme */}
          <Theme
            storageKey={PERSISTENT_FORCED_KEY}
            defaultTheme='light'
            forcedTheme={forcedOver}
          >
            <Flex direction='column' gap={5} style={panelStyle}>
              <Flex justify='between' align='center' gap={5}>
                <Text size={4} weight={500}>
                  Forced over persistence
                </Text>
                <Flex gap={3} align='center'>
                  <PersistentControls defaultLabel='light' />
                  <Button
                    variant='outline'
                    color='neutral'
                    onClick={() =>
                      setForcedOver(forcedOver === 'dark' ? undefined : 'dark')
                    }
                  >
                    {forcedOver
                      ? `forcedTheme=${forcedOver}`
                      : 'no forcedTheme'}
                  </Button>
                </Flex>
              </Flex>
              <Text size={3} variant='secondary'>
                Developer-locked display: <code>forcedTheme</code> wins over the
                user&apos;s persisted choice. The user&apos;s choice is still
                stored — it just doesn&apos;t take effect until `forcedTheme` is
                cleared.
              </Text>
              <Flex gap={3}>
                <Button variant='solid' color='accent'>
                  Solid
                </Button>
                <Button variant='outline' color='neutral'>
                  Outline
                </Button>
              </Flex>
              <TestNote
                steps={
                  <>
                    1. With <code>forcedTheme=dark</code> active, toggle the
                    user theme — nothing visually changes, but the value is
                    persisted. 2. Click the right-most button to clear
                    `forcedTheme`. 3. The user&apos;s stored value now takes
                    effect.
                  </>
                }
                expect={
                  <>
                    `forcedTheme` is a developer override — it&apos;s never
                    written to localStorage. Toggling the user theme writes to
                    storage silently; removing `forcedTheme` reveals it.
                  </>
                }
              />
            </Flex>
          </Theme>

          {/* Bare attribute */}
          <div style={panelStyle}>
            <Flex direction='column' gap={5}>
              <Text size={4} weight={500}>
                Bare data-theme attribute
              </Text>
              <Text size={3} variant='secondary'>
                Scoping is implemented in CSS — any element with{' '}
                <code>data-theme=&quot;…&quot;</code> creates a scope. No
                component needed for read-only display overrides.
              </Text>
              <div data-theme='dark' style={panelStyle}>
                <Flex direction='column' gap={3}>
                  <Text size={3}>
                    Bare <code>&lt;div data-theme=&quot;dark&quot;&gt;</code>
                  </Text>
                  <Flex gap={3}>
                    <Button variant='solid' color='accent'>
                      Solid
                    </Button>
                    <Button variant='outline' color='neutral'>
                      Outline
                    </Button>
                  </Flex>
                </Flex>
              </div>
              <TestNote
                steps={
                  <>
                    Toggle the page theme — the bare div stays dark regardless.
                  </>
                }
                expect={
                  <>
                    The bare div is dark forever (until you change the attribute
                    manually). No JS, no state, just CSS. Use this pattern when
                    you don&apos;t need a typed wrapper or any interactivity.
                  </>
                }
              />
            </Flex>
          </div>
        </div>
      </Flex>

      {/* ─── Section: Cross-tab sync hint ────────────────────────────── */}
      <Flex direction='column' gap={2} style={panelStyle}>
        <Text size={4} weight={500}>
          Cross-tab sync (manual test)
        </Text>
        <Text size={3} variant='secondary'>
          Open this page in two tabs. Toggle one of the persistent scope panels
          above in tab A. The same panel in tab B updates without a reload —
          driven by the browser&apos;s `storage` event.
        </Text>
      </Flex>
    </Flex>
  );
};

export default Page;
