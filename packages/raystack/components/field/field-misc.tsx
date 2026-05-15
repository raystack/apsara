import { Field as FieldPrimitive } from '@base-ui/react/field';
import { cx } from 'class-variance-authority';
import { Label, type LabelProps } from '../label';
import styles from './field.module.css';

export type FieldLabelProps = FieldPrimitive.Label.Props & LabelProps;

export function FieldLabel({
  ref,
  required,
  optionalText,
  children,
  ...props
}: FieldLabelProps) {
  return (
    <FieldPrimitive.Label
      ref={ref}
      render={<Label required={required} optionalText={optionalText} />}
      {...props}
    >
      {children}
    </FieldPrimitive.Label>
  );
}

export function FieldControl({
  className,
  ref,
  ...props
}: FieldPrimitive.Control.Props) {
  return (
    <FieldPrimitive.Control
      ref={ref}
      className={cx(styles.input, className)}
      {...props}
    />
  );
}

export function FieldError({
  className,
  ref,
  ...props
}: FieldPrimitive.Error.Props) {
  return (
    <FieldPrimitive.Error
      ref={ref}
      className={cx(styles.error, className)}
      {...props}
    />
  );
}

export function FieldDescription({
  className,
  ref,
  ...props
}: FieldPrimitive.Description.Props) {
  return (
    <FieldPrimitive.Description
      ref={ref}
      className={cx(styles.description, className)}
      {...props}
    />
  );
}
