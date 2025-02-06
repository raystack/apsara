import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes, PropsWithChildren } from "react";
import styles from "./label.module.css";

const label = cva(styles.label, {
  variants: {
    size: {
      small: styles["label-small"],
      medium: styles["label-medium"],
      large: styles["label-large"],
    },
    required: {
      true: styles["label-required"],
    }
  },
  defaultVariants: {
    size: "small",
    required: false,
  },
});

interface LabelProps extends PropsWithChildren<VariantProps<typeof label>>, 
  Omit<HTMLAttributes<HTMLLabelElement>, 'required'> {
  /**
   * When true, shows a required indicator
   */
  required?: boolean;
  /**
   * Custom required indicator text
   * @default "*"
   */
  requiredIndicator?: string;
  /**
   * ID of the form control this label is bound to
   */
  htmlFor?: string;
}

export function Label({ 
  children, 
  className, 
  size, 
  required, 
  requiredIndicator = "*",
  htmlFor,
  ...props 
}: LabelProps) {
  return (
    <label
      className={label({ size, required, className })}
      htmlFor={htmlFor}
      {...props}
    >
      {children}
      {required && (
        <span 
          className={styles["required-indicator"]} 
          aria-hidden="true"
          role="presentation"
        >
          {requiredIndicator}
        </span>
      )}
    </label>
  );
}

export type { LabelProps }; 