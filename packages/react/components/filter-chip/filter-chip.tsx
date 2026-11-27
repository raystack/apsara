'use client';

import { useControlled } from '@base-ui/utils/useControlled';
import { TZDate } from '@date-fns/tz';
import { cva, cx, VariantProps } from 'class-variance-authority';
import { parseISO } from 'date-fns';
import {
  ComponentProps,
  ReactNode,
  useCallback,
  useEffect,
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
import { Select, type SelectContentProps } from '../select';
import {
  BaseSelectProps,
  type SelectChangeEventDetails
} from '../select/select-root';
import { Text } from '../text';
import styles from './filter-chip.module.css';
import { Operation } from './filter-chip-operation';

const chip = cva(styles.chip, {
  variants: {
    /** Visual style of the chip. */
    variant: {
      outline: styles['variant-outline'],
      text: null
    }
  },
  defaultVariants: {
    variant: 'outline'
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
  SelectChangeEventDetails['reason'] | 'none'
>;

/* The message `DatePicker` reports, so `onValidityChange` reads the same. */
const INVALID_DATE = 'Invalid date';

/* The empty option of a select carries this operator, which no list has. */
const EMPTY_OPERATION = 'empty';

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
  /** Formats the selected date for the input. The chip calls it with a `Date` and the `timeZone`. */
  formatValue?: (date: Date, timeZone?: string) => string;
  /** Props for the chip's date input and its popup. `input.disabled` and `input.readOnly` also apply to the calendar. */
  slotProps?: {
    input?: Omit<CalendarPreviewInputProps, 'field'>;
    popover?: Omit<CalendarPreviewContentProps, 'children'>;
  };
  /**
   * Shows the calendar icon in the date input.
   * @default false
   */
  showCalendarIcon?: boolean;
};

/** Props for the popups of the chip's dropdowns. */
export type FilterChipSlotProps = {
  /** Props for the popup of the operation dropdown. */
  operationContent?: SelectContentProps;
  /** Props for the popup of a `select` or `multiselect` chip. */
  valueContent?: SelectContentProps;
};

export type FilterChipOperations =
  | FilterOperator<string>[]
  | ((defaults: FilterOperator<string>[]) => FilterOperator<string>[]);

export interface FilterChipProps
  extends Omit<ComponentProps<'div'>, 'defaultValue'>,
    VariantProps<typeof chip> {
  /** Label of the filter. It also names the chip and its remove button for screen readers. */
  label: string;
  /**
   * The value (controlled). `multiselect` takes an array. `date` takes a
   * `Date`, or a string or epoch number that the chip parses. `number` shows a
   * value that is not a number as empty.
   */
  value?: FilterChipValue;
  /**
   * The value on the first render (uncontrolled). Takes the same types as `value`.
   * @default ""
   */
  defaultValue?: FilterChipValue;
  /**
   * Active operation, by its `value`. A value the list does not have shows as
   * the first entry. The chip reports that fallback through
   * `onOperationChange` only when `operations` is set.
   * @default the first entry of `operations`
   */
  operation?: string;
  /**
   * Operation to start on, by its `value`, when `operation` is not set.
   * @default the first entry of `operations`
   */
  defaultOperation?: string;
  /** Called when the remove button is clicked. The chip shows the button only when this is set. */
  onRemove?: () => void;
  /**
   * Input type of the chip's value control.
   * @default "string"
   */
  columnType?: FilterTypes;
  /** Options of a `select` or `multiselect` chip. */
  options?: FilterSelectOption[];
  /**
   * Called when the value changes, with the active operation in
   * `details.operation`. A `select` or `multiselect` chip reports the option's
   * `value` with its type kept. A `number` chip reports a `number`, reports
   * `""`, `"-"`, `"."`, and `"-."` as typed, and ignores other text.
   */
  onValueChange?: (
    value: FilterChipValue,
    details: FilterChipChangeDetails
  ) => void;
  /** Called when the operation changes. */
  onOperationChange?: (
    operation: string,
    details: FilterChipOperationChangeDetails
  ) => void;
  /** Icon shown before the label. */
  leadingIcon?: ReactNode;
  /**
   * Operations the chip offers. An array replaces the operations of the
   * `columnType`, a function receives them and returns the list to use. An
   * empty result falls back to the operations of the `columnType`.
   * Without it the chip keeps whatever `operation` carries.
   * @default the operations of the `columnType`
   */
  operations?: FilterChipOperations;
  /** Props for the `Select` of a `select` or `multiselect` chip. */
  selectProps?: BaseSelectProps;
  /** Props forwarded to the `CalendarPreview` for `columnType="date"`. */
  calendarProps?: FilterChipCalendarProps;
  /** Props for the popups of the operation and value dropdowns, for example a `className` that sets the width. */
  slotProps?: FilterChipSlotProps;
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
  slotProps,
  ...props
}: FilterChipProps) => {
  const computedOperations = useMemo(() => {
    const defaults: FilterOperator<string>[] = filterOperators[columnType];
    if (!operations) return defaults;
    /* Copies, so a resolver that relabels a default leaves `filterOperators`
       alone. */
    const resolved =
      typeof operations === 'function'
        ? operations(defaults.map(operation => ({ ...operation })))
        : operations;
    return resolved.length ? resolved : defaults;
  }, [columnType, operations]);

  /* Read once. A `default` that changes warns, and `operations` can change. */
  const [initialOperation] = useState(
    () => defaultOperation ?? computedOperations?.[0]?.value
  );
  const [operationValue, setOperationValue] = useControlled<string | undefined>(
    {
      controlled: operationProp,
      default: initialOperation,
      name: 'FilterChip',
      state: 'operation'
    }
  );
  /* The list can change while the chip is mounted, and a caller can name an
     operation the list does not have. Such a selection would be shown with the
     wrong label and sent with every edit. */
  const operation =
    computedOperations?.find(o => o.value === operationValue) ??
    computedOperations?.[0];

  /* Only a caller that sets `operations` asks for its list to be enforced. A
     column that sets none keeps the operator its query carries. */
  const keepsOperation =
    operations === undefined || operationValue === EMPTY_OPERATION;

  useEffect(() => {
    if (keepsOperation || !operation || operation.value === operationValue)
      return;
    setOperationValue(operation.value);
    onOperationChange?.(operation.value, createChangeDetails('none'));
  }, [
    keepsOperation,
    operation,
    operationValue,
    onOperationChange,
    setOperationValue
  ]);

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
  /* `Select` virtualizes only with `autocomplete`, and renders the rows from `items`. */
  const isVirtualized = !!(
    selectProps?.autocomplete && selectProps.virtualized
  );
  const selectItems = useMemo(
    () =>
      isVirtualized
        ? options.map(o => ({ value: String(o.value), label: o.label }))
        : undefined,
    [isVirtualized, options]
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
          operation: operation?.value ?? ''
        })
      );
      setFilterValue(value);
    },
    [operation, onValueChange, setFilterValue]
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
            items={selectItems}
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
            <Select.Content {...slotProps?.valueContent} data-variant='filter'>
              {!isVirtualized &&
                options.map(opt => (
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
              variant={variant === 'text' ? 'text' : 'outline'}
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
        contentProps={slotProps?.operationContent}
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
