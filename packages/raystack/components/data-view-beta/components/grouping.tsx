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
    if (field) {
      onChange(field.accessorKey);
    }
  };

  return (
    <Flex justify='between' align='center'>
      <Text size={2} weight={500} className={styles['flex-1']}>
        Grouping
      </Text>
      <Flex className={styles['flex-1']}>
        <Select onValueChange={handleGroupChange} value={value}>
          <Select.Trigger
            size='small'
            className={styles['display-popover-properties-select']}
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
