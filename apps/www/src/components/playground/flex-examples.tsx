'use client';

import { Button, Flex } from '@raystack/apsara';
import PlaygroundLayout from './playground-layout';

export function FlexExamples() {
  return (
    <PlaygroundLayout title='Flex'>
      <Flex gap={9} direction='column'>
        <Flex gap={2} align='center'>
          <Button>Button 1</Button>
          <Button>Button 2</Button>
          <Button>Button 3</Button>
        </Flex>
        <Flex gap={3} align='center'>
          <Button>Button 1</Button>
          <Button>Button 2</Button>
          <Button>Button 3</Button>
        </Flex>
        <Flex gap={5} align='center'>
          <Button>Button 1</Button>
          <Button>Button 2</Button>
          <Button>Button 3</Button>
        </Flex>
        <Flex gap={9} align='center'>
          <Button>Button 1</Button>
          <Button>Button 2</Button>
          <Button>Button 3</Button>
        </Flex>
        <Flex gap={11} align='center'>
          <Button>Button 1</Button>
          <Button>Button 2</Button>
          <Button>Button 3</Button>
        </Flex>
      </Flex>
    </PlaygroundLayout>
  );
}
