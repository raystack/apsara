import * as React from "react";
import { HTMLAttributes, PropsWithChildren, ReactNode } from "react";
import { VariantProps, cva, cx } from "class-variance-authority";

import styles from "./textarea.module.css";

const textArea = cva(styles.textarea);

export interface TextAreaProps extends PropsWithChildren<VariantProps<typeof textArea>>, 
  HTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  required?: boolean;
  helpIcon?: ReactNode;
  helperText?: string;
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, style, label, required, helpIcon, helperText, ...props }, ref) => {
    return (
      <div className={styles.container}>
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
          className={cx(textArea(), className)}
          ref={ref}
          {...props}
        />
        {helperText && <span className={styles.helperText}>{helperText}</span>}
      </div>
    );
  }
);

TextArea.displayName = "TextArea";

export { TextArea };
