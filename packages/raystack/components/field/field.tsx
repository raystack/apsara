'use client';

import { Field as FieldPrimitive } from '@base-ui/react/field';
import { cx } from 'class-variance-authority';
import { forwardRef, ReactNode } from 'react';
import styles from './field.module.css';

export interface FieldProps extends FieldPrimitive.Root.Props {
  label?: ReactNode;
  helperText?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  optional?: boolean;
  width?: string | number;
  className?: string;
}

const FieldRoot = forwardRef<HTMLDivElement, FieldProps>(
  (
    {
      label,
      helperText,
      error,
      required,
      optional,
      width,
      className,
      children,
      invalid,
      ...props
    },
    ref
  ) => {
    const isInvalid = invalid ?? !!error;

    return (
      <FieldPrimitive.Root
        ref={ref}
        className={cx(styles.field, className)}
        style={{ width: width || '100%' }}
        invalid={isInvalid}
        {...props}
      >
        {label && (
          <FieldPrimitive.Label className={styles.label}>
            {label}
            {required && (
              <span className={styles['required-indicator']} aria-hidden='true'>
                *
              </span>
            )}
            {optional && <span className={styles.optional}>(optional)</span>}
          </FieldPrimitive.Label>
        )}
        <div className={styles.control}>{children}</div>
        {error && (
          <FieldPrimitive.Error className={styles.error} match>
            {error}
          </FieldPrimitive.Error>
        )}
        {!error && helperText && (
          <FieldPrimitive.Description className={styles.description}>
            {helperText}
          </FieldPrimitive.Description>
        )}
      </FieldPrimitive.Root>
    );
  }
);
FieldRoot.displayName = 'Field';

const FieldLabel = forwardRef<HTMLLabelElement, FieldPrimitive.Label.Props>(
  ({ className, ...props }, ref) => (
    <FieldPrimitive.Label
      ref={ref}
      className={cx(styles.label, className)}
      {...props}
    />
  )
);
FieldLabel.displayName = 'Field.Label';

const FieldControl = forwardRef<HTMLInputElement, FieldPrimitive.Control.Props>(
  ({ className, ...props }, ref) => (
    <FieldPrimitive.Control
      ref={ref}
      className={cx(styles.input, className)}
      {...props}
    />
  )
);
FieldControl.displayName = 'Field.Control';

const FieldError = forwardRef<HTMLDivElement, FieldPrimitive.Error.Props>(
  ({ className, ...props }, ref) => (
    <FieldPrimitive.Error
      ref={ref}
      className={cx(styles.error, className)}
      {...props}
    />
  )
);
FieldError.displayName = 'Field.Error';

const FieldDescription = forwardRef<
  HTMLParagraphElement,
  FieldPrimitive.Description.Props
>(({ className, ...props }, ref) => (
  <FieldPrimitive.Description
    ref={ref}
    className={cx(styles.description, className)}
    {...props}
  />
));
FieldDescription.displayName = 'Field.Description';

export const Field = Object.assign(FieldRoot, {
  Label: FieldLabel,
  Control: FieldControl,
  Error: FieldError,
  Description: FieldDescription,
  Validity: FieldPrimitive.Validity
});
