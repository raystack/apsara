import * as React from "react";
import { HTMLAttributes, PropsWithChildren, ReactNode } from "react";
import { VariantProps, cva, cx } from "class-variance-authority";

import styles from "./textArea.module.css";

const textArea = cva(styles.textArea, {
  variants: {
    size: {
      small: styles["textfield-sm"],
      medium: styles["textfield-md"],
    },

    state: {
      invalid: styles["textfield-invalid"],
      valid: styles["textfield-valid"],
    },

    leading: {
      true: styles["textfield-leading"],
    },
  },
  defaultVariants: {
    size: "small",
  },
});

export interface TextAreaProps extends PropsWithChildren<VariantProps<typeof textArea>>, 
  HTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  required?: boolean;
  helpIcon?: ReactNode;
  helperText?: string;
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, size, state, style, leading, label, required, helpIcon, helperText, ...props }, ref) => {
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
          className={cx(textArea({ size, state, className, leading }))}
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
