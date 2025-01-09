import { cva, VariantProps } from "class-variance-authority";
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react";

import styles from './sidepanel.module.css';

const sidepanel = cva(styles.sidepanel, {
  variants: {
    
  },
  defaultVariants: {
   
  },
});

export interface SpinnerProps
  extends ComponentPropsWithoutRef<"div">,
    VariantProps<typeof sidepanel> {
}

export const Sidepanel = forwardRef<ElementRef<"div">, SpinnerProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={sidepanel({ className })}
      {...props}
    >
      {[...Array(8)].map((_, index) => (
        <div key={index} className={styles.pole} />
      ))}
    </div>
  )
);

Sidepanel.displayName = 'Sidepanel';
