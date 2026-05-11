'use client';

import { Flex, Search } from '@raystack/apsara';
import PlaygroundLayout from './playground-layout';

export function SearchExamples() {
  return (
    <PlaygroundLayout title='Search'>
      <Flex gap={9} wrap='wrap'>
        <Flex direction='column' gap={5} align='center' style={{ width: 300 }}>
          <Search placeholder='Large size search...' />
          <Search size='small' placeholder='Small size search...' />
        </Flex>
        <Flex direction='column' gap={5} align='center' style={{ width: 300 }}>
          <Search
            placeholder='Type to search...'
            value='Searchable text'
            showClearButton
          />
          <Search placeholder='Basic search...' />
        </Flex>
      </Flex>
    </PlaygroundLayout>
  );
}
