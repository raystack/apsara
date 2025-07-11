'use client';

import { Flex, Sidebar } from '@raystack/apsara';
import { Home, Info } from 'lucide-react';
import PlaygroundLayout from './playground-layout';

export function SidebarExamples() {
  return (
    <PlaygroundLayout title='Sidebar'>
      <Flex gap='large' wrap='wrap'>
        <Sidebar open={false}>
          <Sidebar.Header>
            <Sidebar.HeaderIcon>
              <Home />
            </Sidebar.HeaderIcon>
            <Sidebar.Title>Company Name</Sidebar.Title>
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
            <Sidebar.HeaderIcon>
              <Home />
            </Sidebar.HeaderIcon>
            <Sidebar.Title>Apasara</Sidebar.Title>
          </Sidebar.Header>
          <Sidebar.Main>
            <Sidebar.Group name='Main'>
              <Sidebar.Item href='#' leadingIcon={<Info />} active>
                Dashboard
              </Sidebar.Item>
              <Sidebar.Item href='#' leadingIcon={<Info />} disabled>
                Settings
              </Sidebar.Item>
            </Sidebar.Group>
            <Sidebar.Group name='Support'>
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
      </Flex>
    </PlaygroundLayout>
  );
}
