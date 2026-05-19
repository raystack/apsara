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
  width?: string | number;
  chips?: Array<{ label: string; onRemove?: () => void }>;
  maxChipsVisible?: number;
  variant?: 'default' | 'borderless';
  containerRef?: RefObject<HTMLDivElement | null>;
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
  width,
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
      style={{ width: width || '100%' }}
      ref={containerRef}
    >
      {leadingIcon && (
        <div className={styles['leading-icon']} aria-hidden='true'>
          {leadingIcon}
        </div>
      )}
      {prefix && <div className={styles.prefix}>{prefix}</div>}

      <div className={styles['chip-input-container']}>
        {chips?.slice(0, maxChipsVisible).map((chip, index) => (
          <Chip
            key={index}
            variant='outline'
            isDismissible={!disabled && !!chip.onRemove}
            onDismiss={disabled ? undefined : chip.onRemove}
            className={styles.chip}
            disabled={disabled}
          >
            {chip.label}
          </Chip>
        ))}
        {chips && chips.length > maxChipsVisible && (
          <span className={styles['chip-overflow']}>
            +{chips.length - maxChipsVisible}
          </span>
        )}
        <InputPrimitive
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

      {suffix && <div className={styles.suffix}>{suffix}</div>}
      {trailingIcon && (
        <div className={styles['trailing-icon']} aria-hidden='true'>
          {trailingIcon}
        </div>
      )}
    </div>
  );
}

Input.displayName = 'Input';
