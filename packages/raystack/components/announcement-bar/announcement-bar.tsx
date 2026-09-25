'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { ReactNode } from 'react';

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
  text: string;
  actionLabel?: string;
  actionIcon?: ReactNode;
  onActionClick?: () => void;
};

export const AnnouncementBar = ({
  className,
  variant,
  text,
  leadingIcon,
  actionLabel,
  actionIcon,
  onActionClick = () => {},
  ...props
}: AnnouncementBarProps) => {
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
    </Flex>
  );
};

AnnouncementBar.displayName = 'AnnouncementBar';
