'use client';

import { Chip } from '../../chip';
import { Flex } from '../../flex';
import { Text } from '../../text';
import { DataViewField } from '../data-view.types';
import { useDataView } from '../hooks/useDataView';

export function DisplayProperties<TData>({
  fields
}: {
  fields: DataViewField<TData>[];
}) {
  const { table } = useDataView<TData>();
  const hidableFields = fields?.filter(f => f.hideable) ?? [];

  return (
    <Flex direction='column' gap={3}>
      <Text>Display Properties</Text>
      <Flex gap={3} wrap='wrap'>
        {hidableFields.map(field => {
          const column = table.getColumn(field.accessorKey);
          const isVisible = column ? column.getIsVisible() : true;
          return (
            <Chip
              key={field.accessorKey}
              variant='outline'
              size='small'
              color={isVisible ? 'accent' : 'neutral'}
              onClick={() => column?.toggleVisibility()}
            >
              {field.label}
            </Chip>
          );
        })}
      </Flex>
    </Flex>
  );
}
