'use client';

import { Flex } from '../../flex';
import { Select } from '../../select';
import { Text } from '../../text';
import styles from '../data-view.module.css';
import { DataViewField, defaultGroupOption } from '../data-view.types';

interface GroupingProps<TData> {
  fields: DataViewField<TData>[];
  onChange: (fieldAccessor: string) => void;
  onRemove: () => void;
  value: string;
}

export function Grouping<TData>({
  fields = [],
  onChange,
  onRemove,
  value
}: GroupingProps<TData>) {
  const groupableFields = fields.filter(f => f.groupable);

  const handleGroupChange = (fieldAccessor: string) => {
    if (fieldAccessor === defaultGroupOption.id) {
      onRemove();
      return;
    }
    const field = fields.find(f => f.accessorKey === fieldAccessor);
    if (field) onChange(field.accessorKey);
  };

  return (
    <Flex align='center' gap={5} data-slot='data-view-grouping'>
      <Text
        size='small'
        weight='medium'
        variant='secondary'
        className={styles['display-popover-properties-label']}
        data-slot='data-view-grouping-label'
      >
        Grouping
      </Text>
      <Flex
        align='center'
        className={styles['display-popover-properties-control']}
        data-slot='data-view-grouping-control'
      >
        <Select onValueChange={handleGroupChange} value={value}>
          <Select.Trigger
            size='small'
            className={styles['display-popover-properties-select']}
            data-slot='data-view-grouping-select'
          >
            <Select.Value placeholder='Select value' />
          </Select.Trigger>
          <Select.Content data-variant='filter'>
            <Select.Item value={defaultGroupOption.id}>
              {defaultGroupOption.label}
            </Select.Item>
            {groupableFields.map(field => (
              <Select.Item key={field.accessorKey} value={field.accessorKey}>
                {field.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select>
      </Flex>
    </Flex>
  );
}
