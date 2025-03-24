import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Tooltip } from "../tooltip";
import { cva, cx } from "class-variance-authority";
import * as React from "react";
import { HTMLAttributes, PropsWithChildren } from "react";
import clsx from "clsx";

import styles from "./text-area.module.css";

const textArea = cva(styles.textarea, {
  variants: {
    error: {
      true: styles.error
    }
  }
});

export interface TextAreaProps extends PropsWithChildren<HTMLAttributes<HTMLTextAreaElement>> {
  label?: string;
  required?: boolean;
  infoTooltip?: string;
  helperText?: string;
  error?: boolean;
  disabled?: boolean;
  width?: string | number;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, style, label, required, infoTooltip, helperText, error, disabled, width = "100%", value, onChange, placeholder, ...props }, ref) => {
    return (
      <div className={styles.container} style={{ width }}>
        {label && (
          <div className={styles.labelContainer}>
            <label className={clsx(styles.label, disabled && styles.labelDisabled)}>
              {label}
              {!required && <span className={styles.optional}>(optional)</span>}
            </label>
            {infoTooltip && (
              <Tooltip message={infoTooltip} side="right">
                <span className={styles.helpIcon}>
                  <InfoCircledIcon />
                </span>
              </Tooltip>
            )}
          </div>
        )}
        <textarea
          className={cx(
            textArea({ error }),
            disabled && styles.disabled,
            className
          )}
          ref={ref}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          placeholder={placeholder}
          {...props}
        />
        {helperText && (
          <span 
            className={clsx(
              styles.helperText, 
              error && styles.helperTextError,
              disabled && styles.helperTextDisabled
            )}
          >
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

TextArea.displayName = "TextArea";

export { TextArea };
