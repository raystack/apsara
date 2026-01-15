'use client';

import { InfoCircledIcon } from '@radix-ui/react-icons';
import { cva, cx, type VariantProps } from 'class-variance-authority';
import { ComponentPropsWithoutRef, forwardRef, ReactNode } from 'react';
import { Chip } from '../chip';
import { Tooltip } from '../tooltip';
import styles from './input-field.module.css';

// Todo: Add a dropdown support

const inputWrapper = cva(styles.inputWrapper, {
  variants: {
    size: {
      small: styles['size-small'],
      large: styles['size-large']
    },
    variant: {
      default: styles['variant-default'],
      borderless: styles['variant-borderless']
    }
  },
  defaultVariants: {
    size: 'large',
    variant: 'default'
  }
});

export interface InputFieldProps
  extends Omit<ComponentPropsWithoutRef<'input'>, 'error' | 'size'>,
    VariantProps<typeof inputWrapper> {
  label?: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  optional?: boolean;
  prefix?: string;
  suffix?: string;
  width?: string | number;
  chips?: Array<{ label: string; onRemove?: () => void }>;
  maxChipsVisible?: number;
  infoTooltip?: string;
  variant?: 'default' | 'borderless';
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      className,
      disabled,
      label,
      helperText,
      placeholder,
      error,
      leadingIcon,
      trailingIcon,
      optional,
      prefix,
      suffix,
      width,
      chips,
      maxChipsVisible = 2,
      size,
      infoTooltip,
      variant = 'default',
      ...props
    },
    ref
  ) => {
    return (
      <div className={styles.container} style={{ width: width || '100%' }}>
        {label && (
          <div className={styles.labelContainer}>
            <label
              className={cx(styles.label, disabled && styles['label-disabled'])}
            >
              {label}
              {optional && <span className={styles.optional}>(optional)</span>}
            </label>
            {infoTooltip && (
              <Tooltip message={infoTooltip} side='right'>
                <span className={styles.helpIcon}>
                  <InfoCircledIcon />
                </span>
              </Tooltip>
            )}
          </div>
        )}
        <div
          className={cx(
            inputWrapper({ size, variant, className }),
            error && styles['input-error-wrapper'],
            disabled && styles['input-disabled-wrapper'],
            chips?.length && styles['has-chips']
          )}
        >
          {leadingIcon && (
            <div className={styles['leading-icon']}>{leadingIcon}</div>
          )}
          {prefix && <div className={styles.prefix}>{prefix}</div>}

          <div className={styles['chip-input-container']}>
            {chips?.slice(0, maxChipsVisible).map((chip, index) => (
              <Chip
                key={index}
                variant='outline'
                isDismissible={!!chip.onRemove}
                onDismiss={chip.onRemove}
                className={styles.chip}
              >
                {chip.label}
              </Chip>
            ))}
            {chips && chips.length > maxChipsVisible && (
              <span className={styles['chip-overflow']}>
                +{chips.length - maxChipsVisible}
              </span>
            )}
            <input
              ref={ref}
              className={cx(
                styles['input-field'],
                leadingIcon && styles['has-leading-icon'],
                trailingIcon && styles['has-trailing-icon'],
                prefix && styles['has-prefix'],
                suffix && styles['has-suffix'],
                error && styles['input-error'],
                disabled && styles['input-disabled'],
                className
              )}
              aria-invalid={!!error}
              placeholder={placeholder}
              disabled={disabled}
              {...props}
            />
          </div>

          {suffix && <div className={styles.suffix}>{suffix}</div>}
          {trailingIcon && (
            <div className={styles['trailing-icon']}>{trailingIcon}</div>
          )}
        </div>
        {(error || helperText) && (
          <span
            className={cx(
              styles['helper-text'],
              error && styles['helper-text-error'],
              disabled && styles['helper-text-disabled']
            )}
          >
            {error || helperText}
          </span>
        )}
      </div>
    );
  }
);

InputField.displayName = 'InputField';
