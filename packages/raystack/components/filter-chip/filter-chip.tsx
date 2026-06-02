'use client';

import { Cross1Icon } from '@radix-ui/react-icons';
import { cva, cx, VariantProps } from 'class-variance-authority';
import { ComponentProps, ReactElement, useCallback, useState } from 'react';
import {
  FilterOperation,
  FilterOperator,
  FilterSelectOption,
  FilterType,
  FilterTypes,
  filterOperators
} from '~/types/filters';
import { DatePicker, type DatePickerProps } from '../calendar';
import { Flex } from '../flex';
import { Input } from '../input';
import { Select } from '../select';
import { BaseSelectProps } from '../select/select-root';
import { Text } from '../text';
import styles from './filter-chip.module.css';
import { Operation } from './filter-chip-operation';

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

export type FilterChipValue = string | string[] | number | Date;

/**
 * Subset of `DatePickerProps` that consumers may forward to the chip's
 * built-in DatePicker via `calendarProps`. `value`/`onSelect`/`defaultValue`
 * are owned by `FilterChip`; `children` would replace the input trigger and
 * break the chip layout.
 */
export type FilterChipCalendarProps = Omit<
  DatePickerProps,
  'value' | 'onSelect' | 'defaultValue' | 'children'
>;

export interface FilterChipProps
  extends ComponentProps<'div'>,
    VariantProps<typeof chip> {
  label: string;
  value?: FilterChipValue;
  onRemove?: () => void;
  columnType?: FilterTypes;
  options?: FilterSelectOption[];
  onValueChange?: (value: FilterChipValue, operation: string) => void;
  onOperationChange?: (operation: string) => void;
  leadingIcon?: ReactElement;
  operations?: FilterOperator<string>[];
  selectProps?: BaseSelectProps;
  /**
   * Props forwarded to the underlying `DatePicker` for `columnType="date"`.
   * `value`/`onSelect`/`defaultValue` are owned by `FilterChip` and excluded;
   * `children` is excluded so the chip's input trigger isn't replaced.
   */
  calendarProps?: FilterChipCalendarProps;
}

/**
 * A compact, removable filter pill that pairs a label and operator with a
 * value control chosen by `columnType`: a `Select` (`select`/`multiselect`),
 * a `DatePicker` (`date`), or a text `Input` (`string`/`number`). The value
 * control sizes to its content so the chip hugs the active filter. Emits
 * `onValueChange`/`onOperationChange` and renders a remove button when
 * `onRemove` is provided.
 */
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
  selectProps,
  calendarProps,
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
            {...selectProps}
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
              showCalendarIcon={false}
              {...calendarProps}
              value={filterValue instanceof Date ? filterValue : undefined}
              onSelect={date => handleFilterValueChange(date)}
              slotProps={{
                ...calendarProps?.slotProps,
                input: {
                  classNames: { container: styles.dateField },
                  ...calendarProps?.slotProps?.input
                }
              }}
            />
          </div>
        );
      default:
        return (
          <div className={styles.inputFieldWrapper}>
            <Input
              variant={variant === 'text' ? 'borderless' : 'default'}
              classNames={{ container: styles.inputField }}
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
        <Text size='small' weight='regular'>
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
