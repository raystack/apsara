import { cva, type VariantProps } from "class-variance-authority";
import { ReactNode } from "react";

import styles from "./chip.module.css";

const chip = cva(styles['chip'], {
  variants: {
    variant: {
      outline: styles["chip-variant-outline"],
      filled: styles["chip-variant-filled"],
    },
    size: {
      large: styles["chip-size-large"],
      small: styles["chip-size-small"],
    },
    style: {
      neutral: styles["chip-style-neutral"],
      accent: styles["chip-style-accent"],
    },
    defaultVariants: {
      variant: "accent",
      size: "small",
      style: "neutral"
    }
  },
});

type ChipProps = VariantProps<typeof chip> & {
  trailingIcon?: ReactNode;
  leadingIcon?: ReactNode;
  dismiss?: boolean;
  children: ReactNode;
  className?: string;
}

export const Chip = ({ 
  variant,
  size,
  trailingIcon,
  leadingIcon,
  children,
  className
}: ChipProps) => {
  return (
    <span className={chip({ variant, size, className })}>
      {leadingIcon && <span className={styles['leading-icon']}>{leadingIcon}</span>}
      {children}
      {trailingIcon && <span className={styles['trailing-icon']}>{trailingIcon}</span>}
    </span>
  );
};

Chip.displayName = "Chip";