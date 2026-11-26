'use client';

import { cva, cx, type VariantProps } from 'class-variance-authority';
import { type ReactNode, useState } from 'react';
import { XIcon } from '~/icons';
import { Flex } from '../flex';
import { Text } from '../text';
import styles from './announcement-bar.module.css';

const announcementBar = cva(styles['announcement-bar'], {
  variants: {
    /** Color of the bar. */
    color: {
      neutral: styles['announcement-bar-neutral'],
      danger: styles['announcement-bar-danger'],
      gradient: styles['announcement-bar-gradient']
    }
  },
  defaultVariants: {
    color: 'neutral'
  }
});

export type AnnouncementBarProps = VariantProps<typeof announcementBar> & {
  /** Icon shown before the text. */
  leadingIcon?: ReactNode;
  className?: string;
  /** Text of the bar. */
  text: ReactNode;
  /** Label of the action button, shown after the text. */
  actionLabel?: string;
  /** Icon of the action button, shown after its label. */
  actionIcon?: ReactNode;
  /** Called when the action button is clicked. */
  onActionClick?: () => void;
  /**
   * Whether the bar shows a dismiss button at its end.
   * @default false
   */
  dismissible?: boolean;
  /** Called when the dismiss button is clicked. When set, the bar does not hide itself. */
  onDismiss?: () => void;
};

export const AnnouncementBar = ({
  className,
  color,
  text,
  leadingIcon,
  actionLabel,
  actionIcon,
  onActionClick,
  dismissible,
  onDismiss,
  ...props
}: AnnouncementBarProps) => {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <Flex
      className={announcementBar({ className, color })}
      justify='center'
      align='center'
      gap={3}
      data-slot='announcement-bar'
      {...props}
    >
      {leadingIcon && (
        <span
          className={styles['icon']}
          aria-hidden='true'
          data-slot='announcement-bar-leading-icon'
        >
          {leadingIcon}
        </span>
      )}
      <Text
        className={styles.text}
        size='small'
        weight='medium'
        data-slot='announcement-bar-text'
      >
        {text}
      </Text>
      {actionLabel || actionIcon ? (
        <button
          type='button'
          className={styles['action-btn']}
          onClick={onActionClick}
          data-slot='announcement-bar-action'
        >
          <Text
            size='small'
            weight='medium'
            data-slot='announcement-bar-action-label'
          >
            {actionLabel}
          </Text>
          {actionIcon && (
            <span aria-hidden='true' data-slot='announcement-bar-action-icon'>
              {actionIcon}
            </span>
          )}
        </button>
      ) : null}
      {dismissible && (
        <button
          type='button'
          className={cx(styles['action-btn'], styles.dismiss)}
          onClick={onDismiss ?? (() => setDismissed(true))}
          aria-label='Dismiss announcement'
          data-slot='announcement-bar-dismiss'
        >
          <XIcon />
        </button>
      )}
    </Flex>
  );
};

AnnouncementBar.displayName = 'AnnouncementBar';
