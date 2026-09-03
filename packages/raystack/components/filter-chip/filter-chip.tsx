'use client';

import { cva, VariantProps } from 'class-variance-authority';
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
import type { CalendarPreviewBaseProps } from '../calendar-preview';
import { CalendarPreview } from '../calendar-preview';
import { toDateLoose } from '../calendar-preview/date-adapter';
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
 * Subset of `CalendarPreview`'s root props that consumers may forward to the
 * chip's built-in picker via `calendarProps`. `value`/`onValueChange`/
 * `defaultValue` are owned by `FilterChip`; `children` would replace the
 * composed trigger and break the chip layout; `selection` is fixed to single,
 * because the chip carries one value.
 *
 * Built from the base props rather than as `Omit<CalendarPreviewProps, …>`.
 * `CalendarPreviewProps` is a three-arm discriminated union and `Omit` does
 * not distribute over one: it collapses to the keys common to all three and
 * takes the discriminant with it. The old form happened to land close to this
 * set, but it was right by accident, and it dropped `lock` in silence. The
 * base interface holds exactly the selection-independent props, so this says
 * what it means and survives a fourth arm being added.
 */
export type FilterChipCalendarProps = Omit<
  CalendarPreviewBaseProps,
  | 'children'
  /*
   * The chip composes no `.Footer` and no `.Apply`, so `commit='explicit'`
   * buffered every edit for a button that does not exist — a valid date typed
   * and blurred produced zero value changes and the chip became permanently
   * uneditable. `open`/`defaultOpen`/`onOpenChange` and `loading` are the
   * chip's own to drive for the same reason: it owns this composition.
   */
  | 'commit'
  | 'open'
  | 'defaultOpen'
  | 'onOpenChange'
  | 'loading'
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
   * Props forwarded to the underlying `CalendarPreview` for
   * `columnType="date"`. `value`/`onValueChange`/`defaultValue` are owned by
   * `FilterChip` and excluded; `children` is excluded so the chip's composed
   * trigger isn't replaced.
   */
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
  // `??` not `||` — a falsy option value like `0` is a real selection.
  const [filterValue, setFilterValue] = useState<any>(value ?? '');

  const showOnRemove = typeof onRemove === 'function';
  const isMultiSelectColumn = columnType === FilterType.multiselect;

  /*
   * The date field's invalid state. `CalendarPreview` renders no error UI of
   * its own by design, reporting through `onValidityChange` so a surrounding
   * `Field` can present it — but this chip is not a `Field`, and wiring nothing
   * meant unparseable text simply sat there: no border, no `aria-invalid`, and
   * a filter that silently did not apply. That is what the old picker's
   * `updateError('Invalid date')` used to drive.
   */
  const [dateInvalid, setDateInvalid] = useState(false);

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
      case FilterType.date:
        return (
          <div
            className={styles.dateFieldWrapper}
            data-slot='filter-chip-value'
            data-error={dateInvalid || undefined}
          >
            {/*
             * Composed from parts rather than configured through `slotProps`.
             * The chip's own styling now hangs off its wrapper and reaches
             * `Input` through that component's public slots, so a
             * consumer-supplied class can no longer replace it.
             *
             * No `initialFocus={false}` here: `.Content` declines that focus
             * by itself once a typed field registers from inside `.Trigger`,
             * which is exactly this shape.
             */}
            <CalendarPreview
              {...calendarProps}
              value={toDateLoose(filterValue)}
              onValueChange={date => {
                setDateInvalid(false);
                /*
                 * `null` is not in `FilterChipValue`, and `handleFilterValueChange`
                 * is typed `any` so nothing caught it: clearing a date chip
                 * emitted `[null, 'eq']` and any consumer doing
                 * `value.getTime()` threw on first use. The old picker declined
                 * to emit it for exactly this reason; an empty date is an empty
                 * string here, as it is for every other column type.
                 */
                handleFilterValueChange(date ?? '');
              }}
              onValidityChange={validity => {
                setDateInvalid(!validity.valid);
                calendarProps?.onValidityChange?.(validity);
              }}
            >
              <CalendarPreview.Trigger className={styles.dateField}>
                {/* Preserves the chip's long-standing empty-state wording;
                    `.Input` otherwise falls back to showing the format. */}
                <CalendarPreview.Input
                  placeholder='Select date'
                  aria-invalid={dateInvalid || undefined}
                />
              </CalendarPreview.Trigger>
              <CalendarPreview.Content>
                <CalendarPreview.Nav />
                <CalendarPreview.Grid />
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
