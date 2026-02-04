'use client';

import { Flex, Tabs } from '@raystack/apsara';
import { Info } from 'lucide-react';
import PlaygroundLayout from './playground-layout';

export function TabsExamples() {
  return (
    <PlaygroundLayout title='Tabs'>
      <Flex gap='extra-large' wrap='wrap'>
        <Flex gap='large' direction='column'>
          <Tabs defaultValue='tab1'>
            <Tabs.List>
              <Tabs.Tab value='tab1'>Account</Tabs.Tab>
              <Tabs.Tab value='tab2' disabled>
                Password
              </Tabs.Tab>
              <Tabs.Tab value='tab3'>Settings</Tabs.Tab>
            </Tabs.List>
            <Tabs.Content value='tab1'>Account settings</Tabs.Content>
            <Tabs.Content value='tab2'>Password settings</Tabs.Content>
            <Tabs.Content value='tab3'>Other settings</Tabs.Content>
          </Tabs>
        </Flex>
        <Flex gap='large' direction='column'>
          <Tabs defaultValue='tab1'>
            <Tabs.List>
              <Tabs.Tab value='tab1'>Home</Tabs.Tab>
              <Tabs.Tab value='tab2' leadingIcon={<Info />} />
            </Tabs.List>
            <Tabs.Content value='tab1'>Home</Tabs.Content>
            <Tabs.Content value='tab2'>Info</Tabs.Content>
          </Tabs>
        </Flex>
      </Flex>
    </PlaygroundLayout>
  );
}
