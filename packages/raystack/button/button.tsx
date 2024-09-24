import { Slot } from "@radix-ui/react-slot";

import { cva, type VariantProps } from "class-variance-authority";
import { ButtonHTMLAttributes, forwardRef, PropsWithChildren, ReactNode } from "react";

import styles from "./button.module.css";

const button = cva(styles.button, {
  variants: {
    variant: {
      primary: styles["button-primary"],
      secondary: styles["button-secondary"],
      outline: styles["button-outline"],
      ghost: styles["button-ghost"],
      danger: styles["button-danger"],
      text: styles["button-text"]
    },
    size: {
      small: styles["button-small"],
      normal: styles["button-normal"],
    },
    disabled: {
      true: styles["button-disabled"],
    },
    loading: {
      true: styles["button-loading"],
    }
  },
});

type ButtonProps = PropsWithChildren<VariantProps<typeof button>> &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    asChild?: boolean;
    loading?: boolean;
    loaderText?: ReactNode;
  };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, disabled, loading, loaderText, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={button({ variant, size, disabled, loading, className })}
        ref={ref}
        disabled={disabled}
        {...props}
      >
        {loading ? (
          <>
            <span className={styles.loader}></span>
            {loaderText && <span className={styles.loaderText}>{loaderText}</span>}
          </>
        ) : (
          children
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";
