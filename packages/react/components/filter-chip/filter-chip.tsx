'use client';

import { cva, VariantProps } from 'class-variance-authority';
import dayjs from 'dayjs';
import { ComponentProps, ReactElement, useCallback, useState } from 'react';
import { XIcon } from '~/icons';
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
 * Coerce a `FilterChipValue` to the `Date` the DatePicker expects, since filter
 * state hydrated from a serialized query arrives as a string or epoch number.
 * Unparseable values leave the field unselected.
 */
const toDateValue = (value: unknown): Date | undefined => {
  if (value instanceof Date) return value;
  if (typeof value === 'string' || typeof value === 'number') {
    const parsed = dayjs(value);
    return parsed.isValid() ? parsed.toDate() : undefined;
  }
  return undefined;
};

/** Checked on change, not keydown, so paste and IME input are covered. */
const PARTIAL_NUMBER = /^-?\d*\.?\d*$/;

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
  const isNumberColumn = columnType === FilterType.number;
  // `??` not `||`, since a falsy option value like `0` is a real selection.
  // For `number`, the value is shown without an exponent (`1e-7`), and a
  // non-numeric value starts empty, since the regex would reject every edit.
  const [filterValue, setFilterValue] = useState<any>(() => {
    if (!isNumberColumn) return value ?? '';
    const text =
      typeof value === 'number'
        ? value.toLocaleString('en-US', {
            useGrouping: false,
            maximumFractionDigits: 20
          })
        : String(value ?? '');
    return PARTIAL_NUMBER.test(text) ? text : '';
  });

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

  const handleTextInputChange = useCallback(
    (raw: string) => {
      if (!isNumberColumn) {
        handleFilterValueChange(raw);
        return;
      }
      // Skipping setFilterValue makes React restore the controlled value.
      if (!PARTIAL_NUMBER.test(raw)) return;
      const parsed = Number(raw);
      if (parsed === Infinity || parsed === -Infinity) return;

      setFilterValue(raw);
      const isIntermediate = raw === '' || Number.isNaN(parsed);
      onValueChange?.(isIntermediate ? raw : parsed, operation?.value ?? '');
    },
    [isNumberColumn, handleFilterValueChange, onValueChange, operation]
  );

  const getOptionLabel = (optionValue: string) =>
    options.find(opt => opt.value.toString() === optionValue)?.label ??
    optionValue;

  const renderValueInput = () => {
    switch (columnType) {
      case FilterType.multiselect:
      case FilterType.select:
        return (
          <Select
            value={isMultiSelectColumn ? filterValue : filterValue.toString()}
            onValueChange={handleFilterValueChange}
            multiple={isMultiSelectColumn}
            items={options.map(opt => ({
              value: opt.value.toString(),
              label: opt.label
            }))}
            {...selectProps}
          >
            <Select.Trigger
              iconProps={{
                style: {
                  display: 'none'
                }
              }}
              variant='text'
              className={styles.selectValue}
              data-slot='filter-chip-value'
            >
              <Select.Value placeholder='Select value'>
                {selected =>
                  Array.isArray(selected) && selected.length > 1
                    ? `${selected.length} selected`
                    : getOptionLabel([selected].flat()[0])
                }
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
          <div
            className={styles.dateFieldWrapper}
            data-slot='filter-chip-value'
          >
            <DatePicker
              showCalendarIcon={false}
              {...calendarProps}
              value={toDateValue(filterValue)}
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
          <div
            className={styles.inputFieldWrapper}
            data-slot='filter-chip-value'
          >
            <Input
              variant={variant === 'text' ? 'borderless' : 'default'}
              classNames={{ container: styles.inputField }}
              value={filterValue}
              onChange={e => handleTextInputChange(e.target.value)}
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
      data-slot='filter-chip'
      {...props}
    >
      <Flex
        align='center'
        gap={2}
        className={styles['chip-label']}
        data-slot='filter-chip-label'
      >
        {leadingIcon && (
          <span
            className={styles.leadingIcon}
            aria-hidden='true'
            data-slot='filter-chip-leading-icon'
          >
            {leadingIcon}
          </span>
        )}
        <Text size='small' weight='regular' data-slot='filter-chip-label-text'>
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
          data-slot='filter-chip-remove'
        >
          <XIcon
            className={styles.removeIcon}
            data-slot='filter-chip-remove-icon'
          />
        </button>
      )}
    </Flex>
  );
};

FilterChip.displayName = 'FilterChip';
