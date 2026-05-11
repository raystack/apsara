'use client';

import { Flex, Text } from '@raystack/apsara';
import PlaygroundLayout from './playground-layout';

export function TextExamples() {
  return (
    <PlaygroundLayout title='Text'>
      <Flex gap='extra-large' wrap='wrap'>
        <Flex gap='medium' align='center' direction='column'>
          <Text variant='primary'>primary</Text>
          <Text variant='secondary'>secondary</Text>
          <Text variant='tertiary'>tertiary</Text>
          <div
            style={{
              backgroundColor: 'var(--rs-color-background-neutral-tertiary)',
              padding: 'var(--rs-space-3)'
            }}
          >
            <Text variant='emphasis'>emphasis</Text>
          </div>
          <Text variant='accent'>accent</Text>
          <Text variant='attention'>attention</Text>
          <Text variant='danger'>danger</Text>
          <Text variant='success'>success</Text>
        </Flex>
        <Flex gap='medium' align='center' direction='column'>
          <Text size='micro'>This is a text</Text>
          <Text size='mini'>This is a text</Text>
          <Text size='small'>This is a text</Text>
          <Text size='regular'>This is a text</Text>
          <Text size='large'>This is a text</Text>
        </Flex>
        <Flex gap='medium' align='center' direction='column'>
          <Text weight='regular'>This is a text</Text>
          <Text weight='medium'>This is a text</Text>
        </Flex>
      </Flex>
    </PlaygroundLayout>
  );
}
