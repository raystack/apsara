import { Input as InputPrimitive } from '@base-ui/react/input';
import { cva, cx, type VariantProps } from 'class-variance-authority';
import { ReactNode, RefObject } from 'react';
import { Chip } from '../chip';
import { useFieldContext } from '../field';
import styles from './input.module.css';

const inputWrapper = cva(styles['input-wrapper'], {
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

export interface InputProps
  extends Omit<InputPrimitive.Props, 'size'>,
    VariantProps<typeof inputWrapper> {
  disabled?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  prefix?: string;
  suffix?: string;
  chips?: Array<{ label: string; onRemove?: () => void }>;
  maxChipsVisible?: number;
  variant?: 'default' | 'borderless';
  containerRef?: RefObject<HTMLDivElement | null>;
  /** @deprecated Use `[data-slot="input-container"]` instead. */
  classNames?: { container?: string };
}

export function Input({
  className,
  disabled,
  placeholder,
  leadingIcon,
  trailingIcon,
  prefix,
  suffix,
  chips,
  maxChipsVisible = 2,
  size,
  variant = 'default',
  containerRef,
  classNames,
  required,
  ...props
}: InputProps) {
  const fieldContext = useFieldContext();
  const resolvedRequired = required ?? fieldContext?.required;

  return (
    <div
      className={cx(
        inputWrapper({ size, variant }),
        chips?.length && styles['has-chips'],
        classNames?.container
      )}
      data-disabled={disabled || undefined}
      data-slot='input-container'
      ref={containerRef}
    >
      {leadingIcon && (
        <div
          className={styles['leading-icon']}
          aria-hidden='true'
          data-slot='input-leading-icon'
        >
          {leadingIcon}
        </div>
      )}
      {prefix && (
        <div className={styles.prefix} data-slot='input-prefix'>
          {prefix}
        </div>
      )}

      <div
        className={styles['chip-input-container']}
        data-slot='input-chip-container'
      >
        {chips?.slice(0, maxChipsVisible).map((chip, index) => (
          <Chip
            key={index}
            variant='outline'
            isDismissible={!disabled && !!chip.onRemove}
            onDismiss={disabled ? undefined : chip.onRemove}
            className={styles.chip}
            disabled={disabled}
            data-slot='input-chip'
          >
            {chip.label}
          </Chip>
        ))}
        {chips && chips.length > maxChipsVisible && (
          <span
            className={styles['chip-overflow']}
            data-slot='input-chip-overflow'
          >
            +{chips.length - maxChipsVisible}
          </span>
        )}
        <InputPrimitive
          data-slot='input'
          className={cx(
            styles['input-field'],
            leadingIcon && styles['has-leading-icon'],
            trailingIcon && styles['has-trailing-icon'],
            prefix && styles['has-prefix'],
            suffix && styles['has-suffix'],
            className
          )}
          placeholder={chips?.length ? undefined : placeholder}
          disabled={disabled}
          required={resolvedRequired}
          {...props}
        />
      </div>

      {suffix && (
        <div className={styles.suffix} data-slot='input-suffix'>
          {suffix}
        </div>
      )}
      {trailingIcon && (
        <div
          className={styles['trailing-icon']}
          aria-hidden='true'
          data-slot='input-trailing-icon'
        >
          {trailingIcon}
        </div>
      )}
    </div>
  );
}

Input.displayName = 'Input';
