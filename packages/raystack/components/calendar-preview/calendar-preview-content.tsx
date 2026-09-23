import { cx } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { Popover } from '../popover';
import styles from './calendar-preview.module.css';
import { useCalendarPreviewContext } from './calendar-preview-context';

export type CalendarPreviewContentProps = ComponentProps<
  typeof Popover.Content
>;

export function CalendarPreviewContent({
  className,
  children,
  ...props
}: CalendarPreviewContentProps) {
  const { triggerHasInput, shouldRestoreFinalFocus } =
    useCalendarPreviewContext('CalendarPreview.Content');

  return (
    <Popover.Content
      className={cx(styles.content, className)}
      data-slot='calendar-preview-content'
      initialFocus={triggerHasInput ? false : undefined}
      finalFocus={triggerHasInput ? shouldRestoreFinalFocus : undefined}
      {...props}
    >
      {children}
    </Popover.Content>
  );
}

CalendarPreviewContent.displayName = 'CalendarPreview.Content';
