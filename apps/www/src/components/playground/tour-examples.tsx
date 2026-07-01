'use client';

import { BellIcon, GearIcon, HomeIcon } from '@radix-ui/react-icons';
import {
  Button,
  Flex,
  IconButton,
  Text,
  Tour,
  type TourActions,
  type TourStep
} from '@raystack/apsara';
import { useRef } from 'react';
import PlaygroundLayout from './playground-layout';

const steps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome',
    content: 'A centered, detached step to open the tour.'
  },
  {
    id: 'home',
    target: '[data-pg-tour="home"]',
    title: 'Home',
    content: 'Anchored to the home button, popover below.',
    side: 'bottom'
  },
  {
    id: 'settings',
    target: '[data-pg-tour="settings"]',
    title: 'Settings',
    content: 'Anchored on the right with a pill spotlight.',
    side: 'bottom',
    spotlightRadius: 999,
    spotlightPadding: 6
  },
  {
    id: 'alerts',
    target: '[data-pg-tour="alerts"]',
    title: 'Alerts',
    content: 'Last step — Finish closes the tour.',
    side: 'left'
  }
];

export function TourExamples() {
  const actionsRef = useRef<TourActions>(null);

  return (
    <PlaygroundLayout title='Tour'>
      <Flex direction='column' gap={7}>
        <Flex gap={3} align='center'>
          <IconButton data-pg-tour='home' size={4} aria-label='Home'>
            <HomeIcon />
          </IconButton>
          <IconButton data-pg-tour='settings' size={4} aria-label='Settings'>
            <GearIcon />
          </IconButton>
          <IconButton data-pg-tour='alerts' size={4} aria-label='Alerts'>
            <BellIcon />
          </IconButton>
        </Flex>

        <Flex direction='column' gap={3} align='start'>
          <Text>Default card, four steps:</Text>
          <Button onClick={() => actionsRef.current?.start()}>
            Start tour
          </Button>
        </Flex>

        <Tour steps={steps} actionsRef={actionsRef} />
      </Flex>
    </PlaygroundLayout>
  );
}
