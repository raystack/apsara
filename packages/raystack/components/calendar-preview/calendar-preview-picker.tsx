import { mergeProps, useRender } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import styles from './calendar-preview.module.css';
import { useCalendarPreviewContext } from './calendar-preview-context';
import { CalendarPreviewInput } from './calendar-preview-input';
import { CalendarPreviewLabel } from './calendar-preview-label';
import { CalendarPreviewPanel } from './calendar-preview-panel';
import { CalendarPreviewScales } from './calendar-preview-scales';
import { CalendarPreviewSeparator } from './calendar-preview-separator';

export type CalendarPreviewPickerProps = useRender.ComponentProps<'div'>;

/**
 * The popup body: label, input, scale switcher and the view for the active
 * scale. The input sits above the switcher, which is where the frames put it.
 */
export function CalendarPreviewPicker({
  className,
  children,
  render,
  ref,
  ...props
}: CalendarPreviewPickerProps) {
  const { scale, dropDraft } = useCalendarPreviewContext(
    'CalendarPreview.Picker'
  );

  return useRender({
    defaultTagName: 'div',
    ref,
    render,
    props: mergeProps<'div'>(
      {
        className: cx(styles.picker, className),
        'data-slot': 'calendar-preview-picker',
        'data-scale': scale,
        /* Escape drops the draft on its way to Base UI, which closes on it. */
        onKeyDown: (event: React.KeyboardEvent) => {
          if (event.key === 'Escape') dropDraft();
        },
        children: children ?? (
          <>
            <CalendarPreviewLabel />
            <CalendarPreviewInput />
            <CalendarPreviewScales />
            <CalendarPreviewSeparator />
            <CalendarPreviewPanel />
          </>
        )
      } as useRender.ComponentProps<'div'>,
      props
    )
  });
}

CalendarPreviewPicker.displayName = 'CalendarPreview.Picker';
