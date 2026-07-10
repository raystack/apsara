'use client';

import { BarChartIcon, BellIcon, RocketIcon } from '@radix-ui/react-icons';
import {
  Button,
  Flex,
  IconButton,
  Search,
  Text,
  Tour,
  type TourActions,
  type TourStep
} from '@raystack/apsara';
import { useRef } from 'react';

const panel: React.CSSProperties = {
  padding: 'var(--rs-space-5)',
  border: '1px solid var(--rs-color-border-base-primary)',
  borderRadius: 'var(--rs-radius-3)',
  backgroundColor: 'var(--rs-color-background-base-primary)'
};

const steps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome aboard',
    content:
      'A quick tour of the workspace. Use Next to move on, or press Escape to leave any time.'
  },
  {
    id: 'search',
    target: '[data-tour="search"]',
    title: 'Search anything',
    content: 'Jump to any resource from here. Try typing while the tour runs.',
    side: 'bottom',
    spotlightClicks: true
  },
  {
    id: 'analytics',
    target: '[data-tour="analytics"]',
    title: 'Track usage',
    content: 'Analytics break down usage across your whole workspace.',
    side: 'bottom'
  },
  {
    id: 'notifications',
    target: '[data-tour="notifications"]',
    title: 'Stay in the loop',
    content: 'Unread alerts land on the bell. That is the whole tour!',
    side: 'left',
    spotlightRadius: 999,
    spotlightPadding: 6
  }
];

export default function TourDemo() {
  const actionsRef = useRef<TourActions>(null);

  return (
    <Flex direction='column' gap={5} style={{ width: '100%', maxWidth: 640 }}>
      <Flex justify='between' align='center' gap={3} style={panel}>
        <div data-tour='search' style={{ flex: 1, maxWidth: 280 }}>
          <Search size='small' placeholder='Search…' />
        </div>
        <Flex gap={2} align='center'>
          <IconButton data-tour='analytics' size={4} aria-label='Analytics'>
            <BarChartIcon />
          </IconButton>
          <IconButton
            data-tour='notifications'
            size={4}
            aria-label='Notifications'
          >
            <BellIcon />
          </IconButton>
        </Flex>
      </Flex>

      <Flex direction='column' gap={3} align='start' style={panel}>
        <Text size='regular' weight='medium'>
          Guided tour
        </Text>
        <Text size='small' variant='secondary'>
          Four steps: a centered welcome, then the search box, analytics, and
          notifications — each anchored and spotlighted.
        </Text>
        <Button onClick={() => actionsRef.current?.start()}>
          <RocketIcon /> Start tour
        </Button>
      </Flex>

      <Tour steps={steps} actionsRef={actionsRef} />
    </Flex>
  );
}
