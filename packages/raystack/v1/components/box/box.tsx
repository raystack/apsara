import { cva, VariantProps } from "class-variance-authority";
import { HTMLAttributes, PropsWithChildren, forwardRef } from "react";

import styles from "./box.module.css";

// Note: This is the old component just copied in v1 folder as it is used in v1. 

const box = cva(styles.box);

type BoxProps = PropsWithChildren<VariantProps<typeof box>> &
  HTMLAttributes<HTMLDivElement> & {
    ref?: React.RefObject<HTMLDivElement>;
  };

export function Box({ children, className, ref, ...props }: BoxProps) {
  return (
    <div ref={ref} className={box({ className })} {...props}>
      {children}
    </div>
  );
}

Box.displayName = "Box";
