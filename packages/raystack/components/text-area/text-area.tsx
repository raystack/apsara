import { Field as FieldPrimitive } from '@base-ui/react/field';
import { cx } from 'class-variance-authority';
import * as React from 'react';
import { type ComponentProps } from 'react';
import { useFieldContext } from '../field';

import styles from './text-area.module.css';

export interface TextAreaProps extends ComponentProps<'textarea'> {
  disabled?: boolean;
  placeholder?: string;
  width?: string | number;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      className,
      style,
      disabled,
      width = '100%',
      value,
      onChange,
      placeholder,
      required,
      ...props
    },
    ref
  ) => {
    const fieldContext = useFieldContext();
    const resolvedRequired = required ?? fieldContext?.required;

    const textarea = (
      <textarea
        className={cx(styles.textarea, disabled && styles.disabled, className)}
        ref={ref}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        required={resolvedRequired}
        style={{ ...style, width }}
        {...props}
      />
    );

    if (fieldContext) {
      return <FieldPrimitive.Control render={textarea} />;
    }

    return textarea;
  }
);

TextArea.displayName = 'TextArea';

export { TextArea };
