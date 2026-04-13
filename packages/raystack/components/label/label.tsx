import { cva, type VariantProps } from 'class-variance-authority';
import { ComponentProps, PropsWithChildren } from 'react';

import styles from './label.module.css';

const label = cva(styles.label, {
  variants: {
    size: {
      small: styles['label-small'],
      medium: styles['label-medium'],
      large: styles['label-large']
    },
    required: {
      true: styles['label-required']
    }
  },
  defaultVariants: {
    size: 'small',
    required: false
  }
});

interface LabelProps
  extends PropsWithChildren<VariantProps<typeof label>>,
    Omit<ComponentProps<'label'>, 'required'> {
  required?: boolean;
  requiredIndicator?: string;
  htmlFor?: string;
}

export function Label({
  children,
  className,
  size,
  required,
  requiredIndicator = '*',
  htmlFor,
  ...props
}: LabelProps) {
  return (
    <label
      className={label({ size, required, className })}
      htmlFor={htmlFor}
      {...props}
    >
      {children}
      {required && (
        <span
          className={styles['required-indicator']}
          aria-hidden='true'
          role='presentation'
        >
          {requiredIndicator}
        </span>
      )}
    </label>
  );
}

Label.displayName = 'Label';

export type { LabelProps };
