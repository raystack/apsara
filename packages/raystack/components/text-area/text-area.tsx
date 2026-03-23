'use client';

import { cx } from 'class-variance-authority';
import * as React from 'react';
import { HTMLAttributes, PropsWithChildren } from 'react';

import styles from './text-area.module.css';

export interface TextAreaProps
  extends PropsWithChildren<HTMLAttributes<HTMLTextAreaElement>> {
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
      ...props
    },
    ref
  ) => {
    return (
      <textarea
        className={cx(styles.textarea, disabled && styles.disabled, className)}
        ref={ref}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        style={{ ...style, width }}
        {...props}
      />
    );
  }
);

TextArea.displayName = 'TextArea';

export { TextArea };
