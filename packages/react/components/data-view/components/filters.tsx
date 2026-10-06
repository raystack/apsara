'use client';

import { cx } from 'class-variance-authority';
import { isValidElement, ReactNode, useMemo } from 'react';
import { FilterIcon } from '~/icons';
import { FilterOperatorTypes, FilterType } from '~/types/filters';
import { Button } from '../../button';
import { FilterChip } from '../../filter-chip';
import { Flex } from '../../flex';
import { IconButton } from '../../icon-button';
import { Menu } from '../../menu';
import type { MenuContentProps } from '../../menu/menu-content';
import styles from '../data-view.module.css';
import { DataViewField } from '../data-view.types';
import { useDataView } from '../hooks/useDataView';
import { useFilters } from '../hooks/useFilters';

type Trigger<TData> =
  | ReactNode
  | ((args: {
      availableFilters: DataViewField<TData>[];
      appliedFilters: Set<string>;
    }) => ReactNode);

type PositionerProps = Pick<MenuContentProps, 'align' | 'side' | 'sideOffset'>;

interface AddFilterProps<TData> extends PositionerProps {
  fieldList: DataViewField<TData>[];
  appliedFiltersSet: Set<string>;
  onAddFilter: (field: DataViewField<TData>) => void;
  children?: Trigger<TData>;
  /** Applied to the default trigger only. A custom `trigger`/`children` owns its own className. */
  className?: string;
}

function AddFilter<TData>({
  fieldList = [],
  appliedFiltersSet,
  onAddFilter,
  children,
  className,
  ...positionerProps
}: AddFilterProps<TData>) {
  const unappliedFields = fieldList.filter(
    f => !appliedFiltersSet.has(f.accessorKey)
  );
  const availableFilters = unappliedFields.filter(
    f =>
      f.filterOptions?.length ||
      (f.filterType !== FilterType.select &&
        f.filterType !== FilterType.multiselect)
  );

  const trigger = useMemo(() => {
    if (typeof children === 'function')
      return children({ availableFilters, appliedFilters: appliedFiltersSet });
    if (children) return children;
    if (appliedFiltersSet.size > 0) {
      return (
        <IconButton
          size={4}
          className={className}
          aria-label='Add filter'
          data-slot='data-view-add-filter'
        >
          <FilterIcon />
        </IconButton>
      );
    }
    return (
      <Button
        variant='text'
        size='small'
        leadingIcon={<FilterIcon />}
        color='neutral'
        className={className}
        data-slot='data-view-add-filter'
      >
        Filter
      </Button>
    );
  }, [children, appliedFiltersSet, availableFilters, className]);

  return unappliedFields.length > 0 ? (
    <Menu>
      <Menu.Trigger
        disabled={availableFilters.length === 0}
        render={isValidElement(trigger) ? trigger : <button>{trigger}</button>}
      />
      <Menu.Content {...positionerProps}>
        {availableFilters?.map(field => (
          <Menu.Item
            key={field.accessorKey}
            onClick={() => onAddFilter(field)}
            data-slot='data-view-add-filter-item'
          >
            {field.label}
          </Menu.Item>
        ))}
      </Menu.Content>
    </Menu>
  ) : null;
}

export interface DataViewFiltersProps<TData> extends PositionerProps {
  classNames?: {
    /** @deprecated Use `[data-slot="filter-chip"]` instead. */
    filterChips?: string;
    /** @deprecated Use `[data-slot="data-view-add-filter"]` instead. */
    addFilter?: string;
  };
  className?: string;
  trigger?: Trigger<TData>;
}

export function Filters<TData>({
  classNames,
  className,
  trigger,
  ...positionerProps
}: DataViewFiltersProps<TData>) {
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
        ...filter
      };
    }) || [];

  const hasAppliedFilters = appliedFilters.length > 0;

  return (
    <Flex
      gap={3}
      align='center'
      className={cx(styles.filterContainer, className)}
      data-has-filter-chips={hasAppliedFilters || undefined}
      data-slot='data-view-filters'
    >
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
          selectProps={filter.selectProps}
          className={classNames?.filterChips}
        />
      ))}
      <AddFilter
        fieldList={filterableFields}
        appliedFiltersSet={appliedFiltersSet}
        onAddFilter={onAddFilter}
        className={classNames?.addFilter}
        {...positionerProps}
      >
        {trigger}
      </AddFilter>
    </Flex>
  );
}

Filters.displayName = 'DataView.Filters';
