import { Fieldset as FieldsetPrimitive } from '@base-ui/react/fieldset';
import { cx } from 'class-variance-authority';
import styles from './fieldset.module.css';

export interface FieldsetProps extends FieldsetPrimitive.Root.Props {
  legend?: string;
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
      {...props}
    />
  );
}

export const Fieldset = Object.assign(FieldsetRoot, {
  Legend: FieldsetLegend
});
