'use client';

import { FilterChip, Flex } from '@raystack/apsara';
import { Info } from 'lucide-react';
import PlaygroundLayout from './playground-layout';

export function FilterChipExamples() {
  return (
    <PlaygroundLayout title='FilterChip'>
      <Flex gap='large' wrap='wrap'>
        <FilterChip
          label='Status'
          leadingIcon={<Info />}
          columnType='select'
          options={[
            { label: 'Active', value: 'active' },
            { label: 'Inactive', value: 'inactive' }
          ]}
        />
        <FilterChip label='Date' leadingIcon={<Info />} columnType='date' />
        <FilterChip label='Date' leadingIcon={<Info />} columnType='string' />
        <FilterChip label='Date' leadingIcon={<Info />} columnType='number' />
      </Flex>
    </PlaygroundLayout>
  );
}
