'use client';

import { TZDate } from '@date-fns/tz';
import { cva, cx, VariantProps } from 'class-variance-authority';
import { parseISO } from 'date-fns';
import {
  ComponentProps,
  ReactElement,
  useCallback,
  useMemo,
  useState
} from 'react';
import {
  CalendarPreview,
  type CalendarPreviewContentProps,
  type CalendarPreviewInputProps,
  type CalendarPreviewProps
} from '~/components/calendar-preview';
import { XIcon } from '~/icons';
import { toInstant } from '~/shared/date-filters';
import {
  FilterOperation,
  FilterOperator,
  FilterSelectOption,
  FilterType,
  FilterTypes,
  filterOperators
} from '~/types/filters';
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

/* The message `DatePicker` reports, so `onErrorChange` reads the same. */
const INVALID_DATE = 'Invalid date';

/* A year the calendar cannot show leaves the field empty. */
const toDateValue = (value: unknown, timeZone?: string): Date | undefined => {
  const date = toInstant(value);
  if (!date) return undefined;
  const year = (timeZone ? new TZDate(date, timeZone) : date).getFullYear();
  return year >= 1 && year <= 9999 ? date : undefined;
};

/** Checked on change, not keydown, so paste and IME input are covered. */
const PARTIAL_NUMBER = /^-?\d*\.?\d*$/;

/**
 * The `CalendarPreview` props that consumers may forward to the chip's
 * calendar via `calendarProps`. `FilterChip` owns the value and the parts.
 */
export type FilterChipCalendarProps = Pick<
  CalendarPreviewProps,
  | 'timeZone'
  | 'minDate'
  | 'maxDate'
  | 'isDateUnavailable'
  | 'yearRange'
  | 'defaultMonth'
  | 'today'
> & {
  /** Formats the selected date for the input. */
  formatValue?: (date: Date, timeZone?: string) => string;
  /** Props for the chip's date input and its popup. */
  slotProps?: {
    input?: Omit<CalendarPreviewInputProps, 'field'>;
    popover?: Omit<CalendarPreviewContentProps, 'children'>;
  };
  /**
   * Shows the calendar icon in the date input.
   * @default false
   */
  showCalendarIcon?: boolean;
  /** Called with a message when the typed date is invalid, and with `undefined` when it is valid again. */
  onErrorChange?: (error: string | undefined) => void;
};

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
  /** Props forwarded to the `CalendarPreview` for `columnType="date"`. */
  calendarProps?: FilterChipCalendarProps;
}

/**
 * A compact, removable filter pill that pairs a label and operator with a
 * value control chosen by `columnType`: a `Select` (`select`/`multiselect`),
 * a `CalendarPreview` (`date`), or a text `Input` (`string`/`number`). The value
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

  const [dateOpen, setDateOpen] = useState(false);
  const {
    formatValue: formatDate,
    slotProps: dateSlotProps,
    showCalendarIcon = false,
    onErrorChange,
    ...calendarRest
  } = calendarProps ?? {};
  const { classNames: inputClassNames, ...inputProps } =
    dateSlotProps?.input ?? {};
  /* A new `Date` each render reads as a new value, and the input drops its typed text. */
  const dateValue = useMemo(
    () => toDateValue(filterValue, calendarRest.timeZone) ?? null,
    [filterValue, calendarRest.timeZone]
  );

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
      case FilterType.date:
        return (
          <div
            className={styles.dateFieldWrapper}
            data-slot='filter-chip-value'
          >
            <CalendarPreview
              {...calendarRest}
              formatValue={
                formatDate &&
                ((date, _scale, timeZone) =>
                  formatDate(
                    date instanceof Date ? date : parseISO(date.date),
                    timeZone
                  ))
              }
              disabled={inputProps.disabled}
              readOnly={inputProps.readOnly}
              value={dateValue}
              onValueChange={date => {
                handleFilterValueChange(date ?? '');
                if (date) setDateOpen(false);
              }}
              open={dateOpen}
              onOpenChange={setDateOpen}
            >
              <CalendarPreview.Trigger>
                <CalendarPreview.Input
                  trailingIcon={showCalendarIcon ? undefined : null}
                  {...inputProps}
                  classNames={{
                    ...inputClassNames,
                    container: cx(styles.dateField, inputClassNames?.container)
                  }}
                  errorMessages={{
                    unparseable: INVALID_DATE,
                    'out-of-bounds': INVALID_DATE,
                    unavailable: INVALID_DATE,
                    ...inputProps.errorMessages
                  }}
                  onValidityChange={validity => {
                    inputProps.onValidityChange?.(validity);
                    onErrorChange?.(
                      validity.valid ? undefined : validity.message
                    );
                  }}
                />
              </CalendarPreview.Trigger>
              <CalendarPreview.Content {...dateSlotProps?.popover}>
                <CalendarPreview.Days />
              </CalendarPreview.Content>
            </CalendarPreview>
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
