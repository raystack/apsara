'use client';

import { cx } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import {
  type DateRange,
  type DayButtonProps,
  DayPicker,
  type DayPickerProps,
  type Matcher
} from 'react-day-picker';
import styles from './calendar-preview.module.css';
import type { DateRangeValue } from './calendar-preview-context';
import { useCalendarPreviewContext } from './calendar-preview-context';

/**
 * Everything react-day-picker owns is derived from root context and is
 * deliberately absent from this interface: `mode`, `selected`, `onSelect`,
 * `required`, `month`, `onMonthChange`, and `timeZone` cannot be passed here
 * at all. That is what makes spreading `...props` last honest — nothing is
 * force-overridden after the consumer's spread.
 */
export interface CalendarPreviewGridProps
  extends Pick<
    DayPickerProps,
    'showWeekNumber' | 'modifiers' | 'modifiersClassNames' | 'classNames'
  > {
  /** @defaultValue 1 */
  months?: 1 | 2;
  /** @defaultValue false */
  showOutsideDays?: boolean;
  className?: string;
}

export function CalendarPreviewGrid({
  months = 1,
  showOutsideDays = false,
  className,
  classNames,
  ...props
}: CalendarPreviewGridProps) {
  const {
    selection,
    value,
    setValue,
    month,
    setMonth,
    minDate,
    maxDate,
    isDateUnavailable,
    timeZone,
    weekStartsOn,
    disabled
  } = useCalendarPreviewContext('Grid');

  const disabledMatchers: Matcher[] = [];
  if (minDate) disabledMatchers.push({ before: minDate });
  if (maxDate) disabledMatchers.push({ after: maxDate });
  if (isDateUnavailable) disabledMatchers.push(isDateUnavailable);

  /*
   * Everything except the mode discriminator. `...props` sits last inside it,
   * so it stays last at every call site below — and because `mode`,
   * `selected`, and `onSelect` are not in `CalendarPreviewGridProps`, putting
   * them ahead of the spread overrides nothing a consumer could have passed.
   */
  const shared = {
    month,
    onMonthChange: setMonth,
    timeZone,
    weekStartsOn,
    numberOfMonths: months,
    showOutsideDays,
    disabled: (disabled ? true : disabledMatchers) satisfies
      | Matcher
      | Matcher[],
    // `.Nav` is ours: RDP renders no navigation and never mounts a `Select`.
    hideNavigation: true,
    captionLayout: 'label' as const,
    components: {
      DayButton: ({
        day: _day,
        modifiers: _modifiers,
        ...buttonProps
      }: DayButtonProps) => (
        <button
          type='button'
          {...buttonProps}
          className={cx(buttonProps.className, styles.dayButton)}
          data-slot='calendar-preview-day'
        >
          <span
            className={styles.dayNumber}
            data-slot='calendar-preview-day-number'
          >
            {buttonProps.children}
          </span>
        </button>
      ),
      MonthGrid: (gridProps: ComponentProps<'table'>) => (
        <div className={styles.weeks} data-slot='calendar-preview-weeks'>
          <table {...gridProps} data-slot='calendar-preview-table' />
        </div>
      )
    },
    classNames: {
      months: styles.months,
      month_caption: styles.monthCaption,
      caption_label: styles.captionLabel,
      week: styles.week,
      weekdays: styles.week,
      weekday: styles.weekday,
      day: styles.day,
      today: styles.today,
      outside: styles.outside,
      disabled: styles.disabled,
      selected: styles.selected,
      day_button: styles.dayButton,
      range_start: styles.rangeStart,
      range_middle: styles.rangeMiddle,
      range_end: styles.rangeEnd,
      hidden: styles.hidden,
      ...classNames
    },
    className: cx(styles.grid, className),
    ...props
  };

  /*
   * Three call sites rather than one assembled object: `mode` discriminates
   * react-day-picker's prop union, so a single spread would need a cast. This
   * keeps the boundary fully type-checked — and the union still never reaches
   * a consumer, because it stops here.
   */
  if (selection === 'range') {
    const range = value as DateRangeValue | null;
    return (
      <DayPicker
        mode='range'
        selected={
          range
            ? { from: range.from ?? undefined, to: range.to ?? undefined }
            : undefined
        }
        onSelect={(next: DateRange | undefined) =>
          setValue(
            next ? { from: next.from ?? null, to: next.to ?? null } : null
          )
        }
        data-slot='calendar-preview-grid'
        {...shared}
      />
    );
  }

  if (selection === 'multiple') {
    return (
      <DayPicker
        mode='multiple'
        selected={(value as Date[]) ?? []}
        onSelect={(next: Date[] | undefined) => setValue(next ?? [])}
        data-slot='calendar-preview-grid'
        {...shared}
      />
    );
  }

  return (
    <DayPicker
      mode='single'
      selected={(value as Date | null) ?? undefined}
      onSelect={(next: Date | undefined) => setValue(next ?? null)}
      data-slot='calendar-preview-grid'
      {...shared}
    />
  );
}

CalendarPreviewGrid.displayName = 'CalendarPreview.Grid';
