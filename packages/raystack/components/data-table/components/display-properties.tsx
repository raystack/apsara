'use client';

import { Chip } from '../../chip';
import { Flex } from '../../flex';
import { Text } from '../../text';
import { DataTableColumn } from '../data-table.types';

export function DisplayProperties<TData, TValue>({
  columns
}: {
  columns: DataTableColumn<TData, TValue>[];
}) {
  const hidableColumns = columns?.filter(col => col.columnDef.enableHiding);

  return (
    <Flex direction='column' gap={3}>
      <Text>Display Properties</Text>
      <Flex gap={3} wrap='wrap'>
        {hidableColumns.map(column => (
          <Chip
            key={column.id}
            variant='outline'
            size='small'
            color={column.getIsVisible() ? 'accent' : 'neutral'}
            onClick={() => column.toggleVisibility()}
          >
            {(column.columnDef.header as string) || column.id}
          </Chip>
        ))}
      </Flex>
    </Flex>
  );
}
