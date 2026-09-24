import { mergeProps, Popover, useRender } from '@base-ui/react';
import { createChangeEventDetails } from '@base-ui/react/internals/createBaseUIEventDetails';
import { REASONS } from '@base-ui/react/internals/reasons';
import type { BaseUIEvent } from '@base-ui/react/types';
import { useMergedRefs } from '@base-ui/utils/useMergedRefs';
import { cx } from 'class-variance-authority';
import {
  type ComponentProps,
  createContext,
  type FocusEvent,
  type MouseEvent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import styles from './calendar-preview.module.css';
import { useCalendarPreviewContext } from './calendar-preview-context';
import { isRange } from './calendar-preview-root';

/* Per trigger, not per root: a childless trigger beside a `.Body` input is still a button. */
const TriggerInputContext = createContext<{
  registerInput: (mounted: boolean) => void;
} | null>(null);

export function useTriggerInput() {
  return useContext(TriggerInputContext);
}

export interface CalendarPreviewTriggerProps
  extends useRender.ComponentProps<'div'> {
  placeholder?: string;
  /** @defaultValue false */
  nativeButton?: boolean;
}

export function CalendarPreviewTrigger({
  placeholder = 'Select date',
  nativeButton = false,
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
    open,
    setOpen,
    shouldIgnoreFocusOpen,
    triggerRef,
    setTriggerHasInput,
    disabled,
    readOnly
  } = useCalendarPreviewContext('CalendarPreview.Trigger');

  const [inputCount, setInputCount] = useState(0);
  const hasInput = inputCount > 0;

  const registerInput = useCallback((mounted: boolean) => {
    setInputCount(current => current + (mounted ? 1 : -1));
  }, []);

  const inputContext = useMemo(() => ({ registerInput }), [registerInput]);

  useEffect(() => {
    setTriggerHasInput(hasInput);
    return () => setTriggerHasInput(false);
  }, [hasInput, setTriggerHasInput]);

  const pressing = useRef(false);

  /* A pointer released outside never reaches `onPointerUp`, and a stuck flag swallows focus. */
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

  /* Base UI types its trigger for the `button` it renders by default; this is a `div`. */
  const triggerProps = {
    nativeButton,
    disabled,
    render: render ?? <div />,
    ref: mergedRef,
    ...mergeProps<'div'>(
      {
        className: cx(styles.trigger, className),
        'data-slot': 'calendar-preview-trigger',
        /* Base UI adds no `tabIndex` to a rendered `div`, and around a field its role would nest a control in a button. */
        role: hasInput || nativeButton ? undefined : 'button',
        tabIndex: hasInput ? -1 : nativeButton ? undefined : 0,
        /* Only the closing half, or a press could not reopen a field that never lost focus. */
        onClick: (event: BaseUIEvent<MouseEvent<HTMLDivElement>>) => {
          if (hasInput && open) event.preventBaseUIHandler();
        },
        onPointerDown: () => {
          pressing.current = true;
        },
        onPointerUp: () => {
          pressing.current = false;
        },
        onFocus: (event: FocusEvent<HTMLDivElement>) => {
          if (disabled || readOnly) return;
          /* Consumed before the press guard, or it stays armed against the next focus. */
          const returning = shouldIgnoreFocusOpen();
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

  const label =
    value instanceof Date
      ? formatValue(value, scale)
      : isRange(value)
        ? `${formatValue(value.from, scale)} – ${formatValue(value.to, scale)}`
        : value
          ? formatValue(value, value.scale)
          : placeholder;

  return (
    <Popover.Trigger {...triggerProps}>
      <TriggerInputContext value={inputContext}>
        {children ?? label}
      </TriggerInputContext>
    </Popover.Trigger>
  );
}

CalendarPreviewTrigger.displayName = 'CalendarPreview.Trigger';
