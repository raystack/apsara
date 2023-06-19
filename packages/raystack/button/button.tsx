import { cva, type VariantProps } from "class-variance-authority";
import { ButtonHTMLAttributes, PropsWithChildren } from "react";

import styles from "./button.module.css";

const button = cva(styles.button, {
  variants: {
    variant: {
      primary: styles["button-primary"],
      outline: styles["button-outline"],
      secondary: styles["button-secondary"],
      ghost: styles["button-ghost"],
      danger: styles["button-danger"],
    },
    size: {
      small: styles["button-small"],
      medium: styles["button-medium"],
      large: styles["button-large"],
    },
  },
});

type ButtonProps = PropsWithChildren<VariantProps<typeof button>> &
  ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  children,
  variant,
  size,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={button({ variant, size, className })}
      {...props}
    >
      {children}
    </button>
  );
}
