import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";
import { ComponentPropsWithoutRef, ReactNode } from "react";

import { Chip } from "../chip";
import styles from "./input-field.module.css";

// Todo: Add a dropdown and chip support

const inputWrapper = cva(styles.inputWrapper, {
  variants: {
    size: {
      small: styles["size-small"],
      large: styles["size-large"],
    }
  },
  defaultVariants: {
    size: "large",
  }
});

export interface InputFieldProps
  extends Omit<ComponentPropsWithoutRef<"input">, "error" | "size">,
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
  ref?: React.RefObject<HTMLInputElement>;
}

export const InputField = ({ 
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
  ref,
  size,
  ...props 
}: InputFieldProps) => {
  return (
    <div className={styles.container} style={{ width: width || '100%' }}>
      {label && (
        <label className={clsx(styles.label, disabled && styles["label-disabled"])}>
          {label}
          {optional && <span className={styles.optional}>(optional)</span>}
        </label>
      )}
      <div 
        className={clsx(
          inputWrapper({ size, className }),
          chips?.length && styles['has-chips']
        )}
      >
        {leadingIcon && <span className={styles['leading-icon']}>{leadingIcon}</span>}
        {prefix && <span className={styles.prefix}>{prefix}</span>}
        <div className={styles['chip-input-container']}>
          {chips?.slice(0, maxChipsVisible).map((chip, index) => (
            <Chip
              key={index}
              variant="outline"
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
            className={clsx(
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
        {suffix && <span className={styles.suffix}>{suffix}</span>}
        {trailingIcon && <span className={styles['trailing-icon']}>{trailingIcon}</span>}
      </div>
      {(error || helperText) && (
        <span 
          className={clsx(
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
};

InputField.displayName = "InputField";