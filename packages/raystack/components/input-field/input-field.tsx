'use client';

import { cva, cx, type VariantProps } from 'class-variance-authority';
import {
  ComponentPropsWithoutRef,
  forwardRef,
  ReactNode,
  RefObject
} from 'react';
import { Chip } from '../chip';
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
  extends Omit<ComponentPropsWithoutRef<'input'>, 'size'>,
    VariantProps<typeof inputWrapper> {
  disabled?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  prefix?: string;
  suffix?: string;
  width?: string | number;
  chips?: Array<{ label: string; onRemove?: () => void }>;
  maxChipsVisible?: number;
  variant?: 'default' | 'borderless';
  containerRef?: RefObject<HTMLDivElement | null>;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      className,
      disabled,
      placeholder,
      leadingIcon,
      trailingIcon,
      prefix,
      suffix,
      width,
      chips,
      maxChipsVisible = 2,
      size,
      variant = 'default',
      containerRef,
      ...props
    },
    ref
  ) => {
    return (
      <div
        className={cx(
          inputWrapper({ size, variant }),
          disabled && styles['input-disabled-wrapper'],
          chips?.length && styles['has-chips']
        )}
        style={{ width: width || '100%' }}
        ref={containerRef}
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
              disabled && styles['input-disabled'],
              className
            )}
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
    );
  }
);

InputField.displayName = 'InputField';
