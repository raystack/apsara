'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { ReactNode } from 'react';

import styles from './chip.module.css';

const chip = cva(styles.chip, {
  variants: {
    variant: {
      outline: styles['chip-variant-outline'],
      filled: styles['chip-variant-filled']
    },
    size: {
      large: styles['chip-size-large'],
      small: styles['chip-size-small']
    },
    color: {
      neutral: styles['chip-color-neutral'],
      accent: styles['chip-color-accent']
    }
  },
  defaultVariants: {
    variant: 'outline',
    size: 'small',
    color: 'neutral'
  }
});

type ChipProps = VariantProps<typeof chip> & {
  trailingIcon?: ReactNode;
  leadingIcon?: ReactNode;
  isDismissible?: boolean;
  children: ReactNode;
  className?: string;
  onDismiss?: () => void;
  onClick?: () => void;
  role?: string;
  ariaLabel?: string;
  'data-state'?: string;
};

export const Chip = ({
  variant,
  size,
  color,
  trailingIcon,
  leadingIcon,
  isDismissible,
  children,
  className,
  onDismiss,
  onClick,
  role = 'status',
  ariaLabel,
  'data-state': dataState
}: ChipProps) => {
  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDismiss?.();
  };

  return (
    <span
      className={chip({ variant, size, color, className })}
      role={role}
      aria-label={
        ariaLabel || (typeof children === 'string' ? children : undefined)
      }
      onClick={onClick}
      data-state={dataState}
    >
      {leadingIcon && (
        <span
          className={styles['leading-icon']}
          aria-hidden='true'
          role='presentation'
        >
          {leadingIcon}
        </span>
      )}
      {children}
      {isDismissible ? (
        <button
          onClick={handleDismiss}
          className={styles['dismiss-button']}
          aria-label={`Remove ${
            typeof children === 'string' ? children : 'item'
          }`}
          type='button'
        >
          <svg
            width='12'
            height='12'
            viewBox='0 0 12 12'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            aria-hidden='true'
            role='presentation'
          >
            <path
              fillRule='evenodd'
              clipRule='evenodd'
              d='M9.5066 3.3066C9.73115 3.08205 9.73115 2.71798 9.5066 2.49343C9.28205 2.26887 8.91798 2.26887 8.69343 2.49343L6.00001 5.18684L3.3066 2.49343C3.08205 2.26887 2.71798 2.26887 2.49343 2.49343C2.26887 2.71798 2.26887 3.08205 2.49343 3.3066L5.18684 6.00001L2.49343 8.69343C2.26887 8.91798 2.26887 9.28205 2.49343 9.5066C2.71798 9.73115 3.08205 9.73115 3.3066 9.5066L6.00001 6.81318L8.69343 9.5066C8.91798 9.73115 9.28205 9.73115 9.5066 9.5066C9.73115 9.28205 9.73115 8.91798 9.5066 8.69343L6.81318 6.00001L9.5066 3.3066Z'
              fill='currentColor'
            />
          </svg>
        </button>
      ) : trailingIcon ? (
        <span
          className={styles['trailing-icon']}
          aria-hidden='true'
          role='presentation'
        >
          {trailingIcon}
        </span>
      ) : null}
    </span>
  );
};

Chip.displayName = 'Chip';
