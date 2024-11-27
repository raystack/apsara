import { cva, VariantProps } from "class-variance-authority";
import { HTMLAttributes, PropsWithChildren } from "react";

import styles from "./box.module.css";

// Note: This is the old component just copied in v1 folder as it is used in v1. 
// TODO: Remove this component and use the new one from @raystack/apsara/v1
const box = cva(styles.box);

type BoxProps = PropsWithChildren<VariantProps<typeof box>> &
  HTMLAttributes<HTMLDivElement>;

export function Box({ children, className, ...props }: BoxProps) {
  return (
    <div className={box({ className })} {...props}>
      {children}
    </div>
  );
}
