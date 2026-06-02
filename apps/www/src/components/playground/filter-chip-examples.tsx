'use client';

import { FilterChip, Flex } from '@raystack/apsara';
import { Info } from 'lucide-react';
import PlaygroundLayout from './playground-layout';

export function FilterChipExamples() {
  return (
    <PlaygroundLayout title='FilterChip'>
      <Flex gap={9} wrap='wrap'>
        <FilterChip
          label='Status'
          leadingIcon={<Info />}
          columnType='select'
          options={[
            { label: 'Active', value: 'active' },
            { label: 'Inactive', value: 'inactive' }
          ]}
        />
        <FilterChip
          label='Team'
          leadingIcon={<Info />}
          columnType='multiselect'
          options={[
            { label: 'Frontend', value: 'frontend' },
            { label: 'Backend', value: 'backend' },
            { label: 'Design', value: 'design' }
          ]}
        />
        <FilterChip label='Created' leadingIcon={<Info />} columnType='date' />
        <FilterChip label='Name' leadingIcon={<Info />} columnType='string' />
        <FilterChip label='Amount' leadingIcon={<Info />} columnType='number' />
      </Flex>
    </PlaygroundLayout>
  );
}
