'use client';

import { MixerHorizontalIcon } from '@radix-ui/react-icons';

import { isValidElement, ReactNode } from 'react';
import { Button } from '../../button';
import { Flex } from '../../flex';
import { Popover } from '../../popover';
import styles from '../data-view.module.css';
import { defaultGroupOption, SortOrdersValues } from '../data-view.types';
import { useDataView } from '../hooks/useDataView';
import { DisplayProperties } from './display-properties';
import { Grouping } from './grouping';
import { Ordering } from './ordering';

interface DisplaySettingsProps {
  trigger?: ReactNode;
}

export function DisplaySettings<TData>({
  trigger = (
    <Button
      variant='outline'
      color='neutral'
      size='small'
      leadingIcon={<MixerHorizontalIcon />}
    >
      Display
    </Button>
  )
}: DisplaySettingsProps) {
  const {
    fields,
    updateTableQuery,
    tableQuery,
    defaultSort,
    onDisplaySettingsReset
  } = useDataView<TData>();

  const sortableColumns = (fields ?? [])
    .filter(f => f.sortable)
    .map(f => ({
      label: f.label,
      id: f.accessorKey
    }));

  function onSortChange(columnId: string, order: SortOrdersValues) {
    updateTableQuery(query => {
      return {
        ...query,
        sort: [{ name: columnId, order }]
      };
    });
  }

  function onGroupChange(columnId: string) {
    updateTableQuery(query => {
      return {
        ...query,
        group_by: [columnId]
      };
    });
  }

  function onGroupRemove() {
    updateTableQuery(query => {
      return {
        ...query,
        group_by: []
      };
    });
  }

  function onReset() {
    onDisplaySettingsReset();
  }

  return (
    <Popover>
      <Popover.Trigger
        render={isValidElement(trigger) ? trigger : <button>{trigger}</button>}
      />
      <Popover.Content
        className={styles['display-popover-content']}
        align='end'
      >
        <Flex direction='column'>
          <Flex
            direction='column'
            className={styles['display-popover-properties-container']}
            gap={5}
          >
            <Ordering
              columnList={sortableColumns}
              onChange={onSortChange}
              value={tableQuery?.sort?.[0] || defaultSort}
            />
            <Grouping
              fields={fields ?? []}
              onRemove={onGroupRemove}
              onChange={onGroupChange}
              value={tableQuery?.group_by?.[0] || defaultGroupOption.id}
            />
          </Flex>
          <Flex className={styles['display-popover-properties-container']}>
            <DisplayProperties fields={fields ?? []} />
          </Flex>
          <Flex
            justify='end'
            className={styles['display-popover-reset-container']}
          >
            <Button variant='text' onClick={onReset} color='neutral'>
              Reset to default
            </Button>
          </Flex>
        </Flex>
      </Popover.Content>
    </Popover>
  );
}

DisplaySettings.displayName = 'DataView.DisplayControls';
