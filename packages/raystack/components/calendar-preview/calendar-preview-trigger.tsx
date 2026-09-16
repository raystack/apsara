import { mergeProps, Popover, useRender } from '@base-ui/react';
import { createChangeEventDetails } from '@base-ui/react/internals/createBaseUIEventDetails';
import { REASONS } from '@base-ui/react/internals/reasons';
import type { BaseUIEvent } from '@base-ui/react/types';
import { useMergedRefs } from '@base-ui/utils/useMergedRefs';
import { cx } from 'class-variance-authority';
import {
  type ComponentProps,
  type FocusEvent,
  type MouseEvent,
  useEffect,
  useRef
} from 'react';
import styles from './calendar-preview.module.css';
import { useCalendarPreviewContext } from './calendar-preview-context';
import { type CalendarPreviewValue, isRange } from './calendar-preview-root';

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
    triggerRef,
    hasInput,
    disabled,
    readOnly
  } = useCalendarPreviewContext<CalendarPreviewValue>(
    'CalendarPreview.Trigger'
  );

  /* Tracks the pointer, not the open state: Base UI owns whether the popover
     is open, and this only says whether a press is mid-flight. */
  const pressing = useRef(false);

  /* A pointer released outside the trigger never reaches `onPointerUp` here,
     and a flag left set swallows every focus that follows. */
  useEffect(() => {
    const release = () => {
      pressing.current = false;
    };
    window.addEventListener('pointerup', release);
    window.addEventListener('pointercancel', release);
    return () => {
      window.removeEventListener('pointerup', release);
      window.removeEventListener('pointercancel', release);
    };
  }, []);

  const mergedRef = useMergedRefs(triggerRef, ref);

  /* One cast at the boundary: Base UI types its trigger for the `button` it
     renders by default, and this one is always a `div`. Consumer props stay
     last, inside the merge. */
  const triggerProps = {
    nativeButton: false,
    disabled,
    render: render ?? <div />,
    ref: mergedRef,
    ...mergeProps<'div'>(
      {
        className: cx(styles.trigger, className),
        'data-slot': 'calendar-preview-trigger',
        'data-scale': scale,
        /* Base UI gives a non-native trigger both, which around a field is a
           second tab stop and a control inside a button role. */
        role: hasInput ? undefined : 'button',
        tabIndex: hasInput ? -1 : undefined,
        /* Merged to the right of `useClick`, so this runs first and takes out
           the press-toggle that closed the popover between two fields. */
        onClick: (event: BaseUIEvent<MouseEvent<HTMLDivElement>>) => {
          if (hasInput) event.preventBaseUIHandler();
        },
        onPointerDown: () => {
          pressing.current = true;
        },
        onPointerUp: () => {
          pressing.current = false;
        },
        onFocus: (event: FocusEvent<HTMLDivElement>) => {
          if (disabled || readOnly) return;
          /* Consumed before the press guard: a press that returns early
             without taking it leaves it armed against the next focus. */
          const returning = shouldIgnoreFocusOpen();
          /* With the toggle gone there is nothing to race, and the guard
             would swallow the focus a press delivers before `pointerup` —
             leaving nothing to open the popover at all. */
          if (returning || (!hasInput && pressing.current)) return;
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

  /* A period reads back at its own scale, not the view's. */
  const label =
    value instanceof Date
      ? formatValue(value, scale)
      : isRange(value)
        ? `${formatValue(value.from, scale)} – ${formatValue(value.to, scale)}`
        : value
          ? formatValue(value, value.scale)
          : placeholder;

  return (
    <Popover.Trigger {...triggerProps}>{children ?? label}</Popover.Trigger>
  );
}

CalendarPreviewTrigger.displayName = 'CalendarPreview.Trigger';
