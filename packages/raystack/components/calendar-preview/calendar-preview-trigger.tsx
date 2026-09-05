import { mergeProps, Popover, useRender } from '@base-ui/react';
import { createChangeEventDetails } from '@base-ui/react/internals/createBaseUIEventDetails';
import { REASONS } from '@base-ui/react/internals/reasons';
import { cx } from 'class-variance-authority';
import { type ComponentProps, type FocusEvent, useRef } from 'react';
import styles from './calendar-preview.module.css';
import { useCalendarPreviewContext } from './calendar-preview-context';

export interface CalendarPreviewTriggerProps
  extends useRender.ComponentProps<'div'> {
  /** Shown when there is no value and no children. */
  placeholder?: string;
}

/**
 * Anchors the popover and owns opening it.
 *
 * Base UI has no focus-to-open option, so this is a handler — but it is the
 * only one, and it lives here rather than on `.Input`. Two guards keep it from
 * fighting Base UI, both verified against real browser input:
 *
 *  - during a pointer press, `useClick` is already going to open the popover,
 *    so opening here too produced open/close/open;
 *  - when focus arrives back from the popup, the popover has just been
 *    dismissed — reopening on that made Escape impossible to use.
 *
 * Neither guard touches dismissal, which stays entirely Base UI's.
 *
 * Renders a `div`, never a `button`: it wraps an `.Input` in the picker
 * composition, and a control inside a button is not focusable on its own.
 */
export function CalendarPreviewTrigger({
  placeholder = 'Select date',
  className,
  children,
  render,
  ref,
  ...props
}: CalendarPreviewTriggerProps) {
  const {
    value,
    formatValue,
    scale,
    setOpen,
    shouldIgnoreFocusOpen,
    disabled,
    readOnly
  } = useCalendarPreviewContext('CalendarPreview.Trigger');

  /* Tracks the pointer, not the open state: Base UI owns whether the popover
     is open, and this only says whether a press is mid-flight. */
  const pressing = useRef(false);

  /* One cast at the boundary: Base UI types its trigger for the `button` it
     renders by default, and this one is always a `div`. Consumer props stay
     last, inside the merge. */
  const triggerProps = {
    nativeButton: false,
    disabled,
    render: render ?? <div />,
    ref,
    ...mergeProps<'div'>(
      {
        className: cx(styles.trigger, className),
        'data-slot': 'calendar-preview-trigger',
        'data-scale': scale,
        onPointerDown: () => {
          pressing.current = true;
        },
        onPointerUp: () => {
          pressing.current = false;
        },
        onFocus: (event: FocusEvent<HTMLDivElement>) => {
          if (disabled || readOnly || pressing.current) return;
          if (shouldIgnoreFocusOpen()) return;
          setOpen(
            true,
            createChangeEventDetails(
              REASONS.triggerFocus,
              event.nativeEvent,
              event.currentTarget
            )
          );
        }
      } as useRender.ComponentProps<'div'>,
      props
    )
  } as ComponentProps<typeof Popover.Trigger>;

  return (
    <Popover.Trigger {...triggerProps}>
      {children ?? (value ? formatValue(value, scale) : placeholder)}
    </Popover.Trigger>
  );
}

CalendarPreviewTrigger.displayName = 'CalendarPreview.Trigger';
