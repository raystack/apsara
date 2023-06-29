import { Slot } from "@radix-ui/react-slot";

import { cva, type VariantProps } from "class-variance-authority";
import { ButtonHTMLAttributes, forwardRef, PropsWithChildren } from "react";

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
  ButtonHTMLAttributes<HTMLButtonElement> & {
    asChild?: boolean;
  };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={button({ variant, size, className })}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
