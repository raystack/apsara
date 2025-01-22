import clsx from "clsx";
import { ComponentPropsWithoutRef, ElementRef, forwardRef, ReactNode, useEffect, useRef, useState } from "react";
import { Chip } from "../chip";
import styles from "./input-field.module.css";

// Todo: Add a dropdown and chip support

export interface InputFieldProps
  extends Omit<ComponentPropsWithoutRef<"input">, "error"> {
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
}

export const InputField = forwardRef<ElementRef<"input">, InputFieldProps>(
  ({
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
    ...props
  }, ref) => {
    const prefixRef = useRef<HTMLSpanElement>(null);
    const suffixRef = useRef<HTMLSpanElement>(null);
    const [prefixWidth, setPrefixWidth] = useState(0);
    const [suffixWidth, setSuffixWidth] = useState(0);

    useEffect(() => {
      if (prefixRef.current && prefix) {
        const width = prefixRef.current.getBoundingClientRect().width;
        setPrefixWidth(width);
      }
    }, [prefix]);

    useEffect(() => {
      if (suffixRef.current && suffix) {
        const width = suffixRef.current.getBoundingClientRect().width;
        setSuffixWidth(width);
      }
    }, [suffix]);

    return (
      <div className={styles.container} style={{ width: width || '100%' }}>
        {label && (
          <label className={clsx(styles.label, disabled && styles["label-disabled"])}>
            {label}
            {optional && <span className={styles.optional}>(optional)</span>}
          </label>
        )}
        <div className={clsx(styles.inputWrapper, chips?.length && styles.hasChips)}>
          {leadingIcon && <span className={styles.leadingIcon}>{leadingIcon}</span>}
          {prefix && <span ref={prefixRef} className={styles.prefix}>{prefix}</span>}
          <div className={styles.chipInputContainer}>
            {chips?.map((chip, index) => (
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
            <input
              ref={ref}
              style={{
                paddingLeft: prefix ? `calc(${prefixWidth}px + var(--rs-space-3))` : undefined,
                paddingRight: suffix ? `calc(${suffixWidth}px + var(--rs-space-3))` : undefined,
              }}
              className={clsx(
                styles.inputField,
                leadingIcon && styles.hasLeadingIcon,
                trailingIcon && styles.hasTrailingIcon,
                error && styles["input-error"],
                disabled && styles["input-disabled"],
                className
              )}
              aria-invalid={!!error}
              placeholder={placeholder}
              disabled={disabled}
              {...props}
            />
          </div>
          {suffix && <span ref={suffixRef} className={styles.suffix}>{suffix}</span>}
          {trailingIcon && <span className={styles.trailingIcon}>{trailingIcon}</span>}
        </div>
        {(error || helperText) && (
          <span 
            className={clsx(
              styles.helperText, 
              error && styles["helperText-error"],
              disabled && styles["helperText-disabled"]
            )}
          >
            {error || helperText}
          </span>
        )}
      </div>
    );
  }
);

InputField.displayName = "InputField";
