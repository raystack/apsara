import { cva, type VariantProps } from "class-variance-authority";
import { ReactNode } from "react";

import styles from "./chip.module.css";

const chip = cva(styles.chip, {
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
  },
  defaultVariants: {
    variant: "outline",
    size: "small",
    style: "neutral"
  },
});

type ChipProps = VariantProps<typeof chip> & {
  trailingIcon?: ReactNode;
  leadingIcon?: ReactNode;
  isDismissible?: boolean;
  children: ReactNode;
  className?: string;
  onDismiss?: () => void;
}

export const Chip = ({ 
  variant,
  size,
  style,
  trailingIcon,
  leadingIcon,
  isDismissible,
  children,
  className,
  onDismiss
}: ChipProps) => {
  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDismiss?.();
  };

  return (
    <span className={chip({ variant, size, style, className })}>
      {leadingIcon && <span className={styles['leading-icon']}>{leadingIcon}</span>}
      {children}
      {isDismissible ? (
        <button onClick={handleDismiss} className={styles['dismiss-button']}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 3L3 9M3 3L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      ) : trailingIcon ? (
        <span className={styles['trailing-icon']}>{trailingIcon}</span>
      ) : null}
    </span>
  );
};

Chip.displayName = "Chip";