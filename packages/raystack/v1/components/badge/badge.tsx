import { cva, type VariantProps } from "class-variance-authority";
import { ComponentPropsWithoutRef, ComponentRef, ReactNode } from "react";

import styles from "./badge.module.css";

const badge = cva(styles['badge'], {
  variants: {
    variant: {
      accent: styles["badge-accent"],
      warning: styles["badge-warning"],
      danger: styles["badge-danger"],
      success: styles["badge-success"],
      neutral: styles["badge-neutral"],
      gradient: styles["badge-gradient"]
    },
    size: {
      micro: styles["badge-micro"],
      small: styles["badge-small"],
      regular: styles["badge-regular"],
    }
  },
  defaultVariants: {
    variant: "accent",
    size: "small",
  },
});

export interface BadgeProps
  extends ComponentPropsWithoutRef<"span">,
    VariantProps<typeof badge> {
  icon?: ReactNode;
  screenReaderText?: string;
}

export const Badge = ({ 
  className, 
  icon, 
  children, 
  variant, 
  size, 
  screenReaderText, 
  ref, 
  ...props 
}: BadgeProps & { ref?: React.Ref<ComponentRef<"span">> }) => (
  <span ref={ref} className={badge({ variant, size, className })} {...props}>
    {icon && <span className={styles['icon']}>{icon}</span>}
    {screenReaderText && <span className={styles['sr-only']}>{screenReaderText}</span>}
    {children}
  </span>
);

Badge.displayName = 'Badge';
