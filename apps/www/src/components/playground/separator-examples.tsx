'use client';

import { Flex, Separator } from '@raystack/apsara';
import PlaygroundLayout from './playground-layout';

export function SeparatorExamples() {
  return (
    <PlaygroundLayout title='Separator'>
      <Flex wrap='wrap' gap='large'>
        <Flex
          direction='column'
          gap='large'
          align='center'
          style={{ width: '400px' }}
        >
          <Separator color='primary' />
          <Separator color='secondary' />
          <Separator color='tertiary' />
        </Flex>
        <Flex
          direction='column'
          gap='large'
          align='center'
          style={{ width: '400px' }}
        >
          <Separator size='small' />
          <Separator size='half' />
          <Separator size='full' />
        </Flex>
      </Flex>
    </PlaygroundLayout>
  );
}
