import { mergeProps, useRender } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import styles from './calendar-preview.module.css';
import { useCalendarPreviewContext } from './calendar-preview-context';
import { CalendarPreviewInput } from './calendar-preview-input';
import { CalendarPreviewLabel } from './calendar-preview-label';
import { CalendarPreviewPanel } from './calendar-preview-panel';
import { CalendarPreviewReset } from './calendar-preview-reset';
import { CalendarPreviewScales } from './calendar-preview-scales';
import { CalendarPreviewSeparator } from './calendar-preview-separator';

export type CalendarPreviewBodyProps = useRender.ComponentProps<'div'>;

export function CalendarPreviewBody({
  className,
  children,
  render,
  ref,
  ...props
}: CalendarPreviewBodyProps) {
  const { scale, dropDraft } = useCalendarPreviewContext(
    'CalendarPreview.Body'
  );

  return useRender({
    defaultTagName: 'div',
    ref,
    render,
    props: mergeProps<'div'>(
      {
        className: cx(styles.body, className),
        'data-slot': 'calendar-preview-body',
        /* Escape drops the draft on its way to Base UI, which closes on it. */
        onKeyDown: (event: React.KeyboardEvent) => {
          if (event.key === 'Escape') dropDraft();
        },
        children: children ?? (
          <>
            <CalendarPreviewLabel />
            <CalendarPreviewInput />
            <CalendarPreviewScales />
            {/* `.Reset` rides in `.Header`, which only the day view mounts, so
                a period scale would otherwise have no way back to the default. */}
            {scale !== 'day' && <CalendarPreviewReset />}
            <CalendarPreviewSeparator />
            <CalendarPreviewPanel />
          </>
        )
      } as useRender.ComponentProps<'div'>,
      props
    )
  });
}

CalendarPreviewBody.displayName = 'CalendarPreview.Body';
