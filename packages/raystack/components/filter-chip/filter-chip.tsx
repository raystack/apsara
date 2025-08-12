'use client';

import { Cross1Icon } from '@radix-ui/react-icons';
import { VariantProps, cva, cx } from 'class-variance-authority';
import { ReactElement, ReactNode, useCallback, useState } from 'react';
import {
  FilterOperation,
  FilterOperator,
  FilterSelectOption,
  FilterType,
  FilterTypes,
  filterOperators
} from '~/types/filters';
import { DatePicker } from '../calendar';
import { Flex } from '../flex';
import { InputField } from '../input-field';
import { Select } from '../select';
import { Text } from '../text';
import { Operation } from './filter-chip-operation';
import styles from './filter-chip.module.css';

const chip = cva(styles.chip, {
  variants: {
    variant: {
      default: styles['chip-default'],
      text: null
    }
  },
  defaultVariants: {
    variant: 'default'
  }
});

export interface FilterChipProps extends VariantProps<typeof chip> {
  label: string;
  value?: string;
  onRemove?: () => void;
  className?: string;
  ref?: React.RefObject<HTMLDivElement>;
  children?: ReactNode;
  columnType?: FilterTypes;
  options?: FilterSelectOption[];
  onValueChange?: (value: any, operation: string) => void;
  onOperationChange?: (operation: string) => void;
  leadingIcon?: ReactElement;
  operations?: FilterOperator<string>[];
}

export const FilterChip = ({
  label,
  value,
  onRemove,
  className,
  ref,
  columnType = FilterType.string,
  options = [],
  onValueChange,
  onOperationChange,
  leadingIcon,
  variant,
  operations,
  ...props
}: FilterChipProps) => {
  const computedOperations = operations?.length
    ? operations
    : filterOperators[columnType];

  const [operation, setOperation] = useState<FilterOperation | undefined>(
    computedOperations?.[0]
  );
  const [filterValue, setFilterValue] = useState<any>(value || '');

  const showOnRemove = typeof onRemove === 'function';
  const isMultiSelectColumn = columnType === FilterType.multiselect;

  const handleOperationChange = useCallback(
    (operation: FilterOperation) => {
      setOperation(operation);
      if (operation?.value) onOperationChange?.(operation.value);
    },
    [onOperationChange]
  );

  const handleFilterValueChange = useCallback(
    (value: any) => {
      setFilterValue(value);
      onValueChange?.(value, operation?.value ?? '');
    },
    [operation, onValueChange]
  );

  const renderValueInput = () => {
    switch (columnType) {
      case FilterType.multiselect:
      case FilterType.select:
        return (
          <Select
            value={isMultiSelectColumn ? filterValue : filterValue.toString()}
            onValueChange={handleFilterValueChange}
            multiple={isMultiSelectColumn}
          >
            <Select.Trigger
              iconProps={{
                style: {
                  display: 'none'
                }
              }}
              variant='text'
              className={cx(
                styles.selectValue,
                !showOnRemove && styles.selectColumn
              )}
            >
              <Select.Value placeholder='Select value'>
                {isMultiSelectColumn && filterValue.length > 1
                  ? `${filterValue.length} selected`
                  : undefined}
              </Select.Value>
            </Select.Trigger>
            <Select.Content data-variant='filter'>
              {options.map(opt => (
                <Select.Item
                  key={opt.value.toString()}
                  value={opt.value.toString()}
                >
                  {opt.label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
        );
      case FilterType.date:
        return (
          <div className={styles.dateFieldWrapper}>
            <DatePicker
              value={filterValue}
              onSelect={date => handleFilterValueChange(date)}
              showCalendarIcon={false}
              inputFieldProps={{ className: styles.dateField }}
            />
          </div>
        );
      default:
        return (
          <div className={styles.inputFieldWrapper}>
            <InputField
              variant={variant === 'text' ? 'borderless' : 'default'}
              className={styles.inputField}
              value={filterValue}
              onChange={e => handleFilterValueChange(e.target.value)}
            />
          </div>
        );
    }
  };

  return (
    <Flex
      align='center'
      ref={ref}
      className={chip({ variant, className })}
      role='group'
      aria-label={`Filter by ${label}`}
      data-variant={variant}
      {...props}
    >
      <Flex align='center' gap={2} className={styles['chip-label']}>
        {leadingIcon && (
          <span className={styles.leadingIcon} aria-hidden='true'>
            {leadingIcon}
          </span>
        )}
        <Text size={2} weight='normal'>
          {label}
        </Text>
      </Flex>
      <Operation
        operations={computedOperations}
        label={label}
        value={operation}
        onChange={handleOperationChange}
        showAlternateLabel={isMultiSelectColumn && filterValue.length <= 1}
      />
      {renderValueInput()}
      {showOnRemove && (
        <button
          className={styles.removeIconContainer}
          aria-label={`Remove ${label} filter`}
          onClick={onRemove}
        >
          <Cross1Icon className={styles.removeIcon} />
        </button>
      )}
    </Flex>
  );
};

FilterChip.displayName = 'FilterChip';
