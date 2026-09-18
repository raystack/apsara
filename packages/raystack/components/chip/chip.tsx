'use client';

import { cva, cx, type VariantProps } from 'class-variance-authority';
import { ComponentProps, ReactNode, Ref } from 'react';

import { XIcon } from '~/icons';
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
      accent: styles['chip-color-accent'],
      danger: styles['chip-color-danger'],
      success: styles['chip-color-success'],
      warning: styles['chip-color-warning']
    }
  },
  defaultVariants: {
    variant: 'outline',
    size: 'small',
    color: 'neutral'
  }
});

export type ChipProps = Omit<ComponentProps<'span'>, 'ref' | 'children'> &
  VariantProps<typeof chip> & {
    trailingIcon?: ReactNode;
    leadingIcon?: ReactNode;
    isDismissible?: boolean;
    /** Optional: an icon-only chip passes `aria-label` instead. */
    children?: ReactNode;
    onDismiss?: () => void;
    disabled?: boolean;
    /**
     * The chip renders a `<button>` when `onClick` is set and it is not
     * dismissible, and a `<span>` otherwise — so the ref lands on whichever
     * element that combination produced.
     */
    ref?: Ref<HTMLSpanElement | HTMLButtonElement>;
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
          <XIcon
            className={styles['dismiss-icon']}
            aria-hidden='true'
            role='presentation'
            data-slot='chip-dismiss-icon'
          />
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
