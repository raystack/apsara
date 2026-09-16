'use client';

import { cva, cx, VariantProps } from 'class-variance-authority';
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
import {
  CalendarPreview,
  type CalendarPreviewProps,
  type CalendarPreviewScaleValue
} from '../calendar-preview';
import { toInstant } from '../calendar-preview/date-adapter';
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

export type FilterChipValue =
  | string
  | string[]
  | number
  | Date
  | CalendarPreviewScaleValue;

/* Filter state hydrated from a serialized query arrives as a string or an
   epoch. A period keeps its own shape — that is what carries its scale. */
const toCalendarValue = (
  value: unknown
): Date | CalendarPreviewScaleValue | null => {
  if (value && typeof value === 'object' && 'scale' in value) {
    return value as CalendarPreviewScaleValue;
  }
  return toInstant(value);
};

/**
 * Forwarded to the chip's `CalendarPreview`. `value` and `defaultValue` are
 * owned by `FilterChip`, and `children` would replace the composition the chip
 * renders. `onValueChange` is composed with the chip's, never replacing it.
 */
export type FilterChipCalendarProps = Omit<
  CalendarPreviewProps,
  'value' | 'defaultValue' | 'children'
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
  /** Forwarded to the `CalendarPreview` behind `columnType="date"`. */
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
  // `??` not `||`, since a falsy option value like `0` is a real selection.
  const [filterValue, setFilterValue] = useState<any>(value ?? '');

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
              className={styles.selectValue}
              data-slot='filter-chip-value'
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
      case FilterType.date: {
        const {
          className: calendarClassName,
          onValueChange: onCalendarValueChange,
          ...calendarRest
        } = calendarProps ?? {};
        /* One cast at the boundary: the root's three arms are a union, so the
           props the consumer chose cannot be spread back through `Omit`. */
        const calendarRootProps = {
          ...calendarRest,
          className: cx(styles.dateField, calendarClassName),
          value: toCalendarValue(filterValue),
          /* Composed, not overwritten: a consumer callback must not silently
             take the place of the chip's own. */
          onValueChange: (next: unknown, details: unknown) => {
            (
              onCalendarValueChange as
                | ((value: unknown, details: unknown) => void)
                | undefined
            )?.(next, details);
            handleFilterValueChange(next);
          }
        } as CalendarPreviewProps;
        return (
          <div
            className={styles.dateFieldWrapper}
            data-slot='filter-chip-value'
          >
            <CalendarPreview {...calendarRootProps}>
              <CalendarPreview.Trigger>
                <CalendarPreview.Input trailingIcon={null} />
              </CalendarPreview.Trigger>
              <CalendarPreview.Content>
                <CalendarPreview.Days />
              </CalendarPreview.Content>
            </CalendarPreview>
          </div>
        );
      }
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
