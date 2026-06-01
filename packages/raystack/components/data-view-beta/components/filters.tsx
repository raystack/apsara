'use client';

import { isValidElement, ReactNode, useMemo } from 'react';
import { FilterIcon } from '~/icons';
import { FilterOperatorTypes, FilterType } from '~/types/filters';
import { Button } from '../../button';
import { FilterChip } from '../../filter-chip';
import { Flex } from '../../flex';
import { IconButton } from '../../icon-button';
import { Menu } from '../../menu';
import { DataViewField } from '../data-view.types';
import { useDataView } from '../hooks/useDataView';
import { useFilters } from '../hooks/useFilters';

type Trigger<TData> =
  | ReactNode
  | (({
      availableFilters,
      appliedFilters
    }: {
      availableFilters: DataViewField<TData>[];
      appliedFilters: Set<string>;
    }) => ReactNode);

interface AddFilterProps<TData> {
  fieldList: DataViewField<TData>[];
  appliedFiltersSet: Set<string>;
  onAddFilter: (field: DataViewField<TData>) => void;
  children?: Trigger<TData>;
}

function AddFilter<TData>({
  fieldList = [],
  appliedFiltersSet,
  onAddFilter,
  children
}: AddFilterProps<TData>) {
  const availableFilters = fieldList?.filter(
    f => !appliedFiltersSet.has(f.accessorKey)
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
    <Menu>
      <Menu.Trigger
        render={isValidElement(trigger) ? trigger : <button>{trigger}</button>}
      />
      <Menu.Content>
        {availableFilters?.map(field => (
          <Menu.Item key={field.accessorKey} onClick={() => onAddFilter(field)}>
            {field.label}
          </Menu.Item>
        ))}
      </Menu.Content>
    </Menu>
  ) : null;
}

export function Filters<TData>({
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
  trigger?: Trigger<TData>;
}) {
  const { fields, tableQuery } = useDataView<TData>();

  const {
    onAddFilter,
    handleRemoveFilter,
    handleFilterValueChange,
    handleFilterOperationChange
  } = useFilters<TData>();

  const filterableFields = fields?.filter(f => f.filterable) ?? [];

  const appliedFiltersSet = new Set(
    tableQuery?.filters?.map(filter => filter.name)
  );

  const appliedFilters =
    tableQuery?.filters?.map(filter => {
      const field = fields?.find(f => f.accessorKey === filter.name);
      return {
        filterType: field?.filterType || FilterType.string,
        label: field?.label || '',
        options: field?.filterOptions || [],
        selectProps: field?.filterProps?.select,
        calendarProps: field?.filterProps?.calendar,
        ...filter
      };
    }) || [];

  return (
    <Flex gap={3} className={className}>
      {appliedFilters.length > 0 && (
        <Flex gap={3} className={classNames?.container}>
          {appliedFilters.map(filter => (
            <FilterChip
              key={filter.name}
              label={filter.label}
              value={filter.value}
              onRemove={() => handleRemoveFilter(filter.name)}
              onValueChange={value =>
                handleFilterValueChange(filter.name, value)
              }
              onOperationChange={operator =>
                handleFilterOperationChange(
                  filter.name,
                  operator as FilterOperatorTypes
                )
              }
              columnType={filter.filterType}
              options={filter.options}
              selectProps={filter.selectProps}
              calendarProps={filter.calendarProps}
              className={classNames?.filterChips}
            />
          ))}
        </Flex>
      )}
      <AddFilter
        fieldList={filterableFields}
        appliedFiltersSet={appliedFiltersSet}
        onAddFilter={onAddFilter}
      >
        {trigger}
      </AddFilter>
    </Flex>
  );
}

Filters.displayName = 'DataView.Filters';
