import { ButtonHTMLAttributes, forwardRef, PropsWithChildren, ReactNode } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

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

const supportingIcon = cva(styles.icon, {
  variants: {
    iconPosition: {
      leading: styles["icon-leading"],
      trailing: styles["icon-trailing"],
    }
  }
})

const getLoaderOnlyClass = (size: 'small' | 'normal' | null) => 
  size === 'small' ? styles.loaderOnlyButtonSmall : styles.loaderOnlyButtonNormal

type ButtonProps = PropsWithChildren<VariantProps<typeof button>> &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    asChild?: boolean;
    loading?: boolean;
    loaderText?: ReactNode;
    icon?: ReactNode;
    iconPosition?: 'leading' | 'trailing';
  };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'normal', asChild = false, disabled, loading, loaderText, icon, iconPosition = 'leading', children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    const isLoaderOnly = loading && !loaderText;
    return (
      <Comp
        className={`${button({ variant, size, disabled, loading, className })} ${isLoaderOnly ? getLoaderOnlyClass(size) : ''}`}
        ref={ref}
        disabled={disabled}
        {...props}
      >
        {loading ? (
          <>
            {/* TODO: Replace this after Spinner component is built. */}
            <span className={styles.loader}></span>
            {loaderText && <span className={styles.loaderText}>{loaderText}</span>}
          </>
        ) : (
          <>
            {icon && iconPosition === 'leading' && <span className={supportingIcon({ iconPosition })}>{icon}</span>}
            {children}
            {icon && iconPosition === 'trailing' && <span className={supportingIcon({ iconPosition })}>{icon}</span>}
          </>
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";
