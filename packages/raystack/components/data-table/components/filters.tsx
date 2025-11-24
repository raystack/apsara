'use client';

import { ReactNode, useMemo } from 'react';
import { FilterIcon } from '~/icons';
import { FilterOperatorTypes, FilterType } from '~/types/filters';
import { Button } from '../../button';
import { DropdownMenu } from '../../dropdown-menu';
import { FilterChip } from '../../filter-chip';
import { Flex } from '../../flex';
import { IconButton } from '../../icon-button';
import { DataTableColumn } from '../data-table.types';
import { useDataTable } from '../hooks/useDataTable';
import { useFilters } from '../hooks/useFilters';

type Trigger<TData, TValue> =
  | ReactNode
  | (({
      availableFilters,
      appliedFilters
    }: {
      availableFilters: DataTableColumn<TData, TValue>[];
      appliedFilters: Set<string>;
    }) => ReactNode);

interface AddFilterProps<TData, TValue> {
  columnList: DataTableColumn<TData, TValue>[];
  appliedFiltersSet: Set<string>;
  onAddFilter: (column: DataTableColumn<TData, TValue>) => void;
  children?: Trigger<TData, TValue>;
}

function AddFilter<TData, TValue>({
  columnList = [],
  appliedFiltersSet,
  onAddFilter,
  children
}: AddFilterProps<TData, TValue>) {
  const availableFilters = columnList?.filter(
    col => !appliedFiltersSet.has(col.id)
  );

  const trigger = useMemo(() => {
    if (typeof children === 'function')
      return children({ availableFilters, appliedFilters: appliedFiltersSet });
    else if (children) return children;
    else if (appliedFiltersSet.size > 0)
      return (
        <IconButton size={4}>
          <FilterIcon />
        </IconButton>
      );
    else
      return (
        <Button
          variant='text'
          size='small'
          leadingIcon={<FilterIcon />}
          color='neutral'
        >
          Filter
        </Button>
      );
  }, [children, appliedFiltersSet, availableFilters]);

  return availableFilters.length > 0 ? (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {availableFilters?.map(column => {
          const columnDef = column.columnDef;
          const id = columnDef.accessorKey || column.id;
          return (
            <DropdownMenu.Item key={id} onClick={() => onAddFilter(column)}>
              {columnDef.header || id}
            </DropdownMenu.Item>
          );
        })}
      </DropdownMenu.Content>
    </DropdownMenu>
  ) : null;
}

export function Filters<TData, TValue>({
  classNames,
  className,
  trigger
}: {
  classNames?: {
    container?: string;
    filterChips?: string;
    addFilter?: string;
  };
  className?: string;
  trigger?: Trigger<TData, TValue>;
}) {
  const { table, tableQuery } = useDataTable();
  const columns = table?.getAllColumns() as DataTableColumn<TData, TValue>[];

  const {
    onAddFilter,
    handleRemoveFilter,
    handleFilterValueChange,
    handleFilterOperationChange
  } = useFilters<TData, TValue>();

  const columnList = columns?.filter(
    column => column.columnDef.enableColumnFilter
  );

  const appliedFiltersSet = new Set(
    tableQuery?.filters?.map(filter => filter.name)
  );

  const appliedFilters =
    tableQuery?.filters?.map(filter => {
      const columnDef = columns?.find(col => {
        const columnDef = col.columnDef;
        const id = columnDef.accessorKey || col.id;
        return id === filter.name;
      })?.columnDef;
      return {
        filterType: columnDef?.filterType || FilterType.string,
        label: (columnDef?.header as string) || '',
        options: columnDef?.filterOptions || [],
        ...filter
      };
    }) || [];

  return (
    <Flex gap={3} className={className}>
      <Flex gap={3} className={classNames?.container}>
        {appliedFilters.map(filter => (
          <FilterChip
            key={filter.name}
            label={filter.label}
            value={filter.value}
            onRemove={() => handleRemoveFilter(filter.name)}
            onValueChange={value => handleFilterValueChange(filter.name, value)}
            onOperationChange={operator =>
              handleFilterOperationChange(
                filter.name,
                operator as FilterOperatorTypes
              )
            }
            columnType={filter.filterType}
            options={filter.options}
            className={classNames?.filterChips}
          />
        ))}
      </Flex>
      <AddFilter
        columnList={columnList}
        appliedFiltersSet={appliedFiltersSet}
        onAddFilter={onAddFilter}
      >
        {trigger}
      </AddFilter>
    </Flex>
  );
}
