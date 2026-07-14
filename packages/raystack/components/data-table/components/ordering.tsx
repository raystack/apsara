'use client';

import { TextAlignBottomIcon, TextAlignTopIcon } from '@radix-ui/react-icons';

import { Flex } from '../../flex';
import { IconButton } from '../../icon-button';
import { Select } from '../../select';
import { Text } from '../../text';
import styles from '../data-table.module.css';
import {
  ColumnData,
  DataTableSort,
  SortOrders,
  SortOrdersValues
} from '../data-table.types';

export interface OrderingProps {
  columnList: ColumnData[];
  onChange: (columnId: string, order: SortOrdersValues) => void;
  value?: DataTableSort;
}

export function Ordering({ columnList, onChange, value }: OrderingProps) {
  const currentOrder = value?.order ?? SortOrders.ASC;

  function handleColumnChange(columnId: string) {
    onChange(columnId, currentOrder);
  }

  function handleOrderChange() {
    if (!value) return;
    const newOrder =
      currentOrder === SortOrders.ASC ? SortOrders.DESC : SortOrders.ASC;
    onChange(value.name, newOrder);
  }

  return (
    <Flex align='center' gap={5}>
      <Text
        size='small'
        weight='medium'
        variant='secondary'
        className={styles['display-popover-properties-label']}
      >
        Ordering
      </Text>
      <Flex
        gap={3}
        align='center'
        className={styles['display-popover-properties-control']}
      >
        <Select
          onValueChange={handleColumnChange}
          value={value?.name}
          disabled={columnList.length === 0}
        >
          <Select.Trigger
            size='small'
            className={styles['display-popover-properties-select']}
          >
            <Select.Value placeholder='Select value' />
          </Select.Trigger>
          <Select.Content data-variant='filter'>
            {columnList.map(column => (
              <Select.Item key={column.id} value={column.id}>
                {column.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select>
        <IconButton
          onClick={handleOrderChange}
          size={4}
          disabled={columnList.length === 0}
        >
          {currentOrder === SortOrders.ASC ? (
            <TextAlignTopIcon className={styles['display-popover-sort-icon']} />
          ) : (
            <TextAlignBottomIcon
              className={styles['display-popover-sort-icon']}
            />
          )}
        </IconButton>
      </Flex>
    </Flex>
  );
}
