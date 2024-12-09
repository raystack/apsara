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
            <path fill-rule="evenodd" clip-rule="evenodd" d="M9.5066 3.3066C9.73115 3.08205 9.73115 2.71798 9.5066 2.49343C9.28205 2.26887 8.91798 2.26887 8.69343 2.49343L6.00001 5.18684L3.3066 2.49343C3.08205 2.26887 2.71798 2.26887 2.49343 2.49343C2.26887 2.71798 2.26887 3.08205 2.49343 3.3066L5.18684 6.00001L2.49343 8.69343C2.26887 8.91798 2.26887 9.28205 2.49343 9.5066C2.71798 9.73115 3.08205 9.73115 3.3066 9.5066L6.00001 6.81318L8.69343 9.5066C8.91798 9.73115 9.28205 9.73115 9.5066 9.5066C9.73115 9.28205 9.73115 8.91798 9.5066 8.69343L6.81318 6.00001L9.5066 3.3066Z" fill="currentColor"/>
          </svg>
        </button>
      ) : trailingIcon ? (
        <span className={styles['trailing-icon']}>{trailingIcon}</span>
      ) : null}
    </span>
  );
};

Chip.displayName = "Chip";