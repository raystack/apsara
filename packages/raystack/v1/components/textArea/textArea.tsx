import * as React from "react";
import { HTMLAttributes, PropsWithChildren, ReactNode } from "react";
import { VariantProps, cva, cx } from "class-variance-authority";

import styles from "./textarea.module.css";

const textarea = cva(styles.textarea);

export interface TextareaProps extends PropsWithChildren<VariantProps<typeof textarea>>, 
  HTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  required?: boolean;
  helpIcon?: ReactNode;
  helperText?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, style, label, required, helpIcon, helperText, ...props }, ref) => {
    return (
      <div className={styles.container}>
        {label && (
          <div className={styles.labelContainer}>
            <label className={styles.label}>
              {label}
              {helpIcon && <span className={styles.helpIcon}>{helpIcon}</span>}
            </label>
            {!required && <span className={styles.optional}>(optional)</span>}
          </div>
        )}
        <textarea
          className={cx(textarea(), className)}
          ref={ref}
          {...props}
        />
        {helperText && <span className={styles.helperText}>{helperText}</span>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
