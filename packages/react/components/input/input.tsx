import { Input as InputPrimitive } from '@base-ui/react/input';
import { cva, cx, type VariantProps } from 'class-variance-authority';
import { ReactNode, RefObject } from 'react';
import { radiusVariants } from '../../shared/radius';
import { Chip } from '../chip';
import { useFieldContext } from '../field';
import styles from './input.module.css';

const inputWrapper = cva(styles['input-wrapper'], {
  variants: {
    ...radiusVariants,
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

interface InputFrameProps extends VariantProps<typeof inputWrapper> {
  disabled?: boolean;
  hasChips?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  prefix?: string;
  suffix?: string;
  containerRef?: RefObject<HTMLDivElement | null>;
  className?: string;
  children: ReactNode;
}

/** The input box around the field. Combobox uses it to place Base UI chips. */
export function InputFrame({
  disabled,
  hasChips,
  leadingIcon,
  trailingIcon,
  prefix,
  suffix,
  size,
  radius,
  variant,
  containerRef,
  className,
  children
}: InputFrameProps) {
  return (
    <div
      className={cx(
        inputWrapper({ size, variant, radius }),
        hasChips && styles['has-chips'],
        className
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
      {children}
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

export function inputFieldClassName({
  leadingIcon,
  trailingIcon,
  prefix,
  suffix,
  className
}: Pick<InputProps, 'leadingIcon' | 'trailingIcon' | 'prefix' | 'suffix'> & {
  className?: string;
}) {
  return cx(
    styles['input-field'],
    leadingIcon && styles['has-leading-icon'],
    trailingIcon && styles['has-trailing-icon'],
    prefix && styles['has-prefix'],
    suffix && styles['has-suffix'],
    className
  );
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
  radius,
  variant = 'default',
  containerRef,
  classNames,
  required,
  ...props
}: InputProps) {
  const fieldContext = useFieldContext();
  const resolvedRequired = required ?? fieldContext?.required;

  return (
    <InputFrame
      disabled={disabled}
      hasChips={!!chips?.length}
      leadingIcon={leadingIcon}
      trailingIcon={trailingIcon}
      prefix={prefix}
      suffix={suffix}
      size={size}
      radius={radius}
      variant={variant}
      containerRef={containerRef}
      className={classNames?.container}
    >
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
          className={state =>
            inputFieldClassName({
              leadingIcon,
              trailingIcon,
              prefix,
              suffix,
              className:
                typeof className === 'function' ? className(state) : className
            })
          }
          placeholder={chips?.length ? undefined : placeholder}
          disabled={disabled}
          required={resolvedRequired}
          {...props}
        />
      </div>
    </InputFrame>
  );
}

Input.displayName = 'Input';
