'use client';

import { Cross1Icon } from '@radix-ui/react-icons';
import { cva, cx, type VariantProps } from 'class-variance-authority';
import { ReactNode, useEffect, useState } from 'react';

import { Flex } from '../flex';
import { IconButton } from '../icon-button';
import { Text } from '../text';
import styles from './announcement-bar.module.css';

// Must match --rs-duration-normal used by .collapse in announcement-bar.module.css.
const DISMISS_EXIT_MS = 200;

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
  /** Show a dismiss (close) button. */
  dismissible?: boolean;
  /**
   * Called after the dismiss animation finishes. When provided, the consumer
   * owns removal (the bar stays mounted, collapsed). When omitted, the bar
   * removes itself.
   */
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
  const [dismissState, setDismissState] = useState<
    'open' | 'closing' | 'closed'
  >('open');

  useEffect(() => {
    if (dismissState !== 'closing') return;
    const timer = setTimeout(() => {
      setDismissState('closed');
      onDismiss?.();
    }, DISMISS_EXIT_MS);
    return () => clearTimeout(timer);
  }, [dismissState, onDismiss]);

  if (dismissState === 'closed' && !onDismiss) return null;

  const bar = (
    <Flex
      className={announcementBar({ className, variant })}
      justify='center'
      align='center'
      gap={3}
      {...props}
    >
      {leadingIcon && (
        <span className={styles['icon']} aria-hidden='true'>
          {leadingIcon}
        </span>
      )}
      <Text className={styles.text} size='small' weight='medium'>
        {text}
      </Text>
      {actionLabel || actionIcon ? (
        <button
          type='button'
          className={styles['action-btn']}
          onClick={onActionClick}
        >
          <Text size='small' weight='medium'>
            {actionLabel}
          </Text>
          {actionIcon && <span aria-hidden='true'>{actionIcon}</span>}
        </button>
      ) : null}
      {dismissible && (
        <IconButton
          size={2}
          className={styles['dismiss-btn']}
          aria-label='Dismiss announcement'
          onClick={() => setDismissState('closing')}
        >
          <Cross1Icon />
        </IconButton>
      )}
    </Flex>
  );

  if (!dismissible) return bar;

  return (
    <div
      className={cx(
        styles.collapse,
        dismissState !== 'open' && styles['collapse-closing']
      )}
    >
      <div className={styles['collapse-inner']}>{bar}</div>
    </div>
  );
};

AnnouncementBar.displayName = 'AnnouncementBar';
