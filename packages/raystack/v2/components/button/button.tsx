import { ButtonHTMLAttributes, forwardRef, PropsWithChildren, ReactNode } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Spinner } from "~/spinner";

import styles from "./button.module.css";

const button = cva(styles['button'], {
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

const getLoaderOnlyClass = (size: 'small' | 'normal' | null) => 
  size === 'small' ? styles['loader-only-button-small'] : styles['loader-only-button-normal']

type ButtonProps = PropsWithChildren<VariantProps<typeof button>> &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    asChild?: boolean;
    loading?: boolean;
    loaderText?: ReactNode;
    leadingIcon?: ReactNode;
    trailingIcon?: ReactNode;
    width?: string | number
  };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'normal', asChild = false, disabled, loading, loaderText, leadingIcon, trailingIcon, width, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    const isLoaderOnly = loading && !loaderText;
    const widthStyle = width ? { width } : {};

    const spinnerColor = variant === 'primary' || variant === 'danger' ? 'inverted' : 'default';

    return (
      <Comp
        className={`${button({ variant, size, disabled, loading, className })} ${isLoaderOnly ? getLoaderOnlyClass(size) : ''}`}
        ref={ref}
        disabled={disabled}
        style={ widthStyle }
        {...props}
      >
        {loading ? (
          <>
            <Spinner size={1} color={spinnerColor} />
            {loaderText && <span className={styles['loader-text']}>{loaderText}</span>}
          </>
        ) : (
          <>
            {leadingIcon && <span className={`${styles['icon']} ${styles['icon-leading']}`}>{leadingIcon}</span>}
            {children}
            {trailingIcon && <span className={`${styles['icon']} ${styles['icon-trailing']}`}>{trailingIcon}</span>}
          </>
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";
