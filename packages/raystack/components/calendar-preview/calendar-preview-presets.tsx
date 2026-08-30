'use client';

import { mergeProps, useRender } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import type { ComponentProps, ReactElement } from 'react';
import styles from './calendar-preview.module.css';
import type { CalendarValue, DateRangeValue } from './calendar-preview-context';
import {
  isSameValue,
  useCalendarPreviewContext
} from './calendar-preview-context';

export interface CalendarPreviewPresetsProps extends ComponentProps<'div'> {
  /**
   * A column beside the grid, or a row above it.
   * @defaultValue 'vertical'
   */
  orientation?: 'vertical' | 'horizontal';
}

/** Holds `.Preset` buttons. Renders nothing of its own beyond the layout. */
export function CalendarPreviewPresets({
  className,
  orientation = 'vertical',
  ...props
}: CalendarPreviewPresetsProps) {
  return (
    <div
      className={cx(styles.presets, className)}
      data-orientation={orientation}
      data-slot='calendar-preview-presets'
      {...props}
    />
  );
}

CalendarPreviewPresets.displayName = 'CalendarPreview.Presets';

export interface CalendarPreviewPresetProps
  extends Omit<ComponentProps<'button'>, 'value'> {
  /** The value this preset applies. Use for `single` and `multiple`. */
  value?: Date | Date[] | null;
  /** The range this preset applies. Use for `selection="range"`. */
  range?: DateRangeValue;
  /** Render as another element — an Apsara `Button`, say. */
  render?: ReactElement;
}

/**
 * One preset. Writes straight into root state, so it needs no callback of its
 * own, and marks itself pressed while the current value matches it.
 *
 * It deliberately does not close the popover. Under `commit='explicit'` that
 * would discard the very edit it just made, and for a range you want to see
 * what was applied — compose `.Apply` or handle `onValueChange` to close.
 */
export function CalendarPreviewPreset({
  className,
  value,
  range,
  render = <button type='button' />,
  ...props
}: CalendarPreviewPresetProps) {
  const {
    selection,
    value: current,
    setValue,
    setMonth,
    granularity,
    disabled,
    readOnly
  } = useCalendarPreviewContext('Preset');

  const presetValue: CalendarValue =
    range !== undefined ? range : (value ?? null);

  const isActive = isSameValue(current as CalendarValue, presetValue);
  const isDisabled = disabled || readOnly;

  /*
   * A mismatched prop writes a shape the root cannot use, so it fails at
   * render rather than on click — the stack then points at the preset instead
   * of at whatever the bad value later broke.
   */
  const shapeError =
    selection === 'range' && range === undefined
      ? 'CalendarPreview.Preset needs `range` when selection="range"'
      : selection !== 'range' && range !== undefined
        ? 'CalendarPreview.Preset `range` requires selection="range" — use `value`'
        : null;

  const apply = () => {
    if (isDisabled) return;
    setValue(presetValue, { granularity });
    // Bring the applied period into view, as typing does.
    const anchor =
      presetValue instanceof Date
        ? presetValue
        : Array.isArray(presetValue)
          ? presetValue[0]
          : (presetValue?.from ?? presetValue?.to);
    if (anchor) setMonth(anchor);
  };

  const rendered = useRender({
    defaultTagName: 'button',
    render,
    props: mergeProps<'button'>(
      {
        className: cx(styles.preset, className),
        'data-slot': 'calendar-preview-preset',
        'data-selected': isActive || undefined,
        'aria-pressed': isActive,
        disabled: isDisabled,
        onClick: apply
      } as useRender.ComponentProps<'button'>,
      props
    )
  });

  // Thrown after every hook has run, so the hook order stays stable.
  if (shapeError) throw new Error(shapeError);

  return rendered;
}

CalendarPreviewPreset.displayName = 'CalendarPreview.Preset';
