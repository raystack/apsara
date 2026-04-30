'use client';

import {
  Button,
  Callout,
  Flex,
  IconButton,
  Text,
  ThemeScope
} from '@raystack/apsara';
import { Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '@/components/theme';

type ScopeTheme = 'light' | 'dark';

const panelStyle = {
  minWidth: 320,
  padding: 'var(--rs-space-7)',
  borderRadius: 'var(--rs-space-3)',
  border: '1px solid var(--rs-color-border-base-primary)',
  backgroundColor: 'var(--rs-color-background-base-primary)'
};

const Page = () => {
  const { theme, setTheme } = useTheme();
  const [scopeTheme, setScopeTheme] = useState<ScopeTheme>('dark');
  const [calloutScopeTheme, setCalloutScopeTheme] =
    useState<ScopeTheme>('light');
  const GlobalIcon = theme === 'dark' ? Sun : Moon;

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
        <Text size={6} weight={500}>
          Scoped Theming
        </Text>
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

      <ThemeScope
        theme={scopeTheme}
        render={
          <Flex
            direction='column'
            gap={5}
            style={{ ...panelStyle, alignSelf: 'flex-start' }}
          />
        }
      >
        <Flex justify='between' align='center' gap={5}>
          <Text size={4} weight={500}>
            Scoped box
          </Text>
          <IconButton
            aria-label='Toggle scope theme'
            size={3}
            onClick={() =>
              setScopeTheme(scopeTheme === 'dark' ? 'light' : 'dark')
            }
          >
            {scopeTheme === 'dark' ? <Sun /> : <Moon />}
          </IconButton>
        </Flex>
        <Text size={3} variant='secondary'>
          This box themes itself via{' '}
          <code>data-theme=&quot;{scopeTheme}&quot;</code>, independent of the
          page.
        </Text>
        <Flex gap={3}>
          <Button variant='solid' color='accent'>
            Solid
          </Button>
          <Button variant='outline' color='neutral'>
            Outline
          </Button>
        </Flex>
      </ThemeScope>

      <ThemeScope
        theme={calloutScopeTheme}
        render={
          <Flex
            direction='column'
            gap={4}
            style={{ ...panelStyle, alignSelf: 'flex-start' }}
          />
        }
      >
        <Flex justify='between' align='center' gap={5}>
          <Text size={4} weight={500}>
            Semantic colors in scope
          </Text>
          <IconButton
            aria-label='Toggle callout scope theme'
            size={3}
            onClick={() =>
              setCalloutScopeTheme(
                calloutScopeTheme === 'dark' ? 'light' : 'dark'
              )
            }
          >
            {calloutScopeTheme === 'dark' ? <Sun /> : <Moon />}
          </IconButton>
        </Flex>
        <Text size={3} variant='secondary'>
          Accent, success, danger, and attention tokens all re-resolve at the
          scope.
        </Text>
        <Callout type='accent'>Accent — informational message</Callout>
        <Callout type='success'>Success — operation completed</Callout>
        <Callout type='alert'>Danger — something went wrong</Callout>
        <Callout type='attention'>Attention — review before continuing</Callout>
      </ThemeScope>
    </Flex>
  );
};

export default Page;
