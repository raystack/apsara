import { cx } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { Popover } from '../popover';
import styles from './calendar-preview.module.css';
import { useCalendarPreviewContext } from './calendar-preview-context';

export type CalendarPreviewContentProps = ComponentProps<
  typeof Popover.Content
>;

/**
 * The portaled popover surface.
 *
 * Dismissal is Base UI's: outside press, escape and focus-out are all handled
 * by `Popover.Root`, so nothing in this directory listens on the document.
 */
export function CalendarPreviewContent({
  className,
  children,
  ...props
}: CalendarPreviewContentProps) {
  const { triggerHasInput } = useCalendarPreviewContext(
    'CalendarPreview.Content'
  );

  return (
    <Popover.Content
      className={cx(styles.content, className)}
      data-slot='calendar-preview-content'
      initialFocus={triggerHasInput ? false : undefined}
      {...props}
    >
      {children}
    </Popover.Content>
  );
}

CalendarPreviewContent.displayName = 'CalendarPreview.Content';
