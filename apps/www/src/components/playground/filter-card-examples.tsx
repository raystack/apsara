'use client';

import { Button, FilterCard, Select, Text } from '@raystack/apsara';
import PlaygroundLayout from './playground-layout';

export function FilterCardExamples() {
  return (
    <PlaygroundLayout title='FilterCard'>
      <FilterCard>
        <FilterCard.Section>
          <FilterCard.Item label='Ordering'>
            <Select defaultValue='auto'>
              <Select.Trigger
                size='small'
                variant='outline'
                style={{ width: '100%' }}
              >
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value='auto'>Auto</Select.Item>
                <Select.Item value='name'>Name</Select.Item>
                <Select.Item value='date'>Date</Select.Item>
              </Select.Content>
            </Select>
          </FilterCard.Item>
          <FilterCard.Item label='Grouping'>
            <Select defaultValue='none'>
              <Select.Trigger
                size='small'
                variant='outline'
                style={{ width: '100%' }}
              >
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value='none'>No grouping</Select.Item>
                <Select.Item value='status'>Status</Select.Item>
                <Select.Item value='type'>Type</Select.Item>
              </Select.Content>
            </Select>
          </FilterCard.Item>
        </FilterCard.Section>
        <FilterCard.Section title='Display Properties'>
          <Text size={1}>Name, Creator, Project</Text>
        </FilterCard.Section>
        <FilterCard.Footer>
          <Button variant='text' size='small' color='neutral'>
            Reset to default
          </Button>
        </FilterCard.Footer>
      </FilterCard>
    </PlaygroundLayout>
  );
}
