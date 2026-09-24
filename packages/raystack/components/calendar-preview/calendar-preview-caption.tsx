'use client';

import {
  mergeProps,
  Popover as PopoverPrimitive,
  useRender
} from '@base-ui/react';
import { cx } from 'class-variance-authority';
import { type ReactNode, useEffect, useRef } from 'react';
import styles from './calendar-preview.module.css';
import {
  useCalendarPreviewContext,
  useCalendarPreviewDaysContext
} from './calendar-preview-context';
import {
  formatCaptionLabel,
  monthShortNames,
  monthStart,
  shiftMonths
} from './date-adapter';

/* Two elements, so two prop shapes: a plain caption is a `span`, one that
   opens the scroller is a `button`. */
export type CalendarPreviewCaptionProps =
  | ({ dropdown?: false } & useRender.ComponentProps<'span'>)
  | ({ dropdown: true } & useRender.ComponentProps<'button'>);

/**
 * The label above the grid. Children replace it entirely, so
 * `<CalendarPreview.Caption>Q3 2026</CalendarPreview.Caption>` works.
 *
 * With `dropdown` it opens our own month and year scroller. No `Select` may be
 * mounted here — one is what makes the popover dismissal loop return. Picking
 * moves the view; it never selects a value.
 */
export function CalendarPreviewCaption(props: CalendarPreviewCaptionProps) {
  return props.dropdown ? (
    <CaptionDropdown {...props} />
  ) : (
    <CaptionLabel {...props} />
  );
}

CalendarPreviewCaption.displayName = 'CalendarPreview.Caption';

function useCaptionLabel(): ReactNode {
  const { month, timeZone } = useCalendarPreviewContext(
    'CalendarPreview.Caption'
  );
  const days = useCalendarPreviewDaysContext();
  const count = days?.numberOfMonths ?? 1;
  if (count <= 1) return formatCaptionLabel(month, timeZone);
  const last = shiftMonths(month, count - 1);
  return `${formatCaptionLabel(month, timeZone)} – ${formatCaptionLabel(last, timeZone)}`;
}

function CaptionLabel({
  dropdown: _dropdown,
  className,
  children,
  render,
  ref,
  ...props
}: { dropdown?: false } & useRender.ComponentProps<'span'>) {
  const { scale } = useCalendarPreviewContext('CalendarPreview.Caption');
  const label = useCaptionLabel();

  return useRender({
    defaultTagName: 'span',
    ref,
    render,
    props: mergeProps<'span'>(
      {
        className: cx(styles.caption, className),
        'data-slot': 'calendar-preview-caption',
        'data-scale': scale,
        children: children ?? label
      } as useRender.ComponentProps<'span'>,
      props
    )
  });
}

function CaptionDropdown({
  dropdown: _dropdown,
  className,
  children,
  render,
  ref,
  ...props
}: { dropdown: true } & useRender.ComponentProps<'button'>) {
  const { month, setMonth, yearRange, scale, disabled } =
    useCalendarPreviewContext('CalendarPreview.Caption');
  const label = useCaptionLabel();

  const activeMonth = month.getMonth();
  const activeYear = month.getFullYear();
  const years: number[] = [];
  for (let year = yearRange.from; year <= yearRange.to; year += 1) {
    years.push(year);
  }

  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger
        className={cx(styles.caption, styles['caption-trigger'], className)}
        data-slot='calendar-preview-caption'
        data-scale={scale}
        data-dropdown='true'
        disabled={disabled}
        render={render}
        ref={ref}
        {...props}
      >
        {children ?? label}
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Positioner
          sideOffset={4}
          align='start'
          className={styles['caption-positioner']}
          data-slot='calendar-preview-caption-positioner'
        >
          <PopoverPrimitive.Popup
            className={styles['caption-popup']}
            data-slot='calendar-preview-caption-popup'
          >
            <CaptionColumn
              slot='calendar-preview-caption-months'
              optionSlot='calendar-preview-caption-month'
              label='Month'
              options={monthShortNames().map((name, index) => ({
                key: name,
                text: name,
                active: index === activeMonth,
                onSelect: () => setMonth(monthStart(activeYear, index))
              }))}
            />
            <CaptionColumn
              slot='calendar-preview-caption-years'
              optionSlot='calendar-preview-caption-year'
              label='Year'
              options={years.map(year => ({
                key: String(year),
                text: String(year),
                active: year === activeYear,
                onSelect: () => setMonth(monthStart(year, activeMonth))
              }))}
            />
          </PopoverPrimitive.Popup>
        </PopoverPrimitive.Positioner>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}

interface CaptionOption {
  key: string;
  text: string;
  active: boolean;
  onSelect: () => void;
}

function CaptionColumn({
  slot,
  optionSlot,
  label,
  options
}: {
  slot: string;
  optionSlot: string;
  label: string;
  options: CaptionOption[];
}) {
  const activeRef = useRef<HTMLButtonElement>(null);

  /* A twenty-year column otherwise opens scrolled to the wrong end. Optional
     call: jsdom does not implement scrollIntoView. */
  useEffect(() => {
    activeRef.current?.scrollIntoView?.({ block: 'center' });
  }, []);

  return (
    <div
      className={styles['caption-column']}
      data-slot={slot}
      role='group'
      aria-label={label}
    >
      {options.map(option => (
        <button
          key={option.key}
          type='button'
          ref={option.active ? activeRef : undefined}
          className={styles['caption-option']}
          data-slot={optionSlot}
          data-active={option.active || undefined}
          aria-current={option.active || undefined}
          onClick={option.onSelect}
        >
          {option.text}
        </button>
      ))}
    </div>
  );
}
