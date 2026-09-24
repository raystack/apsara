import { mergeProps, useRender } from '@base-ui/react';
import { cx } from 'class-variance-authority';
import type { ReactNode } from 'react';
import styles from './calendar-preview.module.css';
import { useCalendarPreviewContext } from './calendar-preview-context';
import { CalendarPreviewInput } from './calendar-preview-input';
import { CalendarPreviewLabel } from './calendar-preview-label';
import { CalendarPreviewPanel } from './calendar-preview-panel';
import { CalendarPreviewReset } from './calendar-preview-reset';
import { CalendarPreviewScales } from './calendar-preview-scales';
import { CalendarPreviewSeparator } from './calendar-preview-separator';

export interface CalendarPreviewBodyProps
  extends useRender.ComponentProps<'div'> {
  label?: ReactNode;
  /** @defaultValue false */
  showIcon?: boolean;
}

export function CalendarPreviewBody({
  label,
  showIcon = false,
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
            <CalendarPreviewLabel>{label}</CalendarPreviewLabel>
            <CalendarPreviewInput trailingIcon={showIcon ? undefined : null} />
            <CalendarPreviewScales />
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
