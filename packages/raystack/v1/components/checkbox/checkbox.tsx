import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import { ComponentPropsWithoutRef, ComponentRef } from "react";

import styles from "./checkbox.module.css";

export interface CheckboxProps extends ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  label?: string;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
}

export const Checkbox = ({ 
  className, 
  label, 
  error, 
  helperText, 
  disabled,
  ref,
  ...props 
}: CheckboxProps & { ref?: React.Ref<ComponentRef<typeof CheckboxPrimitive.Root>> }) => {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <CheckboxPrimitive.Root
          ref={ref}
          className={styles.checkbox}
          disabled={disabled}
          {...props}
        >
          <CheckboxPrimitive.Indicator className={styles.indicator}>
            <CheckIcon className={styles.icon} />
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
        {label && (
          <label className={styles.label} data-disabled={disabled}>
            {label}
          </label>
        )}
      </div>
      {helperText && (
        <span className={`${styles.helperText} ${error ? styles.error : ''}`} data-disabled={disabled}>
          {helperText}
        </span>
      )}
    </div>
  );
};

Checkbox.displayName = "Checkbox";