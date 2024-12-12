import * as React from "react";
import { HTMLAttributes, PropsWithChildren } from "react";
import { VariantProps, cva, cx } from "class-variance-authority";

import styles from "./textarea.module.css";

const textarea = cva(styles.textarea, {
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
export type TextareaProps = PropsWithChildren<VariantProps<typeof textarea>> &
  HTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, size, state, style, leading, ...props }, ref) => {
    return (
      <textarea
        className={cx(textarea({ size, state, className, leading }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
