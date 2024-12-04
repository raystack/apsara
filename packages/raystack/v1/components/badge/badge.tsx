import { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";

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
    },
    defaultVariants: {
      variant: "accent",
      size: "regular"
    }
  },
});

type BadgeProps = VariantProps<typeof badge> & {
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  screenReaderText?: string;
}

export const Badge = ({ 
  variant = 'accent',
  size = 'regular',
  icon,
  children,
  className,
  screenReaderText
}: BadgeProps) => {
  return (
    <span className={badge({ variant, size, className })}>
      {icon && <span className={styles['icon']}>{icon}</span>}
      {screenReaderText && (
        <span className={styles['sr-only']}>{screenReaderText}</span>
      )}
      {children}
    </span>
  );
};

Badge.displayName = "Badge";
