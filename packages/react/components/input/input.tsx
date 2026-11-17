import { Input as InputPrimitive } from '@base-ui/react/input';
import { cva, cx, type VariantProps } from 'class-variance-authority';
import {
  Fragment,
  isValidElement,
  ReactElement,
  ReactNode,
  RefObject
} from 'react';
import { radiusVariants } from '../../shared/radius';
import { Chip, type ChipProps } from '../chip';
import { useFieldContext } from '../field';
import styles from './input.module.css';

const inputWrapper = cva(styles['input-wrapper'], {
  variants: {
    ...radiusVariants,
    /** Size of the input. */
    size: {
      small: styles['size-small'],
      medium: styles['size-medium']
    },
    variant: {
      outline: null,
      text: styles['variant-text']
    }
  },
  defaultVariants: {
    size: 'medium',
    variant: 'outline'
  }
});

export interface InputProps
  extends Omit<InputPrimitive.Props, 'size'>,
    VariantProps<typeof inputWrapper> {
  /**
   * Whether the input is disabled. Also disables the chips passed as props.
   * @default false
   */
  disabled?: boolean;
  /** Text shown when the input is empty. Hidden while chips are shown. */
  placeholder?: string;
  /** Icon shown at the start of the input. */
  leadingIcon?: ReactNode;
  /** Icon shown at the end of the input. */
  trailingIcon?: ReactNode;
  /** Text shown before the input value. */
  prefix?: string;
  /** Text shown after the input value. */
  suffix?: string;
  /** Chips shown before the text. Elements render as given; props render a `Chip`. */
  chips?: Array<ReactElement | ChipProps>;
  /**
   * Maximum number of chips shown before a `+N` overflow count.
   * @default 2
   */
  maxChipsVisible?: number;
  /**
   * Visual style of the input.
   * @default "outline"
   */
  variant?: 'outline' | 'text';
  /** Ref to the outer container `div`. */
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
  radius,
  variant = 'outline',
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
        inputWrapper({ size, variant, radius }),
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
        {chips
          ?.slice(0, maxChipsVisible)
          .map((chip, index) =>
            isValidElement(chip) ? (
              <Fragment key={chip.key ?? index}>{chip}</Fragment>
            ) : (
              <Chip
                key={index}
                variant='outline'
                data-slot='input-chip'
                {...chip}
                className={cx(styles.chip, chip.className)}
                disabled={disabled || chip.disabled}
              />
            )
          )}
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
          data-slot='input-trailing-icon'
        >
          {trailingIcon}
        </div>
      )}
    </div>
  );
}

Input.displayName = 'Input';
