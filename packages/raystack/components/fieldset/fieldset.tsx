'use client';

import { Fieldset as FieldsetPrimitive } from '@base-ui/react/fieldset';
import { cx } from 'class-variance-authority';
import { forwardRef, ReactNode } from 'react';
import styles from './fieldset.module.css';

export interface FieldsetProps extends FieldsetPrimitive.Root.Props {
  legend?: ReactNode;
  className?: string;
  legendClassName?: string;
}

const FieldsetRoot = forwardRef<HTMLFieldSetElement, FieldsetProps>(
  ({ legend, className, legendClassName, children, ...props }, ref) => (
    <FieldsetPrimitive.Root
      ref={ref}
      className={cx(styles.fieldset, className)}
      {...props}
    >
      {legend && (
        <FieldsetPrimitive.Legend
          className={cx(styles.legend, legendClassName)}
        >
          {legend}
        </FieldsetPrimitive.Legend>
      )}
      {children}
    </FieldsetPrimitive.Root>
  )
);
FieldsetRoot.displayName = 'Fieldset';

const FieldsetLegend = forwardRef<
  HTMLDivElement,
  FieldsetPrimitive.Legend.Props
>(({ className, ...props }, ref) => (
  <FieldsetPrimitive.Legend
    ref={ref}
    className={cx(styles.legend, className)}
    {...props}
  />
));
FieldsetLegend.displayName = 'Fieldset.Legend';

export const Fieldset = Object.assign(FieldsetRoot, {
  Legend: FieldsetLegend
});
