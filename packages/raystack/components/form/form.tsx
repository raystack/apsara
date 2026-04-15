import { Form as FormPrimitive } from '@base-ui/react/form';
import { cx } from 'class-variance-authority';
import styles from './form.module.css';

export type FormProps = FormPrimitive.Props;

function FormRoot({ className, ...props }: FormProps) {
  return <FormPrimitive className={cx(styles.form, className)} {...props} />;
}

export const Form = FormRoot;
