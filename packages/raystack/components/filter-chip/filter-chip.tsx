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
import { DatePicker } from '../calendar';
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
   * Date display/parse format for `columnType="date"`, forwarded to the
   * underlying DatePicker. Defaults to a month-as-text format so the
   * month reads as e.g. "27 May 2026" instead of "27/05/2026".
   */
  dateFormat?: string;
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
  dateFormat = 'DD MMM YYYY',
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
              value={filterValue instanceof Date ? filterValue : undefined}
              onSelect={date => handleFilterValueChange(date)}
              dateFormat={dateFormat}
              showCalendarIcon={false}
              slotProps={{
                input: {
                  width: 'fit-content',
                  classNames: { container: styles.dateField }
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
              width='fit-content'
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
