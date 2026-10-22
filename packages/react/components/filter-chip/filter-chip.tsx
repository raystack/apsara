'use client';

import { useControlled } from '@base-ui/utils/useControlled';
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
  type CalendarPreviewChangeReason,
  type CalendarPreviewContentProps,
  type CalendarPreviewInputProps,
  type CalendarPreviewProps
} from '~/components/calendar-preview';
import { XIcon } from '~/icons';
import {
  type ChangeDetails,
  createChangeDetails
} from '~/shared/change-details';
import { toInstant } from '~/shared/date-filters';
import {
  FilterOperation,
  FilterOperator,
  FilterSelectOption,
  FilterType,
  FilterTypes,
  FilterValueType,
  filterOperators
} from '~/types/filters';
import { Flex } from '../flex';
import { Input } from '../input';
import { Select } from '../select';
import {
  BaseSelectProps,
  type SelectChangeEventDetails
} from '../select/select-root';
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

export type FilterChipValue = FilterValueType | FilterValueType[] | Date;

export type FilterChipChangeReason =
  | SelectChangeEventDetails['reason']
  | CalendarPreviewChangeReason
  | 'none';

export type FilterChipChangeDetails = ChangeDetails<
  FilterChipChangeReason,
  { operation: string }
>;

export type FilterChipOperationChangeDetails = ChangeDetails<
  SelectChangeEventDetails['reason']
>;

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

/* A `number` column reports the text as is while it has no digits (`-`, `.`). */
const toNumberValue = (text: string): FilterChipValue => {
  const parsed = Number(text);
  return text === '' || Number.isNaN(parsed) ? text : parsed;
};

/* Shows a number without an exponent (`1e-7`). A value that is not a number shows as empty. */
const toNumberText = (value: FilterChipValue): string => {
  const text =
    typeof value === 'number'
      ? value.toLocaleString('en-US', {
          useGrouping: false,
          maximumFractionDigits: 20
        })
      : String(value);
  return PARTIAL_NUMBER.test(text) ? text : '';
};

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
  extends Omit<ComponentProps<'div'>, 'defaultValue'>,
    VariantProps<typeof chip> {
  label: string;
  value?: FilterChipValue;
  defaultValue?: FilterChipValue;
  operation?: string;
  defaultOperation?: string;
  onRemove?: () => void;
  columnType?: FilterTypes;
  options?: FilterSelectOption[];
  onValueChange?: (
    value: FilterChipValue,
    details: FilterChipChangeDetails
  ) => void;
  onOperationChange?: (
    operation: string,
    details: FilterChipOperationChangeDetails
  ) => void;
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
  defaultValue,
  operation: operationProp,
  defaultOperation,
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

  const [operationValue, setOperationValue] = useControlled<string | undefined>(
    {
      controlled: operationProp,
      default: defaultOperation ?? computedOperations?.[0]?.value,
      name: 'FilterChip',
      state: 'operation'
    }
  );
  const operation = computedOperations?.find(o => o.value === operationValue);
  const isNumberColumn = columnType === FilterType.number;
  // `??` not `||`, since a falsy option value like `0` is a real selection.
  const [filterValue, setFilterValue] = useControlled<FilterChipValue>({
    controlled: value,
    default: defaultValue ?? '',
    name: 'FilterChip',
    state: 'value'
  });
  // The typed text keeps `1.` and `-` editable. It shows while it matches the value.
  const [numberText, setNumberText] = useState(() => toNumberText(filterValue));
  const shownNumberText = Object.is(toNumberValue(numberText), filterValue)
    ? numberText
    : toNumberText(filterValue);

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
  const selectedValues = useMemo(
    () => (Array.isArray(filterValue) ? filterValue.map(String) : []),
    [filterValue]
  );

  const handleOperationChange = useCallback(
    (next: FilterOperation, eventDetails: SelectChangeEventDetails) => {
      if (next.value) {
        onOperationChange?.(
          next.value,
          createChangeDetails(eventDetails.reason, eventDetails.event)
        );
      }
      setOperationValue(next.value);
    },
    [onOperationChange, setOperationValue]
  );

  const handleFilterValueChange = useCallback(
    (value: FilterChipValue, reason: FilterChipChangeReason, event?: Event) => {
      onValueChange?.(
        value,
        createChangeDetails(reason, event, {
          operation: operationValue ?? ''
        })
      );
      setFilterValue(value);
    },
    [operationValue, onValueChange, setFilterValue]
  );

  // Select works on strings, so map each pick back to its option's value.
  const handleSelectValueChange = useCallback(
    (picked: string | string[], eventDetails: SelectChangeEventDetails) => {
      const toOption = (v: string) =>
        options.find(o => String(o.value) === v)?.value ?? v;
      handleFilterValueChange(
        Array.isArray(picked) ? picked.map(toOption) : toOption(picked),
        eventDetails.reason,
        eventDetails.event
      );
    },
    [options, handleFilterValueChange]
  );

  const handleTextInputChange = useCallback(
    (raw: string, event: Event) => {
      if (!isNumberColumn) {
        handleFilterValueChange(raw, 'none', event);
        return;
      }
      // Skipping the state update makes React restore the shown text.
      if (!PARTIAL_NUMBER.test(raw)) return;
      const parsed = Number(raw);
      if (parsed === Infinity || parsed === -Infinity) return;

      setNumberText(raw);
      handleFilterValueChange(toNumberValue(raw), 'none', event);
    },
    [isNumberColumn, handleFilterValueChange]
  );

  const renderValueInput = () => {
    switch (columnType) {
      case FilterType.multiselect:
      case FilterType.select:
        return (
          <Select
            {...(isMultiSelectColumn
              ? { multiple: true, value: selectedValues }
              : { multiple: false, value: filterValue.toString() })}
            onValueChange={handleSelectValueChange}
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
                {isMultiSelectColumn && selectedValues.length > 1
                  ? `${selectedValues.length} selected`
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
              onValueChange={(date, details) => {
                handleFilterValueChange(date ?? '', details.reason);
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
              value={isNumberColumn ? shownNumberText : filterValue.toString()}
              onChange={e =>
                handleTextInputChange(e.target.value, e.nativeEvent)
              }
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
        showAlternateLabel={isMultiSelectColumn && selectedValues.length <= 1}
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
