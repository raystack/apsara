import { Form as FormPrimitive } from '@base-ui/react/form';
import { cx } from 'class-variance-authority';
import styles from './form.module.css';

function FormRoot({ className, ...props }: FormPrimitive.Props) {
  return <FormPrimitive className={cx(styles.form, className)} {...props} />;
}

export const Form = FormRoot;
