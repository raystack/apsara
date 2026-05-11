'use client';

import { TextAlignBottomIcon, TextAlignTopIcon } from '@radix-ui/react-icons';

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
  function handleColumnChange(columnId: string) {
    onChange(columnId, value.order);
  }

  function handleOrderChange() {
    const newOrder =
      value.order === SortOrders.ASC ? SortOrders.DESC : SortOrders.ASC;
    onChange(value.name, newOrder);
  }

  return (
    <Flex justify='between' align='center'>
      <Text size='small' weight='medium' className={styles['flex-1']}>
        Ordering
      </Text>
      <Flex gap='extra-small' className={styles['flex-1']}>
        <Select
          onValueChange={handleColumnChange}
          value={value.name}
          disabled={columnList.length === 0}
        >
          <Select.Trigger
            size='small'
            className={styles['display-popover-properties-select']}
            with-icon-button='true'
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
          {value.order === SortOrders?.ASC ? (
            <TextAlignBottomIcon
              className={styles['display-popover-sort-icon']}
            />
          ) : (
            <TextAlignTopIcon className={styles['display-popover-sort-icon']} />
          )}
        </IconButton>
      </Flex>
    </Flex>
  );
}
