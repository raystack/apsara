import { Field as FieldPrimitive } from '@base-ui/react/field';
import { cx } from 'class-variance-authority';
import styles from './field.module.css';
import { useFieldContext } from './use-field-context';

export interface FieldLabelProps extends FieldPrimitive.Label.Props {
  required?: boolean;
  /**
   * Layout direction of the label relative to the control it labels.
   * Use `horizontal` when placing the label inline next to a Radio or Checkbox.
   * @defaultValue 'vertical'
   */
  orientation?: 'vertical' | 'horizontal';
}

export function FieldLabel({
  className,
  ref,
  required,
  orientation = 'vertical',
  children,
  ...props
}: FieldLabelProps) {
  const fieldContext = useFieldContext();
  const mergedClassName = cx(
    styles.label,
    orientation === 'horizontal' && styles['label-horizontal'],
    className
  );

  const optionalIndicator = required === false && (
    <span className={styles.optional}>(optional)</span>
  );

  if (!fieldContext) {
    return (
      <label ref={ref} className={mergedClassName} {...props}>
        {children}
        {optionalIndicator}
      </label>
    );
  }

  return (
    <FieldPrimitive.Label ref={ref} className={mergedClassName} {...props}>
      {children}
      {optionalIndicator}
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
