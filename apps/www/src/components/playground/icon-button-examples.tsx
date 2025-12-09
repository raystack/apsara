'use client';

import { Flex, IconButton } from '@raystack/apsara';
import { Info } from 'lucide-react';
import PlaygroundLayout from './playground-layout';

export function IconButtonExamples() {
  return (
    <PlaygroundLayout title='IconButton'>
      <Flex gap='large' align='center' wrap='wrap'>
        <IconButton size={1}>
          <Info size={16} />
        </IconButton>
        <IconButton size={2}>
          <Info size={16} />
        </IconButton>
        <IconButton size={3}>
          <Info size={16} />
        </IconButton>
        <IconButton size={4}>
          <Info size={16} />
        </IconButton>
        <IconButton size={4} disabled>
          <Info size={16} />
        </IconButton>
      </Flex>
    </PlaygroundLayout>
  );
}
