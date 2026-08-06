'use client';

import { cva, cx, type VariantProps } from 'class-variance-authority';
import { ComponentProps, ReactNode } from 'react';

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

type ChipProps = ComponentProps<'span'> &
  VariantProps<typeof chip> & {
    trailingIcon?: ReactNode;
    leadingIcon?: ReactNode;
    isDismissible?: boolean;
    children: ReactNode;
    onDismiss?: () => void;
    disabled?: boolean;
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
  role,
  disabled,
  'aria-label': ariaLabel,
  ...props
}: ChipProps) => {
  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDismiss?.();
  };

  const isInteractive = !!onClick && !isDismissible;

  const sharedProps = {
    'aria-label':
      ariaLabel ?? (typeof children === 'string' ? children : undefined),
    'data-disabled': disabled || undefined
  };

  const content = (
    <>
      {leadingIcon && (
        <span
          className={styles['leading-icon']}
          aria-hidden='true'
          role='presentation'
          data-slot='chip-leading-icon'
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
          data-slot='chip-dismiss'
        >
          <svg
            width='12'
            height='12'
            viewBox='0 0 12 12'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            aria-hidden='true'
            role='presentation'
            data-slot='chip-dismiss-icon'
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
          data-slot='chip-trailing-icon'
        >
          {trailingIcon}
        </span>
      ) : null}
    </>
  );

  if (isInteractive) {
    return (
      <button
        data-slot='chip'
        {...(props as React.ComponentProps<'button'>)}
        {...sharedProps}
        type='button'
        disabled={disabled}
        role={role}
        className={chip({
          variant,
          size,
          color,
          className: cx(styles['chip-interactive'], className)
        })}
        onClick={
          onClick as unknown as React.MouseEventHandler<HTMLButtonElement>
        }
      >
        {content}
      </button>
    );
  }

  return (
    <span
      data-slot='chip'
      {...props}
      {...sharedProps}
      className={chip({ variant, size, color, className })}
      role={role ?? 'status'}
      onClick={disabled ? undefined : onClick}
    >
      {content}
    </span>
  );
};

Chip.displayName = 'Chip';
