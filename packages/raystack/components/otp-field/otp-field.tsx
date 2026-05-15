'use client';

import { OTPFieldPreview as OTPFieldPrimitive } from '@base-ui/react/otp-field';
import { Separator as SeparatorPrimitive } from '@base-ui/react/separator';
import { cx } from 'class-variance-authority';
import { useFieldContext } from '../field';
import styles from './otp-field.module.css';

export interface OTPFieldRootProps extends OTPFieldPrimitive.Root.Props {}

const OTPFieldRoot = ({
  className,
  disabled,
  required,
  length,
  ref,
  ...props
}: OTPFieldRootProps) => {
  const fieldContext = useFieldContext();
  const resolvedDisabled = disabled ?? fieldContext?.disabled;
  const resolvedRequired = required ?? fieldContext?.required;

  return (
    <OTPFieldPrimitive.Root
      ref={ref}
      className={cx(styles['otp-field'], className)}
      disabled={resolvedDisabled}
      required={resolvedRequired}
      length={length}
      {...props}
    />
  );
};

OTPFieldRoot.displayName = 'OTPField';

export interface OTPFieldInputProps extends OTPFieldPrimitive.Input.Props {}

const OTPFieldInput = ({ className, ref, ...props }: OTPFieldInputProps) => (
  <OTPFieldPrimitive.Input
    ref={ref}
    className={cx(styles['otp-field-input'], className)}
    {...props}
  />
);

OTPFieldInput.displayName = 'OTPField.Input';

export type OTPFieldSeparatorProps = Omit<
  SeparatorPrimitive.Props,
  'orientation'
>;

const OTPFieldSeparator = ({
  className,
  ref,
  ...props
}: OTPFieldSeparatorProps) => (
  <SeparatorPrimitive
    ref={ref}
    orientation='horizontal'
    className={cx(styles['otp-field-separator'], className)}
    {...props}
  />
);

OTPFieldSeparator.displayName = 'OTPField.Separator';

export const OTPField = Object.assign(OTPFieldRoot, {
  Input: OTPFieldInput,
  Separator: OTPFieldSeparator
});
