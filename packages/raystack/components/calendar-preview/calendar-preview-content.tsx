import { cx } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { Popover } from '../popover';
import styles from './calendar-preview.module.css';

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
  return (
    <Popover.Content
      className={cx(styles.content, className)}
      data-slot='calendar-preview-content'
      {...props}
    >
      {children}
    </Popover.Content>
  );
}

CalendarPreviewContent.displayName = 'CalendarPreview.Content';
