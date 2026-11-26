'use client';

import { Field as FieldPrimitive } from '@base-ui/react/field';
import { cx } from 'class-variance-authority';
import { createContext, ReactNode } from 'react';
import styles from './field.module.css';
import { FieldLabel } from './field-misc';

export interface FieldProps extends FieldPrimitive.Root.Props {
  /** Content of the field label. */
  label?: ReactNode;
  /** Text shown below the control. Hidden while `error` is set. */
  description?: ReactNode;
  /** Error message shown below the control. It makes the field invalid when `invalid` is not set. */
  error?: ReactNode;
  /**
   * Whether the field is required. When `false`, the label shows an `(optional)` indicator. Controls inside the field use it when their own `required` is not set.
   * @default true
   */
  required?: boolean;
  /** Whether the field is invalid. Defaults to `true` when `error` is set, otherwise `false`. */
  invalid?: boolean;
}

export interface FieldContextValue {
  invalid?: boolean;
  disabled?: boolean;
  required?: boolean;
}

export const FieldContext = createContext<FieldContextValue | null>(null);

export function FieldRoot({
  label,
  description,
  error,
  required = true,
  className,
  children,
  invalid,
  disabled,
  ref,
  ...props
}: FieldProps) {
  const isInvalid = invalid ?? !!error;

  return (
    <FieldContext.Provider value={{ invalid: isInvalid, disabled, required }}>
      <FieldPrimitive.Root
        ref={ref}
        className={cx(styles.field, className)}
        invalid={isInvalid}
        disabled={disabled}
        data-slot='field'
        {...props}
      >
        {label && <FieldLabel required={required}>{label}</FieldLabel>}
        <div className={styles.control} data-slot='field-control'>
          {children}
        </div>
        {(description || error) && (
          <div className={styles.helperSlot} data-slot='field-helper'>
            {description && !error && (
              <FieldPrimitive.Description
                className={styles.description}
                data-slot='field-description'
              >
                {description}
              </FieldPrimitive.Description>
            )}
            {error && (
              <FieldPrimitive.Error
                className={styles.error}
                data-slot='field-error'
                match
              >
                {error}
              </FieldPrimitive.Error>
            )}
          </div>
        )}
      </FieldPrimitive.Root>
    </FieldContext.Provider>
  );
}
