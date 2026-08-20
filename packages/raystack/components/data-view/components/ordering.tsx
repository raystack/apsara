'use client';

import { ArrowDownWideNarrowIcon } from '~/icons/generated';
import { Flex } from '../../flex';
import { IconButton } from '../../icon-button';
import { Select } from '../../select';
import { Text } from '../../text';
import styles from '../data-view.module.css';
import {
  ColumnData,
  DataViewSort,
  SortOrders,
  SortOrdersValues
} from '../data-view.types';

export interface OrderingProps {
  columnList: ColumnData[];
  onChange: (columnId: string, order: SortOrdersValues) => void;
  value: DataViewSort;
}

export function Ordering({ columnList, onChange, value }: OrderingProps) {
  const handleColumnChange = (columnId: string) =>
    onChange(columnId, value.order);
  const handleOrderChange = () => {
    const newOrder =
      value.order === SortOrders.ASC ? SortOrders.DESC : SortOrders.ASC;
    onChange(value.name, newOrder);
  };

  return (
    <Flex align='center' gap={5} data-slot='data-view-ordering'>
      <Text
        size='small'
        weight='medium'
        variant='secondary'
        className={styles['display-popover-properties-label']}
        data-slot='data-view-ordering-label'
      >
        Ordering
      </Text>
      <Flex
        gap={3}
        align='center'
        className={styles['display-popover-properties-control']}
        data-slot='data-view-ordering-control'
      >
        <Select
          onValueChange={handleColumnChange}
          value={value.name}
          disabled={columnList.length === 0}
        >
          <Select.Trigger
            size='small'
            className={styles['display-popover-properties-select']}
            data-slot='data-view-ordering-select'
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
          data-slot='data-view-ordering-direction'
        >
          <ArrowDownWideNarrowIcon
            className={styles['display-popover-sort-icon']}
            data-order={value.order}
          />
        </IconButton>
      </Flex>
    </Flex>
  );
}
