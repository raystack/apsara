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
import { ViewSwitcher } from './view-switcher';

interface DisplayControlsProps {
  trigger?: ReactNode;
}

/**
 * `DataView.DisplayControls` — the popover housing Ordering, Grouping, Display
 * Properties (column visibility), and Reset. When `views.length > 1`, the
 * popover also hosts the view switcher (consumers can place
 * `<DataView.ViewSwitcher>` standalone elsewhere for layout flexibility).
 */
export function DisplayControls<TData>({
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
}: DisplayControlsProps) {
  const {
    fields,
    updateTableQuery,
    tableQuery,
    defaultSort,
    onDisplaySettingsReset,
    views
  } = useDataView<TData>();

  const sortableColumns = (fields ?? [])
    .filter(f => f.sortable)
    .map(f => ({ label: f.label, id: f.accessorKey }));

  const onSortChange = (columnId: string, order: SortOrdersValues) =>
    updateTableQuery(query => ({
      ...query,
      sort: [{ name: columnId, order }]
    }));

  const onGroupChange = (columnId: string) =>
    updateTableQuery(query => ({ ...query, group_by: [columnId] }));

  const onGroupRemove = () =>
    updateTableQuery(query => ({ ...query, group_by: [] }));

  const onReset = () => onDisplaySettingsReset();

  const showViewSwitcher = (views?.length ?? 0) > 1;

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
          {showViewSwitcher ? (
            <Flex className={styles['display-popover-properties-container']}>
              <ViewSwitcher />
            </Flex>
          ) : null}
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

DisplayControls.displayName = 'DataView.DisplayControls';
