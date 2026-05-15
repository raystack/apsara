'use client';

import { Flex, Skeleton } from '@raystack/apsara';
import PlaygroundLayout from './playground-layout';

export function SkeletonExamples() {
  return (
    <PlaygroundLayout title='Skeleton'>
      <Flex direction='column' gap={9}>
        {/* Basic Usage */}
        <Skeleton width={200} height={20} />

        {/* Multiple Lines */}
        <Skeleton width={200} height={20} count={3} />

        {/* Custom Colors */}
        <Skeleton
          width={200}
          height={20}
          baseColor='var(--rs-color-background-accent-primary)'
          highlightColor='var(--rs-color-background-accent-emphasis)'
        />

        {/* Animation Control */}
        <Flex direction='column' gap={5}>
          <Skeleton width={200} height={20} duration={2.5} />
          <Skeleton width={200} height={20} enableAnimation={false} />
        </Flex>

        {/* Card Layout Example */}
        <Flex direction='column' gap={5} style={{ width: '300px' }}>
          <Skeleton height={200} /> {/* Image placeholder */}
          <Skeleton height={20} width='80%' /> {/* Title placeholder */}
          <Skeleton height={15} count={3} /> {/* Text lines placeholder */}
        </Flex>
      </Flex>
    </PlaygroundLayout>
  );
}
