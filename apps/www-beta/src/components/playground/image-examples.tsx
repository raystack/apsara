'use client';

import { Flex, Image } from '@raystack/apsara';
import PlaygroundLayout from './playground-layout';

export function ImageExamples() {
  return (
    <PlaygroundLayout title='Image'>
      <Flex gap='large'>
        <Image
          src='https://images.unsplash.com/photo-1447690709975-318628b14c57'
          alt='Nature'
          width={100}
          height={100}
          radius='none'
        />
        <Image
          src='https://images.unsplash.com/photo-1447690709975-318628b14c57'
          alt='Nature'
          width={100}
          height={100}
          radius='small'
        />
        <Image
          src='https://images.unsplash.com/photo-1447690709975-318628b14c57'
          alt='Nature'
          width={100}
          height={100}
          radius='medium'
        />
        <Image
          src='https://images.unsplash.com/photo-1447690709975-318628b14c57'
          alt='Nature'
          width={100}
          height={100}
          radius='full'
        />
      </Flex>
    </PlaygroundLayout>
  );
}
