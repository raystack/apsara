import { cva, VariantProps } from "class-variance-authority";
import { HTMLAttributes, PropsWithChildren } from "react";
import styles from "./box.module.css";

const box = cva(styles.box);

type BoxProps = PropsWithChildren<VariantProps<typeof box>> &
  HTMLAttributes<HTMLElement>;

export function Box({ children, className, ...props }: BoxProps) {
  return (
    <div className={box({ className })} {...props}>
      {children}
    </div>
  );
}
