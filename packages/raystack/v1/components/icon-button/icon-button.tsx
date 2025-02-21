import { cva, VariantProps } from "class-variance-authority";
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react";

import styles from './icon-button.module.css';

const iconButton = cva(styles.iconButton, {
  variants: {
    size: {
      1: styles["iconButton-size-1"],
      2: styles["iconButton-size-2"],
      3: styles["iconButton-size-3"],
      4: styles["iconButton-size-4"],
    }
  },
  defaultVariants: {
    size: 2,
  },
});

export interface IconButtonProps
  extends ComponentPropsWithoutRef<"button">,
    VariantProps<typeof iconButton> {
  size?: 1 | 2 | 3 | 4;
  'aria-label'?: string;
  style?: React.CSSProperties;
}

export const IconButton = forwardRef<ElementRef<"button">, IconButtonProps>(
  ({ 
    className, 
    size, 
    disabled, 
    children, 
    'aria-label': ariaLabel,
    style,
    ...props 
  }, ref) => (
    <button
      ref={ref}
      className={iconButton({ size, className })}
      disabled={disabled}
      type="button"
      aria-label={ariaLabel}
      aria-disabled={disabled}
      style={style}
      {...props}
    >
      <div aria-hidden="true">
        {children}
      </div>
    </button>
  )
);

IconButton.displayName = 'IconButton';
