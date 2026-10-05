'use client';

import { cva, cx, type VariantProps } from 'class-variance-authority';
import { type ReactNode, useState } from 'react';
import { XIcon } from '~/icons';
import { Flex } from '../flex';
import { Text } from '../text';
import styles from './announcement-bar.module.css';

const announcementBar = cva(styles['announcement-bar'], {
  variants: {
    variant: {
      gradient: styles['announcement-bar-gradient'],
      normal: styles['announcement-bar-normal'],
      error: styles['announcement-bar-error']
    }
  },
  defaultVariants: {
    variant: 'normal'
  }
});

type AnnouncementBarProps = VariantProps<typeof announcementBar> & {
  leadingIcon?: ReactNode;
  className?: string;
  text: ReactNode;
  actionLabel?: string;
  actionIcon?: ReactNode;
  onActionClick?: () => void;
  dismissible?: boolean;
  onDismiss?: () => void;
};

export const AnnouncementBar = ({
  className,
  variant,
  text,
  leadingIcon,
  actionLabel,
  actionIcon,
  onActionClick = () => {},
  dismissible,
  onDismiss,
  ...props
}: AnnouncementBarProps) => {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <Flex
      className={announcementBar({ className, variant })}
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
          data-slot='announcement-bar-icon'
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
