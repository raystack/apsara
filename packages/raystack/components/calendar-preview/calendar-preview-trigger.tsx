'use client';

import { Popover as PopoverPrimitive } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import styles from './calendar-preview.module.css';
import {
  CalendarPreviewTriggerScope,
  useCalendarPreviewContext
} from './calendar-preview-context';

export interface CalendarPreviewTriggerProps
  extends PopoverPrimitive.Trigger.Props {}

/**
 * Anchors the popover. Renders a `div`, not a `<button>` — the trigger wraps
 * the typed input, and a button may not contain one.
 *
 * Opening is Base UI's job. Nothing here calls `setOpen` from a focus handler,
 * which is the race that cost the old family three suppression branches.
 *
 * When a typed field registers itself from inside this subtree the trigger
 * drops its button semantics. `role="button"` around a textbox makes the
 * field's own role presentational in ARIA, so assistive tech may never announce
 * it as editable at all, and the tab stop it adds sits immediately before the
 * input doing nothing a keyboard user wants. With a plain button trigger — a
 * calendar icon, a label — the semantics are correct and are kept.
 */
export function CalendarPreviewTrigger({
  className,
  render = <div />,
  nativeButton = false,
  disabled,
  onClick,
  ...props
}: CalendarPreviewTriggerProps) {
  const {
    disabled: rootDisabled,
    open,
    triggerOwnsFocus
  } = useCalendarPreviewContext('Trigger');
  const isDisabled = disabled ?? rootDisabled;

  /*
   * Spread as one object rather than written as `role={undefined}`: an
   * explicit `undefined` is still an own key, and Base UI's merge would take
   * it as an instruction to erase the role even for a plain button trigger.
   */
  const fieldOverrides = triggerOwnsFocus
    ? ({ role: undefined, tabIndex: -1 } as const)
    : {};

  return (
    <CalendarPreviewTriggerScope value={true}>
      <PopoverPrimitive.Trigger
        className={cx(styles.trigger, className)}
        render={render}
        disabled={isDisabled}
        data-disabled={isDisabled || undefined}
        // Tells Base UI to supply button semantics itself rather than assume a
        // native <button>, which this part deliberately never renders.
        nativeButton={nativeButton}
        onClick={event => {
          // Chained, not replaced: a consumer handler runs first and may stop
          // the rest with `preventBaseUIHandler`, as Base UI's own do.
          onClick?.(event);
          if (event.baseUIHandlerPrevented) return;
          /*
           * Base UI's click trigger toggles, and the field lives inside it, so
           * clicking the text to reposition the caret — an ordinary thing to do
           * while editing a date — closed the calendar. Opening still works;
           * only the close half is suppressed, and only from inside a field.
           */
          if (!triggerOwnsFocus || !open) return;
          const target = event.target as HTMLElement | null;
          if (
            target?.closest('input, textarea, [contenteditable="true"]') != null
          ) {
            event.preventBaseUIHandler();
          }
        }}
        data-slot='calendar-preview-trigger'
        {...fieldOverrides}
        {...props}
      />
    </CalendarPreviewTriggerScope>
  );
}

CalendarPreviewTrigger.displayName = 'CalendarPreview.Trigger';
