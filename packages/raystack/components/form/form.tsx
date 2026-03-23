'use client';

import { Form as FormPrimitive } from '@base-ui/react/form';
import { cx } from 'class-variance-authority';
import { forwardRef } from 'react';
import styles from './form.module.css';

export interface FormProps extends FormPrimitive.Props {
  className?: string;
}

const FormRoot = forwardRef<HTMLFormElement, FormProps>(
  ({ className, ...props }, ref) => (
    <FormPrimitive
      ref={ref}
      className={cx(styles.form, className)}
      {...props}
    />
  )
);
FormRoot.displayName = 'Form';

export const Form = FormRoot;
