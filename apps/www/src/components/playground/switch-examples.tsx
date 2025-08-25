'use client';

import { Flex, Switch, Text } from '@raystack/apsara';
import PlaygroundLayout from './playground-layout';

export function SwitchExamples() {
  return (
    <PlaygroundLayout title='Switch'>
      <Flex gap='large' align='center' wrap='wrap'>
        <Switch />
        <Switch defaultChecked />
        <Switch disabled />
        <Switch disabled defaultChecked />
        <Switch required />
      </Flex>

      <Flex gap='large' align='center' wrap='wrap'>
        <Text>Large (default):</Text>
        <Switch size='large' />
        <Switch size='large' defaultChecked />
      </Flex>

      <Flex gap='large' align='center' wrap='wrap'>
        <Text>Small:</Text>
        <Switch size='small' />
        <Switch size='small' defaultChecked />
        <Switch size='small' disabled />
        <Switch size='small' disabled defaultChecked />
      </Flex>
    </PlaygroundLayout>
  );
}
