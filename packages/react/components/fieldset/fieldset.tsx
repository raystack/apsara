import { Fieldset as FieldsetPrimitive } from '@base-ui/react/fieldset';
import { cx } from 'class-variance-authority';
import styles from './fieldset.module.css';

export interface FieldsetProps extends FieldsetPrimitive.Root.Props {
  /** Text shown as the fieldset legend. */
  legend?: string;
  /**
   * Whether the fieldset and all controls inside it are disabled.
   * @default false
   */
  disabled?: boolean;
}

function FieldsetRoot({
  legend,
  className,
  children,
  ...props
}: FieldsetProps) {
  return (
    <FieldsetPrimitive.Root
      className={cx(styles.fieldset, className)}
      data-slot='fieldset'
      {...props}
    >
      {legend && <FieldsetLegend>{legend}</FieldsetLegend>}
      {children}
    </FieldsetPrimitive.Root>
  );
}

function FieldsetLegend({
  className,
  ...props
}: FieldsetPrimitive.Legend.Props) {
  return (
    <FieldsetPrimitive.Legend
      className={cx(styles.legend, className)}
      data-slot='fieldset-legend'
      {...props}
    />
  );
}

export const Fieldset = Object.assign(FieldsetRoot, {
  Legend: FieldsetLegend
});
