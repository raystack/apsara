import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { cva, VariantProps } from "class-variance-authority";
import clsx from 'clsx';
import { ComponentPropsWithoutRef, ComponentRef } from "react";

import styles from "./checkbox.module.css";


const CheckMarkIcon = () => (
    <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    className={styles.icon}
    >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.9005 4.9671C12.0894 4.6782 12.0083 4.29086 11.7194 4.10197C11.4305 3.91307 11.0432 3.99414 10.8543 4.28304L7.15577 9.93961L5.04542 8.02112C4.79001 7.78893 4.39473 7.80775 4.16254 8.06316C3.93035 8.31857 3.94917 8.71385 4.20458 8.94605L6.85731 11.3576C6.99274 11.4807 7.17532 11.5383 7.35686 11.5151C7.53841 11.492 7.70068 11.3904 7.80084 11.2372L11.9005 4.9671Z"
      fill="currentColor"
      />
  </svg>
);

const IndeterminateIcon = () => (
    <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    className={styles.icon}
    >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.5 8.5H4.5C4.22386 8.5 4 8.27614 4 8C4 7.72386 4.22386 7.5 4.5 7.5H11.5C11.7761 7.5 12 7.72386 12 8C12 8.27614 11.7761 8.5 11.5 8.5Z"
      fill="currentColor"
      />
  </svg>
);

const checkbox = cva(styles.checkbox);

type CheckboxVariants = VariantProps<typeof checkbox>;
type CheckedState = boolean | 'indeterminate';

export interface CheckboxProps
  extends Omit<ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>, keyof CheckboxVariants>,
    CheckboxVariants {
  checked?: CheckedState;
  defaultChecked?: CheckedState;
  onCheckedChange?: (checked: CheckedState) => void;
}

export const Checkbox = ({ 
  className, 
  disabled, 
  checked, 
  defaultChecked, 
  onCheckedChange, 
  ref, 
  ...props 
}: CheckboxProps & { ref?: React.Ref<ComponentRef<typeof CheckboxPrimitive.Root>> }) => {
  const isIndeterminate = checked === 'indeterminate' || defaultChecked === 'indeterminate';
  
  return (
    <CheckboxPrimitive.Root
      className={checkbox({ 
        className: clsx(className, {
          [styles["checkbox-disabled"]]: disabled,
          [styles["checkbox-indeterminate"]]: isIndeterminate
        })
      })}
      checked={isIndeterminate || (checked === true)}
      defaultChecked={defaultChecked === true}
      onCheckedChange={(value) => {
        if (onCheckedChange) {
          // If it's currently indeterminate, next state will be unchecked
          if (checked === 'indeterminate') {
            onCheckedChange(false);
          } else {
            onCheckedChange(value);
          }
        }
      }}
      disabled={disabled}
      ref={ref}
      {...props}
    >
      <CheckboxPrimitive.Indicator className={styles.indicator}>
        {isIndeterminate ? <IndeterminateIcon /> : <CheckMarkIcon />}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
};

Checkbox.displayName = "Checkbox";