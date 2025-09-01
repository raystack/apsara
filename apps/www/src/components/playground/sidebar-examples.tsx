'use client';

import { Flex, IconButton, Sidebar, Text } from '@raystack/apsara';
import { Home, Info } from 'lucide-react';
import PlaygroundLayout from './playground-layout';

export function SidebarExamples() {
  return (
    <PlaygroundLayout title='Sidebar'>
      <Flex gap='large' wrap='wrap'>
        <Sidebar open={false}>
          <Sidebar.Header>
            <Flex align='center' gap={3}>
              <IconButton size={4} aria-label='Home'>
                <Home />
              </IconButton>
              <Text size={4} weight='medium' data-collapse-hidden>
                Apsara
              </Text>
            </Flex>
          </Sidebar.Header>
          <Sidebar.Main>
            <Sidebar.Item href='#' leadingIcon={<Info />} active>
              Dashboard
            </Sidebar.Item>
            <Sidebar.Item href='#' leadingIcon={<Info />} disabled>
              Settings
            </Sidebar.Item>
          </Sidebar.Main>
        </Sidebar>
        <Sidebar open={true}>
          <Sidebar.Header>
            <Flex align='center' gap={3}>
              <IconButton size={4} aria-label='Home'>
                <Home />
              </IconButton>
              <Text size={4} weight='medium' data-collapse-hidden>
                Apsara
              </Text>
            </Flex>
          </Sidebar.Header>
          <Sidebar.Main>
            <Sidebar.Group label='Main' leadingIcon={<Info />}>
              <Sidebar.Item href='#' leadingIcon={<Info />} active>
                Dashboard
              </Sidebar.Item>
              <Sidebar.Item href='#' leadingIcon={<Info />} disabled>
                Settings
              </Sidebar.Item>
            </Sidebar.Group>
            <Sidebar.Group label='Support'>
              <Sidebar.Item href='#' leadingIcon={<Info />}>
                Help
              </Sidebar.Item>
            </Sidebar.Group>
          </Sidebar.Main>
          <Sidebar.Footer>
            <Sidebar.Item href='#' leadingIcon={<Info />}>
              Help
            </Sidebar.Item>
          </Sidebar.Footer>
        </Sidebar>
        <Sidebar>
          <Sidebar.Header>
            <Flex align='center' gap={3}>
              <IconButton size={4} aria-label='Home'>
                <Home width={24} height={24} />
              </IconButton>
              <Text size={4} weight='medium' data-collapse-hidden>
                Apsara
              </Text>
            </Flex>
          </Sidebar.Header>
          <Sidebar.Main>
            <Sidebar.Item href='#' leadingIcon={<Info />} active>
              Dashboard
            </Sidebar.Item>
            <Sidebar.Item href='#' leadingIcon={<Info />}>
              Settings
            </Sidebar.Item>
          </Sidebar.Main>
        </Sidebar>
      </Flex>
    </PlaygroundLayout>
  );
}
