'use client';

import { Chip } from '../../chip';
import { Flex } from '../../flex';
import { Text } from '../../text';
import { DataViewField } from '../data-view.types';
import { useDataView } from '../hooks/useDataView';

/**
 * Reads visibility from context's single global `columnVisibility` map (RFC §
 * "Unified Column Visibility via DisplayAccess"). Renderers honour the same
 * state — columnar via TanStack column hides, free-form via `DisplayAccess`.
 */
export function DisplayProperties<TData>({
  fields
}: {
  fields: DataViewField<TData>[];
}) {
  const { columnVisibility, setColumnVisibility } = useDataView<TData>();
  const hidableFields = fields?.filter(f => f.hideable) ?? [];

  const toggleVisibility = (accessorKey: string) => {
    setColumnVisibility(prev => ({
      ...prev,
      [accessorKey]: !(prev[accessorKey] ?? true)
    }));
  };

  return (
    <Flex direction='column' gap={5}>
      <Text size='small' weight='medium' variant='secondary'>
        Display Properties
      </Text>
      <Flex gap={3} wrap='wrap' align='center'>
        {hidableFields.map(field => {
          const isVisible = columnVisibility[field.accessorKey] ?? true;
          return (
            <Chip
              key={field.accessorKey}
              variant='outline'
              size='small'
              color={isVisible ? 'accent' : 'neutral'}
              onClick={() => toggleVisibility(field.accessorKey)}
            >
              {field.label}
            </Chip>
          );
        })}
      </Flex>
    </Flex>
  );
}
