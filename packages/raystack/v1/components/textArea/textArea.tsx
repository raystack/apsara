import * as React from "react";
import { HTMLAttributes, PropsWithChildren } from "react";
import { VariantProps, cva, cx } from "class-variance-authority";
import { InfoCircledIcon } from "@radix-ui/react-icons";

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
  isOptional?: boolean;
  // tooltip?: string;
  helperText?: string;
  error?: boolean;
  width?: string | number;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, style, label, isOptional, helperText, error, width = "200px", value, onChange, ...props }, ref) => {
    return (
      <div className={styles.container} style={{ width }}>
        {label && (
          <div className={styles.labelContainer}>
            <label className={styles.label}>
              {label}
            </label>
            {isOptional && <span className={styles.optional}>(optional)</span>}
            {/* {tooltip && <span className={styles.helpIcon}><InfoCircledIcon /></span>} */}
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
