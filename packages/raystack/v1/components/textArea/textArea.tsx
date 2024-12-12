import * as React from "react";
import { HTMLAttributes, PropsWithChildren, ReactNode } from "react";
import { VariantProps, cva, cx } from "class-variance-authority";

import styles from "./textarea.module.css";

const textArea = cva(styles.textarea, {
  variants: {
    error: {
      true: styles.error
    }
  }
});

export interface TextAreaProps extends PropsWithChildren<VariantProps<typeof textArea>>, 
  HTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  required?: boolean;
  helpIcon?: ReactNode;
  helperText?: string;
  error?: boolean;
  width?: string | number;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, style, label, required, helpIcon, helperText, error, width = "200px", value, onChange, ...props }, ref) => {
    return (
      <div className={styles.container} style={{ width }}>
        {label && (
          <div className={styles.labelContainer}>
            <label className={styles.label}>
              {label}
            </label>
            {!required && <span className={styles.optional}>(optional)</span>}
            {helpIcon && <span className={styles.helpIcon}>{helpIcon}</span>}
          </div>
        )}
        <textarea
          className={cx(textArea({ error }), className)}
          ref={ref}
          value={value}
          onChange={onChange}
          {...props}
        />
        {helperText && <span className={styles.helperText}>{helperText}</span>}
      </div>
    );
  }
);

TextArea.displayName = "TextArea";

export { TextArea };
